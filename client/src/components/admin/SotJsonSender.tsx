import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, RefreshCw, Send, Database, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function SotJsonSender() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("declaration");
  const [declarationJson, setDeclarationJson] = useState("");
  const [profileJson, setProfileJson] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonErrorMessage, setJsonErrorMessage] = useState("");
  
  // Get SOT declaration
  const { 
    data: declaration, 
    isLoading: isLoadingDeclaration 
  } = useQuery({
    queryKey: ['/api/sot/declaration'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/sot/declaration');
        return await res.json();
      } catch (error) {
        console.error('Error fetching SOT declaration:', error);
        return null;
      }
    },
    retry: false,
    enabled: true
  });
  
  // Get client profile
  const { 
    data: clientProfile, 
    isLoading: isLoadingProfile 
  } = useQuery({
    queryKey: ['/api/sot/client-profile'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/sot/client-profile');
        return await res.json();
      } catch (error) {
        console.error('Error fetching client profile:', error);
        return null;
      }
    },
    retry: false,
    enabled: true
  });
  
  // Get sync logs
  const { 
    data: syncLogs, 
    isLoading: isLoadingLogs 
  } = useQuery({
    queryKey: ['/api/sot/sync-logs'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/sot/sync-logs');
        return await res.json();
      } catch (error) {
        console.error('Error fetching sync logs:', error);
        return { logs: [], pagination: { totalLogs: 0 } };
      }
    },
    enabled: Boolean(user?.isSuperAdmin)
  });
  
  // Update declaration mutation
  const updateDeclaration = useMutation({
    mutationFn: async (json: string) => {
      const res = await apiRequest('POST', '/api/sot/declaration', JSON.parse(json));
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Declaration updated',
        description: 'SOT declaration has been successfully updated.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/declaration'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/sync-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: `Failed to update SOT declaration: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (json: string) => {
      const res = await apiRequest('POST', '/api/sot/client-profile', JSON.parse(json));
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Profile updated',
        description: 'Client profile has been successfully updated.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/client-profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/sync-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: `Failed to update client profile: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Trigger sync mutation
  const triggerSync = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/sot/sync', {});
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Sync completed',
        description: 'Client profile sync has been successfully completed.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/client-profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sot/sync-logs'] });
      
      // Update the profile JSON area with the latest data
      setProfileJson(JSON.stringify(data.profileData, null, 2));
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync failed',
        description: `Failed to sync client profile: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Initialize JSON editors with fetched data
  useEffect(() => {
    if (declaration) {
      try {
        setDeclarationJson(JSON.stringify(declaration, null, 2));
      } catch (e) {
        setDeclarationJson("");
      }
    }
  }, [declaration]);
  
  useEffect(() => {
    if (clientProfile) {
      try {
        setProfileJson(JSON.stringify(clientProfile, null, 2));
      } catch (e) {
        setProfileJson("");
      }
    }
  }, [clientProfile]);
  
  // Validate JSON input
  const validateJson = (json: string): boolean => {
    try {
      if (json.trim() === "") return true;
      JSON.parse(json);
      setIsValidJson(true);
      setJsonErrorMessage("");
      return true;
    } catch (e) {
      setIsValidJson(false);
      setJsonErrorMessage(e.message);
      return false;
    }
  };
  
  // Handle text change in JSON editors
  const handleJsonChange = (json: string, type: 'declaration' | 'profile') => {
    if (type === 'declaration') {
      setDeclarationJson(json);
    } else {
      setProfileJson(json);
    }
    validateJson(json);
  };
  
  // Handle form submissions
  const handleSubmitDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateJson(declarationJson)) {
      updateDeclaration.mutate(declarationJson);
    }
  };
  
  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateJson(profileJson)) {
      updateProfile.mutate(profileJson);
    }
  };
  
  const handleSyncProfile = () => {
    triggerSync.mutate();
  };
  
  // Create a template JSON for new declarations
  const createTemplateDeclaration = () => {
    const template = {
      instanceId: "00000000-0000-0000-0000-000000000000",
      instanceType: "client_site",
      blueprintVersion: "1.0.0",
      toolsSupported: ["social_media", "crm", "analytics"],
      callbackUrl: "https://api.nextmonth.ai/sot/callback",
      isTemplate: false,
      isCloneable: true
    };
    
    setDeclarationJson(JSON.stringify(template, null, 2));
  };
  
  // Create a template JSON for new client profiles
  const createTemplateProfile = () => {
    const template = {
      businessId: "00000000-0000-0000-0000-000000000000",
      businessName: "Progress Accountants",
      businessType: "Accounting Firm",
      industry: "Finance",
      description: "Professional accounting services",
      locationData: {
        city: "London",
        country: "United Kingdom"
      },
      contactInfo: {
        email: "info@progressaccountants.com",
        phone: "+44 123 456 7890"
      },
      profileData: {
        metrics: {
          totalPages: 10,
          totalUsers: 5,
          totalTools: 8
        },
        features: {
          hasCustomBranding: true,
          hasPublishedPages: true,
          hasCRM: true,
          hasAnalytics: true
        },
        dateOnboarded: new Date().toISOString(),
        lastSync: new Date().toISOString()
      }
    };
    
    setProfileJson(JSON.stringify(template, null, 2));
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-6">SOT Management System</h1>
      
      <Tabs defaultValue="declaration" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-2/3 lg:w-1/3 mb-6">
          <TabsTrigger value="declaration">SOT Declaration</TabsTrigger>
          <TabsTrigger value="profile">Client Profile</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>
        
        {/* Declaration Tab */}
        <TabsContent value="declaration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                SOT Declaration
              </CardTitle>
              <CardDescription>
                Manage your Source of Truth declaration settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDeclaration ? (
                <div className="space-y-2">
                  <Skeleton className="h-[20px] w-[150px]" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : declaration ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="outline" className="mr-2">
                        {declaration.instance_type}
                      </Badge>
                      <Badge variant={declaration.status === 'pending' ? 'secondary' : 'default'}>
                        {declaration.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(declaration.updated_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmitDeclaration}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="declaration-json">Declaration JSON</Label>
                        <Textarea
                          id="declaration-json"
                          className="font-mono h-[300px]"
                          value={declarationJson}
                          onChange={(e) => handleJsonChange(e.target.value, 'declaration')}
                        />
                      </div>
                      
                      {!isValidJson && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Invalid JSON</AlertTitle>
                          <AlertDescription>{jsonErrorMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={createTemplateDeclaration}
                        >
                          Create Template
                        </Button>
                        <Button
                          type="submit"
                          disabled={!isValidJson || updateDeclaration.isPending}
                        >
                          {updateDeclaration.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Update Declaration
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No declaration found</AlertTitle>
                    <AlertDescription>
                      Create a new SOT declaration using the form below.
                    </AlertDescription>
                  </Alert>
                  
                  <form onSubmit={handleSubmitDeclaration}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="declaration-json">Declaration JSON</Label>
                        <Textarea
                          id="declaration-json"
                          className="font-mono h-[300px]"
                          value={declarationJson}
                          onChange={(e) => handleJsonChange(e.target.value, 'declaration')}
                          placeholder='{"instanceId": "00000000-0000-0000-0000-000000000000", ...}'
                        />
                      </div>
                      
                      {!isValidJson && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Invalid JSON</AlertTitle>
                          <AlertDescription>{jsonErrorMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={createTemplateDeclaration}
                        >
                          Create Template
                        </Button>
                        <Button
                          type="submit"
                          disabled={!isValidJson || declarationJson.trim() === "" || updateDeclaration.isPending}
                        >
                          {updateDeclaration.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Create Declaration
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Client Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Client Profile
              </CardTitle>
              <CardDescription>
                Manage your client profile data sent to the Source of Truth system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProfile ? (
                <div className="space-y-2">
                  <Skeleton className="h-[20px] w-[150px]" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {clientProfile && (
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Badge variant="outline" className="mr-2">
                          {clientProfile.business_type}
                        </Badge>
                        <Badge variant={clientProfile.sync_status === 'pending' ? 'secondary' : 'default'}>
                          {clientProfile.sync_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last synced: {clientProfile.last_sync_at ? new Date(clientProfile.last_sync_at).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={handleSyncProfile}
                      disabled={triggerSync.isPending}
                    >
                      {triggerSync.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Profile Now
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <form onSubmit={handleSubmitProfile}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profile-json">Profile JSON</Label>
                        <Textarea
                          id="profile-json"
                          className="font-mono h-[300px]"
                          value={profileJson}
                          onChange={(e) => handleJsonChange(e.target.value, 'profile')}
                          placeholder='{"businessId": "00000000-0000-0000-0000-000000000000", ...}'
                        />
                      </div>
                      
                      {!isValidJson && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Invalid JSON</AlertTitle>
                          <AlertDescription>{jsonErrorMessage}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={createTemplateProfile}
                        >
                          Create Template
                        </Button>
                        <Button
                          type="submit"
                          disabled={!isValidJson || profileJson.trim() === "" || updateProfile.isPending}
                        >
                          {updateProfile.isPending ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              {clientProfile ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              {clientProfile ? 'Update Profile' : 'Create Profile'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sync Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Sync Logs
              </CardTitle>
              <CardDescription>
                View a history of SOT sync operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="space-y-2">
                  <Skeleton className="h-[20px] w-full" />
                  <Skeleton className="h-[20px] w-full" />
                  <Skeleton className="h-[20px] w-full" />
                  <Skeleton className="h-[20px] w-full" />
                  <Skeleton className="h-[20px] w-full" />
                </div>
              ) : syncLogs?.logs?.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                    <div>Event Type</div>
                    <div>Status</div>
                    <div>Timestamp</div>
                    <div>Details</div>
                  </div>
                  <div className="divide-y">
                    {syncLogs.logs.map((log, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-4 text-sm">
                        <div>{log.event_type.replace('_', ' ')}</div>
                        <div>
                          <Badge variant={log.status === 'error' ? 'destructive' : 'default'}>
                            {log.status}
                          </Badge>
                        </div>
                        <div>{new Date(log.created_at).toLocaleString()}</div>
                        <div className="truncate max-w-xs" title={log.details}>
                          {log.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No sync logs found</AlertTitle>
                  <AlertDescription>
                    Sync logs will appear here once SOT sync operations have been performed.
                  </AlertDescription>
                </Alert>
              )}
              
              {syncLogs?.pagination && syncLogs.pagination.totalLogs > 0 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {syncLogs.logs.length} of {syncLogs.pagination.totalLogs} logs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}