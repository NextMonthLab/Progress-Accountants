import { db } from './db';
import { aiEventLogs } from '@shared/schema';

export async function migrateAiEventLog() {
  console.log('Running AI Event Log migrations...');
  
  try {
    console.log('Starting AI Event Log table migrations...');
    
    // Create the ai_event_logs table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "ai_event_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id"),
        "user_id" integer REFERENCES "users"("id"),
        "timestamp" timestamp DEFAULT now() NOT NULL,
        "event_type" varchar(50) NOT NULL,
        "task_type" varchar(50),
        "detail" jsonb,
        "model_used" varchar(50),
        "tokens_used" integer,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('✅ ai_event_logs table created');

    // Create indexes for performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "ai_event_logs_tenant_timestamp_idx" 
      ON "ai_event_logs" ("tenant_id", "timestamp");
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "ai_event_logs_event_type_idx" 
      ON "ai_event_logs" ("event_type");
    `);
    console.log('✅ AI Event Log indexes created');

    console.log('✅ AI Event Log database migration completed successfully');
  } catch (error) {
    console.error('❌ AI Event Log migration failed:', error);
    throw error;
  }
}