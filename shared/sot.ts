import { integer, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
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
  lastSyncAt: timestamp("last_sync_at").defaultNow(),
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

export type SotMetric = typeof sotMetrics.$inferSelect;
export type InsertSotMetric = typeof sotMetrics.$inferInsert;

export type SotSyncLog = typeof sotSyncLogs.$inferSelect;
export type InsertSotSyncLog = typeof sotSyncLogs.$inferInsert;

// Zod Schemas
export const insertSotDeclarationSchema = createInsertSchema(sotDeclarations);
export const insertSotMetricSchema = createInsertSchema(sotMetrics);
export const insertSotSyncLogSchema = createInsertSchema(sotSyncLogs);

// Enhanced Zod Schema with validation
export const sotDeclarationSchema = z.object({
  instanceId: z.string().min(1, "Instance ID is required"),
  instanceType: z.enum(["client_site", "marketplace", "admin_portal", "analytics_engine"]),
  blueprintVersion: z.string().min(1, "Blueprint version is required"),
  toolsSupported: z.array(z.string()).min(1, "At least one supported tool must be specified"),
  callbackUrl: z.string().url("Valid callback URL is required"),
  status: z.enum(["pending", "active", "inactive"]).default("pending"),
});