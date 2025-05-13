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
    
    // Safely extract URL with TypeScript null checks
    const imageUrl = response?.data?.[0]?.url;
    
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
 * @param contentLength Optional content length preference (1=short, 2=medium, 3=long)
 * @param toneOfVoice Optional tone of voice preference (1=casual, 3=professional, 5=formal)
 * @returns Object containing generated text
 */
export async function generateSocialMediaPost(
  prompt: string, 
  platform: string,
  businessIdentity?: any,
  contentLength?: number,
  toneOfVoice?: number
): Promise<{ text: string }> {
  try {
    const systemPrompt = getSystemPromptForPlatform(platform, businessIdentity, contentLength, toneOfVoice);
    
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
 * Get the appropriate system prompt based on platform, business identity, and user preferences
 * @param platform Social media platform
 * @param businessIdentity Optional business identity data
 * @param contentLength Optional content length preference (1=short, 2=medium, 3=long)
 * @param toneOfVoice Optional tone of voice preference (1=casual, 3=professional, 5=formal)
 * @returns Customized system prompt
 */
function getSystemPromptForPlatform(
  platform: string, 
  businessIdentity?: any, 
  contentLength?: number,
  toneLevel?: number
): string {
  // Extract business information if available
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const industry = businessIdentity?.market?.primaryIndustry || "accounting";
  const targetAudience = businessIdentity?.market?.targetAudience || "business owners";
  
  // Determine tone based on user preference if provided
  let toneWords: string[];
  
  if (toneLevel !== undefined) {
    // Map numeric tone to descriptive words
    switch(toneLevel) {
      case 1:
        toneWords = ["casual", "friendly", "conversational"];
        break;
      case 2:
        toneWords = ["conversational", "approachable", "clear"];
        break;
      case 3:
        toneWords = ["professional", "balanced", "informative"];
        break;
      case 4:
        toneWords = ["professional", "business-like", "authoritative"];
        break;
      case 5:
        toneWords = ["formal", "technical", "authoritative"];
        break;
      default:
        // Default to professional tone if invalid or not provided
        toneWords = ["professional", "informative", "authoritative"];
    }
  } else {
    // Use business identity tones if user preference not provided
    toneWords = businessIdentity?.personality?.toneOfVoice || [];
    
    // Default to professional tone if no tones specified
    if (!toneWords || toneWords.length === 0) {
      toneWords = ["professional", "friendly", "authoritative"];
    }
  }
  
  // Format the tones for the prompt
  const tonesText = toneWords.join(", ");
  
  // Build the base prompt with dynamic business information
  const basePrompt = `You are an expert social media content creator for ${businessName}. ` +
    `Create engaging content that showcases expertise and builds trust. ` +
    `The content should be appropriate for ${targetAudience} and maintain a ${tonesText} tone. ` +
    `Focus on creating value for the reader while showcasing ${industry} expertise.`;
  
  // Determine content length requirements based on user preference
  let linkedinLength, twitterLength, facebookLength, instagramLength;
  
  if (contentLength !== undefined) {
    // Adjust content length based on user preference
    switch(contentLength) {
      case 1: // Short
        linkedinLength = "500-700 characters";
        twitterLength = "under 200 characters";
        facebookLength = "50-100 words";
        instagramLength = "80-120 words";
        break;
      case 2: // Medium
        linkedinLength = "800-1000 characters";
        twitterLength = "200-280 characters";
        facebookLength = "100-180 words";
        instagramLength = "120-180 words";
        break;
      case 3: // Long
        linkedinLength = "1100-1500 characters";
        twitterLength = "260-280 characters";
        facebookLength = "200-280 words";
        instagramLength = "180-250 words";
        break;
      default:
        // Default medium length
        linkedinLength = "800-1000 characters";
        twitterLength = "200-280 characters";
        facebookLength = "100-180 words";
        instagramLength = "120-180 words";
    }
  } else {
    // Default lengths if not specified
    linkedinLength = "1000-1300 characters";
    twitterLength = "under 280 characters";
    facebookLength = "80-250 words";
    instagramLength = "150-200 words";
  }
  
  // Platform-specific instructions
  const platformSpecificPrompts: Record<string, string> = {
    linkedin: 
      basePrompt + 
      ` For LinkedIn, write with a ${tonesText} tone with business insights. ` +
      `Include relevant hashtags (3-5) at the end. Keep the post between ${linkedinLength}. ` +
      "Focus on thought leadership, industry insights, and professional development.",
      
    twitter: 
      basePrompt + 
      " For Twitter/X, be concise and direct. " +
      `Keep the post ${twitterLength}. ` +
      `Include 1-2 relevant hashtags. Use ${tonesText}, attention-grabbing language.`,
      
    facebook: 
      basePrompt + 
      ` For Facebook, use a ${tonesText} tone. ` +
      `Keep the post between ${facebookLength}. ` +
      "Ask a question at the end to encourage engagement.",
      
    instagram: 
      basePrompt + 
      ` For Instagram, write visually descriptive content with a ${tonesText} tone. ` +
      `Keep the post between ${instagramLength}. ` + 
      "Include a clear call-to-action and 5-10 relevant hashtags at the end. " +
      "Focus on visual storytelling that complements an image."
  };
  
  return platformSpecificPrompts[platform.toLowerCase()] || basePrompt;
}