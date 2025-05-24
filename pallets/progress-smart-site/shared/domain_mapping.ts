/**
 * Domain mapping interfaces and schemas
 */
import { z } from "zod";

// Domain status enum for tracking verification and activation status
export enum DomainStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  ACTIVE = "active",
  INACTIVE = "inactive",
  FAILED = "failed"
}

// Verification method enum
export enum VerificationMethod {
  TXT = "txt",
  CNAME = "cname"
}

// Domain mapping interface
export interface DomainMapping {
  id: number;
  tenantId: string;
  customDomain: string;
  status: DomainStatus;
  verificationMethod: VerificationMethod;
  verificationToken: string;
  verificationCompletedAt: Date | null;
  verificationAttempts: number | null;
  lastVerificationCheck: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for inserting a new domain mapping
export const insertDomainMappingSchema = z.object({
  tenantId: z.string(),
  customDomain: z
    .string()
    .trim()
    .min(4, "Domain must be at least 4 characters")
    .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "Please enter a valid domain format (e.g., example.com)"),
  status: z.nativeEnum(DomainStatus).default(DomainStatus.PENDING),
  verificationMethod: z.nativeEnum(VerificationMethod).default(VerificationMethod.TXT),
  verificationToken: z.string().optional(),
  verificationCompletedAt: z.date().nullable().optional(),
  verificationAttempts: z.number().default(0).nullable().optional(),
  lastVerificationCheck: z.date().nullable().optional(),
});

export type InsertDomainMapping = z.infer<typeof insertDomainMappingSchema>;

// DNS instruction interface
export interface DnsInstruction {
  type: string;
  host: string;
  pointsTo?: string;
  value?: string;
}