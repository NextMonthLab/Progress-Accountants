/**
 * This script initializes the database tables for the Support System feature
 */
import { pool } from './db';

export async function migrateSupportSystemTables() {
  console.log('Running Support System migrations...');
  console.log('Starting Support System table migrations...');

  try {
    // Create the sessions table if it doesn't exist
    if (!await checkIfTableExists('support_sessions')) {
      await createSupportSessionsTable();
      console.log('✅ support_sessions table created successfully');
    } else {
      console.log('ℹ️ support_sessions table already exists, skipping creation.');
    }

    // Create the tickets table if it doesn't exist
    if (!await checkIfTableExists('support_tickets')) {
      await createSupportTicketsTable();
      console.log('✅ support_tickets table created successfully');
    } else {
      console.log('ℹ️ support_tickets table already exists, skipping creation.');
    }

    // Create the messages table if it doesn't exist
    if (!await checkIfTableExists('support_messages')) {
      await createSupportMessagesTable();
      console.log('✅ support_messages table created successfully');
    } else {
      console.log('ℹ️ support_messages table already exists, skipping creation.');
    }

    console.log('✅ Support System database migration completed successfully');
  } catch (error) {
    console.error('❌ Support System database migration failed:', error);
    throw error;
  }
}

/**
 * Helper function to check if a table exists in the database
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
 * Create the support_sessions table
 */
async function createSupportSessionsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_sessions (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL UNIQUE,
      user_id INTEGER,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      meta_data JSONB
    );
  `);
}

/**
 * Create the support_tickets table
 */
async function createSupportTicketsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id SERIAL PRIMARY KEY,
      ticket_id VARCHAR(255) NOT NULL UNIQUE,
      session_id VARCHAR(255),
      user_id INTEGER,
      issue_summary TEXT NOT NULL,
      steps_attempted JSONB,
      system_context JSONB,
      status VARCHAR(50) DEFAULT 'open',
      priority VARCHAR(50) DEFAULT 'medium',
      category VARCHAR(100),
      assigned_to INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP WITH TIME ZONE,
      CONSTRAINT fk_session_id FOREIGN KEY (session_id) REFERENCES support_sessions(session_id) ON DELETE SET NULL
    );
  `);
}

/**
 * Create the support_messages table
 */
async function createSupportMessagesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id SERIAL PRIMARY KEY,
      ticket_id VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      sender_id INTEGER,
      sender_type VARCHAR(50) NOT NULL, -- 'user', 'agent', 'system'
      attachments JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_ticket_id FOREIGN KEY (ticket_id) REFERENCES support_tickets(ticket_id) ON DELETE CASCADE
    );
  `);
}