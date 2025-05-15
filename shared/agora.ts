import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define status enum for spaces
export const spaceStatusEnum = pgEnum('space_status', ['active', 'completed', 'paused']);

// Pillars - High-level business themes or areas of focus
export const pillars = pgTable("agora_pillars", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#008080"), // Default teal color
  businessId: text("business_id").notNull(), // Link to business
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
});

// Spaces - Containers for business activities, nested under pillars
export const spaces = pgTable("agora_spaces", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  description: text("description"),
  pillarId: text("pillar_id").references(() => pillars.id, { onDelete: "set null" }),
  businessId: text("business_id").notNull(), // Link to business
  status: spaceStatusEnum("status").notNull().default('active'),
  priority: integer("priority").default(0).notNull(),
  progress: integer("progress").default(0).notNull(), // 0-100 percent
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
  isArchived: boolean("is_archived").default(false).notNull(),
});

// Space Notes - Notes and comments within a space
export const spaceNotes = pgTable("agora_space_notes", {
  id: text("id").primaryKey(), // UUID
  spaceId: text("space_id").notNull().references(() => spaces.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull(), // Author of note
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Space Actions - Tasks and action items within a space
export const spaceActions = pgTable("agora_space_actions", {
  id: text("id").primaryKey(), // UUID
  spaceId: text("space_id").notNull().references(() => spaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to"), // User ID if assigned
  dueDate: timestamp("due_date"),
  status: text("status").notNull().default("pending"), // pending, in-progress, completed
  priority: integer("priority").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Define the Zod schemas for validation
export const insertPillarSchema = createInsertSchema(pillars, {
  // Add any additional validation rules
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).optional(),
  businessId: z.string().uuid()
});

export const insertSpaceSchema = createInsertSchema(spaces, {
  // Add any additional validation rules
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  pillarId: z.string().uuid().optional(),
  businessId: z.string().uuid(),
  priority: z.number().int().min(0).max(10).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  dueDate: z.date().optional()
});

export const insertSpaceNoteSchema = createInsertSchema(spaceNotes, {
  // Add any additional validation rules
  spaceId: z.string().uuid(),
  userId: z.number().int().positive(),
  content: z.string().min(1).max(2000)
});

export const insertSpaceActionSchema = createInsertSchema(spaceActions, {
  // Add any additional validation rules
  spaceId: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  assignedTo: z.number().int().positive().optional(),
  dueDate: z.date().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.number().int().min(0).max(10).optional()
});

// Export the type definitions
export type Pillar = typeof pillars.$inferSelect;
export type InsertPillar = z.infer<typeof insertPillarSchema>;

export type Space = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;

export type SpaceNote = typeof spaceNotes.$inferSelect;
export type InsertSpaceNote = z.infer<typeof insertSpaceNoteSchema>;

export type SpaceAction = typeof spaceActions.$inferSelect;
export type InsertSpaceAction = z.infer<typeof insertSpaceActionSchema>;