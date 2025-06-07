import { Request, Response, Router } from "express";
import { BusinessIdentityService } from "../services/business-identity";
import { authenticateJwt } from "../middleware/jwt";
import { requireSuperAdmin } from "../middleware/rbac";
import { hashPassword } from "../auth";

const router = Router();

/**
 * Business Identity Management Routes
 * Implements Master Unified Account & Business Architecture
 */

// Apply JWT authentication to all routes
router.use(authenticateJwt);

/**
 * POST /api/business-identity/create
 * Create new business profile (used by NextMonth Home during registration)
 */
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { businessName, industry, websiteURL, adminEmail, adminUsername, adminPassword, plan } = req.body;

    if (!businessName || !adminEmail || !adminUsername || !adminPassword) {
      return res.status(400).json({ 
        error: "Missing required fields: businessName, adminEmail, adminUsername, adminPassword" 
      });
    }

    // Hash password before storage
    const hashedPassword = await hashPassword(adminPassword);

    const result = await BusinessIdentityService.createBusinessProfile({
      businessName,
      industry,
      websiteURL,
      adminEmail,
      adminUsername,
      adminPassword: hashedPassword,
      plan
    });

    res.status(201).json({
      success: true,
      businessId: result.businessId,
      userId: result.userId,
      message: "Business profile created and written to SOT"
    });

  } catch (error) {
    console.error("Failed to create business profile:", error);
    res.status(500).json({ 
      error: "Failed to create business profile",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/business-identity/profile/:tenantId
 * Get business profile by tenantId
 */
router.get("/profile/:tenantId", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    // Validate tenant access - users can only access their own tenant unless super admin
    if (req.user && !req.user.isSuperAdmin && req.user.tenantId !== tenantId) {
      return res.status(403).json({ error: "Access denied to this tenant" });
    }

    const profile = await BusinessIdentityService.getBusinessProfile(tenantId);
    
    if (!profile) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error("Failed to get business profile:", error);
    res.status(500).json({ 
      error: "Failed to get business profile",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/business-identity/validate/:tenantId
 * Validate that a tenantId exists and is active
 */
router.get("/validate/:tenantId", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    const isValid = await BusinessIdentityService.validateTenant(tenantId);
    
    res.json({
      success: true,
      valid: isValid,
      tenantId
    });

  } catch (error) {
    console.error("Failed to validate tenant:", error);
    res.status(500).json({ 
      error: "Failed to validate tenant",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/business-identity/all-tenants
 * Get all tenants (super admin only)
 */
router.get("/all-tenants", requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenants = await BusinessIdentityService.getAllTenants();
    
    res.json({
      success: true,
      tenants,
      count: tenants.length
    });

  } catch (error) {
    console.error("Failed to get all tenants:", error);
    res.status(500).json({ 
      error: "Failed to get all tenants",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/business-identity/write-analytics
 * Write analytics event to SOT (scoped to tenantId)
 */
router.post("/write-analytics", async (req: Request, res: Response) => {
  try {
    const { eventData } = req.body;
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ error: "TenantId required for all data operations" });
    }

    if (!eventData) {
      return res.status(400).json({ error: "Event data required" });
    }

    await BusinessIdentityService.writeAnalyticsEvent(tenantId, eventData);

    res.json({
      success: true,
      message: "Analytics event written to SOT",
      tenantId
    });

  } catch (error) {
    console.error("Failed to write analytics event:", error);
    res.status(500).json({ 
      error: "Failed to write analytics event",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/business-identity/write-insight
 * Write insight to SOT (scoped to tenantId)
 */
router.post("/write-insight", async (req: Request, res: Response) => {
  try {
    const { insightData } = req.body;
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ error: "TenantId required for all data operations" });
    }

    if (!insightData) {
      return res.status(400).json({ error: "Insight data required" });
    }

    await BusinessIdentityService.writeInsight(tenantId, insightData);

    res.json({
      success: true,
      message: "Insight written to SOT",
      tenantId
    });

  } catch (error) {
    console.error("Failed to write insight:", error);
    res.status(500).json({ 
      error: "Failed to write insight",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/business-identity/write-ai-event
 * Write AI event to SOT (scoped to tenantId)
 */
router.post("/write-ai-event", async (req: Request, res: Response) => {
  try {
    const { eventData } = req.body;
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ error: "TenantId required for all data operations" });
    }

    if (!eventData) {
      return res.status(400).json({ error: "AI event data required" });
    }

    await BusinessIdentityService.writeAIEvent(tenantId, eventData);

    res.json({
      success: true,
      message: "AI event written to SOT",
      tenantId
    });

  } catch (error) {
    console.error("Failed to write AI event:", error);
    res.status(500).json({ 
      error: "Failed to write AI event",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/business-identity/write-innovation-idea
 * Write innovation idea to SOT (scoped to tenantId)
 */
router.post("/write-innovation-idea", async (req: Request, res: Response) => {
  try {
    const { ideaData } = req.body;
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ error: "TenantId required for all data operations" });
    }

    if (!ideaData) {
      return res.status(400).json({ error: "Innovation idea data required" });
    }

    await BusinessIdentityService.writeInnovationIdea(tenantId, ideaData);

    res.json({
      success: true,
      message: "Innovation idea written to SOT",
      tenantId
    });

  } catch (error) {
    console.error("Failed to write innovation idea:", error);
    res.status(500).json({ 
      error: "Failed to write innovation idea",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { router as businessIdentityRoutes };