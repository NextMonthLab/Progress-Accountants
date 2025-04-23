import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cron from 'node-cron';
import { triggerBackup } from './backup';
import { migratePageBuilderTables } from './db-migrate-page-builder';
import { migrateVersionControlTables } from './db-migrate-version-control';
import migrateNavigationTables from './db-migrate-navigation';
import { migrateDomainMappingsTables } from './db-migrate-domain-mappings';
import { registerNavigationRoutes } from './controllers/navigationController';
import { registerDomainMappingRoutes } from './controllers/domainMappingController';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run database migrations
  try {
    console.log('Running Page Builder migrations...');
    await migratePageBuilderTables();
    console.log('Running Version Control migrations...');
    await migrateVersionControlTables();
    console.log('Running Navigation Menu migrations...');
    await migrateNavigationTables();
    console.log('Running Domain Mappings migrations...');
    await migrateDomainMappingsTables();
  } catch (error) {
    console.error('Error running migrations:', error);
  }

  // Register API routes
  const server = await registerRoutes(app);
  
  // Register navigation routes
  registerNavigationRoutes(app);
  
  // Register domain mapping routes
  registerDomainMappingRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Schedule daily backup at 6pm UTC (18:00)
    cron.schedule('0 18 * * *', async () => {
      log('Running scheduled backup...');
      await triggerBackup();
    });
    
    log('Backup scheduler initialized');
  });
})();
