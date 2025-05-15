import { Router, Express } from 'express';
import { agoraService } from '../services/agoraService';
import { z } from 'zod';
import { insertPillarSchema, insertSpaceSchema } from '@shared/agora';

const agoraRouter = Router();

export const registerAgoraRoutes = (app: Express) => {
  app.use('/api/agora', agoraRouter);
  console.log('✅ Agora routes registered');
};

// Authentication middleware to ensure user is logged in
const ensureAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
};

// Get the tenant or business ID for the current request
const getBusinessId = (req: Express.Request): string => {
  // In a real scenario, this would come from the authenticated user's context
  // For demo purposes, we'll use a hardcoded value or from query params
  return req.query.businessId || '00000000-0000-0000-0000-000000000000';
};

// Get all pillars
agoraRouter.get('/pillars', ensureAuthenticated, async (req, res) => {
  try {
    const businessId = getBusinessId(req);
    const pillars = await agoraService.getPillars(businessId);
    res.json(pillars);
  } catch (error) {
    console.error('Error getting pillars:', error);
    res.status(500).json({ error: 'Failed to retrieve pillars' });
  }
});

// Create a new pillar
agoraRouter.post('/pillars', ensureAuthenticated, async (req, res) => {
  try {
    const businessId = getBusinessId(req);
    
    // Validate the input data
    const validationResult = insertPillarSchema.safeParse({
      ...req.body,
      businessId
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid pillar data', 
        details: validationResult.error.issues 
      });
    }
    
    const pillar = await agoraService.createPillar(validationResult.data);
    res.status(201).json(pillar);
  } catch (error) {
    console.error('Error creating pillar:', error);
    res.status(500).json({ error: 'Failed to create pillar' });
  }
});

// Update a pillar
agoraRouter.patch('/pillars/:pillarId', ensureAuthenticated, async (req, res) => {
  try {
    const { pillarId } = req.params;
    
    // Validate the update data (partial schema)
    const updateSchema = insertPillarSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid pillar data', 
        details: validationResult.error.issues 
      });
    }
    
    const pillar = await agoraService.updatePillar(pillarId, validationResult.data);
    
    if (!pillar) {
      return res.status(404).json({ error: 'Pillar not found' });
    }
    
    res.json(pillar);
  } catch (error) {
    console.error('Error updating pillar:', error);
    res.status(500).json({ error: 'Failed to update pillar' });
  }
});

// Archive a pillar
agoraRouter.delete('/pillars/:pillarId', ensureAuthenticated, async (req, res) => {
  try {
    const { pillarId } = req.params;
    const success = await agoraService.archivePillar(pillarId);
    
    if (!success) {
      return res.status(404).json({ error: 'Pillar not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error archiving pillar:', error);
    res.status(500).json({ error: 'Failed to archive pillar' });
  }
});

// Get all spaces, optionally filtered by pillar
agoraRouter.get('/spaces', ensureAuthenticated, async (req, res) => {
  try {
    const businessId = getBusinessId(req);
    const { pillarId } = req.query;
    
    const spaces = await agoraService.getSpaces(
      businessId, 
      typeof pillarId === 'string' ? pillarId : undefined
    );
    
    res.json(spaces);
  } catch (error) {
    console.error('Error getting spaces:', error);
    res.status(500).json({ error: 'Failed to retrieve spaces' });
  }
});

// Get spaces for a specific pillar
agoraRouter.get('/pillars/:pillarId/spaces', ensureAuthenticated, async (req, res) => {
  try {
    const businessId = getBusinessId(req);
    const { pillarId } = req.params;
    
    const spaces = await agoraService.getSpaces(businessId, pillarId);
    res.json(spaces);
  } catch (error) {
    console.error('Error getting spaces for pillar:', error);
    res.status(500).json({ error: 'Failed to retrieve spaces for pillar' });
  }
});

// Create a new space
agoraRouter.post('/spaces', ensureAuthenticated, async (req, res) => {
  try {
    const businessId = getBusinessId(req);
    
    // Validate the input data
    const validationResult = insertSpaceSchema.safeParse({
      ...req.body,
      businessId
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid space data', 
        details: validationResult.error.issues 
      });
    }
    
    const space = await agoraService.createSpace(validationResult.data);
    res.status(201).json(space);
  } catch (error) {
    console.error('Error creating space:', error);
    res.status(500).json({ error: 'Failed to create space' });
  }
});

// Update a space
agoraRouter.patch('/spaces/:spaceId', ensureAuthenticated, async (req, res) => {
  try {
    const { spaceId } = req.params;
    
    // Validate the update data (partial schema)
    const updateSchema = insertSpaceSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid space data', 
        details: validationResult.error.issues 
      });
    }
    
    const space = await agoraService.updateSpace(spaceId, validationResult.data);
    
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    
    res.json(space);
  } catch (error) {
    console.error('Error updating space:', error);
    res.status(500).json({ error: 'Failed to update space' });
  }
});

// Archive a space
agoraRouter.delete('/spaces/:spaceId', ensureAuthenticated, async (req, res) => {
  try {
    const { spaceId } = req.params;
    const success = await agoraService.archiveSpace(spaceId);
    
    if (!success) {
      return res.status(404).json({ error: 'Space not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error archiving space:', error);
    res.status(500).json({ error: 'Failed to archive space' });
  }
});

// Get whisper nudges for the business
agoraRouter.get('/nudges', ensureAuthenticated, async (req, res) => {
  try {
    const businessId = getBusinessId(req);
    const nudges = await agoraService.getWhisperNudges(businessId);
    res.json(nudges);
  } catch (error) {
    console.error('Error getting whisper nudges:', error);
    res.status(500).json({ error: 'Failed to retrieve whisper nudges' });
  }
});

// Additional routes for space notes and actions could be added here