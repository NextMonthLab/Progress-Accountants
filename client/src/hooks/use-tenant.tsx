import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { TenantCustomization } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/ClientDataProvider";

type TenantContextType = {
  customization: TenantCustomization | null;
  isLoading: boolean;
  error: Error | null;
  updateCustomizationMutation: ReturnType<typeof useUpdateCustomization>;
  updateThemeMutation: ReturnType<typeof useUpdateTheme>;
};

const TenantContext = createContext<TenantContextType | null>(null);

// Define hook to update tenant customization
function useUpdateCustomization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ tenantId, customization }: { 
      tenantId: string; 
      customization: TenantCustomization 
    }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/tenants/${tenantId}/customization`, 
        customization
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update tenant customization");
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate tenant data queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      
      toast({
        title: "Settings updated",
        description: "Tenant customization settings have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Define hook to update tenant theme
function useUpdateTheme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ tenantId, theme }: { 
      tenantId: string; 
      theme: Record<string, any> 
    }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/tenants/${tenantId}/theme`, 
        { theme }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update tenant theme");
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate tenant data queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      
      toast({
        title: "Theme updated",
        description: "Tenant theme settings have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  const { toast } = useToast();
  
  const {
    data: customization,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/tenants", tenantId, "customization"],
    queryFn: async () => {
      if (!tenantId) return null;
      
      const res = await apiRequest("GET", `/api/tenants/${tenantId}/customization`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch tenant customization");
      }
      
      const data = await res.json();
      return data.data as TenantCustomization;
    },
    enabled: !!tenantId,
  });

  const updateCustomizationMutation = useUpdateCustomization();
  const updateThemeMutation = useUpdateTheme();

  return (
    <TenantContext.Provider
      value={{
        customization: customization || null,
        isLoading,
        error,
        updateCustomizationMutation,
        updateThemeMutation,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}