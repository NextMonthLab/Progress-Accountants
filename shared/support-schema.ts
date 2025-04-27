import { pgTable, text, timestamp, boolean, integer, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Support Session Table - Tracks the user's journey through the support system
export const supportSessions = pgTable("support_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id").notNull(),
  currentMode: text("current_mode").default("assistant").notNull(), // assistant, ticket, or escalated
  issuesLogged: jsonb("issues_logged").$type<string[]>().default([]),
  ticketsGenerated: jsonb("tickets_generated").$type<string[]>().default([]),
  status: text("status").default("active").notNull(), // active, resolved, or closed
  escalated: boolean("escalated").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Support Ticket Table - Stores structured escalation cases
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: text("ticket_id").notNull(),
  userId: integer("user_id"),
  issueSummary: text("issue_summary").notNull(),
  stepsAttempted: jsonb("steps_attempted").$type<string[]>().default([]),
  systemContext: jsonb("system_context").notNull(),
  status: text("status").default("new").notNull(), // new, in-progress, resolved, or closed
  assignedTo: text("assigned_to").default("system").notNull(),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertSupportSessionSchema = createInsertSchema(supportSessions)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertSupportTicketSchema = createInsertSchema(supportTickets)
  .omit({ id: true, createdAt: true, updatedAt: true });

// Types for TypeScript
export type SupportSession = typeof supportSessions.$inferSelect;
export type InsertSupportSession = z.infer<typeof insertSupportSessionSchema>;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;