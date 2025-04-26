/**
 * Site Variant Routes
 * 
 * API routes for handling site variant operations during clone and template selection.
 */
import { Express } from "express";
import * as siteVariantController from "../controllers/siteVariantController";

export function registerSiteVariantRoutes(app: Express) {
  // Get all available site variants
  app.get("/api/site-variants", siteVariantController.getSiteVariants);

  // Get site variant for a specific tenant
  app.get("/api/tenant/:tenantId/site-variant", siteVariantController.getTenantSiteVariant);

  // Set site variant for a tenant (during clone or template selection)
  app.post("/api/tenant/:tenantId/site-variant", siteVariantController.setTenantSiteVariant);

  console.log("✅ Site Variant routes registered");
}