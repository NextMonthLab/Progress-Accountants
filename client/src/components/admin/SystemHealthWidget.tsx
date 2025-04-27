import { useEffect, useState } from 'react';
import { useHealth, SystemHealthStatus } from '@/contexts/HealthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function SystemHealthWidget() {
  const { 
    healthStatus, 
    isLoadingHealthStatus,
    notifications,
    isLoadingNotifications,
    markNotificationDelivered
  } = useHealth();
  
  const [showNotifications, setShowNotifications] = useState(false);

  // Format the last checked time
  const getLastCheckedTime = (timestamp: Date | undefined) => {
    if (!timestamp) return 'Never';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  // Get status badge for a service
  const getStatusBadge = (healthy: boolean) => {
    if (healthy) {
      return <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>;
    }
    return <Badge variant="destructive">Degraded</Badge>;
  };

  // Get overall status badge and icon
  const getOverallStatus = (status: SystemHealthStatus) => {
    if (status.status === 'healthy') {
      return {
        badge: <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>,
        icon: <CheckCircle className="h-6 w-6 text-green-500" />
      };
    } else if (status.status === 'degraded') {
      return {
        badge: <Badge variant="warning">Degraded</Badge>,
        icon: <AlertTriangle className="h-6 w-6 text-amber-500" />
      };
    } else {
      return {
        badge: <Badge variant="destructive">Error</Badge>,
        icon: <AlertTriangle className="h-6 w-6 text-red-500" />
      };
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notificationId: number) => {
    markNotificationDelivered(notificationId);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">System Health</CardTitle>
          {!isLoadingHealthStatus && healthStatus && getOverallStatus(healthStatus).icon}
        </div>
        <CardDescription>
          Real-time monitoring of critical system components
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoadingHealthStatus ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : !healthStatus ? (
          <div className="text-center text-gray-500 py-4">
            <p>Health status unavailable</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Overall Status:</span>
              {getOverallStatus(healthStatus).badge}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between items-center border rounded p-2">
                <span>API Services</span>
                {getStatusBadge(healthStatus.services.api.healthy)}
              </div>
              
              <div className="flex justify-between items-center border rounded p-2">
                <span>Database</span>
                {getStatusBadge(healthStatus.services.database.healthy)}
              </div>
              
              <div className="flex justify-between items-center border rounded p-2">
                <span>File Storage</span>
                {getStatusBadge(healthStatus.services.fileStorage.healthy)}
              </div>
              
              <div className="flex justify-between items-center border rounded p-2">
                <span>Authentication</span>
                {getStatusBadge(healthStatus.services.auth.healthy)}
              </div>
            </div>
            
            {/* Last checked timestamp */}
            <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last checked: {getLastCheckedTime(healthStatus.timestamp)}</span>
            </div>
            
            {/* Notifications section */}
            {notifications && notifications.length > 0 && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-1"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>{notifications.length} Notification{notifications.length !== 1 ? 's' : ''}</span>
                </Button>
                
                {showNotifications && (
                  <div className="mt-2 space-y-2 max-h-36 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`text-xs p-2 rounded border cursor-pointer hover:bg-accent
                          ${notification.severity === 'critical' ? 'border-red-200 bg-red-50' : 
                            notification.severity === 'warning' ? 'border-amber-200 bg-amber-50' : 
                            'border-blue-200 bg-blue-50'}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="font-medium">{notification.affectedArea}</div>
                        <div>{notification.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {!isLoadingHealthStatus && healthStatus && (
        <CardFooter className="pt-0 pb-2 flex justify-between text-xs text-gray-500">
          <span>Automated monitoring active</span>
        </CardFooter>
      )}
    </Card>
  );
}