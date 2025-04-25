import { db } from '../db';
import { userInsights, insightUsers, insightSummaries } from '@shared/insight_dashboard';
import { Request, Response } from 'express';
import { eq, and, gte, lte, desc, count, sql } from 'drizzle-orm';
import { subDays } from 'date-fns';

export async function getLeaderboard(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const tenantId = req.user.tenantId;
    const period = req.query.period as string || 'week';
    
    let startDate: Date;
    const now = new Date();
    
    switch (period) {
      case 'day':
        startDate = subDays(now, 1);
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subDays(now, 30);
        break;
      default:
        startDate = subDays(now, 7); // Default to week
    }
    
    // Query for leaderboard data
    const leaderboard = await db
      .select({
        userId: userInsights.userId,
        displayName: insightUsers.displayName,
        role: insightUsers.role,
        count: count(userInsights.id),
      })
      .from(userInsights)
      .innerJoin(insightUsers, eq(userInsights.userId, insightUsers.id))
      .where(and(
        eq(userInsights.tenantId, tenantId),
        gte(userInsights.createdAt, startDate),
        eq(insightUsers.isActive, true)
      ))
      .groupBy(userInsights.userId, insightUsers.displayName, insightUsers.role)
      .orderBy(desc(count(userInsights.id)))
      .limit(10);
    
    return res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

export async function getInsightSummaries(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const tenantId = req.user.tenantId;
    const summaryType = req.query.type as string || 'weekly';
    
    const summaries = await db
      .select()
      .from(insightSummaries)
      .where(and(
        eq(insightSummaries.tenantId, tenantId),
        eq(insightSummaries.summaryType, summaryType)
      ))
      .orderBy(desc(insightSummaries.endDate))
      .limit(4); // Last 4 summaries
    
    return res.json(summaries);
  } catch (error) {
    console.error('Error fetching insight summaries:', error);
    return res.status(500).json({ error: 'Failed to fetch summaries' });
  }
}

export async function getUserActivity(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const tenantId = req.user.tenantId;
    const days = 30; // Activity for last 30 days
    const startDate = subDays(new Date(), days);
    
    // Get daily activity counts
    const dailyActivity = await db
      .select({
        date: sql<string>`DATE_TRUNC('day', "created_at")`,
        count: count(userInsights.id),
      })
      .from(userInsights)
      .where(and(
        eq(userInsights.tenantId, tenantId),
        gte(userInsights.createdAt, startDate)
      ))
      .groupBy(sql`DATE_TRUNC('day', "created_at")`)
      .orderBy(sql`DATE_TRUNC('day', "created_at")`);
    
    return res.json(dailyActivity);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return res.status(500).json({ error: 'Failed to fetch user activity' });
  }
}