import { db } from "../db";
import { eq, and, gte, sql } from "drizzle-orm";
import { innovationFeedItems, aiEventLogs, users } from "../../shared/schema";
import { AIEventLogger } from "./ai-event-logger";

export class InnovationAnalyticsService {
  
  static async getInnovationAnalytics(tenantId: string, userId?: number) {
    try {
      // Log the analytics view
      if (userId) {
        await AIEventLogger.logEvent({
          eventType: 'innovation-analytics-viewed',
          userId,
          tenantId,
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
      }

      // Get current month start date
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get insights submitted this month (from AI event logs)
      const insightsThisMonth = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiEventLogs)
        .where(
          and(
            eq(aiEventLogs.tenantId, tenantId),
            eq(aiEventLogs.eventType, 'insight-submitted'),
            gte(aiEventLogs.createdAt, monthStart)
          )
        );

      // Get themes created this month (from AI event logs)
      const themesThisMonth = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiEventLogs)
        .where(
          and(
            eq(aiEventLogs.tenantId, tenantId),
            eq(aiEventLogs.eventType, 'theme-created'),
            gte(aiEventLogs.createdAt, monthStart)
          )
        );

      // Get product ideas generated this month (from AI event logs)
      const productIdeasThisMonth = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiEventLogs)
        .where(
          and(
            eq(aiEventLogs.tenantId, tenantId),
            eq(aiEventLogs.eventType, 'theme-to-product-ideas'),
            gte(aiEventLogs.createdAt, monthStart)
          )
        );

      // Get product ideas actioned percentage (from innovation feed)
      const totalProductIdeas = await db
        .select({ count: sql<number>`count(*)` })
        .from(innovationFeedItems)
        .where(
          and(
            eq(innovationFeedItems.tenantId, tenantId),
            eq(innovationFeedItems.taskType, 'theme-to-product-ideas')
          )
        );

      const actionedProductIdeas = await db
        .select({ count: sql<number>`count(*)` })
        .from(innovationFeedItems)
        .where(
          and(
            eq(innovationFeedItems.tenantId, tenantId),
            eq(innovationFeedItems.taskType, 'theme-to-product-ideas'),
            eq(innovationFeedItems.actionStatus, 'implemented')
          )
        );

      // Get top contributors this month
      const topContributorsQuery = await db
        .select({
          userId: aiEventLogs.userId,
          userName: sql<string>`COALESCE(${users.name}, 'Unknown User')`,
          insightsSubmitted: sql<number>`count(*)`
        })
        .from(aiEventLogs)
        .leftJoin(users, eq(aiEventLogs.userId, users.id))
        .where(
          and(
            eq(aiEventLogs.tenantId, tenantId),
            eq(aiEventLogs.eventType, 'insight-submitted'),
            gte(aiEventLogs.createdAt, monthStart)
          )
        )
        .groupBy(aiEventLogs.userId, users.name)
        .orderBy(sql`count(*) DESC`)
        .limit(5);

      // Calculate percentages
      const totalIdeas = totalProductIdeas[0]?.count || 0;
      const actionedIdeas = actionedProductIdeas[0]?.count || 0;
      const productIdeasActionedPercentage = totalIdeas > 0 ? Math.round((actionedIdeas / totalIdeas) * 100) : 0;

      return {
        insightsSubmittedThisMonth: insightsThisMonth[0]?.count || 0,
        themesCreatedThisMonth: themesThisMonth[0]?.count || 0,
        productIdeasGeneratedThisMonth: productIdeasThisMonth[0]?.count || 0,
        productIdeasActionedPercentage,
        topContributors: topContributorsQuery.map(contributor => ({
          userId: contributor.userId?.toString() || '',
          userName: contributor.userName || 'Unknown User',
          insightsSubmitted: contributor.insightsSubmitted || 0
        }))
      };

    } catch (error) {
      console.error('❌ Failed to get innovation analytics:', error);
      return {
        insightsSubmittedThisMonth: 0,
        themesCreatedThisMonth: 0,
        productIdeasGeneratedThisMonth: 0,
        productIdeasActionedPercentage: 0,
        topContributors: []
      };
    }
  }
}