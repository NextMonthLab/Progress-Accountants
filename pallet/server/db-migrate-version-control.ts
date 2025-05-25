/**
 * This script initializes the database tables for the Version Control System
 */
import { db, pool } from './db';

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
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `;
  
  const result = await pool.query(query, [tableName]);
  return result.rows[0].exists;
}

/**
 * Create the content_versions table
 */
async function createContentVersionsTable() {
  const query = `
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
      UNIQUE(entity_id, entity_type, version_number)
    );
    
    CREATE INDEX IF NOT EXISTS idx_content_versions_entity_id_type ON content_versions(entity_id, entity_type);
    CREATE INDEX IF NOT EXISTS idx_content_versions_status ON content_versions(status);
    CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at);
  `;
  
  await pool.query(query);
}

/**
 * Create the change_logs table for tracking all content changes
 */
async function createChangeLogsTable() {
  const query = `
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
      user_agent TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_change_logs_user_id ON change_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_change_logs_timestamp ON change_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_change_logs_entity ON change_logs(entity_type, entity_id);
  `;
  
  await pool.query(query);
}

// Export for use in other files
export { migrateVersionControlTables };