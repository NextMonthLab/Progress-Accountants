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
  type InsertOnboardingState
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
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
  sessionStore: session.Store = new session.MemoryStore();

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.featureRequests = [];
    this.contactSubmissions = new Map();
    this.modules = new Map();
    this.activityLogs = [];
    this.onboardingStates = new Map();
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
}

// Using the DatabaseStorage implementation for production
export const storage = new DatabaseStorage();
