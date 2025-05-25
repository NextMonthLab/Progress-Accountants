import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * This script initializes the database tables for the Insights Dashboard feature
 */
export async function migrateInsightsDashboard() {
  console.log('Running Insights Dashboard migrations...');
  console.log('Starting Insights Dashboard table migrations...');

  try {
    // Create insight_users table if it doesn't exist
    const insightUsersExists = await checkIfTableExists('insight_users');
    if (!insightUsersExists) {
      await createInsightUsersTable();
      console.log('✅ Created insight_users table');
    } else {
      console.log('ℹ️ insight_users table already exists, skipping creation.');
    }

    // Create user_insights table if it doesn't exist
    const userInsightsExists = await checkIfTableExists('user_insights');
    if (!userInsightsExists) {
      await createUserInsightsTable();
      console.log('✅ Created user_insights table');
    } else {
      console.log('ℹ️ user_insights table already exists, skipping creation.');
    }

    // Create insight_summaries table if it doesn't exist
    const insightSummariesExists = await checkIfTableExists('insight_summaries');
    if (!insightSummariesExists) {
      await createInsightSummariesTable();
      console.log('✅ Created insight_summaries table');
    } else {
      console.log('ℹ️ insight_summaries table already exists, skipping creation.');
    }

    // Check if we need to add user_id column to existing insights table
    if (await checkIfTableExists('insights')) {
      const hasUserIdColumn = await checkIfColumnExists('insights', 'user_id');
      if (!hasUserIdColumn) {
        await addUserIdColumnToInsights();
        console.log('✅ Added user_id column to insights table');
      } else {
        console.log('ℹ️ user_id column already exists in insights table, skipping addition.');
      }
    }

    console.log('✅ Insights Dashboard database migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in Insights Dashboard migration:', error);
    return false;
  }
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    );
  `);
  
  return result.rows[0].exists === true;
}

/**
 * Helper function to check if a column exists in a table
 */
async function checkIfColumnExists(tableName: string, columnName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
      AND column_name = ${columnName}
    );
  `);
  
  return result.rows[0].exists === true;
}

/**
 * Create the insight_users table
 */
async function createInsightUsersTable(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE insight_users (
      id SERIAL PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      email TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX insight_users_tenant_id_idx ON insight_users (tenant_id);
    CREATE UNIQUE INDEX insight_users_tenant_email_idx ON insight_users (tenant_id, email);
  `);
}

/**
 * Create the user_insights table
 */
async function createUserInsightsTable(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE user_insights (
      id SERIAL PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES insight_users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      tags TEXT[],
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX user_insights_user_id_idx ON user_insights (user_id);
    CREATE INDEX user_insights_tenant_id_idx ON user_insights (tenant_id);
    CREATE INDEX user_insights_created_at_idx ON user_insights (created_at);
  `);
}

/**
 * Create the insight_summaries table
 */
async function createInsightSummariesTable(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE insight_summaries (
      id SERIAL PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      summary_type TEXT NOT NULL,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      themes TEXT[],
      top_insights JSONB NOT NULL,
      ai_summary TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX insight_summaries_tenant_id_idx ON insight_summaries (tenant_id);
    CREATE INDEX insight_summaries_end_date_idx ON insight_summaries (end_date);
  `);
}

/**
 * Add user_id column to existing insights table
 */
async function addUserIdColumnToInsights(): Promise<void> {
  await db.execute(sql`
    ALTER TABLE insights 
    ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES insight_users(id) ON DELETE SET NULL;
    
    CREATE INDEX insights_user_id_idx ON insights (user_id);
  `);
}