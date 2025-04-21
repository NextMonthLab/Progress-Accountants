import { Request, Response } from 'express';
import { db } from '../db';
import { resources, insertResourceSchema } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import type { Express } from "express";

/**
 * Get all resources for a tenant
 */
export async function getAllResources(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    
    const allResources = await db.query.resources.findMany({
      where: eq(resources.tenantId, tenantId),
      orderBy: resources.order,
    });
    
    return res.status(200).json(allResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({ error: 'Failed to fetch resources' });
  }
}

/**
 * Get public resources (published only)
 */
export async function getPublicResources(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    
    const publicResources = await db.query.resources.findMany({
      where: and(
        eq(resources.tenantId, tenantId),
        eq(resources.isPublished, true)
      ),
      orderBy: resources.order,
    });
    
    return res.status(200).json(publicResources);
  } catch (error) {
    console.error('Error fetching public resources:', error);
    return res.status(500).json({ error: 'Failed to fetch public resources' });
  }
}

/**
 * Get a single resource by ID
 */
export async function getResourceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    
    const resource = await db.query.resources.findFirst({
      where: and(
        eq(resources.id, parseInt(id)),
        eq(resources.tenantId, tenantId)
      ),
    });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    return res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return res.status(500).json({ error: 'Failed to fetch resource' });
  }
}

/**
 * Create a new resource
 */
export async function createResource(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    
    // Validate input data
    const result = insertResourceSchema.safeParse({
      ...req.body,
      tenantId,
    });
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid resource data', details: result.error });
    }
    
    // Create resource
    const newResource = await db.insert(resources).values({
      ...result.data,
      tenantId,
    }).returning();
    
    return res.status(201).json(newResource[0]);
  } catch (error) {
    console.error('Error creating resource:', error);
    return res.status(500).json({ error: 'Failed to create resource' });
  }
}

/**
 * Update an existing resource
 */
export async function updateResource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    
    // Check if resource exists
    const existingResource = await db.query.resources.findFirst({
      where: and(
        eq(resources.id, parseInt(id)),
        eq(resources.tenantId, tenantId)
      ),
    });
    
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Validate input data
    const result = insertResourceSchema.partial().safeParse({
      ...req.body,
      tenantId,
    });
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid resource data', details: result.error });
    }
    
    // Update resource
    const updatedResource = await db.update(resources)
      .set({ ...result.data, updatedAt: new Date() })
      .where(and(
        eq(resources.id, parseInt(id)),
        eq(resources.tenantId, tenantId)
      ))
      .returning();
    
    return res.status(200).json(updatedResource[0]);
  } catch (error) {
    console.error('Error updating resource:', error);
    return res.status(500).json({ error: 'Failed to update resource' });
  }
}

/**
 * Delete a resource
 */
export async function deleteResource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    
    // Check if resource exists
    const existingResource = await db.query.resources.findFirst({
      where: and(
        eq(resources.id, parseInt(id)),
        eq(resources.tenantId, tenantId)
      ),
    });
    
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Delete resource
    await db.delete(resources).where(and(
      eq(resources.id, parseInt(id)),
      eq(resources.tenantId, tenantId)
    ));
    
    return res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return res.status(500).json({ error: 'Failed to delete resource' });
  }
}

/**
 * Update resource order
 */
export async function updateResourceOrder(req: Request, res: Response) {
  try {
    const { resources: resourcesOrder } = req.body;
    const tenantId = req.user?.tenantId;
    
    if (!Array.isArray(resourcesOrder)) {
      return res.status(400).json({ error: 'Invalid resource order data' });
    }
    
    // Update each resource's order
    const updatePromises = resourcesOrder.map((item: { id: number, order: number }) => {
      return db.update(resources)
        .set({ order: item.order })
        .where(and(
          eq(resources.id, item.id),
          eq(resources.tenantId, tenantId)
        ));
    });
    
    await Promise.all(updatePromises);
    
    return res.status(200).json({ message: 'Resource order updated successfully' });
  } catch (error) {
    console.error('Error updating resource order:', error);
    return res.status(500).json({ error: 'Failed to update resource order' });
  }
}

/**
 * Register resource routes
 */
export function registerResourcesRoutes(app: Express) {
  // Get all resources (admin)
  app.get('/api/resources', getAllResources);
  
  // Get public resources (for client viewing)
  app.get('/api/public-resources', getPublicResources);
  
  // Get a single resource
  app.get('/api/resources/:id', getResourceById);
  
  // Create a new resource
  app.post('/api/resources', createResource);
  
  // Update a resource
  app.put('/api/resources/:id', updateResource);
  
  // Delete a resource
  app.delete('/api/resources/:id', deleteResource);
  
  // Update resource order
  app.post('/api/resources/order', updateResourceOrder);
  
  // Mark resources page as complete
  app.post('/api/pages/resources/complete', async (req: Request, res: Response) => {
    try {
      const tenantId = req.user?.tenantId;
      
      // Get current project context
      const projectContext = await db.query.projectContext.findFirst({
        where: eq(db.projectContext.tenantId, tenantId),
      });
      
      if (!projectContext) {
        return res.status(404).json({ error: 'Project context not found' });
      }
      
      // Update pageStatus field to mark resources as completed
      let pageStatus = projectContext.pageStatus as any || {};
      pageStatus.resources = 'completed';
      
      // Update project context
      await db.update(db.projectContext)
        .set({ 
          pageStatus, 
          updatedAt: new Date() 
        })
        .where(eq(db.projectContext.id, projectContext.id));
      
      return res.status(200).json({ 
        success: true, 
        message: 'Resources page marked as complete' 
      });
    } catch (error) {
      console.error('Error marking page as complete:', error);
      return res.status(500).json({ error: 'Failed to mark page as complete' });
    }
  });
}