import { Request, Response } from "express";
import axios from "axios";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { tools, toolInstallations } from "@shared/schema";
import { getEnvVar } from "../utils";

// Import marketplace client adapter
import { createClient } from '../marketplace/client-marketplace-adapter';

// Initialize marketplace client with tenant ID and (optional) API key
const tenantId = process.env.TENANT_ID || 'progress-accountants-tenant-id';
const marketplaceClient = createClient(
  tenantId,
  process.env.NEXTMONTH_DEV_URL || 'https://nextmonth-dev.replit.app',
  process.env.MARKETPLACE_API_KEY
);

/**
 * Get all available tools from marketplace
 */
export async function getAvailableTools(req: Request, res: Response) {
  try {
    const category = req.query.category as string | undefined;
    
    // Get tools from NextMonth marketplace, with optional category filter
    const tools = await marketplaceClient.getAvailableTools(
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
    const categories = await marketplaceClient.getCategories();
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
    const installedTools = await marketplaceClient.getInstalledTools();
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
    
    // Install the tool via marketplace client
    const result = await marketplaceClient.installTool(
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
    
    // Uninstall the tool via marketplace client
    const result = await marketplaceClient.uninstallTool(installationId);
    
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
    
    // Get tool configuration via marketplace client
    const config = await marketplaceClient.getToolConfiguration(installationId);
    
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
    
    // Update tool configuration via marketplace client
    const result = await marketplaceClient.updateToolConfiguration(
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