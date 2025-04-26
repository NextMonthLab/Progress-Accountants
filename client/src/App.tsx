import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { TenantProvider } from "@/hooks/use-tenant";
import { PermissionsProvider } from "@/hooks/use-permissions";
import { CompanionContextProvider } from "@/hooks/use-companion-context";
import { DualModeCompanion } from "@/components/companions/DualModeCompanion";
import { UpgradeAnnouncement } from "@/components/UpgradeAnnouncement";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import { testLogin } from "@/lib/test-login";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import HomePage from "@/pages/HomePage";
import StudioPage from "@/pages/StudioPage";
import DashboardPage from "@/pages/DashboardPage";
import AuthPage from "@/pages/AuthPage";
import ClientRegistrationPage from "@/pages/ClientRegistrationPage";
import ClientDashboardPage from "@/pages/ClientDashboardPage";
import ClientDashboardPage2 from "@/pages/ClientDashboardPage2";
import RedesignedDashboardPage from "@/pages/RedesignedDashboardPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import CRMViewPage from "@/pages/CRMViewPage";
import CRMViewPageEnhanced from "@/pages/CRMViewPageEnhanced";
import ToolsDashboardPage from "@/pages/ToolsDashboardPage";
import ToolsLandingPage from "@/pages/ToolsLandingPage";
import ToolMarketplaceBrowserPage from "@/pages/ToolMarketplaceBrowserPage";
import ComponentDemo from "@/pages/ComponentDemo";
import TeamPage from "@/pages/TeamPage";
import InsightUsersPage from "@/pages/InsightUsersPage";
import InsightsDashboardPage from "@/pages/InsightsDashboardPage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import IndustriesPage from "@/pages/IndustriesPage";
import WhyUsPage from "@/pages/WhyUsPage";
import ContactPage from "@/pages/ContactPage";
import TestimonialsPage from "@/pages/TestimonialsPage";
import ScopeRequestPage from "@/pages/ScopeRequestPage";
import ModuleGalleryPage from "@/pages/ModuleGalleryPage";
import ModuleLibraryPage from "@/pages/ModuleLibraryPage";
import InstalledToolsPage from "@/pages/InstalledToolsPage";
import MarketplacePage from "@/pages/MarketplacePage";
import EnhancedMarketplacePage from "@/pages/EnhancedMarketplacePage";
import BrandGuidelinesPage from "@/pages/BrandGuidelinesPage";
import BusinessIdentityPage from "@/pages/BusinessIdentityPage";
import HomepageSetupPage from "@/pages/HomepageSetupPage";
import FoundationPagesOverviewPage from "@/pages/FoundationPagesOverviewPage";
import AboutSetupPage from "@/pages/AboutSetupPage";
import ServicesSetupPage from "@/pages/ServicesSetupPage";
import ContactSetupPage from "@/pages/ContactSetupPage";
import TestimonialsSetupPage from "@/pages/TestimonialsSetupPage";
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
import { DocumentHead } from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

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

// Router for all application routes
function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/client-register/:tenantId" component={ClientRegistrationPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/industries" component={IndustriesPage} />
      <Route path="/why-us" component={WhyUsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/" component={HomePage} />

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
        path="/admin/blueprint" 
        component={BlueprintManagerPage} 
        allowedRoles={['admin', 'super_admin']} 
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
      <ProtectedRoute 
        path="/admin/insight-users" 
        component={InsightUsersPage} 
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
      
      {/* Tools and marketplace routes */}
      <ProtectedRoute path="/tools-dashboard" component={ToolsDashboardPage} />
      <ProtectedRoute path="/tools-hub" component={ToolsLandingPage} />
      <ProtectedRoute path="/tools/create/form" component={CreateFormWizard} />
      <ProtectedRoute path="/tools/create/calculator" component={CreateCalculatorWizard} />
      <ProtectedRoute path="/tools/create/dashboard" component={CreateDashboardWizard} />
      <ProtectedRoute path="/tools/create/embed" component={CreateEmbedWizard} />
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
      <ProtectedRoute 
        path="/content-studio" 
        component={ContentStudioPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/business-network" 
        component={BusinessNetworkPage} 
        allowedRoles={['client', 'admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/business-discover" 
        component={BusinessDiscoverPage} 
        allowedRoles={['client', 'admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/entrepreneur-support" 
        component={EntrepreneurSupportPage}
        allowedRoles={['client', 'admin', 'super_admin']} 
      />
      <ProtectedRoute 
        path="/navigation-demo" 
        component={NavigationDemoPage}
        allowedRoles={['admin', 'super_admin']} 
      />
      <ProtectedRoute path="/marketplace" component={EnhancedMarketplacePage} />
      <ProtectedRoute path="/installed-tools" component={InstalledToolsPage} />
      <ProtectedRoute path="/module-gallery" component={MarketplacePage} />
      <ProtectedRoute path="/module-library" component={ModuleLibraryPage} />
      <ProtectedRoute path="/tool-marketplace" component={ToolMarketplaceBrowserPage} allowedRoles={['admin', 'super_admin', 'editor']} />
      
      {/* Onboarding and setup routes */}
      <ProtectedRoute path="/onboarding" component={OnboardingWelcomePage} />
      <ProtectedRoute path="/new-client-setup" component={NewClientOnboarding} />
      <ProtectedRoute path="/website-intent" component={WebsiteIntentPage} />
      <Route path="/studio-banbury" component={StudioPage} />
      <ProtectedRoute path="/scope-request" component={ScopeRequestPage} />
      <ProtectedRoute path="/brand-guidelines" component={BrandGuidelinesPage} />
      <ProtectedRoute path="/business-identity" component={BusinessIdentityPage} />
      <ProtectedRoute path="/homepage-setup" component={HomepageSetupPage} />
      <ProtectedRoute path="/foundation-pages" component={FoundationPagesOverviewPage} />
      {/* Removed standalone page creation in favor of the Page Builder */}
      {/* <ProtectedRoute path="/create-new-page" component={CreateNewPagePage} allowedRoles={['admin', 'super_admin', 'editor']} /> */}
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
      <ProtectedRoute 
        path="/page-builder/new" 
        component={PageBuilderPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/page-builder/:id" 
        component={PageBuilderPage} 
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider queryClient={queryClient}>
        <PermissionsProvider>
          <ThemeProvider>
            <TenantProvider>
              <CompanionContextProvider>
                <DocumentHead route="/" />
                <FirstTimeUserDetector>
                  <MainLayout>
                    <Router />
                  </MainLayout>
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
