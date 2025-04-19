import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  type FeatureRequest, 
  type ModuleActivation, 
  type PageComplexityTriage,
  insertPageComplexityTriageSchema,
  insertModuleActivationSchema 
} from "@shared/schema";
import { 
  PageMetadata, 
  PageComplexityAssessment, 
  ComplexityLevel 
} from "@shared/page_metadata";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the role type for the OpenAI API
type Role = "system" | "user" | "assistant";

// Define the message type for conversations
interface ChatMessage {
  role: Role;
  content: string;
}

// System prompt for the scoping assistant
const SYSTEM_PROMPT = `You are a scoping assistant helping internal Progress Accountants staff prepare feature requests for the NextMonth Dev team.

Your goal is to turn rough ideas into a structured JSON prompt for development.

Ask only simple, focused questions. Avoid technical jargon.

Once the user has answered enough questions, say:  
"Great! I've structured this request. Shall I send it to NextMonth Dev for review?"

When confirmed, prepare a JSON output in the following format:

{
  "project": "progress_accountants",
  "type": "screen_request",
  "payload": {
    "screen_name": "...",
    "description": "...",
    "features": [ "...", "...", "..." ]
  }
}`;

// Schema for chat request
const chatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().nullable().optional(),
});

// Schema for finalizing request
const finalizeRequestSchema = z.object({
  requestData: z.object({
    project: z.string(),
    type: z.string(),
    payload: z.union([
      // Standard screen request
      z.object({
        screen_name: z.string(),
        description: z.string(),
        features: z.array(z.string())
      }),
      // Module request from Module Gallery
      z.object({
        screen_name: z.string(),
        description: z.string(),
        status: z.enum(['complete', 'CPT_ready', 'designed', 'dev_in_progress']),
        business_id: z.string()
      }),
      // Module request from Module Library
      z.object({
        screen_name: z.string(),
        description: z.string(),
        status: z.string(),
        zone: z.string().optional(),
        tags: z.array(z.string()).optional(),
        business_id: z.string()
      })
    ])
  })
});

// Define contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2),
  business: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(10),
});

// Type for contact submissions
interface ContactSubmission {
  id: number;
  name: string;
  business?: string;
  email: string;
  phone?: string;
  industry?: string;
  message: string;
  date: Date;
}

// Extend storage interface for contact form submissions
declare module "./storage" {
  interface IStorage {
    saveContactSubmission(data: Omit<ContactSubmission, "id" | "date">): Promise<ContactSubmission>;
    getContactSubmissions(): Promise<ContactSubmission[]>;
  }
}

// Add methods to in-memory storage
storage.saveContactSubmission = async function(data) {
  const id = this.currentId++;
  const submission: ContactSubmission = { 
    ...data, 
    id, 
    date: new Date() 
  };
  
  if (!this.contactSubmissions) {
    this.contactSubmissions = new Map<number, ContactSubmission>();
  }
  
  this.contactSubmissions.set(id, submission);
  return submission;
};

storage.getContactSubmissions = async function() {
  if (!this.contactSubmissions) {
    this.contactSubmissions = new Map<number, ContactSubmission>();
  }
  
  return Array.from(this.contactSubmissions.values());
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      
      const submission = await storage.saveContactSubmission(validatedData);
      
      res.status(200).json({ 
        success: true, 
        message: "Contact form submitted successfully",
        id: submission.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "An error occurred while processing your request" 
      });
    }
  });

  // CLIENT DASHBOARD API ENDPOINTS
  // These endpoints are primarily handled on the client side using mock data
  // They're defined here for future integration with a real backend

  // Get client dashboard data
  app.get("/api/client-dashboard", (req, res) => {
    const clientId = req.query.clientId || 1;
    
    res.status(200).json({
      success: true,
      message: "This endpoint is mocked in the client-side for development",
      clientId
    });
  });

  // Mark task as completed
  app.post("/api/client-dashboard/task/complete", (req, res) => {
    const { taskId, clientId } = req.body;
    
    if (!taskId || !clientId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      data: { taskId, clientId }
    });
  });

  // Send a message
  app.post("/api/client-dashboard/message", (req, res) => {
    const { content, clientId } = req.body;
    
    if (!content || !clientId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: {
        id: Date.now(),
        content,
        clientId,
        timestamp: new Date().toISOString()
      }
    });
  });

  // Upload a document
  app.post("/api/client-dashboard/document", (req, res) => {
    const { name, type, size, clientId } = req.body;
    
    if (!name || !clientId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        id: Date.now(),
        name,
        type: type || "application/octet-stream",
        size: size || "0 KB",
        clientId,
        uploadDate: new Date().toISOString()
      }
    });
  });

  // Get activity log
  app.get("/api/client-dashboard/activity", (req, res) => {
    const clientId = req.query.clientId || 1;
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "This endpoint is mocked in the client-side for development",
      clientId
    });
  });

  // CRM API ENDPOINTS
  // These endpoints are primarily handled on the client side using mock data
  // They're defined here for future integration with a real backend

  // Get all clients
  app.get("/api/crm/clients", (_req, res) => {
    // Mock success response
    res.status(200).json({
      success: true,
      message: "This endpoint is mocked in the client-side for development"
    });
  });

  // Get client by ID
  app.get("/api/crm/client/:id", (req, res) => {
    const clientId = req.params.id;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: "Client ID is required"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "This endpoint is mocked in the client-side for development",
      clientId
    });
  });

  // Add a note
  app.post("/api/crm/note", (req, res) => {
    const { clientId, content, isPrivate, staffId } = req.body;
    
    if (!clientId || !content || staffId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: {
        id: Date.now(),
        clientId,
        content,
        isPrivate: isPrivate || false,
        staffId,
        createdAt: new Date().toISOString()
      }
    });
  });

  // Update task status
  app.post("/api/crm/task/status", (req, res) => {
    const { clientId, taskId, status, staffId } = req.body;
    
    if (!clientId || !taskId || !status || staffId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: { clientId, taskId, status, staffId }
    });
  });

  // Send message to client
  app.post("/api/crm/message", (req, res) => {
    const { clientId, content, staffId, staffName } = req.body;
    
    if (!clientId || !content || staffId === undefined || !staffName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: {
        id: Date.now(),
        clientId,
        content,
        staffId,
        staffName,
        timestamp: new Date().toISOString()
      }
    });
  });

  // Upload document for client
  app.post("/api/crm/document", (req, res) => {
    const { clientId, file, staffId } = req.body;
    
    if (!clientId || !file || staffId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        id: Date.now(),
        clientId,
        ...file,
        staffId,
        uploadDate: new Date().toISOString()
      }
    });
  });

  // Create task for client
  app.post("/api/crm/task", (req, res) => {
    const { clientId, task, staffId } = req.body;
    
    if (!clientId || !task || staffId === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "Task created successfully",
      data: {
        id: Date.now(),
        clientId,
        ...task,
        staffId,
        createdAt: new Date().toISOString()
      }
    });
  });

  // Get activity log
  app.get("/api/crm/activity", (req, res) => {
    const clientId = req.query.clientId;
    
    // Mock success response
    res.status(200).json({
      success: true,
      message: "This endpoint is mocked in the client-side for development",
      clientId: clientId || "all"
    });
  });

  // FEATURE REQUEST SCOPING ASSISTANT ENDPOINTS
  
  // In-memory conversation storage
  const conversations = new Map<string, Array<ChatMessage>>();
  
  // Create a new conversation or continue existing one
  app.post("/api/scope-request/chat", async (req: Request, res: Response) => {
    try {
      console.log("Received chat request:", req.body);
      const { message, conversationId } = chatRequestSchema.parse(req.body);
      
      // Generate or use existing conversation ID
      const currentConversationId = conversationId || Date.now().toString();
      console.log("Using conversation ID:", currentConversationId);
      
      // Get or initialize conversation history
      let conversationHistory = conversations.get(currentConversationId) || [];
      console.log("Current conversation history:", conversationHistory);
      
      // Check if this is the first user message (to apply screening)
      const isFirstUserMessage = conversationHistory.length === 0;
      
      // If this is a new conversation, add the system prompt
      if (isFirstUserMessage) {
        conversationHistory.push({ role: "system", content: SYSTEM_PROMPT });
        console.log("Added system prompt to new conversation");
      }
      
      // Add user message to history
      conversationHistory.push({ role: "user", content: message });
      console.log("Added user message to history");
      
      // Check if we have an API key
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not set");
        throw new Error("OpenAI API key is not configured");
      }
      
      // Apply feature screening if this is the first message in the conversation
      if (isFirstUserMessage) {
        try {
          const { handleFeatureRequest } = require('./feature-screening');
          console.log("Applying feature screening to first message...");
          
          const screeningResult = await handleFeatureRequest(message);
          console.log("Feature screening result:", screeningResult);
          
          // Add the assistant's screening response to the conversation
          conversationHistory.push({ 
            role: "assistant", 
            content: screeningResult.response 
          });
          
          // Save updated conversation
          conversations.set(currentConversationId, conversationHistory);
          
          // If it's a template_ready or simple_custom, we can proceed directly
          // Otherwise, we'll wait for the user to confirm if they want to proceed with a simpler version
          if (screeningResult.shouldSubmitToDev) {
            return res.status(200).json({
              success: true,
              message: screeningResult.response,
              conversationId: currentConversationId,
              screeningResult,
              isScreened: true
            });
          }
          
          // For wishlist items, we'll just return the response
          if (screeningResult.category === 'wishlist') {
            // Return with wishlist specific data
            return res.status(200).json({
              success: true,
              message: screeningResult.response,
              conversationId: currentConversationId,
              screeningResult,
              isScreened: true,
              wishlistSubmitted: screeningResult.wishlistSubmitted
            });
          }
        } catch (screeningError) {
          console.error("Feature screening error:", screeningError);
          // Continue with normal conversation if screening fails
        }
      }
      
      console.log("Calling OpenAI API...");
      // Call OpenAI API
      let completion;
      try {
        completion = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: conversationHistory.map(msg => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content
          })),
        });
        console.log("Successfully used gpt-4o model");
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // Fallback to older model if gpt-4o is not available
        console.log("Falling back to gpt-3.5-turbo model...");
        completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: conversationHistory.map(msg => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content
          })),
        });
        console.log("Successfully used fallback gpt-3.5-turbo model");
      }
      
      if (!completion) {
        throw new Error("Failed to get completion from OpenAI");
      }
      
      // Get assistant's response
      const assistantResponse = completion.choices[0].message.content || "";
      
      // Add assistant response to history
      conversationHistory.push({ role: "assistant", content: assistantResponse });
      
      // Save updated conversation
      conversations.set(currentConversationId, conversationHistory);
      
      // Check if it's a JSON response (for final step)
      let structuredData = null;
      if (assistantResponse && assistantResponse.includes('{"project":')) {
        try {
          // Extract JSON from the message if it's wrapped in text
          const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            structuredData = JSON.parse(jsonMatch[0]);
          }
        } catch (err) {
          console.error("Failed to parse JSON from response:", err);
        }
      }
      
      res.status(200).json({
        success: true,
        message: assistantResponse,
        conversationId: currentConversationId,
        structuredData,
        isScreened: false
      });
    } catch (error) {
      console.error("Chat API error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred processing your request"
      });
    }
  });
  
  // Send the finalized request to NextMonth Dev
  app.post("/api/scope-request/send", async (req: Request, res: Response) => {
    try {
      const { requestData } = finalizeRequestSchema.parse(req.body);
      
      // Send to NextMonth Dev listener endpoint
      const response = await fetch("https://nextmonth-dev.replit.app/listen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send request to NextMonth Dev: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Store the request in the database for future reference
      if (!storage.featureRequests) {
        storage.featureRequests = [];
      }
      
      const featureRequest: FeatureRequest = {
        id: Date.now(),
        requestData,
        sentAt: new Date().toISOString(),
        status: "sent" as 'sent'
      };
      
      storage.featureRequests.push(featureRequest);
      
      // Log the feature request to our logs directory
      try {
        const fs = require('fs');
        const path = require('path');
        
        // Format date as YYYY-MM-DD
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const logDir = path.join(process.cwd(), 'logs', 'feature-requests');
        
        // Ensure directory exists
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logPath = path.join(logDir, `${dateString}.json`);
        
        // Initialize or read existing log file
        let logData = [];
        if (fs.existsSync(logPath)) {
          try {
            const fileContent = fs.readFileSync(logPath, 'utf8');
            logData = JSON.parse(fileContent);
            if (!Array.isArray(logData)) {
              logData = [];
            }
          } catch (readError) {
            console.error("Error reading existing log file:", readError);
            logData = [];
          }
        }
        
        // Add new request to log
        const logEntry = {
          timestamp: new Date().toISOString(),
          request_id: featureRequest.id,
          final_payload: requestData,
          status: featureRequest.status
        };
        
        logData.push(logEntry);
        
        // Write updated logs
        fs.writeFileSync(logPath, JSON.stringify(logData, null, 2), 'utf8');
        console.log(`Feature request logged to ${logPath}`);
      } catch (logError) {
        console.error("Error logging feature request:", logError);
        // Don't fail the request if logging fails
      }
      
      res.status(200).json({
        success: true,
        message: "Request successfully sent to NextMonth Dev",
        responseFromDev: responseData
      });
    } catch (error) {
      console.error("Send to NextMonth Dev error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred sending your request"
      });
    }
  });

  // Admin endpoint for manual backup
  app.post("/api/admin/backup", async (req: Request, res: Response) => {
    try {
      console.log('Manual backup requested');
      
      // Start backup process
      const { triggerBackup } = require('./backup');
      await triggerBackup();
      
      res.status(200).json({
        success: true,
        message: "Backup process initiated successfully"
      });
    } catch (error) {
      console.error('Manual backup error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to initiate backup process"
      });
    }
  });
  
  // ONBOARDING STATE MANAGEMENT ENDPOINTS
  
  // Schema for onboarding state operations
  const onboardingStateSchema = z.object({
    userId: z.number(),
    stage: z.string(),
    status: z.string().optional().default('in_progress'),
    data: z.any().optional()
  });
  
  const updateOnboardingSchema = z.object({
    userId: z.number(),
    stage: z.string(),
    status: z.string(),
    data: z.any().optional()
  });
  
  const guardianSyncSchema = z.object({
    id: z.number(),
    synced: z.boolean().optional().default(true)
  });
  
  // Get onboarding state for a user
  app.get("/api/onboarding/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const onboardingState = await storage.getOnboardingState(userId);
      
      if (!onboardingState) {
        return res.status(404).json({
          success: false,
          message: "No onboarding state found for this user"
        });
      }
      
      res.status(200).json({
        success: true,
        data: onboardingState
      });
    } catch (error) {
      console.error("Error fetching onboarding state:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred fetching onboarding state"
      });
    }
  });
  
  // Get specific stage state for a user
  app.get("/api/onboarding/:userId/:stage", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const stage = req.params.stage;
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const stageState = await storage.getOnboardingStageState(userId, stage);
      
      if (!stageState) {
        return res.status(404).json({
          success: false,
          message: `No onboarding state found for stage '${stage}'`
        });
      }
      
      res.status(200).json({
        success: true,
        data: stageState
      });
    } catch (error) {
      console.error("Error fetching stage state:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred fetching stage state"
      });
    }
  });
  
  // Create or update onboarding state
  app.post("/api/onboarding", async (req: Request, res: Response) => {
    try {
      const data = onboardingStateSchema.parse(req.body);
      
      const onboardingState = await storage.saveOnboardingState(data);
      
      res.status(200).json({
        success: true,
        message: "Onboarding state saved",
        data: onboardingState
      });
    } catch (error) {
      console.error("Error saving onboarding state:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred saving onboarding state"
      });
    }
  });
  
  // Update onboarding status
  app.patch("/api/onboarding/status", async (req: Request, res: Response) => {
    try {
      const { userId, stage, status, data } = updateOnboardingSchema.parse(req.body);
      
      const updatedState = await storage.updateOnboardingStatus(userId, stage, status, data);
      
      if (!updatedState) {
        return res.status(404).json({
          success: false,
          message: "Failed to update onboarding status"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Onboarding status updated",
        data: updatedState
      });
    } catch (error) {
      console.error("Error updating onboarding status:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred updating onboarding status"
      });
    }
  });
  
  // Mark stage as complete
  app.patch("/api/onboarding/complete", async (req: Request, res: Response) => {
    try {
      const { userId, stage, data } = onboardingStateSchema.parse(req.body);
      
      const completedState = await storage.markOnboardingStageComplete(userId, stage, data);
      
      if (!completedState) {
        return res.status(404).json({
          success: false,
          message: "Failed to mark stage as complete"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Stage marked as complete",
        data: completedState
      });
    } catch (error) {
      console.error("Error marking stage complete:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred marking stage complete"
      });
    }
  });
  
  // Get incomplete onboarding
  app.get("/api/onboarding/:userId/incomplete", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const incompleteState = await storage.getIncompleteOnboarding(userId);
      
      if (!incompleteState) {
        return res.status(404).json({
          success: false,
          message: "No incomplete onboarding found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: incompleteState
      });
    } catch (error) {
      console.error("Error fetching incomplete onboarding:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred fetching incomplete onboarding"
      });
    }
  });
  
  // Mark as synced with Guardian
  app.patch("/api/onboarding/guardian-sync", async (req: Request, res: Response) => {
    try {
      const { id, synced } = guardianSyncSchema.parse(req.body);
      
      const updatedState = await storage.markGuardianSynced(id, synced);
      
      if (!updatedState) {
        return res.status(404).json({
          success: false,
          message: "Onboarding state not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Guardian sync status updated",
        data: updatedState
      });
    } catch (error) {
      console.error("Error updating guardian sync:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred updating guardian sync"
      });
    }
  });
  
  // PAGE INTELLIGENCE + COMPLEXITY SYSTEM ENDPOINTS
  
  // Define validation schema for page complexity assessment
  const pageComplexityAssessmentSchema = z.object({
    userId: z.number().int().positive(),
    requestDescription: z.string().min(10),
    visualComplexity: z.number().min(1).max(10),
    logicComplexity: z.number().min(1).max(10),
    dataComplexity: z.number().min(1).max(10),
    estimatedHours: z.number().positive(),
    complexityLevel: z.enum(['simple', 'moderate', 'complex', 'wishlist']),
    aiAssessment: z.string()
  });

  // API endpoint for triaging page complexity
  app.post("/api/page-intelligence/triage", async (req, res) => {
    try {
      const validatedData = pageComplexityAssessmentSchema.parse(req.body);
      
      const result = await storage.savePageComplexityTriage(validatedData);
      
      res.status(200).json({
        success: true,
        message: "Page complexity assessment saved successfully",
        triage: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      console.error("Error saving page complexity triage:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve page complexity scores by user
  app.get("/api/page-intelligence/triage/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const triages = await storage.getPageComplexityTriagesByUser(userId);
      
      res.status(200).json({
        success: true,
        triages
      });
    } catch (error) {
      console.error("Error retrieving page complexity triages:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve specific page complexity triage
  app.get("/api/page-intelligence/triage/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid triage ID"
        });
      }
      
      const triage = await storage.getPageComplexityTriage(id);
      
      if (!triage) {
        return res.status(404).json({
          success: false,
          message: "Triage not found"
        });
      }
      
      res.status(200).json({
        success: true,
        triage
      });
    } catch (error) {
      console.error("Error retrieving page complexity triage:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to update sync status of page complexity triage
  app.patch("/api/page-intelligence/triage/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid triage ID"
        });
      }
      
      const { vaultSynced, guardianSynced } = req.body;
      
      // Ensure at least one of the sync flags is provided
      if (vaultSynced === undefined && guardianSynced === undefined) {
        return res.status(400).json({
          success: false,
          message: "At least one sync flag (vaultSynced or guardianSynced) must be provided"
        });
      }
      
      const updatedTriage = await storage.updatePageComplexitySyncStatus(
        id,
        vaultSynced,
        guardianSynced
      );
      
      if (!updatedTriage) {
        return res.status(404).json({
          success: false,
          message: "Triage not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Sync status updated successfully",
        triage: updatedTriage
      });
    } catch (error) {
      console.error("Error updating sync status:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // MODULE ACTIVATION ENDPOINTS
  
  // Define validation schema for module activation
  const moduleActivationSchema = z.object({
    userId: z.number().int().positive(),
    moduleId: z.string().min(1),
    pageMetadata: z.any().optional()
  });
  
  // API endpoint to log module activation
  app.post("/api/module-activation", async (req, res) => {
    try {
      const validatedData = moduleActivationSchema.parse(req.body);
      
      const result = await storage.logModuleActivation(validatedData);
      
      res.status(200).json({
        success: true,
        message: "Module activation logged successfully",
        activation: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      console.error("Error logging module activation:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve module activations by user
  app.get("/api/module-activation/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const activations = await storage.getModuleActivations(userId);
      
      res.status(200).json({
        success: true,
        activations
      });
    } catch (error) {
      console.error("Error retrieving module activations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve module activations by module
  app.get("/api/module-activation/module/:moduleId", async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      
      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Invalid module ID"
        });
      }
      
      const activations = await storage.getModuleActivations(undefined, moduleId);
      
      res.status(200).json({
        success: true,
        activations
      });
    } catch (error) {
      console.error("Error retrieving module activations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to update sync status of module activation
  app.patch("/api/module-activation/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid activation ID"
        });
      }
      
      const { synced } = req.body;
      
      if (synced === undefined) {
        return res.status(400).json({
          success: false,
          message: "Sync status must be provided"
        });
      }
      
      const updatedActivation = await storage.markModuleActivationSynced(id, synced);
      
      if (!updatedActivation) {
        return res.status(404).json({
          success: false,
          message: "Module activation not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Sync status updated successfully",
        activation: updatedActivation
      });
    } catch (error) {
      console.error("Error updating sync status:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint for AI-powered page complexity assessment
  app.post("/api/page-intelligence/ai-assess", async (req, res) => {
    try {
      const { description, features, pageType } = req.body;
      
      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Page description is required"
        });
      }
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          success: false, 
          message: "OpenAI API key is not configured" 
        });
      }
      
      // Prepare prompt for OpenAI
      const prompt = `
        Analyze the following page description and assess its complexity.
        
        Page Description: ${description}
        
        ${features ? `Features: ${features.join(', ')}` : ''}
        ${pageType ? `Page Type: ${pageType}` : ''}
        
        Provide a detailed assessment with scores for visual complexity, logic complexity, and data complexity on a scale of 1-10.
        Also include the estimated development hours and appropriate complexity level (simple, moderate, complex, or wishlist).
        
        Format your response as JSON with the following structure:
        {
          "visualComplexity": number,
          "logicComplexity": number,
          "dataComplexity": number,
          "estimatedHours": number,
          "complexityLevel": "simple" | "moderate" | "complex" | "wishlist",
          "analysis": "detailed explanation"
        }
      `;
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are an expert web development complexity analyst." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const aiAssessment = JSON.parse(response.choices[0].message.content);
      
      res.status(200).json({
        success: true,
        assessment: {
          ...aiAssessment,
          aiAssessment: aiAssessment.analysis // Rename for consistency with our schema
        }
      });
    } catch (error) {
      console.error("Error performing AI assessment:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while performing AI assessment"
      });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
