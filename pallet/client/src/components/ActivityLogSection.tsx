import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityLog from '@/components/ActivityLog';
import { useClientDashboard } from '@/hooks/use-client-dashboard';
import { useCrm } from '@/hooks/use-crm';
import { Loader2 } from 'lucide-react';

interface ActivityLogSectionProps {
  mode: 'client' | 'crm';
  clientId?: number;
  title?: string;
  maxHeight?: string;
}

export default function ActivityLogSection({ 
  mode, 
  clientId,
  title = 'Activity Log',
  maxHeight = '400px'
}: ActivityLogSectionProps) {
  // For client dashboard
  const {
    activityLog: clientActivityLog,
    isActivityLogLoading: isClientActivityLogLoading
  } = useClientDashboard(clientId);
  
  // For CRM dashboard
  const { useActivityLog } = useCrm();
  const {
    activityLog: crmActivityLog,
    isLoading: isCrmActivityLogLoading
  } = useActivityLog(clientId);
  
  const isLoading = mode === 'client' ? isClientActivityLogLoading : isCrmActivityLogLoading;
  const activityLog = mode === 'client' ? clientActivityLog : crmActivityLog;
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg" style={{ color: 'var(--navy)' }}>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (!activityLog || activityLog.length === 0) {
    return (
      <ActivityLog 
        logs={[]} 
        title={title} 
        maxHeight={maxHeight} 
        showEmpty={true}
      />
    );
  }
  
  // If in client mode, show only client-specific activity
  if (mode === 'client') {
    return (
      <ActivityLog 
        logs={activityLog} 
        title={title} 
        maxHeight={maxHeight}
        filter={{ userType: 'client' }}
      />
    );
  }
  
  // If in CRM mode, provide tabs to filter activity by type
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg" style={{ color: 'var(--navy)' }}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ActivityLog 
              logs={activityLog} 
              maxHeight={maxHeight}
              showEmpty={false}
              title=""
            />
          </TabsContent>
          
          <TabsContent value="client">
            <ActivityLog 
              logs={activityLog} 
              maxHeight={maxHeight}
              showEmpty={false}
              title=""
              filter={{ userType: 'client' }}
            />
          </TabsContent>
          
          <TabsContent value="staff">
            <ActivityLog 
              logs={activityLog} 
              maxHeight={maxHeight}
              showEmpty={false}
              title=""
              filter={{ userType: 'staff' }}
            />
          </TabsContent>
          
          <TabsContent value="system">
            <ActivityLog 
              logs={activityLog} 
              maxHeight={maxHeight}
              showEmpty={false}
              title=""
              filter={{ entityType: ['system'] }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}