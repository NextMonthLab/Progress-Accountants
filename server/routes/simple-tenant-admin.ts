import { Request, Response, Router } from "express";
import { TenantAdminService } from "../services/tenant-admin-service";
import { BusinessIdentityService } from "../services/business-identity";

const router = Router();

/**
 * Simplified Multi-Tenant Admin Panel Routes
 * All operations properly scoped to tenantId with SOT integration
 */

// Extract tenantId from authenticated requests
function getTenantId(req: Request): string | null {
  // For demo purposes, using default tenant
  // In production, extract from JWT: req.user?.tenantId
  return "00000000-0000-0000-0000-000000000000";
}

// Validate tenantId middleware
function validateTenant(req: Request, res: Response, next: Function) {
  const tenantId = getTenantId(req);
  if (!tenantId) {
    return res.status(400).json({ error: "TenantId required for admin operations" });
  }
  req.tenantId = tenantId;
  next();
}

// Apply tenant validation to all routes
router.use(validateTenant);

/**
 * Dashboard Summary
 */
router.get("/dashboard/summary", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const summary = await TenantAdminService.getTenantDashboardSummary(tenantId);
    res.json(summary);
  } catch (error) {
    console.error("[Admin Panel] Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

/**
 * Insight Users Management
 */
router.post("/insight-users/invite", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { firstName, lastName, email } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const insightUser = await TenantAdminService.inviteInsightUser(tenantId, {
      firstName, lastName, email
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      insightUser,
      message: "Insight user invited successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Invite insight user error:", error);
    res.status(500).json({ error: "Failed to invite insight user" });
  }
});

router.get("/insight-users", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const insightUsers = await TenantAdminService.getInsightUsers(tenantId);
    res.json({ success: true, tenantId, insightUsers, count: insightUsers.length });
  } catch (error) {
    console.error("[Admin Panel] Get insight users error:", error);
    res.status(500).json({ error: "Failed to fetch insight users" });
  }
});

/**
 * Insights Management
 */
router.post("/insights", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { content, type, submittedBy, insightAppUserId } = req.body;
    
    if (!content || !type || !submittedBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const insight = await TenantAdminService.createInsight(tenantId, {
      content, type, submittedBy, insightAppUserId
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      insight,
      message: "Insight created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create insight error:", error);
    res.status(500).json({ error: "Failed to create insight" });
  }
});

router.get("/insights", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const insights = await TenantAdminService.getInsights(tenantId);
    res.json({ success: true, tenantId, insights, count: insights.length });
  } catch (error) {
    console.error("[Admin Panel] Get insights error:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

/**
 * Blog Posts Management
 */
router.post("/blog-posts", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { title, content, excerpt, author, tags, category } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const blogPost = await TenantAdminService.createBlogPost(tenantId, {
      title, content, excerpt: excerpt || content.substring(0, 200), 
      author, tags: tags || [], category: category || "General"
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      blogPost,
      message: "Blog post created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create blog post error:", error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

router.get("/blog-posts", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const blogPosts = await TenantAdminService.getBlogPosts(tenantId);
    res.json({ success: true, tenantId, blogPosts, count: blogPosts.length });
  } catch (error) {
    console.error("[Admin Panel] Get blog posts error:", error);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

/**
 * Themes Management
 */
router.post("/themes", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { name, primaryColor, secondaryColor, fontFamily, logoUrl, customCss } = req.body;
    
    if (!name || !primaryColor || !secondaryColor || !fontFamily) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const theme = await TenantAdminService.createTheme(tenantId, {
      name, primaryColor, secondaryColor, fontFamily, logoUrl, customCss
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      theme,
      message: "Theme created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create theme error:", error);
    res.status(500).json({ error: "Failed to create theme" });
  }
});

router.get("/themes", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const themes = await TenantAdminService.getThemes(tenantId);
    res.json({ success: true, tenantId, themes, count: themes.length });
  } catch (error) {
    console.error("[Admin Panel] Get themes error:", error);
    res.status(500).json({ error: "Failed to fetch themes" });
  }
});

/**
 * Innovation Ideas Management
 */
router.post("/innovation-ideas", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { title, description, category, priority, submittedBy, estimatedImpact } = req.body;
    
    if (!title || !description || !category || !submittedBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const idea = await TenantAdminService.createInnovationIdea(tenantId, {
      title, description, category, priority: priority || 'medium', 
      submittedBy, estimatedImpact: estimatedImpact || 'Unknown'
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      idea,
      message: "Innovation idea created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create innovation idea error:", error);
    res.status(500).json({ error: "Failed to create innovation idea" });
  }
});

router.get("/innovation-ideas", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const ideas = await TenantAdminService.getInnovationIdeas(tenantId);
    res.json({ success: true, tenantId, ideas, count: ideas.length });
  } catch (error) {
    console.error("[Admin Panel] Get innovation ideas error:", error);
    res.status(500).json({ error: "Failed to fetch innovation ideas" });
  }
});

/**
 * Analytics Events
 */
router.get("/analytics-events", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const events = await TenantAdminService.getAnalyticsEvents(tenantId);
    res.json({ success: true, tenantId, events, count: events.length });
  } catch (error) {
    console.error("[Admin Panel] Get analytics events error:", error);
    res.status(500).json({ error: "Failed to fetch analytics events" });
  }
});

/**
 * AI Events
 */
router.get("/ai-events", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const aiEvents = await TenantAdminService.getAIEvents(tenantId);
    res.json({ success: true, tenantId, aiEvents, count: aiEvents.length });
  } catch (error) {
    console.error("[Admin Panel] Get AI events error:", error);
    res.status(500).json({ error: "Failed to fetch AI events" });
  }
});

/**
 * Tools Management
 */
router.post("/tools", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { name, description, category, version, createdBy } = req.body;
    
    if (!name || !description || !category || !version || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const tool = await TenantAdminService.createTool(tenantId, {
      name, description, category, version, configuration: {}, createdBy
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      tool,
      message: "Tool created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create tool error:", error);
    res.status(500).json({ error: "Failed to create tool" });
  }
});

router.get("/tools", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const tools = await TenantAdminService.getTools(tenantId);
    res.json({ success: true, tenantId, tools, count: tools.length });
  } catch (error) {
    console.error("[Admin Panel] Get tools error:", error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

/**
 * Embed Code Generation
 */
router.get("/embed-code", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { baseUrl, features } = req.query;
    
    const embedCode = TenantAdminService.generateEmbedCode(tenantId, {
      baseUrl: baseUrl as string,
      features: features ? (features as string).split(',') : undefined
    });
    
    // Log analytics event
    await TenantAdminService.logAnalyticsEvent(tenantId, {
      eventType: "embed_code_generated",
      eventData: { baseUrl, features },
      source: "admin_panel"
    });
    
    res.json({
      success: true,
      tenantId,
      embedCode,
      instructions: "Copy and paste this embed code into your website's HTML to enable NextMonth SmartSite features."
    });
  } catch (error) {
    console.error("[Admin Panel] Generate embed code error:", error);
    res.status(500).json({ error: "Failed to generate embed code" });
  }
});

export { router as simpleTenantAdminRoutes };