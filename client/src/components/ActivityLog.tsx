import React from 'react';
import { 
  Eye, 
  FileUp, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  File, 
  FileDown, 
  LogIn, 
  PenTool,
  Plus,
  Trash
} from 'lucide-react';
import { ActivityLogEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ActivityLogProps {
  logs: ActivityLogEntry[];
  maxHeight?: string;
  title?: string;
  showEmpty?: boolean;
  maxItems?: number;
  filter?: {
    userType?: 'staff' | 'client';
    actionType?: ActivityLogEntry['actionType'][];
    entityType?: ActivityLogEntry['entityType'][];
  };
}

export default function ActivityLog({ 
  logs, 
  maxHeight = '400px', 
  title = 'Activity Log',
  showEmpty = true,
  maxItems = 50,
  filter
}: ActivityLogProps) {
  // Apply filters if provided
  let filteredLogs = [...logs];
  
  if (filter) {
    if (filter.userType) {
      filteredLogs = filteredLogs.filter(log => log.userType === filter.userType);
    }
    
    if (filter.actionType && filter.actionType.length > 0) {
      filteredLogs = filteredLogs.filter(log => filter.actionType!.includes(log.actionType));
    }
    
    if (filter.entityType && filter.entityType.length > 0) {
      filteredLogs = filteredLogs.filter(log => filter.entityType!.includes(log.entityType));
    }
  }
  
  // Sort by timestamp (most recent first) and limit to maxItems
  const sortedLogs = filteredLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxItems);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get icon for activity type
  const getActivityIcon = (log: ActivityLogEntry) => {
    const iconProps = { className: 'h-4 w-4 mr-2' };
    
    switch(log.actionType) {
      case 'view':
        return <Eye {...iconProps} />;
      case 'create':
        return <Plus {...iconProps} />;
      case 'update':
        return <PenTool {...iconProps} />;
      case 'delete':
        return <Trash {...iconProps} />;
      case 'upload':
        return <FileUp {...iconProps} />;
      case 'download':
        return <FileDown {...iconProps} />;
      case 'message':
        return <MessageSquare {...iconProps} />;
      case 'complete':
        return <CheckCircle {...iconProps} />;
      case 'login':
        return <LogIn {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };
  
  // Get color for action type
  const getActionColor = (actionType: ActivityLogEntry['actionType']) => {
    switch(actionType) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'upload':
        return 'bg-purple-100 text-purple-800';
      case 'download':
        return 'bg-indigo-100 text-indigo-800';
      case 'message':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-emerald-100 text-emerald-800';
      case 'view':
        return 'bg-gray-100 text-gray-800';
      case 'login':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg" style={{ color: 'var(--navy)' }}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedLogs.length === 0 && showEmpty ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No activity has been recorded yet</p>
          </div>
        ) : (
          <ScrollArea className={`pr-4 ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
            <div className="space-y-3">
              {sortedLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      {getActivityIcon(log)}
                      <span className="font-medium">{log.description}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getActionColor(log.actionType)}
                    >
                      {log.actionType}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>
                      {log.userType === 'staff' ? 'Staff' : 'Client'} 
                    </span>
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}