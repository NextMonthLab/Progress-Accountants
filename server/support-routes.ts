import { Express, Request, Response } from 'express';
import { 
  createSupportSession, 
  getSessionById, 
  logIssue, 
  createSupportTicket, 
  getTicketById, 
  updateTicket, 
  escalateSession,
  getAllSupportRequests,
  addTicketMessage
} from './controllers/supportController';
import { isAuthenticated } from './middleware/auth';
import { requireRole } from './middleware/rbac';

export function registerSupportRoutes(app: Express) {
  console.log("Registering Support System routes...");

  // Support sessions - no auth required for initial session creation
  app.post("/api/support/session", createSupportSession);
  app.get("/api/support/session/:sessionId", getSessionById);
  
  // Issue logging within a session
  app.post("/api/support/session/:sessionId/issue", logIssue);
  
  // Escalate a session to human support
  app.post("/api/support/session/:sessionId/escalate", escalateSession);
  
  // Support tickets
  app.post("/api/support/ticket", createSupportTicket);
  app.get("/api/support/ticket/:ticketId", getTicketById);
  app.put("/api/support/ticket/:ticketId", updateTicket);
  app.post("/api/support/ticket/:ticketId/message", isAuthenticated, addTicketMessage);
  
  // Admin support management - requires admin role
  app.get(
    "/api/admin/support-requests", 
    isAuthenticated, 
    requireRole(['admin', 'super_admin'] as any), // Type cast to workaround the compiler error
    getAllSupportRequests
  );
  
  console.log("✅ Support System routes registered");
}