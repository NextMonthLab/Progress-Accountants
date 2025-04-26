import { Suspense, lazy } from 'react';
import { Switch, Route } from "wouter";
import { Loader2 } from "lucide-react";

// Lazy load route components
import { PublicRoutes } from './publicRoutes';
import { AdminRoutes } from './adminRoutes';
import { ToolsRoutes } from './toolsRoutes';
import { ClientRoutes } from './clientRoutes';

// Lazy load not found component
const NotFound = lazy(() => import("@/pages/not-found"));

// Lazy load admin dashboard directly 
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));

// Fallback loading component
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Direct error boundary for debugging
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in router:", error);
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-red-700 text-lg font-bold mb-2">Error Rendering Page</h2>
        <p className="text-red-600">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
};

export function AppRouter() {
  console.log("AppRouter rendering");
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          {/* Public Routes */}
          <PublicRoutes />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            component={() => {
              console.log("Admin Dashboard route matched");
              return <AdminDashboardPage />
            }} 
          />
          <AdminRoutes />
          
          {/* Tools Routes */}
          <ToolsRoutes />
          
          {/* Client Routes */}
          <ClientRoutes />
          
          {/* Not Found Route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}