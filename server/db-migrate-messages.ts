import { db } from "./db";

export async function migrateMessagesTable() {
  console.log('Running Messages table migrations...');
  console.log('Starting Messages table migrations...');
  
  try {
    // Create the messages table with proper structure
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        client_id VARCHAR(255) NOT NULL,
        source_url TEXT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        message_body TEXT NOT NULL,
        archived BOOLEAN DEFAULT FALSE,
        auto_response_status VARCHAR(20) DEFAULT 'pending' CHECK (auto_response_status IN ('pending', 'sent', 'failed')),
        auto_response_text TEXT,
        admin_notes TEXT
      )
    `);
    console.log('✅ messages table created');

    // Create indexes for efficient querying
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_messages_client_id ON messages(client_id)
    `);
    console.log('✅ messages client_id index created');

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)
    `);
    console.log('✅ messages created_at index created');

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_messages_client_created ON messages(client_id, created_at DESC)
    `);
    console.log('✅ messages composite index created');

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(archived)
    `);
    console.log('✅ messages archived index created');

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_messages_auto_response_status ON messages(auto_response_status)
    `);
    console.log('✅ messages auto_response_status index created');

    // Create trigger for updated_at timestamp
    await db.execute(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ update_updated_at_column function created');

    await db.execute(`
      DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
      CREATE TRIGGER update_messages_updated_at
        BEFORE UPDATE ON messages
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ messages updated_at trigger created');

    console.log('✅ Messages database migration completed successfully');
  } catch (error) {
    console.error('Error running Messages table migrations:', error);
    throw error;
  }
}