import { db, pool } from './db';
import { sql } from 'drizzle-orm';

/**
 * This script initializes the database tables for the Blueprint feature
 */
export async function migrateBlueprintTables() {
  console.log('Running Blueprint migrations...');
  console.log('Starting Blueprint table migrations...');
  
  try {
    // Check if blueprint_templates table exists
    const blueprintTemplatesExists = await checkIfTableExists('blueprint_templates');
    
    if (!blueprintTemplatesExists) {
      await createBlueprintTemplatesTable();
      console.log('✅ blueprint_templates table created successfully');
    } else {
      console.log('ℹ️ blueprint_templates table already exists, skipping creation.');
    }
    
    // Check if clone_operations table exists
    const cloneOperationsExists = await checkIfTableExists('clone_operations');
    
    if (!cloneOperationsExists) {
      await createCloneOperationsTable();
      console.log('✅ clone_operations table created successfully');
    } else {
      console.log('ℹ️ clone_operations table already exists, skipping creation.');
    }
    
    // Check if blueprint_exports table exists
    const blueprintExportsExists = await checkIfTableExists('blueprint_exports');
    
    if (!blueprintExportsExists) {
      await createBlueprintExportsTable();
      console.log('✅ blueprint_exports table created successfully');
    } else {
      console.log('ℹ️ blueprint_exports table already exists, skipping creation.');
    }
    
    console.log('✅ Blueprint database migration completed successfully');
  } catch (error) {
    console.error('❌ Error during Blueprint database migration:', error);
    throw error;
  }
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )`,
    [tableName]
  );
  
  return result.rows[0].exists;
}

/**
 * Create the blueprint_templates table
 */
async function createBlueprintTemplatesTable() {
  await pool.query(`
    CREATE TABLE blueprint_templates (
      id SERIAL PRIMARY KEY,
      instance_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      blueprint_version VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      is_cloneable BOOLEAN NOT NULL DEFAULT true,
      tenant_id UUID,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      last_sync_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

/**
 * Create the clone_operations table
 */
async function createCloneOperationsTable() {
  await pool.query(`
    CREATE TABLE clone_operations (
      id SERIAL PRIMARY KEY,
      request_id VARCHAR(100) NOT NULL,
      template_id INTEGER REFERENCES blueprint_templates(id),
      instance_name VARCHAR(255) NOT NULL,
      admin_email VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      new_instance_id UUID,
      started_at TIMESTAMP NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMP,
      error_message TEXT,
      metadata JSONB
    )
  `);
}

/**
 * Create the blueprint_exports table
 */
async function createBlueprintExportsTable() {
  await pool.query(`
    CREATE TABLE blueprint_exports (
      id SERIAL PRIMARY KEY,
      instance_id UUID NOT NULL,
      blueprint_version VARCHAR(50) NOT NULL,
      tenant_id UUID,
      is_tenant_agnostic BOOLEAN NOT NULL DEFAULT true,
      blueprint_data JSONB NOT NULL,
      exported_at TIMESTAMP NOT NULL DEFAULT NOW(),
      exported_by VARCHAR(255),
      validation_status VARCHAR(50) DEFAULT 'pending',
      validation_details JSONB
    )
  `);
}