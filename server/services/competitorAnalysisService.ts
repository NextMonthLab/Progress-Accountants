import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interface for competitor analysis results
export interface CompetitorAnalysisResult {
  competitors: CompetitorInfo[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendations: string[];
}

export interface CompetitorInfo {
  name: string;
  url?: string;
  strengths: string[];
  weaknesses: string[];
  keywordOverlap: string[];
  uniqueFactors: string[];
}

/**
 * Analyze market competitive landscape based on keywords and industry
 * @param keywords - List of targeted keywords
 * @param industry - Industry of the website
 * @param pageUrl - Current page URL or path
 * @returns Competitive analysis with key strengths and weaknesses
 */
export async function analyzeCompetitors(
  keywords: string[],
  industry: string,
  pageUrl: string
): Promise<CompetitorAnalysisResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return getDefaultCompetitorAnalysis();
    }
    
    const primaryKeyword = keywords.length > 0 ? keywords[0] : '';
    const allKeywords = keywords.join(', ');
    
    // Prepare prompt for OpenAI
    const prompt = `
      Please analyze the competitive SEO landscape for a ${industry} business targeting the following keywords: ${allKeywords}.
      The current page URL is: ${pageUrl}
      
      Provide a detailed competitive analysis including:
      1. Top 3-5 competitors in this space
      2. Their key strengths and weaknesses
      3. Keyword overlap and unique selling propositions
      4. SWOT analysis for our site compared to competitors
      5. Specific recommendations to improve competitiveness
      
      Return your analysis as a valid JSON object with the following structure:
      {
        "competitors": [
          {
            "name": "Competitor Name",
            "url": "competitor.com", 
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "keywordOverlap": ["keyword1", "keyword2"],
            "uniqueFactors": ["factor1", "factor2"]
          }
        ],
        "strengths": ["Our site strength1", "Our site strength2"],
        "weaknesses": ["Our site weakness1", "Our site weakness2"],
        "opportunities": ["opportunity1", "opportunity2"],
        "recommendations": ["recommendation1", "recommendation2"]
      }
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert SEO and competitive analysis consultant with deep knowledge of various industries. You provide detailed, data-driven insights on competitive positioning and SEO strategy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    const analysis = JSON.parse(contentStr);
    
    return {
      competitors: analysis.competitors || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      opportunities: analysis.opportunities || [],
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error("Error analyzing competitors:", error);
    return getDefaultCompetitorAnalysis();
  }
}

/**
 * Generate content recommendations for competing effectively
 * @param pageId - ID of the page
 * @param primaryKeyword - Primary targeted keyword
 * @param competitorUrls - List of competitor URLs
 * @returns Content recommendations to outrank competitors
 */
export async function generateCompetitorContentRecommendations(
  pageId: number,
  primaryKeyword: string,
  competitorUrls: string[]
): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return [
        "Upgrade your content with more detailed information than competitors",
        "Add unique data points or statistics that competitors don't mention",
        "Include more comprehensive guides or tutorials",
        "Create content that addresses common questions your competitors don't answer"
      ];
    }
    
    // Prepare competitor URLs string
    const competitorUrlsStr = competitorUrls.length > 0 
      ? competitorUrls.join(', ') 
      : "No specific competitor URLs provided";
    
    // Prepare prompt for OpenAI
    const prompt = `
      Generate specific content recommendations to help us outrank competitors for the keyword "${primaryKeyword}".
      
      Page ID: ${pageId}
      Competing with: ${competitorUrlsStr}
      
      Please provide 5-7 specific content recommendations that would help our page outrank competitors.
      Focus on content depth, expertise signals, unique value, and comprehensiveness.
      
      Return your recommendations as a JSON array of strings.
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert SEO content strategist who helps businesses outrank their competitors with superior content. You provide specific, actionable content recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    const recommendationsObj = JSON.parse(contentStr);
    
    if (Array.isArray(recommendationsObj)) {
      return recommendationsObj;
    } else if (Array.isArray(recommendationsObj.recommendations)) {
      return recommendationsObj.recommendations;
    } else {
      throw new Error("Invalid recommendations format received");
    }
  } catch (error) {
    console.error("Error generating competitor content recommendations:", error);
    return [
      "Create more comprehensive content that addresses user questions in depth",
      "Include expert insights or quotes that demonstrate authority",
      "Add unique data points or case studies that competitors don't have",
      "Structure content with clear headings and a logical flow",
      "Incorporate more visual elements like charts or infographics"
    ];
  }
}

/**
 * Default competitor analysis when API is unavailable
 */
function getDefaultCompetitorAnalysis(): CompetitorAnalysisResult {
  return {
    competitors: [
      {
        name: "Generic Competitor 1",
        strengths: ["Strong domain authority", "Comprehensive content"],
        weaknesses: ["Outdated information", "Poor mobile experience"],
        keywordOverlap: ["Primary keywords"],
        uniqueFactors: ["Industry expertise"]
      },
      {
        name: "Generic Competitor 2",
        strengths: ["Technical SEO optimization", "Strong backlink profile"],
        weaknesses: ["Limited content depth", "Poor user experience"],
        keywordOverlap: ["Secondary keywords"],
        uniqueFactors: ["Visual content quality"]
      }
    ],
    strengths: [
      "Content quality and depth",
      "Mobile-friendly design",
      "Clear page structure"
    ],
    weaknesses: [
      "Fewer backlinks than competitors",
      "Less comprehensive keyword coverage",
      "Newer domain with less authority"
    ],
    opportunities: [
      "Create more in-depth content for target keywords",
      "Implement structured data markup",
      "Improve internal linking structure",
      "Build quality backlinks from industry sources"
    ],
    recommendations: [
      "Add more comprehensive content with expert insights",
      "Improve page loading speed for better performance",
      "Include more media (images, videos, infographics)",
      "Target long-tail keyword variations",
      "Enhance meta descriptions and title tags"
    ]
  };
}