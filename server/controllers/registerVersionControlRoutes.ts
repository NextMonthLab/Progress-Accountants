/**
 * Register Version Control Routes
 * 
 * Sets up all routes related to version control functionality
 */

import { Express } from 'express';
import * as versionControlController from './versionControlController';
// Using Express built-in authentication middleware

export function registerVersionControlRoutes(app: Express) {
  // Create a new version
  app.post('/api/versions', versionControlController.createVersion);
  
  // Get version history for an entity
  app.get('/api/versions/:entityType/:entityId', versionControlController.getVersionHistory);
  
  // Get a specific version
  app.get('/api/versions/version/:versionId', versionControlController.getVersion);
  
  // Get the latest version of an entity
  app.get('/api/versions/latest/:entityType/:entityId', versionControlController.getLatestVersion);
  
  // Restore a specific version
  app.post('/api/versions/restore/:versionId', versionControlController.restoreVersion);
  
  // Update version status
  app.patch('/api/versions/:versionId/status', versionControlController.updateVersionStatus);
  
  // Get version activity log
  app.get('/api/versions/activity/:entityType/:entityId', versionControlController.getVersionActivityLog);
  
  // Compare two versions
  app.get('/api/versions/compare/:versionId1/:versionId2', versionControlController.compareVersions);
  
  console.log('✅ Version control routes registered');
}