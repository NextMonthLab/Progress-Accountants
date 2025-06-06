import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, real, uuid, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { PageMetadata, PageComplexityAssessment, ComplexityLevel } from "./page_metadata";
import { ComponentType, SeoImpactLevel, ComponentContext } from "./advanced_page_builder";
import { VersionableEntityType, VersionStatus, ChangeType } from "./version_control";
import { DomainStatus, VerificationMethod } from "./domain_mapping";
import { NewsfeedSource } from "./newsfeed_types";
// Business network models are defined in business_network.ts

// Tenants table to track all client instances
// Define the table without self-reference first to fix circular reference
export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("active").notNull(), // active, inactive, suspended
  industry: varchar("industry", { length: 100 }),
  plan: varchar("plan", { length: 50 }).default("standard").notNull(), // standard, premium, enterprise
  theme: jsonb("theme"), // Theme configuration
  customization: jsonb("customization"), // Client-specific customization (UI labels, tone, feature flags)
  newsfeedConfig: jsonb("newsfeed_config"), // Newsfeed configuration for admin dashboard
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  parentTemplate: uuid("parent_template"), // Will add the reference constraint later
  isTemplate: boolean("is_template").default(false),
  starterType: varchar("starter_type", { length: 20 }).default("blank").notNull(), // blank or pro
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Blueprint versions table
export const blueprintVersions = pgTable("blueprint_versions", {
  id: serial("id").primaryKey(),
  version: varchar("version", { length: 20 }).notNull(),
  deprecated: boolean("deprecated").default(false),
  releaseDate: timestamp("release_date").defaultNow(),
  releaseNotes: text("release_notes"),
  modules: jsonb("modules"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User authentication tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }),
  userType: varchar("user_type", { length: 20 }).default("public").notNull(), // Roles: 'super_admin', 'admin', 'editor', 'public'
  email: varchar("email", { length: 255 }),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Reference to tenant
  isSuperAdmin: boolean("is_super_admin").default(false), // For NextMonth admins who need cross-tenant access
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Note: The tenant+username uniqueness will be enforced through application logic
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  userType: true,
  email: true,
  tenantId: true,
  isSuperAdmin: true,
});

// Business identity and branding data
export const businessIdentity = pgTable("business_identity", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Tenant reference
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessIdentitySchema = createInsertSchema(businessIdentity).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Project context for pages and setup status
export const projectContext = pgTable("project_context", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Tenant reference
  homepageSetup: jsonb("homepage_setup"), // Homepage setup details
  pageStatus: jsonb("page_status"), // Status of various pages
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectContextSchema = createInsertSchema(projectContext).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// SmartSite Autopilot settings
export const autopilotSettings = pgTable("autopilot_settings", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  
  // Blog Autopilot Settings
  blogAutopilotEnabled: boolean("blog_autopilot_enabled").default(false),
  postingFrequency: varchar("posting_frequency", { length: 20 }).default("weekly"), // daily, weekly, fortnightly, monthly
  contentSources: jsonb("content_sources").default([]), // chat_questions, lead_insights, market_trends
  aiTonePreference: varchar("ai_tone_preference", { length:20 }).default("professional"), // friendly, professional, authoritative, casual
  reviewBeforePublish: boolean("review_before_publish").default(true),
  
  // Chat Override Notifications
  emailNotifyOnLiveChat: boolean("email_notify_on_live_chat").default(false),
  notifyOnlyHighLeadScore: boolean("notify_only_high_lead_score").default(false),
  leadScoreThreshold: integer("lead_score_threshold").default(70),
  autoPauseAssistant: boolean("auto_pause_assistant").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAutopilotSettingsSchema = createInsertSchema(autopilotSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AutopilotSettings = typeof autopilotSettings.$inferSelect;
export type InsertAutopilotSettings = z.infer<typeof insertAutopilotSettingsSchema>;

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
  userType: varchar("user_type", { length: 20 }).notNull(), // 'super_admin', 'admin', 'editor', 'public'
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
export const usersRelations = relations(users, ({ many, one }) => ({
  activityLogs: many(activityLogs),
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
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

// Advanced Page Builder tables are defined further below (line ~605)

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

// Companion Configuration table
export const companionConfig = pgTable("companion_config", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  toneStyle: varchar("tone_style", { length: 50 }), // Friendly, Professional, Concise, Empathetic
  examplePhrases: text("example_phrases"), // Example greeting and phrases
  allowedTopics: jsonb("allowed_topics"), // Topics the companion can discuss - stored as JSON array
  offLimitTopics: text("off_limit_topics"), // Topics the companion should avoid
  isRegulated: boolean("is_regulated").default(false), // Whether in a regulated industry
  regulatoryGuidelinesLink: varchar("regulatory_guidelines_link", { length: 500 }), // Link to guidelines
  regulatedTermsToAvoid: text("regulated_terms_to_avoid"), // Terms to avoid in regulated industries
  legalDisclaimer: text("legal_disclaimer"), // Legal disclaimer for AI responses
  allowWebSearch: boolean("allow_web_search").default(false), // Whether the AI can access external data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCompanionConfigSchema = createInsertSchema(companionConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Conversation Insights table
export const conversationInsights = pgTable("conversation_insights", {
  id: serial("id").primaryKey(),
  conversationId: varchar("conversation_id", { length: 64 }).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  userMessage: text("user_message").notNull(),
  agentResponse: text("agent_response").notNull(),
  mode: varchar("mode", { length: 20 }).notNull(), // 'public' or 'admin'
  intent: text("intent"), // GPT-analyzed intent
  sentiment: varchar("sentiment", { length: 20 }), // positive, negative, neutral
  leadPotential: boolean("lead_potential").default(false),
  confusionDetected: boolean("confusion_detected").default(false),
  tags: jsonb("tags"), // Array of auto-generated topic tags
  analysisNotes: text("analysis_notes"), // GPT-generated insights
  metadata: jsonb("metadata"), // Additional context (page, user-agent, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationInsightSchema = createInsertSchema(conversationInsights).omit({
  id: true,
  createdAt: true,
});

// Table for agent conversations (storing full conversation history)
export const agentConversations = pgTable("agent_conversations", {
  id: serial("id").primaryKey(),
  conversationId: varchar("conversation_id", { length: 64 }).notNull().unique(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  messages: jsonb("messages").notNull(), // Array of message objects with role, content
  mode: varchar("mode", { length: 20 }).notNull(), // 'public' or 'admin'
  metadata: jsonb("metadata"), // Additional context (clientId, page, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAgentConversationSchema = createInsertSchema(agentConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define relationships for companion config
export const companionConfigRelations = relations(companionConfig, ({ one }) => ({
  tenant: one(tenants, {
    fields: [companionConfig.tenantId],
    references: [tenants.id],
  }),
}));

// Media uploads table
export const mediaUploads = pgTable("media_uploads", {
  id: serial("id").primaryKey(),
  businessId: varchar("business_id", { length: 100 }).notNull(),
  publicUrl: varchar("public_url", { length: 500 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  bytes: integer("bytes").notNull(),
  credits: integer("credits").notNull(),
  cloudinaryId: varchar("cloudinary_id", { length: 255 }).notNull(),
  folder: varchar("folder", { length: 255 }).notNull(),
  suggestedLocation: text("suggested_location"),
  manualOverride: boolean("manual_override").default(false),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMediaUploadSchema = createInsertSchema(mediaUploads).omit({
  id: true,
  uploadedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Credit usage log
export const creditUsageLog = pgTable("credit_usage_log", {
  id: serial("id").primaryKey(),
  businessId: varchar("business_id", { length: 100 }).notNull(),
  credits: integer("credits").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(),
  description: text("description"),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCreditUsageLogSchema = createInsertSchema(creditUsageLog).omit({
  id: true,
  timestamp: true,
  createdAt: true,
  updatedAt: true,
});

// Resources table for custom resource page
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  fileUrl: varchar("file_url", { length: 500 }),    // Direct download URL
  link: varchar("link", { length: 500 }),          // Legacy field - kept for backward compatibility
  category: varchar("category", { length: 50 }),   // New field to match our UI
  type: varchar("type", { length: 50 }),          // Legacy field - kept for backward compatibility
  isPublished: boolean("is_published").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define relationships for resources
export const resourcesRelations = relations(resources, ({ one }) => ({
  tenant: one(tenants, {
    fields: [resources.tenantId],
    references: [tenants.id],
  }),
}));

// Advanced Page Builder tables
// ===========================

// Page Builder Pages table - the central table for all pages created with the builder
export const pageBuilderPages = pgTable("page_builder_pages", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  template: varchar("template", { length: 100 }),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, published, archived
  pageType: varchar("page_type", { length: 50 }).notNull(), // standard, landing, specialized
  metadata: jsonb("metadata"), // PageMetadata object
  seo: jsonb("seo"), // PageSeoMetadata object with extensions
  businessContext: jsonb("business_context"), // Business-specific context for the page
  analytics: jsonb("analytics"), // Analytics data for the page
  version: integer("version").default(1).notNull(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  isLocked: boolean("is_locked").default(false), // Indicates if page is locked (pro design)
  origin: varchar("origin", { length: 50 }).default("builder"), // builder or pro-design
  clonedFromId: integer("cloned_from_id"), // Reference to original page if cloned
  createdBy: integer("created_by").references(() => users.id),
  lastEditedBy: integer("last_edited_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageBuilderPageSchema = createInsertSchema(pageBuilderPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

// Page Builder Sections table - sections for each page
export const pageBuilderSections = pgTable("page_builder_sections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pageBuilderPages.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").default(0).notNull(),
  settings: jsonb("settings"), // Section settings like background, spacing, etc.
  seoWeight: integer("seo_weight").default(5), // Value from 1-10 indicating SEO importance
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageBuilderSectionSchema = createInsertSchema(pageBuilderSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Page Builder Components table - components within sections
export const pageBuilderComponents = pgTable("page_builder_components", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => pageBuilderSections.id).notNull(),
  parentId: integer("parent_id"), // For nested components
  type: varchar("type", { length: 50 }).notNull(), // ComponentType enum as string
  label: varchar("label", { length: 255 }),
  context: varchar("context", { length: 50 }).notNull(), // ComponentContext enum as string
  hidden: boolean("hidden").default(false),
  seoImpact: varchar("seo_impact", { length: 20 }).default("low"), // SeoImpactLevel enum as string
  settings: jsonb("settings"), // Component settings
  content: jsonb("content"), // Component content
  metadata: jsonb("metadata"), // SEO metadata for the component
  analytics: jsonb("analytics"), // Component-specific analytics
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageBuilderComponentSchema = createInsertSchema(pageBuilderComponents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Page Builder Templates table - reusable templates
export const pageBuilderTemplates = pgTable("page_builder_templates", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Null means globally available
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  industry: jsonb("industry"), // Array of industries this template is suitable for
  purpose: varchar("purpose", { length: 100 }), // What the template is designed for
  seoRecommendations: jsonb("seo_recommendations"), // SEO guidance for this template
  complexity: varchar("complexity", { length: 20 }).default("simple"), // ComplexityLevel enum as string
  isGlobal: boolean("is_global").default(false), // Available to all tenants
  thumbnail: varchar("thumbnail", { length: 500 }), // Preview image URL
  author: integer("author").references(() => users.id),
  structure: jsonb("structure"), // The template's default sections and components
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageBuilderTemplateSchema = createInsertSchema(pageBuilderTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Page Builder Component Library table - available components
export const pageBuilderComponentLibrary = pgTable("page_builder_component_library", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // ComponentType enum as string
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: varchar("thumbnail", { length: 500 }),
  defaultSettings: jsonb("default_settings"), // Default configuration for this component
  seoImpact: varchar("seo_impact", { length: 20 }).default("low"), // SeoImpactLevel enum as string
  context: jsonb("context"), // Array of ComponentContext values
  recommended: boolean("recommended").default(false),
  premium: boolean("premium").default(false),
  complexity: varchar("complexity", { length: 20 }).default("simple"), // ComplexityLevel enum as string
  isGlobal: boolean("is_global").default(true),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Null means globally available
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageBuilderComponentLibrarySchema = createInsertSchema(pageBuilderComponentLibrary).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Page Builder Recommendations table - AI suggestions
export const pageBuilderRecommendations = pgTable("page_builder_recommendations", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pageBuilderPages.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'seo', 'content', 'structure', 'performance'
  severity: varchar("severity", { length: 20 }).notNull(), // 'suggestion', 'recommendation', 'critical'
  message: text("message").notNull(),
  details: text("details"),
  affectedComponents: jsonb("affected_components"), // Array of component IDs
  improvement: text("improvement"),
  autoFixAvailable: boolean("auto_fix_available").default(false),
  dismissed: boolean("dismissed").default(false),
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageBuilderRecommendationSchema = createInsertSchema(pageBuilderRecommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Page Builder Version History table - track changes
export const pageBuilderVersionHistory = pgTable("page_builder_version_history", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pageBuilderPages.id).notNull(),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot").notNull(), // Full page state at this version
  changedBy: integer("changed_by").references(() => users.id),
  changeDescription: text("change_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPageBuilderVersionHistorySchema = createInsertSchema(pageBuilderVersionHistory).omit({
  id: true,
  createdAt: true,
});

// Define relationships for page builder
export const pageBuilderPagesRelations = relations(pageBuilderPages, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [pageBuilderPages.tenantId],
    references: [tenants.id],
  }),
  createdByUser: one(users, {
    fields: [pageBuilderPages.createdBy],
    references: [users.id],
  }),
  lastEditedByUser: one(users, {
    fields: [pageBuilderPages.lastEditedBy],
    references: [users.id],
  }),
  clonedFromPage: one(pageBuilderPages, {
    fields: [pageBuilderPages.clonedFromId],
    references: [pageBuilderPages.id],
  }),
  clones: many(pageBuilderPages, { relationName: "page_clones" }),
  sections: many(pageBuilderSections),
  recommendations: many(pageBuilderRecommendations),
  versionHistory: many(pageBuilderVersionHistory),
}));

export const pageBuilderSectionsRelations = relations(pageBuilderSections, ({ one, many }) => ({
  page: one(pageBuilderPages, {
    fields: [pageBuilderSections.pageId],
    references: [pageBuilderPages.id],
  }),
  components: many(pageBuilderComponents),
}));

export const pageBuilderComponentsRelations = relations(pageBuilderComponents, ({ one, many }) => ({
  section: one(pageBuilderSections, {
    fields: [pageBuilderComponents.sectionId],
    references: [pageBuilderSections.id],
  }),
  // Add self-reference after component table is created 
  parent: one(pageBuilderComponents, {
    fields: [pageBuilderComponents.parentId],
    references: [pageBuilderComponents.id],
  }),
  children: many(pageBuilderComponents, { relationName: "parent_child" }),
}));

// Foreign key constraint will be handled by the relations definition
// The explicit reference after definition was causing an error



// Export types
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

// Tenant customization interface
export interface TenantCustomization {
  uiLabels?: {
    // System-wide labels that can be customized per tenant
    siteName?: string;
    dashboardTitle?: string;
    toolsLabel?: string;
    pagesLabel?: string;
    marketplaceLabel?: string;
    accountLabel?: string;
    settingsLabel?: string;
  };
  tone?: {
    // Communication tone preferences
    formality: 'casual' | 'neutral' | 'formal';
    personality: 'friendly' | 'professional' | 'technical';
  };
  featureFlags?: {
    // Feature toggles for tenant-specific functionality
    enablePodcastTools: boolean;
    enableFinancialReporting: boolean;
    enableClientPortal: boolean;
    enableMarketplaceAccess: boolean;
    enableCustomPages: boolean;
    enableClientLogin: boolean; // Controls whether clients can log in to the site
  };
  sectionsEnabled?: {
    // Page sections that can be toggled on/off
    servicesShowcase: boolean;
    teamMembers: boolean;
    testimonialsSlider: boolean;
    blogPosts: boolean;
    eventCalendar: boolean;
    resourceCenter: boolean;
  };
}

// Define user role type for type safety
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'client';

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBusinessIdentity = z.infer<typeof insertBusinessIdentitySchema>;
export type BusinessIdentity = typeof businessIdentity.$inferSelect;

// Blog Post Schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  metaDescription: text("meta_description"),
  featuredImage: text("featured_image"),
  keywords: text("keywords").array(),
  author: integer("author_id").references(() => users.id),
  tenantId: text("tenant_id"),
  status: text("status").default("draft").notNull(), // draft, published, archived
  publishedAt: timestamp("published_at", { mode: 'date' }),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
  externalPublishData: jsonb("external_publish_data"), // For tracking external publishing locations
});

export const blogPages = pgTable("blog_pages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  tenantId: text("tenant_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

export const integrationRequests = pgTable("integration_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tenantId: text("tenant_id"),
  websiteUrl: text("website_url").notNull(),
  platform: text("platform").notNull(), // WordPress, Squarespace, Wix, Webflow, Other
  contactEmail: text("contact_email"),
  additionalInfo: text("additional_info"),
  status: text("status").default("pending").notNull(), // pending, in_progress, completed, rejected
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

// Create insert and select schemas for new tables
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogPageSchema = createInsertSchema(blogPages).omit({ id: true, createdAt: true, updatedAt: true });
export const insertIntegrationRequestSchema = createInsertSchema(integrationRequests).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertBlogPage = z.infer<typeof insertBlogPageSchema>;
export type BlogPage = typeof blogPages.$inferSelect;

export type InsertIntegrationRequest = z.infer<typeof insertIntegrationRequestSchema>;
export type IntegrationRequest = typeof integrationRequests.$inferSelect;

// Content Version Control System tables
export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  entityId: integer("entity_id").notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull().$type<VersionableEntityType>(),
  versionNumber: integer("version_number").notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).notNull().$type<VersionStatus>(),
  changeType: varchar("change_type", { length: 20 }).notNull().$type<ChangeType>(),
  changeDescription: text("change_description"),
  snapshot: jsonb("snapshot").notNull(),
  diff: jsonb("diff"),
}, (table) => {
  return {
    entityIdx: index("idx_content_versions_entity").on(table.entityId, table.entityType),
    statusIdx: index("idx_content_versions_status").on(table.status),
    createdAtIdx: index("idx_content_versions_created_at").on(table.createdAt),
    uniqueVersion: unique("unique_content_version").on(table.entityId, table.entityType, table.versionNumber)
  };
});

export const insertContentVersionSchema = createInsertSchema(contentVersions).omit({
  id: true,
  createdAt: true
});

export const changeLogs = pgTable("change_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: integer("entity_id").notNull(),
  versionId: integer("version_id").references(() => contentVersions.id),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
}, (table) => {
  return {
    userIdIdx: index("idx_change_logs_user_id").on(table.userId),
    timestampIdx: index("idx_change_logs_timestamp").on(table.timestamp),
    entityIdx: index("idx_change_logs_entity").on(table.entityType, table.entityId)
  };
});

export const insertChangeLogSchema = createInsertSchema(changeLogs).omit({
  id: true,
  timestamp: true
});

// Version Control Relationships
export const contentVersionsRelations = relations(contentVersions, ({ one, many }) => ({
  creator: one(users, {
    fields: [contentVersions.createdBy],
    references: [users.id]
  }),
  changeLogs: many(changeLogs)
}));

export const changeLogsRelations = relations(changeLogs, ({ one }) => ({
  user: one(users, {
    fields: [changeLogs.userId],
    references: [users.id]
  }),
  version: one(contentVersions, {
    fields: [changeLogs.versionId],
    references: [contentVersions.id]
  })
}));

export type InsertContentVersion = z.infer<typeof insertContentVersionSchema>;
export type ContentVersion = typeof contentVersions.$inferSelect;

export type InsertChangeLog = z.infer<typeof insertChangeLogSchema>;
export type ChangeLog = typeof changeLogs.$inferSelect;

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

export type InsertMediaUpload = z.infer<typeof insertMediaUploadSchema>;
export type MediaUpload = typeof mediaUploads.$inferSelect;

export type InsertCreditUsageLog = z.infer<typeof insertCreditUsageLogSchema>;
export type CreditUsageLog = typeof creditUsageLog.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Export types for the Page Builder
export type InsertPageBuilderPage = z.infer<typeof insertPageBuilderPageSchema>;
export type PageBuilderPage = typeof pageBuilderPages.$inferSelect;

export type InsertPageBuilderSection = z.infer<typeof insertPageBuilderSectionSchema>;
export type PageBuilderSection = typeof pageBuilderSections.$inferSelect;

export type InsertPageBuilderComponent = z.infer<typeof insertPageBuilderComponentSchema>;
export type PageBuilderComponent = typeof pageBuilderComponents.$inferSelect;

export type InsertPageBuilderTemplate = z.infer<typeof insertPageBuilderTemplateSchema>;
export type PageBuilderTemplate = typeof pageBuilderTemplates.$inferSelect;

export type InsertPageBuilderComponentLibrary = z.infer<typeof insertPageBuilderComponentLibrarySchema>;
export type PageBuilderComponentLibraryItem = typeof pageBuilderComponentLibrary.$inferSelect;

export type InsertPageBuilderRecommendation = z.infer<typeof insertPageBuilderRecommendationSchema>;
export type PageBuilderRecommendation = typeof pageBuilderRecommendations.$inferSelect;

export type InsertPageBuilderVersionHistory = z.infer<typeof insertPageBuilderVersionHistorySchema>;
export type PageBuilderVersionHistory = typeof pageBuilderVersionHistory.$inferSelect;

// SEO Configuration table
export const seoConfigurations = pgTable("seo_configurations", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Tenant reference
  routePath: varchar("route_path", { length: 255 }).notNull(),
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
  tenantId: uuid("tenant_id").references(() => tenants.id), // Tenant reference
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

export type InsertCompanionConfig = z.infer<typeof insertCompanionConfigSchema>;
export type CompanionConfig = typeof companionConfig.$inferSelect;

// Tools table for interactive tools created by users
export const tools: any = pgTable("tools", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Tenant reference
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  toolType: varchar("tool_type", { length: 50 }).notNull(), // form, calculator, dashboard, embed
  displayStyle: varchar("display_style", { length: 50 }), // modal, card, full-page, etc.
  mediaUrl: varchar("media_url", { length: 500 }),
  mediaId: varchar("media_id", { length: 255 }),
  configuration: jsonb("configuration"), // Tool-specific configuration data
  createdBy: integer("created_by").references(() => users.id),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, published, archived
  vaultRequestId: varchar("vault_request_id", { length: 255 }),
  guardianSynced: boolean("guardian_synced").default(false),
  vaultSynced: boolean("vault_synced").default(false),
  isGlobal: boolean("is_global").default(false), // Indicates if this tool can be accessed across tenants
  
  // Marketplace & publishing fields
  publishStatus: varchar("publish_status", { length: 50 }).default("unpublished").notNull(), // unpublished, draft_for_marketplace, published_in_marketplace
  toolVersion: varchar("tool_version", { length: 20 }), // Semantic versioning format (e.g., v1.0.0)
  toolCategory: varchar("tool_category", { length: 50 }), // CRM, Analytics, SEO, etc.
  designTier: varchar("design_tier", { length: 20 }).default("blank"), // blank, pro
  isLocked: boolean("is_locked").default(false), // For pro tools that can't be edited directly
  origin: varchar("origin", { length: 20 }), // Identifies the source (template, custom, marketplace)
  clonedFromId: integer("cloned_from_id").references(() => tools.id), // Reference to the original tool if this is a clone
  sourceInstance: varchar("source_instance", { length: 20 }), // lab, dev, client
  publishedAt: timestamp("published_at"),  // When the tool was published to the marketplace
  installationCount: integer("installation_count").default(0), // Number of tenant installations
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;

// Tool requests table for tracking tool creation requests sent to the Vault
export const toolRequests = pgTable("tool_requests", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id),
  businessId: varchar("business_id", { length: 100 }).notNull(),
  requestData: jsonb("request_data").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, rejected, completed
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolRequestSchema = createInsertSchema(toolRequests).omit({
  id: true,
  sentAt: true,
  processedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertToolRequest = z.infer<typeof insertToolRequestSchema>;
export type ToolRequest = typeof toolRequests.$inferSelect;

// Define relationships for tools
export const toolsRelations = relations(tools, ({ one, many }) => ({
  creator: one(users, {
    fields: [tools.createdBy],
    references: [users.id],
  }),
  pageIntegrations: many(pageToolIntegrations),
}));

// Page-Tool integrations table for connecting tools with pages
export const pageToolIntegrations = pgTable("page_tool_integrations", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id), // Tenant reference
  pageId: varchar("page_id", { length: 100 }).notNull(),
  toolId: integer("tool_id").references(() => tools.id).notNull(),
  position: varchar("position", { length: 20 }).default("bottom").notNull(), // top, middle, bottom
  enabled: boolean("enabled").default(true).notNull(),
  settings: jsonb("settings"), // Any custom settings for this integration
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageToolIntegrationSchema = createInsertSchema(pageToolIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPageToolIntegration = z.infer<typeof insertPageToolIntegrationSchema>;
export type PageToolIntegration = typeof pageToolIntegrations.$inferSelect;

// Define relationships for page tool integrations
export const pageToolIntegrationsRelations = relations(pageToolIntegrations, ({ one }) => ({
  tool: one(tools, {
    fields: [pageToolIntegrations.toolId],
    references: [tools.id],
  }),
  creator: one(users, {
    fields: [pageToolIntegrations.createdBy],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [pageToolIntegrations.tenantId],
    references: [tenants.id],
  }),
}));

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

// Tool installations table to track which tenants have installed which tools
export const toolInstallations = pgTable("tool_installations", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  installationDate: timestamp("installation_date").defaultNow().notNull(),
  installationStatus: varchar("installation_status", { length: 30 }).default("active").notNull(), // active, disabled, uninstalled
  customSettings: jsonb("custom_settings"), // Tenant-specific tool settings
  installedBy: integer("installed_by").references(() => users.id),
  usageCount: integer("usage_count").default(0), // Number of times this tool has been used
  lastUsed: timestamp("last_used"), // When this tool was last used
  version: varchar("version", { length: 20 }).notNull(), // The version of the tool installed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolInstallationSchema = createInsertSchema(toolInstallations).omit({
  id: true,
  installationDate: true,
  usageCount: true,
  lastUsed: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertToolInstallation = z.infer<typeof insertToolInstallationSchema>;
export type ToolInstallation = typeof toolInstallations.$inferSelect;

// Define relationships for tool installations
export const toolInstallationsRelations = relations(toolInstallations, ({ one }) => ({
  tool: one(tools, {
    fields: [toolInstallations.toolId],
    references: [tools.id],
  }),
  tenant: one(tenants, {
    fields: [toolInstallations.tenantId],
    references: [tenants.id],
  }),
  installer: one(users, {
    fields: [toolInstallations.installedBy],
    references: [users.id],
  }),
}));

// Tool publishing activity logs
export const toolPublishingLogs = pgTable("tool_publishing_logs", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id).notNull(),
  actor: varchar("actor", { length: 100 }).notNull(), // User or system that performed the action
  action: varchar("action", { length: 100 }).notNull(), // e.g., "draft_submitted", "marketplace_published", "tool_installed"
  instanceType: varchar("instance_type", { length: 30 }).notNull(), // "lab", "dev", "client"
  previousStatus: varchar("previous_status", { length: 50 }), 
  newStatus: varchar("new_status", { length: 50 }).notNull(),
  toolVersion: varchar("tool_version", { length: 20 }),
  metadata: jsonb("metadata"), // Additional details about the action
  successful: boolean("successful").default(true),
  errorMessage: text("error_message"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertToolPublishingLogSchema = createInsertSchema(toolPublishingLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertToolPublishingLog = z.infer<typeof insertToolPublishingLogSchema>;
export type ToolPublishingLog = typeof toolPublishingLogs.$inferSelect;

// Extend tool relations to include installations and logs
export const toolRelationsExtended = relations(tools, ({ one, many }) => ({
  creator: one(users, {
    fields: [tools.createdBy],
    references: [users.id],
  }),
  pageIntegrations: many(pageToolIntegrations),
  installations: many(toolInstallations),
  publishingLogs: many(toolPublishingLogs),
  clonedFromTool: one(tools, {
    fields: [tools.clonedFromId],
    references: [tools.id],
  }),
  clones: many(tools, { relationName: "tool_clones" }),
}));

// Domain mappings table
export const domainMappings = pgTable("domain_mappings", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  customDomain: varchar("custom_domain", { length: 255 }).unique().notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, verified, active, inactive, failed
  verificationMethod: varchar("verification_method", { length: 20 }).default("txt").notNull(), // txt, cname
  verificationToken: varchar("verification_token", { length: 255 }).notNull(),
  verificationCompletedAt: timestamp("verification_completed_at"),
  verificationAttempts: integer("verification_attempts").default(0),
  lastVerificationCheck: timestamp("last_verification_check"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDomainMappingSchema = createInsertSchema(domainMappings).omit({
  id: true,
  verificationCompletedAt: true,
  verificationAttempts: true,
  lastVerificationCheck: true,
  createdAt: true,
  updatedAt: true,
});

// Define relationships for domain mappings
export const domainMappingsRelations = relations(domainMappings, ({ one }) => ({
  tenant: one(tenants, {
    fields: [domainMappings.tenantId],
    references: [tenants.id],
  }),
}));

export type InsertDomainMapping = z.infer<typeof insertDomainMappingSchema>;
export type DomainMapping = typeof domainMappings.$inferSelect;

// AI Design System Tables
export const aiDesignSuggestions = pgTable("ai_design_suggestions", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  pageType: varchar("page_type", { length: 50 }).notNull(), // home, about, services, contact, etc.
  businessType: varchar("business_type", { length: 100 }).notNull(), // accounting, legal, healthcare, etc.
  components: jsonb("components").notNull(), // Array of suggested components
  layouts: jsonb("layouts").notNull(), // Array of suggested layouts
  colorPalettes: jsonb("color_palettes"), // Array of suggested color palettes
  seoRecommendations: jsonb("seo_recommendations"), // SEO enhancement recommendations
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiDesignSuggestionSchema = createInsertSchema(aiDesignSuggestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiDesignSuggestion = z.infer<typeof insertAiDesignSuggestionSchema>;
export type AiDesignSuggestion = typeof aiDesignSuggestions.$inferSelect;

// AI Component Recommendations
export const aiComponentRecommendations = pgTable("ai_component_recommendations", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pageBuilderPages.id).notNull(),
  sectionId: integer("section_id").references(() => pageBuilderSections.id),
  context: varchar("context", { length: 100 }).notNull(), // header, hero, content, footer, etc.
  recommendations: jsonb("recommendations").notNull(), // Array of recommended components
  reasoning: text("reasoning"), // Explanation of recommendations
  used: boolean("used").default(false), // Whether recommendation was used
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiComponentRecommendationSchema = createInsertSchema(aiComponentRecommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiComponentRecommendation = z.infer<typeof insertAiComponentRecommendationSchema>;
export type AiComponentRecommendation = typeof aiComponentRecommendations.$inferSelect;

// AI Event Log for analytics and Mission Control integration
export const aiEventLogs = pgTable("ai_event_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(), // ai-call, pro-ai-upgrade, pro-ai-downgrade, limit-exceeded, theme-to-product-ideas
  taskType: varchar("task_type", { length: 50 }), // matches AIUsageLog taskType when applicable
  detail: jsonb("detail"), // any useful metadata
  modelUsed: varchar("model_used", { length: 50 }), // for AI calls
  tokensUsed: integer("tokens_used"), // if available
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantTimestampIdx: index("ai_event_logs_tenant_timestamp_idx").on(table.tenantId, table.timestamp),
  eventTypeIdx: index("ai_event_logs_event_type_idx").on(table.eventType),
}));

export const insertAiEventLogSchema = createInsertSchema(aiEventLogs).omit({
  id: true,
  timestamp: true,
  createdAt: true,
});

export type InsertAiEventLog = z.infer<typeof insertAiEventLogSchema>;
export type AiEventLog = typeof aiEventLogs.$inferSelect;

// Innovation Feed table for storing AI-generated product/service ideas
export const innovationFeedItems = pgTable("innovation_feed_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  themeSummary: text("theme_summary").notNull(),
  selectedScope: varchar("selected_scope", { length: 100 }).notNull(),
  ideasMarkdown: text("ideas_markdown").notNull(), // Full AI response
  modelUsed: varchar("model_used", { length: 50 }).notNull(),
  taskType: varchar("task_type", { length: 50 }).default("theme-to-product-ideas").notNull(),
  generatedByUser: varchar("generated_by_user", { length: 255 }), // User name/email if available
  // Idea Action Tracking for innovation loop completion
  actionStatus: varchar("action_status", { length: 20 }).default("none").notNull(), // none, implemented, archived, wishlist
  actionNotes: text("action_notes"), // Optional notes about action taken
  actionUpdatedByUserId: integer("action_updated_by_user_id").references(() => users.id),
  actionUpdatedAt: timestamp("action_updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tenantTimestampIdx: index("innovation_feed_tenant_timestamp_idx").on(table.tenantId, table.timestamp),
  taskTypeIdx: index("innovation_feed_task_type_idx").on(table.taskType),
  actionStatusIdx: index("innovation_feed_action_status_idx").on(table.actionStatus),
}));

export const insertInnovationFeedItemSchema = createInsertSchema(innovationFeedItems).omit({
  id: true,
  timestamp: true,
  createdAt: true,
});

export type InsertInnovationFeedItem = z.infer<typeof insertInnovationFeedItemSchema>;
export type InnovationFeedItem = typeof innovationFeedItems.$inferSelect;

// Feed Settings table for SmartSite Feed Control Panel
export const feedSettings = pgTable("feed_settings", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  
  // Module toggles
  blogPostsEnabled: boolean("blog_posts_enabled").default(true),
  insightsEnabled: boolean("insights_enabled").default(true),
  socialFeedEnabled: boolean("social_feed_enabled").default(false),
  eventsEnabled: boolean("events_enabled").default(false),
  feedbackFormEnabled: boolean("feedback_form_enabled").default(true),
  
  // Social channel toggles
  youtubeEnabled: boolean("youtube_enabled").default(false),
  instagramEnabled: boolean("instagram_enabled").default(false),
  tiktokEnabled: boolean("tiktok_enabled").default(false),
  twitterEnabled: boolean("twitter_enabled").default(false),
  
  // Autopilot settings
  autopilotEnabled: boolean("autopilot_enabled").default(false),
  autopilotInterval: varchar("autopilot_interval", { length: 20 }).default("weekly"), // daily, weekly, monthly
  autopilotTopics: jsonb("autopilot_topics"), // Array of selected topics/tags
  autopilotApprovalRequired: boolean("autopilot_approval_required").default(true),
  
  // Branding configuration
  brandingSynced: boolean("branding_synced").default(false),
  brandingLastSync: timestamp("branding_last_sync"),
  
  // Public subdomain setup
  customSubdomain: varchar("custom_subdomain", { length: 255 }),
  subdomainActive: boolean("subdomain_active").default(false),
  
  // Feed configuration
  feedTitle: varchar("feed_title", { length: 255 }),
  feedDescription: text("feed_description"),
  feedTheme: varchar("feed_theme", { length: 50 }).default("default"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFeedSettingsSchema = createInsertSchema(feedSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFeedSettings = z.infer<typeof insertFeedSettingsSchema>;
export type FeedSettings = typeof feedSettings.$inferSelect;

// AI Color Palette Generator
export const aiColorPalettes = pgTable("ai_color_palettes", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  name: varchar("name", { length: 100 }).notNull(),
  primaryColor: varchar("primary_color", { length: 7 }).notNull(), // Hex code
  secondaryColor: varchar("secondary_color", { length: 7 }).notNull(), // Hex code
  accentColor: varchar("accent_color", { length: 7 }).notNull(), // Hex code
  textColor: varchar("text_color", { length: 7 }).notNull(), // Hex code
  backgroundColor: varchar("background_color", { length: 7 }).notNull(), // Hex code
  additionalColors: jsonb("additional_colors"), // Additional color options
  mood: varchar("mood", { length: 50 }), // professional, energetic, calm, etc.
  industry: varchar("industry", { length: 100 }), // Industry this palette is suitable for
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiColorPaletteSchema = createInsertSchema(aiColorPalettes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiColorPalette = z.infer<typeof insertAiColorPaletteSchema>;
export type AiColorPalette = typeof aiColorPalettes.$inferSelect;

// Define relationships for AI design system
export const aiDesignSuggestionsRelations = relations(aiDesignSuggestions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [aiDesignSuggestions.tenantId],
    references: [tenants.id],
  }),
}));

export const aiComponentRecommendationsRelations = relations(aiComponentRecommendations, ({ one }) => ({
  page: one(pageBuilderPages, {
    fields: [aiComponentRecommendations.pageId],
    references: [pageBuilderPages.id],
  }),
  section: one(pageBuilderSections, {
    fields: [aiComponentRecommendations.sectionId],
    references: [pageBuilderSections.id],
  }),
}));

export const aiColorPalettesRelations = relations(aiColorPalettes, ({ one }) => ({
  tenant: one(tenants, {
    fields: [aiColorPalettes.tenantId],
    references: [tenants.id],
  }),
}));

// Starter CRM - Contacts table
export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(), // Tenant reference
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  notes: text("notes"),
  tags: jsonb("tags"), // Store tags as a JSON array of strings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const crmContactsRelations = relations(crmContacts, ({ one }) => ({
  tenant: one(tenants, {
    fields: [crmContacts.tenantId],
    references: [tenants.id],
  }),
  createdByUser: one(users, {
    fields: [crmContacts.createdBy],
    references: [users.id],
  }),
}));

export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmContact = typeof crmContacts.$inferSelect;

// AI Usage Tracking table
export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  taskType: varchar("task_type", { length: 100 }).notNull(), // e.g., "blog_generation", "social_post", "content_analysis"
  modelUsed: varchar("model_used", { length: 50 }).notNull(), // e.g., "gpt-4o", "claude-3-sonnet", "mistral-7b"
  tokensUsed: integer("tokens_used"), // Optional token count if available
  success: boolean("success").default(true), // Whether the AI call was successful
  errorMessage: text("error_message"), // Error details if failed
  metadata: jsonb("metadata"), // Additional request metadata
}, (table) => {
  return {
    tenantIdx: index("idx_ai_usage_tenant").on(table.tenantId),
    timestampIdx: index("idx_ai_usage_timestamp").on(table.timestamp),
    taskTypeIdx: index("idx_ai_usage_task_type").on(table.taskType),
    modelIdx: index("idx_ai_usage_model").on(table.modelUsed),
  };
});

export const insertAiUsageLogSchema = createInsertSchema(aiUsageLogs).omit({
  id: true,
  timestamp: true,
});

export const aiUsageLogsRelations = relations(aiUsageLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [aiUsageLogs.tenantId],
    references: [tenants.id],
  }),
}));

export type InsertAiUsageLog = z.infer<typeof insertAiUsageLogSchema>;
export type AiUsageLog = typeof aiUsageLogs.$inferSelect;

// Insight App User Capacity table for monetization and limits
export const insightAppUserCapacity = pgTable("insight_app_user_capacity", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull().unique(),
  baseFreeCapacity: integer("base_free_capacity").default(10).notNull(), // Default 10 free users
  additionalPurchasedCapacity: integer("additional_purchased_capacity").default(0).notNull(), // Purchased capacity
  // totalCapacity is computed as baseFreeCapacity + additionalPurchasedCapacity
  // currentUsage is computed by counting active insight app users
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInsightAppUserCapacitySchema = createInsertSchema(insightAppUserCapacity).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insightAppUserCapacityRelations = relations(insightAppUserCapacity, ({ one }) => ({
  tenant: one(tenants, {
    fields: [insightAppUserCapacity.tenantId],
    references: [tenants.id],
  }),
}));

export type InsertInsightAppUserCapacity = z.infer<typeof insertInsightAppUserCapacitySchema>;
export type InsightAppUserCapacity = typeof insightAppUserCapacity.$inferSelect;
