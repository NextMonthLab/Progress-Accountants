import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Send, Check, Info, CloudUpload } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * SOT JSON Sender Component
 * Allows manual triggering of SOT sync and management of the sync scheduler
 */
export function SotJsonSender() {
  const { toast } = useToast();
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [schedulerRunning, setSchedulerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch client profile on component mount
  useEffect(() => {
    fetchClientProfile();
    fetchSyncLogs();
  }, []);

  // Fetch client profile from API
  const fetchClientProfile = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('GET', '/api/sot/client-profile/progress-accountants');
      const data = await res.json();
      setClientProfile(data);
    } catch (error) {
      console.error('Error fetching client profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch client profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sync logs from API
  const fetchSyncLogs = async () => {
    try {
      const res = await apiRequest('GET', '/api/sot/sync/logs?limit=20');
      const logs = await res.json();
      setSyncLogs(logs);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch sync logs',
        variant: 'destructive',
      });
    }
  };

  // Manually trigger sync with SOT
  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await apiRequest('POST', '/api/sot/sync/trigger');
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message || 'Sync triggered successfully',
          variant: 'default',
        });
        // Refresh data after successful sync
        fetchClientProfile();
        fetchSyncLogs();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to trigger sync',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger sync with SOT',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Start scheduled sync
  const startScheduler = async () => {
    try {
      const res = await apiRequest('POST', '/api/sot/sync/start-scheduler');
      const data = await res.json();
      
      if (data.success) {
        setSchedulerRunning(true);
        toast({
          title: 'Success',
          description: data.message || 'Scheduler started successfully',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to start scheduler',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error starting scheduler:', error);
      toast({
        title: 'Error',
        description: 'Failed to start sync scheduler',
        variant: 'destructive',
      });
    }
  };

  // Stop scheduled sync
  const stopScheduler = async () => {
    try {
      const res = await apiRequest('POST', '/api/sot/sync/stop-scheduler');
      const data = await res.json();
      
      if (data.success) {
        setSchedulerRunning(false);
        toast({
          title: 'Success',
          description: data.message || 'Scheduler stopped successfully',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to stop scheduler',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop sync scheduler',
        variant: 'destructive',
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CloudUpload className="mr-2 h-5 w-5 text-primary" />
          SOT Client Profile Manager
        </CardTitle>
        <CardDescription>
          Manage client profile synchronization with the Source of Truth system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile Data</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Client Profile</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchClientProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </div>
              
              {clientProfile ? (
                <div className="border rounded-md p-4 bg-secondary/10">
                  <pre className="text-xs overflow-auto max-h-80">
                    {JSON.stringify(clientProfile, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                    <p className="text-muted-foreground">No profile data available</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Sync Logs</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchSyncLogs}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              
              {syncLogs.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {syncLogs.map((log, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{log.eventType}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              log.status === 'success' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm truncate max-w-[200px]">{log.details || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">{formatDate(log.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p className="text-muted-foreground">No sync logs available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduler">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Scheduler Information</AlertTitle>
                <AlertDescription>
                  The scheduler syncs client profile data with the SOT system once every 24 hours.
                  You can manually start or stop the scheduler below.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h4 className="font-medium">Scheduler Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {schedulerRunning ? 'Running' : 'Stopped'}
                  </p>
                </div>
                
                {schedulerRunning ? (
                  <Button variant="destructive" onClick={stopScheduler}>
                    Stop Scheduler
                  </Button>
                ) : (
                  <Button variant="default" onClick={startScheduler}>
                    Start Scheduler
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchClientProfile} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Data
        </Button>
        
        <Button 
          onClick={triggerSync} 
          disabled={isSyncing}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isSyncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Sync Now
        </Button>
      </CardFooter>
    </Card>
  );
}