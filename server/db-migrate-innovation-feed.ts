import { db } from './db';
import { innovationFeedItems } from '@shared/schema';

export async function migrateInnovationFeed() {
  console.log('Running Innovation Feed migrations...');
  
  try {
    console.log('Starting Innovation Feed table migrations...');
    
    // Create the innovation_feed_items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "innovation_feed_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id"),
        "user_id" integer REFERENCES "users"("id"),
        "timestamp" timestamp DEFAULT now() NOT NULL,
        "theme_summary" text NOT NULL,
        "selected_scope" varchar(100) NOT NULL,
        "ideas_markdown" text NOT NULL,
        "model_used" varchar(50) NOT NULL,
        "task_type" varchar(50) DEFAULT 'theme-to-product-ideas' NOT NULL,
        "generated_by_user" varchar(255),
        "action_status" varchar(20) DEFAULT 'none' NOT NULL,
        "action_notes" text,
        "action_updated_by_user_id" integer REFERENCES "users"("id"),
        "action_updated_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('✅ innovation_feed_items table created');

    // Create indexes for performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "innovation_feed_tenant_timestamp_idx" 
      ON "innovation_feed_items" ("tenant_id", "timestamp");
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "innovation_feed_task_type_idx" 
      ON "innovation_feed_items" ("task_type");
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "innovation_feed_action_status_idx" 
      ON "innovation_feed_items" ("action_status");
    `);
    console.log('✅ Innovation Feed indexes created');

    // Add action tracking columns to existing tables if they don't exist
    try {
      await db.execute(`
        ALTER TABLE "innovation_feed_items" 
        ADD COLUMN IF NOT EXISTS "action_status" varchar(20) DEFAULT 'none' NOT NULL;
      `);
      await db.execute(`
        ALTER TABLE "innovation_feed_items" 
        ADD COLUMN IF NOT EXISTS "action_notes" text;
      `);
      await db.execute(`
        ALTER TABLE "innovation_feed_items" 
        ADD COLUMN IF NOT EXISTS "action_updated_by_user_id" integer REFERENCES "users"("id");
      `);
      await db.execute(`
        ALTER TABLE "innovation_feed_items" 
        ADD COLUMN IF NOT EXISTS "action_updated_at" timestamp;
      `);
      console.log('✅ Action tracking columns added to existing tables');
    } catch (error) {
      console.log('ℹ️ Action tracking columns already exist or cannot be added:', error.message);
    }

    console.log('✅ Innovation Feed database migration completed successfully');
  } catch (error) {
    console.error('❌ Innovation Feed migration failed:', error);
    throw error;
  }
}