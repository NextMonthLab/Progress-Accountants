import type { Express, Request, Response } from "express";
import { AIEventLogger } from '../services/ai-event-logger';

export function registerAiEventRoutes(app: Express) {
  // Get AI event logs with filtering and pagination
  app.get('/api/ai-events', async (req: Request, res: Response) => {
    try {
      const { 
        tenantId, 
        eventType, 
        modelUsed,
        startDate, 
        endDate, 
        limit = 100, 
        offset = 0 
      } = req.query;

      const filters: any = {};
      
      if (tenantId) filters.tenantId = tenantId as string;
      if (eventType) filters.eventType = eventType as string;
      if (modelUsed) filters.modelUsed = modelUsed as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const events = await AIEventLogger.getEvents(
        filters,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json(events);
    } catch (error) {
      console.error('Error fetching AI events:', error);
      res.status(500).json({ error: 'Failed to fetch AI events' });
    }
  });

  // Get AI usage analytics
  app.get('/api/ai-events/analytics', async (req: Request, res: Response) => {
    try {
      const { tenantId, period = '30d' } = req.query;
      
      const analytics = await AIEventLogger.getAnalytics(
        tenantId as string | undefined,
        period as string
      );

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching AI analytics:', error);
      res.status(500).json({ error: 'Failed to fetch AI analytics' });
    }
  });

  // Get Mission Control summary
  app.get('/api/ai-events/mission-control', async (req: Request, res: Response) => {
    try {
      const { timeframe = '24h' } = req.query;
      
      const summary = await AIEventLogger.getMissionControlSummary(timeframe as string);

      res.json(summary);
    } catch (error) {
      console.error('Error fetching Mission Control summary:', error);
      res.status(500).json({ error: 'Failed to fetch Mission Control summary' });
    }
  });

  console.log('✅ AI Event Logger routes registered');
}