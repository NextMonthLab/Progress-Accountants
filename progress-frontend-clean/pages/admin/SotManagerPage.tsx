import React from 'react';
import SotJsonSender from '@/components/admin/SotJsonSender';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, RefreshCw, DatabaseIcon, ServerIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

/**
 * SOT Manager Page
 * Admin interface for managing SOT (Source of Truth) declarations and sync operations
 */
export default function SotManagerPage() {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Get SOT metrics
  const {
    data: metricsData,
    isLoading: isLoadingMetrics,
    error: metricsError
  } = useQuery({
    queryKey: ['/api/sot/metrics'],
    queryFn: getQueryFn(),
    refetchInterval: 60000 // Refetch every minute
  });
  
  const metrics = metricsData?.metrics || {
    totalDeclarations: 0,
    totalProfiles: 0,
    totalSyncs: 0,
    lastSyncTimestamp: null
  };
  
  const renderTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMin = Math.floor(diffInMs / 60000);
      const diffInHours = Math.floor(diffInMin / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      
      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInMin > 0) {
        return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <AdminLayout title="SOT Manager" showBackButton>
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Source of Truth Manager
          </h2>
          <p className="text-muted-foreground">
            Manage your instance's connection to the NextMonth Source of Truth system.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manager">SOT Manager</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Declarations
                  </CardTitle>
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalDeclarations}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered instances in SOT
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Client Profiles
                  </CardTitle>
                  <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalProfiles}</div>
                  <p className="text-xs text-muted-foreground">
                    Synchronized client profiles
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Syncs
                  </CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalSyncs}</div>
                  <p className="text-xs text-muted-foreground">
                    Successful synchronizations
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Last Sync
                  </CardTitle>
                  <Badge 
                    variant={!metrics.lastSyncTimestamp ? "outline" : "default"}
                    className={!metrics.lastSyncTimestamp ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""}
                  >
                    {!metrics.lastSyncTimestamp ? "Never" : "Synced"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {renderTimeAgo(metrics.lastSyncTimestamp)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.lastSyncTimestamp 
                      ? new Date(metrics.lastSyncTimestamp).toLocaleString() 
                      : "No sync performed yet"}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>What is SOT?</CardTitle>
                  <CardDescription>
                    Learn about the NextMonth Source of Truth system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>Source of Truth (SOT)</strong> is NextMonth's central system for managing and synchronizing client data across multiple instances.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Benefits:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Central management of client instances</li>
                      <li>Automated monitoring and health checks</li>
                      <li>Blueprint version tracking</li>
                      <li>Template and clone management</li>
                      <li>Cross-platform tool integration</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Quick steps to set up your SOT integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Register your instance</strong>
                      <p className="text-sm text-muted-foreground">
                        Create a declaration in the SOT Manager tab with your unique identifier and callback URL.
                      </p>
                    </li>
                    <li>
                      <strong>Configure sync schedule</strong>
                      <p className="text-sm text-muted-foreground">
                        Set up when your instance should synchronize with the SOT system (daily is recommended).
                      </p>
                    </li>
                    <li>
                      <strong>Test your connection</strong>
                      <p className="text-sm text-muted-foreground">
                        Trigger a manual sync to ensure everything is working properly.
                      </p>
                    </li>
                    <li>
                      <strong>Monitor sync status</strong>
                      <p className="text-sm text-muted-foreground">
                        Check the logs to ensure your syncs are running successfully.
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                The SOT system is constantly evolving. Please check the documentation tab for the latest updates and best practices.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="manager">
            <SotJsonSender />
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SOT Integration Documentation</CardTitle>
                <CardDescription>
                  Comprehensive guide for working with the NextMonth SOT system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Declaration API</h3>
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">
                    <div className="mb-2 text-muted-foreground">Endpoint:</div>
                    <div>POST /api/sot/declarations</div>
                    <div className="mt-2 text-muted-foreground">Payload:</div>
                    <pre className="text-xs overflow-auto">
{`{
  "instanceId": "string",
  "instanceType": "string",
  "blueprintVersion": "string",
  "toolsSupported": ["string"],
  "callbackUrl": "string"
}`}
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sync API</h3>
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">
                    <div className="mb-2 text-muted-foreground">Endpoint:</div>
                    <div>POST /api/sot/sync</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Client Profile Format</h3>
                  <div className="rounded-md bg-muted p-4 font-mono text-sm">
                    <pre className="text-xs overflow-auto">
{`{
  "businessId": "string",
  "businessName": "string",
  "businessType": "string",
  "industry": "string",
  "description": "string",
  "location": {
    "city": "string",
    "country": "string"
  },
  "metrics": {
    "totalPages": number,
    "totalUsers": number,
    "totalTools": number
  },
  "features": {
    "hasCustomBranding": boolean,
    "hasPublishedPages": boolean,
    "hasCRM": boolean,
    "hasAnalytics": boolean
  },
  "dateOnboarded": "string",
  "lastSync": "string"
}`}
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Best Practices</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Unique Instance IDs</strong>
                      <p className="text-sm text-muted-foreground">Ensure your instance ID is unique to avoid conflicts with other instances.</p>
                    </li>
                    <li>
                      <strong>Reliable Callback URLs</strong>
                      <p className="text-sm text-muted-foreground">Use a stable, accessible URL for callbacks from the SOT system.</p>
                    </li>
                    <li>
                      <strong>Regular Syncs</strong>
                      <p className="text-sm text-muted-foreground">Schedule syncs to run at least once per day, preferably during off-peak hours.</p>
                    </li>
                    <li>
                      <strong>Error Handling</strong>
                      <p className="text-sm text-muted-foreground">Implement proper error handling for sync operations and monitor the logs regularly.</p>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}