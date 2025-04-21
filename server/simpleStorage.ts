import { storage } from "./storage";

// Extend the storage with additional methods needed for the multi-tenant system
// These are temporary implementations using in-memory storage until we switch to a database

// Tenants
storage.getAllTenants = async function() {
  if (!this.tenants) {
    this.tenants = new Map();
    
    // Add some default tenants for demo purposes
    const defaultTenants = [
      {
        id: "t1",
        name: "Progress Accountants",
        domain: "progressaccountants.com",
        status: "active",
        industry: "accounting",
        plan: "premium",
        isTemplate: false,
        createdAt: new Date()
      },
      {
        id: "t2",
        name: "Financial Solutions",
        domain: "financialsolutions.com",
        status: "active",
        industry: "finance",
        plan: "standard",
        isTemplate: false,
        createdAt: new Date()
      },
      {
        id: "t3",
        name: "Legal Edge",
        domain: "legaledge.com",
        status: "inactive",
        industry: "legal",
        plan: "basic",
        isTemplate: false,
        createdAt: new Date()
      },
      {
        id: "t4",
        name: "Template - Accounting Firm",
        domain: "template-accounting.nextmonth.dev",
        status: "active",
        industry: "accounting",
        plan: "enterprise",
        isTemplate: true,
        createdAt: new Date()
      }
    ];
    
    for (const tenant of defaultTenants) {
      this.tenants.set(tenant.id, tenant);
    }
  }
  
  return Array.from(this.tenants.values());
};

storage.getTenant = async function(id) {
  if (!this.tenants) {
    await this.getAllTenants();
  }
  
  return this.tenants.get(id);
};

storage.getTenantByDomain = async function(domain) {
  if (!this.tenants) {
    await this.getAllTenants();
  }
  
  const tenants = Array.from(this.tenants.values());
  return tenants.find(t => t.domain === domain);
};

storage.saveTenant = async function(tenant) {
  if (!this.tenants) {
    await this.getAllTenants();
  }
  
  const id = tenant.id || `t${this.tenants.size + 1}`;
  const newTenant = {
    ...tenant,
    id,
    createdAt: new Date()
  };
  
  this.tenants.set(id, newTenant);
  return newTenant;
};

storage.updateTenant = async function(id, updates) {
  if (!this.tenants) {
    await this.getAllTenants();
  }
  
  const tenant = this.tenants.get(id);
  
  if (!tenant) {
    return null;
  }
  
  const updatedTenant = {
    ...tenant,
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date()
  };
  
  this.tenants.set(id, updatedTenant);
  return updatedTenant;
};

// Activity Logs
storage.logActivity = async function(activity) {
  if (!this.activityLogs) {
    this.activityLogs = [];
  }
  
  const logEntry = {
    id: this.activityLogs.length + 1,
    timestamp: new Date(),
    ...activity
  };
  
  this.activityLogs.push(logEntry);
  return logEntry;
};

storage.getActivityLogs = async function(userId, limit = 100) {
  if (!this.activityLogs) {
    this.activityLogs = [];
  }
  
  let logs = this.activityLogs;
  
  if (userId) {
    logs = logs.filter(log => log.userId === userId);
  }
  
  return logs.slice(-limit).reverse();
};

// User by email lookup
storage.getUserByEmail = async function(email, tenantId) {
  if (!email) return null;
  
  // Initialize users Map if needed
  if (!this.users) {
    this.users = new Map();
  }
  
  // Find user by email
  const users = Array.from(this.users.values());
  return users.find(user => 
    user.email === email && 
    (tenantId ? user.tenantId === tenantId : true)
  );
};

// Tenant customization
storage.getTenantCustomization = async function(tenantId) {
  if (!this.tenantCustomizations) {
    this.tenantCustomizations = new Map();
  }
  
  // If customization doesn't exist, return default
  if (!this.tenantCustomizations.has(tenantId)) {
    return {
      uiLabels: {
        siteName: "Business Manager",
        dashboardTitle: "Dashboard",
        toolsLabel: "Tools",
        pagesLabel: "Pages",
        marketplaceLabel: "Marketplace",
        accountLabel: "Account",
        settingsLabel: "Settings"
      },
      tone: {
        formality: "neutral",
        personality: "professional"
      },
      featureFlags: {
        enablePodcastTools: false,
        enableFinancialReporting: true,
        enableClientPortal: true,
        enableMarketplaceAccess: true,
        enableCustomPages: true,
        enableClientLogin: true // Enable client login by default
      },
      sectionsEnabled: {
        servicesShowcase: true,
        teamMembers: true,
        testimonialsSlider: true,
        blogPosts: true,
        eventCalendar: false,
        resourceCenter: false
      }
    };
  }
  
  return this.tenantCustomizations.get(tenantId);
};

storage.updateTenantCustomization = async function(tenantId, customization) {
  if (!this.tenantCustomizations) {
    this.tenantCustomizations = new Map();
  }
  
  this.tenantCustomizations.set(tenantId, customization);
  return customization;
};

// Export a named object for easier imports in controllers
export const simpleStorage = storage;