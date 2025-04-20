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
  type InsertToolRequest
} from "@shared/schema";
import { PageMetadata, PageComplexityAssessment } from "@shared/page_metadata";
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
  
  // Brand Versioning operations
  getBrandVersion(id: number): Promise<BrandVersion | undefined>;
  getBrandVersionByNumber(versionNumber: string): Promise<BrandVersion | undefined>;
  getActiveBrandVersion(): Promise<BrandVersion | undefined>;
  getAllBrandVersions(): Promise<BrandVersion[]>;
  saveBrandVersion(version: InsertBrandVersion): Promise<BrandVersion>;
  activateBrandVersion(id: number): Promise<BrandVersion | undefined>;
  updateBrandSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<BrandVersion | undefined>;
  
  // Tool operations
  getTool(id: number): Promise<Tool | undefined>;
  getToolsByType(toolType: string): Promise<Tool[]>;
  getToolsByStatus(status: string): Promise<Tool[]>;
  getToolsByUser(userId: number): Promise<Tool[]>;
  saveTool(tool: InsertTool): Promise<Tool>;
  updateToolStatus(id: number, status: string): Promise<Tool | undefined>;
  updateTool(id: number, data: Partial<InsertTool>): Promise<Tool | undefined>;
  deleteTool(id: number): Promise<boolean>;
  
  // Tool Request operations
  saveToolRequest(request: InsertToolRequest): Promise<ToolRequest>;
  getToolRequestsByStatus(status: string): Promise<ToolRequest[]>;
  updateToolRequestStatus(id: number, status: string, processedAt?: Date): Promise<ToolRequest | undefined>;
  
  // Blueprint Export operations
  getClientRegistry(): Promise<ClientRegistry | undefined>;
  createClientRegistry(data: InsertClientRegistry): Promise<ClientRegistry>;
  updateClientRegistry(clientId: string, data: Partial<InsertClientRegistry>): Promise<ClientRegistry | undefined>;
  updateExportableModules(clientId: string, moduleList: any[]): Promise<ClientRegistry | undefined>;
  markAsExportReady(clientId: string, exportReady: boolean): Promise<ClientRegistry | undefined>;
  updateHandoffStatus(clientId: string, status: string): Promise<ClientRegistry | undefined>;
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
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Business identity operations
  async getBusinessIdentity(): Promise<BusinessIdentity | undefined> {
    const [identity] = await db.select().from(businessIdentity).limit(1);
    return identity;
  }
  
  async saveBusinessIdentity(data: InsertBusinessIdentity): Promise<BusinessIdentity> {
    // Check if we already have a record
    const existing = await this.getBusinessIdentity();
    
    // Ensure null values for optional fields
    const preparedData = {
      name: data.name ?? null,
      mission: data.mission ?? null,
      vision: data.vision ?? null,
      values: data.values ?? null,
      marketFocus: data.marketFocus ?? null,
      targetAudience: data.targetAudience ?? null,
      brandVoice: data.brandVoice ?? null,
      brandPositioning: data.brandPositioning ?? null,
      teamValues: data.teamValues ?? null,
      cultureStatements: data.cultureStatements ?? null
    };
    
    if (existing) {
      // Update existing record
      const [updated] = await db
        .update(businessIdentity)
        .set({ ...preparedData, updatedAt: new Date() })
        .where(eq(businessIdentity.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(businessIdentity)
        .values(preparedData)
        .returning();
      return created;
    }
  }
  
  // Project context operations
  async getProjectContext(): Promise<ProjectContext | undefined> {
    const [context] = await db.select().from(projectContext).limit(1);
    return context;
  }
  
  async saveProjectContext(data: InsertProjectContext): Promise<ProjectContext> {
    // Check if we already have a record
    const existing = await this.getProjectContext();
    
    // Ensure valid data for the database
    const preparedData = {
      homepageSetup: data.homepageSetup ?? null,
      pageStatus: data.pageStatus ?? null,
      onboardingComplete: data.onboardingComplete ?? null
    };
    
    if (existing) {
      // Update existing record
      const [updated] = await db
        .update(projectContext)
        .set({ ...preparedData, updatedAt: new Date() })
        .where(eq(projectContext.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(projectContext)
        .values(preparedData)
        .returning();
      return created;
    }
  }
  
  // Onboarding state operations
  async getOnboardingState(userId: number): Promise<OnboardingState | undefined> {
    const latest = await db
      .select()
      .from(onboardingState)
      .where(eq(onboardingState.userId, userId))
      .orderBy(desc(onboardingState.checkpointTime))
      .limit(1);
    
    return latest[0];
  }
  
  async getOnboardingStageState(userId: number, stage: string): Promise<OnboardingState | undefined> {
    const [stageState] = await db
      .select()
      .from(onboardingState)
      .where(
        and(
          eq(onboardingState.userId, userId),
          eq(onboardingState.stage, stage)
        )
      )
      .orderBy(desc(onboardingState.checkpointTime))
      .limit(1);
    
    return stageState;
  }
  
  async saveOnboardingState(data: InsertOnboardingState): Promise<OnboardingState> {
    // Generate a recovery token if not provided
    if (!data.recoveryToken) {
      data.recoveryToken = crypto.randomBytes(16).toString('hex');
    }
    
    // Ensure data is in the correct format
    const preparedData = {
      userId: data.userId,
      stage: data.stage,
      status: data.status,
      data: data.data ?? null,
      checkpointTime: new Date(),
      recoveryToken: data.recoveryToken,
      blueprintVersion: data.blueprintVersion ?? '1.0.0',
      guardianSynced: data.guardianSynced ?? false
    };
    
    // Insert new state
    const [created] = await db
      .insert(onboardingState)
      .values(preparedData)
      .returning();
    
    return created;
  }
  
  async updateOnboardingStatus(userId: number, stage: string, status: string, data?: any): Promise<OnboardingState | undefined> {
    // Get the current state for this stage
    const currentState = await this.getOnboardingStageState(userId, stage);
    
    if (currentState) {
      // Update existing record
      const [updated] = await db
        .update(onboardingState)
        .set({
          status,
          data: data ?? currentState.data,
          checkpointTime: new Date(),
          updatedAt: new Date()
        })
        .where(eq(onboardingState.id, currentState.id))
        .returning();
      
      return updated;
    } else {
      // Create new record
      return await this.saveOnboardingState({
        userId,
        stage,
        status,
        data: data ?? null
      });
    }
  }
  
  async markOnboardingStageComplete(userId: number, stage: string, data?: any): Promise<OnboardingState | undefined> {
    return await this.updateOnboardingStatus(userId, stage, 'complete', data);
  }
  
  async getIncompleteOnboarding(userId: number): Promise<OnboardingState | undefined> {
    const [incompleteState] = await db
      .select()
      .from(onboardingState)
      .where(
        and(
          eq(onboardingState.userId, userId),
          eq(onboardingState.status, 'in_progress')
        )
      )
      .orderBy(desc(onboardingState.checkpointTime))
      .limit(1);
    
    return incompleteState;
  }
  
  async markGuardianSynced(id: number, synced: boolean = true): Promise<OnboardingState | undefined> {
    const [updated] = await db
      .update(onboardingState)
      .set({
        guardianSynced: synced,
        updatedAt: new Date()
      })
      .where(eq(onboardingState.id, id))
      .returning();
    
    return updated;
  }
  
  async saveOnboardingPreference(userId: number, preference: string): Promise<OnboardingState | undefined> {
    try {
      // Check if the user has an existing 'website_preference' stage entry
      const existingPreference = await this.getOnboardingStageState(userId, 'website_preference');
      
      // Function to validate the preference
      const validPreference = ['full_site', 'tools_only', 'undecided'].includes(preference) 
        ? preference 
        : 'undecided';
      
      if (existingPreference) {
        // Update the existing preference
        const [updated] = await db
          .update(onboardingState)
          .set({
            data: { preference: validPreference },
            updatedAt: new Date(),
            checkpointTime: new Date()
          })
          .where(eq(onboardingState.id, existingPreference.id))
          .returning();
        
        return updated;
      } else {
        // Create a new preference entry
        const newPreferenceState = await this.saveOnboardingState({
          userId,
          stage: 'website_preference',
          status: 'complete',
          data: { preference: validPreference }
        });
        
        return newPreferenceState;
      }
    } catch (error) {
      console.error("Error saving onboarding preference:", error);
      return undefined;
    }
  }
  
  // Module operations
  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }
  
  async getAllModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }
  
  async getModulesByCategory(category: string): Promise<Module[]> {
    return await db.select().from(modules).where(eq(modules.category, category));
  }
  
  async saveModule(moduleData: InsertModule): Promise<Module> {
    // Check if module exists
    const existing = await this.getModule(moduleData.id);
    
    if (existing) {
      // Update existing module
      const [updated] = await db
        .update(modules)
        .set({ ...moduleData, updatedAt: new Date() })
        .where(eq(modules.id, moduleData.id))
        .returning();
      return updated;
    } else {
      // Create new module
      const [created] = await db
        .insert(modules)
        .values(moduleData)
        .returning();
      return created;
    }
  }
  
  async updateModuleStatus(id: string, status: string): Promise<Module | undefined> {
    const [updated] = await db
      .update(modules)
      .set({ status, updatedAt: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return updated;
  }
  
  // Feature request operations
  async saveFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest> {
    const [created] = await db
      .insert(featureRequests)
      .values(request)
      .returning();
    return created;
  }
  
  async getFeatureRequests(): Promise<FeatureRequest[]> {
    return await db.select().from(featureRequests);
  }
  
  async updateFeatureRequestStatus(id: number, status: string): Promise<FeatureRequest | undefined> {
    const [updated] = await db
      .update(featureRequests)
      .set({ status })
      .where(eq(featureRequests.id, id))
      .returning();
    return updated;
  }
  
  // Contact operations
  async saveContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        name: data.name,
        business: data.business ?? null,
        email: data.email,
        phone: data.phone ?? null,
        industry: data.industry ?? null,
        message: data.message
      })
      .returning();
    
    return submission;
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }
  
  // Activity logging
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(activity)
      .returning();
    return log;
  }
  
  async getActivityLogs(userId?: number, limit: number = 50): Promise<ActivityLog[]> {
    if (userId) {
      return await db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, userId))
        .limit(limit);
    } else {
      return await db
        .select()
        .from(activityLogs)
        .limit(limit);
    }
  }
  
  // Module activation logging
  async logModuleActivation(activation: InsertModuleActivation): Promise<ModuleActivation> {
    const [created] = await db
      .insert(moduleActivations)
      .values({
        userId: activation.userId,
        moduleId: activation.moduleId,
        activatedAt: new Date(),
        pageMetadata: activation.pageMetadata ?? null,
        guardianSynced: activation.guardianSynced ?? false
      })
      .returning();
    
    return created;
  }
  
  async getModuleActivations(userId?: number, moduleId?: string): Promise<ModuleActivation[]> {
    // Base query
    let query = db.select().from(moduleActivations);
    
    // Apply filters if provided
    if (userId && moduleId) {
      query = query.where(
        and(
          eq(moduleActivations.userId, userId),
          eq(moduleActivations.moduleId, moduleId)
        )
      );
    } else if (userId) {
      query = query.where(eq(moduleActivations.userId, userId));
    } else if (moduleId) {
      query = query.where(eq(moduleActivations.moduleId, moduleId));
    }
    
    // Order by most recent first
    query = query.orderBy(desc(moduleActivations.activatedAt));
    
    return await query;
  }
  
  async markModuleActivationSynced(id: number, synced: boolean = true): Promise<ModuleActivation | undefined> {
    const [updated] = await db
      .update(moduleActivations)
      .set({
        guardianSynced: synced,
        updatedAt: new Date()
      })
      .where(eq(moduleActivations.id, id))
      .returning();
    
    return updated;
  }
  
  // Page complexity triage
  async savePageComplexityTriage(triage: InsertPageComplexityTriage): Promise<PageComplexityTriage> {
    const [created] = await db
      .insert(pageComplexityTriage)
      .values({
        userId: triage.userId,
        requestDescription: triage.requestDescription,
        visualComplexity: triage.visualComplexity,
        logicComplexity: triage.logicComplexity,
        dataComplexity: triage.dataComplexity,
        estimatedHours: triage.estimatedHours,
        complexityLevel: triage.complexityLevel,
        aiAssessment: triage.aiAssessment,
        vaultSynced: triage.vaultSynced ?? false,
        guardianSynced: triage.guardianSynced ?? false,
        triageTimestamp: new Date()
      })
      .returning();
    
    return created;
  }
  
  async getPageComplexityTriage(id: number): Promise<PageComplexityTriage | undefined> {
    const [triage] = await db
      .select()
      .from(pageComplexityTriage)
      .where(eq(pageComplexityTriage.id, id));
    
    return triage;
  }
  
  async getPageComplexityTriagesByUser(userId: number): Promise<PageComplexityTriage[]> {
    return await db
      .select()
      .from(pageComplexityTriage)
      .where(eq(pageComplexityTriage.userId, userId))
      .orderBy(desc(pageComplexityTriage.triageTimestamp));
  }
  
  async updatePageComplexitySyncStatus(
    id: number, 
    vaultSynced?: boolean, 
    guardianSynced?: boolean
  ): Promise<PageComplexityTriage | undefined> {
    // Build update object based on provided parameters
    const updateData: { vaultSynced?: boolean, guardianSynced?: boolean, updatedAt: Date } = {
      updatedAt: new Date()
    };
    
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
    return await db
      .select()
      .from(seoConfigurations)
      .orderBy(asc(seoConfigurations.routePath));
  }
  
  async saveSeoConfiguration(config: InsertSeoConfiguration): Promise<SeoConfiguration> {
    // Check if a configuration for this route already exists
    const existing = await this.getSeoConfiguration(config.routePath);
    
    if (existing) {
      // Update existing record
      const [updated] = await db
        .update(seoConfigurations)
        .set({
          ...config,
          updatedAt: new Date()
        })
        .where(eq(seoConfigurations.id, existing.id))
        .returning();
      
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(seoConfigurations)
        .values({
          ...config,
          vaultSynced: false,
          guardianSynced: false
        })
        .returning();
      
      return created;
    }
  }
  
  async updateSeoConfiguration(id: number, config: Partial<InsertSeoConfiguration>): Promise<SeoConfiguration | undefined> {
    const [updated] = await db
      .update(seoConfigurations)
      .set({
        ...config,
        updatedAt: new Date()
      })
      .where(eq(seoConfigurations.id, id))
      .returning();
    
    return updated;
  }
  
  async deleteSeoConfiguration(id: number): Promise<boolean> {
    const result = await db
      .delete(seoConfigurations)
      .where(eq(seoConfigurations.id, id));
    
    return result.rowCount > 0;
  }
  
  async getSeoConfigurationsByStatus(indexable: boolean): Promise<SeoConfiguration[]> {
    return await db
      .select()
      .from(seoConfigurations)
      .where(eq(seoConfigurations.indexable, indexable))
      .orderBy(desc(seoConfigurations.priority));
  }
  
  async updateSeoSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<SeoConfiguration | undefined> {
    const updateData: { vaultSynced?: boolean, guardianSynced?: boolean, updatedAt: Date } = {
      updatedAt: new Date()
    };
    
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
      .where(eq(brandVersions.versionNumber, versionNumber));
    
    return version;
  }
  
  async getActiveBrandVersion(): Promise<BrandVersion | undefined> {
    const [version] = await db
      .select()
      .from(brandVersions)
      .where(eq(brandVersions.isActive, true))
      .orderBy(desc(brandVersions.appliedAt));
    
    return version;
  }
  
  async getAllBrandVersions(): Promise<BrandVersion[]> {
    return await db
      .select()
      .from(brandVersions)
      .orderBy(desc(brandVersions.createdAt));
  }
  
  async saveBrandVersion(version: InsertBrandVersion): Promise<BrandVersion> {
    // Check if a version with this number already exists
    const existing = await this.getBrandVersionByNumber(version.versionNumber);
    
    if (existing) {
      // Update existing record
      const [updated] = await db
        .update(brandVersions)
        .set({
          ...version,
          updatedAt: new Date()
        })
        .where(eq(brandVersions.id, existing.id))
        .returning();
      
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(brandVersions)
        .values({
          ...version,
          vaultSynced: false,
          guardianSynced: false,
          isActive: false
        })
        .returning();
      
      return created;
    }
  }
  
  async activateBrandVersion(id: number): Promise<BrandVersion | undefined> {
    // First, deactivate all currently active versions
    await db
      .update(brandVersions)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(brandVersions.isActive, true));
    
    // Then, activate the requested version
    const [activated] = await db
      .update(brandVersions)
      .set({
        isActive: true,
        appliedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(brandVersions.id, id))
      .returning();
    
    return activated;
  }
  
  async updateBrandSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<BrandVersion | undefined> {
    const updateData: { vaultSynced?: boolean, guardianSynced?: boolean, updatedAt: Date } = {
      updatedAt: new Date()
    };
    
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
  
  // Blueprint Export operations
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
    // Check if we already have a record
    const existing = await this.getClientRegistry();
    
    if (existing) {
      // Update the existing record
      const [updated] = await db
        .update(clientRegistry)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(clientRegistry.id, existing.id))
        .returning();
      
      return updated;
    } else {
      // Create a new record
      const [created] = await db
        .insert(clientRegistry)
        .values({
          ...data,
          exportReady: data.exportReady ?? false,
          handoffStatus: data.handoffStatus ?? "in_progress"
        })
        .returning();
      
      return created;
    }
  }
  
  async updateClientRegistry(clientId: string, data: Partial<InsertClientRegistry>): Promise<ClientRegistry | undefined> {
    const [registry] = await db
      .select()
      .from(clientRegistry)
      .where(eq(clientRegistry.clientId, clientId));
    
    if (!registry) {
      return undefined;
    }
    
    const [updated] = await db
      .update(clientRegistry)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(clientRegistry.id, registry.id))
      .returning();
    
    return updated;
  }
  
  async updateExportableModules(clientId: string, moduleList: any[]): Promise<ClientRegistry | undefined> {
    const [registry] = await db
      .select()
      .from(clientRegistry)
      .where(eq(clientRegistry.clientId, clientId));
    
    if (!registry) {
      return undefined;
    }
    
    const [updated] = await db
      .update(clientRegistry)
      .set({
        exportableModules: moduleList,
        updatedAt: new Date()
      })
      .where(eq(clientRegistry.id, registry.id))
      .returning();
    
    return updated;
  }
  
  async markAsExportReady(clientId: string, exportReady: boolean): Promise<ClientRegistry | undefined> {
    const [registry] = await db
      .select()
      .from(clientRegistry)
      .where(eq(clientRegistry.clientId, clientId));
    
    if (!registry) {
      return undefined;
    }
    
    const [updated] = await db
      .update(clientRegistry)
      .set({
        exportReady,
        lastExported: exportReady ? new Date() : registry.lastExported,
        updatedAt: new Date()
      })
      .where(eq(clientRegistry.id, registry.id))
      .returning();
    
    return updated;
  }
  
  async updateHandoffStatus(clientId: string, status: string): Promise<ClientRegistry | undefined> {
    const [registry] = await db
      .select()
      .from(clientRegistry)
      .where(eq(clientRegistry.clientId, clientId));
    
    if (!registry) {
      return undefined;
    }
    
    const [updated] = await db
      .update(clientRegistry)
      .set({
        handoffStatus: status,
        updatedAt: new Date()
      })
      .where(eq(clientRegistry.id, registry.id))
      .returning();
    
    return updated;
  }
  
  // Blueprint version management
  async getAllBlueprintVersions(): Promise<any[]> {
    try {
      if (!blueprintVersions) {
        console.warn("blueprintVersions table not defined in schema");
        return [];
      }
      
      return await db
        .select()
        .from(blueprintVersions)
        .orderBy(desc(blueprintVersions.releaseDate));
    } catch (error) {
      console.error("Error retrieving blueprint versions:", error);
      return [];
    }
  }
  
  async deprecateBlueprintVersion(version: string): Promise<boolean> {
    try {
      if (!blueprintVersions) {
        console.warn("blueprintVersions table not defined in schema");
        return false;
      }
      
      await db
        .update(blueprintVersions)
        .set({ 
          deprecated: true,
          updatedAt: new Date()
        })
        .where(eq(blueprintVersions.version, version));
      
      return true;
    } catch (error) {
      console.error(`Error deprecating blueprint version ${version}:`, error);
      return false;
    }
  }
  
  // Activity logging
  async addActivityLog(log: Partial<InsertActivityLog>): Promise<void> {
    try {
      // Ensure we have all required fields
      const activityLogData = {
        userType: log.userType || 'system',
        actionType: log.actionType || 'info',
        entityType: log.entityType || 'system',
        entityId: log.entityId || '0',
        userId: log.userId || null,
        details: log.details || null
      };
      
      await db.insert(activityLogs).values(activityLogData);
    } catch (error) {
      console.error("Error adding activity log:", error);
    }
  }
}

// For compatibility with existing code, provide an in-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  featureRequests: InsertFeatureRequest[];
  contactSubmissions: Map<number, ContactSubmission>;
  modules: Map<string, Module>;
  businessIdentityData?: BusinessIdentity;
  projectContextData?: ProjectContext;
  activityLogs: ActivityLog[];
  onboardingStates: Map<number, OnboardingState[]>;
  moduleActivationLogs: ModuleActivation[];
  pageComplexityTriages: PageComplexityTriage[];
  seoConfigurations: Map<string, SeoConfiguration>;
  brandVersions: Map<number, BrandVersion>;
  clientRegistryData?: ClientRegistry;
  tools: Map<number, Tool>;
  toolRequests: Map<number, ToolRequest>;
  toolIdCounter: number = 1;
  toolRequestIdCounter: number = 1;
  sessionStore: session.Store = new session.MemoryStore();

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.featureRequests = [];
    this.contactSubmissions = new Map();
    this.modules = new Map();
    this.activityLogs = [];
    this.onboardingStates = new Map();
    this.moduleActivationLogs = [];
    this.pageComplexityTriages = [];
    this.seoConfigurations = new Map();
    this.brandVersions = new Map();
    this.tools = new Map();
    this.toolRequests = new Map();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      name: insertUser.name || null,
      email: insertUser.email || null,
      userType: insertUser.userType || 'client'
    };
    this.users.set(id, user);
    return user;
  }
  
  async getBusinessIdentity(): Promise<BusinessIdentity | undefined> {
    return this.businessIdentityData;
  }
  
  async saveBusinessIdentity(data: InsertBusinessIdentity): Promise<BusinessIdentity> {
    const identity = {
      ...data,
      id: 1,
      updatedAt: new Date()
    };
    this.businessIdentityData = identity;
    return identity;
  }
  
  async getProjectContext(): Promise<ProjectContext | undefined> {
    return this.projectContextData;
  }
  
  async saveProjectContext(data: InsertProjectContext): Promise<ProjectContext> {
    const context = {
      ...data,
      id: 1,
      updatedAt: new Date()
    };
    this.projectContextData = context;
    return context;
  }
  
  // Onboarding state operations
  async getOnboardingState(userId: number): Promise<OnboardingState | undefined> {
    const userStates = this.onboardingStates.get(userId) || [];
    if (userStates.length === 0) return undefined;
    
    // Return the most recent state
    return userStates.sort((a, b) => 
      b.checkpointTime.getTime() - a.checkpointTime.getTime()
    )[0];
  }
  
  async getOnboardingStageState(userId: number, stage: string): Promise<OnboardingState | undefined> {
    const userStates = this.onboardingStates.get(userId) || [];
    
    // Find the most recent state for the given stage
    const stageStates = userStates
      .filter(state => state.stage === stage)
      .sort((a, b) => b.checkpointTime.getTime() - a.checkpointTime.getTime());
    
    return stageStates.length > 0 ? stageStates[0] : undefined;
  }
  
  async saveOnboardingState(data: InsertOnboardingState): Promise<OnboardingState> {
    const id = this.currentId++;
    const now = new Date();
    
    // Generate a recovery token if not provided
    const recoveryToken = data.recoveryToken || crypto.randomBytes(16).toString('hex');
    
    const state: OnboardingState = {
      id,
      userId: data.userId,
      stage: data.stage,
      status: data.status,
      data: data.data || null,
      checkpointTime: now,
      recoveryToken,
      blueprintVersion: data.blueprintVersion || '1.0.0',
      guardianSynced: data.guardianSynced || false,
      createdAt: now,
      updatedAt: now
    };
    
    // Initialize user's states array if not exists
    if (!this.onboardingStates.has(data.userId)) {
      this.onboardingStates.set(data.userId, []);
    }
    
    // Add the new state
    this.onboardingStates.get(data.userId)!.push(state);
    
    return state;
  }
  
  async updateOnboardingStatus(userId: number, stage: string, status: string, data?: any): Promise<OnboardingState | undefined> {
    // Get current state for this stage
    const currentState = await this.getOnboardingStageState(userId, stage);
    
    if (currentState) {
      // Update the existing state
      const now = new Date();
      const updatedState: OnboardingState = {
        ...currentState,
        status,
        data: data !== undefined ? data : currentState.data,
        checkpointTime: now,
        updatedAt: now
      };
      
      // Replace the old state with the updated one
      const userStates = this.onboardingStates.get(userId) || [];
      const stateIndex = userStates.findIndex(s => s.id === currentState.id);
      
      if (stateIndex !== -1) {
        userStates[stateIndex] = updatedState;
        return updatedState;
      }
    }
    
    // If no existing state or updating failed, create a new one
    return this.saveOnboardingState({
      userId,
      stage,
      status,
      data: data || null
    });
  }
  
  async markOnboardingStageComplete(userId: number, stage: string, data?: any): Promise<OnboardingState | undefined> {
    return this.updateOnboardingStatus(userId, stage, 'complete', data);
  }
  
  async getIncompleteOnboarding(userId: number): Promise<OnboardingState | undefined> {
    const userStates = this.onboardingStates.get(userId) || [];
    
    // Find the most recent in_progress state
    const incompleteStates = userStates
      .filter(state => state.status === 'in_progress')
      .sort((a, b) => b.checkpointTime.getTime() - a.checkpointTime.getTime());
    
    return incompleteStates.length > 0 ? incompleteStates[0] : undefined;
  }
  
  async markGuardianSynced(id: number, synced: boolean = true): Promise<OnboardingState | undefined> {
    // Find the state with this ID across all users
    for (const userStates of this.onboardingStates.values()) {
      const stateIndex = userStates.findIndex(state => state.id === id);
      
      if (stateIndex !== -1) {
        const updatedState: OnboardingState = {
          ...userStates[stateIndex],
          guardianSynced: synced,
          updatedAt: new Date()
        };
        
        userStates[stateIndex] = updatedState;
        return updatedState;
      }
    }
    
    return undefined;
  }
  
  async saveOnboardingPreference(userId: number, preference: string): Promise<OnboardingState | undefined> {
    try {
      // Check if valid preference
      const validPreference = ['full_site', 'tools_only', 'undecided'].includes(preference) 
        ? preference 
        : 'undecided';
      
      // Check if the user has an existing 'website_preference' stage entry
      const existingPreference = await this.getOnboardingStageState(userId, 'website_preference');
      
      if (existingPreference) {
        // Update the existing preference
        const now = new Date();
        const updatedState: OnboardingState = {
          ...existingPreference,
          data: { preference: validPreference },
          checkpointTime: now,
          updatedAt: now
        };
        
        // Replace the old state
        const userStates = this.onboardingStates.get(userId) || [];
        const stateIndex = userStates.findIndex(s => s.id === existingPreference.id);
        
        if (stateIndex !== -1) {
          userStates[stateIndex] = updatedState;
          return updatedState;
        }
      }
      
      // Create new preference state
      return this.saveOnboardingState({
        userId,
        stage: 'website_preference',
        status: 'complete',
        data: { preference: validPreference }
      });
    } catch (error) {
      console.error("Error saving onboarding preference:", error);
      return undefined;
    }
  }
  
  async getModule(id: string): Promise<Module | undefined> {
    return this.modules.get(id);
  }
  
  async getAllModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }
  
  async getModulesByCategory(category: string): Promise<Module[]> {
    return Array.from(this.modules.values()).filter(
      module => module.category === category
    );
  }
  
  async saveModule(moduleData: InsertModule): Promise<Module> {
    const now = new Date();
    const module = {
      ...moduleData,
      createdAt: now,
      updatedAt: now
    };
    this.modules.set(module.id, module);
    return module;
  }
  
  async updateModuleStatus(id: string, status: string): Promise<Module | undefined> {
    const module = this.modules.get(id);
    if (module) {
      const updated = { ...module, status, updatedAt: new Date() };
      this.modules.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async saveFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest> {
    const id = this.currentId++;
    const featureRequest = {
      ...request,
      id,
      sentAt: new Date().toISOString(),
      status: request.status || 'sent'
    };
    this.featureRequests.push(featureRequest);
    return featureRequest;
  }
  
  async getFeatureRequests(): Promise<FeatureRequest[]> {
    return this.featureRequests;
  }
  
  async updateFeatureRequestStatus(id: number, status: string): Promise<FeatureRequest | undefined> {
    const index = this.featureRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.featureRequests[index] = {
        ...this.featureRequests[index],
        status
      };
      return this.featureRequests[index];
    }
    return undefined;
  }

  async saveContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentId++;
    const submission = { 
      ...data, 
      id, 
      date: new Date() 
    };
    
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
  
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentId++;
    const log = {
      ...activity,
      id,
      timestamp: new Date()
    };
    this.activityLogs.push(log);
    return log;
  }
  
  async getActivityLogs(userId?: number, limit: number = 50): Promise<ActivityLog[]> {
    let logs = this.activityLogs;
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    return logs.slice(0, limit);
  }
  
  // Module activation logging implementation
  async logModuleActivation(activation: InsertModuleActivation): Promise<ModuleActivation> {
    const id = this.currentId++;
    const now = new Date();
    
    const moduleActivation: ModuleActivation = {
      id,
      userId: activation.userId,
      moduleId: activation.moduleId,
      activatedAt: new Date(),
      pageMetadata: activation.pageMetadata ?? null,
      guardianSynced: activation.guardianSynced ?? false,
      createdAt: now,
      updatedAt: now
    };
    
    this.moduleActivationLogs.push(moduleActivation);
    return moduleActivation;
  }
  
  async getModuleActivations(userId?: number, moduleId?: string): Promise<ModuleActivation[]> {
    let activations = this.moduleActivationLogs;
    
    // Apply filters if provided
    if (userId && moduleId) {
      activations = activations.filter(
        activation => activation.userId === userId && activation.moduleId === moduleId
      );
    } else if (userId) {
      activations = activations.filter(activation => activation.userId === userId);
    } else if (moduleId) {
      activations = activations.filter(activation => activation.moduleId === moduleId);
    }
    
    // Sort by most recent first
    return activations.sort(
      (a, b) => b.activatedAt.getTime() - a.activatedAt.getTime()
    );
  }
  
  async markModuleActivationSynced(id: number, synced: boolean = true): Promise<ModuleActivation | undefined> {
    const index = this.moduleActivationLogs.findIndex(activation => activation.id === id);
    
    if (index !== -1) {
      const updated: ModuleActivation = {
        ...this.moduleActivationLogs[index],
        guardianSynced: synced,
        updatedAt: new Date()
      };
      
      this.moduleActivationLogs[index] = updated;
      return updated;
    }
    
    return undefined;
  }
  
  // Page complexity triage implementation
  async savePageComplexityTriage(triage: InsertPageComplexityTriage): Promise<PageComplexityTriage> {
    const id = this.currentId++;
    const now = new Date();
    
    const pageComplexityTriage: PageComplexityTriage = {
      id,
      userId: triage.userId,
      requestDescription: triage.requestDescription,
      visualComplexity: triage.visualComplexity,
      logicComplexity: triage.logicComplexity,
      dataComplexity: triage.dataComplexity,
      estimatedHours: triage.estimatedHours,
      complexityLevel: triage.complexityLevel,
      aiAssessment: triage.aiAssessment,
      vaultSynced: triage.vaultSynced ?? false,
      guardianSynced: triage.guardianSynced ?? false,
      triageTimestamp: now,
      createdAt: now,
      updatedAt: now
    };
    
    this.pageComplexityTriages.push(pageComplexityTriage);
    return pageComplexityTriage;
  }
  
  async getPageComplexityTriage(id: number): Promise<PageComplexityTriage | undefined> {
    return this.pageComplexityTriages.find(triage => triage.id === id);
  }
  
  async getPageComplexityTriagesByUser(userId: number): Promise<PageComplexityTriage[]> {
    return this.pageComplexityTriages
      .filter(triage => triage.userId === userId)
      .sort((a, b) => b.triageTimestamp.getTime() - a.triageTimestamp.getTime());
  }
  
  async updatePageComplexitySyncStatus(
    id: number, 
    vaultSynced?: boolean, 
    guardianSynced?: boolean
  ): Promise<PageComplexityTriage | undefined> {
    const index = this.pageComplexityTriages.findIndex(triage => triage.id === id);
    
    if (index !== -1) {
      const updateData: { vaultSynced?: boolean, guardianSynced?: boolean } = {};
      
      if (vaultSynced !== undefined) {
        updateData.vaultSynced = vaultSynced;
      }
      
      if (guardianSynced !== undefined) {
        updateData.guardianSynced = guardianSynced;
      }
      
      const updated: PageComplexityTriage = {
        ...this.pageComplexityTriages[index],
        ...updateData,
        updatedAt: new Date()
      };
      
      this.pageComplexityTriages[index] = updated;
      return updated;
    }
    
    return undefined;
  }

  // SEO Configuration operations
  async getSeoConfiguration(routePath: string): Promise<SeoConfiguration | undefined> {
    return Array.from(this.seoConfigurations.values()).find(
      config => config.routePath === routePath
    );
  }
  
  async getAllSeoConfigurations(): Promise<SeoConfiguration[]> {
    return Array.from(this.seoConfigurations.values()).sort(
      (a, b) => a.routePath.localeCompare(b.routePath)
    );
  }
  
  async saveSeoConfiguration(config: InsertSeoConfiguration): Promise<SeoConfiguration> {
    const existing = await this.getSeoConfiguration(config.routePath);
    
    if (existing) {
      // Update existing configuration
      const updated = {
        ...existing,
        ...config,
        updatedAt: new Date()
      };
      this.seoConfigurations.set(config.routePath, updated);
      return updated;
    } else {
      // Create new configuration
      const now = new Date();
      const newConfig = {
        ...config,
        id: this.currentId++,
        vaultSynced: false,
        guardianSynced: false,
        createdAt: now,
        updatedAt: now
      };
      this.seoConfigurations.set(config.routePath, newConfig);
      return newConfig;
    }
  }
  
  async updateSeoConfiguration(id: number, config: Partial<InsertSeoConfiguration>): Promise<SeoConfiguration | undefined> {
    // Find the configuration with this ID
    const found = Array.from(this.seoConfigurations.values()).find(conf => conf.id === id);
    
    if (found) {
      const updated = {
        ...found,
        ...config,
        updatedAt: new Date()
      };
      
      this.seoConfigurations.set(found.routePath, updated);
      return updated;
    }
    
    return undefined;
  }
  
  async deleteSeoConfiguration(id: number): Promise<boolean> {
    // Find the configuration to delete
    const found = Array.from(this.seoConfigurations.values()).find(conf => conf.id === id);
    
    if (found) {
      this.seoConfigurations.delete(found.routePath);
      return true;
    }
    
    return false;
  }
  
  async getSeoConfigurationsByStatus(indexable: boolean): Promise<SeoConfiguration[]> {
    return Array.from(this.seoConfigurations.values())
      .filter(conf => conf.indexable === indexable)
      .sort((a, b) => b.priority - a.priority);
  }
  
  async updateSeoSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<SeoConfiguration | undefined> {
    // Find the configuration to update
    const found = Array.from(this.seoConfigurations.values()).find(conf => conf.id === id);
    
    if (found) {
      const updated = {
        ...found,
        vaultSynced: vaultSynced !== undefined ? vaultSynced : found.vaultSynced,
        guardianSynced: guardianSynced !== undefined ? guardianSynced : found.guardianSynced,
        updatedAt: new Date()
      };
      
      this.seoConfigurations.set(found.routePath, updated);
      return updated;
    }
    
    return undefined;
  }
  
  // Brand Versioning operations
  async getBrandVersion(id: number): Promise<BrandVersion | undefined> {
    return this.brandVersions.get(id);
  }
  
  async getBrandVersionByNumber(versionNumber: string): Promise<BrandVersion | undefined> {
    return Array.from(this.brandVersions.values()).find(
      version => version.versionNumber === versionNumber
    );
  }
  
  async getActiveBrandVersion(): Promise<BrandVersion | undefined> {
    return Array.from(this.brandVersions.values())
      .filter(version => version.isActive)
      .sort((a, b) => (b.appliedAt?.getTime() || 0) - (a.appliedAt?.getTime() || 0))[0];
  }
  
  async getAllBrandVersions(): Promise<BrandVersion[]> {
    return Array.from(this.brandVersions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async saveBrandVersion(version: InsertBrandVersion): Promise<BrandVersion> {
    const existing = await this.getBrandVersionByNumber(version.versionNumber);
    
    if (existing) {
      // Update existing version
      const updated = {
        ...existing,
        ...version,
        updatedAt: new Date()
      };
      this.brandVersions.set(existing.id, updated);
      return updated;
    } else {
      // Create new version
      const now = new Date();
      const newVersion = {
        ...version,
        id: this.currentId++,
        isActive: false,
        vaultSynced: false,
        guardianSynced: false,
        createdAt: now,
        updatedAt: now
      };
      this.brandVersions.set(newVersion.id, newVersion);
      return newVersion;
    }
  }
  
  async activateBrandVersion(id: number): Promise<BrandVersion | undefined> {
    // Find the version to activate
    const version = this.brandVersions.get(id);
    
    if (!version) {
      return undefined;
    }
    
    // Deactivate all currently active versions
    Array.from(this.brandVersions.values())
      .filter(v => v.isActive)
      .forEach(v => {
        const updated = { ...v, isActive: false, updatedAt: new Date() };
        this.brandVersions.set(v.id, updated);
      });
    
    // Activate the requested version
    const activated = {
      ...version,
      isActive: true,
      appliedAt: new Date(),
      updatedAt: new Date()
    };
    
    this.brandVersions.set(id, activated);
    return activated;
  }
  
  async updateBrandSyncStatus(id: number, vaultSynced?: boolean, guardianSynced?: boolean): Promise<BrandVersion | undefined> {
    const version = this.brandVersions.get(id);
    
    if (version) {
      const updated = {
        ...version,
        vaultSynced: vaultSynced !== undefined ? vaultSynced : version.vaultSynced,
        guardianSynced: guardianSynced !== undefined ? guardianSynced : version.guardianSynced,
        updatedAt: new Date()
      };
      
      this.brandVersions.set(id, updated);
      return updated;
    }
    
    return undefined;
  }
  
  // Blueprint Export operations
  async getClientRegistry(): Promise<ClientRegistry | undefined> {
    return this.clientRegistryData;
  }
  
  async createClientRegistry(data: InsertClientRegistry): Promise<ClientRegistry> {
    const id = this.currentId++;
    const now = new Date();
    
    const clientRegistry: ClientRegistry = {
      id,
      clientId: data.clientId,
      blueprintVersion: data.blueprintVersion || "1.0.0",
      sector: data.sector || null,
      location: data.location || null,
      projectStartDate: data.projectStartDate || now,
      userRoles: data.userRoles || null,
      exportReady: data.exportReady || false,
      handoffStatus: data.handoffStatus || "in_progress",
      exportableModules: data.exportableModules || null,
      lastExported: data.lastExported || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.clientRegistryData = clientRegistry;
    return clientRegistry;
  }
  
  async updateClientRegistry(clientId: string, data: Partial<InsertClientRegistry>): Promise<ClientRegistry | undefined> {
    if (!this.clientRegistryData || this.clientRegistryData.clientId !== clientId) {
      return undefined;
    }
    
    const updated: ClientRegistry = {
      ...this.clientRegistryData,
      ...data,
      updatedAt: new Date()
    };
    
    this.clientRegistryData = updated;
    return updated;
  }
  
  async updateExportableModules(clientId: string, moduleList: any[]): Promise<ClientRegistry | undefined> {
    if (!this.clientRegistryData || this.clientRegistryData.clientId !== clientId) {
      return undefined;
    }
    
    const updated: ClientRegistry = {
      ...this.clientRegistryData,
      exportableModules: moduleList,
      updatedAt: new Date()
    };
    
    this.clientRegistryData = updated;
    return updated;
  }
  
  async markAsExportReady(clientId: string, exportReady: boolean): Promise<ClientRegistry | undefined> {
    if (!this.clientRegistryData || this.clientRegistryData.clientId !== clientId) {
      return undefined;
    }
    
    const updated: ClientRegistry = {
      ...this.clientRegistryData,
      exportReady,
      lastExported: exportReady ? new Date() : this.clientRegistryData.lastExported,
      updatedAt: new Date()
    };
    
    this.clientRegistryData = updated;
    return updated;
  }
  
  async updateHandoffStatus(clientId: string, status: string): Promise<ClientRegistry | undefined> {
    if (!this.clientRegistryData || this.clientRegistryData.clientId !== clientId) {
      return undefined;
    }
    
    const updated: ClientRegistry = {
      ...this.clientRegistryData,
      handoffStatus: status,
      updatedAt: new Date()
    };
    
    this.clientRegistryData = updated;
    return updated;
  }
  
  // Blueprint version management
  async getAllBlueprintVersions(): Promise<any[]> {
    // Return empty array for in-memory implementation
    return [];
  }
  
  async deprecateBlueprintVersion(version: string): Promise<boolean> {
    // Always return true for in-memory implementation
    return true;
  }
  
  // Activity logging
  async addActivityLog(log: any): Promise<void> {
    const id = this.currentId++;
    const activityLog = {
      id,
      userType: log.userType || 'system',
      actionType: log.actionType || 'info',
      entityType: log.entityType || 'system',
      entityId: log.entityId || '0',
      userId: log.userId || null,
      details: log.details || null,
      timestamp: new Date()
    };
    this.activityLogs.push(activityLog);
  }
}

// Using the DatabaseStorage implementation for production
export const storage = new DatabaseStorage();
