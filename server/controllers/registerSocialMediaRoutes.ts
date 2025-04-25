import { Express } from "express";
import { socialMediaController } from "./socialMediaController";

/**
 * Register the routes for the Universal Social Media Post Generator
 * @param app Express application
 */
export function registerSocialMediaRoutes(app: Express): void {
  // Generate post content using AI
  app.post("/api/social-media/generate-post", socialMediaController.generatePost);
  
  // Generate image using AI
  app.post("/api/social-media/generate-image", socialMediaController.generateImage);
  
  // Save a post to session storage
  app.post("/api/social-media/save-post", socialMediaController.savePost);
  
  // Get all posts for current user's session
  app.get("/api/social-media/posts", socialMediaController.getUserPosts);
  
  // Delete a post from session storage
  app.delete("/api/social-media/posts/:id", socialMediaController.deletePost);
  
  console.log("✅ Social Media Post Generator routes registered");
}