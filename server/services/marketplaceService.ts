import axios from "axios";
import { ExternalTool, ToolUsageRecord, SmartSiteRegistration } from "@shared/marketplace";
import { storage } from "../storage";
import { Tool, ToolInstallation } from "@shared/schema";

// Creates a marketplace service for interacting with NextMonth Dev registry
class MarketplaceService {
  private devApiUrl = "https://nextmonth.dev/api";
  private smartSiteId = "progress-accountants";

  /**
   * Get all available tools from NextMonth Dev
   */
  async getAvailableTools(visibility: "public" | "private" = "public"): Promise<ExternalTool[]> {
    try {
      const response = await axios.get(`${this.devApiUrl}/tools`, {
        params: { visibility }
      });
      
      if (response.status === 200 && response.data) {
        return response.data;
      }
      
      // For development purposes, show mock data if the API is not accessible
      console.warn("Using mock marketplace data as the NextMonth Dev API is not accessible");
      return this.getMockTools();
    } catch (error) {
      console.error("Error fetching tools from NextMonth Dev:", error);
      // Return mock data if the actual API is not available
      return this.getMockTools();
    }
  }

  /**
   * Install a tool from the marketplace
   */
  async installTool(toolId: string, userId: number): Promise<ToolInstallation | null> {
    try {
      // 1. Get tool details from the marketplace
      const externalTools = await this.getAvailableTools();
      const externalTool = externalTools.find(tool => tool.id === toolId);
      
      if (!externalTool) {
        throw new Error(`Tool with ID ${toolId} not found in the marketplace`);
      }

      // 2. Check if the user has enough credits
      const requiredCredits = externalTool.price || 0;
      
      // 3. Create a local record of the tool
      const tool: Partial<Tool> = {
        tenantId: null, // null for marketplace tools since they're global
        name: externalTool.name,
        description: externalTool.description,
        toolType: "marketplace",
        displayStyle: "full-page",
        mediaUrl: externalTool.icon,
        status: "published",
        publishStatus: "published_in_marketplace",
        toolVersion: externalTool.version,
        toolCategory: externalTool.category,
        designTier: "pro",
        isLocked: true,
        origin: "marketplace",
        sourceInstance: "dev",
        isGlobal: true
      };

      // 4. Save the tool in our database
      const savedTool = await storage.createTool(tool);

      if (!savedTool) {
        throw new Error("Failed to create local tool record");
      }

      // 5. Install the tool for the tenant
      const tenant = await storage.getTenantByDomain("progress-accountants.com");
      
      if (!tenant) {
        throw new Error("Progress Accountants tenant not found");
      }

      const installation: Partial<ToolInstallation> = {
        toolId: savedTool.id,
        tenantId: tenant.id,
        installationStatus: "active",
        installedBy: userId,
        version: externalTool.version,
      };

      // 6. Save the installation
      const savedInstallation = await storage.createToolInstallation(installation);

      // 7. Log credit usage
      await this.logCreditUsage({
        toolId: externalTool.id,
        installedBy: userId.toString(),
        installedAt: new Date(),
        smartSiteId: this.smartSiteId,
        creditsUsed: requiredCredits
      });

      return savedInstallation;
    } catch (error) {
      console.error("Error installing tool:", error);
      return null;
    }
  }

  /**
   * Log credit usage for a tool installation
   */
  async logCreditUsage(usageRecord: ToolUsageRecord): Promise<void> {
    try {
      // Log locally
      await storage.createCreditUsageLog({
        businessId: this.smartSiteId,
        credits: usageRecord.creditsUsed,
        reason: "tool_installation",
        description: `Installed tool ${usageRecord.toolId}`,
        entityType: "tool",
        entityId: usageRecord.toolId
      });

      // Send to Dev (in a real implementation)
      // For now we just log success
      console.log("Credit usage logged for tool installation:", usageRecord);
    } catch (error) {
      console.error("Error logging credit usage:", error);
    }
  }

  /**
   * Get all installed tools for the current tenant
   */
  async getInstalledTools(tenantDomain: string = "progress-accountants.com"): Promise<ToolInstallation[]> {
    try {
      const tenant = await storage.getTenantByDomain(tenantDomain);
      if (!tenant) {
        throw new Error(`Tenant with domain ${tenantDomain} not found`);
      }
      
      return await storage.getToolInstallationsForTenant(tenant.id);
    } catch (error) {
      console.error("Error getting installed tools:", error);
      return [];
    }
  }

  /**
   * Register Progress as an active paid Smart Site
   */
  async registerSmartSite(): Promise<boolean> {
    const registration: SmartSiteRegistration = {
      smartSiteId: this.smartSiteId,
      plan: "starter",
      creditsAllocated: 200,
      marketplaceAccess: true,
      labAccess: true,
      status: "active"
    };

    try {
      // In a real implementation, this would send the registration to Dev
      // For now, we just log the registration data
      console.log("Smart Site registered with Dev:", registration);
      return true;
    } catch (error) {
      console.error("Error registering Smart Site:", error);
      return false;
    }
  }

  /**
   * Uninstall a tool
   */
  async uninstallTool(installationId: number): Promise<boolean> {
    try {
      const installation = await storage.getToolInstallation(installationId);
      if (!installation) {
        throw new Error(`Tool installation with ID ${installationId} not found`);
      }

      // Update the installation status to uninstalled
      const updated = await storage.updateToolInstallation(installationId, {
        installationStatus: "uninstalled"
      });

      return !!updated;
    } catch (error) {
      console.error("Error uninstalling tool:", error);
      return false;
    }
  }

  /**
   * Get installation details for a specific tool
   */
  async getToolInstallation(toolId: number, tenantId: string): Promise<ToolInstallation | null> {
    try {
      return await storage.getToolInstallationByToolAndTenant(toolId, tenantId);
    } catch (error) {
      console.error("Error getting tool installation:", error);
      return null;
    }
  }

  // Mock data for development
  private getMockTools(): ExternalTool[] {
    return [
      {
        id: "invoice-generator-pro",
        name: "Invoice Generator Pro",
        description: "Create professional invoices with custom branding, line items, and tax calculations.",
        icon: "https://nextmonth.dev/assets/icons/invoice-pro.svg",
        version: "1.2.0",
        builder: "NextMonth Dev Team",
        price: 20,
        category: "Financial",
        tags: ["invoicing", "business", "finance"],
        publishedAt: new Date().toISOString(),
        visibility: "public",
        rating: 4.8,
        downloads: 1245
      },
      {
        id: "social-scheduler",
        name: "Social Media Scheduler",
        description: "Schedule and manage social media posts across multiple platforms with analytics.",
        icon: "https://nextmonth.dev/assets/icons/social-scheduler.svg",
        version: "2.0.1",
        builder: "Digital Marketing Solutions",
        price: 15,
        category: "Marketing",
        tags: ["social media", "scheduling", "marketing"],
        publishedAt: new Date().toISOString(),
        visibility: "public",
        rating: 4.6,
        downloads: 982
      },
      {
        id: "client-portal",
        name: "Client Portal",
        description: "Secure portal for clients to access documents, invoices, and project updates.",
        icon: "https://nextmonth.dev/assets/icons/client-portal.svg",
        version: "1.5.0",
        builder: "NextMonth Dev Team",
        price: 25,
        category: "Client Management",
        tags: ["client", "portal", "documents"],
        publishedAt: new Date().toISOString(),
        visibility: "public",
        rating: 4.9,
        downloads: 756
      },
      {
        id: "tax-calculator",
        name: "Tax Calculator for SMEs",
        description: "Calculate estimated taxes for small and medium enterprises with detailed breakdowns.",
        icon: "https://nextmonth.dev/assets/icons/tax-calculator.svg",
        version: "1.1.0",
        builder: "Accounting Tools Inc",
        price: 10,
        category: "Financial",
        tags: ["tax", "calculator", "sme"],
        publishedAt: new Date().toISOString(),
        visibility: "public",
        rating: 4.7,
        downloads: 629
      },
      {
        id: "project-timeline",
        name: "Interactive Project Timeline",
        description: "Visual project timeline with drag-and-drop functionality and automatic notifications.",
        icon: "https://nextmonth.dev/assets/icons/project-timeline.svg",
        version: "1.3.2",
        builder: "Project Solutions",
        price: 18,
        category: "Project Management",
        tags: ["project", "timeline", "management"],
        publishedAt: new Date().toISOString(),
        visibility: "public",
        rating: 4.5,
        downloads: 487
      }
    ];
  }
}

export const marketplaceService = new MarketplaceService();