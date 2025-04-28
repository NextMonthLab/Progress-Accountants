import express from 'express';
import { sotController } from '../controllers/sotController';

/**
 * Register SOT (Single Source of Truth) API routes
 */
export function registerSotRoutes(app: express.Express) {
  const router = express.Router();
  
  // SOT Client Profile routes
  router.get('/client-profile/:businessId?', sotController.getClientProfile.bind(sotController));
  router.post('/client-profile', sotController.saveClientProfile.bind(sotController));
  
  // SOT Sync routes
  router.post('/sync/trigger', sotController.triggerSync.bind(sotController));
  router.post('/sync/start-scheduler', sotController.startScheduledSync.bind(sotController));
  router.post('/sync/stop-scheduler', sotController.stopScheduledSync.bind(sotController));
  router.get('/sync/logs', sotController.getSyncLogs.bind(sotController));
  
  // SOT API route prefix
  app.use('/api/sot', router);
  
  console.log('✅ SOT routes registered');
}