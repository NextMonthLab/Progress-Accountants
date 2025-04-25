import OpenAI from "openai";

// Initialize OpenAI client with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validate that OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY environment variable is not set. AI features will not work.");
}

/**
 * Generate image using OpenAI DALL-E
 * @param prompt User prompt for image generation
 * @returns Object containing the image URL
 */
export async function generateImage(prompt: string): Promise<{ url: string }> {
  try {
    // Ensure prompt is adequately detailed
    const enhancedPrompt = enhanceImagePrompt(prompt);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    
    const imageUrl = response.data[0].url;
    
    if (!imageUrl) {
      throw new Error("No image was generated");
    }
    
    return { url: imageUrl };
  } catch (error) {
    console.error("Error generating image with OpenAI:", error);
    throw new Error(`Failed to generate image: ${(error as Error).message}`);
  }
}

/**
 * Generate social media post content using GPT-4
 * @param prompt User prompt for post generation
 * @param platform Target social media platform
 * @param businessIdentity Optional business identity data for tone customization
 * @returns Object containing generated text
 */
export async function generateSocialMediaPost(
  prompt: string, 
  platform: string,
  businessIdentity?: any
): Promise<{ text: string }> {
  try {
    const systemPrompt = getSystemPromptForPlatform(platform, businessIdentity);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const generatedText = response.choices[0].message.content;
    
    if (!generatedText) {
      throw new Error("No text was generated");
    }
    
    return { text: generatedText };
  } catch (error) {
    console.error("Error generating social media post with OpenAI:", error);
    throw new Error(`Failed to generate post: ${(error as Error).message}`);
  }
}

/**
 * Enhance image prompt to get better results from DALL-E
 */
function enhanceImagePrompt(prompt: string): string {
  // Add details for accountancy/business context if not present
  if (!prompt.toLowerCase().includes("accounting") && 
      !prompt.toLowerCase().includes("accountant") && 
      !prompt.toLowerCase().includes("business") && 
      !prompt.toLowerCase().includes("professional")) {
    prompt += ", professional accounting context";
  }
  
  // Add quality enhancers if not present
  if (!prompt.toLowerCase().includes("high quality") && 
      !prompt.toLowerCase().includes("professional") && 
      !prompt.toLowerCase().includes("detailed")) {
    prompt += ", high quality, detailed, professional";
  }
  
  return prompt;
}

/**
 * Get the appropriate system prompt based on platform and business identity
 * @param platform Social media platform
 * @param businessIdentity Optional business identity data
 * @returns Customized system prompt
 */
function getSystemPromptForPlatform(platform: string, businessIdentity?: any): string {
  // Extract business information if available
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const industry = businessIdentity?.market?.primaryIndustry || "accounting";
  const targetAudience = businessIdentity?.market?.targetAudience || "business owners";
  let toneOfVoice = businessIdentity?.personality?.toneOfVoice || [];
  
  // Default to professional tone if no tones specified
  if (!toneOfVoice || toneOfVoice.length === 0) {
    toneOfVoice = ["professional", "friendly", "authoritative"];
  }
  
  // Format the tones for the prompt
  const tonesText = toneOfVoice.join(", ");
  
  // Build the base prompt with dynamic business information
  const basePrompt = `You are an expert social media content creator for ${businessName}. ` +
    `Create engaging content that showcases expertise and builds trust. ` +
    `The content should be appropriate for ${targetAudience} and maintain a ${tonesText} tone. ` +
    `Focus on creating value for the reader while showcasing ${industry} expertise.`;
  
  // Platform-specific instructions
  const platformSpecificPrompts: Record<string, string> = {
    linkedin: 
      basePrompt + 
      ` For LinkedIn, write with a ${tonesText} tone with business insights. ` +
      "Include relevant hashtags (3-5) at the end. Keep the post between 1000-1300 characters. " +
      "Focus on thought leadership, industry insights, and professional development.",
      
    twitter: 
      basePrompt + 
      " For Twitter/X, be concise and direct. " +
      "Keep the post under 280 characters. " +
      `Include 1-2 relevant hashtags. Use ${tonesText}, attention-grabbing language.`,
      
    facebook: 
      basePrompt + 
      ` For Facebook, use a ${tonesText} tone. ` +
      "Keep the post between 80-250 words. " +
      "Ask a question at the end to encourage engagement.",
      
    instagram: 
      basePrompt + 
      ` For Instagram, write visually descriptive content with a ${tonesText} tone. ` +
      "Keep the post between 150-200 words. " + 
      "Include a clear call-to-action and 5-10 relevant hashtags at the end. " +
      "Focus on visual storytelling that complements an image."
  };
  
  return platformSpecificPrompts[platform.toLowerCase()] || basePrompt;
}