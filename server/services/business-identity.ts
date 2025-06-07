import { db } from "../db";
import { tenants, users, businessIdentity } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Business Identity Management Service
 * Implements Master Unified Account & Business Architecture
 * ALL data MUST be scoped to tenantId
 */

export interface BusinessProfile {
  businessId: string; // tenantId
  businessName: string;
  industry?: string;
  websiteURL?: string;
  adminUserId: number;
  paymentStatus: "active" | "inactive" | "trial";
  plan: "smart_site_basic" | "smart_site_pro" | "enterprise";
  createdAt: Date;
}

export interface UnifiedJWTPayload {
  userId: number;
  tenantId: string;
  role: "admin" | "editor" | "insightUser" | "labUser" | "devUser";
  exp: number;
}

export class BusinessIdentityService {
  private static SOT_BASE_PATH = process.env.SOT_BASE_PATH || './sot';

  /**
   * Create business profile and write to SOT
   * Used during account creation on NextMonth Home
   */
  static async createBusinessProfile(data: {
    businessName: string;
    industry?: string;
    websiteURL?: string;
    adminEmail: string;
    adminUsername: string;
    adminPassword: string;
    plan?: string;
  }): Promise<{ businessId: string; userId: number }> {
    
    // Create tenant record
    const [tenant] = await db.insert(tenants).values({
      name: data.businessName,
      domain: data.websiteURL || `${data.businessName.toLowerCase().replace(/\s+/g, '-')}.nextmonth.io`,
      industry: data.industry,
      plan: data.plan || "smart_site_basic",
      status: "active"
    }).returning();

    // Create admin user with tenantId
    const [adminUser] = await db.insert(users).values({
      username: data.adminUsername,
      password: data.adminPassword, // Should be hashed by auth layer
      email: data.adminEmail,
      name: data.adminUsername,
      userType: "admin",
      tenantId: tenant.id,
      isSuperAdmin: false
    }).returning();

    // Create business identity record
    await db.insert(businessIdentity).values({
      tenantId: tenant.id,
      name: data.businessName
    });

    // Write to SOT
    await this.writeToSOT(tenant.id, 'identity.json', {
      businessId: tenant.id,
      businessName: data.businessName,
      industry: data.industry,
      websiteURL: data.websiteURL,
      adminUserId: adminUser.id,
      paymentStatus: "active",
      plan: data.plan || "smart_site_basic",
      createdAt: new Date()
    });

    // Write admin user to SOT
    await this.writeToSOT(tenant.id, `users/admin-${adminUser.id}.json`, {
      userId: adminUser.id,
      username: data.adminUsername,
      email: data.adminEmail,
      role: "admin",
      tenantId: tenant.id,
      createdAt: new Date()
    });

    return {
      businessId: tenant.id,
      userId: adminUser.id
    };
  }

  /**
   * Get business profile by tenantId
   */
  static async getBusinessProfile(tenantId: string): Promise<BusinessProfile | null> {
    try {
      // Try to read from SOT first
      const sotData = await this.readFromSOT(tenantId, 'identity.json');
      if (sotData) {
        return sotData as BusinessProfile;
      }

      // Fallback to database
      const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
      if (!tenant) return null;

      const [admin] = await db.select().from(users).where(
        and(eq(users.tenantId, tenantId), eq(users.userType, "admin"))
      );

      return {
        businessId: tenant.id,
        businessName: tenant.name,
        industry: tenant.industry || undefined,
        websiteURL: tenant.domain,
        adminUserId: admin?.id || 0,
        paymentStatus: "active",
        plan: tenant.plan as any || "smart_site_basic",
        createdAt: tenant.createdAt
      };
    } catch (error) {
      console.error('Failed to get business profile:', error);
      return null;
    }
  }

  /**
   * Validate that a tenantId exists and is active
   */
  static async validateTenant(tenantId: string): Promise<boolean> {
    try {
      const [tenant] = await db.select().from(tenants).where(
        and(eq(tenants.id, tenantId), eq(tenants.status, "active"))
      );
      return !!tenant;
    } catch (error) {
      console.error('Failed to validate tenant:', error);
      return false;
    }
  }

  /**
   * Write data to SOT with proper tenant scoping
   */
  static async writeToSOT(tenantId: string, filePath: string, data: any): Promise<void> {
    try {
      const fullPath = path.join(this.SOT_BASE_PATH, 'businesses', tenantId, filePath);
      const directory = path.dirname(fullPath);
      
      // Ensure directory exists
      await fs.mkdir(directory, { recursive: true });
      
      // Write data
      await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
      
      console.log(`[SOT] Written to: /businesses/${tenantId}/${filePath}`);
    } catch (error) {
      console.error(`[SOT] Failed to write to ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Read data from SOT with proper tenant scoping
   */
  static async readFromSOT(tenantId: string, filePath: string): Promise<any | null> {
    try {
      const fullPath = path.join(this.SOT_BASE_PATH, 'businesses', tenantId, filePath);
      const data = await fs.readFile(fullPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or can't be read
      return null;
    }
  }

  /**
   * Scope all analytics data to tenantId
   */
  static async writeAnalyticsEvent(tenantId: string, eventData: any): Promise<void> {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.writeToSOT(tenantId, `analytics-events/${eventId}.json`, {
      ...eventData,
      tenantId,
      eventId,
      timestamp: new Date()
    });
  }

  /**
   * Scope all insights to tenantId
   */
  static async writeInsight(tenantId: string, insightData: any): Promise<void> {
    const insightId = `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.writeToSOT(tenantId, `insights/${insightId}.json`, {
      ...insightData,
      tenantId,
      insightId,
      timestamp: new Date()
    });
  }

  /**
   * Scope all AI events to tenantId
   */
  static async writeAIEvent(tenantId: string, eventData: any): Promise<void> {
    const eventId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.writeToSOT(tenantId, `ai-event-log/${eventId}.json`, {
      ...eventData,
      tenantId,
      eventId,
      timestamp: new Date()
    });
  }

  /**
   * Scope all innovation ideas to tenantId
   */
  static async writeInnovationIdea(tenantId: string, ideaData: any): Promise<void> {
    const ideaId = `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.writeToSOT(tenantId, `innovation-ideas/${ideaId}.json`, {
      ...ideaData,
      tenantId,
      ideaId,
      timestamp: new Date()
    });
  }

  /**
   * Get all tenants for super admin access
   */
  static async getAllTenants(): Promise<BusinessProfile[]> {
    try {
      const allTenants = await db.select().from(tenants).where(eq(tenants.status, "active"));
      
      return Promise.all(allTenants.map(async (tenant) => {
        const [admin] = await db.select().from(users).where(
          and(eq(users.tenantId, tenant.id), eq(users.userType, "admin"))
        );

        return {
          businessId: tenant.id,
          businessName: tenant.name,
          industry: tenant.industry || undefined,
          websiteURL: tenant.domain,
          adminUserId: admin?.id || 0,
          paymentStatus: "active",
          plan: tenant.plan as any || "smart_site_basic",
          createdAt: tenant.createdAt
        };
      }));
    } catch (error) {
      console.error('Failed to get all tenants:', error);
      return [];
    }
  }
}