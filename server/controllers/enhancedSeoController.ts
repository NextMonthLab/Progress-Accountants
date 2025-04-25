import { Request, Response } from "express";
import * as seoAnalysisService from "../services/seoAnalysisService";
import * as keywordAnalysisService from "../services/keywordAnalysisService";
import * as competitorAnalysisService from "../services/competitorAnalysisService";
import * as mobileFriendlinessService from "../services/mobileFriendlinessService";
import { db } from "../db";
import { pageBuilderPages } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Get SEO score for a specific page
 */
export async function getSeoScore(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    const score = await seoAnalysisService.calculateSeoScore(pageId);
    
    return res.json({ 
      success: true, 
      data: score 
    });
  } catch (error) {
    console.error("Error getting SEO score:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to get SEO score: ${(error as Error).message}` 
    });
  }
}

/**
 * Get SEO recommendations for a specific page
 */
export async function getSeoRecommendations(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    const recommendations = await seoAnalysisService.getPageRecommendations(pageId);
    
    return res.json({ 
      success: true, 
      data: recommendations 
    });
  } catch (error) {
    console.error("Error getting SEO recommendations:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to get recommendations: ${(error as Error).message}` 
    });
  }
}

/**
 * Generate new SEO recommendations for a page
 */
export async function generateSeoRecommendations(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    const recommendations = await seoAnalysisService.generateSeoRecommendations(pageId);
    
    return res.json({ 
      success: true, 
      data: recommendations 
    });
  } catch (error) {
    console.error("Error generating SEO recommendations:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to generate recommendations: ${(error as Error).message}` 
    });
  }
}

/**
 * Apply an SEO recommendation
 */
export async function applyRecommendation(req: Request, res: Response) {
  try {
    const recommendationId = parseInt(req.params.recommendationId);
    
    if (isNaN(recommendationId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid recommendation ID" 
      });
    }
    
    const success = await seoAnalysisService.applyRecommendation(recommendationId);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: "Recommendation applied successfully" 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to apply recommendation" 
      });
    }
  } catch (error) {
    console.error("Error applying recommendation:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to apply recommendation: ${(error as Error).message}` 
    });
  }
}

/**
 * Dismiss an SEO recommendation
 */
export async function dismissRecommendation(req: Request, res: Response) {
  try {
    const recommendationId = parseInt(req.params.recommendationId);
    
    if (isNaN(recommendationId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid recommendation ID" 
      });
    }
    
    const success = await seoAnalysisService.dismissRecommendation(recommendationId);
    
    if (success) {
      return res.json({ 
        success: true, 
        message: "Recommendation dismissed successfully" 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to dismiss recommendation" 
      });
    }
  } catch (error) {
    console.error("Error dismissing recommendation:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to dismiss recommendation: ${(error as Error).message}` 
    });
  }
}

/**
 * Analyze keyword density for a page
 */
export async function analyzeKeywordDensity(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    const analysis = await keywordAnalysisService.analyzeKeywordDensity(pageId);
    
    return res.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    console.error("Error analyzing keyword density:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to analyze keyword density: ${(error as Error).message}` 
    });
  }
}

/**
 * Analyze competitors based on keywords, industry and page
 */
export async function analyzeCompetitors(req: Request, res: Response) {
  try {
    const { keywords, industry, pageUrl } = req.body;
    
    if (!keywords || !Array.isArray(keywords) || !industry || !pageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: keywords (array), industry, and pageUrl" 
      });
    }
    
    const analysis = await competitorAnalysisService.analyzeCompetitors(keywords, industry, pageUrl);
    
    return res.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    console.error("Error analyzing competitors:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to analyze competitors: ${(error as Error).message}` 
    });
  }
}

/**
 * Get content recommendations to outrank competitors
 */
export async function getCompetitorContentRecommendations(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    const { primaryKeyword, competitorUrls } = req.body;
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    if (!primaryKeyword || !competitorUrls || !Array.isArray(competitorUrls)) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: primaryKeyword and competitorUrls (array)" 
      });
    }
    
    const recommendations = await competitorAnalysisService.generateCompetitorContentRecommendations(
      pageId,
      primaryKeyword,
      competitorUrls
    );
    
    return res.json({ 
      success: true, 
      data: recommendations 
    });
  } catch (error) {
    console.error("Error getting competitor content recommendations:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to get competitor content recommendations: ${(error as Error).message}` 
    });
  }
}

/**
 * Analyze mobile-friendliness of a page
 */
export async function analyzeMobileFriendliness(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    const analysis = await mobileFriendlinessService.analyzeMobileFriendliness(pageId);
    
    return res.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    console.error("Error analyzing mobile-friendliness:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to analyze mobile-friendliness: ${(error as Error).message}` 
    });
  }
}

/**
 * Get page SEO summary with all analysis in one call
 */
export async function getPageSeoSummary(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    
    if (isNaN(pageId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid page ID" 
      });
    }
    
    // Get the page for basic info
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      return res.status(404).json({ 
        success: false, 
        message: "Page not found" 
      });
    }
    
    // Run all analyses in parallel for efficiency
    const [
      seoScore,
      recommendations,
      keywordAnalysis,
      mobileFriendlinessAnalysis
    ] = await Promise.all([
      seoAnalysisService.calculateSeoScore(pageId),
      seoAnalysisService.getPageRecommendations(pageId),
      keywordAnalysisService.analyzeKeywordDensity(pageId),
      mobileFriendlinessService.analyzeMobileFriendliness(pageId)
    ]);
    
    // Extract SEO data from page
    const pageSeo = page.seo as any || {};
    
    // Basic competitor analysis based on page SEO data
    let competitorAnalysis = null;
    if (pageSeo.keywords && pageSeo.keywords.length > 0) {
      const industry = 'accounting'; // Default for Progress Accountants
      const pageUrl = page.slug || `/pages/${page.id}`;
      competitorAnalysis = await competitorAnalysisService.analyzeCompetitors(
        pageSeo.keywords,
        industry,
        pageUrl
      );
    }
    
    return res.json({
      success: true,
      data: {
        pageInfo: {
          id: page.id,
          name: page.name,
          slug: page.slug,
          seo: pageSeo
        },
        seoScore,
        recommendations,
        keywordAnalysis,
        mobileFriendliness: mobileFriendlinessAnalysis,
        competitorAnalysis
      }
    });
  } catch (error) {
    console.error("Error getting page SEO summary:", error);
    return res.status(500).json({ 
      success: false, 
      message: `Failed to get page SEO summary: ${(error as Error).message}` 
    });
  }
}