import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

import ProgressHomePage from "@/pages/ProgressHomePage";

// Lazy load other pages
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Simple loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );
}

// No query client needed for static site

function Router() {
  return (
    <Switch>
      {/* Progress Accountants Public Pages */}
      <Route path="/" component={ProgressHomePage} />
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
      
      {/* 404 fallback */}
      <Route>
        <Suspense fallback={<LoadingFallback />}>
          <NotFound />
        </Suspense>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Router />
    </div>
  );
}