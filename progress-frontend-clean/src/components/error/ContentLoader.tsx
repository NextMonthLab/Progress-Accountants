import React from 'react';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ContentLoaderProps {
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  contentType?: string;
  retry?: () => void;
}

/**
 * ContentLoader handles the three states of content loading:
 * 1. Loading state - displays a spinner or custom loading component
 * 2. Error state - displays an error message or custom error component 
 * 3. Success state - displays the children
 * 
 * It also wraps children in an ErrorBoundary to catch any rendering errors
 */
export const ContentLoader: React.FC<ContentLoaderProps> = ({
  isLoading = false,
  error = null,
  children,
  loadingComponent,
  errorComponent,
  contentType = 'content',
  retry,
}) => {
  // Default loading component
  const defaultLoadingComponent = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading {contentType}...</p>
    </div>
  );

  // Default error component
  const defaultErrorComponent = error && (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading {contentType}</AlertTitle>
      <AlertDescription className="mt-2">{error.message}</AlertDescription>
      {retry && (
        <div className="mt-4">
          <button 
            onClick={retry}
            className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </Alert>
  );

  if (isLoading) {
    return <div className="w-full">{loadingComponent || defaultLoadingComponent}</div>;
  }

  if (error) {
    return <div className="w-full">{errorComponent || defaultErrorComponent}</div>;
  }

  return (
    <ErrorBoundary contentType={contentType}>
      {children}
    </ErrorBoundary>
  );
};

export default ContentLoader;