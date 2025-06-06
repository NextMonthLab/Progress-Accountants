import { db } from '../db';
import { innovationFeedItems, type InsertInnovationFeedItem, type InnovationFeedItem } from '@shared/schema';
import { desc, eq, and } from 'drizzle-orm';

export class InnovationFeedService {
  // Save a new innovation feed item when ideas are generated
  static async saveIdeasToFeed(data: InsertInnovationFeedItem): Promise<InnovationFeedItem> {
    try {
      const [feedItem] = await db.insert(innovationFeedItems)
        .values(data)
        .returning();
      
      console.log('✅ Innovation Feed item saved:', feedItem.id);
      return feedItem;
    } catch (error) {
      console.error('❌ Failed to save to Innovation Feed:', error);
      throw error;
    }
  }

  // Get innovation feed items with pagination
  static async getFeedItems(
    tenantId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ items: InnovationFeedItem[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get items with pagination
      const items = await db.select()
        .from(innovationFeedItems)
        .where(eq(innovationFeedItems.tenantId, tenantId))
        .orderBy(desc(innovationFeedItems.timestamp))
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const totalResult = await db.select({ count: innovationFeedItems.id })
        .from(innovationFeedItems)
        .where(eq(innovationFeedItems.tenantId, tenantId));
      
      const total = totalResult.length;
      
      return { items, total };
    } catch (error) {
      console.error('❌ Failed to get innovation feed:', error);
      throw error;
    }
  }

  // Get a specific feed item by ID
  static async getFeedItem(id: string, tenantId: string): Promise<InnovationFeedItem | null> {
    try {
      const [item] = await db.select()
        .from(innovationFeedItems)
        .where(and(
          eq(innovationFeedItems.id, id),
          eq(innovationFeedItems.tenantId, tenantId)
        ));
      
      return item || null;
    } catch (error) {
      console.error('❌ Failed to get innovation feed item:', error);
      throw error;
    }
  }

  // Get recent feed items for dashboard preview
  static async getRecentItems(tenantId: string, limit: number = 5): Promise<InnovationFeedItem[]> {
    try {
      const items = await db.select()
        .from(innovationFeedItems)
        .where(eq(innovationFeedItems.tenantId, tenantId))
        .orderBy(desc(innovationFeedItems.timestamp))
        .limit(limit);
      
      return items;
    } catch (error) {
      console.error('❌ Failed to get recent innovation items:', error);
      return [];
    }
  }

  // Get feed statistics for analytics
  static async getFeedStats(tenantId: string): Promise<any> {
    try {
      const totalItems = await db.select({ count: innovationFeedItems.id })
        .from(innovationFeedItems)
        .where(eq(innovationFeedItems.tenantId, tenantId));

      const recentItems = await db.select()
        .from(innovationFeedItems)
        .where(eq(innovationFeedItems.tenantId, tenantId))
        .orderBy(desc(innovationFeedItems.timestamp))
        .limit(10);

      // Model usage breakdown
      const modelUsage = recentItems.reduce((acc, item) => {
        acc[item.modelUsed] = (acc[item.modelUsed] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Scope breakdown
      const scopeUsage = recentItems.reduce((acc, item) => {
        acc[item.selectedScope] = (acc[item.selectedScope] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalItems: totalItems.length,
        recentItems: recentItems.length,
        modelUsage,
        scopeUsage,
        lastGenerated: recentItems[0]?.timestamp || null
      };
    } catch (error) {
      console.error('❌ Failed to get innovation feed stats:', error);
      return {
        totalItems: 0,
        recentItems: 0,
        modelUsage: {},
        scopeUsage: {},
        lastGenerated: null
      };
    }
  }
}