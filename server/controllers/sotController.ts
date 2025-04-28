import { Request, Response } from 'express';
import { pool } from '../db';
import { sotSyncService } from '../services/sot-sync';
import { logger } from '../utils/logger';

/**
 * SOT Controller
 * Handles API endpoints for SOT-related operations
 */
export class SotController {
  /**
   * Register a new declaration
   */
  async registerDeclaration(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { instanceId, instanceType, blueprintVersion, toolsSupported, callbackUrl } = req.body;
      
      if (!instanceId || !instanceType || !blueprintVersion || !callbackUrl || !Array.isArray(toolsSupported)) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid declaration data. Required fields: instanceId, instanceType, blueprintVersion, toolsSupported (array), callbackUrl'
        });
        return;
      }
      
      // Check if declaration already exists
      const existingResult = await pool.query(`
        SELECT * FROM sot_declarations 
        WHERE instance_id = $1
        LIMIT 1
      `, [instanceId]);
      
      if (existingResult.rows.length > 0) {
        // Update existing declaration
        await pool.query(`
          UPDATE sot_declarations
          SET 
            instance_type = $1, 
            blueprint_version = $2, 
            tools_supported = $3, 
            callback_url = $4,
            updated_at = CURRENT_TIMESTAMP
          WHERE instance_id = $5
        `, [
          instanceType,
          blueprintVersion,
          JSON.stringify(toolsSupported),
          callbackUrl,
          instanceId
        ]);
        
        logger.info(`Updated SOT declaration for instance ID: ${instanceId}`);
        
        res.status(200).json({
          success: true,
          message: 'Declaration updated successfully',
          declaration: {
            instanceId,
            instanceType,
            blueprintVersion,
            toolsSupported,
            callbackUrl,
            status: 'updated'
          }
        });
      } else {
        // Create new declaration
        const result = await pool.query(`
          INSERT INTO sot_declarations (
            instance_id, 
            instance_type, 
            blueprint_version, 
            tools_supported, 
            callback_url
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, [
          instanceId,
          instanceType,
          blueprintVersion,
          JSON.stringify(toolsSupported),
          callbackUrl
        ]);
        
        const newDeclaration = result.rows[0];
        
        logger.info(`Created new SOT declaration for instance ID: ${instanceId}`);
        
        res.status(201).json({
          success: true,
          message: 'Declaration registered successfully',
          declaration: {
            id: newDeclaration.id,
            instanceId: newDeclaration.instance_id,
            instanceType: newDeclaration.instance_type,
            blueprintVersion: newDeclaration.blueprint_version,
            toolsSupported: JSON.parse(newDeclaration.tools_supported),
            callbackUrl: newDeclaration.callback_url,
            status: newDeclaration.status,
            createdAt: newDeclaration.created_at
          }
        });
      }
    } catch (error) {
      logger.error('Error in registerDeclaration:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Update declaration to mark as a template (for cloning)
   */
  async updateAsTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { instanceId } = req.params;
      const { isTemplate, isCloneable } = req.body;
      
      if (typeof isTemplate !== 'boolean' || typeof isCloneable !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'Invalid template data. Required fields: isTemplate (boolean), isCloneable (boolean)'
        });
        return;
      }
      
      // Check if the declaration exists
      const existingResult = await pool.query(`
        SELECT * FROM sot_declarations 
        WHERE instance_id = $1
        LIMIT 1
      `, [instanceId]);
      
      if (existingResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: `Declaration not found for instance ID: ${instanceId}`
        });
        return;
      }
      
      // Update the declaration
      await pool.query(`
        UPDATE sot_declarations
        SET 
          is_template = $1, 
          is_cloneable = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE instance_id = $3
      `, [
        isTemplate,
        isCloneable,
        instanceId
      ]);
      
      logger.info(`Updated template status for instance ID: ${instanceId}`);
      
      res.status(200).json({
        success: true,
        message: 'Template status updated successfully',
        declaration: {
          instanceId,
          isTemplate,
          isCloneable
        }
      });
    } catch (error) {
      logger.error('Error in updateAsTemplate:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Get declarations
   */
  async getDeclarations(req: Request, res: Response): Promise<void> {
    try {
      const { templates } = req.query;
      let query = 'SELECT * FROM sot_declarations';
      
      // If templates flag is present, filter for templates only
      if (templates === 'true') {
        query += ' WHERE is_template = true';
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query);
      
      const declarations = result.rows.map(row => ({
        id: row.id,
        instanceId: row.instance_id,
        instanceType: row.instance_type,
        blueprintVersion: row.blueprint_version,
        toolsSupported: typeof row.tools_supported === 'string' ? 
          JSON.parse(row.tools_supported) : row.tools_supported,
        callbackUrl: row.callback_url,
        isTemplate: row.is_template,
        isCloneable: row.is_cloneable,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      
      res.status(200).json({
        success: true,
        count: declarations.length,
        declarations
      });
    } catch (error) {
      logger.error('Error in getDeclarations:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Get a specific declaration by instance ID
   */
  async getDeclaration(req: Request, res: Response): Promise<void> {
    try {
      const { instanceId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM sot_declarations 
        WHERE instance_id = $1
        LIMIT 1
      `, [instanceId]);
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: `Declaration not found for instance ID: ${instanceId}`
        });
        return;
      }
      
      const row = result.rows[0];
      
      const declaration = {
        id: row.id,
        instanceId: row.instance_id,
        instanceType: row.instance_type,
        blueprintVersion: row.blueprint_version,
        toolsSupported: typeof row.tools_supported === 'string' ? 
          JSON.parse(row.tools_supported) : row.tools_supported,
        callbackUrl: row.callback_url,
        isTemplate: row.is_template,
        isCloneable: row.is_cloneable,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      
      res.status(200).json({
        success: true,
        declaration
      });
    } catch (error) {
      logger.error('Error in getDeclaration:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Trigger a manual sync
   */
  async syncNow(req: Request, res: Response): Promise<void> {
    try {
      const syncResult = await sotSyncService.performManualSync();
      
      res.status(200).json({
        success: syncResult.success,
        message: syncResult.success ? 
          'Manual sync completed successfully' : 
          `Manual sync failed: ${syncResult.error}`,
        timestamp: syncResult.timestamp,
        ...(!syncResult.success && { error: syncResult.error })
      });
    } catch (error) {
      logger.error('Error in syncNow:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Get sync status
   */
  async getSyncStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = sotSyncService.getStatus();
      
      // Get the latest sync log
      const logsResult = await pool.query(`
        SELECT * FROM sot_sync_logs 
        ORDER BY created_at DESC
        LIMIT 10
      `);
      
      const syncLogs = logsResult.rows.map(row => ({
        id: row.id,
        eventType: row.event_type,
        status: row.status,
        details: typeof row.details === 'string' ? 
          JSON.parse(row.details) : row.details,
        createdAt: row.created_at
      }));
      
      res.status(200).json({
        success: true,
        status: {
          ...status,
          logs: syncLogs
        }
      });
    } catch (error) {
      logger.error('Error in getSyncStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Update sync schedule
   */
  async updateSyncSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { schedule } = req.body;
      
      if (!schedule || typeof schedule !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Invalid schedule. Required field: schedule (cron string)'
        });
        return;
      }
      
      sotSyncService.updateSchedule(schedule);
      
      res.status(200).json({
        success: true,
        message: 'Sync schedule updated successfully',
        schedule
      });
    } catch (error) {
      logger.error('Error in updateSyncSchedule:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }
  
  /**
   * Get client profile
   */
  async getClientProfile(req: Request, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;
      
      const result = await pool.query(`
        SELECT * FROM sot_client_profiles 
        WHERE business_id = $1
        LIMIT 1
      `, [businessId]);
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: `Client profile not found for business ID: ${businessId}`
        });
        return;
      }
      
      const row = result.rows[0];
      
      const profile = {
        id: row.id,
        businessId: row.business_id,
        businessName: row.business_name,
        businessType: row.business_type,
        industry: row.industry,
        description: row.description,
        location: typeof row.location_data === 'string' ? 
          JSON.parse(row.location_data) : row.location_data,
        contactInfo: typeof row.contact_info === 'string' ? 
          JSON.parse(row.contact_info) : row.contact_info,
        profileData: typeof row.profile_data === 'string' ? 
          JSON.parse(row.profile_data) : row.profile_data,
        syncStatus: row.sync_status,
        syncMessage: row.sync_message,
        lastSyncAt: row.last_sync_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      
      res.status(200).json({
        success: true,
        profile
      });
    } catch (error) {
      logger.error('Error in getClientProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  /**
   * Get all client profiles with optional filtering
   */
  async getClientProfiles(req: Request, res: Response): Promise<void> {
    try {
      const { businessType, syncStatus } = req.query;
      
      let query = 'SELECT * FROM sot_client_profiles';
      const queryParams: any[] = [];
      
      // Apply filters if present
      const filters = [];
      
      if (businessType) {
        filters.push(`business_type = $${queryParams.length + 1}`);
        queryParams.push(businessType);
      }
      
      if (syncStatus) {
        filters.push(`sync_status = $${queryParams.length + 1}`);
        queryParams.push(syncStatus);
      }
      
      if (filters.length > 0) {
        query += ' WHERE ' + filters.join(' AND ');
      }
      
      query += ' ORDER BY updated_at DESC';
      
      const result = await pool.query(query, queryParams);
      
      const profiles = result.rows.map(row => ({
        id: row.id,
        businessId: row.business_id,
        businessName: row.business_name,
        businessType: row.business_type,
        industry: row.industry,
        description: row.description,
        location: typeof row.location_data === 'string' ? 
          JSON.parse(row.location_data) : row.location_data,
        syncStatus: row.sync_status,
        lastSyncAt: row.last_sync_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      
      res.status(200).json({
        success: true,
        count: profiles.length,
        profiles
      });
    } catch (error) {
      logger.error('Error in getClientProfiles:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

// Create singleton instance
export const sotController = new SotController();