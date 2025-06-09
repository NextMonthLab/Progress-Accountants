import { Router } from 'express';
import { sendEmail } from '../sendgrid';

const router = Router();

// GET /api/test/sendgrid - Test SendGrid configuration (temporary route)
router.get('/sendgrid', async (req, res) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'SendGrid API key not configured',
      });
    }

    if (!process.env.SENDGRID_FROM_EMAIL || !process.env.SENDGRID_CONTACT_TO_EMAIL) {
      return res.status(400).json({
        success: false,
        error: 'SendGrid email addresses not configured',
      });
    }

    await sendEmail({
      to: process.env.SENDGRID_CONTACT_TO_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'NextMonth Lab SendGrid Test',
      text: 'Hello from NextMonth Lab test email. SendGrid integration is working correctly!',
    });

    console.log('[SendGrid] Test email sent successfully');
    
    res.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('[SendGrid] Test email failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;