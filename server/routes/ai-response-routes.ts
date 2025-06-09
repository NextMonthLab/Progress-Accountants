import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { sendEmail } from '../sendgrid';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client for Mistral via Hetzner
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  baseURL: 'https://api.hetzner.cloud/v1/ai',
});

// Validation schema for AI response request
const aiResponseSchema = z.object({
  messageId: z.string().uuid(),
  businessIdentity: z.object({
    name: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    brandVoice: z.any().optional(),
    brandPositioning: z.string().optional(),
  }).optional(),
  messageContent: z.string(),
  senderName: z.string(),
  senderEmail: z.string(),
});

// POST /api/ai/respond-to-message - Generate AI response using Mistral 7B
router.post('/respond-to-message', async (req, res) => {
  try {
    const { messageId, businessIdentity, messageContent, senderName, senderEmail } = aiResponseSchema.parse(req.body);
    
    // Get the original message
    const originalMessage = await storage.getMessageById(messageId);
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    // Build context for Mistral
    let businessContext = '';
    if (businessIdentity) {
      businessContext = `
Business: ${businessIdentity.name || 'Our Business'}
Mission: ${businessIdentity.mission || 'Serving our customers with excellence'}
Brand Voice: ${businessIdentity.brandVoice ? JSON.stringify(businessIdentity.brandVoice) : 'Professional and friendly'}
Brand Positioning: ${businessIdentity.brandPositioning || 'Trusted partner for our clients'}
      `.trim();
    } else {
      businessContext = 'Professional service business committed to excellence and customer satisfaction';
    }

    // Create Mistral prompt
    const prompt = `You are an AI assistant responding to a customer inquiry for a business. Generate a polite, warm holding pattern response.

BUSINESS CONTEXT:
${businessContext}

CUSTOMER MESSAGE:
From: ${senderName} (${senderEmail})
Message: ${messageContent}

INSTRUCTIONS:
- Write a professional, warm response acknowledging receipt of their message
- Use the business's tone of voice based on the context provided
- Clearly state that a human team member will follow up soon
- Keep the response concise but friendly
- Do not attempt to answer their specific question - this is just an acknowledgment
- Do not include any contact information or signatures

Generate only the response text, nothing else:`;

    let aiResponse = '';
    
    try {
      // Call Mistral 7B via Hetzner API
      const completion = await openai.chat.completions.create({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      aiResponse = completion.choices[0]?.message?.content?.trim() || '';
    } catch (aiError) {
      console.error('[AI Response] Mistral API error:', aiError);
      
      // Fallback response if AI fails
      const businessName = businessIdentity?.name || 'Our team';
      aiResponse = `Thank you for contacting ${businessName}. We've received your message and appreciate you reaching out to us. 

A member of our team will review your inquiry and get back to you shortly. We value your interest and look forward to assisting you.

Best regards,
${businessName}`;
    }

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate AI response',
      });
    }

    // Update message with AI response
    const updatedMessage = await storage.updateMessage(messageId, {
      aiResponse,
      aiResponseSentAt: new Date(),
    });

    // Send AI response via email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      try {
        await sendEmail({
          to: senderEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: `Re: ${originalMessage.subject || 'Your message'}`,
          text: aiResponse,
        });
        console.log('[AI Response] Auto-response email sent successfully');
      } catch (emailError) {
        console.error('[AI Response] Failed to send auto-response email:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('[AI Response] Auto-response email skipped - SendGrid not configured');
    }

    res.json({
      success: true,
      aiResponse,
      timestamp: new Date().toISOString(),
      message: updatedMessage,
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response',
    });
  }
});

export default router;