import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User authentication tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }).default(null),
  userType: varchar("user_type", { length: 20 }).default("client").notNull(), // client or staff
  email: varchar("email", { length: 255 }).default(null),
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
  name: varchar("name", { length: 255 }).default(null),
  mission: text("mission").default(null),
  vision: text("vision").default(null),
  values: jsonb("values").default(null), // Array of values
  marketFocus: jsonb("market_focus").default(null), // Market focus details
  targetAudience: jsonb("target_audience").default(null), // Target audience details
  brandVoice: jsonb("brand_voice").default(null), // Brand voice details
  brandPositioning: text("brand_positioning").default(null),
  teamValues: jsonb("team_values").default(null), // Team values
  cultureStatements: jsonb("culture_statements").default(null), // Culture statements
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessIdentitySchema = createInsertSchema(businessIdentity).omit({
  id: true,
  updatedAt: true,
});

// Project context for pages and setup status
export const projectContext = pgTable("project_context", {
  id: serial("id").primaryKey(),
  homepageSetup: jsonb("homepage_setup").default(null), // Homepage setup details
  pageStatus: jsonb("page_status").default(null), // Status of various pages
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
