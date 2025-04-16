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
import DocumentHead from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";

// Protected routes with auth requirements
const ProtectedClientDashboard = withAuth(ClientDashboardPage, 'client');
const ProtectedCRMView = withAuth(CRMViewPage, 'staff');
const ProtectedCRMViewEnhanced = withAuth(CRMViewPageEnhanced, 'staff');
const ProtectedDashboard = withAuth(DashboardPage);

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClientDataProvider>
      <DocumentHead />
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </ClientDataProvider>
  );
}

export default App;
