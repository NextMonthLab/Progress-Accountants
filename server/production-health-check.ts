/**
 * Production health check and graceful startup
 * Validates database connection before starting the server
 */

import { pool } from './db.js';

export async function validateDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL')) {
        console.error(`
🚨 DEPLOYMENT ERROR: DATABASE_URL not configured

For Render deployment:
1. Create a PostgreSQL service on Render
2. Copy the "External Database URL"
3. Add it as DATABASE_URL environment variable in web service settings

See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions.
        `);
      }
    }
    
    return false;
  }
}

export async function gracefulStartup(): Promise<void> {
  const isDbConnected = await validateDatabaseConnection();
  
  if (!isDbConnected) {
    console.error('💥 Cannot start server without database connection');
    process.exit(1);
  }
  
  console.log('🚀 All systems ready - starting server...');
}