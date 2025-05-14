// Marketplace types for NextMonth Dev integration
import { z } from "zod";

// External tool from NextMonth Dev registry
export const ExternalToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  version: z.string(),
  builder: z.string(),
  price: z.number().optional(), // Price in credits
  credits: z.number().optional(), // Alternative to price
  isFree: z.boolean().optional(),
  publisher: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string(), // ISO date string
  visibility: z.enum(["public", "private"]),
  rating: z.number().optional(),
  downloads: z.number().optional(),
});

export type ExternalTool = z.infer<typeof ExternalToolSchema>;

// Usage record for installed tools
export const ToolUsageRecordSchema = z.object({
  toolId: z.string(),
  installedBy: z.string(),
  installedAt: z.date(),
  smartSiteId: z.string(),
  creditsUsed: z.number(),
});

export type ToolUsageRecord = z.infer<typeof ToolUsageRecordSchema>;

// Smart Site registration for Dev
export const SmartSiteRegistrationSchema = z.object({
  smartSiteId: z.string(),
  plan: z.string(),
  creditsAllocated: z.number(),
  marketplaceAccess: z.boolean(),
  labAccess: z.boolean(),
  status: z.enum(["active", "pending", "inactive"]),
});

export type SmartSiteRegistration = z.infer<typeof SmartSiteRegistrationSchema>;

// Tool installation record
export const ToolInstallationSchema = z.object({
  id: z.number(),
  toolId: z.number(),
  tenantId: z.string(),
  installedBy: z.number().nullable(),
  installationDate: z.date(),
  installationStatus: z.string(),
  customSettings: z.unknown(),
  usageCount: z.number().nullable(),
  lastUsed: z.date().nullable(),
  version: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ToolInstallation = z.infer<typeof ToolInstallationSchema>;

// Credit usage log record
export const CreditUsageLogSchema = z.object({
  id: z.number(),
  toolId: z.number(),
  tenantId: z.string(),
  userId: z.number(),
  credits: z.number(),
  timestamp: z.date(),
  status: z.string(),
  details: z.string().optional(),
});

export type CreditUsageLog = z.infer<typeof CreditUsageLogSchema>;