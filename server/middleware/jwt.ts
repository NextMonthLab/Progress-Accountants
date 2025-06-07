import { Request, Response, NextFunction } from "express";
import { simpleStorage } from "../simpleStorage";
import jwt from "jsonwebtoken";
import { User, UserRole } from "@shared/schema";

// Augment the Express.User interface to include our custom fields
declare global {
  namespace Express {
    interface AuthenticatedRequest extends Request {
      isAuthenticated(): boolean;
    }
  }
}

// JWT secret key - should be in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || "progress-accountants-jwt-secret-key";
const JWT_EXPIRES_IN = "1d"; // Token expiration

interface JwtPayload {
  userId: number;
  tenantId: string; // MANDATORY - all data must be scoped to tenantId
  username: string;
  role: "admin" | "editor" | "insightUser" | "labUser" | "devUser";
  email?: string;
  isSuperAdmin?: boolean;
  iat: number;
  exp: number;
  expiresAt: number;
}

/**
 * Generate a JWT token for a user following Master Unified Architecture
 */
export function generateToken(user: User): string {
  // Calculate expiration timestamp
  const now = Math.floor(Date.now() / 1000);
  const expirySeconds = 60 * 60 * 24; // 1 day in seconds
  const expiresAt = now + expirySeconds;
  
  // MANDATORY: All JWT tokens must include tenantId
  if (!user.tenantId) {
    throw new Error("Cannot generate token: user must have tenantId");
  }
  
  // Map userType to unified role system
  const roleMapping: Record<string, string> = {
    'admin': 'admin',
    'editor': 'editor', 
    'super_admin': 'admin',
    'public': 'editor'
  };
  
  const payload = {
    userId: user.id,
    tenantId: user.tenantId, // MANDATORY for all data scoping
    username: user.username,
    role: roleMapping[user.userType] || 'editor',
    email: user.email,
    isSuperAdmin: user.isSuperAdmin || false,
    expiresAt
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

/**
 * Middleware to authenticate via JWT
 */
export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // No token, proceed unauthenticated
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return next(); // Invalid token, proceed unauthenticated
  }

  // Look up the user in the database
  simpleStorage.getUser(payload.userId)
    .then(user => {
      if (user) {
        // Populate req.user for passport compatibility
        req.user = user;
        // Store the original function if it exists
        const originalIsAuthenticated = req.isAuthenticated;
        
        // Define a new isAuthenticated function that always returns true
        (req as any).isAuthenticated = function(): boolean {
          return true;
        };
      }
      next();
    })
    .catch(err => {
      console.error("Error retrieving user:", err);
      next();
    });
}

/**
 * Handle SSO token validation and user lookup
 * This will be expanded when integrating with external identity provider
 */
export async function handleSsoAuth(token: string): Promise<User | null> {
  try {
    // Placeholder for SSO token validation logic
    // In a real implementation, this would validate with an identity provider
    const payload = verifyToken(token);
    
    if (!payload) {
      return null;
    }
    
    // Look up user by ID from the token
    const user = await simpleStorage.getUser(payload.userId);
    return user || null;
  } catch (error) {
    console.error("SSO authentication error:", error);
    return null;
  }
}

/**
 * Extract tenant ID from request
 * First checks JWT token, then falls back to req.user
 * Returns a default tenant ID if none is found
 */
export function extractTenantId(req: Request): string {
  // Try to get from JWT
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    
    if (payload && payload.tenantId) {
      return payload.tenantId;
    }
  }
  
  // Fall back to req.user
  if (req.user && (req.user as any).tenantId) {
    return (req.user as any).tenantId;
  }
  
  // Default tenant ID for development purposes
  // This allows the page builder to work without authentication during development
  return "default-tenant";
}

/**
 * Get JWT payload from request
 */
export function getJwtPayload(req: Request): JwtPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}