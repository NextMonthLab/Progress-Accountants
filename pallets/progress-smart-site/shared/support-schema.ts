import { pgTable, serial, text, timestamp, json, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// Support session tracking
export const supportSessions = pgTable('support_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(), // UUID for the session
  userId: integer('user_id').references(() => users.id), // Optional user connection
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  status: text('status').default('active').notNull(), // active, closed, escalated
  metaData: json('meta_data') // Browser info, system details, etc.
});

// Issues within a session
export const supportIssues = pgTable('support_issues', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => supportSessions.sessionId),
  issueText: text('issue_text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  status: text('status').default('new').notNull(), // new, in-progress, resolved
  aiResponse: text('ai_response'),
  resolution: text('resolution'),
  escalated: boolean('escalated').default(false)
});

// Support tickets for more complex issues
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  ticketId: text('ticket_id').notNull(), // UUID for the ticket
  sessionId: text('session_id').references(() => supportSessions.sessionId),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  status: text('status').default('new').notNull(), // new, in-progress, resolved
  priority: text('priority').default('medium').notNull(), // low, medium, high, critical
  issueSummary: text('issue_summary').notNull(),
  stepsAttempted: json('steps_attempted'), // Array of steps the user tried
  systemContext: json('system_context'), // Browser, OS, etc.
  assignedTo: integer('assigned_to').references(() => users.id),
  resolution: text('resolution')
});

// Messages within a ticket 
export const ticketMessages = pgTable('ticket_messages', {
  id: serial('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => supportTickets.ticketId),
  senderId: integer('sender_id').references(() => users.id),
  senderType: text('sender_type').notNull(), // user, staff, system, AI
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  attachments: json('attachments') // Array of attachment URLs or references
});

// Types
export type SupportSession = typeof supportSessions.$inferSelect;
export type InsertSupportSession = typeof supportSessions.$inferInsert;

export type SupportIssue = typeof supportIssues.$inferSelect;
export type InsertSupportIssue = typeof supportIssues.$inferInsert;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

// Zod Schemas
export const insertSupportSessionSchema = createInsertSchema(supportSessions);
export const insertSupportIssueSchema = createInsertSchema(supportIssues);
export const insertSupportTicketSchema = createInsertSchema(supportTickets);
export const insertTicketMessageSchema = createInsertSchema(ticketMessages);

export const selectSupportSessionSchema = createSelectSchema(supportSessions);
export const selectSupportIssueSchema = createSelectSchema(supportIssues);
export const selectSupportTicketSchema = createSelectSchema(supportTickets);
export const selectTicketMessageSchema = createSelectSchema(ticketMessages);