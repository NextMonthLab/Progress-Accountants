import type { Express } from "express";
import { storage } from "../storage";

export function registerAiUsageRoutes(app: Express): void {
  // Get AI usage statistics for current month
  app.get("/api/ai/usage", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const stats = await storage.getAiUsageStats(tenantId, year, month);
      const totalUsage = await storage.getTotalAiUsageForMonth(tenantId, year, month);

      // AI usage limits (configurable in future)
      const limits = {
        gptLimit: 100, // ChatGPT calls per month for free tier
        mistralUnlimited: true, // Mistral has no limits
        claudeLimit: 50 // Claude calls per month for free tier
      };

      const response = {
        currentMonth: {
          year,
          month,
          totalCalls: stats.totalCalls,
          gptCalls: stats.gptCalls,
          claudeCalls: stats.claudeCalls,
          mistralCalls: stats.mistralCalls,
          successRate: stats.successRate
        },
        limits,
        status: {
          gptStatus: stats.gptCalls >= limits.gptLimit ? 'exceeded' : 
                    stats.gptCalls >= limits.gptLimit * 0.8 ? 'warning' : 'ok',
          claudeStatus: stats.claudeCalls >= limits.claudeLimit ? 'exceeded' : 
                       stats.claudeCalls >= limits.claudeLimit * 0.8 ? 'warning' : 'ok',
          mistralStatus: 'unlimited'
        }
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching AI usage stats:", error);
      res.status(500).json({ error: "Failed to fetch AI usage statistics" });
    }
  });

  // Get detailed AI usage history
  app.get("/api/ai/usage/history", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const limit = parseInt(req.query.limit as string) || 50;
      
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const usage = await storage.getAiUsageForTenant(tenantId, startDate, endDate);
      const limitedUsage = usage.slice(0, limit);

      res.json({
        usage: limitedUsage,
        total: usage.length,
        hasMore: usage.length > limit
      });
    } catch (error) {
      console.error("Error fetching AI usage history:", error);
      res.status(500).json({ error: "Failed to fetch AI usage history" });
    }
  });

  // Get AI usage by model
  app.get("/api/ai/usage/by-model/:model", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const model = req.params.model;
      const limit = parseInt(req.query.limit as string) || 25;

      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const usage = await storage.getAiUsageByModel(tenantId, model, startDate, endDate);
      const limitedUsage = usage.slice(0, limit);

      res.json({
        model,
        usage: limitedUsage,
        total: usage.length,
        hasMore: usage.length > limit
      });
    } catch (error) {
      console.error("Error fetching AI usage by model:", error);
      res.status(500).json({ error: "Failed to fetch AI usage by model" });
    }
  });

  // Get AI usage by task type
  app.get("/api/ai/usage/by-task/:taskType", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const taskType = req.params.taskType;
      const limit = parseInt(req.query.limit as string) || 25;

      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const usage = await storage.getAiUsageByTaskType(tenantId, taskType, startDate, endDate);
      const limitedUsage = usage.slice(0, limit);

      res.json({
        taskType,
        usage: limitedUsage,
        total: usage.length,
        hasMore: usage.length > limit
      });
    } catch (error) {
      console.error("Error fetching AI usage by task type:", error);
      res.status(500).json({ error: "Failed to fetch AI usage by task type" });
    }
  });

  console.log("✅ AI Usage Tracking routes registered");
}