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
      // Create table using raw SQL
      await db.execute(`
        CREATE TABLE agent_conversations (
          id SERIAL PRIMARY KEY,
          conversation_id VARCHAR(64) NOT NULL UNIQUE,
          tenant_id UUID REFERENCES tenants(id),
          messages JSONB NOT NULL,
          mode VARCHAR(20) NOT NULL,
          metadata JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('✅ agent_conversations table created successfully.');
    }
    
    // Check if conversation_insights table exists
    const conversationInsightsExists = await checkIfTableExists('conversation_insights');
    if (conversationInsightsExists) {
      console.log('ℹ️ conversation_insights table already exists, skipping creation.');
    } else {
      console.log('Creating conversation_insights table...');
      // Create table using raw SQL
      await db.execute(`
        CREATE TABLE conversation_insights (
          id SERIAL PRIMARY KEY,
          conversation_id VARCHAR(64) NOT NULL,
          tenant_id UUID REFERENCES tenants(id),
          user_message TEXT NOT NULL,
          agent_response TEXT NOT NULL,
          mode VARCHAR(20) NOT NULL,
          intent TEXT,
          sentiment VARCHAR(20),
          lead_potential BOOLEAN DEFAULT FALSE,
          confusion_detected BOOLEAN DEFAULT FALSE,
          tags JSONB,
          analysis_notes TEXT,
          metadata JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
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
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = '${tableName}'
    )
  `;
  
  const result = await db.execute(query);
  return result.rows[0]?.exists === true;
}