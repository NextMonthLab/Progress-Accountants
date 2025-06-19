import express, { type Request, Response } from "express";
import { createServer } from "http";
import { setupVite, serveStatic } from "./vite";

const app = express();
const server = createServer(app);

// Essential API endpoints for frontend functionality
app.get('/api/business-identity', (req: Request, res: Response) => {
  res.json({
    core: {
      businessName: "Progress Accountants",
      tagline: "Professional Accounting Services in Banbury"
    }
  });
});

app.get('/api/seo-config', (req: Request, res: Response) => {
  res.json({
    title: "Progress Accountants - Professional Accounting Services in Banbury",
    description: "Looking for an accountant in Banbury? Progress Accountants offers expert bookkeeping, tax returns, and business advisory services."
  });
});

app.post('/api/support/sessions', (req: Request, res: Response) => {
  res.json({
    sessionId: "progress-session-" + Date.now(),
    id: "session-123",
    status: "active"
  });
});

app.get('/api/help/initialization', (req: Request, res: Response) => {
  res.json({
    status: "initialized",
    features: []
  });
});

app.get('/api/pages/public', (req: Request, res: Response) => {
  res.json([
    '/',
    '/about',
    '/services',
    '/team',
    '/contact',
    '/industries',
    '/film',
    '/music',
    '/construction',
    '/professional-services',
    '/sme-support-hub',
    '/studio-banbury',
    '/business-calculator',
    '/news',
    '/why-us',
    '/cookies',
    '/privacy',
    '/terms'
  ]);
});

// NextMonth SmartSite embed endpoint
app.get('/embed.js', (req: Request, res: Response) => {
  const tenantId = req.query.tenantId || 'progress-accountants-uk';
  
  const embedScript = `
(function() {
  'use strict';
  
  var TENANT_ID = '${tenantId}';
  var SESSION_ID = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  
  function createChatWidget() {
    var chatContainer = document.createElement('div');
    chatContainer.id = 'nextmonth-chat-widget';
    chatContainer.style.cssText = 
      'position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; ' +
      'background: linear-gradient(135deg, #7B3FE4 0%, #3FA4E4 100%); ' +
      'border-radius: 50%; cursor: pointer; z-index: 9999; ' +
      'display: flex; align-items: center; justify-content: center; ' +
      'box-shadow: 0 4px 12px rgba(123, 63, 228, 0.3); ' +
      'transition: all 0.3s ease; opacity: 0.9;';
    
    chatContainer.innerHTML = 
      '<svg width="24" height="24" fill="white" viewBox="0 0 24 24">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>' +
      '</svg>';
    
    chatContainer.addEventListener('click', function() {
      console.log('NextMonth SmartSite chat opened for tenant:', TENANT_ID);
      // Create built-in chat interface
      var modal = document.createElement('div');
      modal.style.cssText = 
        'position: fixed; top: 0; left: 0; width: 100%; height: 100%; ' +
        'background: rgba(0, 0, 0, 0.5); z-index: 10000; ' +
        'display: flex; align-items: center; justify-content: center;';
      
      var chatContainer = document.createElement('div');
      chatContainer.style.cssText = 
        'width: 400px; height: 600px; background: white; border-radius: 12px; ' +
        'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); display: flex; flex-direction: column;';
      
      var header = document.createElement('div');
      header.style.cssText = 
        'background: linear-gradient(135deg, #7B3FE4 0%, #3FA4E4 100%); ' +
        'color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;';
      header.innerHTML = '<h3 style="margin: 0; font-family: Arial, sans-serif;">Progress Accountants</h3><p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">How can we help you today?</p>';
      
      var content = document.createElement('div');
      content.style.cssText = 
        'flex: 1; padding: 30px; display: flex; flex-direction: column; justify-content: center; text-align: center; font-family: Arial, sans-serif;';
      content.innerHTML = 
        '<div style="margin-bottom: 30px;">' +
          '<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #7B3FE4 0%, #3FA4E4 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">' +
            '<svg width="30" height="30" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
          '</div>' +
          '<h4 style="color: #333; margin-bottom: 15px;">Ready to chat?</h4>' +
          '<p style="color: #666; margin-bottom: 25px; line-height: 1.5;">Our AI assistant is currently being enhanced. For immediate support, please contact us directly.</p>' +
        '</div>' +
        '<div style="display: flex; gap: 10px; justify-content: center;">' +
          '<a href="tel:01295477250" style="background: linear-gradient(135deg, #7B3FE4 0%, #3FA4E4 100%); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">Call Us</a>' +
          '<a href="mailto:info@progressaccountants.co.uk" style="background: #f8f9fa; color: #333; border: 1px solid #e9ecef; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">Email</a>' +
        '</div>';
      
      var closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = 
        'position: absolute; top: 15px; right: 15px; ' +
        'width: 30px; height: 30px; border: none; border-radius: 50%; ' +
        'background: rgba(255, 255, 255, 0.2); cursor: pointer; ' +
        'font-size: 20px; color: white; z-index: 1;';
      
      closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
      });
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
      
      chatContainer.appendChild(header);
      chatContainer.appendChild(content);
      modal.appendChild(chatContainer);
      modal.appendChild(closeBtn);
      document.body.appendChild(modal);
    });
    
    chatContainer.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.opacity = '1';
    });
    
    chatContainer.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.opacity = '0.9';
    });
    
    document.body.appendChild(chatContainer);
  }
  
  function init() {
    createChatWidget();
    console.log('NextMonth SmartSite embed initialized for tenant:', TENANT_ID);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
  `;
  
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(embedScript);
});

// Catch-all for missing API endpoints
app.use('/api/*', (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "API endpoint disabled in frontend-only mode" });
});

console.log('Starting Progress Accountants with original design...');

async function startServer() {
  const port = parseInt(process.env.PORT || "5000");
  
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(console.error);