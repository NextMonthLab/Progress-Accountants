import { sql } from 'drizzle-orm';
import { db } from './db';
import { 
  aiDesignSuggestions,
  aiComponentRecommendations,
  aiColorPalettes
} from '../shared/schema';

/**
 * This script initializes the database tables for the AI Design System feature
 */
export async function migrateAiDesignSystemTables() {
  console.log('Running AI Design System migrations...');
  
  try {
    console.log('Starting AI Design System table migrations...');
    
    // Check if tables already exist
    const aiDesignSuggestionsExists = await checkIfTableExists('ai_design_suggestions');
    const aiComponentRecommendationsExists = await checkIfTableExists('ai_component_recommendations');
    const aiColorPalettesExists = await checkIfTableExists('ai_color_palettes');
    
    if (aiDesignSuggestionsExists && aiComponentRecommendationsExists && aiColorPalettesExists) {
      console.log('AI Design System tables already exist, skipping migration.');
      return;
    }
    
    // Create tables that don't exist yet
    if (!aiDesignSuggestionsExists) {
      await createAiDesignSuggestionsTable();
    } else {
      console.log('ℹ️ ai_design_suggestions table already exists, skipping creation.');
    }
    
    if (!aiComponentRecommendationsExists) {
      await createAiComponentRecommendationsTable();
    } else {
      console.log('ℹ️ ai_component_recommendations table already exists, skipping creation.');
    }
    
    if (!aiColorPalettesExists) {
      await createAiColorPalettesTable();
    } else {
      console.log('ℹ️ ai_color_palettes table already exists, skipping creation.');
    }
    
    console.log('✅ AI Design System database migration completed successfully');
    
  } catch (error) {
    console.error('❌ Error during AI Design System table migrations:', error);
    throw error;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = ${tableName}
      ) as "exists";
    `);
    
    // Handle the boolean explicitly
    if (result.rows && result.rows.length > 0) {
      const exists = result.rows[0].exists;
      return typeof exists === 'boolean' ? exists : exists === 'true' || exists === 't' || exists === '1';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if table exists:', error);
    return false;
  }
}

/**
 * Create the ai_design_suggestions table
 */
async function createAiDesignSuggestionsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ai_design_suggestions" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" UUID REFERENCES "tenants"("id"),
      "page_type" VARCHAR(50) NOT NULL,
      "business_type" VARCHAR(100) NOT NULL,
      "components" JSONB NOT NULL,
      "layouts" JSONB NOT NULL,
      "color_palettes" JSONB,
      "seo_recommendations" JSONB,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: ai_design_suggestions');
}

/**
 * Create the ai_component_recommendations table
 */
async function createAiComponentRecommendationsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ai_component_recommendations" (
      "id" SERIAL PRIMARY KEY,
      "page_id" INTEGER NOT NULL REFERENCES "page_builder_pages"("id") ON DELETE CASCADE,
      "section_id" INTEGER REFERENCES "page_builder_sections"("id") ON DELETE CASCADE,
      "context" VARCHAR(100) NOT NULL,
      "recommendations" JSONB NOT NULL,
      "reasoning" TEXT,
      "used" BOOLEAN NOT NULL DEFAULT false,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: ai_component_recommendations');
}

/**
 * Create the ai_color_palettes table
 */
async function createAiColorPalettesTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ai_color_palettes" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" UUID REFERENCES "tenants"("id"),
      "name" VARCHAR(100) NOT NULL,
      "primary_color" VARCHAR(7) NOT NULL,
      "secondary_color" VARCHAR(7) NOT NULL,
      "accent_color" VARCHAR(7) NOT NULL,
      "text_color" VARCHAR(7) NOT NULL,
      "background_color" VARCHAR(7) NOT NULL,
      "additional_colors" JSONB,
      "mood" VARCHAR(50),
      "industry" VARCHAR(100),
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Created table: ai_color_palettes');
}