import { Request, Response } from 'express';
import { storage } from '../storage';
import { Express } from 'express';
import { insertSotDeclarationSchema, insertSotMetricSchema } from '@shared/sot';

/**
 * Register SOT API routes
 */
export function registerSotRoutes(app: Express) {
  console.log('Registering SOT routes...');
  
  // SOT Declaration endpoints
  app.get('/api/sot/declaration', getSotDeclaration);
  app.post('/api/sot/declaration', createSotDeclaration);
  app.put('/api/sot/declaration/:id', updateSotDeclaration);
  
  // SOT Metrics endpoints
  app.get('/api/sot/metrics', getSotMetrics);
  app.post('/api/sot/metrics', saveSotMetrics);
  app.put('/api/sot/metrics/:id', updateSotMetrics);
  
  // SOT Sync Logs endpoints
  app.get('/api/sot/logs', getSyncLogs);
  app.post('/api/sot/logs', createSyncLog);
  
  // SOT Actions
  app.post('/api/sot/sync', triggerSync);
  
  console.log('✅ SOT routes registered');
}

/**
 * Get the current SOT declaration
 */
export async function getSotDeclaration(req: Request, res: Response) {
  try {
    const declaration = await storage.getSotDeclaration();
    
    if (!declaration) {
      return res.status(404).json({ error: 'SOT declaration not found' });
    }
    
    res.status(200).json(declaration);
  } catch (error) {
    console.error('Error fetching SOT declaration:', error);
    res.status(500).json({ error: 'Failed to fetch SOT declaration' });
  }
}

/**
 * Create a new SOT declaration
 */
export async function createSotDeclaration(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = insertSotDeclarationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid SOT declaration data', 
        details: validationResult.error.format() 
      });
    }
    
    // Save the declaration
    const declaration = await storage.saveSotDeclaration(req.body);
    
    // Log the event
    await storage.logSotSync('create_declaration', 'success', 'Created SOT declaration');
    
    res.status(201).json(declaration);
  } catch (error) {
    console.error('Error creating SOT declaration:', error);
    await storage.logSotSync('create_declaration', 'error', 'Failed to create SOT declaration');
    res.status(500).json({ error: 'Failed to create SOT declaration' });
  }
}

/**
 * Update an existing SOT declaration
 */
export async function updateSotDeclaration(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    // Check if declaration exists
    const existing = await storage.getSotDeclaration();
    
    if (!existing || existing.id !== id) {
      return res.status(404).json({ error: 'SOT declaration not found' });
    }
    
    // Update the declaration
    const updated = await storage.updateSotDeclaration(id, req.body);
    
    // Log the event
    await storage.logSotSync('update_declaration', 'success', `Updated SOT declaration ID: ${id}`);
    
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating SOT declaration:', error);
    await storage.logSotSync('update_declaration', 'error', 'Failed to update SOT declaration');
    res.status(500).json({ error: 'Failed to update SOT declaration' });
  }
}

/**
 * Get the current SOT metrics
 */
export async function getSotMetrics(req: Request, res: Response) {
  try {
    const metrics = await storage.getSotMetrics();
    
    if (!metrics) {
      return res.status(404).json({ error: 'SOT metrics not found' });
    }
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching SOT metrics:', error);
    res.status(500).json({ error: 'Failed to fetch SOT metrics' });
  }
}

/**
 * Save new SOT metrics
 */
export async function saveSotMetrics(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = insertSotMetricSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid SOT metrics data', 
        details: validationResult.error.format() 
      });
    }
    
    // Save the metrics
    const metrics = await storage.saveSotMetrics(req.body);
    
    // Log the event
    await storage.logSotSync('create_metrics', 'success', 'Created SOT metrics');
    
    res.status(201).json(metrics);
  } catch (error) {
    console.error('Error creating SOT metrics:', error);
    await storage.logSotSync('create_metrics', 'error', 'Failed to create SOT metrics');
    res.status(500).json({ error: 'Failed to create SOT metrics' });
  }
}

/**
 * Update existing SOT metrics
 */
export async function updateSotMetrics(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    // Check if metrics exist
    const existing = await storage.getSotMetrics();
    
    if (!existing || existing.id !== id) {
      return res.status(404).json({ error: 'SOT metrics not found' });
    }
    
    // Update the metrics
    const updated = await storage.updateSotMetrics(id, req.body);
    
    // Log the event
    await storage.logSotSync('update_metrics', 'success', `Updated SOT metrics ID: ${id}`);
    
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating SOT metrics:', error);
    await storage.logSotSync('update_metrics', 'error', 'Failed to update SOT metrics');
    res.status(500).json({ error: 'Failed to update SOT metrics' });
  }
}

/**
 * Get SOT sync logs
 */
export async function getSyncLogs(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const logs = await storage.getSotSyncLogs(limit);
    
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching SOT sync logs:', error);
    res.status(500).json({ error: 'Failed to fetch SOT sync logs' });
  }
}

/**
 * Create a new sync log entry
 */
export async function createSyncLog(req: Request, res: Response) {
  try {
    const { eventType, status, details } = req.body;
    
    if (!eventType || !status) {
      return res.status(400).json({ error: 'Event type and status are required' });
    }
    
    const log = await storage.logSotSync(eventType, status, details);
    
    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating SOT sync log:', error);
    res.status(500).json({ error: 'Failed to create SOT sync log' });
  }
}

/**
 * Trigger a sync with the SOT system
 */
export async function triggerSync(req: Request, res: Response) {
  try {
    // Get the current declaration
    const declaration = await storage.getSotDeclaration();
    
    if (!declaration) {
      return res.status(404).json({ error: 'SOT declaration not found. Please create a declaration first.' });
    }
    
    // Collect metrics for sync
    const totalPages = await countTotalPages();
    const installedTools = await getInstalledToolsList();
    
    // Update metrics
    let metrics = await storage.getSotMetrics();
    
    if (metrics) {
      metrics = await storage.updateSotMetrics(metrics.id, {
        totalPages,
        installedTools,
        lastSyncAt: new Date()
      });
    } else {
      // For first-time creation, we need to include the id field
      metrics = await storage.saveSotMetrics({
        id: 1, // Default id for first record
        totalPages,
        installedTools,
        lastSyncAt: new Date()
      });
    }
    
    // Update declaration last sync time
    await storage.updateSotDeclaration(declaration.id, {
      lastSyncAt: new Date()
    });
    
    // Log the sync event
    await storage.logSotSync('manual_sync', 'success', 'Manual sync triggered successfully');
    
    res.status(200).json({ 
      success: true, 
      message: 'Sync with SOT completed successfully',
      declaration,
      metrics
    });
  } catch (error: any) {
    console.error('Error during SOT sync:', error);
    await storage.logSotSync('manual_sync', 'error', `Sync failed: ${error.message || 'Unknown error'}`);
    res.status(500).json({ error: 'Failed to sync with SOT system' });
  }
}

/**
 * Helper to count the total number of pages in the system
 */
async function countTotalPages(): Promise<number> {
  // This would be implemented to query the pages table
  // For now, we'll return a mock count
  return 10;
}

/**
 * Helper to get a list of installed tools
 */
async function getInstalledToolsList(): Promise<string[]> {
  // This would be implemented to query the tools table
  // For now, we'll return a mock list
  return ['page_builder', 'analytics', 'seo_optimizer'];
}