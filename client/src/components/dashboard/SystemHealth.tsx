import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface SystemComponent {
  name: string;
  status: 'good' | 'warning' | 'error';
  details?: string;
  lastChecked: string;
}

interface SystemHealthProps {
  components?: SystemComponent[];
  isLoading?: boolean;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ 
  components = [], 
  isLoading = false 
}) => {
  // Function to get the appropriate status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
  };

  // Function to get the appropriate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0">
            Good
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-0">
            Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-0">
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0">
            Good
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {components.map((component, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            {getStatusIcon(component.status)}
            <div>
              <p className="font-medium">{component.name}</p>
              {component.details && <p className="text-xs text-gray-500">{component.details}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(component.status)}
            <span className="text-xs text-gray-500">{component.lastChecked}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemHealth;