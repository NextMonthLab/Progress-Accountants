import { BusinessIdentityService } from "./business-identity";
import { writeTenantScopedData, readTenantScopedData, generateInsightAppUserId, generateTenantEmbedCode } from "../middleware/tenant-scoping";
import crypto from "crypto";

/**
 * Tenant-Scoped Admin Panel Service
 * Implements full multi-tenant participation in Master Unified Architecture
 * ALL operations scoped to tenantId with SOT integration
 */

export interface InsightAppUser {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  inviteSentAt: string;
  insightCount: number;
  isActive: boolean;
  lastSubmissionDate?: string;
}

export interface TenantInsight {
  id: string;
  tenantId: string;
  content: string;
  type: string;
  submittedBy: string;
  submittedAt: string;
  insightAppUserId?: string;
  status: 'pending' | 'reviewed' | 'implemented';
}

export interface TenantBlogPost {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  tags: string[];
  category: string;
}

export interface TenantTheme {
  id: string;
  tenantId: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  customCss?: string;
  isActive: boolean;
}

export interface TenantInnovationIdea {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'in-review' | 'approved' | 'implemented' | 'rejected';
  submittedBy: string;
  estimatedImpact: string;
}

export interface TenantAnalyticsEvent {
  id: string;
  tenantId: string;
  eventType: string;
  eventData: any;
  source: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface TenantAIEvent {
  id: string;
  tenantId: string;
  model: string;
  endpoint: string;
  tokensUsed: number;
  success: boolean;
  responseTime: number;
  userId?: string;
  errorMessage?: string;
}

export interface TenantTool {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: string;
  version: string;
  isEnabled: boolean;
  configuration: any;
  createdBy: string;
}

export class TenantAdminPanelService {
  
  /**
   * INSIGHT APP USER MANAGEMENT - Scoped to tenantId
   */
  
  static async inviteInsightAppUser(tenantId: string, userData: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<InsightAppUser> {
    // Generate unique insight app user ID linked to tenant
    const insightAppUserId = generateInsightAppUserId(tenantId);
    const token = crypto.randomBytes(32).toString('hex');
    
    const insightUser: InsightAppUser = {
      id: insightAppUserId,
      tenantId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      token,
      inviteSentAt: new Date().toISOString(),
      insightCount: 0,
      isActive: true
    };
    
    // Write to SOT under tenant-scoped directory
    await writeTenantScopedData(
      tenantId, 
      'insights', 
      insightUser, 
      `insight-user-${insightAppUserId}.json`
    );
    
    console.log(`[Admin Panel] Insight App User invited for tenant ${tenantId}: ${userData.email}`);
    return insightUser;
  }
  
  static async getInsightAppUsers(tenantId: string): Promise<InsightAppUser[]> {
    // Read all insight users for this tenant from SOT
    return await readTenantScopedData(tenantId, 'insights');
  }
  
  /**
   * INSIGHTS MANAGEMENT - Scoped to tenantId
   */
  
  static async createInsight(tenantId: string, insightData: {
    content: string;
    type: string;
    submittedBy: string;
    insightAppUserId?: string;
  }): Promise<TenantInsight> {
    const insight: TenantInsight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      content: insightData.content,
      type: insightData.type,
      submittedBy: insightData.submittedBy,
      submittedAt: new Date().toISOString(),
      insightAppUserId: insightData.insightAppUserId,
      status: 'pending'
    };
    
    await writeTenantScopedData(tenantId, 'insights', insight);
    console.log(`[Admin Panel] Insight created for tenant ${tenantId}`);
    return insight;
  }
  
  static async getInsights(tenantId: string): Promise<TenantInsight[]> {
    return await readTenantScopedData(tenantId, 'insights');
  }
  
  /**
   * BLOG POSTS MANAGEMENT - Scoped to tenantId
   */
  
  static async createBlogPost(tenantId: string, postData: {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    tags: string[];
    category: string;
  }): Promise<TenantBlogPost> {
    const blogPost: TenantBlogPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      author: postData.author,
      status: 'draft',
      tags: postData.tags,
      category: postData.category
    };
    
    await writeTenantScopedData(tenantId, 'blog-posts', blogPost);
    console.log(`[Admin Panel] Blog post created for tenant ${tenantId}`);
    return blogPost;
  }
  
  static async getBlogPosts(tenantId: string): Promise<TenantBlogPost[]> {
    return await readTenantScopedData(tenantId, 'blog-posts');
  }
  
  /**
   * THEMES MANAGEMENT - Scoped to tenantId
   */
  
  static async createTheme(tenantId: string, themeData: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl?: string;
    customCss?: string;
  }): Promise<TenantTheme> {
    const theme: TenantTheme = {
      id: `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      name: themeData.name,
      primaryColor: themeData.primaryColor,
      secondaryColor: themeData.secondaryColor,
      fontFamily: themeData.fontFamily,
      logoUrl: themeData.logoUrl,
      customCss: themeData.customCss,
      isActive: false
    };
    
    await writeTenantScopedData(tenantId, 'themes', theme);
    console.log(`[Admin Panel] Theme created for tenant ${tenantId}`);
    return theme;
  }
  
  static async getThemes(tenantId: string): Promise<TenantTheme[]> {
    return await readTenantScopedData(tenantId, 'themes');
  }
  
  /**
   * INNOVATION IDEAS MANAGEMENT - Scoped to tenantId
   */
  
  static async createInnovationIdea(tenantId: string, ideaData: {
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    submittedBy: string;
    estimatedImpact: string;
  }): Promise<TenantInnovationIdea> {
    const idea: TenantInnovationIdea = {
      id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      title: ideaData.title,
      description: ideaData.description,
      category: ideaData.category,
      priority: ideaData.priority,
      status: 'submitted',
      submittedBy: ideaData.submittedBy,
      estimatedImpact: ideaData.estimatedImpact
    };
    
    await writeTenantScopedData(tenantId, 'innovation-ideas', idea);
    console.log(`[Admin Panel] Innovation idea created for tenant ${tenantId}`);
    return idea;
  }
  
  static async getInnovationIdeas(tenantId: string): Promise<TenantInnovationIdea[]> {
    return await readTenantScopedData(tenantId, 'innovation-ideas');
  }
  
  /**
   * ANALYTICS EVENTS - Scoped to tenantId
   */
  
  static async logAnalyticsEvent(tenantId: string, eventData: {
    eventType: string;
    eventData: any;
    source: string;
    userId?: string;
    sessionId?: string;
  }): Promise<TenantAnalyticsEvent> {
    const analyticsEvent: TenantAnalyticsEvent = {
      id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      eventType: eventData.eventType,
      eventData: eventData.eventData,
      source: eventData.source,
      timestamp: new Date().toISOString(),
      userId: eventData.userId,
      sessionId: eventData.sessionId
    };
    
    await writeTenantScopedData(tenantId, 'analytics-events', analyticsEvent);
    return analyticsEvent;
  }
  
  static async getAnalyticsEvents(tenantId: string): Promise<TenantAnalyticsEvent[]> {
    return await readTenantScopedData(tenantId, 'analytics-events');
  }
  
  /**
   * AI EVENT LOGGING - Scoped to tenantId
   */
  
  static async logAIEvent(tenantId: string, aiEventData: {
    model: string;
    endpoint: string;
    tokensUsed: number;
    success: boolean;
    responseTime: number;
    userId?: string;
    errorMessage?: string;
  }): Promise<TenantAIEvent> {
    const aiEvent: TenantAIEvent = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      model: aiEventData.model,
      endpoint: aiEventData.endpoint,
      tokensUsed: aiEventData.tokensUsed,
      success: aiEventData.success,
      responseTime: aiEventData.responseTime,
      userId: aiEventData.userId,
      errorMessage: aiEventData.errorMessage
    };
    
    await writeTenantScopedData(tenantId, 'ai-event-log', aiEvent);
    return aiEvent;
  }
  
  static async getAIEvents(tenantId: string): Promise<TenantAIEvent[]> {
    return await readTenantScopedData(tenantId, 'ai-event-log');
  }
  
  /**
   * TOOLS MANAGEMENT - Scoped to tenantId
   */
  
  static async createTool(tenantId: string, toolData: {
    name: string;
    description: string;
    category: string;
    version: string;
    configuration: any;
    createdBy: string;
  }): Promise<TenantTool> {
    const tool: TenantTool = {
      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      name: toolData.name,
      description: toolData.description,
      category: toolData.category,
      version: toolData.version,
      isEnabled: true,
      configuration: toolData.configuration,
      createdBy: toolData.createdBy
    };
    
    await writeTenantScopedData(tenantId, 'tools', tool);
    console.log(`[Admin Panel] Tool created for tenant ${tenantId}`);
    return tool;
  }
  
  static async getTools(tenantId: string): Promise<TenantTool[]> {
    return await readTenantScopedData(tenantId, 'tools');
  }
  
  /**
   * EMBED CODE GENERATION - Scoped to tenantId
   */
  
  static generateEmbedCode(tenantId: string, options?: {
    baseUrl?: string;
    features?: string[];
  }): string {
    const baseUrl = options?.baseUrl || 'https://smart.nextmonth.io';
    const features = options?.features?.join(',') || '';
    
    let embedUrl = `${baseUrl}/embed.js?tenantId=${tenantId}`;
    if (features) {
      embedUrl += `&features=${encodeURIComponent(features)}`;
    }
    
    return `<script src="${embedUrl}" async></script>`;
  }
  
  /**
   * GET ALL TENANTS - Super Admin only
   */
  
  static async getAllTenants(): Promise<any[]> {
    return await BusinessIdentityService.getAllTenants();
  }
  
  /**
   * TENANT DASHBOARD SUMMARY - Scoped to tenantId
   */
  
  static async getTenantDashboardSummary(tenantId: string): Promise<{
    insights: { total: number; pending: number; };
    blogPosts: { total: number; published: number; };
    themes: { total: number; active: number; };
    innovationIdeas: { total: number; pending: number; };
    analyticsEvents: { total: number; todayCount: number; };
    aiEvents: { total: number; successRate: number; };
    tools: { total: number; enabled: number; };
    insightUsers: { total: number; active: number; };
  }> {
    // Get all data for this tenant
    const [insights, blogPosts, themes, ideas, analytics, aiEvents, tools, insightUsers] = await Promise.all([
      this.getInsights(tenantId),
      this.getBlogPosts(tenantId),
      this.getThemes(tenantId),
      this.getInnovationIdeas(tenantId),
      this.getAnalyticsEvents(tenantId),
      this.getAIEvents(tenantId),
      this.getTools(tenantId),
      this.getInsightAppUsers(tenantId)
    ]);
    
    const today = new Date().toISOString().split('T')[0];
    
    return {
      insights: {
        total: insights.length,
        pending: insights.filter(i => i.status === 'pending').length
      },
      blogPosts: {
        total: blogPosts.length,
        published: blogPosts.filter(p => p.status === 'published').length
      },
      themes: {
        total: themes.length,
        active: themes.filter(t => t.isActive).length
      },
      innovationIdeas: {
        total: ideas.length,
        pending: ideas.filter(i => i.status === 'submitted').length
      },
      analyticsEvents: {
        total: analytics.length,
        todayCount: analytics.filter(e => e.timestamp.startsWith(today)).length
      },
      aiEvents: {
        total: aiEvents.length,
        successRate: aiEvents.length > 0 ? aiEvents.filter(e => e.success).length / aiEvents.length : 0
      },
      tools: {
        total: tools.length,
        enabled: tools.filter(t => t.isEnabled).length
      },
      insightUsers: {
        total: insightUsers.length,
        active: insightUsers.filter(u => u.isActive).length
      }
    };
  }
}