import { db } from '../db';
import { sql } from 'drizzle-orm';
import { AIEventLogger } from './ai-event-logger';

export interface PageViewData {
  tenantId: string;
  sessionId: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface CustomEventData {
  tenantId: string;
  sessionId: string;
  pageUrl: string;
  eventName: string;
  eventData?: any;
  timestamp: Date;
}

export class EmbedAnalyticsService {
  
  // Track page view from embedded script
  static async trackPageView(data: PageViewData): Promise<void> {
    try {
      // Insert page view into database
      await db.execute(sql`
        INSERT INTO page_views (tenant_id, session_id, page_url, referrer, user_agent, ip_address, timestamp)
        VALUES (${data.tenantId}, ${data.sessionId}, ${data.pageUrl}, ${data.referrer}, ${data.userAgent}, ${data.ipAddress}, ${data.timestamp})
      `);

      // Log to AI Event Logger for comprehensive analytics
      await AIEventLogger.logEvent({
        tenantId: data.tenantId,
        eventType: 'page_view',
        detail: {
          sessionId: data.sessionId,
          pageUrl: data.pageUrl,
          referrer: data.referrer,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          timestamp: data.timestamp.toISOString()
        }
      });

    } catch (error) {
      console.error('Failed to track page view:', error);
      throw error;
    }
  }

  // Track custom event from embedded script
  static async trackCustomEvent(data: CustomEventData): Promise<void> {
    try {
      // Insert custom event into database
      await db.execute(sql`
        INSERT INTO custom_events (tenant_id, session_id, page_url, event_name, event_data, timestamp)
        VALUES (${data.tenantId}, ${data.sessionId}, ${data.pageUrl}, ${data.eventName}, ${JSON.stringify(data.eventData)}, ${data.timestamp})
      `);

      // Log to AI Event Logger for comprehensive analytics
      await AIEventLogger.logEvent({
        tenantId: data.tenantId,
        eventType: 'custom_event',
        detail: {
          sessionId: data.sessionId,
          pageUrl: data.pageUrl,
          eventName: data.eventName,
          eventData: data.eventData,
          timestamp: data.timestamp.toISOString()
        }
      });

    } catch (error) {
      console.error('Failed to track custom event:', error);
      throw error;
    }
  }

  // Get analytics summary for a tenant
  static async getAnalyticsSummary(tenantId: string, startDate?: Date, endDate?: Date) {
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const end = endDate || new Date();

      // Get page view statistics
      const pageViewStats = await db.execute(sql`
        SELECT 
          COUNT(*) as total_page_views,
          COUNT(DISTINCT session_id) as unique_sessions,
          COUNT(DISTINCT page_url) as unique_pages
        FROM page_views 
        WHERE tenant_id = ${tenantId} 
        AND timestamp >= ${start} 
        AND timestamp <= ${end}
      `);

      // Get top pages
      const topPages = await db.execute(sql`
        SELECT 
          page_url,
          COUNT(*) as view_count
        FROM page_views 
        WHERE tenant_id = ${tenantId} 
        AND timestamp >= ${start} 
        AND timestamp <= ${end}
        GROUP BY page_url
        ORDER BY view_count DESC
        LIMIT 10
      `);

      // Get top referrers
      const topReferrers = await db.execute(sql`
        SELECT 
          referrer,
          COUNT(*) as referral_count
        FROM page_views 
        WHERE tenant_id = ${tenantId} 
        AND timestamp >= ${start} 
        AND timestamp <= ${end}
        AND referrer IS NOT NULL
        AND referrer != ''
        GROUP BY referrer
        ORDER BY referral_count DESC
        LIMIT 10
      `);

      // Get custom event statistics
      const eventStats = await db.execute(sql`
        SELECT 
          event_name,
          COUNT(*) as event_count
        FROM custom_events 
        WHERE tenant_id = ${tenantId} 
        AND timestamp >= ${start} 
        AND timestamp <= ${end}
        GROUP BY event_name
        ORDER BY event_count DESC
        LIMIT 10
      `);

      return {
        summary: (pageViewStats as any)[0] || { total_page_views: 0, unique_sessions: 0, unique_pages: 0 },
        topPages: topPages || [],
        topReferrers: topReferrers || [],
        topEvents: eventStats || [],
        dateRange: { start, end }
      };

    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      throw error;
    }
  }

  // Validate tenant ID exists and is active
  static async validateTenant(tenantId: string): Promise<boolean> {
    try {
      // For now, accept the default tenant ID and any valid UUID format
      if (tenantId === '00000000-0000-0000-0000-000000000000') {
        return true;
      }
      
      // Check if tenant exists in the system (when tenant table is available)
      // For development, accept any valid-looking tenant ID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(tenantId);
    } catch (error) {
      console.error('Failed to validate tenant:', error);
      return false;
    }
  }
}