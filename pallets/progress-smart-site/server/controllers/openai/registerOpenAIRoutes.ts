import { Express } from "express";
import { OpenAIController } from "./openaiController";
import { z } from "zod";
import { getUserFromRequest } from "../../utils/auth";

// Define validation schemas
const generateTextSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  max_tokens: z.number().optional(),
});

const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

const analyzeImageSchema = z.object({
  image_url: z.string().url("Valid image URL is required"),
  prompt: z.string().optional(),
});

/**
 * Register OpenAI routes
 * 
 * These routes enable AI generation capabilities but without permanent storage
 * They're used by the Social Media Post Generator and other tools
 */
export function registerOpenAIRoutes(app: Express): void {
  // Middleware to check permissions
  const checkPermission = (req: any, res: any, next: any) => {
    // Get user from request
    const user = getUserFromRequest(req);
    
    // Check if user exists and has appropriate role
    if (!user || !["admin", "editor"].includes(user?.role)) {
      return res.status(403).json({ error: "Permission denied" });
    }
    
    next();
  };

  // Text generation endpoint
  app.post("/api/openai/generate-text", checkPermission, async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateTextSchema.parse(req.body);
      req.body = validatedData;
      
      // Call controller method
      await OpenAIController.generateText(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      console.error("Error in generate-text route:", error);
      res.status(500).json({ error: "An error occurred processing your request" });
    }
  });

  // Image generation endpoint
  app.post("/api/openai/generate-image", checkPermission, async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateImageSchema.parse(req.body);
      req.body = validatedData;
      
      // Call controller method
      await OpenAIController.generateImage(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      console.error("Error in generate-image route:", error);
      res.status(500).json({ error: "An error occurred processing your request" });
    }
  });

  // Image analysis endpoint
  app.post("/api/openai/analyze-image", checkPermission, async (req, res) => {
    try {
      // Validate request body
      const validatedData = analyzeImageSchema.parse(req.body);
      req.body = validatedData;
      
      // Call controller method
      await OpenAIController.analyzeImage(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      console.error("Error in analyze-image route:", error);
      res.status(500).json({ error: "An error occurred processing your request" });
    }
  });
};