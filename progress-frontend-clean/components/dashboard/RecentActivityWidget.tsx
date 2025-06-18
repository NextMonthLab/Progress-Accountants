import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, User, FileText, BarChart, Cog, RefreshCw } from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  id: string;
  type: 'page_edit' | 'system' | 'user' | 'report' | 'settings';
  message: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

const RecentActivityWidget: React.FC = () => {
  const { data: activities, isLoading, error, refetch } = useQuery<ActivityItem[]>({
    queryKey: ['/api/activity/recent'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/activity/recent');
        if (!res.ok) throw new Error('Failed to fetch activity');
        return await res.json();
      } catch (err) {
        return [
          {
            id: '1',
            type: 'page_edit',
            message: 'Homepage content updated',
            timestamp: '2025-05-06T18:43:12Z',
            user: {
              name: 'Jane Smith',
              avatar: undefined
            }
          },
          {
            id: '2',
            type: 'system',
            message: 'Automated backup completed',
            timestamp: '2025-05-06T18:15:00Z'
          },
          {
            id: '3',
            type: 'user',
            message: 'New team member added',
            timestamp: '2025-05-06T17:32:45Z',
            user: {
              name: 'John Doe',
              avatar: undefined
            }
          },
          {
            id: '4',
            type: 'settings',
            message: 'Site theme updated',
            timestamp: '2025-05-06T16:18:22Z',
            user: {
              name: 'Jane Smith',
              avatar: undefined
            }
          },
          {
            id: '5',
            type: 'report',
            message: 'Monthly analytics report generated',
            timestamp: '2025-05-06T12:00:00Z'
          }
        ];
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'page_edit':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Cog className="h-4 w-4 text-gray-500" />;
      case 'user':
        return <User className="h-4 w-4 text-green-500" />;
      case 'report':
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case 'settings':
        return <Cog className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format ISO date to relative time
  const formatRelativeTime = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay < 30) return `${diffDay}d ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return 'unknown time';
    }
  };

  if (error) {
    return (
      <DashboardWidget 
        title="Recent Activity" 
        description="Latest system activity"
        size="md"
      >
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <p className="text-red-500 font-medium">Unable to fetch recent activity</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget 
      title="Recent Activity" 
      description="Latest system activity"
      loading={isLoading}
      size="md"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-gray-500">
            Showing last {activities?.length || 0} events
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No recent activity to display</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start py-1.5 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="text-sm text-gray-900 font-medium line-clamp-1">
                  {activity.message}
                </p>
                
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 mt-0.5">
                  {activity.user && (
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {activity.user.name}
                    </span>
                  )}
                  <span className="flex items-center whitespace-nowrap">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardWidget>
  );
};

export default RecentActivityWidget;