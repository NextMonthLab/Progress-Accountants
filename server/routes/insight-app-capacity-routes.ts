import type { Express } from "express";
import { InsightAppCapacityService } from "../services/insight-app-capacity";

export function registerInsightAppCapacityRoutes(app: Express) {
  // GET /api/insight-app/capacity - Get current capacity status
  app.get("/api/insight-app/capacity", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      
      const capacityStatus = await InsightAppCapacityService.getCapacityStatus(tenantId);
      
      res.json(capacityStatus);
    } catch (error) {
      console.error('Error fetching capacity status:', error);
      res.status(500).json({ error: 'Failed to fetch capacity status' });
    }
  });

  // POST /api/insight-app/capacity - Update tenant capacity (admin only)
  app.post("/api/insight-app/capacity", async (req, res) => {
    try {
      const { tenantId, additionalPurchasedCapacity } = req.body;
      
      if (!tenantId || additionalPurchasedCapacity == null) {
        return res.status(400).json({ 
          error: 'tenantId and additionalPurchasedCapacity are required' 
        });
      }

      if (additionalPurchasedCapacity < 0) {
        return res.status(400).json({ 
          error: 'additionalPurchasedCapacity cannot be negative' 
        });
      }

      const updatedCapacity = await InsightAppCapacityService.updateCapacity(
        tenantId, 
        additionalPurchasedCapacity
      );
      
      res.json({
        success: true,
        capacity: updatedCapacity,
      });
    } catch (error) {
      console.error('Error updating capacity:', error);
      res.status(500).json({ error: 'Failed to update capacity' });
    }
  });

  // POST /api/insight-app/validate-invite - Validate if user can be invited
  app.post("/api/insight-app/validate-invite", async (req, res) => {
    try {
      const { tenantId, email } = req.body;
      
      if (!tenantId || !email) {
        return res.status(400).json({ 
          error: 'tenantId and email are required' 
        });
      }

      const validation = await InsightAppCapacityService.validateInvite(tenantId);
      
      // Log the invitation attempt
      await InsightAppCapacityService.logInviteAttempt(
        tenantId,
        req.user?.id || null,
        validation.canInvite,
        email
      );

      if (!validation.canInvite) {
        return res.status(400).json({
          status: validation.status,
          message: validation.message,
          capacityStatus: validation.capacityStatus,
        });
      }

      res.json({
        status: 'success',
        message: 'User can be invited',
        capacityStatus: validation.capacityStatus,
      });
    } catch (error) {
      console.error('Error validating invite:', error);
      res.status(500).json({ error: 'Failed to validate invite' });
    }
  });

  // GET /api/insight-app/capacity/summary - Get capacity summary for dashboard
  app.get("/api/insight-app/capacity/summary", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      
      const summary = await InsightAppCapacityService.getCapacitySummary(tenantId);
      
      res.json(summary);
    } catch (error) {
      console.error('Error fetching capacity summary:', error);
      res.status(500).json({ error: 'Failed to fetch capacity summary' });
    }
  });

  // POST /api/insight-app/capacity/initialize - Initialize capacity for new tenant
  app.post("/api/insight-app/capacity/initialize", async (req, res) => {
    try {
      const { tenantId, baseFreeCapacity = 10 } = req.body;
      
      if (!tenantId) {
        return res.status(400).json({ error: 'tenantId is required' });
      }

      const capacity = await InsightAppCapacityService.initializeCapacity(
        tenantId, 
        baseFreeCapacity
      );
      
      res.json({
        success: true,
        capacity,
      });
    } catch (error) {
      console.error('Error initializing capacity:', error);
      res.status(500).json({ error: 'Failed to initialize capacity' });
    }
  });

  console.log('✅ Insight App Capacity routes registered');
}