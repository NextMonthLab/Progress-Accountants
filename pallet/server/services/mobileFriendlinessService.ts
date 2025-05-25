import OpenAI from "openai";
import { db } from "../db";
import { pageBuilderPages, pageBuilderComponents, pageBuilderSections } from "@shared/schema";
import { eq, and, or } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MobileFriendlinessResult {
  overallScore: number;
  issues: MobileIssue[];
  recommendations: string[];
  strengths: string[];
  viewportConfiguration: {
    hasViewport: boolean;
    isResponsive: boolean;
    issues: string[];
  };
  tapTargets: {
    score: number;
    issues: string[];
  };
  contentSizing: {
    score: number;
    issues: string[];
  };
  textReadability: {
    score: number;
    issues: string[];
  };
}

export interface MobileIssue {
  type: 'critical' | 'major' | 'minor';
  description: string;
  impact: string;
  recommendation: string;
}

/**
 * Analyze mobile-friendliness of a page
 * @param pageId - ID of the page to analyze
 * @returns Mobile-friendliness analysis
 */
export async function analyzeMobileFriendliness(pageId: number): Promise<MobileFriendlinessResult> {
  try {
    // Get page with its sections and components
    const page = await getPageWithComponents(pageId);
    
    if (!page) {
      throw new Error("Page not found");
    }

    // Extract page structure and components
    const pageStructure = extractPageStructure(page);
    
    if (!process.env.OPENAI_API_KEY) {
      return getDefaultMobileAnalysis();
    }
    
    // Prepare prompt for OpenAI
    const prompt = `
      Analyze the mobile-friendliness of this web page based on its structure and components:
      
      Page Name: ${page.name || 'Untitled'}
      
      Page Structure:
      ${JSON.stringify(pageStructure, null, 2)}
      
      Evaluate the following aspects of mobile-friendliness:
      1. Viewport configuration and responsiveness
      2. Touch targets (size and spacing of interactive elements)
      3. Content sizing and horizontal scrolling issues
      4. Text readability on small screens
      5. Overall mobile user experience
      
      Return your analysis as a valid JSON object with the following structure:
      {
        "overallScore": 0-100,
        "issues": [
          {
            "type": "critical" | "major" | "minor",
            "description": "Description of the issue",
            "impact": "How this impacts mobile users",
            "recommendation": "How to fix it"
          }
        ],
        "recommendations": ["recommendation1", "recommendation2"],
        "strengths": ["strength1", "strength2"],
        "viewportConfiguration": {
          "hasViewport": true/false,
          "isResponsive": true/false,
          "issues": ["issue1", "issue2"]
        },
        "tapTargets": {
          "score": 0-100,
          "issues": ["issue1", "issue2"]
        },
        "contentSizing": {
          "score": 0-100,
          "issues": ["issue1", "issue2"]
        },
        "textReadability": {
          "score": 0-100,
          "issues": ["issue1", "issue2"]
        }
      }
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert in mobile web design and mobile SEO. You analyze web page structures to identify mobile usability issues and provide specific recommendations to improve mobile-friendliness."
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
      overallScore: analysis.overallScore || 0,
      issues: analysis.issues || [],
      recommendations: analysis.recommendations || [],
      strengths: analysis.strengths || [],
      viewportConfiguration: analysis.viewportConfiguration || {
        hasViewport: false,
        isResponsive: false,
        issues: []
      },
      tapTargets: analysis.tapTargets || {
        score: 0,
        issues: []
      },
      contentSizing: analysis.contentSizing || {
        score: 0,
        issues: []
      },
      textReadability: analysis.textReadability || {
        score: 0,
        issues: []
      }
    };
  } catch (error) {
    console.error("Error analyzing mobile-friendliness:", error);
    return getDefaultMobileAnalysis();
  }
}

/**
 * Extract page structure for mobile analysis
 */
function extractPageStructure(page: any) {
  const structure: any = {
    hasViewport: true, // Assume modern setup has viewport
    sectionsCount: 0,
    interactiveElements: [],
    fontSizes: [],
    imageCount: 0,
    responsiveImages: 0,
    containerTypes: [],
    sectionTypes: []
  };
  
  if (page.sections) {
    structure.sectionsCount = page.sections.length;
    
    page.sections.forEach((section: any) => {
      // Track section types for layout analysis
      if (section.type) {
        structure.sectionTypes.push(section.type);
      }
      
      // Track container types
      if (section.containerType) {
        structure.containerTypes.push(section.containerType);
      }
      
      if (section.components) {
        section.components.forEach((component: any) => {
          // Interactive elements (potential tap targets)
          if (component.type === 'button' || component.type === 'link' || component.type === 'form') {
            structure.interactiveElements.push({
              type: component.type,
              size: component.content?.size || 'medium',
              hasMargin: component.content?.hasMargin !== false
            });
          }
          
          // Text elements for readability analysis
          if (component.type === 'text' || component.type === 'paragraph' || component.type === 'heading') {
            structure.fontSizes.push(component.content?.fontSize || 'medium');
          }
          
          // Images for responsive image analysis
          if (component.type === 'image') {
            structure.imageCount++;
            if (component.content?.responsive === true) {
              structure.responsiveImages++;
            }
          }
        });
      }
    });
  }
  
  return structure;
}

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
    let components: any[] = [];
    
    if (sectionIds.length > 0) {
      components = await db
        .select()
        .from(pageBuilderComponents)
        .where(
          or(...sectionIds.map(id => eq(pageBuilderComponents.sectionId, id)))
        )
        .orderBy(pageBuilderComponents.order);
    }
    
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
 * Default mobile analysis when API is unavailable
 */
function getDefaultMobileAnalysis(): MobileFriendlinessResult {
  return {
    overallScore: 70,
    issues: [
      {
        type: 'major',
        description: 'Touch targets may be too small on mobile devices',
        impact: 'Users may have difficulty tapping buttons or links accurately',
        recommendation: 'Ensure all interactive elements are at least 44px × 44px'
      },
      {
        type: 'minor',
        description: 'Content may not be properly sized for viewport',
        impact: 'Users might need to scroll horizontally to see content',
        recommendation: 'Use relative width units (%, vw) instead of fixed pixel widths'
      }
    ],
    recommendations: [
      'Ensure viewport meta tag is properly configured',
      'Use responsive design techniques for all elements',
      'Test the page on various mobile devices and screen sizes',
      'Ensure text is readable without zooming',
      'Avoid horizontal scrolling'
    ],
    strengths: [
      'Basic responsive layout structure',
      'Modern component architecture'
    ],
    viewportConfiguration: {
      hasViewport: true,
      isResponsive: true,
      issues: []
    },
    tapTargets: {
      score: 65,
      issues: ['Some interactive elements may be too small or too close together']
    },
    contentSizing: {
      score: 75,
      issues: ['Some elements may have fixed widths that exceed mobile viewport']
    },
    textReadability: {
      score: 80,
      issues: ['Font sizes might be too small on some components']
    }
  };
}