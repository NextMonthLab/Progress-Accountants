import { useHealth, SystemHealthStatus } from '@/contexts/HealthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SystemHealthWidget() {
  const { healthStatus, isLoadingHealthStatus } = useHealth();
  
  if (isLoadingHealthStatus) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">System Health</CardTitle>
          <CardDescription>Checking system status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // If no health status data is available yet
  if (!healthStatus) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">System Health</CardTitle>
          <CardDescription>System monitoring initializing...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </CardContent>
      </Card>
    );
  }
  
  // Get the appropriate icon and color based on status
  const getStatusIcon = (status: 'healthy' | 'degraded' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: 'healthy' | 'degraded' | 'error') => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="border-green-500 text-green-600">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="secondary" className="bg-amber-500 text-white">Degraded</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get overall status description
  const getOverallStatus = (status: SystemHealthStatus) => {
    switch (status.status) {
      case 'healthy':
        return 'All systems operational';
      case 'degraded':
        return 'Some services experiencing issues';
      case 'error':
        return 'Critical system errors detected';
      default:
        return 'System status unknown';
    }
  };
  
  // Function to format the date
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), 'MMM d, h:mm a');
    } catch (error) {
      return 'Unknown';
    }
  };
  
  // Count the number of healthy services
  const healthyCount = Object.values(healthStatus.services).filter(s => s.healthy).length;
  const totalServices = Object.values(healthStatus.services).length;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">System Health</CardTitle>
            <CardDescription>Current status as of {formatDate(healthStatus.timestamp)}</CardDescription>
          </div>
          {getStatusBadge(healthStatus.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-3 mb-4">
          {getStatusIcon(healthStatus.status)}
          <div>
            <p className="font-medium">{getOverallStatus(healthStatus)}</p>
            <p className="text-sm text-gray-500">
              {healthyCount} of {totalServices} services operational
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(healthStatus.services).map(([key, service]) => (
            <div key={key} className="flex justify-between items-center p-2 rounded-md border">
              <span className="capitalize">{key}</span>
              <span className={service.healthy ? 'text-green-500' : 'text-red-500'}>
                {service.healthy ? 'Healthy' : 'Error'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}