import { db } from "./db";
import { pageToolIntegrations, tools, users } from "@shared/schema";
import type { InsertPageToolIntegration, PageToolIntegration } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { Request, Response } from "express";

/**
 * Get all tool integrations for a specific page
 */
export async function getPageToolIntegrations(pageId: string): Promise<PageToolIntegration[]> {
  try {
    return await db
      .select()
      .from(pageToolIntegrations)
      .where(eq(pageToolIntegrations.pageId, pageId))
      .orderBy({ id: "asc" });
  } catch (error) {
    console.error(`Error fetching page-tool integrations for page ID ${pageId}:`, error);
    return [];
  }
}

/**
 * Get all page integrations for a specific tool
 */
export async function getToolIntegrations(toolId: number): Promise<PageToolIntegration[]> {
  try {
    return await db
      .select()
      .from(pageToolIntegrations)
      .where(eq(pageToolIntegrations.toolId, toolId))
      .orderBy({ id: "asc" });
  } catch (error) {
    console.error(`Error fetching tool integrations for tool ID ${toolId}:`, error);
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
  // Get all integrations for a page
  app.get("/api/page-integrations/:pageId", async (req: Request, res: Response) => {
    try {
      const { pageId } = req.params;
      const integrations = await getPageToolIntegrations(pageId);
      
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
  
  // Get all page integrations for a tool
  app.get("/api/tool-integrations/:toolId", async (req: Request, res: Response) => {
    try {
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid tool ID"
        });
      }
      
      const integrations = await getToolIntegrations(toolId);
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
      
      // Check if the tool exists
      const [tool] = await db
        .select()
        .from(tools)
        .where(eq(tools.id, data.toolId));
        
      if (!tool) {
        return res.status(404).json({
          success: false,
          error: "Tool not found"
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
      // In a real implementation, this would fetch from a pages table
      // For now, we'll return a hardcoded list of sample pages
      res.status(200).json([
        { id: "homepage", name: "Homepage", path: "/" },
        { id: "about", name: "About Us", path: "/about" },
        { id: "services", name: "Services", path: "/services" },
        { id: "contact", name: "Contact", path: "/contact" },
        { id: "blog", name: "Blog", path: "/blog" }
      ]);
    } catch (error) {
      console.error("Error fetching available pages:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch available pages"
      });
    }
  });
}