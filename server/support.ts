import OpenAI from "openai";
import { Express, Request, Response } from "express";
import { db } from "./db";
import { insertActivityLogSchema, activityLogs } from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Message type for conversation history
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Define endpoint handler for support chat
async function handleSupportChat(req: Request, res: Response) {
  try {
    const { message, screenName, businessId, blueprintVersion } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    
    // Log the support interaction to activity logs
    await db.insert(activityLogs).values({
      userType: "client",
      userId: null, // We'll set null since we might not have user authentication in this context
      actionType: "support_interaction",
      entityType: "support_chat",
      entityId: null,
      details: {
        message,
        screenName,
        businessId,
        blueprintVersion,
        timestamp: new Date().toISOString()
      }
    });
    
    // Build conversation with system context
    const systemPrompt = `You are the NextMonth Companion Console, an AI assistant for the Progress Accountants platform. 
    The user is currently on the '${screenName}' screen of the application.
    
    Their business ID is '${businessId}' and they're using blueprint version '${blueprintVersion}'.
    
    Answer their questions helpfully, warmly, and conversationally. Focus on their current screen context.
    If you don't know something, suggest they use the "Send to Dev" button to escalate their question.
    
    Some context about the screens:
    - home: The main dashboard page showing activity overview and quick links
    - client-dashboard: Shows client-specific financial information and updates
    - media-management: For uploading and organizing media files
    - seo-config-manager: For managing SEO settings across the site
    - brand-manager: For managing brand versions and design settings
    - homepage-setup: For configuring the client-facing homepage
    - marketplace: For exploring and activating additional modules
    
    Keep responses concise, friendly, and natural-sounding.`;
    
    // Set up message array for OpenAI
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];
    
    // Call OpenAI
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500
    });
    
    // Extract response
    const response = completion.choices[0].message.content;
    
    // Send response
    res.status(200).json({
      success: true,
      response
    });
    
  } catch (error: any) {
    console.error("Support chat error:", error);
    res.status(500).json({
      success: false,
      message: `Support chat error: ${error.message}`
    });
  }
}

// Define endpoint handler for sending to developers
async function handleSupportEscalation(req: Request, res: Response) {
  try {
    const { conversation, screenName, businessId, blueprintVersion } = req.body;
    
    // Log the escalation to activity logs
    await db.insert(activityLogs).values({
      userType: "client",
      userId: null, // We'll set null since we might not have user authentication in this context
      actionType: "support_escalation",
      entityType: "client_feedback",
      entityId: null,
      details: {
        conversation,
        screenName,
        businessId,
        blueprintVersion,
        timestamp: new Date().toISOString()
      }
    });
    
    // In a real implementation, you'd also send this to the Vault API
    // For now, we'll just log it
    console.log("Support escalation sent to developers:", {
      conversation,
      screenName,
      businessId,
      blueprintVersion
    });
    
    // Send success response
    res.status(200).json({
      success: true,
      message: "Support request escalated to developers"
    });
    
  } catch (error: any) {
    console.error("Support escalation error:", error);
    res.status(500).json({
      success: false,
      message: `Support escalation error: ${error.message}`
    });
  }
}

// Register support routes
export function registerSupportRoutes(app: Express): void {
  app.post("/api/support/chat", handleSupportChat);
  app.post("/api/support/escalate", handleSupportEscalation);
}