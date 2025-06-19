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
      // Open chat interface (placeholder)
      alert('Chat assistant coming soon! Contact us directly for immediate support.');
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