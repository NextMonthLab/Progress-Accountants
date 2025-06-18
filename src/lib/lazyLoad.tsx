import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadOptions {
  /**
   * Whether to show a fallback loading state
   * @default true
   */
  withFallback?: boolean;
  
  /**
   * Custom loading component
   */
  LoadingComponent?: React.ComponentType;
}

/**
 * LazyLoad - A utility for easier code splitting
 * 
 * @param importFunc - Dynamic import function
 * @param options - Configuration options
 * @returns Lazily loaded component with Suspense
 * 
 * Usage:
 * ```tsx
 * // Instead of directly importing
 * // import Dashboard from './Dashboard';
 * 
 * // Use lazy loading
 * const Dashboard = lazyLoad(() => import('./Dashboard'));
 * 
 * // Or with custom loading
 * const Dashboard = lazyLoad(() => import('./Dashboard'), {
 *   LoadingComponent: MyCustomLoader
 * });
 * ```
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    withFallback = true,
    LoadingComponent = DefaultLoader
  } = options;
  
  const LazyComponent = lazy(importFunc);
  
  if (!withFallback) return LazyComponent;
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Default loading component
 */
function DefaultLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}