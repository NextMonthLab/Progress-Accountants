import Parser from 'rss-parser';
import { Request, Response } from 'express';
import { storage } from '../storage';
import { IndustryCategory, NewsfeedConfig, NewsItem, PREDEFINED_FEEDS } from '@shared/newsfeed_types';

const parser = new Parser();

/**
 * Fetch news from an RSS feed
 */
export async function fetchNewsFromRss(url: string, limit: number = 5): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    
    return feed.items.slice(0, limit).map((item, index) => ({
      id: item.guid || `${index}-${Date.now()}`,
      title: item.title || 'Untitled',
      excerpt: item.contentSnippet || item.content || '',
      link: item.link || '',
      category: item.categories?.length ? item.categories[0] : undefined,
      publishDate: item.pubDate,
      source: feed.title
    }));
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
      feedConfig = tenant.newsfeedConfig as NewsfeedConfig;
    } else {
      // Use predefined feed based on industry if available
      const industry = tenant.industry as IndustryCategory;
      
      if (industry && PREDEFINED_FEEDS[industry]) {
        feedConfig = PREDEFINED_FEEDS[industry];
      } else {
        // Default to accounting if no industry specified
        feedConfig = PREDEFINED_FEEDS[IndustryCategory.ACCOUNTING];
      }
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
    res.status(500).json({ error: 'Failed to fetch industry news' });
  }
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