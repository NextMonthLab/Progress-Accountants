import express from 'express';
import { sotController } from '../controllers/sotController';
import { sotSyncService } from '../services/sot-sync';
import { logger } from '../utils/logger';

// Create the router
const sotRouter = express.Router();

/**
 * SOT Routes
 * These routes handle the Source of Truth integration API
 */

// Declarations
sotRouter.post('/declarations', sotController.registerDeclaration.bind(sotController));
sotRouter.get('/declarations', sotController.getDeclarations.bind(sotController));
sotRouter.get('/declarations/:instanceId', sotController.getDeclaration.bind(sotController));
sotRouter.patch('/declarations/:instanceId/template', sotController.updateAsTemplate.bind(sotController));

// Client Profiles
sotRouter.get('/profiles', sotController.getClientProfiles.bind(sotController));
sotRouter.get('/profiles/:businessId', sotController.getClientProfile.bind(sotController));

// Sync operations
sotRouter.post('/sync', sotController.syncNow.bind(sotController));
sotRouter.get('/sync/status', sotController.getSyncStatus.bind(sotController));
sotRouter.patch('/sync/schedule', sotController.updateSyncSchedule.bind(sotController));

// Metrics
sotRouter.get('/metrics', sotController.getMetrics.bind(sotController));

/**
 * Register SOT routes with the app
 */
export function registerSotRoutes(app: express.Express): void {
  // Mount the SOT routes under /api/sot
  app.use('/api/sot', sotRouter);
  
  // Start the SOT sync service
  sotSyncService.start();
  
  logger.info('SOT routes registered and sync service started');
}