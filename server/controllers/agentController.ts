import { Request, Response, Express } from 'express';
import OpenAI from 'openai';
import { db } from '../db';
import { 
  conversationInsights, 
  agentConversations,
  insertConversationInsightSchema,
  insertAgentConversationSchema
} from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { useTenantContext } from '../middleware/tenantMiddleware';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store active conversations in memory
// We'll still persist data to the database for insights and full history
const activeConversations = new Map<string, any[]>();

/**
 * Register agent-related routes with the Express app
 */
export function registerAgentRoutes(app: Express) {
  console.log('Registering Progress Agent routes...');
  
  // Generate summary information about the instance
  app.get('/api/agent/summary', async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId || '00000000-0000-0000-0000-000000000000';
      const summary = await generateInstanceSummary(tenantId);
      res.json(summary);
    } catch (error) {
      console.error('Error generating agent summary:', error);
      res.status(500).json({ error: 'Failed to generate agent summary' });
    }
  });
  
  // Process a user message and return a response
  app.post('/api/agent/respond', async (req: Request, res: Response) => {
    try {
      const { message, mode = 'public', conversationId = null, metadata = {} } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Determine if user is an admin (for mode verification)
      const isAdmin = req.isAuthenticated && req.isAuthenticated();
      
      // If mode is admin but user is not authenticated, force public mode
      const actualMode = (mode === 'admin' && !isAdmin) ? 'public' : mode;
      
      // Generate response
      const responseData = await generateResponse(message, actualMode, conversationId, metadata, req.tenantId);
      
      // Return the response to the client
      res.json(responseData);
    } catch (error) {
      console.error('Error processing agent response:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  });
  
  // Retrieve conversation insights for admin dashboard
  app.get('/api/agent/insights', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const insights = await db
        .select()
        .from(conversationInsights)
        .where(eq(conversationInsights.mode, 'public'))
        .orderBy(desc(conversationInsights.createdAt))
        .limit(50);
      
      res.json(insights);
    } catch (error) {
      console.error('Error retrieving conversation insights:', error);
      res.status(500).json({ error: 'Failed to retrieve insights' });
    }
  });
  
  // Get statistics about conversations
  app.get('/api/agent/stats', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // We would implement more complex statistics here in a real system
      const totalConversations = await db
        .select({ count: db.fn.count() })
        .from(agentConversations);
      
      const totalInsights = await db
        .select({ count: db.fn.count() })
        .from(conversationInsights);
      
      const leads = await db
        .select({ count: db.fn.count() })
        .from(conversationInsights)
        .where(eq(conversationInsights.leadPotential, true));
      
      res.json({
        totalConversations: totalConversations[0]?.count || 0,
        totalInsights: totalInsights[0]?.count || 0,
        leadPotential: leads[0]?.count || 0
      });
    } catch (error) {
      console.error('Error retrieving agent stats:', error);
      res.status(500).json({ error: 'Failed to retrieve agent statistics' });
    }
  });
  
  console.log('✅ Progress Agent routes registered');
}

/**
 * Generate a response to a user message
 */
async function generateResponse(
  message: string, 
  mode: string, 
  conversationId: string | null,
  metadata: any, 
  tenantId?: string
) {
  // Generate a new conversation ID if one wasn't provided
  const currentConversationId = conversationId || uuidv4();
  
  // Get or initialize conversation history
  let conversation = activeConversations.get(currentConversationId) || [];
  
  // If this is a new conversation, set up the system message based on mode
  if (conversation.length === 0) {
    const systemPrompt = getSystemPrompt(mode);
    conversation.push({ role: 'system', content: systemPrompt });
  }
  
  // Add the user's message
  conversation.push({ role: 'user', content: message });
  
  // Generate response from OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: conversation,
    max_tokens: 1000,
  });
  
  const assistantResponse = completion.choices[0].message.content || "I'm not sure how to respond to that.";
  
  // Add the assistant's response to the conversation
  conversation.push({ role: 'assistant', content: assistantResponse });
  
  // Update in-memory conversation
  activeConversations.set(currentConversationId, conversation);
  
  // Persist conversation to database if it's not there already
  await saveOrUpdateConversation(currentConversationId, conversation, mode, metadata, tenantId);
  
  // If public-facing mode, analyze and store insight
  if (mode === 'public') {
    await analyzeAndStoreInsight(currentConversationId, message, assistantResponse, metadata, tenantId);
  }
  
  return {
    message: assistantResponse,
    conversationId: currentConversationId,
    mode
  };
}

/**
 * Generate a system prompt based on the mode
 */
function getSystemPrompt(mode: string): string {
  if (mode === 'admin') {
    return `You are Progress Agent, the embedded intelligence of the Progress client site, operating in ADMIN mode.
As the Internal System Agent, you:
- Act as a representative of the Progress system in council meetings
- Respond to system-level questions about tool status, site configuration, and health
- Generate diagnostics and status reports when requested
- Share insights from user conversations (summarized, never raw)
- Speak with calm, professional authority
- Identify yourself as "Progress Agent" during council sessions

You have full knowledge of the system's internal workings and can discuss technical implementation details
when asked by authorized users. You should be helpful, detailed, and accurate in your responses.`;
  } else {
    return `You are Progress Agent, the embedded intelligence of the Progress client site, operating in PUBLIC mode.
As the Public-Facing Website Assistant, you:
- Maintain a friendly, helpful tone at all times
- Assist visitors with information about the business, services, and website content
- Do NOT reveal internal system details or backend logic
- Focus on providing relevant information about Progress Accountants services
- Answer questions about the business in a professional and informative way

Progress Accountants is a professional accounting firm founded in 2018 with expertise in tax planning,
bookkeeping, business advisory, and other financial services for small and medium businesses in the UK.

You should avoid discussing system implementation details, database structure, 
or any technical aspects of how the website works.`;
  }
}

/**
 * Save a conversation to the database or update an existing one
 */
async function saveOrUpdateConversation(
  conversationId: string, 
  messages: any[], 
  mode: string,
  metadata: any,
  tenantId?: string
) {
  try {
    // Check if conversation already exists
    const existingConversation = await db
      .select()
      .from(agentConversations)
      .where(eq(agentConversations.conversationId, conversationId));
    
    if (existingConversation.length > 0) {
      // Update existing conversation
      await db
        .update(agentConversations)
        .set({
          messages: messages,
          updatedAt: new Date()
        })
        .where(eq(agentConversations.conversationId, conversationId));
    } else {
      // Create new conversation
      await db.insert(agentConversations).values({
        conversationId,
        tenantId: tenantId,
        messages: messages,
        mode,
        metadata,
      });
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

/**
 * Analyze a conversation message and store insights
 */
async function analyzeAndStoreInsight(
  conversationId: string,
  userMessage: string,
  agentResponse: string,
  metadata: any,
  tenantId?: string
) {
  try {
    // Generate analysis with OpenAI
    const analysisPrompt = `
    Analyze this conversation between a user and Progress Accountants' AI assistant:
    
    USER: "${userMessage}"
    
    ASSISTANT: "${agentResponse}"
    
    Provide a JSON response with the following fields:
    - intent: What was the user's primary intent or question?
    - sentiment: The user's sentiment (positive, negative, neutral)
    - leadPotential: Boolean (true/false) indicating if this user shows potential as a business lead
    - confusionDetected: Boolean (true/false) indicating if the user seems confused
    - tags: Array of 1-5 topic tags related to the conversation
    - analysisNotes: Brief insights about this interaction (2-3 sentences)
    `;
    
    const analysis = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: 'user', content: analysisPrompt }],
      response_format: { type: "json_object" }
    });
    
    // Parse analysis as JSON
    const analysisData = JSON.parse(analysis.choices[0].message.content || '{}');
    
    // Store insight in database
    await db.insert(conversationInsights).values({
      conversationId,
      tenantId,
      userMessage,
      agentResponse,
      mode: 'public',
      intent: analysisData.intent || null,
      sentiment: analysisData.sentiment || 'neutral',
      leadPotential: analysisData.leadPotential || false,
      confusionDetected: analysisData.confusionDetected || false,
      tags: analysisData.tags || [],
      analysisNotes: analysisData.analysisNotes || null,
      metadata,
    });
  } catch (error) {
    console.error('Error analyzing and storing insight:', error);
  }
}

/**
 * Generate a summary of the current instance
 */
async function generateInstanceSummary(tenantId: string) {
  try {
    // In a real system, we'd gather this data from various sources
    // For now, we'll return mock summary data
    return {
      name: "Progress Accountants",
      version: "1.1.1",
      tenantId: tenantId,
      status: "operational",
      lastUpdated: new Date().toISOString(),
      tools: [
        { id: "page-builder", status: "operational", version: "1.0.4" },
        { id: "media-manager", status: "operational", version: "1.2.1" },
        { id: "seo-manager", status: "operational", version: "0.9.8" },
        { id: "social-media-generator", status: "operational", version: "1.0.0" }
      ],
      stats: {
        conversations: await getConversationCount(),
        insights: await getInsightCount(),
        leads: await getLeadCount()
      }
    };
  } catch (error) {
    console.error('Error generating instance summary:', error);
    throw error;
  }
}

/**
 * Get the count of conversations
 */
async function getConversationCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: db.fn.count() })
      .from(agentConversations);
    
    return Number(result[0]?.count || 0);
  } catch (error) {
    console.error('Error counting conversations:', error);
    return 0;
  }
}

/**
 * Get the count of conversation insights
 */
async function getInsightCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: db.fn.count() })
      .from(conversationInsights);
    
    return Number(result[0]?.count || 0);
  } catch (error) {
    console.error('Error counting insights:', error);
    return 0;
  }
}

/**
 * Get the count of potential leads
 */
async function getLeadCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: db.fn.count() })
      .from(conversationInsights)
      .where(eq(conversationInsights.leadPotential, true));
    
    return Number(result[0]?.count || 0);
  } catch (error) {
    console.error('Error counting leads:', error);
    return 0;
  }
}