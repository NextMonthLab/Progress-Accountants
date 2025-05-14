import { storage } from '../storage';
import { ExternalTool, ToolInstallation, CreditUsageLog } from '@shared/marketplace';

/**
 * Service for interacting with the NextMonth marketplace
 */
class MarketplaceService {
  // Sample marketplace tools data
  private marketplaceTools: ExternalTool[] = [
    {
      id: 'invoice-generator-pro',
      name: 'Invoice Generator Pro',
      description: 'Create professional invoices with customizable templates and automatic calculations.',
      category: 'finance',
      installCount: 256,
      rating: 4.8,
      version: '2.3.1',
      isFree: false,
      credits: 20,
      authorId: 'nextmonth',
      authorName: 'NextMonth Development',
      thumbnailUrl: 'https://placehold.co/300x200?text=Invoice+Generator',
      lastUpdated: new Date('2025-04-01').toISOString(),
      visibility: 'public'
    },
    {
      id: 'tax-calculator',
      name: 'Tax Calculator',
      description: 'Calculate taxes for various business types with up-to-date rate tables.',
      category: 'finance',
      installCount: 189,
      rating: 4.6,
      version: '1.5.0',
      isFree: false,
      credits: 50,
      authorId: 'nextmonth',
      authorName: 'NextMonth Development',
      thumbnailUrl: 'https://placehold.co/300x200?text=Tax+Calculator',
      lastUpdated: new Date('2025-03-15').toISOString(),
      visibility: 'public'
    },
    {
      id: 'client-portal',
      name: 'Client Portal',
      description: 'Secure portal for clients to view and upload documents and communicate with your team.',
      category: 'client-management',
      installCount: 321,
      rating: 4.9,
      version: '3.1.0',
      isFree: false,
      credits: 100,
      authorId: 'nextmonth',
      authorName: 'NextMonth Development',
      thumbnailUrl: 'https://placehold.co/300x200?text=Client+Portal',
      lastUpdated: new Date('2025-04-10').toISOString(),
      visibility: 'public'
    },
    {
      id: 'cashflow-forecaster',
      name: 'Cashflow Forecaster',
      description: 'AI-powered tool to predict cash flow based on historical data and market trends.',
      category: 'finance',
      installCount: 145,
      rating: 4.7,
      version: '2.0.1',
      isFree: false,
      credits: 75,
      authorId: 'nextmonth',
      authorName: 'NextMonth Development',
      thumbnailUrl: 'https://placehold.co/300x200?text=Cashflow+Forecaster',
      lastUpdated: new Date('2025-02-28').toISOString(),
      visibility: 'public'
    },
    {
      id: 'document-digitizer',
      name: 'Document Digitizer',
      description: 'Convert paper documents to digital format with OCR and extract key data automatically.',
      category: 'document-management',
      installCount: 178,
      rating: 4.5,
      version: '1.8.3',
      isFree: true,
      credits: 0,
      authorId: 'nextmonth',
      authorName: 'NextMonth Development',
      thumbnailUrl: 'https://placehold.co/300x200?text=Document+Digitizer',
      lastUpdated: new Date('2025-01-20').toISOString(),
      visibility: 'public'
    }
  ];

  // Mock installations
  private toolInstallations: ToolInstallation[] = [
    {
      id: 1,
      toolId: 'invoice-generator-pro',
      installedBy: '1',
      installedAt: new Date('2025-05-01').toISOString(),
      smartSiteId: 'progress-accountants',
      status: 'active'
    }
  ];

  // Mock credit usage logs
  private creditUsageLogs: CreditUsageLog[] = [
    {
      id: 1,
      toolId: 'invoice-generator-pro',
      toolName: 'Invoice Generator Pro',
      credits: 20,
      timestamp: new Date().toISOString(),
      status: 'success'
    }
  ];

  /**
   * Get available tools from the marketplace
   */
  async getAvailableTools(visibility: 'public' | 'private' = 'public'): Promise<ExternalTool[]> {
    try {
      // In a real implementation, this would fetch from the NextMonth marketplace API
      // For now, we'll return the mock data
      return this.marketplaceTools.filter(tool => tool.visibility === visibility);
    } catch (error) {
      console.error('Error fetching marketplace tools:', error);
      throw error;
    }
  }

  /**
   * Get installed tools for a tenant
   */
  async getInstalledTools(tenantDomain: string): Promise<ToolInstallation[]> {
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll return the mock data
      return this.toolInstallations.filter(
        installation => installation.smartSiteId === 'progress-accountants'
      );
    } catch (error) {
      console.error('Error fetching installed tools:', error);
      throw error;
    }
  }

  /**
   * Install a tool from the marketplace
   */
  async installTool(toolId: string, userId: number): Promise<ToolInstallation | null> {
    try {
      // Check if the tool exists
      const tool = this.marketplaceTools.find(tool => tool.id === toolId);
      if (!tool) {
        throw new Error('Tool not found in marketplace');
      }

      // Check if the tool is already installed
      const existingInstallation = this.toolInstallations.find(
        installation => installation.toolId === toolId && installation.smartSiteId === 'progress-accountants'
      );

      if (existingInstallation) {
        throw new Error('Tool is already installed');
      }

      // Create a new installation
      const newInstallation: ToolInstallation = {
        id: this.toolInstallations.length + 1,
        toolId,
        installedBy: userId.toString(),
        installedAt: new Date().toISOString(),
        smartSiteId: 'progress-accountants',
        status: 'active'
      };

      // Add to installations
      this.toolInstallations.push(newInstallation);

      // Log the installation in the activity log
      await storage.logActivity({
        type: 'TOOL_INSTALLED',
        userId: userId,
        details: `Installed tool: ${tool.name}`,
        metadata: { toolId, toolName: tool.name }
      });

      return newInstallation;
    } catch (error) {
      console.error('Error installing tool:', error);
      throw error;
    }
  }

  /**
   * Uninstall a tool
   */
  async uninstallTool(installationId: number): Promise<boolean> {
    try {
      const index = this.toolInstallations.findIndex(installation => installation.id === installationId);
      
      if (index === -1) {
        throw new Error('Installation not found');
      }

      // Remove from installations
      this.toolInstallations.splice(index, 1);

      return true;
    } catch (error) {
      console.error('Error uninstalling tool:', error);
      throw error;
    }
  }

  /**
   * Log credit usage for a tool
   */
  async logCreditUsage(log: Omit<CreditUsageLog, 'id' | 'timestamp' | 'status' | 'toolName'>): Promise<void> {
    try {
      // Get the tool name
      const tool = this.marketplaceTools.find(t => t.id === log.toolId);
      
      if (!tool) {
        throw new Error('Tool not found');
      }

      const newLog: CreditUsageLog = {
        id: this.creditUsageLogs.length + 1,
        toolId: log.toolId,
        toolName: tool.name,
        credits: log.creditsUsed,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      this.creditUsageLogs.push(newLog);
    } catch (error) {
      console.error('Error logging credit usage:', error);
      throw error;
    }
  }

  /**
   * Register the Smart Site with NextMonth Dev
   */
  async registerSmartSite(): Promise<boolean> {
    try {
      // In a real implementation, this would register with the NextMonth Dev API
      // For now, we'll just return true
      return true;
    } catch (error) {
      console.error('Error registering Smart Site:', error);
      throw error;
    }
  }
}

export const marketplaceService = new MarketplaceService();