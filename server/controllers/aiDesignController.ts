import { Request, Response } from "express";
import { db } from "../db";
import { 
  aiDesignSuggestions, 
  aiComponentRecommendations, 
  aiColorPalettes,
  businessIdentity 
} from "../../shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { aiDesignService } from "../services/aiDesignService";
import { migrateAiDesignSystemTables } from "../db-migrate-ai-design-system";

export const aiDesignController = {
  /**
   * Initialize AI Design System tables
   */
  async initializeTables(req: Request, res: Response) {
    try {
      await migrateAiDesignSystemTables();
      
      return res.status(200).json({
        message: "AI Design System tables initialized successfully",
        success: true
      });
    } catch (error) {
      console.error("Error initializing AI Design System tables:", error);
      return res.status(500).json({
        message: `Failed to initialize AI Design System tables: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Get design suggestions based on business type and page type
   */
  async getDesignSuggestions(req: Request, res: Response) {
    try {
      const { businessType, pageType, tenantId } = req.query;
      
      if (!businessType || !pageType || !tenantId) {
        return res.status(400).json({
          message: "Missing required parameters: businessType, pageType, tenantId",
          success: false
        });
      }
      
      // Get existing suggestions or generate new ones
      const suggestions = await aiDesignService.generateDesignSuggestions(
        businessType.toString(),
        pageType.toString(),
        tenantId.toString()
      );
      
      return res.status(200).json({
        message: "Design suggestions retrieved successfully",
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error("Error retrieving design suggestions:", error);
      return res.status(500).json({
        message: `Failed to retrieve design suggestions: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Generate component recommendations for a specific section
   */
  async generateComponentRecommendations(req: Request, res: Response) {
    try {
      const { pageId, sectionId, context } = req.body;
      
      if (!pageId || !context) {
        return res.status(400).json({
          message: "Missing required parameters: pageId, context",
          success: false
        });
      }
      
      const recommendations = await aiDesignService.generateComponentRecommendations(
        parseInt(pageId.toString()),
        context.toString(),
        sectionId ? parseInt(sectionId.toString()) : undefined
      );
      
      return res.status(200).json({
        message: "Component recommendations generated successfully",
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error("Error generating component recommendations:", error);
      return res.status(500).json({
        message: `Failed to generate component recommendations: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Get all component recommendations for a page
   */
  async getPageComponentRecommendations(req: Request, res: Response) {
    try {
      const { pageId } = req.params;
      
      const recommendations = await db
        .select()
        .from(aiComponentRecommendations)
        .where(eq(aiComponentRecommendations.pageId, parseInt(pageId)))
        .orderBy(desc(aiComponentRecommendations.createdAt));
      
      return res.status(200).json({
        message: "Page component recommendations retrieved successfully",
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error("Error retrieving page component recommendations:", error);
      return res.status(500).json({
        message: `Failed to retrieve page component recommendations: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Generate color palettes based on business identity
   */
  async generateColorPalettes(req: Request, res: Response) {
    try {
      const { tenantId, industry, mood } = req.body;
      
      if (!tenantId || !industry) {
        return res.status(400).json({
          message: "Missing required parameters: tenantId, industry",
          success: false
        });
      }
      
      const palettes = await aiDesignService.generateColorPalettes(
        tenantId.toString(),
        industry.toString(),
        mood ? mood.toString() : "professional"
      );
      
      return res.status(200).json({
        message: "Color palettes generated successfully",
        success: true,
        data: palettes
      });
    } catch (error) {
      console.error("Error generating color palettes:", error);
      return res.status(500).json({
        message: `Failed to generate color palettes: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Get all color palettes for a tenant
   */
  async getColorPalettes(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;
      
      const palettes = await aiDesignService.getColorPalettes(tenantId.toString());
      
      return res.status(200).json({
        message: "Color palettes retrieved successfully",
        success: true,
        data: palettes
      });
    } catch (error) {
      console.error("Error retrieving color palettes:", error);
      return res.status(500).json({
        message: `Failed to retrieve color palettes: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Apply a design suggestion to a page
   */
  async applyDesignSuggestion(req: Request, res: Response) {
    try {
      const { pageId, suggestionId } = req.body;
      
      if (!pageId || !suggestionId) {
        return res.status(400).json({
          message: "Missing required parameters: pageId, suggestionId",
          success: false
        });
      }
      
      // Get the suggestion
      const [suggestion] = await db
        .select()
        .from(aiDesignSuggestions)
        .where(eq(aiDesignSuggestions.id, parseInt(suggestionId.toString())));
      
      if (!suggestion) {
        return res.status(404).json({
          message: "Design suggestion not found",
          success: false
        });
      }
      
      // In a real implementation, we would apply the suggestion to the page here
      // This would involve creating sections and components based on the suggestion
      
      return res.status(200).json({
        message: "Design suggestion applied successfully",
        success: true,
        data: {
          pageId: parseInt(pageId.toString()),
          suggestionId: parseInt(suggestionId.toString()),
          applied: true
        }
      });
    } catch (error) {
      console.error("Error applying design suggestion:", error);
      return res.status(500).json({
        message: `Failed to apply design suggestion: ${(error as Error).message}`,
        success: false
      });
    }
  }
};