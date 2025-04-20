/**
 * Blueprint management API functions
 */

/**
 * Register the CompanionConsole module in the blueprint system
 * @param clientId The ID of the client to register the module for
 * @returns Promise with the API response
 */
export async function registerCompanionConsole(clientId: string): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/register-companion-console', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
    
    if (!response.ok) {
      throw new Error(`Error registering CompanionConsole: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to register CompanionConsole:', error);
    throw error;
  }
}

/**
 * Get the current status of the client blueprint
 * @returns Promise with the blueprint status information
 */
export async function getBlueprintStatus(): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/status');
    
    if (!response.ok) {
      throw new Error(`Error getting blueprint status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get blueprint status:', error);
    throw error;
  }
}

/**
 * Generate and export the blueprint package to the vault
 * @param clientId The ID of the client to generate the package for
 * @returns Promise with the export result
 */
export async function exportBlueprintPackage(clientId: string): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/package', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
    
    if (!response.ok) {
      throw new Error(`Error exporting blueprint package: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to export blueprint package:', error);
    throw error;
  }
}

/**
 * Notify Guardian about the blueprint status
 * @param clientId The ID of the client 
 * @param event The event type (e.g., 'export-ready', 'module-added')
 * @returns Promise with the notification result
 */
export async function notifyGuardian(clientId: string, event = 'export-ready'): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/notify-guardian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, event }),
    });
    
    if (!response.ok) {
      throw new Error(`Error notifying Guardian: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to notify Guardian:', error);
    throw error;
  }
}

/**
 * Export Blueprint v1.1.1 with all announcement modules
 * @param clientId The ID of the client to export
 * @returns Promise with the export result
 */
export async function exportBlueprintV111(clientId: string): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/export-v1.1.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
    
    if (!response.ok) {
      throw new Error(`Error exporting Blueprint v1.1.1: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to export Blueprint v1.1.1:', error);
    throw error;
  }
}