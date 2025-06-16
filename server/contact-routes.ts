import type { Express, Request, Response } from "express";

export function registerContactRoutes(app: Express) {
  
  // Contact form submission endpoint
  app.post('/api/forms/:tenantId/contact', (req: Request, res: Response) => {
    const { tenantId } = req.params;
    const { name, email, phone, business, industry, message } = req.body;
    
    // Log the contact form submission
    console.log(`[Contact Form] New submission for tenant: ${tenantId}`);
    console.log(`Name: ${name}, Email: ${email}, Message: ${message.substring(0, 50)}...`);
    
    res.json({
      success: true,
      message: "Contact form submitted successfully",
      submissionId: Math.floor(Math.random() * 100000),
      submittedAt: new Date().toISOString(),
      tenantId
    });
  });

  // Message thread endpoints
  app.get('/api/messages/:tenantId/recent', (req: Request, res: Response) => {
    const { tenantId } = req.params;
    
    const messages = [
      {
        id: 1,
        sender: "Sarah Johnson",
        role: "Senior Accountant",
        message: "Your Q2 management accounts are ready for review. Please let me know if you have any questions.",
        timestamp: "2025-06-16T09:30:00Z",
        isFromTeam: true,
        urgent: false
      },
      {
        id: 2,
        sender: "You",
        role: "Client",
        message: "Thank you for the update. Could you clarify the variance in the marketing expenses?",
        timestamp: "2025-06-16T10:15:00Z",
        isFromTeam: false,
        urgent: false
      },
      {
        id: 3,
        sender: "Michael Thompson",
        role: "Tax Advisor",
        message: "Reminder: Your corporation tax return deadline is approaching in December. We'll start preparation in November.",
        timestamp: "2025-06-15T14:45:00Z",
        isFromTeam: true,
        urgent: true
      },
      {
        id: 4,
        sender: "Progress Team",
        role: "Support",
        message: "Your monthly business health check is scheduled for next week. We'll send the agenda shortly.",
        timestamp: "2025-06-15T11:20:00Z",
        isFromTeam: true,
        urgent: false
      }
    ];
    
    res.json(messages);
  });

  app.get('/api/messages/:tenantId/summary', (req: Request, res: Response) => {
    const { tenantId } = req.params;
    
    const summary = {
      unreadCount: 2,
      totalCount: 15
    };
    
    res.json(summary);
  });

  // Message sending endpoint
  app.post('/api/messages/:tenantId/send', (req: Request, res: Response) => {
    const { tenantId } = req.params;
    const { content, clientId } = req.body;
    
    console.log(`[Message] New message from client ${clientId} in tenant ${tenantId}: ${content.substring(0, 50)}...`);
    
    res.json({
      success: true,
      message: "Message sent successfully",
      messageId: Math.floor(Math.random() * 10000),
      sentAt: new Date().toISOString(),
      content
    });
  });
}