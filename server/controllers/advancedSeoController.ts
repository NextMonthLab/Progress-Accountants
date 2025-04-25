import { Request, Response } from 'express';
import { db } from '../db';
import { pageBuilderPages } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Import our advanced SEO services
import { 
  detectPageIndustry,
  getIndustryKeywordRecommendations,
  getIndustryContentBenchmarks,
  getIndustryBenchmarkComparison,
  IndustryVertical
} from '../services/industrySeoIntelligenceService';

import {
  analyzeCompetitorsForTerm,
  generateContentRecommendationsFromCompetitors,
  identifyTrendingTopics
} from '../services/advancedCompetitorAnalysisService';

import {
  optimizePageContent,
  applyContentOptimizations,
  generateAdditionalContent,
  ContentOptimizationRequest
} from '../services/contentOptimizationService';

/**
 * Controller methods for advanced SEO analysis and optimization
 */

/**
 * Detect the industry vertical for a page
 */
export async function detectIndustry(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    const industry = await detectPageIndustry(parseInt(pageId));
    
    return res.status(200).json({
      success: true,
      data: {
        pageId: parseInt(pageId),
        industry
      }
    });
  } catch (error) {
    console.error("Error detecting page industry:", error);
    return res.status(500).json({
      success: false,
      message: `Error detecting page industry: ${(error as Error).message}`
    });
  }
}

/**
 * Get industry-specific keyword recommendations
 */
export async function getIndustryKeywords(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    const keywordRecommendations = await getIndustryKeywordRecommendations(parseInt(pageId));
    
    if (!keywordRecommendations) {
      return res.status(404).json({
        success: false,
        message: "Could not generate keyword recommendations"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: keywordRecommendations
    });
  } catch (error) {
    console.error("Error getting industry keywords:", error);
    return res.status(500).json({
      success: false,
      message: `Error getting industry keywords: ${(error as Error).message}`
    });
  }
}

/**
 * Get industry content benchmarks
 */
export async function getContentBenchmarks(req: Request, res: Response) {
  try {
    const { industry } = req.params;
    
    if (!industry) {
      return res.status(400).json({
        success: false,
        message: "Industry is required"
      });
    }
    
    const benchmarks = await getIndustryContentBenchmarks(industry as IndustryVertical);
    
    if (!benchmarks) {
      return res.status(404).json({
        success: false,
        message: "Could not retrieve industry benchmarks"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: benchmarks
    });
  } catch (error) {
    console.error("Error getting content benchmarks:", error);
    return res.status(500).json({
      success: false,
      message: `Error getting content benchmarks: ${(error as Error).message}`
    });
  }
}

/**
 * Compare page against industry benchmarks
 */
export async function compareToBenchmarks(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    const comparison = await getIndustryBenchmarkComparison(parseInt(pageId));
    
    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: "Could not generate benchmark comparison"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error("Error comparing to benchmarks:", error);
    return res.status(500).json({
      success: false,
      message: `Error comparing to benchmarks: ${(error as Error).message}`
    });
  }
}

/**
 * Analyze competitors for a specific search term
 */
export async function analyzeCompetitors(req: Request, res: Response) {
  try {
    const { queryTerm, industry } = req.body;
    
    if (!queryTerm || !industry) {
      return res.status(400).json({
        success: false,
        message: "Query term and industry are required"
      });
    }
    
    const analysis = await analyzeCompetitorsForTerm(queryTerm, industry as IndustryVertical);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Could not generate competitor analysis"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Error analyzing competitors:", error);
    return res.status(500).json({
      success: false,
      message: `Error analyzing competitors: ${(error as Error).message}`
    });
  }
}

/**
 * Get content recommendations based on competitor analysis
 */
export async function getCompetitorContentRecommendations(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    const recommendations = await generateContentRecommendationsFromCompetitors(parseInt(pageId));
    
    if (!recommendations) {
      return res.status(404).json({
        success: false,
        message: "Could not generate content recommendations"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("Error getting competitor content recommendations:", error);
    return res.status(500).json({
      success: false,
      message: `Error getting competitor content recommendations: ${(error as Error).message}`
    });
  }
}

/**
 * Get trending topics for an industry
 */
export async function getTrendingTopics(req: Request, res: Response) {
  try {
    const { industry } = req.params;
    
    if (!industry) {
      return res.status(400).json({
        success: false,
        message: "Industry is required"
      });
    }
    
    const trends = await identifyTrendingTopics(industry as IndustryVertical);
    
    if (!trends) {
      return res.status(404).json({
        success: false,
        message: "Could not identify trending topics"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error("Error getting trending topics:", error);
    return res.status(500).json({
      success: false,
      message: `Error getting trending topics: ${(error as Error).message}`
    });
  }
}

/**
 * Optimize page content
 */
export async function optimizeContent(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const optimizationRequest: ContentOptimizationRequest = {
      ...req.body,
      pageId: parseInt(pageId)
    };
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    // Validate the page exists
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }
    
    const optimizations = await optimizePageContent(optimizationRequest);
    
    return res.status(200).json({
      success: true,
      data: optimizations
    });
  } catch (error) {
    console.error("Error optimizing content:", error);
    return res.status(500).json({
      success: false,
      message: `Error optimizing content: ${(error as Error).message}`
    });
  }
}

/**
 * Apply content optimizations
 */
export async function applyOptimizations(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const optimizations = req.body;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    // Validate the page exists
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }
    
    const result = await applyContentOptimizations(parseInt(pageId), optimizations);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error applying optimizations:", error);
    return res.status(500).json({
      success: false,
      message: `Error applying optimizations: ${(error as Error).message}`
    });
  }
}

/**
 * Generate additional content
 */
export async function generateContent(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const { contentType, targetKeywords } = req.body;
    
    if (!pageId || !contentType) {
      return res.status(400).json({
        success: false,
        message: "Page ID and content type are required"
      });
    }
    
    // Validate the page exists
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }
    
    const result = await generateAdditionalContent(
      parseInt(pageId),
      contentType,
      targetKeywords
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({
      success: false,
      message: `Error generating content: ${(error as Error).message}`
    });
  }
}

/**
 * Get all data for the SEO Intelligence Dashboard
 */
export async function getSeoIntelligenceDashboard(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    
    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: "Page ID is required"
      });
    }
    
    // Validate the page exists
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found"
      });
    }
    
    // Detect the industry
    const industry = await detectPageIndustry(parseInt(pageId));
    
    if (!industry) {
      return res.status(500).json({
        success: false,
        message: "Could not detect industry for the page"
      });
    }
    
    // Get all the data in parallel
    const [
      keywordRecommendations,
      benchmarkComparison,
      contentRecommendations,
      trendingTopics
    ] = await Promise.all([
      getIndustryKeywordRecommendations(parseInt(pageId)),
      getIndustryBenchmarkComparison(parseInt(pageId)),
      generateContentRecommendationsFromCompetitors(parseInt(pageId)),
      identifyTrendingTopics(industry)
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        page: {
          id: page.id,
          title: page.title,
          seoSettings: page.seoSettings
        },
        industry,
        keywordRecommendations,
        benchmarkComparison,
        contentRecommendations,
        trendingTopics
      }
    });
  } catch (error) {
    console.error("Error getting SEO intelligence dashboard:", error);
    return res.status(500).json({
      success: false,
      message: `Error getting SEO intelligence dashboard: ${(error as Error).message}`
    });
  }
}