import { pool } from "./db";

/**
 * This script initializes the database tables for the Agora OS Support System
 */
export async function migrateSupportTables() {
  console.log("Running Support System migrations...");
  console.log("Starting Support System table migrations...");

  // Check if support_sessions table exists
  const supportSessionsTableExists = await checkIfTableExists("support_sessions");
  if (!supportSessionsTableExists) {
    console.log("Creating support_sessions table...");
    await createSupportSessionsTable();
    console.log("✅ support_sessions table created successfully.");
  } else {
    console.log("ℹ️ support_sessions table already exists, skipping creation.");
  }

  // Check if support_tickets table exists
  const supportTicketsTableExists = await checkIfTableExists("support_tickets");
  if (!supportTicketsTableExists) {
    console.log("Creating support_tickets table...");
    await createSupportTicketsTable();
    console.log("✅ support_tickets table created successfully.");
  } else {
    console.log("ℹ️ support_tickets table already exists, skipping creation.");
  }

  console.log("✅ Support System database migration completed successfully");
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    );
    return result.rows[0].exists;
  } finally {
    client.release();
  }
}

/**
 * Create the support_sessions table
 */
async function createSupportSessionsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE support_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER,
        session_id TEXT NOT NULL,
        current_mode TEXT NOT NULL DEFAULT 'assistant',
        issues_logged JSONB DEFAULT '[]',
        tickets_generated JSONB DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'active',
        escalated BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}

/**
 * Create the support_tickets table
 */
async function createSupportTicketsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE support_tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id TEXT NOT NULL,
        user_id INTEGER,
        issue_summary TEXT NOT NULL,
        steps_attempted JSONB DEFAULT '[]',
        system_context JSONB NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        assigned_to TEXT NOT NULL DEFAULT 'system',
        resolution TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}