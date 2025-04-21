import { Request, Response } from "express";
import { db } from "../db";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { tools, toolInstallations, toolPublishingLogs, type Tool, type InsertTool, insertToolSchema } from "@shared/schema";
import { z } from "zod";

/**
 * Create a system log entry for tool publishing workflow
 */
async function logToolPublishingAction(
  toolId: number,
  actor: string,
  action: string,
  instanceType: "lab" | "dev" | "client",
  previousStatus: string | null,
  newStatus: string,
  toolVersion: string | null = null,
  metadata: any = {},
  successful: boolean = true,
  errorMessage: string | null = null
) {
  try {
    await db.insert(toolPublishingLogs).values({
      toolId,
      actor,
      action,
      instanceType,
      previousStatus,
      newStatus,
      toolVersion,
      metadata,
      successful,
      errorMessage
    });
  } catch (error) {
    console.error("Failed to log tool publishing action:", error);
  }
}

/**
 * Submit a tool to the marketplace (Lab → Dev)
 */
export async function submitToolToMarketplace(req: Request, res: Response) {
  try {
    // Validate request
    const submitSchema = z.object({
      toolId: z.number(),
      toolVersion: z.string().regex(/^v\d+\.\d+\.\d+$/, { 
        message: "Tool version must be in semantic format (e.g., v1.0.0)" 
      }),
      toolCategory: z.string().min(1)
    });

    const { toolId, toolVersion, toolCategory } = submitSchema.parse(req.body);

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the tool
    const [tool] = await db.select().from(tools).where(eq(tools.id, toolId));
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Update the tool with marketplace submission data
    const updatedTool = await db.update(tools)
      .set({
        publishStatus: "draft_for_marketplace",
        toolVersion,
        toolCategory,
        sourceInstance: "lab",
        updatedAt: new Date()
      })
      .where(eq(tools.id, toolId))
      .returning();

    // Log the action
    await logToolPublishingAction(
      toolId,
      req.user.username,
      "draft_submitted",
      "lab",
      tool.publishStatus,
      "draft_for_marketplace",
      toolVersion,
      { category: toolCategory }
    );

    // Notify Dev and Guardian (would typically send a notification or webhook)
    // This is a placeholder for the actual notification mechanism
    
    res.status(200).json({
      success: true,
      message: "Tool submitted to marketplace",
      tool: updatedTool[0]
    });
  } catch (error) {
    console.error("Error submitting tool to marketplace:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Failed to submit tool to marketplace" });
  }
}

/**
 * Publish a tool to the marketplace (Dev only)
 */
export async function publishToolToMarketplace(req: Request, res: Response) {
  try {
    const { toolId } = req.params;
    
    // Check if user is authenticated and authorized (Dev instance)
    if (!req.user || !req.user.isSuperAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the tool
    const [tool] = await db.select().from(tools).where(eq(tools.id, parseInt(toolId)));
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Verify tool is in the right state
    if (tool.publishStatus !== "draft_for_marketplace") {
      return res.status(400).json({ 
        error: "Tool must be in 'draft_for_marketplace' status to be published" 
      });
    }

    // Update the tool to published status
    const updatedTool = await db.update(tools)
      .set({
        publishStatus: "published_in_marketplace",
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(tools.id, parseInt(toolId)))
      .returning();

    // Log the action
    await logToolPublishingAction(
      parseInt(toolId),
      req.user.username,
      "marketplace_published",
      "dev",
      tool.publishStatus,
      "published_in_marketplace",
      tool.toolVersion
    );

    // Sync to Vault (WordPress) would go here
    // This is a placeholder for the actual sync mechanism
    
    // Notify client instances of new tool availability
    // This is a placeholder for the actual notification mechanism

    res.status(200).json({
      success: true,
      message: "Tool published to marketplace",
      tool: updatedTool[0]
    });
  } catch (error) {
    console.error("Error publishing tool to marketplace:", error);
    res.status(500).json({ error: "Failed to publish tool to marketplace" });
  }
}

/**
 * Get all tools in the marketplace
 */
export async function getMarketplaceTools(req: Request, res: Response) {
  try {
    // Only return tools that are published in the marketplace
    const marketplaceTools = await db.select().from(tools)
      .where(eq(tools.publishStatus, "published_in_marketplace"))
      .orderBy(desc(tools.publishedAt));
    
    res.status(200).json(marketplaceTools);
  } catch (error) {
    console.error("Error getting marketplace tools:", error);
    res.status(500).json({ error: "Failed to get marketplace tools" });
  }
}

/**
 * Get a specific tool from the marketplace
 */
export async function getMarketplaceTool(req: Request, res: Response) {
  try {
    const { toolId } = req.params;
    
    const [tool] = await db.select().from(tools)
      .where(and(
        eq(tools.id, parseInt(toolId)),
        eq(tools.publishStatus, "published_in_marketplace")
      ));
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found in marketplace" });
    }
    
    res.status(200).json(tool);
  } catch (error) {
    console.error("Error getting marketplace tool:", error);
    res.status(500).json({ error: "Failed to get marketplace tool" });
  }
}

/**
 * Install a tool from the marketplace for a tenant
 */
export async function installMarketplaceTool(req: Request, res: Response) {
  try {
    const { toolId } = req.params;
    
    // Check authentication and authorization
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate tenant ID is provided
    if (!req.user.tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }

    // Get the tool from marketplace
    const [tool] = await db.select().from(tools)
      .where(and(
        eq(tools.id, parseInt(toolId)),
        eq(tools.publishStatus, "published_in_marketplace")
      ));
    
    if (!tool) {
      return res.status(404).json({ error: "Tool not found in marketplace" });
    }

    // Check if already installed
    const [existingInstallation] = await db.select().from(toolInstallations)
      .where(and(
        eq(toolInstallations.toolId, parseInt(toolId)),
        eq(toolInstallations.tenantId, req.user.tenantId),
        eq(toolInstallations.installationStatus, "active")
      ));

    if (existingInstallation) {
      return res.status(400).json({ error: "Tool is already installed for this tenant" });
    }

    // Create the installation record
    const [installation] = await db.insert(toolInstallations)
      .values({
        toolId: parseInt(toolId),
        tenantId: req.user.tenantId,
        installedBy: req.user.id,
        version: tool.toolVersion || "v1.0.0",
        customSettings: {}
      })
      .returning();

    // Increment installation count on the tool
    await db.update(tools)
      .set({
        installationCount: sql`${tools.installationCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(tools.id, parseInt(toolId)));

    // Log the action
    await logToolPublishingAction(
      parseInt(toolId),
      req.user.username,
      "tool_installed",
      "client",
      null,
      "active",
      tool.toolVersion,
      { tenantId: req.user.tenantId }
    );

    res.status(200).json({
      success: true,
      message: "Tool installed successfully",
      installation
    });
  } catch (error) {
    console.error("Error installing marketplace tool:", error);
    res.status(500).json({ error: "Failed to install marketplace tool" });
  }
}

/**
 * Get all tools installed for a tenant
 */
export async function getInstalledTools(req: Request, res: Response) {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate tenant ID is provided
    if (!req.user.tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }

    // Get all active installations for the tenant
    const installations = await db
      .select({
        installation: toolInstallations,
        tool: tools
      })
      .from(toolInstallations)
      .innerJoin(tools, eq(toolInstallations.toolId, tools.id))
      .where(and(
        eq(toolInstallations.tenantId, req.user.tenantId),
        eq(toolInstallations.installationStatus, "active")
      ))
      .orderBy(desc(toolInstallations.installationDate));
    
    res.status(200).json(installations);
  } catch (error) {
    console.error("Error getting installed tools:", error);
    res.status(500).json({ error: "Failed to get installed tools" });
  }
}

/**
 * Uninstall a tool for a tenant
 */
export async function uninstallTool(req: Request, res: Response) {
  try {
    const { installationId } = req.params;
    
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the installation
    const [installation] = await db.select().from(toolInstallations)
      .where(eq(toolInstallations.id, parseInt(installationId)));
    
    if (!installation) {
      return res.status(404).json({ error: "Installation not found" });
    }

    // Ensure the installation belongs to the user's tenant
    if (installation.tenantId !== req.user.tenantId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Update the installation status
    const [updatedInstallation] = await db.update(toolInstallations)
      .set({
        installationStatus: "uninstalled",
        updatedAt: new Date()
      })
      .where(eq(toolInstallations.id, parseInt(installationId)))
      .returning();

    // Log the action
    await logToolPublishingAction(
      installation.toolId,
      req.user.username,
      "tool_uninstalled",
      "client",
      "active",
      "uninstalled",
      installation.version,
      { tenantId: req.user.tenantId }
    );

    res.status(200).json({
      success: true,
      message: "Tool uninstalled successfully",
      installation: updatedInstallation
    });
  } catch (error) {
    console.error("Error uninstalling tool:", error);
    res.status(500).json({ error: "Failed to uninstall tool" });
  }
}

/**
 * Get publishing logs for a tool
 */
export async function getToolPublishingLogs(req: Request, res: Response) {
  try {
    const { toolId } = req.params;
    
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the logs
    const logs = await db.select().from(toolPublishingLogs)
      .where(eq(toolPublishingLogs.toolId, parseInt(toolId)))
      .orderBy(desc(toolPublishingLogs.timestamp));
    
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error getting tool publishing logs:", error);
    res.status(500).json({ error: "Failed to get tool publishing logs" });
  }
}

/**
 * Register tool marketplace routes
 */
export function registerToolMarketplaceRoutes(app: any) {
  // Lab instance endpoints
  app.post("/api/tools/marketplace/submit", submitToolToMarketplace);
  
  // Dev instance endpoints
  app.post("/api/tools/marketplace/publish/:toolId", publishToolToMarketplace);
  
  // General marketplace endpoints (all instances)
  app.get("/api/tools/marketplace", getMarketplaceTools);
  app.get("/api/tools/marketplace/:toolId", getMarketplaceTool);
  
  // Client instance endpoints
  app.post("/api/tools/marketplace/install/:toolId", installMarketplaceTool);
  app.get("/api/tools/installed", getInstalledTools);
  app.post("/api/tools/uninstall/:installationId", uninstallTool);
  
  // Logs (for admins)
  app.get("/api/tools/logs/:toolId", getToolPublishingLogs);
}