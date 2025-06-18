import { lazy } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load client-specific components
const ClientDashboardPage = lazy(() => import("@/pages/ClientDashboardPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const OnboardingWelcomePage = lazy(() => import("@/pages/OnboardingWelcomePage"));
const NewClientOnboarding = lazy(() => import("@/pages/NewClientOnboarding"));
const WebsiteIntentPage = lazy(() => import("@/pages/WebsiteIntentPage"));
const BrandGuidelinesPage = lazy(() => import("@/pages/BrandGuidelinesPage"));
const BusinessIdentityPage = lazy(() => import("@/pages/BusinessIdentityPage"));
const HomepageSetupPage = lazy(() => import("@/pages/HomepageSetupPage"));
const FoundationPagesOverviewPage = lazy(() => import("@/pages/FoundationPagesOverviewPage"));
const AboutSetupPage = lazy(() => import("@/pages/AboutSetupPage"));
const ServicesSetupPage = lazy(() => import("@/pages/ServicesSetupPage"));
const ContactSetupPage = lazy(() => import("@/pages/ContactSetupPage"));
const TestimonialsSetupPage = lazy(() => import("@/pages/TestimonialsSetupPage"));
const FAQSetupPage = lazy(() => import("@/pages/FAQSetupPage"));
const LaunchReadyPage = lazy(() => import("@/pages/LaunchReadyPage"));

export function ClientRoutes() {
  return (
    <>
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
      
      {/* Onboarding and setup routes */}
      <ProtectedRoute path="/onboarding" component={OnboardingWelcomePage} />
      <ProtectedRoute path="/new-client-setup" component={NewClientOnboarding} />
      <ProtectedRoute path="/website-intent" component={WebsiteIntentPage} />
      <ProtectedRoute path="/brand-guidelines" component={BrandGuidelinesPage} />
      <ProtectedRoute path="/business-identity" component={BusinessIdentityPage} />
      <ProtectedRoute path="/homepage-setup" component={HomepageSetupPage} />
      <ProtectedRoute path="/foundation-pages" component={FoundationPagesOverviewPage} />
      <ProtectedRoute path="/about-setup" component={AboutSetupPage} />
      <ProtectedRoute path="/services-setup" component={ServicesSetupPage} />
      <ProtectedRoute path="/contact-setup" component={ContactSetupPage} />
      <ProtectedRoute path="/testimonials-setup" component={TestimonialsSetupPage} />
      <ProtectedRoute path="/faq-setup" component={FAQSetupPage} />
      <ProtectedRoute path="/launch-ready" component={LaunchReadyPage} />
    </>
  );
}