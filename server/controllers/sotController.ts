import { Request, Response, Express } from 'express';
import { storage } from '../storage';
import { insertSotDeclarationSchema, insertSotMetricSchema } from '@shared/sot';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { tools } from '@shared/schema';
import { validateBlueprint, sanitizeBlueprint, compareBlueprints } from '../utils/sotUtils';

/**
 * Register SOT API routes
 */
export function registerSotRoutes(app: Express) {
  console.log('Registering SOT routes...');
  
  // SOT Declaration endpoints
  app.get('/api/sot/declaration', getSotDeclaration);
  app.post('/api/sot/declaration', createSotDeclaration);
  app.put('/api/sot/declaration/:id', updateSotDeclaration);
  
  // SOT Metrics endpoints
  app.get('/api/sot/metrics', getSotMetrics);
  app.post('/api/sot/metrics', saveSotMetrics);
  app.put('/api/sot/metrics/:id', updateSotMetrics);
  
  // SOT Sync Logs endpoints
  app.get('/api/sot/logs', getSyncLogs);
  app.post('/api/sot/logs', createSyncLog);
  
  // SOT Actions
  app.post('/api/sot/sync', triggerSync);
  
  // Client check-in endpoint
  app.post('/api/sot/client-check-in', clientCheckIn);
  
  // Blueprint extraction and import endpoints
  app.post('/api/sot/extract-blueprint', extractBlueprint);
  app.post('/api/sot/import-blueprint', importBlueprint);
  
  // Utility endpoints
  app.get('/api/sot/echo-ping', echoSotSystem);
  
  console.log('✅ SOT routes registered');
}

/**
 * Get the current SOT declaration
 */
export async function getSotDeclaration(req: Request, res: Response) {
  try {
    const declaration = await storage.getSotDeclaration();
    
    if (!declaration) {
      return res.status(404).json({ error: 'SOT declaration not found' });
    }
    
    res.status(200).json(declaration);
  } catch (error) {
    console.error('Error fetching SOT declaration:', error);
    res.status(500).json({ error: 'Failed to fetch SOT declaration' });
  }
}

/**
 * Create a new SOT declaration
 */
export async function createSotDeclaration(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = insertSotDeclarationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid SOT declaration data', 
        details: validationResult.error.format() 
      });
    }
    
    // Save the declaration
    const declaration = await storage.saveSotDeclaration(req.body);
    
    // Log the event
    await storage.logSotSync('create_declaration', 'success', 'Created SOT declaration');
    
    res.status(201).json(declaration);
  } catch (error) {
    console.error('Error creating SOT declaration:', error);
    await storage.logSotSync('create_declaration', 'error', 'Failed to create SOT declaration');
    res.status(500).json({ error: 'Failed to create SOT declaration' });
  }
}

/**
 * Update an existing SOT declaration
 */
export async function updateSotDeclaration(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    // Check if declaration exists
    const existing = await storage.getSotDeclaration();
    
    if (!existing || existing.id !== id) {
      return res.status(404).json({ error: 'SOT declaration not found' });
    }
    
    // Update the declaration
    const updated = await storage.updateSotDeclaration(id, req.body);
    
    // Log the event
    await storage.logSotSync('update_declaration', 'success', `Updated SOT declaration ID: ${id}`);
    
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating SOT declaration:', error);
    await storage.logSotSync('update_declaration', 'error', 'Failed to update SOT declaration');
    res.status(500).json({ error: 'Failed to update SOT declaration' });
  }
}

/**
 * Get the current SOT metrics
 */
export async function getSotMetrics(req: Request, res: Response) {
  try {
    const metrics = await storage.getSotMetrics();
    
    if (!metrics) {
      return res.status(404).json({ error: 'SOT metrics not found' });
    }
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching SOT metrics:', error);
    res.status(500).json({ error: 'Failed to fetch SOT metrics' });
  }
}

/**
 * Save new SOT metrics
 */
export async function saveSotMetrics(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = insertSotMetricSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid SOT metrics data', 
        details: validationResult.error.format() 
      });
    }
    
    // Save the metrics
    const metrics = await storage.saveSotMetrics(req.body);
    
    // Log the event
    await storage.logSotSync('create_metrics', 'success', 'Created SOT metrics');
    
    res.status(201).json(metrics);
  } catch (error) {
    console.error('Error creating SOT metrics:', error);
    await storage.logSotSync('create_metrics', 'error', 'Failed to create SOT metrics');
    res.status(500).json({ error: 'Failed to create SOT metrics' });
  }
}

/**
 * Update existing SOT metrics
 */
export async function updateSotMetrics(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    // Check if metrics exist
    const existing = await storage.getSotMetrics();
    
    if (!existing || existing.id !== id) {
      return res.status(404).json({ error: 'SOT metrics not found' });
    }
    
    // Update the metrics
    const updated = await storage.updateSotMetrics(id, req.body);
    
    // Log the event
    await storage.logSotSync('update_metrics', 'success', `Updated SOT metrics ID: ${id}`);
    
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating SOT metrics:', error);
    await storage.logSotSync('update_metrics', 'error', 'Failed to update SOT metrics');
    res.status(500).json({ error: 'Failed to update SOT metrics' });
  }
}

/**
 * Get SOT sync logs
 */
export async function getSyncLogs(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const logs = await storage.getSotSyncLogs(limit);
    
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching SOT sync logs:', error);
    res.status(500).json({ error: 'Failed to fetch SOT sync logs' });
  }
}

/**
 * Create a new sync log entry
 */
export async function createSyncLog(req: Request, res: Response) {
  try {
    const { eventType, status, details } = req.body;
    
    if (!eventType || !status) {
      return res.status(400).json({ error: 'Event type and status are required' });
    }
    
    const log = await storage.logSotSync(eventType, status, details);
    
    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating SOT sync log:', error);
    res.status(500).json({ error: 'Failed to create SOT sync log' });
  }
}

/**
 * Client check-in endpoint to report status to the SOT system
 */
export async function clientCheckIn(req: Request, res: Response) {
  try {
    const { clientId, status, version, metrics } = req.body;
    
    if (!clientId || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: 'clientId and status are required' 
      });
    }
    
    // Record the client check-in
    const logEntry = await storage.logSotSync(
      'client_check_in', 
      status, 
      JSON.stringify({
        clientId,
        version,
        metrics,
        timestamp: new Date()
      })
    );
    
    // If this is the first check-in or metrics have changed, update SOT metrics
    let currentMetrics = await storage.getSotMetrics();
    
    if (metrics && (!currentMetrics || shouldUpdateMetrics(currentMetrics, metrics))) {
      if (currentMetrics) {
        currentMetrics = await storage.updateSotMetrics(currentMetrics.id, {
          ...metrics,
          lastSyncAt: new Date()
        });
      } else {
        currentMetrics = await storage.saveSotMetrics({
          id: 1,
          ...metrics,
          lastSyncAt: new Date()
        });
      }
    }
    
    // Get the declaration to send back to the client
    const declaration = await storage.getSotDeclaration();
    
    res.status(200).json({
      success: true,
      message: 'Client check-in recorded successfully',
      logEntry,
      declaration,
      settings: {
        // System-defined settings that clients should follow
        syncFrequency: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        allowAutoUpdate: true,
        requireReporting: true
      }
    });
    
  } catch (error: any) {
    console.error('Error processing client check-in:', error);
    await storage.logSotSync(
      'client_check_in_error', 
      'error', 
      `Check-in processing failed: ${error.message || 'Unknown error'}`
    );
    res.status(500).json({ error: 'Failed to process client check-in' });
  }
}

/**
 * Trigger a sync with the SOT system
 */
export async function triggerSync(req: Request, res: Response) {
  try {
    // Get the current declaration
    const declaration = await storage.getSotDeclaration();
    
    if (!declaration) {
      return res.status(404).json({ error: 'SOT declaration not found. Please create a declaration first.' });
    }
    
    // Collect metrics for sync
    const totalPages = await countTotalPages();
    const installedTools = await getInstalledToolsList();
    
    // Update metrics
    let metrics = await storage.getSotMetrics();
    
    if (metrics) {
      metrics = await storage.updateSotMetrics(metrics.id, {
        totalPages,
        installedTools,
        lastSyncAt: new Date()
      });
    } else {
      // For first-time creation, we need to include the id field
      metrics = await storage.saveSotMetrics({
        id: 1, // Default id for first record
        totalPages,
        installedTools,
        lastSyncAt: new Date()
      });
    }
    
    // Update declaration last sync time
    await storage.updateSotDeclaration(declaration.id, {
      lastSyncAt: new Date()
    });
    
    // Log the sync event
    await storage.logSotSync('manual_sync', 'success', 'Manual sync triggered successfully');
    
    res.status(200).json({ 
      success: true, 
      message: 'Sync with SOT completed successfully',
      declaration,
      metrics
    });
  } catch (error: any) {
    console.error('Error during SOT sync:', error);
    await storage.logSotSync('manual_sync', 'error', `Sync failed: ${error.message || 'Unknown error'}`);
    res.status(500).json({ error: 'Failed to sync with SOT system' });
  }
}

/**
 * Compare metrics to determine if an update is needed
 */
function shouldUpdateMetrics(current: any, incoming: any): boolean {
  // Check if any key metrics have changed
  return (
    current.totalPages !== incoming.totalPages ||
    JSON.stringify(current.installedTools) !== JSON.stringify(incoming.installedTools) ||
    // Add other important metrics to compare
    !!incoming.forceUpdate
  );
}

/**
 * Helper to count the total number of pages in the system
 */
async function countTotalPages(): Promise<number> {
  try {
    // Query the database to count pages
    const result = await storage.countPages();
    return result;
  } catch (error) {
    console.error('Error counting pages:', error);
    return 0;
  }
}

/**
 * Helper to get a list of installed tools
 */
async function getInstalledToolsList(): Promise<string[]> {
  try {
    // List of standard installed tools in the system
    const standardTools = [
      'page_builder',
      'seo_optimizer',
      'business_identity_manager',
      'brand_guidelines',
      'media_library',
      'user_management',
      'companion_assistant',
      'marketplace'
    ];
    
    // Add any dynamic tools that might be installed
    try {
      const installedMarketplaceTools = await db.select({ name: tools.name })
        .from(tools)
        .where(eq(tools.status, 'installed'));
        
      const additionalTools = installedMarketplaceTools
        .map(tool => tool.name || '')
        .filter(name => name && !standardTools.includes(name));
        
      return [...standardTools, ...additionalTools];
    } catch (dbError) {
      console.log('Could not query marketplace tools, using standard list only:', dbError);
      return standardTools;
    }
  } catch (error) {
    console.error('Error creating tool list:', error);
    return [
      'page_builder',
      'seo_optimizer',
      'business_identity_manager'
    ];
  }
}

/**
 * SOT System Information - Returns information about the SOT system
 */
export async function echoSotSystem(req: Request, res: Response) {
  return res.json({
    system_name: "Progress SOT",
    version: "1.1.1",
    instance_type: "client",
    tenant_id: "00000000-0000-0000-0000-000000000000",
    available_routes: [
      "/api/sot/declaration",
      "/api/sot/metrics",
      "/api/sot/logs",
      "/api/sot/sync",
      "/api/sot/client-check-in",
      "/api/sot/extract-blueprint",
      "/api/sot/import-blueprint",
      "/api/sot/echo-ping"
    ],
    capabilities: [
      "tenant_agnostic_export",
      "blueprint_validation",
      "blueprint_import",
      "metrics_tracking",
      "declaration_management"
    ],
    requires_auth: false,
    healthcheck_path: "/api/sot/echo-ping"
  });
}

/**
 * Blueprint Extraction - Extract a portable, tenant-agnostic blueprint
 */
export async function extractBlueprint(req: Request, res: Response) {
  try {
    const { settings = {} } = req.body;
    
    // Default settings if not provided
    const extractionSettings = {
      includeBusinessIdentity: true,
      includeBrandGuidelines: true,
      includeModules: true,
      includeTools: true,
      tenantAgnostic: true,
      exportPages: true,
      exportLayouts: true,
      ...settings
    };
    
    // Get basic tenant information
    const tenantId = req.body.clientId || '00000000-0000-0000-0000-000000000000';
    
    // Create the base blueprint structure
    const blueprint: any = {
      version: req.body.version || '1.1.1',
      extractedAt: new Date().toISOString(),
      tenantAgnostic: extractionSettings.tenantAgnostic === true,
      source: {
        system: 'Progress',
        tenantId: extractionSettings.tenantAgnostic ? null : tenantId,
        version: '1.1.1'
      },
      schema: {
        version: '1.1',
        modules: ['businessIdentity', 'brandGuidelines', 'pages', 'tools']
      },
      modules: {},
      tools: [],
      pages: [],
      layouts: [],
      contentBlocks: []
    };
    
    // Get business identity if requested
    if (extractionSettings.includeBusinessIdentity) {
      try {
        const businessIdentity = await storage.getBusinessIdentity();
        if (businessIdentity) {
          blueprint.modules.businessIdentity = extractionSettings.tenantAgnostic ? 
            sanitizeBusinessIdentity(businessIdentity) : 
            businessIdentity;
        }
      } catch (error) {
        console.error('Error fetching business identity:', error);
      }
    }
    
    // Get brand guidelines if requested
    if (extractionSettings.includeBrandGuidelines) {
      try {
        // Check if business identity has branding information
        const businessIdentity = await storage.getBusinessIdentity();
        
        // Create basic brand guidelines from available business identity data
        const brandGuidelines = {
          colors: {
            primary: '#00205B',  // Navy Blue
            secondary: '#FF7A00' // Burnt Orange
          },
          fonts: {
            heading: 'Inter, sans-serif',
            body: 'Inter, sans-serif'
          },
          logo: {
            primary: '/assets/logo.png',
            favicon: '/favicon.ico'
          }
        };
        
        if (brandGuidelines) {
          blueprint.modules.brandGuidelines = extractionSettings.tenantAgnostic ? 
            sanitizeBrandGuidelines(brandGuidelines) : 
            brandGuidelines;
        }
      } catch (error) {
        console.error('Error fetching brand guidelines:', error);
      }
    }
    
    // Include tools if requested
    if (extractionSettings.includeTools) {
      try {
        const installedTools = await getInstalledToolsList();
        blueprint.tools = installedTools.map(tool => ({
          name: tool,
          version: '1.0.0',
          configuration: {} // Default empty configuration
        }));
      } catch (error) {
        console.error('Error including tools in blueprint:', error);
      }
    }
    
    // Include pages if requested
    if (extractionSettings.exportPages) {
      try {
        // Use existing page builder API to get pages
        const response = await fetch('http://localhost:5000/api/pages/public', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const pageRoutes = await response.json();
          // Get detailed information for each page
          const pagePromises = pageRoutes.map(async (route: string) => {
            try {
              const pageResponse = await fetch(`http://localhost:5000/api/pages/route${route}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
              });
              
              if (pageResponse.ok) {
                const pageData = await pageResponse.json();
                return pageData;
              }
              return null;
            } catch (err) {
              console.error(`Failed to fetch page data for route ${route}:`, err);
              return null;
            }
          });
          
          const pages = (await Promise.all(pagePromises)).filter(Boolean);
          blueprint.pages = extractionSettings.tenantAgnostic ? 
            pages.map((page: any) => sanitizePage(page)) : 
            pages;
        } else {
          console.error('Failed to fetch public pages');
          blueprint.pages = [];
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
        blueprint.pages = [];
      }
    }
    
    // Log the extraction
    await storage.logSotSync(
      'blueprint_extraction', 
      'success', 
      `Blueprint extracted with settings: ${JSON.stringify(extractionSettings)}`
    );
    
    // Return the blueprint
    return res.status(200).json(blueprint);
  } catch (error: any) {
    console.error('Blueprint extraction failed:', error);
    await storage.logSotSync(
      'blueprint_extraction', 
      'error', 
      `Blueprint extraction failed: ${error?.message || 'Unknown error'}`
    );
    return res.status(500).json({ 
      error: 'Blueprint extraction failed',
      message: error?.message || 'Unknown error during blueprint extraction'
    });
  }
}

/**
 * Import Blueprint - Import a blueprint into the system
 */
export async function importBlueprint(req: Request, res: Response) {
  try {
    const blueprint = req.body;
    
    // Validate the blueprint
    const { valid, errors } = validateBlueprint(blueprint);
    
    if (!valid) {
      await storage.logSotSync('blueprint_import', 'error', `Validation failed: ${errors.join(', ')}`);
      return res.status(400).json({ 
        status: 'error', 
        message: 'Blueprint validation failed', 
        errors 
      });
    }
    
    // Log the validation success
    await storage.logSotSync('blueprint_validation', 'success', 'Blueprint validated successfully');
    
    // For now, just verify the blueprint's validity and return success
    // TODO: Implement actual import logic to apply the blueprint
    
    res.status(200).json({ 
      status: 'success', 
      message: 'Blueprint validated successfully. Import functionality will be implemented soon.',
      blueprint_version: blueprint.version,
      modules_found: Object.keys(blueprint.modules || {}),
      tools_count: (blueprint.tools || []).length,
      pages_count: (blueprint.pages || []).length
    });
  } catch (error: any) {
    console.error('Error importing blueprint:', error);
    await storage.logSotSync('blueprint_import', 'error', `Import failed: ${error.message || 'Unknown error'}`);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to import blueprint', 
      error: error.message 
    });
  }
}

/**
 * Helper function to sanitize business identity for tenant-agnostic export
 */
function sanitizeBusinessIdentity(businessIdentity: any): any {
  if (!businessIdentity) return null;
  
  const sanitized = { ...businessIdentity };
  
  if (sanitized.core) {
    sanitized.core = {
      ...sanitized.core,
      businessName: '[BUSINESS_NAME]',
      email: '[BUSINESS_EMAIL]',
      phone: '[BUSINESS_PHONE]',
      tenantId: null
    };
  }
  
  return sanitized;
}

/**
 * Helper function to sanitize brand guidelines for tenant-agnostic export
 */
function sanitizeBrandGuidelines(brandGuidelines: any): any {
  if (!brandGuidelines) return null;
  
  const sanitized = { ...brandGuidelines };
  
  if (sanitized.logo) {
    sanitized.logo = {
      primary: '[PRIMARY_LOGO_URL]',
      secondary: '[SECONDARY_LOGO_URL]',
      favicon: '[FAVICON_URL]'
    };
  }
  
  if (sanitized.tenantId) {
    sanitized.tenantId = null;
  }
  
  return sanitized;
}

/**
 * Helper function to sanitize a page for tenant-agnostic export
 */
function sanitizePage(page: any): any {
  if (!page) return null;
  
  const sanitized = { ...page };
  
  // Remove tenant-specific information
  if (sanitized.tenantId) {
    sanitized.tenantId = null;
  }
  
  // Keep route, layout, and other structural information
  return sanitized;
}

// Export all controller functions
export default {
  createSotDeclaration,
  getSotDeclaration,
  saveSotMetrics,
  getSotMetrics,
  clientCheckIn,
  getSyncLogs,
  triggerSync,
  extractBlueprint,
  importBlueprint,
  echoSotSystem
};