import { Express, Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { crmContacts, insertCrmContactSchema } from '@shared/schema';
import { z } from 'zod';

/**
 * Register CRM routes
 * @param app Express application
 */
export function registerCrmRoutes(app: Express) {
  console.log('Registering Starter CRM routes...');

  // Get all contacts for a tenant
  app.get('/api/crm/contacts', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Get tenant ID - use default if not available
      const tenantId = req.user.tenantId || '00000000-0000-0000-0000-000000000000';
      
      const contacts = await db.select().from(crmContacts)
        .where(eq(crmContacts.tenantId, tenantId));
      
      return res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      console.error('Error fetching CRM contacts:', error);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  // Get a single contact by ID
  app.get('/api/crm/contacts/:id', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { id } = req.params;
      // Get tenant ID - use default if not available
      const tenantId = req.user.tenantId || '00000000-0000-0000-0000-000000000000';
      
      const [contact] = await db.select().from(crmContacts)
        .where(and(
          eq(crmContacts.id, parseInt(id)),
          eq(crmContacts.tenantId, tenantId)
        ));
      
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      return res.status(200).json({ success: true, data: contact });
    } catch (error) {
      console.error('Error fetching CRM contact:', error);
      return res.status(500).json({ error: 'Failed to fetch contact' });
    }
  });

  // Create a new contact
  app.post('/api/crm/contacts', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Get tenant ID - use default if not available
      const tenantId = req.user.tenantId || '00000000-0000-0000-0000-000000000000';
      
      // Parse and validate request body
      const contactData = insertCrmContactSchema.parse({
        ...req.body,
        tenantId,
        createdBy: req.user.id,
      });
      
      // Insert the contact
      const [newContact] = await db.insert(crmContacts).values(contactData).returning();
      
      return res.status(201).json({ success: true, data: newContact });
    } catch (error) {
      console.error('Error creating CRM contact:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid contact data', details: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to create contact' });
    }
  });

  // Update an existing contact
  app.put('/api/crm/contacts/:id', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { id } = req.params;
      // Get tenant ID - use default if not available
      const tenantId = req.user.tenantId || '00000000-0000-0000-0000-000000000000';
      
      // Check if the contact exists
      const [existingContact] = await db.select().from(crmContacts)
        .where(and(
          eq(crmContacts.id, parseInt(id)),
          eq(crmContacts.tenantId, tenantId)
        ));
      
      if (!existingContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      // Parse and validate request body
      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };
      
      // Update the contact
      const [updatedContact] = await db.update(crmContacts)
        .set(updateData)
        .where(eq(crmContacts.id, parseInt(id)))
        .returning();
      
      return res.status(200).json({ success: true, data: updatedContact });
    } catch (error) {
      console.error('Error updating CRM contact:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid contact data', details: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to update contact' });
    }
  });

  // Delete a contact
  app.delete('/api/crm/contacts/:id', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const { id } = req.params;
      // Get tenant ID - use default if not available
      const tenantId = req.user.tenantId || '00000000-0000-0000-0000-000000000000';
      
      // Check if the contact exists
      const [existingContact] = await db.select().from(crmContacts)
        .where(and(
          eq(crmContacts.id, parseInt(id)),
          eq(crmContacts.tenantId, tenantId)
        ));
      
      if (!existingContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      // Delete the contact
      await db.delete(crmContacts)
        .where(eq(crmContacts.id, parseInt(id)));
      
      return res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting CRM contact:', error);
      return res.status(500).json({ error: 'Failed to delete contact' });
    }
  });

  console.log('✅ Starter CRM routes registered');
}