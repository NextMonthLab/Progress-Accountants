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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
