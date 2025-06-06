import { Express } from "express";
import { InnovationAnalyticsService } from "../services/innovation-analytics";

export function registerInnovationAnalyticsRoutes(app: Express) {
  
  // GET /api/ai/innovation-analytics - Get innovation activity metrics
  app.get("/api/ai/innovation-analytics", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;

      const analytics = await InnovationAnalyticsService.getInnovationAnalytics(tenantId, userId);
      
      res.json(analytics);
    } catch (error) {
      console.error('Failed to get innovation analytics:', error);
      res.status(500).json({ error: 'Failed to get innovation analytics' });
    }
  });

  console.log('✅ Innovation Analytics routes registered');
}