import { Request, Response, NextFunction } from "express";

// Role-based access control middleware

// Define the user roles 
// Imported from shared schema to ensure consistency
import { UserRole } from "@shared/schema";

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required"
    });
  }
  
  return next();
};

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  super_admin: [
    'manage_tenants',
    'manage_system',
    'view_system_logs',
    'manage_users',
    'manage_blueprints',
    'manage_seo',
    'manage_brand',
    'manage_pages',
    'manage_tools',
    'export_data',
    'import_data',
    'view_all_data',
    'access_admin_dashboard'
  ],
  admin: [
    'manage_users',
    'manage_blueprints',
    'manage_seo',
    'manage_brand',
    'manage_pages',
    'manage_tools',
    'view_analytics',
    'access_admin_dashboard'
  ],
  editor: [
    'edit_pages',
    'edit_content',
    'view_analytics',
    'use_tools',
    'access_admin_dashboard'
  ],
  client: [
    'view_public_content',
    'access_client_dashboard',
    'view_own_data',
    'submit_requests',
    'use_client_tools'
  ]
};

// Check if a user has a specific permission
export function hasPermission(user: any, permission: string): boolean {
  if (!user) return false;
  
  // Super admins have all permissions
  if (user.isSuperAdmin) return true;
  
  // Get permissions for the user's role
  const userRole = user.userType as UserRole || 'client';
  const permissions = rolePermissions[userRole] || [];
  
  return permissions.includes(permission);
}

// Middleware to require a specific permission
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required"
      });
    }
    
    if (hasPermission(req.user, permission)) {
      return next();
    }
    
    return res.status(403).json({
      error: "Forbidden",
      message: `Permission '${permission}' required`
    });
  };
}

// Middleware to require super admin role
export function requireSuperAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required"
      });
    }
    
    if (req.user.isSuperAdmin) {
      return next();
    }
    
    return res.status(403).json({
      error: "Forbidden",
      message: "Super Admin role required"
    });
  };
}

// Middleware to require specific role
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required"
      });
    }
    
    // Super admins can access everything
    if (req.user.isSuperAdmin) {
      return next();
    }
    
    const userRole = req.user.userType as UserRole || 'client';
    
    // Check if user has the required role
    if (userRole === role) {
      return next();
    }
    
    return res.status(403).json({
      error: "Forbidden",
      message: `Role '${role}' required`
    });
  };
}

// Middleware to ensure tenant context is set
export function requireTenantContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required"
      });
    }
    
    // Super admins can switch tenants, so check session
    if (req.user.isSuperAdmin && req.session?.currentTenantId) {
      return next();
    }
    
    // Regular users must have a tenant ID
    if (req.user.tenantId) {
      return next();
    }
    
    return res.status(400).json({
      error: "Bad Request",
      message: "No tenant context found"
    });
  };
}