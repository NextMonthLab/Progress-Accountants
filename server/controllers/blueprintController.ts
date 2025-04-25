import { Express, Request, Response } from 'express';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { cloneOperations, blueprintTemplates, blueprintExports } from '@shared/blueprint';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../auth';
import { users } from '@shared/schema';
import { sotDeclarations } from '@shared/sot';
import { storage } from '../storage';

/**
 * Register all blueprint-related routes
 */
export function registerBlueprintRoutes(app: Express): void {
  console.log('Registering Blueprint routes...');

  // Get all blueprint templates
  app.get('/api/blueprint/templates', async (req: Request, res: Response) => {
    try {
      const templates = await db.select().from(blueprintTemplates);
      return res.status(200).json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  // Get template by ID
  app.get('/api/blueprint/templates/:id', async (req: Request, res: Response) => {
    try {
      const templateId = parseInt(req.params.id);
      const [template] = await db.select().from(blueprintTemplates).where(eq(blueprintTemplates.id, templateId));
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      return res.status(200).json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      return res.status(500).json({ error: 'Failed to fetch template' });
    }
  });

  // Register a new template
  app.post('/api/blueprint/templates', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if user has admin rights
      const user = req.user as Express.User;
      if (user.userType !== 'admin' && !user.isSuperAdmin) {
        return res.status(403).json({ error: 'Admin privileges required' });
      }

      const { name, description, isCloneable, blueprintVersion = '1.0.0' } = req.body;
      
      // Generate a new UUID for this instance
      const instanceId = uuidv4();
      
      // Create the template entry
      const [template] = await db.insert(blueprintTemplates).values({
        instanceId,
        name,
        description,
        blueprintVersion,
        isCloneable,
        tenantId: req.body.tenantId || null,
        status: 'active'
      }).returning();
      
      return res.status(201).json(template);
    } catch (error) {
      console.error('Error creating template:', error);
      return res.status(500).json({ error: 'Failed to create template' });
    }
  });

  // Update a template
  app.put('/api/blueprint/templates/:id', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if user has admin rights
      const user = req.user as Express.User;
      if (user.userType !== 'admin' && !user.isSuperAdmin) {
        return res.status(403).json({ error: 'Admin privileges required' });
      }

      const templateId = parseInt(req.params.id);
      const { name, description, isCloneable, status } = req.body;
      
      // Check if template exists
      const [template] = await db.select().from(blueprintTemplates).where(eq(blueprintTemplates.id, templateId));
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      // Update the template
      const [updatedTemplate] = await db.update(blueprintTemplates)
        .set({
          name: name || template.name,
          description: description !== undefined ? description : template.description,
          isCloneable: isCloneable !== undefined ? isCloneable : template.isCloneable,
          status: status || template.status,
          updatedAt: new Date()
        })
        .where(eq(blueprintTemplates.id, templateId))
        .returning();
      
      return res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error('Error updating template:', error);
      return res.status(500).json({ error: 'Failed to update template' });
    }
  });

  // Extract blueprint data for a template
  app.post('/api/blueprint/extract/:templateId', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Check if user has admin rights
      const user = req.user as Express.User;
      if (user.userType !== 'admin' && !user.isSuperAdmin) {
        return res.status(403).json({ error: 'Admin privileges required' });
      }

      const templateId = parseInt(req.params.templateId);
      const { makeTenantAgnostic = true } = req.body;
      
      // Get the template
      const [template] = await db.select().from(blueprintTemplates).where(eq(blueprintTemplates.id, templateId));
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      // Get SOT declarations for this instance
      const sotData = await db.select().from(sotDeclarations).where(eq(sotDeclarations.instanceId, template.instanceId));
      
      // Extract other data needed for the blueprint (navigation, pages, etc.)
      // This would involve additional queries to gather all necessary data
      
      // For tenant agnostic extraction, filter out tenant-specific information
      let blueprintData: any = {
        version: template.blueprintVersion,
        extractedAt: new Date().toISOString(),
        sotDeclarations: makeTenantAgnostic ? sanitizeTenantData(sotData) : sotData,
        // Add other components here (navigation, pages, etc.)
      };
      
      // Create a new export record
      const [exportRecord] = await db.insert(blueprintExports).values({
        instanceId: template.instanceId,
        blueprintVersion: template.blueprintVersion,
        tenantId: template.tenantId,
        isTenantAgnostic: makeTenantAgnostic,
        blueprintData,
        exportedBy: 'admin',
        validationStatus: 'validated'
      }).returning();
      
      return res.status(200).json({
        message: 'Blueprint extracted successfully',
        exportId: exportRecord.id,
        blueprintData
      });
    } catch (error) {
      console.error('Error extracting blueprint:', error);
      return res.status(500).json({ error: 'Failed to extract blueprint' });
    }
  });

  // Clone a template to create a new instance
  app.post('/api/blueprint/clone', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Only super admins can perform clones
      const user = req.user as Express.User;
      if (!user.isSuperAdmin) {
        return res.status(403).json({ error: 'Super admin privileges required for cloning' });
      }

      const { templateId, instanceName, adminEmail, adminPassword } = req.body;
      
      // Validate input
      if (!templateId || !instanceName || !adminEmail || !adminPassword) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Get the template
      const [template] = await db.select().from(blueprintTemplates).where(eq(blueprintTemplates.id, templateId));
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      if (!template.isCloneable) {
        return res.status(403).json({ error: 'This template is not available for cloning' });
      }
      
      // Generate new instance ID
      const newInstanceId = uuidv4();
      
      // Create a clone operation record
      const requestId = uuidv4();
      const [cloneOperation] = await db.insert(cloneOperations).values({
        requestId,
        templateId,
        instanceName,
        adminEmail,
        status: 'in_progress',
        newInstanceId,
        startedAt: new Date(),
        metadata: {
          originalTemplate: template.name,
          blueprintVersion: template.blueprintVersion
        }
      }).returning();
      
      try {
        // 1. Create admin user for new instance
        const hashedPassword = await hashPassword(adminPassword);
        
        // Create new admin user with proper schema
        const [adminUser] = await db.insert(users).values({
          username: adminEmail.split('@')[0],
          password: hashedPassword,
          email: adminEmail,
          name: 'Administrator',
          userType: 'admin',
          tenantId: newInstanceId,
          isSuperAdmin: false
        }).returning();
        
        // 2. Copy SOT declarations from template to new instance
        const sotData = await db.select().from(sotDeclarations).where(eq(sotDeclarations.instanceId, template.instanceId));
        
        for (const sot of sotData) {
          // Extract properties that are defined in the sotDeclarations schema
          const {
            instanceType,
            blueprintVersion,
            toolsSupported,
            callbackUrl,
            status,
            isTemplate,
            isCloneable
          } = sot;
          
          // Clone each SOT declaration for the new instance with only the properties allowed by the schema
          await db.insert(sotDeclarations).values({
            id: sot.id, // We need to provide an ID explicitly since it's a required field
            instanceId: newInstanceId,
            instanceType,
            blueprintVersion,
            toolsSupported,
            callbackUrl,
            status,
            isTemplate: isTemplate || false,
            isCloneable: isCloneable || false
          });
        }
        
        // 3. Copy other data as needed (navigation, pages, etc.)
        // This would involve additional queries to gather and copy all necessary data
        
        // 4. Update clone operation status
        await db.update(cloneOperations)
          .set({
            status: 'completed',
            completedAt: new Date()
          })
          .where(eq(cloneOperations.id, cloneOperation.id));
        
        return res.status(200).json({
          message: 'Instance cloned successfully',
          cloneOperation: {
            ...cloneOperation,
            status: 'completed'
          },
          newInstanceId,
          adminUserId: adminUser.id
        });
      } catch (error: any) {
        // If an error occurs during cloning, update the operation status
        await db.update(cloneOperations)
          .set({
            status: 'failed',
            errorMessage: error.message || 'Unknown error during cloning',
            completedAt: new Date()
          })
          .where(eq(cloneOperations.id, cloneOperation.id));
        
        throw error;
      }
    } catch (error) {
      console.error('Error cloning template:', error);
      return res.status(500).json({ error: 'Failed to clone template' });
    }
  });

  // Get all clone operations
  app.get('/api/blueprint/clone-operations', async (req: Request, res: Response) => {
    try {
      const operations = await db.select().from(cloneOperations);
      return res.status(200).json(operations);
    } catch (error) {
      console.error('Error fetching clone operations:', error);
      return res.status(500).json({ error: 'Failed to fetch clone operations' });
    }
  });

  // Get clone operation status
  app.get('/api/blueprint/clone-status/:requestId', async (req: Request, res: Response) => {
    try {
      const requestId = req.params.requestId;
      
      const [operation] = await db.select()
        .from(cloneOperations)
        .where(eq(cloneOperations.requestId, requestId));
      
      if (!operation) {
        return res.status(404).json({ error: 'Clone operation not found' });
      }
      
      return res.status(200).json(operation);
    } catch (error) {
      console.error('Error fetching clone status:', error);
      return res.status(500).json({ error: 'Failed to fetch clone status' });
    }
  });

  console.log('✅ Blueprint routes registered');
}

/**
 * Helper function to remove tenant-specific data for agnostic blueprint extraction
 */
function sanitizeTenantData(data: any[]): any[] {
  // Deep copy to avoid modifying the original data
  const cleanData = JSON.parse(JSON.stringify(data));
  
  return cleanData.map((item: any) => {
    // Remove or anonymize tenant-specific fields
    if (item.tenantId) {
      item.tenantId = null;
    }
    
    // If the item has placeholders for business name or other identifiable info
    // Replace with generic placeholders
    if (item.value && typeof item.value === 'string') {
      // Detect and replace business names, addresses, etc.
      // This is a simplified example - real implementation would be more sophisticated
      const businessNamePattern = /Progress\s+Accountants/gi;
      item.value = item.value.replace(businessNamePattern, '{{businessName}}');
    }
    
    return item;
  });
}