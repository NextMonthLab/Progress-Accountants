import { db } from '../db';
import { aiEventLogs, InsertAiEventLog } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

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
  static async getEventLogs(options: {
    tenantId?: string;
    eventType?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    try {
      const { tenantId, eventType, limit = 50, offset = 0 } = options;
      
      let query = db.select().from(aiEventLogs);
      
      if (tenantId) {
        query = query.where(eq(aiEventLogs.tenantId, tenantId));
      }
      
      if (eventType) {
        query = query.where(eq(aiEventLogs.eventType, eventType));
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
}