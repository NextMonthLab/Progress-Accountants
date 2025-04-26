/**
 * This script initializes the database tables for the Site Variants feature
 */
import { db, pool } from "./db";

export async function migrateSiteVariantsTables() {
  console.log("Running Site Variants migrations...");
  console.log("Starting Site Variants table migrations...");

  try {
    // Check if the table already exists
    const tableExists = await checkIfTableExists("tenant_site_variants");
    
    if (!tableExists) {
      // Create the tenant_site_variants table to store the variant configuration for each tenant
      await pool.query(`
        CREATE TABLE tenant_site_variants (
          id SERIAL PRIMARY KEY,
          tenant_id UUID NOT NULL,
          variant_id VARCHAR(50) NOT NULL,
          website_usage_type VARCHAR(50) NOT NULL,
          user_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
        )
      `);
      
      // Create index for faster lookups
      await pool.query(`CREATE INDEX idx_tenant_site_variants_tenant_id ON tenant_site_variants(tenant_id)`);
      
      console.log("✅ tenant_site_variants table created successfully");
    } else {
      console.log("ℹ️ tenant_site_variants table already exists, skipping creation");
    }
    
    // Check if the feature flags table exists, if not, we'll create it
    const featureFlagsTableExists = await checkIfTableExists("tenant_feature_flags");
    
    if (!featureFlagsTableExists) {
      // Create the tenant_feature_flags table to store enabled/disabled features
      await pool.query(`
        CREATE TABLE tenant_feature_flags (
          id SERIAL PRIMARY KEY,
          tenant_id UUID NOT NULL,
          feature_key VARCHAR(100) NOT NULL,
          is_enabled BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_feature_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
          CONSTRAINT uq_tenant_feature UNIQUE (tenant_id, feature_key)
        )
      `);
      
      await pool.query(`CREATE INDEX idx_tenant_feature_flags_tenant_id ON tenant_feature_flags(tenant_id)`);
      
      console.log("✅ tenant_feature_flags table created successfully");
    } else {
      console.log("ℹ️ tenant_feature_flags table already exists, skipping creation");
    }
    
    console.log("✅ Site Variants database migration completed successfully");
  } catch (error) {
    console.error("Error during Site Variants migration:", error);
    throw error;
  }
}

/**
 * Helper function to check if a table exists in the database
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = $1
    )
  `;
  const result = await pool.query(query, [tableName]);
  return result.rows[0].exists;
}