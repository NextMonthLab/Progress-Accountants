import OpenAI from "openai";
import { storage } from "../storage";
import { BusinessIdentity } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default mock data to use when OpenAI is not available
const defaultComponents = [
  {
    name: "Hero Section",
    type: "hero",
    description: "A bold hero section with a headline, subtext, and call-to-action button",
    seoImpact: "high",
    structure: {
      headline: "Main Headline",
      subheading: "Supporting text that explains your value proposition",
      ctaText: "Get Started",
      ctaUrl: "#",
      backgroundType: "color"
    }
  },
  {
    name: "Services Grid",
    type: "services",
    description: "A grid displaying your key services or products with icons",
    seoImpact: "medium",
    structure: {
      heading: "Our Services",
      services: [
        { title: "Service 1", description: "Description of service", icon: "check" },
        { title: "Service 2", description: "Description of service", icon: "check" },
        { title: "Service 3", description: "Description of service", icon: "check" }
      ]
    }
  },
  {
    name: "Testimonial Carousel",
    type: "testimonials",
    description: "A carousel of client testimonials to build trust",
    seoImpact: "medium",
    structure: {
      heading: "What Our Clients Say",
      testimonials: [
        { quote: "This company has transformed our business!", author: "John Smith, CEO" },
        { quote: "Exceptional service and results.", author: "Jane Doe, CFO" }
      ]
    }
  }
];

const defaultLayouts = [
  {
    name: "Professional Services Layout",
    description: "A professional layout ideal for service-based businesses",
    sections: [
      { name: "Hero Section", type: "hero", layout: "full-width" },
      { name: "Services Section", type: "services", layout: "three-column" },
      { name: "About Section", type: "about", layout: "two-column" },
      { name: "Testimonials", type: "testimonials", layout: "carousel" },
      { name: "Contact Form", type: "contact", layout: "full-width" }
    ]
  },
  {
    name: "Modern Business Layout",
    description: "A contemporary layout with bold visuals and clear sections",
    sections: [
      { name: "Video Hero", type: "hero-video", layout: "full-width" },
      { name: "Featured Services", type: "services", layout: "grid" },
      { name: "Team Members", type: "team", layout: "cards" },
      { name: "Client Logos", type: "clients", layout: "logo-grid" },
      { name: "FAQ Section", type: "faq", layout: "accordion" }
    ]
  }
];

const defaultColorPalettes = [
  {
    name: "Professional Blue",
    primaryColor: "#1a365d",
    secondaryColor: "#2a4365",
    accentColor: "#3182ce",
    textColor: "#2d3748",
    backgroundColor: "#f7fafc",
    additionalColors: ["#e2e8f0", "#a0aec0", "#4a5568"],
    mood: "professional",
    industry: "accounting"
  },
  {
    name: "Bold Orange-Navy",
    primaryColor: "#1e3a8a",
    secondaryColor: "#172554",
    accentColor: "#f97316",
    textColor: "#334155",
    backgroundColor: "#f8fafc",
    additionalColors: ["#cbd5e1", "#94a3b8", "#64748b"],
    mood: "bold",
    industry: "accounting"
  },
  {
    name: "Modern Charcoal",
    primaryColor: "#27272a",
    secondaryColor: "#18181b",
    accentColor: "#0ea5e9",
    textColor: "#334155",
    backgroundColor: "#fafafa",
    additionalColors: ["#e4e4e7", "#a1a1aa", "#52525b"],
    mood: "modern",
    industry: "accounting"
  }
];

/**
 * Get design suggestions based on page type and business type
 */
export async function getDesignSuggestions(pageType: string, businessType: string, tenantId: string) {
  try {
    // First check if we have saved suggestions for this combination
    const existingSuggestions = await db.query.ai_design_suggestions.findFirst({
      where: (table) => {
        return eq(table.tenantId, tenantId) && 
               eq(table.pageType, pageType) && 
               eq(table.businessType, businessType)
      }
    });

    if (existingSuggestions) {
      return existingSuggestions;
    }

    // If none exist, generate new ones
    return await generateDesignSuggestions(pageType, businessType, tenantId);
  } catch (error) {
    console.error("Error in getDesignSuggestions:", error);
    // Return default suggestions if there's an error
    return {
      id: 0,
      tenantId,
      pageType,
      businessType,
      components: defaultComponents,
      layouts: defaultLayouts,
      colorPalettes: defaultColorPalettes,
      seoRecommendations: {
        keywords: ["accounting", "financial services", "tax planning"],
        metaDescription: "Professional accounting services for businesses of all sizes",
        titleFormat: "{Business Name} | Professional Accounting Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Generate AI-powered design suggestions
 */
export async function generateDesignSuggestions(pageType: string, businessType: string, tenantId: string) {
  try {
    // Get business identity to inform the AI
    const businessIdentity = await storage.getBusinessIdentity(tenantId);
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    // Prepare prompt for OpenAI
    const prompt = `
      Generate design suggestions for a ${pageType} page for a ${businessType} business website.
      
      Business details:
      Name: ${businessIdentity?.name || "Progress Accountants"}
      Mission: ${businessIdentity?.mission || "To provide exceptional accounting services to businesses"}
      Industry Type: ${businessIdentity?.industryType || "Accounting"}
      Core Business: ${businessIdentity?.coreBusiness || "Accounting and Tax Services"}
      
      Please provide the following in a JSON format:
      1. A list of recommended components with name, type, description, SEO impact, and structure
      2. A list of recommended page layouts with names, descriptions, and section arrangements
      3. A list of recommended color palettes with primary, secondary, accent, text, and background colors
      4. SEO recommendations including keywords, meta description, and title format
      
      The response should be valid JSON with the following structure:
      {
        "components": [ /* component objects */ ],
        "layouts": [ /* layout objects */ ],
        "colorPalettes": [ /* palette objects */ ],
        "seoRecommendations": { /* SEO object */ }
      }
    `;

    // Make OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert web designer and developer specializing in creating beautiful, on-brand website designs that convert well. You create JSON output only."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const aiSuggestions = JSON.parse(response.choices[0].message.content);

    // Format and save the generated suggestions
    const suggestions = {
      tenantId,
      pageType,
      businessType,
      components: aiSuggestions.components || defaultComponents,
      layouts: aiSuggestions.layouts || defaultLayouts,
      colorPalettes: aiSuggestions.colorPalettes || defaultColorPalettes,
      seoRecommendations: aiSuggestions.seoRecommendations || {
        keywords: ["accounting", "financial services"],
        metaDescription: "Professional accounting services",
        titleFormat: "{Business Name} | {Service}"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    const [savedSuggestion] = await db.insert(db.table.ai_design_suggestions).values(suggestions).returning();

    return savedSuggestion;
  } catch (error) {
    console.error("Error generating design suggestions:", error);
    
    // Return default suggestions if there's an error
    return {
      id: 0,
      tenantId,
      pageType,
      businessType,
      components: defaultComponents,
      layouts: defaultLayouts,
      colorPalettes: defaultColorPalettes,
      seoRecommendations: {
        keywords: ["accounting", "financial services", "tax planning"],
        metaDescription: "Professional accounting services for businesses of all sizes",
        titleFormat: "{Business Name} | Professional Accounting Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Get color palettes for a specific tenant
 */
export async function getColorPalettes(tenantId: string) {
  try {
    // Query saved color palettes for this tenant
    const palettes = await db.query.ai_color_palettes.findMany({
      where: (table) => eq(table.tenantId, tenantId),
      orderBy: (table) => table.createdAt,
      limit: 10
    });

    if (palettes && palettes.length > 0) {
      return palettes;
    }

    // If none are found, return default palettes
    return defaultColorPalettes.map((palette, index) => ({
      id: index,
      tenantId,
      ...palette,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching color palettes:", error);
    
    // Return default palettes if there's an error
    return defaultColorPalettes.map((palette, index) => ({
      id: index,
      tenantId,
      ...palette,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }
}

/**
 * Generate AI color palettes based on industry and mood
 */
export async function generateColorPalettes(industry: string, mood: string, tenantId: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    // Prepare prompt for OpenAI
    const prompt = `
      Generate 3 color palettes suitable for a ${industry} business website with a ${mood} mood.
      
      For each palette, provide:
      1. A descriptive name
      2. Primary color (hex)
      3. Secondary color (hex)
      4. Accent color (hex)
      5. Text color (hex)
      6. Background color (hex)
      7. 3-5 additional complementary colors (hex array)
      
      The response should be valid JSON with the following structure:
      [
        {
          "name": "Palette Name",
          "primaryColor": "#hexcode",
          "secondaryColor": "#hexcode",
          "accentColor": "#hexcode", 
          "textColor": "#hexcode",
          "backgroundColor": "#hexcode",
          "additionalColors": ["#hexcode", "#hexcode", "#hexcode"],
          "mood": "${mood}",
          "industry": "${industry}"
        },
        // repeat for 3 palettes
      ]
    `;

    // Make OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert UI/UX designer specializing in color theory and brand identity. Generate beautiful, harmonious color palettes that work well together and match the specified mood and industry."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const aiPalettes = JSON.parse(response.choices[0].message.content);
    
    // Add tenant ID and timestamps
    const formattedPalettes = (Array.isArray(aiPalettes) ? aiPalettes : [aiPalettes]).map(palette => ({
      tenantId,
      ...palette,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Save to database
    if (formattedPalettes.length > 0) {
      const savedPalettes = await db.insert(db.table.ai_color_palettes).values(formattedPalettes).returning();
      return savedPalettes;
    }

    return [];
  } catch (error) {
    console.error("Error generating color palettes:", error);
    
    // Return default palettes if there's an error
    const defaultPalettesWithTenant = defaultColorPalettes.map(palette => ({
      tenantId,
      ...palette,
      mood,
      industry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    // Try to save default palettes to database
    try {
      await db.insert(db.table.ai_color_palettes).values(defaultPalettesWithTenant);
    } catch (err) {
      console.error("Error saving default palettes:", err);
    }
    
    return defaultPalettesWithTenant;
  }
}

/**
 * Get component recommendations for a specific page
 */
export async function getComponentRecommendations(pageId: number) {
  try {
    // Query saved recommendations for this page
    const recommendations = await db.query.ai_component_recommendations.findMany({
      where: (table) => eq(table.pageId, pageId),
      orderBy: (table) => table.createdAt,
      limit: 10
    });

    return recommendations || [];
  } catch (error) {
    console.error("Error fetching component recommendations:", error);
    return [];
  }
}

/**
 * Generate AI component recommendations based on page context
 */
export async function generateComponentRecommendations(pageId: number, context: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }

    // Get page details if available
    const page = await db.query.page_builder_pages.findFirst({
      where: (table) => eq(table.id, pageId),
      columns: {
        id: true,
        title: true,
        description: true,
        pageType: true,
        tenantId: true
      }
    });

    // Get business identity to inform the AI
    const businessIdentity = page?.tenantId 
      ? await storage.getBusinessIdentity(page.tenantId) 
      : null;

    // Prepare prompt for OpenAI
    const prompt = `
      Generate component recommendations for a ${context} section on a web page.
      
      Page details:
      ${page ? `Title: ${page.title}
      Description: ${page.description}
      Type: ${page.pageType}` : 'No page details available'}
      
      Business details:
      ${businessIdentity ? `Name: ${businessIdentity.name}
      Mission: ${businessIdentity.mission}` : 'No business details available'}
      
      Please provide 3-5 component recommendations specifically for a ${context} section.
      Each component should have:
      1. Name
      2. Type (e.g., hero, text, image, form, gallery, etc.)
      3. Description
      4. SEO impact (high, medium, low)
      5. Content suggestions
      6. Preview description
      
      The response should be valid JSON with the following structure:
      {
        "recommendations": [
          {
            "name": "Component Name",
            "type": "component-type",
            "description": "Description of the component",
            "seoImpact": "high|medium|low",
            "content": {
              // Suggested content fields
            },
            "preview": "Description of how this would look"
          }
          // More components...
        ],
        "reasoning": "Brief explanation of why these components were chosen"
      }
    `;

    // Make OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are an expert web designer and developer specializing in creating high-converting components for websites. You create JSON output only."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const aiRecommendations = JSON.parse(response.choices[0].message.content);

    // Format and save the generated recommendations
    const recommendation = {
      pageId,
      sectionId: null, // We're not specifying a section yet
      context,
      recommendations: aiRecommendations.recommendations || defaultComponents,
      reasoning: aiRecommendations.reasoning || "These components were selected based on best practices for this type of section.",
      used: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    const [savedRecommendation] = await db.insert(db.table.ai_component_recommendations).values(recommendation).returning();

    return savedRecommendation;
  } catch (error) {
    console.error("Error generating component recommendations:", error);
    
    // Return basic recommendation with default components if there's an error
    return {
      id: 0,
      pageId,
      sectionId: null,
      context,
      recommendations: defaultComponents,
      reasoning: "These are standard components that work well for most sections.",
      used: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}