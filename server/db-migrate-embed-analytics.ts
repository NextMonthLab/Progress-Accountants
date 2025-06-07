import { db, pool } from "./db";
import { sql } from "drizzle-orm";

export async function runEmbedAnalyticsMigrations() {
  console.log('Running Embed Analytics migrations...');
  console.log('Starting Embed Analytics table migrations...');

  try {
    // Create page_views table for tracking page visits
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        page_url TEXT NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        ip_address TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ page_views table created');

    // Create custom_events table for tracking custom events
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS custom_events (
        id SERIAL PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        page_url TEXT NOT NULL,
        event_name TEXT NOT NULL,
        event_data JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ custom_events table created');

    // Create indexes for performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_page_views_tenant_id ON page_views(tenant_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_custom_events_tenant_id ON custom_events(tenant_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_custom_events_session_id ON custom_events(session_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_custom_events_event_name ON custom_events(event_name);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_custom_events_timestamp ON custom_events(timestamp);
    `);

    console.log('✅ Embed Analytics indexes created');
    console.log('✅ Embed Analytics database migration completed successfully');

  } catch (error) {
    console.error('❌ Embed Analytics migration failed:', error);
    throw error;
  }
}

// Auto-run migrations if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runEmbedAnalyticsMigrations()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}