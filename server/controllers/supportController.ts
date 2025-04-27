import { db } from "../db";
import { 
  supportSessions, 
  supportTickets, 
  SupportSession, 
  SupportTicket 
} from "../../shared/support-schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Generate a unique ID for sessions or tickets
function generateUniqueId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export interface SystemContext {
  page: string;
  browser: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

// Create a new support session
export async function createSupportSession(userId?: number): Promise<SupportSession> {
  const newSession = {
    userId: userId || null,
    sessionId: generateUniqueId("session"),
    currentMode: "assistant",
    issuesLogged: [],
    ticketsGenerated: [],
    status: "active",
    escalated: false
  };

  try {
    const [session] = await db.insert(supportSessions)
      .values(newSession)
      .returning();

    return session;
  } catch (error) {
    console.error("Error creating support session:", error);
    throw new Error("Failed to create support session");
  }
}

// Get a support session by ID
export async function getSupportSession(sessionId: string): Promise<SupportSession | undefined> {
  try {
    const [session] = await db.select()
      .from(supportSessions)
      .where(eq(supportSessions.sessionId, sessionId));

    return session;
  } catch (error) {
    console.error("Error getting support session:", error);
    throw new Error("Failed to get support session");
  }
}

// Update a support session
export async function updateSupportSession(
  sessionId: string, 
  updates: Partial<SupportSession>
): Promise<SupportSession> {
  try {
    const [updatedSession] = await db.update(supportSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportSessions.sessionId, sessionId))
      .returning();

    return updatedSession;
  } catch (error) {
    console.error("Error updating support session:", error);
    throw new Error("Failed to update support session");
  }
}

// Create a new support ticket
export async function createSupportTicket(
  userId: number | null, 
  issueSummary: string,
  stepsAttempted: string[],
  systemContext: SystemContext
): Promise<SupportTicket> {
  const ticketId = generateUniqueId("ticket");
  
  try {
    const [ticket] = await db.insert(supportTickets)
      .values({
        ticketId,
        userId: userId || null,
        issueSummary,
        stepsAttempted,
        systemContext,
        status: "new",
        assignedTo: "system"
      })
      .returning();

    return ticket;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw new Error("Failed to create support ticket");
  }
}

// Get a support ticket by ID
export async function getSupportTicket(ticketId: string): Promise<SupportTicket | undefined> {
  try {
    const [ticket] = await db.select()
      .from(supportTickets)
      .where(eq(supportTickets.ticketId, ticketId));

    return ticket;
  } catch (error) {
    console.error("Error getting support ticket:", error);
    throw new Error("Failed to get support ticket");
  }
}

// Update a support ticket
export async function updateSupportTicket(
  ticketId: string,
  updates: Partial<SupportTicket>
): Promise<SupportTicket> {
  try {
    const [updatedTicket] = await db.update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.ticketId, ticketId))
      .returning();

    return updatedTicket;
  } catch (error) {
    console.error("Error updating support ticket:", error);
    throw new Error("Failed to update support ticket");
  }
}

// Get all support tickets for admin view
export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  try {
    const tickets = await db.select()
      .from(supportTickets)
      .orderBy(supportTickets.createdAt);

    return tickets;
  } catch (error) {
    console.error("Error getting all support tickets:", error);
    throw new Error("Failed to get all support tickets");
  }
}

// Add issue to session logs
export async function logIssueToSession(
  sessionId: string,
  issue: string
): Promise<SupportSession> {
  try {
    const session = await getSupportSession(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const updatedIssuesLogged = [...session.issuesLogged, issue];
    
    return updateSupportSession(sessionId, { 
      issuesLogged: updatedIssuesLogged 
    });
  } catch (error) {
    console.error("Error logging issue to session:", error);
    throw new Error("Failed to log issue to session");
  }
}

// Add ticket reference to session
export async function addTicketToSession(
  sessionId: string,
  ticketId: string
): Promise<SupportSession> {
  try {
    const session = await getSupportSession(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const updatedTicketsGenerated = [...session.ticketsGenerated, ticketId];
    
    return updateSupportSession(sessionId, { 
      ticketsGenerated: updatedTicketsGenerated,
      currentMode: "ticket" 
    });
  } catch (error) {
    console.error("Error adding ticket to session:", error);
    throw new Error("Failed to add ticket to session");
  }
}

// Escalate a session
export async function escalateSession(
  sessionId: string
): Promise<SupportSession> {
  try {
    return updateSupportSession(sessionId, { 
      escalated: true,
      currentMode: "escalated" 
    });
  } catch (error) {
    console.error("Error escalating session:", error);
    throw new Error("Failed to escalate session");
  }
}