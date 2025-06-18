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
 * Get detailed module status from the client registry
 * @param clientId The ID of the client
 * @returns Promise with the module status information
 */
export async function getModuleStatus(clientId: string): Promise<any> {
  try {
    const response = await fetch(`/api/blueprint/module-status/${clientId}`);
    
    if (!response.ok) {
      throw new Error(`Error getting module status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get module status:', error);
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

/**
 * Auto-publish Blueprint v1.1.1 to the Vault as the default version
 * @param clientId The ID of the client to publish
 * @param vaultPath The path in the vault to store the blueprint (default: 'blueprints/client/v1.1.1/')
 * @returns Promise with the publish result
 */
export async function autoPublishBlueprintV111(
  clientId: string, 
  vaultPath = 'blueprints/client/v1.1.1/'
): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/auto-publish-v1.1.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, vaultPath }),
    });
    
    if (!response.ok) {
      throw new Error(`Error auto-publishing Blueprint v1.1.1: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to auto-publish Blueprint v1.1.1:', error);
    throw error;
  }
}

/**
 * Auto-enable Blueprint v1.1.1 modules for new client instance
 * @param clientId The ID of the client to enable modules for
 * @returns Promise with the auto-enable result
 */
export async function autoEnableV111Modules(clientId: string): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/auto-enable-v111', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId }),
    });
    
    if (!response.ok) {
      throw new Error(`Error auto-enabling Blueprint v1.1.1 modules: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to auto-enable Blueprint v1.1.1 modules:', error);
    throw error;
  }
}

/**
 * Report a module loading failure for graceful fallback handling
 * @param moduleId The ID of the module that failed to load
 * @param context Additional context about the failure
 * @returns Promise with the failure handling result
 */
export async function reportModuleLoadingFailure(
  moduleId: string, 
  context: string = "Unknown loading error"
): Promise<any> {
  try {
    const response = await fetch('/api/blueprint/module-loading-failure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moduleId, context }),
    });
    
    if (!response.ok) {
      throw new Error(`Error reporting module loading failure: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to report module loading failure:', error);
    throw error;
  }
}