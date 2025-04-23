import { Request, Response } from "express";
import { db } from "../db";
import { eq, and, desc, sql } from "drizzle-orm";
import { tools, toolInstallations, toolPublishingLogs } from "@shared/schema";
import { z } from "zod";

/**
 * Create a system log entry for tool installation activities
 */
async function logToolActivity(
  toolId: number,
  actor: string,
  action: string,
  metadata: any = {},
  successful: boolean = true,
  errorMessage: string | null = null
) {
  try {
    await db.insert(toolPublishingLogs).values({
      toolId,
      actor,
      action,
      instanceType: "client",
      previousStatus: null,
      newStatus: action === "tool_installed" ? "active" : "uninstalled",
      metadata,
      successful,
      errorMessage
    });
  } catch (error) {
    console.error("Failed to log tool activity:", error);
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
    await logToolActivity(
      parseInt(toolId),
      req.user.username || "unknown",
      "tool_installed",
      { tenantId: req.user.tenantId },
      true
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
    await logToolActivity(
      installation.toolId,
      req.user.username || "unknown",
      "tool_uninstalled",
      { tenantId: req.user.tenantId },
      true
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
 * Clone a tool (particularly for Pro tools)
 * Creates an editable copy of a Pro tool for a tenant
 */
export async function cloneTool(req: Request, res: Response) {
  try {
    const { toolId } = req.params;
    
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate tenant ID is provided
    if (!req.user.tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }

    // Get the source tool
    const [sourceTool] = await db.select().from(tools)
      .where(and(
        eq(tools.id, parseInt(toolId)),
        eq(tools.publishStatus, "published_in_marketplace")
      ));
    
    if (!sourceTool) {
      return res.status(404).json({ error: "Tool not found in marketplace" });
    }

    // Create a cloned version of the tool
    const clonedToolData = {
      tenantId: req.user.tenantId,
      name: `${sourceTool.name} (Clone)`,
      description: sourceTool.description,
      toolType: sourceTool.toolType,
      displayStyle: sourceTool.displayStyle,
      mediaUrl: sourceTool.mediaUrl,
      mediaId: sourceTool.mediaId,
      configuration: sourceTool.configuration,
      createdBy: req.user.id,
      status: "draft",
      publishStatus: "unpublished",
      toolCategory: sourceTool.toolCategory,
      toolVersion: sourceTool.toolVersion ? `${sourceTool.toolVersion}-clone` : "v1.0.0-clone",
      designTier: "blank", // Cloned tools become blank/editable
      isLocked: false, // Cloned tools are never locked
      origin: "cloned",
      clonedFromId: sourceTool.id
    };

    // Insert the cloned tool
    const [clonedTool] = await db.insert(tools)
      .values(clonedToolData)
      .returning();

    // Log the action
    await logToolActivity(
      parseInt(toolId),
      req.user.username || "unknown",
      "tool_cloned",
      { 
        tenantId: req.user.tenantId,
        clonedToolId: clonedTool.id
      },
      true
    );

    res.status(200).json({
      success: true,
      message: "Tool cloned successfully",
      clonedTool
    });
  } catch (error) {
    console.error("Error cloning tool:", error);
    res.status(500).json({ error: "Failed to clone tool" });
  }
}

/**
 * Register tool marketplace routes
 */
export function registerToolMarketplaceRoutes(app: any) {
  // Marketplace browsing endpoints
  app.get("/api/tools/marketplace", getMarketplaceTools);
  app.get("/api/tools/marketplace/:toolId", getMarketplaceTool);
  
  // Client instance endpoints
  app.post("/api/tools/marketplace/install/:toolId", installMarketplaceTool);
  app.get("/api/tools/installed", getInstalledTools);
  app.post("/api/tools/uninstall/:installationId", uninstallTool);
  app.post("/api/tools/marketplace/clone/:toolId", cloneTool);
  
  // Logs (for admins)
  app.get("/api/tools/logs/:toolId", getToolPublishingLogs);
}