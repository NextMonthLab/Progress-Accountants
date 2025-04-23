import { pgTable, serial, text, varchar, boolean, integer, uuid, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Navigation Menu table
export const navigationMenus = pgTable('navigation_menus', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  location: varchar('location', { length: 50 }).notNull().default('header'),
  isActive: boolean('is_active').default(true),
  tenantId: uuid('tenant_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Forward declare menuItems to avoid self-reference issue
export let menuItems: any;

// Navigation Menu Items table
menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull().references(() => navigationMenus.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id').references(() => menuItems.id, { onDelete: 'set null' }),
  label: varchar('label', { length: 100 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  order: integer('order').default(0),
  isExternal: boolean('is_external').default(false),
  isVisible: boolean('is_visible').default(true),
  requiredRole: varchar('required_role', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types for Navigation Menu
export type NavigationMenu = typeof navigationMenus.$inferSelect;
export type InsertNavigationMenu = typeof navigationMenus.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

// Zod schemas for validation
export const insertNavigationMenuSchema = createInsertSchema(navigationMenus, {
  name: z.string().min(1, "Menu name is required").max(100),
  slug: z.string().min(1, "Menu slug is required").max(100),
  description: z.string().optional(),
  location: z.enum(['header', 'footer', 'sidebar', 'mobile']),
  isActive: z.boolean().default(true),
  tenantId: z.string().uuid("Invalid tenant ID"),
});

export const insertMenuItemSchema = createInsertSchema(menuItems, {
  menuId: z.number().positive("Menu ID is required"),
  parentId: z.number().positive().optional().nullable(),
  label: z.string().min(1, "Label is required").max(100),
  url: z.string().min(1, "URL is required").max(255),
  icon: z.string().max(50).optional(),
  order: z.number().min(0).optional(),
  isExternal: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  requiredRole: z.enum(['admin', 'super_admin', 'editor', 'client']).optional(),
});

// Menu location types for UI options
export const menuLocations = [
  { value: 'header', label: 'Header Navigation' },
  { value: 'footer', label: 'Footer Navigation' },
  { value: 'sidebar', label: 'Sidebar Navigation' },
  { value: 'mobile', label: 'Mobile Navigation' }
];

export interface MenuTreeItem extends MenuItem {
  children: MenuTreeItem[];
}