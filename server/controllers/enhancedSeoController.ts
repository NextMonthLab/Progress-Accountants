import { Request, Response } from 'express';
import { storage } from '../storage';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import { pageBuilderPages, pageBuilderRecommendations } from '@shared/schema';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helpers
function handleApiError(res: Response, error: any, message: string) {
  console.error(`${message}:`, error);
  res.status(500).json({
    success: false,
    message: message,
    error: error.message
  });
}

/**
 * Get SEO score for a specific page
 */
export async function getSeoScore(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ success: false, message: 'Invalid page ID' });
    }

    // Get page data
    const [page] = await db.select().from(pageBuilderPages).where(eq(pageBuilderPages.id, pageId));
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Calculate score based on page content and SEO settings
    const score = await calculateSeoScore(page);

    res.json({
      success: true,
      data: {
        pageId,
        score,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    handleApiError(res, error, 'Error getting SEO score');
  }
}

/**
 * Get SEO recommendations for a specific page
 */
export async function getSeoRecommendations(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ success: false, message: 'Invalid page ID' });
    }

    // Get page recommendations
    const recommendations = await db
      .select()
      .from(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.pageId, pageId));

    res.json({
      success: true,
      data: {
        pageId,
        recommendations,
        count: recommendations.length
      }
    });
  } catch (error) {
    handleApiError(res, error, 'Error getting SEO recommendations');
  }
}

/**
 * Generate new SEO recommendations for a page
 */
export async function generateSeoRecommendations(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ success: false, message: 'Invalid page ID' });
    }

    // Get page data
    const [page] = await db.select().from(pageBuilderPages).where(eq(pageBuilderPages.id, pageId));
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Generate recommendations
    const newRecommendations = await generateSeoSuggestions(page);

    // Clear existing recommendations
    await db.delete(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.pageId, pageId));

    // Save new recommendations
    const savedRecommendations = [];
    for (const rec of newRecommendations) {
      const [savedRec] = await db.insert(pageBuilderRecommendations).values({
        pageId,
        type: rec.type,
        title: rec.message,
        description: rec.details,
        priority: rec.severity === 'high' ? 'critical' : (rec.severity === 'medium' ? 'important' : 'minor'),
        status: 'active',
        category: rec.type,
        implementationDetails: rec.fixInstructions || {}
      }).returning();
      
      savedRecommendations.push(savedRec);
    }

    res.json({
      success: true,
      data: {
        pageId,
        recommendations: savedRecommendations,
        count: savedRecommendations.length
      }
    });
  } catch (error) {
    handleApiError(res, error, 'Error generating SEO recommendations');
  }
}

/**
 * Apply an SEO recommendation
 */
export async function applyRecommendation(req: Request, res: Response) {
  try {
    const recommendationId = parseInt(req.params.recommendationId);
    if (isNaN(recommendationId)) {
      return res.status(400).json({ success: false, message: 'Invalid recommendation ID' });
    }

    // Get recommendation
    const [recommendation] = await db
      .select()
      .from(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.id, recommendationId));

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    // Check if the recommendation can be automatically applied
    const canAutoApply = recommendation.implementationDetails 
      && (recommendation.implementationDetails.title 
        || recommendation.implementationDetails.description 
        || recommendation.implementationDetails.keywords);

    if (!canAutoApply) {
      return res.status(400).json({ 
        success: false, 
        message: 'This recommendation cannot be automatically applied' 
      });
    }

    // Get page
    const [page] = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, recommendation.pageId));
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Apply the recommendation based on type
    let updateData: any = {};
    let success = false;

    switch (recommendation.type) {
      case 'title':
        // Update the page title based on recommendation
        if (recommendation.implementationDetails.title) {
          updateData.seoSettings = {
            ...page.seoSettings,
            title: recommendation.implementationDetails.title
          };
          success = true;
        }
        break;
      
      case 'description':
        // Update the page description based on recommendation
        if (recommendation.implementationDetails.description) {
          updateData.seoSettings = {
            ...page.seoSettings,
            description: recommendation.implementationDetails.description
          };
          success = true;
        }
        break;
      
      case 'keywords':
        // Update the keywords based on recommendation
        if (recommendation.implementationDetails.keywords) {
          updateData.seoSettings = {
            ...page.seoSettings,
            keywords: recommendation.implementationDetails.keywords
          };
          success = true;
        }
        break;
      
      default:
        return res.status(400).json({ 
          success: false, 
          message: `Unsupported recommendation type: ${recommendation.type}` 
        });
    }

    if (!success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Could not apply recommendation. Missing implementation details.' 
      });
    }

    // Update the page
    await db.update(pageBuilderPages).set(updateData)
      .where(eq(pageBuilderPages.id, page.id));

    // Mark recommendation as applied
    await db.update(pageBuilderRecommendations)
      .set({ 
        status: 'implemented',
        updatedAt: new Date().toISOString()
      })
      .where(eq(pageBuilderRecommendations.id, recommendationId));

    res.json({
      success: true,
      message: 'Recommendation applied successfully',
      data: {
        recommendationId,
        pageId: page.id,
        updatedFields: Object.keys(updateData)
      }
    });
  } catch (error) {
    handleApiError(res, error, 'Error applying SEO recommendation');
  }
}

/**
 * Dismiss an SEO recommendation
 */
export async function dismissRecommendation(req: Request, res: Response) {
  try {
    const recommendationId = parseInt(req.params.recommendationId);
    if (isNaN(recommendationId)) {
      return res.status(400).json({ success: false, message: 'Invalid recommendation ID' });
    }

    // Get recommendation to ensure it exists
    const [recommendation] = await db
      .select()
      .from(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.id, recommendationId));

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    // Update recommendation to mark as dismissed
    await db.update(pageBuilderRecommendations)
      .set({ 
        status: 'dismissed',
        updatedAt: new Date().toISOString()
      })
      .where(eq(pageBuilderRecommendations.id, recommendationId));

    res.json({
      success: true,
      message: 'Recommendation dismissed successfully',
      data: {
        recommendationId,
        pageId: recommendation.pageId
      }
    });
  } catch (error) {
    handleApiError(res, error, 'Error dismissing SEO recommendation');
  }
}

/**
 * Analyze keyword density for a page
 */
export async function analyzeKeywordDensity(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ success: false, message: 'Invalid page ID' });
    }

    // Get page data
    const [page] = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
      
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Extract text content from page components for analysis
    let textContent = extractTextFromPage(page);
    
    // Get keywords from page SEO settings
    const primaryKeyword = page.seoSettings?.primaryKeyword || '';
    const secondaryKeywords = page.seoSettings?.keywords || [];
    
    // Analyze keyword density
    const analysis = await analyzeKeywords(textContent, primaryKeyword, secondaryKeywords);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    handleApiError(res, error, 'Error analyzing keyword density');
  }
}

/**
 * Analyze competitors based on keywords, industry and page
 */
export async function analyzeCompetitors(req: Request, res: Response) {
  try {
    const { keywords, industry, pageUrl } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Keywords are required and must be an array' 
      });
    }

    if (!industry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Industry is required' 
      });
    }

    // Perform competitive analysis
    const competitorAnalysis = await performCompetitorAnalysis(keywords, industry, pageUrl);

    res.json({
      success: true,
      data: competitorAnalysis
    });
  } catch (error) {
    handleApiError(res, error, 'Error analyzing competitors');
  }
}

/**
 * Get content recommendations to outrank competitors
 */
export async function getCompetitorContentRecommendations(req: Request, res: Response) {
  try {
    const { pageId, competitorIds } = req.body;

    if (!pageId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Page ID is required' 
      });
    }

    if (!competitorIds || !Array.isArray(competitorIds) || competitorIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Competitor IDs are required and must be an array' 
      });
    }

    // Get page data
    const [page] = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
      
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Generate content recommendations
    const recommendations = await generateCompetitorContentRecommendations(page, competitorIds);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    handleApiError(res, error, 'Error getting competitor content recommendations');
  }
}

/**
 * Analyze mobile-friendliness of a page
 */
export async function analyzeMobileFriendliness(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ success: false, message: 'Invalid page ID' });
    }

    // Get page data
    const [page] = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
      
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Analyze mobile-friendliness
    const mobileFriendliness = await analyzeMobile(page);

    res.json({
      success: true,
      data: mobileFriendliness
    });
  } catch (error) {
    handleApiError(res, error, 'Error analyzing mobile-friendliness');
  }
}

/**
 * Get page SEO summary with all analysis in one call
 */
export async function getPageSeoSummary(req: Request, res: Response) {
  try {
    const pageId = parseInt(req.params.pageId);
    if (isNaN(pageId)) {
      return res.status(400).json({ success: false, message: 'Invalid page ID' });
    }

    // Get page data
    const [page] = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
      
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Get all recommendations
    const recommendations = await db
      .select()
      .from(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.pageId, pageId));

    // Calculate SEO score
    const seoScore = await calculateSeoScore(page);

    // Extract text content from page components for analysis
    let textContent = extractTextFromPage(page);
    
    // Get keywords from page SEO settings
    const primaryKeyword = page.seoSettings?.primaryKeyword || '';
    const secondaryKeywords = page.seoSettings?.keywords || [];
    
    // Analyze keyword density
    const keywordAnalysis = await analyzeKeywords(textContent, primaryKeyword, secondaryKeywords);

    // Analyze mobile-friendliness
    const mobileFriendliness = await analyzeMobile(page);

    // Get competitor analysis if available
    let competitorAnalysis = null;
    if (primaryKeyword) {
      competitorAnalysis = await performCompetitorAnalysis(
        [primaryKeyword, ...(secondaryKeywords || []).slice(0, 2)], 
        'accounting', // Default industry for Progress Accountants
        page.path
      );
    }

    // Combine all data for a comprehensive analysis
    const summary = {
      pageInfo: {
        id: page.id,
        name: page.title,
        slug: page.path,
        description: page.description,
        type: page.pageType,
        seo: page.seoSettings
      },
      seoScore,
      recommendations: recommendations.filter(r => r.status !== 'dismissed' && r.status !== 'implemented'),
      keywordAnalysis,
      mobileFriendliness,
      competitorAnalysis
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    handleApiError(res, error, 'Error getting SEO summary');
  }
}

// ============ Helper functions ============

/**
 * Calculate SEO score based on page content and settings
 */
async function calculateSeoScore(page: any) {
  // Initialize scores for different categories
  const scores = {
    titleScore: 0,
    descriptionScore: 0,
    keywordScore: 0,
    contentScore: 0,
    structureScore: 0
  };
  
  // Check title
  if (page.seoSettings?.title) {
    const titleLength = page.seoSettings.title.length;
    if (titleLength >= 50 && titleLength <= 60) {
      scores.titleScore = 100;
    } else if (titleLength >= 40 && titleLength <= 70) {
      scores.titleScore = 80;
    } else if (titleLength >= 30 && titleLength <= 80) {
      scores.titleScore = 60;
    } else {
      scores.titleScore = 30;
    }
  }
  
  // Check description
  if (page.seoSettings?.description) {
    const descLength = page.seoSettings.description.length;
    if (descLength >= 150 && descLength <= 160) {
      scores.descriptionScore = 100;
    } else if (descLength >= 130 && descLength <= 170) {
      scores.descriptionScore = 80;
    } else if (descLength >= 100 && descLength <= 200) {
      scores.descriptionScore = 60;
    } else {
      scores.descriptionScore = 30;
    }
  }
  
  // Check keywords
  if (page.seoSettings?.primaryKeyword) {
    scores.keywordScore += 40;
    
    // Check if primary keyword is in title
    if (page.seoSettings.title && 
        page.seoSettings.title.toLowerCase().includes(page.seoSettings.primaryKeyword.toLowerCase())) {
      scores.keywordScore += 30;
    }
    
    // Check if primary keyword is in description
    if (page.seoSettings.description && 
        page.seoSettings.description.toLowerCase().includes(page.seoSettings.primaryKeyword.toLowerCase())) {
      scores.keywordScore += 30;
    }
    
    // Normalize to 100
    scores.keywordScore = Math.min(100, scores.keywordScore);
  }
  
  // Check content (simplified, based on sections count)
  const sectionsCount = page.sections?.length || 0;
  if (sectionsCount >= 5) {
    scores.contentScore = 100;
  } else if (sectionsCount >= 3) {
    scores.contentScore = 75;
  } else if (sectionsCount >= 1) {
    scores.contentScore = 50;
  }
  
  // Check structure (simplified)
  scores.structureScore = 70; // Default to a moderate score
  
  // Calculate overall score (weighted average)
  const weights = {
    titleScore: 0.2,
    descriptionScore: 0.2,
    keywordScore: 0.3,
    contentScore: 0.2,
    structureScore: 0.1
  };
  
  const overallScore = Math.round(
    (scores.titleScore * weights.titleScore) +
    (scores.descriptionScore * weights.descriptionScore) +
    (scores.keywordScore * weights.keywordScore) +
    (scores.contentScore * weights.contentScore) +
    (scores.structureScore * weights.structureScore)
  );
  
  return {
    overallScore,
    categoryScores: scores
  };
}

/**
 * Generate SEO suggestions using OpenAI
 */
async function generateSeoSuggestions(page: any) {
  try {
    // Extract page content for analysis
    const pageContent = extractTextFromPage(page);
    
    const prompt = `
    Analyze this page information and provide SEO recommendations:
    
    Page title: ${page.title}
    Page path: ${page.path}
    SEO title: ${page.seoSettings?.title || '(none)'}
    SEO description: ${page.seoSettings?.description || '(none)'}
    Primary keyword: ${page.seoSettings?.primaryKeyword || '(none)'}
    Secondary keywords: ${page.seoSettings?.keywords?.join(', ') || '(none)'}
    
    Page content excerpt:
    ${pageContent.substring(0, 1000)}
    
    Provide recommendations in the following JSON format:
    [
      {
        "type": "title|description|keywords|content|structure",
        "message": "A clear description of the issue",
        "details": "More detailed explanation with reasoning",
        "severity": "high|medium|low",
        "autoFixAvailable": true|false,
        "fixInstructions": {
          // For title recommendations
          "title": "Suggested title",
          // For description recommendations
          "description": "Suggested description",
          // For keyword recommendations
          "keywords": ["keyword1", "keyword2"]
        }
      }
    ]
    
    Focus on important SEO issues and provide actionable recommendations.
    `;
    
    // Call OpenAI API for recommendations
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert SEO analyst providing specific recommendations to improve page SEO." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    let recommendations = [];
    if (response.choices && response.choices[0]?.message.content) {
      try {
        const parsedResponse = JSON.parse(response.choices[0].message.content);
        recommendations = Array.isArray(parsedResponse) ? parsedResponse : (parsedResponse.recommendations || []);
      } catch (e) {
        console.error('Failed to parse OpenAI response:', e);
        return []; // Return empty recommendations on parsing error
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating SEO suggestions:', error);
    return []; // Return empty recommendations on error
  }
}

/**
 * Extract text content from page components
 */
function extractTextFromPage(page: any): string {
  let textContent = '';
  
  // Add title and description
  textContent += page.title + ' ';
  textContent += page.description + ' ';
  
  // Add SEO settings text
  if (page.seoSettings?.title) textContent += page.seoSettings.title + ' ';
  if (page.seoSettings?.description) textContent += page.seoSettings.description + ' ';
  
  // Extract text from page sections and components
  if (page.sections && Array.isArray(page.sections)) {
    for (const section of page.sections) {
      if (section.components && Array.isArray(section.components)) {
        for (const component of section.components) {
          // Extract text from different component types
          if (component.type === 'text' && component.content?.text) {
            textContent += component.content.text + ' ';
          } else if (component.type === 'heading' && component.content?.text) {
            textContent += component.content.text + ' ';
          } else if (component.type === 'paragraph' && component.content?.text) {
            textContent += component.content.text + ' ';
          } else if (component.content?.title) {
            textContent += component.content.title + ' ';
          } else if (component.content?.description) {
            textContent += component.content.description + ' ';
          }
          
          // Check for nested content
          if (component.content?.items && Array.isArray(component.content.items)) {
            for (const item of component.content.items) {
              if (typeof item === 'string') {
                textContent += item + ' ';
              } else if (item.text) {
                textContent += item.text + ' ';
              } else if (item.title) {
                textContent += item.title + ' ';
              } else if (item.description) {
                textContent += item.description + ' ';
              }
            }
          }
        }
      }
    }
  }
  
  return textContent;
}

/**
 * Analyze keywords in text content
 */
async function analyzeKeywords(textContent: string, primaryKeyword: string, secondaryKeywords: string[]) {
  const words = textContent.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  const result: any = {
    totalWords,
    primaryKeyword: {
      keyword: primaryKeyword,
      count: 0,
      density: 0,
      positions: [],
      suggestions: []
    },
    secondaryKeywords: [],
    relatedKeywords: [],
    recommendations: [],
    overuseWarnings: []
  };
  
  // Analyze primary keyword
  if (primaryKeyword) {
    const primaryRegex = new RegExp('\\b' + primaryKeyword.toLowerCase() + '\\b', 'g');
    const primaryMatches = textContent.toLowerCase().match(primaryRegex);
    result.primaryKeyword.count = primaryMatches ? primaryMatches.length : 0;
    result.primaryKeyword.density = result.primaryKeyword.count / totalWords;
    
    // Find positions
    let index = -1;
    let position = -1;
    
    for (let i = 0; i < words.length; i++) {
      if (words[i].includes(primaryKeyword.toLowerCase())) {
        result.primaryKeyword.positions.push(i + 1); // 1-based indexing for human readability
      }
    }
    
    // Generate variation suggestions
    result.primaryKeyword.suggestions = generateKeywordVariations(primaryKeyword);
    
    // Keyword density recommendations
    if (result.primaryKeyword.density === 0) {
      result.recommendations.push("Add your primary keyword to the content. It's currently not present.");
    } else if (result.primaryKeyword.density < 0.01) {
      result.recommendations.push("Increase usage of your primary keyword. Current density is too low.");
    } else if (result.primaryKeyword.density > 0.04) {
      result.overuseWarnings.push("Your primary keyword density is too high, which could be seen as keyword stuffing.");
    }
  } else {
    result.recommendations.push("Set a primary keyword for this page to improve SEO.");
  }
  
  // Analyze secondary keywords
  if (secondaryKeywords && secondaryKeywords.length > 0) {
    for (const keyword of secondaryKeywords) {
      const keywordRegex = new RegExp('\\b' + keyword.toLowerCase() + '\\b', 'g');
      const matches = textContent.toLowerCase().match(keywordRegex);
      const count = matches ? matches.length : 0;
      const density = count / totalWords;
      
      result.secondaryKeywords.push({
        keyword,
        count,
        density
      });
      
      // Check for overuse
      if (density > 0.03) {
        result.overuseWarnings.push(`The secondary keyword "${keyword}" appears too frequently.`);
      }
    }
  }
  
  // Generate related keywords using OpenAI
  try {
    const prompt = `
    Based on this text content and primary keyword "${primaryKeyword}", suggest 5-10 
    semantically related keywords that could improve the SEO of this content. 
    Provide only a JSON array of keyword strings.
    
    Text content excerpt:
    ${textContent.substring(0, 500)}
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an SEO expert suggesting related keywords." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (response.choices && response.choices[0]?.message.content) {
      try {
        const parsedResponse = JSON.parse(response.choices[0].message.content);
        if (Array.isArray(parsedResponse) || Array.isArray(parsedResponse.keywords)) {
          result.relatedKeywords = Array.isArray(parsedResponse) ? 
            parsedResponse : parsedResponse.keywords;
        }
      } catch (e) {
        console.error('Failed to parse OpenAI response for related keywords:', e);
      }
    }
  } catch (error) {
    console.error('Error generating related keywords:', error);
  }
  
  // Additional general recommendations
  if (totalWords < 300) {
    result.recommendations.push("Add more content to this page. Short content typically ranks poorly.");
  }
  
  if (secondaryKeywords.length === 0) {
    result.recommendations.push("Add secondary keywords to improve the semantic richness of your content.");
  }
  
  if (secondaryKeywords.length > 0) {
    const missingKeywords = secondaryKeywords.filter(keyword => {
      const keywordRegex = new RegExp('\\b' + keyword.toLowerCase() + '\\b', 'g');
      return !textContent.toLowerCase().match(keywordRegex);
    });
    
    if (missingKeywords.length > 0) {
      result.recommendations.push(`Include these secondary keywords in your content: ${missingKeywords.join(', ')}`);
    }
  }
  
  return result;
}

/**
 * Generate variations of a keyword
 */
function generateKeywordVariations(keyword: string): string[] {
  // Simple implementation for demonstration
  const variations = [];
  
  // Add plural forms
  if (keyword.endsWith('y')) {
    variations.push(keyword.slice(0, -1) + 'ies');
  } else if (!keyword.endsWith('s')) {
    variations.push(keyword + 's');
  }
  
  // Add variations with common modifiers
  variations.push('best ' + keyword);
  variations.push(keyword + ' services');
  variations.push(keyword + ' near me');
  
  // Add industry-specific variations for accounting
  if (keyword.includes('account') || keyword.includes('tax') || keyword.includes('financial')) {
    variations.push('professional ' + keyword);
    variations.push(keyword + ' experts');
    variations.push(keyword + ' consulting');
  }
  
  return variations.filter(v => v !== keyword); // Filter out the original keyword
}

/**
 * Analyze mobile-friendliness of a page
 */
async function analyzeMobile(page: any) {
  // Simplified implementation for demonstration
  const result: any = {
    overallScore: 0,
    viewportConfiguration: {
      hasViewport: true,
      isResponsive: true,
      issues: []
    },
    tapTargets: {
      score: 85,
      issues: []
    },
    contentSizing: {
      score: 90,
      issues: []
    },
    textReadability: {
      score: 95,
      issues: []
    },
    issues: [],
    recommendations: []
  };
  
  // Check for viewport meta tag (assumed to be present in all pages)
  result.viewportConfiguration.hasViewport = true;
  result.viewportConfiguration.isResponsive = true;
  
  // Check if page has mobile-specific settings
  let hasMobileIssues = false;
  
  // Simulate analysis of components for mobile-friendliness
  if (page.sections && Array.isArray(page.sections)) {
    for (const section of page.sections) {
      if (section.components && Array.isArray(section.components)) {
        for (const component of section.components) {
          // Check for potential mobile issues based on component type
          if (component.type === 'image' && component.content?.fullWidth === true) {
            result.contentSizing.issues.push('Large full-width images may slow loading on mobile devices');
            result.contentSizing.score -= 10;
            hasMobileIssues = true;
          }
          
          if (component.type === 'button' && 
              component.content?.size === 'small') {
            result.tapTargets.issues.push('Small buttons may be difficult to tap on mobile devices');
            result.tapTargets.score -= 15;
            hasMobileIssues = true;
          }
          
          if (component.type === 'text' && 
              component.content?.fontSize && 
              parseInt(component.content.fontSize) < 16) {
            result.textReadability.issues.push('Small text size may be hard to read on mobile devices');
            result.textReadability.score -= 20;
            hasMobileIssues = true;
          }
        }
      }
    }
  }
  
  // Normalize scores to be between 0-100
  result.tapTargets.score = Math.max(0, Math.min(100, result.tapTargets.score));
  result.contentSizing.score = Math.max(0, Math.min(100, result.contentSizing.score));
  result.textReadability.score = Math.max(0, Math.min(100, result.textReadability.score));
  
  // Calculate overall score (weighted average)
  result.overallScore = Math.round(
    (result.viewportConfiguration.hasViewport ? 100 : 0) * 0.3 +
    result.tapTargets.score * 0.3 +
    result.contentSizing.score * 0.2 +
    result.textReadability.score * 0.2
  );
  
  // Compile all issues
  if (!result.viewportConfiguration.hasViewport) {
    result.issues.push({
      type: 'critical',
      description: 'Missing viewport meta tag',
      impact: 'Page will not adjust properly to mobile devices',
      recommendation: 'Add a viewport meta tag in the page header'
    });
  }
  
  if (result.tapTargets.issues.length > 0) {
    result.issues.push({
      type: 'major',
      description: 'Touch targets are too small',
      impact: 'Users may have difficulty interacting with small elements on mobile devices',
      recommendation: 'Ensure all interactive elements are at least 48px × 48px'
    });
  }
  
  if (result.contentSizing.issues.length > 0) {
    result.issues.push({
      type: 'medium',
      description: 'Content not optimized for mobile screens',
      impact: 'Images or content may overflow or require horizontal scrolling',
      recommendation: 'Use responsive images and flexible layouts that adapt to screen width'
    });
  }
  
  if (result.textReadability.issues.length > 0) {
    result.issues.push({
      type: 'minor',
      description: 'Text may be difficult to read on mobile devices',
      impact: 'Users may need to zoom in to read content',
      recommendation: 'Use a minimum font size of 16px for body text'
    });
  }
  
  // Generate recommendations
  result.recommendations = [
    'Ensure all interactive elements are at least 48px × 48px for easy tapping',
    'Use responsive images that scale properly on different screen sizes',
    'Maintain a minimum font size of 16px for body text',
    'Test your page on a variety of mobile devices and screen sizes',
    'Consider implementing a mobile-first design approach'
  ];
  
  if (hasMobileIssues) {
    result.recommendations.unshift('Address the mobile usability issues identified in this analysis');
  }
  
  return result;
}

/**
 * Perform competitor analysis based on keywords and industry
 */
async function performCompetitorAnalysis(keywords: string[], industry: string, pageUrl: string) {
  // Simulate competitor analysis with OpenAI
  try {
    const prompt = `
    Perform a competitive SEO analysis for a website in the ${industry} industry.
    The website's page is focused on: ${pageUrl}
    The main keywords are: ${keywords.join(', ')}
    
    Provide a comprehensive analysis including:
    1. Top 3-5 competitors for these keywords
    2. Strengths and weaknesses of each competitor
    3. A SWOT analysis of our position compared to competitors
    4. Specific content recommendations to outrank competitors
    
    Format your response as a detailed JSON object with sections for competitors, SWOT analysis, and recommendations.
    Each competitor should include name, URL, strengths, weaknesses, and unique factors.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert SEO competitive analyst providing detailed competitor analysis." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (!response.choices || !response.choices[0]?.message.content) {
      throw new Error('Empty response from OpenAI');
    }
    
    // Parse the response
    const parsedResponse = JSON.parse(response.choices[0].message.content);
    
    // Format and sanitize response for client
    return {
      competitors: parsedResponse.competitors || [],
      strengths: parsedResponse.strengths || [],
      weaknesses: parsedResponse.weaknesses || [],
      opportunities: parsedResponse.opportunities || [],
      recommendations: parsedResponse.recommendations || []
    };
  } catch (error) {
    console.error('Error performing competitor analysis:', error);
    
    // Return fallback analysis in case of error
    return {
      competitors: [],
      strengths: [],
      weaknesses: [],
      opportunities: [],
      recommendations: [
        'Perform manual competitor research for the keywords: ' + keywords.join(', '),
        'Look for content gaps your website could fill',
        'Analyze competitor backlink profiles',
        'Consider creating more comprehensive content than competitors'
      ]
    };
  }
}

/**
 * Generate content recommendations for outranking competitors
 */
async function generateCompetitorContentRecommendations(page: any, competitorIds: any[]) {
  // This would typically fetch data about the competitors
  // and use it to generate recommendations
  
  // For demo purposes, we'll return sample recommendations
  return {
    contentGaps: [
      'Detailed case studies showing real client results',
      'In-depth tax planning guides specific to your industry',
      'Video tutorials for common accounting tasks'
    ],
    structuralRecommendations: [
      'Include FAQ sections to target long-tail keywords',
      'Add comparison tables of services vs competitors',
      'Create interactive calculators to increase engagement'
    ],
    keywordOpportunities: [
      'Focus on local SEO terms combined with your services',
      'Target industry-specific long-tail keywords',
      'Use semantic variations of your primary keywords'
    ]
  };
}