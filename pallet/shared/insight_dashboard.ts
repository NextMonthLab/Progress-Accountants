import { serial, text, timestamp, pgTable, boolean, integer, pgEnum, index, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Tables for the Insights Dashboard feature

export const insightUsers = pgTable('insight_users', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull(),
  role: text('role'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userInsights = pgTable('user_insights', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userId: integer('user_id').notNull().references(() => insightUsers.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  tags: text('tags').array(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('user_insights_user_id_idx').on(table.userId),
    tenantIdIdx: index('user_insights_tenant_id_idx').on(table.tenantId),
  };
});

export const insightSummaries = pgTable('insight_summaries', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  summaryType: text('summary_type').notNull(), // 'weekly' or 'monthly'
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  themes: text('themes').array(),
  topInsights: jsonb('top_insights').notNull(),
  aiSummary: text('ai_summary').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const insightUsersRelations = relations(insightUsers, ({ many }) => ({
  insights: many(userInsights),
}));

export const userInsightsRelations = relations(userInsights, ({ one }) => ({
  user: one(insightUsers, {
    fields: [userInsights.userId],
    references: [insightUsers.id],
  }),
}));

// Schemas for form validation
export const insertInsightUserSchema = createInsertSchema(insightUsers)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertUserInsightSchema = createInsertSchema(userInsights)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertInsightSummarySchema = createInsertSchema(insightSummaries)
  .omit({ id: true, createdAt: true });

// Export types
export type InsightUser = typeof insightUsers.$inferSelect;
export type InsertInsightUser = z.infer<typeof insertInsightUserSchema>;

export type UserInsight = typeof userInsights.$inferSelect;
export type InsertUserInsight = z.infer<typeof insertUserInsightSchema>;

export type InsightSummary = typeof insightSummaries.$inferSelect;
export type InsertInsightSummary = z.infer<typeof insertInsightSummarySchema>;