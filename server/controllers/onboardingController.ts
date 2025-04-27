import { Express, Request, Response } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { getUserFromSession } from "../middleware/auth";

/**
 * Registers onboarding-related routes
 */
export function registerOnboardingRoutes(app: Express) {
  console.log("Registering Onboarding routes...");

  /**
   * Get onboarding status for a user
   */
  app.get("/api/onboarding/:userId", async (req: Request, res: Response) => {
    try {
      // Verify authenticated session
      const sessionUser = await getUserFromSession(req);
      if (!sessionUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Only allow access to own onboarding data or for admins
      const { userId } = req.params;
      const parsedUserId = parseInt(userId, 10);
      if (sessionUser.id !== parsedUserId && 
          sessionUser.userType !== 'admin' && 
          sessionUser.userType !== 'super_admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Check if onboarding_stages table exists
      const tableExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'onboarding_stages'
        );
      `);

      // Create table if it doesn't exist
      if (!tableExists.rows[0].exists) {
        await db.execute(sql`
          CREATE TABLE onboarding_stages (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            stage VARCHAR(50) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'not_started',
            data JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
      }

      // Get onboarding data for the user
      const stages = await db.execute(sql`
        SELECT * FROM onboarding_stages
        WHERE user_id = ${parsedUserId}
        ORDER BY updated_at DESC;
      `);

      return res.status(200).json({
        success: true,
        data: stages.rows,
      });
    } catch (error) {
      console.error("Error getting onboarding status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * Update onboarding status
   */
  app.patch("/api/onboarding/status", async (req: Request, res: Response) => {
    try {
      // Verify authenticated session
      const sessionUser = await getUserFromSession(req);
      if (!sessionUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Get request body
      const { userId, stage, status, data } = req.body;

      // Only allow updates to own onboarding data or for admins
      if (sessionUser.id !== userId && 
          sessionUser.userType !== 'admin' && 
          sessionUser.userType !== 'super_admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Check if the stage already exists for the user
      const existingStage = await db.execute(sql`
        SELECT * FROM onboarding_stages
        WHERE user_id = ${userId} AND stage = ${stage};
      `);

      if (existingStage.rows.length > 0) {
        // Update existing stage
        await db.execute(sql`
          UPDATE onboarding_stages
          SET status = ${status}, data = ${JSON.stringify(data)}, updated_at = NOW()
          WHERE user_id = ${userId} AND stage = ${stage};
        `);
      } else {
        // Create new stage
        await db.execute(sql`
          INSERT INTO onboarding_stages (user_id, stage, status, data)
          VALUES (${userId}, ${stage}, ${status}, ${JSON.stringify(data)});
        `);
      }

      return res.status(200).json({
        success: true,
        message: "Onboarding status updated",
      });
    } catch (error) {
      console.error("Error updating onboarding status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * Mark stage as complete
   */
  app.patch("/api/onboarding/complete", async (req: Request, res: Response) => {
    try {
      // Verify authenticated session
      const sessionUser = await getUserFromSession(req);
      if (!sessionUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Get request body
      const { userId, stage, data } = req.body;

      // Only allow updates to own onboarding data or for admins
      if (sessionUser.id !== userId && 
          sessionUser.userType !== 'admin' && 
          sessionUser.userType !== 'super_admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      // Check if the stage already exists for the user
      const existingStage = await db.execute(sql`
        SELECT * FROM onboarding_stages
        WHERE user_id = ${userId} AND stage = ${stage};
      `);

      if (existingStage.rows.length > 0) {
        // Update existing stage to completed
        await db.execute(sql`
          UPDATE onboarding_stages
          SET status = 'completed', data = ${JSON.stringify(data)}, updated_at = NOW()
          WHERE user_id = ${userId} AND stage = ${stage};
        `);
      } else {
        // Create new completed stage
        await db.execute(sql`
          INSERT INTO onboarding_stages (user_id, stage, status, data)
          VALUES (${userId}, ${stage}, 'completed', ${JSON.stringify(data)});
        `);
      }

      return res.status(200).json({
        success: true,
        message: "Stage marked as complete",
      });
    } catch (error) {
      console.error("Error completing onboarding stage:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * Reset onboarding progress
   */
  app.post("/api/onboarding/reset", async (req: Request, res: Response) => {
    try {
      // Verify authenticated session with admin privileges
      const sessionUser = await getUserFromSession(req);
      if (!sessionUser || 
          (sessionUser.userType !== 'admin' && 
           sessionUser.userType !== 'super_admin')) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Get user ID to reset
      const { userId } = req.body;

      // Delete all onboarding stages for the user
      await db.execute(sql`
        DELETE FROM onboarding_stages
        WHERE user_id = ${userId};
      `);

      return res.status(200).json({
        success: true,
        message: "Onboarding progress reset",
      });
    } catch (error) {
      console.error("Error resetting onboarding progress:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  console.log("✅ Onboarding routes registered");
}