import { db } from "./db";
import { pageToolIntegrations, tools, users } from "@shared/schema";
import type { InsertPageToolIntegration, PageToolIntegration } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { Request, Response } from "express";

/**
 * Get all tool integrations for a specific page
 */
export async function getPageToolIntegrations(pageId: string, tenantId?: string): Promise<PageToolIntegration[]> {
  try {
    let conditions = eq(pageToolIntegrations.pageId, pageId);
    
    // Apply tenant filtering if provided
    if (tenantId) {
      conditions = and(
        conditions, 
        eq(pageToolIntegrations.tenantId, tenantId)
      );
    }
    
    const result = await db
      .select()
      .from(pageToolIntegrations)
      .where(conditions)
      .orderBy({ id: "asc" });
    
    return result;
  } catch (error) {
    console.error(`Error fetching page-tool integrations for page ID ${pageId}:`, error);
    return [];
  }
}

/**
 * Get all page integrations for a specific tool
 */
export async function getToolIntegrations(toolId: number, tenantId?: string): Promise<PageToolIntegration[]> {
  try {
    let conditions = eq(pageToolIntegrations.toolId, toolId);
    
    // Apply tenant filtering if provided
    if (tenantId) {
      conditions = and(
        conditions,
        eq(pageToolIntegrations.tenantId, tenantId)
      );
    }
    
    const result = await db
      .select()
      .from(pageToolIntegrations)
      .where(conditions)
      .orderBy({ id: "asc" });
    
    return result;
  } catch (error) {
    console.error(`Error fetching tool integrations for tool ID ${toolId}:`, error);
    return [];
  }
}

/**
 * Get all integrations for a specific tenant
 */
export async function getTenantIntegrations(tenantId: string): Promise<PageToolIntegration[]> {
  try {
    return await db
      .select()
      .from(pageToolIntegrations)
      .where(eq(pageToolIntegrations.tenantId, tenantId))
      .orderBy({ id: "asc" });
  } catch (error) {
    console.error(`Error fetching integrations for tenant ID ${tenantId}:`, error);
    return [];
  }
}

/**
 * Create a new page-tool integration
 */
export async function savePageToolIntegration(integration: InsertPageToolIntegration): Promise<PageToolIntegration> {
  try {
    const [created] = await db
      .insert(pageToolIntegrations)
      .values(integration)
      .returning();
    return created;
  } catch (error) {
    console.error("Error saving page-tool integration:", error);
    throw error;
  }
}

/**
 * Update an existing page-tool integration
 */
export async function updatePageToolIntegration(
  id: number, 
  data: Partial<InsertPageToolIntegration>
): Promise<PageToolIntegration | undefined> {
  try {
    const [updated] = await db
      .update(pageToolIntegrations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pageToolIntegrations.id, id))
      .returning();
    return updated;
  } catch (error) {
    console.error(`Error updating page-tool integration for ID ${id}:`, error);
    return undefined;
  }
}

/**
 * Delete a page-tool integration
 */
export async function deletePageToolIntegration(id: number): Promise<boolean> {
  try {
    const result = await db
      .delete(pageToolIntegrations)
      .where(eq(pageToolIntegrations.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error(`Error deleting page-tool integration ID ${id}:`, error);
    return false;
  }
}

/**
 * Register page-tool integration API routes
 */
export function registerPageToolIntegrationRoutes(app: any): void {
  // Get all integrations for a page with optional tenant filtering
  app.get("/api/page-integrations/:pageId", async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      // Extract tenant ID from authenticated user if available
      const tenantId = req.user?.tenantId;
      
      const integrations = await getPageToolIntegrations(pageId, tenantId);
      
      // Get associated tool data for each integration
      const detailedIntegrations = await Promise.all(
        integrations.map(async (integration) => {
          const [tool] = await db
            .select()
            .from(tools)
            .where(eq(tools.id, integration.toolId));
            
          return {
            ...integration,
            tool: tool || null
          };
        })
      );
      
      res.status(200).json({
        success: true,
        data: detailedIntegrations
      });
    } catch (error) {
      console.error("Error fetching page integrations:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch page integrations"
      });
    }
  });
  
  // Get all page integrations for a tool with optional tenant filtering
  app.get("/api/tool-integrations/:toolId", async (req: Request, res: Response) => {
    try {
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid tool ID"
        });
      }
      
      // Extract tenant ID from authenticated user if available
      const tenantId = req.user?.tenantId;
      
      const integrations = await getToolIntegrations(toolId, tenantId);
      res.status(200).json({
        success: true,
        data: integrations
      });
    } catch (error) {
      console.error("Error fetching tool integrations:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch tool integrations"
      });
    }
  });
  
  // Get all integrations for the current tenant
  app.get("/api/tenant-integrations", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          error: "Authentication required"
        });
      }
      
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: "User is not associated with a tenant"
        });
      }
      
      const integrations = await getTenantIntegrations(tenantId);
      
      // Get associated tool data for each integration
      const detailedIntegrations = await Promise.all(
        integrations.map(async (integration) => {
          const [tool] = await db
            .select()
            .from(tools)
            .where(eq(tools.id, integration.toolId));
            
          return {
            ...integration,
            tool: tool || null
          };
        })
      );
      
      res.status(200).json({
        success: true,
        data: detailedIntegrations
      });
    } catch (error) {
      console.error("Error fetching tenant integrations:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch tenant integrations"
      });
    }
  });
  
  // Create a new page-tool integration
  app.post("/api/page-tool-integrations", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          error: "Authentication required"
        });
      }
      
      const data: InsertPageToolIntegration = req.body;
      
      // Validate the request data
      if (!data.pageId || !data.toolId) {
        return res.status(400).json({
          success: false,
          error: "Page ID and Tool ID are required"
        });
      }
      
      // Assign the tenant ID from the authenticated user if available
      if (req.user?.tenantId && !data.tenantId) {
        data.tenantId = req.user.tenantId;
      }
      
      // Check if the tool exists and belongs to the user's tenant
      let toolConditions = eq(tools.id, data.toolId);
      
      // Apply tenant filtering if provided
      if (data.tenantId) {
        toolConditions = and(
          toolConditions,
          eq(tools.tenantId, data.tenantId)
        );
      }
      
      const [tool] = await db
        .select()
        .from(tools)
        .where(toolConditions);
      
      if (!tool) {
        return res.status(404).json({
          success: false,
          error: "Tool not found or not accessible in your tenant"
        });
      }
      
      // Create the integration
      const integration = await savePageToolIntegration(data);
      
      res.status(201).json({
        success: true,
        data: integration
      });
    } catch (error) {
      console.error("Error creating page-tool integration:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create page-tool integration"
      });
    }
  });
  
  // Update a page-tool integration
  app.patch("/api/page-tool-integrations/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          error: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid integration ID"
        });
      }
      
      // Get the integration to verify tenant access
      const [integration] = await db
        .select()
        .from(pageToolIntegrations)
        .where(eq(pageToolIntegrations.id, id));
      
      if (!integration) {
        return res.status(404).json({
          success: false,
          error: "Integration not found"
        });
      }
      
      // Verify tenant access if tenant functionality is being used
      if (req.user?.tenantId && integration.tenantId && req.user.tenantId !== integration.tenantId) {
        return res.status(403).json({
          success: false,
          error: "You don't have permission to modify this integration"
        });
      }
      
      const data = req.body;
      const updated = await updatePageToolIntegration(id, data);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "Integration not found or update failed"
        });
      }
      
      res.status(200).json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error("Error updating page-tool integration:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update page-tool integration"
      });
    }
  });
  
  // Delete a page-tool integration
  app.delete("/api/page-tool-integrations/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          error: "Authentication required"
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid integration ID"
        });
      }
      
      // Get the integration to verify tenant access
      const [integration] = await db
        .select()
        .from(pageToolIntegrations)
        .where(eq(pageToolIntegrations.id, id));
      
      if (!integration) {
        return res.status(404).json({
          success: false,
          error: "Integration not found"
        });
      }
      
      // Verify tenant access if tenant functionality is being used
      if (req.user?.tenantId && integration.tenantId && req.user.tenantId !== integration.tenantId) {
        return res.status(403).json({
          success: false,
          error: "You don't have permission to delete this integration"
        });
      }
      
      const success = await deletePageToolIntegration(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: "Integration not found or delete failed"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Integration deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting page-tool integration:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete page-tool integration"
      });
    }
  });
  
  // Get available pages for integration
  app.get("/api/pages", async (req: Request, res: Response) => {
    try {
      // Extract tenant ID from authenticated user if available
      const tenantId = req.user?.tenantId;
      
      // Common pages available to all tenants
      const commonPages = [
        { id: "homepage", name: "Homepage", path: "/" },
        { id: "contact", name: "Contact", path: "/contact" }
      ];
      
      // For Progress Accountants, include additional industry-specific pages
      if (!tenantId || tenantId === "progress-accountants") {
        const progressPages = [
          { id: "about", name: "About Us", path: "/about" },
          { id: "services", name: "Services", path: "/services" },
          { id: "blog", name: "Blog", path: "/blog" },
          { id: "podcast", name: "Podcast & Video", path: "/podcast" },
          { id: "team", name: "Meet the Team", path: "/team" }
        ];
        
        res.status(200).json([...commonPages, ...progressPages]);
      } 
      // For other tenants, use their industry-specific pages or defaults
      else {
        // In the future, we would fetch industry-specific pages from a database
        // For now, return common pages plus generic defaults
        const defaultPages = [
          { id: "about", name: "About Us", path: "/about" },
          { id: "services", name: "Services", path: "/services" }
        ];
        
        res.status(200).json([...commonPages, ...defaultPages]);
      }
    } catch (error) {
      console.error("Error fetching available pages:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch available pages"
      });
    }
  });
}