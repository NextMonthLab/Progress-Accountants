import { Request, Response } from "express";
import { User } from '@shared/schema';
import axios from "axios";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { tools, toolInstallations } from "@shared/schema";
// Import environment variable utility function
const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || fallback;
};

// Import marketplace client adapter
// Note: this is using dynamic import since it's an ESM module
const importMarketplaceAdapter = async () => {
  try {
    return await import('../marketplace/client-marketplace-adapter.js');
  } catch (error) {
    console.error('Error importing marketplace adapter:', error);
    throw error;
  }
};

// Initialize marketplace client with tenant ID and (optional) API key
const tenantId = process.env.TENANT_ID || 'progress-accountants-tenant-id';
let marketplaceClient: any = null; 

// We'll initialize the client lazily on first use
const getMarketplaceClient = async () => {
  if (!marketplaceClient) {
    try {
      const adapter = await importMarketplaceAdapter();
      marketplaceClient = adapter.createClient(
        tenantId,
        process.env.NEXTMONTH_DEV_URL || 'https://nextmonth-dev.replit.app',
        process.env.MARKETPLACE_API_KEY || undefined
      );
    } catch (error) {
      console.error('Failed to initialize marketplace client:', error);
      throw new Error('Marketplace client initialization failed');
    }
  }
  return marketplaceClient;
};

/**
 * Get all available tools from marketplace
 */
export async function getAvailableTools(req: Request, res: Response) {
  try {
    const category = req.query.category as string | undefined;
    
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Get tools from NextMonth marketplace, with optional category filter
    const tools = await client.getAvailableTools(
      category ? { category } : {}
    );
    
    res.json(tools);
  } catch (error: any) {
    console.error('Error fetching marketplace tools:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch tools from marketplace'
    });
  }
}

/**
 * Get available tool categories
 */
export async function getToolCategories(req: Request, res: Response) {
  try {
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Get categories from NextMonth marketplace
    const categories = await client.getCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching tool categories:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch tool categories'
    });
  }
}

/**
 * Get all tools installed for this client
 */
export async function getInstalledTools(req: Request, res: Response) {
  try {
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Get installed tools from NextMonth marketplace
    const installedTools = await client.getInstalledTools();
    res.json(installedTools);
  } catch (error: any) {
    console.error('Error fetching installed tools:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch installed tools'
    });
  }
}

/**
 * Install a tool with custom configuration
 */
export async function installTool(req: Request, res: Response) {
  try {
    const toolId = parseInt(req.params.toolId);
    
    if (isNaN(toolId)) {
      return res.status(400).json({ error: 'Invalid tool ID' });
    }
    
    // Get the user's email (if authenticated)
    const userEmail = req.user ? (req.user as any).email || null : null;
    
    // Use default configuration if none provided
    const configuration = req.body.configuration || {};
    
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Install the tool via marketplace client
    const result = await client.installTool(
      toolId,
      configuration,
      userEmail
    );
    
    res.json(result);
  } catch (error: any) {
    console.error('Error installing tool:', error);
    res.status(500).json({
      error: error.message || 'Failed to install tool'
    });
  }
}

/**
 * Uninstall a tool
 */
export async function uninstallTool(req: Request, res: Response) {
  try {
    const installationId = parseInt(req.params.installationId);
    
    if (isNaN(installationId)) {
      return res.status(400).json({ error: 'Invalid installation ID' });
    }
    
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Uninstall the tool via marketplace client
    const result = await client.uninstallTool(installationId);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error uninstalling tool:', error);
    res.status(500).json({
      error: error.message || 'Failed to uninstall tool'
    });
  }
}

/**
 * Get configuration for an installed tool
 */
export async function getToolConfiguration(req: Request, res: Response) {
  try {
    const installationId = parseInt(req.params.installationId);
    
    if (isNaN(installationId)) {
      return res.status(400).json({ error: 'Invalid installation ID' });
    }
    
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Get tool configuration via marketplace client
    const config = await client.getToolConfiguration(installationId);
    
    res.json(config);
  } catch (error: any) {
    console.error('Error fetching tool configuration:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch tool configuration'
    });
  }
}

/**
 * Update configuration for an installed tool
 */
export async function updateToolConfiguration(req: Request, res: Response) {
  try {
    const installationId = parseInt(req.params.installationId);
    
    if (isNaN(installationId)) {
      return res.status(400).json({ error: 'Invalid installation ID' });
    }
    
    if (!req.body.configuration) {
      return res.status(400).json({ error: 'Configuration data is required' });
    }
    
    // Get marketplace client
    const client = await getMarketplaceClient();
    
    // Update tool configuration via marketplace client
    const result = await client.updateToolConfiguration(
      installationId,
      req.body.configuration
    );
    
    res.json(result);
  } catch (error: any) {
    console.error('Error updating tool configuration:', error);
    res.status(500).json({
      error: error.message || 'Failed to update tool configuration'
    });
  }
}