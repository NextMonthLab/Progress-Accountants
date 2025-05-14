import { z } from 'zod';

/**
 * Schema for an external tool available in the marketplace
 */
export const ExternalToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  installCount: z.number().optional(),
  rating: z.number().optional(),
  version: z.string(),
  isFree: z.boolean().default(false),
  credits: z.number().default(0),
  authorId: z.string(),
  authorName: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  lastUpdated: z.string().optional(),
  visibility: z.enum(['public', 'private']).default('public')
});

export type ExternalTool = z.infer<typeof ExternalToolSchema>;

/**
 * Schema for a tool installation
 */
export const ToolInstallationSchema = z.object({
  id: z.number(),
  toolId: z.string(),
  installedBy: z.string(),
  installedAt: z.string(),
  smartSiteId: z.string(),
  status: z.enum(['active', 'inactive', 'pending']).default('active')
});

export type ToolInstallation = z.infer<typeof ToolInstallationSchema>;

/**
 * Schema for logging credit usage
 */
export const CreditUsageLogSchema = z.object({
  id: z.number(),
  toolId: z.string(),
  toolName: z.string(),
  credits: z.number(),
  timestamp: z.string(),
  status: z.enum(['success', 'failed', 'pending']).default('success')
});

export type CreditUsageLog = z.infer<typeof CreditUsageLogSchema>;

/**
 * Schema for credit balance
 */
export const CreditBalanceSchema = z.object({
  tenantId: z.string(),
  available: z.number(),
  used: z.number(),
  lastUpdated: z.string()
});

export type CreditBalance = z.infer<typeof CreditBalanceSchema>;

/**
 * Schema for marketplace settings
 */
export const MarketplaceSettingsSchema = z.object({
  tenantId: z.string(),
  autoRenew: z.boolean().default(true),
  notificationThreshold: z.number().default(10),
  billingEmail: z.string().email().optional(),
  syncWithNextMonthDev: z.boolean().default(true)
});

export type MarketplaceSettings = z.infer<typeof MarketplaceSettingsSchema>;

/**
 * Schema for marketplace notification
 */
export const MarketplaceNotificationSchema = z.object({
  id: z.number(),
  tenantId: z.string(),
  message: z.string(),
  type: z.enum(['info', 'warning', 'error']).default('info'),
  createdAt: z.string(),
  read: z.boolean().default(false)
});

export type MarketplaceNotification = z.infer<typeof MarketplaceNotificationSchema>;