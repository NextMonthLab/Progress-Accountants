import { storage } from '../storage';
import { ClientProfileData } from '@shared/sot';
import { logger } from '../utils/logger';
import cron from 'node-cron';

/**
 * SOT Sync Service
 * Handles synchronization with the Source of Truth system
 */
export class SotSyncService {
  private scheduler: cron.ScheduledTask | null = null;
  private readonly cronExpression = '0 0 * * *'; // Run once a day at midnight
  
  constructor() {
    logger.info('SOT Sync Service initialized');
  }
  
  /**
   * Start the scheduled sync
   */
  startScheduler(): void {
    if (this.scheduler) {
      logger.info('Scheduler already running, skipping');
      return;
    }
    
    logger.info(`Starting SOT sync scheduler with cron expression: ${this.cronExpression}`);
    this.scheduler = cron.schedule(this.cronExpression, async () => {
      logger.info('Running scheduled SOT sync');
      await this.runSync();
    });
    
    // Log the start
    storage.logSotSync('scheduler', 'success', 'Scheduler started');
  }
  
  /**
   * Stop the scheduled sync
   */
  stopScheduler(): void {
    if (!this.scheduler) {
      logger.info('Scheduler not running, skipping');
      return;
    }
    
    logger.info('Stopping SOT sync scheduler');
    this.scheduler.stop();
    this.scheduler = null;
    
    // Log the stop
    storage.logSotSync('scheduler', 'success', 'Scheduler stopped');
  }
  
  /**
   * Trigger an immediate sync
   */
  async triggerImmediateSync(): Promise<boolean> {
    try {
      logger.info('Manual sync triggered');
      await this.runSync();
      return true;
    } catch (error) {
      logger.error('Failed to trigger immediate sync:', error);
      // Log the failure
      storage.logSotSync('manual_sync', 'failure', `Error: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Run the sync process
   * This is the main method that handles the sync process
   */
  private async runSync(): Promise<void> {
    try {
      logger.info('Starting sync process');
      
      // 1. Generate client profile
      const profile = await this.generateClientProfile();
      
      // 2. Save to the database
      const savedProfile = await storage.saveClientProfile(profile);
      
      // 3. Send to the SOT system - mock for now
      const syncId = savedProfile.id;
      logger.info(`Profile saved with ID ${syncId}, sending to SOT system`);
      
      // 4. Update status to indicate sync initiated
      await storage.updateClientProfileSyncStatus(syncId, 'syncing', 'Sync in progress');
      
      // 5. In a real implementation, this would make an API call to the SOT system
      // For demo purposes, we'll simulate a successful sync after a delay
      setTimeout(async () => {
        // 6. Update status to indicate successful sync
        await storage.updateClientProfileSyncStatus(syncId, 'success', 'Sync completed successfully');
        logger.info(`Sync completed for profile ${syncId}`);
        
        // 7. Log the successful sync
        storage.logSotSync('profile_sync', 'success', `Profile ${syncId} synced successfully`);
      }, 2000);
      
    } catch (error) {
      logger.error('Error during sync process:', error);
      // Log the failure
      storage.logSotSync('profile_sync', 'failure', `Error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Generate client profile
   * This method collects all the necessary data to create a client profile
   */
  async generateClientProfile(): Promise<ClientProfileData> {
    try {
      logger.info('Generating client profile');
      
      // Fetch business identity
      const identity = await storage.getBusinessIdentity();
      if (!identity) {
        throw new Error('Business identity not found');
      }
      
      // Fetch tenant information
      const tenant = await storage.getTenant('00000000-0000-0000-0000-000000000000');
      if (!tenant) {
        throw new Error('Tenant not found');
      }
      
      // Fetch installed pages
      const pages = await storage.getPages();
      
      // Fetch installed tools
      const tools = await storage.getInstalledTools();
      
      // Current timestamp
      const timestamp = new Date().toISOString();
      
      // Construct client profile data
      const profileData: ClientProfileData = {
        clientInformation: {
          businessId: "progress-accountants",
          instanceId: tenant.id,
          businessName: identity.name || "Progress Accountants",
          contactEmail: "support@progressaccountants.com",
          syncTimestamp: timestamp
        },
        businessProfile: {
          name: identity.name || "Progress Accountants",
          industry: tenant.industry || "Accounting",
          description: identity.mission || "Professional accounting services",
          foundedYear: "2020",
          location: {
            country: "United Kingdom",
            city: "London"
          },
          size: "10-50",
          website: tenant.domain || "progressaccountants.com"
        },
        brandInformation: {
          colors: {
            primary: "#003366", // Navy blue
            secondary: "#d7582c", // Burnt orange
            accent: "#6699cc" // Light blue
          },
          logo: {
            url: "https://assets.progressaccountants.com/logo.png",
            altText: "Progress Accountants Logo"
          },
          tagline: "Modern accounting for growing businesses",
          brandVoice: identity.brandVoice || "Professional, approachable, modern"
        },
        platformUsage: {
          activeSince: tenant.createdAt.toISOString(),
          lastActivity: tenant.updatedAt.toISOString(),
          installedPages: pages.map(page => page.path),
          installedTools: tools.map(tool => tool.id),
          userCount: 5,
          contentCount: 25
        },
        systemRequirements: {
          apiVersion: "1.0.0",
          compatibilityFlags: ["json-ld", "structured-data", "responsive"],
          supportRequests: 2
        }
      };
      
      logger.info('Client profile generated successfully');
      return profileData;
      
    } catch (error) {
      logger.error('Error generating client profile:', error);
      // Log the failure
      storage.logSotSync('profile_generation', 'failure', `Error: ${error.message}`);
      throw error;
    }
  }
}

export const sotSyncService = new SotSyncService();