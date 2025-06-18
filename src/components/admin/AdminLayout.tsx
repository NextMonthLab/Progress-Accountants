import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { 
  LayoutGrid, 
  Settings, 
  Package, 
  CreditCard, 
  PieChart, 
  Users, 
  Bell,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

export function AdminLayout({ children, title, subtitle, breadcrumbs = [] }: AdminLayoutProps) {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutGrid className="h-5 w-5" />, href: '/admin/dashboard' },
    { label: 'Marketplace', icon: <Package className="h-5 w-5" />, href: '/admin/marketplace' },
    { label: 'Billing', icon: <CreditCard className="h-5 w-5" />, href: '/admin/billing' },
    { label: 'Analytics', icon: <PieChart className="h-5 w-5" />, href: '/admin/analytics' },
    { label: 'Users', icon: <Users className="h-5 w-5" />, href: '/admin/users' },
    { label: 'Notifications', icon: <Bell className="h-5 w-5" />, href: '/admin/notifications' },
    { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-teal-600">NextMonth Admin</h1>
          </div>
          <div className="mt-6 flex flex-col flex-1">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href}>
                  <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 group">
                    <div className="mr-3 text-gray-500">{item.icon}</div>
                    <span>{item.label}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Top header */}
        <header className="w-full py-4 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="bg-white px-4 sm:px-6 lg:px-8 py-2 border-b border-gray-200">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1 text-sm">
                <li>
                  <Link href="/admin/dashboard">
                    <a className="text-gray-500 hover:text-gray-700">Admin</a>
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    {index === breadcrumbs.length - 1 ? (
                      <span className="ml-1 text-gray-900 font-medium">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href}>
                        <a className="ml-1 text-gray-500 hover:text-gray-700">{crumb.label}</a>
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Card className="p-6">{children}</Card>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between text-sm text-gray-500">
            <p>© 2025 NextMonth Technology</p>
            <div className="flex space-x-4">
              <Link href="/admin/help">
                <a className="hover:text-gray-700">Help</a>
              </Link>
              <Link href="/admin/privacy">
                <a className="hover:text-gray-700">Privacy</a>
              </Link>
              <Link href="/admin/terms">
                <a className="hover:text-gray-700">Terms</a>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}