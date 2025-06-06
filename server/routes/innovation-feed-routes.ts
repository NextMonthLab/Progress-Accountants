import type { Express } from "express";
import { InnovationFeedService } from "../services/innovation-feed";

export function registerInnovationFeedRoutes(app: Express) {
  // POST /api/ai/innovation-feed - Save new innovation feed item
  app.post("/api/ai/innovation-feed", async (req, res) => {
    try {
      const feedData = req.body;
      
      const savedItem = await InnovationFeedService.saveIdeasToFeed(feedData);
      
      res.status(201).json({
        success: true,
        item: savedItem
      });
    } catch (error) {
      console.error('Failed to save innovation feed item:', error);
      res.status(500).json({ error: 'Failed to save innovation feed item' });
    }
  });
  // GET /api/ai/innovation-feed - Get paginated innovation feed items
  app.get("/api/ai/innovation-feed", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await InnovationFeedService.getFeedItems(tenantId, page, limit);
      
      res.json({
        items: result.items,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Failed to get innovation feed:', error);
      res.status(500).json({ error: 'Failed to get innovation feed' });
    }
  });

  // GET /api/ai/innovation-feed/recent - Get recent items for dashboard
  app.get("/api/ai/innovation-feed/recent", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const limit = parseInt(req.query.limit as string) || 5;

      const items = await InnovationFeedService.getRecentItems(tenantId, limit);
      res.json({ items });
    } catch (error) {
      console.error('Failed to get recent innovation items:', error);
      res.status(500).json({ error: 'Failed to get recent innovation items' });
    }
  });

  // GET /api/ai/innovation-feed/stats - Get feed statistics
  app.get("/api/ai/innovation-feed/stats", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";

      const stats = await InnovationFeedService.getFeedStats(tenantId);
      res.json(stats);
    } catch (error) {
      console.error('Failed to get innovation feed stats:', error);
      res.status(500).json({ error: 'Failed to get innovation feed stats' });
    }
  });

  // GET /api/ai/innovation-feed-analytics - Get action analytics for innovation loop tracking
  app.get("/api/ai/innovation-feed-analytics", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";

      const analytics = await InnovationFeedService.getActionAnalytics(tenantId);
      res.json(analytics);
    } catch (error) {
      console.error('Failed to get innovation analytics:', error);
      res.status(500).json({ error: 'Failed to get innovation analytics' });
    }
  });

  // GET /api/ai/innovation-feed/:id - Get specific innovation feed item
  app.get("/api/ai/innovation-feed/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";

      const item = await InnovationFeedService.getFeedItem(id, tenantId);
      
      if (!item) {
        return res.status(404).json({ error: 'Innovation feed item not found' });
      }

      res.json(item);
    } catch (error) {
      console.error('Failed to get innovation feed item:', error);
      res.status(500).json({ error: 'Failed to get innovation feed item' });
    }
  });

  // POST /api/ai/innovation-feed/:id/action-status - Update action status for idea tracking
  app.post("/api/ai/innovation-feed/:id/action-status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const userId = req.body.userId; // Optional user ID for tracking who made the change

      // Validate status
      const validStatuses = ['none', 'implemented', 'archived', 'wishlist'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be one of: none, implemented, archived, wishlist' 
        });
      }

      const updatedItem = await InnovationFeedService.updateActionStatus(
        id, 
        tenantId, 
        status, 
        notes, 
        userId
      );

      if (!updatedItem) {
        return res.status(404).json({ error: 'Innovation feed item not found' });
      }

      res.json({
        success: true,
        item: updatedItem,
        message: `Action status updated to "${status}"`
      });
    } catch (error) {
      console.error('Failed to update action status:', error);
      res.status(500).json({ error: 'Failed to update action status' });
    }
  });

  // GET /api/ai/innovation-feed/by-status/:status - Get items filtered by action status
  app.get("/api/ai/innovation-feed/by-status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const tenantId = req.query.tenantId as string || "00000000-0000-0000-0000-000000000000";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Validate status
      const validStatuses = ['none', 'implemented', 'archived', 'wishlist'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be one of: none, implemented, archived, wishlist' 
        });
      }

      const result = await InnovationFeedService.getFeedItemsByStatus(
        tenantId, 
        status as any, 
        page, 
        limit
      );

      res.json({
        items: result.items,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Failed to get innovation feed by status:', error);
      res.status(500).json({ error: 'Failed to get innovation feed by status' });
    }
  });

  console.log('✅ Innovation Feed routes registered');
}