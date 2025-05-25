import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DigestList from '@/components/support/DigestList';
import DigestGenerator from '@/components/support/DigestGenerator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Home, Layers, Settings, BookOpen, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

const DigestPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  
  // Fetch tenant ID (default to the system tenant ID if not available)
  const { data: tenantData, isLoading: tenantLoading } = useQuery({
    queryKey: ['/api/tenant/current'],
    queryFn: () => apiRequest('GET', '/api/tenant/00000000-0000-0000-0000-000000000000').then(res => res.json()),
  });
  
  const tenantId = tenantData?.id || '00000000-0000-0000-0000-000000000000';
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (tenantLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard"><Home className="h-4 w-4" /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/support">Support</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Support Digests</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <h1 className="text-3xl font-bold mt-2 mb-1">Support Digests</h1>
        <p className="text-muted-foreground">
          Personalized support summaries and system health updates
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Support Digest Manager</CardTitle>
              <CardDescription>
                View and manage personalized support digests for your users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view" onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="view">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Digests
                  </TabsTrigger>
                  <TabsTrigger value="generate">
                    <Layers className="h-4 w-4 mr-2" />
                    Generate Digest
                  </TabsTrigger>
                  <TabsTrigger value="system">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    System Health
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="view" className="space-y-4">
                  {user ? (
                    <DigestList userId={user.id} />
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Please log in to view your support digests.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="generate">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create New Support Digest</CardTitle>
                        <CardDescription>
                          Generate a support digest for a ticket, session, or system event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="system">
                          <TabsList className="mb-4">
                            <TabsTrigger value="ticket">From Ticket</TabsTrigger>
                            <TabsTrigger value="session">From Session</TabsTrigger>
                            <TabsTrigger value="system">System Health</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="ticket">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Generate a digest from a resolved support ticket
                              </p>
                              <DigestGenerator 
                                tenantId={tenantId}
                                userId={user?.id}
                                type="ticket"
                                ticketId={1} // This would be dynamic in a real implementation
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="session">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Generate a digest from a completed support session
                              </p>
                              <DigestGenerator 
                                tenantId={tenantId}
                                userId={user?.id}
                                type="session"
                                sessionId={1} // This would be dynamic in a real implementation
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="system">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Generate a system health digest for proactive maintenance
                              </p>
                              <DigestGenerator 
                                tenantId={tenantId}
                                userId={user?.id}
                                type="system"
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="system">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Health Digests</CardTitle>
                      <CardDescription>
                        View and manage system health digests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        System health digests are automatically generated when significant system events occur or maintenance is performed.
                      </p>
                      
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No system health digests are currently available.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Digest Settings</CardTitle>
                      <CardDescription>
                        Configure how support digests are generated and delivered
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        These settings control when and how support digests are generated and delivered to users.
                      </p>
                      
                      <div className="space-y-4">
                        <p className="text-muted-foreground text-center py-6">
                          Digest settings will be available in a future update.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>About Support Digests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Support Digests</strong> provide users with personalized summaries of their support interactions and system updates.
                </p>
                
                <div>
                  <h4 className="font-medium mb-1">Digest Types</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ticket Resolution Digests</li>
                    <li>Self-Help Session Digests</li>
                    <li>System Health Digests</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improved user satisfaction</li>
                    <li>Transparent communication</li>
                    <li>Reduced support tickets</li>
                    <li>Proactive system maintenance</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-muted-foreground">
                    Support digests can be automatically sent via email or accessed through the user dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DigestPage;