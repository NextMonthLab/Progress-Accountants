import { Router } from 'express';
import { marketplaceService } from '../services/marketplaceService';

export function registerToolMarketplaceRoutes(router: Router) {
  // Get all available tools from the marketplace
  router.get('/api/marketplace/tools', async (req, res) => {
    try {
      const visibility = req.query.visibility as 'public' | 'private' || 'public';
      const tools = await marketplaceService.getAvailableTools(visibility);
      return res.status(200).json(tools);
    } catch (error) {
      console.error('Error fetching marketplace tools:', error);
      return res.status(500).json({ error: 'Failed to fetch marketplace tools' });
    }
  });

  // Get all installed tools
  router.get('/api/marketplace/tools/installed', async (req, res) => {
    try {
      const tenantDomain = req.query.tenantDomain as string || 'progress-accountants.com';
      const installedTools = await marketplaceService.getInstalledTools(tenantDomain);
      return res.status(200).json(installedTools);
    } catch (error) {
      console.error('Error fetching installed tools:', error);
      return res.status(500).json({ error: 'Failed to fetch installed tools' });
    }
  });

  // Install a tool from the marketplace
  router.post('/api/marketplace/tools/install', async (req, res) => {
    try {
      const { toolId } = req.body;
      if (!toolId) {
        return res.status(400).json({ error: 'Tool ID is required' });
      }

      const userId = req.user?.id || 1; // Default to admin ID if user not authenticated
      const installation = await marketplaceService.installTool(toolId, userId);
      
      if (!installation) {
        return res.status(400).json({ error: 'Failed to install tool' });
      }

      return res.status(200).json(installation);
    } catch (error) {
      console.error('Error installing tool:', error);
      return res.status(500).json({ 
        error: 'Failed to install tool',
        message: error.message 
      });
    }
  });

  // Uninstall a tool
  router.post('/api/marketplace/tools/uninstall', async (req, res) => {
    try {
      const { installationId } = req.body;
      if (!installationId) {
        return res.status(400).json({ error: 'Installation ID is required' });
      }

      const success = await marketplaceService.uninstallTool(installationId);
      
      if (!success) {
        return res.status(400).json({ error: 'Failed to uninstall tool' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error uninstalling tool:', error);
      return res.status(500).json({ error: 'Failed to uninstall tool' });
    }
  });

  // Log credit usage
  router.post('/api/marketplace/credits/log', async (req, res) => {
    try {
      const { toolId, creditsUsed, details } = req.body;
      
      if (!toolId || creditsUsed === undefined) {
        return res.status(400).json({ error: 'Tool ID and credits used are required' });
      }

      const userId = req.user?.id || 1; // Default to admin ID if user not authenticated
      
      await marketplaceService.logCreditUsage({
        toolId,
        installedBy: userId.toString(),
        installedAt: new Date(),
        smartSiteId: 'progress-accountants',
        creditsUsed
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error logging credit usage:', error);
      return res.status(500).json({ error: 'Failed to log credit usage' });
    }
  });

  // Get credit usage for the tenant
  router.get('/api/marketplace/credits/usage', async (req, res) => {
    try {
      // Mock usage data for now - we would implement this with database queries in production
      const usageData = {
        total: 125,
        logs: [
          {
            id: 1,
            toolId: "invoice-generator-pro",
            toolName: "Invoice Generator Pro",
            credits: 20,
            timestamp: new Date().toISOString(),
            status: 'success'
          },
          {
            id: 2,
            toolId: "tax-calculator",
            toolName: "Tax Calculator",
            credits: 50,
            timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            status: 'success'
          },
          {
            id: 3,
            toolId: "client-portal",
            toolName: "Client Portal",
            credits: 55,
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'success'
          }
        ]
      };
      
      return res.status(200).json(usageData);
    } catch (error) {
      console.error('Error fetching credit usage:', error);
      return res.status(500).json({ error: 'Failed to fetch credit usage' });
    }
  });

  // Register the Smart Site with NextMonth Dev
  router.post('/api/marketplace/register', async (req, res) => {
    try {
      const success = await marketplaceService.registerSmartSite();
      
      if (!success) {
        return res.status(400).json({ error: 'Failed to register Smart Site' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error registering Smart Site:', error);
      return res.status(500).json({ error: 'Failed to register Smart Site' });
    }
  });
}