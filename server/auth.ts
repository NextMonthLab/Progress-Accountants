import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { simpleStorage } from "./simpleStorage";
import { User, UserRole } from "@shared/schema";
import { authenticateJwt, generateToken, handleSsoAuth } from "./middleware/jwt";
import { requireRoles, requireTenant, requireSuperAdmin, requireAdmin, requireEditor } from "./middleware/rbac";

// Define how the User type extends Express.User
declare global {
  namespace Express {
    interface User extends User {}
  }
}

// Create a Promise-based version of scrypt
const scryptAsync = promisify(scrypt);

/**
 * Hash a password for storing
 */
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Verify a password against a stored hash
 */
export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Setup authentication for the Express app
 */
export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "progress-accountants-secret-key",
    resave: false,
    saveUninitialized: false,
    store: simpleStorage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  
  // Setup JWT authentication for API access
  app.use(authenticateJwt);
  
  // Setup regular session auth
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy for username/password authentication with tenant awareness
  passport.use(
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true // This allows us to access the request object
    }, async (req, username, password, done) => {
      try {
        let user;
        
        // If tenant login is requested, check username uniqueness within that tenant
        if (req.body.tenantId) {
          user = await simpleStorage.getUserByUsername(username, req.body.tenantId);
        } else {
          // Regular global login (for system admins)
          user = await simpleStorage.getUserByUsername(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Configure session serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await simpleStorage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, tenantId, userType = 'public' } = req.body;
      
      // Validate user role
      if (!['super_admin', 'admin', 'editor', 'public'].includes(userType)) {
        return res.status(400).json({
          error: "Invalid user role",
          code: "invalid_role"
        });
      }

      // Check if the user creating a privileged role has the necessary permissions
      if ((userType === 'super_admin' || userType === 'admin') && req.user) {
        if (!(req.user.isSuperAdmin || req.user.userType === 'super_admin')) {
          return res.status(403).json({
            error: "You don't have permission to create users with this role",
            code: "insufficient_permissions"
          });
        }
      }

      // Handle tenant-scoped username uniqueness
      if (tenantId) {
        // For tenant-scoped users, check uniqueness within that tenant
        const existingUser = await simpleStorage.getUserByUsername(username, tenantId);
        if (existingUser) {
          return res.status(400).json({ 
            error: "Username already exists within this organization" 
          });
        }
      } else {
        // For non-tenant users (system admins), check global uniqueness
        const existingUser = await simpleStorage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ 
            error: "Username already exists" 
          });
        }
      }

      // Create new user with hashed password
      const user = await simpleStorage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Log the user in after registration
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Generate a JWT token for the newly registered user
        const token = generateToken(user);
        
        // Determine redirect path based on role
        const redirectPath = getRedirectPathForRole(
          user.userType as UserRole, 
          user.isSuperAdmin || false
        );
        
        return res.status(201).json({
          user,
          token,
          redirectPath
        });
      });
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof Error && err.message.includes("exists")) {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: User, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ 
          error: "We couldn't sign you in with those credentials. Please check your username and password and try again.",
          title: "Sign In Unsuccessful",
          code: "invalid_credentials" 
        });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Generate a JWT token
        const token = generateToken(user);
        
        // Determine redirect path based on role
        const redirectPath = getRedirectPathForRole(
          user.userType as UserRole, 
          user.isSuperAdmin || false
        );
        
        return res.json({
          user,
          token,
          redirectPath
        });
      });
    })(req, res, next);
  });

  // SSO login route
  app.post("/api/sso/login", async (req, res, next) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ 
          error: "SSO token is required", 
          code: "token_required" 
        });
      }
      
      const user = await handleSsoAuth(token);
      
      if (!user) {
        return res.status(401).json({ 
          error: "Invalid or expired SSO token", 
          code: "invalid_token" 
        });
      }
      
      // Log the user in via the session
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Generate a JWT token
        const newToken = generateToken(user);
        
        // Determine redirect path based on role
        const redirectPath = getRedirectPathForRole(
          user.userType as UserRole, 
          user.isSuperAdmin || false
        );
        
        return res.json({
          user,
          token: newToken,
          redirectPath
        });
      });
    } catch (error) {
      console.error("SSO login error:", error);
      return res.status(500).json({ 
        error: "An error occurred during SSO login", 
        code: "sso_error" 
      });
    }
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    if (req.user) {
      const user = req.user;
      
      req.logout((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(200);
    }
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(req.user);
  });
  
  // Get user role
  app.get("/api/user/role", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const role = req.user.userType;
    const isSuperAdmin = req.user.isSuperAdmin;
    
    res.json({
      role,
      isSuperAdmin,
      permissions: getRolePermissions(role as UserRole, isSuperAdmin)
    });
  });
}

/**
 * Determine redirect path based on user role
 */
export function getRedirectPathForRole(role: UserRole, isSuperAdmin: boolean): string {
  if (isSuperAdmin) {
    return '/super-admin';
  }
  
  switch (role) {
    case 'super_admin':
      return '/super-admin';
    case 'admin':
    case 'editor':
      return '/admin';
    case 'client':
      return '/client-dashboard';
    default:
      return '/';
  }
}

/**
 * Get permissions for a specific role
 */
function getRolePermissions(role: UserRole, isSuperAdmin: boolean) {
  // Base permissions that apply to all authenticated users
  const basePermissions = [
    'view_public_content'
  ];
  
  // Permissions for each role
  const rolePermissions: Record<UserRole, string[]> = {
    'client': [...basePermissions],
    'editor': [
      ...basePermissions,
      'edit_content',
      'view_dashboard',
      'manage_media',
      'edit_pages'
    ],
    'admin': [
      ...basePermissions,
      'edit_content',
      'view_dashboard',
      'manage_media',
      'edit_pages',
      'manage_users',
      'configure_tools',
      'manage_billing',
      'view_analytics'
    ],
    'super_admin': [
      ...basePermissions,
      'edit_content',
      'view_dashboard',
      'manage_media',
      'edit_pages',
      'manage_users',
      'configure_tools',
      'manage_billing',
      'view_analytics',
      'manage_tenants',
      'access_all_data',
      'system_configuration'
    ]
  };
  
  // If user is a super admin, they get all super_admin permissions regardless of role
  if (isSuperAdmin) {
    return rolePermissions['super_admin'];
  }
  
  return rolePermissions[role] || basePermissions;
}