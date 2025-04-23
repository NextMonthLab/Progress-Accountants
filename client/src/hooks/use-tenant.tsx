import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: string;
  industry: string | null;
  plan: string;
  theme: any;
  customization: any;
  createdAt: Date;
  updatedAt: Date;
  parentTemplate: string | null;
  isTemplate: boolean | null;
  starterType?: 'blank' | 'pro';
}

type TenantContextType = {
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
  setTenant: (tenant: Tenant) => void;
  switchTenant: (tenantId: string) => void;
};

export const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Default tenant ID for Progress Accountants
  const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
  
  // Store the default tenant ID in localStorage for other components to use
  useEffect(() => {
    if (!localStorage.getItem('currentTenantId')) {
      localStorage.setItem('currentTenantId', DEFAULT_TENANT_ID);
    }
  }, []);
  
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(
    user?.tenantId || localStorage.getItem('currentTenantId') || DEFAULT_TENANT_ID
  );

  // Fetch current tenant data
  const {
    data: tenant,
    error,
    isLoading,
  } = useQuery<Tenant | null, Error>({
    queryKey: ['/api/tenant', selectedTenantId],
    queryFn: async ({ queryKey }) => {
      // Don't fetch if no tenant is selected
      if (!selectedTenantId) return null;
      
      const [, tenantId] = queryKey;
      const response = await fetch(`/api/tenant/${tenantId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch tenant");
      }
      
      return response.json();
    },
    enabled: !!selectedTenantId,
  });

  // Switch tenant mutation
  const switchTenantMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const res = await apiRequest("POST", "/api/tenant/switch", { tenantId });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries that might depend on the tenant
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      
      toast({
        title: "Tenant switched",
        description: "Successfully switched to new tenant",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to switch tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Set tenant directly (useful for initial load)
  const setTenant = (newTenant: Tenant) => {
    queryClient.setQueryData(['/api/tenant', newTenant.id], newTenant);
    setSelectedTenantId(newTenant.id);
  };

  // Switch to a different tenant
  const switchTenant = async (tenantId: string) => {
    if (tenantId === selectedTenantId) return;
    
    setSelectedTenantId(tenantId);
    
    // Call API to update session
    if (user?.isSuperAdmin) {
      await switchTenantMutation.mutateAsync(tenantId);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        error,
        setTenant,
        switchTenant,
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