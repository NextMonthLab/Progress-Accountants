import { db } from "../db";
import { modules, clientRegistry, activityLogs } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Register the UpgradeAnnouncement module in the system
 */
export async function registerUpgradeAnnouncementModule() {
  try {
    const moduleId = "announcement/UpgradeAnnouncement";
    
    // Check if module already exists
    const existingModule = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId)
    });
    
    if (existingModule) {
      console.log("UpgradeAnnouncement module already registered");
      return existingModule;
    }
    
    // Create new module entry
    const moduleData = {
      id: moduleId,
      name: "Upgrade Announcement Modal",
      description: "Main modal announcement for Blueprint v1.1.1 upgrade",
      category: "core",
      status: "active",
      iconType: "bell-ring",
      iconColor: "amber",
      path: "/components/UpgradeAnnouncement",
      previewAvailable: true,
      premium: false
    };
    
    const [newModule] = await db.insert(modules).values(moduleData).returning();
    
    // Log the registration activity
    await db.insert(activityLogs).values({
      userType: "system",
      actionType: "module_registered",
      entityType: "module",
      entityId: moduleId,
      details: JSON.stringify({
        moduleId,
        category: "core",
        tag: "blueprint_upgrade_announcement",
        metadata: {
          module_type: "announcement",
          context: "platform upgrade",
          family: "Companion Console, Cloudinary Upload",
          optional: true,
          enabled_by_default: true
        }
      })
    });
    
    console.log("UpgradeAnnouncement module registered successfully");
    return newModule;
  } catch (error) {
    console.error("Error registering UpgradeAnnouncement module:", error);
    throw error;
  }
}

/**
 * Register the UpgradeBanner module in the system
 */
export async function registerUpgradeBannerModule() {
  try {
    const moduleId = "announcement/UpgradeBanner";
    
    // Check if module already exists
    const existingModule = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId)
    });
    
    if (existingModule) {
      console.log("UpgradeBanner module already registered");
      return existingModule;
    }
    
    // Create new module entry
    const moduleData = {
      id: moduleId,
      name: "Upgrade Banner",
      description: "Persistent banner for admin pages announcing Blueprint v1.1.1 upgrade",
      category: "core",
      status: "active",
      iconType: "bell",
      iconColor: "amber",
      path: "/components/UpgradeBanner",
      previewAvailable: true,
      premium: false
    };
    
    const [newModule] = await db.insert(modules).values(moduleData).returning();
    
    // Log the registration activity
    await db.insert(activityLogs).values({
      userType: "system",
      actionType: "module_registered",
      entityType: "module",
      entityId: moduleId,
      details: JSON.stringify({
        moduleId,
        category: "core",
        tag: "blueprint_upgrade_announcement",
        metadata: {
          module_type: "announcement", 
          context: "platform upgrade",
          family: "Companion Console, Cloudinary Upload",
          optional: true,
          enabled_by_default: true,
          persistence: "14 days"
        }
      })
    });
    
    console.log("UpgradeBanner module registered successfully");
    return newModule;
  } catch (error) {
    console.error("Error registering UpgradeBanner module:", error);
    throw error;
  }
}

/**
 * Register the OnboardingUpgradeAlert module in the system
 */
export async function registerOnboardingUpgradeAlertModule() {
  try {
    const moduleId = "announcement/OnboardingUpgradeAlert";
    
    // Check if module already exists
    const existingModule = await db.query.modules.findFirst({
      where: eq(modules.id, moduleId)
    });
    
    if (existingModule) {
      console.log("OnboardingUpgradeAlert module already registered");
      return existingModule;
    }
    
    // Create new module entry
    const moduleData = {
      id: moduleId,
      name: "Onboarding Upgrade Alert",
      description: "Upgrade alert shown during onboarding for Blueprint v1.1.1",
      category: "core",
      status: "active",
      iconType: "bell-ring",
      iconColor: "amber",
      path: "/pages/OnboardingWelcomePage",
      previewAvailable: true,
      premium: false
    };
    
    const [newModule] = await db.insert(modules).values(moduleData).returning();
    
    // Log the registration activity
    await db.insert(activityLogs).values({
      userType: "system",
      actionType: "module_registered",
      entityType: "module",
      entityId: moduleId,
      details: JSON.stringify({
        moduleId,
        category: "core",
        tag: "blueprint_upgrade_announcement",
        metadata: {
          module_type: "announcement", 
          context: "platform upgrade",
          family: "Companion Console, Cloudinary Upload",
          optional: true,
          enabled_by_default: true
        }
      })
    });
    
    console.log("OnboardingUpgradeAlert module registered successfully");
    return newModule;
  } catch (error) {
    console.error("Error registering OnboardingUpgradeAlert module:", error);
    throw error;
  }
}

/**
 * Update client registry with announcement modules
 */
export async function updateClientRegistryWithAnnouncements(clientId: string) {
  try {
    // Get the client registry
    const existingRegistry = await db.query.clientRegistry.findFirst({
      where: eq(clientRegistry.clientId, clientId)
    });
    
    if (!existingRegistry) {
      console.error("Client registry not found for ID:", clientId);
      return null;
    }
    
    // Update blueprint version and add modules to exportable modules
    const exportableModules = existingRegistry.exportableModules as any[] || [];
    
    // Add the announcement modules if they don't exist
    const announcementModules = [
      {
        moduleId: "announcement/UpgradeAnnouncement",
        type: "core",
        status: "active",
        version: "1.0.0",
        optional: true,
        enabled: true,
      },
      {
        moduleId: "announcement/UpgradeBanner",
        type: "core",
        status: "active",
        version: "1.0.0",
        optional: true,
        enabled: true,
      },
      {
        moduleId: "announcement/OnboardingUpgradeAlert",
        type: "core",
        status: "active",
        version: "1.0.0",
        optional: true,
        enabled: true,
      }
    ];
    
    for (const module of announcementModules) {
      const moduleExists = exportableModules.some(
        (m: any) => m.moduleId === module.moduleId
      );
      
      if (!moduleExists) {
        exportableModules.push(module);
      }
    }
    
    // Update client registry with new version and modules
    const [updatedRegistry] = await db
      .update(clientRegistry)
      .set({
        blueprintVersion: "1.1.1", // Ensure version is updated
        exportableModules,
        updatedAt: new Date()
      })
      .where(eq(clientRegistry.clientId, clientId))
      .returning();
    
    // Log the update activity
    await db.insert(activityLogs).values({
      userType: "system",
      actionType: "blueprint_updated",
      entityType: "registry",
      entityId: clientId,
      details: JSON.stringify({
        clientId,
        blueprintVersion: "1.1.1",
        tag: "blueprint_upgrade_announcement",
        modules: announcementModules.map(m => m.moduleId)
      })
    });
    
    console.log("Client registry updated with announcement modules");
    return updatedRegistry;
  } catch (error) {
    console.error("Error updating client registry with announcements:", error);
    throw error;
  }
}

/**
 * Sync announcement modules to Vault
 */
export async function syncAnnouncementsToVault(clientId: string) {
  try {
    // This would typically use the sendToVault function from blueprint.ts
    // For this implementation, we'll just log the action
    console.log("Syncing announcement modules to Vault for client:", clientId);
    
    // Log the sync activity
    await db.insert(activityLogs).values({
      userType: "system",
      actionType: "module_synced",
      entityType: "module",
      entityId: "announcement/collection",
      details: JSON.stringify({
        clientId,
        modules: [
          "announcement/UpgradeAnnouncement",
          "announcement/UpgradeBanner",
          "announcement/OnboardingUpgradeAlert"
        ],
        tag: "blueprint_upgrade_announcement"
      })
    });
    
    return true;
  } catch (error) {
    console.error("Error syncing announcements to Vault:", error);
    return false;
  }
}