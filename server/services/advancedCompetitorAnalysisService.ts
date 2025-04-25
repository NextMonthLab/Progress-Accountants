import OpenAI from "openai";
import { db } from "../db";
import { pageBuilderPages } from "@shared/schema";
import { eq } from "drizzle-orm";
import { IndustryVertical, detectPageIndustry } from "./industrySeoIntelligenceService";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Competitor analysis result structure
export interface CompetitorInsight {
  url: string;
  title: string;
  description: string;
  strongKeywords: string[];
  contentQuality: number; // 1-10 score
  contentLength: number;
  averageWordCount: number;
  headingStructure: {
    h1: number;
    h2: number;
    h3Plus: number;
  };
  mediaUsage: {
    images: number;
    videos: number;
    hasInfographics: boolean;
  };
  uniqueSellingPoints: string[];
  contentGaps: string[];
  schemaMarkup: boolean;
  contentTopics: string[];
}

export interface CompetitorAnalysisResult {
  industry: IndustryVertical;
  queryTerm: string;
  competitorInsights: CompetitorInsight[];
  topKeywords: {
    [keyword: string]: number; // Frequency count
  };
  topContentTypes: {
    [contentType: string]: number; // Frequency count
  };
  contentLengthStats: {
    min: number;
    max: number;
    average: number;
  };
  overallInsights: string[];
  contentOpportunities: string[];
  recommendedKeywords: string[];
  keywordGaps: string[];
  contentStrategyRecommendations: string[];
  analyzedAt: Date;
}

/**
 * Perform advanced analysis of top competitors for a specific query term
 * @param queryTerm The search term to analyze competitors for
 * @param industry The industry vertical context
 * @returns Detailed competitive analysis data
 */
export async function analyzeCompetitorsForTerm(
  queryTerm: string, 
  industry: IndustryVertical
): Promise<CompetitorAnalysisResult | null> {
  try {
    // Base URLs for top competitors in the accounting space
    // In a real implementation, this would be replaced with an actual API call to search engines
    const competitorUrls = [
      `https://example-${industry}-firm1.com/services/${queryTerm}`,
      `https://example-${industry}-firm2.com/solutions/${queryTerm}`,
      `https://example-${industry}-firm3.com/expertise/${queryTerm}`,
      `https://example-${industry}-firm4.com/${queryTerm}`,
      `https://example-${industry}-firm5.com/resources/${queryTerm}`
    ];
    
    const prompt = `
    Perform an advanced competitive SEO analysis for the search term "${queryTerm}" in the ${industry} industry.
    
    For this analysis, imagine you've examined the following top 5 competitors:
    ${competitorUrls.join('\n')}
    
    Based on your expertise in SEO and the ${industry} industry, create a detailed competitive analysis with realistic data in the following JSON format:
    {
      "industry": "${industry}",
      "queryTerm": "${queryTerm}",
      "competitorInsights": [
        // Array of 5 competitor insights
        {
          "url": "", // Competitor URL
          "title": "", // Page title
          "description": "", // Meta description
          "strongKeywords": [], // Keywords they rank strongly for
          "contentQuality": 0, // 1-10 score
          "contentLength": 0, // Approximate word count
          "averageWordCount": 0, // Average words per paragraph
          "headingStructure": {
            "h1": 0, // Count of H1 tags
            "h2": 0, // Count of H2 tags
            "h3Plus": 0 // Count of H3+ tags
          },
          "mediaUsage": {
            "images": 0, // Count of images
            "videos": 0, // Count of videos
            "hasInfographics": false // Contains infographics?
          },
          "uniqueSellingPoints": [], // Unique value propositions
          "contentGaps": [], // Topics they missed
          "schemaMarkup": false, // Uses schema markup?
          "contentTopics": [] // Main topics covered
        }
      ],
      "topKeywords": {
        // Common keywords and their frequency
      },
      "topContentTypes": {
        // Content types and their frequency
      },
      "contentLengthStats": {
        "min": 0,
        "max": 0,
        "average": 0
      },
      "overallInsights": [], // General insights across competitors
      "contentOpportunities": [], // Content gaps to exploit
      "recommendedKeywords": [], // Keywords to target based on analysis
      "keywordGaps": [], // Keywords competitors are missing
      "contentStrategyRecommendations": [] // Strategic recommendations
    }
    
    Create a realistic, detailed analysis that would actually be useful for a ${industry} business looking to compete for the term "${queryTerm}".
    Provide specific, actionable insights and recommendations.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: `You are an expert SEO consultant specializing in competitive analysis for ${industry} businesses. You have access to advanced SEO tools and can analyze competitors in detail.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });
    
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the response
    const data = JSON.parse(contentStr) as Omit<CompetitorAnalysisResult, "analyzedAt">;
    
    return {
      ...data,
      analyzedAt: new Date()
    };
  } catch (error) {
    console.error("Error performing competitor analysis:", error);
    return null;
  }
}

/**
 * Generate optimized content recommendations based on competitor analysis
 * @param pageId ID of the page to generate recommendations for
 * @param competitorData Competitor analysis data (optional - will be generated if not provided)
 * @returns Content optimization recommendations
 */
export async function generateContentRecommendationsFromCompetitors(
  pageId: number,
  competitorData?: CompetitorAnalysisResult
): Promise<any> {
  try {
    // Get page data
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      throw new Error("Page not found");
    }
    
    // Get the industry for this page
    const industry = await detectPageIndustry(pageId);
    
    if (!industry) {
      throw new Error("Could not detect industry for page");
    }
    
    // If competitor data wasn't provided, generate it
    // Use the primary keyword or page title as the query term
    const queryTerm = page.seoSettings?.primaryKeyword || page.title;
    
    if (!competitorData) {
      competitorData = await analyzeCompetitorsForTerm(queryTerm, industry);
      
      if (!competitorData) {
        throw new Error("Failed to generate competitor analysis");
      }
    }
    
    // Extract page content from components
    const componentsResult = await db.execute(
      `SELECT data FROM page_builder_components WHERE section_id IN 
       (SELECT id FROM page_builder_sections WHERE page_id = $1)`,
      [pageId]
    );
    
    // Extract text content from components
    const components = componentsResult.rows.map(row => row.data);
    const pageText = components
      .map(component => {
        if (typeof component === 'object' && component !== null) {
          return Object.values(component)
            .filter(value => typeof value === 'string')
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .substring(0, 4000); // Limit text length for the prompt
    
    const prompt = `
    Compare this ${industry} business page with competitor analysis data and generate content optimization recommendations.
    
    Page Title: ${page.title}
    Page Content Excerpt:
    ${pageText}
    
    SEO Settings:
    ${JSON.stringify(page.seoSettings || {})}
    
    Competitor Analysis:
    ${JSON.stringify(competitorData, null, 2)}
    
    Based on the competitor analysis, provide specific, actionable content recommendations in the following JSON format:
    {
      "contentGapAnalysis": {
        "missingTopics": [], // Topics competitors cover that this page doesn't
        "underdevelopedTopics": [], // Topics that need more depth
        "competitiveAdvantages": [] // Topics where this page could create an advantage
      },
      "contentOptimizations": {
        "structureRecommendations": {
          "headings": [], // Recommended heading structure
          "paragraphLength": "", // Paragraph length recommendation
          "contentOrganization": [] // Content organization improvements
        },
        "keywordOptimizations": {
          "primaryKeywordRecommendation": "", // Primary keyword recommendation
          "secondaryKeywordsToAdd": [], // Secondary keywords to incorporate
          "keywordPlacementSuggestions": [] // Where to place keywords
        },
        "mediaRecommendations": {
          "imageRecommendations": [], // Image recommendations
          "videoSuggestions": [], // Video content suggestions
          "infographicIdeas": [] // Infographic concept ideas
        }
      },
      "contentGenerationSuggestions": {
        "headlineSuggestions": [], // Compelling headline suggestions
        "introductionImprovements": "", // Introduction optimization
        "contentBlockIdeas": [], // Content block ideas
        "callToActionSuggestions": [] // CTA improvements
      },
      "prioritizedActions": [] // Top 5 actions to take, in priority order
    }
    
    Provide specific, actionable recommendations that will help this page outperform competitors for the term "${queryTerm}".
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: `You are an expert SEO content strategist specializing in ${industry} businesses. You excel at identifying content opportunities based on competitor analysis.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the response
    return JSON.parse(contentStr);
  } catch (error) {
    console.error("Error generating competitor-based content recommendations:", error);
    return null;
  }
}

/**
 * Identify trending content topics based on competitor analysis
 * @param industry Industry vertical to analyze
 * @returns List of trending topics with popularity scores
 */
export async function identifyTrendingTopics(industry: IndustryVertical): Promise<any> {
  try {
    const prompt = `
    Identify the current trending content topics in the ${industry} industry based on competitor analysis.
    
    Return the results in the following JSON format:
    {
      "industry": "${industry}",
      "trendingTopics": [
        {
          "topic": "", // Topic name
          "popularityScore": 0, // 1-10 score
          "searchVolumeTrend": "increasing|stable|decreasing", // Search trend
          "competitorCoverage": 0, // Percentage of competitors covering it (0-100)
          "contentTypes": [], // Effective content types for this topic
          "keySubtopics": [], // Key subtopics within this trend
          "targetAudience": [], // Audience segments most interested
          "recommendedApproach": "" // How to approach this topic
        }
      ],
      "emergingTrends": [], // Just starting to gain traction
      "decliningTrends": [], // Losing relevance
      "topicOpportunityScore": {}, // Opportunity score for each topic (1-10)
      "seasonalTopics": {
        "current": [], // Current seasonal topics
        "upcoming": [] // Upcoming seasonal topics
      }
    }
    
    Provide realistic, accurate trending topics specific to the ${industry} industry based on current market conditions.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: `You are a trend analysis expert specializing in ${industry} content marketing. You have access to the latest industry research and competitor data.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });
    
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the response
    return JSON.parse(contentStr);
  } catch (error) {
    console.error(`Error identifying trending topics for ${industry}:`, error);
    return null;
  }
}