import { Express, Request, Response, NextFunction } from "express";
import { aiDesignController } from "./aiDesignController";

// Simple authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

export function registerAiDesignRoutes(app: Express) {
  // Status and initialization
  app.post("/api/ai-design/initialize", isAuthenticated, aiDesignController.initializeTables);
  
  // Design suggestions
  app.get("/api/ai-design/suggestions", isAuthenticated, aiDesignController.getDesignSuggestions);
  app.post("/api/ai-design/suggestions/apply", isAuthenticated, aiDesignController.applyDesignSuggestion);
  
  // Component recommendations
  app.post("/api/ai-design/components/recommend", isAuthenticated, aiDesignController.generateComponentRecommendations);
  app.get("/api/ai-design/components/page/:pageId", isAuthenticated, aiDesignController.getPageComponentRecommendations);
  
  // Color palettes
  app.post("/api/ai-design/colors/generate", isAuthenticated, aiDesignController.generateColorPalettes);
  app.get("/api/ai-design/colors/:tenantId", isAuthenticated, aiDesignController.getColorPalettes);
  
  console.log("✅ AI Design System routes registered");
}