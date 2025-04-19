import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blueprintApi, ModuleMapItem } from '@/lib/blueprint-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ReloadIcon, CheckCircle2Icon, XCircleIcon, Clock10Icon, PackageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

// Default client ID - normally would come from context or configuration
const DEFAULT_CLIENT_ID = 'progress-accountants';
// Default blueprint version - normally would be determined based on current state
const DEFAULT_BLUEPRINT_VERSION = '1.1.0';

const BlueprintManagerPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('configuration');
  const [clientId, setClientId] = useState(DEFAULT_CLIENT_ID);
  const [blueprintVersion, setBlueprintVersion] = useState(DEFAULT_BLUEPRINT_VERSION);
  const [sector, setSector] = useState('accounting');
  const [location, setLocation] = useState('UK');
  const [exportProgress, setExportProgress] = useState(0);

  // Status query
  const { 
    data: blueprintStatus, 
    isLoading: isStatusLoading,
    error: statusError,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['/api/blueprint/status'],
    queryFn: () => blueprintApi.getStatus(),
  });

  // Tag blueprint mutation
  const tagMutation = useMutation({
    mutationFn: (data: {
      clientId: string;
      blueprintVersion: string;
      sector: string;
      location: string;
    }) => blueprintApi.tagBlueprint(data),
    onSuccess: () => {
      toast({
        title: 'Blueprint Tagged',
        description: `Tagged ${clientId} with version ${blueprintVersion}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/status'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to tag blueprint',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Module map generation mutation
  const moduleMapMutation = useMutation({
    mutationFn: (clientId: string) => blueprintApi.generateModuleMap(clientId),
    onSuccess: (data) => {
      toast({
        title: 'Module Map Generated',
        description: `Generated module map with ${data.moduleCount} modules`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/status'] });
      setExportProgress(20);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate module map',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Blueprint package generation mutation
  const packageMutation = useMutation({
    mutationFn: (clientId: string) => blueprintApi.generateBlueprintPackage(clientId),
    onSuccess: (data) => {
      toast({
        title: 'Blueprint Package Generated',
        description: `Generated blueprint package. Vault sync: ${data.vaultSynced ? 'Success' : 'Pending'}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/status'] });
      setExportProgress(60);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate blueprint package',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Guardian notification mutation
  const guardianMutation = useMutation({
    mutationFn: (data: { clientId: string; event: string }) => 
      blueprintApi.notifyGuardian(data.clientId, data.event),
    onSuccess: (data) => {
      toast({
        title: 'Guardian Notified',
        description: `Handoff status: ${data.handoffStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/status'] });
      setExportProgress(100);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to notify Guardian',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Handoff status update mutation
  const handoffMutation = useMutation({
    mutationFn: (data: { clientId: string; status: string }) => 
      blueprintApi.updateHandoffStatus(data.clientId, data.status),
    onSuccess: (data) => {
      toast({
        title: 'Handoff Status Updated',
        description: `New status: ${data.handoffStatus}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/status'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update handoff status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Set defaults if blueprint status is loaded
  useEffect(() => {
    if (blueprintStatus) {
      setClientId(blueprintStatus.clientId || DEFAULT_CLIENT_ID);
      setBlueprintVersion(blueprintStatus.blueprintVersion || DEFAULT_BLUEPRINT_VERSION);
      
      // Set progress based on status
      if (blueprintStatus.exportReady) {
        setExportProgress(100);
      } else if (blueprintStatus.moduleCount > 0) {
        setExportProgress(30);
      }
    }
  }, [blueprintStatus]);

  // Handle tag blueprint
  const handleTagBlueprint = () => {
    tagMutation.mutate({
      clientId,
      blueprintVersion,
      sector,
      location,
    });
  };

  // Handle generate module map
  const handleGenerateModuleMap = () => {
    if (!clientId) return;
    moduleMapMutation.mutate(clientId);
  };

  // Handle generate blueprint package
  const handleGeneratePackage = () => {
    if (!clientId) return;
    packageMutation.mutate(clientId);
  };

  // Handle notify Guardian
  const handleNotifyGuardian = () => {
    if (!clientId) return;
    guardianMutation.mutate({ clientId, event: 'export-ready' });
  };

  // Handle full export process
  const handleFullExport = async () => {
    if (!clientId) return;
    setExportProgress(10);
    
    try {
      // Step 1: Tag blueprint
      await tagMutation.mutateAsync({
        clientId,
        blueprintVersion,
        sector,
        location,
      });
      setExportProgress(15);
      
      // Step 2: Generate module map
      await moduleMapMutation.mutateAsync(clientId);
      setExportProgress(40);
      
      // Step 3: Generate blueprint package
      await packageMutation.mutateAsync(clientId);
      setExportProgress(75);
      
      // Step 4: Notify Guardian
      await guardianMutation.mutateAsync({ clientId, event: 'export-ready' });
      setExportProgress(100);
      
      toast({
        title: 'Export Complete',
        description: 'Blueprint exported successfully to Vault',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'An error occurred during export',
        variant: 'destructive',
      });
    }
  };

  // Status badge
  const getHandoffStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case 'exported':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Exported</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render blueprint status
  const renderBlueprintStatus = () => {
    if (isStatusLoading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Loading Blueprint Status...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ReloadIcon className="h-16 w-16 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      );
    }

    if (statusError) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Blueprint Status</CardTitle>
            <CardDescription>
              {statusError instanceof Error ? statusError.message : 'Unknown error'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => refetchStatus()}>Retry</Button>
          </CardFooter>
        </Card>
      );
    }

    if (!blueprintStatus) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Blueprint Not Configured</CardTitle>
            <CardDescription>
              No blueprint configuration found. Please configure using the form.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Blueprint Status</span>
            {blueprintStatus.exportReady && <CheckCircle2Icon className="h-5 w-5 text-green-500" />}
          </CardTitle>
          <CardDescription>
            {blueprintStatus.exportReady ? 
              'Blueprint is ready for export' : 
              'Blueprint configuration in progress'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Client ID</Label>
                <div className="font-medium">{blueprintStatus.clientId}</div>
              </div>
              <div>
                <Label className="text-xs">Blueprint Version</Label>
                <div className="font-medium">{blueprintStatus.blueprintVersion}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Export Status</Label>
                <div className="font-medium">{getHandoffStatusBadge(blueprintStatus.handoffStatus)}</div>
              </div>
              <div>
                <Label className="text-xs">Module Count</Label>
                <div className="font-medium">{blueprintStatus.moduleCount}</div>
              </div>
            </div>
            
            {blueprintStatus.lastExported && (
              <div>
                <Label className="text-xs">Last Exported</Label>
                <div className="font-medium">
                  {new Date(blueprintStatus.lastExported).toLocaleString()}
                </div>
              </div>
            )}
            
            <div>
              <Label className="text-xs mb-2 block">Export Progress</Label>
              <Progress value={exportProgress} className="h-2 w-full" />
              <div className="text-xs text-right mt-1">{exportProgress}%</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => refetchStatus()}>
            Refresh
          </Button>
          <Button 
            onClick={handleFullExport}
            disabled={packageMutation.isPending || guardianMutation.isPending}
          >
            {packageMutation.isPending || guardianMutation.isPending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <PackageIcon className="mr-2 h-4 w-4" />
                Export Blueprint
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blueprint Manager</h1>
          <p className="text-muted-foreground">
            Configure and export Blueprint v1.1.0 to NextMonth Vault
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4">
          {renderBlueprintStatus()}
        </TabsContent>
        
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blueprint Configuration</CardTitle>
              <CardDescription>
                Configure the blueprint identity and versioning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input 
                    id="clientId" 
                    value={clientId} 
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blueprintVersion">Blueprint Version</Label>
                  <Input 
                    id="blueprintVersion" 
                    value={blueprintVersion} 
                    onChange={(e) => setBlueprintVersion(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select 
                    defaultValue={sector}
                    onValueChange={setSector}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="financial_services">Financial Services</SelectItem>
                      <SelectItem value="professional_services">Professional Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select 
                    defaultValue={location}
                    onValueChange={setLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleTagBlueprint}
                disabled={tagMutation.isPending}
              >
                {tagMutation.isPending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Export Configuration</CardTitle>
              <CardDescription>
                Prepare and package modules for the blueprint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a module map for export to the Vault. This will discover all active modules 
                  in the current project and prepare them for packaging.
                </p>
                
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock10Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Processing Info</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Module mapping may take a few moments to complete as it needs to analyze 
                          all active modules and their dependencies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => refetchStatus()}
              >
                Refresh Status
              </Button>
              <Button 
                onClick={handleGenerateModuleMap}
                disabled={moduleMapMutation.isPending}
              >
                {moduleMapMutation.isPending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Mapping...
                  </>
                ) : (
                  'Generate Module Map'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blueprint Export</CardTitle>
              <CardDescription>
                Package and export the blueprint to the NextMonth Vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  This process will:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Package the entire blueprint configuration</li>
                  <li>Export all modules, SEO configs, and brand settings</li>
                  <li>Send the package to the NextMonth Vault</li>
                  <li>Notify Guardian about the export</li>
                </ol>
                
                <div className="rounded-md bg-amber-50 p-4 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock10Icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Important Note</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Make sure all configuration is complete before exporting. The process may take 
                          a few minutes to complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => handoffMutation.mutate({ clientId, status: 'in_progress' })}
                  disabled={handoffMutation.isPending}
                >
                  Reset Status
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handoffMutation.mutate({ clientId, status: 'completed' })}
                  disabled={handoffMutation.isPending}
                >
                  Mark Complete
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="secondary"
                  onClick={handleGeneratePackage}
                  disabled={packageMutation.isPending}
                >
                  {packageMutation.isPending ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Packaging...
                    </>
                  ) : (
                    'Generate Package'
                  )}
                </Button>
                <Button 
                  onClick={handleNotifyGuardian}
                  disabled={guardianMutation.isPending}
                >
                  {guardianMutation.isPending ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Notifying...
                    </>
                  ) : (
                    'Notify Guardian'
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlueprintManagerPage;