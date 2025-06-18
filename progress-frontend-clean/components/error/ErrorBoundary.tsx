import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  contentType?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in its
 * child component tree and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to health monitoring system if available
    try {
      fetch('/api/health/incidents/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ui_error',
          details: {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            location: window.location.pathname
          }
        })
      }).catch(e => console.error('Failed to log error to monitoring system:', e));
    } catch (e) {
      // Silently fail if we can't log the error
    }
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    const { contentType = 'component' } = this.props;
    
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle size={20} />
              {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Error
            </CardTitle>
            <CardDescription>
              An error occurred while rendering this {contentType}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2 text-sm font-mono whitespace-pre-wrap break-words">
                {this.state.error?.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-muted-foreground">
              You can try to reset this {contentType} or reload the page.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/20 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleReset}
              className="flex items-center gap-1"
            >
              <RefreshCw size={14} /> Reset
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;