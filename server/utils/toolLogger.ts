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
  action: 'preview' | 'access' | 'install';
  timestamp: string;
  metadata?: Record<string, any>;
}

// Export constants
export { LOG_FILE_PATH };

/**
 * Logs a tool interaction to the tool_interactions.json file
 */
export async function logToolInteraction(
  userId: number,
  toolId: number,
  action: 'preview' | 'access' | 'install',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Create a new interaction entry
    const interaction: ToolInteraction = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      toolId,
      action,
      timestamp: new Date().toISOString(),
      metadata
    };

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
    
    console.log(`Tool interaction logged: ${action} for tool ${toolId} by user ${userId}`);
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