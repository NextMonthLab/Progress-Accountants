import OpenAI from "openai";
import { db } from "../db";
import { pageBuilderPages, pageBuilderComponents, pageBuilderSections, pageBuilderRecommendations } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SEO score category weights
const SEO_WEIGHTS = {
  title: 0.15,
  description: 0.15,
  keywords: 0.1,
  content: 0.25,
  structure: 0.15,
  images: 0.1,
  performance: 0.1
};

export interface SeoScore {
  overallScore: number;
  categoryScores: {
    title: number;
    description: number;
    keywords: number;
    content: number;
    structure: number;
    images: number;
    performance: number;
  };
  analysis: {
    title: string;
    description: string;
    keywords: string;
    content: string;
    structure: string;
    images: string;
    performance: string;
  };
}

export interface SeoRecommendation {
  pageId: number;
  type: 'title' | 'description' | 'keywords' | 'content' | 'headings' | 'images' | 'structure' | 'error';
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  implementationHint: string;
  originalValue: string;
  suggestedValue: string;
  isDismissed: boolean;
}

/**
 * Calculates SEO score for a specific page
 * @param pageId - ID of the page to analyze
 * @returns SEO score and analysis
 */
export async function calculateSeoScore(pageId: number): Promise<SeoScore> {
  try {
    // Get page with its sections and components
    const page = await getPageWithComponents(pageId);
    
    if (!page) {
      throw new Error("Page not found");
    }

    // Extract page content and metadata for analysis
    const pageContent = extractPageContent(page);
    
    if (!process.env.OPENAI_API_KEY) {
      // If no API key, return a default score with warnings
      return getDefaultSeoScore();
    }

    // Access the SEO metadata from the page
    const pageSeo = page.seo as any || {};
    const pageName = page.name || 'Untitled Page';
    
    // Prepare prompt for OpenAI
    const prompt = `
      Please analyze the following webpage content for SEO effectiveness and provide a detailed analysis with scores from 0-100 for each category:

      Page Title: ${pageSeo.title || pageName || 'No title'}
      Meta Description: ${pageSeo.description || 'No description'}
      Primary Keyword: ${pageSeo.primaryKeyword || 'Not specified'}
      Keywords: ${JSON.stringify(pageSeo.keywords || [])}
      
      Page Structure:
      ${pageContent.headings.map(h => `${h.level}: ${h.text}`).join('\n')}
      
      Content Extract:
      ${pageContent.texts.join('\n').substring(0, 1500)}

      Image Usage:
      Total Images: ${pageContent.images.length}
      Images with Alt Text: ${pageContent.images.filter(img => img.alt).length}
      
      Please return your analysis as a valid JSON object with the following structure:
      {
        "categoryScores": {
          "title": [0-100],
          "description": [0-100],
          "keywords": [0-100],
          "content": [0-100],
          "structure": [0-100],
          "images": [0-100],
          "performance": [0-100]
        },
        "analysis": {
          "title": "Detailed analysis of title effectiveness...",
          "description": "Detailed analysis of meta description...",
          "keywords": "Detailed analysis of keyword usage...",
          "content": "Detailed analysis of content quality and relevance...",
          "structure": "Detailed analysis of page structure (headings, etc)...",
          "images": "Detailed analysis of image usage and optimization...",
          "performance": "Analysis of potential performance factors..."
        }
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert SEO analyst who provides detailed, actionable SEO analysis. You focus on modern SEO best practices and provide numerical scores based on effectiveness."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const aiAnalysis = JSON.parse(response.choices[0].message.content);
    
    // Calculate overall score as weighted average
    const overallScore = calculateOverallScore(aiAnalysis.categoryScores);
    
    return {
      overallScore,
      categoryScores: aiAnalysis.categoryScores,
      analysis: aiAnalysis.analysis
    };
  } catch (error) {
    console.error("Error calculating SEO score:", error);
    // Return a default score in case of errors
    return getDefaultSeoScore();
  }
}

/**
 * Generates SEO recommendations for a specific page
 * @param pageId - ID of the page to analyze
 * @returns Array of SEO recommendations
 */
export async function generateSeoRecommendations(pageId: number): Promise<SeoRecommendation[]> {
  try {
    // Get page with its sections and components
    const page = await getPageWithComponents(pageId);
    
    if (!page) {
      throw new Error("Page not found");
    }

    // Extract page content and metadata for analysis
    const pageContent = extractPageContent(page);
    
    if (!process.env.OPENAI_API_KEY) {
      // If no API key, return generic recommendations
      return getDefaultRecommendations(pageId);
    }

    // Access the SEO metadata from the page
    const pageSeo = page.seo as any || {};
    const pageName = page.name || 'Untitled Page';
    
    // Prepare prompt for OpenAI
    const prompt = `
      Please analyze the following webpage content and provide specific, actionable SEO recommendations:

      Page Title: ${pageSeo.title || pageName || 'No title'}
      Meta Description: ${pageSeo.description || 'No description'}
      Primary Keyword: ${pageSeo.primaryKeyword || 'Not specified'}
      Keywords: ${JSON.stringify(pageSeo.keywords || [])}
      
      Page Structure:
      ${pageContent.headings.map(h => `${h.level}: ${h.text}`).join('\n')}
      
      Content Extract:
      ${pageContent.texts.join('\n').substring(0, 1500)}

      Image Usage:
      Total Images: ${pageContent.images.length}
      Images with Alt Text: ${pageContent.images.filter(img => img.alt).length}
      
      Please return 3-5 specific recommendations as a valid JSON array with each recommendation having the following structure:
      [
        {
          "type": "title" | "description" | "keywords" | "content" | "headings" | "images" | "structure",
          "priority": "high" | "medium" | "low",
          "recommendation": "Clear explanation of the issue...",
          "implementationHint": "How to implement the recommendation...",
          "originalValue": "The current problematic value if applicable...",
          "suggestedValue": "A specific suggestion for improvement..."
        },
        // More recommendations...
      ]
      
      Focus on the most impactful changes first. For each issue, provide concrete, implementable fixes.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert SEO consultant who provides specific, actionable recommendations to improve website SEO. You focus on practical, high-impact changes."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const aiRecommendations = JSON.parse(response.choices[0].message.content);
    
    if (!Array.isArray(aiRecommendations)) {
      throw new Error("Invalid response format from AI");
    }
    
    // Format and save recommendations
    const recommendations = aiRecommendations.map(rec => ({
      pageId,
      type: rec.type,
      priority: rec.priority,
      recommendation: rec.recommendation,
      implementationHint: rec.implementationHint,
      originalValue: rec.originalValue || "",
      suggestedValue: rec.suggestedValue || "",
      isDismissed: false
    }));
    
    // Store recommendations in the database
    await storeRecommendations(pageId, recommendations);
    
    return recommendations;
  } catch (error) {
    console.error("Error generating SEO recommendations:", error);
    // Return default recommendations in case of errors
    return getDefaultRecommendations(pageId);
  }
}

/**
 * Apply a recommendation to update page SEO settings
 * @param recommendationId - ID of the recommendation to apply
 * @returns Success status
 */
export async function applyRecommendation(recommendationId: number): Promise<boolean> {
  try {
    // Get the recommendation
    const [recommendation] = await db
      .select()
      .from(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.id, recommendationId));
    
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }
    
    // Get the page
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, recommendation.pageId));
    
    if (!page) {
      throw new Error("Page not found");
    }
    
    // Update the page based on recommendation type
    const currentSeo = page.seo || {};
    let updatedSeo = { ...currentSeo };
    
    switch (recommendation.type) {
      case 'title':
        updatedSeo.title = recommendation.suggestedValue;
        break;
      case 'description':
        updatedSeo.description = recommendation.suggestedValue;
        break;
      case 'keywords':
        try {
          updatedSeo.keywords = JSON.parse(recommendation.suggestedValue);
        } catch (e) {
          console.error("Error parsing keywords:", e);
          updatedSeo.keywords = recommendation.suggestedValue.split(',').map(k => k.trim());
        }
        break;
      // Other types would require more complex handling
    }
    
    // Update the page's SEO settings
    await db
      .update(pageBuilderPages)
      .set({ 
        seo: updatedSeo,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderPages.id, page.id));
    
    // Mark the recommendation as applied
    await db
      .update(pageBuilderRecommendations)
      .set({ 
        applied: true,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderRecommendations.id, recommendationId));
    
    return true;
  } catch (error) {
    console.error("Error applying recommendation:", error);
    return false;
  }
}

/**
 * Dismiss a recommendation (mark as ignored)
 * @param recommendationId - ID of the recommendation to dismiss
 * @returns Success status
 */
export async function dismissRecommendation(recommendationId: number): Promise<boolean> {
  try {
    await db
      .update(pageBuilderRecommendations)
      .set({ 
        dismissed: true,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderRecommendations.id, recommendationId));
    
    return true;
  } catch (error) {
    console.error("Error dismissing recommendation:", error);
    return false;
  }
}

/**
 * Get all SEO recommendations for a page
 * @param pageId - ID of the page
 * @returns Array of recommendations
 */
export async function getPageRecommendations(pageId: number): Promise<any[]> {
  try {
    const recommendations = await db
      .select()
      .from(pageBuilderRecommendations)
      .where(
        and(
          eq(pageBuilderRecommendations.pageId, pageId),
          eq(pageBuilderRecommendations.dismissed, false)
        )
      )
      .orderBy(db.sql`CASE 
        WHEN ${pageBuilderRecommendations.priority} = 'high' THEN 1
        WHEN ${pageBuilderRecommendations.priority} = 'medium' THEN 2
        WHEN ${pageBuilderRecommendations.priority} = 'low' THEN 3
        ELSE 4
      END`);
    
    return recommendations;
  } catch (error) {
    console.error("Error fetching page recommendations:", error);
    return [];
  }
}

// Helper functions

/**
 * Retrieves a page with all its sections and components
 */
async function getPageWithComponents(pageId: number) {
  try {
    // Get the page
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      return null;
    }
    
    // Get all sections for the page
    const sections = await db
      .select()
      .from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, pageId))
      .orderBy(pageBuilderSections.order);
    
    // Get all components for each section
    const sectionIds = sections.map(section => section.id);
    const components = sectionIds.length > 0 
      ? await db
          .select()
          .from(pageBuilderComponents)
          .where(pageBuilderComponents.sectionId.in(sectionIds))
          .orderBy(pageBuilderComponents.order)
      : [];
    
    // Add components to their respective sections
    const sectionsWithComponents = sections.map(section => ({
      ...section,
      components: components.filter(comp => comp.sectionId === section.id)
    }));
    
    // Return the complete page structure
    return {
      ...page,
      sections: sectionsWithComponents
    };
  } catch (error) {
    console.error("Error fetching page with components:", error);
    return null;
  }
}

/**
 * Extracts content elements from a page for SEO analysis
 */
function extractPageContent(page: any) {
  const texts: string[] = [];
  const headings: { level: string, text: string }[] = [];
  const images: { src: string, alt: string }[] = [];
  
  // Process all sections and their components
  if (page.sections) {
    page.sections.forEach((section: any) => {
      if (section.components) {
        section.components.forEach((component: any) => {
          // Extract content based on component type
          if (component.content) {
            // Text content
            if (component.type === 'text' || component.type === 'richtext' || component.type === 'paragraph') {
              texts.push(component.content.text || '');
            }
            
            // Headings
            if (component.type === 'heading') {
              headings.push({
                level: `h${component.content.level || 2}`,
                text: component.content.text || ''
              });
            }
            
            // Images
            if (component.type === 'image') {
              images.push({
                src: component.content.src || '',
                alt: component.content.alt || ''
              });
            }
          }
        });
      }
    });
  }
  
  return { texts, headings, images };
}

/**
 * Calculate overall SEO score from category scores
 */
function calculateOverallScore(categoryScores: any): number {
  let weightedScore = 0;
  let totalWeight = 0;
  
  for (const [category, weight] of Object.entries(SEO_WEIGHTS)) {
    if (categoryScores[category] !== undefined) {
      weightedScore += categoryScores[category] * weight;
      totalWeight += weight;
    }
  }
  
  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
}

/**
 * Store recommendations in the database
 */
async function storeRecommendations(pageId: number, recommendations: SeoRecommendation[]) {
  try {
    // First, clear existing non-dismissed recommendations
    await db
      .delete(pageBuilderRecommendations)
      .where(
        and(
          eq(pageBuilderRecommendations.pageId, pageId),
          eq(pageBuilderRecommendations.dismissed, false),
          eq(pageBuilderRecommendations.applied, false)
        )
      );
    
    // Then insert new recommendations
    if (recommendations.length > 0) {
      const now = new Date();
      await db.insert(pageBuilderRecommendations).values(
        recommendations.map(rec => ({
          pageId: rec.pageId,
          type: rec.type,
          message: rec.recommendation,
          severity: rec.priority,
          details: rec.implementationHint,
          improvement: rec.suggestedValue,
          affectedComponents: JSON.stringify({ original: rec.originalValue }),
          autoFixAvailable: rec.type === 'title' || rec.type === 'description' || rec.type === 'keywords',
          dismissed: false,
          applied: false,
          createdAt: now,
          updatedAt: now
        }))
      );
    }
  } catch (error) {
    console.error("Error storing recommendations:", error);
  }
}

/**
 * Get a default SEO score when AI analysis is not available
 */
function getDefaultSeoScore(): SeoScore {
  return {
    overallScore: 50,
    categoryScores: {
      title: 50,
      description: 50,
      keywords: 50,
      content: 50,
      structure: 50,
      images: 50,
      performance: 50
    },
    analysis: {
      title: "Please ensure your title is descriptive and contains your primary keyword. Aim for 50-60 characters.",
      description: "Meta descriptions should be compelling and include key terms. Aim for 120-155 characters.",
      keywords: "Include your primary keyword and relevant secondary keywords throughout your content naturally.",
      content: "Content should be valuable, original, and comprehensive. Use your keywords naturally.",
      structure: "Use proper heading hierarchy (H1, H2, H3) to structure your content logically.",
      images: "All images should have descriptive alt text and be optimized for web.",
      performance: "Page speed is a ranking factor. Optimize images and minimize unnecessary scripts."
    }
  };
}

/**
 * Get default SEO recommendations when AI analysis is not available
 */
function getDefaultRecommendations(pageId: number): SeoRecommendation[] {
  return [
    {
      pageId,
      type: 'title',
      priority: 'high',
      recommendation: "Optimize your page title",
      implementationHint: "Include your primary keyword in the title, preferably near the beginning. Keep it under 60 characters.",
      originalValue: "",
      suggestedValue: "",
      isDismissed: false
    },
    {
      pageId,
      type: 'description',
      priority: 'medium',
      recommendation: "Improve your meta description",
      implementationHint: "Write a compelling description that includes your primary and secondary keywords. Keep it between 120-155 characters.",
      originalValue: "",
      suggestedValue: "",
      isDismissed: false
    },
    {
      pageId,
      type: 'content',
      priority: 'medium',
      recommendation: "Enhance content readability",
      implementationHint: "Break up text with subheadings, use bullet points, and keep paragraphs short. Aim for a Flesch reading ease score above 60.",
      originalValue: "",
      suggestedValue: "",
      isDismissed: false
    }
  ];
}