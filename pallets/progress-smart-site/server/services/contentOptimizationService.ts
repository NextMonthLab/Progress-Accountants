import OpenAI from "openai";
import { db } from "../db";
import { pageBuilderPages, pageBuilderSections, pageBuilderComponents } from "@shared/schema";
import { eq } from "drizzle-orm";
import { getIndustryBenchmarkComparison } from "./industrySeoIntelligenceService";
import { generateContentRecommendationsFromCompetitors } from "./advancedCompetitorAnalysisService";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ContentOptimizationRequest {
  pageId: number;
  optimizationGoal: 'conversion' | 'engagement' | 'traffic' | 'authority';
  includeIndustryBenchmarks?: boolean;
  includeCompetitorAnalysis?: boolean;
  targetKeywords?: string[];
  contentReadabilityLevel?: 'basic' | 'intermediate' | 'advanced';
}

export interface ContentOptimizationResponse {
  pageId: number;
  originalScore: number;
  projectedScore: number;
  titleSuggestions: string[];
  metaDescriptionSuggestions: string[];
  contentImprovements: {
    sectionId: number;
    componentId?: number;
    originalContent?: string;
    optimizedContent: string;
    improvementReason: string;
    seoImpact: number; // 1-10 scale
  }[];
  keywordOptimizations: {
    keyword: string;
    currentDensity: number;
    recommendedDensity: number;
    placementSuggestions: string[];
  }[];
  structureImprovements: {
    type: 'heading' | 'paragraph' | 'list' | 'callToAction';
    suggestion: string;
    location: string;
    reason: string;
  }[];
  generatedContentSuggestions: {
    type: 'section' | 'paragraph' | 'callToAction' | 'testimonial' | 'faq';
    content: string;
    placementRecommendation: string;
  }[];
  optimizedAt: Date;
}

/**
 * Extract page content including components
 * @param pageId Page ID to extract content from
 * @returns Structured page content
 */
async function extractPageContent(pageId: number): Promise<any> {
  try {
    // Get the page
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      throw new Error("Page not found");
    }
    
    // Get sections
    const sections = await db
      .select()
      .from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, pageId));
    
    // Get components for each section
    const sectionContent = await Promise.all(sections.map(async (section) => {
      const components = await db
        .select()
        .from(pageBuilderComponents)
        .where(eq(pageBuilderComponents.sectionId, section.id));
      
      return {
        section,
        components
      };
    }));
    
    return {
      page,
      sections: sectionContent
    };
  } catch (error) {
    console.error("Error extracting page content:", error);
    throw error;
  }
}

/**
 * Analyze page content and provide optimization suggestions
 * @param pageContent Structured page content
 * @param request Optimization parameters
 * @returns Optimization suggestions
 */
async function analyzeContent(pageContent: any, request: ContentOptimizationRequest): Promise<any> {
  try {
    // Prepare page content for analysis
    const page = pageContent.page;
    
    // Extract text from components for analysis
    const allText = pageContent.sections
      .flatMap(section => section.components)
      .map(component => {
        if (component.data && typeof component.data === 'object') {
          return Object.entries(component.data)
            .filter(([key, value]) => typeof value === 'string' && !key.includes('style') && !key.includes('class'))
            .map(([_, value]) => value)
            .join(' ');
        }
        return '';
      })
      .join(' ');
    
    // Create a section map for easier referencing
    const sectionMap = pageContent.sections.map(section => {
      return {
        id: section.section.id,
        name: section.section.name,
        order: section.section.order,
        componentCount: section.components.length,
        textSample: section.components
          .slice(0, 2)
          .map(component => {
            if (component.data && typeof component.data === 'object') {
              const textValues = Object.entries(component.data)
                .filter(([key, value]) => typeof value === 'string' && !key.includes('style') && !key.includes('class'))
                .map(([_, value]) => value);
              return textValues.join(' ').substring(0, 100) + (textValues.join(' ').length > 100 ? '...' : '');
            }
            return '';
          })
          .join(' ')
      };
    });
    
    // Get additional analysis if requested
    let industryAnalysis = null;
    let competitorAnalysis = null;
    
    if (request.includeIndustryBenchmarks) {
      industryAnalysis = await getIndustryBenchmarkComparison(page.id);
    }
    
    if (request.includeCompetitorAnalysis) {
      competitorAnalysis = await generateContentRecommendationsFromCompetitors(page.id);
    }
    
    // Create the prompt for OpenAI
    const prompt = `
    Analyze this page content and provide specific, actionable content optimizations based on SEO best practices.
    
    Page Details:
    - Title: ${page.title}
    - SEO Settings: ${JSON.stringify(page.seoSettings || {})}
    - Optimization Goal: ${request.optimizationGoal}
    - Target Keywords: ${request.targetKeywords?.join(', ') || 'Not specified'}
    - Content Readability Level: ${request.contentReadabilityLevel || 'intermediate'}
    
    Content Excerpt:
    ${allText.substring(0, 2000) + (allText.length > 2000 ? '...' : '')}
    
    Section Structure:
    ${JSON.stringify(sectionMap, null, 2)}
    
    ${industryAnalysis ? `Industry Analysis:\n${JSON.stringify(industryAnalysis, null, 2)}` : ''}
    
    ${competitorAnalysis ? `Competitor Analysis:\n${JSON.stringify(competitorAnalysis, null, 2)}` : ''}
    
    Provide detailed, actionable content optimization recommendations in the following JSON format:
    {
      "originalScore": 0, // Estimated current SEO score (0-100)
      "projectedScore": 0, // Projected score after implementing recommendations (0-100)
      "titleSuggestions": [], // 3-5 optimized title suggestions
      "metaDescriptionSuggestions": [], // 3-5 optimized meta description suggestions
      "contentImprovements": [
        {
          "sectionId": 0, // ID of the section to improve
          "originalContent": "", // Brief excerpt of original content
          "optimizedContent": "", // Suggested replacement content
          "improvementReason": "", // Reason for the recommendation
          "seoImpact": 0 // Impact score from 1-10
        }
      ],
      "keywordOptimizations": [
        {
          "keyword": "", // Keyword to optimize
          "currentDensity": 0, // Estimated current density percentage
          "recommendedDensity": 0, // Recommended density percentage
          "placementSuggestions": [] // Where to add/modify keywords
        }
      ],
      "structureImprovements": [
        {
          "type": "", // Type of structural improvement
          "suggestion": "", // The specific suggestion
          "location": "", // Where to implement
          "reason": "" // Reason for suggestion
        }
      ],
      "generatedContentSuggestions": [
        {
          "type": "", // Type of content to add
          "content": "", // The suggested content
          "placementRecommendation": "" // Where to place it
        }
      ]
    }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: "You are an expert SEO content optimizer. You analyze content and provide specific, actionable recommendations to improve SEO performance while maintaining content quality and brand voice."
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
    console.error("Error analyzing content:", error);
    throw error;
  }
}

/**
 * Generate optimized content for a given page
 * @param request Content optimization request parameters
 * @returns Detailed optimization recommendations
 */
export async function optimizePageContent(
  request: ContentOptimizationRequest
): Promise<ContentOptimizationResponse> {
  try {
    const pageContent = await extractPageContent(request.pageId);
    const optimizationAnalysis = await analyzeContent(pageContent, request);
    
    // Transform the analysis to ensure it matches our return type
    const response: ContentOptimizationResponse = {
      pageId: request.pageId,
      originalScore: optimizationAnalysis.originalScore,
      projectedScore: optimizationAnalysis.projectedScore,
      titleSuggestions: optimizationAnalysis.titleSuggestions,
      metaDescriptionSuggestions: optimizationAnalysis.metaDescriptionSuggestions,
      contentImprovements: optimizationAnalysis.contentImprovements.map((improvement: any) => ({
        sectionId: improvement.sectionId,
        componentId: improvement.componentId,
        originalContent: improvement.originalContent,
        optimizedContent: improvement.optimizedContent,
        improvementReason: improvement.improvementReason,
        seoImpact: improvement.seoImpact
      })),
      keywordOptimizations: optimizationAnalysis.keywordOptimizations,
      structureImprovements: optimizationAnalysis.structureImprovements,
      generatedContentSuggestions: optimizationAnalysis.generatedContentSuggestions,
      optimizedAt: new Date()
    };
    
    return response;
  } catch (error) {
    console.error("Error optimizing page content:", error);
    throw error;
  }
}

/**
 * Apply specific optimizations to page content
 * @param pageId Page ID to optimize
 * @param optimizations Optimizations to apply
 * @returns Success status and list of applied changes
 */
export async function applyContentOptimizations(
  pageId: number,
  optimizations: any
): Promise<any> {
  try {
    // Start a database transaction for all changes
    let appliedChanges: any[] = [];
    let seoImpact = 0;
    
    // Update page title and SEO settings if provided
    if (optimizations.selectedTitle) {
      await db
        .update(pageBuilderPages)
        .set({ 
          title: optimizations.selectedTitle,
          updatedAt: new Date()
        })
        .where(eq(pageBuilderPages.id, pageId));
      
      appliedChanges.push({
        type: 'title',
        value: optimizations.selectedTitle
      });
      
      seoImpact += 10; // Title changes have high impact
    }
    
    // Update SEO meta description if provided
    if (optimizations.selectedDescription) {
      // Get the current SEO settings
      const [page] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, pageId));
      
      const currentSeoSettings = page.seoSettings || {};
      
      // Update the description
      await db
        .update(pageBuilderPages)
        .set({ 
          seoSettings: {
            ...currentSeoSettings,
            description: optimizations.selectedDescription
          },
          updatedAt: new Date()
        })
        .where(eq(pageBuilderPages.id, pageId));
      
      appliedChanges.push({
        type: 'metaDescription',
        value: optimizations.selectedDescription
      });
      
      seoImpact += 8; // Meta description changes have significant impact
    }
    
    // Apply content improvements to specific components
    if (optimizations.selectedContentImprovements && optimizations.selectedContentImprovements.length > 0) {
      for (const improvement of optimizations.selectedContentImprovements) {
        if (!improvement.componentId) continue;
        
        // Get the current component
        const [component] = await db
          .select()
          .from(pageBuilderComponents)
          .where(eq(pageBuilderComponents.id, improvement.componentId));
        
        if (!component) continue;
        
        // Find the field to update in the component data
        const data = component.data || {};
        let updated = false;
        
        // Look for text fields in the component data
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string' && !key.includes('style') && !key.includes('class')) {
            // Update the text content
            data[key] = improvement.optimizedContent;
            updated = true;
            break;
          }
        }
        
        if (updated) {
          // Update the component
          await db
            .update(pageBuilderComponents)
            .set({
              data,
              updatedAt: new Date()
            })
            .where(eq(pageBuilderComponents.id, improvement.componentId));
          
          appliedChanges.push({
            type: 'componentContent',
            sectionId: improvement.sectionId,
            componentId: improvement.componentId,
            value: improvement.optimizedContent
          });
          
          seoImpact += improvement.seoImpact || 5; // Use the provided impact score
        }
      }
    }
    
    // Return the results
    return {
      success: true,
      pageId,
      appliedChanges,
      seoImpact,
      message: `Applied ${appliedChanges.length} optimizations to the page content with an estimated SEO impact of ${seoImpact} points.`
    };
  } catch (error) {
    console.error("Error applying content optimizations:", error);
    throw error;
  }
}

/**
 * Auto-generate additional content based on page context and SEO analysis
 * @param pageId Page ID to generate content for
 * @param contentType Type of content to generate (section, FAQ, testimonial, etc.)
 * @param targetKeywords Target keywords to incorporate
 * @returns Generated content
 */
export async function generateAdditionalContent(
  pageId: number,
  contentType: 'section' | 'paragraph' | 'callToAction' | 'testimonial' | 'faq',
  targetKeywords?: string[]
): Promise<any> {
  try {
    // Get the page with its current content
    const pageContent = await extractPageContent(pageId);
    const page = pageContent.page;
    
    // Extract text from components for context
    const allText = pageContent.sections
      .flatMap(section => section.components)
      .map(component => {
        if (component.data && typeof component.data === 'object') {
          return Object.entries(component.data)
            .filter(([key, value]) => typeof value === 'string' && !key.includes('style') && !key.includes('class'))
            .map(([_, value]) => value)
            .join(' ');
        }
        return '';
      })
      .join(' ');
    
    // Create a prompt for the specific content type
    let contentPrompt = `
    Generate high-quality, SEO-optimized ${contentType} content for this page:
    
    Page Title: ${page.title}
    Page Content Context:
    ${allText.substring(0, 1500) + (allText.length > 1500 ? '...' : '')}
    
    Target Keywords: ${targetKeywords?.join(', ') || page.seoSettings?.keywords?.join(', ') || 'Not specified'}
    
    `;
    
    switch (contentType) {
      case 'section':
        contentPrompt += `
        Create a complete new section with a heading and 2-3 paragraphs of content.
        The section should add value to the existing page while incorporating the target keywords naturally.
        Return in the following format:
        {
          "heading": "Section Heading",
          "content": "Paragraph text...",
          "listItems": [] // Optional list items if applicable
        }
        `;
        break;
        
      case 'paragraph':
        contentPrompt += `
        Create a compelling paragraph that enhances the existing content while naturally incorporating target keywords.
        The paragraph should be 80-120 words and add real value to the page.
        Return in the following format:
        {
          "content": "Paragraph text..."
        }
        `;
        break;
        
      case 'callToAction':
        contentPrompt += `
        Create a persuasive call-to-action that encourages the visitor to take the next step.
        The CTA should be relevant to the page content and include a strong action verb.
        Return in the following format:
        {
          "heading": "CTA Heading",
          "text": "Supporting text",
          "buttonText": "Button Text",
          "buttonLink": "#action" // Suggested link destination
        }
        `;
        break;
        
      case 'testimonial':
        contentPrompt += `
        Create a realistic, persuasive client testimonial that supports the page's purpose.
        The testimonial should sound authentic and highlight key benefits without appearing fake.
        Return in the following format:
        {
          "quote": "Testimonial text...",
          "author": "Client Name",
          "position": "Position, Company",
          "rating": 5 // 1-5 star rating
        }
        `;
        break;
        
      case 'faq':
        contentPrompt += `
        Create 3-5 relevant FAQ items that address common questions related to this page's content.
        The FAQs should incorporate target keywords naturally and provide valuable information.
        Return in the following format:
        {
          "faqs": [
            {
              "question": "Question text?",
              "answer": "Answer text..."
            }
          ]
        }
        `;
        break;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { 
          role: "system", 
          content: "You are an expert SEO content creator who specializes in creating high-quality, optimized content for business websites. Your content is engaging, value-focused, and optimized for both users and search engines."
        },
        { role: "user", content: contentPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    });
    
    const contentStr = response.choices[0].message.content;
    if (!contentStr) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Parse the response
    const generatedContent = JSON.parse(contentStr);
    
    return {
      success: true,
      pageId,
      contentType,
      generatedContent,
      message: `Successfully generated ${contentType} content for page ${page.title}`
    };
  } catch (error) {
    console.error(`Error generating ${contentType} content:`, error);
    throw error;
  }
}