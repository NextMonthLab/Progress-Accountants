import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Suggests appropriate placement for an uploaded image based on its content
 * @param imageUrl URL of the uploaded image
 * @param businessId ID of the business that uploaded the image
 * @returns Suggested location for the image (e.g. "hero section", "about/team section")
 */
export async function suggestImagePlacement(imageUrl: string, businessId: string): Promise<string> {
  try {
    // Create a prompt that asks OpenAI to analyze the image and suggest placement
    const prompt = `
      This image (${imageUrl}) has been uploaded by a business (${businessId}) for their website. 
      Based on its content and typical page structures, where would this image best be used? 
      Analyze the image and reply with just one of the following options without explanation:
      - Hero section
      - About/team section
      - Testimonial area
      - Service listing
      - Blog post
      - Portfolio/gallery
      - General asset
    `;

    // Call OpenAI API to get placement suggestion
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a web strategist helping classify image usage locations. Reply with just the suggested location, no explanations or additional text." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
    });

    // Extract and return the suggested location
    const suggestion = response.choices[0].message.content.trim();
    
    return suggestion;
  } catch (error) {
    console.error("Error suggesting image placement:", error);
    return "General asset"; // Default fallback if AI analysis fails
  }
}