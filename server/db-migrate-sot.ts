import { db, pool } from './db';

/**
 * This script initializes the database tables for the SOT (Single Source of Truth) integration
 */
export async function migrateSotTables() {
  console.log('Running SOT migrations...');
  console.log('Starting SOT table migrations...');
  
  try {
    // Check if tables already exist
    const declarationsExists = await checkIfTableExists('sot_declarations');
    const metricsExists = await checkIfTableExists('sot_metrics');
    const syncLogsExists = await checkIfTableExists('sot_sync_logs');
    
    if (!declarationsExists) {
      await createSotDeclarationsTable();
      console.log('✅ Created sot_declarations table');
    } else {
      console.log('ℹ️ sot_declarations table already exists, skipping creation.');
    }
    
    if (!metricsExists) {
      await createSotMetricsTable();
      console.log('✅ Created sot_metrics table');
    } else {
      console.log('ℹ️ sot_metrics table already exists, skipping creation.');
    }
    
    if (!syncLogsExists) {
      await createSotSyncLogsTable();
      console.log('✅ Created sot_sync_logs table');
    } else {
      console.log('ℹ️ sot_sync_logs table already exists, skipping creation.');
    }
    
    console.log('✅ SOT database migration completed successfully');
  } catch (error) {
    console.error('❌ Error during SOT database migration:', error);
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = $1
    );
  `, [tableName]);
  
  return result.rows[0].exists;
}

/**
 * Create the sot_declarations table
 */
async function createSotDeclarationsTable() {
  await pool.query(`
    CREATE TABLE sot_declarations (
      id SERIAL PRIMARY KEY,
      instance_id TEXT NOT NULL,
      instance_type TEXT NOT NULL,
      blueprint_version TEXT NOT NULL,
      tools_supported TEXT[] NOT NULL,
      callback_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Create the sot_metrics table
 */
async function createSotMetricsTable() {
  await pool.query(`
    CREATE TABLE sot_metrics (
      id SERIAL PRIMARY KEY,
      total_pages INTEGER DEFAULT 0,
      installed_tools TEXT[],
      last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Create the sot_sync_logs table
 */
async function createSotSyncLogsTable() {
  await pool.query(`
    CREATE TABLE sot_sync_logs (
      id SERIAL PRIMARY KEY,
      event_type TEXT NOT NULL,
      status TEXT NOT NULL,
      details TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}