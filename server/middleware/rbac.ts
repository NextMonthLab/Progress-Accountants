import { Request, Response, NextFunction } from "express";

/**
 * Role-Based Access Control Middleware
 * Ensures proper authorization for Admin Panel access
 */

declare global {
  namespace Express {
    interface User {
      id?: number;
      tenantId?: string;
      isSuperAdmin?: boolean;
      isAdmin?: boolean;
      role?: string;
    }
  }
}

/**
 * Middleware to require super admin privileges
 * Used for cross-tenant operations
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "NOT_AUTHENTICATED"
      });
    }

    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ 
        error: "Super admin privileges required",
        code: "INSUFFICIENT_PRIVILEGES"
      });
    }

    next();
  } catch (error) {
    console.error("Super admin check error:", error);
    res.status(500).json({ 
      error: "Internal server error in authorization",
      code: "RBAC_ERROR"
    });
  }
}

/**
 * Middleware to require admin privileges
 * Used for tenant-scoped admin operations
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "NOT_AUTHENTICATED"
      });
    }

    if (!req.user.isAdmin && !req.user.isSuperAdmin) {
      return res.status(403).json({ 
        error: "Admin privileges required",
        code: "INSUFFICIENT_PRIVILEGES"
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ 
      error: "Internal server error in authorization",
      code: "RBAC_ERROR"
    });
  }
}

/**
 * Middleware to check if user has specific role
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: "Authentication required",
          code: "NOT_AUTHENTICATED"
        });
      }

      if (req.user.role !== role && !req.user.isSuperAdmin) {
        return res.status(403).json({ 
          error: `Role '${role}' required`,
          code: "INSUFFICIENT_ROLE"
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ 
        error: "Internal server error in authorization",
        code: "RBAC_ERROR"
      });
    }
  };
}