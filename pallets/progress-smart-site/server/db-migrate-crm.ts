import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * This script initializes the database tables for the Starter CRM feature
 */
export async function migrateCrmTables() {
  try {
    console.log('Running Starter CRM migrations...');
    console.log('Starting Starter CRM table migrations...');
    
    // Check if crm_contacts table exists
    const crmContactsExists = await checkIfTableExists('crm_contacts');
    if (!crmContactsExists) {
      console.log('Creating crm_contacts table...');
      await createCrmContactsTable();
      console.log('✅ crm_contacts table created successfully');
    } else {
      console.log('ℹ️ crm_contacts table already exists, skipping creation.');
    }
    
    console.log('✅ Starter CRM database migration completed successfully');
  } catch (error) {
    console.error('⚠️ Error during Starter CRM database migration:', error);
    throw error;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    ) AS exists;
  `);
  
  return result.rows[0]?.exists === true;
}

/**
 * Create the crm_contacts table
 */
async function createCrmContactsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS crm_contacts (
      id SERIAL PRIMARY KEY,
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      notes TEXT,
      tags JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES users(id)
    );
  `);
}