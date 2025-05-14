import React, { ReactNode } from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href: string;
};

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

const AdminLayout = ({
  children,
  pageTitle,
  breadcrumbs = [],
  actions,
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin header with NextMonth branding */}
      <header className="bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl font-bold">NextMonth Admin</h1>
        </div>
      </header>

      {/* Breadcrumbs and page title */}
      <div className="bg-white border-b py-4 px-6 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  {breadcrumbs.map((item, index) => (
                    <li key={item.href} className="inline-flex items-center">
                      {index > 0 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
                      )}
                      <Link 
                        href={item.href}
                        className={`inline-flex items-center text-sm font-medium ${
                          index === breadcrumbs.length - 1
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-foreground mt-2">{pageTitle}</h1>
            </div>
            {actions && <div className="flex justify-end">{actions}</div>}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main>{children}</main>

      {/* Admin footer */}
      <footer className="bg-background border-t py-4 px-6 mt-10">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NextMonth. Admin interface for Progress Smart Site.</p>
          <p className="mt-1 text-xs">All tools provided are subject to NextMonth terms of service.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;