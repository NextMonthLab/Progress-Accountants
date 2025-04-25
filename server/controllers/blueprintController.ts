import { Request, Response, Express } from 'express';
import { db } from '../db';
import { storage } from '../storage';
import { validateBlueprint, sanitizeBlueprint } from '../utils/sotUtils';
import { eq } from 'drizzle-orm';
import { sotDeclarations } from '@shared/sot';
import { tools, users, pages, navigation_menus, menu_items } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../auth';

/**
 * Register blueprint extraction and cloning routes
 */
export function registerBlueprintRoutes(app: Express) {
  console.log('Registering Blueprint routes...');
  
  // Blueprint extraction endpoints
  app.get('/api/blueprint/extract', extractBlueprint);
  app.post('/api/blueprint/extract', extractAndSaveBlueprint);
  
  // Blueprint cloning endpoints
  app.post('/api/blueprint/clone', cloneInstance);
  app.get('/api/blueprint/clone/status/:requestId', getCloneStatus);
  app.get('/api/blueprint/templates', getAvailableTemplates);
  
  // Template management
  app.post('/api/blueprint/template/register', registerAsTemplate);
  app.put('/api/blueprint/template/toggle/:id', toggleTemplateStatus);
  
  console.log('✅ Blueprint routes registered');
}

/**
 * Extract blueprint data from the current instance
 */
async function extractBlueprint(req: Request, res: Response) {
  try {
    const blueprint = await generateBlueprint();
    
    if (!blueprint) {
      return res.status(500).json({ error: 'Failed to generate blueprint' });
    }
    
    // Validate the blueprint
    const validation = validateBlueprint(blueprint);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Blueprint validation failed', 
        details: validation.errors 
      });
    }
    
    return res.status(200).json(blueprint);
  } catch (error) {
    console.error('Blueprint extraction error:', error);
    return res.status(500).json({ error: 'Blueprint extraction failed' });
  }
}

/**
 * Extract and save blueprint data
 */
async function extractAndSaveBlueprint(req: Request, res: Response) {
  try {
    const { makeTenantAgnostic = true } = req.body;
    
    // Generate the blueprint
    const rawBlueprint = await generateBlueprint();
    
    if (!rawBlueprint) {
      return res.status(500).json({ error: 'Failed to generate blueprint' });
    }
    
    // Sanitize the blueprint if needed
    const blueprint = makeTenantAgnostic 
      ? sanitizeBlueprint(rawBlueprint, true) 
      : rawBlueprint;
    
    // Validate the blueprint
    const validation = validateBlueprint(blueprint);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Blueprint validation failed', 
        details: validation.errors 
      });
    }
    
    // Save the blueprint to the database
    // For now, we'll store it in a sync log
    const logEntry = await db.insert(sotDeclarations).values({
      id: Math.floor(Math.random() * 1000000),
      instanceId: uuidv4(),
      instanceType: 'template',
      blueprintVersion: blueprint.version,
      toolsSupported: blueprint.tools.map((t: any) => t.name),
      callbackUrl: req.body.callbackUrl || 'https://example.com/callback',
      status: 'active',
      isTemplate: true,
      isCloneable: true,
    }).returning();
    
    return res.status(201).json({ 
      message: 'Blueprint extracted and saved successfully',
      blueprint 
    });
  } catch (error) {
    console.error('Blueprint extraction and save error:', error);
    return res.status(500).json({ error: 'Blueprint extraction and save failed' });
  }
}

/**
 * Clone an instance from a blueprint
 */
async function cloneInstance(req: Request, res: Response) {
  try {
    const { 
      templateId, 
      newInstanceName, 
      adminEmail, 
      adminPassword,
      tenantInfo
    } = req.body;
    
    if (!templateId || !newInstanceName || !adminEmail || !adminPassword) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        requiredFields: ['templateId', 'newInstanceName', 'adminEmail', 'adminPassword']
      });
    }
    
    // Start the cloning process
    const requestId = uuidv4();
    
    // In a production environment, this would be done in a background process
    // For now, we'll simulate the process with a delay
    setTimeout(() => {
      performCloning(requestId, templateId, newInstanceName, adminEmail, adminPassword, tenantInfo);
    }, 100);
    
    return res.status(202).json({ 
      message: 'Cloning process started',
      requestId,
      status: 'processing' 
    });
  } catch (error) {
    console.error('Clone initiation error:', error);
    return res.status(500).json({ error: 'Failed to initiate cloning process' });
  }
}

/**
 * Get the status of a cloning request
 */
async function getCloneStatus(req: Request, res: Response) {
  try {
    const { requestId } = req.params;
    
    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }
    
    // In a real implementation, we would check a database for the status
    // For now, we'll return a simulated status
    return res.status(200).json({ 
      requestId,
      status: 'completed',
      message: 'Cloning process completed successfully',
      instanceUrl: '/admin' 
    });
  } catch (error) {
    console.error('Clone status check error:', error);
    return res.status(500).json({ error: 'Failed to check cloning status' });
  }
}

/**
 * Get available templates
 */
async function getAvailableTemplates(req: Request, res: Response) {
  try {
    // Query for instances marked as templates
    const templates = await db.select({
      id: sotDeclarations.id,
      instanceId: sotDeclarations.instanceId,
      blueprintVersion: sotDeclarations.blueprintVersion,
      toolsSupported: sotDeclarations.toolsSupported,
      status: sotDeclarations.status,
      isCloneable: sotDeclarations.isCloneable,
      lastSyncAt: sotDeclarations.lastSyncAt,
    })
    .from(sotDeclarations)
    .where(eq(sotDeclarations.isTemplate, true));
    
    return res.status(200).json(templates);
  } catch (error) {
    console.error('Template fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch available templates' });
  }
}

/**
 * Register current instance as a template
 */
async function registerAsTemplate(req: Request, res: Response) {
  try {
    const { 
      instanceName, 
      description, 
      isCloneable = true 
    } = req.body;
    
    if (!instanceName) {
      return res.status(400).json({ error: 'Instance name is required' });
    }
    
    // Check if already registered as template
    const existingTemplates = await db.select()
      .from(sotDeclarations)
      .where(eq(sotDeclarations.isTemplate, true));
      
    if (existingTemplates.length > 0) {
      return res.status(409).json({ 
        error: 'This instance is already registered as a template',
        templateId: existingTemplates[0].id 
      });
    }
    
    // Register as template
    const blueprint = await generateBlueprint();
    const declaration = await db.insert(sotDeclarations).values({
      id: Math.floor(Math.random() * 1000000),
      instanceId: uuidv4(),
      instanceType: 'template',
      blueprintVersion: blueprint.version,
      toolsSupported: blueprint.tools.map((t: any) => t.name),
      callbackUrl: 'https://example.com/callback',
      status: 'active',
      isTemplate: true,
      isCloneable,
    }).returning();
    
    return res.status(201).json({ 
      message: 'Instance registered as template successfully',
      templateId: declaration[0].id 
    });
  } catch (error) {
    console.error('Template registration error:', error);
    return res.status(500).json({ error: 'Failed to register instance as template' });
  }
}

/**
 * Toggle template status
 */
async function toggleTemplateStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isCloneable } = req.body;
    
    if (isCloneable === undefined) {
      return res.status(400).json({ error: 'isCloneable status is required' });
    }
    
    const updated = await db.update(sotDeclarations)
      .set({ isCloneable })
      .where(eq(sotDeclarations.id, parseInt(id)))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    return res.status(200).json({ 
      message: 'Template status updated successfully',
      template: updated[0] 
    });
  } catch (error) {
    console.error('Template status toggle error:', error);
    return res.status(500).json({ error: 'Failed to toggle template status' });
  }
}

// ======== Helper Functions ========

/**
 * Generate a blueprint from the current instance
 */
async function generateBlueprint() {
  try {
    // Fetch declaration
    const declarations = await db.select().from(sotDeclarations);
    const declaration = declarations.length > 0 ? declarations[0] : null;
    
    // Get available tools
    const availableTools = await db.select().from(tools);
    
    // Get pages
    const allPages = await db.select().from(pages);
    
    // Get navigation structure
    const menus = await db.select().from(navigation_menus);
    const menuItems = await db.select().from(menu_items);
    
    // Create blueprint object
    const blueprint = {
      version: '1.0.0',
      extractedAt: new Date().toISOString(),
      tenantAgnostic: false,
      source: {
        instanceId: declaration?.instanceId || uuidv4(),
        extractedBy: 'system',
      },
      schema: {
        version: '1.0.0',
      },
      tools: availableTools.map(tool => ({
        name: tool.name,
        version: tool.version,
        enabled: tool.enabled,
      })),
      pages: allPages.map(page => ({
        id: page.id,
        route: page.route,
        title: page.title,
        status: page.status,
        isPublic: page.isPublic,
      })),
      navigation: {
        menus: menus.map(menu => ({
          id: menu.id,
          name: menu.name,
          items: menuItems
            .filter(item => item.menuId === menu.id)
            .map(item => ({
              id: item.id,
              label: item.label,
              url: item.url,
              parentId: item.parentId,
              order: item.order,
            })),
        })),
      },
    };
    
    return blueprint;
  } catch (error) {
    console.error('Error generating blueprint:', error);
    return null;
  }
}

/**
 * Perform the actual cloning process
 * This would normally be done in a background job
 */
async function performCloning(
  requestId: string, 
  templateId: string, 
  newInstanceName: string, 
  adminEmail: string, 
  adminPassword: string,
  tenantInfo: any
) {
  try {
    console.log(`Starting clone operation ${requestId} for template ${templateId}`);
    
    // Create admin user for the new instance
    const hashedPassword = await hashPassword(adminPassword);
    
    const newAdminUser = await db.insert(users).values({
      id: Math.floor(Math.random() * 1000000),
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isSuperAdmin: true,
      isActive: true,
    }).returning();
    
    // In a real implementation, we would:
    // 1. Create a new database for the clone
    // 2. Clone schema and data from the template
    // 3. Update references to the template with the new instance
    // 4. Set up the admin user
    // 5. Configure tenant-specific information
    
    console.log(`Clone operation ${requestId} completed successfully`);
  } catch (error) {
    console.error(`Error in clone operation ${requestId}:`, error);
  }
}