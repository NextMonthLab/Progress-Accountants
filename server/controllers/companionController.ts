import { Request, Response } from 'express';
import OpenAI from 'openai';
import { db } from '../db';
import { businessIdentity, brandVersions, users } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define message types
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// In-memory conversation storage
const conversations = new Map<string, Array<ChatMessage>>();

/**
 * Get system prompt based on mode and context
 */
async function getSystemPrompt(mode: 'admin' | 'public', tenantId?: string | null): Promise<string> {
  try {
    // Get business identity
    const identity = tenantId 
      ? await db.select().from(businessIdentity).where(eq(businessIdentity.tenantId, tenantId)).limit(1)
      : await db.select().from(businessIdentity).limit(1);
    
    // Get brand version
    const brandVersion = tenantId
      ? await db.select().from(brandVersions)
          .where(eq(brandVersions.tenantId, tenantId))
          .orderBy(desc(brandVersions.createdAt))
          .limit(1)
      : await db.select().from(brandVersions)
          .orderBy(desc(brandVersions.createdAt))
          .limit(1);
    
    const businessData = identity[0];
    const brandData = brandVersion[0];
    
    // Building system prompt based on mode
    if (mode === 'admin') {
      return `
You are an AI assistant for Progress Accountants' internal admin interface.

ROLE: You are a proactive, productivity-focused assistant for the admin team.

CONTEXT:
- Business: ${businessData?.name || 'Progress Accountants'}
- Services: ${businessData?.services ? JSON.stringify(businessData.services) : 'Accounting services, Tax planning, Business advisory'}
- Voice/Tone: ${brandData?.tonalStyle || 'Professional, helpful, knowledgeable'}

GOALS:
1. Help admins create and manage content (blogs, tools, pages)
2. Answer questions about the platform functionality
3. Provide strategic advice on accounting-related content
4. Assist with technical setup of platform features

CAPABILITIES:
- You have access to business settings and admin features
- You can help with content creation, SEO, and technical setup
- You can provide strategy recommendations for business growth

RESTRICTIONS:
- Never reveal internal system implementation details
- Don't discuss client data or sensitive information
- If you're asked to perform actions you can't do, explain what admin needs to do manually

HOW TO RESPOND:
- Be concise but thorough
- Include actionable steps when possible
- Reference relevant admin sections/tools when available
- Use professional, direct tone
      `;
    } else {
      // Public mode
      return `
You are an AI assistant for the public-facing website of ${businessData?.name || 'Progress Accountants'}.

ROLE: You are a friendly customer-facing representative.

CONTEXT:
- Business: ${businessData?.name || 'Progress Accountants'}
- Services: ${businessData?.services ? JSON.stringify(businessData.services) : 'Accounting services, Tax planning, Business advisory'}
- Voice/Tone: ${brandData?.tonalStyle || 'Professional, helpful, friendly'}

GOALS:
1. Help visitors find information about services
2. Answer questions about the business
3. Guide potential clients to relevant content
4. Encourage booking consultations or contacting the business

CAPABILITIES:
- You can provide information that's publicly available on the website
- You can guide visitors to relevant services and pages
- You can explain accounting concepts in simple terms

RESTRICTIONS:
- You only have access to public information
- Don't discuss pricing unless explicitly mentioned on the site
- Don't make promises about service outcomes
- Never mention that you're operating in different "modes" or that there's an admin interface

HOW TO RESPOND:
- Be friendly and approachable
- Use simple language, avoiding technical jargon
- Keep responses concise and focused on helping the visitor
- Always encourage visitors to contact the business for specific inquiries
      `;
    }
  } catch (error) {
    console.error('Error building system prompt:', error);
    
    // Fallback system prompts if database queries fail
    if (mode === 'admin') {
      return `
You are an AI assistant for Progress Accountants' internal admin interface.
You help team members with content creation, business strategy, and using the admin platform effectively.
Be professional, direct, and actionable in your responses.
      `;
    } else {
      return `
You are an AI assistant for Progress Accountants' public website.
You help visitors learn about services, find information, and connect with the accounting team.
Be friendly, helpful, and encourage visitors to contact the business for specific inquiries.
      `;
    }
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
      
      // Get or generate conversation ID
      const currentConversationId = conversationId || Date.now().toString();
      
      // Get or initialize conversation history
      let conversationHistory = conversations.get(currentConversationId) || [];
      
      // Check if this is the first message
      const isFirstMessage = conversationHistory.length === 0;
      
      // For first message, add the appropriate system prompt based on mode
      if (isFirstMessage) {
        // Get user and tenant ID if authenticated
        const user = req.user;
        const tenantId = user?.tenantId;
        
        // Add system prompt based on mode (default to public if not specified)
        const systemPrompt = await getSystemPrompt(mode === 'admin' ? 'admin' : 'public', tenantId);
        
        conversationHistory.push({ 
          role: 'system', 
          content: systemPrompt 
        });
      }
      
      // Add user message to history
      conversationHistory.push({ role: 'user', content: message });
      
      // Check for OpenAI API key
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }
      
      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 800,
      });
      
      // Get assistant's response
      const assistantResponse = completion.choices[0].message.content || '';
      
      // Add assistant response to history
      conversationHistory.push({ role: 'assistant', content: assistantResponse });
      
      // Save updated conversation
      conversations.set(currentConversationId, conversationHistory);
      
      // Return the response
      return res.status(200).json({
        message: assistantResponse,
        conversationId: currentConversationId,
        mode: mode || 'public'
      });
    } catch (error: any) {
      console.error('Error in companion chat:', error);
      return res.status(500).json({ 
        error: 'Failed to process chat message', 
        details: error.message 
      });
    }
  },
  
  /**
   * Get business identity for companion
   */
  async getBusinessIdentity(req: Request, res: Response) {
    try {
      // Get user and tenant ID if authenticated
      const user = req.user;
      const tenantId = user?.tenantId;
      
      // Query business identity
      const identity = tenantId 
        ? await db.select().from(businessIdentity).where(eq(businessIdentity.tenantId, tenantId)).limit(1)
        : await db.select().from(businessIdentity).limit(1);
      
      if (identity.length === 0) {
        return res.status(404).json({ error: 'Business identity not found' });
      }
      
      return res.status(200).json(identity[0]);
    } catch (error: any) {
      console.error('Error getting business identity:', error);
      return res.status(500).json({ 
        error: 'Failed to get business identity', 
        details: error.message 
      });
    }
  }
};

/**
 * Register companion routes
 */
export function registerCompanionRoutes(app: any): void {
  // Chat endpoint
  app.post('/api/companion/chat', async (req: Request, res: Response) => {
    try {
      await CompanionController.chat(req, res);
    } catch (error: any) {
      console.error('Error in companion chat route:', error);
      res.status(500).json({ error: 'An error occurred processing your request' });
    }
  });
  
  // Business identity endpoint
  app.get('/api/business-identity', async (req: Request, res: Response) => {
    try {
      await CompanionController.getBusinessIdentity(req, res);
    } catch (error: any) {
      console.error('Error in business identity route:', error);
      res.status(500).json({ error: 'An error occurred retrieving business identity' });
    }
  });
}