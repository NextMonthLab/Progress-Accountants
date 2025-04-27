import { Express, Request, Response } from "express";
import {
  createSupportSession,
  getSupportSession,
  updateSupportSession,
  createSupportTicket,
  getSupportTicket,
  updateSupportTicket,
  getAllSupportTickets,
  logIssueToSession,
  addTicketToSession,
  escalateSession,
  SystemContext
} from "./controllers/supportController";

export function registerSupportRoutes(app: Express) {
  console.log("Registering Support System routes...");

  // Instant Help Assistant API endpoints
  app.post("/api/support/session", async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const session = await createSupportSession(userId);
      res.status(201).json({ success: true, session });
    } catch (error) {
      console.error("Error creating support session:", error);
      res.status(500).json({ success: false, message: "Failed to create support session" });
    }
  });

  app.get("/api/support/session/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = await getSupportSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ success: false, message: "Support session not found" });
      }
      
      res.status(200).json({ success: true, session });
    } catch (error) {
      console.error("Error getting support session:", error);
      res.status(500).json({ success: false, message: "Failed to get support session" });
    }
  });

  app.post("/api/support/session/:sessionId/issue", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const { issue } = req.body;
      
      if (!issue || typeof issue !== "string") {
        return res.status(400).json({ success: false, message: "Issue is required" });
      }
      
      const updatedSession = await logIssueToSession(sessionId, issue);
      res.status(200).json({ success: true, session: updatedSession });
    } catch (error) {
      console.error("Error logging issue to session:", error);
      res.status(500).json({ success: false, message: "Failed to log issue to session" });
    }
  });

  // Support Ticket API endpoints
  app.post("/api/support/ticket", async (req: Request, res: Response) => {
    try {
      const { issueSummary, stepsAttempted, systemContext, sessionId } = req.body;
      const userId = req.user?.id || null;
      
      if (!issueSummary || !systemContext) {
        return res.status(400).json({ 
          success: false, 
          message: "Issue summary and system context are required" 
        });
      }
      
      const ticket = await createSupportTicket(
        userId,
        issueSummary,
        stepsAttempted || [],
        systemContext
      );
      
      // If sessionId is provided, add the ticket to the session
      if (sessionId) {
        await addTicketToSession(sessionId, ticket.ticketId);
      }
      
      res.status(201).json({ success: true, ticket });
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ success: false, message: "Failed to create support ticket" });
    }
  });

  app.get("/api/support/ticket/:ticketId", async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      const ticket = await getSupportTicket(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ success: false, message: "Support ticket not found" });
      }
      
      res.status(200).json({ success: true, ticket });
    } catch (error) {
      console.error("Error getting support ticket:", error);
      res.status(500).json({ success: false, message: "Failed to get support ticket" });
    }
  });

  app.put("/api/support/ticket/:ticketId", async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      const updates = req.body;
      
      const updatedTicket = await updateSupportTicket(ticketId, updates);
      res.status(200).json({ success: true, ticket: updatedTicket });
    } catch (error) {
      console.error("Error updating support ticket:", error);
      res.status(500).json({ success: false, message: "Failed to update support ticket" });
    }
  });

  // Admin Escalation API endpoints
  app.post("/api/support/session/:sessionId/escalate", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const escalatedSession = await escalateSession(sessionId);
      res.status(200).json({ success: true, session: escalatedSession });
    } catch (error) {
      console.error("Error escalating session:", error);
      res.status(500).json({ success: false, message: "Failed to escalate session" });
    }
  });

  app.get("/api/admin/support-requests", async (req: Request, res: Response) => {
    try {
      // Only allow admins to access this endpoint
      if (!req.user || (req.user.userType !== "admin" && req.user.userType !== "super_admin")) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      
      const tickets = await getAllSupportTickets();
      res.status(200).json({ success: true, tickets });
    } catch (error) {
      console.error("Error getting all support tickets:", error);
      res.status(500).json({ success: false, message: "Failed to get all support tickets" });
    }
  });

  console.log("✅ Support System routes registered");
}