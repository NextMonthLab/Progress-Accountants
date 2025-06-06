import { db } from '../db';
import { innovationFeedItems, type InsertInnovationFeedItem, type InnovationFeedItem } from '@shared/schema';
import { desc, eq, and } from 'drizzle-orm';
import { AIEventLogger } from './ai-event-logger';

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

  // Update action status for an innovation feed item
  static async updateActionStatus(
    id: string, 
    tenantId: string, 
    actionStatus: 'none' | 'implemented' | 'archived' | 'wishlist',
    actionNotes?: string,
    userId?: number
  ): Promise<InnovationFeedItem | null> {
    try {
      // First verify the item exists and belongs to the tenant
      const existingItem = await this.getFeedItem(id, tenantId);
      if (!existingItem) {
        throw new Error('Innovation feed item not found');
      }

      // Update the action status
      const [updatedItem] = await db
        .update(innovationFeedItems)
        .set({
          actionStatus,
          actionNotes,
          actionUpdatedByUserId: userId,
          actionUpdatedAt: new Date(),
        })
        .where(and(
          eq(innovationFeedItems.id, id),
          eq(innovationFeedItems.tenantId, tenantId)
        ))
        .returning();

      // Log the action to AI Event Log for analytics
      await AIEventLogger.logEvent({
        eventType: 'innovation-idea-action',
        status: 'success',
        tenantId,
        userId,
        details: JSON.stringify({
          ideaId: id,
          newStatus: actionStatus,
          notes: actionNotes || null,
          previousStatus: existingItem.actionStatus
        })
      });

      console.log(`✅ Innovation idea action updated: ${id} -> ${actionStatus}`);
      return updatedItem;
    } catch (error) {
      console.error('❌ Failed to update innovation action status:', error);
      
      // Log failure to AI Event Log
      await AIEventLogger.logEvent({
        eventType: 'innovation-idea-action',
        status: 'error',
        tenantId,
        userId,
        details: JSON.stringify({
          ideaId: id,
          targetStatus: actionStatus,
          error: error.message
        })
      });

      throw error;
    }
  }

  // Get innovation feed items by action status for filtering
  static async getFeedItemsByStatus(
    tenantId: string,
    actionStatus: 'none' | 'implemented' | 'archived' | 'wishlist',
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: InnovationFeedItem[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get items filtered by action status
      const items = await db.select()
        .from(innovationFeedItems)
        .where(and(
          eq(innovationFeedItems.tenantId, tenantId),
          eq(innovationFeedItems.actionStatus, actionStatus)
        ))
        .orderBy(desc(innovationFeedItems.timestamp))
        .limit(limit)
        .offset(offset);
      
      // Get total count for pagination
      const totalResult = await db.select({ count: innovationFeedItems.id })
        .from(innovationFeedItems)
        .where(and(
          eq(innovationFeedItems.tenantId, tenantId),
          eq(innovationFeedItems.actionStatus, actionStatus)
        ));
      
      const total = totalResult.length;
      
      return { items, total };
    } catch (error) {
      console.error('❌ Failed to get innovation feed by status:', error);
      throw error;
    }
  }

  // Get action analytics for innovation loop tracking
  static async getActionAnalytics(tenantId: string): Promise<any> {
    try {
      const allItems = await db.select()
        .from(innovationFeedItems)
        .where(eq(innovationFeedItems.tenantId, tenantId));

      const statusBreakdown = allItems.reduce((acc, item) => {
        acc[item.actionStatus] = (acc[item.actionStatus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalIdeas = allItems.length;
      const actionedIdeas = allItems.filter(item => item.actionStatus !== 'none').length;
      const implementedIdeas = statusBreakdown.implemented || 0;
      
      const actionRate = totalIdeas > 0 ? (actionedIdeas / totalIdeas) * 100 : 0;
      const implementationRate = totalIdeas > 0 ? (implementedIdeas / totalIdeas) * 100 : 0;

      return {
        totalIdeas,
        actionedIdeas,
        implementedIdeas,
        actionRate: Math.round(actionRate * 10) / 10,
        implementationRate: Math.round(implementationRate * 10) / 10,
        statusBreakdown,
        recentActions: allItems
          .filter(item => item.actionUpdatedAt)
          .sort((a, b) => new Date(b.actionUpdatedAt!).getTime() - new Date(a.actionUpdatedAt!).getTime())
          .slice(0, 5)
      };
    } catch (error) {
      console.error('❌ Failed to get action analytics:', error);
      return {
        totalIdeas: 0,
        actionedIdeas: 0,
        implementedIdeas: 0,
        actionRate: 0,
        implementationRate: 0,
        statusBreakdown: {},
        recentActions: []
      };
    }
  }
}