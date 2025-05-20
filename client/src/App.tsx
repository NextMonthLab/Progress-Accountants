import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationProvider } from "@/contexts/NavigationContext";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import NotFound from "@/pages/not-found";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { TenantProvider } from "@/hooks/use-tenant";
import { PermissionsProvider } from "@/hooks/use-permissions";
import { CompanionContextProvider } from "@/hooks/use-companion-context";
import { DualModeCompanion } from "@/components/companions/DualModeCompanion";
import { UpgradeAnnouncement } from "@/components/UpgradeAnnouncement";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HelpProvider } from "@/contexts/HelpContext";
import { HealthProvider } from "@/contexts/HealthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import InstantHelpWidget from "@/components/support/InstantHelpWidget";
import ContextSuggestion from "@/components/support/ContextSuggestion";
import HealthTracker from "@/components/health/HealthTracker";
import AdminLayout from "@/layouts/AdminLayout";
import { testLogin } from "@/lib/test-login";
import { DocumentHead } from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ContentLoader from "@/components/error/ContentLoader";

// Eagerly loaded components for critical paths
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";

// Lazy loaded components - Trimmed to essentials for Hetzner v1
const ClientRegistrationPage = lazy(() => import("@/pages/ClientRegistrationPage"));
const ClientDashboardPage = lazy(() => import("@/pages/ClientDashboardPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));
const InsightsDashboardPage = lazy(() => import("@/pages/InsightsDashboardPage"));
const BusinessIdentityPage = lazy(() => import("@/pages/BusinessIdentityPage"));
const HomepageSetupPage = lazy(() => import("@/pages/HomepageSetupPage"));
const FoundationPagesOverviewPage = lazy(() => import("@/pages/FoundationPagesOverviewPage"));
const LaunchReadyPage = lazy(() => import("@/pages/LaunchReadyPage"));
const CompanionSettingsPage = lazy(() => import("@/pages/admin/companion-settings"));
const SiteBrandingPage = lazy(() => import("@/pages/admin/SiteBrandingPage"));
const MenuManagementPage = lazy(() => import("@/pages/admin/MenuManagementPage"));
const DomainMappingPage = lazy(() => import("@/pages/DomainMappingPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const SocialMediaGeneratorPage = lazy(() => import("@/pages/SocialMediaGeneratorPage"));
const BlogPostGenerator = lazy(() => import("@/pages/tools/blog-post-generator"));
const PageBuilderListPage = lazy(() => import("@/pages/PageBuilderListPage"));
const PageBuilderPage = lazy(() => import("@/pages/PageBuilderPage"));

// Import from ClientDataProvider for protected routes
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";

// Loading fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <Loader2 className="h-8 w-8 animate-spin text-[#36d1dc]" />
  </div>
);

// Router for all application routes - Hetzner V1 Trimmed Version
function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/client-register/:tenantId">
        <Suspense fallback={<LoadingFallback />}>
          <ClientRegistrationPage />
        </Suspense>
      </Route>
      
      {/* Default route should be HomePage */}
      <Route path="/" component={HomePage} />
      
      {/* Admin routes - Only essential routes for Hetzner v1 */}
      <ProtectedRoute 
        path="/admin" 
        component={() => {
          const [, setLocation] = useLocation();
          useEffect(() => {
            setLocation('/admin/dashboard');
          }, [setLocation]);
          return <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>;
        }}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/settings" 
        component={AdminSettingsPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/site-branding" 
        component={SiteBrandingPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/companion-settings" 
        component={CompanionSettingsPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/menu-management" 
        component={MenuManagementPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/domain-mapping" 
        component={DomainMappingPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboardPage {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/insights-dashboard" 
        component={InsightsDashboardPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/analytics" 
        component={AnalyticsPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      
      {/* Essential client portal route for Hetzner v1 */}
      <ProtectedRoute 
        path="/client-dashboard" 
        component={ClientDashboardPage} 
        allowedRoles={['client', 'admin', 'super_admin']} 
      />
      
      {/* Essential content creation tools retained for Hetzner v1 */}
      <ProtectedRoute 
        path="/tools/social-media-generator" 
        component={SocialMediaGeneratorPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/tools/blog-post-generator" 
        component={BlogPostGenerator} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      
      {/* Essential setup routes for Hetzner v1 */}
      <ProtectedRoute path="/business-identity" component={BusinessIdentityPage} />
      <ProtectedRoute path="/homepage-setup" component={HomepageSetupPage} />
      <ProtectedRoute path="/foundation-pages" component={FoundationPagesOverviewPage} />
      <ProtectedRoute path="/launch-ready" component={LaunchReadyPage} />
      
      {/* Page Builder routes - essential for Hetzner v1 */}
      <ProtectedRoute 
        path="/page-builder" 
        component={PageBuilderListPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/page-builder/new" 
        component={() => <PageBuilderPage />}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/page-builder/page/new" 
        component={() => <PageBuilderPage />}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/page-builder/page/:id" 
        component={PageBuilderPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      
      {/* Not Found route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// First time user detection logic
function FirstTimeUserDetector({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  const { data: onboarding, isLoading: isLoadingOnboarding } = useQuery({
    queryKey: ['/api/onboarding/status'],
    enabled: !!user && !isLoading,
  });

  // Safely check onboarding completion status
  const onboardingComplete = onboarding && typeof onboarding === 'object' ? 
    (onboarding as any).completed === true : false;

  useEffect(() => {
    if (isLoading || isLoadingOnboarding || !user) return;

    // Paths that are allowed to access without completing onboarding
    const isAllowedPath = 
      location.startsWith('/onboarding') || 
      location.startsWith('/auth') || 
      location.startsWith('/website-intent') || 
      location.startsWith('/brand-guidelines') || 
      location.startsWith('/business-identity') || 
      location.startsWith('/tools/social-media-generator') ||
      location.startsWith('/homepage-setup') || 
      location.startsWith('/foundation-pages') || 
      location.startsWith('/launch-ready') ||
      location.startsWith('/page-builder');
    
    // If the user has completed onboarding, they can access any page
    if (onboardingComplete || isAllowedPath) {
      return;
    }

    // If onboarding is not complete, redirect to the first onboarding step
    setLocation('/business-identity');
  }, [user, isLoading, isLoadingOnboarding, onboardingComplete, location, setLocation]);

  if (isLoading || isLoadingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TenantProvider>
              <PermissionsProvider>
                <HealthProvider>
                  <HelpProvider>
                    <NotificationsProvider>
                      <NavigationProvider>
                        <CompanionContextProvider>
                          <Toaster />
                          <DocumentHead />
                          <AdminLayout>
                            <ContentLoader>
                              <FirstTimeUserDetector>
                                <MainLayout>
                                  <Router />
                                </MainLayout>
                              </FirstTimeUserDetector>
                            </ContentLoader>
                          </AdminLayout>
                          <UpgradeAnnouncement />
                          <DualModeCompanion />
                          <DynamicSidebar />
                          <InstantHelpWidget />
                          <ContextSuggestion />
                          <HealthTracker />
                        </CompanionContextProvider>
                      </NavigationProvider>
                    </NotificationsProvider>
                  </HelpProvider>
                </HealthProvider>
              </PermissionsProvider>
            </TenantProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;