import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE_PATH = path.join(LOG_DIR, 'tool_interactions.json');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Create empty JSON array file if it doesn't exist
if (!fs.existsSync(LOG_FILE_PATH)) {
  fs.writeFileSync(LOG_FILE_PATH, '[]', 'utf-8');
}

export interface ToolInteraction {
  id: string;
  userId: number;
  toolId: number;
  action: 'preview' | 'access' | 'install' | 'launch';
  timestamp: string;
  metadata?: Record<string, any>;
}

// Export constants
export { LOG_FILE_PATH };

/**
 * Logs a tool interaction to the tool_interactions.json file
 * @param arg1 Either a userId or a complete ToolInteraction object
 * @param toolId The ID of the tool being interacted with
 * @param action The type of interaction
 * @param metadata Additional metadata for the interaction
 */
export async function logToolInteraction(
  arg1: number | Partial<ToolInteraction>,
  toolId?: number,
  action?: 'preview' | 'access' | 'install' | 'launch',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    let interaction: ToolInteraction;
    
    // Check if the first argument is a ToolInteraction object
    if (typeof arg1 === 'object') {
      interaction = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: arg1.userId || 0,
        toolId: arg1.toolId || 0,
        action: arg1.action || 'access',
        timestamp: new Date().toISOString(),
        metadata: arg1.metadata
      };
    } else {
      // Create a new interaction entry with separate arguments
      interaction = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: arg1,
        toolId: toolId || 0,
        action: action || 'access',
        timestamp: new Date().toISOString(),
        metadata
      };
    }

    // Read existing logs
    let logs: ToolInteraction[] = [];
    
    if (fs.existsSync(LOG_FILE_PATH)) {
      const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
      try {
        logs = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error parsing log file:', error);
      }
    }

    // Add the new interaction to logs
    logs.push(interaction);

    // Write back to file
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
    
    console.log(`Tool interaction logged: ${interaction.action} for tool ${interaction.toolId} by user ${interaction.userId}`);
  } catch (error) {
    console.error('Error logging tool interaction:', error);
  }
}

/**
 * Get tool interactions for a specific user
 */
export async function getUserToolInteractions(userId: number): Promise<ToolInteraction[]> {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return [];
    }

    const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
    const logs: ToolInteraction[] = JSON.parse(fileContent);
    
    return logs.filter(log => log.userId === userId);
  } catch (error) {
    console.error('Error getting user tool interactions:', error);
    return [];
  }
}

/**
 * Get tool interactions for a specific tool
 */
export async function getToolInteractions(toolId: number): Promise<ToolInteraction[]> {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return [];
    }

    const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
    const logs: ToolInteraction[] = JSON.parse(fileContent);
    
    return logs.filter(log => log.toolId === toolId);
  } catch (error) {
    console.error('Error getting tool interactions:', error);
    return [];
  }
}