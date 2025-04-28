import Parser from 'rss-parser';
import { Request, Response } from 'express';
import { storage } from '../storage';
import { IndustryCategory, NewsfeedConfig, NewsItem, PREDEFINED_FEEDS } from '@shared/newsfeed_types';

// Set up RSS parser with timeout and character limits to prevent memory issues
const parser = new Parser({
  timeout: 5000, // 5 second timeout
  customFields: {
    item: [
      ['media:content', 'media'],
    ]
  }
});

/**
 * Fetch news from an RSS feed
 */
export async function fetchNewsFromRss(url: string, limit: number = 5): Promise<NewsItem[]> {
  try {
    console.log(`Fetching RSS feed from: ${url} with limit: ${limit}`);
    
    // Safety check on limit to prevent memory issues
    const safeLimit = Math.min(limit, 10);
    
    const feed = await parser.parseURL(url);
    
    // Add extra safety to ensure we only process a limited number of items
    const safeItems = feed.items?.slice(0, safeLimit) || [];
    
    return safeItems.map((item, index) => {
      // Truncate excerpt to prevent memory issues with large content
      const excerpt = item.contentSnippet || item.content || '';
      const safeExcerpt = excerpt.length > 300 ? excerpt.substring(0, 300) + '...' : excerpt;
      
      return {
        id: item.guid || `${index}-${Date.now()}`,
        title: (item.title || 'Untitled').substring(0, 200), // Limit title length
        excerpt: safeExcerpt,
        link: item.link || '',
        category: item.categories?.length ? item.categories[0] : undefined,
        publishDate: item.pubDate,
        source: feed.title?.substring(0, 100) || 'Unknown' // Limit source length
      };
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}

/**
 * Get industry-specific news based on tenant configuration
 */
export async function getIndustryNews(req: Request, res: Response) {
  try {
    const tenantId = req.session.currentTenantId || req.user?.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'No tenant ID specified' });
    }
    
    // Get tenant details to determine industry
    const tenant = await storage.getTenant(tenantId);
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    // Check if tenant has custom newsfeed configuration
    let feedConfig: NewsfeedConfig;
    
    if (tenant.newsfeedConfig) {
      // Parse the newsfeedConfig if it's a string (for backward compatibility)
      if (typeof tenant.newsfeedConfig === 'string') {
        try {
          feedConfig = JSON.parse(tenant.newsfeedConfig) as NewsfeedConfig;
        } catch (e) {
          // If parsing fails, use predefined feed
          feedConfig = getPredefinedFeedForIndustry(tenant.industry as IndustryCategory);
        }
      } else {
        feedConfig = tenant.newsfeedConfig as NewsfeedConfig;
      }
    } else {
      // Use predefined feed based on industry
      feedConfig = getPredefinedFeedForIndustry(tenant.industry as IndustryCategory);
    }
    
    // Ensure we have the displaySettings object to prevent undefined access
    if (!feedConfig.displaySettings) {
      feedConfig.displaySettings = {
        showImages: true,
        itemCount: 5,
        refreshInterval: 60,
        showCategories: true,
        showPublishDate: true
      };
    }
    
    // Fetch news items
    const newsItems = await fetchNewsFromRss(
      feedConfig.url, 
      feedConfig.displaySettings.itemCount
    );
    
    res.status(200).json({
      items: newsItems,
      config: feedConfig
    });
    
  } catch (error) {
    console.error('Error fetching industry news:', error);
    res.status(500).json({ 
      error: 'Failed to fetch industry news',
      items: [], // Return empty items array to prevent client errors
      config: PREDEFINED_FEEDS[IndustryCategory.ACCOUNTING] // Return default config
    });
  }
}

/**
 * Get a predefined feed configuration for a given industry
 */
function getPredefinedFeedForIndustry(industry?: IndustryCategory): NewsfeedConfig {
  if (!industry || !PREDEFINED_FEEDS[industry]) {
    return PREDEFINED_FEEDS[IndustryCategory.ACCOUNTING];
  }
  return PREDEFINED_FEEDS[industry];
}

/**
 * Update newsfeed configuration for a tenant
 */
export async function updateNewsfeedConfig(req: Request, res: Response) {
  try {
    const tenantId = req.session.currentTenantId || req.user?.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'No tenant ID specified' });
    }
    
    const config = req.body as NewsfeedConfig;
    
    if (!config || !config.url) {
      return res.status(400).json({ error: 'Invalid configuration' });
    }
    
    // Get tenant
    const tenant = await storage.getTenant(tenantId);
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    // Update tenant with new newsfeed configuration
    const updatedTenant = {
      ...tenant,
      newsfeedConfig: config
    };
    
    await storage.updateTenant(tenantId, updatedTenant);
    
    res.status(200).json({ success: true, config });
    
  } catch (error) {
    console.error('Error updating newsfeed configuration:', error);
    res.status(500).json({ error: 'Failed to update newsfeed configuration' });
  }
}