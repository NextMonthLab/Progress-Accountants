import { Express, Request, Response, NextFunction } from "express";
import { pageBuilderController } from "./pageBuilderController";

// Simple authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

export function registerPageBuilderRoutes(app: Express) {
  // Status and initialization
  app.get("/api/page-builder/status", isAuthenticated, pageBuilderController.checkStatus);
  app.post("/api/page-builder/initialize", isAuthenticated, pageBuilderController.initializeTables);
  
  // Page CRUD routes
  app.get("/api/page-builder/pages", isAuthenticated, pageBuilderController.getAllPages);
  app.get("/api/page-builder/pages/:id", isAuthenticated, pageBuilderController.getPageById);
  app.post("/api/page-builder/pages", isAuthenticated, pageBuilderController.createPage);
  app.patch("/api/page-builder/pages/:id", isAuthenticated, pageBuilderController.updatePage);
  app.delete("/api/page-builder/pages/:id", isAuthenticated, pageBuilderController.deletePage);
  
  // Template routes
  app.get("/api/page-builder/templates", isAuthenticated, pageBuilderController.getTemplates);
  
  // Starter Site Tier System routes
  app.post("/api/page-builder/pages/:id/clone", isAuthenticated, pageBuilderController.clonePage);
  app.get("/api/page-builder/tenant-starter", isAuthenticated, pageBuilderController.getTenantStarterType);
  
  console.log("[PageBuilder] Routes registered");
}