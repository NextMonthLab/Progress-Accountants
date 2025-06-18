import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface SotStatusIndicatorProps {
  className?: string;
}

export interface SotStatus {
  lastSync?: Date | string;
  nextSyncDue?: Date | string;
  status: 'ok' | 'warning' | 'error' | 'unknown';
  clientId: string;
}

export function SotStatusIndicator({ className }: SotStatusIndicatorProps) {
  const [status, setStatus] = useState<SotStatus>({
    status: 'unknown',
    clientId: '00000000-0000-0000-0000-000000000000'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSotStatus();
    
    // Check every 30 minutes
    const interval = setInterval(checkSotStatus, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkSotStatus = async () => {
    try {
      // Try to get SOT declaration first to see if system is configured
      const response = await fetch('/api/sot/declaration');
      
      if (response.status === 404) {
        setStatus({
          status: 'warning',
          clientId: '00000000-0000-0000-0000-000000000000'
        });
        return;
      }
      
      // Check if client is already checked in
      const lastSyncResponse = await fetch('/api/sot/logs?limit=1');
      const logs = await lastSyncResponse.json();
      
      if (logs && logs.length > 0) {
        const lastSync = new Date(logs[0].createdAt);
        const nextSyncDue = new Date(lastSync);
        nextSyncDue.setHours(nextSyncDue.getHours() + 24); // Assuming 24-hour sync interval
        
        setStatus({
          lastSync,
          nextSyncDue,
          status: 'ok',
          clientId: '00000000-0000-0000-0000-000000000000'
        });
      } else {
        setStatus({
          status: 'warning',
          clientId: '00000000-0000-0000-0000-000000000000'
        });
      }
    } catch (error) {
      console.error('Error checking SOT status:', error);
      setStatus({
        status: 'error',
        clientId: '00000000-0000-0000-0000-000000000000'
      });
    }
  };

  const triggerManualSync = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sot/client-check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: '00000000-0000-0000-0000-000000000000',
          status: 'active',
          version: '1.0.0',
          metrics: {
            totalPages: 10,
            installedTools: [
              'page_builder',
              'seo_optimizer',
              'business_identity_manager',
              'brand_guidelines',
              'media_library',
              'user_management',
              'companion_assistant'
            ]
          }
        })
      });
      
      if (response.ok) {
        setStatus({
          lastSync: new Date(),
          nextSyncDue: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'ok',
          clientId: '00000000-0000-0000-0000-000000000000'
        });
      } else {
        setStatus({
          status: 'error',
          clientId: '00000000-0000-0000-0000-000000000000'
        });
      }
    } catch (error) {
      console.error('Error during client check-in:', error);
      setStatus({
        status: 'error',
        clientId: '00000000-0000-0000-0000-000000000000'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={
              status.status === 'ok' ? 'secondary' :
              status.status === 'warning' ? 'outline' :
              status.status === 'error' ? 'destructive' : 'outline'
            }>
              {status.status === 'ok' && (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              )}
              {status.status === 'warning' && (
                <Clock className="h-3.5 w-3.5 mr-1" />
              )}
              {status.status === 'error' && (
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
              )}
              SOT {status.status === 'ok' ? 'Synced' : 'Check-in Required'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {status.status === 'ok' ? (
              <div>
                <p>Last Sync: {new Date(status.lastSync!).toLocaleString()}</p>
                <p>Next Sync: {new Date(status.nextSyncDue!).toLocaleString()}</p>
              </div>
            ) : (
              <p>Client needs to check in with SOT system</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {(status.status === 'warning' || status.status === 'error') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={triggerManualSync} 
          disabled={loading}
          className="text-xs h-8"
        >
          {loading ? 'Syncing...' : 'Sync Now'}
        </Button>
      )}
    </div>
  );
}