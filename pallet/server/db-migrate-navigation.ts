import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * This script initializes the database tables for the Navigation Menu feature
 */
async function migrateNavigationTables() {
  try {
    console.log('Starting Navigation Menu table migrations...');
    
    // Check if navigation_menus table exists
    const navigationMenusExists = await checkIfTableExists('navigation_menus');
    if (!navigationMenusExists) {
      console.log('Creating navigation_menus table...');
      await createNavigationMenusTable();
      console.log('✅ navigation_menus table created successfully');
    } else {
      console.log('ℹ️ navigation_menus table already exists, skipping creation.');
    }
    
    // Check if menu_items table exists
    const menuItemsExists = await checkIfTableExists('menu_items');
    if (!menuItemsExists) {
      console.log('Creating menu_items table...');
      await createMenuItemsTable();
      console.log('✅ menu_items table created successfully');
    } else {
      console.log('ℹ️ menu_items table already exists, skipping creation.');
    }
    
    console.log('✅ Navigation Menu database migration completed successfully');
  } catch (error) {
    console.error('⚠️ Error during Navigation Menu database migration:', error);
    throw error;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName}
    ) AS exists;
  `);
  
  return result.rows[0]?.exists === true;
}

/**
 * Create the navigation_menus table
 */
async function createNavigationMenusTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS navigation_menus (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      location VARCHAR(50) NOT NULL DEFAULT 'header',
      is_active BOOLEAN DEFAULT TRUE,
      tenant_id UUID NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Create the menu_items table
 */
async function createMenuItemsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      menu_id INTEGER NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
      parent_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
      label VARCHAR(100) NOT NULL,
      url VARCHAR(255) NOT NULL,
      icon VARCHAR(50),
      "order" INTEGER DEFAULT 0,
      is_external BOOLEAN DEFAULT FALSE,
      is_visible BOOLEAN DEFAULT TRUE,
      required_role VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export default migrateNavigationTables;