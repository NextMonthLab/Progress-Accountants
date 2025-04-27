/**
 * This script initializes the database tables for the Health Monitoring System
 */
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';

/**
 * Migrate the Health Monitoring tables
 */
export async function migrateHealthMonitoringTables() {
  console.log('Starting Health Monitoring System table migrations...');

  try {
    // Create health metrics table
    const healthMetricsExists = await checkIfTableExists('health_metrics');
    if (!healthMetricsExists) {
      console.log('Creating health_metrics table...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS health_metrics (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          threshold JSONB,
          enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      
      // Add initial metrics
      await db.execute(sql`
        INSERT INTO health_metrics (name, category, description, threshold) VALUES
        ('api_error_rate', 'api', 'Monitors API error rates on critical routes', '{"error_count": 5, "time_window": 300, "routes": ["/media-upload", "/bookings", "/portal"]}'),
        ('dashboard_load_time', 'performance', 'Monitors dashboard page load times', '{"max_load_time": 3000, "sample_size": 10}'),
        ('login_failure_rate', 'security', 'Monitors failed login attempts', '{"failure_rate": 0.1, "time_window": 600}'),
        ('media_upload_failure', 'storage', 'Monitors media upload failures', '{"failure_rate": 0.1, "time_window": 600}')
      `);
    } else {
      console.log('ℹ️ health_metrics table already exists, skipping creation.');
    }

    // Create health incidents table
    const healthIncidentsExists = await checkIfTableExists('health_incidents');
    if (!healthIncidentsExists) {
      console.log('Creating health_incidents table...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS health_incidents (
          id SERIAL PRIMARY KEY,
          metric_id INTEGER REFERENCES health_metrics(id),
          status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, resolved, acknowledged
          severity VARCHAR(50) NOT NULL DEFAULT 'warning', -- warning, critical, info
          affected_area VARCHAR(255),
          affected_users INTEGER DEFAULT 0,
          details JSONB,
          detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          resolved_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('ℹ️ health_incidents table already exists, skipping creation.');
    }

    // Create health metric logs table
    const healthMetricLogsExists = await checkIfTableExists('health_metric_logs');
    if (!healthMetricLogsExists) {
      console.log('Creating health_metric_logs table...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS health_metric_logs (
          id SERIAL PRIMARY KEY,
          metric_id INTEGER REFERENCES health_metrics(id),
          value JSONB NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('ℹ️ health_metric_logs table already exists, skipping creation.');
    }

    // Create health notifications table
    const healthNotificationsExists = await checkIfTableExists('health_notifications');
    if (!healthNotificationsExists) {
      console.log('Creating health_notifications table...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS health_notifications (
          id SERIAL PRIMARY KEY,
          incident_id INTEGER REFERENCES health_incidents(id),
          user_id INTEGER,
          type VARCHAR(50) NOT NULL, -- admin, user
          status VARCHAR(50) DEFAULT 'pending', -- pending, delivered, dismissed
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          delivered_at TIMESTAMP WITH TIME ZONE,
          dismissed_at TIMESTAMP WITH TIME ZONE
        )
      `);
    } else {
      console.log('ℹ️ health_notifications table already exists, skipping creation.');
    }

    console.log('✅ Health Monitoring System tables created successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error during Health Monitoring System database migration:', error);
    throw error;
  }
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = ${tableName}
    )
  `);
  
  return result.rows[0].exists;
}

// Get the database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);