import { apiRequest, queryClient } from './queryClient';
import { smartFetch } from '@/utils/smartFetch';

// Client Dashboard API functions
export const clientDashboardApi = {
  // Get the client dashboard data
  getClientDashboard: async (clientId: number) => {
    try {
      const data = await smartFetch(`/api/finance/:tenantId/dashboard/${clientId}`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching client dashboard:', error);
      return { success: false, error: 'Failed to fetch dashboard data' };
    }
  },

  // Get activity log for the client
  getActivityLog: async (clientId: number) => {
    try {
      const data = await smartFetch(`/api/finance/:tenantId/activity/${clientId}`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching activity log:', error);
      return { success: false, error: 'Failed to fetch activity log' };
    }
  },

  // Complete a task
  completeTask: async (taskId: number, clientId: number) => {
    try {
      const data = await smartFetch(`/api/finance/:tenantId/tasks/${taskId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ clientId })
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error completing task:', error);
      return { success: false, error: 'Failed to complete task' };
    }
  },

  // Send a message
  sendMessage: async (content: string, clientId: number) => {
    try {
      const data = await smartFetch(`/api/messages/:tenantId/client/${clientId}`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  },

  // Upload a document
  uploadDocument: async (file: { name: string, type: string, size: string }, clientId: number) => {
    try {
      const data = await smartFetch(`/api/finance/:tenantId/documents/${clientId}`, {
        method: 'POST',
        body: JSON.stringify({ file })
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { success: false, error: 'Failed to upload document' };
    }
  }
};

// CRM API functions
export const crmApi = {
  getClients: async (staffId: number, filters: any = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query parameters
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          queryParams.append(key, String(value));
        }
      }
      
      const data = await smartFetch(`/api/crm/:tenantId/clients?${queryParams.toString()}`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { success: false, error: 'Failed to fetch clients' };
    }
  },
  
  getClientDetails: async (clientId: number) => {
    try {
      const data = await smartFetch(`/api/crm/:tenantId/clients/${clientId}`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching client details:', error);
      return { success: false, error: 'Failed to fetch client details' };
    }
  },
  
  addNote: async (clientId: number, note: { content: string }) => {
    try {
      const data = await smartFetch(`/api/crm/:tenantId/clients/${clientId}/notes`, {
        method: 'POST',
        body: JSON.stringify(note)
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding note:', error);
      return { success: false, error: 'Failed to add note' };
    }
  },
  
  getActivityLog: async (clientId: number) => {
    try {
      const data = await smartFetch(`/api/crm/:tenantId/clients/${clientId}/activity`);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching activity log:', error);
      return { success: false, error: 'Failed to fetch activity log' };
    }
  }
};

// SEO Configuration API functions
export async function fetchAllSeoConfigs() {
  const response = await apiRequest('GET', '/api/seo/configs');
  const data = await response.json();
  return data;
}

export async function fetchSeoConfigById(id: number) {
  const response = await apiRequest('GET', `/api/seo/configs/${id}`);
  const data = await response.json();
  return data;
}

export async function fetchSeoConfigByPath(path: string) {
  const response = await apiRequest('GET', `/api/seo/configs/path?routePath=${encodeURIComponent(path)}`);
  const data = await response.json();
  return data;
}

export async function saveSeoConfig(config: {
  id?: number;
  routePath: string;
  title: string;
  description: string;
  canonical?: string | null;
  image?: string | null;
  indexable: boolean;
  priority?: number | null;
  changeFrequency?: string | null;
}) {
  const method = config.id ? 'PATCH' : 'POST';
  const endpoint = config.id ? `/api/seo/configs/${config.id}` : '/api/seo/configs';
  
  // Ensure priority is set to a default value (0.5) if not provided
  const dataToSend = {
    ...config,
    priority: config.priority === null || config.priority === undefined ? 0.5 : config.priority
  };
  
  const response = await apiRequest(method, endpoint, dataToSend);
  const data = await response.json();
  
  // Invalidate the SEO configs cache
  queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
  
  return data;
}

export async function syncSeoConfigWithGuardian(id: number) {
  const response = await apiRequest('POST', `/api/seo/configs/${id}/sync/guardian`);
  const data = await response.json();
  
  // Invalidate the SEO configs cache
  queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
  
  return data;
}

export async function syncSeoConfigWithVault(id: number) {
  const response = await apiRequest('POST', `/api/seo/configs/${id}/sync/vault`);
  const data = await response.json();
  
  // Invalidate the SEO configs cache
  queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
  
  return data;
}

export async function deleteSeoConfig(id: number) {
  const response = await apiRequest('DELETE', `/api/seo/configs/${id}`);
  
  // Invalidate the SEO configs cache
  queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
  
  return response.ok;
}

export async function updateSeoConfigPriorities(priorities: { id: number, priority: number }[]) {
  const response = await apiRequest('PATCH', '/api/seo/configs/batch-update-priority', { priorities });
  const data = await response.json();
  
  // Invalidate the SEO configs cache
  queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
  
  return data;
}

// Brand Versioning API functions
export async function fetchAllBrandVersions() {
  const response = await apiRequest('GET', '/api/brand/versions');
  const data = await response.json();
  return data;
}

export async function fetchBrandVersionById(id: number) {
  const response = await apiRequest('GET', `/api/brand/versions/${id}`);
  const data = await response.json();
  return data;
}

export async function fetchLatestBrandVersion() {
  const response = await apiRequest('GET', '/api/brand/versions/latest');
  const data = await response.json();
  return data;
}

export async function saveBrandVersion(version: {
  id?: number;
  versionNumber: string;
  versionName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  typography?: any;
  logoUrl?: string;
  brandIdentityData?: any;
  brandVoiceData?: any;
  brandAssets?: any;
}) {
  const method = version.id ? 'PATCH' : 'POST';
  const endpoint = version.id ? `/api/brand/versions/${version.id}` : '/api/brand/versions';
  
  const response = await apiRequest(method, endpoint, version);
  const data = await response.json();
  
  // Invalidate the brand versions cache
  queryClient.invalidateQueries({ queryKey: ['/api/brand/versions'] });
  
  return data;
}

export async function activateBrandVersion(id: number) {
  const response = await apiRequest('POST', `/api/brand/versions/${id}/activate`);
  const data = await response.json();
  
  // Invalidate the brand versions cache
  queryClient.invalidateQueries({ queryKey: ['/api/brand/versions'] });
  
  return data;
}

export async function syncBrandVersionWithGuardian(id: number) {
  const response = await apiRequest('POST', `/api/brand/versions/${id}/sync/guardian`);
  const data = await response.json();
  
  // Invalidate the brand versions cache
  queryClient.invalidateQueries({ queryKey: ['/api/brand/versions'] });
  
  return data;
}

export async function syncBrandVersionWithVault(id: number) {
  const response = await apiRequest('POST', `/api/brand/versions/${id}/sync/vault`);
  const data = await response.json();
  
  // Invalidate the brand versions cache
  queryClient.invalidateQueries({ queryKey: ['/api/brand/versions'] });
  
  return data;
}

export async function getActiveBrandVersion() {
  const response = await apiRequest('GET', '/api/brand/versions/active');
  const data = await response.json();
  return data;
}

export async function deleteBrandVersion(id: number) {
  const response = await apiRequest('DELETE', `/api/brand/versions/${id}`);
  
  // Invalidate the brand versions cache
  queryClient.invalidateQueries({ queryKey: ['/api/brand/versions'] });
  
  return response.ok;
}

// Basic helper function to generate sitemap.xml
export async function generateSitemap() {
  const response = await apiRequest('POST', '/api/seo/sitemap/generate');
  const data = await response.json();
  return data;
}

// Site Branding API functions
export async function getSiteBranding() {
  // For now, we'll handle this client-side with localStorage
  try {
    const storedData = localStorage.getItem('site_branding');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  } catch (error) {
    console.error('Error fetching site branding:', error);
    return null;
  }
}

export async function saveSiteBranding(branding: any) {
  // For now, we'll handle this client-side with localStorage
  try {
    // Add last updated timestamp
    const updatedBranding = {
      ...branding,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('site_branding', JSON.stringify(updatedBranding));
    
    // In a future implementation, this would be an API call:
    // const response = await apiRequest('POST', '/api/site-branding', updatedBranding);
    // const data = await response.json();
    // queryClient.invalidateQueries({ queryKey: ['/api/site-branding'] });
    
    return updatedBranding;
  } catch (error) {
    console.error('Error saving site branding:', error);
    throw new Error('Failed to save site branding');
  }
}