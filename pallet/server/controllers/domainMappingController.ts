import { Request, Response } from "express";
import { db } from "../db";
import { domainMappings, insertDomainMappingSchema } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import dns from "dns";
import { DomainStatus, VerificationMethod } from "../../shared/domain_mapping";
import util from "util";

// Convert callback-based DNS lookups to Promises
const resolveTxtPromise = util.promisify(dns.resolveTxt);
const resolveCnamePromise = util.promisify(dns.resolveCname);

/**
 * Get domain mapping for a tenant
 */
export async function getDomainMapping(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;
    
    // Validate tenant ID
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }
    
    // Find domain mapping for this tenant
    const mappings = await db.select().from(domainMappings)
      .where(eq(domainMappings.tenantId, tenantId));
    
    if (mappings.length === 0) {
      return res.status(200).json({ 
        has_mapping: false,
        message: "No domain mapping found for this tenant" 
      });
    }
    
    res.status(200).json({
      has_mapping: true,
      mapping: mappings[0]
    });
  } catch (error) {
    console.error("Error getting domain mapping:", error);
    res.status(500).json({ error: "Failed to get domain mapping" });
  }
}

/**
 * Create a new domain mapping
 */
export async function createDomainMapping(req: Request, res: Response) {
  try {
    // Check if user is authenticated and has access to this tenant
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const result = insertDomainMappingSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: "Invalid domain mapping data", details: result.error });
    }
    
    const data = result.data;
    
    // Generate verification token
    const verificationToken = generateVerificationToken();
    
    // Create new domain mapping
    const [mapping] = await db.insert(domainMappings)
      .values({
        ...data,
        verificationToken,
        status: DomainStatus.PENDING,
        verificationMethod: VerificationMethod.TXT
      })
      .returning();
    
    res.status(201).json({
      success: true,
      mapping,
      dns_instructions: generateDnsInstructions(mapping.customDomain, verificationToken)
    });
  } catch (error: any) {
    console.error("Error creating domain mapping:", error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ error: "This domain is already mapped by another tenant" });
    }
    
    res.status(500).json({ error: "Failed to create domain mapping" });
  }
}

/**
 * Get DNS instructions for a custom domain
 */
export async function getDnsInstructions(req: Request, res: Response) {
  try {
    const { domain } = req.params;
    
    if (!domain) {
      return res.status(400).json({ error: "Domain is required" });
    }
    
    // For security, generate a new token each time without storing it
    // In a real setup, you'd want to store this and use it for verification
    const verificationToken = generateVerificationToken();
    
    const instructions = generateDnsInstructions(domain, verificationToken);
    
    res.status(200).json({
      success: true,
      domain,
      instructions
    });
  } catch (error: any) {
    console.error("Error generating DNS instructions:", error);
    res.status(500).json({ error: "Failed to generate DNS instructions" });
  }
}

/**
 * Verify a domain mapping
 */
export async function verifyDomainMapping(req: Request, res: Response) {
  try {
    const { mappingId } = req.params;
    
    if (!mappingId) {
      return res.status(400).json({ error: "Mapping ID is required" });
    }
    
    // Find the mapping
    const [mapping] = await db.select().from(domainMappings)
      .where(eq(domainMappings.id, parseInt(mappingId)));
    
    if (!mapping) {
      return res.status(404).json({ error: "Domain mapping not found" });
    }
    
    // Increment verification attempts
    await db.update(domainMappings)
      .set({ 
        verificationAttempts: (mapping.verificationAttempts || 0) + 1,
        lastVerificationCheck: new Date()
      })
      .where(eq(domainMappings.id, mapping.id));
    
    // Verify the domain based on verification method
    let verified = false;
    
    if (mapping.verificationMethod === VerificationMethod.TXT) {
      verified = await verifyTxtRecord(mapping.customDomain, mapping.verificationToken);
    } else if (mapping.verificationMethod === VerificationMethod.CNAME) {
      verified = await verifyCnameRecord(mapping.customDomain);
    }
    
    if (verified) {
      // Update mapping status to verified
      await db.update(domainMappings)
        .set({ 
          status: DomainStatus.VERIFIED,
          verificationCompletedAt: new Date()
        })
        .where(eq(domainMappings.id, mapping.id));
      
      return res.status(200).json({
        success: true,
        verified: true,
        message: "Domain verified successfully"
      });
    }
    
    // If not verified, return appropriate message
    res.status(200).json({
      success: true,
      verified: false,
      message: "Domain verification failed. DNS records may not have propagated yet."
    });
  } catch (error: any) {
    console.error("Error verifying domain:", error);
    res.status(500).json({ error: "Failed to verify domain" });
  }
}

/**
 * Background verification check (to be called by scheduled job)
 */
export async function checkPendingVerifications() {
  try {
    // Get all pending mappings
    const pendingMappings = await db.select().from(domainMappings)
      .where(eq(domainMappings.status, DomainStatus.PENDING));
    
    console.log(`Found ${pendingMappings.length} pending domain verifications to check.`);
    
    for (const mapping of pendingMappings) {
      // Update last check time
      await db.update(domainMappings)
        .set({ 
          lastVerificationCheck: new Date(),
          verificationAttempts: (mapping.verificationAttempts || 0) + 1
        })
        .where(eq(domainMappings.id, mapping.id));
      
      // Verify based on method
      let verified = false;
      
      if (mapping.verificationMethod === VerificationMethod.TXT) {
        verified = await verifyTxtRecord(mapping.customDomain, mapping.verificationToken);
      } else if (mapping.verificationMethod === VerificationMethod.CNAME) {
        verified = await verifyCnameRecord(mapping.customDomain);
      }
      
      if (verified) {
        // Update mapping status to verified
        await db.update(domainMappings)
          .set({ 
            status: DomainStatus.VERIFIED,
            verificationCompletedAt: new Date()
          })
          .where(eq(domainMappings.id, mapping.id));
        
        console.log(`Domain ${mapping.customDomain} verified successfully.`);
      } else {
        console.log(`Verification for ${mapping.customDomain} still pending.`);
      }
    }
    
    return { success: true, checked: pendingMappings.length };
  } catch (error: any) {
    console.error("Error checking pending verifications:", error);
    return { success: false, error: "Failed to check pending verifications" };
  }
}

/**
 * Register domain mapping routes
 */
export function registerDomainMappingRoutes(app: any) {
  app.get("/api/domain-mapping/:tenantId", getDomainMapping);
  app.post("/api/domain-mapping", createDomainMapping);
  app.get("/api/domain-mapping/instructions/:domain", getDnsInstructions);
  app.post("/api/domain-mapping/verify/:mappingId", verifyDomainMapping);
}

// Helper functions

/**
 * Generate a verification token
 */
function generateVerificationToken(): string {
  return "progress-site-verification-" + crypto.randomBytes(8).toString("hex");
}

/**
 * Generate DNS instructions for a domain
 */
function generateDnsInstructions(domain: string, token: string) {
  // Extract subdomain and root domain
  const parts = domain.split('.');
  let host = 'www';
  
  if (parts.length > 2) {
    host = parts[0];
  }
  
  return {
    header: "Please update your DNS settings as follows:",
    dnsRecords: [
      {
        type: "CNAME",
        host,
        pointsTo: "progress.nextmonth.site"
      },
      {
        type: "TXT",
        host: "_verify",
        value: token
      }
    ],
    note: "It may take up to 24 hours for changes to propagate. Once done, we'll automatically check and verify your domain."
  };
}

/**
 * Verify a TXT record
 */
async function verifyTxtRecord(domain: string, token: string): Promise<boolean> {
  try {
    // Format the verification domain
    const verificationDomain = `_verify.${domain.replace(/^www\./, '')}`;
    
    // Query DNS for TXT records
    const records = await resolveTxtPromise(verificationDomain);
    
    // Check if any record matches our token
    for (const recordSet of records) {
      for (const record of recordSet) {
        if (record === token) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error: any) {
    console.warn(`TXT record verification failed for ${domain}:`, error.message || 'Unknown error');
    return false;
  }
}

/**
 * Verify a CNAME record
 */
async function verifyCnameRecord(domain: string): Promise<boolean> {
  try {
    // Remove www if present for verification
    const verificationDomain = domain.replace(/^www\./, '');
    
    // Query DNS for CNAME record
    const record = await resolveCnamePromise(verificationDomain);
    
    // Check if CNAME points to our domain
    // The record might be returned as a string array from some DNS providers
    const recordStr = Array.isArray(record) ? record[0] : record;
    return recordStr === 'progress.nextmonth.site';
  } catch (error: any) {
    console.warn(`CNAME record verification failed for ${domain}:`, error.message || 'Unknown error');
    return false;
  }
}