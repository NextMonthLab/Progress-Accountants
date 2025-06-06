import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import { DocumentHead } from "@/components/DocumentHead";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import CookieNotification from "@/components/CookieNotification";

// Eagerly loaded components for critical paths
import HomePage from "@/pages/HomePage";

// Lazy loaded public pages for better performance
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
const IndustriesPage = lazy(() => import("@/pages/IndustriesPage"));
const FilmIndustryPage = lazy(() => import("@/pages/FilmIndustryPage"));
const MusicIndustryPage = lazy(() => import("@/pages/MusicIndustryPage"));
const ConstructionIndustryPage = lazy(() => import("@/pages/ConstructionIndustryPage"));
const ProfessionalServicesPage = lazy(() => import("@/pages/ProfessionalServicesPage"));
const SMESupportHubPage = lazy(() => import("@/pages/SMESupportHubPage"));
const BusinessCalculatorPage = lazy(() => import("@/pages/BusinessCalculatorPage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const WhyUsPage = lazy(() => import("@/pages/WhyUsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const StudioBanburyPage = lazy(() => import("@/pages/StudioBanburyPage"));
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const StudioPage = lazy(() => import("@/pages/StudioPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));

// Create a standalone query client for static deployment
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  },
});

// Loading fallback component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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

      <Route path="/services/:slug">
        <Suspense fallback={<LoadingFallback />}>
          <ServiceDetailPage />
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

      {/* Industry pages */}
      <Route path="/industries">
        <Suspense fallback={<LoadingFallback />}>
          <IndustriesPage />
        </Suspense>
      </Route>

      <Route path="/industries/film">
        <Suspense fallback={<LoadingFallback />}>
          <FilmIndustryPage />
        </Suspense>
      </Route>

      <Route path="/industries/music">
        <Suspense fallback={<LoadingFallback />}>
          <MusicIndustryPage />
        </Suspense>
      </Route>

      <Route path="/industries/construction">
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionIndustryPage />
        </Suspense>
      </Route>

      <Route path="/industries/professional-services">
        <Suspense fallback={<LoadingFallback />}>
          <ProfessionalServicesPage />
        </Suspense>
      </Route>

      {/* Additional public pages */}
      <Route path="/sme-support-hub">
        <Suspense fallback={<LoadingFallback />}>
          <SMESupportHubPage />
        </Suspense>
      </Route>

      <Route path="/business-calculator">
        <Suspense fallback={<LoadingFallback />}>
          <BusinessCalculatorPage />
        </Suspense>
      </Route>

      <Route path="/news">
        <Suspense fallback={<LoadingFallback />}>
          <NewsPage />
        </Suspense>
      </Route>

      <Route path="/why-us">
        <Suspense fallback={<LoadingFallback />}>
          <WhyUsPage />
        </Suspense>
      </Route>

      <Route path="/studio-banbury">
        <Suspense fallback={<LoadingFallback />}>
          <StudioBanburyPage />
        </Suspense>
      </Route>

      <Route path="/studio">
        <Suspense fallback={<LoadingFallback />}>
          <StudioPage />
        </Suspense>
      </Route>

      <Route path="/blog">
        <Suspense fallback={<LoadingFallback />}>
          <BlogPage />
        </Suspense>
      </Route>

      <Route path="/resources">
        <Suspense fallback={<LoadingFallback />}>
          <ResourcesPage />
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

      <Route path="/cookie-policy">
        <Suspense fallback={<LoadingFallback />}>
          <CookiePolicyPage />
        </Suspense>
      </Route>

      {/* Catch-all for 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component for static deployment
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <DocumentHead />
          <div className="min-h-screen bg-white">
            <Router />
            <CookieNotification />
            <Toaster />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}