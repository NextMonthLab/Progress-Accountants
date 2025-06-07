import { Request, Response, NextFunction } from "express";
import { BusinessIdentityService } from "../services/business-identity";

/**
 * Tenant Scoping Middleware
 * Ensures ALL Admin Panel operations are properly scoped to tenantId
 * Implements Master Unified Account & Business Architecture compliance
 */

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      isValidTenant?: boolean;
    }
  }
}

/**
 * Middleware to extract and validate tenantId from JWT
 * MANDATORY for all Admin Panel routes
 */
export function requireValidTenant(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract tenantId from authenticated user
    const tenantId = req.user?.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ 
        error: "TenantId required for all Admin Panel operations",
        code: "MISSING_TENANT_ID"
      });
    }

    // Store tenantId in request for easy access
    req.tenantId = tenantId;
    
    // Validate tenant exists and is active
    BusinessIdentityService.validateTenant(tenantId)
      .then(isValid => {
        if (!isValid) {
          return res.status(403).json({ 
            error: "Invalid or inactive tenant",
            code: "INVALID_TENANT"
          });
        }
        
        req.isValidTenant = true;
        next();
      })
      .catch(error => {
        console.error("Tenant validation error:", error);
        res.status(500).json({ 
          error: "Failed to validate tenant",
          code: "TENANT_VALIDATION_ERROR"
        });
      });

  } catch (error) {
    console.error("Tenant scoping middleware error:", error);
    res.status(500).json({ 
      error: "Internal server error in tenant validation",
      code: "MIDDLEWARE_ERROR"
    });
  }
}

/**
 * Middleware to prevent cross-tenant data access
 * Validates that requested tenantId matches JWT tenantId
 */
export function preventCrossTenantAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const jwtTenantId = req.user?.tenantId;
    const requestedTenantId = req.params.tenantId || req.query.tenantId || req.body.tenantId;
    
    // Super admins can access any tenant
    if (req.user?.isSuperAdmin) {
      return next();
    }
    
    // Regular users can only access their own tenant
    if (requestedTenantId && requestedTenantId !== jwtTenantId) {
      return res.status(403).json({ 
        error: "Cross-tenant access denied",
        code: "CROSS_TENANT_ACCESS_DENIED"
      });
    }
    
    next();
  } catch (error) {
    console.error("Cross-tenant access prevention error:", error);
    res.status(500).json({ 
      error: "Internal server error in access control",
      code: "ACCESS_CONTROL_ERROR"
    });
  }
}

/**
 * Utility function to write data to SOT with proper tenant scoping
 */
export async function writeTenantScopedData(
  tenantId: string, 
  category: 'insights' | 'blog-posts' | 'themes' | 'innovation-ideas' | 'analytics-events' | 'ai-event-log' | 'tools',
  data: any,
  fileName?: string
): Promise<void> {
  try {
    // Generate filename if not provided
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const generatedFileName = fileName || `${category.replace('-', '_')}_${timestamp}_${randomId}.json`;
    
    // Write to SOT with proper tenant scoping
    await BusinessIdentityService.writeToSOT(tenantId, `${category}/${generatedFileName}`, {
      ...data,
      tenantId,
      id: generatedFileName.replace('.json', ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`[SOT] Written to: /businesses/${tenantId}/${category}/${generatedFileName}`);
  } catch (error) {
    console.error(`[SOT] Failed to write ${category} data:`, error);
    throw error;
  }
}

/**
 * Utility function to read tenant-scoped data from SOT
 */
export async function readTenantScopedData(
  tenantId: string,
  category: 'insights' | 'blog-posts' | 'themes' | 'innovation-ideas' | 'analytics-events' | 'ai-event-log' | 'tools',
  fileName?: string
): Promise<any[]> {
  try {
    if (fileName) {
      // Read specific file
      const data = await BusinessIdentityService.readFromSOT(tenantId, `${category}/${fileName}`);
      return data ? [data] : [];
    } else {
      // Read all files in category (simplified for demo)
      // In production, implement directory scanning
      return [];
    }
  } catch (error) {
    console.error(`[SOT] Failed to read ${category} data:`, error);
    return [];
  }
}

/**
 * Generate tenant-scoped insight app user ID
 */
export function generateInsightAppUserId(tenantId: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  return `insight_${tenantId.slice(0, 8)}_${timestamp}_${randomId}`;
}

/**
 * Generate tenant-scoped embed code
 */
export function generateTenantEmbedCode(tenantId: string, baseUrl: string = 'https://smart.nextmonth.io'): string {
  return `<script src="${baseUrl}/embed.js?tenantId=${tenantId}" async></script>`;
}