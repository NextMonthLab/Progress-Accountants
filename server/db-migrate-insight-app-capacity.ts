import { db } from './db';
import { insightAppUserCapacity } from '@shared/schema';

export async function migrateInsightAppUserCapacity() {
  console.log('Running Insight App User Capacity migrations...');
  
  try {
    console.log('Starting Insight App User Capacity table migrations...');
    
    // Create the insight_app_user_capacity table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "insight_app_user_capacity" (
        "id" serial PRIMARY KEY,
        "tenant_id" uuid NOT NULL UNIQUE REFERENCES "tenants"("id"),
        "base_free_capacity" integer DEFAULT 10 NOT NULL,
        "additional_purchased_capacity" integer DEFAULT 0 NOT NULL,
        "last_updated" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('✅ insight_app_user_capacity table created');

    // Create indexes for performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "insight_app_user_capacity_tenant_idx" 
      ON "insight_app_user_capacity" ("tenant_id");
    `);
    console.log('✅ Insight App User Capacity indexes created');

    // Initialize default capacity for existing tenants
    await db.execute(`
      INSERT INTO "insight_app_user_capacity" ("tenant_id", "base_free_capacity", "additional_purchased_capacity")
      SELECT "id", 10, 0 
      FROM "tenants" 
      WHERE "id" NOT IN (SELECT "tenant_id" FROM "insight_app_user_capacity")
      ON CONFLICT ("tenant_id") DO NOTHING;
    `);
    console.log('✅ Default capacity initialized for existing tenants');

    console.log('✅ Insight App User Capacity database migration completed successfully');
  } catch (error) {
    console.error('❌ Insight App User Capacity migration failed:', error);
    throw error;
  }
}