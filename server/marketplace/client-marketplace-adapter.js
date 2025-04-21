/**
 * NextMonth Marketplace Client Adapter
 * 
 * This module provides a client adapter for interacting with the NextMonth Dev Marketplace API.
 * It enables Progress Accountants to browse, install, and manage tools from the marketplace.
 */

import axios from 'axios';

// Demo data for development and testing when marketplace API is unavailable
const demoData = {
  tools: [
    {
      id: 1,
      name: "Client Financial Dashboard",
      description: "Comprehensive financial insights with customizable KPIs, cash flow tracking, and tax planning tools.",
      toolCategory: "dashboards",
      toolType: "financial",
      toolVersion: "1.2.0",
      status: "live",
      createdBy: "NextMonth Dev Team",
      isPopular: true
    },
    {
      id: 2,
      name: "Tax Calculator Suite",
      description: "Collection of specialized tax calculators for accountants, including income tax estimator, VAT calculator, and corporate tax planner.",
      toolCategory: "calculators",
      toolType: "tax",
      toolVersion: "2.1.0",
      status: "live",
      createdBy: "NextMonth Dev Team",
      isPopular: true
    },
    {
      id: 3,
      name: "Client Portal Template",
      description: "Secure client portal template with document sharing, payment integration, and communication features.",
      toolCategory: "page_templates",
      toolType: "client",
      toolVersion: "1.0.0",
      status: "live",
      createdBy: "NextMonth Dev Team",
      isPopular: false
    },
    {
      id: 4,
      name: "Budget Planner",
      description: "Interactive budget planning tool with scenario analysis and forecasting capabilities.",
      toolCategory: "tools",
      toolType: "financial",
      toolVersion: "1.3.0",
      status: "live",
      createdBy: "NextMonth Dev Team",
      isPopular: true
    },
    {
      id: 5,
      name: "Invoice Generator",
      description: "Professional invoice creation tool with customizable templates, automatic numbering, and tax calculation.",
      toolCategory: "tools",
      toolType: "billing",
      toolVersion: "2.0.0",
      status: "live",
      createdBy: "NextMonth Dev Team",
      isPopular: false
    },
    {
      id: 6,
      name: "Expense Tracker",
      description: "Comprehensive expense tracking tool with receipt scanning, categorization, and reporting features.",
      toolCategory: "tools",
      toolType: "financial",
      toolVersion: "1.1.0",
      status: "live",
      createdBy: "NextMonth Dev Team",
      isPopular: false
    }
  ],
  categories: [
    { id: 'page_templates', name: 'Page Templates' },
    { id: 'tools', name: 'Tools' },
    { id: 'calculators', name: 'Calculators' },
    { id: 'dashboards', name: 'Dashboards' }
  ],
  installed: []
};

/**
 * Creates a marketplace client instance for a specific tenant
 * 
 * @param {string} tenantId - The ID of the tenant making the request
 * @param {string} baseUrl - The base URL of the marketplace API
 * @param {string|null|undefined} apiKey - Optional API key for authenticated requests
 * @returns {Object} - Client instance with marketplace methods
 */
export function createClient(tenantId, baseUrl = 'https://nextmonth-dev.replit.app', apiKey = undefined) {
  // Local memory for simulating persistence when real API is unavailable
  const localInstalledTools = [];
  const localToolConfigurations = {};
  
  // Create axios instance with common configuration
  const client = axios.create({
    baseURL: `${baseUrl}/api/marketplace`,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
      ...(apiKey ? { 'X-API-Key': apiKey } : {})
    }
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    response => response.data,
    error => {
      console.log('Marketplace API Error:', error.message);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
      }
      // Instead of throwing an error, return a rejected promise
      // This allows the catch blocks in each method to handle the error
      return Promise.reject(error);
    }
  );

  return {
    /**
     * Get available tools from the marketplace
     * @param {Object} filters - Optional filters for the tools query
     * @returns {Promise<Array>} - List of available tools
     */
    async getAvailableTools(filters = {}) {
      try {
        const params = new URLSearchParams();
        
        // Add any provided filters as query parameters
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
        
        return await client.get('/tools', { params });
      } catch (error) {
        console.error('Failed to fetch available tools:', error);
        
        // Filter demo tools based on the provided category filter
        if (filters.category) {
          return demoData.tools.filter(tool => 
            tool.toolCategory === filters.category
          );
        }
        
        // Return demo tools if the API isn't available
        return demoData.tools;
      }
    },

    /**
     * Get available tool categories
     * @returns {Promise<Array>} - List of tool categories
     */
    async getCategories() {
      try {
        return await client.get('/categories');
      } catch (error) {
        console.error('Failed to fetch tool categories:', error);
        // Return default categories if the API isn't available
        return demoData.categories;
      }
    },

    /**
     * Get tools installed for this tenant
     * @returns {Promise<Array>} - List of installed tools
     */
    async getInstalledTools() {
      try {
        return await client.get('/installed');
      } catch (error) {
        console.error('Failed to fetch installed tools:', error);
        
        // Return local installed tools if the API isn't available
        return localInstalledTools.map(installId => {
          const tool = demoData.tools.find(t => t.id === installId);
          return {
            tool: tool,
            installation: {
              id: installId,
              status: 'active',
              installDate: new Date().toISOString()
            }
          };
        });
      }
    },

    /**
     * Install a tool from the marketplace
     * @param {number} toolId - ID of the tool to install
     * @param {Object} configuration - Tool configuration options
     * @param {string|null} userEmail - Email of the user installing the tool
     * @returns {Promise<Object>} - Result of the installation
     */
    async installTool(toolId, configuration = {}, userEmail = null) {
      try {
        const payload = {
          toolId,
          configuration,
          ...(userEmail ? { userEmail } : {})
        };
        
        return await client.post('/install', payload);
      } catch (error) {
        console.error('Failed to install tool:', error);
        
        // Check if the tool exists in demo data
        const tool = demoData.tools.find(t => t.id === toolId);
        if (!tool) {
          throw new Error('Tool not found');
        }
        
        // Simulate installation in local memory
        if (!localInstalledTools.includes(toolId)) {
          localInstalledTools.push(toolId);
          localToolConfigurations[toolId] = configuration;
        }
        
        return {
          success: true,
          installationId: toolId,
          message: 'Tool installed successfully',
          tool: tool
        };
      }
    },

    /**
     * Uninstall a tool
     * @param {number} installationId - ID of the tool installation to remove
     * @returns {Promise<Object>} - Result of the uninstallation
     */
    async uninstallTool(installationId) {
      try {
        return await client.post(`/uninstall/${installationId}`);
      } catch (error) {
        console.error('Failed to uninstall tool:', error);
        
        // Simulate uninstallation in local memory
        const index = localInstalledTools.indexOf(installationId);
        if (index !== -1) {
          localInstalledTools.splice(index, 1);
          delete localToolConfigurations[installationId];
        }
        
        return {
          success: true,
          message: 'Tool uninstalled successfully'
        };
      }
    },

    /**
     * Get configuration for an installed tool
     * @param {number} installationId - ID of the tool installation
     * @returns {Promise<Object>} - Tool configuration
     */
    async getToolConfiguration(installationId) {
      try {
        return await client.get(`/config/${installationId}`);
      } catch (error) {
        console.error('Failed to get tool configuration:', error);
        
        // Return local configuration if available
        if (localToolConfigurations[installationId]) {
          return {
            success: true,
            configuration: localToolConfigurations[installationId]
          };
        }
        
        throw new Error('Tool not installed or configuration not found');
      }
    },

    /**
     * Update configuration for an installed tool
     * @param {number} installationId - ID of the tool installation
     * @param {Object} configuration - New configuration settings
     * @returns {Promise<Object>} - Updated tool configuration
     */
    async updateToolConfiguration(installationId, configuration) {
      try {
        return await client.patch(`/config/${installationId}`, { configuration });
      } catch (error) {
        console.error('Failed to update tool configuration:', error);
        
        // Update local configuration
        if (localInstalledTools.includes(installationId)) {
          localToolConfigurations[installationId] = {
            ...localToolConfigurations[installationId] || {},
            ...configuration
          };
          
          return {
            success: true,
            message: 'Configuration updated successfully',
            configuration: localToolConfigurations[installationId]
          };
        }
        
        throw new Error('Tool not installed');
      }
    }
  };
}