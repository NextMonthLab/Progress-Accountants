/**
 * Health Controller
 * 
 * This controller handles API requests related to system health monitoring.
 */
import { Request, Response } from 'express';
import { healthMonitor } from '../services/health-monitor';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';

// Initialize DB connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

/**
 * Get health status
 */
export async function getHealthStatus(req: Request, res: Response) {
  try {
    // Get system status from various subsystems
    const apiStatus = await checkApiStatus();
    const databaseStatus = await checkDatabaseStatus();
    const fileStorageStatus = await checkFileStorageStatus();
    const authStatus = await checkAuthStatus();
    
    const overallStatus = 
      apiStatus.healthy && 
      databaseStatus.healthy && 
      fileStorageStatus.healthy && 
      authStatus.healthy ? 'healthy' : 'degraded';
    
    res.status(200).json({
      status: overallStatus,
      timestamp: new Date(),
      services: {
        api: apiStatus,
        database: databaseStatus,
        fileStorage: fileStorageStatus,
        auth: authStatus
      }
    });
  } catch (error) {
    console.error('Error getting health status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve health status',
      timestamp: new Date()
    });
  }
}

/**
 * Get recent incidents
 */
export async function getRecentIncidents(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const incidents = await healthMonitor.getRecentIncidents(limit);
    
    res.status(200).json({
      success: true,
      incidents
    });
  } catch (error) {
    console.error('Error getting recent incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent incidents'
    });
  }
}

/**
 * Get pending admin notifications
 */
export async function getAdminNotifications(req: Request, res: Response) {
  try {
    const notifications = await healthMonitor.getPendingAdminNotifications();
    
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error getting admin notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin notifications'
    });
  }
}

/**
 * Mark notification as delivered
 */
export async function markNotificationDelivered(req: Request, res: Response) {
  try {
    const { notificationId } = req.params;
    
    await healthMonitor.markNotificationDelivered(parseInt(notificationId));
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as delivered'
    });
  } catch (error) {
    console.error('Error marking notification as delivered:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as delivered'
    });
  }
}

/**
 * Resolve an incident
 */
export async function resolveIncident(req: Request, res: Response) {
  try {
    const { incidentId } = req.params;
    
    await healthMonitor.resolveIncident(parseInt(incidentId));
    
    res.status(200).json({
      success: true,
      message: 'Incident resolved successfully'
    });
  } catch (error) {
    console.error('Error resolving incident:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve incident'
    });
  }
}

/**
 * Track an API error
 */
export async function trackApiError(req: Request, res: Response) {
  try {
    const { route, statusCode } = req.body;
    
    if (!route || !statusCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    healthMonitor.trackApiError(route, parseInt(statusCode));
    
    res.status(200).json({
      success: true,
      message: 'API error tracked'
    });
  } catch (error) {
    console.error('Error tracking API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track API error'
    });
  }
}

/**
 * Track page load time
 */
export async function trackPageLoadTime(req: Request, res: Response) {
  try {
    const { page, loadTimeMs } = req.body;
    
    if (!page || !loadTimeMs) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    healthMonitor.trackPageLoadTime(page, parseInt(loadTimeMs));
    
    res.status(200).json({
      success: true,
      message: 'Page load time tracked'
    });
  } catch (error) {
    console.error('Error tracking page load time:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track page load time'
    });
  }
}

/**
 * Track session failure
 */
export async function trackSessionFailure(req: Request, res: Response) {
  try {
    healthMonitor.trackSessionFailure();
    
    res.status(200).json({
      success: true,
      message: 'Session failure tracked'
    });
  } catch (error) {
    console.error('Error tracking session failure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track session failure'
    });
  }
}

/**
 * Track media upload
 */
export async function trackMediaUpload(req: Request, res: Response) {
  try {
    const { success } = req.body;
    
    if (success === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    healthMonitor.trackMediaUpload(success === true);
    
    res.status(200).json({
      success: true,
      message: 'Media upload tracked'
    });
  } catch (error) {
    console.error('Error tracking media upload:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track media upload'
    });
  }
}

/**
 * Get system health metrics
 */
export async function getHealthMetrics(req: Request, res: Response) {
  try {
    // Get all metrics from the database
    const metrics = await db.execute(sql`
      SELECT * FROM health_metrics
      ORDER BY category, name
    `);
    
    res.status(200).json({
      success: true,
      metrics: metrics.rows
    });
  } catch (error) {
    console.error('Error getting health metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health metrics'
    });
  }
}

/**
 * Update health metric
 */
export async function updateHealthMetric(req: Request, res: Response) {
  try {
    const { metricId } = req.params;
    const { enabled, threshold } = req.body;
    
    // Build SET clause for the update
    const updates = [];
    const values = [];
    
    if (enabled !== undefined) {
      updates.push('enabled = $1');
      values.push(enabled);
    }
    
    if (threshold !== undefined) {
      updates.push('threshold = $2');
      values.push(JSON.stringify(threshold));
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided'
      });
    }
    
    // Add the WHERE clause
    updates.push(`id = $${values.length + 1}`);
    values.push(parseInt(metricId));
    
    // Update the metric
    await db.execute(sql`
      UPDATE health_metrics 
      SET ${sql.raw(updates.join(', '))}
      WHERE id = ${parseInt(metricId)}
    `);
    
    res.status(200).json({
      success: true,
      message: 'Health metric updated successfully'
    });
  } catch (error) {
    console.error('Error updating health metric:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health metric'
    });
  }
}

/**
 * Get metric history (for graphs)
 */
export async function getMetricHistory(req: Request, res: Response) {
  try {
    const { metricId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    
    // Get metric logs from the database
    const logs = await db.execute(sql`
      SELECT * FROM health_metric_logs
      WHERE metric_id = ${parseInt(metricId)}
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `);
    
    res.status(200).json({
      success: true,
      history: logs.rows
    });
  } catch (error) {
    console.error('Error getting metric history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metric history'
    });
  }
}

// Helper functions to check various system components

/**
 * Check API status
 */
async function checkApiStatus() {
  try {
    // In a real implementation, we would make sample API calls to key endpoints
    // and verify they are functioning properly.
    return {
      healthy: true,
      lastChecked: new Date()
    };
  } catch (error) {
    console.error('API health check failed:', error);
    return {
      healthy: false,
      lastChecked: new Date(),
      error: 'API health check failed'
    };
  }
}

/**
 * Check database status
 */
async function checkDatabaseStatus() {
  try {
    // Execute a simple query to ensure the database is responsive
    await db.execute(sql`SELECT 1`);
    
    return {
      healthy: true,
      lastChecked: new Date()
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      healthy: false,
      lastChecked: new Date(),
      error: 'Database health check failed'
    };
  }
}

/**
 * Check file storage status
 */
async function checkFileStorageStatus() {
  try {
    // In a real implementation, we would check that the file storage system
    // is accessible and functioning properly.
    return {
      healthy: true,
      lastChecked: new Date()
    };
  } catch (error) {
    console.error('File storage health check failed:', error);
    return {
      healthy: false,
      lastChecked: new Date(),
      error: 'File storage health check failed'
    };
  }
}

/**
 * Check authentication status
 */
async function checkAuthStatus() {
  try {
    // In a real implementation, we would verify that the authentication system
    // is functioning properly.
    return {
      healthy: true,
      lastChecked: new Date()
    };
  } catch (error) {
    console.error('Auth health check failed:', error);
    return {
      healthy: false,
      lastChecked: new Date(),
      error: 'Auth health check failed'
    };
  }
}