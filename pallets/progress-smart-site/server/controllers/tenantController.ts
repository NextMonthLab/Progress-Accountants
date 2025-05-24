import { Request, Response } from "express";
import { simpleStorage } from "../simpleStorage";
import { requireSuperAdmin } from "../middleware/rbac";

/**
 * Get all tenants (Super Admin only)
 */
export async function getAllTenants(req: Request, res: Response) {
  try {
    // Only super admins can access all tenants
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can access all tenants"
      });
    }
    
    // Get all tenants from storage
    const tenants = await simpleStorage.getAllTenants();
    
    res.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch tenants"
    });
  }
}

/**
 * Get tenant overview statistics (Super Admin only)
 */
export async function getTenantOverview(req: Request, res: Response) {
  try {
    // Only super admins can access tenant overview
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can access tenant overview"
      });
    }
    
    // Calculate tenant statistics
    const tenants = await simpleStorage.getAllTenants();
    
    const overview = {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      inactiveTenants: tenants.filter(t => t.status === 'inactive').length,
      suspendedTenants: tenants.filter(t => t.status === 'suspended').length,
      templateTenants: tenants.filter(t => t.isTemplate).length,
      tenantsByIndustry: tenants.reduce((acc, t) => {
        if (t.industry) {
          acc[t.industry] = (acc[t.industry] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json(overview);
  } catch (error) {
    console.error("Error fetching tenant overview:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to fetch tenant overview"
    });
  }
}

/**
 * Switch the active tenant for a Super Admin
 */
export async function switchTenant(req: Request, res: Response) {
  try {
    const { tenantId } = req.body;
    
    if (!tenantId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Tenant ID is required"
      });
    }
    
    // Only super admins can switch tenants
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can switch tenants"
      });
    }
    
    // Verify the tenant exists
    const tenant = await simpleStorage.getTenant(tenantId);
    
    if (!tenant) {
      return res.status(404).json({
        error: "Not Found",
        message: "Tenant not found"
      });
    }
    
    // Store the current tenant ID in the session
    if (req.session) {
      req.session.currentTenantId = tenantId;
    }
    
    // Log the tenant switch
    await simpleStorage.logActivity({
      userId: req.user.id,
      userType: req.user.userType,
      actionType: 'tenant_switch',
      entityType: 'tenant',
      entityId: tenantId,
      details: {
        tenantName: tenant.name,
        previousTenantId: req.user.tenantId
      }
    });
    
    res.json({
      success: true,
      tenant
    });
  } catch (error) {
    console.error("Error switching tenant:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to switch tenant"
    });
  }
}

/**
 * Create a new tenant (Super Admin only)
 */
export async function createTenant(req: Request, res: Response) {
  try {
    // Only super admins can create tenants
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can create tenants"
      });
    }
    
    const { name, domain, industry, plan, isTemplate, parentTemplate } = req.body;
    
    // Validate required fields
    if (!name || !domain) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Name and domain are required"
      });
    }
    
    // Check if domain is already in use
    const existingTenant = await simpleStorage.getTenantByDomain(domain);
    
    if (existingTenant) {
      return res.status(409).json({
        error: "Conflict",
        message: "Domain is already in use"
      });
    }
    
    // Create the new tenant
    const tenant = await simpleStorage.saveTenant({
      name,
      domain,
      industry,
      plan: plan || 'standard',
      isTemplate: isTemplate || false,
      parentTemplate,
      status: 'active'
    });
    
    // Log the tenant creation
    await simpleStorage.logActivity({
      userId: req.user.id,
      userType: req.user.userType,
      actionType: 'tenant_create',
      entityType: 'tenant',
      entityId: tenant.id,
      details: {
        tenantName: tenant.name,
        domain: tenant.domain
      }
    });
    
    res.status(201).json(tenant);
  } catch (error) {
    console.error("Error creating tenant:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to create tenant"
    });
  }
}

/**
 * Update a tenant (Super Admin only)
 */
export async function updateTenant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Only super admins can update tenants
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Super Admins can update tenants"
      });
    }
    
    // Check if tenant exists
    const existingTenant = await simpleStorage.getTenant(id);
    
    if (!existingTenant) {
      return res.status(404).json({
        error: "Not Found",
        message: "Tenant not found"
      });
    }
    
    // Update the tenant
    const updatedTenant = await simpleStorage.updateTenant(id, req.body);
    
    if (!updatedTenant) {
      return res.status(500).json({
        error: "Server Error",
        message: "Failed to update tenant"
      });
    }
    
    // Log the tenant update
    await simpleStorage.logActivity({
      userId: req.user.id,
      userType: req.user.userType,
      actionType: 'tenant_update',
      entityType: 'tenant',
      entityId: id,
      details: {
        tenantName: updatedTenant.name,
        changedFields: Object.keys(req.body)
      }
    });
    
    res.json(updatedTenant);
  } catch (error) {
    console.error("Error updating tenant:", error);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to update tenant"
    });
  }
}

/**
 * Register tenant management routes
 */
export function registerTenantRoutes(app: any) {
  app.get('/api/tenants', requireSuperAdmin(), getAllTenants);
  app.get('/api/tenants/overview', requireSuperAdmin(), getTenantOverview);
  app.post('/api/tenants/switch', requireSuperAdmin(), switchTenant);
  app.post('/api/tenants', requireSuperAdmin(), createTenant);
  app.patch('/api/tenants/:id', requireSuperAdmin(), updateTenant);
}