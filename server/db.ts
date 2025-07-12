import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configure Neon to use WebSockets
neonConfig.webSocketConstructor = ws;

// Database configuration with fallback for production deployment
let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
  console.log('✅ Database connection configured');
} else {
  console.warn(`
⚠️  DATABASE_URL not configured - running in database-free mode

For full functionality, configure DATABASE_URL:

Render deployment:
1. Create a PostgreSQL service on Render
2. Copy the "External Database URL" 
3. Add it as DATABASE_URL environment variable in web service settings

Local development:
1. Ensure your .env file contains DATABASE_URL
2. Make sure the database is running and accessible

Current environment: ${process.env.NODE_ENV || 'development'}
  `);
  
  // Create a mock database interface for form submissions
  db = {
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve([{ id: Date.now(), success: true }])
      })
    }),
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([])
      })
    })
  };
}

export { pool, db };

/**
 * Initialize database with default values if needed
 */
export async function initializeDb() {
  console.log("Initializing database...");
  
  // Add default initialization logic here if needed
  
  console.log("Database initialization complete");
}