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

Site Knowledge:
- The site now features industry-specific pages for Film, Music, Construction, and Professional Services industries
- There is a Business Calculator tool that helps visitors forecast their finances with a multi-step form
- The SME Support Hub provides downloadable resources and a directory of contacts for UK businesses
- All industry pages highlight specialized accounting services for that sector

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
6. Guide users to the most relevant resources for their industry

Site Features & Pages:
- Industry-specific pages: We have specialized accounting services for Film (/industries/film), Music (/industries/music), Construction (/industries/construction), and Professional Services industries
- Business Calculator (/business-calculator): An interactive tool to help businesses forecast their finances with a step-by-step approach
- SME Support Hub (/sme-support-hub): Provides downloadable resources, key business deadline information, and a directory of essential contacts for UK businesses
- Each industry page contains specialized information about accounting services tailored to that sector

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
            "Personalized service with dedicated accountants",
            "Industry-specific expertise in Film, Music, and Construction"
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
          "Cloud Accounting",
          "Industry-Specific Accounting for Film, Music & Construction",
          "Business Financial Forecasting",
          "SME Support & Resources"
        ],
        industryPages: [
          {
            name: "Film Industry",
            path: "/industries/film",
            description: "Specialized accounting services for film production companies, including Film Tax Relief and production accounting."
          },
          {
            name: "Music Industry",
            path: "/industries/music",
            description: "Financial services tailored for music artists, labels, and production companies."
          },
          {
            name: "Construction Industry",
            path: "/industries/construction",
            description: "Specialized accounting and tax services for construction businesses, including CIS and compliance support."
          }
        ],
        tools: [
          {
            name: "Business Calculator",
            path: "/business-calculator",
            description: "Interactive multi-step financial forecasting tool to help plan your business finances."
          },
          {
            name: "SME Support Hub",
            path: "/sme-support-hub",
            description: "Comprehensive resource center with downloadable guides, critical contacts directory, and key business deadlines."
          }
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
        '/testimonials',
        // Industry pages
        '/industries/film',
        '/industries/music',
        '/industries/construction',
        '/industries/professional-services',
        // Tool pages
        '/business-calculator',
        '/sme-support-hub'
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
        '/blog',
        '/industries/film',
        '/industries/music',
        '/industries/construction',
        '/business-calculator',
        '/sme-support-hub'
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