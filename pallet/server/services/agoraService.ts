import { db } from '../db';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Pillar,
  Space,
  SpaceNote,
  SpaceAction,
  InsertPillar,
  InsertSpace,
  InsertSpaceNote,
  InsertSpaceAction,
  pillars,
  spaces,
  spaceNotes,
  spaceActions
} from '@shared/agora';
import { eq, and, desc } from 'drizzle-orm';

// Type for whisper nudges
export interface WhisperNudge {
  id: string;
  message: string;
  actionText?: string;
  actionId?: string;
  targetResourceType?: string;
  targetResourceId?: string;
  priority: number;
  createdAt: Date;
}

class AgoraService {
  /**
   * Get all pillars for a business
   */
  async getPillars(businessId: string): Promise<Pillar[]> {
    try {
      return await db
        .select()
        .from(pillars)
        .where(
          and(
            eq(pillars.businessId, businessId),
            eq(pillars.isArchived, false)
          )
        )
        .orderBy(desc(pillars.updatedAt));
    } catch (error) {
      console.error('Error getting pillars:', error);
      return [];
    }
  }

  /**
   * Create a new pillar
   */
  async createPillar(data: InsertPillar): Promise<Pillar> {
    try {
      const id = data.id || uuidv4();
      const now = new Date();
      
      const [pillar] = await db
        .insert(pillars)
        .values({
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
          isArchived: false
        })
        .returning();

      // Log the activity
      await storage.logActivity({
        userType: 'system',
        actionType: 'created',
        entityType: 'pillar',
        entityId: pillar.id,
        details: { pillarName: pillar.name }
      });

      return pillar;
    } catch (error) {
      console.error('Error creating pillar:', error);
      throw error;
    }
  }

  /**
   * Update an existing pillar
   */
  async updatePillar(pillarId: string, data: Partial<InsertPillar>): Promise<Pillar | null> {
    try {
      const [pillar] = await db
        .update(pillars)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(pillars.id, pillarId))
        .returning();

      if (!pillar) {
        return null;
      }

      // Log the activity
      await storage.logActivity({
        userType: 'system',
        actionType: 'updated',
        entityType: 'pillar',
        entityId: pillar.id,
        details: { pillarName: pillar.name }
      });

      return pillar;
    } catch (error) {
      console.error('Error updating pillar:', error);
      throw error;
    }
  }

  /**
   * Archive a pillar (soft delete)
   */
  async archivePillar(pillarId: string): Promise<boolean> {
    try {
      const [pillar] = await db
        .update(pillars)
        .set({
          isArchived: true,
          updatedAt: new Date()
        })
        .where(eq(pillars.id, pillarId))
        .returning();

      if (!pillar) {
        return false;
      }

      // Log the activity
      await storage.logActivity({
        userType: 'system',
        actionType: 'archived',
        entityType: 'pillar',
        entityId: pillar.id,
        details: { pillarName: pillar.name }
      });

      return true;
    } catch (error) {
      console.error('Error archiving pillar:', error);
      return false;
    }
  }

  /**
   * Get all spaces for a business, optionally filtered by pillar
   */
  async getSpaces(businessId: string, pillarId?: string): Promise<Space[]> {
    try {
      let query = db
        .select()
        .from(spaces)
        .where(
          and(
            eq(spaces.businessId, businessId),
            eq(spaces.isArchived, false)
          )
        );

      if (pillarId) {
        query = db
          .select()
          .from(spaces)
          .where(
            and(
              eq(spaces.businessId, businessId),
              eq(spaces.isArchived, false),
              eq(spaces.pillarId, pillarId)
            )
          );
      }

      return await query.orderBy(desc(spaces.updatedAt));
    } catch (error) {
      console.error('Error getting spaces:', error);
      return [];
    }
  }

  /**
   * Create a new space
   */
  async createSpace(data: InsertSpace): Promise<Space> {
    try {
      const id = data.id || uuidv4();
      const now = new Date();

      const [space] = await db
        .insert(spaces)
        .values({
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
          isArchived: false
        })
        .returning();

      // Log the activity
      await storage.logActivity({
        userType: 'system',
        actionType: 'created',
        entityType: 'space',
        entityId: space.id,
        details: { 
          spaceName: space.name,
          pillarId: space.pillarId || 'none'
        }
      });

      return space;
    } catch (error) {
      console.error('Error creating space:', error);
      throw error;
    }
  }

  /**
   * Update an existing space
   */
  async updateSpace(spaceId: string, data: Partial<InsertSpace>): Promise<Space | null> {
    try {
      const [space] = await db
        .update(spaces)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(spaces.id, spaceId))
        .returning();

      if (!space) {
        return null;
      }

      // Log the activity
      await storage.logActivity({
        userType: 'system',
        actionType: 'updated',
        entityType: 'space',
        entityId: space.id,
        details: { 
          spaceName: space.name 
        }
      });

      return space;
    } catch (error) {
      console.error('Error updating space:', error);
      throw error;
    }
  }

  /**
   * Archive a space (soft delete)
   */
  async archiveSpace(spaceId: string): Promise<boolean> {
    try {
      const [space] = await db
        .update(spaces)
        .set({
          isArchived: true,
          updatedAt: new Date()
        })
        .where(eq(spaces.id, spaceId))
        .returning();

      if (!space) {
        return false;
      }

      // Log the activity
      await storage.logActivity({
        userType: 'system',
        actionType: 'archived',
        entityType: 'space',
        entityId: space.id,
        details: { spaceName: space.name }
      });

      return true;
    } catch (error) {
      console.error('Error archiving space:', error);
      return false;
    }
  }

  /**
   * Get whisper nudges for a business
   * In a real implementation, this would involve AI processing of business data
   * For now, we'll return sample nudges
   */
  async getWhisperNudges(businessId: string): Promise<WhisperNudge[]> {
    // In a real implementation, these would be generated by an AI based on business data
    // and stored in the database. For now, we'll return sample static data.
    const sampleNudges: WhisperNudge[] = [
      {
        id: uuidv4(),
        message: "You've mentioned 'client retention' 5 times in recent meetings. Create a Space to track your retention strategies?",
        actionText: "Create Retention Space",
        targetResourceType: "space",
        priority: 3,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        message: "It's been 30 days since you reviewed your 'Team Culture' Pillar. Would you like to schedule a team feedback session?",
        actionText: "Schedule Session",
        priority: 2,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        message: "A new month is beginning. Time for a fresh perspective!",
        priority: 1,
        createdAt: new Date()
      }
    ];

    return sampleNudges;
  }

  // Additional methods for managing space notes and actions could be added here
}

export const agoraService = new AgoraService();