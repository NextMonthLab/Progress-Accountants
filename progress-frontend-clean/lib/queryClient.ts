import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Tenant cache to reduce API calls
const tenantCache = new Map<string, { data: any, timestamp: number }>();
const TENANT_CACHE_TTL = 60000; // 1 minute cache TTL

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // First try to parse as JSON 
      const errorData = await res.json();
      const errorObj: any = new Error(errorData.error || res.statusText);
      errorObj.status = res.status;
      errorObj.response = errorData;
      throw errorObj;
    } catch (e) {
      // If JSON parsing fails, fallback to text
      const text = await res.text() || res.statusText;
      const errorObj: any = new Error(text);
      errorObj.status = res.status;
      throw errorObj;
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Optimize tenant requests with caching
  if (method === 'GET' && url.startsWith('/api/tenant/')) {
    const tenantId = url.split('/').pop() || '';
    const cacheKey = `tenant-${tenantId}`;
    
    // Check cache
    if (tenantCache.has(cacheKey)) {
      const cached = tenantCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < TENANT_CACHE_TTL) {
        // Create a mock Response with the cached data
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Proceed with request if not cached or cache expired
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    await throwIfResNotOk(res);
    
    // Clone response before reading to avoid the "already read" issue
    const resClone = res.clone();
    try {
      // Cache the parsed response
      const parsedData = await res.json();
      tenantCache.set(cacheKey, { 
        data: parsedData, 
        timestamp: Date.now() 
      });
      return resClone;
    } catch (error) {
      // If parsing fails, return original response
      return resClone;
    }
  }
  
  // For non-tenant requests, proceed normally
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  (options) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const unauthorizedBehavior = options.on401;
    
    // Check tenant cache first for read operations on tenant endpoints
    if (url.startsWith('/api/tenant/')) {
      const tenantId = url.split('/').pop() || '';
      const cacheKey = `tenant-${tenantId}`;
      
      // Use cache if available and fresh
      if (tenantCache.has(cacheKey)) {
        const cached = tenantCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < TENANT_CACHE_TTL) {
          return cached.data as T;
        }
      }
    }
    
    // Make the request if no cache hit
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    const data = await res.json();
    
    // Cache tenant responses for future use
    if (url.startsWith('/api/tenant/')) {
      const tenantId = url.split('/').pop() || '';
      const cacheKey = `tenant-${tenantId}`;
      tenantCache.set(cacheKey, { 
        data, 
        timestamp: Date.now() 
      });
    }
    
    return data;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity for better data freshness
      retry: 1,
      suspense: false, // Explicitly disable suspense mode by default
      useErrorBoundary: false, // Don't propagate errors to React Error Boundary by default
    },
    mutations: {
      retry: false,
      useErrorBoundary: false,
    },
  },
});
