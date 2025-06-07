import { Request, Response } from "express";
import { simpleStorage } from "../simpleStorage";
import { requireSuperAdmin } from "../middleware/rbac";
import os from "os";
import { pool } from "../db";

/**
 * Get system status information (Super Admin only)
 */
export async function getSystemStatus(req: Request, res: Response) {
  try {
    // Only super admins can access system status
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can access system status"
      });
    }
    
    // Get active users (users with active sessions in the last 24 hours)
    const activeUsers = await getActiveUsersCount();
    
    // Check security status (placeholder for actual security checks)
    const securityStatus = await checkSecurityStatus();
    
    // Format uptime
    const uptimeSeconds = os.uptime();
    const uptimeFormatted = formatUptime(uptimeSeconds);
    
    // Database health check
    const dbStatus = await checkDatabaseHealth();
    
    // Determine overall system health
    let health = 'healthy';
    if (!dbStatus.healthy) {
      health = 'critical';
    } else if (securityStatus.alerts.length > 0) {
      health = 'warning';
    }
    
    // Create response object
    const status = {
      health,
      uptime: uptimeSeconds,
      uptimeFormatted,
      activeUsers,
      securityStatus: securityStatus.status,
      securityAlerts: securityStatus.alerts.length,
      database: dbStatus,
      memoryUsage: {
        total: os.totalmem(),
        free: os.freemem(),
        usedPercentage: Math.round((1 - os.freemem() / os.totalmem()) * 100)
      },
      cpuLoad: os.loadavg(),
      timestamp: new Date()
    };
    
    res.json(status);
  } catch (error) {
    console.error("Error getting system status:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to get system status"
    });
  }
}

/**
 * Get system logs (Super Admin only)
 */
export async function getSystemLogs(req: Request, res: Response) {
  try {
    // Only super admins can access system logs
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can access system logs"
      });
    }
    
    // Get logs from activity logs table
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = await simpleStorage.getActivityLogs(undefined, limit);
    
    res.json(logs);
  } catch (error) {
    console.error("Error getting system logs:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to get system logs"
    });
  }
}

/**
 * Check connection to external services (Super Admin only)
 */
export async function checkExternalServices(req: Request, res: Response) {
  try {
    // Only super admins can check external services
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can check external services"
      });
    }
    
    // Check connections to Vault, Guardian, etc.
    const services = {
      vault: await checkVaultConnection(),
      guardian: await checkGuardianConnection(),
      lab: await checkLabConnection(),
      dev: await checkDevConnection()
    };
    
    res.json(services);
  } catch (error) {
    console.error("Error checking external services:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to check external services"
    });
  }
}

/**
 * Register system monitoring routes
 */
export function registerSystemRoutes(app: any) {
  app.get('/api/system/status', requireSuperAdmin, getSystemStatus);
  app.get('/api/system/logs', requireSuperAdmin, getSystemLogs);
  app.get('/api/system/external-services', requireSuperAdmin, checkExternalServices);
}

// Helper functions

/**
 * Get count of active users (with active sessions in last 24 hours)
 */
async function getActiveUsersCount(): Promise<number> {
  try {
    // This is a placeholder for actual implementation
    // In a real system, this would query the session store or activity logs
    return 5; // Hardcoded for demonstration
  } catch (error) {
    console.error("Error getting active users count:", error);
    return 0;
  }
}

/**
 * Check security status
 */
async function checkSecurityStatus(): Promise<{ status: string, alerts: any[] }> {
  try {
    // This is a placeholder for actual security checks
    // In a real system, this would perform various security checks
    
    // Mock alerts for demonstration
    const alerts = [
      {
        type: 'login_attempts',
        message: '5 failed login attempts from IP 203.0.113.42',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
      }
    ];
    
    return {
      status: alerts.length > 0 ? 'warning' : 'secure',
      alerts
    };
  } catch (error) {
    console.error("Error checking security status:", error);
    return {
      status: 'unknown',
      alerts: []
    };
  }
}

/**
 * Format uptime in a human-readable way
 */
function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / (60 * 60 * 24));
  const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  
  let result = '';
  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  result += `${minutes}m`;
  
  return result;
}

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<{ healthy: boolean, responseTime: number, connections: number }> {
  try {
    // Measure response time
    const startTime = Date.now();
    const client = await pool.connect();
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Get connection count
    const { rows } = await client.query("SELECT count(*) as count FROM pg_stat_activity");
    const connections = parseInt(rows[0].count);
    
    client.release();
    
    return {
      healthy: true,
      responseTime,
      connections
    };
  } catch (error) {
    console.error("Error checking database health:", error);
    return {
      healthy: false,
      responseTime: -1,
      connections: 0
    };
  }
}

/**
 * Check Vault connection
 */
async function checkVaultConnection(): Promise<{ status: string, responseTime: number }> {
  // Placeholder for actual Vault connection check
  return {
    status: 'degraded',
    responseTime: 320
  };
}

/**
 * Check Guardian connection
 */
async function checkGuardianConnection(): Promise<{ status: string, responseTime: number }> {
  // Placeholder for actual Guardian connection check
  return {
    status: 'operational',
    responseTime: 125
  };
}

/**
 * Check Lab connection
 */
async function checkLabConnection(): Promise<{ status: string, responseTime: number }> {
  // Placeholder for actual Lab connection check
  return {
    status: 'operational',
    responseTime: 110
  };
}

/**
 * Check Dev connection
 */
async function checkDevConnection(): Promise<{ status: string, responseTime: number }> {
  // Placeholder for actual Dev connection check
  return {
    status: 'operational',
    responseTime: 135
  };
}