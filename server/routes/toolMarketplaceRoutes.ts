import { Express, Request, Response } from 'express';
import { logToolInteraction } from '../utils/toolLogger';
import fs from 'fs';
import path from 'path';

// Mock data for the tools (in a real app, this would come from a database or external API)
const mockTools = [
  {
    id: 1,
    title: 'Client Financial Dashboard',
    description: 'Interactive dashboard showing client financial performance with visualizations',
    builder: 'NextMonth Labs',
    tags: ['Finance', 'Analytics', 'Client Management'],
    price: 'Free to Preview',
    isNew: true,
    isLabBuilt: true,
    isCertified: true,
    createdAt: '2025-03-10T09:00:00Z',
    thumbnail: '/assets/dashboard-thumb.jpg'
  },
  {
    id: 2,
    title: 'Tax Filing Assistant',
    description: 'Automated tax preparation tool with built-in compliance checks',
    builder: 'TaxPro Solutions',
    tags: ['Tax', 'Compliance', 'Automation'],
    price: '5 Credits',
    isNew: false,
    isLabBuilt: false,
    isCertified: true,
    createdAt: '2025-01-15T09:00:00Z',
    thumbnail: '/assets/tax-thumb.jpg'
  },
  {
    id: 3,
    title: 'Expense Categorizer',
    description: 'AI-powered tool to automatically categorize and organize expenses',
    builder: 'FinTech Innovations',
    tags: ['AI', 'Expenses', 'Automation'],
    price: '3 Credits',
    isNew: true,
    isLabBuilt: true,
    isCertified: false,
    createdAt: '2025-04-20T09:00:00Z',
    thumbnail: '/assets/expenses-thumb.jpg'
  },
  {
    id: 4,
    title: 'Payroll Calculator',
    description: 'Comprehensive payroll calculator with tax withholding and benefits calculations',
    builder: 'NextMonth Labs',
    tags: ['Payroll', 'HR', 'Calculations'],
    price: 'Free to Preview',
    isNew: false,
    isLabBuilt: true,
    isCertified: true,
    createdAt: '2024-11-05T09:00:00Z',
    thumbnail: '/assets/payroll-thumb.jpg'
  },
  {
    id: 5,
    title: 'Invoice Generator',
    description: 'Create professional invoices with customizable templates and automatic numbering',
    builder: 'BillingPro',
    tags: ['Billing', 'Client Management', 'Templates'],
    price: '2 Credits',
    isNew: false,
    isLabBuilt: false,
    isCertified: true,
    createdAt: '2025-02-22T09:00:00Z',
    thumbnail: '/assets/invoice-thumb.jpg'
  },
  {
    id: 6,
    title: 'Financial Report Builder',
    description: 'Create customized financial reports with drag-and-drop interface',
    builder: 'ReportWizard Inc',
    tags: ['Reporting', 'Finance', 'Templates'],
    price: '4 Credits',
    isNew: true,
    isLabBuilt: false,
    isCertified: true,
    createdAt: '2025-04-01T09:00:00Z',
    thumbnail: '/assets/report-thumb.jpg'
  },
  {
    id: 7,
    title: 'Client Onboarding Workflow',
    description: 'Streamlined workflow for onboarding new accounting clients with document collection',
    builder: 'NextMonth Labs',
    tags: ['Workflow', 'Client Management', 'Onboarding'],
    price: '3 Credits',
    isNew: false,
    isLabBuilt: true,
    isCertified: true,
    createdAt: '2025-01-30T09:00:00Z',
    thumbnail: '/assets/onboarding-thumb.jpg'
  },
  {
    id: 8,
    title: 'Depreciation Calculator',
    description: 'Calculate asset depreciation with support for various methods and tax rules',
    builder: 'AccountingTools Ltd',
    tags: ['Finance', 'Tax', 'Assets'],
    price: '2 Credits',
    isNew: false,
    isLabBuilt: false,
    isCertified: true,
    createdAt: '2024-12-12T09:00:00Z',
    thumbnail: '/assets/depreciation-thumb.jpg'
  }
];

// Track tool access
const toolAccess = new Map<number, Set<number>>();

export const registerToolMarketplaceRoutes = (app: Express) => {
  // Get all tools from dev.nextmonth.io
  app.get('/api/tools', (req: Request, res: Response) => {
    // In a real app, this would hit the external API: https://dev.nextmonth.io/api/tools
    // For now, we'll use our mock data
    res.json(mockTools);
  });

  // Get a specific tool by ID
  app.get('/api/tools/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const tool = mockTools.find(t => t.id === id);
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json(tool);
  });

  // Get a rendered preview of a tool
  app.get('/api/tools/render/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const tool = mockTools.find(t => t.id === id);
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // In a real app, this would hit an external API to get iframe content
    // For demo purposes, we're returning mock iframe HTML
    const iframeContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #333; margin: 0; padding: 0; }
            .container { padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #008080; }
            .demo-ui { background: #f5f5f5; border-radius: 8px; padding: 20px; margin-top: 20px; }
            .placeholder { height: 200px; background: #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${tool.title} - Preview</h1>
            <p>${tool.description}</p>
            <div class="demo-ui">
              <p>This is a preview of the ${tool.title} tool. In the full version, you would see interactive elements here.</p>
              <div class="placeholder">Tool Interface Preview</div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Log the preview interaction if user is authenticated
    if (req.user && typeof req.user.id === 'number') {
      logToolInteraction(req.user.id, id, 'preview');
    }
    
    res.set('Content-Type', 'text/html');
    res.send(iframeContent);
  });

  // Check if a user has access to a tool
  app.get('/api/tools/access/:toolId', (req: Request, res: Response) => {
    const toolId = parseInt(req.params.toolId);
    const userId = req.query.userId ? parseInt(req.query.userId as string) : (req.user?.id as number || 0);
    const action = req.query.action as string || null;
    
    // Check if the toolId is valid
    const tool = mockTools.find(t => t.id === toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // If this is a tracking request for preview
    if (action === 'preview' && typeof userId === 'number') {
      logToolInteraction(userId, toolId, 'preview');
      return res.json({ success: true });
    }
    
    // Check if userId has access to this tool
    const hasAccess = toolAccess.has(toolId) && toolAccess.get(toolId)?.has(userId);
    
    // Free tools are always accessible
    const isFree = tool.price === 'Free to Preview';
    
    return res.json({ 
      hasAccess: hasAccess || isFree,
      isFree 
    });
  });

  // Grant access to a tool (install)
  app.post('/api/tools/access/:toolId', (req: Request, res: Response) => {
    const toolId = parseInt(req.params.toolId);
    const userId = req.user?.id as number || 0;
    
    // Check if the toolId is valid
    const tool = mockTools.find(t => t.id === toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // Grant access
    if (!toolAccess.has(toolId)) {
      toolAccess.set(toolId, new Set());
    }
    
    if (typeof userId === 'number') {
      toolAccess.get(toolId)?.add(userId);
    }
    
    // Log the access interaction
    if (typeof userId === 'number') {
      logToolInteraction(userId, toolId, 'install', { 
        method: 'marketplace',
        toolName: tool.title,
        price: tool.price,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.json({ 
      success: true,
      message: 'Tool installed successfully',
      installationId: Date.now() // Use a timestamp as a simple installation ID
    });
  });
  
  // Revoke access to a tool (uninstall)
  app.delete('/api/tools/access/:toolId', (req: Request, res: Response) => {
    const toolId = parseInt(req.params.toolId);
    const userId = req.user?.id as number || 0;
    
    // Check if the toolId is valid
    const tool = mockTools.find(t => t.id === toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // Revoke access if it exists
    if (toolAccess.has(toolId) && typeof userId === 'number') {
      toolAccess.get(toolId)?.delete(userId);
      
      // Log the uninstall interaction
      logToolInteraction(userId, toolId, 'access', { 
        method: 'uninstall',
        toolName: tool.title,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.json({
      success: true,
      message: 'Tool uninstalled successfully'
    });
  });

  // Get all installed tools for the current user
  app.get('/api/tools/access/installed', (req: Request, res: Response) => {
    const userId = req.user?.id as number || 0;
    
    // Get all tools that the user has access to
    const installedToolIds: number[] = [];
    toolAccess.forEach((users, toolId) => {
      if (users.has(userId)) {
        installedToolIds.push(toolId);
      }
    });
    
    // Get the full tool details for each installed tool
    const installedTools = mockTools
      .filter(tool => installedToolIds.includes(tool.id) || tool.price === 'Free to Preview')
      .map(tool => ({
        id: tool.id,
        title: tool.title,
        description: tool.description,
        installedAt: new Date().toISOString(),
        builder: tool.builder,
        isFree: tool.price === 'Free to Preview'
      }));
    
    res.json({ 
      tools: installedTools,
      count: installedTools.length
    });
  });
  
  // Get tool categories
  app.get('/api/tools/categories', (req: Request, res: Response) => {
    // Extract unique categories from tools' tags
    const categories = new Set<string>();
    
    mockTools.forEach(tool => {
      tool.tags.forEach(tag => categories.add(tag));
    });
    
    res.json(Array.from(categories));
  });

  // Get tools by category
  app.get('/api/tools/category/:category', (req: Request, res: Response) => {
    const category = req.params.category;
    
    const filteredTools = mockTools.filter(tool => 
      tool.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
    );
    
    res.json(filteredTools);
  });
};