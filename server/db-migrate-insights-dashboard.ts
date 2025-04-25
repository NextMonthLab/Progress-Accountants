import { db } from './db';
import { sql } from 'drizzle-orm';

export async function migrateInsightsDashboard() {
  console.log('Running Insights Dashboard migration...');
  
  const insightUsersExists = await checkIfTableExists('insight_users');
  const insightSummariesExists = await checkIfTableExists('insight_summaries');
  const userInsightsExists = await checkIfTableExists('user_insights');
  
  if (!insightUsersExists) {
    await createInsightUsersTable();
    console.log('✅ insight_users table created successfully');
  } else {
    console.log('ℹ️ insight_users table already exists, skipping creation');
  }
  
  if (!insightSummariesExists) {
    await createInsightSummariesTable();
    console.log('✅ insight_summaries table created successfully');
  } else {
    console.log('ℹ️ insight_summaries table already exists, skipping creation');
  }
  
  if (!userInsightsExists) {
    await createUserInsightsTable();
    console.log('✅ user_insights table created successfully');
  } else {
    // If the table exists but needs updating (e.g., adding userId column)
    const hasUserIdColumn = await checkIfColumnExists('user_insights', 'user_id');
    if (!hasUserIdColumn) {
      await addUserIdColumnToInsights();
      console.log('✅ Added user_id column to user_insights table');
    } else {
      console.log('ℹ️ user_insights table already has user_id column');
    }
  }
  
  console.log('✅ Insights Dashboard migration completed successfully');
}

async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    );
  `);
  
  return result.rows[0]?.exists || false;
}

async function checkIfColumnExists(tableName: string, columnName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
      AND column_name = ${columnName}
    );
  `);
  
  return result.rows[0]?.exists || false;
}

async function createInsightUsersTable() {
  await db.execute(sql`
    CREATE TABLE "insight_users" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "display_name" TEXT NOT NULL,
      "role" TEXT,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX "insight_users_tenant_id_idx" ON "insight_users" ("tenant_id");
    CREATE UNIQUE INDEX "insight_users_tenant_email_idx" ON "insight_users" ("tenant_id", "email");
  `);
}

async function createInsightSummariesTable() {
  await db.execute(sql`
    CREATE TABLE "insight_summaries" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" TEXT NOT NULL,
      "summary_type" TEXT NOT NULL,
      "start_date" TIMESTAMP NOT NULL,
      "end_date" TIMESTAMP NOT NULL,
      "themes" JSONB NOT NULL,
      "top_insights" JSONB NOT NULL,
      "ai_summary" TEXT NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX "insight_summaries_tenant_id_idx" ON "insight_summaries" ("tenant_id");
    CREATE INDEX "insight_summaries_date_range_idx" ON "insight_summaries" ("start_date", "end_date");
  `);
}

async function createUserInsightsTable() {
  await db.execute(sql`
    CREATE TABLE "user_insights" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" TEXT NOT NULL,
      "user_id" INTEGER NOT NULL,
      "content" TEXT NOT NULL,
      "tags" TEXT[],
      "mood" INTEGER,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      
      CONSTRAINT "user_insights_user_id_fkey" FOREIGN KEY ("user_id") 
        REFERENCES "insight_users" ("id") ON DELETE CASCADE
    );
    
    CREATE INDEX "user_insights_tenant_id_idx" ON "user_insights" ("tenant_id");
    CREATE INDEX "user_insights_user_id_idx" ON "user_insights" ("user_id");
    CREATE INDEX "user_insights_created_at_idx" ON "user_insights" ("created_at");
  `);
}

async function addUserIdColumnToInsights() {
  await db.execute(sql`
    ALTER TABLE "user_insights" ADD COLUMN "user_id" INTEGER;
    CREATE INDEX "user_insights_user_id_idx" ON "user_insights" ("user_id");
  `);
}