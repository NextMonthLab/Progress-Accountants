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