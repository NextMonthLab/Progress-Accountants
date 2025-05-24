import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

type SupportContext = {
  currentPage: string;
  timestamp: string;
  [key: string]: any;
};

type SupportFeedback = {
  clientId: string;
  context: string;
  messages: Array<{ role: string; content: string; timestamp: Date }>;
  timestamp: string;
};

/**
 * Process a support request and generate a response using OpenAI
 */
export async function processSupportRequest(message: string, clientId: string, context: SupportContext) {
  try {
    // Log the incoming request for analytics and monitoring
    console.log(`Support request from ${clientId} on ${context.currentPage}`);
    
    // Generate system prompt based on context
    const systemPrompt = generateSystemPrompt(context.currentPage);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    // Extract and return the assistant's response
    const assistantMessage = response.choices[0].message.content;
    
    // Log the interaction to vault
    await logToVault({
      clientId,
      context: context.currentPage,
      userMessage: message,
      assistantMessage,
      timestamp: new Date().toISOString()
    });
    
    return assistantMessage;
  } catch (error) {
    console.error("Error processing support request:", error);
    throw error;
  }
}

/**
 * Generate a system prompt based on the current page context
 */
function generateSystemPrompt(currentPage: string): string {
  // Base prompt for all contexts
  const basePrompt = `You are the Companion Console, a helpful assistant for Progress Accountants system users powered by NextMonth technology.
Be concise, professional, and friendly in your responses. Focus on providing practical advice about using the system.`;
  
  // Page-specific context additions
  const pageContexts: Record<string, string> = {
    '/': `You're helping with the main dashboard. This shows key financial metrics, tasks, and user notifications.`,
    '/onboarding': `You're helping with the onboarding process, which guides users through setting up their business profile, brand preferences, and initial configuration.`,
    '/onboarding/homepage_setup': `You're helping with homepage setup during onboarding. This step involves configuring the client's public-facing homepage content and design.`,
    '/onboarding/foundation_pages': `You're helping with foundation pages setup. This includes About Us, Services, Team pages, and other core website content.`,
    '/onboarding/launch_ready': `You're helping with the launch ready stage of onboarding, which finalizes all required configurations before the site goes live.`,
    '/marketplace': `You're helping with the Marketplace, where users can browse and activate additional modules and features.`,
    '/modules': `You're helping with the Modules page, which shows currently active modules and their status.`,
    '/seo': `You're helping with the SEO Configuration Manager. This tool manages metadata, sitemaps, and SEO settings for all pages.`,
    '/brand': `You're helping with the Brand Manager, which controls design elements, colors, typography, and visual assets.`,
    '/media': `You're helping with the Media Manager, which uploads, organizes, and manages images and other media assets.`,
    '/blueprint': `You're helping with the Blueprint Manager, which controls versioning and export of the system configuration.`,
  };
  
  // Find the most specific matching page
  let pagePrompt = '';
  Object.entries(pageContexts).forEach(([path, prompt]) => {
    if (currentPage.startsWith(path) && path.length > pagePrompt.length) {
      pagePrompt = prompt;
    }
  });
  
  return `${basePrompt}\n\n${pagePrompt || "You're helping with system navigation and general inquiries."}`;
}

/**
 * Log support interactions to the vault for analytics and improvement
 */
async function logToVault(data: any): Promise<boolean> {
  try {
    // In a production environment, this would make an API call to the vault
    // Here we'll just log it to console
    console.log("Logging support interaction to vault:", data);
    
    // Simulate API call for demonstration purposes
    // const response = await axios.post(`${process.env.VAULT_API_URL}/support-logs`, data);
    // return response.status === 200;
    
    return true;
  } catch (error) {
    console.error("Error logging to vault:", error);
    return false;
  }
}

/**
 * Handle feedback submissions to improve the support system
 */
export async function processSupportFeedback(feedback: SupportFeedback): Promise<boolean> {
  try {
    console.log("Support feedback received:", feedback);
    // In a production environment, this would be sent to an analytics system
    // Here we'll just log it
    
    return true;
  } catch (error) {
    console.error("Error processing support feedback:", error);
    return false;
  }
}

/**
 * API handler for support requests
 */
export async function handleSupportRequest(req: Request, res: Response) {
  try {
    const { message, clientId, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const response = await processSupportRequest(
      message,
      clientId || 'anonymous',
      context || { currentPage: '/', timestamp: new Date().toISOString() }
    );
    
    return res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error in support request handler:", error);
    return res.status(500).json({ error: "Failed to process support request" });
  }
}

/**
 * API handler for feedback submissions
 */
export async function handleSupportFeedback(req: Request, res: Response) {
  try {
    const feedback = req.body as SupportFeedback;
    
    if (!feedback.messages || !feedback.context) {
      return res.status(400).json({ error: "Invalid feedback format" });
    }
    
    await processSupportFeedback(feedback);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in support feedback handler:", error);
    return res.status(500).json({ error: "Failed to process feedback" });
  }
}

/**
 * Register support routes with the Express app
 */
export function registerSupportRoutes(app: any) {
  app.post('/api/support', handleSupportRequest);
  app.post('/api/support/feedback', handleSupportFeedback);
}