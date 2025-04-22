import { sql } from 'drizzle-orm';
import { db } from './db';
import { 
  pageBuilderPages, 
  pageBuilderSections, 
  pageBuilderComponents, 
  pageBuilderTemplates, 
  pageBuilderRecommendations, 
  pageBuilderVersionHistory 
} from '../shared/schema';

/**
 * This script initializes the database tables for the Advanced Page Builder feature
 */
async function migratePageBuilderTables() {
  console.log('Starting Page Builder table migrations...');
  
  try {
    // Check if the pageBuilderPages table exists
    const tableExists = await checkIfTableExists('page_builder_pages');
    
    if (tableExists) {
      console.log('Page Builder tables already exist, skipping migration.');
      return;
    }
    
    console.log('Creating Page Builder tables...');
    
    // Create the tables in the correct order due to references
    await createPageBuilderPagesTable();
    await createPageBuilderSectionsTable();
    await createPageBuilderComponentsTable();
    await createPageBuilderTemplatesTable();
    await createPageBuilderRecommendationsTable();
    await createPageBuilderVersionHistoryTable();
    
    console.log('Page Builder tables created successfully!');
    
  } catch (error) {
    console.error('Error during Page Builder table migrations:', error);
    throw error;
  }
}

async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    );
  `);
  
  return result.rows[0] && result.rows[0].exists === true;
}

async function createPageBuilderPagesTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "page_builder_pages" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" UUID NOT NULL REFERENCES "tenants"("id"),
      "name" VARCHAR(255) NOT NULL,
      "slug" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "template" VARCHAR(100),
      "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
      "page_type" VARCHAR(50) NOT NULL,
      "metadata" JSONB,
      "seo" JSONB,
      "business_context" JSONB,
      "analytics" JSONB,
      "version" INTEGER NOT NULL DEFAULT 1,
      "published" BOOLEAN NOT NULL DEFAULT false,
      "published_at" TIMESTAMP,
      "created_by" INTEGER REFERENCES "users"("id"),
      "last_edited_by" INTEGER REFERENCES "users"("id"),
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: page_builder_pages');
}

async function createPageBuilderSectionsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "page_builder_sections" (
      "id" SERIAL PRIMARY KEY,
      "page_id" INTEGER NOT NULL REFERENCES "page_builder_pages"("id") ON DELETE CASCADE,
      "name" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      "settings" JSONB,
      "seo_weight" INTEGER DEFAULT 5,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: page_builder_sections');
}

async function createPageBuilderComponentsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "page_builder_components" (
      "id" SERIAL PRIMARY KEY,
      "section_id" INTEGER NOT NULL REFERENCES "page_builder_sections"("id") ON DELETE CASCADE,
      "parent_id" INTEGER,
      "type" VARCHAR(50) NOT NULL,
      "label" VARCHAR(255),
      "context" VARCHAR(50) NOT NULL,
      "hidden" BOOLEAN NOT NULL DEFAULT false,
      "seo_impact" VARCHAR(20) NOT NULL DEFAULT 'low',
      "settings" JSONB NOT NULL,
      "content" JSONB,
      "metadata" JSONB,
      "analytics" JSONB,
      "order" INTEGER NOT NULL DEFAULT 0,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_parent FOREIGN KEY ("parent_id") REFERENCES "page_builder_components"("id") ON DELETE SET NULL
    );
  `);
  console.log('Created table: page_builder_components');
}

async function createPageBuilderTemplatesTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "page_builder_templates" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" UUID REFERENCES "tenants"("id"),
      "name" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "industry" JSONB,
      "purpose" VARCHAR(100),
      "seo_recommendations" JSONB,
      "complexity" VARCHAR(20) NOT NULL DEFAULT 'simple',
      "is_global" BOOLEAN NOT NULL DEFAULT false,
      "thumbnail" VARCHAR(500),
      "author" INTEGER REFERENCES "users"("id"),
      "structure" JSONB,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: page_builder_templates');
}

async function createPageBuilderRecommendationsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "page_builder_recommendations" (
      "id" SERIAL PRIMARY KEY,
      "page_id" INTEGER NOT NULL REFERENCES "page_builder_pages"("id") ON DELETE CASCADE,
      "type" VARCHAR(50) NOT NULL,
      "message" TEXT NOT NULL,
      "severity" VARCHAR(20) NOT NULL,
      "details" TEXT,
      "affected_components" JSONB,
      "improvement" TEXT,
      "auto_fix_available" BOOLEAN NOT NULL DEFAULT false,
      "dismissed" BOOLEAN NOT NULL DEFAULT false,
      "applied" BOOLEAN NOT NULL DEFAULT false,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: page_builder_recommendations');
}

async function createPageBuilderVersionHistoryTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "page_builder_version_history" (
      "id" SERIAL PRIMARY KEY,
      "page_id" INTEGER NOT NULL REFERENCES "page_builder_pages"("id") ON DELETE CASCADE,
      "version" INTEGER NOT NULL DEFAULT 1,
      "snapshot" JSONB NOT NULL,
      "changes" TEXT,
      "created_by" INTEGER REFERENCES "users"("id"),
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: page_builder_version_history');
}

// Export the migration function for use in the application
export { migratePageBuilderTables };

// If this script is run directly (not imported), execute the migration
if (require.main === module) {
  migratePageBuilderTables()
    .then(() => {
      console.log('Page Builder migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Page Builder migration failed:', error);
      process.exit(1);
    });
}