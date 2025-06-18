import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Clock, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SotDeclaration {
  id: number;
  instanceId: string;
  instanceType: string;
  blueprintVersion: string;
  toolsSupported: string[];
  callbackUrl: string;
  isTemplate: boolean;
  isCloneable: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SotClientProfile {
  id: number;
  businessId: string;
  businessName: string;
  businessType: string;
  industry: string;
  description: string;
  location: {
    city: string;
    country: string;
  };
  profileData: any;
  syncStatus: string;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
}

interface SyncStatus {
  isRunning: boolean;
  schedule: string;
  lastSync: string | null;
  retryCount: number;
  maxRetries: number;
  logs: SyncLog[];
}

interface SyncLog {
  id: number;
  eventType: string;
  status: string;
  details: any;
  createdAt: string;
}

interface SotJsonSenderProps {
  className?: string;
}

/**
 * SotJsonSender Component
 * Provides an interface to interact with the SOT system
 */
export default function SotJsonSender({ className }: SotJsonSenderProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('declarations');
  const [jsonMode, setJsonMode] = useState(false);
  const [newDeclaration, setNewDeclaration] = useState({
    instanceId: '',
    instanceType: 'client_site',
    blueprintVersion: '1.0.0',
    toolsSupported: '',
    callbackUrl: ''
  });
  
  // Get declarations
  const {
    data: declarationsData,
    isLoading: isLoadingDeclarations,
    error: declarationsError
  } = useQuery({
    queryKey: ['/api/sot/declarations'],
    queryFn: getQueryFn(),
    refetchInterval: 60000 // Refetch every minute
  });
  
  // Get client profiles
  const {
    data: profilesData,
    isLoading: isLoadingProfiles,
    error: profilesError
  } = useQuery({
    queryKey: ['/api/sot/profiles'],
    queryFn: getQueryFn(),
    refetchInterval: 60000 // Refetch every minute
  });
  
  // Get sync status
  const {
    data: syncStatusData,
    isLoading: isLoadingSyncStatus,
    error: syncStatusError
  } = useQuery({
    queryKey: ['/api/sot/sync/status'],
    queryFn: getQueryFn(),
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  // Register declaration mutation
  const registerDeclarationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/sot/declarations', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Declaration Registered',
        description: 'The SOT declaration has been registered successfully',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/declarations'] });
      resetDeclarationForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to register SOT declaration',
        variant: 'destructive'
      });
    }
  });
  
  // Update template status mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ instanceId, isTemplate, isCloneable }: { instanceId: string, isTemplate: boolean, isCloneable: boolean }) => {
      const response = await apiRequest('PATCH', `/api/sot/declarations/${instanceId}/template`, { isTemplate, isCloneable });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Template Status Updated',
        description: 'The template status has been updated successfully',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/declarations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update template status',
        variant: 'destructive'
      });
    }
  });
  
  // Trigger manual sync mutation
  const triggerSyncMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/sot/sync');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Sync Triggered',
        description: data.message || 'Manual sync has been triggered successfully',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/sync/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/profiles'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to trigger manual sync',
        variant: 'destructive'
      });
    }
  });
  
  // Update sync schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async (schedule: string) => {
      const response = await apiRequest('PATCH', '/api/sot/sync/schedule', { schedule });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Schedule Updated',
        description: 'The sync schedule has been updated successfully',
        variant: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/sync/status'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update sync schedule',
        variant: 'destructive'
      });
    }
  });
  
  const resetDeclarationForm = () => {
    setNewDeclaration({
      instanceId: '',
      instanceType: 'client_site',
      blueprintVersion: '1.0.0',
      toolsSupported: '',
      callbackUrl: ''
    });
  };
  
  const handleDeclarationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (jsonMode) {
      try {
        const jsonData = JSON.parse(document.getElementById('declarationJson')?.value || '{}');
        registerDeclarationMutation.mutate(jsonData);
      } catch (error) {
        toast({
          title: 'Invalid JSON',
          description: 'Please provide valid JSON data',
          variant: 'destructive'
        });
      }
    } else {
      // Form mode
      if (!newDeclaration.instanceId || !newDeclaration.callbackUrl) {
        toast({
          title: 'Missing Fields',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      const toolsArray = newDeclaration.toolsSupported
        .split(',')
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0);
      
      registerDeclarationMutation.mutate({
        instanceId: newDeclaration.instanceId,
        instanceType: newDeclaration.instanceType,
        blueprintVersion: newDeclaration.blueprintVersion,
        toolsSupported: toolsArray,
        callbackUrl: newDeclaration.callbackUrl
      });
    }
  };
  
  const handleToggleTemplate = (declaration: SotDeclaration, isTemplate: boolean, isCloneable: boolean) => {
    updateTemplateMutation.mutate({
      instanceId: declaration.instanceId,
      isTemplate,
      isCloneable
    });
  };
  
  const handleManualSync = () => {
    triggerSyncMutation.mutate();
  };
  
  const handleUpdateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduleInput = document.getElementById('syncSchedule') as HTMLInputElement;
    if (scheduleInput && scheduleInput.value) {
      updateScheduleMutation.mutate(scheduleInput.value);
    }
  };
  
  const renderDeclarationStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500 text-white">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const renderSyncStatus = (status: string) => {
    switch (status) {
      case 'synced':
        return <Badge variant="success" className="bg-green-500">Synced</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500 text-white">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const renderTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const declarations = declarationsData?.declarations || [];
  const profiles = profilesData?.profiles || [];
  const syncStatus: SyncStatus = syncStatusData?.status || {
    isRunning: false,
    schedule: '0 3 * * *',
    lastSync: null,
    retryCount: 0,
    maxRetries: 3,
    logs: []
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="declarations">SOT Declarations</TabsTrigger>
          <TabsTrigger value="profiles">Client Profiles</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
        </TabsList>
        
        {/* Declarations Tab */}
        <TabsContent value="declarations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Register SOT Declaration</CardTitle>
              <CardDescription>
                Register or update an instance with the SOT system
              </CardDescription>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="json-mode"
                  checked={jsonMode}
                  onCheckedChange={setJsonMode}
                />
                <Label htmlFor="json-mode">JSON Mode</Label>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeclarationSubmit}>
                {jsonMode ? (
                  <div className="space-y-4">
                    <Label htmlFor="declarationJson">JSON Data</Label>
                    <Textarea
                      id="declarationJson"
                      placeholder="Enter JSON data..."
                      className="font-mono h-64"
                      defaultValue={JSON.stringify({
                        instanceId: "client-site-123",
                        instanceType: "client_site",
                        blueprintVersion: "1.0.0",
                        toolsSupported: ["crm", "financial-dashboard", "reporting"],
                        callbackUrl: "https://nextmonth.ai/sot/callback"
                      }, null, 2)}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instanceId">Instance ID *</Label>
                        <Input
                          id="instanceId"
                          value={newDeclaration.instanceId}
                          onChange={(e) => setNewDeclaration({...newDeclaration, instanceId: e.target.value})}
                          placeholder="e.g. client-site-123"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instanceType">Instance Type *</Label>
                        <Input
                          id="instanceType"
                          value={newDeclaration.instanceType}
                          onChange={(e) => setNewDeclaration({...newDeclaration, instanceType: e.target.value})}
                          placeholder="e.g. client_site"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="blueprintVersion">Blueprint Version *</Label>
                        <Input
                          id="blueprintVersion"
                          value={newDeclaration.blueprintVersion}
                          onChange={(e) => setNewDeclaration({...newDeclaration, blueprintVersion: e.target.value})}
                          placeholder="e.g. 1.0.0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toolsSupported">
                          Tools Supported * <span className="text-xs text-muted-foreground">(comma separated)</span>
                        </Label>
                        <Input
                          id="toolsSupported"
                          value={newDeclaration.toolsSupported}
                          onChange={(e) => setNewDeclaration({...newDeclaration, toolsSupported: e.target.value})}
                          placeholder="e.g. crm, reporting, dashboard"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="callbackUrl">Callback URL *</Label>
                      <Input
                        id="callbackUrl"
                        value={newDeclaration.callbackUrl}
                        onChange={(e) => setNewDeclaration({...newDeclaration, callbackUrl: e.target.value})}
                        placeholder="e.g. https://nextmonth.ai/sot/callback"
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={registerDeclarationMutation.isPending}
                    className="w-full"
                  >
                    {registerDeclarationMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Register Declaration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Existing Declarations</CardTitle>
              <CardDescription>
                View and manage SOT declarations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDeclarations ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : declarationsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load declarations
                  </AlertDescription>
                </Alert>
              ) : declarations.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Declarations</AlertTitle>
                  <AlertDescription>
                    No SOT declarations have been registered yet
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {declarations.map((declaration: SotDeclaration) => (
                    <Card key={declaration.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md font-medium">
                            {declaration.instanceId}
                          </CardTitle>
                          {renderDeclarationStatus(declaration.status)}
                        </div>
                        <CardDescription>
                          {declaration.instanceType} • v{declaration.blueprintVersion}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Callback URL:</span>
                            <div className="truncate font-mono text-xs">
                              {declaration.callbackUrl}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tools:</span>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {declaration.toolsSupported.map((tool) => (
                                <Badge key={tool} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          Created {renderTimeAgo(declaration.createdAt)}
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`template-${declaration.id}`}
                              checked={declaration.isTemplate}
                              onCheckedChange={(checked) => handleToggleTemplate(declaration, checked, declaration.isCloneable)}
                              disabled={updateTemplateMutation.isPending}
                            />
                            <Label htmlFor={`template-${declaration.id}`} className="text-xs">
                              Template
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`cloneable-${declaration.id}`}
                              checked={declaration.isCloneable}
                              onCheckedChange={(checked) => handleToggleTemplate(declaration, declaration.isTemplate, checked)}
                              disabled={updateTemplateMutation.isPending || !declaration.isTemplate}
                            />
                            <Label htmlFor={`cloneable-${declaration.id}`} className="text-xs">
                              Cloneable
                            </Label>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profiles Tab */}
        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Profiles</CardTitle>
              <CardDescription>
                View client profiles synchronized with the SOT system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProfiles ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : profilesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load client profiles
                  </AlertDescription>
                </Alert>
              ) : profiles.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Profiles</AlertTitle>
                  <AlertDescription>
                    No client profiles have been synchronized yet
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {profiles.map((profile: SotClientProfile) => (
                    <Card key={profile.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md font-medium">
                            {profile.businessName}
                          </CardTitle>
                          {renderSyncStatus(profile.syncStatus)}
                        </div>
                        <CardDescription>
                          {profile.businessType} • {profile.industry || 'No industry'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Business ID:</span>
                            <div className="truncate font-mono text-xs">
                              {profile.businessId}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <div className="text-xs">
                              {profile.location?.city}, {profile.location?.country}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-muted-foreground text-sm">Description:</span>
                          <div className="text-xs mt-1">
                            {profile.description || 'No description available'}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          Last synced {renderTimeAgo(profile.lastSyncAt)}
                        </div>
                        {profile.syncStatus === 'error' && (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            Sync Error
                          </Badge>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleManualSync}
                disabled={triggerSyncMutation.isPending}
                className="w-full"
              >
                {triggerSyncMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Sync Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Sync Status Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Configuration</CardTitle>
              <CardDescription>
                Configure the synchronization with the SOT system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSyncStatus ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : syncStatusError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load sync status
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2">
                        {syncStatus.isRunning ? (
                          <>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Running
                            </Badge>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              Stopped
                            </Badge>
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Sync</Label>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{renderTimeAgo(syncStatus.lastSync)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleUpdateSchedule} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="syncSchedule">
                        Sync Schedule (cron expression) 
                        <span className="ml-2 text-xs text-muted-foreground">e.g. 0 3 * * *</span>
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="syncSchedule"
                          defaultValue={syncStatus.schedule}
                          placeholder="0 3 * * *"
                          className="font-mono"
                        />
                        <Button 
                          type="submit" 
                          variant="outline"
                          disabled={updateScheduleMutation.isPending}
                        >
                          {updateScheduleMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Update"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                  
                  <div className="pt-6">
                    <Button
                      onClick={handleManualSync}
                      disabled={triggerSyncMutation.isPending}
                      className="w-full"
                    >
                      {triggerSyncMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Trigger Manual Sync
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
              <CardDescription>
                Recent synchronization activity with the SOT system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSyncStatus ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : syncStatusError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load sync logs
                  </AlertDescription>
                </Alert>
              ) : syncStatus.logs.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Logs</AlertTitle>
                  <AlertDescription>
                    No synchronization logs available
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {syncStatus.logs.map((log, index) => (
                    <div 
                      key={log.id || index} 
                      className={`p-3 rounded-md text-sm ${
                        log.status === 'success' 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          {log.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{log.eventType}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {renderTimeAgo(log.createdAt)}
                        </span>
                      </div>
                      {log.details && (
                        <div className="mt-2 text-xs font-mono bg-background/50 p-2 rounded overflow-x-auto">
                          {typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details, null, 2)
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}