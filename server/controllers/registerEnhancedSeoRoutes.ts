import { Express } from "express";
import * as enhancedSeoController from "./enhancedSeoController";

/**
 * Register enhanced SEO analysis routes
 * @param app Express application
 */
export function registerEnhancedSeoRoutes(app: Express): void {
  // Original SEO routes (compatibility)
  app.get("/api/page-builder/pages/:pageId/seo-score", enhancedSeoController.getSeoScore);
  app.get("/api/page-builder/pages/:pageId/recommendations", enhancedSeoController.getSeoRecommendations);
  app.post("/api/page-builder/pages/:pageId/recommendations", enhancedSeoController.generateSeoRecommendations);
  app.post("/api/page-builder/recommendations/:recommendationId/apply", enhancedSeoController.applyRecommendation);
  app.post("/api/page-builder/recommendations/:recommendationId/dismiss", enhancedSeoController.dismissRecommendation);
  
  // New enhanced SEO routes
  app.get("/api/enhanced-seo/pages/:pageId/keyword-analysis", enhancedSeoController.analyzeKeywordDensity);
  app.post("/api/enhanced-seo/competitor-analysis", enhancedSeoController.analyzeCompetitors);
  app.post("/api/enhanced-seo/pages/:pageId/competitor-content", enhancedSeoController.getCompetitorContentRecommendations);
  app.get("/api/enhanced-seo/pages/:pageId/mobile-friendliness", enhancedSeoController.analyzeMobileFriendliness);
  
  // Comprehensive SEO summary endpoint - combines all analyses in one call
  app.get("/api/enhanced-seo/pages/:pageId/summary", enhancedSeoController.getPageSeoSummary);
  
  console.log("✅ Enhanced SEO routes registered");
}