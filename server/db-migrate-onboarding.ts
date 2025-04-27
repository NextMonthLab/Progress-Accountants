import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Migrates the onboarding tables for the cinematic onboarding feature
 */
export async function migrateOnboardingTables() {
  console.log('Running Onboarding migrations...');
  console.log('Starting Onboarding table migrations...');
  
  try {
    // Check if onboarding_stages table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'onboarding_stages'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      // Create onboarding_stages table
      await db.execute(sql`
        CREATE TABLE onboarding_stages (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          stage VARCHAR(50) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'not_started',
          data JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✅ Created onboarding_stages table');
    } else {
      console.log('ℹ️ onboarding_stages table already exists, skipping creation.');
    }
    
    // Check if emblems table exists
    const emblemsTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'emblems'
      );
    `);
    
    if (!emblemsTableExists.rows[0].exists) {
      // Create emblems table
      await db.execute(sql`
        CREATE TABLE emblems (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          emblem_id VARCHAR(50) NOT NULL,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          unlocked BOOLEAN DEFAULT FALSE,
          unlocked_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✅ Created emblems table');
    } else {
      console.log('ℹ️ emblems table already exists, skipping creation.');
    }
    
    console.log('✅ Onboarding database migration completed successfully');
  } catch (error) {
    console.error('❌ Error during onboarding migration:', error);
    throw error;
  }
}