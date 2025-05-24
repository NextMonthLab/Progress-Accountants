import cron from 'node-cron';
import { db, pool } from '../db';
import { logger } from '../utils/logger';
import { storage } from '../storage';
import axios from 'axios';

/**
 * SOT (Source of Truth) Sync Service
 * Handles synchronizing client profile data with the NextMonth SOT system
 */
export class SotSyncService {
  private scheduledJob: cron.ScheduledTask | null = null;
  private syncSchedule: string = '0 3 * * *'; // Run daily at 3 AM
  private isRunning: boolean = false;
  private lastSyncTimestamp: Date | null = null;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  
  constructor() {
    logger.info('SotSyncService initialized');
  }
  
  /**
   * Start the SOT sync service with scheduled jobs
   */
  public start(): void {
    if (this.isRunning) {
      logger.warn('SotSyncService is already running');
      return;
    }
    
    this.scheduledJob = cron.schedule(this.syncSchedule, async () => {
      await this.performScheduledSync();
    });
    
    this.isRunning = true;
    logger.info(`SOT sync service started with schedule: ${this.syncSchedule}`);
  }
  
  /**
   * Stop the SOT sync service
   */
  public stop(): void {
    if (!this.isRunning) {
      logger.warn('SotSyncService is not running');
      return;
    }
    
    if (this.scheduledJob) {
      this.scheduledJob.stop();
      this.scheduledJob = null;
    }
    
    this.isRunning = false;
    logger.info('SOT sync service stopped');
  }
  
  /**
   * Perform a manual sync operation
   */
  public async performManualSync(): Promise<any> {
    try {
      logger.info('Starting manual SOT sync operation');
      
      // Generate client profile
      const profileData = await this.generateClientProfile();
      
      // Update local database
      await this.updateLocalProfile(profileData);
      
      // Send to SOT system if there's a declaration with a callback URL
      await this.sendToSotSystem(profileData);
      
      // Log the sync operation
      await this.logSyncOperation('manual_sync', 'success', { profileData });
      
      this.lastSyncTimestamp = new Date();
      this.retryCount = 0;
      
      logger.info('Manual SOT sync operation completed successfully');
      
      return {
        success: true,
        profileData,
        timestamp: this.lastSyncTimestamp
      };
    } catch (error) {
      logger.error('Error during manual SOT sync operation:', error);
      
      // Log the error
      await this.logSyncOperation('manual_sync', 'error', { 
        error: error.message || 'Unknown error'
      });
      
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }
  
  /**
   * Perform a scheduled sync operation
   */
  private async performScheduledSync(): Promise<void> {
    try {
      logger.info('Starting scheduled SOT sync operation');
      
      // Generate client profile
      const profileData = await this.generateClientProfile();
      
      // Update local database
      await this.updateLocalProfile(profileData);
      
      // Send to SOT system if there's a declaration with a callback URL
      await this.sendToSotSystem(profileData);
      
      // Log the sync operation
      await this.logSyncOperation('scheduled_sync', 'success', { profileData });
      
      this.lastSyncTimestamp = new Date();
      this.retryCount = 0;
      
      logger.info('Scheduled SOT sync operation completed successfully');
    } catch (error) {
      logger.error('Error during scheduled SOT sync operation:', error);
      
      // Log the error
      await this.logSyncOperation('scheduled_sync', 'error', { 
        error: error.message || 'Unknown error'
      });
      
      // Retry if within max retries
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const retryDelay = this.retryCount * 60 * 1000; // Exponential backoff
        
        logger.info(`Scheduling retry #${this.retryCount} in ${retryDelay / 1000} seconds`);
        
        setTimeout(() => {
          this.performScheduledSync();
        }, retryDelay);
      } else {
        logger.error(`Max retries (${this.maxRetries}) reached for scheduled sync operation`);
        this.retryCount = 0;
      }
    }
  }
  
  /**
   * Generate client profile based on current system state
   */
  private async generateClientProfile(): Promise<any> {
    const businessIdentity = await storage.getBusinessIdentity();
    const pages = await storage.getPages();
    const users = await storage.getUsers();
    const tools = await storage.getTools?.() || []; // Optional method
    
    // Current timestamp for the sync operation
    const syncTimestamp = new Date().toISOString();
    
    // Build the profile data
    return {
      businessId: businessIdentity?.id || '00000000-0000-0000-0000-000000000000',
      businessName: businessIdentity?.name || 'Progress Accountants',
      businessType: businessIdentity?.type || 'Accounting Firm',
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
        hasCustomBranding: Boolean(businessIdentity?.branding?.logo || businessIdentity?.branding?.colors),
        hasPublishedPages: pages?.some(page => page.published) || false,
        hasCRM: Boolean(storage.getCrmContacts),
        hasAnalytics: Boolean(storage.getAnalyticsData)
      },
      dateOnboarded: businessIdentity?.createdAt || syncTimestamp,
      lastSync: syncTimestamp
    };
  }
  
  /**
   * Update local profile in the database
   */
  private async updateLocalProfile(profileData: any): Promise<void> {
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
        'Sync completed successfully',
        profileData.businessId
      ]);
      
      logger.info(`Updated existing profile for business ID: ${profileData.businessId}`);
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
        'Sync completed successfully'
      ]);
      
      logger.info(`Created new profile for business ID: ${profileData.businessId}`);
    }
  }
  
  /**
   * Send profile data to SOT system using the callback URL from the declaration
   */
  private async sendToSotSystem(profileData: any): Promise<void> {
    try {
      // Get the latest declaration
      const declarationResult = await pool.query(`
        SELECT * FROM sot_declarations 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      
      if (declarationResult.rows.length === 0) {
        logger.info('No SOT declaration found, skipping external sync');
        return;
      }
      
      const declaration = declarationResult.rows[0];
      
      if (!declaration.callback_url) {
        logger.info('No callback URL in declaration, skipping external sync');
        return;
      }
      
      // Prepare the payload
      const payload = {
        instanceId: declaration.instance_id,
        instanceType: declaration.instance_type,
        blueprintVersion: declaration.blueprint_version,
        profile: profileData,
        timestamp: new Date().toISOString()
      };
      
      // Send to the SOT system
      logger.info(`Sending profile data to SOT system at ${declaration.callback_url}`);
      
      const response = await axios.post(declaration.callback_url, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10-second timeout
      });
      
      if (response.status >= 200 && response.status < 300) {
        logger.info('Successfully sent profile data to SOT system');
        
        // Update declaration status if it was pending
        if (declaration.status === 'pending') {
          await pool.query(`
            UPDATE sot_declarations 
            SET status = 'active', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
          `, [declaration.id]);
          
          logger.info('Updated declaration status to active');
        }
      } else {
        throw new Error(`SOT system responded with status: ${response.status}`);
      }
    } catch (error) {
      logger.error('Error sending profile data to SOT system:', error);
      
      // Continue without failing the entire sync operation
      // This error is logged but doesn't cause the sync operation to fail
    }
  }
  
  /**
   * Log a sync operation to the database
   */
  private async logSyncOperation(eventType: string, status: 'success' | 'error', details: any): Promise<void> {
    try {
      await pool.query(`
        INSERT INTO sot_sync_logs (event_type, status, details)
        VALUES ($1, $2, $3)
      `, [
        eventType, 
        status, 
        JSON.stringify(details)
      ]);
    } catch (error) {
      logger.error('Error logging sync operation:', error);
    }
  }
  
  /**
   * Get the status of the SOT sync service
   */
  public getStatus(): any {
    return {
      isRunning: this.isRunning,
      schedule: this.syncSchedule,
      lastSync: this.lastSyncTimestamp,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries
    };
  }
  
  /**
   * Update the sync schedule
   */
  public updateSchedule(schedule: string): void {
    if (!cron.validate(schedule)) {
      throw new Error(`Invalid cron schedule: ${schedule}`);
    }
    
    this.syncSchedule = schedule;
    
    // Restart the service with the new schedule if it's running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
    
    logger.info(`SOT sync schedule updated to: ${schedule}`);
  }
}

// Create singleton instance
export const sotSyncService = new SotSyncService();