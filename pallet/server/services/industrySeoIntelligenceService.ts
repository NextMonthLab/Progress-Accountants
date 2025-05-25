import OpenAI from "openai";
import { db } from "../db";
import { pageBuilderPages, PageSeoSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Industry verticals we support with specialized SEO recommendations
const INDUSTRY_VERTICALS = [
  "accounting",
  "finance",
  "legal",
  "healthcare",
  "technology",
  "retail",
  "manufacturing",
  "real_estate",
  "hospitality",
  "education",
  "consulting",
  "marketing"
] as const;

export type IndustryVertical = typeof INDUSTRY_VERTICALS[number];

// Industry-specific keywords data structure
export interface IndustryKeywordData {
  industry: IndustryVertical;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  localKeywords: string[];
  trendingKeywords: string[];
  lastUpdated: Date;
}

// Industry-specific content benchmarks
export interface IndustryContentBenchmark {
  industry: IndustryVertical;
  averageWordCount: number;
  keywordDensity: {
    [keyword: string]: number; // Percentage
  };
  headingStructure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    averageWordsPerHeading: number;
  };
  readabilityScore: number; // 0-100
  contentTypes: string[]; // E.g., "case-studies", "thought-leadership", "how-to-guides"
  topPerformingTopics: string[];
  lastUpdated: Date;
}

/**
 * Analyze a page and determine the most likely industry vertical
 * @param pageId Page ID to analyze
 * @returns The detected industry vertical
 */
export async function detectPageIndustry(pageId: number): Promise<IndustryVertical | null> {
  try {
    // Get page content
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      throw new Error("Page not found");
    }

    // Get business identity info from the database
    const businessIdentityResult = await db.execute(
      `SELECT data FROM business_identity WHERE tenant_id IS NULL OR tenant_id = $1 LIMIT 1`,
      ['00000000-0000-0000-0000-000000000000']
    );
    
    const businessIdentity = businessIdentityResult.rows[0]?.data || {};
    
    // Extract industry from business identity if available
    if (businessIdentity?.core?.industry && 
        INDUSTRY_VERTICALS.includes(businessIdentity.core.industry as IndustryVertical)) {
      return businessIdentity.core.industry as IndustryVertical;
    }
    
    // If not available, analyze page content to detect industry
    const prompt = `
    I'm going to provide you with a page title and SEO information. 
    Please analyze this information and determine the most likely industry vertical that this page belongs to.
    
    Page Title: ${page.title}
    SEO Title: ${page.seoSettings?.title || ''}
    SEO Description: ${page.seoSettings?.description || ''}
    SEO Keywords: ${page.seoSettings?.keywords?.join(', ') || ''}
    
    Based solely on this information, classify this page into exactly ONE of the following industry verticals:
    ${INDUSTRY_VERTICALS.join(', ')}
    
    Respond with only the industry vertical name, lowercase, with underscores for spaces if needed.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { role: "system", content: "You are an expert at classifying business content into industry verticals." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 50
    });
    
    const detectedIndustry = response.choices[0].message.content?.trim().toLowerCase();
    
    // Validate the detected industry is in our list
    if (detectedIndustry && INDUSTRY_VERTICALS.includes(detectedIndustry as IndustryVertical)) {
      return detectedIndustry as IndustryVertical;
    }
    
    // Default to accounting (our primary focus)
    return "accounting";
  } catch (error) {
    console.error("Error detecting page industry:", error);
    return null;
  }
}

/**
 * Get industry-specific keyword recommendations for a page
 * @param pageId Page ID to analyze
 * @returns Keyword recommendations by category
 */
export async function getIndustryKeywordRecommendations(pageId: number): Promise<IndustryKeywordData | null> {
  try {
    // First, detect the industry for this page
    const industry = await detectPageIndustry(pageId);
    
    if (!industry) {
      throw new Error("Could not detect industry for page");
    }
    
    // Get page content
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      throw new Error("Page not found");
    }
    
    // Get location information if available
    const businessIdentityResult = await db.execute(
      `SELECT data FROM business_identity WHERE tenant_id IS NULL OR tenant_id = $1 LIMIT 1`,
      ['00000000-0000-0000-0000-000000000000']
    );
    
    const businessIdentity = businessIdentityResult.rows[0]?.data || {};
    const location = businessIdentity?.core?.location || "UK";
    
    // Create prompt for OpenAI to generate industry-specific keywords
    const prompt = `
    Generate highly relevant, industry-specific SEO keywords for a ${industry} business page.
    
    Page Title: ${page.title}
    Page Purpose: ${page.seoSettings?.seoGoal || 'information'}
    Location: ${location}
    
    Return a comprehensive set of keywords organized into the following categories in JSON format:
    {
      "industry": "${industry}",
      "primaryKeywords": [], // 5-7 core industry-specific keywords
      "secondaryKeywords": [], // 8-12 supporting keywords
      "longTailKeywords": [], // 10-15 specific long-tail keyword phrases
      "localKeywords": [], // 5-7 location-specific variations
      "trendingKeywords": [] // 5-7 currently trending industry terms
    }
    
    Make sure all keywords are:
    1. Highly specific to the ${industry} industry
    2. Relevant to the page title and purpose
    3. Include a mix of transactional, informational, and navigational intent
    4. Tailored to the specified location when appropriate
    5. Include current industry terminology and trends
    
    DO NOT include generic keywords that aren't specifically relevant to ${industry}.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: `You are an expert SEO strategist specializing in ${industry} businesses. You excel at identifying high-value, industry-specific keywords.`
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
    const data = JSON.parse(contentStr) as Omit<IndustryKeywordData, "lastUpdated">;
    
    return {
      ...data,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error("Error getting industry keyword recommendations:", error);
    return null;
  }
}

/**
 * Get industry content benchmarks to compare against
 * @param industry The industry vertical to get benchmarks for
 * @returns Content benchmarks for the specified industry
 */
export async function getIndustryContentBenchmarks(industry: IndustryVertical): Promise<IndustryContentBenchmark | null> {
  try {
    const prompt = `
    Provide the current content benchmarks for high-performing pages in the ${industry} industry.
    
    Return the benchmarks in the following JSON format:
    {
      "industry": "${industry}",
      "averageWordCount": 0, // Average word count for top-performing content
      "keywordDensity": {
        // Average keyword density percentages for primary keywords
        "keyword1": 0.0,
        "keyword2": 0.0
      },
      "headingStructure": {
        "h1Count": 0, // Typically 1
        "h2Count": 0, // Average number of H2 headings
        "h3Count": 0, // Average number of H3 headings
        "averageWordsPerHeading": 0 // Average words per heading
      },
      "readabilityScore": 0, // 0-100 score, higher is more readable
      "contentTypes": [], // Most effective content types for this industry
      "topPerformingTopics": [] // Current top-performing topics in this industry
    }
    
    Provide accurate, research-based benchmarks specifically for the ${industry} industry based on current SEO best practices.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: `You are an SEO content strategist with deep expertise in ${industry} content benchmarking. You have access to the latest industry data and best practices.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the response
    const data = JSON.parse(contentStr) as Omit<IndustryContentBenchmark, "lastUpdated">;
    
    return {
      ...data,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error(`Error getting ${industry} industry content benchmarks:`, error);
    return null;
  }
}

/**
 * Compare page content against industry benchmarks and provide optimization recommendations
 * @param pageId Page ID to analyze
 * @returns Optimization recommendations based on industry benchmarks
 */
export async function getIndustryBenchmarkComparison(pageId: number): Promise<any> {
  try {
    // First, detect the industry for this page
    const industry = await detectPageIndustry(pageId);
    
    if (!industry) {
      throw new Error("Could not detect industry for page");
    }
    
    // Get the industry benchmarks
    const benchmarks = await getIndustryContentBenchmarks(industry);
    
    if (!benchmarks) {
      throw new Error("Could not retrieve industry benchmarks");
    }
    
    // Get page content and details
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      throw new Error("Page not found");
    }
    
    // Get page content from components
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
      .join(' ');
    
    // Count words, headings, etc.
    const wordCount = pageText.split(/\s+/).filter(Boolean).length;
    
    // Create prompt for OpenAI to compare against benchmarks
    const prompt = `
    Compare this page content against industry benchmarks for the ${industry} industry and provide optimization recommendations.
    
    Page Title: ${page.title}
    Page Word Count: ${wordCount}
    Page SEO Settings: ${JSON.stringify(page.seoSettings || {})}
    
    Industry Benchmarks:
    ${JSON.stringify(benchmarks, null, 2)}
    
    Analyze the gap between this page and industry benchmarks, then provide actionable recommendations in the following JSON format:
    {
      "comparisonResults": {
        "wordCountComparison": {
          "pageWordCount": ${wordCount},
          "industryAverage": ${benchmarks.averageWordCount},
          "percentageDifference": 0, // Calculate percentage difference
          "recommendation": "" // E.g., "Increase content length by X words"
        },
        "contentStructureComparison": {
          "assessment": "", // Assessment of current structure vs benchmark
          "recommendations": [] // List of specific recommendations
        },
        "keywordOptimizationSuggestions": {
          "missingKeywords": [], // Important industry keywords missing from content
          "underutilizedKeywords": [], // Keywords with density lower than benchmark
          "overutilizedKeywords": [], // Keywords with density higher than benchmark
          "recommendedKeywordChanges": [] // Specific changes to make
        }
      },
      "prioritizedActions": [] // Top 3-5 actions to take, in order of importance
    }
    
    Provide specific, actionable recommendations that will help this page meet or exceed industry benchmarks.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: `You are an expert SEO content analyst specializing in the ${industry} industry. You provide clear, actionable content recommendations based on industry benchmarks.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the response
    return JSON.parse(contentStr);
  } catch (error) {
    console.error(`Error comparing page against industry benchmarks:`, error);
    return null;
  }
}