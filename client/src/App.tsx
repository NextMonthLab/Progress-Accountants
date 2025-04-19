import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import StudioPage from "@/pages/StudioPage";
import DashboardPage from "@/pages/DashboardPage";
import ClientDashboardPage from "@/pages/ClientDashboardPage";
import CRMViewPage from "@/pages/CRMViewPage";
import CRMViewPageEnhanced from "@/pages/CRMViewPageEnhanced";
import ComponentDemo from "@/pages/ComponentDemo";
import TeamPage from "@/pages/TeamPage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import ContactPage from "@/pages/ContactPage";
import ScopeRequestPage from "@/pages/ScopeRequestPage";
import ModuleGalleryPage from "@/pages/ModuleGalleryPage";
import ModuleLibraryPage from "@/pages/ModuleLibraryPage";
import MarketplacePage from "@/pages/MarketplacePage.fixed";
import BrandGuidelinesPage from "@/pages/BrandGuidelinesPage";
import BusinessIdentityPage from "@/pages/BusinessIdentityPage";
import HomepageSetupPage from "@/pages/HomepageSetupPage";
import FoundationPagesOverviewPage from "@/pages/FoundationPagesOverviewPage";
import LaunchReadyPage from "@/pages/LaunchReadyPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import SEOConfigManagerPage from "@/pages/SEOConfigManagerPage";
import BrandManagerPage from "@/pages/BrandManagerPage";
import BlueprintManagerPage from "@/pages/BlueprintManagerPage";
import { DocumentHead } from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/studio-banbury" component={StudioPage} />
      <Route path="/client-dashboard" component={ProtectedDashboard} />
      <Route path="/client-portal" component={ProtectedClientDashboard} />
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
      <Route path="/launch-ready" component={LaunchReadyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClientDataProvider>
      <DocumentHead route="/" />
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </ClientDataProvider>
  );
}

export default App;
