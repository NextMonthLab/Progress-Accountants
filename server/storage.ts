import { 
  users, 
  type User, 
  type InsertUser,
  businessIdentity,
  type BusinessIdentity,
  type InsertBusinessIdentity,
  projectContext,
  type ProjectContext,
  type InsertProjectContext,
  modules,
  type Module,
  type InsertModule,
  featureRequests,
  type FeatureRequest,
  type InsertFeatureRequest,
  contactSubmissions,
  type ContactSubmission,
  type InsertContactSubmission,
  activityLogs,
  type ActivityLog,
  type InsertActivityLog,
  onboardingState,
  type OnboardingState,
  type InsertOnboardingState,
  moduleActivations,
  type ModuleActivation,
  type InsertModuleActivation,
  pageComplexityTriage,
  type PageComplexityTriage,
  tenants,
  type Tenant,
  type InsertTenant,
  type TenantCustomization,
  type InsertPageComplexityTriage,
  seoConfigurations,
  type SeoConfiguration,
  type InsertSeoConfiguration,
  brandVersions,
  type BrandVersion,
  type InsertBrandVersion,
  clientRegistry,
  type ClientRegistry,
  type InsertClientRegistry,
  blueprintVersions,
  tools,
  type Tool,
  type InsertTool,
  toolRequests,
  type ToolRequest,
  type InsertToolRequest,
  pageToolIntegrations,
  type PageToolIntegration,
  type InsertPageToolIntegration,
  blogPosts,
  type BlogPost,
  type InsertBlogPost,
  blogPages,
  type BlogPage,
  type InsertBlogPage,
  integrationRequests,
  type IntegrationRequest,
  type InsertIntegrationRequest,
  companionConfig,
  type CompanionConfig,
  type InsertCompanionConfig
} from "@shared/schema";
import { PageMetadata, PageComplexityAssessment } from "@shared/page_metadata";
import { 
  sotDeclarations, 
  sotMetrics, 
  sotSyncLogs,
  type SotDeclaration,
  type InsertSotDeclaration,
  type SotMetric,
  type InsertSotMetric,
  type SotSyncLog,
  type InsertSotSyncLog
} from "@shared/sot";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import crypto from "crypto";

// Define the payload types for feature requests
type StandardPayload = {
  screen_name: string;
  description: string;
  features: string[];
};

type ModulePayload = {
  screen_name: string;
  description: string;
  status: 'complete' | 'CPT_ready' | 'designed' | 'dev_in_progress' | string;
  business_id: string;
  zone?: string;
  tags?: string[];
};

// Enhanced IStorage interface with comprehensive CRUD operations
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tenant operations
  getTenant(id: string): Promise<Tenant | undefined>;
  getTenantByDomain(domain: string): Promise<Tenant | undefined>;
  saveTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | undefined>;
  getTenantCustomization(tenantId: string): Promise<TenantCustomization | undefined>;
  updateTenantCustomization(tenantId: string, customization: TenantCustomization): Promise<TenantCustomization | undefined>;
  
  // Business identity operations
  getBusinessIdentity(): Promise<BusinessIdentity | undefined>;
  saveBusinessIdentity(data: InsertBusinessIdentity): Promise<BusinessIdentity>;
  
  // Project context operations
  getProjectContext(): Promise<ProjectContext | undefined>;
  saveProjectContext(data: InsertProjectContext): Promise<ProjectContext>;
  
  // Onboarding state operations
  getOnboardingState(userId: number): Promise<OnboardingState | undefined>;
  getOnboardingStageState(userId: number, stage: string): Promise<OnboardingState | undefined>;
  saveOnboardingState(data: InsertOnboardingState): Promise<OnboardingState>;
  updateOnboardingStatus(userId: number, stage: string, status: string, data?: any): Promise<OnboardingState | undefined>;
  markOnboardingStageComplete(userId: number, stage: string, data?: any): Promise<OnboardingState | undefined>;
  getIncompleteOnboarding(userId: number): Promise<OnboardingState | undefined>;
  markGuardianSynced(id: number, synced: boolean): Promise<OnboardingState | undefined>;
  saveOnboardingPreference(userId: number, preference: string): Promise<OnboardingState | undefined>;
  
  // Module operations
  getModule(id: string): Promise<Module | undefined>;
  getAllModules(): Promise<Module[]>;
  getModulesByCategory(category: string): Promise<Module[]>;
  saveModule(module: InsertModule): Promise<Module>;
  updateModuleStatus(id: string, status: string): Promise<Module | undefined>;
  
  // Feature request operations
  saveFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest>;
  getFeatureRequests(): Promise<FeatureRequest[]>;
  updateFeatureRequestStatus(id: number, status: string): Promise<FeatureRequest | undefined>;
  
  // Contact operations
  saveContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Activity logging
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(userId?: number, limit?: number): Promise<ActivityLog[]>;
  
  // Module activation logging
  logModuleActivation(activation: InsertModuleActivation): Promise<ModuleActivation>;
  getModuleActivations(userId?: number, moduleId?: string): Promise<ModuleActivation[]>;
  markModuleActivationSynced(id: number, synced: boolean): Promise<ModuleActivation | undefined>;
  
  // Page complexity triage
  savePageComplexityTriage(triage: InsertPageComplexityTriage): Promise<PageComplexityTriage>;
  getPageComplexityTriage(id: number): Promise<PageComplexityTriage | undefined>;
  getPageComplexityTriagesByUser(userId: number): Promise<PageComplexityTriage[]>;
  updatePageComplexitySyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<PageComplexityTriage | undefined>;
  
  // SEO Configuration operations
  getSeoConfiguration(routePath: string): Promise<SeoConfiguration | undefined>;
  getAllSeoConfigurations(): Promise<SeoConfiguration[]>;
  saveSeoConfiguration(config: InsertSeoConfiguration): Promise<SeoConfiguration>;
  updateSeoConfiguration(id: number, config: Partial<InsertSeoConfiguration>): Promise<SeoConfiguration | undefined>;
  deleteSeoConfiguration(id: number): Promise<boolean>;
  getSeoConfigurationsByStatus(indexable: boolean): Promise<SeoConfiguration[]>;
  updateSeoSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<SeoConfiguration | undefined>;
  updateSeoConfigPriorities(priorities: { id: number, priority: number }[]): Promise<SeoConfiguration[]>;
  
  // Brand Versioning operations
  getBrandVersion(id: number): Promise<BrandVersion | undefined>;
  getBrandVersionByNumber(versionNumber: string): Promise<BrandVersion | undefined>;
  getActiveBrandVersion(): Promise<BrandVersion | undefined>;
  getAllBrandVersions(): Promise<BrandVersion[]>;
  saveBrandVersion(version: InsertBrandVersion): Promise<BrandVersion>;
  activateBrandVersion(id: number): Promise<BrandVersion | undefined>;
  updateBrandSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<BrandVersion | undefined>;
  
  // Tool operations
  getTool(id: number, tenantId?: string): Promise<Tool | undefined>;
  getToolsByType(toolType: string, tenantId?: string): Promise<Tool[]>;
  getToolsByStatus(status: string, tenantId?: string): Promise<Tool[]>;
  getToolsByUser(userId: number, tenantId?: string): Promise<Tool[]>;
  getToolsByTenant(tenantId: string): Promise<Tool[]>;
  saveTool(tool: InsertTool): Promise<Tool>;
  updateToolStatus(id: number, status: string, tenantId?: string): Promise<Tool | undefined>;
  updateTool(id: number, data: Partial<InsertTool>, tenantId?: string): Promise<Tool | undefined>;
  deleteTool(id: number, tenantId?: string): Promise<boolean>;
  
  // Tool Request operations
  saveToolRequest(request: InsertToolRequest): Promise<ToolRequest>;
  getToolRequestsByStatus(status: string): Promise<ToolRequest[]>;
  updateToolRequestStatus(id: number, status: string, processedAt?: Date): Promise<ToolRequest | undefined>;
  
  // Page-Tool Integration operations
  getPageToolIntegrations(pageId: string): Promise<PageToolIntegration[]>;
  getToolIntegrations(toolId: number): Promise<PageToolIntegration[]>;
  savePageToolIntegration(integration: InsertPageToolIntegration): Promise<PageToolIntegration>;
  updatePageToolIntegration(id: number, data: Partial<InsertPageToolIntegration>): Promise<PageToolIntegration | undefined>;
  deletePageToolIntegration(id: number): Promise<boolean>;
  
  // Blog page operations
  getBlogPages(tenantId?: string): Promise<BlogPage[]>;
  getBlogPage(id: number): Promise<BlogPage | undefined>;
  getBlogPageBySlug(slug: string, tenantId?: string): Promise<BlogPage | undefined>;
  createBlogPage(page: InsertBlogPage): Promise<BlogPage>;
  updateBlogPage(id: number, data: Partial<BlogPage>): Promise<BlogPage | undefined>;
  deleteBlogPage(id: number): Promise<boolean>;
  
  // Blog post operations
  getBlogPosts(tenantId?: string): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string, tenantId?: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Integration request operations
  getIntegrationRequests(tenantId?: string): Promise<IntegrationRequest[]>;
  getIntegrationRequest(id: number): Promise<IntegrationRequest | undefined>;
  createIntegrationRequest(request: InsertIntegrationRequest): Promise<IntegrationRequest>;
  updateIntegrationRequest(id: number, data: Partial<IntegrationRequest>): Promise<IntegrationRequest | undefined>;
  deleteIntegrationRequest(id: number): Promise<boolean>;
  
  // Companion Config operations
  getCompanionConfig(tenantId: string): Promise<CompanionConfig | undefined>;
  createCompanionConfig(config: InsertCompanionConfig): Promise<CompanionConfig>;
  updateCompanionConfig(id: number, data: Partial<InsertCompanionConfig>): Promise<CompanionConfig | undefined>;
  
  // Blueprint Export operations
  getClientRegistry(): Promise<ClientRegistry | undefined>;
  createClientRegistry(data: InsertClientRegistry): Promise<ClientRegistry>;
  updateClientRegistry(clientId: string, data: Partial<InsertClientRegistry>): Promise<ClientRegistry | undefined>;
  updateExportableModules(clientId: string, moduleList: any[]): Promise<ClientRegistry | undefined>;
  markAsExportReady(clientId: string, exportReady: boolean): Promise<ClientRegistry | undefined>;
  updateHandoffStatus(clientId: string, status: string): Promise<ClientRegistry | undefined>;

  // SOT (Single Source of Truth) operations
  getSotDeclaration(): Promise<SotDeclaration | undefined>;
  saveSotDeclaration(data: InsertSotDeclaration): Promise<SotDeclaration>;
  updateSotDeclaration(id: number, data: Partial<InsertSotDeclaration>): Promise<SotDeclaration | undefined>;
  getSotMetrics(): Promise<SotMetric | undefined>;
  saveSotMetrics(data: InsertSotMetric): Promise<SotMetric>;
  updateSotMetrics(id: number, data: Partial<InsertSotMetric>): Promise<SotMetric | undefined>;
  logSotSync(eventType: string, status: string, details?: string): Promise<SotSyncLog>;
  countPages(): Promise<number>;
  getSotSyncLogs(limit?: number): Promise<SotSyncLog[]>;
}

// Database-backed implementation of IStorage
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool: db.$client,
      createTableIfMissing: true 
    });
  }
  
  // Tenant operations
  async getTenant(id: string): Promise<Tenant | undefined> {
    try {
      const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
      return tenant;
    } catch (error) {
      console.error(`Error fetching tenant with id ${id}:`, error);
      return undefined;
    }
  }

  async getTenantByDomain(domain: string): Promise<Tenant | undefined> {
    try {
      const [tenant] = await db.select().from(tenants).where(eq(tenants.domain, domain));
      return tenant;
    } catch (error) {
      console.error(`Error fetching tenant with domain ${domain}:`, error);
      return undefined;
    }
  }

  async saveTenant(tenant: InsertTenant): Promise<Tenant> {
    try {
      const [savedTenant] = await db.insert(tenants).values(tenant).returning();
      return savedTenant;
    } catch (error) {
      console.error("Error saving tenant:", error);
      throw error;
    }
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | undefined> {
    try {
      const [updatedTenant] = await db
        .update(tenants)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(tenants.id, id))
        .returning();
      return updatedTenant;
    } catch (error) {
      console.error(`Error updating tenant with id ${id}:`, error);
      return undefined;
    }
  }

  async getTenantCustomization(tenantId: string): Promise<TenantCustomization | undefined> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant || !tenant.customization) {
        return undefined;
      }
      
      return tenant.customization as TenantCustomization;
    } catch (error) {
      console.error(`Error fetching customization for tenant ${tenantId}:`, error);
      return undefined;
    }
  }

  async updateTenantCustomization(tenantId: string, customization: TenantCustomization): Promise<TenantCustomization | undefined> {
    try {
      const [updatedTenant] = await db
        .update(tenants)
        .set({ 
          customization: customization,
          updatedAt: new Date() 
        })
        .where(eq(tenants.id, tenantId))
        .returning();
      
      if (!updatedTenant) {
        return undefined;
      }
      
      return updatedTenant.customization as TenantCustomization;
    } catch (error) {
      console.error(`Error updating customization for tenant ${tenantId}:`, error);
      return undefined;
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return createdUser;
  }

  // Business identity operations
  async getBusinessIdentity(): Promise<BusinessIdentity | undefined> {
    const [identity] = await db.select().from(businessIdentity);
    return identity;
  }

  async saveBusinessIdentity(data: InsertBusinessIdentity): Promise<BusinessIdentity> {
    const [identity] = await db
      .insert(businessIdentity)
      .values(data)
      .returning();
    return identity;
  }

  // Project context operations
  async getProjectContext(): Promise<ProjectContext | undefined> {
    const [context] = await db.select().from(projectContext);
    return context;
  }

  async saveProjectContext(data: InsertProjectContext): Promise<ProjectContext> {
    const [context] = await db
      .insert(projectContext)
      .values(data)
      .returning();
    return context;
  }

  // Feature request operations
  async saveFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest> {
    const [savedRequest] = await db
      .insert(featureRequests)
      .values(request)
      .returning();
    return savedRequest;
  }

  async getFeatureRequests(): Promise<FeatureRequest[]> {
    return db.select().from(featureRequests).orderBy(desc(featureRequests.createdAt));
  }

  async updateFeatureRequestStatus(id: number, status: string): Promise<FeatureRequest | undefined> {
    const [updatedRequest] = await db
      .update(featureRequests)
      .set({ 
        status: status,
        updatedAt: new Date()
      })
      .where(eq(featureRequests.id, id))
      .returning();
    return updatedRequest;
  }

  // Contact form submission operations
  async saveContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        ...data,
        date: new Date()
      })
      .returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.date));
  }

  // Activity logging
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values({
        ...activity,
        timestamp: new Date()
      })
      .returning();
    return log;
  }

  async getActivityLogs(userId?: number, limit?: number): Promise<ActivityLog[]> {
    let query = db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.timestamp));
    
    if (userId) {
      query = query.where(eq(activityLogs.userId, userId));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return query;
  }

  // Module operations
  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db
      .select()
      .from(modules)
      .where(eq(modules.id, id));
    return module;
  }

  async getAllModules(): Promise<Module[]> {
    return db.select().from(modules);
  }

  async getModulesByCategory(category: string): Promise<Module[]> {
    return db
      .select()
      .from(modules)
      .where(eq(modules.category, category));
  }

  async saveModule(module: InsertModule): Promise<Module> {
    const [savedModule] = await db
      .insert(modules)
      .values(module)
      .returning();
    return savedModule;
  }

  async updateModuleStatus(id: string, status: string): Promise<Module | undefined> {
    const [updatedModule] = await db
      .update(modules)
      .set({ 
        status: status,
        updatedAt: new Date()
      })
      .where(eq(modules.id, id))
      .returning();
    return updatedModule;
  }

  // Module activation logging
  async logModuleActivation(activation: InsertModuleActivation): Promise<ModuleActivation> {
    const [log] = await db
      .insert(moduleActivations)
      .values({
        ...activation,
        activatedAt: new Date()
      })
      .returning();
    return log;
  }

  async getModuleActivations(userId?: number, moduleId?: string): Promise<ModuleActivation[]> {
    let query = db
      .select()
      .from(moduleActivations)
      .orderBy(desc(moduleActivations.activatedAt));
    
    if (userId) {
      query = query.where(eq(moduleActivations.userId, userId));
    }
    
    if (moduleId) {
      query = query.where(eq(moduleActivations.moduleId, moduleId));
    }
    
    return query;
  }

  async markModuleActivationSynced(id: number, synced: boolean): Promise<ModuleActivation | undefined> {
    const [updated] = await db
      .update(moduleActivations)
      .set({ 
        syncedWithSot: synced,
        updatedAt: new Date()
      })
      .where(eq(moduleActivations.id, id))
      .returning();
    return updated;
  }

  // Onboarding state operations
  async getOnboardingState(userId: number): Promise<OnboardingState | undefined> {
    const states = await db
      .select()
      .from(onboardingState)
      .where(eq(onboardingState.userId, userId))
      .orderBy(desc(onboardingState.updatedAt));
    
    return states[0];
  }

  async getOnboardingStageState(userId: number, stage: string): Promise<OnboardingState | undefined> {
    const [state] = await db
      .select()
      .from(onboardingState)
      .where(
        and(
          eq(onboardingState.userId, userId),
          eq(onboardingState.stage, stage)
        )
      )
      .orderBy(desc(onboardingState.updatedAt));
    
    return state;
  }

  async saveOnboardingState(data: InsertOnboardingState): Promise<OnboardingState> {
    const [state] = await db
      .insert(onboardingState)
      .values({
        ...data,
        checkpointTime: new Date()
      })
      .returning();
    return state;
  }

  async updateOnboardingStatus(userId: number, stage: string, status: string, data?: any): Promise<OnboardingState | undefined> {
    // First, check if the onboarding state exists
    const existing = await this.getOnboardingStageState(userId, stage);
    
    if (existing) {
      // Update existing state
      const [updated] = await db
        .update(onboardingState)
        .set({ 
          status: status,
          data: data || existing.data,
          updatedAt: new Date(),
          checkpointTime: new Date()
        })
        .where(eq(onboardingState.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new state
      return this.saveOnboardingState({
        userId,
        stage,
        status,
        data: data || {},
        recoveryToken: crypto.randomBytes(32).toString('hex')
      });
    }
  }

  async markOnboardingStageComplete(userId: number, stage: string, data?: any): Promise<OnboardingState | undefined> {
    return this.updateOnboardingStatus(userId, stage, 'completed', data);
  }

  async getIncompleteOnboarding(userId: number): Promise<OnboardingState | undefined> {
    const states = await db
      .select()
      .from(onboardingState)
      .where(
        and(
          eq(onboardingState.userId, userId),
          eq(onboardingState.status, 'in_progress')
        )
      )
      .orderBy(desc(onboardingState.updatedAt));
    
    return states[0];
  }

  async markSotSynced(id: number, synced: boolean): Promise<OnboardingState | undefined> {
    const [updated] = await db
      .update(onboardingState)
      .set({ 
        sotSynced: synced,
        updatedAt: new Date()
      })
      .where(eq(onboardingState.id, id))
      .returning();
    return updated;
  }

  async saveOnboardingPreference(userId: number, preference: string): Promise<OnboardingState | undefined> {
    // Get the most recent onboarding state
    const state = await this.getOnboardingState(userId);
    
    if (!state) {
      return undefined;
    }
    
    // Update with the preference
    const [updated] = await db
      .update(onboardingState)
      .set({ 
        data: {
          ...state.data,
          preferredSetup: preference
        },
        updatedAt: new Date()
      })
      .where(eq(onboardingState.id, state.id))
      .returning();
    
    return updated;
  }

  // Page complexity triage operations
  async savePageComplexityTriage(triage: InsertPageComplexityTriage): Promise<PageComplexityTriage> {
    const [saved] = await db
      .insert(pageComplexityTriage)
      .values({
        ...triage,
        triageTimestamp: new Date()
      })
      .returning();
    return saved;
  }

  async getPageComplexityTriage(id: number): Promise<PageComplexityTriage | undefined> {
    const [triage] = await db
      .select()
      .from(pageComplexityTriage)
      .where(eq(pageComplexityTriage.id, id));
    return triage;
  }

  async getPageComplexityTriagesByUser(userId: number): Promise<PageComplexityTriage[]> {
    return db
      .select()
      .from(pageComplexityTriage)
      .where(eq(pageComplexityTriage.userId, userId))
      .orderBy(desc(pageComplexityTriage.triageTimestamp));
  }

  async updatePageComplexitySyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<PageComplexityTriage | undefined> {
    const updateData: any = { updatedAt: new Date() };
    
    if (vaultSynced !== undefined) {
      updateData.vaultSynced = vaultSynced;
    }
    
    if (guardianSynced !== undefined) {
      updateData.guardianSynced = guardianSynced;
    }
    
    const [updated] = await db
      .update(pageComplexityTriage)
      .set(updateData)
      .where(eq(pageComplexityTriage.id, id))
      .returning();
    
    return updated;
  }

  // SEO Configuration operations
  async getSeoConfiguration(routePath: string): Promise<SeoConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(seoConfigurations)
      .where(eq(seoConfigurations.routePath, routePath));
    
    return config;
  }

  async getAllSeoConfigurations(): Promise<SeoConfiguration[]> {
    return db
      .select()
      .from(seoConfigurations)
      .orderBy(asc(seoConfigurations.routePath));
  }

  async saveSeoConfiguration(config: InsertSeoConfiguration): Promise<SeoConfiguration> {
    const [savedConfig] = await db
      .insert(seoConfigurations)
      .values(config)
      .returning();
    
    return savedConfig;
  }

  async updateSeoConfiguration(id: number, config: Partial<InsertSeoConfiguration>): Promise<SeoConfiguration | undefined> {
    const [updatedConfig] = await db
      .update(seoConfigurations)
      .set({ 
        ...config,
        updatedAt: new Date()
      })
      .where(eq(seoConfigurations.id, id))
      .returning();
    
    return updatedConfig;
  }

  async deleteSeoConfiguration(id: number): Promise<boolean> {
    const result = await db
      .delete(seoConfigurations)
      .where(eq(seoConfigurations.id, id));
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getSeoConfigurationsByStatus(indexable: boolean): Promise<SeoConfiguration[]> {
    return db
      .select()
      .from(seoConfigurations)
      .where(eq(seoConfigurations.indexable, indexable))
      .orderBy(asc(seoConfigurations.routePath));
  }

  async updateSeoSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<SeoConfiguration | undefined> {
    const updateData: any = { updatedAt: new Date() };
    
    if (vaultSynced !== undefined) {
      updateData.vaultSynced = vaultSynced;
    }
    
    if (guardianSynced !== undefined) {
      updateData.guardianSynced = guardianSynced;
    }
    
    const [updated] = await db
      .update(seoConfigurations)
      .set(updateData)
      .where(eq(seoConfigurations.id, id))
      .returning();
    
    return updated;
  }
  
  async updateSeoConfigPriorities(priorities: { id: number; priority: number }[]): Promise<SeoConfiguration[]> {
    try {
      // Create an array to store the results
      const updatedConfigs: SeoConfiguration[] = [];
      
      // Update each configuration one at a time to ensure all updates succeed
      for (const item of priorities) {
        const [updated] = await db
          .update(seoConfigurations)
          .set({ 
            priority: item.priority,
            updatedAt: new Date()
          })
          .where(eq(seoConfigurations.id, item.id))
          .returning();
        
        if (updated) {
          updatedConfigs.push(updated);
        }
      }
      
      return updatedConfigs;
    } catch (error) {
      console.error('Error updating SEO configuration priorities:', error);
      throw error;
    }
  }

  // Brand Versioning operations
  async getBrandVersion(id: number): Promise<BrandVersion | undefined> {
    const [version] = await db
      .select()
      .from(brandVersions)
      .where(eq(brandVersions.id, id));
    
    return version;
  }

  async getBrandVersionByNumber(versionNumber: string): Promise<BrandVersion | undefined> {
    const [version] = await db
      .select()
      .from(brandVersions)
      .where(eq(brandVersions.version, versionNumber));
    
    return version;
  }

  async getActiveBrandVersion(): Promise<BrandVersion | undefined> {
    const [version] = await db
      .select()
      .from(brandVersions)
      .where(eq(brandVersions.active, true));
    
    return version;
  }

  async getAllBrandVersions(): Promise<BrandVersion[]> {
    return db
      .select()
      .from(brandVersions)
      .orderBy(desc(brandVersions.createdAt));
  }

  async saveBrandVersion(version: InsertBrandVersion): Promise<BrandVersion> {
    // If this is the first version, make it active by default
    const existingVersions = await this.getAllBrandVersions();
    const isFirstVersion = existingVersions.length === 0;
    
    const [savedVersion] = await db
      .insert(brandVersions)
      .values({
        ...version,
        active: isFirstVersion || version.active
      })
      .returning();
    
    return savedVersion;
  }

  async activateBrandVersion(id: number): Promise<BrandVersion | undefined> {
    // First, deactivate all versions
    await db
      .update(brandVersions)
      .set({ 
        active: false,
        updatedAt: new Date()
      });
    
    // Then activate the requested version
    const [activated] = await db
      .update(brandVersions)
      .set({ 
        active: true,
        updatedAt: new Date()
      })
      .where(eq(brandVersions.id, id))
      .returning();
    
    return activated;
  }

  async updateBrandSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<BrandVersion | undefined> {
    const updateData: any = { updatedAt: new Date() };
    
    if (vaultSynced !== undefined) {
      updateData.vaultSynced = vaultSynced;
    }
    
    if (guardianSynced !== undefined) {
      updateData.guardianSynced = guardianSynced;
    }
    
    const [updated] = await db
      .update(brandVersions)
      .set(updateData)
      .where(eq(brandVersions.id, id))
      .returning();
    
    return updated;
  }

  // Tool operations
  async getTool(id: number, tenantId?: string): Promise<Tool | undefined> {
    let query = db
      .select()
      .from(tools)
      .where(eq(tools.id, id));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    const [tool] = await query;
    return tool;
  }

  async getToolsByType(toolType: string, tenantId?: string): Promise<Tool[]> {
    let query = db
      .select()
      .from(tools)
      .where(eq(tools.type, toolType));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    return query;
  }

  async getToolsByStatus(status: string, tenantId?: string): Promise<Tool[]> {
    let query = db
      .select()
      .from(tools)
      .where(eq(tools.status, status));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    return query;
  }

  async getToolsByUser(userId: number, tenantId?: string): Promise<Tool[]> {
    let query = db
      .select()
      .from(tools)
      .where(eq(tools.createdBy, userId));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    return query;
  }

  async getToolsByTenant(tenantId: string): Promise<Tool[]> {
    return db
      .select()
      .from(tools)
      .where(eq(tools.tenantId, tenantId));
  }

  async saveTool(tool: InsertTool): Promise<Tool> {
    const [savedTool] = await db
      .insert(tools)
      .values(tool)
      .returning();
    
    return savedTool;
  }

  async updateToolStatus(id: number, status: string, tenantId?: string): Promise<Tool | undefined> {
    let query = db
      .update(tools)
      .set({ 
        status: status,
        updatedAt: new Date()
      })
      .where(eq(tools.id, id));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    const [updated] = await query.returning();
    return updated;
  }

  async updateTool(id: number, data: Partial<InsertTool>, tenantId?: string): Promise<Tool | undefined> {
    let query = db
      .update(tools)
      .set({ 
        ...data,
        updatedAt: new Date()
      })
      .where(eq(tools.id, id));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    const [updated] = await query.returning();
    return updated;
  }

  async deleteTool(id: number, tenantId?: string): Promise<boolean> {
    let query = db
      .delete(tools)
      .where(eq(tools.id, id));
    
    if (tenantId) {
      query = query.where(eq(tools.tenantId, tenantId));
    }
    
    const result = await query;
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Tool Request operations
  async saveToolRequest(request: InsertToolRequest): Promise<ToolRequest> {
    const [saved] = await db
      .insert(toolRequests)
      .values(request)
      .returning();
    
    return saved;
  }

  async getToolRequestsByStatus(status: string): Promise<ToolRequest[]> {
    return db
      .select()
      .from(toolRequests)
      .where(eq(toolRequests.status, status))
      .orderBy(desc(toolRequests.createdAt));
  }

  async updateToolRequestStatus(id: number, status: string, processedAt?: Date): Promise<ToolRequest | undefined> {
    const [updated] = await db
      .update(toolRequests)
      .set({ 
        status: status,
        processedAt: processedAt || (status === 'processed' ? new Date() : undefined),
        updatedAt: new Date()
      })
      .where(eq(toolRequests.id, id))
      .returning();
    
    return updated;
  }

  // Page-Tool Integration operations
  async getPageToolIntegrations(pageId: string): Promise<PageToolIntegration[]> {
    return db
      .select()
      .from(pageToolIntegrations)
      .where(eq(pageToolIntegrations.pageId, pageId));
  }

  async getToolIntegrations(toolId: number): Promise<PageToolIntegration[]> {
    return db
      .select()
      .from(pageToolIntegrations)
      .where(eq(pageToolIntegrations.toolId, toolId));
  }

  async savePageToolIntegration(integration: InsertPageToolIntegration): Promise<PageToolIntegration> {
    const [saved] = await db
      .insert(pageToolIntegrations)
      .values(integration)
      .returning();
    
    return saved;
  }

  async updatePageToolIntegration(id: number, data: Partial<InsertPageToolIntegration>): Promise<PageToolIntegration | undefined> {
    const [updated] = await db
      .update(pageToolIntegrations)
      .set({ 
        ...data,
        updatedAt: new Date()
      })
      .where(eq(pageToolIntegrations.id, id))
      .returning();
    
    return updated;
  }

  async deletePageToolIntegration(id: number): Promise<boolean> {
    const result = await db
      .delete(pageToolIntegrations)
      .where(eq(pageToolIntegrations.id, id));
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Blog page operations
  async getBlogPages(tenantId?: string): Promise<BlogPage[]> {
    try {
      if (tenantId) {
        return db.select().from(blogPages).where(eq(blogPages.tenantId, tenantId));
      }
      return db.select().from(blogPages);
    } catch (error) {
      console.error("Error fetching blog pages:", error);
      return [];
    }
  }

  async getBlogPage(id: number): Promise<BlogPage | undefined> {
    try {
      const [page] = await db.select().from(blogPages).where(eq(blogPages.id, id));
      return page;
    } catch (error) {
      console.error(`Error fetching blog page with id ${id}:`, error);
      return undefined;
    }
  }

  async getBlogPageBySlug(slug: string, tenantId?: string): Promise<BlogPage | undefined> {
    try {
      if (tenantId) {
        const [page] = await db
          .select()
          .from(blogPages)
          .where(
            and(
              eq(blogPages.slug, slug),
              eq(blogPages.tenantId, tenantId)
            )
          );
        return page;
      }
      
      const [page] = await db
        .select()
        .from(blogPages)
        .where(eq(blogPages.slug, slug));
      return page;
    } catch (error) {
      console.error(`Error fetching blog page with slug ${slug}:`, error);
      return undefined;
    }
  }

  async createBlogPage(page: InsertBlogPage): Promise<BlogPage> {
    try {
      const [created] = await db.insert(blogPages).values(page).returning();
      return created;
    } catch (error) {
      console.error("Error creating blog page:", error);
      throw error;
    }
  }

  async updateBlogPage(id: number, data: Partial<BlogPage>): Promise<BlogPage | undefined> {
    try {
      const [updated] = await db
        .update(blogPages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(blogPages.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating blog page with id ${id}:`, error);
      return undefined;
    }
  }

  async deleteBlogPage(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(blogPages)
        .where(eq(blogPages.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error(`Error deleting blog page with id ${id}:`, error);
      return false;
    }
  }
  
  // Blog post operations
  async getBlogPosts(tenantId?: string): Promise<BlogPost[]> {
    try {
      if (tenantId) {
        return db.select().from(blogPosts).where(eq(blogPosts.tenantId, tenantId));
      }
      return db.select().from(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return post;
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string, tenantId?: string): Promise<BlogPost | undefined> {
    try {
      if (tenantId) {
        const [post] = await db
          .select()
          .from(blogPosts)
          .where(
            and(
              eq(blogPosts.slug, slug),
              eq(blogPosts.tenantId, tenantId)
            )
          );
        return post;
      }
      
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug));
      return post;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return undefined;
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const [created] = await db.insert(blogPosts).values(post).returning();
      return created;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }

  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | undefined> {
    try {
      const [updated] = await db
        .update(blogPosts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating blog post with id ${id}:`, error);
      return undefined;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      return false;
    }
  }

  // Integration request operations
  async getIntegrationRequests(tenantId?: string): Promise<IntegrationRequest[]> {
    try {
      if (tenantId) {
        return db.select().from(integrationRequests).where(eq(integrationRequests.tenantId, tenantId));
      }
      return db.select().from(integrationRequests);
    } catch (error) {
      console.error("Error fetching integration requests:", error);
      return [];
    }
  }

  async getIntegrationRequest(id: number): Promise<IntegrationRequest | undefined> {
    try {
      const [request] = await db.select().from(integrationRequests).where(eq(integrationRequests.id, id));
      return request;
    } catch (error) {
      console.error(`Error fetching integration request with id ${id}:`, error);
      return undefined;
    }
  }

  async createIntegrationRequest(request: InsertIntegrationRequest): Promise<IntegrationRequest> {
    try {
      const [created] = await db.insert(integrationRequests).values(request).returning();
      return created;
    } catch (error) {
      console.error("Error creating integration request:", error);
      throw error;
    }
  }

  async updateIntegrationRequest(id: number, data: Partial<IntegrationRequest>): Promise<IntegrationRequest | undefined> {
    try {
      const [updated] = await db
        .update(integrationRequests)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(integrationRequests.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating integration request with id ${id}:`, error);
      return undefined;
    }
  }

  async deleteIntegrationRequest(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(integrationRequests)
        .where(eq(integrationRequests.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error(`Error deleting integration request with id ${id}:`, error);
      return false;
    }
  }

  // Companion Config operations
  async getCompanionConfig(tenantId: string): Promise<CompanionConfig | undefined> {
    try {
      const [config] = await db
        .select()
        .from(companionConfig)
        .where(eq(companionConfig.tenantId, tenantId));
      return config;
    } catch (error) {
      console.error(`Error fetching companion config for tenant ${tenantId}:`, error);
      return undefined;
    }
  }

  async createCompanionConfig(config: InsertCompanionConfig): Promise<CompanionConfig> {
    try {
      const [newConfig] = await db
        .insert(companionConfig)
        .values(config)
        .returning();
      return newConfig;
    } catch (error) {
      console.error("Error creating companion config:", error);
      throw error;
    }
  }

  async updateCompanionConfig(id: number, data: Partial<InsertCompanionConfig>): Promise<CompanionConfig | undefined> {
    try {
      const [updatedConfig] = await db
        .update(companionConfig)
        .set({ 
          ...data,
          updatedAt: new Date() 
        })
        .where(eq(companionConfig.id, id))
        .returning();
      return updatedConfig;
    } catch (error) {
      console.error(`Error updating companion config with id ${id}:`, error);
      return undefined;
    }
  }

  // Client Registry operations for Blueprint Export
  async getClientRegistry(): Promise<ClientRegistry | undefined> {
    try {
      const [registry] = await db
        .select()
        .from(clientRegistry)
        .limit(1);
      
      return registry;
    } catch (error) {
      console.error("Error fetching client registry:", error);
      return undefined;
    }
  }

  async createClientRegistry(data: InsertClientRegistry): Promise<ClientRegistry> {
    try {
      const [created] = await db
        .insert(clientRegistry)
        .values(data)
        .returning();
      
      return created;
    } catch (error) {
      console.error("Error creating client registry:", error);
      throw error;
    }
  }

  async updateClientRegistry(clientId: string, data: Partial<InsertClientRegistry>): Promise<ClientRegistry | undefined> {
    try {
      const [updated] = await db
        .update(clientRegistry)
        .set({ 
          ...data,
          updatedAt: new Date()
        })
        .where(eq(clientRegistry.clientId, clientId))
        .returning();
      
      return updated;
    } catch (error) {
      console.error(`Error updating client registry with id ${clientId}:`, error);
      return undefined;
    }
  }

  async updateExportableModules(clientId: string, moduleList: any[]): Promise<ClientRegistry | undefined> {
    try {
      const [updated] = await db
        .update(clientRegistry)
        .set({ 
          exportableModules: moduleList,
          updatedAt: new Date()
        })
        .where(eq(clientRegistry.clientId, clientId))
        .returning();
      
      return updated;
    } catch (error) {
      console.error(`Error updating exportable modules for client ${clientId}:`, error);
      return undefined;
    }
  }

  async markAsExportReady(clientId: string, exportReady: boolean): Promise<ClientRegistry | undefined> {
    try {
      const [updated] = await db
        .update(clientRegistry)
        .set({ 
          exportReady,
          updatedAt: new Date()
        })
        .where(eq(clientRegistry.clientId, clientId))
        .returning();
      
      return updated;
    } catch (error) {
      console.error(`Error updating export ready status for client ${clientId}:`, error);
      return undefined;
    }
  }

  async updateHandoffStatus(clientId: string, status: string): Promise<ClientRegistry | undefined> {
    try {
      const [updated] = await db
        .update(clientRegistry)
        .set({ 
          handoffStatus: status,
          updatedAt: new Date()
        })
        .where(eq(clientRegistry.clientId, clientId))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating handoff status for client ${clientId}:`, error);
      return undefined;
    }
  }

  // SOT (Single Source of Truth) operations
  async getSotDeclaration(): Promise<SotDeclaration | undefined> {
    try {
      const [declaration] = await db.select().from(sotDeclarations);
      return declaration;
    } catch (error) {
      console.error("Error fetching SOT declaration:", error);
      return undefined;
    }
  }

  async saveSotDeclaration(data: InsertSotDeclaration): Promise<SotDeclaration> {
    try {
      const [declaration] = await db
        .insert(sotDeclarations)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return declaration;
    } catch (error) {
      console.error("Error saving SOT declaration:", error);
      throw error;
    }
  }

  async updateSotDeclaration(id: number, data: Partial<InsertSotDeclaration>): Promise<SotDeclaration | undefined> {
    try {
      const [updated] = await db
        .update(sotDeclarations)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(sotDeclarations.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating SOT declaration with id ${id}:`, error);
      return undefined;
    }
  }

  async getSotMetrics(): Promise<SotMetric | undefined> {
    try {
      const [metrics] = await db.select().from(sotMetrics);
      return metrics;
    } catch (error) {
      console.error("Error fetching SOT metrics:", error);
      return undefined;
    }
  }

  async saveSotMetrics(data: InsertSotMetric): Promise<SotMetric> {
    try {
      const [metrics] = await db
        .insert(sotMetrics)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return metrics;
    } catch (error) {
      console.error("Error saving SOT metrics:", error);
      throw error;
    }
  }

  async updateSotMetrics(id: number, data: Partial<InsertSotMetric>): Promise<SotMetric | undefined> {
    try {
      const [updated] = await db
        .update(sotMetrics)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(sotMetrics.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating SOT metrics with id ${id}:`, error);
      return undefined;
    }
  }

  async logSotSync(eventType: string, status: string, details?: string): Promise<SotSyncLog> {
    try {
      const [log] = await db
        .insert(sotSyncLogs)
        .values({
          eventType,
          status,
          details: details || null,
          createdAt: new Date()
        })
        .returning();
      return log;
    } catch (error) {
      console.error("Error logging SOT sync:", error);
      throw error;
    }
  }

  async getSotSyncLogs(limit?: number): Promise<SotSyncLog[]> {
    try {
      let query = db
        .select()
        .from(sotSyncLogs)
        .orderBy(desc(sotSyncLogs.createdAt));
      
      if (limit) {
        query = query.limit(limit);
      }
      
      return await query;
    } catch (error) {
      console.error("Error fetching SOT sync logs:", error);
      return [];
    }
  }
}

// Using the DatabaseStorage implementation for production
export const storage = new DatabaseStorage();