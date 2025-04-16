import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import StudioPage from "@/pages/StudioPage";
import DashboardPage from "@/pages/DashboardPage";
import ClientDashboardPage from "@/pages/ClientDashboardPage";
import CRMViewPage from "@/pages/CRMViewPage";
import ComponentDemo from "@/pages/ComponentDemo";
import DocumentHead from "@/components/DocumentHead";
import MainLayout from "@/layouts/MainLayout";
import { ClientDataProvider, withAuth } from "@/components/ClientDataProvider";

// Protected routes with auth requirements
const ProtectedClientDashboard = withAuth(ClientDashboardPage, 'client');
const ProtectedCRMView = withAuth(CRMViewPage, 'staff');
const ProtectedDashboard = withAuth(DashboardPage);

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/studio-banbury" component={StudioPage} />
      <Route path="/client-dashboard" component={ProtectedDashboard} />
      <Route path="/client-portal" component={ProtectedClientDashboard} />
      <Route path="/admin/crm" component={ProtectedCRMView} />
      <Route path="/components" component={ComponentDemo} />
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
