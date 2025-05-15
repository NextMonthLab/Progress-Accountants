import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { text, integer, pgTable, timestamp, boolean, json } from "drizzle-orm/pg-core";

// Pillars represent major business themes
export const pillars = pgTable("agora_pillars", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#008080"), // default teal
  businessId: text("business_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isArchived: boolean("is_archived").default(false),
  metadata: json("metadata")
});

// Spaces are specific areas of focus within pillars
export const spaces = pgTable("agora_spaces", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  pillarId: text("pillar_id").references(() => pillars.id),
  businessId: text("business_id").notNull(),
  status: text("status").default("active"), // active, completed, paused
  priority: integer("priority").default(0),
  progress: integer("progress").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
  isArchived: boolean("is_archived").default(false),
  metadata: json("metadata")
});

// Notes for spaces
export const spaceNotes = pgTable("agora_space_notes", {
  id: text("id").primaryKey().notNull(),
  spaceId: text("space_id").references(() => spaces.id).notNull(),
  content: text("content").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isArchived: boolean("is_archived").default(false)
});

// Actions for spaces
export const spaceActions = pgTable("agora_space_actions", {
  id: text("id").primaryKey().notNull(),
  spaceId: text("space_id").references(() => spaces.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, in-progress, completed, cancelled
  dueDate: timestamp("due_date"),
  assignedTo: text("assigned_to"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  isArchived: boolean("is_archived").default(false)
});

// Zod schemas for validation
export const PillarSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().default("#008080"),
  businessId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isArchived: z.boolean().default(false),
  metadata: z.any().optional()
});

export const SpaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  pillarId: z.string().uuid().optional(),
  businessId: z.string(),
  status: z.enum(["active", "completed", "paused"]).default("active"),
  priority: z.number().int().min(0).max(10).default(0),
  progress: z.number().int().min(0).max(100).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  dueDate: z.date().optional(),
  isArchived: z.boolean().default(false),
  metadata: z.any().optional()
});

export const SpaceNoteSchema = z.object({
  id: z.string().uuid(),
  spaceId: z.string().uuid(),
  content: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isArchived: z.boolean().default(false)
});

export const SpaceActionSchema = z.object({
  id: z.string().uuid(),
  spaceId: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]).default("pending"),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
  isArchived: z.boolean().default(false)
});

// Create insert schemas
export const insertPillarSchema = createInsertSchema(pillars, {
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  businessId: z.string()
}).omit({ id: true, createdAt: true, updatedAt: true, isArchived: true });

export const insertSpaceSchema = createInsertSchema(spaces, {
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  pillarId: z.string().uuid().optional(),
  businessId: z.string(),
  priority: z.number().int().min(0).max(10).default(0)
}).omit({ id: true, createdAt: true, updatedAt: true, isArchived: true, progress: true });

export const insertSpaceNoteSchema = createInsertSchema(spaceNotes, {
  content: z.string(),
  spaceId: z.string().uuid(),
  userId: z.string()
}).omit({ id: true, createdAt: true, updatedAt: true, isArchived: true });

export const insertSpaceActionSchema = createInsertSchema(spaceActions, {
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  spaceId: z.string().uuid(),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string()
}).omit({ id: true, createdAt: true, updatedAt: true, completedAt: true, isArchived: true });

// Types
export type Pillar = z.infer<typeof PillarSchema>;
export type Space = z.infer<typeof SpaceSchema>;
export type SpaceNote = z.infer<typeof SpaceNoteSchema>;
export type SpaceAction = z.infer<typeof SpaceActionSchema>;

export type InsertPillar = z.infer<typeof insertPillarSchema>;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type InsertSpaceNote = z.infer<typeof insertSpaceNoteSchema>;
export type InsertSpaceAction = z.infer<typeof insertSpaceActionSchema>;