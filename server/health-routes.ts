/**
 * Health Monitoring Routes
 */
import { Express } from 'express';
import { isAuthenticated } from './middleware/auth';
import { requireRole } from './middleware/rbac';
import {
  getHealthStatus,
  getRecentIncidents,
  getAdminNotifications,
  markNotificationDelivered,
  resolveIncident,
  trackApiError,
  trackPageLoadTime,
  trackSessionFailure,
  trackMediaUpload,
  getHealthMetrics,
  updateHealthMetric,
  getMetricHistory
} from './controllers/healthController';
import { healthMonitor } from './services/health-monitor';

export async function registerHealthRoutes(app: Express) {
  console.log('Registering Health Monitoring routes...');

  // Start the health monitoring service
  try {
    await healthMonitor.start();
  } catch (error) {
    console.error('Error starting health monitoring service:', error);
    // We'll continue setting up the routes, the service will retry later
  }

  // Public health endpoint (for status checks)
  app.get('/api/health', getHealthStatus);

  // Tracking endpoints - these don't need authentication as they're called from client-side
  app.post('/api/health/track/api-error', trackApiError);
  app.post('/api/health/track/page-load', trackPageLoadTime);
  app.post('/api/health/track/session-failure', trackSessionFailure);
  app.post('/api/health/track/media-upload', trackMediaUpload);

  // Admin endpoints - these require authentication and admin role
  app.get(
    '/api/admin/health/incidents',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    getRecentIncidents
  );

  app.get(
    '/api/admin/health/notifications',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    getAdminNotifications
  );

  app.post(
    '/api/admin/health/notifications/:notificationId/deliver',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    markNotificationDelivered
  );

  app.post(
    '/api/admin/health/incidents/:incidentId/resolve',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    resolveIncident
  );

  app.get(
    '/api/admin/health/metrics',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    getHealthMetrics
  );

  app.put(
    '/api/admin/health/metrics/:metricId',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    updateHealthMetric
  );

  app.get(
    '/api/admin/health/metrics/:metricId/history',
    isAuthenticated,
    requireRole(['admin', 'super_admin'] as any),
    getMetricHistory
  );

  console.log('✅ Health Monitoring routes registered');
}