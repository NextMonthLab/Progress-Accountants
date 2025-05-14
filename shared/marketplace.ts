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