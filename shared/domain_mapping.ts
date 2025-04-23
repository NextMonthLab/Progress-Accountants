// Domain status enum
export enum DomainStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  ACTIVE = "active",
  INACTIVE = "inactive",
  FAILED = "failed"
}

// Domain verification methods
export enum VerificationMethod {
  TXT = "txt",
  CNAME = "cname"
}

// Interface for DNS record instruction
export interface DnsRecordInstruction {
  type: string;
  host: string;
  pointsTo?: string;
  value?: string;
}

// Interface for domain mapping verification
export interface DomainVerification {
  method: VerificationMethod;
  verificationToken: string;
  completedAt?: Date;
  attempts: number;
  lastChecked?: Date;
}