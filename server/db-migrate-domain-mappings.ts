import { db, pool } from "./db";
import { DomainStatus, VerificationMethod } from "../shared/domain_mapping";
import { domainMappings } from "../shared/schema";
import { sql } from "drizzle-orm";

/**
 * This script initializes the database tables for the Domain Mapping feature
 */
export async function migrateDomainMappingsTables() {
  console.log("Running Domain Mappings migrations...");
  console.log("Starting Domain Mappings table migrations...");

  try {
    // Check if the domain_mappings table exists
    const tableExists = await checkIfTableExists("domain_mappings");
    
    if (!tableExists) {
      // Create domain_mappings table
      await createDomainMappingsTable();
      console.log("✅ Created domain_mappings table successfully");
    } else {
      console.log("ℹ️ domain_mappings table already exists, skipping creation.");
    }
    
    console.log("✅ Domain Mappings database migration completed successfully");
  } catch (error) {
    console.error("❌ Error during Domain Mappings database migration:", error);
    throw error;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = ${tableName}
    );
  `);
  
  return result[0].exists;
}

/**
 * Create the domain_mappings table
 */
async function createDomainMappingsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "domain_mappings" (
      "id" SERIAL PRIMARY KEY,
      "tenant_id" UUID NOT NULL REFERENCES "tenants"("id"),
      "custom_domain" VARCHAR(255) NOT NULL UNIQUE,
      "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
      "verification_method" VARCHAR(20) NOT NULL DEFAULT 'txt',
      "verification_token" VARCHAR(255) NOT NULL,
      "verification_completed_at" TIMESTAMP,
      "verification_attempts" INTEGER NOT NULL DEFAULT 0,
      "last_verification_check" TIMESTAMP,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}