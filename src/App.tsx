import { Switch, Route, useLocation, Redirect } from "wouter";
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

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HelpProvider } from "@/contexts/HelpContext";
import { HealthProvider } from "@/contexts/HealthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import ConversionDemo from "@/components/ConversionDemo";
import HealthTracker from "@/components/health/HealthTracker";
import AdminLayout from "@/layouts/AdminLayout";
import { testLogin } from "@/lib/test-login";
import { DocumentHead } from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ContentLoader from "@/components/error/ContentLoader";
import CookieNotification from "@/components/CookieNotification";

// Eagerly loaded components for critical paths
import HomePage from "@/pages/HomePage";
import ProgressHomePage from "@/pages/ProgressHomePage";
import AuthPage from "@/pages/AuthPage";

// Lazy loaded components for better performance
const SuperAdminDashboard = lazy(() => import("@/pages/super-admin/SuperAdminDashboard"));
const StudioPage = lazy(() => import("@/pages/StudioPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AgoraProfilePage = lazy(() => import("@/pages/agora-profile"));
const AgoraProfileTestPage = lazy(() => import("@/pages/agora-profile-test"));
const ClientRegistrationPage = lazy(() => import("@/pages/ClientRegistrationPage"));
// Removed conflicting ClientDashboardPage import - using ClientDashboardPage2 instead
const ClientDashboardPage2 = lazy(() => import("@/pages/ClientDashboardPage2"));
const RedesignedDashboardPage = lazy(() => import("@/pages/RedesignedDashboardPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminDashboardPageSimple = lazy(() => import("@/pages/AdminDashboardPage.simple"));
const DiagnosticDashboard = lazy(() => import("@/pages/DiagnosticDashboard"));
const CRMViewPage = lazy(() => import("@/pages/CRMViewPage"));
const CRMViewPageEnhanced = lazy(() => import("@/pages/CRMViewPageEnhanced"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const TaxPlanningPage = lazy(() => import("@/pages/services/TaxPlanningPage"));
const BookkeepingPage = lazy(() => import("@/pages/services/BookkeepingPage"));
const BusinessAdvisoryPage = lazy(() => import("@/pages/services/BusinessAdvisoryPage"));
const FinancialReportingPage = lazy(() => import("@/pages/services/FinancialReportingPage"));
const AuditSupportPage = lazy(() => import("@/pages/services/AuditSupportPage"));
const CloudAccountingPage = lazy(() => import("@/pages/services/CloudAccountingPage"));
const IndustrySpecificPage = lazy(() => import("@/pages/services/IndustrySpecificPage"));
const VirtualFinanceDirectorPage = lazy(() => import("@/pages/services/VirtualFinanceDirectorPage"));
const BusinessCalculatorPage = lazy(() => import("@/pages/BusinessCalculatorPage"));
const SMESupportHubPage = lazy(() => import("@/pages/SMESupportHubPage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const FilmIndustryPage = lazy(() => import("@/pages/FilmIndustryPage"));
const MusicIndustryPage = lazy(() => import("@/pages/MusicIndustryPage"));
const ConstructionIndustryPage = lazy(() => import("@/pages/ConstructionIndustryPage"));
const ProfessionalServicesPage = lazy(() => import("@/pages/ProfessionalServicesPage"));
const WhyUsPage = lazy(() => import("@/pages/WhyUsPage"));
const StudioBanburyPage = lazy(() => import("@/pages/StudioBanburyPage"));
// Removed missing admin components
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));
const AIAssistantSettingsPage = lazy(() => import("@/pages/admin/AIAssistantSettingsPage"));
const DomainMappingPage = lazy(() => import("@/pages/DomainMappingPage"));
const SotManagementPage = lazy(() => import("@/pages/SotManagementPage"));
const SotManagerPage = lazy(() => import("@/pages/admin/SotManagerPage"));
const ConversationInsightsPage = lazy(() => import("@/pages/ConversationInsightsPage"));
const InsightsDashboardPage = lazy(() => import("@/pages/InsightsDashboardPage"));
const OnboardingPage = lazy(() => import("@/pages/NewClientOnboarding"));
const OnboardingIntroPage = lazy(() => import("@/pages/OnboardingWelcomePage"));
const MessagesPage = lazy(() => import("@/pages/admin/MessagesPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const AssistantPage = lazy(() => import("@/pages/support/AssistantPage"));
const TicketPage = lazy(() => import("@/pages/support/TicketPage"));
const DigestPage = lazy(() => import("@/pages/support/DigestPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Progress Accountants Public Pages (Front-End) */}
      <Route path="/contact">
        <Suspense fallback={<LoadingFallback />}>
          <ContactPage />
        </Suspense>
      </Route>
      <Route path="/team">
        <Suspense fallback={<LoadingFallback />}>
          <TeamPage />
        </Suspense>
      </Route>
      <Route path="/about">
        <Suspense fallback={<LoadingFallback />}>
          <AboutPage />
        </Suspense>
      </Route>
      <Route path="/services">
        <Suspense fallback={<LoadingFallback />}>
          <ServicesPage />
        </Suspense>
      </Route>
      <Route path="/services/tax-planning">
        <Suspense fallback={<LoadingFallback />}>
          <TaxPlanningPage />
        </Suspense>
      </Route>
      <Route path="/services/bookkeeping">
        <Suspense fallback={<LoadingFallback />}>
          <BookkeepingPage />
        </Suspense>
      </Route>
      <Route path="/services/business-advisory">
        <Suspense fallback={<LoadingFallback />}>
          <BusinessAdvisoryPage />
        </Suspense>
      </Route>
      <Route path="/services/financial-reporting">
        <Suspense fallback={<LoadingFallback />}>
          <FinancialReportingPage />
        </Suspense>
      </Route>
      <Route path="/services/audit-support">
        <Suspense fallback={<LoadingFallback />}>
          <AuditSupportPage />
        </Suspense>
      </Route>
      <Route path="/services/cloud-accounting">
        <Suspense fallback={<LoadingFallback />}>
          <CloudAccountingPage />
        </Suspense>
      </Route>
      <Route path="/services/industry-specific">
        <Suspense fallback={<LoadingFallback />}>
          <IndustrySpecificPage />
        </Suspense>
      </Route>
      <Route path="/services/virtual-finance-director">
        <Suspense fallback={<LoadingFallback />}>
          <VirtualFinanceDirectorPage />
        </Suspense>
      </Route>

      {/* Tools and Resources Pages */}
      <Route path="/business-calculator">
        <Suspense fallback={<LoadingFallback />}>
          <BusinessCalculatorPage />
        </Suspense>
      </Route>
      <Route path="/sme-support">
        <Suspense fallback={<LoadingFallback />}>
          <SMESupportHubPage />
        </Suspense>
      </Route>
      <Route path="/news">
        <Suspense fallback={<LoadingFallback />}>
          <NewsPage />
        </Suspense>
      </Route>
      <Route path="/film">
        <Suspense fallback={<LoadingFallback />}>
          <FilmIndustryPage />
        </Suspense>
      </Route>
      <Route path="/music">
        <Suspense fallback={<LoadingFallback />}>
          <MusicIndustryPage />
        </Suspense>
      </Route>
      <Route path="/construction">
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionIndustryPage />
        </Suspense>
      </Route>
      <Route path="/professional-services">
        <Suspense fallback={<LoadingFallback />}>
          <ProfessionalServicesPage />
        </Suspense>
      </Route>
      {/* Industry-specific routes with /industries/ prefix */}
      <Route path="/industries/film">
        <Suspense fallback={<LoadingFallback />}>
          <FilmIndustryPage />
        </Suspense>
      </Route>
      <Route path="/industries/music">
        <Suspense fallback={<LoadingFallback />}>
          <MusicIndustryPage />
        </Suspense>
      </Route>
      <Route path="/industries/construction">
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionIndustryPage />
        </Suspense>
      </Route>
      <Route path="/industries/professional-services">
        <Suspense fallback={<LoadingFallback />}>
          <ProfessionalServicesPage />
        </Suspense>
      </Route>
      <Route path="/why-us">
        <Suspense fallback={<LoadingFallback />}>
          <WhyUsPage />
        </Suspense>
      </Route>
      <Route path="/studio-banbury">
        <Suspense fallback={<LoadingFallback />}>
          <StudioBanburyPage />
        </Suspense>
      </Route>
      <Route path="/resources" component={ResourcesPage} />

      {/* Support System routes */}
      <Route path="/support/assistant" component={AssistantPage} />
      <Route path="/support/ticket" component={TicketPage} />
      <Route path="/support/digest" component={DigestPage} />

      {/* Default route should be HomePage */}
      <Route path="/" component={HomePage} />

      {/* Diagnostic Dashboard restricted to admin and super_admin */}
      <ProtectedRoute 
        path="/diagnostics" 
        component={DiagnosticDashboard}
        allowedRoles={['admin', 'super_admin']}
      />

      {/* Super Admin routes (require super admin privileges) */}
      <ProtectedRoute 
        path="/super-admin" 
        component={SuperAdminDashboard} 
        requireSuperAdmin={true} 
      />

      {/* Admin routes (require admin or super admin) */}
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
        path="/admin/crm" 
        component={CRMViewPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/crm-enhanced" 
        component={CRMViewPageEnhanced} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/settings" 
        component={AdminSettingsPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/ai-assistant-settings" 
        component={AIAssistantSettingsPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/messages" 
        component={MessagesPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/marketplace" 
        component={() => <div>Marketplace Page</div>} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/domain-mapping" 
        component={DomainMappingPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/sot-management" 
        component={SotManagementPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/sot" 
        component={SotManagerPage}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/conversation-insights" 
        component={ConversationInsightsPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={AdminDashboardPage}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/insights-dashboard" 
        component={InsightsDashboardPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Removed missing admin routes */}

      {/* Client routes */}
      <Route path="/studio" component={StudioPage} />
      <Route path="/client-registration" component={ClientRegistrationPage} />
      <Route path="/dashboard" component={ClientDashboardPage2} />
      <Route path="/redesigned-dashboard" component={RedesignedDashboardPage} />
      <Route path="/admin-dashboard" component={AdminDashboardPage} />
      <Route path="/simple-dashboard" component={AdminDashboardPageSimple} />

      {/* Auth route */}
      <Route path="/auth" component={AuthPage} />

      {/* Agora OS Testing Routes */}
      <Route path="/agora-profile" component={AgoraProfilePage} />
      <Route path="/agora-profile-test" component={AgoraProfileTestPage} />

      {/* Onboarding routes */}
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/onboarding/intro" component={OnboardingIntroPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const mode = import.meta.env.VITE_MODE || 'client';

  return (
    <ErrorBoundary contentType="application">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PermissionsProvider>
            <ThemeProvider>
              <TenantProvider>
                <CompanionContextProvider>
                  <HelpProvider>
                    <HealthProvider>
                      <DocumentHead route="/" />
                      <FirstTimeUserDetector>
                        <MainLayout>
                          <ErrorBoundary contentType="page">
                            <Router />
                          </ErrorBoundary>
                        </MainLayout>
                      </FirstTimeUserDetector>
                      <HealthTracker />
                      <Toaster />
                    </HealthProvider>
                  </HelpProvider>
                </CompanionContextProvider>
              </TenantProvider>
            </ThemeProvider>
          </PermissionsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function FirstTimeUserDetector({ children }: { children: React.ReactNode }) {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    enabled: false, // Disabled to prevent automatic fetching
  });

  return <>{children}</>;
}

export default App;