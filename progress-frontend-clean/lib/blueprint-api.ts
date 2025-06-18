import { apiRequest } from "./queryClient";

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
  moduleCount?: number;
}

export interface ModuleMapItem {
  moduleId: string;
  type: 'core' | 'custom' | 'automation';
  status: string;
  version: string;
  dependencies?: string[];
  exportPath?: string;
}

export interface BlueprintStatus {
  clientId: string;
  blueprintVersion: string;
  exportReady: boolean;
  handoffStatus: string;
  moduleCount: number;
  lastExported: Date | null;
}

export const blueprintApi = {
  async getStatus(): Promise<BlueprintStatus> {
    const res = await apiRequest("GET", "/api/blueprint/status");
    return await res.json();
  },

  async tagBlueprint(data: {
    clientId: string;
    blueprintVersion: string;
    sector: string;
    location: string;
    projectStartDate?: Date;
  }): Promise<ClientRegistry> {
    const res = await apiRequest("POST", "/api/blueprint/tag", data);
    return await res.json();
  },

  async generateModuleMap(clientId: string): Promise<{
    moduleCount: number;
    modules: ModuleMapItem[];
  }> {
    const res = await apiRequest("POST", "/api/blueprint/modules", { clientId });
    return await res.json();
  },

  async generateBlueprintPackage(clientId: string): Promise<{
    packageId: string;
    vaultSynced: boolean;
  }> {
    const res = await apiRequest("POST", "/api/blueprint/package", { clientId });
    return await res.json();
  },

  async notifyGuardian(clientId: string, event: string = 'export-ready'): Promise<{
    success: boolean;
    handoffStatus: string;
  }> {
    const res = await apiRequest("POST", "/api/blueprint/notify-guardian", { clientId, event });
    return await res.json();
  },

  async updateHandoffStatus(clientId: string, status: string): Promise<{
    clientId: string;
    handoffStatus: string;
  }> {
    const res = await apiRequest("POST", "/api/blueprint/handoff-status", { clientId, status });
    return await res.json();
  }
};