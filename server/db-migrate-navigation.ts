/**
 * This script initializes the database tables for the Navigation Menu feature
 */
import { pool } from './db';

async function migrateNavigationTables() {
  console.log('Running Navigation Menu migrations...');
  console.log('Starting Navigation Menu table migrations...');

  try {
    // Check if tables already exist
    const menuTableExists = await checkIfTableExists('navigation_menus');
    const menuItemsTableExists = await checkIfTableExists('menu_items');

    if (menuTableExists && menuItemsTableExists) {
      console.log('Navigation Menu tables already exist, skipping migration.');
      return;
    }

    // Create tables if they don't exist
    if (!menuTableExists) {
      await createNavigationMenusTable();
    }

    if (!menuItemsTableExists) {
      await createMenuItemsTable();
    }

    console.log('✅ Navigation Menu tables migration completed successfully.');
  } catch (error) {
    console.error('❌ Error during Navigation Menu tables migration:', error);
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = $1
    );
  `;
  
  const result = await pool.query(query, [tableName]);
  return result.rows[0].exists;
}

/**
 * Create the navigation_menus table
 */
async function createNavigationMenusTable() {
  console.log('Creating navigation_menus table...');
  
  const query = `
    CREATE TABLE navigation_menus (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(50) NOT NULL,
      tenant_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await pool.query(query);
  console.log('✅ navigation_menus table created successfully.');
}

/**
 * Create the menu_items table
 */
async function createMenuItemsTable() {
  console.log('Creating menu_items table...');
  
  const query = `
    CREATE TABLE menu_items (
      id SERIAL PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      url VARCHAR(1000) NOT NULL,
      parent_id INTEGER NULL REFERENCES menu_items(id) ON DELETE CASCADE,
      menu_id INTEGER NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
      location VARCHAR(50) NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      icon VARCHAR(50),
      is_external BOOLEAN DEFAULT FALSE,
      tenant_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await pool.query(query);
  console.log('✅ menu_items table created successfully.');
}

export default migrateNavigationTables;