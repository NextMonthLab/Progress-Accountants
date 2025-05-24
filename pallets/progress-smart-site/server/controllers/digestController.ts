import { Request, Response } from 'express';
import { db } from '../db';
import { InsertSupportDigest, supportDigests, SupportDigest } from '../../shared/support_schema';
import { supportTickets, supportSessions } from '../../shared/support_schema'; 
import { eq, and, desc, isNull } from 'drizzle-orm';

/**
 * Generate and create a support digest when a ticket is resolved
 */
export async function generateTicketDigest(req: Request, res: Response) {
  try {
    const { ticketId } = req.params;
    const ticketIdNum = parseInt(ticketId);
    
    if (isNaN(ticketIdNum)) {
      return res.status(400).json({ error: 'Invalid ticket ID' });
    }
    
    // Get the ticket
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, ticketIdNum));
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Check if digest already exists
    const existingDigests = await db.select().from(supportDigests)
      .where(eq(supportDigests.ticketId, ticketIdNum));
    
    if (existingDigests.length > 0) {
      return res.status(200).json({ 
        message: 'Digest already exists for this ticket',
        digest: existingDigests[0]
      });
    }
    
    // Create the digest
    const digestData: InsertSupportDigest = {
      tenantId: ticket.tenantId,
      userId: ticket.userId || undefined,
      ticketId: ticketIdNum,
      sessionId: ticket.sessionId || undefined,
      title: `Your Support Journey: Mission Completed`,
      issueDescription: `We noticed you needed help with: ${ticket.subject}`,
      resolutionSummary: ticket.resolution || 'Your issue has been resolved successfully.',
      systemStatus: 'healthy',
      nextTip: generateNextTip(ticket.category),
      digestType: 'ticket_resolved',
      read: false,
      delivered: false,
      emailSent: false,
    };
    
    const [newDigest] = await db.insert(supportDigests).values(digestData).returning();
    
    return res.status(201).json({
      success: true,
      digest: newDigest
    });
  } catch (error) {
    console.error('Error generating ticket digest:', error);
    return res.status(500).json({ error: 'Failed to generate digest' });
  }
}

/**
 * Generate and create a support digest when a support session is completed
 */
export async function generateSessionDigest(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const sessionIdNum = parseInt(sessionId);
    
    if (isNaN(sessionIdNum)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }
    
    // Get the session
    const [session] = await db.select().from(supportSessions).where(eq(supportSessions.id, sessionIdNum));
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Check if digest already exists
    const existingDigests = await db.select().from(supportDigests)
      .where(eq(supportDigests.sessionId, sessionIdNum));
    
    if (existingDigests.length > 0) {
      return res.status(200).json({ 
        message: 'Digest already exists for this session',
        digest: existingDigests[0]
      });
    }
    
    // Extract context data from session
    const sessionContext = session.context as any || {};
    const sessionType = session.sessionType;
    const issue = sessionContext.issue || 'using our platform';
    const resolution = sessionContext.resolution || 'Your session has been completed successfully.';
    
    // Create the digest
    const digestData: InsertSupportDigest = {
      tenantId: session.tenantId,
      userId: session.userId || undefined,
      sessionId: sessionIdNum,
      title: `Your Support Journey: Mission Completed`,
      issueDescription: `We noticed you needed help with ${issue}`,
      resolutionSummary: resolution,
      systemStatus: 'healthy',
      nextTip: generateNextTip(sessionType),
      digestType: 'self_resolved',
      read: false,
      delivered: false,
      emailSent: false,
    };
    
    const [newDigest] = await db.insert(supportDigests).values(digestData).returning();
    
    return res.status(201).json({
      success: true,
      digest: newDigest
    });
  } catch (error) {
    console.error('Error generating session digest:', error);
    return res.status(500).json({ error: 'Failed to generate digest' });
  }
}

/**
 * Generate a system health digest for proactive maintenance
 */
export async function generateSystemDigest(req: Request, res: Response) {
  try {
    const { userId, tenantId, issue, resolution } = req.body;
    
    if (!tenantId || !issue || !resolution) {
      return res.status(400).json({ error: 'Missing required fields: tenantId, issue, and resolution are required' });
    }
    
    // Create the digest
    const digestData: InsertSupportDigest = {
      tenantId,
      userId: userId || undefined,
      title: `System Health Update: Maintenance Complete`,
      issueDescription: issue,
      resolutionSummary: resolution,
      systemStatus: 'healthy',
      nextTip: 'Check out our system status page for real-time updates on all services.',
      digestType: 'system_health',
      read: false,
      delivered: false,
      emailSent: false,
    };
    
    const [newDigest] = await db.insert(supportDigests).values(digestData).returning();
    
    return res.status(201).json({
      success: true,
      digest: newDigest
    });
  } catch (error) {
    console.error('Error generating system digest:', error);
    return res.status(500).json({ error: 'Failed to generate system digest' });
  }
}

/**
 * Get all digests for a user
 */
export async function getUserDigests(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);
    
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const digests = await db.select().from(supportDigests)
      .where(eq(supportDigests.userId, userIdNum))
      .orderBy(desc(supportDigests.createdAt));
    
    return res.status(200).json({
      count: digests.length,
      digests
    });
  } catch (error) {
    console.error('Error fetching user digests:', error);
    return res.status(500).json({ error: 'Failed to fetch digests' });
  }
}

/**
 * Get a specific digest by ID
 */
export async function getDigestById(req: Request, res: Response) {
  try {
    const { digestId } = req.params;
    const digestIdNum = parseInt(digestId);
    
    if (isNaN(digestIdNum)) {
      return res.status(400).json({ error: 'Invalid digest ID' });
    }
    
    const [digest] = await db.select().from(supportDigests)
      .where(eq(supportDigests.id, digestIdNum));
    
    if (!digest) {
      return res.status(404).json({ error: 'Digest not found' });
    }
    
    return res.status(200).json(digest);
  } catch (error) {
    console.error('Error fetching digest:', error);
    return res.status(500).json({ error: 'Failed to fetch digest' });
  }
}

/**
 * Mark a digest as read
 */
export async function markDigestAsRead(req: Request, res: Response) {
  try {
    const { digestId } = req.params;
    const digestIdNum = parseInt(digestId);
    
    if (isNaN(digestIdNum)) {
      return res.status(400).json({ error: 'Invalid digest ID' });
    }
    
    const [updatedDigest] = await db.update(supportDigests)
      .set({ read: true, updatedAt: new Date() })
      .where(eq(supportDigests.id, digestIdNum))
      .returning();
    
    if (!updatedDigest) {
      return res.status(404).json({ error: 'Digest not found' });
    }
    
    return res.status(200).json({
      success: true,
      digest: updatedDigest
    });
  } catch (error) {
    console.error('Error marking digest as read:', error);
    return res.status(500).json({ error: 'Failed to update digest' });
  }
}

/**
 * Mark a digest as delivered
 */
export async function markDigestAsDelivered(req: Request, res: Response) {
  try {
    const { digestId } = req.params;
    const digestIdNum = parseInt(digestId);
    
    if (isNaN(digestIdNum)) {
      return res.status(400).json({ error: 'Invalid digest ID' });
    }
    
    const [updatedDigest] = await db.update(supportDigests)
      .set({ delivered: true, updatedAt: new Date() })
      .where(eq(supportDigests.id, digestIdNum))
      .returning();
    
    if (!updatedDigest) {
      return res.status(404).json({ error: 'Digest not found' });
    }
    
    return res.status(200).json({
      success: true,
      digest: updatedDigest
    });
  } catch (error) {
    console.error('Error marking digest as delivered:', error);
    return res.status(500).json({ error: 'Failed to update digest' });
  }
}

/**
 * Generate a next tip based on the category/type
 */
function generateNextTip(category: string): string {
  const tips = {
    general: "Check out our knowledge base for helpful tips and tricks.",
    technical: "Try using keyboard shortcuts to speed up your workflow.",
    billing: "Set up automatic payments to avoid any service interruptions.",
    account: "Review your account settings to ensure everything is up to date.",
    chat: "You can access previous chat history in your account settings.",
    email: "Consider adding our support email to your contacts for faster responses.",
    media: "Explore our Media Manager tips for even faster publishing next time!",
    upload: "Try batch uploading multiple files to save time.",
    login: "Consider using a password manager for secure and convenient access.",
    default: "Explore our help center for more tips and information."
  };
  
  const tipCategory = category.toLowerCase() as keyof typeof tips;
  return tips[tipCategory] || tips.default;
}