import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/components/ClientDataProvider";
import { UpgradeAnnouncement } from "@/components/UpgradeAnnouncement";
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
import MarketplacePage from "@/pages/EnhancedMarketplacePage";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/onboarding" component={OnboardingWelcomePage} />
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
      <Route path="/scope-request" component={ScopeRequestPage} />
      <Route path="/module-gallery" component={ModuleGalleryPage} />
      <Route path="/module-library" component={ModuleLibraryPage} />
      <Route path="/marketplace" component={MarketplacePage} />
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

function App() {
  return (
    <ClientDataProvider>
      <ThemeProvider>
        <DocumentHead route="/" />
        <FirstTimeUserDetector>
          <MainLayout>
            <Router />
          </MainLayout>
        </FirstTimeUserDetector>
        <UpgradeAnnouncement />
        <Toaster />
      </ThemeProvider>
    </ClientDataProvider>
  );
}

// Component to detect first-time users and redirect to onboarding
function FirstTimeUserDetector({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { userId, userType } = useAuth();
  
  // Query the user's onboarding state
  const { data: onboardingState, isLoading } = useQuery({
    queryKey: [`/api/onboarding/${userId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/onboarding/${userId}`);
        if (!response.ok) return null;
        return response.json();
      } catch (error) {
        console.error("Error fetching onboarding state:", error);
        return null;
      }
    },
  });

  // Query current location
  const [location] = useLocation();
  
  // Only redirect client users who don't have complete onboarding
  useEffect(() => {
    // For demo purposes, we'll redirect based on simple localStorage check
    // In a production environment, this would use the onboardingState from the backend
    const onboardingComplete = localStorage.getItem('project_context.status') === 'onboarded';
    
    // Check for client user and incomplete onboarding
    if (userType === 'client' && 
        !onboardingComplete &&
        location !== '/onboarding' && 
        location !== '/website-intent' && // Add the new page to excluded redirects
        location !== '/client-portal' && // Allow client portal for 'tools only' users
        location !== '/tools-dashboard' && // Allow tools dashboard for 'tools only' users
        location !== '/tools-hub' && // Allow tools hub for 'tools only' users
        !location.startsWith('/tools/create/') && // Allow tool wizards for 'tools only' users
        !location.startsWith('/homepage-setup') && 
        !location.startsWith('/foundation-pages') && 
        !location.startsWith('/launch-ready') &&
        !location.startsWith('/marketplace')) {
      
      // Redirect to onboarding
      navigate('/onboarding');
    }
  }, [userType, location, navigate]);

  return <>{children}</>;
}

export default App;
