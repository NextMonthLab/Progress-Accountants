import { QueryClient } from "@tanstack/react-query";
import { mockApi } from "./mockData";

// Standalone query client for frontend-only deployment
export const standaloneQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  },
});

// Mock query function that uses local data instead of API calls
export function createStandaloneQueryFn(endpoint: string) {
  return async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    switch (endpoint) {
      case "/api/business-identity":
        return mockApi.getBusinessIdentity();
      case "/api/pages/public":
        return mockApi.getPages();
      case "/api/tenant/00000000-0000-0000-0000-000000000000":
        return mockApi.getTenant();
      case "/api/user":
        // Return null for unauthenticated state
        return null;
      default:
        if (endpoint.includes("/api/seo/configs/path")) {
          return mockApi.getSeoConfig();
        }
        throw new Error(`Endpoint ${endpoint} not mocked`);
    }
  };
}

// Mock mutation function for standalone operation
export function createStandaloneMutation(endpoint: string) {
  return async (data?: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    switch (endpoint) {
      case "/api/support/session":
        return mockApi.createSupportSession();
      default:
        return { success: true };
    }
  };
}