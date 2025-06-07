import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Business Identity Database Migration
 * Ensures Master Unified Account & Business Architecture schema compliance
 */

export async function runBusinessIdentityMigrations() {
  console.log("Running Business Identity migrations...");
  console.log("Starting Business Identity table migrations...");

  try {
    // Ensure tenants table has all required columns for Master Architecture
    await db.execute(sql`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS customization JSONB,
      ADD COLUMN IF NOT EXISTS newsfeed_config JSONB,
      ADD COLUMN IF NOT EXISTS parent_template UUID,
      ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS starter_type VARCHAR(20) DEFAULT 'blank'
    `);
    console.log("✅ Tenants table updated with Master Architecture columns");

    // Ensure users table is properly linked to tenants
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id),
      ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false
    `);
    console.log("✅ Users table updated with tenant scoping");

    // Create business_identity table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS business_identity (
        id SERIAL PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id),
        name VARCHAR(255),
        mission TEXT,
        vision TEXT,
        values JSONB,
        market_focus JSONB,
        target_audience JSONB,
        brand_voice JSONB,
        brand_positioning TEXT,
        team_values JSONB,
        culture_statements JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    console.log("✅ Business identity table created");

    // Create default tenant if none exists
    const existingTenants = await db.execute(sql`SELECT COUNT(*) as count FROM tenants`);
    const tenantCount = (existingTenants as any)[0]?.count || 0;
    
    if (tenantCount === 0) {
      await db.execute(sql`
        INSERT INTO tenants (id, name, domain, status, industry, plan)
        VALUES (
          '00000000-0000-0000-0000-000000000000',
          'Progress Accountants',
          'progressaccountants.co.uk',
          'active',
          'Accounting & Finance',
          'smart_site_basic'
        )
        ON CONFLICT (id) DO NOTHING
      `);
      console.log("✅ Default tenant created");

      // Create default business identity
      await db.execute(sql`
        INSERT INTO business_identity (tenant_id, name)
        VALUES (
          '00000000-0000-0000-0000-000000000000',
          'Progress Accountants'
        )
        ON CONFLICT DO NOTHING
      `);
      console.log("✅ Default business identity created");
    }

    // Create SOT directory structure
    await ensureSOTStructure();

    console.log("✅ Business Identity database migration completed successfully");

  } catch (error) {
    console.error("❌ Business Identity migration failed:", error);
    throw error;
  }
}

async function ensureSOTStructure() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const sotBasePath = process.env.SOT_BASE_PATH || './sot';
    const defaultTenantPath = path.join(sotBasePath, 'businesses', '00000000-0000-0000-0000-000000000000');
    
    // Create directory structure for default tenant
    const directories = [
      'users',
      'insight-users', 
      'insights',
      'blog-posts',
      'themes',
      'innovation-ideas',
      'analytics-events',
      'ai-event-log',
      'tools'
    ];

    for (const dir of directories) {
      await fs.mkdir(path.join(defaultTenantPath, dir), { recursive: true });
    }

    // Create default identity.json
    const identityPath = path.join(defaultTenantPath, 'identity.json');
    const identityData = {
      businessId: '00000000-0000-0000-0000-000000000000',
      businessName: 'Progress Accountants',
      industry: 'Accounting & Finance',
      websiteURL: 'progressaccountants.co.uk',
      adminUserId: 1,
      paymentStatus: 'active',
      plan: 'smart_site_basic',
      createdAt: new Date().toISOString()
    };

    try {
      await fs.access(identityPath);
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(identityPath, JSON.stringify(identityData, null, 2));
      console.log("✅ Default SOT identity.json created");
    }

    console.log("✅ SOT directory structure ensured");
  } catch (error) {
    console.error("Warning: Could not create SOT structure:", error);
    // Don't throw - SOT creation is optional for development
  }
}