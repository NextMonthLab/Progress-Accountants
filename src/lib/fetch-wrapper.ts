/**
 * SmartSite Admin Panel Integration Wrapper
 * Handles all API calls to external SmartSite Admin Panel system
 */

export interface SmartFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function smartFetch(endpoint: string, options: SmartFetchOptions = {}) {
  const tenantId = "progress-accountants-uk";
  // Environment variable handling for Vite
  const baseUrl = "https://smartsite-admin.repl.co";
  
  // Replace :tenantId placeholder with actual tenant ID
  const resolvedEndpoint = endpoint.replace(":tenantId", tenantId);
  const fullUrl = `${baseUrl}${resolvedEndpoint}`;

  // Get auth token from localStorage (if available)
  const authToken = localStorage.getItem('smartsite_auth_token');
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-ID": tenantId,
    ...(options.headers as Record<string, string> || {}),
  };

  // Add authorization header if token exists and auth is required
  if (authToken && options.requiresAuth !== false) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Handle auth errors
    if (response.status === 401) {
      localStorage.removeItem('smartsite_auth_token');
      // Redirect to auth if we're not already there
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
      throw new Error('Authentication required');
    }

    return response;
  } catch (error) {
    console.error(`SmartSite API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Convenience wrapper for JSON responses
 */
export async function smartFetchJson<T = any>(endpoint: string, options: SmartFetchOptions = {}): Promise<T> {
  const response = await smartFetch(endpoint, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

/**
 * Tenant-aware endpoint builder
 */
export function buildTenantEndpoint(path: string): string {
  return `/api/${path.replace(/^\//, '')}/:tenantId`;
}