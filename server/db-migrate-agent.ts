/**
 * This script initializes the database tables for the Progress Agent feature
 */
import { db } from './db';
import { 
  conversationInsights, 
  agentConversations
} from '@shared/schema';

export async function migrateAgentTables() {
  console.log('Running Progress Agent migrations...');
  
  try {
    console.log('Starting Progress Agent table migrations...');
    
    // Check if agent_conversations table exists
    const agentConversationsExists = await checkIfTableExists('agent_conversations');
    if (agentConversationsExists) {
      console.log('ℹ️ agent_conversations table already exists, skipping creation.');
    } else {
      console.log('Creating agent_conversations table...');
      await db.schema.createTable(agentConversations).execute();
      console.log('✅ agent_conversations table created successfully.');
    }
    
    // Check if conversation_insights table exists
    const conversationInsightsExists = await checkIfTableExists('conversation_insights');
    if (conversationInsightsExists) {
      console.log('ℹ️ conversation_insights table already exists, skipping creation.');
    } else {
      console.log('Creating conversation_insights table...');
      await db.schema.createTable(conversationInsights).execute();
      console.log('✅ conversation_insights table created successfully.');
    }
    
    console.log('✅ Progress Agent database migration completed successfully');
  } catch (error) {
    console.error('❌ Error running Progress Agent database migrations:', error);
    throw error;
  }
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )`,
    [tableName]
  );
  
  return result.rows[0]?.exists === true;
}