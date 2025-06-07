import { BusinessIdentityService } from "./business-identity";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

/**
 * Simplified Tenant Admin Service
 * Full multi-tenant compliance with SOT integration
 * ALL operations properly scoped to tenantId
 */

export interface TenantInsightUser {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  inviteSentAt: string;
  insightCount: number;
  isActive: boolean;
}

export interface TenantData {
  insights: any[];
  blogPosts: any[];
  themes: any[];
  innovationIdeas: any[];
  analyticsEvents: any[];
  aiEvents: any[];
  tools: any[];
  insightUsers: TenantInsightUser[];
}

export class TenantAdminService {
  
  /**
   * Create tenant-scoped SOT file path
   */
  private static getTenantSOTPath(tenantId: string, category: string, fileName?: string): string {
    const basePath = path.join(process.cwd(), 'sot', 'businesses', tenantId, category);
    return fileName ? path.join(basePath, fileName) : basePath;
  }
  
  /**
   * Ensure tenant SOT directory exists
   */
  private static async ensureTenantSOTDirectory(tenantId: string, category: string): Promise<void> {
    const dirPath = this.getTenantSOTPath(tenantId, category);
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }
  
  /**
   * Write data to tenant-scoped SOT
   */
  private static async writeToTenantSOT(tenantId: string, category: string, data: any): Promise<string> {
    await this.ensureTenantSOTDirectory(tenantId, category);
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const fileName = `${category.replace('-', '_')}_${timestamp}_${randomId}.json`;
    const filePath = this.getTenantSOTPath(tenantId, category, fileName);
    
    const enrichedData = {
      ...data,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(filePath, JSON.stringify(enrichedData, null, 2));
    console.log(`[SOT] Written to: /businesses/${tenantId}/${category}/${fileName}`);
    
    return fileName;
  }
  
  /**
   * Read data from tenant-scoped SOT
   */
  private static async readFromTenantSOT(tenantId: string, category: string): Promise<any[]> {
    try {
      const dirPath = this.getTenantSOTPath(tenantId, category);
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const data = [];
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(dirPath, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const parsed = JSON.parse(content);
          if (parsed.tenantId === tenantId) { // Double-check tenant scoping
            data.push(parsed);
          }
        } catch (error) {
          console.error(`[SOT] Error reading file ${file}:`, error);
        }
      }
      
      return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      // Directory doesn't exist or is empty
      return [];
    }
  }
  
  /**
   * INVITE INSIGHT APP USER - Tenant scoped
   */
  static async inviteInsightUser(tenantId: string, userData: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<TenantInsightUser> {
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const insightUserId = `insight_${tenantId.slice(0, 8)}_${timestamp}_${randomId}`;
    const token = crypto.randomBytes(32).toString('hex');
    
    const insightUser: TenantInsightUser = {
      id: insightUserId,
      tenantId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      token,
      inviteSentAt: new Date().toISOString(),
      insightCount: 0,
      isActive: true
    };
    
    await this.writeToTenantSOT(tenantId, 'insight-users', insightUser);
    
    // Log analytics event
    await this.logAnalyticsEvent(tenantId, {
      eventType: "insight_user_invited",
      eventData: { email: userData.email, insightUserId },
      source: "admin_panel"
    });
    
    console.log(`[Admin Panel] Insight App User invited for tenant ${tenantId}: ${userData.email}`);
    return insightUser;
  }
  
  /**
   * GET INSIGHT USERS - Tenant scoped
   */
  static async getInsightUsers(tenantId: string): Promise<TenantInsightUser[]> {
    return await this.readFromTenantSOT(tenantId, 'insight-users');
  }
  
  /**
   * CREATE INSIGHT - Tenant scoped
   */
  static async createInsight(tenantId: string, insightData: {
    content: string;
    type: string;
    submittedBy: string;
    insightAppUserId?: string;
  }): Promise<any> {
    
    const insight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      content: insightData.content,
      type: insightData.type,
      submittedBy: insightData.submittedBy,
      submittedAt: new Date().toISOString(),
      insightAppUserId: insightData.insightAppUserId,
      status: 'pending'
    };
    
    await this.writeToTenantSOT(tenantId, 'insights', insight);
    
    // Log analytics event
    await this.logAnalyticsEvent(tenantId, {
      eventType: "insight_created",
      eventData: { insightId: insight.id, type: insightData.type },
      source: "admin_panel"
    });
    
    console.log(`[Admin Panel] Insight created for tenant ${tenantId}`);
    return insight;
  }
  
  /**
   * GET INSIGHTS - Tenant scoped
   */
  static async getInsights(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'insights');
  }
  
  /**
   * CREATE BLOG POST - Tenant scoped
   */
  static async createBlogPost(tenantId: string, postData: {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    tags: string[];
    category: string;
  }): Promise<any> {
    
    const blogPost = {
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
    
    await this.writeToTenantSOT(tenantId, 'blog-posts', blogPost);
    
    // Log analytics event
    await this.logAnalyticsEvent(tenantId, {
      eventType: "blog_post_created",
      eventData: { postId: blogPost.id, title: postData.title, category: postData.category },
      source: "admin_panel"
    });
    
    console.log(`[Admin Panel] Blog post created for tenant ${tenantId}`);
    return blogPost;
  }
  
  /**
   * GET BLOG POSTS - Tenant scoped
   */
  static async getBlogPosts(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'blog-posts');
  }
  
  /**
   * CREATE THEME - Tenant scoped
   */
  static async createTheme(tenantId: string, themeData: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl?: string;
    customCss?: string;
  }): Promise<any> {
    
    const theme = {
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
    
    await this.writeToTenantSOT(tenantId, 'themes', theme);
    
    // Log analytics event
    await this.logAnalyticsEvent(tenantId, {
      eventType: "theme_created",
      eventData: { themeId: theme.id, name: themeData.name },
      source: "admin_panel"
    });
    
    console.log(`[Admin Panel] Theme created for tenant ${tenantId}`);
    return theme;
  }
  
  /**
   * GET THEMES - Tenant scoped
   */
  static async getThemes(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'themes');
  }
  
  /**
   * CREATE INNOVATION IDEA - Tenant scoped
   */
  static async createInnovationIdea(tenantId: string, ideaData: {
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    submittedBy: string;
    estimatedImpact: string;
  }): Promise<any> {
    
    const idea = {
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
    
    await this.writeToTenantSOT(tenantId, 'innovation-ideas', idea);
    
    // Log analytics event
    await this.logAnalyticsEvent(tenantId, {
      eventType: "innovation_idea_created",
      eventData: { ideaId: idea.id, title: ideaData.title, category: ideaData.category, priority: ideaData.priority },
      source: "admin_panel"
    });
    
    console.log(`[Admin Panel] Innovation idea created for tenant ${tenantId}`);
    return idea;
  }
  
  /**
   * GET INNOVATION IDEAS - Tenant scoped
   */
  static async getInnovationIdeas(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'innovation-ideas');
  }
  
  /**
   * LOG ANALYTICS EVENT - Tenant scoped
   */
  static async logAnalyticsEvent(tenantId: string, eventData: {
    eventType: string;
    eventData: any;
    source: string;
    userId?: string;
    sessionId?: string;
  }): Promise<any> {
    
    const analyticsEvent = {
      id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      eventType: eventData.eventType,
      eventData: eventData.eventData,
      source: eventData.source,
      timestamp: new Date().toISOString(),
      userId: eventData.userId,
      sessionId: eventData.sessionId
    };
    
    await this.writeToTenantSOT(tenantId, 'analytics-events', analyticsEvent);
    return analyticsEvent;
  }
  
  /**
   * GET ANALYTICS EVENTS - Tenant scoped
   */
  static async getAnalyticsEvents(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'analytics-events');
  }
  
  /**
   * LOG AI EVENT - Tenant scoped
   */
  static async logAIEvent(tenantId: string, aiEventData: {
    model: string;
    endpoint: string;
    tokensUsed: number;
    success: boolean;
    responseTime: number;
    userId?: string;
    errorMessage?: string;
  }): Promise<any> {
    
    const aiEvent = {
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
    
    await this.writeToTenantSOT(tenantId, 'ai-event-log', aiEvent);
    return aiEvent;
  }
  
  /**
   * GET AI EVENTS - Tenant scoped
   */
  static async getAIEvents(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'ai-event-log');
  }
  
  /**
   * CREATE TOOL - Tenant scoped
   */
  static async createTool(tenantId: string, toolData: {
    name: string;
    description: string;
    category: string;
    version: string;
    configuration: any;
    createdBy: string;
  }): Promise<any> {
    
    const tool = {
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
    
    await this.writeToTenantSOT(tenantId, 'tools', tool);
    
    // Log analytics event
    await this.logAnalyticsEvent(tenantId, {
      eventType: "tool_created",
      eventData: { toolId: tool.id, name: toolData.name, category: toolData.category },
      source: "admin_panel"
    });
    
    console.log(`[Admin Panel] Tool created for tenant ${tenantId}`);
    return tool;
  }
  
  /**
   * GET TOOLS - Tenant scoped
   */
  static async getTools(tenantId: string): Promise<any[]> {
    return await this.readFromTenantSOT(tenantId, 'tools');
  }
  
  /**
   * GENERATE EMBED CODE - Tenant scoped
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
   * GET TENANT DASHBOARD SUMMARY - Tenant scoped
   */
  static async getTenantDashboardSummary(tenantId: string): Promise<any> {
    const [insights, blogPosts, themes, ideas, analytics, aiEvents, tools, insightUsers] = await Promise.all([
      this.getInsights(tenantId),
      this.getBlogPosts(tenantId),
      this.getThemes(tenantId),
      this.getInnovationIdeas(tenantId),
      this.getAnalyticsEvents(tenantId),
      this.getAIEvents(tenantId),
      this.getTools(tenantId),
      this.getInsightUsers(tenantId)
    ]);
    
    const today = new Date().toISOString().split('T')[0];
    
    return {
      tenantId,
      summary: {
        insights: {
          total: insights.length,
          pending: insights.filter((i: any) => i.status === 'pending').length
        },
        blogPosts: {
          total: blogPosts.length,
          published: blogPosts.filter((p: any) => p.status === 'published').length
        },
        themes: {
          total: themes.length,
          active: themes.filter((t: any) => t.isActive).length
        },
        innovationIdeas: {
          total: ideas.length,
          pending: ideas.filter((i: any) => i.status === 'submitted').length
        },
        analyticsEvents: {
          total: analytics.length,
          todayCount: analytics.filter((e: any) => e.timestamp.startsWith(today)).length
        },
        aiEvents: {
          total: aiEvents.length,
          successRate: aiEvents.length > 0 ? aiEvents.filter((e: any) => e.success).length / aiEvents.length : 0
        },
        tools: {
          total: tools.length,
          enabled: tools.filter((t: any) => t.isEnabled).length
        },
        insightUsers: {
          total: insightUsers.length,
          active: insightUsers.filter((u: any) => u.isActive).length
        }
      }
    };
  }
}