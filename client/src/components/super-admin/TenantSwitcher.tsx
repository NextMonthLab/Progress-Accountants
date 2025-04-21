import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Building2, Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useTenant } from '@/hooks/use-tenant';
import { usePermissions } from '@/hooks/use-permissions';
import { Loader2, PlusCircle } from 'lucide-react';
import { Tenant } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface TenantSwitcherProps {
  className?: string;
}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const { toast } = useToast();
  const { tenant, setTenant } = useTenant();
  const { can } = usePermissions();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const canManageTenants = can('manage_tenants');

  // Fetch tenants
  const { data: tenants, isLoading } = useQuery({
    queryKey: ['/api/tenants'],
    queryFn: getQueryFn(),
    enabled: canManageTenants,
  });

  // Handle tenant switching
  const switchTenantMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const response = await apiRequest('POST', '/api/tenants/switch', { tenantId });
      return await response.json();
    },
    onSuccess: (data) => {
      setTenant(data.tenant);
      
      // Invalidate relevant queries to refresh with new tenant data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/modules'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
      
      toast({
        title: 'Tenant switched',
        description: `You are now managing: ${data.tenant.name}`,
      });
      
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to switch tenant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // If the user doesn't have tenant management permissions, don't render
  if (!canManageTenants) {
    return null;
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a tenant"
            className={cn("w-full justify-between")}
          >
            <div className="flex items-center">
              {tenant ? (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="truncate">{tenant.name}</span>
                  {tenant.isTemplate && (
                    <Badge variant="secondary" className="ml-2">
                      Template
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Select Tenant</span>
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <Command>
              <CommandInput placeholder="Search tenants..." />
              <CommandList>
                <CommandEmpty>No tenants found.</CommandEmpty>
                <CommandGroup heading="Templates">
                  {tenants?.filter(t => t.isTemplate).map((tenant: Tenant) => (
                    <CommandItem
                      key={tenant.id}
                      value={tenant.id}
                      onSelect={() => {
                        switchTenantMutation.mutate(tenant.id);
                      }}
                      className="text-sm"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>{tenant.name}</span>
                      <Badge variant="secondary" className="ml-auto">Template</Badge>
                      {tenant.id === tenant?.id && (
                        <Check className="ml-2 h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                
                <CommandGroup heading="Active Tenants">
                  {tenants?.filter(t => !t.isTemplate && t.status === 'active').map((tenant: Tenant) => (
                    <CommandItem
                      key={tenant.id}
                      value={tenant.id}
                      onSelect={() => {
                        switchTenantMutation.mutate(tenant.id);
                      }}
                      className="text-sm"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>{tenant.name}</span>
                      {tenant.id === tenant?.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                
                {tenants?.some(t => t.status === 'inactive' || t.status === 'suspended') && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Inactive Tenants">
                      {tenants?.filter(t => t.status === 'inactive' || t.status === 'suspended').map((tenant: Tenant) => (
                        <CommandItem
                          key={tenant.id}
                          value={tenant.id}
                          onSelect={() => {
                            switchTenantMutation.mutate(tenant.id);
                          }}
                          className="text-sm"
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>{tenant.name}</span>
                          <Badge 
                            variant={tenant.status === 'suspended' ? 'destructive' : 'outline'} 
                            className="ml-auto"
                          >
                            {tenant.status}
                          </Badge>
                          {tenant.id === tenant?.id && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
                
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem 
                    onSelect={() => {
                      // Close the menu and navigate to create tenant page
                      setOpen(false);
                      // TODO: Implement navigation to create tenant page
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create New Tenant</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function TenantSwitcherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Management</CardTitle>
        <CardDescription>
          As a Super Admin, you can switch between tenants to manage their data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TenantSwitcher className="w-full" />
      </CardContent>
    </Card>
  );
}