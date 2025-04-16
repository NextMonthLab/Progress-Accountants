import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
