import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
    payload: z.object({
      screen_name: z.string(),
      description: z.string(),
      features: z.array(z.string())
    })
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
      
      // If this is a new conversation, add the system prompt
      if (conversationHistory.length === 0) {
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
        structuredData
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
