import { sql } from 'drizzle-orm';
import { db } from './db';

/**
 * This script adds the missing is_locked column to the page_builder_pages table
 */
export async function fixPageBuilderTables() {
  console.log('Starting Page Builder table fix...');
  
  try {
    // Check if the is_locked column exists
    const columnExists = await checkIfColumnExists('page_builder_pages', 'is_locked');
    
    if (columnExists) {
      console.log('is_locked column already exists, skipping migration.');
      return;
    }
    
    console.log('Adding is_locked column to page_builder_pages table...');
    
    // Add the is_locked column
    await db.execute(sql`
      ALTER TABLE "page_builder_pages"
      ADD COLUMN "is_locked" BOOLEAN NOT NULL DEFAULT false;
    `);
    
    console.log('Added is_locked column to page_builder_pages table successfully!');
    
  } catch (error) {
    console.error('Error during Page Builder table fix:', error);
    throw error;
  }
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
  
  return result.rows[0] && result.rows[0].exists === true;
}

// Add the missing origin and cloned_from_id columns if they don't exist
async function addMissingColumns() {
  try {
    // Check if the origin column exists
    const originColumnExists = await checkIfColumnExists('page_builder_pages', 'origin');
    
    if (!originColumnExists) {
      console.log('Adding origin column to page_builder_pages table...');
      await db.execute(sql`
        ALTER TABLE "page_builder_pages"
        ADD COLUMN "origin" VARCHAR(50) DEFAULT 'builder';
      `);
      console.log('Added origin column to page_builder_pages table successfully!');
    }
    
    // Check if the cloned_from_id column exists
    const clonedFromIdColumnExists = await checkIfColumnExists('page_builder_pages', 'cloned_from_id');
    
    if (!clonedFromIdColumnExists) {
      console.log('Adding cloned_from_id column to page_builder_pages table...');
      await db.execute(sql`
        ALTER TABLE "page_builder_pages"
        ADD COLUMN "cloned_from_id" INTEGER;
      `);
      console.log('Added cloned_from_id column to page_builder_pages table successfully!');
    }
  } catch (error) {
    console.error('Error adding missing columns:', error);
    throw error;
  }
}

// Export the migration function for use in the application
export { addMissingColumns };

// If this script is run directly (not imported), execute the migration
// Using ES Module approach for detecting if file is run directly
import { fileURLToPath } from 'url';

// Get the current file's path as a URL
const currentFileUrl = import.meta.url;
// Convert the URL to a file path
const currentFilePath = fileURLToPath(currentFileUrl);
// Check if this file is the main module (i.e., it's being run directly)
if (process.argv[1] === currentFilePath) {
  Promise.all([fixPageBuilderTables(), addMissingColumns()])
    .then(() => {
      console.log('Page Builder fix completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Page Builder fix failed:', error);
      process.exit(1);
    });
}