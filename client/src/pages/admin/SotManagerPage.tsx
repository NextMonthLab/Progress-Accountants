import { useState, useEffect } from 'react';
import SotJsonSender from '@/components/admin/SotJsonSender';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

// Define SOT Declaration type
type SotDeclaration = {
  id: number;
  instanceId: string;
  instanceType: string;
  blueprintVersion: string;
  toolsSupported: string[];
  callbackUrl: string;
  status: string;
  isTemplate: boolean;
  isCloneable: boolean;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
};

// Define SOT Metrics type
type SotMetrics = {
  id: number;
  totalPages: number;
  installedTools: string[];
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
};

// Define SOT Sync Log type
type SotSyncLog = {
  id: number;
  eventType: string;
  status: string;
  details?: string;
  createdAt: string;
};

export default function SotManagerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [declaration, setDeclaration] = useState<SotDeclaration | null>(null);
  const [metrics, setMetrics] = useState<SotMetrics | null>(null);
  const [syncLogs, setSyncLogs] = useState<SotSyncLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingData, setSyncingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch SOT data on initial load
  useEffect(() => {
    fetchSotData();
  }, []);

  // Check if user is authorized (super admin)
  const isAuthorized = user && user.role === 'superadmin';

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Fetch SOT data from API endpoints
  const fetchSotData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch declaration
      const declarationRes = await apiRequest('GET', '/api/sot/declaration');
      
      if (declarationRes.ok) {
        const declarationData = await declarationRes.json();
        setDeclaration(declarationData);
      }
      
      // Fetch metrics
      const metricsRes = await apiRequest('GET', '/api/sot/metrics');
      
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
      
      // Fetch sync logs
      const syncLogsRes = await apiRequest('GET', '/api/sot/logs');
      
      if (syncLogsRes.ok) {
        const syncLogsData = await syncLogsRes.json();
        setSyncLogs(syncLogsData);
      }
    } catch (err: any) {
      setError('Failed to fetch SOT data: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch SOT data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger a sync with SOT
  const triggerSync = async () => {
    setSyncingData(true);
    
    try {
      const response = await apiRequest('POST', '/api/sot/sync', {});
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Successfully synced with SOT',
          variant: 'default',
        });
        
        // Refresh data after sync
        fetchSotData();
      } else {
        throw new Error(data.error || 'Failed to sync with SOT');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to sync with SOT',
        variant: 'destructive',
      });
    } finally {
      setSyncingData(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the SOT Manager. This feature is restricted to super admins only.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy">SOT Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage your Source of Truth (SOT) integration and synchronization
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          onClick={fetchSotData}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="current">Current State</TabsTrigger>
              <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Declaration Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy">
                      <Database className="h-5 w-5 mr-2" />
                      SOT Declaration
                    </CardTitle>
                    <CardDescription>Your instance's registration with SOT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    ) : declaration ? (
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Instance ID:</span> {declaration.instanceId}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {declaration.instanceType}
                        </div>
                        <div>
                          <span className="font-medium">Blueprint:</span> {declaration.blueprintVersion}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>{' '}
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              declaration.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : declaration.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {declaration.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Last Sync:</span> {formatDate(declaration.lastSyncAt)}
                        </div>
                        <div>
                          <span className="font-medium">Is Template:</span> {declaration.isTemplate ? 'Yes' : 'No'}
                        </div>
                        <div>
                          <span className="font-medium">Is Cloneable:</span> {declaration.isCloneable ? 'Yes' : 'No'}
                        </div>
                        <div>
                          <span className="font-medium">Tools:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {declaration.toolsSupported.map((tool, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>No Declaration Found</AlertTitle>
                        <AlertDescription>
                          Use the SOT JSON Sender to create a declaration.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Metrics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy">
                      <Database className="h-5 w-5 mr-2" />
                      SOT Metrics
                    </CardTitle>
                    <CardDescription>Usage metrics reported to SOT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    ) : metrics ? (
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Total Pages:</span> {metrics.totalPages}
                        </div>
                        <div>
                          <span className="font-medium">Last Sync:</span> {formatDate(metrics.lastSyncAt)}
                        </div>
                        <div>
                          <span className="font-medium">Installed Tools:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {metrics.installedTools?.map((tool, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>No Metrics Found</AlertTitle>
                        <AlertDescription>
                          Use the SOT JSON Sender to create metrics or trigger a sync.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Sync Logs</CardTitle>
                  <CardDescription>History of synchronization with SOT</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  ) : syncLogs.length > 0 ? (
                    <div className="space-y-4">
                      {syncLogs.map((log) => (
                        <div 
                          key={log.id} 
                          className="p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">{log.eventType}</span>
                              <span 
                                className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  log.status === 'success' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {log.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(log.createdAt)}
                            </div>
                          </div>
                          {log.details && (
                            <div className="mt-2 text-sm text-gray-600">
                              {log.details}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>No Sync Logs Found</AlertTitle>
                      <AlertDescription>
                        There are no synchronization logs available yet.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              onClick={triggerSync}
              disabled={syncingData || loading}
              className="w-full bg-navy hover:bg-navy/90"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${syncingData ? 'animate-spin' : ''}`} />
              {syncingData ? 'Syncing...' : 'Trigger SOT Sync'}
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <SotJsonSender />
        </div>
      </div>
    </div>
  );
}