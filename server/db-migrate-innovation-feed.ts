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
    console.log('✅ Innovation Feed indexes created');

    console.log('✅ Innovation Feed database migration completed successfully');
  } catch (error) {
    console.error('❌ Innovation Feed migration failed:', error);
    throw error;
  }
}