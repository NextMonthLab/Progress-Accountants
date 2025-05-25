import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Establish database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

/**
 * Migration function to create support digest table
 */
export async function migrateSupportDigestTable() {
  console.log('Starting Support Digest table migration...');
  
  try {
    // Create support_digests table
    await createSupportDigestsTable();
    
    console.log('✅ Support Digest database migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error during Support Digest database migration:', error);
    return false;
  } finally {
    await pool.end();
  }
}

/**
 * Create the support_digests table if it doesn't exist
 */
async function createSupportDigestsTable() {
  // Check if table exists
  const tableExists = await checkTableExists('support_digests');
  
  if (tableExists) {
    console.log('ℹ️ support_digests table already exists, skipping creation.');
    return;
  }
  
  // Create support_digests table
  await db.execute(sql`
    CREATE TABLE support_digests (
      id SERIAL PRIMARY KEY,
      tenant_id TEXT NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
      user_id INTEGER,
      ticket_id INTEGER,
      session_id INTEGER,
      title TEXT NOT NULL,
      issue_description TEXT NOT NULL,
      resolution_summary TEXT NOT NULL,
      system_status TEXT NOT NULL DEFAULT 'healthy',
      next_tip TEXT,
      digest_type TEXT NOT NULL DEFAULT 'ticket_resolved',
      read BOOLEAN NOT NULL DEFAULT false,
      delivered BOOLEAN NOT NULL DEFAULT false,
      email_sent BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);
  
  console.log('✅ Created support_digests table');
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
  
  return result.rows[0].exists as boolean;
}

// Run migration if script is executed directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  migrateSupportDigestTable()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}