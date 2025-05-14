import OpenAI from "openai";

// Initialize OpenAI client with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validate that OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY environment variable is not set. AI features will not work.");
}

/**
 * Generate blog post content using GPT-4
 * @param topic Main topic for the blog post
 * @param keywords Keywords to include in the blog post
 * @param targetAudience Target audience for the blog post
 * @param contentLength Optional content length preference (1=short, 2=medium, 3=long)
 * @param toneOfVoice Optional tone of voice preference (1=casual, 3=professional, 5=formal)
 * @returns Object containing generated title, content and meta description
 */
// Business identity interface
interface BusinessIdentity {
  core?: {
    businessName?: string;
  };
  market?: {
    primaryIndustry?: string;
    targetAudience?: string;
  };
  personality?: {
    toneOfVoice?: string[];
  };
}

export async function generateBlogPost(
  topic: string,
  keywords: string,
  targetAudience: string,
  contentLength?: number,
  toneOfVoice?: number,
  businessIdentity?: BusinessIdentity
): Promise<{ title: string; content: string; metaDescription: string }> {
  try {
    const systemPrompt = getBlogSystemPrompt(targetAudience, contentLength, toneOfVoice, businessIdentity);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate a blog post about "${topic}". Include these keywords: ${keywords}.`
        }
      ],
      temperature: 0.7,
      max_tokens: getMaxTokensForLength(contentLength),
      response_format: { type: "json_object" },
    });
    
    const contentStr = response.choices[0].message.content;
    
    if (!contentStr) {
      throw new Error("No content was generated");
    }
    
    const generatedContent = JSON.parse(contentStr);
    
    return {
      title: generatedContent.title || `How ${topic} is Transforming Modern Business`,
      content: generatedContent.content || "Content generation failed.",
      metaDescription: generatedContent.metaDescription || `Learn about ${topic} and how it can benefit ${targetAudience}.`
    };
  } catch (error) {
    console.error("Error generating blog post with OpenAI:", error);
    throw new Error(`Failed to generate blog post: ${(error as Error).message}`);
  }
}

/**
 * Generate image prompt for the blog post
 * @param topic Main topic of the blog post
 * @param targetAudience Target audience for the blog post
 * @returns Generated image prompt
 */
export function generateImagePrompt(topic: string, targetAudience: string): string {
  return `Create a professional business image representing ${topic} in a modern corporate setting, showing business professionals working with ${topic} technology. The image should appeal to ${targetAudience}.`;
}

/**
 * Get the appropriate system prompt based on target audience and user preferences
 * @param targetAudience Target audience for the blog post
 * @param contentLength Optional content length preference (1=short, 2=medium, 3=long)
 * @param toneLevel Optional tone of voice preference (1=casual, 3=professional, 5=formal)
 * @param businessIdentity Optional business identity information
 * @returns Customized system prompt
 */
function getBlogSystemPrompt(
  targetAudience: string,
  contentLength?: number,
  toneLevel?: number,
  businessIdentity?: BusinessIdentity
): string {
  // Determine word count based on content length
  let wordCount: string;
  
  switch(contentLength) {
    case 1: // Short
      wordCount = "500 words";
      break;
    case 2: // Medium
      wordCount = "1000 words";
      break;
    case 3: // Long
      wordCount = "1500+ words";
      break;
    default:
      wordCount = "1000 words"; // Default to medium length
  }
  
  // Determine tone based on user preference
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
        // Default to professional tone if invalid
        toneWords = ["professional", "informative", "authoritative"];
    }
  } else {
    // Default to professional tone if not provided
    toneWords = ["professional", "friendly", "authoritative"];
  }
  
  // Format the tones for the prompt
  const tonesText = toneWords.join(", ");
  
  // Use business identity if available
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  
  // Use business identity tone of voice if available and no explicit tone was requested
  if (toneLevel === undefined && businessIdentity?.personality?.toneOfVoice && businessIdentity.personality.toneOfVoice.length > 0) {
    toneWords = businessIdentity.personality.toneOfVoice.slice(0, 3);
  }
  
  // Get industry if available
  const industry = businessIdentity?.market?.primaryIndustry ? 
    `with expertise in the ${businessIdentity.market.primaryIndustry} industry` : "";
  
  const systemPrompt = `You are an expert business blog writer for ${businessName} ${industry}. Create a high-quality, engaging blog post that's approximately ${wordCount} in length and tailored for ${targetAudience}. Use a ${tonesText} tone throughout the article.

Your blog post should be well-structured with clear headings, concise paragraphs, and a logical flow. Include:
1. An attention-grabbing title
2. An introduction that hooks the reader
3. Several substantive sections with descriptive H2 and H3 headings
4. Practical advice and actionable insights
5. A conclusion with next steps or a call to action

Format your response as a JSON object with the following structure:
{
  "title": "Your compelling blog post title here",
  "content": "The full blog post content with markdown formatting",
  "metaDescription": "A concise 155-160 character meta description for SEO"
}

The content should use proper markdown formatting with ## for H2 headings and ### for H3 headings. Ensure that your writing is factual, authoritative, and provides genuine value to the reader.`;

  return systemPrompt;
}

/**
 * Get the appropriate max_tokens value based on content length
 * @param contentLength Optional content length preference (1=short, 2=medium, 3=long)
 * @returns max_tokens value
 */
function getMaxTokensForLength(contentLength?: number): number {
  switch(contentLength) {
    case 1: // Short
      return 2000; // Approx. 500 words
    case 2: // Medium
      return 3500; // Approx. 1000 words
    case 3: // Long
      return 6000; // Approx. 1500+ words
    default:
      return 3500; // Default to medium length
  }
}