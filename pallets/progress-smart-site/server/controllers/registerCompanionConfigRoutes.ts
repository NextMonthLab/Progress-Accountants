import { Express } from "express";
import { 
  getCompanionConfig,
  createCompanionConfig, 
  updateCompanionConfig 
} from "./companionConfigController";
import { authenticateJwt } from "../middleware/jwt";

/**
 * Registers all companion configuration API routes
 * @param app Express application instance
 */
export function registerCompanionConfigRoutes(app: Express): void {
  // All companion config routes require authentication
  // Admin-only routes require admin role
  
  // Get companion configuration (admin, editor)
  app.get(
    "/api/companion-config",
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      next();
    },
    (req, res, next) => {
      const userRole = req.user?.userType;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      if (isSuperAdmin || userRole === 'admin' || userRole === 'editor') {
        return next();
      }
      
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin or editor role required"
      });
    },
    getCompanionConfig
  );
  
  // Create companion configuration (admin only)
  app.post(
    "/api/companion-config", 
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      next();
    },
    (req, res, next) => {
      const userRole = req.user?.userType;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      if (isSuperAdmin || userRole === 'admin') {
        return next();
      }
      
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin role required"
      });
    },
    createCompanionConfig
  );
  
  // Update companion configuration (admin only)
  app.put(
    "/api/companion-config",
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      next();
    },
    (req, res, next) => {
      const userRole = req.user?.userType;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      if (isSuperAdmin || userRole === 'admin') {
        return next();
      }
      
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin role required"
      });
    },
    updateCompanionConfig
  );
}