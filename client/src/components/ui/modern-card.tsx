import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'primary' | 'accent' | 'info';
  headerClassName?: string;
  contentClassName?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  icon,
  children,
  className,
  color = 'default',
  headerClassName,
  contentClassName
}) => {
  // Modern, subtle styling with appropriate color accents
  const colorStyles = {
    default: {
      header: 'bg-white',
      title: 'text-slate-700',
      icon: 'text-slate-500',
      content: 'bg-white'
    },
    primary: {
      header: 'bg-indigo-50',
      title: 'text-indigo-700',
      icon: 'text-indigo-500',
      content: 'bg-white'
    },
    accent: {
      header: 'bg-teal-50',
      title: 'text-teal-700',
      icon: 'text-teal-500',
      content: 'bg-white'
    },
    info: {
      header: 'bg-sky-50',
      title: 'text-sky-700',
      icon: 'text-sky-500',
      content: 'bg-white'
    }
  };

  const styles = colorStyles[color];

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100', className)}>
      {title && (
        <CardHeader className={cn('py-4 px-5 flex flex-row items-center space-y-0 gap-2', styles.header, headerClassName)}>
          {icon && <span className={cn('h-5 w-5', styles.icon)}>{icon}</span>}
          <CardTitle className={cn('text-base font-medium', styles.title)}>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn('p-5', styles.content, contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export { ModernCard };