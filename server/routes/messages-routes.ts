import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { insertMessageSchema } from '@shared/schema';

const router = Router();

// Validation schemas
const saveMessageSchema = insertMessageSchema.extend({
  // Optional enhancements for validation
  email: z.string().email('Invalid email format'),
  autoResponseStatus: z.enum(['pending', 'sent', 'failed']).optional().default('pending'),
});

const updateMessageSchema = z.object({
  subject: z.string().optional(),
  messageBody: z.string().optional(),
  archived: z.boolean().optional(),
  autoResponseStatus: z.enum(['pending', 'sent', 'failed']).optional(),
  autoResponseText: z.string().optional(),
  adminNotes: z.string().optional(),
});

const autoResponseUpdateSchema = z.object({
  status: z.enum(['pending', 'sent', 'failed']),
  responseText: z.string().optional(),
});

// POST /api/messages - Save new message (for contact forms)
router.post('/', async (req, res) => {
  try {
    const messageData = saveMessageSchema.parse(req.body);
    
    const newMessage = await storage.saveMessage(messageData);
    
    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error('Error saving message:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to save message',
    });
  }
});

// GET /api/messages - Get messages with optional client filtering
router.get('/', async (req, res) => {
  try {
    const { clientId, archived, limit, offset } = req.query;
    
    let messages = await storage.getMessages(clientId as string);
    
    // Filter by archived status if specified
    if (archived !== undefined) {
      const archivedBool = archived === 'true';
      messages = messages.filter(msg => msg.archived === archivedBool);
    }
    
    // Apply pagination if specified
    const totalCount = messages.length;
    if (offset || limit) {
      const offsetNum = parseInt(offset as string) || 0;
      const limitNum = parseInt(limit as string) || 50;
      messages = messages.slice(offsetNum, offsetNum + limitNum);
    }
    
    res.json({
      success: true,
      messages,
      pagination: {
        total: totalCount,
        offset: parseInt(offset as string) || 0,
        limit: parseInt(limit as string) || 50,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

// GET /api/messages/:id - Get specific message by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await storage.getMessageById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message',
    });
  }
});

// PATCH /api/messages/:id - Update message (for admin panel)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = updateMessageSchema.parse(req.body);
    
    const updatedMessage = await storage.updateMessage(id, updateData);
    
    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    res.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update message',
    });
  }
});

// PATCH /api/messages/:id/archive - Archive/unarchive message
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    
    const archivedMessage = await storage.archiveMessage(id);
    
    if (!archivedMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    res.json({
      success: true,
      message: archivedMessage,
    });
  } catch (error) {
    console.error('Error archiving message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to archive message',
    });
  }
});

// PATCH /api/messages/:id/auto-response - Update auto-response status
router.patch('/:id/auto-response', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseText } = autoResponseUpdateSchema.parse(req.body);
    
    const updatedMessage = await storage.updateAutoResponseStatus(id, status, responseText);
    
    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    res.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error('Error updating auto-response status:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update auto-response status',
    });
  }
});

// GET /api/messages/stats/:clientId - Get message statistics for client
router.get('/stats/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const messages = await storage.getMessages(clientId);
    
    const stats = {
      total: messages.length,
      unread: messages.filter(msg => !msg.archived).length,
      archived: messages.filter(msg => msg.archived).length,
      autoResponsePending: messages.filter(msg => msg.autoResponseStatus === 'pending').length,
      autoResponseSent: messages.filter(msg => msg.autoResponseStatus === 'sent').length,
      autoResponseFailed: messages.filter(msg => msg.autoResponseStatus === 'failed').length,
      recentMessages: messages
        .filter(msg => {
          const dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate() - 1);
          return new Date(msg.createdAt) > dayAgo;
        }).length,
    };
    
    res.json({
      success: true,
      clientId,
      stats,
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message statistics',
    });
  }
});

export default router;