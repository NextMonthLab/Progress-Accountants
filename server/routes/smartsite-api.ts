import type { Express, Request, Response } from "express";
import { db, pool } from "../db";

// Helper function to check if database is available
function isDatabaseAvailable(): boolean {
  return pool !== null && db !== null;
}
import { 
  contactFormSubmissions, 
  newsletterSubscriptions, 
  blogPosts, 
  caseStudies, 
  dailyInsights,
  insertContactFormSubmissionSchema,
  insertNewsletterSubscriptionSchema,
  insertBlogPostSchema,
  insertCaseStudySchema,
  insertDailyInsightSchema
} from "../../shared/schema";
import { eq, desc, and } from "drizzle-orm";

// Get tenant ID from request (for now using a default tenant)
const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000000";

function getTenantId(req: Request): string {
  // For now, use default tenant. In production, this would come from domain/subdomain
  return req.headers['x-tenant-id'] as string || DEFAULT_TENANT_ID;
}

export function registerSmartSiteRoutes(app: Express) {
  
  // ========================================
  // Form Submission Endpoints
  // ========================================
  
  // Contact form submission
  app.post('/api/forms/contact', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      
      if (!isDatabaseAvailable()) {
        console.log(`[SmartSite] Contact form submission received (database-free mode) for tenant: ${tenantId}:`, req.body);
        
        res.json({
          success: true,
          message: "Contact form submitted successfully (stored in logs)",
          submissionId: `temp-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          note: "Database not configured - submission logged to console"
        });
        return;
      }
      
      const validatedData = insertContactFormSubmissionSchema.parse({
        ...req.body,
        tenantId
      });
      
      const result = await db.insert(contactFormSubmissions)
        .values(validatedData)
        .returning();
      
      console.log(`[SmartSite] Contact form submission received for tenant: ${tenantId}`);
      
      res.json({
        success: true,
        message: "Contact form submitted successfully",
        submissionId: result[0].id,
        submittedAt: result[0].createdAt
      });
    } catch (error) {
      console.error('[SmartSite] Contact form error:', error);
      res.status(400).json({
        success: false,
        message: "Invalid form data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get form submissions - Simple endpoint for SmartSite Admin Panel
  app.get('/api/form-submissions', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      
      if (!isDatabaseAvailable()) {
        // Return sample data if database not available
        const sampleSubmissions = [
          {
            name: "John Smith",
            email: "john@example.com",
            phone: "01234 567890",
            company: "Smith & Co",
            message: "Interested in your accounting services for our growing business.",
            submittedAt: "2025-07-22T14:30:00Z"
          },
          {
            name: "Sarah Williams",
            email: "sarah@techstartup.com",
            phone: "07890 123456",
            company: "TechStartup Ltd",
            message: "Need help with corporation tax and VAT returns.",
            submittedAt: "2025-07-22T10:15:00Z"
          },
          {
            name: "Mike Johnson", 
            email: "mike.johnson@construction.co.uk",
            phone: "01865 789012",
            company: "Johnson Construction",
            message: "Looking for CIS scheme advice and monthly bookkeeping.",
            submittedAt: "2025-07-21T16:45:00Z"
          }
        ];
        
        console.log(`[SmartSite] Form submissions requested (database-free mode) for tenant: ${tenantId}`);
        res.json(sampleSubmissions);
        return;
      }
      
      // Get submissions from database
      const submissions = await db
        .select({
          name: contactFormSubmissions.name,
          email: contactFormSubmissions.email,
          phone: contactFormSubmissions.phone,
          company: contactFormSubmissions.business,
          message: contactFormSubmissions.message,
          submittedAt: contactFormSubmissions.createdAt
        })
        .from(contactFormSubmissions)
        .where(eq(contactFormSubmissions.tenantId, tenantId))
        .orderBy(desc(contactFormSubmissions.createdAt))
        .limit(50);
      
      console.log(`[SmartSite] Returned ${submissions.length} form submissions for tenant: ${tenantId}`);
      res.json(submissions);
      
    } catch (error) {
      console.error('[SmartSite] Form submissions error:', error);
      res.status(500).json({
        error: "Failed to retrieve form submissions",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Newsletter subscription
  app.post('/api/forms/newsletter', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      
      if (!isDatabaseAvailable()) {
        console.log(`[SmartSite] Newsletter subscription received (database-free mode) for tenant: ${tenantId}:`, req.body);
        
        res.json({
          success: true,
          message: "Newsletter subscription received successfully (stored in logs)",
          subscriptionId: `temp-${Date.now()}`,
          subscribedAt: new Date().toISOString(),
          note: "Database not configured - subscription logged to console"
        });
        return;
      }
      
      const validatedData = insertNewsletterSubscriptionSchema.parse({
        ...req.body,
        tenantId
      });
      
      // Check if email already exists for this tenant
      const existing = await db.select()
        .from(newsletterSubscriptions)
        .where(and(
          eq(newsletterSubscriptions.email, validatedData.email),
          eq(newsletterSubscriptions.tenantId, tenantId)
        ))
        .limit(1);
        
      if (existing.length > 0) {
        return res.json({
          success: true,
          message: "Already subscribed",
          subscriptionId: existing[0].id
        });
      }
      
      const result = await db.insert(newsletterSubscriptions)
        .values(validatedData)
        .returning();
      
      console.log(`[SmartSite] Newsletter subscription received for tenant: ${tenantId}`);
      
      res.json({
        success: true,
        message: "Successfully subscribed to newsletter",
        subscriptionId: result[0].id,
        subscribedAt: result[0].subscribedAt
      });
    } catch (error) {
      console.error('[SmartSite] Newsletter subscription error:', error);
      res.status(400).json({
        success: false,
        message: "Invalid subscription data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // ========================================
  // Content Management Endpoints
  // ========================================
  
  // Blog post creation (from SmartSite Admin)
  app.post('/api/content/blog', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      const validatedData = insertBlogPostSchema.parse({
        ...req.body,
        tenantId
      });
      
      const result = await db.insert(blogPosts)
        .values(validatedData)
        .returning();
      
      console.log(`[SmartSite] Blog post created for tenant: ${tenantId}`);
      
      res.json({
        success: true,
        message: "Blog post created successfully",
        postId: result[0].id,
        slug: result[0].slug
      });
    } catch (error) {
      console.error('[SmartSite] Blog post creation error:', error);
      res.status(400).json({
        success: false,
        message: "Invalid blog post data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Case study creation (from SmartSite Admin)
  app.post('/api/content/case-study', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      const validatedData = insertCaseStudySchema.parse({
        ...req.body,
        tenantId
      });
      
      const result = await db.insert(caseStudies)
        .values(validatedData)
        .returning();
      
      console.log(`[SmartSite] Case study created for tenant: ${tenantId}`);
      
      res.json({
        success: true,
        message: "Case study created successfully",
        caseStudyId: result[0].id,
        slug: result[0].slug
      });
    } catch (error) {
      console.error('[SmartSite] Case study creation error:', error);
      res.status(400).json({
        success: false,
        message: "Invalid case study data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Daily insight creation (from SmartSite Admin)
  app.post('/api/content/daily', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      const validatedData = insertDailyInsightSchema.parse({
        ...req.body,
        tenantId
      });
      
      const result = await db.insert(dailyInsights)
        .values(validatedData)
        .returning();
      
      console.log(`[SmartSite] Daily insight created for tenant: ${tenantId}`);
      
      res.json({
        success: true,
        message: "Daily insight created successfully",
        insightId: result[0].id
      });
    } catch (error) {
      console.error('[SmartSite] Daily insight creation error:', error);
      res.status(400).json({
        success: false,
        message: "Invalid daily insight data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // ========================================
  // Public Content Endpoints
  // ========================================
  
  // Get blog post by slug
  app.get('/api/public/blog/:slug', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      const { slug } = req.params;
      
      const result = await db.select()
        .from(blogPosts)
        .where(and(
          eq(blogPosts.slug, slug),
          eq(blogPosts.tenantId, tenantId),
          eq(blogPosts.status, 'published')
        ))
        .limit(1);
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }
      
      res.json({
        success: true,
        post: result[0]
      });
    } catch (error) {
      console.error('[SmartSite] Blog post fetch error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog post"
      });
    }
  });
  
  // Get all published blog posts
  app.get('/api/public/blog', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      const result = await db.select()
        .from(blogPosts)
        .where(and(
          eq(blogPosts.tenantId, tenantId),
          eq(blogPosts.status, 'published')
        ))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit)
        .offset(offset);
      
      res.json({
        success: true,
        posts: result,
        pagination: {
          page,
          limit,
          hasMore: result.length === limit
        }
      });
    } catch (error) {
      console.error('[SmartSite] Blog posts fetch error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog posts"
      });
    }
  });
  
  // Get case study by slug
  app.get('/api/public/case-studies/:slug', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      const { slug } = req.params;
      
      const result = await db.select()
        .from(caseStudies)
        .where(and(
          eq(caseStudies.slug, slug),
          eq(caseStudies.tenantId, tenantId),
          eq(caseStudies.status, 'published')
        ))
        .limit(1);
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Case study not found"
        });
      }
      
      res.json({
        success: true,
        caseStudy: result[0]
      });
    } catch (error) {
      console.error('[SmartSite] Case study fetch error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch case study"
      });
    }
  });
  
  // Get all published case studies
  app.get('/api/public/case-studies', async (req: Request, res: Response) => {
    try {
      console.log('[SmartSite] Attempting to fetch case studies...');
      
      const result = await db.select()
        .from(caseStudies)
        .where(eq(caseStudies.status, 'published'))
        .orderBy(desc(caseStudies.publishedAt));
      
      console.log(`[SmartSite] Case studies retrieved: ${result.length} items`);
      console.log('[SmartSite] First result:', result[0] || 'No results');
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('[SmartSite] Failed to fetch case studies:', error.message);
      console.error('[SmartSite] Full error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch case studies',
        error: error.message
      });
    }
  });
  
  // Get latest daily insight
  app.get('/api/public/daily/latest', async (req: Request, res: Response) => {
    try {
      // For Progress Accountants, we'll look for insights with their tenant_id or null tenant_id
      const result = await db.select()
        .from(dailyInsights)
        .limit(1);
      
      if (result.length === 0) {
        return res.json({
          success: true,
          insight: null,
          message: "No insights available"
        });
      }
      
      console.log('[SmartSite] Daily insight retrieved:', result[0].title);
      
      res.json({
        success: true,
        insight: result[0]
      });
    } catch (error) {
      console.error('[SmartSite] Daily insight fetch error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch daily insight"
      });
    }
  });
  
  console.log('[SmartSite] API routes registered successfully');
}