import { Request, Response } from "express";
import { generateImage, generateSocialMediaPost } from "../services/openaiImageService";

// Memory storage for current session posts (no persistence)
const sessionPosts: Record<string, any[]> = {};

/**
 * Controls the Universal Social Media Post Generator functionality
 */
export const socialMediaController = {
  /**
   * Generate an image using AI
   */
  async generateImage(req: Request, res: Response) {
    try {
      // Check user permissions (admin or editor only)
      if (!req.isAuthenticated() || 
          (req.user.userType !== 'admin' && 
           req.user.userType !== 'editor' && 
           !req.user.isSuperAdmin)) {
        return res.status(403).json({
          message: "Permission denied. Admin or Editor role required.",
          success: false
        });
      }
      
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          message: "Image prompt is required",
          success: false
        });
      }
      
      const result = await generateImage(prompt);
      
      return res.status(200).json({
        message: "Image generated successfully",
        success: true,
        data: result
      });
    } catch (error) {
      console.error("Error in image generation:", error);
      return res.status(500).json({
        message: `Failed to generate image: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Generate social media post content using AI
   */
  async generatePost(req: Request, res: Response) {
    try {
      // Check user permissions (admin or editor only)
      if (!req.isAuthenticated() || 
          (req.user.userType !== 'admin' && 
           req.user.userType !== 'editor' && 
           !req.user.isSuperAdmin)) {
        return res.status(403).json({
          message: "Permission denied. Admin or Editor role required.",
          success: false
        });
      }
      
      const { prompt, platform } = req.body;
      
      if (!prompt || !platform) {
        return res.status(400).json({
          message: "Prompt and platform are required",
          success: false
        });
      }
      
      const result = await generateSocialMediaPost(prompt, platform);
      
      return res.status(200).json({
        message: "Social media post generated successfully",
        success: true,
        data: result
      });
    } catch (error) {
      console.error("Error in post generation:", error);
      return res.status(500).json({
        message: `Failed to generate post: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Save a post to the current session (non-persistent)
   */
  async savePost(req: Request, res: Response) {
    try {
      // Check user permissions (admin or editor only)
      if (!req.isAuthenticated() || 
          (req.user.userType !== 'admin' && 
           req.user.userType !== 'editor' && 
           !req.user.isSuperAdmin)) {
        return res.status(403).json({
          message: "Permission denied. Admin or Editor role required.",
          success: false
        });
      }
      
      const { post } = req.body;
      const userId = req.user.id.toString();
      
      if (!post) {
        return res.status(400).json({
          message: "Post content is required",
          success: false
        });
      }
      
      // Initialize user's session posts if not exists
      if (!sessionPosts[userId]) {
        sessionPosts[userId] = [];
      }
      
      // Add timestamp and unique ID
      const newPost = {
        ...post,
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      // Add to session (in-memory only)
      sessionPosts[userId].push(newPost);
      
      return res.status(201).json({
        message: "Post saved to session",
        success: true,
        data: newPost
      });
    } catch (error) {
      console.error("Error saving post:", error);
      return res.status(500).json({
        message: `Failed to save post: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Get all posts for the current user's session
   */
  async getUserPosts(req: Request, res: Response) {
    try {
      // Check user permissions
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          message: "Authentication required",
          success: false
        });
      }
      
      const userId = req.user.id.toString();
      
      // Return empty array if no posts
      const userPosts = sessionPosts[userId] || [];
      
      return res.status(200).json({
        message: "Retrieved user posts",
        success: true,
        data: userPosts
      });
    } catch (error) {
      console.error("Error retrieving posts:", error);
      return res.status(500).json({
        message: `Failed to retrieve posts: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  /**
   * Delete a post from the current session
   */
  async deletePost(req: Request, res: Response) {
    try {
      // Check user permissions
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          message: "Authentication required",
          success: false
        });
      }
      
      const { id } = req.params;
      const userId = req.user.id.toString();
      
      if (!id) {
        return res.status(400).json({
          message: "Post ID is required",
          success: false
        });
      }
      
      // Check if user has posts
      if (!sessionPosts[userId]) {
        return res.status(404).json({
          message: "No posts found for user",
          success: false
        });
      }
      
      // Find and remove the post
      const initialLength = sessionPosts[userId].length;
      sessionPosts[userId] = sessionPosts[userId].filter(post => post.id !== id);
      
      if (sessionPosts[userId].length === initialLength) {
        return res.status(404).json({
          message: "Post not found",
          success: false
        });
      }
      
      return res.status(200).json({
        message: "Post deleted successfully",
        success: true
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({
        message: `Failed to delete post: ${(error as Error).message}`,
        success: false
      });
    }
  }
};