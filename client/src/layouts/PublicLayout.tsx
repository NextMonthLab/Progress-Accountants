import React from 'react';
import { Link } from 'wouter';
import { useBusinessIdentity } from '@/hooks/use-business-identity';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showNavbar?: boolean;
}

export function PublicLayout({ children, showFooter = true, showNavbar = true }: PublicLayoutProps) {
  const { businessIdentity } = useBusinessIdentity();
  const businessName = businessIdentity?.core?.businessName || 'Progress Accountants';

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {showFooter && (
        <Footer />
      )}
    </div>
  );
}

export default PublicLayout;