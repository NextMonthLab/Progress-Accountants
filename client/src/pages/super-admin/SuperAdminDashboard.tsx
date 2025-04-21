import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { TenantSwitcherCard } from "@/components/super-admin/TenantSwitcher";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  Database,
  Lock,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SuperAdminDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { can } = usePermissions();
  
  // Only super admins can access this dashboard
  if (!user?.isSuperAdmin) {
    navigate("/");
    return null;
  }
  
  // Fetch system stats
  const { data: systemStats } = useQuery({
    queryKey: ['/api/system/stats'],
    queryFn: getQueryFn(),
  });
  
  // Fetch tenant stats
  const { data: tenantStats } = useQuery({
    queryKey: ['/api/tenants/stats'],
    queryFn: getQueryFn(),
  });
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the Progress platform</p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <ShieldCheck className="w-4 h-4 mr-2" />
            System Check
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {/* Tenant Stats Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tenant Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm">Active Tenants</span>
                </div>
                <Badge>{systemStats?.activeTenants || 0}</Badge>
              </div>
              <Progress 
                value={systemStats?.activeTenants ? (systemStats.activeTenants / systemStats.totalTenants) * 100 : 0} 
                className="h-2" 
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {systemStats?.totalTenants || 0}</span>
                <span>Templates: {systemStats?.templateCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* User Stats Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">User Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm">Active Users</span>
                </div>
                <Badge>{systemStats?.activeUsers || 0}</Badge>
              </div>
              <Progress 
                value={systemStats?.activeUsers ? (systemStats.activeUsers / systemStats.totalUsers) * 100 : 0} 
                className="h-2" 
              />
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Admins: {systemStats?.adminCount || 0}</div>
                <div>Editors: {systemStats?.editorCount || 0}</div>
                <div>Public: {systemStats?.publicCount || 0}</div>
                <div>Super: {systemStats?.superAdminCount || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* System Health Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm">Server Status</span>
                </div>
                <Badge variant={systemStats?.health?.status === 'healthy' ? 'default' : 'destructive'}>
                  {systemStats?.health?.status === 'healthy' ? 'Healthy' : 'Issues'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm">Database: {systemStats?.health?.database ? 'Connected' : 'Error'}</span>
                </div>
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm">API: {systemStats?.health?.api ? 'Operational' : 'Error'}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Uptime: {systemStats?.uptimeFormatted || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Security Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm">Status</span>
                </div>
                <Badge 
                  variant={systemStats?.securityStatus === 'secure' ? 'default' : 'destructive'}
                >
                  {systemStats?.securityStatus === 'secure' ? 'Secure' : 'Action Required'}
                </Badge>
              </div>
              <div className="space-y-2">
                {systemStats?.securityStatus === 'secure' ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">All systems secure</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {systemStats?.securityAlerts?.map((alert: string, index: number) => (
                      <div key={index} className="flex items-center text-destructive">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{alert}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-4">
            <Button size="sm" variant="outline" className="w-full">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Security Audit
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="tenants">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="tenants">Tenant Management</TabsTrigger>
          <TabsTrigger value="system">System Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenants" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <TenantSwitcherCard />
            </div>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Tenant Overview</CardTitle>
                <CardDescription>
                  Monitor tenant health and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Tenant monitoring content will go here */}
                <p className="text-muted-foreground">
                  Detailed tenant metrics and analytics will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>
                  Manage system backups and restore points
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Backup controls will go here */}
                <p className="text-muted-foreground">
                  System backup and restore controls will be displayed here.
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>
                  Schedule and manage maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Maintenance controls will go here */}
                <p className="text-muted-foreground">
                  System maintenance controls will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and permissions across all tenants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User management controls will go here */}
              <p className="text-muted-foreground">
                User management interface will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}