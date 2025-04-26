import { lazy } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load tools and marketplace components
const ToolsDashboardPage = lazy(() => import("@/pages/ToolsDashboardPage"));
const ToolsLandingPage = lazy(() => import("@/pages/ToolsLandingPage"));
const CreateFormWizard = lazy(() => import("@/pages/tools/wizards/CreateFormWizard"));
const CreateCalculatorWizard = lazy(() => import("@/pages/tools/wizards/CreateCalculatorWizard"));
const CreateDashboardWizard = lazy(() => import("@/pages/tools/wizards/CreateDashboardWizard"));
const CreateEmbedWizard = lazy(() => import("@/pages/tools/wizards/CreateEmbedWizard"));
const SocialMediaGeneratorPage = lazy(() => import("@/pages/SocialMediaGeneratorPage"));
const BlogPostGenerator = lazy(() => import("@/pages/tools/blog-post-generator"));
const ContentStudioPage = lazy(() => import("@/pages/ContentStudioPage"));
const BusinessNetworkPage = lazy(() => import("@/pages/BusinessNetworkPage"));
const BusinessDiscoverPage = lazy(() => import("@/pages/BusinessDiscoverPage"));
const EntrepreneurSupportPage = lazy(() => import("@/pages/EntrepreneurSupportPage"));
const EnhancedMarketplacePage = lazy(() => import("@/pages/EnhancedMarketplacePage"));
const InstalledToolsPage = lazy(() => import("@/pages/InstalledToolsPage"));
const ModuleGalleryPage = lazy(() => import("@/pages/ModuleGalleryPage"));
const ModuleLibraryPage = lazy(() => import("@/pages/ModuleLibraryPage"));
const ToolMarketplaceBrowserPage = lazy(() => import("@/pages/ToolMarketplaceBrowserPage"));

export function ToolsRoutes() {
  return (
    <>
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
      <ProtectedRoute path="/marketplace" component={EnhancedMarketplacePage} />
      <ProtectedRoute path="/installed-tools" component={InstalledToolsPage} />
      <ProtectedRoute path="/module-gallery" component={ModuleGalleryPage} />
      <ProtectedRoute path="/module-library" component={ModuleLibraryPage} />
      <ProtectedRoute 
        path="/tool-marketplace" 
        component={ToolMarketplaceBrowserPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
    </>
  );
}