import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { users } from "./schema";

// Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  tenantId: text("tenant_id").default("00000000-0000-0000-0000-000000000000").notNull(),
  userId: integer("user_id"),
  sessionId: integer("session_id"),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(),
  priority: text("priority").default("medium").notNull(),
  category: text("category").default("general").notNull(),
  assignedTo: integer("assigned_to"),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  tags: text("tags").array(),
  feedback: jsonb("feedback"),
  interactions: jsonb("interactions"),
  autoResolveData: jsonb("auto_resolve_data"),
  resolution: text("resolution"),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;
export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({ id: true });

// Support Sessions
export const supportSessions = pgTable("support_sessions", {
  id: serial("id").primaryKey(),
  tenantId: text("tenant_id").default("00000000-0000-0000-0000-000000000000").notNull(),
  userId: integer("user_id"),
  sessionType: text("session_type").default("chat").notNull(),
  status: text("status").default("active").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  metadata: jsonb("metadata"),
  context: jsonb("context"),
  interactions: jsonb("interactions"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SupportSession = typeof supportSessions.$inferSelect;
export type InsertSupportSession = typeof supportSessions.$inferInsert;
export const insertSupportSessionSchema = createInsertSchema(supportSessions).omit({ id: true });

// Support Interactions
export const supportInteractions = pgTable("support_interactions", {
  id: serial("id").primaryKey(),
  tenantId: text("tenant_id").default("00000000-0000-0000-0000-000000000000").notNull(),
  sessionId: integer("session_id").notNull(),
  ticketId: integer("ticket_id"),
  userId: integer("user_id"),
  agentId: integer("agent_id"),
  type: text("type").default("message").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SupportInteraction = typeof supportInteractions.$inferSelect;
export type InsertSupportInteraction = typeof supportInteractions.$inferInsert;
export const insertSupportInteractionSchema = createInsertSchema(supportInteractions).omit({ id: true });

// Support Digests
export const supportDigests = pgTable("support_digests", {
  id: serial("id").primaryKey(),
  tenantId: text("tenant_id").default("00000000-0000-0000-0000-000000000000").notNull(),
  userId: integer("user_id"),
  ticketId: integer("ticket_id"),
  sessionId: integer("session_id"),
  title: text("title").notNull(),
  issueDescription: text("issue_description").notNull(),
  resolutionSummary: text("resolution_summary").notNull(),
  systemStatus: text("system_status").default("healthy").notNull(),
  nextTip: text("next_tip"),
  digestType: text("digest_type").default("ticket_resolved").notNull(), // ticket_resolved, self_resolved, system_health
  read: boolean("read").default(false),
  delivered: boolean("delivered").default(false),
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SupportDigest = typeof supportDigests.$inferSelect;
export type InsertSupportDigest = typeof supportDigests.$inferInsert;
export const insertSupportDigestSchema = createInsertSchema(supportDigests).omit({ id: true });

// Define relations
export const supportDigestsRelations = relations(supportDigests, ({ one }) => ({
  user: one(users, {
    fields: [supportDigests.userId],
    references: [users.id],
  }),
  ticket: one(supportTickets, {
    fields: [supportDigests.ticketId], 
    references: [supportTickets.id],
  }),
  session: one(supportSessions, {
    fields: [supportDigests.sessionId],
    references: [supportSessions.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ many, one }) => ({
  digests: many(supportDigests),
  interactions: many(supportInteractions),
}));

export const supportSessionsRelations = relations(supportSessions, ({ many, one }) => ({
  digests: many(supportDigests),
  interactions: many(supportInteractions),
}));

export const supportInteractionsRelations = relations(supportInteractions, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportInteractions.ticketId],
    references: [supportTickets.id],
  }),
  session: one(supportSessions, {
    fields: [supportInteractions.sessionId],
    references: [supportSessions.id],
  }),
}));