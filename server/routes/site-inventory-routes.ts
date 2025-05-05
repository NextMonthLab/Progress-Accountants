import express, { Request, Response } from 'express';
import { siteInventoryService } from '../services/site-inventory-service';
import { isAuthenticated } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const inventoryLogger = logger.child('inventory');

/**
 * GET /api/site-inventory
 * 
 * Get a complete snapshot of the site's structure, content, and visit data
 */
router.get('/site-inventory', async (req: Request, res: Response) => {
  try {
    const snapshot = await siteInventoryService.generateSnapshot();
    return res.json(snapshot);
  } catch (error: any) {
    inventoryLogger.error('Error in site inventory endpoint', error);
    return res.status(500).json({ 
      error: 'Failed to generate site inventory',
      message: error.message 
    });
  }
});

/**
 * POST /api/site-inventory/save
 * 
 * Generate and save a site inventory snapshot to the attached_assets folder
 * Requires admin access
 */
router.post('/site-inventory/save', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const snapshot = await siteInventoryService.generateSnapshot();
    const savedPath = await siteInventoryService.saveSnapshot(snapshot);
    
    return res.json({ 
      success: true, 
      message: 'Site inventory snapshot saved successfully',
      path: savedPath,
      snapshot 
    });
  } catch (error: any) {
    inventoryLogger.error('Error saving site inventory snapshot', error);
    return res.status(500).json({ 
      error: 'Failed to save site inventory snapshot',
      message: error.message 
    });
  }
});

/**
 * Register site inventory routes
 */
export function registerSiteInventoryRoutes(app: express.Express): void {
  app.use('/api', router);
  inventoryLogger.info('Site inventory routes registered');
}