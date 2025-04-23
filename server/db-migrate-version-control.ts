/**
 * This script initializes the database tables for the Version Control System
 */
import { db, pool } from './db';
import { sql } from 'drizzle-orm';

async function migrateVersionControlTables() {
  console.log('Starting Version Control System database migration...');
  
  try {
    // Check if tables already exist
    const versionsTableExists = await checkIfTableExists('content_versions');
    const changelogsTableExists = await checkIfTableExists('change_logs');
    
    if (!versionsTableExists) {
      await createContentVersionsTable();
      console.log('✅ Content Versions table created successfully.');
    } else {
      console.log('ℹ️ Content Versions table already exists, skipping creation.');
    }
    
    if (!changelogsTableExists) {
      await createChangeLogsTable();
      console.log('✅ Change Logs table created successfully.');
    } else {
      console.log('ℹ️ Change Logs table already exists, skipping creation.');
    }
    
    console.log('✅ Version Control System database migration completed successfully.');
  } catch (error) {
    console.error('❌ Error during Version Control System migration:', error);
    throw error;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await pool.query(
    sql`SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    )`
  );
  
  return result.rows[0].exists;
}

/**
 * Create the content_versions table
 */
async function createContentVersionsTable() {
  await pool.query(sql`
    CREATE TABLE IF NOT EXISTS content_versions (
      id SERIAL PRIMARY KEY,
      entity_id INTEGER NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      version_number INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      status VARCHAR(20) NOT NULL,
      change_type VARCHAR(20) NOT NULL,
      change_description TEXT,
      snapshot JSONB NOT NULL,
      diff JSONB,
      
      -- Indexes for performance
      UNIQUE(entity_id, entity_type, version_number),
      INDEX idx_content_versions_entity_id_type (entity_id, entity_type),
      INDEX idx_content_versions_status (status),
      INDEX idx_content_versions_created_at (created_at)
    )
  `);
}

/**
 * Create the change_logs table for tracking all content changes
 */
async function createChangeLogsTable() {
  await pool.query(sql`
    CREATE TABLE IF NOT EXISTS change_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      action VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id INTEGER NOT NULL,
      version_id INTEGER REFERENCES content_versions(id),
      details JSONB,
      ip_address VARCHAR(45),
      user_agent TEXT,
      
      -- Indexes for performance
      INDEX idx_change_logs_user_id (user_id),
      INDEX idx_change_logs_timestamp (timestamp),
      INDEX idx_change_logs_entity (entity_type, entity_id)
    )
  `);
}

// Export for use in other files
export { migrateVersionControlTables };