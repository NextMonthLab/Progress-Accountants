import { Request, Response, NextFunction } from "express";
import { UserRole } from "@shared/schema";

// Extend the Express User interface for proper typing
declare global {
  namespace Express {
    // Ensure User interface matches the database schema types
    interface User {
      id: number;
      username: string;
      password: string;
      name: string | null;
      userType: string;
      email: string | null;
      tenantId: string | null;
      isSuperAdmin: boolean | null;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

/**
 * Middleware to check if user has any of the required roles
 * @param roles - Array of allowed roles for the route
 */
export function requireRoles(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // First verify the user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "auth_required"
      });
    }

    // Check if user has any of the required roles
    const userRole = req.user.userType as UserRole;
    
    // Super admin always has access to everything
    if (req.user.isSuperAdmin === true) {
      return next();
    }

    // Check if user has one of the required roles
    if (roles.includes(userRole)) {
      return next();
    }

    // If we get here, the user doesn't have an appropriate role
    return res.status(403).json({ 
      error: "Insufficient permissions",
      code: "insufficient_permissions"
    });
  };
}

/**
 * Middleware to check if user belongs to the specified tenant
 * @param tenantIdField - Request path to the tenant ID (e.g., 'params.tenantId', 'body.tenantId')
 */
export function requireTenant(tenantIdField: string = 'params.tenantId') {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated first
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "auth_required"
      });
    }

    // Allow super admins to access any tenant data
    if (req.user.isSuperAdmin === true) {
      return next();
    }

    // Extract tenant ID from the request based on the specified path
    const extractTenantId = (obj: any, path: string) => {
      const parts = path.split('.');
      for (let i = 0; i < parts.length; i++) {
        if (obj === undefined || obj === null) return undefined;
        obj = obj[parts[i]];
      }
      return obj;
    };

    const tenantId = extractTenantId(req, tenantIdField);

    // Check if the tenant ID is present in the request
    if (!tenantId) {
      return res.status(400).json({ 
        error: "Tenant ID is required",
        code: "tenant_id_required"
      });
    }

    // Check if the user belongs to the requested tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ 
        error: "Access to this tenant data is not allowed",
        code: "tenant_access_denied"
      });
    }

    // User belongs to the requested tenant, continue
    next();
  };
}

/**
 * Middleware that combines role and tenant checking
 * @param roles - Array of allowed roles
 * @param tenantIdField - Request path to the tenant ID
 */
export function requireRoleAndTenant(roles: UserRole[], tenantIdField: string = 'params.tenantId') {
  return [requireRoles(roles), requireTenant(tenantIdField)];
}

/**
 * Helper to check for Admin or Super Admin access
 */
export function requireAdmin() {
  return requireRoles(['super_admin', 'admin']);
}

/**
 * Helper to check for Editor or higher access
 */
export function requireEditor() {
  return requireRoles(['super_admin', 'admin', 'editor']);
}

/**
 * Middleware to check for Super Admin access only
 */
export function requireSuperAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "auth_required"
      });
    }

    if (req.user.isSuperAdmin !== true) {
      return res.status(403).json({ 
        error: "Super Admin access required",
        code: "super_admin_required"
      });
    }

    next();
  };
}