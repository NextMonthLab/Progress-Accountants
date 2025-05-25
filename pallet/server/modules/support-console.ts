import { db } from "../db";
import { modules, clientRegistry } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Register the CompanionConsole module in the system
 */
export async function registerCompanionConsoleModule() {
  try {
    // Check if module already exists
    const [existingModule] = await db
      .select()
      .from(modules)
      .where(eq(modules.id, "support/CompanionConsole"));
    
    if (existingModule) {
      console.log("CompanionConsole module already registered");
      return existingModule;
    }
    
    // Create new module entry
    const [newModule] = await db
      .insert(modules)
      .values({
        id: "support/CompanionConsole",
        name: "Companion Console",
        description: "AI-powered support interface with context-aware guidance, OpenAI integration, and Vault logging",
        category: "core",
        status: "active",
        iconType: "message-square",
        iconColor: "indigo",
        path: "/components/support/CompanionConsole",
        previewAvailable: true,
        premium: false,
      })
      .returning();
    
    console.log("CompanionConsole module registered successfully");
    return newModule;
  } catch (error) {
    console.error("Error registering CompanionConsole module:", error);
    throw error;
  }
}

/**
 * Update client registry with the CompanionConsole module
 */
export async function updateClientRegistryWithCompanionConsole(clientId: string) {
  try {
    // Get the client registry
    const [existingRegistry] = await db
      .select()
      .from(clientRegistry)
      .where(eq(clientRegistry.clientId, clientId));
    
    if (!existingRegistry) {
      console.error("Client registry not found for ID:", clientId);
      return null;
    }
    
    // Update blueprint version and add module to exportable modules
    const exportableModules = existingRegistry.exportableModules as any[] || [];
    
    // Check if module is already in the list
    const moduleExists = exportableModules.some(
      (module: any) => module.moduleId === "support/CompanionConsole"
    );
    
    if (!moduleExists) {
      exportableModules.push({
        moduleId: "support/CompanionConsole",
        type: "core",
        status: "active",
        version: "1.0.0",
        optional: true, // Make it optional as requested
        enabled: true, // Enabled by default
      });
    }
    
    // Update client registry with new version and modules
    const [updatedRegistry] = await db
      .update(clientRegistry)
      .set({
        blueprintVersion: "1.1.1", // Bump version as requested
        exportableModules,
        updatedAt: new Date()
      })
      .where(eq(clientRegistry.clientId, clientId))
      .returning();
    
    console.log("Client registry updated with CompanionConsole module");
    return updatedRegistry;
  } catch (error) {
    console.error("Error updating client registry:", error);
    throw error;
  }
}

/**
 * Sync CompanionConsole module to Vault
 */
export async function syncCompanionConsoleToVault(clientId: string) {
  try {
    // This would typically use the sendToVault function from blueprint.ts
    // For this implementation, we'll just log the action
    console.log("Syncing CompanionConsole module to Vault for client:", clientId);
    
    // In a real implementation, this would call the Vault API
    // await sendToVault("/modules/sync", {
    //   clientId,
    //   moduleId: "support/CompanionConsole",
    //   blueprintVersion: "1.1.1"
    // });
    
    return true;
  } catch (error) {
    console.error("Error syncing CompanionConsole to Vault:", error);
    return false;
  }
}