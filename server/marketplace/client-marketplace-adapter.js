/**
 * NextMonth Marketplace Client Adapter
 * 
 * This module provides a client adapter for interacting with the NextMonth Dev Marketplace API.
 * It enables Progress Accountants to browse, install, and manage tools from the marketplace.
 */

import axios from 'axios';

/**
 * Creates a marketplace client instance for a specific tenant
 * 
 * @param {string} tenantId - The ID of the tenant making the request
 * @param {string} baseUrl - The base URL of the marketplace API
 * @param {string|null} apiKey - Optional API key for authenticated requests
 * @returns {Object} - Client instance with marketplace methods
 */
export function createClient(tenantId, baseUrl = 'https://nextmonth-dev.replit.app', apiKey = null) {
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
      console.error('NextMonth marketplace error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
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
        // Return empty array if the API isn't available
        return [];
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
        return [
          { id: 'page_templates', name: 'Page Templates' },
          { id: 'tools', name: 'Tools' },
          { id: 'calculators', name: 'Calculators' },
          { id: 'dashboards', name: 'Dashboards' }
        ];
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
        return [];
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
      const payload = {
        toolId,
        configuration,
        ...(userEmail ? { userEmail } : {})
      };
      
      return await client.post('/install', payload);
    },

    /**
     * Uninstall a tool
     * @param {number} installationId - ID of the tool installation to remove
     * @returns {Promise<Object>} - Result of the uninstallation
     */
    async uninstallTool(installationId) {
      return await client.post(`/uninstall/${installationId}`);
    },

    /**
     * Get configuration for an installed tool
     * @param {number} installationId - ID of the tool installation
     * @returns {Promise<Object>} - Tool configuration
     */
    async getToolConfiguration(installationId) {
      return await client.get(`/config/${installationId}`);
    },

    /**
     * Update configuration for an installed tool
     * @param {number} installationId - ID of the tool installation
     * @param {Object} configuration - New configuration settings
     * @returns {Promise<Object>} - Updated tool configuration
     */
    async updateToolConfiguration(installationId, configuration) {
      return await client.patch(`/config/${installationId}`, { configuration });
    }
  };
}