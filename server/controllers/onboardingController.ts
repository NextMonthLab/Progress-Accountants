import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { OnboardingState, insertOnboardingStateSchema } from "@shared/schema";
import { requireAuth } from "../middleware/rbac";
import { z } from "zod";

// Validate the incoming progress update data
const progressUpdateSchema = z.object({
  stage: z.string(),
  status: z.string(),
  data: z.record(z.any()).optional()
});

// Get the current onboarding progress for the authenticated user
export const getOnboardingProgress = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const progress = await storage.getOnboardingState(userId);
      return res.json(progress || { status: "not_started" });
    } catch (error) {
      console.error("Error fetching onboarding progress:", error);
      return res.status(500).json({ error: "Failed to fetch onboarding progress" });
    }
  }
];

// Update the onboarding progress for a specific stage
export const updateOnboardingProgress = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const validationResult = progressUpdateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validationResult.error.format() 
        });
      }
      
      const { stage, status, data } = validationResult.data;
      
      const updatedState = await storage.updateOnboardingStatus(
        userId,
        stage,
        status,
        data
      );
      
      return res.json(updatedState);
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
      return res.status(500).json({ error: "Failed to update onboarding progress" });
    }
  }
];

// Mark a specific onboarding stage as complete
export const completeOnboardingStage = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const { stage, data } = req.body;
      
      if (!stage) {
        return res.status(400).json({ error: "Stage is required" });
      }
      
      const updatedState = await storage.markOnboardingStageComplete(
        userId,
        stage,
        data
      );
      
      return res.json(updatedState);
    } catch (error) {
      console.error("Error completing onboarding stage:", error);
      return res.status(500).json({ error: "Failed to complete onboarding stage" });
    }
  }
];

// Get any incomplete onboarding stages for the user
export const getIncompleteOnboarding = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const incompleteState = await storage.getIncompleteOnboarding(userId);
      return res.json(incompleteState || { status: "no_incomplete_stages" });
    } catch (error) {
      console.error("Error fetching incomplete onboarding:", error);
      return res.status(500).json({ error: "Failed to fetch incomplete onboarding" });
    }
  }
];

// Save the user's preferred onboarding approach/setup
export const saveOnboardingPreference = [
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const { preference } = req.body;
      
      if (!preference) {
        return res.status(400).json({ error: "Preference is required" });
      }
      
      const updatedState = await storage.saveOnboardingPreference(
        userId,
        preference
      );
      
      return res.json(updatedState);
    } catch (error) {
      console.error("Error saving onboarding preference:", error);
      return res.status(500).json({ error: "Failed to save onboarding preference" });
    }
  }
];

/**
 * Register all onboarding routes
 */
export function registerOnboardingRoutes(app: Express) {
  console.log("Registering Onboarding routes...");
  
  // Get current onboarding progress
  app.get('/api/onboarding/progress', getOnboardingProgress);
  
  // Update progress for a specific stage
  app.post('/api/onboarding/progress', updateOnboardingProgress);
  
  // Mark a specific stage as complete
  app.post('/api/onboarding/complete-stage', completeOnboardingStage);
  
  // Get any incomplete onboarding
  app.get('/api/onboarding/incomplete', getIncompleteOnboarding);
  
  // Save preferred onboarding path
  app.post('/api/onboarding/preference', saveOnboardingPreference);
  
  console.log("✅ Onboarding routes registered");
}