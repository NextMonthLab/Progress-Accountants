import React, { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { AdminLayoutV2 } from '@/components/admin-ui/AdminLayout';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

/**
 * AdminLayout Component
 * Redirects to the new AdminLayoutV2 component for consistency
 */
export function AdminLayout({ 
  children, 
  title = 'Admin Dashboard', 
  showBackButton = false 
}: AdminLayoutProps) {
  return (
    <AdminLayoutV2 title={title} showBackButton={showBackButton}>
      {children}
    </AdminLayoutV2>
  );
}