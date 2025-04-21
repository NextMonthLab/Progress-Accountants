import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define message type
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// In-memory storage for conversations
const conversations = new Map<string, ChatMessage[]>();

/**
 * Get system prompt based on mode
 */
function getSystemPrompt(mode: 'admin' | 'public'): string {
  if (mode === 'admin') {
    return `You are an administrative assistant for Progress Accountants. You help users with administrative tasks, content creation, and platform management.
    
You are helping manage an accounting services platform.
Be professional, helpful, and concise.

Your role:
1. Help with content creation including web pages, social media posts, and articles
2. Explain how to use the platform features
3. Provide recommendations for optimizing content and SEO
4. Assist with administrative tasks like user management and settings

Always suggest using the platform's built-in tools rather than external solutions.
Provide clear, step-by-step instructions for complex tasks.
Never claim to be able to directly modify content - you can only advise and instruct.`;
  } else {
    return `You are a customer service assistant for Progress Accountants. You help website visitors with information about services, team, and accounting needs.
    
You represent an accounting services company.
Be professional, helpful, and concise.

Your role:
1. Answer questions about accounting services offered
2. Provide general information about tax requirements and deadlines
3. Explain the benefits of working with professional accountants
4. Help website visitors understand what makes this accounting firm unique
5. Assist with finding appropriate contact information

Stay focused on accounting topics. If asked about sensitive financial matters, suggest scheduling a consultation.
Don't provide specific legal or financial advice - suggest speaking with an accountant for personalized guidance.
Always maintain a professional but friendly tone.
Never claim to have access to personal financial data.`;
  }
}

export const CompanionController = {
  /**
   * Handle companion chat message
   */
  async chat(req: Request, res: Response) {
    try {
      const { message, conversationId, mode } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Determine chat mode (admin or public)
      const chatMode = mode === 'admin' ? 'admin' : 'public';
      
      // Get or create conversation
      const currentConversationId = conversationId || Date.now().toString();
      let conversation = conversations.get(currentConversationId) || [];
      
      // If this is a new conversation, add system prompt
      if (conversation.length === 0) {
        const systemPrompt = getSystemPrompt(chatMode);
        conversation.push({ role: 'system', content: systemPrompt });
      }
      
      // Add user message
      conversation.push({ role: 'user', content: message });
      
      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: conversation,
        max_tokens: 1000,
      });
      
      // Save assistant's response and update conversation
      const assistantMessage = completion.choices[0].message.content || "I'm not sure how to respond to that.";
      conversation.push({
        role: 'assistant',
        content: assistantMessage
      });
      
      // Save updated conversation
      conversations.set(currentConversationId, conversation);
      
      // Return response
      return res.status(200).json({
        message: assistantMessage,
        conversationId: currentConversationId
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      return res.status(500).json({
        error: 'Error processing chat request',
        message: error.message
      });
    }
  },

  /**
   * Get business identity for companion
   */
  async getBusinessIdentity(req: Request, res: Response) {
    try {
      // Return default business identity
      return res.status(200).json({
        core: {
          businessName: "Progress Accountants",
          tagline: "Forward-thinking accounting for modern businesses",
          description: "We provide innovative accounting solutions tailored to your business needs.",
          yearFounded: "2018",
          numberOfEmployees: "25-50"
        },
        market: {
          primaryIndustry: "Accounting",
          targetAudience: "Small to medium-sized businesses",
          geographicFocus: "United Kingdom"
        },
        personality: {
          toneOfVoice: ["Professional", "Approachable", "Knowledgeable"],
          usps: [
            "Specialized in digital business transformation",
            "Tech-forward accounting solutions",
            "Personalized service with dedicated accountants"
          ],
          missionStatement: "To empower businesses with financial clarity and strategic insights for sustainable growth."
        },
        contact: {
          phone: "+44 20 1234 5678",
          email: "info@progressaccountants.com",
          address: "10 Accounting Avenue, London, UK",
          website: "www.progressaccountants.com"
        },
        services: [
          "Tax Planning & Preparation",
          "Bookkeeping",
          "Business Advisory",
          "Financial Reporting",
          "Audit Services",
          "Cloud Accounting"
        ],
        lastUpdated: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Business identity error:', error);
      return res.status(500).json({
        error: 'Error fetching business identity',
        message: error.message
      });
    }
  },

  /**
   * Get list of public pages for mode detection
   */
  async getPublicPages(req: Request, res: Response) {
    try {
      // Get pages that are publicly accessible (all sites have these)
      const defaultPublicPages = [
        '/',
        '/about',
        '/services',
        '/team',
        '/contact',
        '/blog',
        '/faq',
        '/testimonials'
      ];
      
      return res.status(200).json(defaultPublicPages);
    } catch (error: any) {
      console.error('Public pages error:', error);
      return res.status(200).json([
        '/',
        '/about',
        '/services',
        '/team',
        '/contact',
        '/blog'
      ]);
    }
  }
};

/**
 * Register companion routes
 */
export function registerCompanionRoutes(app: any): void {
  // Chat endpoint
  app.post('/api/companion/chat', async (req: Request, res: Response) => {
    await CompanionController.chat(req, res);
  });
  
  // Get business identity
  app.get('/api/business-identity', async (req: Request, res: Response) => {
    await CompanionController.getBusinessIdentity(req, res);
  });
  
  // Get public pages for mode detection
  app.get('/api/pages/public', async (req: Request, res: Response) => {
    await CompanionController.getPublicPages(req, res);
  });
}