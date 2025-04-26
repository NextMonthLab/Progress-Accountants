import { ReactNode } from "react";
import { Route, Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: any; // Using any to bypass the type issue with wouter's Route component expectations
  allowedRoles?: UserRole[];
  requireSuperAdmin?: boolean;
  exact?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles,
  requireSuperAdmin = false,
  exact = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Helper function to check if the user has one of the allowed roles
  const hasAllowedRole = () => {
    if (!user || !allowedRoles) return false;
    
    // Super admins have access to everything if they pass the super admin check
    if (user.isSuperAdmin && (requireSuperAdmin || !requireSuperAdmin)) return true;
    
    // For regular role-based checking
    return allowedRoles.includes(user.userType);
  };

  // If checking only for super admin privileges
  const hasSuperAdminAccess = () => {
    if (!user) return false;
    return user.isSuperAdmin === true;
  };
  
  // If still loading the user, display a loader
  if (isLoading) {
    return (
      <Route path={path} {...(exact ? { exact: true } : {})}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return (
      <Route path={path} {...(exact ? { exact: true } : {})}>
        <Redirect to="/auth" />
      </Route>
    );
  }
  
  // If super admin access is required but user is not a super admin
  if (requireSuperAdmin && !hasSuperAdminAccess()) {
    return (
      <Route path={path} {...(exact ? { exact: true } : {})}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-4">You need super admin privileges to access this page.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => setLocation("/")}
          >
            Go Home
          </button>
        </div>
      </Route>
    );
  }
  
  // If role check is required but user doesn't have any of the allowed roles
  if (allowedRoles && !hasAllowedRole()) {
    return (
      <Route path={path} {...(exact ? { exact: true } : {})}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => setLocation("/")}
          >
            Go Home
          </button>
        </div>
      </Route>
    );
  }
  
  // If all checks pass, render the component
  return <Route path={path} component={Component} {...(exact ? { exact: true } : {})} />;
}