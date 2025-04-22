import { Express } from "express";
import * as pageBuilderController from "./pageBuilderController";

/**
 * Register Advanced Page Builder routes
 */
export function registerPageBuilderRoutes(app: Express) {
  // Pages
  app.get("/api/page-builder/pages", pageBuilderController.getPages);
  app.get("/api/page-builder/pages/:id", pageBuilderController.getPage);
  app.post("/api/page-builder/pages", pageBuilderController.createPage);
  app.put("/api/page-builder/pages/:id", pageBuilderController.updatePage);
  app.delete("/api/page-builder/pages/:id", pageBuilderController.deletePage);
  app.post("/api/page-builder/pages/:id/publish", pageBuilderController.togglePagePublishStatus);
  
  // Sections
  app.post("/api/page-builder/pages/:pageId/sections", pageBuilderController.addSection);
  app.put("/api/page-builder/sections/:sectionId", pageBuilderController.updateSection);
  app.delete("/api/page-builder/sections/:sectionId", pageBuilderController.deleteSection);
  app.post("/api/page-builder/pages/:pageId/sections/order", pageBuilderController.updateSectionOrder);
  
  // Components
  app.post("/api/page-builder/sections/:sectionId/components", pageBuilderController.addComponent);
  app.put("/api/page-builder/components/:componentId", pageBuilderController.updateComponent);
  app.delete("/api/page-builder/components/:componentId", pageBuilderController.deleteComponent);
  app.post("/api/page-builder/sections/:sectionId/components/order", pageBuilderController.updateComponentOrder);
  
  // Templates
  app.get("/api/page-builder/templates", pageBuilderController.getTemplates);
  app.get("/api/page-builder/templates/:id", pageBuilderController.getTemplate);
  app.post("/api/page-builder/templates", pageBuilderController.createTemplate);
  app.post("/api/page-builder/pages/:pageId/save-as-template", pageBuilderController.savePageAsTemplate);
  
  // Component library
  app.get("/api/page-builder/component-library", pageBuilderController.getComponentLibrary);
  
  // SEO
  app.post("/api/page-builder/pages/:pageId/recommendations", pageBuilderController.generateRecommendations);
  app.post("/api/page-builder/recommendations/:recommendationId/dismiss", pageBuilderController.dismissRecommendation);
  app.get("/api/page-builder/pages/:pageId/seo-score", pageBuilderController.calculatePageSeoScore);
}