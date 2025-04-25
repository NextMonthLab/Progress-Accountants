import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Table for insight users (separate from main system users)
export const insightUsers = pgTable('insight_users', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull(),
  role: text('role'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Enhanced insights table with user tracking
export const userInsights = pgTable('user_insights', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userId: integer('user_id').notNull(), // Foreign key to insightUsers
  content: text('content').notNull(),
  tags: text('tags').array(),
  mood: integer('mood'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// AI summaries table
export const insightSummaries = pgTable('insight_summaries', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  summaryType: text('summary_type').notNull(), // "weekly" or "monthly"
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  themes: jsonb('themes').notNull(),
  topInsights: jsonb('top_insights').notNull(),
  aiSummary: text('ai_summary').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Define types
export type InsightUser = typeof insightUsers.$inferSelect;
export type InsertInsightUser = typeof insightUsers.$inferInsert;
export type UserInsight = typeof userInsights.$inferSelect;
export type InsertUserInsight = typeof userInsights.$inferInsert;
export type InsightSummary = typeof insightSummaries.$inferSelect;
export type InsertInsightSummary = typeof insightSummaries.$inferInsert;

// Create Zod schemas
export const insertInsightUserSchema = createInsertSchema(insightUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertUserInsightSchema = createInsertSchema(userInsights).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertInsightSummarySchema = createInsertSchema(insightSummaries).omit({
  id: true,
  createdAt: true
});