import { lazy } from 'react';
import { Route } from "wouter";

// Lazy load public components
const HomePage = lazy(() => import("@/pages/HomePage"));
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
const IndustriesPage = lazy(() => import("@/pages/IndustriesPage"));
const WhyUsPage = lazy(() => import("@/pages/WhyUsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const ClientRegistrationPage = lazy(() => import("@/pages/ClientRegistrationPage"));
const StudioPage = lazy(() => import("@/pages/StudioPage"));

export function PublicRoutes() {
  return (
    <>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/client-register/:tenantId" component={ClientRegistrationPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:slug" component={ServiceDetailPage} />
      <Route path="/industries" component={IndustriesPage} />
      <Route path="/why-us" component={WhyUsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/studio-banbury" component={StudioPage} />
      <Route path="/" component={HomePage} />
    </>
  );
}