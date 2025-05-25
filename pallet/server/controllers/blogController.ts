import { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertBlogPostSchema, insertBlogPageSchema, insertIntegrationRequestSchema } from "@shared/schema";
import slugify from "../utils/slugify";
import { getUserFromRequest } from "../utils/auth";

export const BlogController = {
  // Blog Page APIs
  async getBlogPages(req: Request, res: Response) {
    try {
      const tenantId = req.query.tenantId as string | undefined;
      const pages = await storage.getBlogPages(tenantId);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching blog pages:", error);
      res.status(500).json({ error: "Failed to fetch blog pages" });
    }
  },

  async getBlogPage(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid page ID" });
      }
      
      const page = await storage.getBlogPage(id);
      if (!page) {
        return res.status(404).json({ error: "Blog page not found" });
      }
      
      res.json(page);
    } catch (error) {
      console.error("Error fetching blog page:", error);
      res.status(500).json({ error: "Failed to fetch blog page" });
    }
  },

  async getBlogPageBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const tenantId = req.query.tenantId as string | undefined;
      
      const page = await storage.getBlogPageBySlug(slug, tenantId);
      if (!page) {
        return res.status(404).json({ error: "Blog page not found" });
      }
      
      res.json(page);
    } catch (error) {
      console.error("Error fetching blog page by slug:", error);
      res.status(500).json({ error: "Failed to fetch blog page" });
    }
  },

  async createBlogPage(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertBlogPageSchema.parse(req.body);
      
      // Create a slug from the title if not provided
      if (!validatedData.slug) {
        validatedData.slug = slugify(validatedData.title);
      }
      
      // Set created by user ID
      validatedData.createdBy = user.id;

      const blogPage = await storage.createBlogPage(validatedData);
      
      // Log the activity
      await storage.logActivity({
        userId: user.id,
        userType: user.userType,
        actionType: "create",
        entityType: "blog_page",
        entityId: blogPage.id.toString(),
        details: {
          title: blogPage.title,
          slug: blogPage.slug
        }
      });
      
      res.status(201).json(blogPage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating blog page:", error);
      res.status(500).json({ error: "Failed to create blog page" });
    }
  },

  async updateBlogPage(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid page ID" });
      }
      
      // Validate that the page exists
      const existingPage = await storage.getBlogPage(id);
      if (!existingPage) {
        return res.status(404).json({ error: "Blog page not found" });
      }
      
      // Validate the update data
      const validatedData = insertBlogPageSchema.partial().parse(req.body);
      
      // Create a slug from the title if title is changing and slug is not provided
      if (validatedData.title && !validatedData.slug) {
        validatedData.slug = slugify(validatedData.title);
      }
      
      const updatedPage = await storage.updateBlogPage(id, validatedData);
      
      // Log the activity
      await storage.logActivity({
        userId: user.id,
        userType: user.userType,
        actionType: "update",
        entityType: "blog_page",
        entityId: id.toString(),
        details: validatedData
      });
      
      res.json(updatedPage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating blog page:", error);
      res.status(500).json({ error: "Failed to update blog page" });
    }
  },

  async deleteBlogPage(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid page ID" });
      }
      
      // Validate that the page exists
      const existingPage = await storage.getBlogPage(id);
      if (!existingPage) {
        return res.status(404).json({ error: "Blog page not found" });
      }
      
      const success = await storage.deleteBlogPage(id);
      
      if (success) {
        // Log the activity
        await storage.logActivity({
          userId: user.id,
          userType: user.userType,
          actionType: "delete",
          entityType: "blog_page",
          entityId: id.toString(),
          details: {
            title: existingPage.title,
            slug: existingPage.slug
          }
        });
        
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to delete blog page" });
      }
    } catch (error) {
      console.error("Error deleting blog page:", error);
      res.status(500).json({ error: "Failed to delete blog page" });
    }
  },

  // Blog Post APIs
  async getBlogPosts(req: Request, res: Response) {
    try {
      const tenantId = req.query.tenantId as string | undefined;
      const posts = await storage.getBlogPosts(tenantId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  },

  async getBlogPost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  },

  async getBlogPostBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const tenantId = req.query.tenantId as string | undefined;
      
      const post = await storage.getBlogPostBySlug(slug, tenantId);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  },

  async createBlogPost(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertBlogPostSchema.parse(req.body);
      
      // Create a slug from the title if not provided
      if (!validatedData.slug) {
        validatedData.slug = slugify(validatedData.title);
      }
      
      // Set created by user ID
      validatedData.authorId = user.id;

      // If publish direct is set to true, automatically set status to published
      // This handles direct publishing from the blog generator to news page
      if (req.body.publishDirect === true) {
        validatedData.status = 'published';
        validatedData.publishedAt = new Date();
      }

      const blogPost = await storage.createBlogPost(validatedData);
      
      // Log the activity
      await storage.logActivity({
        userId: user.id,
        userType: user.userType,
        actionType: "create",
        entityType: "blog_post",
        entityId: blogPost.id.toString(),
        details: {
          title: blogPost.title,
          slug: blogPost.slug,
          publishedDirectly: req.body.publishDirect === true
        }
      });
      
      res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  },

  // New method for direct publishing to the news page
  async publishDirectToNews(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Add the publishDirect flag to request body
      req.body.publishDirect = true;
      
      // Set defaults for the news post
      if (!req.body.slug) {
        req.body.slug = slugify(req.body.title);
      }
      
      if (!req.body.status) {
        req.body.status = 'published';
      }
      
      if (!req.body.publishedAt) {
        req.body.publishedAt = new Date();
      }

      // Use the existing createBlogPost method
      return this.createBlogPost(req, res);
    } catch (error) {
      console.error("Error publishing directly to news:", error);
      res.status(500).json({ error: "Failed to publish post to news page" });
    }
  },

  async updateBlogPost(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      // Validate that the post exists
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Validate the update data
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      
      // Create a slug from the title if title is changing and slug is not provided
      if (validatedData.title && !validatedData.slug) {
        validatedData.slug = slugify(validatedData.title);
      }
      
      const updatedPost = await storage.updateBlogPost(id, validatedData);
      
      // Log the activity
      await storage.logActivity({
        userId: user.id,
        userType: user.userType,
        actionType: "update",
        entityType: "blog_post",
        entityId: id.toString(),
        details: validatedData
      });
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  },

  async deleteBlogPost(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
      
      // Validate that the post exists
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      const success = await storage.deleteBlogPost(id);
      
      if (success) {
        // Log the activity
        await storage.logActivity({
          userId: user.id,
          userType: user.userType,
          actionType: "delete",
          entityType: "blog_post",
          entityId: id.toString(),
          details: {
            title: existingPost.title,
            slug: existingPost.slug
          }
        });
        
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to delete blog post" });
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  },

  // Integration Requests APIs
  async getIntegrationRequests(req: Request, res: Response) {
    try {
      const tenantId = req.query.tenantId as string | undefined;
      const requests = await storage.getIntegrationRequests(tenantId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching integration requests:", error);
      res.status(500).json({ error: "Failed to fetch integration requests" });
    }
  },

  async getIntegrationRequest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }
      
      const request = await storage.getIntegrationRequest(id);
      if (!request) {
        return res.status(404).json({ error: "Integration request not found" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching integration request:", error);
      res.status(500).json({ error: "Failed to fetch integration request" });
    }
  },

  async createIntegrationRequest(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertIntegrationRequestSchema.parse(req.body);
      
      // Set requestor ID and initial status
      validatedData.requestorId = user.id;
      validatedData.status = validatedData.status || "pending";

      const integrationRequest = await storage.createIntegrationRequest(validatedData);
      
      // Log the activity
      await storage.logActivity({
        userId: user.id,
        userType: user.userType,
        actionType: "create",
        entityType: "integration_request",
        entityId: integrationRequest.id.toString(),
        details: {
          platformName: integrationRequest.platformName,
          status: integrationRequest.status
        }
      });
      
      res.status(201).json(integrationRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating integration request:", error);
      res.status(500).json({ error: "Failed to create integration request" });
    }
  },

  async updateIntegrationRequest(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }
      
      // Validate that the request exists
      const existingRequest = await storage.getIntegrationRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ error: "Integration request not found" });
      }
      
      // Validate the update data
      const validatedData = insertIntegrationRequestSchema.partial().parse(req.body);
      
      const updatedRequest = await storage.updateIntegrationRequest(id, validatedData);
      
      // Log the activity
      await storage.logActivity({
        userId: user.id,
        userType: user.userType,
        actionType: "update",
        entityType: "integration_request",
        entityId: id.toString(),
        details: validatedData
      });
      
      res.json(updatedRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating integration request:", error);
      res.status(500).json({ error: "Failed to update integration request" });
    }
  },

  async deleteIntegrationRequest(req: Request, res: Response) {
    try {
      const user = getUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }
      
      // Validate that the request exists
      const existingRequest = await storage.getIntegrationRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ error: "Integration request not found" });
      }
      
      const success = await storage.deleteIntegrationRequest(id);
      
      if (success) {
        // Log the activity
        await storage.logActivity({
          userId: user.id,
          userType: user.userType,
          actionType: "delete",
          entityType: "integration_request",
          entityId: id.toString(),
          details: {
            platformName: existingRequest.platformName,
            status: existingRequest.status
          }
        });
        
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to delete integration request" });
      }
    } catch (error) {
      console.error("Error deleting integration request:", error);
      res.status(500).json({ error: "Failed to delete integration request" });
    }
  }
};