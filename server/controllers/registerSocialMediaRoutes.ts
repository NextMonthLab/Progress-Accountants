import { Express } from "express";
import { socialMediaController } from "./socialMediaController";

/**
 * Register the routes for the Universal Social Media Post Generator
 * @param app Express application
 */
export function registerSocialMediaRoutes(app: Express): void {
  // Image generation
  app.post("/api/social-media/generate-image", socialMediaController.generateImage);
  
  // Post content generation
  app.post("/api/social-media/generate-post", socialMediaController.generatePost);
  
  // Session management (no persistence)
  app.post("/api/social-media/save-post", socialMediaController.savePost);
  app.get("/api/social-media/posts", socialMediaController.getUserPosts);
  app.delete("/api/social-media/posts/:id", socialMediaController.deletePost);
  
  console.log("✅ Social Media Post Generator routes registered");
}