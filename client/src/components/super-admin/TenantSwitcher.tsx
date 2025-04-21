import React, { useState } from "react";
import { Check, ChevronsUpDown, Building, Plus, RefreshCw, Shield, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Tenant type definition
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  industry?: string;
  plan?: string;
  isTemplate: boolean;
  parentTemplate?: string;
  createdAt: string;
  updatedAt?: string;
}

// Component props
interface TenantSwitcherProps {
  className?: string;
}

// TenantSwitcher component
export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch tenants
  const { data: tenants, isLoading, refetch } = useQuery({
    queryKey: ['/api/tenants'],
    queryFn: getQueryFn(),
  });
  
  // Tenant switch mutation
  const switchTenantMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const res = await apiRequest('POST', '/api/tenants/switch', { tenantId });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Tenant switched",
        description: `Now viewing ${data.tenant.name}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      // Close the popover
      setOpen(false);
      
      // Redirect or reload content as needed
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to switch tenant",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle tenant selection
  function handleTenantSelect(tenantId: string) {
    switchTenantMutation.mutate(tenantId);
  }
  
  // Get the current tenant from the list
  // This is a placeholder - in a real application, you would store the current tenant in context
  const currentTenant = tenants && tenants.length > 0 ? tenants[0] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a tenant"
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center">
            {currentTenant ? (
              <>
                <Building className="mr-2 h-4 w-4" />
                <span>{currentTenant.name}</span>
                {currentTenant.isTemplate && (
                  <Badge variant="secondary" className="ml-2 text-xs py-0">Template</Badge>
                )}
                {currentTenant.status !== 'active' && (
                  <Badge variant="destructive" className="ml-2 text-xs py-0">{currentTenant.status}</Badge>
                )}
              </>
            ) : (
              <>
                <Building className="mr-2 h-4 w-4" />
                <span>Select tenant...</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search tenant..." />
          <CommandList>
            <CommandEmpty>No tenant found.</CommandEmpty>
            
            {/* Template tenants */}
            {tenants && tenants.filter(t => t.isTemplate).length > 0 && (
              <CommandGroup heading="Template Tenants">
                {tenants?.filter(t => t.isTemplate).map((tenant: Tenant) => (
                  <CommandItem
                    key={tenant.id}
                    value={tenant.id}
                    onSelect={() => handleTenantSelect(tenant.id)}
                    className="flex items-center"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>{tenant.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {/* Active tenants */}
            <CommandGroup heading="Active Tenants">
              {tenants?.filter(t => !t.isTemplate && t.status === 'active').map((tenant: Tenant) => (
                <CommandItem
                  key={tenant.id}
                  value={tenant.id}
                  onSelect={() => handleTenantSelect(tenant.id)}
                  className="flex items-center"
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>{tenant.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            
            {/* Inactive/Suspended tenants */}
            {tenants && tenants.some(t => t.status === 'inactive' || t.status === 'suspended') && (
              <CommandGroup heading="Inactive Tenants">
                {tenants?.filter(t => t.status === 'inactive' || t.status === 'suspended').map((tenant: Tenant) => (
                  <CommandItem
                    key={tenant.id}
                    value={tenant.id}
                    onSelect={() => handleTenantSelect(tenant.id)}
                    className="flex items-center"
                  >
                    <CircleAlert className="mr-2 h-4 w-4 text-amber-500" />
                    <span>{tenant.name}</span>
                    <Badge 
                      variant={tenant.status === 'suspended' ? 'destructive' : 'outline'} 
                      className="ml-2 text-xs py-0"
                    >
                      {tenant.status}
                    </Badge>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  refetch();
                  toast({
                    title: "Refreshed",
                    description: "Tenant list refreshed",
                  });
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  toast({
                    title: "Create Tenant",
                    description: "This feature is coming soon",
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Tenant
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Card version of the TenantSwitcher for dashboard use
export function TenantSwitcherCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tenant Management</CardTitle>
        <CardDescription>
          Manage and switch between tenant instances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TenantSwitcher />
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Tenant
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between text-xs text-muted-foreground">
        <div>4 Active Tenants</div>
        <div>1 Template</div>
      </CardFooter>
    </Card>
  );
}