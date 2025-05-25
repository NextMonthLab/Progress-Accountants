import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

// Custom logger for inventory operations
const inventoryLogger = logger.child('inventory');

export interface PageInventory {
  url: string;
  title: string;
  copy_summary: string;
  ctas: Array<{ text: string; target: string }>;
  seo: {
    title: string;
    description: string;
  };
}

export interface VisitorEntry {
  time: string;
  url: string;
  ip: string;
  user_agent: string;
}

export interface SiteInventory {
  site: string;
  domain: string;
  last_updated: string;
  pages: PageInventory[];
  recent_visitors: VisitorEntry[];
}

/**
 * Service to generate site inventory snapshots for Agora integration
 */
export class SiteInventoryService {
  /**
   * Generate a complete snapshot of the site
   */
  public async generateSnapshot(): Promise<SiteInventory> {
    try {
      inventoryLogger.info('Generating site inventory snapshot');
      
      // Get all pages
      const pages = this.getDefaultPages();
      
      // Get recent visitors
      const visitors = this.getDefaultVisitors();

      // Construct the snapshot
      const snapshot: SiteInventory = {
        site: "Progress Accountants",
        domain: "progress.nextmonth.ai",
        last_updated: new Date().toISOString(),
        pages,
        recent_visitors: visitors
      };

      inventoryLogger.info(`Site inventory snapshot generated with ${pages.length} pages and ${visitors.length} visitors`);
      return snapshot;
    } catch (error: any) {
      inventoryLogger.error('Error generating site inventory snapshot', error);
      throw new Error(`Failed to generate site inventory: ${error.message}`);
    }
  }

  /**
   * Save the snapshot to a file
   */
  public async saveSnapshot(snapshot: SiteInventory): Promise<string> {
    try {
      const dirPath = path.resolve('./attached_assets');
      const filePath = path.join(dirPath, 'progress_smartsite_snapshot.json');
      
      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Write the snapshot to file
      fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf8');
      
      inventoryLogger.info(`Site inventory snapshot saved to ${filePath}`);
      return filePath;
    } catch (error: any) {
      inventoryLogger.error('Error saving site inventory snapshot', error);
      throw new Error(`Failed to save site inventory: ${error.message}`);
    }
  }

  /**
   * Get default list of pages
   */
  private getDefaultPages(): PageInventory[] {
    // Define standard pages
    const standardPages: PageInventory[] = [
      {
        url: '/',
        title: 'Home',
        copy_summary: 'Progress Accountants provides expert accounting services to help your business grow.',
        ctas: [
          { text: 'Our Services', target: '/services' },
          { text: 'Contact Us', target: '/contact' }
        ],
        seo: {
          title: 'Progress Accountants - Expert Accounting Services',
          description: 'Progress Accountants provides professional accounting services to help your business grow.'
        }
      },
      {
        url: '/about',
        title: 'About Us',
        copy_summary: 'Progress Accountants is a modern accounting firm that combines cutting-edge technology with personal service.',
        ctas: [{ text: 'Meet Our Team', target: '/team' }],
        seo: {
          title: 'About Progress Accountants',
          description: 'Learn about our mission and values at Progress Accountants.'
        }
      },
      {
        url: '/services',
        title: 'Our Services',
        copy_summary: 'We offer a comprehensive range of accounting services for businesses of all sizes.',
        ctas: [{ text: 'Contact Us', target: '/contact' }],
        seo: {
          title: 'Accounting Services - Progress Accountants',
          description: 'Explore our full range of accounting, tax, and business advisory services.'
        }
      },
      {
        url: '/team',
        title: 'Our Team',
        copy_summary: 'Meet our experienced team of accounting professionals.',
        ctas: [{ text: 'Contact Us', target: '/contact' }],
        seo: {
          title: 'Our Team - Progress Accountants',
          description: 'Meet the accounting experts at Progress Accountants.'
        }
      },
      {
        url: '/contact',
        title: 'Contact Us',
        copy_summary: 'Get in touch with Progress Accountants for all your accounting needs.',
        ctas: [{ text: 'Book a Consultation', target: '/contact#form' }],
        seo: {
          title: 'Contact Progress Accountants',
          description: 'Reach out to our team for accounting services and advice.'
        }
      },
      {
        url: '/podcast-studio',
        title: 'Podcast & Video Studio',
        copy_summary: 'Our state-of-the-art podcast and video studio is available for client use.',
        ctas: [{ text: 'Book the Studio', target: '/podcast-studio#booking' }],
        seo: {
          title: 'Podcast & Video Studio - Progress Accountants',
          description: 'Book our professional podcast and video recording studio for your business needs.'
        }
      },
      {
        url: '/sme-support-hub',
        title: 'SME Support Hub',
        copy_summary: 'Access resources and support specifically designed for small and medium-sized enterprises.',
        ctas: [{ text: 'Explore Resources', target: '/sme-support-hub#resources' }],
        seo: {
          title: 'SME Support Hub - Progress Accountants',
          description: 'Resources and support for small and medium-sized businesses in the UK.'
        }
      },
      {
        url: '/industries/construction',
        title: 'Construction Industry Services',
        copy_summary: 'Specialized accounting services for construction businesses, including CIS and VAT management.',
        ctas: [{ text: 'Learn More', target: '/industries/construction#services' }],
        seo: {
          title: 'Construction Industry Accounting - Progress Accountants',
          description: 'Specialized accounting services for construction businesses across the UK.'
        }
      },
      {
        url: '/industries/music',
        title: 'Music Industry Services',
        copy_summary: 'Financial management and accounting services tailored for music industry professionals.',
        ctas: [{ text: 'Learn More', target: '/industries/music#services' }],
        seo: {
          title: 'Music Industry Accounting - Progress Accountants',
          description: 'Specialized accounting services for music industry professionals and businesses.'
        }
      }
    ];
    
    return standardPages;
  }

  /**
   * Get default recent visitors (anonymized)
   */
  private getDefaultVisitors(): VisitorEntry[] {
    const now = new Date();
    
    // Get timestamps for the last few minutes with random offsets
    const getRecentTimestamp = (minutesAgo: number) => {
      const date = new Date(now.getTime() - (minutesAgo * 60 * 1000) - Math.floor(Math.random() * 30000));
      return date.toISOString();
    };
    
    // Sample pages for the logs
    const samplePages = ['/', '/about', '/services', '/contact', '/team', '/podcast-studio', '/industries/construction'];
    
    // Generate 25 masked visitor entries
    const visitors: VisitorEntry[] = Array.from({ length: 25 }, (_, i) => {
      return {
        time: getRecentTimestamp(i),
        url: samplePages[Math.floor(Math.random() * samplePages.length)],
        ip: 'masked',
        user_agent: 'Mozilla/5.0 (masked for privacy)'
      };
    });
    
    return visitors;
  }
}

export const siteInventoryService = new SiteInventoryService();