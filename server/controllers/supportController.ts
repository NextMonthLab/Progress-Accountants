import { Request, Response } from "express";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { 
  supportSessions, 
  supportIssues, 
  supportTickets, 
  ticketMessages,
  SupportSession,
  SupportIssue,
  SupportTicket,
  TicketMessage
} from "@shared/support-schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Create a new support session
 */
export async function createSupportSession(req: Request, res: Response) {
  try {
    const sessionId = uuidv4();
    const userId = req.user?.id;
    
    const metaData = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      timestamp: new Date().toISOString()
    };
    
    const [session] = await db.insert(supportSessions)
      .values({
        sessionId,
        userId,
        metaData,
        status: 'active'
      })
      .returning();
      
    return res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    console.error("Error creating support session:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create support session"
    });
  }
}

/**
 * Get session details by ID
 */
export async function getSessionById(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    
    const [session] = await db.select()
      .from(supportSessions)
      .where(eq(supportSessions.sessionId, sessionId));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }
    
    // Get all issues for this session
    const issues = await db.select()
      .from(supportIssues)
      .where(eq(supportIssues.sessionId, sessionId))
      .orderBy(desc(supportIssues.createdAt));
    
    return res.status(200).json({
      success: true,
      session,
      issues
    });
  } catch (error) {
    console.error("Error fetching support session:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch support session"
    });
  }
}

/**
 * Create a support ticket
 */
export async function createSupportTicket(req: Request, res: Response) {
  try {
    const { issueSummary, stepsAttempted, systemContext, sessionId } = req.body;
    const userId = req.user?.id;
    const ticketId = uuidv4();
    
    // Validate required fields
    if (!issueSummary) {
      return res.status(400).json({
        success: false,
        error: "Issue summary is required"
      });
    }
    
    const [ticket] = await db.insert(supportTickets)
      .values({
        ticketId,
        sessionId,
        userId,
        issueSummary,
        stepsAttempted: stepsAttempted || [],
        systemContext: systemContext || {},
        status: 'new',
        priority: 'medium'
      })
      .returning();
    
    // If we have a session ID, update the session to reference this ticket
    if (sessionId) {
      const [session] = await db.select().from(supportSessions).where(eq(supportSessions.sessionId, sessionId));
      
      if (session) {
        // Get current tickets array or initialize empty array
        const existingTickets = session.metaData && 
                              (session.metaData as any).ticketsGenerated ? 
                              (session.metaData as any).ticketsGenerated : [];
        
        await db.update(supportSessions)
          .set({ 
            metaData: {
              ...(session.metaData as object || {}),
              ticketsGenerated: [...existingTickets, ticketId]
            }
          })
          .where(eq(supportSessions.sessionId, sessionId));
      }
    }
    
    return res.status(201).json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create support ticket"
    });
  }
}

/**
 * Log an issue within a session
 */
export async function logIssue(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const { issue } = req.body;
    
    if (!issue) {
      return res.status(400).json({
        success: false,
        error: "Issue text is required"
      });
    }
    
    // Verify the session exists
    const [session] = await db.select().from(supportSessions).where(eq(supportSessions.sessionId, sessionId));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }
    
    // Insert the issue
    const [supportIssue] = await db.insert(supportIssues)
      .values({
        sessionId,
        issueText: issue,
        status: 'new'
      })
      .returning();
    
    // Update the session with the issue reference
    // Get current issues array or initialize empty array
    const existingIssues = session.metaData && 
                          (session.metaData as any).issuesLogged ? 
                          (session.metaData as any).issuesLogged : [];
    
    await db.update(supportSessions)
      .set({ 
        metaData: {
          ...(session.metaData as object || {}),
          issuesLogged: [...existingIssues, supportIssue.id]
        }
      })
      .where(eq(supportSessions.sessionId, sessionId));
    
    return res.status(201).json({
      success: true,
      issue: supportIssue
    });
  } catch (error) {
    console.error("Error logging issue:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to log issue"
    });
  }
}

/**
 * Escalate a support session
 */
export async function escalateSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    
    // Verify the session exists
    const [session] = await db.select().from(supportSessions).where(eq(supportSessions.sessionId, sessionId));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }
    
    // Update the session status
    const [updatedSession] = await db.update(supportSessions)
      .set({ 
        status: 'escalated',
        metaData: {
          ...(session.metaData as object || {}),
          escalated: true,
          escalatedAt: new Date().toISOString()
        }
      })
      .where(eq(supportSessions.sessionId, sessionId))
      .returning();
    
    return res.status(200).json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    console.error("Error escalating session:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to escalate session"
    });
  }
}

/**
 * Get support ticket by ID
 */
export async function getTicketById(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    
    const [ticket] = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.ticketId, ticketId));
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found"
      });
    }
    
    // Get all messages for this ticket
    const messages = await db.select()
      .from(ticketMessages)
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(desc(ticketMessages.createdAt));
    
    return res.status(200).json({
      success: true,
      ticket,
      messages
    });
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch support ticket"
    });
  }
}

/**
 * Update a support ticket
 */
export async function updateTicket(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    const { status, priority, assignedTo, resolution } = req.body;
    
    // Verify the ticket exists
    const [ticket] = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.ticketId, ticketId));
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found"
      });
    }
    
    // Build update object with only provided fields
    const updateData: Partial<SupportTicket> = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (resolution !== undefined) updateData.resolution = resolution;
    
    // Update timestamp
    updateData.updatedAt = new Date();
    
    // Update the ticket
    const [updatedTicket] = await db.update(supportTickets)
      .set(updateData)
      .where(eq(supportTickets.ticketId, ticketId))
      .returning();
    
    return res.status(200).json({
      success: true,
      ticket: updatedTicket
    });
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update support ticket"
    });
  }
}

/**
 * Add a message to a ticket
 */
export async function addTicketMessage(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    const { message, senderType, attachments } = req.body;
    const senderId = req.user?.id;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }
    
    // Verify the ticket exists
    const [ticket] = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.ticketId, ticketId));
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: "Ticket not found"
      });
    }
    
    // Insert the message
    const [ticketMessage] = await db.insert(ticketMessages)
      .values({
        ticketId,
        senderId,
        senderType: senderType || 'user',
        message,
        attachments: attachments || null
      })
      .returning();
    
    // Update the ticket timestamp
    await db.update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.ticketId, ticketId));
    
    return res.status(201).json({
      success: true,
      message: ticketMessage
    });
  } catch (error) {
    console.error("Error adding ticket message:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add message to ticket"
    });
  }
}

/**
 * Get all support requests for admin view
 */
export async function getAllSupportRequests(req: Request, res: Response) {
  try {
    // Get all tickets, sorted by newest first
    const tickets = await db.select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
    
    // Get counts by status
    const newCount = tickets.filter(t => t.status === 'new').length;
    const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
    
    return res.status(200).json({
      success: true,
      tickets,
      counts: {
        new: newCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        total: tickets.length
      }
    });
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch support requests"
    });
  }
}