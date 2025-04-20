import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { ModuleActivation, Module, insertClientRegistrySchema } from "@shared/schema";
import { PageMetadata } from "@shared/page_metadata";
import axios from "axios";

// Import support module functions
import { 
  registerCompanionConsoleModule, 
  updateClientRegistryWithCompanionConsole,
  syncCompanionConsoleToVault
} from "./modules/support-console";

// Validation schema for the blueprint version
const blueprintVersionSchema = z.object({
  clientId: z.string().min(3),
  blueprintVersion: z.string().min(3),
  sector: z.string().optional(),
  location: z.string().optional(),
  projectStartDate: z.date().optional(),
  userRoles: z.array(z.object({
    name: z.string(),
    permissions: z.array(z.string())
  })).optional(),
  exportReady: z.boolean().optional(),
  handoffStatus: z.string().optional()
});

// Validation schema for module map item
const moduleMapItemSchema = z.object({
  moduleId: z.string().min(1),
  type: z.enum(["core", "custom", "automation"]),
  status: z.string().min(1),
  version: z.string().min(1),
  dependencies: z.array(z.string()).optional(),
  exportPath: z.string().optional()
});

const moduleMapSchema = z.array(moduleMapItemSchema);

// Helper to get all active modules 
async function getActiveModules(): Promise<Module[]> {
  const allModules = await storage.getAllModules();
  return allModules.filter(module => module.status === "active");
}

// Helper to create exportable module data
async function createExportableModuleMap(): Promise<any[]> {
  const activeModules = await getActiveModules();
  
  return activeModules.map(module => {
    return {
      moduleId: module.id,
      type: module.category === "core" ? "core" : 
            module.category === "automation" ? "automation" : "custom",
      status: "active",
      version: "1.0.0", // Default version
      dependencies: [],
      exportPath: `/modules/${module.id}.zip`
    };
  });
}

// Helper to create blueprint package
async function createBlueprintPackage(clientId: string, version: string): Promise<any> {
  // Get SEO configurations
  const seoConfigs = await storage.getAllSeoConfigurations();
  
  // Get active brand version
  const brandVersion = await storage.getActiveBrandVersion();
  
  // Get onboarding states template
  const onboardingTemplate = await storage.getOnboardingState(1); // Assume user ID 1 has template
  
  // Get module activations
  const moduleActivations = await storage.getModuleActivations();
  
  // Import page metadata
  const pageMetadataModule = await import("@shared/page_metadata");
  
  return {
    clientId,
    blueprintVersion: version,
    timestamp: new Date().toISOString(),
    pageMetadata: pageMetadataModule,
    seoConfigurations: seoConfigs,
    brandConfiguration: brandVersion,
    onboardingTemplate: onboardingTemplate,
    moduleActivations: moduleActivations.map(ma => ({
      moduleId: ma.moduleId,
      activatedAt: ma.activatedAt,
      pageMetadata: ma.pageMetadata
    }))
  };
}

// Helper to call Guardian API
async function notifyGuardian(clientId: string, event: string, data: any): Promise<boolean> {
  try {
    // Check if we have Guardian API URL in environment
    if (!process.env.GUARDIAN_API_URL) {
      console.warn("Guardian API URL not configured");
      return false;
    }
    
    const response = await axios.post(`${process.env.GUARDIAN_API_URL}/log-export`, {
      clientId,
      event,
      timestamp: new Date().toISOString(),
      data
    });
    
    return response.status === 200;
  } catch (error) {
    console.error("Error notifying Guardian:", error);
    return false;
  }
}

// Helper to call Vault API
async function sendToVault(endpoint: string, data: any): Promise<boolean> {
  try {
    // Check if we have Vault API URL in environment
    if (!process.env.VAULT_API_URL) {
      console.warn("Vault API URL not configured");
      return false;
    }
    
    const response = await axios.post(`${process.env.VAULT_API_URL}${endpoint}`, data);
    
    return response.status === 200;
  } catch (error) {
    console.error(`Error sending to Vault ${endpoint}:`, error);
    return false;
  }
}

export function registerBlueprintRoutes(app: Express): void {
  // Get blueprint status
  app.get("/api/blueprint/status", async (req: Request, res: Response) => {
    try {
      const registry = await storage.getClientRegistry();
      
      if (!registry) {
        return res.status(404).json({ 
          message: "Blueprint not initialized",
          status: "not_configured"
        });
      }
      
      return res.status(200).json({
        clientId: registry.clientId,
        blueprintVersion: registry.blueprintVersion,
        exportReady: registry.exportReady,
        handoffStatus: registry.handoffStatus,
        lastExported: registry.lastExported,
        moduleCount: registry.exportableModules ? 
          (Array.isArray(registry.exportableModules) ? registry.exportableModules.length : 0) : 0
      });
    } catch (error) {
      console.error("Error getting blueprint status:", error);
      return res.status(500).json({ message: "Error getting blueprint status" });
    }
  });
  
  // Create or update blueprint version
  app.post("/api/blueprint/tag", async (req: Request, res: Response) => {
    try {
      const validationResult = blueprintVersionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid blueprint data",
          errors: validationResult.error.format() 
        });
      }
      
      const data = validationResult.data;
      
      // Check if registry exists
      const existingRegistry = await storage.getClientRegistry();
      
      if (existingRegistry) {
        // Update existing registry
        const updated = await storage.updateClientRegistry(data.clientId, data);
        return res.status(200).json(updated);
      } else {
        // Create new registry with client ID and version
        const created = await storage.createClientRegistry({
          clientId: data.clientId,
          blueprintVersion: data.blueprintVersion,
          sector: data.sector,
          location: data.location,
          projectStartDate: data.projectStartDate,
          userRoles: data.userRoles,
          exportReady: data.exportReady || false,
          handoffStatus: data.handoffStatus || "in_progress"
        });
        
        return res.status(201).json(created);
      }
    } catch (error) {
      console.error("Error tagging blueprint:", error);
      return res.status(500).json({ message: "Error tagging blueprint" });
    }
  });
  
  // Generate module map and store it
  app.post("/api/blueprint/modules", async (req: Request, res: Response) => {
    try {
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ message: "clientId is required" });
      }
      
      // Get registry
      const registry = await storage.getClientRegistry();
      
      if (!registry || registry.clientId !== clientId) {
        return res.status(404).json({ message: "Blueprint registry not found" });
      }
      
      // Create module map
      const moduleMap = await createExportableModuleMap();
      
      // Update registry with module map
      const updated = await storage.updateExportableModules(clientId, moduleMap);
      
      // Send to Vault
      const vaultSuccess = await sendToVault("/blueprint/modules", {
        clientId,
        blueprintVersion: registry.blueprintVersion,
        modules: moduleMap
      });
      
      return res.status(200).json({
        success: true,
        moduleCount: moduleMap.length,
        vaultSynced: vaultSuccess,
        modules: moduleMap
      });
      
    } catch (error) {
      console.error("Error generating module map:", error);
      return res.status(500).json({ message: "Error generating module map" });
    }
  });
  
  // Generate and export full blueprint package
  app.post("/api/blueprint/package", async (req: Request, res: Response) => {
    try {
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ message: "clientId is required" });
      }
      
      // Get registry
      const registry = await storage.getClientRegistry();
      
      if (!registry || registry.clientId !== clientId) {
        return res.status(404).json({ message: "Blueprint registry not found" });
      }
      
      // Create blueprint package
      const blueprintPackage = await createBlueprintPackage(
        clientId, 
        registry.blueprintVersion
      );
      
      // Send to Vault
      const vaultSuccess = await sendToVault("/blueprint/package", {
        clientId,
        blueprintVersion: registry.blueprintVersion,
        package: blueprintPackage
      });
      
      // Mark as export ready
      const updated = await storage.markAsExportReady(clientId, true);
      
      return res.status(200).json({
        success: true,
        blueprintVersion: registry.blueprintVersion,
        vaultSynced: vaultSuccess,
        exportReady: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error generating blueprint package:", error);
      return res.status(500).json({ message: "Error generating blueprint package" });
    }
  });
  
  // Notify Guardian about export
  app.post("/api/blueprint/notify-guardian", async (req: Request, res: Response) => {
    try {
      const { clientId, event = "export-ready" } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ message: "clientId is required" });
      }
      
      // Get registry
      const registry = await storage.getClientRegistry();
      
      if (!registry || registry.clientId !== clientId) {
        return res.status(404).json({ message: "Blueprint registry not found" });
      }
      
      // Notify Guardian
      const guardianSuccess = await notifyGuardian(clientId, event, {
        blueprintVersion: registry.blueprintVersion,
        exportReady: registry.exportReady,
        handoffStatus: registry.handoffStatus,
        lastExported: registry.lastExported
      });
      
      // Update handoff status
      const updated = await storage.updateHandoffStatus(clientId, "completed");
      
      return res.status(200).json({
        success: true,
        guardianNotified: guardianSuccess,
        handoffStatus: "completed",
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error notifying Guardian:", error);
      return res.status(500).json({ message: "Error notifying Guardian" });
    }
  });
  
  // Register and sync the CompanionConsole module
  app.post("/api/blueprint/register-companion-console", async (req: Request, res: Response) => {
    try {
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ 
          success: false, 
          message: "clientId is required" 
        });
      }
      
      // Step 1: Register the module in the system
      const module = await registerCompanionConsoleModule();
      
      // Step 2: Update client registry with the module and new version
      const updatedRegistry = await updateClientRegistryWithCompanionConsole(clientId);
      
      if (!updatedRegistry) {
        return res.status(404).json({ 
          success: false, 
          message: "Client registry not found" 
        });
      }
      
      // Step 3: Sync to Vault
      const vaultSynced = await syncCompanionConsoleToVault(clientId);
      
      // Step 4: Optional - Notify Guardian
      const guardianSuccess = await notifyGuardian(clientId, "module-added", {
        moduleId: "support/CompanionConsole",
        blueprintVersion: "1.1.1",
        timestamp: new Date().toISOString()
      });
      
      return res.status(200).json({
        success: true,
        message: "CompanionConsole module registered and synced successfully",
        module: {
          id: module.id,
          name: module.name,
          category: module.category,
          status: module.status
        },
        blueprintVersion: updatedRegistry.blueprintVersion,
        vaultSynced,
        guardianNotified: guardianSuccess
      });
      
    } catch (error) {
      console.error("Error registering CompanionConsole module:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error registering CompanionConsole module" 
      });
    }
  });
  
  // Update handoff status
  app.post("/api/blueprint/handoff-status", async (req: Request, res: Response) => {
    try {
      const { clientId, status } = req.body;
      
      if (!clientId || !status) {
        return res.status(400).json({ message: "clientId and status are required" });
      }
      
      // Get registry
      const registry = await storage.getClientRegistry();
      
      if (!registry || registry.clientId !== clientId) {
        return res.status(404).json({ message: "Blueprint registry not found" });
      }
      
      // Update handoff status
      const updated = await storage.updateHandoffStatus(clientId, status);
      
      return res.status(200).json({
        success: true,
        clientId,
        blueprintVersion: updated?.blueprintVersion,
        handoffStatus: updated?.handoffStatus,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error updating handoff status:", error);
      return res.status(500).json({ message: "Error updating handoff status" });
    }
  });
}