import type { Express, Request, Response } from "express";
import { db } from "../db";
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
  
  // Newsletter subscription
  app.post('/api/forms/newsletter', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
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
      const tenantId = getTenantId(req);
      
      const result = await db.select()
        .from(caseStudies)
        .where(and(
          eq(caseStudies.tenantId, tenantId),
          eq(caseStudies.status, 'published')
        ))
        .orderBy(desc(caseStudies.publishedAt));
      
      res.json({
        success: true,
        caseStudies: result
      });
    } catch (error) {
      console.error('[SmartSite] Case studies fetch error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch case studies"
      });
    }
  });
  
  // Get latest daily insight
  app.get('/api/public/daily/latest', async (req: Request, res: Response) => {
    try {
      const tenantId = getTenantId(req);
      
      const result = await db.select()
        .from(dailyInsights)
        .where(and(
          eq(dailyInsights.tenantId, tenantId),
          eq(dailyInsights.status, 'active')
        ))
        .orderBy(desc(dailyInsights.insightDate))
        .limit(1);
      
      if (result.length === 0) {
        return res.json({
          success: true,
          insight: null,
          message: "No insights available"
        });
      }
      
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