import OpenAI from "openai";
import { db } from "../db";
import { 
  aiDesignSuggestions, 
  aiComponentRecommendations, 
  aiColorPalettes,
  pageBuilderPages,
  pageBuilderSections,
  businessIdentity
} from "../../shared/schema";
import { eq, and } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Design System service that provides intelligent design recommendations
 */
export const aiDesignService = {
  /**
   * Generate design suggestions based on business type and page type
   * @param businessType - The type of business (accounting, legal, healthcare, etc.)
   * @param pageType - The type of page (home, about, services, contact, etc.)
   * @param tenantId - The tenant ID
   */
  async generateDesignSuggestions(businessType: string, pageType: string, tenantId: string) {
    try {
      // Check if we already have suggestions for this combination
      const existingSuggestions = await db
        .select()
        .from(aiDesignSuggestions)
        .where(
          and(
            eq(aiDesignSuggestions.businessType, businessType),
            eq(aiDesignSuggestions.pageType, pageType),
            eq(aiDesignSuggestions.tenantId, tenantId)
          )
        );

      // If we already have suggestions and they're less than 30 days old, return them
      if (existingSuggestions.length > 0) {
        const lastUpdate = new Date(existingSuggestions[0].updatedAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (lastUpdate > thirtyDaysAgo) {
          return existingSuggestions[0];
        }
      }

      // Get business identity to enhance recommendations
      const businessInfo = await db
        .select()
        .from(businessIdentity)
        .where(eq(businessIdentity.tenantId, tenantId));

      // Format the business identity for the prompt
      const businessDetails = businessInfo.length > 0 
        ? JSON.stringify(businessInfo[0])
        : JSON.stringify({ industryType: businessType });

      // Generate new suggestions using OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a professional web design AI that creates optimal designs for business websites. 
            You specialize in layout suggestions, component recommendations, and responsive design.
            For each recommendation, provide a clean, well-structured JSON response.`
          },
          {
            role: "user",
            content: `Generate website design suggestions for a ${businessType} business's ${pageType} page. 
            Here is additional information about the business: ${businessDetails}
            
            Provide layout suggestions, component recommendations, content ideas, and color palette options.
            The suggestions should follow industry best practices, be SEO optimized, and be responsive.
            
            Structure your response as a JSON object with the following sections:
            1. components: Array of recommended components for this page type with properties and content suggestions
            2. layouts: Array of layout options with section arrangements
            3. colorPalettes: Array of color palette suggestions (primary, secondary, accent, text, and background colors)
            4. seoRecommendations: SEO enhancement recommendations for this page`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const designSuggestions = JSON.parse(response.choices[0].message.content || "{}");

      // Store or update the suggestions
      if (existingSuggestions.length > 0) {
        // Update existing record
        await db
          .update(aiDesignSuggestions)
          .set({
            components: designSuggestions.components,
            layouts: designSuggestions.layouts,
            colorPalettes: designSuggestions.colorPalettes,
            seoRecommendations: designSuggestions.seoRecommendations,
            updatedAt: new Date()
          })
          .where(eq(aiDesignSuggestions.id, existingSuggestions[0].id));

        return {
          ...existingSuggestions[0],
          components: designSuggestions.components,
          layouts: designSuggestions.layouts,
          colorPalettes: designSuggestions.colorPalettes,
          seoRecommendations: designSuggestions.seoRecommendations,
          updatedAt: new Date()
        };
      } else {
        // Create new record
        const [newSuggestion] = await db
          .insert(aiDesignSuggestions)
          .values({
            tenantId,
            businessType,
            pageType,
            components: designSuggestions.components,
            layouts: designSuggestions.layouts,
            colorPalettes: designSuggestions.colorPalettes,
            seoRecommendations: designSuggestions.seoRecommendations
          })
          .returning();

        return newSuggestion;
      }
    } catch (error) {
      console.error("Error generating design suggestions:", error);
      throw new Error(`Failed to generate design suggestions: ${(error as Error).message}`);
    }
  },

  /**
   * Generate component recommendations for a specific section of a page
   * @param pageId - The page ID
   * @param sectionId - The section ID (optional)
   * @param context - The context of the section (header, hero, content, etc.)
   */
  async generateComponentRecommendations(pageId: number, context: string, sectionId?: number) {
    try {
      // Get page information
      const [page] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, pageId));

      if (!page) {
        throw new Error("Page not found");
      }

      // Get section information if provided
      let section = null;
      if (sectionId) {
        const [sectionData] = await db
          .select()
          .from(pageBuilderSections)
          .where(eq(pageBuilderSections.id, sectionId));
        
        section = sectionData;
      }

      // Get business identity
      const [businessInfo] = await db
        .select()
        .from(businessIdentity)
        .where(eq(businessIdentity.tenantId, page.tenantId));

      // Generate component recommendations using OpenAI
      const pageType = page.pageType || (page.slug || "").replace(/-/g, " ");
      const prompt = `
        Generate component recommendations for the ${context} section of a ${pageType} page for a website.
        ${section ? `This section is named "${section.name}" and has the following description: "${section.description || 'No description'}"` : ''}
        ${businessInfo ? `The business is in the ${businessInfo.industryType || 'general'} industry and focuses on ${businessInfo.coreBusiness || 'business services'}.` : ''}
        
        Suggest components that would work well in this context, providing:
        1. Component type (text, image, button, card, etc.)
        2. Recommended content
        3. Design suggestions
        4. SEO impact
        
        Return a JSON object with an array of component recommendations, each with:
        - type: The component type
        - name: A descriptive name for the component
        - content: Suggested content structure
        - style: Design recommendations
        - seoImpact: SEO impact level (none, low, medium, high, critical)
        - reasoning: Why this component is recommended
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional web design AI assistant that specializes in recommending optimal components for website sections."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const recommendations = JSON.parse(response.choices[0].message.content || "{}");

      // Store the recommendations
      const [storedRecommendation] = await db
        .insert(aiComponentRecommendations)
        .values({
          pageId,
          sectionId: sectionId || null,
          context,
          recommendations: recommendations.components || [],
          reasoning: recommendations.reasoning || null
        })
        .returning();

      return storedRecommendation;
    } catch (error) {
      console.error("Error generating component recommendations:", error);
      throw new Error(`Failed to generate component recommendations: ${(error as Error).message}`);
    }
  },

  /**
   * Generate color palettes based on business identity
   * @param tenantId - The tenant ID
   * @param industry - The industry type
   * @param mood - The desired mood (professional, energetic, calm, etc.)
   */
  async generateColorPalettes(tenantId: string, industry: string, mood: string = "professional") {
    try {
      // Generate color palettes using OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a color design expert who creates beautiful, accessible, and industry-appropriate color palettes for websites."
          },
          {
            role: "user",
            content: `Generate 3 different color palettes for a ${industry} business website with a ${mood} mood.
            Each palette should include:
            - A unique name
            - Primary color (HEX)
            - Secondary color (HEX)
            - Accent color (HEX)
            - Text color (HEX)
            - Background color (HEX)
            - Additional colors (array of HEX codes)
            
            Ensure colors have sufficient contrast ratios for accessibility.
            Return results as a JSON array with all palettes.`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const colorPalettes = JSON.parse(response.choices[0].message.content || "{}");

      // Store the color palettes
      const insertPromises = colorPalettes.palettes.map((palette: any) => 
        db.insert(aiColorPalettes).values({
          tenantId,
          name: palette.name,
          primaryColor: palette.primaryColor,
          secondaryColor: palette.secondaryColor,
          accentColor: palette.accentColor,
          textColor: palette.textColor,
          backgroundColor: palette.backgroundColor,
          additionalColors: palette.additionalColors || [],
          mood,
          industry
        }).returning()
      );

      const results = await Promise.all(insertPromises);
      return results.map(result => result[0]);
    } catch (error) {
      console.error("Error generating color palettes:", error);
      throw new Error(`Failed to generate color palettes: ${(error as Error).message}`);
    }
  },

  /**
   * Get all saved color palettes for a tenant
   * @param tenantId - The tenant ID
   */
  async getColorPalettes(tenantId: string) {
    try {
      const palettes = await db
        .select()
        .from(aiColorPalettes)
        .where(eq(aiColorPalettes.tenantId, tenantId))
        .orderBy(aiColorPalettes.createdAt);

      return palettes;
    } catch (error) {
      console.error("Error fetching color palettes:", error);
      throw new Error(`Failed to fetch color palettes: ${(error as Error).message}`);
    }
  }
};