import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";

import { Check, ChevronsUpDown, Plus, Building, Search } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: string;
  industry: string;
  isTemplate: boolean;
}

export function TenantSwitcher() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { tenant, switchTenant } = useTenant();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch tenants
  const { data: tenants } = useQuery({
    queryKey: ['/api/tenants'],
    queryFn: getQueryFn(),
  });

  if (!user?.isSuperAdmin) {
    return null;
  }

  const filteredTenants = search 
    ? tenants?.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.domain.toLowerCase().includes(search.toLowerCase())
      )
    : tenants;

  const activeTenants = tenants?.filter(t => t.status === 'active');
  const templateTenants = tenants?.filter(t => t.isTemplate === true);
  
  const handleCreateTenant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;
    const industry = formData.get('industry') as string;
    const isTemplate = (formData.get('isTemplate') as string) === 'on';
    
    if (!name || !domain) {
      toast({
        title: "Validation error",
        description: "Name and domain are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest('POST', '/api/tenants', {
        name,
        domain,
        industry: industry || null,
        isTemplate,
        status: 'active',
      });
      
      queryClient.invalidateQueries({queryKey: ['/api/tenants']});
      setCreateDialogOpen(false);
      
      toast({
        title: "Tenant created",
        description: `${name} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error creating tenant",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a tenant"
            className="w-[220px] justify-between"
          >
            <Building className="mr-2 h-4 w-4" />
            {tenant?.name || "Select tenant"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search tenant..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No tenant found.</CommandEmpty>
              {filteredTenants?.length > 0 && (
                <CommandGroup heading="Active Tenants">
                  <ScrollArea className="h-[200px]">
                    {filteredTenants.filter(t => t.status === 'active' && !t.isTemplate).map((t) => (
                      <CommandItem
                        key={t.id}
                        onSelect={() => {
                          switchTenant(t.id);
                          setOpen(false);
                        }}
                        className="text-sm"
                      >
                        <Building className="mr-2 h-4 w-4" />
                        {t.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            tenant?.id === t.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              )}
              {templateTenants?.some(t => t.name.toLowerCase().includes(search.toLowerCase())) && (
                <CommandGroup heading="Templates">
                  <ScrollArea className="h-[100px]">
                    {templateTenants.filter(t => 
                      t.name.toLowerCase().includes(search.toLowerCase()) || 
                      t.domain.toLowerCase().includes(search.toLowerCase())
                    ).map((t) => (
                      <CommandItem
                        key={t.id}
                        onSelect={() => {
                          switchTenant(t.id);
                          setOpen(false);
                        }}
                        className="text-sm"
                      >
                        <Building className="mr-2 h-4 w-4" />
                        {t.name}
                        <span className="ml-auto bg-muted text-xs px-1 py-0.5 rounded">Template</span>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setCreateDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Tenant
                    </CommandItem>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleCreateTenant}>
                      <DialogHeader>
                        <DialogTitle>Create New Tenant</DialogTitle>
                        <DialogDescription>
                          Add a new tenant to the Progress platform.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Tenant Name</Label>
                          <Input id="name" name="name" placeholder="Acme Corporation" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="domain">Domain</Label>
                          <Input id="domain" name="domain" placeholder="acme.progress.app" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Input id="industry" name="industry" placeholder="Technology" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isTemplate"
                            name="isTemplate"
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="isTemplate">Create as template</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Tenant</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

export function TenantSwitcherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Switcher</CardTitle>
        <CardDescription>
          Switch between tenants or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TenantSwitcher />
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Super admin mode enables cross-tenant operations
      </CardFooter>
    </Card>
  );
}