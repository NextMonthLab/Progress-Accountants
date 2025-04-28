import { integer, pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * SOT (Single Source of Truth) declarations table
 * Stores information about this instance's registration with the SOT system
 */
export const sotDeclarations = pgTable("sot_declarations", {
  id: integer("id").primaryKey().notNull(),
  instanceId: text("instance_id").notNull(),
  instanceType: text("instance_type").notNull(),
  blueprintVersion: text("blueprint_version").notNull(),
  toolsSupported: text("tools_supported").array().notNull(),
  callbackUrl: text("callback_url").notNull(),
  status: text("status").notNull().default("pending"),
  isTemplate: boolean("is_template").default(false),
  isCloneable: boolean("is_cloneable").default(false),
  lastSyncAt: timestamp("last_sync_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * SOT Client Profile table
 * Stores complete client profile data for synchronization with SOT system
 */
export const sotClientProfiles = pgTable("sot_client_profiles", {
  id: integer("id").primaryKey().notNull(),
  businessId: text("business_id").notNull(),
  profileData: jsonb("profile_data").notNull(),
  lastSyncAt: timestamp("last_sync_at").defaultNow(),
  syncStatus: text("sync_status").notNull().default("pending"),
  syncMessage: text("sync_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * SOT Metrics table
 * Stores metrics that are synced with the SOT
 */
export const sotMetrics = pgTable("sot_metrics", {
  id: integer("id").primaryKey().notNull(),
  totalPages: integer("total_pages").default(0),
  installedTools: text("installed_tools").array(),
  lastSyncAt: timestamp("last_sync_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * SOT Sync Log table
 * Tracks all sync events with the SOT
 */
export const sotSyncLogs = pgTable("sot_sync_logs", {
  id: integer("id").primaryKey().notNull(),
  eventType: text("event_type").notNull(),
  status: text("status").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type Definitions
export type SotDeclaration = typeof sotDeclarations.$inferSelect;
export type InsertSotDeclaration = typeof sotDeclarations.$inferInsert;

export type SotClientProfile = typeof sotClientProfiles.$inferSelect;
export type InsertSotClientProfile = typeof sotClientProfiles.$inferInsert;

export type SotMetric = typeof sotMetrics.$inferSelect;
export type InsertSotMetric = typeof sotMetrics.$inferInsert;

export type SotSyncLog = typeof sotSyncLogs.$inferSelect;
export type InsertSotSyncLog = typeof sotSyncLogs.$inferInsert;

// Client Profile interface for JSON data
export interface ClientProfileData {
  clientInformation: {
    businessId: string;
    businessName: string;
    businessType: string;
    industry: string;
    description: string;
    location: {
      city: string;
      country: string;
    };
    dateOnboarded: string;
  };
  platformBlueprintInformation: {
    currentBlueprintVersion: string;
    pagesPublished: string[];
    toolsInstalled: string[];
    automationsActive: string[];
    lastDeploymentDate: string;
    hostingEnvironment: string;
  };
  activityTracking: {
    totalCreditsPurchased: number;
    totalCreditsConsumed: number;
    lastActivityTimestamp: string;
    accountStatus: string;
  };
  externalPublicInfo: {
    websiteUrl: string;
    publicLinkedIn: string;
    publicYouTubeChannel: string;
    podcastInfo: {
      name: string;
      platforms: string[];
      frequency: string;
      totalEpisodes: number;
    };
  };
  dynamicUpdateTriggers: {
    realtimeWebhookEnabled: boolean;
    updateFrequency: string;
    lastSyncTimestamp: string;
  };
  systemMetadata: {
    instanceId: string;
    instanceType: string;
    tenantId: string;
    isTemplate: boolean;
    isCloneable: boolean;
    supportTier: string;
    statusCheckFrequency: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Zod Schemas
export const insertSotDeclarationSchema = createInsertSchema(sotDeclarations);
export const insertSotClientProfileSchema = createInsertSchema(sotClientProfiles);
export const insertSotMetricSchema = createInsertSchema(sotMetrics);
export const insertSotSyncLogSchema = createInsertSchema(sotSyncLogs);

// Enhanced Zod Schema with validation
export const sotDeclarationSchema = z.object({
  instanceId: z.string().min(1, "Instance ID is required"),
  instanceType: z.enum(["client_site", "marketplace", "admin_portal", "analytics_engine", "template"]),
  blueprintVersion: z.string().min(1, "Blueprint version is required"),
  toolsSupported: z.array(z.string()).min(1, "At least one supported tool must be specified"),
  callbackUrl: z.string().url("Valid callback URL is required"),
  status: z.enum(["pending", "active", "inactive"]).default("pending"),
  isTemplate: z.boolean().optional().default(false),
  isCloneable: z.boolean().optional().default(false),
});