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

class AgoraService {
  // Pillar operations
  async getPillars(businessId: string): Promise<Pillar[]> {
    try {
      // Return pillars for this business that are not archived
      return await db.query.agoraPillars.findMany({
        where: (pillar, { and, eq }) => 
          and(eq(pillar.businessId, businessId), eq(pillar.isArchived, false)),
        orderBy: (pillar, { desc }) => [desc(pillar.updatedAt)]
      });
    } catch (error) {
      console.error('Error fetching pillars:', error);
      return [];
    }
  }

  async getPillar(id: string): Promise<Pillar | null> {
    try {
      return await db.query.agoraPillars.findFirst({
        where: (pillar, { eq }) => eq(pillar.id, id)
      });
    } catch (error) {
      console.error(`Error fetching pillar ${id}:`, error);
      return null;
    }
  }

  async createPillar(data: InsertPillar): Promise<Pillar> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const [pillar] = await db.insert(agoraPillars)
        .values({
          id,
          name: data.name,
          description: data.description,
          color: data.color,
          businessId: data.businessId,
          createdAt: now,
          updatedAt: now
        })
        .returning();
      
      return pillar;
    } catch (error) {
      console.error('Error creating pillar:', error);
      throw new Error('Failed to create pillar');
    }
  }

  async updatePillar(id: string, data: Partial<InsertPillar>): Promise<Pillar | null> {
    try {
      const [updatedPillar] = await db.update(agoraPillars)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(pillar => pillar.id.equals(id))
        .returning();
      
      return updatedPillar || null;
    } catch (error) {
      console.error(`Error updating pillar ${id}:`, error);
      return null;
    }
  }

  async archivePillar(id: string): Promise<Pillar | null> {
    try {
      const [archivedPillar] = await db.update(agoraPillars)
        .set({
          isArchived: true,
          updatedAt: new Date()
        })
        .where(pillar => pillar.id.equals(id))
        .returning();
      
      return archivedPillar || null;
    } catch (error) {
      console.error(`Error archiving pillar ${id}:`, error);
      return null;
    }
  }

  // Space operations
  async getSpaces(businessId: string): Promise<Space[]> {
    try {
      return await db.query.agoraSpaces.findMany({
        where: (space, { and, eq }) => 
          and(eq(space.businessId, businessId), eq(space.isArchived, false)),
        orderBy: (space, { desc }) => [desc(space.updatedAt)]
      });
    } catch (error) {
      console.error('Error fetching spaces:', error);
      return [];
    }
  }

  async getSpacesByPillar(pillarId: string): Promise<Space[]> {
    try {
      return await db.query.agoraSpaces.findMany({
        where: (space, { and, eq }) => 
          and(eq(space.pillarId, pillarId), eq(space.isArchived, false)),
        orderBy: (space, { desc }) => [desc(space.updatedAt)]
      });
    } catch (error) {
      console.error(`Error fetching spaces for pillar ${pillarId}:`, error);
      return [];
    }
  }

  async getSpace(id: string): Promise<Space | null> {
    try {
      return await db.query.agoraSpaces.findFirst({
        where: (space, { eq }) => eq(space.id, id)
      });
    } catch (error) {
      console.error(`Error fetching space ${id}:`, error);
      return null;
    }
  }

  async createSpace(data: InsertSpace): Promise<Space> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const [space] = await db.insert(agoraSpaces)
        .values({
          id,
          name: data.name,
          description: data.description,
          pillarId: data.pillarId,
          businessId: data.businessId,
          status: 'active',
          priority: data.priority || 0,
          progress: 0,
          createdAt: now,
          updatedAt: now,
          dueDate: data.dueDate
        })
        .returning();
      
      return space;
    } catch (error) {
      console.error('Error creating space:', error);
      throw new Error('Failed to create space');
    }
  }

  async updateSpace(id: string, data: Partial<InsertSpace>): Promise<Space | null> {
    try {
      const [updatedSpace] = await db.update(agoraSpaces)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(space => space.id.equals(id))
        .returning();
      
      return updatedSpace || null;
    } catch (error) {
      console.error(`Error updating space ${id}:`, error);
      return null;
    }
  }

  async updateSpaceProgress(id: string, progress: number): Promise<Space | null> {
    try {
      const [updatedSpace] = await db.update(agoraSpaces)
        .set({
          progress: Math.min(Math.max(progress, 0), 100), // Ensure progress is between 0-100
          updatedAt: new Date()
        })
        .where(space => space.id.equals(id))
        .returning();
      
      return updatedSpace || null;
    } catch (error) {
      console.error(`Error updating space progress ${id}:`, error);
      return null;
    }
  }

  async archiveSpace(id: string): Promise<Space | null> {
    try {
      const [archivedSpace] = await db.update(agoraSpaces)
        .set({
          isArchived: true,
          updatedAt: new Date()
        })
        .where(space => space.id.equals(id))
        .returning();
      
      return archivedSpace || null;
    } catch (error) {
      console.error(`Error archiving space ${id}:`, error);
      return null;
    }
  }

  // Space Notes operations
  async getSpaceNotes(spaceId: string): Promise<SpaceNote[]> {
    try {
      return await db.query.agoraSpaceNotes.findMany({
        where: (note, { and, eq }) => 
          and(eq(note.spaceId, spaceId), eq(note.isArchived, false)),
        orderBy: (note, { desc }) => [desc(note.createdAt)]
      });
    } catch (error) {
      console.error(`Error fetching notes for space ${spaceId}:`, error);
      return [];
    }
  }

  async createSpaceNote(data: InsertSpaceNote): Promise<SpaceNote> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const [note] = await db.insert(agoraSpaceNotes)
        .values({
          id,
          spaceId: data.spaceId,
          content: data.content,
          userId: data.userId,
          createdAt: now,
          updatedAt: now
        })
        .returning();
      
      return note;
    } catch (error) {
      console.error('Error creating space note:', error);
      throw new Error('Failed to create space note');
    }
  }

  async updateSpaceNote(id: string, content: string): Promise<SpaceNote | null> {
    try {
      const [updatedNote] = await db.update(agoraSpaceNotes)
        .set({
          content,
          updatedAt: new Date()
        })
        .where(note => note.id.equals(id))
        .returning();
      
      return updatedNote || null;
    } catch (error) {
      console.error(`Error updating space note ${id}:`, error);
      return null;
    }
  }

  async archiveSpaceNote(id: string): Promise<SpaceNote | null> {
    try {
      const [archivedNote] = await db.update(agoraSpaceNotes)
        .set({
          isArchived: true,
          updatedAt: new Date()
        })
        .where(note => note.id.equals(id))
        .returning();
      
      return archivedNote || null;
    } catch (error) {
      console.error(`Error archiving space note ${id}:`, error);
      return null;
    }
  }

  // Space Actions operations
  async getSpaceActions(spaceId: string): Promise<SpaceAction[]> {
    try {
      return await db.query.agoraSpaceActions.findMany({
        where: (action, { and, eq }) => 
          and(eq(action.spaceId, spaceId), eq(action.isArchived, false)),
        orderBy: (action, { desc }) => [desc(action.createdAt)]
      });
    } catch (error) {
      console.error(`Error fetching actions for space ${spaceId}:`, error);
      return [];
    }
  }

  async createSpaceAction(data: InsertSpaceAction): Promise<SpaceAction> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const [action] = await db.insert(agoraSpaceActions)
        .values({
          id,
          spaceId: data.spaceId,
          title: data.title,
          description: data.description,
          status: 'pending',
          dueDate: data.dueDate,
          assignedTo: data.assignedTo,
          createdBy: data.createdBy,
          createdAt: now,
          updatedAt: now
        })
        .returning();
      
      return action;
    } catch (error) {
      console.error('Error creating space action:', error);
      throw new Error('Failed to create space action');
    }
  }

  async updateSpaceAction(id: string, data: Partial<InsertSpaceAction>): Promise<SpaceAction | null> {
    try {
      const [updatedAction] = await db.update(agoraSpaceActions)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(action => action.id.equals(id))
        .returning();
      
      return updatedAction || null;
    } catch (error) {
      console.error(`Error updating space action ${id}:`, error);
      return null;
    }
  }

  async completeSpaceAction(id: string): Promise<SpaceAction | null> {
    try {
      const now = new Date();
      const [completedAction] = await db.update(agoraSpaceActions)
        .set({
          status: 'completed',
          updatedAt: now,
          completedAt: now
        })
        .where(action => action.id.equals(id))
        .returning();
      
      return completedAction || null;
    } catch (error) {
      console.error(`Error completing space action ${id}:`, error);
      return null;
    }
  }

  async archiveSpaceAction(id: string): Promise<SpaceAction | null> {
    try {
      const [archivedAction] = await db.update(agoraSpaceActions)
        .set({
          isArchived: true,
          updatedAt: new Date()
        })
        .where(action => action.id.equals(id))
        .returning();
      
      return archivedAction || null;
    } catch (error) {
      console.error(`Error archiving space action ${id}:`, error);
      return null;
    }
  }

  // Get suggested nudges based on business data and spaces
  async getSuggestedNudges(businessId: string): Promise<Array<{ message: string; actionId?: string; priority: number }>> {
    try {
      // In a real implementation, this would analyze business data, spaces, and activity
      // to generate personalized nudges. For now, return some example nudges.
      
      const spaces = await this.getSpaces(businessId);
      const incompleteTasks = spaces.filter(space => space.status === 'active' && space.progress < 100).length;
      
      const nudges = [];
      
      if (incompleteTasks > 3) {
        nudges.push({
          message: `You have ${incompleteTasks} active spaces that need attention. Consider focusing on fewer priorities at once.`,
          priority: 8
        });
      }
      
      if (spaces.length === 0) {
        nudges.push({
          message: "Get started with Agora by creating your first business Space to track an important initiative.",
          priority: 10
        });
      }
      
      // Add some generic nudges as examples
      nudges.push({
        message: "Review your Client Trust pillar. When did you last request feedback from top clients?",
        priority: 5
      });
      
      nudges.push({
        message: "Staff Culture spaces haven't been updated in 2 weeks. Schedule a team check-in?",
        priority: 6
      });
      
      return nudges.sort((a, b) => b.priority - a.priority);
    } catch (error) {
      console.error(`Error generating nudges for business ${businessId}:`, error);
      return [];
    }
  }
}

export const agoraService = new AgoraService();