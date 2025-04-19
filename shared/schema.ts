import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { PageMetadata, PageComplexityAssessment, ComplexityLevel } from "./page_metadata";

// User authentication tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }),
  userType: varchar("user_type", { length: 20 }).default("client").notNull(), // client or staff
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  userType: true,
  email: true,
});

// Business identity and branding data
export const businessIdentity = pgTable("business_identity", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  mission: text("mission"),
  vision: text("vision"),
  values: jsonb("values"),
  marketFocus: jsonb("market_focus"),
  targetAudience: jsonb("target_audience"),
  brandVoice: jsonb("brand_voice"),
  brandPositioning: text("brand_positioning"),
  teamValues: jsonb("team_values"),
  cultureStatements: jsonb("culture_statements"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessIdentitySchema = createInsertSchema(businessIdentity).omit({
  id: true,
  updatedAt: true,
});

// Project context for pages and setup status
export const projectContext = pgTable("project_context", {
  id: serial("id").primaryKey(),
  homepageSetup: jsonb("homepage_setup"), // Homepage setup details
  pageStatus: jsonb("page_status"), // Status of various pages
  onboardingComplete: boolean("onboarding_complete").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectContextSchema = createInsertSchema(projectContext).omit({
  id: true,
  updatedAt: true,
});

// Modules registry and activation status
export const modules = pgTable("modules", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("inactive").notNull(),
  iconType: varchar("icon_type", { length: 50 }),
  iconColor: varchar("icon_color", { length: 50 }),
  path: varchar("path", { length: 255 }),
  previewAvailable: boolean("preview_available").default(false),
  premium: boolean("premium").default(false),
  credits: integer("credits"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  createdAt: true,
  updatedAt: true,
});

// Feature requests tracking
export const featureRequests = pgTable("feature_requests", {
  id: serial("id").primaryKey(),
  businessId: varchar("business_id", { length: 100 }),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }),
  requestData: jsonb("request_data"),
  status: varchar("status", { length: 20 }).default("sent").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const insertFeatureRequestSchema = createInsertSchema(featureRequests).omit({
  id: true,
  sentAt: true,
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  business: varchar("business", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  message: text("message").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  date: true,
});

// Activity logs for tracking user actions
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  userType: varchar("user_type", { length: 20 }).notNull(),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

// Define relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  activityLogs: many(activityLogs),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Onboarding state table for tracking user progress through setup flow
export const onboardingState = pgTable("onboarding_state", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stage: varchar("stage", { length: 50 }).notNull(), // homepage_setup, foundation_pages, launch_ready
  status: varchar("status", { length: 20 }).default("in_progress").notNull(), // not_started, in_progress, complete
  data: jsonb("data"), // Any stage-specific data
  checkpointTime: timestamp("checkpoint_time").defaultNow().notNull(),
  recoveryToken: varchar("recovery_token", { length: 255 }),
  blueprintVersion: varchar("blueprint_version", { length: 50 }).default("1.0.0"),
  guardianSynced: boolean("guardian_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOnboardingStateSchema = createInsertSchema(onboardingState).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define relationships for onboarding state
export const onboardingStateRelations = relations(onboardingState, ({ one }) => ({
  user: one(users, {
    fields: [onboardingState.userId],
    references: [users.id],
  }),
}));

// Module activation logging
export const moduleActivations = pgTable("module_activations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  moduleId: varchar("module_id", { length: 100 }).references(() => modules.id).notNull(),
  activatedAt: timestamp("activated_at").defaultNow().notNull(),
  pageMetadata: jsonb("page_metadata"), // Storing the page_metadata object
  guardianSynced: boolean("guardian_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertModuleActivationSchema = createInsertSchema(moduleActivations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define relationships for module activations
export const moduleActivationsRelations = relations(moduleActivations, ({ one }) => ({
  user: one(users, {
    fields: [moduleActivations.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [moduleActivations.moduleId],
    references: [modules.id],
  }),
}));

// Page complexity triage
export const pageComplexityTriage = pgTable("page_complexity_triage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  requestDescription: text("request_description").notNull(),
  visualComplexity: real("visual_complexity").notNull(), // 1-10 score
  logicComplexity: real("logic_complexity").notNull(), // 1-10 score
  dataComplexity: real("data_complexity").notNull(), // 1-10 score
  estimatedHours: real("estimated_hours").notNull(),
  complexityLevel: varchar("complexity_level", { length: 20 }).notNull(), // simple, moderate, complex, wishlist
  aiAssessment: text("ai_assessment").notNull(),
  vaultSynced: boolean("vault_synced").default(false),
  guardianSynced: boolean("guardian_synced").default(false),
  triageTimestamp: timestamp("triage_timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageComplexityTriageSchema = createInsertSchema(pageComplexityTriage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define relationships for page complexity triage
export const pageComplexityTriageRelations = relations(pageComplexityTriage, ({ one }) => ({
  user: one(users, {
    fields: [pageComplexityTriage.userId],
    references: [users.id],
  }),
}));

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBusinessIdentity = z.infer<typeof insertBusinessIdentitySchema>;
export type BusinessIdentity = typeof businessIdentity.$inferSelect;

export type InsertProjectContext = z.infer<typeof insertProjectContextSchema>;
export type ProjectContext = typeof projectContext.$inferSelect;

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;
export type FeatureRequest = typeof featureRequests.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type InsertOnboardingState = z.infer<typeof insertOnboardingStateSchema>;
export type OnboardingState = typeof onboardingState.$inferSelect;

export type InsertModuleActivation = z.infer<typeof insertModuleActivationSchema>;
export type ModuleActivation = typeof moduleActivations.$inferSelect;

export type InsertPageComplexityTriage = z.infer<typeof insertPageComplexityTriageSchema>;
export type PageComplexityTriage = typeof pageComplexityTriage.$inferSelect;

// SEO Configuration table
export const seoConfigurations = pgTable("seo_configurations", {
  id: serial("id").primaryKey(),
  routePath: varchar("route_path", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  canonical: varchar("canonical", { length: 255 }),
  keywords: jsonb("keywords"),
  ogImage: varchar("og_image", { length: 255 }),
  structuredData: jsonb("structured_data"),
  indexable: boolean("indexable").default(true).notNull(),
  priority: real("priority").default(0.5).notNull(), // For sitemaps
  changeFrequency: varchar("change_frequency", { length: 20 }).default("monthly"), // For sitemaps
  guardianSynced: boolean("guardian_synced").default(false),
  vaultSynced: boolean("vault_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSeoConfigurationSchema = createInsertSchema(seoConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Brand versioning table
export const brandVersions = pgTable("brand_versions", {
  id: serial("id").primaryKey(),
  versionNumber: varchar("version_number", { length: 20 }).notNull(),
  versionName: varchar("version_name", { length: 100 }),
  primaryColor: varchar("primary_color", { length: 30 }),
  secondaryColor: varchar("secondary_color", { length: 30 }),
  accentColor: varchar("accent_color", { length: 30 }),
  typography: jsonb("typography"), // primaryFont, secondaryFont, headingSettings, etc
  logoUrl: varchar("logo_url", { length: 255 }),
  brandIdentityData: jsonb("brand_identity_data"), // Contains all brand identity elements
  brandVoiceData: jsonb("brand_voice_data"), // Tone, messaging, etc.
  brandAssets: jsonb("brand_assets"), // URLs to additional brand assets
  isActive: boolean("is_active").default(false),
  appliedAt: timestamp("applied_at"),
  guardianSynced: boolean("guardian_synced").default(false),
  vaultSynced: boolean("vault_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBrandVersionSchema = createInsertSchema(brandVersions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSeoConfiguration = z.infer<typeof insertSeoConfigurationSchema>;
export type SeoConfiguration = typeof seoConfigurations.$inferSelect;

export type InsertBrandVersion = z.infer<typeof insertBrandVersionSchema>;
export type BrandVersion = typeof brandVersions.$inferSelect;

// Client registry table for blueprint export
export const clientRegistry = pgTable("client_registry", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id", { length: 100 }).notNull().unique(),
  blueprintVersion: varchar("blueprint_version", { length: 20 }).default("1.0.0").notNull(),
  sector: varchar("sector", { length: 100 }),
  location: varchar("location", { length: 255 }),
  projectStartDate: timestamp("project_start_date").defaultNow(),
  userRoles: jsonb("user_roles"), // Roles defined for this client
  exportReady: boolean("export_ready").default(false),
  handoffStatus: varchar("handoff_status", { length: 50 }).default("in_progress"),
  exportableModules: jsonb("exportable_modules"), // List of modules that can be exported
  lastExported: timestamp("last_exported"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientRegistrySchema = createInsertSchema(clientRegistry).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClientRegistry = z.infer<typeof insertClientRegistrySchema>;
export type ClientRegistry = typeof clientRegistry.$inferSelect;
