import { db } from './db';

export async function migrateAiResponseFields() {
  console.log('Running AI Response fields migration...');
  
  try {
    console.log('Adding AI response fields to messages table...');
    
    // Add ai_response column
    await db.execute(`
      ALTER TABLE messages 
      ADD COLUMN IF NOT EXISTS ai_response TEXT
    `);
    
    // Add ai_response_sent_at column
    await db.execute(`
      ALTER TABLE messages 
      ADD COLUMN IF NOT EXISTS ai_response_sent_at TIMESTAMP
    `);
    
    console.log('✅ AI response fields added to messages table');
    console.log('✅ AI Response database migration completed successfully');
    
  } catch (error) {
    console.error('❌ AI Response migration failed:', error);
    throw error;
  }
}