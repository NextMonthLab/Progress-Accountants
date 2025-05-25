import { useEffect, useState } from 'react';
import { useHealth, HealthIncident, HealthMetric } from '@/contexts/HealthContext';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, FileDown, RefreshCw, Info, AlertCircle, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import SystemHealthWidget from '@/components/admin/SystemHealthWidget';

export default function HealthDashboardPage() {
  const { 
    healthStatus, 
    incidents, 
    isLoadingIncidents,
    resolveIncident,
    metrics,
    isLoadingMetrics,
    updateMetric
  } = useHealth();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Critical</Badge>;
      case 'warning':
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Warning</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><Info className="h-3 w-3" /> Info</Badge>;
    }
  };
  
  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="border-red-500 text-red-500">Active</Badge>;
      case 'acknowledged':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Acknowledged</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Category badge
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'api':
        return <Badge variant="secondary">API</Badge>;
      case 'performance':
        return <Badge variant="secondary">Performance</Badge>;
      case 'security':
        return <Badge variant="secondary">Security</Badge>;
      case 'storage':
        return <Badge variant="secondary">Storage</Badge>;
      default:
        return <Badge variant="secondary">Other</Badge>;
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Handle metric toggle
  const handleMetricToggle = (metric: HealthMetric, enabled: boolean) => {
    updateMetric(metric.id, { enabled });
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  // Sort incidents by detected date (newest first)
  const sortedIncidents = [...(incidents || [])].sort((a, b) => {
    return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
  });
  
  // Group metrics by category
  const metricsByCategory = (metrics || []).reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, HealthMetric[]>);

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">System Health Dashboard</h1>
            <p className="text-gray-500">Proactive monitoring and alerts for system health</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SystemHealthWidget />
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Health Summary</CardTitle>
              <CardDescription>
                Overview of recent system health indicators
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm text-gray-600">Healthy Services</span>
                  <span className="text-2xl font-semibold">
                    {healthStatus ? Object.values(healthStatus.services).filter(s => s.healthy).length : 0}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-sm text-gray-600">Active Incidents</span>
                  <span className="text-2xl font-semibold">
                    {incidents ? incidents.filter(i => i.status === 'active').length : 0}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <ShieldAlert className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm text-gray-600">Monitoring Metrics</span>
                  <span className="text-2xl font-semibold">
                    {metrics ? metrics.filter(m => m.enabled).length : 0}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <FileDown className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-600">Resolved Issues</span>
                  <span className="text-2xl font-semibold">
                    {incidents ? incidents.filter(i => i.status === 'resolved').length : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="incidents" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="metrics">Monitoring Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="incidents" className="p-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Health Incidents</CardTitle>
                <CardDescription>
                  History of detected incidents and their status
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingIncidents ? (
                  <div className="flex justify-center items-center h-24">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : sortedIncidents.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-medium">No incidents detected</p>
                    <p>All systems are operating normally</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Detected</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedIncidents.map(incident => (
                          <TableRow key={incident.id}>
                            <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                            <TableCell>{getStatusBadge(incident.status)}</TableCell>
                            <TableCell>{incident.affectedArea}</TableCell>
                            <TableCell>{formatDate(incident.detectedAt)}</TableCell>
                            <TableCell>{incident.affectedUsers} user{incident.affectedUsers !== 1 ? 's' : ''}</TableCell>
                            <TableCell>
                              {incident.status !== 'resolved' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => resolveIncident(incident.id)}
                                >
                                  Resolve
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="p-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Monitoring Metrics</CardTitle>
                <CardDescription>
                  Configure metrics and thresholds for health monitoring
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingMetrics ? (
                  <div className="flex justify-center items-center h-24">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : Object.keys(metricsByCategory).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                    <p>No monitoring metrics configured</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(metricsByCategory).map(([category, metricsInCategory]) => (
                      <div key={category}>
                        <h3 className="text-md font-medium mb-3 flex items-center">
                          {getCategoryBadge(category)}
                          <span className="ml-2">{category.charAt(0).toUpperCase() + category.slice(1)} Metrics</span>
                        </h3>
                        
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[150px]">Enabled</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {metricsInCategory.map(metric => (
                                <TableRow key={metric.id}>
                                  <TableCell className="font-medium">
                                    {metric.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </TableCell>
                                  <TableCell>{metric.description}</TableCell>
                                  <TableCell>
                                    <Switch 
                                      checked={metric.enabled} 
                                      onCheckedChange={(checked) => handleMetricToggle(metric, checked)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}