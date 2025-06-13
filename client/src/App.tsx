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
import { DualModeCompanion } from "@/components/companions/DualModeCompanion";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HelpProvider } from "@/contexts/HelpContext";
import { HealthProvider } from "@/contexts/HealthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import InstantHelpWidget from "@/components/support/InstantHelpWidget";
import ContextSuggestion from "@/components/support/ContextSuggestion";
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
const ClientDashboardPage = lazy(() => import("@/pages/ClientDashboardPage"));
const ClientDashboardPage2 = lazy(() => import("@/pages/ClientDashboardPage2"));
const RedesignedDashboardPage = lazy(() => import("@/pages/RedesignedDashboardPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminDashboardPageSimple = lazy(() => import("@/pages/AdminDashboardPage.simple"));
const DiagnosticDashboard = lazy(() => import("@/pages/DiagnosticDashboard"));
const CRMViewPage = lazy(() => import("@/pages/CRMViewPage"));
const CRMViewPageEnhanced = lazy(() => import("@/pages/CRMViewPageEnhanced"));
const ToolsDashboardPage = lazy(() => import("@/pages/ToolsDashboardPage"));
// Removed BlueprintOnboardingPage (front-end templating)
const ToolsLandingPage = lazy(() => import("@/pages/ToolsLandingPage"));
const ToolMarketplaceBrowserPage = lazy(() => import("@/pages/ToolMarketplaceBrowserPage"));
const ComponentDemo = lazy(() => import("@/pages/ComponentDemo"));
// More lazy loaded components - public pages
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
const TaxPlanningPage = lazy(() => import("@/pages/services/TaxPlanningPage"));
const BookkeepingPage = lazy(() => import("@/pages/services/BookkeepingPage"));
const BusinessAdvisoryPage = lazy(() => import("@/pages/services/BusinessAdvisoryPage"));
const FinancialReportingPage = lazy(() => import("@/pages/services/FinancialReportingPage"));
const AuditSupportPage = lazy(() => import("@/pages/services/AuditSupportPage"));
const CloudAccountingPage = lazy(() => import("@/pages/services/CloudAccountingPage"));
const IndustrySpecificPage = lazy(() => import("@/pages/services/IndustrySpecificPage"));
const VirtualFinanceDirectorPage = lazy(() => import("@/pages/services/VirtualFinanceDirectorPage"));
const IndustriesPage = lazy(() => import("@/pages/IndustriesPage"));
const FilmIndustryPage = lazy(() => import("@/pages/FilmIndustryPage"));
const MusicIndustryPage = lazy(() => import("@/pages/MusicIndustryPage"));
const ConstructionIndustryPage = lazy(() => import("@/pages/ConstructionIndustryPage"));
const ProfessionalServicesPage = lazy(() => import("@/pages/ProfessionalServicesPage"));
const SMESupportHubPage = lazy(() => import("@/pages/SMESupportHubPage"));
const BusinessCalculatorPage = lazy(() => import("@/pages/BusinessCalculatorPage"));
const TestFilmPage = lazy(() => import("@/pages/TestFilmPage"));
const WhyUsPage = lazy(() => import("@/pages/WhyUsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const StudioBanburyPage = lazy(() => import("@/pages/StudioBanburyPage"));
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));


// Admin interface pages
const InsightUsersPage = lazy(() => import("@/pages/InsightUsersPage"));
const InsightsDashboardPage = lazy(() => import("@/pages/InsightsDashboardPage"));
const SmartSiteDashboard = lazy(() => import("@/pages/SmartSiteDashboard"));
const SmartSiteSetupPanel = lazy(() => import("@/pages/SmartSiteSetupPanel"));
const BlogPostGenerator = lazy(() => import("@/pages/BlogPostGenerator"));
const SocialPostGenerator = lazy(() => import("@/pages/SocialPostGenerator"));
const MarketIntelligencePanel = lazy(() => import("@/pages/MarketIntelligencePanel"));
const InsightAppOnboarding = lazy(() => import("@/pages/InsightAppOnboarding"));
const MarketplacePlaceholder = lazy(() => import("@/pages/MarketplacePlaceholder"));
const FeedSettings = lazy(() => import("@/pages/FeedSettings"));
const AdminInnovationDashboard = lazy(() => import("@/pages/admin-innovation-dashboard"));
const AdminEmbedCodeGenerator = lazy(() => import("@/pages/admin-embed-code-generator"));
const AdminTenantPanel = lazy(() => import("@/pages/admin-tenant-panel"));
const SotManagerPage = lazy(() => import("@/pages/admin/SotManagerPage"));
const ScopeRequestPage = lazy(() => import("@/pages/ScopeRequestPage"));
const ModuleGalleryPage = lazy(() => import("@/pages/ModuleGalleryPage"));
const ModuleLibraryPage = lazy(() => import("@/pages/ModuleLibraryPage"));
const InstalledToolsPage = lazy(() => import("@/pages/InstalledToolsPage"));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage"));
const EnhancedMarketplacePage = lazy(() => import("@/pages/EnhancedMarketplacePage"));
const AdminMarketplacePage = lazy(() => import("@/pages/admin/marketplace"));
const AIAssistantSettingsPage = lazy(() => import("@/pages/admin/AIAssistantSettingsPage"));
const MessagesPage = lazy(() => import("@/pages/admin/MessagesPage"));
const MyToolsPage = lazy(() => import("@/pages/MyToolsPage"));

const BrandGuidelinesPage = lazy(() => import("@/pages/BrandGuidelinesPage"));
const BusinessIdentityPage = lazy(() => import("@/pages/BusinessIdentityPage"));

const AboutSetupPage = lazy(() => import("@/pages/AboutSetupPage"));
const ServicesSetupPage = lazy(() => import("@/pages/ServicesSetupPage"));
const ContactSetupPage = lazy(() => import("@/pages/ContactSetupPage"));
const TestimonialsSetupPage = lazy(() => import("@/pages/TestimonialsSetupPage"));
import FAQSetupPage from "@/pages/FAQSetupPage";

import OnboardingWelcomePage from "@/pages/OnboardingWelcomePage";
import WebsiteIntentPage from "@/pages/WebsiteIntentPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ResourcesSetupPage from "@/pages/ResourcesSetupPage";
// Removed front-end editing components:
// - SEOConfigManagerPage (static page SEO management)
// - BrandManagerPage (front-end branding)
// - BlueprintManagerPage/BlueprintManagementPage (page templates)
// - MediaManagementPage (front-end media library)
// - TenantCustomizationPage (front-end customization)
// - ThemeManagementPage (visual theming)
// - SiteBrandingPage (front-end branding)
// - MenuManagementPage (navigation management)
// - CreateNewPagePage (page creation)

// Preserved admin-only components for intelligence layer
import NewClientOnboarding from "@/pages/NewClientOnboarding";
import DomainMappingPage from "@/pages/DomainMappingPage";
import SotManagementPage from "@/pages/SotManagementPage";
import ConversationInsightsPage from "@/pages/ConversationInsightsPage";
import SocialMediaGeneratorPage from "@/pages/SocialMediaGeneratorPage";
import ContentStudioPage from "@/pages/ContentStudioPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AccountPage from "@/pages/AccountPage";
const AutopilotControlPanel = lazy(() => import("@/pages/AutopilotControlPanel"));
import BusinessNetworkPage from "@/pages/BusinessNetworkPage";
import BusinessDiscoverPage from "@/pages/BusinessDiscoverPage";
// Removed CloneTemplatePage (front-end templating)
import EntrepreneurSupportPage from "@/pages/EntrepreneurSupportPage";
import NavigationDemoPage from "@/pages/NavigationDemoPage";
// Support System pages
import AssistantPage from "@/pages/support/AssistantPage";
import TicketPage from "@/pages/support/TicketPage";
import DigestPage from "@/pages/support/DigestPage";
import SystemReadinessPage from "@/pages/support/SystemReadinessPage";
import SupportRequestsPage from "@/pages/admin/SupportRequestsPage";
import HealthDashboardPage from "@/pages/admin/HealthDashboardPage";
// Removed Page Builder components (front-end page building)
// Import wizard components
import CreateFormWizard from "@/pages/tools/wizards/CreateFormWizard";
import CreateCalculatorWizard from "@/pages/tools/wizards/CreateCalculatorWizard";
import CreateDashboardWizard from "@/pages/tools/wizards/CreateDashboardWizard";
import CreateEmbedWizard from "@/pages/tools/wizards/CreateEmbedWizard";

// Import tool pages
// DocumentHead and MainLayout already imported above
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";

// Protected routes with auth requirements
const ProtectedClientDashboard = withAuth(ClientDashboardPage, 'client');
const ProtectedCRMView = withAuth(CRMViewPage, 'staff');
const ProtectedCRMViewEnhanced = withAuth(CRMViewPageEnhanced, 'staff');
const ProtectedDashboard = withAuth(DashboardPage);
const ProtectedAdminSettings = withAuth(AdminSettingsPage, 'staff');
// Removed protected wrappers for front-end editing components

// Loading fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <Loader2 className="h-8 w-8 animate-spin text-white" />
  </div>
);

// Router for all application routes - Trimmed down for Hetzner v1 Release
function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/progress-design" component={ProgressHomePage} />
      <Route path="/client-register/:tenantId">
        <Suspense fallback={<LoadingFallback />}>
          <ClientRegistrationPage />
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
      <Route path="/services/:slug">
        <Suspense fallback={<LoadingFallback />}>
          <ServiceDetailPage />
        </Suspense>
      </Route>
      <Route path="/industries">
        <Suspense fallback={<LoadingFallback />}>
          <IndustriesPage />
        </Suspense>
      </Route>
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

      {/* Temporary demo route */}
      <Route path="/conversion-demo">
        <Suspense fallback={<LoadingFallback />}>
          <ConversionDemo />
        </Suspense>
      </Route>
      <Route path="/sme-support-hub">
        <Suspense fallback={<LoadingFallback />}>
          <SMESupportHubPage />
        </Suspense>
      </Route>
      <Route path="/business-calculator">
        <Suspense fallback={<LoadingFallback />}>
          <BusinessCalculatorPage />
        </Suspense>
      </Route>
      <Route path="/test-film">
        <Suspense fallback={<LoadingFallback />}>
          <TestFilmPage />
        </Suspense>
      </Route>
      <Route path="/why-us">
        <Suspense fallback={<LoadingFallback />}>
          <WhyUsPage />
        </Suspense>
      </Route>
      <Route path="/contact">
        <Suspense fallback={<LoadingFallback />}>
          <ContactPage />
        </Suspense>
      </Route>
      <Route path="/studio-banbury">
        <Suspense fallback={<LoadingFallback />}>
          <StudioBanburyPage />
        </Suspense>
      </Route>
      <Route path="/testimonials">
        <Suspense fallback={<LoadingFallback />}>
          <TestimonialsPage />
        </Suspense>
      </Route>
      <Route path="/privacy-policy">
        <Suspense fallback={<LoadingFallback />}>
          <PrivacyPolicyPage />
        </Suspense>
      </Route>
      <Route path="/terms-of-service">
        <Suspense fallback={<LoadingFallback />}>
          <TermsOfServicePage />
        </Suspense>
      </Route>
      <Route path="/cookie-policy">
        <Suspense fallback={<LoadingFallback />}>
          <CookiePolicyPage />
        </Suspense>
      </Route>
      <Route path="/professional-services">
        <Suspense fallback={<LoadingFallback />}>
          <ProfessionalServicesPage />
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
      {/* Removed front-end editing routes:
        - /admin/seo (static page SEO management)
        - /admin/brand (front-end branding)
        - /brand-center (brand management)
        - /admin/blueprint (page templates)
        - /admin/blueprint-management (template management)
        - /admin/tenant-customization (front-end customization)
        - /admin/theme-management (visual theming)
        - /admin/site-branding (front-end branding)
        - /admin/companion-settings (moved to phase 2)
        - /admin/menu-management (navigation management)
      */}
      <ProtectedRoute 
        path="/admin/marketplace" 
        component={AdminMarketplacePage} 
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
        path="/admin/autopilot" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <AutopilotControlPanel {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <SmartSiteDashboard {...props} />
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
        path="/admin/innovation-dashboard" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminInnovationDashboard {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/embed-code-generator" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminEmbedCodeGenerator {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/setup" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <SmartSiteSetupPanel {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />

      <ProtectedRoute 
        path="/admin/content/social-posts" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <SocialPostGenerator {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/market-intelligence" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <MarketIntelligencePanel {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/insight-app" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <InsightAppOnboarding {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/marketplace" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <MarketplacePlaceholder {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/feed-settings" 
        component={(props: Record<string, any>) => (
          <Suspense fallback={<LoadingFallback />}>
            <FeedSettings {...props} />
          </Suspense>
        )}
        allowedRoles={['admin', 'super_admin']} 
      />
      {/* Add redirect from /insights to the proper dashboard path */}
      <ProtectedRoute 
        path="/insights" 
        component={() => {
          // Simple redirect component
          window.location.href = "/admin/insights-dashboard";
          return <p>Redirecting to Insights Dashboard...</p>;
        }}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/insight-users" 
        component={InsightUsersPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/support-requests" 
        component={SupportRequestsPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/health-dashboard" 
        component={HealthDashboardPage} 
        allowedRoles={['admin', 'super_admin']} 
      />

      <ProtectedRoute 
        path="/admin/support-digests" 
        component={DigestPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/system-readiness" 
        component={SystemReadinessPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/analytics" 
        component={AnalyticsPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/new-request" 
        component={ScopeRequestPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Removed /admin/clone-template (front-end templating) */}
      {/* Removed /admin/onboarding (front-end templating) */}

      {/* Client dashboard routes - financial dashboard for Progress clients */}
      <ProtectedRoute 
        path="/client-dashboard" 
        component={ClientDashboardPage} 
        allowedRoles={['client', 'admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/client-portal" 
        component={ClientDashboardPage} 
        allowedRoles={['client', 'admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/account" 
        component={AccountPage} 
        allowedRoles={['client', 'admin', 'super_admin']}
      />

      {/* Analytics route with proper admin layout wrapping */}
      <ProtectedRoute 
        path="/admin/analytics" 
        component={AnalyticsPage} 
        allowedRoles={['admin', 'super_admin', 'editor']}
      />
      <ProtectedRoute 
        path="/analytics" 
        component={() => {
          const [, setLocation] = useLocation();
          useEffect(() => {
            setLocation('/admin/analytics');
          }, [setLocation]);
          return <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>;
        }}
        allowedRoles={['admin', 'super_admin', 'editor']}
      />

      {/* Tools and marketplace routes */}
      <ProtectedRoute path="/tools-dashboard" component={ToolsDashboardPage} />
      <ProtectedRoute path="/tools-hub" component={ToolsLandingPage} />
      <ProtectedRoute path="/tools/create/form" component={CreateFormWizard} />
      <ProtectedRoute path="/tools/create/calculator" component={CreateCalculatorWizard} />
      <ProtectedRoute path="/tools/create/dashboard" component={CreateDashboardWizard} />
      <ProtectedRoute path="/tools/create/embed" component={CreateEmbedWizard} />
      <ProtectedRoute 
        path="/admin/social-media-generator" 
        component={SocialMediaGeneratorPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/blog-post-generator" 
        component={BlogPostGenerator} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/content-studio" 
        component={ContentStudioPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Removed Business Network route for Hetzner deployment
      <ProtectedRoute 
        path="/business-network" 
        component={BusinessNetworkPage} 
        allowedRoles={['client', 'admin', 'super_admin', 'editor']} 
      />
      */}
      {/* Removed Business Discover route for Hetzner deployment
      <ProtectedRoute 
        path="/business-discover" 
        component={BusinessDiscoverPage} 
        allowedRoles={['client', 'admin', 'super_admin', 'editor']} 
      />
      */}
      {/* Removed Entrepreneur Support route for Hetzner deployment
      <ProtectedRoute 
        path="/entrepreneur-support" 
        component={EntrepreneurSupportPage}
        allowedRoles={['client', 'admin', 'super_admin']} 
      />
      */}
      {/* Removed Agora Profile test route for Hetzner deployment
      <Route path="/agora-profile-test">
        <Suspense fallback={<LoadingFallback />}>
          <AgoraProfileTestPage />
        </Suspense>
      </Route>
      */}
      <ProtectedRoute 
        path="/navigation-demo" 
        component={NavigationDemoPage}
        allowedRoles={['admin', 'super_admin']} 
      />
      {/* Temporarily removed Marketplace route for Hetzner deployment
      <ProtectedRoute path="/marketplace" component={EnhancedMarketplacePage} />
      */}
      {/* Removed My Tools route for Hetzner deployment
      <ProtectedRoute path="/my-tools" component={MyToolsPage} />
      */}
      <ProtectedRoute path="/installed-tools" component={InstalledToolsPage} />
      <ProtectedRoute path="/module-gallery" component={MarketplacePage} />
      <ProtectedRoute path="/module-library" component={ModuleLibraryPage} />
      <ProtectedRoute path="/tool-marketplace" component={ToolMarketplaceBrowserPage} allowedRoles={['admin', 'super_admin', 'editor']} />
      <ProtectedRoute path="/tools/marketplace" component={lazy(() => import('./pages/tools/marketplace'))} allowedRoles={['admin', 'super_admin', 'editor']} />

      {/* Onboarding and setup routes */}
      <ProtectedRoute path="/onboarding" component={OnboardingWelcomePage} />
      <ProtectedRoute path="/new-client-setup" component={NewClientOnboarding} />
      <ProtectedRoute path="/website-intent" component={WebsiteIntentPage} />
      <Route path="/studio-banbury" component={StudioPage} />
      <ProtectedRoute path="/scope-request" component={ScopeRequestPage} />
      <ProtectedRoute path="/brand-guidelines" component={BrandGuidelinesPage} />
      <Route path="/business-identity">
        <Suspense fallback={<LoadingFallback />}>
          <BusinessIdentityPage />
        </Suspense>
      </Route>

      {/* Removed all front-end editing routes:
        - /create-new-page (page creation)
        - /about-setup, /services-setup, /contact-setup, /testimonials-setup (page setup)
        - /faq-setup, /launch-ready (content setup)
        - /media (front-end media management)
        - All /page-builder routes (page building functionality)
      */}

      {/* Legacy Page Builder routes - now disabled to prevent routing conflicts */}
      {/* 
      <ProtectedRoute 
        path="/admin/page-builder" 
        component={PageBuilderListPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/page-builder/new" 
        component={PageBuilderPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/page-builder/:id" 
        component={PageBuilderPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      */}

      {/* Component demo route */}
      <Route path="/components" component={ComponentDemo} />

      {/* Fallback 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
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
  // FULL APP STRUCTURE
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
                      <DualModeCompanion />
                      <InstantHelpWidget />
                      <ContextSuggestion />
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

  /* DIAGNOSTIC MODE - USED FOR TROUBLESHOOTING
  return (
    <ErrorBoundary contentType="application">
      <QueryClientProvider client={queryClient}>
        <AuthProvider queryClient={queryClient}>
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
                      <DualModeCompanion />
                      <InstantHelpWidget />
                      <ContextSuggestion />
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
  */
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
      location.startsWith('/admin/social-media-generator') ||
      location.startsWith('/homepage-setup') || 
      location.startsWith('/foundation-pages') || 

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