import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate an image using DALL-E model
 * @param prompt Text prompt describing the desired image
 * @returns Image URL
 */
export async function generateImage(prompt: string): Promise<{ url: string }> {
  try {
    // the newest OpenAI model is "dall-e-3" which was released May 2024. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data[0].url };
  } catch (error) {
    console.error("Error generating image with OpenAI:", error);
    throw new Error(`Failed to generate image: ${(error as Error).message}`);
  }
}

/**
 * Generate AI-powered post content for social media
 * @param prompt Text prompt for post generation
 * @param platform Target social media platform
 * @returns Generated content
 */
export async function generateSocialMediaPost(prompt: string, platform: string): Promise<{ text: string }> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional social media expert writing for ${platform}. 
          Generate engaging, professional content that meets the platform's best practices.
          For LinkedIn: professional, insightful content with industry trends.
          For Twitter/X: concise, impactful messages under 280 characters.
          For Instagram: visual-focused with relevant hashtags.
          For Facebook: conversational with clear call-to-action.
          Keep the tone aligned with a professional accounting firm.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
    });

    return { text: response.choices[0].message.content || "Unable to generate content" };
  } catch (error) {
    console.error("Error generating social media post with OpenAI:", error);
    throw new Error(`Failed to generate post content: ${(error as Error).message}`);
  }
}