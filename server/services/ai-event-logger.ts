import { db } from '../db';
import { aiEventLogs, InsertAiEventLog } from '@shared/schema';
import { eq, desc, gte, lte, and } from 'drizzle-orm';

export class AIEventLogger {
  static async logEvent(eventData: InsertAiEventLog): Promise<void> {
    try {
      await db.insert(aiEventLogs).values(eventData);
    } catch (error) {
      console.error('Failed to log AI event:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  // Log AI Gateway calls
  static async logAiCall(data: {
    tenantId: string;
    userId?: number;
    taskType: string;
    modelUsed: string;
    tokensUsed?: number;
    detail?: any;
  }): Promise<void> {
    await this.logEvent({
      tenantId: data.tenantId,
      userId: data.userId,
      eventType: 'ai-call',
      taskType: data.taskType,
      modelUsed: data.modelUsed,
      tokensUsed: data.tokensUsed,
      detail: data.detail
    });
  }

  // Log usage limit exceeded events
  static async logLimitExceeded(data: {
    tenantId: string;
    userId?: number;
    taskType: string;
    detail?: any;
  }): Promise<void> {
    await this.logEvent({
      tenantId: data.tenantId,
      userId: data.userId,
      eventType: 'limit-exceeded',
      taskType: data.taskType,
      detail: data.detail
    });
  }

  // Log Pro AI upgrade/downgrade events
  static async logProAiChange(data: {
    tenantId: string;
    userId?: number;
    eventType: 'pro-ai-upgrade' | 'pro-ai-downgrade';
    detail?: any;
  }): Promise<void> {
    await this.logEvent({
      tenantId: data.tenantId,
      userId: data.userId,
      eventType: data.eventType,
      detail: data.detail
    });
  }

  // Log theme-to-product-ideas specific events
  static async logProductIdeasGeneration(data: {
    tenantId: string;
    userId?: number;
    selectedScope?: string;
    themeSummary?: string;
    modelUsed: string;
    tokensUsed?: number;
  }): Promise<void> {
    await this.logEvent({
      tenantId: data.tenantId,
      userId: data.userId,
      eventType: 'theme-to-product-ideas',
      taskType: 'theme-to-product-ideas',
      modelUsed: data.modelUsed,
      tokensUsed: data.tokensUsed,
      detail: {
        selectedScope: data.selectedScope,
        themeSummary: data.themeSummary
      }
    });
  }

  // Get event logs for admin/Mission Control (paginated)
  static async getEvents(filters: any = {}, limit: number = 100, offset: number = 0): Promise<any[]> {
    try {
      let query = db.select().from(aiEventLogs);
      
      if (filters.tenantId) {
        query = query.where(eq(aiEventLogs.tenantId, filters.tenantId));
      }
      
      if (filters.eventType) {
        query = query.where(eq(aiEventLogs.eventType, filters.eventType));
      }
      
      if (filters.modelUsed) {
        query = query.where(eq(aiEventLogs.modelUsed, filters.modelUsed));
      }
      
      if (filters.startDate) {
        query = query.where(gte(aiEventLogs.timestamp, filters.startDate));
      }
      
      if (filters.endDate) {
        query = query.where(lte(aiEventLogs.timestamp, filters.endDate));
      }
      
      const results = await query
        .orderBy(desc(aiEventLogs.timestamp))
        .limit(limit)
        .offset(offset);
        
      return results;
    } catch (error) {
      console.error('Failed to get event logs:', error);
      return [];
    }
  }

  static async getAnalytics(tenantId?: string, period: string = '30d'): Promise<any> {
    try {
      const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);

      let query = db.select().from(aiEventLogs);
      
      if (tenantId) {
        query = query.where(and(
          eq(aiEventLogs.tenantId, tenantId),
          gte(aiEventLogs.timestamp, startDate)
        ));
      } else {
        query = query.where(gte(aiEventLogs.timestamp, startDate));
      }

      const events = await query;

      // Aggregate analytics
      const totalCalls = events.length;
      const modelBreakdown = events.reduce((acc, event) => {
        acc[event.modelUsed] = (acc[event.modelUsed] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const eventTypeBreakdown = events.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalTokens = events.reduce((sum, event) => {
        return sum + (event.tokensUsed || 0);
      }, 0);

      const averageTokensPerCall = totalCalls > 0 ? Math.round(totalTokens / totalCalls) : 0;

      return {
        totalCalls,
        totalTokens,
        averageTokensPerCall,
        modelBreakdown,
        eventTypeBreakdown,
        period,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  static async getMissionControlSummary(timeframe: string = '24h'): Promise<any> {
    try {
      const hours = timeframe === '1h' ? 1 : timeframe === '24h' ? 24 : 168; // 168h = 7d
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - hours);

      const events = await db.select().from(aiEventLogs)
        .where(gte(aiEventLogs.timestamp, startTime))
        .orderBy(desc(aiEventLogs.timestamp));

      const errorEvents = events.filter(e => e.eventType === 'ai_error');
      const limitEvents = events.filter(e => e.eventType === 'limit_exceeded');
      const proAiEvents = events.filter(e => e.eventType === 'pro_ai_change');

      return {
        timeframe,
        totalEvents: events.length,
        errors: {
          count: errorEvents.length,
          recentErrors: errorEvents.slice(0, 5).map(e => ({
            timestamp: e.timestamp,
            model: e.modelUsed,
            details: e.detail
          }))
        },
        limits: {
          exceeded: limitEvents.length,
          recentLimits: limitEvents.slice(0, 3).map(e => ({
            timestamp: e.timestamp,
            tenantId: e.tenantId,
            details: e.detail
          }))
        },
        proAiChanges: proAiEvents.length,
        modelUsage: events.reduce((acc, event) => {
          acc[event.modelUsed] = (acc[event.modelUsed] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      console.error('Failed to get mission control summary:', error);
      throw error;
    }
  }
}