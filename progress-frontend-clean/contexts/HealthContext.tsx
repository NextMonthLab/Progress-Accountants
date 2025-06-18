import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the health status types
export type ServiceHealth = {
  healthy: boolean;
  latency?: number;
  message?: string;
  lastChecked?: Date;
};

export type SystemHealthStatus = {
  status: 'healthy' | 'degraded' | 'error';
  services: Record<string, ServiceHealth>;
  timestamp: Date;
  message?: string;
};

export type HealthMetric = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  threshold: {
    warning: number;
    critical: number;
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type HealthIncident = {
  id?: number;
  metricId: number;
  status: string;
  severity: string;
  affectedArea: string;
  affectedUsers: number;
  details: any;
  detectedAt: Date;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type HealthNotification = {
  id?: number;
  incidentId: number;
  type: string;
  status: string;
  message: string;
  affectedArea: string;
  severity: string;
  createdAt: Date;
};

export type MetricData = {
  id: number;
  name: string;
  category: string;
  value: number;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
};

export type HealthPerformanceData = {
  apiResponseTimes: { timestamp: Date; value: number }[];
  pageLoadTimes: { timestamp: Date; value: number }[];
  memoryUsage: { timestamp: Date; value: number }[];
  errorRates: { timestamp: Date; value: number }[];
};

// Define the context type
type HealthContextType = {
  healthStatus: SystemHealthStatus | null;
  isLoadingHealthStatus: boolean;
  healthMetrics: HealthMetric[];
  isLoadingMetrics: boolean;
  incidents: HealthIncident[];
  isLoadingIncidents: boolean;
  notifications: HealthNotification[];
  isLoadingNotifications: boolean;
  performanceData: HealthPerformanceData | null;
  isLoadingPerformanceData: boolean;
  refreshHealthStatus: () => void;
  acknowledgeIncident: (incidentId: number) => void;
  resolveIncident: (incidentId: number) => void;
  dismissNotification: (notificationId: number) => void;
  trackMetric: (metricName: string, value: number) => void;
  enableMetric: (metricId: number, enabled: boolean) => void;
};

// Create the context
const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Create the provider component
export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  // Fetch current system health status
  const {
    data: healthStatus,
    isLoading: isLoadingHealthStatus,
    refetch: refetchHealthStatus,
  } = useQuery<SystemHealthStatus>({
    queryKey: ['/api/health/status'],
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 3,
  });
  
  // Fetch health metrics
  const {
    data: healthMetrics = [],
    isLoading: isLoadingMetrics,
  } = useQuery<HealthMetric[]>({
    queryKey: ['/api/health/metrics'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });
  
  // Fetch active incidents
  const {
    data: incidents = [],
    isLoading: isLoadingIncidents,
    refetch: refetchIncidents,
  } = useQuery<HealthIncident[]>({
    queryKey: ['/api/health/incidents'],
    refetchInterval: 120000, // Refetch every 2 minutes
  });
  
  // Fetch notifications
  const {
    data: notifications = [],
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useQuery<HealthNotification[]>({
    queryKey: ['/api/health/notifications'],
    refetchInterval: 120000, // Refetch every 2 minutes
  });
  
  // Fetch performance data
  const {
    data: performanceData = null,
    isLoading: isLoadingPerformanceData,
  } = useQuery<HealthPerformanceData | null>({
    queryKey: ['/api/health/performance'],
    refetchInterval: 300000, // Refetch every 5 minutes
    enabled: false, // Disabled by default, will be enabled when needed
  });
  
  // Mutation to acknowledge an incident
  const acknowledgeMutation = useMutation({
    mutationFn: async (incidentId: number) => {
      const response = await fetch(`/api/health/incidents/${incidentId}/acknowledge`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to acknowledge incident');
      }
      
      return response.json();
    },
    onSuccess: () => {
      refetchIncidents();
      refetchNotifications();
      toast({
        title: 'Incident acknowledged',
        description: 'The incident has been acknowledged',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to acknowledge incident',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Mutation to resolve an incident
  const resolveMutation = useMutation({
    mutationFn: async (incidentId: number) => {
      const response = await fetch(`/api/health/incidents/${incidentId}/resolve`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to resolve incident');
      }
      
      return response.json();
    },
    onSuccess: () => {
      refetchIncidents();
      refetchNotifications();
      toast({
        title: 'Incident resolved',
        description: 'The incident has been marked as resolved',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to resolve incident',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Mutation to dismiss a notification
  const dismissMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/health/notifications/${notificationId}/dismiss`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to dismiss notification');
      }
      
      return response.json();
    },
    onSuccess: () => {
      refetchNotifications();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to dismiss notification',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Metric batching state
  const [metricBatch, setMetricBatch] = useState<{name: string, value: number}[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const batchSizeLimit = 10;
  const batchTimeMs = 30000; // 30 seconds

  // Enhanced mutation to track metric - with batching support
  const trackMetricMutation = useMutation({
    mutationFn: async ({ name, value }: { name: string; value: number }) => {
      // Add to batch
      setMetricBatch(prev => [...prev, { name, value }]);
      
      // Log for transparency
      console.debug(`[Health] Added to batch: ${name}: ${value}`);
      
      // We always return success immediately
      return { success: true };
    },
  });
  
  // Mutation to send batch of metrics
  const sendMetricBatchMutation = useMutation({
    mutationFn: async (metrics: {name: string, value: number}[]) => {
      const response = await fetch('/api/health/metrics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send metric batch');
      }
      
      return response.json();
    },
  });
  
  // Process metric batches
  useEffect(() => {
    // Only process if we have metrics and no timer is set
    if (metricBatch.length > 0 && !batchTimerRef.current) {
      // If we've reached the size limit, send immediately
      if (metricBatch.length >= batchSizeLimit) {
        sendMetricBatchMutation.mutate([...metricBatch]);
        setMetricBatch([]);
        return;
      }
      
      // Otherwise set a timer to send after delay
      batchTimerRef.current = setTimeout(() => {
        if (metricBatch.length > 0) {
          sendMetricBatchMutation.mutate([...metricBatch]);
          setMetricBatch([]);
        }
        batchTimerRef.current = null;
      }, batchTimeMs);
    }
    
    // Clean up timer on unmount
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
        batchTimerRef.current = null;
      }
    };
  }, [metricBatch, sendMetricBatchMutation]);
  
  // Mutation to enable/disable a metric
  const toggleMetricMutation = useMutation({
    mutationFn: async ({ metricId, enabled }: { metricId: number; enabled: boolean }) => {
      const response = await fetch(`/api/health/metrics/${metricId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update metric');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health/metrics'] });
      toast({
        title: 'Metric updated',
        description: 'The metric status has been updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update metric',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Function to refresh health status
  const refreshHealthStatus = () => {
    refetchHealthStatus();
  };
  
  // Function to acknowledge an incident
  const acknowledgeIncident = (incidentId: number) => {
    acknowledgeMutation.mutate(incidentId);
  };
  
  // Function to resolve an incident
  const resolveIncident = (incidentId: number) => {
    resolveMutation.mutate(incidentId);
  };
  
  // Function to dismiss a notification
  const dismissNotification = (notificationId: number) => {
    dismissMutation.mutate(notificationId);
  };
  
  // Function to track a metric
  const trackMetric = (metricName: string, value: number) => {
    trackMetricMutation.mutate({ name: metricName, value });
  };
  
  // Function to enable/disable a metric
  const enableMetric = (metricId: number, enabled: boolean) => {
    toggleMetricMutation.mutate({ metricId, enabled });
  };
  
  // Show toast notification when new incidents are detected
  useEffect(() => {
    if (incidents && incidents.length > 0) {
      const activeIncidents = incidents.filter(incident => incident.status === 'active');
      if (activeIncidents.length > 0) {
        // Show toast only for new incidents (those without an ID yet)
        const newIncidents = activeIncidents.filter(incident => !incident.id);
        if (newIncidents.length > 0) {
          toast({
            title: `${newIncidents.length} new system ${newIncidents.length === 1 ? 'issue' : 'issues'} detected`,
            description: 'Check the Health Dashboard for details',
            variant: 'destructive',
          });
        }
      }
    }
  }, [incidents, toast]);
  
  // Provide the context value
  const contextValue: HealthContextType = {
    healthStatus: healthStatus || null,
    isLoadingHealthStatus,
    healthMetrics,
    isLoadingMetrics,
    incidents,
    isLoadingIncidents,
    notifications,
    isLoadingNotifications,
    performanceData,
    isLoadingPerformanceData,
    refreshHealthStatus,
    acknowledgeIncident,
    resolveIncident,
    dismissNotification,
    trackMetric,
    enableMetric,
  };
  
  return (
    <HealthContext.Provider value={contextValue}>
      {children}
    </HealthContext.Provider>
  );
};

// Hook to use the health context
export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};