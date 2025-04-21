import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { TenantProvider } from "@/hooks/use-tenant";
import { PermissionsProvider } from "@/hooks/use-permissions";
import { UpgradeAnnouncement } from "@/components/UpgradeAnnouncement";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import HomePage from "@/pages/HomePage";
import StudioPage from "@/pages/StudioPage";
import DashboardPage from "@/pages/DashboardPage";
import ClientDashboardPage from "@/pages/ClientDashboardPage";
import CRMViewPage from "@/pages/CRMViewPage";
import CRMViewPageEnhanced from "@/pages/CRMViewPageEnhanced";
import ToolsDashboardPage from "@/pages/ToolsDashboardPage";
import ToolsLandingPage from "@/pages/ToolsLandingPage";
import ComponentDemo from "@/pages/ComponentDemo";
import TeamPage from "@/pages/TeamPage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import ContactPage from "@/pages/ContactPage";
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
import SEOConfigManagerPage from "@/pages/SEOConfigManagerPage";
import BrandManagerPage from "@/pages/BrandManagerPage";
import BlueprintManagerPage from "@/pages/BlueprintManagerPage";
import MediaManagementPage from "@/pages/MediaManagementPage";
import NewClientOnboarding from "@/pages/NewClientOnboarding";
// Admin settings pages
import TenantCustomizationPage from "@/pages/admin/TenantCustomizationPage";
import ThemeManagementPage from "@/pages/admin/ThemeManagementPage";
// Import wizard components
import CreateFormWizard from "@/pages/tools/wizards/CreateFormWizard";
import CreateCalculatorWizard from "@/pages/tools/wizards/CreateCalculatorWizard";
import CreateDashboardWizard from "@/pages/tools/wizards/CreateDashboardWizard";
import CreateEmbedWizard from "@/pages/tools/wizards/CreateEmbedWizard";
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
      <Route path="/super-admin" component={SuperAdminDashboard} />
      <Route path="/" component={HomePage} />
      <Route path="/onboarding" component={OnboardingWelcomePage} />
      <Route path="/new-client-setup" component={NewClientOnboarding} />
      <Route path="/website-intent" component={WebsiteIntentPage} />
      <Route path="/studio-banbury" component={StudioPage} />
      <Route path="/client-dashboard" component={ProtectedDashboard} />
      <Route path="/client-portal" component={ProtectedClientDashboard} />
      <Route path="/tools-dashboard" component={ToolsDashboardPage} />
      <Route path="/tools-hub" component={ToolsLandingPage} />
      {/* Tool wizard routes */}
      <Route path="/tools/create/form" component={CreateFormWizard} />
      <Route path="/tools/create/calculator" component={CreateCalculatorWizard} />
      <Route path="/tools/create/dashboard" component={CreateDashboardWizard} />
      <Route path="/tools/create/embed" component={CreateEmbedWizard} />
      <Route path="/admin/crm" component={ProtectedCRMView} />
      <Route path="/admin/crm-enhanced" component={ProtectedCRMViewEnhanced} />
      <Route path="/components" component={ComponentDemo} />
      <Route path="/team" component={TeamPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/new-request" component={ScopeRequestPage} />
      <Route path="/admin/settings" component={ProtectedAdminSettings} />
      <Route path="/admin/seo" component={ProtectedSEOConfigManager} />
      <Route path="/admin/brand" component={ProtectedBrandManager} />
      <Route path="/admin/blueprint" component={ProtectedBlueprintManager} />
      <Route path="/admin/tenant-customization" component={ProtectedTenantCustomization} />
      <Route path="/admin/theme-management" component={ProtectedThemeManagement} />
      <Route path="/scope-request" component={ScopeRequestPage} />
      <Route path="/marketplace" component={EnhancedMarketplacePage} />
      <Route path="/installed-tools" component={InstalledToolsPage} />
      {/* Legacy routes for backward compatibility */}
      <Route path="/module-gallery" component={MarketplacePage} />
      <Route path="/module-library" component={ModuleLibraryPage} />
      <Route path="/brand-guidelines" component={BrandGuidelinesPage} />
      <Route path="/business-identity" component={BusinessIdentityPage} />
      <Route path="/homepage-setup" component={HomepageSetupPage} />
      <Route path="/foundation-pages" component={FoundationPagesOverviewPage} />
      <Route path="/about-setup" component={AboutSetupPage} />
      <Route path="/services-setup" component={ServicesSetupPage} />
      <Route path="/contact-setup" component={ContactSetupPage} />
      <Route path="/testimonials-setup" component={TestimonialsSetupPage} />
      <Route path="/faq-setup" component={FAQSetupPage} />
      <Route path="/launch-ready" component={LaunchReadyPage} />
      <Route path="/media" component={MediaManagementPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
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
              <DocumentHead route="/" />
              <FirstTimeUserDetector>
                <MainLayout>
                  <Router />
                </MainLayout>
              </FirstTimeUserDetector>
              <UpgradeAnnouncement />
              <Toaster />
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
    if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor') return;
    
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
      location.startsWith('/homepage-setup') || 
      location.startsWith('/foundation-pages') || 
      location.startsWith('/launch-ready') ||
      location.startsWith('/marketplace');
    
    // If we need to redirect to onboarding
    if (!onboardingComplete && !isAllowedPath) {
      navigate('/onboarding');
    }
  }, [user, location, navigate]);

  return <>{children}</>;
}

export default App;
