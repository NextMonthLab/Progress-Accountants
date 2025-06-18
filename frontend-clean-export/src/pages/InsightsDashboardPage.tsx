import React, { useState, useTransition, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';
import InsightsDashboardContent from '@/components/insights/InsightsDashboardContent';

// Error fallback component
function DashboardError() {
  return (
    <Card className="my-8 border-red-200">
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-700 dark:text-red-400">Dashboard Error</CardTitle>
        </div>
        <CardDescription className="text-red-600/80 dark:text-red-300/80">
          There was a problem loading the insights dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-slate-700 dark:text-slate-300">
          We encountered an error while loading your insights data. This could be due to a network issue or temporary server problem.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Retry Loading Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main wrapper component with proper error handling
// Dashboard container that safely handles loading states without suspense
export default function InsightsDashboardPage() {
  // Adding a simpler approach without React Suspense
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  
  // Use effect to set client-side rendering flag
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);
  
  // Show a loading state until client-side rendering is ready
  if (!isClientLoaded) {
    return (
      <AdminLayout>
        <div className="w-full py-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }
  
  // Once client is loaded, render the full component with error boundary
  return (
    <AdminLayout>
      <ErrorBoundary FallbackComponent={DashboardError}>
        <InsightsDashboardContent />
      </ErrorBoundary>
    </AdminLayout>
  );
}