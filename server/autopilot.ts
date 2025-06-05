import type { Express } from "express";
import { storage } from "./storage";
import { insertAutopilotSettingsSchema } from "@shared/schema";
import { z } from "zod";

export function registerAutopilotRoutes(app: Express): void {
  // Get autopilot settings for current user
  app.get("/api/autopilot/settings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const settings = await storage.getAutopilotSettings(req.user!.id);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching autopilot settings:", error);
      res.status(500).json({ error: "Failed to fetch autopilot settings" });
    }
  });

  // Save autopilot settings
  app.post("/api/autopilot/settings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const validatedData = insertAutopilotSettingsSchema.parse({
        ...req.body,
        userId: req.user!.id,
        tenantId: req.user!.tenantId
      });

      const settings = await storage.saveAutopilotSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error saving autopilot settings:", error);
      res.status(500).json({ error: "Failed to save autopilot settings" });
    }
  });

  // External API endpoint for triggering blog generation
  app.post("/api/autopilot/trigger-blog", async (req, res) => {
    try {
      // This endpoint can be called by external systems (CRON jobs, webhooks, etc.)
      // to trigger automated blog post generation based on user settings
      
      // For now, return success with placeholder logic
      // In production, this would:
      // 1. Fetch users with blog autopilot enabled
      // 2. Generate content based on their configured sources
      // 3. Create draft or published posts based on review settings
      
      res.json({ 
        success: true, 
        message: "Blog generation triggered successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error triggering blog generation:", error);
      res.status(500).json({ error: "Failed to trigger blog generation" });
    }
  });

  // External API endpoint for chat takeover notifications
  app.post("/api/autopilot/notify-takeover", async (req, res) => {
    try {
      const { userId, leadScore, conversationId } = req.body;
      
      // This endpoint can be called by chat systems to notify admins
      // when they should take over a conversation
      
      // For now, return success with placeholder logic
      // In production, this would:
      // 1. Check user's notification preferences
      // 2. Verify lead score threshold requirements
      // 3. Send email notifications if configured
      // 4. Auto-pause assistant if enabled
      
      res.json({ 
        success: true, 
        message: "Takeover notification processed successfully",
        shouldNotify: true, // Would be calculated based on user settings
        shouldPause: false, // Would be calculated based on user settings
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error processing takeover notification:", error);
      res.status(500).json({ error: "Failed to process takeover notification" });
    }
  });

  console.log("✅ SmartSite Autopilot routes registered");
}