import { db } from "./db";
import { aiUsageLogs } from "@shared/schema";

export async function runAiUsageMigrations() {
  console.log("Running AI Usage Tracking migrations...");
  
  try {
    console.log("Starting AI Usage Tracking table migrations...");
    
    // Create ai_usage_logs table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ai_usage_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id),
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
        task_type VARCHAR(100) NOT NULL,
        model_used VARCHAR(50) NOT NULL,
        tokens_used INTEGER,
        success BOOLEAN DEFAULT true,
        error_message TEXT,
        metadata JSONB
      );
    `);
    
    // Create indexes for performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant ON ai_usage_logs(tenant_id);
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage_logs(timestamp);
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_ai_usage_task_type ON ai_usage_logs(task_type);
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_ai_usage_model ON ai_usage_logs(model_used);
    `);
    
    console.log("✅ AI Usage Tracking database migration completed successfully");
    
  } catch (error) {
    console.error("❌ AI Usage Tracking migration failed:", error);
    throw error;
  }
}