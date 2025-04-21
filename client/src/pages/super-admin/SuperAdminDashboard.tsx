import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getQueryFn } from '@/lib/queryClient';
import { Separator } from '@/components/ui/separator';
import { TenantSwitcherCard } from '@/components/super-admin/TenantSwitcher';
import { usePermissions } from '@/hooks/use-permissions';
import { useLocation, navigate } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Monitor,
  BarChart3,
  Layers,
  ShieldAlert,
  Building2,
  Users,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  LoaderCircle,
  Bolt,
  Lock
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { can, hasRole } = usePermissions();
  
  // Redirect if not a super admin
  useEffect(() => {
    if (!hasRole('super_admin') && !can('manage_tenants')) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the Super Admin Dashboard',
        variant: 'destructive',
      });
      setLocation('/');
    }
  }, [hasRole, can, setLocation, toast]);
  
  // Fetch system status
  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/system/status'],
    queryFn: getQueryFn(),
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch tenants overview
  const { data: tenantsOverview, isLoading: tenantsLoading } = useQuery({
    queryKey: ['/api/tenants/overview'],
    queryFn: getQueryFn(),
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all tenants, system health, and global settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="py-1">
            <Bolt className="w-4 h-4 mr-1 text-amber-500" />
            Super Admin
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tenants">Tenant Management</TabsTrigger>
          <TabsTrigger value="vault">Vault Integration</TabsTrigger>
          <TabsTrigger value="system">System Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                  Active Tenants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tenantsLoading ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    tenantsOverview?.activeTenants || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tenantsLoading ? 'Loading...' : `${tenantsOverview?.totalTenants || 0} total tenants`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2 text-indigo-500" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statusLoading ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    systemStatus?.activeUsers || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statusLoading ? 'Loading...' : 'Logged in past 24h'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Monitor className="w-4 h-4 mr-2 text-emerald-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {statusLoading ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : systemStatus?.health === 'healthy' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                      <span>Good</span>
                    </>
                  ) : systemStatus?.health === 'warning' ? (
                    <>
                      <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                      <span>Warning</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                      <span>Alert</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statusLoading ? 'Loading...' : systemStatus?.uptimeFormatted || 'Unknown uptime'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-purple-500" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {statusLoading ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : systemStatus?.securityStatus === 'secure' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                      <span>Secure</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 mr-2 text-red-500" />
                      <span>Issues</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {statusLoading 
                    ? 'Loading...' 
                    : systemStatus?.securityStatus === 'secure'
                    ? 'All systems secure'
                    : `${systemStatus?.securityAlerts || 0} security alerts`
                  }
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>System Health Monitoring</CardTitle>
                  <CardDescription>
                    Real-time status of all essential system components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">API Services</span>
                          </div>
                          <Badge variant="outline">Operational</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          100% uptime in past 24h
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">Database</span>
                          </div>
                          <Badge variant="outline">Operational</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          99.9% uptime in past 24h
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium">Vault Integration</span>
                          </div>
                          <Badge variant="outline" className="text-amber-500 border-amber-200">Degraded</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          95.4% uptime in past 24h
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Alerts</h4>
                      <ScrollArea className="h-[180px]">
                        <div className="space-y-3 pr-4">
                          <div className="p-2 border border-amber-200 bg-amber-50 rounded-md">
                            <div className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Slow Vault Response Times</p>
                                <p className="text-xs text-muted-foreground">
                                  Response times from Vault are higher than normal (320ms vs 150ms avg)
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                              <Button variant="outline" size="sm" className="h-7">
                                Investigate
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-2 border border-gray-200 rounded-md">
                            <div className="flex items-start">
                              <ShieldAlert className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Failed Login Attempts</p>
                                <p className="text-xs text-muted-foreground">
                                  5 failed login attempts detected from IP 203.0.113.42
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">8 hours ago</span>
                              <Button variant="outline" size="sm" className="h-7">
                                Review
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-2 border border-green-200 bg-green-50 rounded-md">
                            <div className="flex items-start">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Database Performance Improved</p>
                                <p className="text-xs text-muted-foreground">
                                  Average query time reduced by 35% after optimization
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">12 hours ago</span>
                              <Button variant="outline" size="sm" className="h-7">
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1">
              <TenantSwitcherCard />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Management</CardTitle>
              <CardDescription>
                Create and manage tenants across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tenant management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vault">
          <Card>
            <CardHeader>
              <CardTitle>Vault Integration</CardTitle>
              <CardDescription>
                Manage data synchronization with the Vault system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Vault integration interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Manage global system settings and security options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>System configuration interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}