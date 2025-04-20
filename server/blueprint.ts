import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { ModuleActivation, Module, insertClientRegistrySchema, modules, activityLogs, blueprintVersions } from "@shared/schema";
import { PageMetadata } from "@shared/page_metadata";
import axios from "axios";
import fs from "fs";
import archiver from "archiver";
import { eq } from "drizzle-orm";
import { db } from "./db";

// Import support module functions
import { 
  registerCompanionConsoleModule, 
  updateClientRegistryWithCompanionConsole,
  syncCompanionConsoleToVault
} from "./modules/support-console";

// Import announcement module functions
import {
  registerUpgradeAnnouncementModule,
  registerUpgradeBannerModule,
  registerOnboardingUpgradeAlertModule,
  updateClientRegistryWithAnnouncements,
  syncAnnouncementsToVault
} from "./modules/upgrade-announcements";

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

/**
 * Prepares a blueprint export manifest 
 * @param clientId - Client ID to package for
 * @param version - Blueprint version
 * @param moduleIds - List of module IDs to include
 * @returns Export manifest data
 */
async function prepareExportManifest(clientId: string, version: string, moduleIds: string[]): Promise<any> {
  try {
    // Get module data from storage
    const allModules = await storage.getAllModules();
    
    // Filter modules by IDs and create export objects
    const moduleData = allModules
      .filter(module => moduleIds.includes(module.id))
      .map(module => ({
        id: module.id,
        name: module.name,
        description: module.description,
        category: module.category,
        path: module.path,
        optional: module.id.startsWith('announcement/') ? true : false,
        enabled_by_default: true,
        metadata: module.id.startsWith('announcement/') ? {
          module_type: 'announcement',
          context: 'platform upgrade',
          family: 'Companion Console, Cloudinary Upload',
          optional: true,
          enabled_by_default: true,
          persistence: module.id === 'announcement/UpgradeBanner' ? '14 days' : undefined
        } : undefined
      }));
    
    // Create export manifest
    const exportManifest = {
      clientId,
      blueprintVersion: version,
      exportTimestamp: new Date().toISOString(),
      modules: moduleData,
      deprecated: false,
      exportId: `client-blueprint-v${version}-${Date.now()}`
    };
    
    return exportManifest;
  } catch (error) {
    console.error('Error preparing export manifest:', error);
    throw error;
  }
}

/**
 * Publishes blueprint v1.1.1 to the Vault as the default version
 * @param clientId - Client ID to publish for
 * @param vaultPath - Path in vault to store at (e.g. blueprints/client/v1.1.1/)
 * @returns Success status
 */
async function publishBlueprintToVault(clientId: string, vaultPath: string = 'blueprints/client/v1.1.1/'): Promise<boolean> {
  try {
    // Step 1: Prepare module list for the blueprint
    const modulesToExport = [
      "support/CompanionConsole",
      "media/CloudinaryUpload",
      "announcement/UpgradeAnnouncement",
      "announcement/UpgradeBanner",
      "announcement/OnboardingUpgradeAlert"
    ];
    
    // Step 2: Create export manifest
    const exportManifest = await prepareExportManifest(clientId, "1.1.1", modulesToExport);
    
    // Step 3: Send Blueprint manifest to Vault
    const manifestSent = await sendToVault('/store-blueprint', {
      path: `${vaultPath}manifest.json`,
      data: exportManifest,
      setAsDefault: true
    });
    
    if (!manifestSent) {
      console.error("Failed to send blueprint manifest to Vault");
      return false;
    }
    
    // Step 4: Create zipfile with all modules
    const zipPath = `${vaultPath}client-blueprint-v1.1.1.zip`;
    const zipSuccess = await sendToVault('/store-blueprint-zip', {
      path: zipPath,
      modules: modulesToExport,
      manifestId: exportManifest.exportId
    });
    
    if (!zipSuccess) {
      console.error("Failed to send blueprint ZIP to Vault");
      return false;
    }
    
    // Step 5: Update vault configuration to use this as default for new clients
    const configSuccess = await sendToVault('/set-default-blueprint', {
      version: "1.1.1",
      zipPath: zipPath,
      manifestPath: `${vaultPath}manifest.json`,
      forAllClients: true,
      markAsActive: true,
      onboardingVersion: "1.1.1",
      deprecateOthers: true
    });
    
    // Log activity
    await storage.addActivityLog({
      userType: "system",
      actionType: "blueprint_publish",
      entityType: "blueprint",
      entityId: clientId,
      details: JSON.stringify({
        version: "1.1.1",
        path: vaultPath,
        manifestId: exportManifest.exportId,
        modules: modulesToExport,
        setAsDefault: true,
        timestamp: new Date().toISOString()
      })
    });
    
    return configSuccess;
  } catch (error) {
    console.error("Error publishing blueprint to Vault:", error);
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
  
  // Register and sync the Upgrade Announcement modules
  app.post("/api/blueprint/register-upgrade-announcements", async (req: Request, res: Response) => {
    try {
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ 
          success: false, 
          message: "clientId is required" 
        });
      }
      
      // Step 1: Register the announcement modules
      const announcementModule = await registerUpgradeAnnouncementModule();
      const bannerModule = await registerUpgradeBannerModule();
      const onboardingAlertModule = await registerOnboardingUpgradeAlertModule();
      
      // Step 2: Update client registry with the modules and new version
      const updatedRegistry = await updateClientRegistryWithAnnouncements(clientId);
      
      if (!updatedRegistry) {
        return res.status(404).json({ 
          success: false, 
          message: "Client registry not found" 
        });
      }
      
      // Step 3: Sync to Vault
      const vaultSynced = await syncAnnouncementsToVault(clientId);
      
      // Step 4: Notify Guardian about the upgrade
      const guardianSuccess = await notifyGuardian(clientId, "blueprint-upgraded", {
        fromVersion: "1.1.0",
        toVersion: "1.1.1",
        modules: [
          "announcement/UpgradeAnnouncement",
          "announcement/UpgradeBanner",
          "announcement/OnboardingUpgradeAlert"
        ],
        timestamp: new Date().toISOString(),
        tag: "blueprint_upgrade_announcement"
      });
      
      return res.status(200).json({
        success: true,
        message: "Upgrade announcement modules registered and synced successfully",
        modules: [
          announcementModule,
          bannerModule,
          onboardingAlertModule
        ],
        blueprintVersion: updatedRegistry.blueprintVersion,
        vaultSynced,
        guardianNotified: guardianSuccess
      });
      
    } catch (error) {
      console.error("Error registering upgrade announcement modules:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error registering upgrade announcement modules" 
      });
    }
  });
  
  // Export Blueprint v1.1.1 with announcement modules
  app.post("/api/blueprint/export-v1.1.1", async (req: Request, res: Response) => {
    try {
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ 
          success: false, 
          message: "clientId is required" 
        });
      }
      
      // Get registry
      const registry = await storage.getClientRegistry();
      
      if (!registry || registry.clientId !== clientId) {
        return res.status(404).json({ 
          success: false, 
          message: "Client registry not found" 
        });
      }
      
      // Update blueprint version to 1.1.1
      const updatedRegistry = await storage.updateClientRegistry(clientId, {
        blueprintVersion: "1.1.1",
        exportReady: true,
        lastExported: new Date()
      });
      
      // Try to mark v1.1.0 as deprecated (if available)
      try {
        // Get existing blueprint versions
        const existingVersions = await storage.getAllBlueprintVersions();
        
        // Find and update v1.1.0 if it exists
        const v110 = existingVersions.find(v => v.version === "1.1.0");
        if (v110) {
          await storage.deprecateBlueprintVersion("1.1.0");
        }
      } catch (versionError) {
        console.warn("Could not deprecate v1.1.0:", versionError);
      }
      
      // List of modules to export
      const modulesToExport = [
        "support/CompanionConsole",
        "media/CloudinaryUpload",
        "announcement/UpgradeAnnouncement",
        "announcement/UpgradeBanner",
        "announcement/OnboardingUpgradeAlert"
      ];
      
      // Prepare the export manifest
      const exportManifest = await prepareExportManifest(clientId, "1.1.1", modulesToExport);
      
      // Update Blueprint status in storage
      await storage.updateExportableModules(clientId, modulesToExport);
      
      // Notify Guardian
      const guardianSuccess = await notifyGuardian(clientId, "blueprint-exported", {
        blueprintVersion: "1.1.1",
        moduleCount: modulesToExport.length,
        exportId: exportManifest.exportId,
        timestamp: new Date().toISOString()
      });
      
      // Log export action (if activity logs table exists)
      try {
        await storage.addActivityLog({
          userType: "system",
          actionType: "blueprint_export",
          entityType: "blueprint",
          entityId: clientId,
          details: JSON.stringify({
            blueprintVersion: "1.1.1",
            modules: modulesToExport,
            exportId: exportManifest.exportId,
            timestamp: new Date().toISOString()
          })
        });
      } catch (logError) {
        console.warn("Could not log export activity:", logError);
      }
      
      return res.status(200).json({
        success: true,
        message: "Blueprint v1.1.1 exported successfully",
        blueprintVersion: "1.1.1",
        exportId: exportManifest.exportId,
        modules: modulesToExport,
        guardianNotified: guardianSuccess,
        manifest: exportManifest
      });
      
    } catch (error) {
      console.error("Error exporting Blueprint v1.1.1:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error exporting Blueprint v1.1.1" 
      });
    }
  });

  // Auto-publish blueprint v1.1.1 to Vault
  app.post("/api/blueprint/auto-publish-v1.1.1", async (req: Request, res: Response) => {
    try {
      const { clientId, vaultPath = 'blueprints/client/v1.1.1/' } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ 
          success: false, 
          message: "clientId is required" 
        });
      }
      
      // First ensure client registry is at v1.1.1
      const registry = await storage.getClientRegistry();
      
      if (!registry || registry.clientId !== clientId) {
        return res.status(404).json({ 
          success: false, 
          message: "Client registry not found" 
        });
      }
      
      // Update blueprint version to 1.1.1 if not already
      if (registry.blueprintVersion !== "1.1.1") {
        await storage.updateClientRegistry(clientId, {
          blueprintVersion: "1.1.1",
          exportReady: true,
          lastExported: new Date()
        });
      }
      
      // Execute the publish operation
      const publishSuccess = await publishBlueprintToVault(clientId, vaultPath);
      
      if (!publishSuccess) {
        return res.status(500).json({
          success: false,
          message: "Failed to publish blueprint to Vault"
        });
      }
      
      // Notify Guardian about the default status
      const guardianSuccess = await notifyGuardian(clientId, "blueprint-default-set", {
        version: "1.1.1",
        path: vaultPath,
        forAllClients: true,
        onboardingVersion: "1.1.1",
        timestamp: new Date().toISOString()
      });
      
      return res.status(200).json({
        success: true,
        message: "Blueprint v1.1.1 published to Vault as default",
        version: "1.1.1",
        path: vaultPath,
        guardianNotified: guardianSuccess,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error auto-publishing blueprint v1.1.1:", error);
      return res.status(500).json({
        success: false,
        message: "Error auto-publishing blueprint v1.1.1"
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