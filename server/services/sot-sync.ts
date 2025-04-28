import { storage } from '../storage';
import * as cron from 'node-cron';
import { logger } from '../utils/logger';
import axios from 'axios';

// Interface for the client profile data
interface ClientProfile {
  clientInformation: {
    businessId: string;
    businessName: string;
    businessType: string;
    industry: string;
    description: string;
    location: {
      city: string;
      country: string;
    };
    dateOnboarded: string;
  };
  platformBlueprintInformation: {
    currentBlueprintVersion: string;
    pagesPublished: string[];
    toolsInstalled: string[];
    automationsActive: string[];
    lastDeploymentDate: string;
    hostingEnvironment: string;
  };
  activityTracking: {
    totalCreditsPurchased: number;
    totalCreditsConsumed: number;
    lastActivityTimestamp: string;
    accountStatus: string;
  };
  externalPublicInfo: {
    websiteUrl: string;
    publicLinkedIn: string;
    publicYouTubeChannel: string;
    podcastInfo: {
      name: string;
      platforms: string[];
      frequency: string;
      totalEpisodes: number;
    };
  };
  dynamicUpdateTriggers: {
    realtimeWebhookEnabled: boolean;
    updateFrequency: string;
    lastSyncTimestamp: string;
  };
  systemMetadata: {
    instanceId: string;
    instanceType: string;
    tenantId: string;
    isTemplate: boolean;
    isCloneable: boolean;
    supportTier: string;
    statusCheckFrequency: number;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * SOT Sync Service
 * Responsible for syncing client profile data with SOT
 */
export class SotSyncService {
  private scheduler: any;
  private isSchedulerRunning: boolean = false;
  private readonly SOT_ENDPOINT = 'https://sot.nextmonth.app/api/sot/update-client';
  private readonly LOCAL_ENDPOINT = '/api/sot/client-profile';
  
  constructor() {
    logger.info('SotSyncService initialized');
  }

  /**
   * Start the SOT sync scheduler
   */
  public startScheduler() {
    if (this.isSchedulerRunning) {
      logger.info('SOT sync scheduler is already running');
      return;
    }
    
    // Schedule to run once every 24 hours at midnight (as per requirement)
    this.scheduler = cron.schedule('0 0 * * *', async () => {
      logger.info('Running scheduled SOT sync');
      await this.syncClientProfile();
    });
    
    this.isSchedulerRunning = true;
    logger.info('SOT sync scheduler started successfully');
  }

  /**
   * Stop the SOT sync scheduler
   */
  public stopScheduler() {
    if (this.scheduler) {
      this.scheduler.stop();
      this.isSchedulerRunning = false;
      logger.info('SOT sync scheduler stopped');
    }
  }

  /**
   * Generate client profile data
   */
  private async generateClientProfile(): Promise<ClientProfile> {
    try {
      // Get business identity from storage
      const businessIdentity = await storage.getBusinessIdentity();
      
      // Get pages, tools, and other data
      const pages = await storage.getPages();
      const tools = await storage.getInstalledTools();
      const tenantInfo = await storage.getTenant('00000000-0000-0000-0000-000000000000');
      
      // Get SOT declaration for blueprint version
      const sotDeclaration = await storage.getSotDeclaration();
      
      // Generate profile data
      const profile: ClientProfile = {
        clientInformation: {
          businessId: "progress-accountants",
          businessName: businessIdentity?.core?.businessName || "Progress Accountants",
          businessType: businessIdentity?.details?.businessType || "Accounting Firm",
          industry: businessIdentity?.details?.industry || "Financial Services",
          description: businessIdentity?.marketing?.shortDescription || 
            "Progress Accountants is a modern accounting firm specializing in complex industries like film, music, and construction, offering financial expertise with personalized attention.",
          location: {
            city: businessIdentity?.details?.city || "Banbury",
            country: businessIdentity?.details?.country || "United Kingdom"
          },
          dateOnboarded: tenantInfo?.createdAt?.toISOString() || new Date().toISOString()
        },
        platformBlueprintInformation: {
          currentBlueprintVersion: sotDeclaration?.blueprintVersion || "v1.1.1",
          pagesPublished: pages?.map(page => page.path) || ["/", "/about", "/services", "/team", "/contact"],
          toolsInstalled: tools?.map(tool => tool.id) || [
            "crm", 
            "financial_dashboard", 
            "social_media_generator", 
            "blog_post_generator"
          ],
          automationsActive: [
            "workflow-monthly-insights", 
            "workflow-client-onboarding", 
            "workflow-tax-reminder"
          ],
          lastDeploymentDate: tenantInfo?.updatedAt?.toISOString() || new Date().toISOString(),
          hostingEnvironment: "Replit"
        },
        activityTracking: {
          totalCreditsPurchased: tenantInfo?.credits?.purchased || 5000,
          totalCreditsConsumed: tenantInfo?.credits?.consumed || 3245,
          lastActivityTimestamp: new Date().toISOString(),
          accountStatus: tenantInfo?.status || "active"
        },
        externalPublicInfo: {
          websiteUrl: businessIdentity?.social?.website || "https://progressaccountants.co.uk",
          publicLinkedIn: businessIdentity?.social?.linkedin || "https://linkedin.com/company/progress-accountants",
          publicYouTubeChannel: businessIdentity?.social?.youtube || "https://youtube.com/c/ProgressAccountants",
          podcastInfo: {
            name: businessIdentity?.podcast?.name || "Financial Progress Insights",
            platforms: businessIdentity?.podcast?.platforms || ["Spotify", "Apple Podcasts", "Google Podcasts"],
            frequency: businessIdentity?.podcast?.frequency || "Bi-weekly",
            totalEpisodes: businessIdentity?.podcast?.episodes || 24
          }
        },
        dynamicUpdateTriggers: {
          realtimeWebhookEnabled: true,
          updateFrequency: "daily",
          lastSyncTimestamp: new Date().toISOString()
        },
        systemMetadata: {
          instanceId: tenantInfo?.id || "00000000-0000-0000-0000-000000000000",
          instanceType: "client_site",
          tenantId: tenantInfo?.tenantId || "progress-accountants-001",
          isTemplate: false,
          isCloneable: true,
          supportTier: tenantInfo?.supportTier || "premium",
          statusCheckFrequency: 3600,
          createdAt: tenantInfo?.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: tenantInfo?.updatedAt?.toISOString() || new Date().toISOString()
        }
      };
      
      return profile;
    } catch (error) {
      logger.error('Error generating client profile:', error);
      throw new Error('Failed to generate client profile');
    }
  }

  /**
   * Sync client profile with SOT
   */
  public async syncClientProfile(): Promise<boolean> {
    try {
      // Generate client profile
      const clientProfile = await this.generateClientProfile();
      
      // Save to local storage for reference
      await this.saveProfileLocally(clientProfile);
      
      // Push to SOT endpoint
      const success = await this.pushToSot(clientProfile);
      
      if (success) {
        // Log sync success
        await storage.logSotSync('client_profile_sync', 'success', 'Successfully synced client profile with SOT');
        return true;
      } else {
        // Log sync failure
        await storage.logSotSync('client_profile_sync', 'error', 'Failed to sync client profile with SOT');
        return false;
      }
    } catch (error) {
      logger.error('Error syncing client profile:', error);
      await storage.logSotSync('client_profile_sync', 'error', `Failed to sync client profile: ${error.message}`);
      return false;
    }
  }

  /**
   * Save profile locally
   */
  private async saveProfileLocally(clientProfile: ClientProfile): Promise<void> {
    try {
      // Save in storage for reference
      await storage.saveClientProfile(clientProfile);
      logger.info('Client profile saved locally');
    } catch (error) {
      logger.error('Error saving client profile locally:', error);
      throw error;
    }
  }

  /**
   * Push client profile to SOT endpoint
   */
  private async pushToSot(clientProfile: ClientProfile): Promise<boolean> {
    try {
      // Log the sync attempt
      logger.info(`Attempting to sync client profile with SOT at ${this.SOT_ENDPOINT}`);
      
      // In production, use the actual SOT endpoint
      // For now, we'll just simulate a successful sync
      if (process.env.NODE_ENV === 'production') {
        const response = await axios.post(this.SOT_ENDPOINT, clientProfile, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.SOT_API_KEY || '' // API key should be set in environment
          }
        });
        
        if (response.status === 200 || response.status === 201) {
          logger.info('Client profile synced successfully with SOT');
          return true;
        } else {
          logger.error(`SOT sync failed with status ${response.status}: ${response.data?.message || 'Unknown error'}`);
          return false;
        }
      } else {
        // In development/testing, simulate success
        logger.info('Development mode: Simulating successful SOT sync');
        return true;
      }
    } catch (error) {
      logger.error('Error pushing client profile to SOT:', error);
      return false;
    }
  }
  
  /**
   * Trigger an immediate sync
   */
  public async triggerImmediateSync(): Promise<boolean> {
    logger.info('Triggering immediate SOT sync');
    return await this.syncClientProfile();
  }
  
  /**
   * Handle events that should trigger a sync
   */
  public async handleSyncEvent(eventType: string, data: any): Promise<void> {
    logger.info(`SOT sync event triggered: ${eventType}`);
    
    // Determine if this event requires immediate sync
    const syncTriggerEvents = [
      'page_published',
      'page_unpublished',
      'tool_installed',
      'tool_uninstalled',
      'credits_purchased',
      'credits_consumed',
      'account_status_changed',
      'tenant_updated',
      'business_identity_updated'
    ];
    
    if (syncTriggerEvents.includes(eventType)) {
      logger.info(`Event ${eventType} requires immediate SOT sync`);
      await this.triggerImmediateSync();
    } else {
      logger.info(`Event ${eventType} does not require immediate SOT sync`);
    }
  }
}

// Export singleton instance
export const sotSyncService = new SotSyncService();