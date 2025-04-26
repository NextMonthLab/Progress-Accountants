/**
 * Site Variant Controller
 * 
 * Handles operations related to site variants during clone and template selection.
 */
import { Request, Response } from "express";
import { db, pool } from "../db";
import { getVariantById, getVariantByTypes, WebsiteUsageType, UserType, SiteVariantConfig } from "@shared/site_variants";

/**
 * Get all available site variants
 */
export async function getSiteVariants(req: Request, res: Response) {
  try {
    const { websiteUsageType, userType } = req.query;
    
    // If specific types are provided, filter the variants
    if (websiteUsageType || userType) {
      const variants = require("@shared/site_variants").SITE_VARIANTS.filter((variant: any) => {
        let match = true;
        if (websiteUsageType && variant.websiteUsageType !== websiteUsageType) {
          match = false;
        }
        if (userType && variant.userType !== userType) {
          match = false;
        }
        return match;
      });
      
      return res.status(200).json(variants);
    }
    
    // Otherwise return all variants
    const variants = require("@shared/site_variants").SITE_VARIANTS;
    res.status(200).json(variants);
  } catch (error) {
    console.error("Error fetching site variants:", error);
    res.status(500).json({ error: "Failed to fetch site variants" });
  }
}

/**
 * Get the site variant for a specific tenant
 */
export async function getTenantSiteVariant(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;
    
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }
    
    const query = `
      SELECT * FROM tenant_site_variants
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [tenantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No site variant found for this tenant" });
    }
    
    const variantRecord = result.rows[0];
    
    // Get the full variant configuration
    const variantConfig = getVariantById(variantRecord.variant_id);
    
    if (!variantConfig) {
      return res.status(404).json({ error: "Variant configuration not found" });
    }
    
    // Get the tenant's feature flags
    const featureFlags = await getTenantFeatureFlags(tenantId);
    
    res.status(200).json({
      ...variantRecord,
      config: variantConfig,
      featureFlags
    });
  } catch (error) {
    console.error("Error fetching tenant site variant:", error);
    res.status(500).json({ error: "Failed to fetch tenant site variant" });
  }
}

/**
 * Set the site variant for a tenant during clone
 */
export async function setTenantSiteVariant(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;
    const { variantId, websiteUsageType, userType } = req.body;
    
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }
    
    let variantConfig: SiteVariantConfig | undefined;
    
    // If variantId is provided, use that to get the variant
    if (variantId) {
      variantConfig = getVariantById(variantId);
    } 
    // Otherwise use the types to determine the variant
    else if (websiteUsageType && userType) {
      variantConfig = getVariantByTypes(
        websiteUsageType as WebsiteUsageType,
        userType as UserType
      );
    } else {
      return res.status(400).json({ 
        error: "Either variantId or both websiteUsageType and userType must be provided"
      });
    }
    
    if (!variantConfig) {
      return res.status(404).json({ error: "Variant configuration not found" });
    }
    
    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert or update the tenant_site_variants record
      const checkQuery = `
        SELECT id FROM tenant_site_variants WHERE tenant_id = $1
      `;
      const checkResult = await client.query(checkQuery, [tenantId]);
      
      let variantRecord;
      
      if (checkResult.rows.length > 0) {
        // Update existing record
        const updateQuery = `
          UPDATE tenant_site_variants
          SET variant_id = $1, website_usage_type = $2, user_type = $3, updated_at = NOW()
          WHERE tenant_id = $4
          RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
          variantConfig.id, 
          variantConfig.websiteUsageType,
          variantConfig.userType,
          tenantId
        ]);
        
        variantRecord = updateResult.rows[0];
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO tenant_site_variants (tenant_id, variant_id, website_usage_type, user_type)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        
        const insertResult = await client.query(insertQuery, [
          tenantId,
          variantConfig.id,
          variantConfig.websiteUsageType,
          variantConfig.userType
        ]);
        
        variantRecord = insertResult.rows[0];
      }
      
      // Update feature flags based on the variant configuration
      await updateTenantFeatureFlags(client, tenantId, variantConfig);
      
      // Commit transaction
      await client.query('COMMIT');
      
      // Get updated feature flags
      const featureFlags = await getTenantFeatureFlags(tenantId);
      
      res.status(200).json({
        ...variantRecord,
        config: variantConfig,
        featureFlags
      });
    } catch (error) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error setting tenant site variant:", error);
    res.status(500).json({ error: "Failed to set tenant site variant" });
  }
}

/**
 * Get feature flags for a tenant
 */
async function getTenantFeatureFlags(tenantId: string) {
  const query = `
    SELECT feature_key, is_enabled
    FROM tenant_feature_flags
    WHERE tenant_id = $1
  `;
  
  const result = await pool.query(query, [tenantId]);
  
  // Convert to a map for easier access
  const featureFlags: Record<string, boolean> = {};
  
  result.rows.forEach(row => {
    featureFlags[row.feature_key] = row.is_enabled;
  });
  
  return featureFlags;
}

/**
 * Update feature flags based on variant configuration
 */
async function updateTenantFeatureFlags(client: any, tenantId: string, variantConfig: SiteVariantConfig) {
  // Map variant features to feature keys
  const featureMap = {
    'websiteBuilder': variantConfig.features.websiteBuilder,
    'pageCreator': variantConfig.features.pageCreator,
    'foundationSetup': variantConfig.features.foundationSetup,
    'blogGenerator': variantConfig.features.blogGenerator,
    'contentGenerator': variantConfig.features.contentGenerator,
    'cms': variantConfig.features.cms,
    'teamCollaboration': variantConfig.features.teamCollaboration,
    'entrepreneurSupport': variantConfig.features.entrepreneurSupport
  };
  
  // Update each feature flag
  for (const [featureKey, isEnabled] of Object.entries(featureMap)) {
    const upsertQuery = `
      INSERT INTO tenant_feature_flags (tenant_id, feature_key, is_enabled)
      VALUES ($1, $2, $3)
      ON CONFLICT (tenant_id, feature_key)
      DO UPDATE SET is_enabled = $3, updated_at = NOW()
    `;
    
    await client.query(upsertQuery, [tenantId, featureKey, isEnabled]);
  }
}