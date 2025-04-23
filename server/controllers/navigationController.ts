import { Request, Response } from "express";
import { db, pool } from "../db";
import { MenuItem } from "@shared/navigation_menu";

/**
 * Get menu items for a specific location
 */
export async function getMenuItems(req: Request, res: Response) {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location parameter is required"
      });
    }
    
    // Get the default tenant ID for Progress Accountants
    const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    const tenantId = req.user?.tenantId || DEFAULT_TENANT_ID;
    
    const result = await pool.query(
      `SELECT * FROM menu_items 
       WHERE location = $1 AND tenant_id = $2
       ORDER BY "order" ASC`,
      [location, tenantId]
    );
    
    return res.status(200).json({
      success: true,
      items: result.rows
    });
  } catch (error) {
    console.error("Error getting menu items:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get menu items",
      error: (error as Error).message
    });
  }
}

/**
 * Create a new menu item
 */
export async function createMenuItem(req: Request, res: Response) {
  try {
    const { label, url, parentId, location, icon, isExternal, order } = req.body;
    
    // Validation
    if (!label || !url || !location) {
      return res.status(400).json({
        success: false,
        message: "Label, URL, and location are required"
      });
    }
    
    // Get the default tenant ID for Progress Accountants
    const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    const tenantId = req.user?.tenantId || DEFAULT_TENANT_ID;
    
    const result = await pool.query(
      `INSERT INTO menu_items 
       (label, url, parent_id, location, icon, is_external, "order", tenant_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [label, url, parentId, location, icon, isExternal, order || 0, tenantId]
    );
    
    return res.status(201).json({
      success: true,
      item: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create menu item",
      error: (error as Error).message
    });
  }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { label, url, parentId, icon, isExternal } = req.body;
    
    // Validation
    if (!label || !url) {
      return res.status(400).json({
        success: false,
        message: "Label and URL are required"
      });
    }
    
    // Get the default tenant ID for Progress Accountants
    const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    const tenantId = req.user?.tenantId || DEFAULT_TENANT_ID;
    
    // Make sure the item belongs to the tenant
    const checkResult = await pool.query(
      "SELECT * FROM menu_items WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }
    
    const result = await pool.query(
      `UPDATE menu_items 
       SET label = $1, url = $2, parent_id = $3, icon = $4, is_external = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND tenant_id = $7
       RETURNING *`,
      [label, url, parentId, icon, isExternal, id, tenantId]
    );
    
    return res.status(200).json({
      success: true,
      item: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update menu item",
      error: (error as Error).message
    });
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Get the default tenant ID for Progress Accountants
    const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    const tenantId = req.user?.tenantId || DEFAULT_TENANT_ID;
    
    // Make sure the item belongs to the tenant
    const checkResult = await pool.query(
      "SELECT * FROM menu_items WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }
    
    await pool.query(
      "DELETE FROM menu_items WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );
    
    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
      error: (error as Error).message
    });
  }
}

/**
 * Reorder menu items
 */
export async function reorderMenuItems(req: Request, res: Response) {
  try {
    const { items } = req.body;
    const { location } = req.query;
    
    if (!items || !Array.isArray(items) || !location) {
      return res.status(400).json({
        success: false,
        message: "Items array and location are required"
      });
    }
    
    // Get the default tenant ID for Progress Accountants
    const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    const tenantId = req.user?.tenantId || DEFAULT_TENANT_ID;
    
    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update each item's order
      for (const item of items) {
        await client.query(
          `UPDATE menu_items 
           SET "order" = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2 AND tenant_id = $3 AND location = $4`,
          [item.order, item.id, tenantId, location]
        );
      }
      
      await client.query('COMMIT');
      
      return res.status(200).json({
        success: true,
        message: "Menu items reordered successfully"
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error reordering menu items:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reorder menu items",
      error: (error as Error).message
    });
  }
}

/**
 * Register all navigation routes
 */
export function registerNavigationRoutes(app: any) {
  app.get('/api/navigation/items', getMenuItems);
  app.post('/api/navigation/items', createMenuItem);
  app.put('/api/navigation/items/:id', updateMenuItem);
  app.delete('/api/navigation/items/:id', deleteMenuItem);
  app.put('/api/navigation/reorder', reorderMenuItems);
  
  console.log('[Navigation] Routes registered');
}