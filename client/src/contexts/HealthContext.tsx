import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Types for the health monitoring system
export interface HealthMetric {
  id: number;
  name: string;
  category: 'api' | 'performance' | 'security' | 'storage';
  description: string;
  threshold: any;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthIncident {
  id: number;
  metricId: number;
  status: 'active' | 'resolved' | 'acknowledged';
  severity: 'warning' | 'critical' | 'info';
  affectedArea: string;
  affectedUsers: number;
  details: any;
  detectedAt: Date;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HealthNotification {
  id: number;
  incidentId: number;
  type: 'admin' | 'user';
  status: 'pending' | 'delivered' | 'dismissed';
  message: string;
  createdAt: Date;
  affectedArea?: string;
  severity?: 'warning' | 'critical' | 'info';
}

export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: Date;
  services: {
    api: { healthy: boolean; lastChecked: Date; error?: string };
    database: { healthy: boolean; lastChecked: Date; error?: string };
    fileStorage: { healthy: boolean; lastChecked: Date; error?: string };
    auth: { healthy: boolean; lastChecked: Date; error?: string };
  };
}

interface HealthContextType {
  // Health status
  healthStatus: SystemHealthStatus | null;
  isLoadingHealthStatus: boolean;
  
  // Notifications
  notifications: HealthNotification[];
  isLoadingNotifications: boolean;
  markNotificationDelivered: (notificationId: number) => void;
  
  // Incidents
  incidents: HealthIncident[];
  isLoadingIncidents: boolean;
  resolveIncident: (incidentId: number) => void;
  
  // Metrics
  metrics: HealthMetric[];
  isLoadingMetrics: boolean;
  updateMetric: (metricId: number, updates: { enabled?: boolean; threshold?: any }) => void;
  
  // Tracking functions
  trackApiError: (route: string, statusCode: number) => void;
  trackPageLoadTime: (page: string, loadTimeMs: number) => void;
  trackSessionFailure: () => void;
  trackMediaUpload: (success: boolean) => void;
}

const HealthContext = createContext<HealthContextType | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Function to track API errors
  const trackApiError = async (route: string, statusCode: number) => {
    try {
      await apiRequest('POST', '/api/health/track/api-error', { route, statusCode });
    } catch (error) {
      console.error('Failed to track API error:', error);
    }
  };
  
  // Function to track page load times
  const trackPageLoadTime = async (page: string, loadTimeMs: number) => {
    try {
      await apiRequest('POST', '/api/health/track/page-load', { page, loadTimeMs });
    } catch (error) {
      console.error('Failed to track page load time:', error);
    }
  };
  
  // Function to track session failures
  const trackSessionFailure = async () => {
    try {
      await apiRequest('POST', '/api/health/track/session-failure', {});
    } catch (error) {
      console.error('Failed to track session failure:', error);
    }
  };
  
  // Function to track media uploads
  const trackMediaUpload = async (success: boolean) => {
    try {
      await apiRequest('POST', '/api/health/track/media-upload', { success });
    } catch (error) {
      console.error('Failed to track media upload:', error);
    }
  };
  
  // Fetch system health status
  const { 
    data: healthStatus,
    isLoading: isLoadingHealthStatus
  } = useQuery<SystemHealthStatus>({
    queryKey: ['/api/health'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/health');
      return await response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Fetch admin notifications
  const { 
    data: notificationsData,
    isLoading: isLoadingNotifications
  } = useQuery<{ success: boolean; notifications: HealthNotification[] }>({
    queryKey: ['/api/admin/health/notifications'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/health/notifications');
      return await response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Fetch recent incidents
  const { 
    data: incidentsData,
    isLoading: isLoadingIncidents
  } = useQuery<{ success: boolean; incidents: HealthIncident[] }>({
    queryKey: ['/api/admin/health/incidents'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/health/incidents');
      return await response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Fetch health metrics
  const { 
    data: metricsData,
    isLoading: isLoadingMetrics
  } = useQuery<{ success: boolean; metrics: HealthMetric[] }>({
    queryKey: ['/api/admin/health/metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/health/metrics');
      return await response.json();
    }
  });
  
  // Mark notification as delivered
  const markNotificationDeliveredMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await apiRequest('POST', `/api/admin/health/notifications/${notificationId}/deliver`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/health/notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to mark notification as delivered: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Resolve incident
  const resolveIncidentMutation = useMutation({
    mutationFn: async (incidentId: number) => {
      await apiRequest('POST', `/api/admin/health/incidents/${incidentId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/health/incidents'] });
      toast({
        title: 'Success',
        description: 'Incident resolved successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to resolve incident: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Update metric
  const updateMetricMutation = useMutation({
    mutationFn: async ({ metricId, updates }: { metricId: number, updates: { enabled?: boolean; threshold?: any } }) => {
      await apiRequest('PUT', `/api/admin/health/metrics/${metricId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/health/metrics'] });
      toast({
        title: 'Success',
        description: 'Metric updated successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update metric: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Helper function to mark a notification as delivered
  const markNotificationDelivered = (notificationId: number) => {
    markNotificationDeliveredMutation.mutate(notificationId);
  };
  
  // Helper function to resolve an incident
  const resolveIncident = (incidentId: number) => {
    resolveIncidentMutation.mutate(incidentId);
  };
  
  // Helper function to update a metric
  const updateMetric = (metricId: number, updates: { enabled?: boolean; threshold?: any }) => {
    updateMetricMutation.mutate({ metricId, updates });
  };
  
  return (
    <HealthContext.Provider
      value={{
        healthStatus: healthStatus || null,
        isLoadingHealthStatus,
        notifications: notificationsData?.notifications || [],
        isLoadingNotifications,
        markNotificationDelivered,
        incidents: incidentsData?.incidents || [],
        isLoadingIncidents,
        resolveIncident,
        metrics: metricsData?.metrics || [],
        isLoadingMetrics,
        updateMetric,
        trackApiError,
        trackPageLoadTime,
        trackSessionFailure,
        trackMediaUpload
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}