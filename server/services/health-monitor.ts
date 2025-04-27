/**
 * Health Monitoring Service
 * 
 * This service is responsible for monitoring key system health metrics
 * and triggering alerts when thresholds are exceeded.
 */
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import { performance } from 'perf_hooks';
import { EventEmitter } from 'events';

// Health monitoring events
export const healthEvents = new EventEmitter();

// Define metric types
export type MetricCategory = 'api' | 'performance' | 'security' | 'storage';

export interface HealthMetric {
  id: number;
  name: string;
  category: MetricCategory;
  description: string;
  threshold: any;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthIncident {
  id?: number;
  metricId: number;
  status: 'active' | 'resolved' | 'acknowledged';
  severity: 'warning' | 'critical' | 'info';
  affectedArea: string;
  affectedUsers: number;
  details: any;
  detectedAt: Date;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HealthNotification {
  id?: number;
  incidentId: number;
  userId?: number;
  type: 'admin' | 'user';
  status: 'pending' | 'delivered' | 'dismissed';
  message: string;
  createdAt?: Date;
  deliveredAt?: Date;
  dismissedAt?: Date;
}

export interface MetricLog {
  metricId: number;
  value: any;
  timestamp?: Date;
}

// Initialize DB connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

/**
 * Health Monitoring Service Class
 */
export class HealthMonitorService {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private static instance: HealthMonitorService;
  private performanceMetrics: Map<string, any[]> = new Map();
  private apiErrorCounts: Map<string, number[]> = new Map(); // Store timestamps of errors
  private sessionFailures: number[] = []; // Store timestamps of session failures
  private uploadFailures: { success: boolean; timestamp: number }[] = [];

  private constructor() {
    // Initialize the Maps for various metrics
    this.performanceMetrics.set('dashboard_load_time', []);
    
    // Set up routes to monitor for errors
    const monitoredRoutes = ['/media-upload', '/bookings', '/portal'];
    monitoredRoutes.forEach(route => {
      this.apiErrorCounts.set(route, []);
    });
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): HealthMonitorService {
    if (!HealthMonitorService.instance) {
      HealthMonitorService.instance = new HealthMonitorService();
    }
    return HealthMonitorService.instance;
  }

  /**
   * Start the health monitoring service
   */
  public async start(intervalMs: number = 60000): Promise<void> {
    if (this.monitoringInterval) {
      console.log('Health monitoring is already running');
      return;
    }

    console.log(`Starting health monitoring service (interval: ${intervalMs}ms)`);
    
    try {
      // Check if tables exist first
      const tablesExist = await this.checkTablesExist();
      
      if (!tablesExist) {
        console.log('Health monitoring tables not ready. Service will wait for migrations to complete.');
        // Try again in 10 seconds
        setTimeout(() => this.start(intervalMs), 10000);
        return;
      }
      
      // Run an initial check
      this.performHealthChecks();
      
      // Set up the monitoring interval
      this.monitoringInterval = setInterval(() => {
        this.performHealthChecks();
      }, intervalMs);
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('Health monitoring service started successfully');
    } catch (error) {
      console.error('Error starting health monitoring service:', error);
      // Try again in 10 seconds
      setTimeout(() => this.start(intervalMs), 10000);
    }
  }
  
  /**
   * Check if required tables exist
   */
  private async checkTablesExist(): Promise<boolean> {
    try {
      // Try to query for health_metrics table
      await db.execute(sql`SELECT 1 FROM health_metrics LIMIT 1`);
      return true;
    } catch (error) {
      // Table doesn't exist or other DB error
      return false;
    }
  }

  /**
   * Stop the health monitoring service
   */
  public stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Health monitoring stopped');
    }
  }

  /**
   * Track API error
   */
  public trackApiError(route: string, statusCode: number): void {
    if (statusCode >= 500) {
      const errors = this.apiErrorCounts.get(route) || [];
      errors.push(Date.now());
      this.apiErrorCounts.set(route, errors);
    }
  }

  /**
   * Track page load time
   */
  public trackPageLoadTime(page: string, loadTimeMs: number): void {
    if (page.includes('dashboard')) {
      const metrics = this.performanceMetrics.get('dashboard_load_time') || [];
      metrics.push({ timestamp: Date.now(), loadTime: loadTimeMs });
      this.performanceMetrics.set('dashboard_load_time', metrics);
    }
  }

  /**
   * Track session failure
   */
  public trackSessionFailure(): void {
    this.sessionFailures.push(Date.now());
  }

  /**
   * Track media upload
   */
  public trackMediaUpload(success: boolean): void {
    this.uploadFailures.push({ success, timestamp: Date.now() });
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for new incidents
    healthEvents.on('incident-created', (incident: HealthIncident) => {
      this.createNotification(incident);
    });
  }

  /**
   * Perform all health checks
   */
  private async performHealthChecks(): Promise<void> {
    try {
      // Get all enabled metrics
      const metrics = await this.getEnabledMetrics();
      
      for (const metric of metrics) {
        await this.evaluateMetric(metric);
      }
      
      // Clean up old data
      this.cleanupMetricData();
    } catch (error) {
      console.error('Error performing health checks:', error);
    }
  }

  /**
   * Evaluate a single metric
   */
  private async evaluateMetric(metric: HealthMetric): Promise<void> {
    try {
      let value = null;
      let exceededThreshold = false;
      let details = {};
      
      switch (metric.name) {
        case 'api_error_rate':
          const result = this.checkApiErrorRates(metric.threshold);
          value = result.value;
          exceededThreshold = result.exceeded;
          details = result.details;
          break;
          
        case 'dashboard_load_time':
          const loadTimeResult = this.checkDashboardLoadTimes(metric.threshold);
          value = loadTimeResult.value;
          exceededThreshold = loadTimeResult.exceeded;
          details = loadTimeResult.details;
          break;
          
        case 'login_failure_rate':
          const sessionResult = this.checkSessionFailures(metric.threshold);
          value = sessionResult.value;
          exceededThreshold = sessionResult.exceeded;
          details = sessionResult.details;
          break;
          
        case 'media_upload_failure':
          const uploadResult = this.checkMediaUploadFailures(metric.threshold);
          value = uploadResult.value;
          exceededThreshold = uploadResult.exceeded;
          details = uploadResult.details;
          break;
      }
      
      // Log the metric value
      await this.logMetricValue(metric.id, { value, details });
      
      // Check if we need to create an incident
      if (exceededThreshold) {
        await this.createIncident(metric, value, details);
      }
    } catch (error) {
      console.error(`Error evaluating metric ${metric.name}:`, error);
    }
  }

  /**
   * Check API error rates
   */
  private checkApiErrorRates(threshold: any): { value: number, exceeded: boolean, details: any } {
    const routes = threshold.routes || [];
    const errorCount = threshold.error_count || 5;
    const timeWindow = (threshold.time_window || 300) * 1000; // Convert to ms
    const now = Date.now();
    
    let totalErrors = 0;
    const routeDetails: Record<string, number> = {};
    
    for (const route of routes) {
      const errors = this.apiErrorCounts.get(route) || [];
      const recentErrors = errors.filter(timestamp => (now - timestamp) <= timeWindow);
      routeDetails[route] = recentErrors.length;
      totalErrors += recentErrors.length;
    }
    
    return {
      value: totalErrors,
      exceeded: totalErrors >= errorCount,
      details: {
        routeDetails,
        timeWindow: threshold.time_window,
        threshold: errorCount
      }
    };
  }

  /**
   * Check dashboard load times
   */
  private checkDashboardLoadTimes(threshold: any): { value: number, exceeded: boolean, details: any } {
    const maxLoadTime = threshold.max_load_time || 3000; // 3 seconds
    const sampleSize = threshold.sample_size || 10;
    const now = Date.now();
    const timeWindow = 10 * 60 * 1000; // Last 10 minutes
    
    const metrics = this.performanceMetrics.get('dashboard_load_time') || [];
    const recentMetrics = metrics
      .filter(m => (now - m.timestamp) <= timeWindow)
      .slice(-sampleSize);
    
    if (recentMetrics.length === 0) {
      return {
        value: 0,
        exceeded: false,
        details: {
          sampleSize: 0,
          averageLoadTime: 0,
          threshold: maxLoadTime
        }
      };
    }
    
    const avgLoadTime = recentMetrics.reduce((sum, m) => sum + m.loadTime, 0) / recentMetrics.length;
    
    return {
      value: avgLoadTime,
      exceeded: avgLoadTime > maxLoadTime,
      details: {
        sampleSize: recentMetrics.length,
        averageLoadTime: avgLoadTime,
        threshold: maxLoadTime
      }
    };
  }

  /**
   * Check session failures
   */
  private checkSessionFailures(threshold: any): { value: number, exceeded: boolean, details: any } {
    const maxFailureRate = threshold.failure_rate || 0.1; // 10%
    const timeWindow = (threshold.time_window || 600) * 1000; // Convert to ms
    const now = Date.now();
    
    const recentFailures = this.sessionFailures.filter(timestamp => (now - timestamp) <= timeWindow);
    
    // Simple calculation - we're just checking volume of failures
    // In a real implementation, you would compare against success rate
    const failureRate = recentFailures.length / 10; // Assuming 10 login attempts is normal
    
    return {
      value: failureRate,
      exceeded: failureRate > maxFailureRate,
      details: {
        failureCount: recentFailures.length,
        timeWindow: threshold.time_window,
        threshold: maxFailureRate
      }
    };
  }

  /**
   * Check media upload failures
   */
  private checkMediaUploadFailures(threshold: any): { value: number, exceeded: boolean, details: any } {
    const maxFailureRate = threshold.failure_rate || 0.1; // 10%
    const timeWindow = (threshold.time_window || 600) * 1000; // Convert to ms
    const now = Date.now();
    
    const recentUploads = this.uploadFailures.filter(u => (now - u.timestamp) <= timeWindow);
    
    if (recentUploads.length === 0) {
      return {
        value: 0,
        exceeded: false,
        details: {
          uploadCount: 0,
          failureCount: 0,
          timeWindow: threshold.time_window,
          threshold: maxFailureRate
        }
      };
    }
    
    const failureCount = recentUploads.filter(u => !u.success).length;
    const failureRate = failureCount / recentUploads.length;
    
    return {
      value: failureRate,
      exceeded: failureRate > maxFailureRate,
      details: {
        uploadCount: recentUploads.length,
        failureCount,
        timeWindow: threshold.time_window,
        threshold: maxFailureRate
      }
    };
  }

  /**
   * Clean up old metric data
   */
  private cleanupMetricData(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    // Clean up API error counts
    for (const [route, errors] of this.apiErrorCounts.entries()) {
      this.apiErrorCounts.set(route, errors.filter(timestamp => timestamp > oneHourAgo));
    }
    
    // Clean up session failures
    this.sessionFailures = this.sessionFailures.filter(timestamp => timestamp > oneHourAgo);
    
    // Clean up upload failures
    this.uploadFailures = this.uploadFailures.filter(u => u.timestamp > oneHourAgo);
    
    // Clean up performance metrics
    for (const [key, metrics] of this.performanceMetrics.entries()) {
      this.performanceMetrics.set(
        key,
        metrics.filter(m => m.timestamp > oneHourAgo)
      );
    }
  }

  /**
   * Get all enabled metrics
   */
  private async getEnabledMetrics(): Promise<HealthMetric[]> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM health_metrics WHERE enabled = true
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        threshold: row.threshold,
        enabled: row.enabled,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching enabled metrics:', error);
      return [];
    }
  }

  /**
   * Log a metric value
   */
  private async logMetricValue(metricId: number, value: any): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO health_metric_logs (metric_id, value)
        VALUES (${metricId}, ${JSON.stringify(value)})
      `);
    } catch (error) {
      console.error('Error logging metric value:', error);
    }
  }

  /**
   * Create an incident
   */
  private async createIncident(metric: HealthMetric, value: any, details: any): Promise<void> {
    try {
      // Check if there's already an active incident for this metric
      const activeIncidents = await db.execute(sql`
        SELECT * FROM health_incidents 
        WHERE metric_id = ${metric.id} 
        AND status = 'active'
      `);
      
      if (activeIncidents.rows.length > 0) {
        // Incident already exists, don't create a new one
        return;
      }
      
      // Create a new incident
      const severity = value > (metric.threshold * 2) ? 'critical' : 'warning';
      
      const affectedArea = (() => {
        switch (metric.name) {
          case 'api_error_rate':
            return 'API Services';
          case 'dashboard_load_time':
            return 'Dashboard Performance';
          case 'login_failure_rate':
            return 'User Authentication';
          case 'media_upload_failure':
            return 'Media Upload System';
          default:
            return 'General System';
        }
      })();
      
      // Estimate affected users
      const affectedUsers = Math.floor(Math.random() * 10) + 1; // Placeholder logic
      
      const incident = {
        metricId: metric.id,
        status: 'active',
        severity,
        affectedArea,
        affectedUsers,
        details: {
          ...details,
          metricName: metric.name,
          metricCategory: metric.category,
          value
        },
        detectedAt: new Date()
      } as HealthIncident;
      
      const result = await db.execute(sql`
        INSERT INTO health_incidents (
          metric_id, status, severity, affected_area, affected_users, details, detected_at
        ) VALUES (
          ${incident.metricId}, 
          ${incident.status}, 
          ${incident.severity}, 
          ${incident.affectedArea}, 
          ${incident.affectedUsers}, 
          ${JSON.stringify(incident.details)}, 
          ${incident.detectedAt}
        ) RETURNING id
      `);
      
      const incidentId = result.rows[0].id;
      
      // Emit incident created event
      incident.id = incidentId;
      healthEvents.emit('incident-created', incident);
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  }

  /**
   * Create a notification for an incident
   */
  private async createNotification(incident: HealthIncident): Promise<void> {
    if (!incident.id) return;
    
    try {
      // Create admin notification
      const adminMessage = this.generateAdminMessage(incident);
      
      await db.execute(sql`
        INSERT INTO health_notifications (
          incident_id, type, status, message
        ) VALUES (
          ${incident.id}, 'admin', 'pending', ${adminMessage}
        )
      `);
      
      // Create user notification if needed
      if (incident.severity === 'critical') {
        const userMessage = this.generateUserMessage(incident);
        
        await db.execute(sql`
          INSERT INTO health_notifications (
            incident_id, type, status, message
          ) VALUES (
            ${incident.id}, 'user', 'pending', ${userMessage}
          )
        `);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  /**
   * Generate message for admin notification
   */
  private generateAdminMessage(incident: HealthIncident): string {
    const severityIcon = incident.severity === 'critical' ? '⚠️' : '⚡';
    
    return `${severityIcon} Health Alert:
${incident.affectedArea} has exceeded safe thresholds.
Impact detected for ${incident.affectedUsers} users.
Monitoring active.`;
  }

  /**
   * Generate message for user notification
   */
  private generateUserMessage(incident: HealthIncident): string {
    return `We're refreshing part of the system to ensure optimal performance.
Please retry shortly — everything's under active care.`;
  }

  /**
   * Get recent incidents
   */
  public async getRecentIncidents(limit: number = 10): Promise<HealthIncident[]> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM health_incidents 
        ORDER BY detected_at DESC 
        LIMIT ${limit}
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        metricId: row.metric_id,
        status: row.status,
        severity: row.severity,
        affectedArea: row.affected_area,
        affectedUsers: row.affected_users,
        details: row.details,
        detectedAt: row.detected_at,
        resolvedAt: row.resolved_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching recent incidents:', error);
      return [];
    }
  }

  /**
   * Get pending admin notifications
   */
  public async getPendingAdminNotifications(): Promise<HealthNotification[]> {
    try {
      const result = await db.execute(sql`
        SELECT n.*, i.affected_area, i.severity 
        FROM health_notifications n
        JOIN health_incidents i ON n.incident_id = i.id
        WHERE n.type = 'admin' AND n.status = 'pending'
        ORDER BY n.created_at DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        incidentId: row.incident_id,
        type: row.type,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        // Include additional data for UI
        affectedArea: row.affected_area,
        severity: row.severity
      }));
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as delivered
   */
  public async markNotificationDelivered(notificationId: number): Promise<void> {
    try {
      await db.execute(sql`
        UPDATE health_notifications 
        SET status = 'delivered', delivered_at = NOW()
        WHERE id = ${notificationId}
      `);
    } catch (error) {
      console.error('Error marking notification as delivered:', error);
    }
  }

  /**
   * Resolve an incident
   */
  public async resolveIncident(incidentId: number): Promise<void> {
    try {
      await db.execute(sql`
        UPDATE health_incidents 
        SET status = 'resolved', resolved_at = NOW(), updated_at = NOW()
        WHERE id = ${incidentId}
      `);
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  }
}

// Export singleton instance
export const healthMonitor = HealthMonitorService.getInstance();