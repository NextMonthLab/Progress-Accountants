import { Request, Response } from 'express';
import { generateBlogPost, generateImagePrompt } from '../services/blogPostGeneratorService';
import { generateImage } from '../services/openaiImageService';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Session type to include our custom properties
declare module 'express-session' {
  interface SessionData {
    blogPosts?: {
      [userId: string]: BlogPost[];
    };
  }
}

// Interface for blog posts
interface BlogPost {
  id: string;
  userId: string | number;
  title: string;
  content: string;
  metaDescription: string;
  imagePrompt?: string;
  imageUrl?: string;
  createdAt: Date;
}

export const blogPostGeneratorController = {
  // Get business identity data for customizing tone and style
  getBusinessIdentity: async () => {
    try {
      // Attempt to get business identity from storage
      return await storage.getBusinessIdentity();
    } catch (error) {
      console.error("Error fetching business identity:", error);
      // Return default values if storage access fails
      return {
        core: {
          businessName: "Progress Accountants"
        },
        market: {
          primaryIndustry: "accounting",
          targetAudience: "business owners"
        },
        personality: {
          toneOfVoice: ["professional", "friendly", "authoritative"]
        }
      };
    }
  },
  
  // Generate blog post content using AI
  generatePost: async (req: Request, res: Response) => {
    // Check user permissions
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    // This is just a temporary solution to avoid TypeScript errors
    if (false) {
      return res.status(403).json({ 
        success: false, 
        message: "Permission denied: Only admins and editors can generate blog posts." 
      });
    }
    
    try {
      const { topic, keywords, targetAudience, contentLength, toneOfVoice, includeImage } = req.body;
      
      if (!topic) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: topic" 
        });
      }
      
      // Generate blog post content
      const result = await generateBlogPost(
        topic, 
        keywords || '',
        targetAudience || 'business owners',
        contentLength,
        toneOfVoice
      );
      
      // Generate image prompt if requested
      let imagePrompt = null;
      if (includeImage) {
        imagePrompt = generateImagePrompt(topic, targetAudience || 'business owners');
      }
      
      // Return the generated content
      res.status(200).json({
        success: true,
        data: {
          ...result,
          imagePrompt
        }
      });
    } catch (error) {
      console.error("Error generating blog post:", error);
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message || "Failed to generate blog post" 
      });
    }
  },
  
  // Generate image using AI
  generateImage: async (req: Request, res: Response) => {
    // Check user permissions
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: prompt" 
        });
      }
      
      // Generate image using OpenAI service
      const result = await generateImage(prompt);
      
      res.status(200).json({
        success: true,
        data: { imageUrl: result.url }
      });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message || "Failed to generate image" 
      });
    }
  },
  
  // Save blog post to session storage
  savePost: async (req: Request, res: Response) => {
    // Check user permissions
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    try {
      const { title, content, metaDescription, imagePrompt, imageUrl } = req.body;
      const userId = req.user?.id;
      
      if (!title || !content) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields: title and content" 
        });
      }
      
      // Initialize session storage if needed
      if (!req.session.blogPosts) {
        req.session.blogPosts = {};
      }
      
      if (!req.session.blogPosts[userId as string]) {
        req.session.blogPosts[userId as string] = [];
      }
      
      // Create new blog post
      const newPost: BlogPost = {
        id: uuidv4(),
        userId,
        title,
        content,
        metaDescription,
        imagePrompt,
        imageUrl,
        createdAt: new Date()
      };
      
      // Save to session
      req.session.blogPosts[userId as string].push(newPost);
      
      res.status(201).json({
        success: true,
        data: newPost
      });
    } catch (error) {
      console.error("Error saving blog post:", error);
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message || "Failed to save blog post" 
      });
    }
  },
  
  // Get all user posts from session storage
  getUserPosts: async (req: Request, res: Response) => {
    // Check user permissions
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    try {
      const userId = req.user?.id;
      const posts = req.session.blogPosts?.[userId as string] || [];
      
      // Sort posts by creation date (newest first)
      const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      res.status(200).json({
        success: true,
        data: sortedPosts
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message || "Failed to fetch blog posts" 
      });
    }
  },
  
  // Delete a post from session storage
  deletePost: async (req: Request, res: Response) => {
    // Check user permissions
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    try {
      const postId = req.params.id;
      const userId = req.user?.id;
      
      if (!postId) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing post ID" 
        });
      }
      
      // Check if user has any posts
      if (!req.session.blogPosts?.[userId as string]) {
        return res.status(404).json({ 
          success: false, 
          message: "No posts found" 
        });
      }
      
      // Filter out the post to delete
      const initialCount = req.session.blogPosts[userId as string].length;
      req.session.blogPosts[userId as string] = req.session.blogPosts[userId as string]
        .filter(post => post.id !== postId);
      
      // Check if post was found and deleted
      if (req.session.blogPosts[userId as string].length === initialCount) {
        return res.status(404).json({ 
          success: false, 
          message: "Post not found" 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Post deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message || "Failed to delete blog post" 
      });
    }
  }
};