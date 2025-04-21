/**
 * NextMonth Marketplace Client Adapter
 * Connects Progress Accountants instance to the NextMonth Dev Marketplace
 */

import axios from 'axios';

/**
 * Create a marketplace client instance
 * @param {string} tenantId - The client tenant ID
 * @param {string} baseUrl - The NextMonth Dev API base URL
 * @param {string} apiKey - Optional API key for enhanced security
 * @returns {Object} - Marketplace client methods
 */
export function createClient(tenantId, baseUrl = 'https://nextmonth-dev.replit.app', apiKey = null) {
  // Configure axios instance with base settings
  const client = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
      ...(apiKey ? { 'X-API-Key': apiKey } : {})
    }
  });

  // Handle API errors consistently
  function handleApiError(error) {
    console.error('Marketplace API Error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      throw new Error(
        error.response.data.message || 
        `API error: ${error.response.status} - ${error.response.statusText}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from marketplace API. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }

  // Return client methods
  return {
    /**
     * Get all available tools from marketplace
     * @param {Object} filters - Optional filters like category
     * @returns {Promise<Array>} - List of available tools
     */
    async getAvailableTools(filters = {}) {
      try {
        let url = '/api/tools/marketplace';
        
        // Add query parameters for filtering
        if (Object.keys(filters).length > 0) {
          const params = new URLSearchParams();
          Object.entries(filters).forEach(([key, value]) => {
            params.append(key, value);
          });
          url += `?${params.toString()}`;
        }
        
        const response = await client.get(url);
        return response.data || [];
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get available tool categories
     * @returns {Promise<Array>} - List of categories
     */
    async getCategories() {
      try {
        const response = await client.get('/api/tools/marketplace/categories');
        return response.data || [];
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get all tools installed for this client
     * @returns {Promise<Array>} - List of installed tools
     */
    async getInstalledTools() {
      try {
        const response = await client.get('/api/tools/installed');
        return response.data || [];
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Install a tool with custom configuration
     * @param {number} toolId - ID of the tool to install
     * @param {Object} configuration - Custom tool configuration
     * @param {string} userEmail - Email of user performing installation
     * @returns {Promise<Object>} - Installation result
     */
    async installTool(toolId, configuration = {}, userEmail = null) {
      try {
        const response = await client.post(`/api/tools/marketplace/install/${toolId}`, {
          configuration,
          installed_by: userEmail,
        });
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Uninstall a tool
     * @param {number} installationId - ID of the installation to remove
     * @returns {Promise<Object>} - Uninstallation result
     */
    async uninstallTool(installationId) {
      try {
        const response = await client.post(`/api/tools/uninstall/${installationId}`);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Get configuration for an installed tool
     * @param {number} installationId - ID of the installation
     * @returns {Promise<Object>} - Tool configuration
     */
    async getToolConfiguration(installationId) {
      try {
        const response = await client.get(`/api/tool-installations/${installationId}/config`);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },

    /**
     * Update configuration for an installed tool
     * @param {number} installationId - ID of the installation
     * @param {Object} configuration - New configuration
     * @returns {Promise<Object>} - Update result
     */
    async updateToolConfiguration(installationId, configuration) {
      try {
        const response = await client.patch(`/api/tool-installations/${installationId}/config`, {
          configuration
        });
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    }
  };
}