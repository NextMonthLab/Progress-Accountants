import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Establish database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

/**
 * Migration function to create health monitoring system tables
 */
export async function migrateHealthMonitoringTables() {
  console.log('Starting Health Monitoring table migrations...');
  
  try {
    // Create health_metrics table
    await createHealthMetricsTable();
    
    // Create health_incidents table
    await createHealthIncidentsTable();
    
    // Create health_notifications table
    await createHealthNotificationsTable();
    
    // Create system_health_status table
    await createSystemHealthStatusTable();
    
    // Create default metrics
    await createDefaultMetrics();
    
    console.log('✅ Health Monitoring database migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error during Health Monitoring database migration:', error);
    return false;
  } finally {
    await pool.end();
  }
}

/**
 * Create the health_metrics table if it doesn't exist
 */
async function createHealthMetricsTable() {
  // Check if table exists
  const tableExists = await checkTableExists('health_metrics');
  
  if (tableExists) {
    console.log('ℹ️ health_metrics table already exists, skipping creation.');
    return;
  }
  
  // Create health_metrics table
  await db.execute(sql`
    CREATE TABLE health_metrics (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      threshold JSONB,
      enabled BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  
  console.log('✅ Created health_metrics table');
}

/**
 * Create the health_incidents table if it doesn't exist
 */
async function createHealthIncidentsTable() {
  // Check if table exists
  const tableExists = await checkTableExists('health_incidents');
  
  if (tableExists) {
    console.log('ℹ️ health_incidents table already exists, skipping creation.');
    return;
  }
  
  // Create health_incidents table
  await db.execute(sql`
    CREATE TABLE health_incidents (
      id SERIAL PRIMARY KEY,
      metric_id INTEGER REFERENCES health_metrics(id),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      severity VARCHAR(20) NOT NULL DEFAULT 'warning',
      affected_area VARCHAR(255),
      affected_users INTEGER DEFAULT 0,
      details JSONB,
      detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      resolved_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  
  console.log('✅ Created health_incidents table');
}

/**
 * Create the health_notifications table if it doesn't exist
 */
async function createHealthNotificationsTable() {
  // Check if table exists
  const tableExists = await checkTableExists('health_notifications');
  
  if (tableExists) {
    console.log('ℹ️ health_notifications table already exists, skipping creation.');
    return;
  }
  
  // Create health_notifications table
  await db.execute(sql`
    CREATE TABLE health_notifications (
      id SERIAL PRIMARY KEY,
      incident_id INTEGER REFERENCES health_incidents(id),
      type VARCHAR(20) NOT NULL DEFAULT 'admin',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      message TEXT NOT NULL,
      affected_area VARCHAR(255),
      severity VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  
  console.log('✅ Created health_notifications table');
}

/**
 * Create the system_health_status table if it doesn't exist
 */
async function createSystemHealthStatusTable() {
  // Check if table exists
  const tableExists = await checkTableExists('system_health_status');
  
  if (tableExists) {
    console.log('ℹ️ system_health_status table already exists, skipping creation.');
    return;
  }
  
  // Create system_health_status table
  await db.execute(sql`
    CREATE TABLE system_health_status (
      id SERIAL PRIMARY KEY,
      status VARCHAR(20) NOT NULL DEFAULT 'healthy',
      services JSONB NOT NULL,
      checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  
  console.log('✅ Created system_health_status table');
}

/**
 * Create default health metrics for monitoring
 */
async function createDefaultMetrics() {
  // Check if any metrics already exist
  const metricsCount = await db.execute(sql`
    SELECT COUNT(*) FROM health_metrics
  `);
  
  if (parseInt(metricsCount.rows[0].count) > 0) {
    console.log('ℹ️ Health metrics already exist, skipping default metrics creation.');
    return;
  }
  
  // Insert default metrics
  await db.execute(sql`
    INSERT INTO health_metrics 
      (name, category, description, threshold, enabled) 
    VALUES 
      (
        'api_response_time', 
        'api', 
        'Monitors API response time', 
        '{"warning": 1000, "critical": 3000}', 
        TRUE
      ),
      (
        'api_error_rate', 
        'api', 
        'Tracks percentage of API errors', 
        '{"warning": 5, "critical": 15}', 
        TRUE
      ),
      (
        'page_load_time', 
        'performance', 
        'Monitors page load time', 
        '{"warning": 2000, "critical": 5000}', 
        TRUE
      ),
      (
        'memory_usage', 
        'performance', 
        'Tracks application memory usage', 
        '{"warning": 70, "critical": 90}', 
        TRUE
      ),
      (
        'session_failures', 
        'security', 
        'Tracks failed login attempts', 
        '{"warning": 5, "critical": 20}', 
        TRUE
      ),
      (
        'database_connections', 
        'storage', 
        'Monitors database connection pool usage', 
        '{"warning": 80, "critical": 95}', 
        TRUE
      ),
      (
        'storage_usage', 
        'storage', 
        'Tracks storage space usage', 
        '{"warning": 75, "critical": 90}', 
        TRUE
      )
  `);
  
  console.log('✅ Created default health metrics');
}

/**
 * Helper function to check if a table exists
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = ${tableName}
    )
  `);
  
  return result.rows[0].exists;
}

// Run migration if script is executed directly
// Note: Using ESM approach instead of CommonJS (require.main === module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  migrateHealthMonitoringTables()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}