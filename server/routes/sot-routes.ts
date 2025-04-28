import { Express, Request, Response } from 'express';
import { db, pool } from '../db';
import cron from 'node-cron';
import { storage } from '../storage';

// Super admin access middleware
const requireSuperAdmin = (req: Request, res: Response, next: Function) => {
  // Check if user is authenticated and is a super admin
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = req.user as any;
  if (!user.isSuperAdmin && user.userType !== 'super_admin') {
    return res.status(403).json({ message: "Super admin access required" });
  }
  
  next();
};

/**
 * Register SOT (Source of Truth) API routes
 * @param app Express app instance
 */
export function registerSotRoutes(app: Express) {
  console.log('Registering SOT routes...');
  
  // Get SOT declaration
  app.get('/api/sot/declaration', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM sot_declarations 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No SOT declaration found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching SOT declaration:', error);
      res.status(500).json({ message: 'Failed to fetch SOT declaration' });
    }
  });
  
  // Create/Update SOT declaration
  app.post('/api/sot/declaration', requireSuperAdmin, async (req, res) => {
    try {
      const { instanceId, instanceType, blueprintVersion, toolsSupported, callbackUrl, isTemplate, isCloneable } = req.body;
      
      if (!instanceId || !instanceType || !blueprintVersion || !toolsSupported || !callbackUrl) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if declaration already exists
      const existingResult = await pool.query(`
        SELECT * FROM sot_declarations 
        WHERE instance_id = $1
        LIMIT 1
      `, [instanceId]);
      
      if (existingResult.rows.length > 0) {
        // Update existing declaration
        const result = await pool.query(`
          UPDATE sot_declarations 
          SET 
            instance_type = $1, 
            blueprint_version = $2, 
            tools_supported = $3, 
            callback_url = $4,
            is_template = $5,
            is_cloneable = $6,
            status = 'updated',
            updated_at = CURRENT_TIMESTAMP
          WHERE instance_id = $7
          RETURNING *
        `, [
          instanceType, 
          blueprintVersion, 
          toolsSupported, 
          callbackUrl,
          isTemplate || false,
          isCloneable || false,
          instanceId
        ]);
        
        // Log the update in sync logs
        await pool.query(`
          INSERT INTO sot_sync_logs (event_type, status, details)
          VALUES ($1, $2, $3)
        `, [
          'declaration_update', 
          'success', 
          JSON.stringify({
            instanceId,
            instanceType,
            blueprintVersion
          })
        ]);
        
        return res.json(result.rows[0]);
      } else {
        // Create new declaration
        const result = await pool.query(`
          INSERT INTO sot_declarations (
            instance_id, 
            instance_type, 
            blueprint_version, 
            tools_supported, 
            callback_url,
            is_template,
            is_cloneable,
            status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `, [
          instanceId, 
          instanceType, 
          blueprintVersion, 
          toolsSupported, 
          callbackUrl,
          isTemplate || false,
          isCloneable || false,
          'pending'
        ]);
        
        // Log the creation in sync logs
        await pool.query(`
          INSERT INTO sot_sync_logs (event_type, status, details)
          VALUES ($1, $2, $3)
        `, [
          'declaration_create', 
          'success', 
          JSON.stringify({
            instanceId,
            instanceType,
            blueprintVersion
          })
        ]);
        
        return res.status(201).json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error saving SOT declaration:', error);
      
      // Log the error in sync logs
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        'declaration_error', 
        'error', 
        JSON.stringify({
          error: error.message
        })
      ]);
      
      res.status(500).json({ message: 'Failed to save SOT declaration' });
    }
  });
  
  // Get client profile
  app.get('/api/sot/client-profile', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM sot_client_profiles 
        ORDER BY updated_at DESC 
        LIMIT 1
      `);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No client profile found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching client profile:', error);
      res.status(500).json({ message: 'Failed to fetch client profile' });
    }
  });
  
  // Create/Update client profile
  app.post('/api/sot/client-profile', requireSuperAdmin, async (req, res) => {
    try {
      const { 
        businessId, 
        businessName, 
        businessType, 
        industry, 
        description, 
        locationData, 
        contactInfo, 
        profileData 
      } = req.body;
      
      if (!businessId || !businessName || !businessType || !profileData) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if profile already exists
      const existingResult = await pool.query(`
        SELECT * FROM sot_client_profiles 
        WHERE business_id = $1
        LIMIT 1
      `, [businessId]);
      
      if (existingResult.rows.length > 0) {
        // Update existing profile
        const result = await pool.query(`
          UPDATE sot_client_profiles 
          SET 
            business_name = $1, 
            business_type = $2, 
            industry = $3, 
            description = $4,
            location_data = $5,
            contact_info = $6,
            profile_data = $7,
            sync_status = 'updated',
            updated_at = CURRENT_TIMESTAMP
          WHERE business_id = $8
          RETURNING *
        `, [
          businessName, 
          businessType, 
          industry, 
          description,
          JSON.stringify(locationData || {}),
          JSON.stringify(contactInfo || {}),
          JSON.stringify(profileData),
          businessId
        ]);
        
        // Log the update in sync logs
        await pool.query(`
          INSERT INTO sot_sync_logs (event_type, status, details)
          VALUES ($1, $2, $3)
        `, [
          'profile_update', 
          'success', 
          JSON.stringify({
            businessId,
            businessName,
            businessType
          })
        ]);
        
        return res.json(result.rows[0]);
      } else {
        // Create new profile
        const result = await pool.query(`
          INSERT INTO sot_client_profiles (
            business_id, 
            business_name, 
            business_type, 
            industry, 
            description,
            location_data,
            contact_info,
            profile_data,
            sync_status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `, [
          businessId, 
          businessName, 
          businessType, 
          industry, 
          description,
          JSON.stringify(locationData || {}),
          JSON.stringify(contactInfo || {}),
          JSON.stringify(profileData),
          'pending'
        ]);
        
        // Log the creation in sync logs
        await pool.query(`
          INSERT INTO sot_sync_logs (event_type, status, details)
          VALUES ($1, $2, $3)
        `, [
          'profile_create', 
          'success', 
          JSON.stringify({
            businessId,
            businessName,
            businessType
          })
        ]);
        
        return res.status(201).json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error saving client profile:', error);
      
      // Log the error in sync logs
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        'profile_error', 
        'error', 
        JSON.stringify({
          error: error.message
        })
      ]);
      
      res.status(500).json({ message: 'Failed to save client profile' });
    }
  });
  
  // Get sync logs with pagination
  app.get('/api/sot/sync-logs', requireSuperAdmin, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      const result = await pool.query(`
        SELECT * FROM sot_sync_logs 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      
      const countResult = await pool.query(`SELECT COUNT(*) FROM sot_sync_logs`);
      const totalLogs = parseInt(countResult.rows[0].count);
      
      res.json({
        logs: result.rows,
        pagination: {
          page,
          limit,
          totalLogs,
          totalPages: Math.ceil(totalLogs / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching sync logs:', error);
      res.status(500).json({ message: 'Failed to fetch sync logs' });
    }
  });
  
  // Manually trigger client profile sync
  app.post('/api/sot/sync', requireSuperAdmin, async (req, res) => {
    try {
      // Generate client profile based on current system state
      const businessIdentity = await storage.getBusinessIdentity();
      const pages = await storage.getPages();
      const users = await storage.getUsers();
      const tools = await storage.getTools?.() || []; // Optional method
      
      // Current timestamp for the sync operation
      const syncTimestamp = new Date().toISOString();
      
      // Build the profile data
      const profileData = {
        businessId: businessIdentity?.id || '00000000-0000-0000-0000-000000000000',
        businessName: businessIdentity?.businessName || 'Progress Accountants',
        businessType: businessIdentity?.businessType || 'Accounting Firm',
        industry: businessIdentity?.industry || 'Finance',
        description: businessIdentity?.description || 'Professional accounting services',
        location: {
          city: businessIdentity?.city || 'London',
          country: businessIdentity?.country || 'United Kingdom'
        },
        metrics: {
          totalPages: pages?.length || 0,
          totalUsers: users?.length || 0,
          totalTools: tools?.length || 0
        },
        features: {
          hasCustomBranding: Boolean(businessIdentity?.logo || businessIdentity?.colors),
          hasPublishedPages: pages?.some(page => page.published) || false,
          hasCRM: Boolean(storage.getCrmContacts),
          hasAnalytics: Boolean(storage.getAnalyticsData)
        },
        dateOnboarded: businessIdentity?.createdAt || syncTimestamp,
        lastSync: syncTimestamp
      };
      
      // Check if profile already exists
      const existingResult = await pool.query(`
        SELECT * FROM sot_client_profiles 
        WHERE business_id = $1
        LIMIT 1
      `, [profileData.businessId]);
      
      if (existingResult.rows.length > 0) {
        // Update existing profile
        await pool.query(`
          UPDATE sot_client_profiles 
          SET 
            business_name = $1, 
            business_type = $2, 
            industry = $3, 
            description = $4,
            location_data = $5,
            profile_data = $6,
            sync_status = $7,
            sync_message = $8,
            last_sync_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE business_id = $9
          RETURNING *
        `, [
          profileData.businessName,
          profileData.businessType,
          profileData.industry,
          profileData.description,
          JSON.stringify(profileData.location),
          JSON.stringify(profileData),
          'synced',
          'Manually triggered sync completed successfully',
          profileData.businessId
        ]);
      } else {
        // Create new profile
        await pool.query(`
          INSERT INTO sot_client_profiles (
            business_id, 
            business_name, 
            business_type, 
            industry, 
            description,
            location_data,
            profile_data,
            sync_status,
            sync_message,
            last_sync_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        `, [
          profileData.businessId,
          profileData.businessName,
          profileData.businessType,
          profileData.industry,
          profileData.description,
          JSON.stringify(profileData.location),
          JSON.stringify(profileData),
          'synced',
          'Manually triggered sync completed successfully'
        ]);
      }
      
      // Log the sync operation
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        'manual_sync', 
        'success', 
        JSON.stringify({
          businessId: profileData.businessId,
          businessName: profileData.businessName,
          syncTimestamp
        })
      ]);
      
      res.json({ 
        success: true, 
        message: 'Client profile sync completed successfully',
        syncTimestamp,
        profileData
      });
    } catch (error) {
      console.error('Error during client profile sync:', error);
      
      // Log the error in sync logs
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        'manual_sync', 
        'error', 
        JSON.stringify({
          error: error.message
        })
      ]);
      
      res.status(500).json({ 
        success: false,
        message: 'Client profile sync failed',
        error: error.message
      });
    }
  });
  
  // Initialize daily sync schedule
  const syncSchedule = '0 3 * * *'; // Run daily at 3 AM
  
  const syncJob = cron.schedule(syncSchedule, async () => {
    console.log('Running scheduled SOT client profile sync...');
    try {
      // This is the same logic as the manual sync endpoint
      const businessIdentity = await storage.getBusinessIdentity();
      const pages = await storage.getPages();
      const users = await storage.getUsers();
      const tools = await storage.getTools?.() || [];
      
      const syncTimestamp = new Date().toISOString();
      
      const profileData = {
        businessId: businessIdentity?.id || '00000000-0000-0000-0000-000000000000',
        businessName: businessIdentity?.businessName || 'Progress Accountants',
        businessType: businessIdentity?.businessType || 'Accounting Firm',
        industry: businessIdentity?.industry || 'Finance',
        description: businessIdentity?.description || 'Professional accounting services',
        location: {
          city: businessIdentity?.city || 'London',
          country: businessIdentity?.country || 'United Kingdom'
        },
        metrics: {
          totalPages: pages?.length || 0,
          totalUsers: users?.length || 0,
          totalTools: tools?.length || 0
        },
        features: {
          hasCustomBranding: Boolean(businessIdentity?.logo || businessIdentity?.colors),
          hasPublishedPages: pages?.some(page => page.published) || false,
          hasCRM: Boolean(storage.getCrmContacts),
          hasAnalytics: Boolean(storage.getAnalyticsData)
        },
        dateOnboarded: businessIdentity?.createdAt || syncTimestamp,
        lastSync: syncTimestamp
      };
      
      // Check if profile already exists
      const existingResult = await pool.query(`
        SELECT * FROM sot_client_profiles 
        WHERE business_id = $1
        LIMIT 1
      `, [profileData.businessId]);
      
      if (existingResult.rows.length > 0) {
        // Update existing profile
        await pool.query(`
          UPDATE sot_client_profiles 
          SET 
            business_name = $1, 
            business_type = $2, 
            industry = $3, 
            description = $4,
            location_data = $5,
            profile_data = $6,
            sync_status = $7,
            sync_message = $8,
            last_sync_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE business_id = $9
        `, [
          profileData.businessName,
          profileData.businessType,
          profileData.industry,
          profileData.description,
          JSON.stringify(profileData.location),
          JSON.stringify(profileData),
          'synced',
          'Scheduled sync completed successfully',
          profileData.businessId
        ]);
      } else {
        // Create new profile
        await pool.query(`
          INSERT INTO sot_client_profiles (
            business_id, 
            business_name, 
            business_type, 
            industry, 
            description,
            location_data,
            profile_data,
            sync_status,
            sync_message,
            last_sync_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        `, [
          profileData.businessId,
          profileData.businessName,
          profileData.businessType,
          profileData.industry,
          profileData.description,
          JSON.stringify(profileData.location),
          JSON.stringify(profileData),
          'synced',
          'Scheduled sync completed successfully'
        ]);
      }
      
      // Log the sync operation
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        'scheduled_sync', 
        'success', 
        JSON.stringify({
          businessId: profileData.businessId,
          businessName: profileData.businessName,
          syncTimestamp
        })
      ]);
      
      console.log('Scheduled SOT client profile sync completed successfully');
    } catch (error) {
      console.error('Error during scheduled client profile sync:', error);
      
      // Log the error in sync logs
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        'scheduled_sync', 
        'error', 
        JSON.stringify({
          error: error.message
        })
      ]);
    }
  }, {
    scheduled: false // Start manually later
  });
  
  // Start the sync job
  syncJob.start();
  
  console.log('✅ SOT routes registered');
}