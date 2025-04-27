import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cron from 'node-cron';
import { triggerBackup } from './backup';
import { migratePageBuilderTables } from './db-migrate-page-builder';
import { fixPageBuilderTables, addMissingColumns } from './db-migrate-page-builder-fix';
import { migrateVersionControlTables } from './db-migrate-version-control';
import migrateNavigationTables from './db-migrate-navigation';
import { migrateDomainMappingsTables } from './db-migrate-domain-mappings';
import { migrateSotTables } from './db-migrate-sot';
import { migrateAgentTables } from './db-migrate-agent';
import { migrateAiDesignSystemTables } from './db-migrate-ai-design-system';
import { migrateInsightsDashboard } from './db-migrate-insights-dashboard';
import { migrateBlueprintTables } from './db-migrate-blueprint';
import { migrateCrmTables } from './db-migrate-crm';
import { migrateSiteVariantsTables } from './db-migrate-site-variants';
import { migrateOnboardingTables } from './db-migrate-onboarding';
import { registerNavigationRoutes } from './controllers/navigationController';
import { registerDomainMappingRoutes } from './controllers/domainMappingController';
import { registerSotRoutes } from './controllers/sotController';
import { registerAgentRoutes } from './controllers/agentController';
import { registerSocialMediaRoutes } from './controllers/registerSocialMediaRoutes';
import { registerAdvancedSeoRoutes } from './controllers/registerAdvancedSeoRoutes';
import { registerInsightsRoutes } from './controllers/registerInsightsRoutes';
import { registerBlueprintRoutes } from './controllers/blueprintController';
import { registerCrmRoutes } from './controllers/crmController';
import { registerOnboardingRoutes } from './controllers/onboardingController';
import { initScheduler } from './scheduler';

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
    console.log('Running Page Builder fixes...');
    await fixPageBuilderTables();
    await addMissingColumns();
    console.log('Running Version Control migrations...');
    await migrateVersionControlTables();
    console.log('Running Navigation Menu migrations...');
    await migrateNavigationTables();
    console.log('Running Domain Mappings migrations...');
    await migrateDomainMappingsTables();
    console.log('Running SOT migrations...');
    await migrateSotTables();
    console.log('Running Progress Agent migrations...');
    await migrateAgentTables();
    console.log('Running AI Design System migrations...');
    await migrateAiDesignSystemTables();
    console.log('Running Insights Dashboard migrations...');
    await migrateInsightsDashboard();
    console.log('Running Blueprint migrations...');
    await migrateBlueprintTables();
    console.log('Running Starter CRM migrations...');
    await migrateCrmTables();
    console.log('Running Site Variants migrations...');
    await migrateSiteVariantsTables();
    console.log('Running Onboarding migrations...');
    await migrateOnboardingTables();
  } catch (error) {
    console.error('Error running migrations:', error);
  }

  // Register API routes
  const server = await registerRoutes(app);
  
  // Register navigation routes
  registerNavigationRoutes(app);
  
  // Register domain mapping routes
  registerDomainMappingRoutes(app);
  
  // Register SOT routes
  registerSotRoutes(app);
  
  // Register Progress Agent routes
  registerAgentRoutes(app);
  
  // Register Social Media Post Generator routes
  registerSocialMediaRoutes(app);
  
  // Register Advanced SEO Intelligence routes
  registerAdvancedSeoRoutes(app);
  
  // Register Insights Dashboard routes
  registerInsightsRoutes(app);
  
  // Register Blueprint routes
  registerBlueprintRoutes(app);
  
  // Register Starter CRM routes
  registerCrmRoutes(app);
  
  // Register Onboarding routes
  registerOnboardingRoutes(app);

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
    
    // Initialize insights summary scheduler
    initScheduler();
  });
})();
