import { Request, Response } from 'express';
import { storage } from '../storage';
import { sotSyncService } from '../services/sot-sync';
import { logger } from '../utils/logger';
import { ClientProfileData } from '@shared/sot';

/**
 * SOT Controller
 * Handles API endpoints related to SOT synchronization
 */
export class SotController {
  /**
   * Get client profile
   */
  async getClientProfile(req: Request, res: Response) {
    try {
      const businessId = req.params.businessId || 'progress-accountants';
      const profile = await storage.getClientProfile(businessId);
      
      if (!profile) {
        return res.status(404).json({ 
          error: 'Client profile not found',
          message: `No profile found for business ID: ${businessId}`
        });
      }
      
      res.json(profile.profileData);
    } catch (error) {
      logger.error('Error fetching client profile:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Error fetching client profile' 
      });
    }
  }
  
  /**
   * Save client profile (manual update)
   */
  async saveClientProfile(req: Request, res: Response) {
    try {
      const profileData = req.body as ClientProfileData;
      
      if (!profileData || !profileData.clientInformation || !profileData.clientInformation.businessId) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Client profile data is missing or invalid'
        });
      }
      
      const savedProfile = await storage.saveClientProfile(profileData);
      
      res.status(201).json({
        success: true,
        message: 'Client profile saved successfully',
        profile: savedProfile
      });
    } catch (error) {
      logger.error('Error saving client profile:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error saving client profile'
      });
    }
  }
  
  /**
   * Manually trigger SOT sync
   */
  async triggerSync(req: Request, res: Response) {
    try {
      logger.info('Manual sync triggered');
      const success = await sotSyncService.triggerImmediateSync();
      
      if (success) {
        res.json({
          success: true,
          message: 'SOT sync triggered successfully'
        });
      } else {
        res.status(500).json({
          error: 'Sync failed',
          message: 'SOT sync failed to complete'
        });
      }
    } catch (error) {
      logger.error('Error triggering SOT sync:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error triggering SOT sync'
      });
    }
  }
  
  /**
   * Start scheduled sync
   */
  async startScheduledSync(req: Request, res: Response) {
    try {
      sotSyncService.startScheduler();
      
      res.json({
        success: true,
        message: 'SOT sync scheduler started successfully'
      });
    } catch (error) {
      logger.error('Error starting SOT sync scheduler:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error starting SOT sync scheduler'
      });
    }
  }
  
  /**
   * Stop scheduled sync
   */
  async stopScheduledSync(req: Request, res: Response) {
    try {
      sotSyncService.stopScheduler();
      
      res.json({
        success: true,
        message: 'SOT sync scheduler stopped successfully'
      });
    } catch (error) {
      logger.error('Error stopping SOT sync scheduler:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error stopping SOT sync scheduler'
      });
    }
  }
  
  /**
   * Get sync logs
   */
  async getSyncLogs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const logs = await storage.getSotSyncLogs(limit);
      
      res.json(logs);
    } catch (error) {
      logger.error('Error fetching SOT sync logs:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error fetching SOT sync logs'
      });
    }
  }
  
  /**
   * Generate client profile without saving
   */
  async generateClientProfile(req: Request, res: Response) {
    try {
      const profile = await sotSyncService.generateClientProfile();
      
      res.json(profile);
    } catch (error) {
      logger.error('Error generating client profile:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error generating client profile'
      });
    }
  }
}

export const sotController = new SotController();