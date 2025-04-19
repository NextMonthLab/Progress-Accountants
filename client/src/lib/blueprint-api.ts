import { apiRequest } from './queryClient';

// Define the client registry types 
export interface ClientRegistry {
  id: number;
  clientId: string;
  blueprintVersion: string;
  sector: string | null;
  location: string | null;
  projectStartDate: Date | null;
  userRoles: any | null;
  exportReady: boolean;
  handoffStatus: string;
  exportableModules: any[] | null;
  lastExported: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define module map item
export interface ModuleMapItem {
  moduleId: string;
  type: 'core' | 'custom' | 'automation';
  status: string;
  version: string;
  dependencies?: string[];
  exportPath?: string;
}

// Blueprint API service
export const blueprintApi = {
  // Get blueprint status
  async getStatus(): Promise<{
    clientId: string;
    blueprintVersion: string;
    exportReady: boolean;
    handoffStatus: string;
    lastExported: Date | null;
    moduleCount: number;
  }> {
    const response = await apiRequest('GET', '/api/blueprint/status');
    return await response.json();
  },
  
  // Create or update blueprint version
  async tagBlueprint(data: {
    clientId: string;
    blueprintVersion: string;
    sector?: string;
    location?: string;
    projectStartDate?: Date;
    userRoles?: any[];
    exportReady?: boolean;
    handoffStatus?: string;
  }): Promise<ClientRegistry> {
    const response = await apiRequest('POST', '/api/blueprint/tag', data);
    return await response.json();
  },
  
  // Generate module map and store it
  async generateModuleMap(clientId: string): Promise<{
    success: boolean;
    moduleCount: number;
    vaultSynced: boolean;
    modules: ModuleMapItem[];
  }> {
    const response = await apiRequest('POST', '/api/blueprint/modules', { clientId });
    return await response.json();
  },
  
  // Generate and export full blueprint package
  async generateBlueprintPackage(clientId: string): Promise<{
    success: boolean;
    blueprintVersion: string;
    vaultSynced: boolean;
    exportReady: boolean;
    timestamp: string;
  }> {
    const response = await apiRequest('POST', '/api/blueprint/package', { clientId });
    return await response.json();
  },
  
  // Notify Guardian about export
  async notifyGuardian(clientId: string, event: string = 'export-ready'): Promise<{
    success: boolean;
    guardianNotified: boolean;
    handoffStatus: string;
    timestamp: string;
  }> {
    const response = await apiRequest('POST', '/api/blueprint/notify-guardian', { clientId, event });
    return await response.json();
  },
  
  // Update handoff status
  async updateHandoffStatus(clientId: string, status: string): Promise<{
    success: boolean;
    clientId: string;
    blueprintVersion: string;
    handoffStatus: string;
    timestamp: string;
  }> {
    const response = await apiRequest('POST', '/api/blueprint/handoff-status', { clientId, status });
    return await response.json();
  }
};