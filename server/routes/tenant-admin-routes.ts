import { Request, Response, Router } from "express";
import { TenantAdminPanelService } from "../services/tenant-admin-panel";
import { authenticateJwt } from "../middleware/jwt";
import { requireValidTenant, preventCrossTenantAccess } from "../middleware/tenant-scoping";
import { requireSuperAdmin } from "../middleware/rbac";

const router = Router();

/**
 * Tenant-Scoped Admin Panel Routes
 * ALL routes enforce tenantId scoping and prevent cross-tenant data leakage
 * Implements Master Unified Account & Business Architecture compliance
 */

// Apply tenant scoping middleware to all routes
router.use(authenticateJwt);
router.use(requireValidTenant);
router.use(preventCrossTenantAccess);

/**
 * DASHBOARD SUMMARY - Tenant scoped
 */
router.get("/dashboard/summary", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const summary = await TenantAdminPanelService.getTenantDashboardSummary(tenantId);
    
    res.json({
      success: true,
      tenantId,
      summary
    });
  } catch (error) {
    console.error("[Admin Panel] Dashboard summary error:", error);
    res.status(500).json({ 
      error: "Failed to fetch dashboard summary",
      code: "DASHBOARD_ERROR"
    });
  }
});

/**
 * INSIGHT APP USER MANAGEMENT - Tenant scoped
 */
router.post("/insight-users/invite", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { firstName, lastName, email } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: "Missing required fields: firstName, lastName, email",
        code: "MISSING_FIELDS"
      });
    }
    
    if (!email.includes('@')) {
      return res.status(400).json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL"
      });
    }
    
    const insightUser = await TenantAdminPanelService.inviteInsightAppUser(tenantId, {
      firstName,
      lastName,
      email
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "insight_user_invited",
      eventData: { email, insightUserId: insightUser.id },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      insightUser: {
        id: insightUser.id,
        firstName: insightUser.firstName,
        lastName: insightUser.lastName,
        email: insightUser.email,
        inviteSentAt: insightUser.inviteSentAt
      },
      message: "Insight App user invited successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Insight user invite error:", error);
    res.status(500).json({ 
      error: "Failed to invite insight user",
      code: "INVITE_ERROR"
    });
  }
});

router.get("/insight-users", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const insightUsers = await TenantAdminPanelService.getInsightAppUsers(tenantId);
    
    res.json({
      success: true,
      tenantId,
      insightUsers,
      count: insightUsers.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get insight users error:", error);
    res.status(500).json({ 
      error: "Failed to fetch insight users",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * INSIGHTS MANAGEMENT - Tenant scoped
 */
router.post("/insights", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { content, type, submittedBy, insightAppUserId } = req.body;
    
    if (!content || !type || !submittedBy) {
      return res.status(400).json({ 
        error: "Missing required fields: content, type, submittedBy",
        code: "MISSING_FIELDS"
      });
    }
    
    const insight = await TenantAdminPanelService.createInsight(tenantId, {
      content,
      type,
      submittedBy,
      insightAppUserId
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "insight_created",
      eventData: { insightId: insight.id, type },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      insight,
      message: "Insight created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create insight error:", error);
    res.status(500).json({ 
      error: "Failed to create insight",
      code: "CREATE_ERROR"
    });
  }
});

router.get("/insights", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const insights = await TenantAdminPanelService.getInsights(tenantId);
    
    res.json({
      success: true,
      tenantId,
      insights,
      count: insights.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get insights error:", error);
    res.status(500).json({ 
      error: "Failed to fetch insights",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * BLOG POSTS MANAGEMENT - Tenant scoped
 */
router.post("/blog-posts", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { title, content, excerpt, author, tags, category } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ 
        error: "Missing required fields: title, content, author",
        code: "MISSING_FIELDS"
      });
    }
    
    const blogPost = await TenantAdminPanelService.createBlogPost(tenantId, {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      author,
      tags: tags || [],
      category: category || "General"
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "blog_post_created",
      eventData: { postId: blogPost.id, title, category },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      blogPost,
      message: "Blog post created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create blog post error:", error);
    res.status(500).json({ 
      error: "Failed to create blog post",
      code: "CREATE_ERROR"
    });
  }
});

router.get("/blog-posts", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const blogPosts = await TenantAdminPanelService.getBlogPosts(tenantId);
    
    res.json({
      success: true,
      tenantId,
      blogPosts,
      count: blogPosts.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get blog posts error:", error);
    res.status(500).json({ 
      error: "Failed to fetch blog posts",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * THEMES MANAGEMENT - Tenant scoped
 */
router.post("/themes", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { name, primaryColor, secondaryColor, fontFamily, logoUrl, customCss } = req.body;
    
    if (!name || !primaryColor || !secondaryColor || !fontFamily) {
      return res.status(400).json({ 
        error: "Missing required fields: name, primaryColor, secondaryColor, fontFamily",
        code: "MISSING_FIELDS"
      });
    }
    
    const theme = await TenantAdminPanelService.createTheme(tenantId, {
      name,
      primaryColor,
      secondaryColor,
      fontFamily,
      logoUrl,
      customCss
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "theme_created",
      eventData: { themeId: theme.id, name },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      theme,
      message: "Theme created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create theme error:", error);
    res.status(500).json({ 
      error: "Failed to create theme",
      code: "CREATE_ERROR"
    });
  }
});

router.get("/themes", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const themes = await TenantAdminPanelService.getThemes(tenantId);
    
    res.json({
      success: true,
      tenantId,
      themes,
      count: themes.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get themes error:", error);
    res.status(500).json({ 
      error: "Failed to fetch themes",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * INNOVATION IDEAS MANAGEMENT - Tenant scoped
 */
router.post("/innovation-ideas", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { title, description, category, priority, submittedBy, estimatedImpact } = req.body;
    
    if (!title || !description || !category || !submittedBy) {
      return res.status(400).json({ 
        error: "Missing required fields: title, description, category, submittedBy",
        code: "MISSING_FIELDS"
      });
    }
    
    const idea = await TenantAdminPanelService.createInnovationIdea(tenantId, {
      title,
      description,
      category,
      priority: priority || 'medium',
      submittedBy,
      estimatedImpact: estimatedImpact || 'Unknown'
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "innovation_idea_created",
      eventData: { ideaId: idea.id, title, category, priority },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      idea,
      message: "Innovation idea created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create innovation idea error:", error);
    res.status(500).json({ 
      error: "Failed to create innovation idea",
      code: "CREATE_ERROR"
    });
  }
});

router.get("/innovation-ideas", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const ideas = await TenantAdminPanelService.getInnovationIdeas(tenantId);
    
    res.json({
      success: true,
      tenantId,
      ideas,
      count: ideas.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get innovation ideas error:", error);
    res.status(500).json({ 
      error: "Failed to fetch innovation ideas",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * ANALYTICS EVENTS - Tenant scoped
 */
router.get("/analytics-events", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const events = await TenantAdminPanelService.getAnalyticsEvents(tenantId);
    
    res.json({
      success: true,
      tenantId,
      events,
      count: events.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get analytics events error:", error);
    res.status(500).json({ 
      error: "Failed to fetch analytics events",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * AI EVENTS - Tenant scoped
 */
router.get("/ai-events", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const aiEvents = await TenantAdminPanelService.getAIEvents(tenantId);
    
    res.json({
      success: true,
      tenantId,
      aiEvents,
      count: aiEvents.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get AI events error:", error);
    res.status(500).json({ 
      error: "Failed to fetch AI events",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * TOOLS MANAGEMENT - Tenant scoped
 */
router.post("/tools", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { name, description, category, version, configuration, createdBy } = req.body;
    
    if (!name || !description || !category || !version || !createdBy) {
      return res.status(400).json({ 
        error: "Missing required fields: name, description, category, version, createdBy",
        code: "MISSING_FIELDS"
      });
    }
    
    const tool = await TenantAdminPanelService.createTool(tenantId, {
      name,
      description,
      category,
      version,
      configuration: configuration || {},
      createdBy
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "tool_created",
      eventData: { toolId: tool.id, name, category },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.status(201).json({
      success: true,
      tenantId,
      tool,
      message: "Tool created successfully"
    });
  } catch (error) {
    console.error("[Admin Panel] Create tool error:", error);
    res.status(500).json({ 
      error: "Failed to create tool",
      code: "CREATE_ERROR"
    });
  }
});

router.get("/tools", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    
    const tools = await TenantAdminPanelService.getTools(tenantId);
    
    res.json({
      success: true,
      tenantId,
      tools,
      count: tools.length
    });
  } catch (error) {
    console.error("[Admin Panel] Get tools error:", error);
    res.status(500).json({ 
      error: "Failed to fetch tools",
      code: "FETCH_ERROR"
    });
  }
});

/**
 * EMBED CODE GENERATION - Tenant scoped
 */
router.get("/embed-code", async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId!;
    const { baseUrl, features } = req.query;
    
    const embedCode = TenantAdminPanelService.generateEmbedCode(tenantId, {
      baseUrl: baseUrl as string,
      features: features ? (features as string).split(',') : undefined
    });
    
    // Log analytics event
    await TenantAdminPanelService.logAnalyticsEvent(tenantId, {
      eventType: "embed_code_generated",
      eventData: { baseUrl, features },
      source: "admin_panel",
      userId: req.user?.id?.toString()
    });
    
    res.json({
      success: true,
      tenantId,
      embedCode,
      instructions: "Copy and paste this embed code into your website's HTML to enable NextMonth SmartSite features."
    });
  } catch (error) {
    console.error("[Admin Panel] Generate embed code error:", error);
    res.status(500).json({ 
      error: "Failed to generate embed code",
      code: "EMBED_ERROR"
    });
  }
});

/**
 * SUPER ADMIN ROUTES - Cross-tenant access allowed
 */
router.get("/super-admin/all-tenants", requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    // Super admin can see all tenants
    const tenants = await TenantAdminPanelService.getAllTenants();
    
    res.json({
      success: true,
      tenants,
      count: tenants.length
    });
  } catch (error) {
    console.error("[Admin Panel] Super admin get all tenants error:", error);
    res.status(500).json({ 
      error: "Failed to fetch all tenants",
      code: "SUPER_ADMIN_ERROR"
    });
  }
});

export { router as tenantAdminRoutes };