import { ReactNode } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProgressBanner } from "@/components/ProgressBanner";
import { CompanionConsole } from "@/components/support/CompanionConsole";
import AdminLayout from "@/layouts/AdminLayout";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  
  // Check if we should use admin layout based on URL path
  const isAdminRoute = 
    location.startsWith('/admin') || 
    location.startsWith('/client-dashboard') || 
    location.includes('-setup') || 
    location === '/brand-guidelines' || 
    location === '/business-identity' || 
    location === '/foundation-pages' || 
    location === '/marketplace' || 
    location === '/installed-tools' || 
    location === '/tools-hub' ||
    location === '/media' ||
    location === '/launch-ready' ||
    location === '/entrepreneur-support';
    
  // Public routes that should NEVER use AdminLayout even if logged in
  const alwaysPublicRoutes = [
    '/news',
    '/about',
    '/services',
    '/team',
    '/contact',
    '/testimonials',
    '/resources',
    '/studio-banbury',
    '/'
  ];
  
  // Special handling for routes that might have AdminLayout already applied
  // Certain routes are handled directly with their own layout
  const hasOwnLayout = 
    location === '/admin/conversation-insights' || 
    location === '/admin/insights-dashboard' || 
    location === '/admin/insight-users';
    
  // Use AdminLayout for admin routes, except those with their own layout and always public routes
  // CRITICAL FIX: Apply AdminLayout properly to admin routes
  if (isAdminRoute && !hasOwnLayout && !alwaysPublicRoutes.includes(location)) {
    console.log('Rendering admin layout for path:', location);
    return (
      <AdminLayout>
        {children}
      </AdminLayout>
    );
  }
  
  // Use standard layout for public-facing pages
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <div className="container mx-auto px-4 mb-6">
        <ProgressBanner />
      </div>
      <Footer />
      <CompanionConsole />
    </div>
  );
}
