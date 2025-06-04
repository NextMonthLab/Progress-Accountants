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
import { UpgradeAnnouncement } from "@/components/UpgradeAnnouncement";
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
const BlueprintOnboardingPage = lazy(() => import("@/pages/BlueprintOnboardingPage"));
const ToolsLandingPage = lazy(() => import("@/pages/ToolsLandingPage"));
const ToolMarketplaceBrowserPage = lazy(() => import("@/pages/ToolMarketplaceBrowserPage"));
const ComponentDemo = lazy(() => import("@/pages/ComponentDemo"));
// More lazy loaded components - public pages
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
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
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));

// Admin interface pages
const InsightUsersPage = lazy(() => import("@/pages/InsightUsersPage"));
const InsightsDashboardPage = lazy(() => import("@/pages/InsightsDashboardPage"));
const SotManagerPage = lazy(() => import("@/pages/admin/SotManagerPage"));
const ScopeRequestPage = lazy(() => import("@/pages/ScopeRequestPage"));
const ModuleGalleryPage = lazy(() => import("@/pages/ModuleGalleryPage"));
const ModuleLibraryPage = lazy(() => import("@/pages/ModuleLibraryPage"));
const InstalledToolsPage = lazy(() => import("@/pages/InstalledToolsPage"));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage"));
const EnhancedMarketplacePage = lazy(() => import("@/pages/EnhancedMarketplacePage"));
const AdminMarketplacePage = lazy(() => import("@/pages/admin/marketplace"));
const MyToolsPage = lazy(() => import("@/pages/MyToolsPage"));

const BrandGuidelinesPage = lazy(() => import("@/pages/BrandGuidelinesPage"));
const BusinessIdentityPage = lazy(() => import("@/pages/BusinessIdentityPage"));
import HomepageSetupPage from "@/pages/HomepageSetupPage";
import FoundationPagesOverviewPage from "@/pages/FoundationPagesOverviewPage";
const AboutSetupPage = lazy(() => import("@/pages/AboutSetupPage"));
const ServicesSetupPage = lazy(() => import("@/pages/ServicesSetupPage"));
const ContactSetupPage = lazy(() => import("@/pages/ContactSetupPage"));
const TestimonialsSetupPage = lazy(() => import("@/pages/TestimonialsSetupPage"));
import FAQSetupPage from "@/pages/FAQSetupPage";
import LaunchReadyPage from "@/pages/LaunchReadyPage";
import OnboardingWelcomePage from "@/pages/OnboardingWelcomePage";
import WebsiteIntentPage from "@/pages/WebsiteIntentPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ResourcesSetupPage from "@/pages/ResourcesSetupPage";
import SEOConfigManagerPage from "@/pages/SEOConfigManagerPage";
import BrandManagerPage from "@/pages/BrandManagerPage";
import CompanionSettingsPage from "@/pages/admin/companion-settings";
import BlueprintManagerPage from "@/pages/BlueprintManagerPage";
import BlueprintManagementPage from "@/pages/BlueprintManagementPage";
import MediaManagementPage from "@/pages/MediaManagementPage";
import NewClientOnboarding from "@/pages/NewClientOnboarding";
import CreateNewPagePage from "@/pages/CreateNewPagePage";
// Admin settings pages
import TenantCustomizationPage from "@/pages/admin/TenantCustomizationPage";
import ThemeManagementPage from "@/pages/admin/ThemeManagementPage";
import SiteBrandingPage from "@/pages/admin/SiteBrandingPage";
import MenuManagementPage from "@/pages/admin/MenuManagementPage";
import DomainMappingPage from "@/pages/DomainMappingPage";
import SotManagementPage from "@/pages/SotManagementPage";
import ConversationInsightsPage from "@/pages/ConversationInsightsPage";
import SocialMediaGeneratorPage from "@/pages/SocialMediaGeneratorPage";
import ContentStudioPage from "@/pages/ContentStudioPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AccountPage from "@/pages/AccountPage";
import NewsPage from "@/pages/NewsPage";
import BusinessNetworkPage from "@/pages/BusinessNetworkPage";
import BusinessDiscoverPage from "@/pages/BusinessDiscoverPage";
import CloneTemplatePage from "@/pages/CloneTemplatePage";
import EntrepreneurSupportPage from "@/pages/EntrepreneurSupportPage";
import NavigationDemoPage from "@/pages/NavigationDemoPage";
// Support System pages
import AssistantPage from "@/pages/support/AssistantPage";
import TicketPage from "@/pages/support/TicketPage";
import DigestPage from "@/pages/support/DigestPage";
import SystemReadinessPage from "@/pages/support/SystemReadinessPage";
import SupportRequestsPage from "@/pages/admin/SupportRequestsPage";
import HealthDashboardPage from "@/pages/admin/HealthDashboardPage";
// Page Builder pages
import PageBuilderListPage from "@/pages/PageBuilderListPage";
import PageBuilderPage from "@/pages/PageBuilderPage";
// Import wizard components
import CreateFormWizard from "@/pages/tools/wizards/CreateFormWizard";
import CreateCalculatorWizard from "@/pages/tools/wizards/CreateCalculatorWizard";
import CreateDashboardWizard from "@/pages/tools/wizards/CreateDashboardWizard";
import CreateEmbedWizard from "@/pages/tools/wizards/CreateEmbedWizard";
import BlogPostGenerator from "@/pages/tools/blog-post-generator";
// Import tool pages
// DocumentHead and MainLayout already imported above
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";

// Protected routes with auth requirements
const ProtectedClientDashboard = withAuth(ClientDashboardPage, 'client');
const ProtectedCRMView = withAuth(CRMViewPage, 'staff');
const ProtectedCRMViewEnhanced = withAuth(CRMViewPageEnhanced, 'staff');
const ProtectedDashboard = withAuth(DashboardPage);
const ProtectedAdminSettings = withAuth(AdminSettingsPage, 'staff');
const ProtectedSEOConfigManager = withAuth(SEOConfigManagerPage, 'staff');
const ProtectedBrandManager = withAuth(BrandManagerPage, 'staff');
const ProtectedBlueprintManager = withAuth(BlueprintManagerPage, 'staff');
const ProtectedTenantCustomization = withAuth(TenantCustomizationPage, 'staff');
const ProtectedThemeManagement = withAuth(ThemeManagementPage, 'staff');

// Loading fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <Loader2 className="h-8 w-8 animate-spin text-[#36d1dc]" />
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
      <Route path="/news" component={NewsPage} />

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
        path="/admin/seo" 
        component={SEOConfigManagerPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/brand" 
        component={BrandManagerPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/brand-center" 
        component={BrandManagerPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/blueprint" 
        component={BlueprintManagerPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/marketplace" 
        component={AdminMarketplacePage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin/blueprint-management" 
        component={BlueprintManagementPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/tenant-customization" 
        component={TenantCustomizationPage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/theme-management" 
        component={ThemeManagementPage} 
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
      {/* Removed Agora Profile route for Hetzner deployment
      <ProtectedRoute 
        path="/admin/agora-profile" 
        component={AgoraProfilePage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      */}
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
      {/* Add dedicated route for /system-health */}
      <ProtectedRoute 
        path="/system-health" 
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
      <ProtectedRoute 
        path="/admin/clone-template" 
        component={CloneTemplatePage} 
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/admin/onboarding" 
        component={BlueprintOnboardingPage} 
        allowedRoles={['admin', 'super_admin']} 
      />

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
        path="/tools/blog-post-generator" 
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
      <ProtectedRoute path="/homepage-setup" component={HomepageSetupPage} />
      <Route path="/foundation-pages">
        <Suspense fallback={<LoadingFallback />}>
          <FoundationPagesOverviewPage />
        </Suspense>
      </Route>
      {/* Removed standalone page creation in favor of the Page Builder */}
      <ProtectedRoute path="/create-new-page" component={CreateNewPagePage} allowedRoles={['admin', 'super_admin', 'editor']} />
      <ProtectedRoute path="/about-setup" component={AboutSetupPage} />
      <ProtectedRoute path="/services-setup" component={ServicesSetupPage} />
      <ProtectedRoute path="/contact-setup" component={ContactSetupPage} />
      <ProtectedRoute path="/testimonials-setup" component={TestimonialsSetupPage} />
      {/* Resources setup now handled through the Page Builder */}
      {/* <ProtectedRoute path="/admin/resources-setup" component={ResourcesSetupPage} /> */}
      <ProtectedRoute path="/faq-setup" component={FAQSetupPage} />
      <ProtectedRoute path="/launch-ready" component={LaunchReadyPage} />
      <ProtectedRoute 
        path="/media"
        component={MediaManagementPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />

      {/* Page Builder routes */}
      <ProtectedRoute 
        path="/page-builder" 
        component={PageBuilderListPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Also support the old URL pattern for backwards compatibility */}
      <ProtectedRoute 
        path="/page-builder/new" 
        component={() => <PageBuilderPage />}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Fix for the "Create New Page" route */}
      <ProtectedRoute 
        path="/page-builder/page/new" 
        component={() => <PageBuilderPage />}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Route for existing pages with numeric IDs */}
      <ProtectedRoute 
        path="/page-builder/page/:id" 
        component={PageBuilderPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Templates gallery view */}
      <ProtectedRoute 
        path="/page-builder/templates" 
        component={() => <PageBuilderPage />}
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />

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
                      <UpgradeAnnouncement />
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
                      <UpgradeAnnouncement />
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