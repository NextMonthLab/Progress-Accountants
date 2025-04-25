import { db } from '../db';
import { insightUsers, insertInsightUserSchema } from '@shared/insight_dashboard';
import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';

export async function getInsightUsers(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated() || !['admin', 'super_admin', 'editor'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const tenantId = req.user.tenantId;
    const users = await db.select().from(insightUsers)
      .where(eq(insightUsers.tenantId, tenantId))
      .orderBy(insightUsers.displayName);
    
    return res.json(users);
  } catch (error) {
    console.error('Error fetching insight users:', error);
    return res.status(500).json({ error: 'Failed to fetch insight users' });
  }
}

export async function createInsightUser(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated() || !['admin', 'super_admin'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const tenantId = req.user.tenantId;
    
    // Check if email already exists
    const existingUser = await db.select({ id: insightUsers.id })
      .from(insightUsers)
      .where(and(
        eq(insightUsers.tenantId, tenantId),
        eq(insightUsers.email, req.body.email)
      ))
      .limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Validate and create user
    const userData = insertInsightUserSchema.parse({
      ...req.body,
      tenantId
    });
    
    const [newUser] = await db.insert(insightUsers).values(userData).returning();
    
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating insight user:', error);
    return res.status(500).json({ error: 'Failed to create insight user' });
  }
}

export async function updateInsightUser(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated() || !['admin', 'super_admin'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const tenantId = req.user.tenantId;
    const userId = parseInt(req.params.id);
    
    // Make sure user exists and belongs to this tenant
    const existingUser = await db.select({ id: insightUsers.id })
      .from(insightUsers)
      .where(and(
        eq(insightUsers.tenantId, tenantId),
        eq(insightUsers.id, userId)
      ))
      .limit(1);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    const [updatedUser] = await db.update(insightUsers)
      .set({
        displayName: req.body.displayName,
        role: req.body.role,
        isActive: req.body.isActive,
        updatedAt: new Date()
      })
      .where(and(
        eq(insightUsers.tenantId, tenantId),
        eq(insightUsers.id, userId)
      ))
      .returning();
    
    return res.json(updatedUser);
  } catch (error) {
    console.error('Error updating insight user:', error);
    return res.status(500).json({ error: 'Failed to update insight user' });
  }
}

export async function deleteInsightUser(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated() || !['admin', 'super_admin'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const tenantId = req.user.tenantId;
    const userId = parseInt(req.params.id);
    
    // Make sure user exists and belongs to this tenant
    const existingUser = await db.select({ id: insightUsers.id })
      .from(insightUsers)
      .where(and(
        eq(insightUsers.tenantId, tenantId),
        eq(insightUsers.id, userId)
      ))
      .limit(1);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user (cascade will handle deleting their insights)
    await db.delete(insightUsers)
      .where(and(
        eq(insightUsers.tenantId, tenantId),
        eq(insightUsers.id, userId)
      ));
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting insight user:', error);
    return res.status(500).json({ error: 'Failed to delete insight user' });
  }
}