import { integer, pgTable, serial, text, timestamp, uuid, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

/**
 * Blueprint Templates table
 * Stores information about templates available for cloning
 */
export const blueprintTemplates = pgTable('blueprint_templates', {
  id: serial('id').primaryKey(),
  instanceId: uuid('instance_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  blueprintVersion: varchar('blueprint_version', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  isCloneable: boolean('is_cloneable').notNull().default(true),
  tenantId: uuid('tenant_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastSyncAt: timestamp('last_sync_at').notNull().defaultNow(),
});

/**
 * Clone Operations table
 * Tracks clone requests and their status
 */
export const cloneOperations = pgTable('clone_operations', {
  id: serial('id').primaryKey(),
  requestId: varchar('request_id', { length: 100 }).notNull(),
  templateId: integer('template_id').references(() => blueprintTemplates.id),
  instanceName: varchar('instance_name', { length: 255 }).notNull(),
  adminEmail: varchar('admin_email', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  newInstanceId: uuid('new_instance_id'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata')
});

/**
 * Blueprint Exports table
 * Stores exported blueprint data
 */
export const blueprintExports = pgTable('blueprint_exports', {
  id: serial('id').primaryKey(),
  instanceId: uuid('instance_id').notNull(),
  blueprintVersion: varchar('blueprint_version', { length: 50 }).notNull(),
  tenantId: uuid('tenant_id'),
  isTenantAgnostic: boolean('is_tenant_agnostic').notNull().default(true),
  blueprintData: jsonb('blueprint_data').notNull(),
  exportedAt: timestamp('exported_at').notNull().defaultNow(),
  exportedBy: varchar('exported_by', { length: 255 }),
  validationStatus: varchar('validation_status', { length: 50 }).default('pending'),
  validationDetails: jsonb('validation_details')
});

// Define types for select operations
export type BlueprintTemplate = typeof blueprintTemplates.$inferSelect;
export type CloneOperation = typeof cloneOperations.$inferSelect;
export type BlueprintExport = typeof blueprintExports.$inferSelect;

// Define types for insert operations
export type InsertBlueprintTemplate = typeof blueprintTemplates.$inferInsert;
export type InsertCloneOperation = typeof cloneOperations.$inferInsert;
export type InsertBlueprintExport = typeof blueprintExports.$inferInsert;

// Create zod schemas for validation
export const insertBlueprintTemplateSchema = createInsertSchema(blueprintTemplates);
export const insertCloneOperationSchema = createInsertSchema(cloneOperations);
export const insertBlueprintExportSchema = createInsertSchema(blueprintExports);

// Additional validation schemas
export const registerTemplateSchema = z.object({
  instanceName: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  isCloneable: z.boolean().default(true),
});

export const cloneInstanceSchema = z.object({
  templateId: z.number().int().positive("Template ID is required"),
  instanceName: z.string().min(1, "Instance name is required"),
  adminEmail: z.string().email("Valid admin email is required"),
  adminPassword: z.string().min(8, "Admin password must be at least 8 characters"),
});

export const extractBlueprintSchema = z.object({
  makeTenantAgnostic: z.boolean().default(true),
});