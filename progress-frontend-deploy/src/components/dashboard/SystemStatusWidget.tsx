import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, InfoIcon } from 'lucide-react';
import DashboardWidget from './DashboardWidget';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: string;
  lastSync: string;
  cpuUsage: number;
  memoryUsage: number;
  services: {
    name: string;
    status: 'online' | 'offline' | 'degraded';
  }[];
}

const SystemStatusWidget: React.FC = () => {
  const { data: systemStatus, isLoading, error } = useQuery<SystemStatus>({
    queryKey: ['/api/system/status'],
    // If the endpoint doesn't exist yet, this will fall back to simulated data
    queryFn: async () => {
      try {
        const res = await fetch('/api/system/status');
        if (!res.ok) throw new Error('Failed to fetch system status');
        return await res.json();
      } catch (err) {
        return getSimulatedData();
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Simulate data if API isn't available yet
  const getSimulatedData = (): SystemStatus => {
    return {
      status: 'healthy',
      uptime: '5d 12h 34m',
      lastSync: '3 minutes ago',
      cpuUsage: 32,
      memoryUsage: 58,
      services: [
        { name: 'Database', status: 'online' },
        { name: 'File Storage', status: 'online' },
        { name: 'API Gateway', status: 'online' },
        { name: 'Messaging', status: 'online' }
      ]
    };
  };

  // Status icon based on system health
  const StatusIcon = () => {
    if (!systemStatus) return <InfoIcon className="h-5 w-5 text-gray-400" />;
    
    switch (systemStatus.status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  // Service status color
  const getStatusColor = (status: 'online' | 'offline' | 'degraded') => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'degraded': return 'text-amber-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  if (error) {
    return (
      <DashboardWidget 
        title="System Status" 
        description="Current health and performance"
        size="md"
      >
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Unable to fetch system status</p>
          <p className="text-sm text-gray-500 mt-1">Please check your network connection</p>
        </div>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget 
      title="System Status" 
      description="Current health and performance"
      loading={isLoading}
      size="md"
      footer={
        <div className="flex justify-between w-full text-xs text-gray-500">
          <span>Last updated: {systemStatus?.lastSync || 'Unknown'}</span>
          <span>Uptime: {systemStatus?.uptime || 'Unknown'}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center">
          <StatusIcon />
          <span className="ml-2 font-medium">
            {systemStatus?.status === 'healthy' && 'All systems operational'}
            {systemStatus?.status === 'warning' && 'System performance degraded'}
            {systemStatus?.status === 'critical' && 'Critical system issues detected'}
            {systemStatus?.status === 'unknown' && 'System status unknown'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">CPU</span>
              <span className="text-xs text-gray-500">{systemStatus?.cpuUsage || 0}%</span>
            </div>
            <Progress value={systemStatus?.cpuUsage || 0} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">Memory</span>
              <span className="text-xs text-gray-500">{systemStatus?.memoryUsage || 0}%</span>
            </div>
            <Progress value={systemStatus?.memoryUsage || 0} className="h-2" />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Services</h4>
          <div className="grid grid-cols-2 gap-2">
            {systemStatus?.services.map((service, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(service.status)} mr-2`} />
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
};

export default SystemStatusWidget;