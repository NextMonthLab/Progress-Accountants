/**
 * This script initializes the database tables for the support system
 */
import { pool } from "./db";
import { supportSessions, supportIssues, supportTickets, ticketMessages } from "@shared/support-schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

export async function migrateSupportTables() {
  console.log("Running Support System migrations...");
  console.log("Starting Support System table migrations...");

  try {
    const db = drizzle(pool);

    // Check if tables already exist to avoid duplicate migrations
    if (await checkIfTableExists("support_sessions")) {
      console.log("ℹ️ support_sessions table already exists, skipping creation.");
    } else {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS support_sessions (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
          status TEXT DEFAULT 'active' NOT NULL,
          meta_data JSONB
        );
      `);
      console.log("✅ Created support_sessions table");
    }

    if (await checkIfTableExists("support_issues")) {
      console.log("ℹ️ support_issues table already exists, skipping creation.");
    } else {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS support_issues (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL REFERENCES support_sessions(session_id),
          issue_text TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
          status TEXT DEFAULT 'new' NOT NULL,
          ai_response TEXT,
          resolution TEXT,
          escalated BOOLEAN DEFAULT FALSE
        );
      `);
      console.log("✅ Created support_issues table");
    }

    if (await checkIfTableExists("support_tickets")) {
      console.log("ℹ️ support_tickets table already exists, skipping creation.");
    } else {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS support_tickets (
          id SERIAL PRIMARY KEY,
          ticket_id TEXT NOT NULL,
          session_id TEXT REFERENCES support_sessions(session_id),
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
          status TEXT DEFAULT 'new' NOT NULL,
          priority TEXT DEFAULT 'medium' NOT NULL,
          issue_summary TEXT NOT NULL,
          steps_attempted JSONB,
          system_context JSONB,
          assigned_to INTEGER REFERENCES users(id),
          resolution TEXT
        );
      `);
      console.log("✅ Created support_tickets table");
    }

    if (await checkIfTableExists("ticket_messages")) {
      console.log("ℹ️ ticket_messages table already exists, skipping creation.");
    } else {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS ticket_messages (
          id SERIAL PRIMARY KEY,
          ticket_id TEXT NOT NULL REFERENCES support_tickets(ticket_id),
          sender_id INTEGER REFERENCES users(id),
          sender_type TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          attachments JSONB
        );
      `);
      console.log("✅ Created ticket_messages table");
    }

    console.log("✅ Support System database migration completed successfully");
  } catch (error) {
    console.error("❌ Error during Support System database migration:", error);
    throw error;
  }
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = $1
      );
    `, [tableName]);
    
    return result.rows[0].exists;
  } finally {
    client.release();
  }
}