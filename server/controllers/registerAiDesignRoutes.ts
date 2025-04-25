import { Express, Request, Response } from "express";
import { z } from "zod";
import * as aiDesignService from "../services/aiDesignService";

// Define validation schemas
const generateSuggestionsSchema = z.object({
  pageType: z.string(),
  businessType: z.string(),
  tenantId: z.string()
});

const generateColorPaletteSchema = z.object({
  industry: z.string(),
  mood: z.string(),
  tenantId: z.string()
});

const generateComponentsSchema = z.object({
  pageId: z.number(),
  context: z.string()
});

// Helper function for error handling
function handleApiError(res: any, error: any, customMessage: string) {
  console.error(`${customMessage}:`, error);
  
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors
    });
  }
  
  res.status(500).json({
    success: false,
    message: customMessage
  });
}

/**
 * Register AI design system routes
 */
export function registerAiDesignRoutes(app: Express) {
  // Get design suggestions
  app.get("/api/ai-design/suggestions", async (req, res) => {
    try {
      const { pageType, businessType, tenantId } = req.query;
      
      if (!pageType || !businessType || !tenantId) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameters: pageType, businessType, tenantId"
        });
      }
      
      const suggestions = await aiDesignService.getDesignSuggestions(
        String(pageType),
        String(businessType), 
        String(tenantId)
      );
      
      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      handleApiError(res, error, "Failed to fetch design suggestions");
    }
  });

  // Generate new design suggestions
  app.post("/api/ai-design/suggestions/generate", async (req, res) => {
    try {
      const { pageType, businessType, tenantId } = generateSuggestionsSchema.parse(req.body);
      
      const suggestions = await aiDesignService.generateDesignSuggestions(pageType, businessType, tenantId);
      
      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      handleApiError(res, error, "Failed to generate design suggestions");
    }
  });

  // Get color palettes for a tenant
  app.get("/api/ai-design/colors/:tenantId", async (req, res) => {
    try {
      const { tenantId } = req.params;
      
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          message: "Missing required parameter: tenantId"
        });
      }
      
      const colorPalettes = await aiDesignService.getColorPalettes(tenantId);
      
      res.json({
        success: true,
        data: colorPalettes
      });
    } catch (error) {
      handleApiError(res, error, "Failed to fetch color palettes");
    }
  });

  // Generate new color palettes
  app.post("/api/ai-design/colors/generate", async (req, res) => {
    try {
      const { industry, mood, tenantId } = generateColorPaletteSchema.parse(req.body);
      
      const colorPalettes = await aiDesignService.generateColorPalettes(industry, mood, tenantId);
      
      res.json({
        success: true,
        data: colorPalettes
      });
    } catch (error) {
      handleApiError(res, error, "Failed to generate color palettes");
    }
  });

  // Get component recommendations for a page
  app.get("/api/ai-design/components/page/:pageId", async (req, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      
      if (isNaN(pageId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid page ID"
        });
      }
      
      const recommendations = await aiDesignService.getComponentRecommendations(pageId);
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      handleApiError(res, error, "Failed to fetch component recommendations");
    }
  });

  // Generate new component recommendations
  app.post("/api/ai-design/components/recommend", async (req, res) => {
    try {
      const { pageId, context } = generateComponentsSchema.parse(req.body);
      
      const recommendation = await aiDesignService.generateComponentRecommendations(pageId, context);
      
      res.json({
        success: true,
        data: recommendation
      });
    } catch (error) {
      handleApiError(res, error, "Failed to generate component recommendations");
    }
  });

  console.log("✅ AI Design System routes registered");
}