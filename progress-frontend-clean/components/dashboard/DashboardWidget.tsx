import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface DashboardWidgetProps {
  title: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  description,
  className,
  size = 'md',
  loading = false,
  footer,
  children,
}) => {
  // Size mappings for grid layouts
  const sizeClasses = {
    sm: 'col-span-1',
    md: 'col-span-1 md:col-span-2',
    lg: 'col-span-1 md:col-span-2 lg:col-span-3',
    xl: 'col-span-full'
  };

  return (
    <Card className={cn(
      'overflow-hidden shadow-sm',
      sizeClasses[size],
      className
    )}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {loading ? (
          <div className="flex justify-center items-center min-h-[100px]">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <CardFooter className="p-4 pt-0 border-t bg-gray-50">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardWidget;