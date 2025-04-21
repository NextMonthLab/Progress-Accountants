import { Request, Response } from 'express';
import { db } from '../db';
import { resources, insertResourceSchema } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Get all resources (admin view)
export async function getResources(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || null;
    
    const resourcesList = await db.select().from(resources)
      .where(tenantId ? eq(resources.tenantId, tenantId) : undefined)
      .orderBy(resources.order);
    
    res.status(200).json({ resources: resourcesList });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
}

// Get published resources (public view)
export async function getPublicResources(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || null;
    
    const resourcesList = await db.select().from(resources)
      .where(tenantId ? eq(resources.tenantId, tenantId) : undefined)
      .where(eq(resources.isPublished, true))
      .orderBy(resources.order);
    
    res.status(200).json({ resources: resourcesList });
  } catch (error) {
    console.error('Error fetching public resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
}

// Create a new resource
export async function createResource(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = insertResourceSchema.parse({
      ...req.body,
      tenantId: req.user?.tenantId
    });
    
    // Create resource
    const [resource] = await db.insert(resources)
      .values(validatedData)
      .returning();
    
    res.status(201).json({ resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create resource' });
  }
}

// Update a resource
export async function updateResource(req: Request, res: Response) {
  const { id } = req.params;
  
  try {
    // Check if resource exists and belongs to user's tenant
    const existingResource = await db.select()
      .from(resources)
      .where(eq(resources.id, Number(id)))
      .limit(1);
      
    if (!existingResource.length) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Validate tenant ownership
    if (req.user?.tenantId && existingResource[0].tenantId !== req.user.tenantId) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }
    
    // Update resource
    const [updatedResource] = await db.update(resources)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(resources.id, Number(id)))
      .returning();
    
    res.status(200).json({ resource: updatedResource });
  } catch (error) {
    console.error('Error updating resource:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update resource' });
  }
}

// Delete a resource
export async function deleteResource(req: Request, res: Response) {
  const { id } = req.params;
  
  try {
    // Check if resource exists and belongs to user's tenant
    const existingResource = await db.select()
      .from(resources)
      .where(eq(resources.id, Number(id)))
      .limit(1);
      
    if (!existingResource.length) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Validate tenant ownership
    if (req.user?.tenantId && existingResource[0].tenantId !== req.user.tenantId) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }
    
    // Delete resource
    await db.delete(resources)
      .where(eq(resources.id, Number(id)));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
}

// Register routes
export function registerResourcesRoutes(app: any) {
  // Admin routes
  app.get('/api/pages/resources', getResources);
  app.post('/api/pages/resources', createResource);
  app.patch('/api/pages/resources/:id', updateResource);
  app.delete('/api/pages/resources/:id', deleteResource);
  
  // Public routes
  app.get('/api/pages/resources/public', getPublicResources);
}