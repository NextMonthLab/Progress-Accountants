import { Express } from 'express';
import { EmbedAnalyticsService } from '../services/embed-analytics';

export function registerEmbedRoutes(app: Express) {
  
  // Serve the embed.js script
  app.get('/embed.js', async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string;
      
      if (!tenantId) {
        res.status(400).send('// Error: tenantId parameter is required');
        return;
      }

      // Validate tenant exists
      const isValidTenant = await EmbedAnalyticsService.validateTenant(tenantId);
      if (!isValidTenant) {
        res.status(404).send('// Error: Invalid tenantId');
        return;
      }

      // Generate the embed script
      const embedScript = generateEmbedScript(tenantId);
      
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(embedScript);

    } catch (error) {
      console.error('Error serving embed.js:', error);
      res.status(500).send('// Error: Internal server error');
    }
  });

  // Analytics endpoint for page views
  app.post('/api/analytics/page-view', async (req, res) => {
    try {
      const { tenantId, sessionId, pageUrl, referrer } = req.body;
      
      if (!tenantId || !sessionId || !pageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate tenant
      const isValidTenant = await EmbedAnalyticsService.validateTenant(tenantId);
      if (!isValidTenant) {
        return res.status(404).json({ error: 'Invalid tenantId' });
      }

      await EmbedAnalyticsService.trackPageView({
        tenantId,
        sessionId,
        pageUrl,
        referrer,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      });

      res.json({ success: true });

    } catch (error) {
      console.error('Error tracking page view:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Analytics endpoint for custom events
  app.post('/api/analytics/event', async (req, res) => {
    try {
      const { tenantId, sessionId, pageUrl, eventName, eventData } = req.body;
      
      if (!tenantId || !sessionId || !pageUrl || !eventName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate tenant
      const isValidTenant = await EmbedAnalyticsService.validateTenant(tenantId);
      if (!isValidTenant) {
        return res.status(404).json({ error: 'Invalid tenantId' });
      }

      await EmbedAnalyticsService.trackCustomEvent({
        tenantId,
        sessionId,
        pageUrl,
        eventName,
        eventData,
        timestamp: new Date()
      });

      res.json({ success: true });

    } catch (error) {
      console.error('Error tracking custom event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get analytics summary for admin dashboard
  app.get('/api/analytics/summary', async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      if (!tenantId) {
        return res.status(400).json({ error: 'tenantId is required' });
      }

      const summary = await EmbedAnalyticsService.getAnalyticsSummary(tenantId, startDate, endDate);
      res.json(summary);

    } catch (error) {
      console.error('Error getting analytics summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  console.log('✅ Embed routes registered');
}

function generateEmbedScript(tenantId: string): string {
  return `
(function() {
  'use strict';
  
  // NextMonth SmartSite Embed Script
  var TENANT_ID = '${tenantId}';
  var BASE_URL = window.location.protocol + '//' + window.location.host;
  var SESSION_ID = generateSessionId();
  
  // Generate unique session ID
  function generateSessionId() {
    var existing = sessionStorage.getItem('nextmonth_session_id');
    if (existing) return existing;
    
    var sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('nextmonth_session_id', sessionId);
    return sessionId;
  }
  
  // Track page view
  function trackPageView() {
    fetch(BASE_URL + '/api/analytics/page-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: TENANT_ID,
        sessionId: SESSION_ID,
        pageUrl: window.location.href,
        referrer: document.referrer || null,
        timestamp: new Date().toISOString()
      })
    }).catch(function(error) {
      console.warn('NextMonth SmartSite: Failed to track page view', error);
    });
  }
  
  // Track custom event
  function trackEvent(eventName, eventData) {
    if (typeof eventName !== 'string') {
      console.warn('NextMonth SmartSite: eventName must be a string');
      return;
    }
    
    fetch(BASE_URL + '/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: TENANT_ID,
        sessionId: SESSION_ID,
        pageUrl: window.location.href,
        eventName: eventName,
        eventData: eventData || null,
        timestamp: new Date().toISOString()
      })
    }).catch(function(error) {
      console.warn('NextMonth SmartSite: Failed to track event', error);
    });
  }
  
  // Create chat widget (placeholder for now)
  function createChatWidget() {
    var chatContainer = document.createElement('div');
    chatContainer.id = 'nextmonth-chat-widget';
    chatContainer.style.cssText = 
      'position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; ' +
      'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); ' +
      'border-radius: 50%; cursor: pointer; z-index: 9999; ' +
      'display: flex; align-items: center; justify-content: center; ' +
      'box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;';
    
    chatContainer.innerHTML = 
      '<svg width="24" height="24" fill="white" viewBox="0 0 24 24">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>' +
      '</svg>';
    
    chatContainer.addEventListener('click', function() {
      trackEvent('chat_widget_clicked');
      // TODO: Open chat interface
      alert('Chat widget clicked! (Integration coming soon)');
    });
    
    chatContainer.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    chatContainer.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(chatContainer);
  }
  
  // Initialize embed
  function init() {
    // Track initial page view
    trackPageView();
    
    // Create chat widget
    createChatWidget();
    
    // Expose global API
    window.NextMonthSmartSite = {
      trackEvent: trackEvent,
      trackPageView: trackPageView,
      tenantId: TENANT_ID,
      sessionId: SESSION_ID
    };
    
    console.log('NextMonth SmartSite embed initialized for tenant:', TENANT_ID);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
`.trim();
}