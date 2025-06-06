import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";
import { 
  type FeatureRequest, 
  type ModuleActivation, 
  type PageComplexityTriage,
  type SeoConfiguration,
  type BrandVersion,
  type ClientRegistry,
  type Tool,
  type ToolRequest,
  type PageToolIntegration,
  type FeedSettings,
  insertPageComplexityTriageSchema,
  insertModuleActivationSchema,
  insertSeoConfigurationSchema,
  insertBrandVersionSchema,
  insertToolSchema,
  insertToolRequestSchema,
  insertPageToolIntegrationSchema,
  insertFeedSettingsSchema
} from "@shared/schema";
import { registerBlueprintRoutes as registerLegacyBlueprintRoutes } from "./blueprint";
import { registerMediaRoutes } from "./media-upload";
import { registerSupportRoutes } from "./support-routes";
import { registerPageToolIntegrationRoutes } from "./page-tool-integrations";
import { registerTenantRoutes } from "./controllers/tenantController";
import { registerSystemRoutes } from "./controllers/systemController";
import { registerClientRoutes } from "./controllers/clientController";
import { registerBlogRoutes } from "./controllers/registerBlogRoutes";
import { registerToolMarketplaceRoutes as registerNewMarketplaceRoutes } from "./routes/toolMarketplaceRoutes";
import MarketplaceApiRouter from "./routes/marketplace";
import { registerOpenAIRoutes } from "./controllers/openai/registerOpenAIRoutes";
import { registerVersionControlRoutes } from "./controllers/registerVersionControlRoutes";
import { registerAiDesignRoutes } from "./controllers/registerAiDesignRoutes";
import { registerEnhancedSeoRoutes } from "./controllers/registerEnhancedSeoRoutes";
import { registerBusinessNetworkRoutes } from "./controllers/registerBusinessNetworkRoutes";
import { registerBusinessDiscoverRoutes } from "./controllers/registerBusinessDiscoverRoutes";
import { registerAgoraRoutes } from "./routes/agoraRoutes";
import { registerAutopilotRoutes } from "./autopilot";
import { registerAISettingsRoutes } from "./routes/ai-settings";
import { registerAiUsageRoutes } from "./routes/ai-usage-routes";
import { 
  getAllResources, 
  getPublicResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource, 
  updateResourceOrder 
} from "./controllers/resourcesController";
import { registerResourcesRoutes } from "./controllers/resourcesController";
import { registerCompanionRoutes } from "./controllers/companionController";
import { checkPageOrigin, checkOverridePermission } from "./controllers/pageOriginController";
import { registerCompanionConfigRoutes } from "./controllers/registerCompanionConfigRoutes";
import { registerToolMarketplaceRoutes } from "./controllers/toolMarketplaceController";
import { registerSiteVariantRoutes } from "./routes/siteVariantRoutes";
import { getIndustryNews, updateNewsfeedConfig } from "./controllers/newsfeedController";
import { 
  getAvailableTools,
  getToolCategories,
  getInstalledTools,
  installTool,
  uninstallTool,
  getToolConfiguration,
  updateToolConfiguration
} from "./controllers/marketplaceController";
import { registerSocialMediaRoutes } from "./controllers/registerSocialMediaRoutes";
import { registerBlogPostGeneratorRoutes } from "./controllers/registerBlogPostGeneratorRoutes";
import aiGatewayRouter from "./routes/ai-gateway";
import { setupAuth, hashPassword } from "./auth";
import { simpleStorage } from "./simpleStorage";
import { 
  PageMetadata, 
  PageComplexityAssessment, 
  ComplexityLevel 
} from "@shared/page_metadata";
import { z } from "zod";
import OpenAI from "openai";

// Helper function for handling API errors
function handleApiError(res: Response, error: any, customMessage: string) {
  console.error(`${customMessage}:`, error);
  
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors
    });
  }
  
  res.status(500).json({
    success: false,
    message: customMessage
  });
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the role type for the OpenAI API
type Role = "system" | "user" | "assistant";

// Define the message type for conversations
interface ChatMessage {
  role: Role;
  content: string;
}

// System prompt for the scoping assistant
const SYSTEM_PROMPT = `You are a scoping assistant helping internal Progress Accountants staff prepare feature requests for the NextMonth Dev team.

Your goal is to turn rough ideas into a structured JSON prompt for development.

Ask only simple, focused questions. Avoid technical jargon.

Once the user has answered enough questions, say:  
"Great! I've structured this request. Shall I send it to NextMonth Dev for review?"

When confirmed, prepare a JSON output in the following format:

{
  "project": "progress_accountants",
  "type": "screen_request",
  "payload": {
    "screen_name": "...",
    "description": "...",
    "features": [ "...", "...", "..." ]
  }
}`;

// Schema for chat request
const chatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().nullable().optional(),
});

// Schema for finalizing request
const finalizeRequestSchema = z.object({
  requestData: z.object({
    project: z.string(),
    type: z.string(),
    payload: z.union([
      // Standard screen request
      z.object({
        screen_name: z.string(),
        description: z.string(),
        features: z.array(z.string())
      }),
      // Module request from Module Gallery
      z.object({
        screen_name: z.string(),
        description: z.string(),
        status: z.enum(['complete', 'CPT_ready', 'designed', 'dev_in_progress']),
        business_id: z.string()
      }),
      // Module request from Module Library
      z.object({
        screen_name: z.string(),
        description: z.string(),
        status: z.string(),
        zone: z.string().optional(),
        tags: z.array(z.string()).optional(),
        business_id: z.string()
      })
    ])
  })
});

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

import { registerPageBuilderRoutes as registerPageBuilderApiRoutes } from "./controllers/registerPageBuilderRoutes";

// Super admin access middleware
const requireSuperAdmin = (req: Request, res: Response, next: Function) => {
  // Check if user is authenticated and is a super admin
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = req.user as any;
  if (!user.isSuperAdmin && user.userType !== 'super_admin') {
    return res.status(403).json({ message: "Super admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Register media upload endpoints
  registerMediaRoutes(app);
  
  // Register page origin protection endpoints
  app.get("/api/page-origin/:id", checkPageOrigin);
  app.get("/api/page-override-permission", checkOverridePermission);
  
  // Page duplication endpoint for NextMonth protected pages
  app.post("/api/pages/:id/duplicate", async (req: Request, res: Response) => {
    try {
      const pageId = parseInt(req.params.id);
      const { customization } = req.body;
      
      if (isNaN(pageId)) {
        return res.status(400).json({ success: false, message: 'Invalid page ID' });
      }
      
      // Get the original page
      const originalPage = await storage.getPage(pageId);
      
      if (!originalPage) {
        return res.status(404).json({ success: false, message: 'Page not found' });
      }
      
      // Create a new duplicate with user origin
      const newPageId = Date.now(); // Simple ID for demo
      
      // In a real implementation, we would save to database
      // For demo, just return success with new ID
      return res.status(200).json({
        success: true,
        message: 'Page duplicated successfully',
        data: {
          id: newPageId,
          title: `${originalPage.title} (Custom)`,
          path: `${originalPage.path}-custom-${newPageId}`,
          origin: 'user'
        }
      });
    } catch (error) {
      console.error('Error duplicating page:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to duplicate page'
      });
    }
  });
  
  // Register site variant endpoints
  registerSiteVariantRoutes(app);
  
  // Register support chat endpoints
  registerSupportRoutes(app);
  
  // Register social media endpoints
  registerSocialMediaRoutes(app);
  
  // Register blog post generator endpoints
  registerBlogPostGeneratorRoutes(app);
  
  // Register blueprint API endpoints
  registerLegacyBlueprintRoutes(app);
  
  // Register page-tool integration endpoints
  registerPageToolIntegrationRoutes(app);
  
  // Register tenant management endpoints
  registerTenantRoutes(app);
  
  // Register system monitoring endpoints
  registerSystemRoutes(app);
  
  // Template cloning endpoint - restricted to super admins only
  app.post("/api/tenant/clone", requireSuperAdmin, async (req: Request, res: Response) => {
    try {
      
      const { templateId } = req.body;
      
      if (!templateId) {
        return res.status(400).json({ error: "Template ID is required" });
      }
      
      // Create a new tenant for the cloned template
      // In a real implementation, this would involve copying database records
      // and setting up the initial configuration
      
      // Generate a unique ID for the new tenant
      const tenantId = crypto.randomUUID();
      
      // Return the new tenant information
      res.status(200).json({
        success: true,
        tenantId,
        templateId,
        message: "Template cloning initialized successfully"
      });
    } catch (error: any) {
      console.error("Error cloning template:", error);
      res.status(500).json({ error: "Failed to clone template", message: error.message });
    }
  });
  
  // Pages API endpoints
  app.get("/api/pages/public", async (req: Request, res: Response) => {
    // Return list of public page paths
    try {
      // In a real app, we would fetch this from database
      // For demo, return hardcoded values based on Progress Accountants
      const publicPages = [
        "/",
        "/about",
        "/services",
        "/team", 
        "/contact",
        "/testimonials",
        "/resources"
      ];
      
      res.json(publicPages);
    } catch (error) {
      console.error("Error fetching public pages:", error);
      res.status(500).json({ error: "Failed to fetch public pages" });
    }
  });
  
  app.post("/api/pages", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const { name, slug, description, pageType, isPublished, tenantId } = req.body;
      
      // Basic validation
      if (!name || !slug || !description || !pageType) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Ensure slug contains only allowed characters
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(slug)) {
        return res.status(400).json({ 
          error: "Invalid slug format. Slug can only contain lowercase letters, numbers, and hyphens."
        });
      }
      
      // Create a new page data object (in a real app, this would be saved to database)
      const newPage = {
        id: Date.now(), // Simple ID generation for demo
        name,
        slug,
        description,
        pageType,
        isPublished: isPublished || false,
        tenantId: tenantId || (req.user as any).tenantId || null,
        createdById: (req.user as any).id || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: {}, // Initialize with empty content
        seoMetadata: {
          title: name,
          description: description
        }
      };
      
      // In a real app, we would save this to the database
      // storage.savePage(newPage);
      
      res.status(201).json(newPage);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ error: "Failed to create page" });
    }
  });
  
  // Register client registration endpoints
  registerClientRoutes(app);
  
  // Register blog endpoints
  registerBlogRoutes(app);
  
  // Register OpenAI endpoints for AI generation features
  registerOpenAIRoutes(app);
  
  // Register companion routes for context-aware chat
  registerCompanionRoutes(app);
  
  // Register companion configuration routes
  registerCompanionConfigRoutes(app);
  
  // Register resources routes
  registerResourcesRoutes(app);
  
  // Register tool marketplace routes
  // Register the old marketplace routes (will be deprecated)
  registerToolMarketplaceRoutes(app);
  
  // Register the new enhanced marketplace routes
  registerNewMarketplaceRoutes(app);
  
  // Register page builder routes
  registerPageBuilderApiRoutes(app);
  
  // Register version control routes
  registerVersionControlRoutes(app);
  
  // Register AI design system routes
  registerAiDesignRoutes(app);
  
  // Register enhanced SEO routes
  registerEnhancedSeoRoutes(app);
  
  // Register business network routes
  registerBusinessNetworkRoutes(app);
  
  // Register business discover routes
  registerBusinessDiscoverRoutes(app);
  
  // Register Agora business intelligence routes
  registerAgoraRoutes(app);
  
  // Newsfeed routes
  app.get("/api/newsfeed/industry", getIndustryNews);
  app.post("/api/newsfeed/config", updateNewsfeedConfig);
  
  // ============= NEXTMONTH MARKETPLACE API ENDPOINTS =============
  // Get available tools from NextMonth marketplace
  app.get("/api/nextmonth/marketplace/tools", getAvailableTools);
  
  // Get tool categories from NextMonth marketplace
  app.get("/api/nextmonth/marketplace/categories", getToolCategories);
  
  // Get installed tools from NextMonth marketplace
  app.get("/api/nextmonth/marketplace/installed", getInstalledTools);
  
  // Install a tool from NextMonth marketplace - restricted to super admins
  app.post("/api/nextmonth/marketplace/install/:toolId", requireSuperAdmin, installTool);
  
  // Uninstall a tool from NextMonth marketplace - restricted to super admins
  app.post("/api/nextmonth/marketplace/uninstall/:installationId", requireSuperAdmin, uninstallTool);
  
  // Get tool configuration from NextMonth marketplace
  app.get("/api/nextmonth/marketplace/tools/:installationId/config", getToolConfiguration);
  
  // Update tool configuration in NextMonth marketplace - restricted to super admins
  app.patch("/api/nextmonth/marketplace/tools/:installationId/config", requireSuperAdmin, updateToolConfiguration);
  

  
  // Page completion endpoint
  app.post("/api/pages/complete", async (req, res) => {
    try {
      // Validate request
      const pageSchema = z.object({
        path: z.string().min(1),
        displayName: z.string().min(1),
        order: z.number().optional().default(99)
      });
      
      const { path, displayName, order } = pageSchema.parse(req.body);
      
      // Get current project context
      const projectContext = await storage.getProjectContext();
      
      // Update page status
      if (!projectContext.pageStatus) {
        projectContext.pageStatus = {};
      }
      
      projectContext.pageStatus[path] = {
        displayName,
        complete: true,
        order
      };
      
      // Save updated context
      await storage.updateProjectContext(projectContext);
      
      // Return success
      res.status(200).json({
        success: true,
        message: `${displayName} page marked as complete`,
        path
      });
    } catch (error) {
      handleApiError(res, error, "Failed to mark page as complete");
    }
  });
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

  // DASHBOARD STATISTICS ENDPOINT
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      // Get real statistics from storage
      const conversations = await storage.getConversationInsights();
      const leads = await storage.getContactSubmissions();
      const autopilotSettings = await storage.getAutopilotSettings();
      
      // Calculate statistics
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const activeChatsToday = conversations.filter(conv => 
        new Date(conv.timestamp).toDateString() === today.toDateString()
      ).length;
      
      const leadsThisWeek = leads.filter(lead => 
        new Date(lead.date) >= weekAgo
      ).length;
      
      // Sample insights - could be enhanced with real analytics
      const topInsight = "Page engagement up 15%";
      const draftsAwaitingApproval = autopilotSettings?.reviewWorkflow ? 3 : 0;
      const marketViewUnlocked = false; // Premium feature
      
      const stats = {
        activeChatsToday,
        leadsThisWeek,
        topInsight,
        draftsAwaitingApproval,
        marketViewUnlocked,
        topTrendingKeyword: marketViewUnlocked ? "accounting software" : undefined
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // SETUP REQUEST ENDPOINT
  app.post("/api/setup/request", async (req: Request, res: Response) => {
    try {
      const { hostingProvider, domainRegistrar, websiteUrl, developerContact, secureNotes } = req.body;
      
      if (!hostingProvider || !websiteUrl) {
        return res.status(400).json({
          error: "Missing required fields: hostingProvider and websiteUrl are required"
        });
      }

      // Store setup request
      const setupRequest = {
        id: Date.now(),
        userId: req.user?.id || null,
        hostingProvider,
        domainRegistrar,
        websiteUrl,
        developerContact: developerContact || null,
        secureNotes,
        status: "pending",
        submittedAt: new Date().toISOString()
      };

      // In a real implementation, this would be stored in the database
      // For now, we'll log it and return success
      console.log("Setup request received:", setupRequest);

      res.status(201).json({
        success: true,
        message: "Setup request submitted successfully",
        requestId: setupRequest.id
      });
    } catch (error) {
      console.error("Setup request error:", error);
      res.status(500).json({ error: "Failed to submit setup request" });
    }
  });

  // CONTENT GENERATION ENDPOINTS

  // Get insight data for content generation
  app.get("/api/insights/content-data", async (req: Request, res: Response) => {
    try {
      // Get real conversation insights and data
      const conversations = await storage.getConversationInsights();
      const contacts = await storage.getContactSubmissions();
      
      // Transform data for content generation
      const contentData = {
        conversations: conversations.slice(0, 10).map(conv => ({
          id: conv.id,
          summary: conv.summary || "Customer inquiry about services",
          topics: conv.topics || ["accounting", "services"],
          timestamp: conv.timestamp
        })),
        topInsights: [
          {
            insight: "Customers frequently ask about tax planning services",
            score: 0.9,
            category: "Tax Services"
          },
          {
            insight: "Small businesses need help with quarterly reporting",
            score: 0.8,
            category: "Compliance"
          },
          {
            insight: "Video consultations are becoming more popular",
            score: 0.7,
            category: "Service Delivery"
          }
        ],
        marketTrends: [
          {
            keyword: "digital accounting",
            trend: "increasing",
            volume: 1200
          },
          {
            keyword: "tax planning",
            trend: "stable",
            volume: 850
          }
        ]
      };

      res.json(contentData);
    } catch (error) {
      console.error("Content data error:", error);
      res.status(500).json({ error: "Failed to fetch content data" });
    }
  });

  // Get content sources for social media generation
  app.get("/api/content/sources", async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContactSubmissions();
      
      // Transform real data into content sources
      const sources = {
        blogPosts: [
          {
            id: "1",
            title: "Essential Tax Planning Tips for Small Businesses",
            excerpt: "Learn how to optimize your tax strategy and save money for your business.",
            publishedAt: new Date().toISOString()
          },
          {
            id: "2", 
            title: "Understanding Quarterly Tax Payments",
            excerpt: "A comprehensive guide to managing quarterly tax obligations.",
            publishedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        recentQuestions: contacts.slice(0, 6).map((contact, index) => ({
          question: contact.message.length > 100 ? 
            contact.message.substring(0, 100) + "..." : 
            contact.message,
          category: contact.industry || "General",
          frequency: Math.floor(Math.random() * 10) + 1
        }))
      };

      res.json(sources);
    } catch (error) {
      console.error("Content sources error:", error);
      res.status(500).json({ error: "Failed to fetch content sources" });
    }
  });

  // Generate blog content
  app.post("/api/content/generate-blog", async (req: Request, res: Response) => {
    try {
      const { sourceType, tone, data } = req.body;
      
      // Simulate AI content generation based on real data
      let title = "";
      let body = "";
      let suggestedTags = [];

      switch (sourceType) {
        case "conversations":
          title = `Understanding Client Needs: Insights from Recent Conversations`;
          body = `Based on recent client interactions, we've identified several key areas where businesses need support:\n\n• Tax planning and compliance assistance\n• Quarterly reporting guidance\n• Digital transformation of accounting processes\n\nOur team has been working closely with clients to address these challenges and provide tailored solutions that meet their specific needs.`;
          suggestedTags = ["client-insights", "tax-planning", "accounting-services"];
          break;
        case "insights":
          title = `Top Business Insights: What Your Data Tells Us`;
          body = `Our analysis of client data reveals important trends in the accounting industry:\n\n• Increased demand for digital accounting solutions\n• Growing focus on proactive tax planning\n• Rising interest in video consultation services\n\nThese insights help us better serve our clients and anticipate their future needs.`;
          suggestedTags = ["business-insights", "trends", "digital-accounting"];
          break;
        case "trends":
          title = `Market Trends: The Future of Accounting Services`;
          body = `Current market data shows significant shifts in how businesses approach accounting:\n\n• Digital-first accounting solutions are becoming standard\n• Real-time financial reporting is increasingly important\n• Compliance automation is driving efficiency gains\n\nStaying ahead of these trends ensures we provide cutting-edge services to our clients.`;
          suggestedTags = ["market-trends", "future-of-accounting", "digital-transformation"];
          break;
      }

      // Adjust tone based on selection
      if (tone === "friendly") {
        body = body.replace(/Our analysis/g, "We've noticed").replace(/reveals/g, "shows us");
      } else if (tone === "casual") {
        body = body.replace(/Based on/g, "Looking at").replace(/reveals/g, "tells us");
      }

      res.json({
        title,
        body,
        suggestedTags
      });
    } catch (error) {
      console.error("Blog generation error:", error);
      res.status(500).json({ error: "Failed to generate blog content" });
    }
  });

  // Generate social media content
  app.post("/api/content/generate-social", async (req: Request, res: Response) => {
    try {
      const { sourceType, sourceId, prompt, platform } = req.body;
      
      let content = "";
      let hashtags = [];

      // Platform-specific content generation
      const platformLimits = {
        linkedin: 3000,
        instagram: 2200,
        x: 280,
        facebook: 63206
      };

      const limit = platformLimits[platform as keyof typeof platformLimits] || 500;

      switch (sourceType) {
        case "blog":
          content = platform === "x" 
            ? "Just published: Essential tax planning tips that could save your business thousands 💰"
            : "We've just published a comprehensive guide on tax planning strategies that could significantly impact your business's bottom line. From quarterly payment optimization to year-end planning, discover actionable insights that successful businesses use to stay ahead.";
          hashtags = ["TaxPlanning", "SmallBusiness", "Accounting"];
          break;
        case "question":
          content = platform === "x"
            ? "Common question: How often should I review my business finances? Our answer might surprise you 📊"
            : "One of the most frequent questions we receive is about financial review frequency. The answer depends on your business size and complexity, but here's what we recommend for most small to medium businesses...";
          hashtags = ["BusinessTips", "FinancialPlanning", "FAQ"];
          break;
        case "manual":
          const shortPrompt = prompt?.substring(0, limit - 100) || "Check out our latest services";
          content = platform === "x"
            ? `${shortPrompt} 🚀`
            : `${shortPrompt}\n\nWe're excited to help more businesses achieve their financial goals with our comprehensive approach to accounting and business advisory services.`;
          hashtags = ["BusinessServices", "Accounting", "GrowthStrategy"];
          break;
      }

      // Add platform-specific elements
      if (platform === "instagram") {
        hashtags.push("AccountingLife", "BusinessOwners", "FinanceTips");
      } else if (platform === "linkedin") {
        hashtags.push("ProfessionalServices", "BusinessAdvisory");
      }

      res.json({
        content,
        hashtags
      });
    } catch (error) {
      console.error("Social generation error:", error);
      res.status(500).json({ error: "Failed to generate social content" });
    }
  });

  // Save blog posts
  app.post("/api/content/blog-posts", async (req: Request, res: Response) => {
    try {
      const blogPost = {
        id: Date.now(),
        userId: req.user?.id || null,
        ...req.body,
        createdAt: new Date().toISOString()
      };

      // In a real implementation, this would be stored in the database
      console.log("Blog post saved:", blogPost);

      res.status(201).json({
        success: true,
        message: "Blog post saved successfully",
        id: blogPost.id
      });
    } catch (error) {
      console.error("Blog post save error:", error);
      res.status(500).json({ error: "Failed to save blog post" });
    }
  });

  // Get blog posts
  app.get("/api/content/blog-posts", async (req: Request, res: Response) => {
    try {
      // Return sample recent posts
      const recentPosts = [
        {
          id: 1,
          title: "Essential Tax Planning Tips for Small Businesses",
          status: "published",
          publishedAt: new Date().toISOString()
        },
        {
          id: 2,
          title: "Understanding Quarterly Tax Payments",
          status: "draft",
          publishedAt: null
        }
      ];

      res.json(recentPosts);
    } catch (error) {
      console.error("Blog posts fetch error:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Save social posts
  app.post("/api/content/social-posts", async (req: Request, res: Response) => {
    try {
      const socialPost = {
        id: Date.now(),
        userId: req.user?.id || null,
        ...req.body,
        createdAt: new Date().toISOString()
      };

      // In a real implementation, this would be stored in the database
      console.log("Social post saved:", socialPost);

      res.status(201).json({
        success: true,
        message: "Social post saved successfully",
        id: socialPost.id
      });
    } catch (error) {
      console.error("Social post save error:", error);
      res.status(500).json({ error: "Failed to save social post" });
    }
  });

  // Get social posts
  app.get("/api/content/social-posts", async (req: Request, res: Response) => {
    try {
      // Return sample recent posts
      const recentPosts = [
        {
          id: 1,
          platform: "linkedin",
          content: "Just published: Essential tax planning tips...",
          status: "posted",
          scheduledDate: new Date().toISOString()
        },
        {
          id: 2,
          platform: "x",
          content: "Common question: How often should I review...",
          status: "draft",
          scheduledDate: null
        }
      ];

      res.json(recentPosts);
    } catch (error) {
      console.error("Social posts fetch error:", error);
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  // FEATURE REQUEST SCOPING ASSISTANT ENDPOINTS
  
  // In-memory conversation storage
  const conversations = new Map<string, Array<ChatMessage>>();
  
  // Create a new conversation or continue existing one
  app.post("/api/scope-request/chat", async (req: Request, res: Response) => {
    try {
      console.log("Received chat request:", req.body);
      const { message, conversationId } = chatRequestSchema.parse(req.body);
      
      // Generate or use existing conversation ID
      const currentConversationId = conversationId || Date.now().toString();
      console.log("Using conversation ID:", currentConversationId);
      
      // Get or initialize conversation history
      let conversationHistory = conversations.get(currentConversationId) || [];
      console.log("Current conversation history:", conversationHistory);
      
      // Check if this is the first user message (to apply screening)
      const isFirstUserMessage = conversationHistory.length === 0;
      
      // If this is a new conversation, add the system prompt
      if (isFirstUserMessage) {
        conversationHistory.push({ role: "system", content: SYSTEM_PROMPT });
        console.log("Added system prompt to new conversation");
      }
      
      // Add user message to history
      conversationHistory.push({ role: "user", content: message });
      console.log("Added user message to history");
      
      // Check if we have an API key
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not set");
        throw new Error("OpenAI API key is not configured");
      }
      
      // Apply feature screening if this is the first message in the conversation
      if (isFirstUserMessage) {
        try {
          const { handleFeatureRequest } = require('./feature-screening');
          console.log("Applying feature screening to first message...");
          
          const screeningResult = await handleFeatureRequest(message);
          console.log("Feature screening result:", screeningResult);
          
          // Add the assistant's screening response to the conversation
          conversationHistory.push({ 
            role: "assistant", 
            content: screeningResult.response 
          });
          
          // Save updated conversation
          conversations.set(currentConversationId, conversationHistory);
          
          // If it's a template_ready or simple_custom, we can proceed directly
          // Otherwise, we'll wait for the user to confirm if they want to proceed with a simpler version
          if (screeningResult.shouldSubmitToDev) {
            return res.status(200).json({
              success: true,
              message: screeningResult.response,
              conversationId: currentConversationId,
              screeningResult,
              isScreened: true
            });
          }
          
          // For wishlist items, we'll just return the response
          if (screeningResult.category === 'wishlist') {
            // Return with wishlist specific data
            return res.status(200).json({
              success: true,
              message: screeningResult.response,
              conversationId: currentConversationId,
              screeningResult,
              isScreened: true,
              wishlistSubmitted: screeningResult.wishlistSubmitted
            });
          }
        } catch (screeningError) {
          console.error("Feature screening error:", screeningError);
          // Continue with normal conversation if screening fails
        }
      }
      
      console.log("Calling OpenAI API...");
      // Call OpenAI API
      let completion;
      try {
        completion = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: conversationHistory.map(msg => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content
          })),
        });
        console.log("Successfully used gpt-4o model");
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // Fallback to older model if gpt-4o is not available
        console.log("Falling back to gpt-3.5-turbo model...");
        completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: conversationHistory.map(msg => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content
          })),
        });
        console.log("Successfully used fallback gpt-3.5-turbo model");
      }
      
      if (!completion) {
        throw new Error("Failed to get completion from OpenAI");
      }
      
      // Get assistant's response
      const assistantResponse = completion.choices[0].message.content || "";
      
      // Add assistant response to history
      conversationHistory.push({ role: "assistant", content: assistantResponse });
      
      // Save updated conversation
      conversations.set(currentConversationId, conversationHistory);
      
      // Check if it's a JSON response (for final step)
      let structuredData = null;
      if (assistantResponse && assistantResponse.includes('{"project":')) {
        try {
          // Extract JSON from the message if it's wrapped in text
          const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            structuredData = JSON.parse(jsonMatch[0]);
          }
        } catch (err) {
          console.error("Failed to parse JSON from response:", err);
        }
      }
      
      res.status(200).json({
        success: true,
        message: assistantResponse,
        conversationId: currentConversationId,
        structuredData,
        isScreened: false
      });
    } catch (error) {
      console.error("Chat API error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred processing your request"
      });
    }
  });
  
  // Send the finalized request to NextMonth Dev
  app.post("/api/scope-request/send", async (req: Request, res: Response) => {
    try {
      const { requestData } = finalizeRequestSchema.parse(req.body);
      
      // Send to NextMonth Dev listener endpoint
      const response = await fetch("https://nextmonth-dev.replit.app/listen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send request to NextMonth Dev: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Store the request in the database for future reference
      if (!storage.featureRequests) {
        storage.featureRequests = [];
      }
      
      const featureRequest: FeatureRequest = {
        id: Date.now(),
        requestData,
        sentAt: new Date().toISOString(),
        status: "sent" as 'sent'
      };
      
      storage.featureRequests.push(featureRequest);
      
      // Log the feature request to our logs directory
      try {
        const fs = require('fs');
        const path = require('path');
        
        // Format date as YYYY-MM-DD
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const logDir = path.join(process.cwd(), 'logs', 'feature-requests');
        
        // Ensure directory exists
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logPath = path.join(logDir, `${dateString}.json`);
        
        // Initialize or read existing log file
        let logData = [];
        if (fs.existsSync(logPath)) {
          try {
            const fileContent = fs.readFileSync(logPath, 'utf8');
            logData = JSON.parse(fileContent);
            if (!Array.isArray(logData)) {
              logData = [];
            }
          } catch (readError) {
            console.error("Error reading existing log file:", readError);
            logData = [];
          }
        }
        
        // Add new request to log
        const logEntry = {
          timestamp: new Date().toISOString(),
          request_id: featureRequest.id,
          final_payload: requestData,
          status: featureRequest.status
        };
        
        logData.push(logEntry);
        
        // Write updated logs
        fs.writeFileSync(logPath, JSON.stringify(logData, null, 2), 'utf8');
        console.log(`Feature request logged to ${logPath}`);
      } catch (logError) {
        console.error("Error logging feature request:", logError);
        // Don't fail the request if logging fails
      }
      
      res.status(200).json({
        success: true,
        message: "Request successfully sent to NextMonth Dev",
        responseFromDev: responseData
      });
    } catch (error) {
      console.error("Send to NextMonth Dev error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred sending your request"
      });
    }
  });

  // Admin endpoint for manual backup
  app.post("/api/admin/backup", async (req: Request, res: Response) => {
    try {
      console.log('Manual backup requested');
      
      // Start backup process
      const { triggerBackup } = require('./backup');
      await triggerBackup();
      
      res.status(200).json({
        success: true,
        message: "Backup process initiated successfully"
      });
    } catch (error) {
      console.error('Manual backup error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to initiate backup process"
      });
    }
  });
  
  // ONBOARDING STATE MANAGEMENT ENDPOINTS
  
  // Schema for onboarding state operations
  const onboardingStateSchema = z.object({
    userId: z.number(),
    stage: z.string(),
    status: z.string().optional().default('in_progress'),
    data: z.any().optional()
  });
  
  const updateOnboardingSchema = z.object({
    userId: z.number(),
    stage: z.string(),
    status: z.string(),
    data: z.any().optional()
  });
  
  const guardianSyncSchema = z.object({
    id: z.number(),
    synced: z.boolean().optional().default(true)
  });
  
  // Get onboarding state for a user
  app.get("/api/onboarding/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const onboardingState = await storage.getOnboardingState(userId);
      
      if (!onboardingState) {
        return res.status(404).json({
          success: false,
          message: "No onboarding state found for this user"
        });
      }
      
      res.status(200).json({
        success: true,
        data: onboardingState
      });
    } catch (error) {
      console.error("Error fetching onboarding state:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred fetching onboarding state"
      });
    }
  });
  
  // Get specific stage state for a user
  app.get("/api/onboarding/:userId/:stage", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const stage = req.params.stage;
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const stageState = await storage.getOnboardingStageState(userId, stage);
      
      if (!stageState) {
        return res.status(404).json({
          success: false,
          message: `No onboarding state found for stage '${stage}'`
        });
      }
      
      res.status(200).json({
        success: true,
        data: stageState
      });
    } catch (error) {
      console.error("Error fetching stage state:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred fetching stage state"
      });
    }
  });
  
  // Create or update onboarding state
  app.post("/api/onboarding", async (req: Request, res: Response) => {
    try {
      const data = onboardingStateSchema.parse(req.body);
      
      const onboardingState = await storage.saveOnboardingState(data);
      
      res.status(200).json({
        success: true,
        message: "Onboarding state saved",
        data: onboardingState
      });
    } catch (error) {
      console.error("Error saving onboarding state:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred saving onboarding state"
      });
    }
  });
  
  // Update onboarding status
  app.patch("/api/onboarding/status", async (req: Request, res: Response) => {
    try {
      const { userId, stage, status, data } = updateOnboardingSchema.parse(req.body);
      
      const updatedState = await storage.updateOnboardingStatus(userId, stage, status, data);
      
      if (!updatedState) {
        return res.status(404).json({
          success: false,
          message: "Failed to update onboarding status"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Onboarding status updated",
        data: updatedState
      });
    } catch (error) {
      console.error("Error updating onboarding status:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred updating onboarding status"
      });
    }
  });
  
  // Mark stage as complete
  app.patch("/api/onboarding/complete", async (req: Request, res: Response) => {
    try {
      const { userId, stage, data } = onboardingStateSchema.parse(req.body);
      
      const completedState = await storage.markOnboardingStageComplete(userId, stage, data);
      
      if (!completedState) {
        return res.status(404).json({
          success: false,
          message: "Failed to mark stage as complete"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Stage marked as complete",
        data: completedState
      });
    } catch (error) {
      console.error("Error marking stage complete:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred marking stage complete"
      });
    }
  });
  
  // Get incomplete onboarding
  app.get("/api/onboarding/:userId/incomplete", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const incompleteState = await storage.getIncompleteOnboarding(userId);
      
      if (!incompleteState) {
        return res.status(404).json({
          success: false,
          message: "No incomplete onboarding found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: incompleteState
      });
    } catch (error) {
      console.error("Error fetching incomplete onboarding:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred fetching incomplete onboarding"
      });
    }
  });
  
  // Mark as synced with Guardian
  // Save user's homepage preference (full_site, tools_only, or undecided)
  app.post("/api/onboarding/preference", async (req: Request, res: Response) => {
    try {
      const { preference, userId } = req.body;
      
      if (!preference || !['full_site', 'tools_only', 'undecided'].includes(preference)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid preference value. Must be one of: full_site, tools_only, undecided" 
        });
      }
      
      if (!userId) {
        return res.status(400).json({
          success: false, 
          message: "User ID is required"
        });
      }
      
      // Save preference to the database
      const userIdInt = parseInt(userId);
      
      try {
        // Update or create the onboarding state with this preference
        await storage.saveOnboardingPreference(userIdInt, preference);
        
        // Return success response
        res.status(200).json({ 
          success: true, 
          message: `Homepage preference set to ${preference}` 
        });
      } catch (dbError) {
        console.error("Database error saving preference:", dbError);
        res.status(500).json({
          success: false,
          message: "Failed to save preference to database"
        });
      }
    } catch (error) {
      console.error("Error in /api/onboarding/preference:", error);
      res.status(500).json({
        success: false, 
        message: "An unexpected error occurred" 
      });
    }
  });

  app.patch("/api/onboarding/guardian-sync", async (req: Request, res: Response) => {
    try {
      const { id, synced } = guardianSyncSchema.parse(req.body);
      
      const updatedState = await storage.markGuardianSynced(id, synced);
      
      if (!updatedState) {
        return res.status(404).json({
          success: false,
          message: "Onboarding state not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Guardian sync status updated",
        data: updatedState
      });
    } catch (error) {
      console.error("Error updating guardian sync:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({
        success: false,
        message: "An error occurred updating guardian sync"
      });
    }
  });
  
  // PAGE INTELLIGENCE + COMPLEXITY SYSTEM ENDPOINTS
  
  // Define validation schema for page complexity assessment
  const pageComplexityAssessmentSchema = z.object({
    userId: z.number().int().positive(),
    requestDescription: z.string().min(10),
    visualComplexity: z.number().min(1).max(10),
    logicComplexity: z.number().min(1).max(10),
    dataComplexity: z.number().min(1).max(10),
    estimatedHours: z.number().positive(),
    complexityLevel: z.enum(['simple', 'moderate', 'complex', 'wishlist']),
    aiAssessment: z.string()
  });

  // API endpoint for triaging page complexity
  app.post("/api/page-intelligence/triage", async (req, res) => {
    try {
      const validatedData = pageComplexityAssessmentSchema.parse(req.body);
      
      const result = await storage.savePageComplexityTriage(validatedData);
      
      res.status(200).json({
        success: true,
        message: "Page complexity assessment saved successfully",
        triage: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      console.error("Error saving page complexity triage:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve page complexity scores by user
  app.get("/api/page-intelligence/triage/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const triages = await storage.getPageComplexityTriagesByUser(userId);
      
      res.status(200).json({
        success: true,
        triages
      });
    } catch (error) {
      console.error("Error retrieving page complexity triages:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve specific page complexity triage
  app.get("/api/page-intelligence/triage/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid triage ID"
        });
      }
      
      const triage = await storage.getPageComplexityTriage(id);
      
      if (!triage) {
        return res.status(404).json({
          success: false,
          message: "Triage not found"
        });
      }
      
      res.status(200).json({
        success: true,
        triage
      });
    } catch (error) {
      console.error("Error retrieving page complexity triage:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to update sync status of page complexity triage
  app.patch("/api/page-intelligence/triage/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid triage ID"
        });
      }
      
      const { vaultSynced, guardianSynced } = req.body;
      
      // Ensure at least one of the sync flags is provided
      if (vaultSynced === undefined && guardianSynced === undefined) {
        return res.status(400).json({
          success: false,
          message: "At least one sync flag (vaultSynced or guardianSynced) must be provided"
        });
      }
      
      const updatedTriage = await storage.updatePageComplexitySyncStatus(
        id,
        vaultSynced,
        guardianSynced
      );
      
      if (!updatedTriage) {
        return res.status(404).json({
          success: false,
          message: "Triage not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Sync status updated successfully",
        triage: updatedTriage
      });
    } catch (error) {
      console.error("Error updating sync status:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // MODULE ACTIVATION ENDPOINTS
  
  // Define validation schema for module activation
  const moduleActivationSchema = z.object({
    userId: z.number().int().positive(),
    moduleId: z.string().min(1),
    pageMetadata: z.any().optional()
  });
  
  // API endpoint to log module activation
  app.post("/api/module-activation", async (req, res) => {
    try {
      const validatedData = moduleActivationSchema.parse(req.body);
      
      const result = await storage.logModuleActivation(validatedData);
      
      res.status(200).json({
        success: true,
        message: "Module activation logged successfully",
        activation: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      console.error("Error logging module activation:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve module activations by user
  app.get("/api/module-activation/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const activations = await storage.getModuleActivations(userId);
      
      res.status(200).json({
        success: true,
        activations
      });
    } catch (error) {
      console.error("Error retrieving module activations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to retrieve module activations by module
  app.get("/api/module-activation/module/:moduleId", async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      
      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Invalid module ID"
        });
      }
      
      const activations = await storage.getModuleActivations(undefined, moduleId);
      
      res.status(200).json({
        success: true,
        activations
      });
    } catch (error) {
      console.error("Error retrieving module activations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint to update sync status of module activation
  app.patch("/api/module-activation/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid activation ID"
        });
      }
      
      const { synced } = req.body;
      
      if (synced === undefined) {
        return res.status(400).json({
          success: false,
          message: "Sync status must be provided"
        });
      }
      
      const updatedActivation = await storage.markModuleActivationSynced(id, synced);
      
      if (!updatedActivation) {
        return res.status(404).json({
          success: false,
          message: "Module activation not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Sync status updated successfully",
        activation: updatedActivation
      });
    } catch (error) {
      console.error("Error updating sync status:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  
  // API endpoint for AI-powered page complexity assessment
  app.post("/api/page-intelligence/ai-assess", async (req, res) => {
    try {
      const { description, features, pageType } = req.body;
      
      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Page description is required"
        });
      }
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          success: false, 
          message: "OpenAI API key is not configured" 
        });
      }
      
      // Prepare prompt for OpenAI
      const prompt = `
        Analyze the following page description and assess its complexity.
        
        Page Description: ${description}
        
        ${features ? `Features: ${features.join(', ')}` : ''}
        ${pageType ? `Page Type: ${pageType}` : ''}
        
        Provide a detailed assessment with scores for visual complexity, logic complexity, and data complexity on a scale of 1-10.
        Also include the estimated development hours and appropriate complexity level (simple, moderate, complex, or wishlist).
        
        Format your response as JSON with the following structure:
        {
          "visualComplexity": number,
          "logicComplexity": number,
          "dataComplexity": number,
          "estimatedHours": number,
          "complexityLevel": "simple" | "moderate" | "complex" | "wishlist",
          "analysis": "detailed explanation"
        }
      `;
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are an expert web development complexity analyst." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const aiAssessment = JSON.parse(response.choices[0].message.content);
      
      res.status(200).json({
        success: true,
        assessment: {
          ...aiAssessment,
          aiAssessment: aiAssessment.analysis // Rename for consistency with our schema
        }
      });
    } catch (error) {
      console.error("Error performing AI assessment:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while performing AI assessment"
      });
    }
  });

  // SEO Configuration Management API Endpoints
  // Get all SEO configurations
  app.get("/api/seo", async (req, res) => {
    try {
      const configs = await storage.getAllSeoConfigurations();
      res.status(200).json({
        success: true,
        data: configs
      });
    } catch (error) {
      console.error("Error fetching SEO configurations:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred retrieving SEO configurations"
      });
    }
  });

  // Get SEO configuration for a specific route
  app.get("/api/seo/route/:path", async (req, res) => {
    try {
      // Get the route path - need to handle potential URL encoding
      const routePath = decodeURIComponent(req.params.path);
      
      if (!routePath) {
        return res.status(400).json({
          success: false,
          message: "Invalid route path"
        });
      }
      
      const config = await storage.getSeoConfiguration(routePath);
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: "SEO configuration not found for this route"
        });
      }
      
      res.status(200).json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error("Error fetching SEO configuration:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred retrieving the SEO configuration"
      });
    }
  });

  // Create or update SEO configuration
  app.post("/api/seo", async (req, res) => {
    try {
      // Validate the incoming data using the schema
      const configData = insertSeoConfigurationSchema.parse(req.body);
      
      // Set default values for new configurations
      const seoConfig = {
        routePath: configData.routePath,
        title: configData.title,
        description: configData.description,
        indexable: configData.indexable ?? true,
        priority: configData.priority ?? 0.5,
        canonical: configData.canonical,
        ogTitle: configData.ogTitle,
        ogDescription: configData.ogDescription,
        ogImage: configData.ogImage,
        structuredData: configData.structuredData,
        changeFrequency: configData.changeFrequency
      };
      
      const savedConfig = await storage.saveSeoConfiguration(seoConfig);
      
      res.status(200).json({
        success: true,
        message: "SEO configuration saved successfully",
        data: savedConfig
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred saving the SEO configuration");
    }
  });

  // Update an existing SEO configuration
  app.patch("/api/seo/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid SEO configuration ID"
        });
      }
      
      const updated = await storage.updateSeoConfiguration(id, updateData);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "SEO configuration not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "SEO configuration updated successfully",
        data: updated
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred updating the SEO configuration");
    }
  });

  // Delete an SEO configuration
  app.delete("/api/seo/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid SEO configuration ID"
        });
      }
      
      const deleted = await storage.deleteSeoConfiguration(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "SEO configuration not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "SEO configuration deleted successfully"
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred deleting the SEO configuration");
    }
  });

  // Get all indexable or non-indexable SEO configurations
  app.get("/api/seo/status/:indexable", async (req, res) => {
    try {
      const indexable = req.params.indexable === 'true';
      
      const configs = await storage.getSeoConfigurationsByStatus(indexable);
      
      res.status(200).json({
        success: true,
        data: configs
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred retrieving SEO configurations");
    }
  });

  // Update sync status for SEO configuration
  app.patch("/api/seo/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { vaultSynced, guardianSynced } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid SEO configuration ID"
        });
      }
      
      if (vaultSynced === undefined && guardianSynced === undefined) {
        return res.status(400).json({
          success: false,
          message: "At least one sync status field must be provided"
        });
      }
      
      const updated = await storage.updateSeoSyncStatus(id, vaultSynced, guardianSynced);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "SEO configuration not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Sync status updated successfully",
        data: updated
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred updating sync status");
    }
  });

  // Brand Version Management API Endpoints
  // Get all brand versions
  app.get("/api/brand-versions", async (req, res) => {
    try {
      const versions = await storage.getAllBrandVersions();
      res.status(200).json({
        success: true,
        data: versions
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred retrieving brand versions");
    }
  });

  // Get a specific brand version
  app.get("/api/brand-versions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand version ID"
        });
      }
      
      const version = await storage.getBrandVersion(id);
      
      if (!version) {
        return res.status(404).json({
          success: false,
          message: "Brand version not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: version
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred retrieving the brand version");
    }
  });

  // Get brand version by version number
  app.get("/api/brand-versions/number/:versionNumber", async (req, res) => {
    try {
      const versionNumber = req.params.versionNumber;
      
      if (!versionNumber) {
        return res.status(400).json({
          success: false,
          message: "Invalid version number"
        });
      }
      
      const version = await storage.getBrandVersionByNumber(versionNumber);
      
      if (!version) {
        return res.status(404).json({
          success: false,
          message: "Brand version not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: version
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred retrieving the brand version");
    }
  });

  // Get the currently active brand version
  app.get("/api/brand-versions/active", async (req, res) => {
    try {
      const activeVersion = await storage.getActiveBrandVersion();
      
      if (!activeVersion) {
        return res.status(404).json({
          success: false,
          message: "No active brand version found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: activeVersion
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred retrieving the active brand version");
    }
  });

  // Create or update a brand version
  app.post("/api/brand-versions", async (req, res) => {
    try {
      // Validate the incoming data using the schema
      const versionData = insertBrandVersionSchema.parse(req.body);
      
      const savedVersion = await storage.saveBrandVersion(versionData);
      
      res.status(200).json({
        success: true,
        message: "Brand version saved successfully",
        data: savedVersion
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred saving the brand version");
    }
  });

  // Activate a brand version
  app.post("/api/brand-versions/:id/activate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand version ID"
        });
      }
      
      const activated = await storage.activateBrandVersion(id);
      
      if (!activated) {
        return res.status(404).json({
          success: false,
          message: "Brand version not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Brand version activated successfully",
        data: activated
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred activating the brand version");
    }
  });

  // Update sync status for brand version
  app.patch("/api/brand-versions/:id/sync", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { vaultSynced, guardianSynced } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand version ID"
        });
      }
      
      if (vaultSynced === undefined && guardianSynced === undefined) {
        return res.status(400).json({
          success: false,
          message: "At least one sync status field must be provided"
        });
      }
      
      const updated = await storage.updateBrandSyncStatus(id, vaultSynced, guardianSynced);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Brand version not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Sync status updated successfully",
        data: updated
      });
    } catch (error) {
      handleApiError(res, error, "An error occurred updating sync status");
    }
  });
  
  // Register Blueprint Export routes
  registerLegacyBlueprintRoutes(app);
  
  // Create HTTP server
  const httpServer = createServer(app);

  // SEO Configuration API Endpoints
  app.get("/api/seo/configs", async (req: Request, res: Response) => {
    try {
      const configs = await storage.getAllSeoConfigurations();
      return res.status(200).json(configs);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch SEO configurations");
    }
  });

  app.get("/api/seo/configs/path", async (req: Request, res: Response) => {
    try {
      const routePath = req.query.routePath as string;
      
      if (!routePath) {
        return res.status(400).json({ error: "Route path is required" });
      }
      
      const config = await storage.getSeoConfiguration(routePath);
      
      // Don't return 404 if not found, just return null
      // This is useful for the frontend to default to basic SEO
      return res.status(200).json(config || null);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch SEO configuration by path");
    }
  });

  app.get("/api/seo/configs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const config = await storage.getSeoConfiguration(undefined, id);
      
      if (!config) {
        return res.status(404).json({ error: "SEO configuration not found" });
      }
      
      return res.status(200).json(config);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch SEO configuration");
    }
  });

  app.post("/api/seo/configs", async (req: Request, res: Response) => {
    try {
      const configData = req.body;
      
      // Ensure priority is set (required by database schema)
      if (configData.priority === undefined || configData.priority === null) {
        configData.priority = 0.5; // Default to middle priority
      }
      
      const savedConfig = await storage.saveSeoConfiguration(configData);
      return res.status(201).json(savedConfig);
    } catch (error) {
      handleApiError(res, error, "Failed to create SEO configuration");
    }
  });

  app.patch("/api/seo/configs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const updateData = { ...req.body };
      
      // If we're explicitly clearing the priority, set it to the default
      if (updateData.priority === null || updateData.priority === undefined) {
        updateData.priority = 0.5;
      }
      
      const updatedConfig = await storage.updateSeoConfiguration(id, updateData);
      
      if (!updatedConfig) {
        return res.status(404).json({ error: "SEO configuration not found" });
      }
      
      return res.status(200).json(updatedConfig);
    } catch (error) {
      handleApiError(res, error, "Failed to update SEO configuration");
    }
  });

  app.delete("/api/seo/configs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const deleted = await storage.deleteSeoConfiguration(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "SEO configuration not found" });
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      handleApiError(res, error, "Failed to delete SEO configuration");
    }
  });
  
  // Batch update SEO configuration priorities
  app.patch("/api/seo/configs/batch-update-priority", async (req: Request, res: Response) => {
    try {
      const { priorities } = req.body;
      
      if (!priorities || !Array.isArray(priorities)) {
        return res.status(400).json({ error: "Invalid priorities format. Expected an array of {id, priority} objects." });
      }
      
      // Validate each priority item
      for (const item of priorities) {
        if (!item.id || typeof item.id !== 'number' || item.priority === undefined || typeof item.priority !== 'number') {
          return res.status(400).json({ 
            error: "Each priority item must have a numeric id and priority value",
            invalidItem: item 
          });
        }
        
        // Ensure priority is between 0 and 1
        if (item.priority < 0 || item.priority > 1) {
          return res.status(400).json({
            error: "Priority values must be between 0 and 1",
            invalidItem: item
          });
        }
      }
      
      // Update all priorities in storage
      const updatedConfigs = await storage.updateSeoConfigPriorities(priorities);
      
      return res.status(200).json({
        success: true,
        message: `Updated ${updatedConfigs.length} SEO configuration priorities`,
        data: updatedConfigs
      });
    } catch (error) {
      handleApiError(res, error, "Failed to update SEO configuration priorities");
    }
  });

  app.post("/api/seo/configs/:id/sync/guardian", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const updated = await storage.updateSeoSyncStatus(id, undefined, true);
      
      if (!updated) {
        return res.status(404).json({ error: "SEO configuration not found" });
      }
      
      return res.status(200).json(updated);
    } catch (error) {
      handleApiError(res, error, "Failed to sync SEO configuration with Guardian");
    }
  });

  app.post("/api/seo/configs/:id/sync/vault", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const updated = await storage.updateSeoSyncStatus(id, true, undefined);
      
      if (!updated) {
        return res.status(404).json({ error: "SEO configuration not found" });
      }
      
      return res.status(200).json(updated);
    } catch (error) {
      handleApiError(res, error, "Failed to sync SEO configuration with Vault");
    }
  });

  app.post("/api/seo/sitemap/generate", async (req: Request, res: Response) => {
    try {
      const configs = await storage.getSeoConfigurationsByStatus(true);
      const siteUrl = process.env.SITE_URL || "https://progressaccountants.com";
      
      // Generate the sitemap XML
      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      configs.forEach(config => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${siteUrl}${config.routePath}</loc>\n`;
        if (config.changeFrequency) {
          sitemap += `    <changefreq>${config.changeFrequency}</changefreq>\n`;
        }
        if (config.priority !== null) {
          sitemap += `    <priority>${config.priority}</priority>\n`;
        }
        sitemap += `    <lastmod>${new Date(config.updatedAt).toISOString()}</lastmod>\n`;
        sitemap += '  </url>\n';
      });
      
      sitemap += '</urlset>';
      
      return res.status(200).json({
        success: true,
        sitemap,
        configCount: configs.length
      });
    } catch (error) {
      handleApiError(res, error, "Failed to generate sitemap");
    }
  });

  // Brand Versioning API Endpoints
  app.get("/api/brand/versions", async (req: Request, res: Response) => {
    try {
      const versions = await storage.getAllBrandVersions();
      return res.status(200).json(versions);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch brand versions");
    }
  });

  app.get("/api/brand/versions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const version = await storage.getBrandVersion(id);
      
      if (!version) {
        return res.status(404).json({ error: "Brand version not found" });
      }
      
      return res.status(200).json(version);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch brand version");
    }
  });

  app.get("/api/brand/versions/latest", async (req: Request, res: Response) => {
    try {
      const version = await storage.getLatestBrandVersion();
      
      if (!version) {
        return res.status(404).json({ error: "No brand versions found" });
      }
      
      return res.status(200).json(version);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch latest brand version");
    }
  });

  app.post("/api/brand/versions", async (req: Request, res: Response) => {
    try {
      const versionData = req.body;
      const savedVersion = await storage.saveBrandVersion(versionData);
      return res.status(201).json(savedVersion);
    } catch (error) {
      handleApiError(res, error, "Failed to create brand version");
    }
  });

  app.patch("/api/brand/versions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const updatedVersion = await storage.updateBrandVersion(id, req.body);
      
      if (!updatedVersion) {
        return res.status(404).json({ error: "Brand version not found" });
      }
      
      return res.status(200).json(updatedVersion);
    } catch (error) {
      handleApiError(res, error, "Failed to update brand version");
    }
  });

  app.post("/api/brand/versions/:id/activate", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const activatedVersion = await storage.activateBrandVersion(id);
      
      if (!activatedVersion) {
        return res.status(404).json({ error: "Brand version not found" });
      }
      
      return res.status(200).json(activatedVersion);
    } catch (error) {
      handleApiError(res, error, "Failed to activate brand version");
    }
  });

  app.delete("/api/brand/versions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      
      const deleted = await storage.deleteBrandVersion(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Brand version not found" });
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      handleApiError(res, error, "Failed to delete brand version");
    }
  });

  // ============= TENANT API ENDPOINTS =============
  // Get tenant by ID
  app.get("/api/tenants/:id", async (req, res) => {
    try {
      // Check if user is authorized for this tenant
      const requestedTenantId = req.params.id;
      const userTenantId = req.user?.tenantId;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      // Only allow super admins or users in the same tenant to access
      if (!isSuperAdmin && userTenantId !== requestedTenantId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this tenant"
        });
      }
      
      const tenant = await storage.getTenant(requestedTenantId);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: tenant
      });
    } catch (error) {
      handleApiError(res, error, "Failed to retrieve tenant");
    }
  });
  
  // Update tenant theme
  app.patch("/api/tenants/:id/theme", async (req, res) => {
    try {
      const tenantId = req.params.id;
      const { theme } = req.body;
      
      // Check authorization
      const userTenantId = req.user?.tenantId;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      if (!isSuperAdmin && userTenantId !== tenantId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this tenant"
        });
      }
      
      // Update the tenant theme
      const updatedTenant = await storage.updateTenant(tenantId, { theme });
      
      if (!updatedTenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Tenant theme updated successfully",
        data: updatedTenant
      });
    } catch (error) {
      handleApiError(res, error, "Failed to update tenant theme");
    }
  });
  
  // Get tenant customization
  app.get("/api/tenants/:id/customization", async (req, res) => {
    try {
      const tenantId = req.params.id;
      
      // Check authorization
      const userTenantId = req.user?.tenantId;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      if (!isSuperAdmin && userTenantId !== tenantId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this tenant's customization"
        });
      }
      
      const customization = await storage.getTenantCustomization(tenantId);
      
      if (!customization) {
        // Return default customization settings instead of 404
        return res.status(200).json({
          success: true,
          data: {
            uiLabels: {
              siteName: "Business Manager",
              dashboardTitle: "Dashboard",
              toolsLabel: "Tools",
              pagesLabel: "Pages",
              marketplaceLabel: "Marketplace",
              accountLabel: "Account",
              settingsLabel: "Settings"
            },
            tone: {
              formality: "neutral",
              personality: "professional"
            },
            featureFlags: {
              enablePodcastTools: false,
              enableFinancialReporting: true,
              enableClientPortal: true,
              enableMarketplaceAccess: true,
              enableCustomPages: true
            },
            sectionsEnabled: {
              servicesShowcase: true,
              teamMembers: true,
              testimonialsSlider: true,
              blogPosts: true,
              eventCalendar: false,
              resourceCenter: false
            }
          }
        });
      }
      
      res.status(200).json({
        success: true,
        data: customization
      });
    } catch (error) {
      handleApiError(res, error, "Failed to retrieve tenant customization");
    }
  });
  
  // Update tenant customization
  app.patch("/api/tenants/:id/customization", async (req, res) => {
    try {
      const tenantId = req.params.id;
      const customization = req.body;
      
      // Check authorization
      const userTenantId = req.user?.tenantId;
      const isSuperAdmin = req.user?.isSuperAdmin;
      
      if (!isSuperAdmin && userTenantId !== tenantId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this tenant's customization"
        });
      }
      
      const updatedCustomization = await storage.updateTenantCustomization(tenantId, customization);
      
      if (!updatedCustomization) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Tenant customization updated successfully",
        data: updatedCustomization
      });
    } catch (error) {
      handleApiError(res, error, "Failed to update tenant customization");
    }
  });

  // ============= TOOLS API ENDPOINTS =============
  // Get all tools
  app.get("/api/tools", async (req, res) => {
    try {
      let tools = [];
      const toolType = req.query.type as string;
      const status = req.query.status as string;
      const tenantId = req.user?.tenantId; // Get tenant ID from authenticated user
      
      if (toolType) {
        tools = await storage.getToolsByType(toolType, tenantId);
      } else if (status) {
        tools = await storage.getToolsByStatus(status, tenantId);
      } else {
        // Get tools created by the current user
        const userId = req.user?.id;
        if (userId) {
          tools = await storage.getToolsByUser(userId, tenantId);
        } else if (tenantId) {
          // If no user ID but tenant ID is available, get all tools for tenant
          tools = await storage.getToolsByTenant(tenantId);
        }
      }
      
      res.status(200).json({
        success: true,
        data: tools
      });
    } catch (error) {
      handleApiError(res, error, "Failed to retrieve tools");
    }
  });

  // Get tool by ID
  app.get("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenantId = req.user?.tenantId; // Get tenant ID from authenticated user
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tool ID"
        });
      }
      
      const tool = await storage.getTool(id, tenantId);
      
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: tool
      });
    } catch (error) {
      handleApiError(res, error, "Failed to retrieve tool");
    }
  });

  // Create a new tool
  app.post("/api/tools", async (req, res) => {
    try {
      const toolData = insertToolSchema.parse(req.body);
      
      // Set the created by user ID if logged in
      if (req.user) {
        toolData.createdBy = req.user.id;
        
        // Set tenant ID if available
        if (req.user.tenantId && !toolData.tenantId) {
          toolData.tenantId = req.user.tenantId;
        }
      }
      
      const tool = await storage.saveTool(toolData);
      
      // Log activity
      if (req.user) {
        await storage.logActivity({
          userId: req.user.id,
          userType: req.user.userType || 'client',
          actionType: 'create',
          entityType: 'tool',
          entityId: tool.id.toString(),
          details: { toolType: tool.toolType, name: tool.name }
        });
      }
      
      res.status(201).json({
        success: true,
        message: "Tool created successfully",
        data: tool
      });
    } catch (error) {
      handleApiError(res, error, "Failed to create tool");
    }
  });

  // Update a tool
  app.patch("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tool ID"
        });
      }
      
      // Get the current tool to check permissions
      const tenantId = req.user?.tenantId;
      const existingTool = await storage.getTool(id, tenantId);
      
      if (!existingTool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      // Check if the user is the creator of the tool
      if (req.user && existingTool.createdBy && existingTool.createdBy !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this tool"
        });
      }
      
      const updateData = req.body;
      const updatedTool = await storage.updateTool(id, updateData, tenantId);
      
      // Log activity
      if (req.user) {
        await storage.logActivity({
          userId: req.user.id,
          userType: req.user.userType || 'client',
          actionType: 'update',
          entityType: 'tool',
          entityId: id.toString(),
          details: { toolType: existingTool.toolType, name: existingTool.name }
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Tool updated successfully",
        data: updatedTool
      });
    } catch (error) {
      handleApiError(res, error, "Failed to update tool");
    }
  });
  
  // Update tool status
  app.patch("/api/tools/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tool ID"
        });
      }
      
      const { status } = req.body;
      
      if (!status || !['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value. Must be 'draft', 'published', or 'archived'"
        });
      }
      
      // Get the current tool to verify tenant boundaries
      const tenantId = req.user?.tenantId;
      const existingTool = await storage.getTool(id, tenantId);
      
      if (!existingTool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      const updatedTool = await storage.updateToolStatus(id, status, tenantId);
      
      if (!updatedTool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      // Log activity
      if (req.user) {
        await storage.logActivity({
          userId: req.user.id,
          userType: req.user.userType || 'client',
          actionType: 'status_change',
          entityType: 'tool',
          entityId: id.toString(),
          details: { status, name: updatedTool.name }
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Tool status updated successfully",
        data: updatedTool
      });
    } catch (error) {
      handleApiError(res, error, "Failed to update tool status");
    }
  });

  // Delete a tool
  app.delete("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tool ID"
        });
      }
      
      // Get tool first to check permissions
      const tenantId = req.user?.tenantId;
      const tool = await storage.getTool(id, tenantId);
      
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      // Check if the user is the creator of the tool
      if (req.user && tool.createdBy && tool.createdBy !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this tool"
        });
      }
      
      const deleted = await storage.deleteTool(id, tenantId);
      
      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete tool"
        });
      }
      
      // Log activity
      if (req.user) {
        await storage.logActivity({
          userId: req.user.id,
          userType: req.user.userType || 'client',
          actionType: 'delete',
          entityType: 'tool',
          entityId: id.toString(),
          details: { toolType: tool.toolType, name: tool.name }
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Tool deleted successfully"
      });
    } catch (error) {
      handleApiError(res, error, "Failed to delete tool");
    }
  });

  // ============= TOOL-PAGE INTEGRATION API ENDPOINTS =============
  // Add a tool to a page
  app.post("/api/pages/:pageId/tools", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      const { toolId, position } = req.body;
      const tenantId = req.user?.tenantId; // Get tenant ID from authenticated user
      
      if (!toolId) {
        return res.status(400).json({
          success: false,
          message: "Tool ID is required"
        });
      }
      
      // Get the tool details
      const toolIdNumber = parseInt(toolId);
      if (isNaN(toolIdNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tool ID format"
        });
      }
      
      const tool = await storage.getTool(toolIdNumber, tenantId);
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      // Mock the integration process for now
      // In a real implementation, we would store the tool-page relationship
      res.status(200).json({
        success: true,
        message: "Tool added to page successfully",
        data: {
          pageId,
          tool: {
            id: tool.id,
            name: tool.name,
            toolType: tool.toolType,
            position: position || "main"
          }
        }
      });
      
      // Log activity
      if (req.user) {
        await storage.logActivity({
          userId: req.user.id,
          userType: req.user.userType || 'client',
          actionType: 'add_to_page',
          entityType: 'tool',
          entityId: tool.id.toString(),
          details: { pageId, toolName: tool.name, toolType: tool.toolType }
        });
      }
    } catch (error) {
      handleApiError(res, error, "Failed to add tool to page");
    }
  });

  // Remove a tool from a page
  app.delete("/api/pages/:pageId/tools/:toolId", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      const toolId = parseInt(req.params.toolId);
      const tenantId = req.user?.tenantId; // Get tenant ID from authenticated user
      
      if (isNaN(toolId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tool ID format"
        });
      }
      
      // Get the tool details
      const tool = await storage.getTool(toolId, tenantId);
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: "Tool not found"
        });
      }
      
      // Mock the removal process
      // In a real implementation, we would remove the tool-page relationship
      res.status(200).json({
        success: true,
        message: "Tool removed from page successfully",
        data: {
          pageId,
          toolId
        }
      });
      
      // Log activity
      if (req.user) {
        await storage.logActivity({
          userId: req.user.id,
          userType: req.user.userType || 'client',
          actionType: 'remove_from_page',
          entityType: 'tool',
          entityId: toolId.toString(),
          details: { pageId, toolName: tool.name }
        });
      }
    } catch (error) {
      handleApiError(res, error, "Failed to remove tool from page");
    }
  });

  // Register NextMonth marketplace integration routes
  app.use('/api/marketplace', MarketplaceApiRouter);

  // Register AI Gateway routes
  app.use('/api/ai', aiGatewayRouter);

  // Register SmartSite Autopilot routes
  registerAutopilotRoutes(app);
  
  // Register AI Settings routes
  registerAISettingsRoutes(app);
  registerAiUsageRoutes(app);

  // Market Intelligence Panel API endpoints
  app.get("/api/market-intelligence/data", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has premium access (simulate premium check)
      const user = req.user as any;
      const isUpgraded = user.plan === 'pro' || user.marketIntelligenceUnlocked === true;

      if (!isUpgraded) {
        return res.json({
          trends: [],
          postIdeas: [],
          competitors: [],
          isUpgraded: false
        });
      }

      // Get industry trends from conversation data and contact submissions
      const conversations = await storage.getConversations?.() || [];
      const contacts = await storage.getContactSubmissions?.() || [];
      
      // Extract trending topics from conversations and contacts
      const trendTopics = new Map();
      
      // Analyze conversation data for trends
      conversations.forEach((conv: any) => {
        if (conv.messages) {
          conv.messages.forEach((msg: any) => {
            if (msg.content) {
              // Extract key business terms and topics
              const businessTerms = extractBusinessTerms(msg.content);
              businessTerms.forEach(term => {
                trendTopics.set(term, (trendTopics.get(term) || 0) + 1);
              });
            }
          });
        }
      });

      // Analyze contact submission data
      contacts.forEach((contact: any) => {
        if (contact.message) {
          const businessTerms = extractBusinessTerms(contact.message);
          businessTerms.forEach(term => {
            trendTopics.set(term, (trendTopics.get(term) || 0) + 2); // Weight contact inquiries higher
          });
        }
        if (contact.industry) {
          trendTopics.set(contact.industry, (trendTopics.get(contact.industry) || 0) + 3);
        }
      });

      // Convert to trends array
      const trends = Array.from(trendTopics.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic, volume]) => ({
          topic: topic,
          description: generateTrendDescription(topic),
          trend: volume > 10 ? "up" : volume > 5 ? "stable" : "down",
          volume: volume,
          source: "Customer Insights"
        }));

      // Generate content ideas based on trends and customer questions
      const postIdeas = generateContentIdeas(trends, conversations, contacts);

      // Get stored competitors (would be from a competitors table in real implementation)
      const competitors = await getStoredCompetitors(user.id);

      res.json({
        trends,
        postIdeas,
        competitors,
        isUpgraded: true
      });

    } catch (error) {
      console.error("Error fetching market intelligence data:", error);
      res.status(500).json({ error: "Failed to fetch market intelligence data" });
    }
  });

  app.post("/api/market-intelligence/competitors", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const user = req.user as any;
      
      // Validate URL format
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }

      // Extract domain name for competitor name
      const domain = new URL(url).hostname.replace('www.', '');
      const competitorName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

      // Store competitor (in real implementation, save to database)
      const competitor = {
        name: competitorName,
        url: url,
        lastUpdate: new Date().toISOString(),
        changes: [],
        newContent: [],
        userId: user.id
      };

      res.json({ success: true, competitor });

    } catch (error) {
      console.error("Error adding competitor:", error);
      res.status(500).json({ error: "Failed to add competitor" });
    }
  });

  app.post("/api/market-intelligence/report", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { format } = req.body;
      if (!format || !['pdf', 'email'].includes(format)) {
        return res.status(400).json({ error: "Invalid format. Must be 'pdf' or 'email'" });
      }

      const user = req.user as any;

      if (format === 'pdf') {
        // Generate PDF report
        const reportData = await generateMarketReport(user.id);
        res.json({ 
          success: true, 
          format: 'pdf',
          downloadUrl: '/api/market-intelligence/download-report/' + Date.now()
        });
      } else {
        // Send email report
        res.json({ 
          success: true, 
          format: 'email',
          message: 'Report sent to your email address'
        });
      }

    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Helper functions for market intelligence
  function extractBusinessTerms(text: string): string[] {
    const businessKeywords = [
      'accounting', 'bookkeeping', 'tax', 'vat', 'payroll', 'audit', 
      'finance', 'cash flow', 'profit', 'revenue', 'expenses', 'budget',
      'compliance', 'hmrc', 'corporation tax', 'self assessment',
      'business plan', 'startup', 'growth', 'expansion', 'investment',
      'digital transformation', 'automation', 'efficiency', 'productivity'
    ];
    
    const words = text.toLowerCase().split(/\W+/);
    return businessKeywords.filter(keyword => 
      words.some(word => word.includes(keyword) || keyword.includes(word))
    );
  }

  function generateTrendDescription(topic: string): string {
    const descriptions: Record<string, string> = {
      'accounting': 'Businesses seeking professional accounting services and financial guidance',
      'tax': 'Increased interest in tax planning and compliance solutions', 
      'payroll': 'Growing demand for payroll management and employee benefits',
      'cash flow': 'Businesses focusing on cash flow management and financial stability',
      'compliance': 'Rising concerns about regulatory compliance and reporting',
      'digital transformation': 'Companies adopting digital tools and automated processes',
      'startup': 'New business formations and entrepreneurial activity',
      'growth': 'Established businesses planning expansion and scaling operations'
    };
    
    return descriptions[topic] || `Emerging interest in ${topic} related services and solutions`;
  }

  function generateContentIdeas(trends: any[], conversations: any[], contacts: any[]) {
    const ideas = [];
    
    // Generate ideas based on trending topics
    trends.forEach(trend => {
      ideas.push({
        title: `How to Navigate ${trend.topic.charAt(0).toUpperCase() + trend.topic.slice(1)} in 2025`,
        platform: 'LinkedIn',
        snippet: `Essential guidance for businesses dealing with ${trend.topic} challenges...`,
        category: 'Industry Insights'
      });
    });

    // Generate ideas from customer questions
    const commonQuestions = extractCommonQuestions(conversations, contacts);
    commonQuestions.forEach(question => {
      ideas.push({
        title: `Answering Your Questions: ${question}`,
        platform: 'Blog',
        snippet: `Our experts address this common business concern...`,
        category: 'Customer Q&A'
      });
    });

    return ideas.slice(0, 8); // Return top 8 ideas
  }

  function extractCommonQuestions(conversations: any[], contacts: any[]): string[] {
    const questionPatterns = [
      'How do I handle VAT?',
      'What expenses can I claim?',
      'When should I incorporate?',
      'How to improve cash flow?',
      'What records should I keep?'
    ];
    
    return questionPatterns.slice(0, 3); // Return sample questions
  }

  async function getStoredCompetitors(userId: number) {
    // In real implementation, fetch from database
    return [
      {
        name: 'Competitor Example',
        url: 'https://example-competitor.co.uk',
        lastUpdate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        changes: ['Updated pricing page', 'Added new service packages'],
        newContent: ['New blog post about IR35 changes', 'Case study: Manufacturing client']
      }
    ];
  }

  async function generateMarketReport(userId: number) {
    // In real implementation, generate comprehensive PDF report
    return {
      trends: 'Industry analysis...',
      competitors: 'Competitor activity summary...',
      recommendations: 'Strategic recommendations...'
    };
  }

  // Insight App Onboarding API endpoints
  app.get("/api/insight-app/users", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get insight users from storage (would be from insight_users table in real implementation)
      const insightUsers = await getInsightUsers();
      res.json(insightUsers);

    } catch (error) {
      console.error("Error fetching insight users:", error);
      res.status(500).json({ error: "Failed to fetch insight users" });
    }
  });

  app.post("/api/insight-app/invite", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { firstName, lastName, email } = req.body;
      
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Generate unique token for the user
      const token = crypto.randomBytes(32).toString('hex');
      
      // Store insight user
      const insightUser = {
        firstName,
        lastName,
        email,
        token,
        inviteSentAt: new Date().toISOString(),
        insightCount: 0,
        isActive: true
      };

      // In real implementation, save to insight_users table
      await saveInsightUser(insightUser);

      // Send email invite
      await sendInsightAppInvite(insightUser);

      res.json({ 
        success: true, 
        message: "Invite sent successfully",
        email: email
      });

    } catch (error) {
      console.error("Error sending insight app invite:", error);
      res.status(500).json({ error: "Failed to send invite" });
    }
  });

  app.get("/api/insight-app/insights", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get recent insights submitted by team members
      const insights = await getRecentInsights();
      res.json(insights);

    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  // Public endpoint for insight submission (no auth required)
  app.post("/api/insight-app/submit", async (req: Request, res: Response) => {
    try {
      const { token, content, type } = req.body;

      if (!token || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate token and get user
      const user = await getInsightUserByToken(token);
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      // Save insight
      const insight = {
        content,
        type: type || 'general',
        submittedBy: `${user.firstName} ${user.lastName}`,
        submittedAt: new Date().toISOString(),
        userToken: token
      };

      await saveInsight(insight);

      // Update user insight count
      await incrementInsightCount(token);

      res.json({ success: true, message: "Insight submitted successfully" });

    } catch (error) {
      console.error("Error submitting insight:", error);
      res.status(500).json({ error: "Failed to submit insight" });
    }
  });

  // Helper functions for insight app
  async function getInsightUsers() {
    // In real implementation, query insight_users table
    return [
      {
        id: 1,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@company.com",
        token: "sample-token-1",
        inviteSentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        insightCount: 5,
        lastSubmissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 2,
        firstName: "Mike",
        lastName: "Chen",
        email: "mike.chen@company.com",
        token: "sample-token-2",
        inviteSentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        insightCount: 3,
        lastSubmissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ];
  }

  async function saveInsightUser(userData: any) {
    // In real implementation, insert into insight_users table
    console.log('Saving insight user:', userData);
    return userData;
  }

  async function sendInsightAppInvite(user: any) {
    // In real implementation, send email via SendGrid or similar
    const inviteLink = `https://insight.smartsitehub.io/submit?user=${user.token}`;
    
    console.log(`Sending invite email to ${user.email}:`);
    console.log(`Subject: You've been invited to use the Insight App`);
    console.log(`Link: ${inviteLink}`);
    
    // Email would contain:
    // - Personalized greeting
    // - Explanation of Insight App
    // - Direct link with token
    // - Instructions for use
    
    return true;
  }

  async function getRecentInsights() {
    // In real implementation, query insights table
    return [
      {
        id: 1,
        content: "Had a great conversation with a potential client today. They're interested in our tax advisory services and mentioned they've been struggling with VAT compliance.",
        submittedBy: "Sarah Johnson",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: "lead"
      },
      {
        id: 2,
        content: "Client mentioned they're really happy with our bookkeeping service - said it's saved them 10 hours a week. This could be good for testimonials.",
        submittedBy: "Mike Chen",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: "testimonial"
      },
      {
        id: 3,
        content: "Notice that several clients are asking about Making Tax Digital. Might be worth creating some content about this topic.",
        submittedBy: "Sarah Johnson",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: "suggestion"
      }
    ];
  }

  async function getInsightUserByToken(token: string) {
    // In real implementation, query insight_users table by token
    const users = await getInsightUsers();
    return users.find(user => user.token === token);
  }

  async function saveInsight(insight: any) {
    // In real implementation, insert into insights table
    console.log('Saving insight:', insight);
    return insight;
  }

  async function incrementInsightCount(token: string) {
    // In real implementation, update insight_users table
    console.log('Incrementing insight count for token:', token);
    return true;
  }

  // Marketplace API endpoints
  app.post("/api/marketplace/notify", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // In real implementation, save to marketplace_notifications table
      const notification = {
        email,
        userId: req.user.id,
        subscribedAt: new Date().toISOString(),
        active: true
      };

      await saveMarketplaceNotification(notification);

      res.json({ 
        success: true, 
        message: "Successfully subscribed to marketplace notifications"
      });

    } catch (error) {
      console.error("Error saving marketplace notification:", error);
      res.status(500).json({ error: "Failed to save notification preference" });
    }
  });

  // Helper function for marketplace notifications
  async function saveMarketplaceNotification(notification: any) {
    // In real implementation, insert into marketplace_notifications table
    console.log('Saving marketplace notification:', notification);
    return notification;
  }

  // Feed Settings API endpoints for SmartSite Feed Control Panel
  
  // Get feed settings for current tenant
  app.get("/api/feed/settings", async (req: Request, res: Response) => {
    try {
      const tenantId = "00000000-0000-0000-0000-000000000000"; // Default tenant for now
      const settings = await storage.getFeedSettings(tenantId);
      
      if (!settings) {
        return res.status(404).json({ error: "Feed settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching feed settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update feed settings
  app.patch("/api/feed/settings", async (req: Request, res: Response) => {
    try {
      const tenantId = "00000000-0000-0000-0000-000000000000"; // Default tenant for now
      const updateData = insertFeedSettingsSchema.partial().parse(req.body);
      
      const settings = await storage.updateFeedSettings(tenantId, updateData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating feed settings:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Sync branding with feed
  app.post("/api/feed/sync-branding", async (req: Request, res: Response) => {
    try {
      const tenantId = "00000000-0000-0000-0000-000000000000";
      
      // Update branding sync status
      await storage.updateFeedSettings(tenantId, {
        brandingSynced: true,
        brandingLastSync: new Date(),
      });
      
      res.json({
        success: true,
        message: "Branding synchronized successfully with SmartSite Feed"
      });
    } catch (error) {
      console.error("Error syncing branding:", error);
      res.status(500).json({ error: "Failed to sync branding" });
    }
  });

  // Generate setup instructions for custom subdomain
  app.post("/api/feed/setup-instructions", async (req: Request, res: Response) => {
    try {
      const { subdomain } = req.body;
      
      if (!subdomain) {
        return res.status(400).json({ error: "Subdomain is required" });
      }
      
      const instructions = {
        cnameRecord: {
          name: subdomain,
          value: "smartsite-feed.nextmonth.app",
          type: "CNAME"
        },
        iframeEmbed: `<iframe src="https://${subdomain}" width="100%" height="600" frameborder="0"></iframe>`,
        jsSnippet: `<script src="https://${subdomain}/embed.js"></script>`,
        setupSteps: [
          "Add the CNAME record to your DNS provider",
          "Wait for DNS propagation (usually 24-48 hours)",
          "Test the subdomain in your browser",
          "Use the iframe or JavaScript snippet to embed the feed",
          "Configure SSL/TLS if needed"
        ]
      };
      
      res.json(instructions);
    } catch (error) {
      console.error("Error generating setup instructions:", error);
      res.status(500).json({ error: "Failed to generate setup instructions" });
    }
  });

  // Get public feed URL
  app.get("/api/feed/url", async (req: Request, res: Response) => {
    try {
      const tenantId = "00000000-0000-0000-0000-000000000000";
      const settings = await storage.getFeedSettings(tenantId);
      
      if (!settings) {
        return res.json({ url: "", isActive: false });
      }
      
      const url = settings.customSubdomain 
        ? `https://${settings.customSubdomain}`
        : `https://feed.smartsite.app/${tenantId}`;
        
      res.json({
        url,
        isActive: settings.subdomainActive ?? false
      });
    } catch (error) {
      console.error("Error fetching feed URL:", error);
      res.status(500).json({ error: "Failed to fetch feed URL" });
    }
  });

  // Test feed deployment
  app.get("/api/feed/test-deployment", async (req: Request, res: Response) => {
    try {
      const tenantId = "00000000-0000-0000-0000-000000000000";
      const settings = await storage.getFeedSettings(tenantId);
      
      if (!settings) {
        return res.json({
          status: "error",
          message: "Feed settings not configured"
        });
      }
      
      // Check if any modules are enabled
      const hasActiveModules = settings.blogPostsEnabled || 
                              settings.insightsEnabled || 
                              settings.socialFeedEnabled || 
                              settings.eventsEnabled || 
                              settings.feedbackFormEnabled;
      
      if (!hasActiveModules) {
        return res.json({
          status: "warning",
          message: "No modules are currently enabled in the feed"
        });
      }
      
      res.json({
        status: "success",
        message: "Feed deployment is ready and configured",
        url: settings.customSubdomain 
          ? `https://${settings.customSubdomain}`
          : `https://feed.smartsite.app/${tenantId}`
      });
    } catch (error) {
      console.error("Error testing deployment:", error);
      res.status(500).json({ 
        status: "error",
        message: "Failed to test deployment" 
      });
    }
  });

  // Get available topics for autopilot
  app.get("/api/feed/topics", async (req: Request, res: Response) => {
    try {
      // Return predefined topics for autopilot content generation
      const topics = [
        { id: "business-updates", name: "Business Updates", category: "general" },
        { id: "industry-news", name: "Industry News", category: "news" },
        { id: "client-success", name: "Client Success Stories", category: "testimonials" },
        { id: "team-spotlight", name: "Team Spotlight", category: "team" },
        { id: "service-updates", name: "Service Updates", category: "services" },
        { id: "thought-leadership", name: "Thought Leadership", category: "insights" },
        { id: "community-events", name: "Community Events", category: "events" },
        { id: "technology-trends", name: "Technology Trends", category: "tech" }
      ];
      
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  return httpServer;
}
