import { Switch, Route, useLocation } from "wouter";
import { AppRouter } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { TenantProvider } from "@/hooks/use-tenant";
import { PermissionsProvider } from "@/hooks/use-permissions";
import { CompanionContextProvider } from "@/hooks/use-companion-context";
import { DualModeCompanion } from "@/components/companions/DualModeCompanion";
import { UpgradeAnnouncement } from "@/components/UpgradeAnnouncement";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { testLogin } from "@/lib/test-login";
import { DocumentHead } from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

// Router for all application routes
function Router() {
  // Use AppRouter which contains all lazy-loaded routes
  return <AppRouter />;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously called cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider queryClient={queryClient}>
        <PermissionsProvider>
          <ThemeProvider>
            <TenantProvider>
              <CompanionContextProvider>
                <DocumentHead route="/" />
                {/* CRITICAL FIX: Removed MainLayout for emergency testing */}
                <FirstTimeUserDetector>
                  <Router />
                </FirstTimeUserDetector>
                <DualModeCompanion />
                <UpgradeAnnouncement />
                <Toaster />
              </CompanionContextProvider>
            </TenantProvider>
          </ThemeProvider>
        </PermissionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Component to detect first-time users and redirect to onboarding
function FirstTimeUserDetector({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // Query current location
  const [location] = useLocation();
  
  // Only redirect authenticated non-admin users who haven't completed onboarding
  useEffect(() => {
    // Skip if user is not logged in or is an admin/super admin
    if (!user) return;
    if (user.userType === 'admin' || user.userType === 'super_admin' || user.userType === 'editor') return;
    
    // For demo purposes, we'll redirect based on simple localStorage check
    // In a production environment, this would use the onboardingState from the backend
    const onboardingComplete = localStorage.getItem('project_context.status') === 'onboarded';
    
    // Skip redirection for specific paths that are allowed before onboarding
    const allowedPaths = [
      '/onboarding',
      '/website-intent',
      '/new-client-setup',
      '/client-portal',
      '/tools-dashboard',
      '/tools-hub',
      '/auth',
      '/'
    ];
    
    const isAllowedPath = 
      allowedPaths.includes(location) || 
      location.startsWith('/tools/create/') ||
      location.startsWith('/tools/social-media-generator') ||
      location.startsWith('/homepage-setup') || 
      location.startsWith('/foundation-pages') || 
      location.startsWith('/launch-ready') ||
      location.startsWith('/marketplace') ||
      location.startsWith('/page-builder');
    
    // If we need to redirect to onboarding
    if (!onboardingComplete && !isAllowedPath) {
      navigate('/onboarding');
    }
  }, [user, location, navigate]);

  return <>{children}</>;
}

export default App;