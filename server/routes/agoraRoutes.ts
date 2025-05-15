import { Express, Request, Response } from 'express';
import { agoraService } from '../services/agoraService';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { insertPillarSchema, insertSpaceSchema, insertSpaceNoteSchema, insertSpaceActionSchema } from '@shared/agora';

// Admin role check middleware
const requireAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated() || (req.user?.role !== 'admin' && req.user?.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

export function registerAgoraRoutes(app: Express) {
  // Get pillars for a business
  app.get('/api/agora/pillars', requireAdmin, async (req: Request, res: Response) => {
    try {
      // For now, using a placeholder business ID - in production this would come from the tenant
      const businessId = req.query.businessId as string || '00000000-0000-0000-0000-000000000000';
      const pillars = await agoraService.getPillars(businessId);
      res.json(pillars);
    } catch (error) {
      console.error('Error fetching pillars:', error);
      res.status(500).json({ error: 'Failed to fetch pillars' });
    }
  });

  // Get a specific pillar by ID
  app.get('/api/agora/pillars/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const pillar = await agoraService.getPillar(req.params.id);
      if (!pillar) {
        return res.status(404).json({ error: 'Pillar not found' });
      }
      res.json(pillar);
    } catch (error) {
      console.error(`Error fetching pillar ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch pillar' });
    }
  });

  // Create a new pillar
  app.post('/api/agora/pillars', requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertPillarSchema.parse(req.body);
      const newPillar = await agoraService.createPillar(validatedData);
      res.status(201).json(newPillar);
    } catch (error) {
      console.error('Error creating pillar:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create pillar' });
    }
  });

  // Update a pillar
  app.patch('/api/agora/pillars/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertPillarSchema.partial().parse(req.body);
      const updatedPillar = await agoraService.updatePillar(req.params.id, validatedData);
      if (!updatedPillar) {
        return res.status(404).json({ error: 'Pillar not found' });
      }
      res.json(updatedPillar);
    } catch (error) {
      console.error(`Error updating pillar ${req.params.id}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update pillar' });
    }
  });

  // Archive a pillar
  app.delete('/api/agora/pillars/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const archivedPillar = await agoraService.archivePillar(req.params.id);
      if (!archivedPillar) {
        return res.status(404).json({ error: 'Pillar not found' });
      }
      res.json({ success: true, message: 'Pillar archived successfully' });
    } catch (error) {
      console.error(`Error archiving pillar ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to archive pillar' });
    }
  });

  // Get all spaces for a business
  app.get('/api/agora/spaces', requireAdmin, async (req: Request, res: Response) => {
    try {
      const businessId = req.query.businessId as string || '00000000-0000-0000-0000-000000000000';
      const spaces = await agoraService.getSpaces(businessId);
      res.json(spaces);
    } catch (error) {
      console.error('Error fetching spaces:', error);
      res.status(500).json({ error: 'Failed to fetch spaces' });
    }
  });

  // Get spaces by pillar
  app.get('/api/agora/pillars/:pillarId/spaces', requireAdmin, async (req: Request, res: Response) => {
    try {
      const spaces = await agoraService.getSpacesByPillar(req.params.pillarId);
      res.json(spaces);
    } catch (error) {
      console.error(`Error fetching spaces for pillar ${req.params.pillarId}:`, error);
      res.status(500).json({ error: 'Failed to fetch spaces' });
    }
  });

  // Get a specific space
  app.get('/api/agora/spaces/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const space = await agoraService.getSpace(req.params.id);
      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }
      res.json(space);
    } catch (error) {
      console.error(`Error fetching space ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to fetch space' });
    }
  });

  // Create a new space
  app.post('/api/agora/spaces', requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSpaceSchema.parse(req.body);
      const newSpace = await agoraService.createSpace(validatedData);
      res.status(201).json(newSpace);
    } catch (error) {
      console.error('Error creating space:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create space' });
    }
  });

  // Update a space
  app.patch('/api/agora/spaces/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSpaceSchema.partial().parse(req.body);
      const updatedSpace = await agoraService.updateSpace(req.params.id, validatedData);
      if (!updatedSpace) {
        return res.status(404).json({ error: 'Space not found' });
      }
      res.json(updatedSpace);
    } catch (error) {
      console.error(`Error updating space ${req.params.id}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update space' });
    }
  });

  // Update space progress
  app.patch('/api/agora/spaces/:id/progress', requireAdmin, async (req: Request, res: Response) => {
    try {
      const schema = z.object({ progress: z.number().min(0).max(100) });
      const { progress } = schema.parse(req.body);
      
      const updatedSpace = await agoraService.updateSpaceProgress(req.params.id, progress);
      if (!updatedSpace) {
        return res.status(404).json({ error: 'Space not found' });
      }
      res.json(updatedSpace);
    } catch (error) {
      console.error(`Error updating space progress ${req.params.id}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update space progress' });
    }
  });

  // Archive a space
  app.delete('/api/agora/spaces/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const archivedSpace = await agoraService.archiveSpace(req.params.id);
      if (!archivedSpace) {
        return res.status(404).json({ error: 'Space not found' });
      }
      res.json({ success: true, message: 'Space archived successfully' });
    } catch (error) {
      console.error(`Error archiving space ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to archive space' });
    }
  });

  // Get notes for a space
  app.get('/api/agora/spaces/:spaceId/notes', requireAdmin, async (req: Request, res: Response) => {
    try {
      const notes = await agoraService.getSpaceNotes(req.params.spaceId);
      res.json(notes);
    } catch (error) {
      console.error(`Error fetching notes for space ${req.params.spaceId}:`, error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  // Create a note for a space
  app.post('/api/agora/spaces/:spaceId/notes', requireAdmin, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).json({ error: 'User not authenticated' });
      }
      
      const validatedData = insertSpaceNoteSchema.parse({
        ...req.body,
        spaceId: req.params.spaceId,
        userId: req.user.id.toString() // Convert to string as per our schema
      });
      
      const newNote = await agoraService.createSpaceNote(validatedData);
      res.status(201).json(newNote);
    } catch (error) {
      console.error(`Error creating note for space ${req.params.spaceId}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

  // Update a note
  app.patch('/api/agora/notes/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const schema = z.object({ content: z.string().min(1) });
      const { content } = schema.parse(req.body);
      
      const updatedNote = await agoraService.updateSpaceNote(req.params.id, content);
      if (!updatedNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(updatedNote);
    } catch (error) {
      console.error(`Error updating note ${req.params.id}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update note' });
    }
  });

  // Archive a note
  app.delete('/api/agora/notes/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const archivedNote = await agoraService.archiveSpaceNote(req.params.id);
      if (!archivedNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json({ success: true, message: 'Note archived successfully' });
    } catch (error) {
      console.error(`Error archiving note ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to archive note' });
    }
  });

  // Get actions for a space
  app.get('/api/agora/spaces/:spaceId/actions', requireAdmin, async (req: Request, res: Response) => {
    try {
      const actions = await agoraService.getSpaceActions(req.params.spaceId);
      res.json(actions);
    } catch (error) {
      console.error(`Error fetching actions for space ${req.params.spaceId}:`, error);
      res.status(500).json({ error: 'Failed to fetch actions' });
    }
  });

  // Create an action for a space
  app.post('/api/agora/spaces/:spaceId/actions', requireAdmin, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).json({ error: 'User not authenticated' });
      }
      
      const validatedData = insertSpaceActionSchema.parse({
        ...req.body,
        spaceId: req.params.spaceId,
        createdBy: req.user.id.toString() // Convert to string as per our schema
      });
      
      const newAction = await agoraService.createSpaceAction(validatedData);
      res.status(201).json(newAction);
    } catch (error) {
      console.error(`Error creating action for space ${req.params.spaceId}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create action' });
    }
  });

  // Update an action
  app.patch('/api/agora/actions/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertSpaceActionSchema.partial().parse(req.body);
      const updatedAction = await agoraService.updateSpaceAction(req.params.id, validatedData);
      if (!updatedAction) {
        return res.status(404).json({ error: 'Action not found' });
      }
      res.json(updatedAction);
    } catch (error) {
      console.error(`Error updating action ${req.params.id}:`, error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update action' });
    }
  });

  // Complete an action
  app.patch('/api/agora/actions/:id/complete', requireAdmin, async (req: Request, res: Response) => {
    try {
      const completedAction = await agoraService.completeSpaceAction(req.params.id);
      if (!completedAction) {
        return res.status(404).json({ error: 'Action not found' });
      }
      res.json(completedAction);
    } catch (error) {
      console.error(`Error completing action ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to complete action' });
    }
  });

  // Archive an action
  app.delete('/api/agora/actions/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const archivedAction = await agoraService.archiveSpaceAction(req.params.id);
      if (!archivedAction) {
        return res.status(404).json({ error: 'Action not found' });
      }
      res.json({ success: true, message: 'Action archived successfully' });
    } catch (error) {
      console.error(`Error archiving action ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to archive action' });
    }
  });

  // Get nudge suggestions
  app.get('/api/agora/nudges', requireAdmin, async (req: Request, res: Response) => {
    try {
      const businessId = req.query.businessId as string || '00000000-0000-0000-0000-000000000000';
      const nudges = await agoraService.getSuggestedNudges(businessId);
      res.json(nudges);
    } catch (error) {
      console.error(`Error fetching nudges:`, error);
      res.status(500).json({ error: 'Failed to fetch nudges' });
    }
  });

  console.log('✅ Agora routes registered');
}