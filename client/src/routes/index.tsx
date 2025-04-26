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

// Fallback loading component
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Public Routes */}
        <PublicRoutes />
        
        {/* Admin Routes */}
        <AdminRoutes />
        
        {/* Tools Routes */}
        <ToolsRoutes />
        
        {/* Client Routes */}
        <ClientRoutes />
        
        {/* Not Found Route */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
}