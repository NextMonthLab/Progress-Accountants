import { lazy, Suspense } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";

// EMERGENCY FIX: Direct import critical admin pages to avoid lazy loading issues
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import EntrepreneurSupport from "@/pages/admin/EntrepreneurSupport";

// Lazy load remaining components
const SuperAdminDashboard = lazy(() => import("@/pages/super-admin/SuperAdminDashboard"));
const CRMViewPage = lazy(() => import("@/pages/CRMViewPage"));
const CRMViewPageEnhanced = lazy(() => import("@/pages/CRMViewPageEnhanced"));
const AdminSettingsPage = lazy(() => import("@/pages/AdminSettingsPage"));
const SEOConfigManagerPage = lazy(() => import("@/pages/SEOConfigManagerPage"));
const BrandManagerPage = lazy(() => import("@/pages/BrandManagerPage"));
const BlueprintManagerPage = lazy(() => import("@/pages/BlueprintManagerPage"));
const BlueprintManagementPage = lazy(() => import("@/pages/BlueprintManagementPage"));
const TenantCustomizationPage = lazy(() => import("@/pages/admin/TenantCustomizationPage"));
const ThemeManagementPage = lazy(() => import("@/pages/admin/ThemeManagementPage"));
const SiteBrandingPage = lazy(() => import("@/pages/admin/SiteBrandingPage"));
const CompanionSettingsPage = lazy(() => import("@/pages/admin/companion-settings"));
const MenuManagementPage = lazy(() => import("@/pages/admin/MenuManagementPage"));
const DomainMappingPage = lazy(() => import("@/pages/DomainMappingPage"));
const SotManagementPage = lazy(() => import("@/pages/SotManagementPage"));
// Import the EntrepreneurSupportPage component for admin routes
const ConversationInsightsPage = lazy(() => import("@/pages/ConversationInsightsPage"));
const InsightsDashboardPage = lazy(() => import("@/pages/InsightsDashboardPage"));
const InsightUsersPage = lazy(() => import("@/pages/InsightUsersPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const ScopeRequestPage = lazy(() => import("@/pages/ScopeRequestPage"));
const CloneTemplatePage = lazy(() => import("@/pages/CloneTemplatePage"));
const MediaManagementPage = lazy(() => import("@/pages/MediaManagementPage"));
// Removed Image Optimization Demo page in favor of background optimization

// Page builder pages
const PageBuilderListPage = lazy(() => import("@/pages/PageBuilderListPage"));
const PageBuilderPage = lazy(() => import("@/pages/PageBuilderPage"));

export function AdminRoutes() {
  return (
    <>
      {/* Add index route for admin - EMERGENCY FIX */}
      <ProtectedRoute 
        path="/admin" 
        component={AdminDashboardPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      {/* Super Admin routes (require super admin privileges) */}
      <ProtectedRoute 
        path="/super-admin" 
        component={SuperAdminDashboard} 
        requireSuperAdmin={true} 
      />
      
      {/* Admin routes (require admin or super admin) */}
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
      {/* Support both formats for emergency access */}
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={AdminDashboardPage} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin-dashboard" 
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
      <ProtectedRoute 
        path="/media" 
        component={MediaManagementPage} 
      />
      
      {/* Entrepreneur Support routes - both formats */}
      <ProtectedRoute 
        path="/admin/entrepreneur-support" 
        component={EntrepreneurSupport} 
        allowedRoles={['admin', 'super_admin', 'editor']} 
      />
      <ProtectedRoute 
        path="/admin-entrepreneur-support" 
        component={EntrepreneurSupport} 
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
    </>
  );
}