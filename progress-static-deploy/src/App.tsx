import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";

// Eagerly loaded components for critical paths
import HomePage from "./pages/HomePage";

// Lazy loaded public pages for better performance
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));

// Loading fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// Public-only router for static deployment
function Router() {
  return (
    <Switch>
      {/* Core public pages */}
      <Route path="/" component={HomePage} />
      
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

      <Route path="/team">
        <Suspense fallback={<LoadingFallback />}>
          <TeamPage />
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

      {/* Legal pages */}
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

      {/* Catch-all for 404 */}
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

// Main App component for static deployment
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Progress Accountants - Expert Accounting Services</title>
        <meta name="description" content="Professional accounting services for forward-thinking businesses. Expert bookkeeping, tax planning, and financial advisory in Oxfordshire." />
        <meta name="keywords" content="accounting, bookkeeping, tax planning, financial advisory, Oxfordshire, business accounting" />
      </Helmet>
      <Router />
    </div>
  );
}