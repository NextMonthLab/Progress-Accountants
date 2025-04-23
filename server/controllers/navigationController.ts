import { Request, Response } from 'express';
import { sql, eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../db';
import { navigationMenus, menuItems, type NavigationMenu, type MenuItem, insertNavigationMenuSchema, insertMenuItemSchema } from '@shared/navigation_menu';

/**
 * Get all navigation menus for a tenant
 */
export async function getNavigationMenus(req: Request, res: Response) {
  try {
    const tenantId = req.query.tenantId as string;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }
    
    const menus = await db.select().from(navigationMenus)
      .where(eq(navigationMenus.tenantId, tenantId))
      .orderBy(navigationMenus.name);
    
    return res.status(200).json({ 
      message: 'Navigation menus retrieved successfully',
      data: menus 
    });
  } catch (error) {
    console.error('Error retrieving navigation menus:', error);
    return res.status(500).json({ message: 'Error retrieving navigation menus' });
  }
}

/**
 * Get a specific navigation menu by ID
 */
export async function getNavigationMenuById(req: Request, res: Response) {
  try {
    const menuId = parseInt(req.params.id);
    
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Valid menu ID is required' });
    }
    
    const [menu] = await db.select().from(navigationMenus)
      .where(eq(navigationMenus.id, menuId));
    
    if (!menu) {
      return res.status(404).json({ message: 'Navigation menu not found' });
    }
    
    return res.status(200).json({ 
      message: 'Navigation menu retrieved successfully',
      data: menu 
    });
  } catch (error) {
    console.error('Error retrieving navigation menu:', error);
    return res.status(500).json({ message: 'Error retrieving navigation menu' });
  }
}

/**
 * Get menu items for a specific menu
 */
export async function getMenuItems(req: Request, res: Response) {
  try {
    const menuId = parseInt(req.params.menuId);
    
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Valid menu ID is required' });
    }
    
    const items = await db.select().from(menuItems)
      .where(eq(menuItems.menuId, menuId))
      .orderBy(menuItems.order);
    
    return res.status(200).json({ 
      message: 'Menu items retrieved successfully',
      data: items 
    });
  } catch (error) {
    console.error('Error retrieving menu items:', error);
    return res.status(500).json({ message: 'Error retrieving menu items' });
  }
}

/**
 * Get menu items hierarchically for a specific menu
 */
export async function getMenuItemsHierarchy(req: Request, res: Response) {
  try {
    const menuId = parseInt(req.params.menuId);
    
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Valid menu ID is required' });
    }
    
    // First get all menu items for this menu
    const allItems = await db.select().from(menuItems)
      .where(eq(menuItems.menuId, menuId))
      .orderBy(menuItems.order);
    
    // Build the hierarchy
    const rootItems = allItems.filter(item => !item.parentId);
    const itemMap = new Map<number, MenuItem>();
    
    // Create a map for quick lookup
    allItems.forEach(item => {
      itemMap.set(item.id, item);
    });
    
    // Build the tree
    function buildTree(items: MenuItem[]) {
      return items.map(item => {
        const children = allItems.filter(childItem => childItem.parentId === item.id)
          .sort((a, b) => a.order - b.order);
        
        return {
          ...item,
          children: buildTree(children)
        };
      });
    }
    
    const hierarchicalItems = buildTree(rootItems);
    
    return res.status(200).json({ 
      message: 'Menu items retrieved successfully',
      data: hierarchicalItems 
    });
  } catch (error) {
    console.error('Error retrieving menu items hierarchy:', error);
    return res.status(500).json({ message: 'Error retrieving menu items hierarchy' });
  }
}

/**
 * Create a new navigation menu
 */
export async function createNavigationMenu(req: Request, res: Response) {
  try {
    // Validate request body
    const parseResult = insertNavigationMenuSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: 'Invalid navigation menu data',
        errors: parseResult.error.errors 
      });
    }
    
    // Check if menu with same slug already exists for this tenant
    const existingMenu = await db.select({ id: navigationMenus.id })
      .from(navigationMenus)
      .where(and(
        eq(navigationMenus.slug, parseResult.data.slug),
        eq(navigationMenus.tenantId, parseResult.data.tenantId)
      ))
      .limit(1);
    
    if (existingMenu.length > 0) {
      return res.status(400).json({ message: 'Menu with this slug already exists' });
    }
    
    // Create the menu
    const [newMenu] = await db.insert(navigationMenus)
      .values(parseResult.data)
      .returning();
    
    return res.status(201).json({ 
      message: 'Navigation menu created successfully',
      data: newMenu 
    });
  } catch (error) {
    console.error('Error creating navigation menu:', error);
    return res.status(500).json({ message: 'Error creating navigation menu' });
  }
}

/**
 * Update an existing navigation menu
 */
export async function updateNavigationMenu(req: Request, res: Response) {
  try {
    const menuId = parseInt(req.params.id);
    
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Valid menu ID is required' });
    }
    
    // Validate request body
    const parseResult = insertNavigationMenuSchema.partial().safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: 'Invalid navigation menu data',
        errors: parseResult.error.errors 
      });
    }
    
    // Check if menu exists
    const [existingMenu] = await db.select().from(navigationMenus)
      .where(eq(navigationMenus.id, menuId));
    
    if (!existingMenu) {
      return res.status(404).json({ message: 'Navigation menu not found' });
    }
    
    // Check if slug is being changed and if it conflicts with another menu
    if (parseResult.data.slug && parseResult.data.slug !== existingMenu.slug) {
      const conflictMenu = await db.select({ id: navigationMenus.id })
        .from(navigationMenus)
        .where(and(
          eq(navigationMenus.slug, parseResult.data.slug),
          eq(navigationMenus.tenantId, existingMenu.tenantId),
          sql`${navigationMenus.id} != ${menuId}`
        ))
        .limit(1);
      
      if (conflictMenu.length > 0) {
        return res.status(400).json({ message: 'Menu with this slug already exists' });
      }
    }
    
    // Update the menu
    const [updatedMenu] = await db.update(navigationMenus)
      .set({
        ...parseResult.data,
        updatedAt: new Date()
      })
      .where(eq(navigationMenus.id, menuId))
      .returning();
    
    return res.status(200).json({ 
      message: 'Navigation menu updated successfully',
      data: updatedMenu 
    });
  } catch (error) {
    console.error('Error updating navigation menu:', error);
    return res.status(500).json({ message: 'Error updating navigation menu' });
  }
}

/**
 * Delete a navigation menu
 */
export async function deleteNavigationMenu(req: Request, res: Response) {
  try {
    const menuId = parseInt(req.params.id);
    
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Valid menu ID is required' });
    }
    
    // Check if menu exists
    const [existingMenu] = await db.select().from(navigationMenus)
      .where(eq(navigationMenus.id, menuId));
    
    if (!existingMenu) {
      return res.status(404).json({ message: 'Navigation menu not found' });
    }
    
    // Delete the menu (will cascade delete menu items due to FK constraint)
    await db.delete(navigationMenus)
      .where(eq(navigationMenus.id, menuId));
    
    return res.status(200).json({ 
      message: 'Navigation menu deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting navigation menu:', error);
    return res.status(500).json({ message: 'Error deleting navigation menu' });
  }
}

/**
 * Create a new menu item
 */
export async function createMenuItem(req: Request, res: Response) {
  try {
    // Validate request body
    const parseResult = insertMenuItemSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: 'Invalid menu item data',
        errors: parseResult.error.errors 
      });
    }
    
    // Check if menu exists
    const [menu] = await db.select().from(navigationMenus)
      .where(eq(navigationMenus.id, parseResult.data.menuId));
    
    if (!menu) {
      return res.status(404).json({ message: 'Navigation menu not found' });
    }
    
    // If parentId is provided, check if it exists and belongs to the same menu
    if (parseResult.data.parentId) {
      const [parentItem] = await db.select().from(menuItems)
        .where(and(
          eq(menuItems.id, parseResult.data.parentId),
          eq(menuItems.menuId, parseResult.data.menuId)
        ));
      
      if (!parentItem) {
        return res.status(400).json({ message: 'Parent menu item not found in this menu' });
      }
    }
    
    // Find the maximum order for this menu (to append at the end)
    const [maxOrder] = await db.select({
      maxOrder: sql<number>`COALESCE(MAX(${menuItems.order}), -1) + 1`
    })
    .from(menuItems)
    .where(eq(menuItems.menuId, parseResult.data.menuId));
    
    // Create the menu item
    const newItemData = {
      ...parseResult.data,
      order: parseResult.data.order ?? maxOrder.maxOrder
    };
    
    const [newItem] = await db.insert(menuItems)
      .values(newItemData)
      .returning();
    
    return res.status(201).json({ 
      message: 'Menu item created successfully',
      data: newItem 
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return res.status(500).json({ message: 'Error creating menu item' });
  }
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(req: Request, res: Response) {
  try {
    const itemId = parseInt(req.params.id);
    
    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Valid item ID is required' });
    }
    
    // Validate request body
    const parseResult = insertMenuItemSchema.partial().safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: 'Invalid menu item data',
        errors: parseResult.error.errors 
      });
    }
    
    // Check if item exists
    const [existingItem] = await db.select().from(menuItems)
      .where(eq(menuItems.id, itemId));
    
    if (!existingItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Check if item isn't being made its own parent or descendant
    if (parseResult.data.parentId) {
      if (parseResult.data.parentId === itemId) {
        return res.status(400).json({ message: 'Item cannot be its own parent' });
      }
      
      // Check for circular reference
      let currentParentId = parseResult.data.parentId;
      while (currentParentId) {
        const [parentItem] = await db.select().from(menuItems)
          .where(eq(menuItems.id, currentParentId));
        
        if (!parentItem) {
          break;
        }
        
        if (parentItem.id === itemId) {
          return res.status(400).json({ message: 'Circular parent reference detected' });
        }
        
        currentParentId = parentItem.parentId;
      }
    }
    
    // Update the item
    const [updatedItem] = await db.update(menuItems)
      .set({
        ...parseResult.data,
        updatedAt: new Date()
      })
      .where(eq(menuItems.id, itemId))
      .returning();
    
    return res.status(200).json({ 
      message: 'Menu item updated successfully',
      data: updatedItem 
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return res.status(500).json({ message: 'Error updating menu item' });
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(req: Request, res: Response) {
  try {
    const itemId = parseInt(req.params.id);
    
    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Valid item ID is required' });
    }
    
    // Check if item exists
    const [existingItem] = await db.select().from(menuItems)
      .where(eq(menuItems.id, itemId));
    
    if (!existingItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Update any children to have null parentId
    await db.update(menuItems)
      .set({ parentId: null })
      .where(eq(menuItems.parentId, itemId));
    
    // Delete the item
    await db.delete(menuItems)
      .where(eq(menuItems.id, itemId));
    
    return res.status(200).json({ 
      message: 'Menu item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ message: 'Error deleting menu item' });
  }
}

/**
 * Reorder menu items
 */
export async function reorderMenuItems(req: Request, res: Response) {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Valid items array is required' });
    }
    
    // Start a transaction
    await db.transaction(async (tx) => {
      for (const item of items) {
        if (!item.id || typeof item.order !== 'number') {
          throw new Error('Each item must have id and order properties');
        }
        
        await tx.update(menuItems)
          .set({ order: item.order })
          .where(eq(menuItems.id, item.id));
      }
    });
    
    return res.status(200).json({ 
      message: 'Menu items reordered successfully' 
    });
  } catch (error) {
    console.error('Error reordering menu items:', error);
    return res.status(500).json({ message: 'Error reordering menu items' });
  }
}

/**
 * Get navigation menus by location for a tenant
 */
export async function getNavigationMenusByLocation(req: Request, res: Response) {
  try {
    const { tenantId, location } = req.query as { tenantId?: string, location?: string };
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }
    
    let query = db.select().from(navigationMenus)
      .where(and(
        eq(navigationMenus.tenantId, tenantId),
        eq(navigationMenus.isActive, true)
      ));
    
    if (location) {
      query = query.where(eq(navigationMenus.location, location));
    }
    
    const menus = await query.orderBy(navigationMenus.name);
    
    // For each menu, get its menu items
    const result = await Promise.all(menus.map(async (menu) => {
      // Get all menu items for this menu
      const allItems = await db.select().from(menuItems)
        .where(and(
          eq(menuItems.menuId, menu.id),
          eq(menuItems.isVisible, true)
        ))
        .orderBy(menuItems.order);
      
      // Build the hierarchy
      const rootItems = allItems.filter(item => !item.parentId);
      
      // Build the tree
      function buildTree(items: MenuItem[]) {
        return items.map(item => {
          const children = allItems.filter(childItem => childItem.parentId === item.id)
            .sort((a, b) => a.order - b.order);
          
          return {
            ...item,
            children: buildTree(children)
          };
        });
      }
      
      const hierarchicalItems = buildTree(rootItems);
      
      return {
        ...menu,
        items: hierarchicalItems
      };
    }));
    
    return res.status(200).json({ 
      message: 'Navigation menus retrieved successfully',
      data: result 
    });
  } catch (error) {
    console.error('Error retrieving navigation menus by location:', error);
    return res.status(500).json({ message: 'Error retrieving navigation menus' });
  }
}

/**
 * Register all navigation routes
 */
export function registerNavigationRoutes(app: any) {
  // Navigation Menu routes
  app.get('/api/navigation/menus', getNavigationMenus);
  app.get('/api/navigation/menus/:id', getNavigationMenuById);
  app.post('/api/navigation/menus', createNavigationMenu);
  app.put('/api/navigation/menus/:id', updateNavigationMenu);
  app.delete('/api/navigation/menus/:id', deleteNavigationMenu);
  
  // Menu Items routes
  app.get('/api/navigation/menus/:menuId/items', getMenuItems);
  app.get('/api/navigation/menus/:menuId/items/hierarchy', getMenuItemsHierarchy);
  app.post('/api/navigation/items', createMenuItem);
  app.put('/api/navigation/items/:id', updateMenuItem);
  app.delete('/api/navigation/items/:id', deleteMenuItem);
  app.post('/api/navigation/items/reorder', reorderMenuItems);
  
  // Public routes
  app.get('/api/navigation/public', getNavigationMenusByLocation);
  
  console.log('✅ Navigation routes registered');
}