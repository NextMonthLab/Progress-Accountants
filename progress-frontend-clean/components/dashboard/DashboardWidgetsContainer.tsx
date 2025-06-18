import React from 'react';
import { cn } from '@/lib/utils';
import SystemStatusWidget from './SystemStatusWidget';
import SOTStatusWidget from './SOTStatusWidget';
import RecentActivityWidget from './RecentActivityWidget';

interface DashboardWidgetsContainerProps {
  className?: string;
  widgets?: ('system_status' | 'sot_status' | 'recent_activity')[];
}

const DashboardWidgetsContainer: React.FC<DashboardWidgetsContainerProps> = ({
  className,
  widgets = ['system_status', 'sot_status', 'recent_activity']
}) => {
  const renderWidget = (widgetType: string) => {
    switch (widgetType) {
      case 'system_status':
        return <SystemStatusWidget />;
      case 'sot_status':
        return <SOTStatusWidget />;
      case 'recent_activity':
        return <RecentActivityWidget />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4', className)}>
      {widgets.map((widget, index) => (
        <React.Fragment key={`${widget}-${index}`}>
          {renderWidget(widget)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DashboardWidgetsContainer;