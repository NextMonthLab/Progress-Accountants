import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Home, Settings, Users, FileText, BarChart, Package, Database } from 'lucide-react';

// A very simplified sidebar component that focuses only on functionality
const SimpleSidebar: React.FC = () => {
  const [location] = useLocation();
  
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + '/');
  };
  
  // Add relevant admin items
  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
    { href: '/admin/pages', label: 'Pages', icon: <FileText className="w-4 h-4 mr-2" /> },
    { href: '/admin/sot-management', label: 'SOT Management', icon: <Database className="w-4 h-4 mr-2" /> },
    { href: '/admin/analytics', label: 'Analytics', icon: <BarChart className="w-4 h-4 mr-2" /> },
    { href: '/admin/marketplace', label: 'Marketplace', icon: <Package className="w-4 h-4 mr-2" /> },
    { href: '/admin/inventory', label: 'Site Inventory', icon: <Database className="w-4 h-4 mr-2" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4 mr-2" /> }
  ];
  
  return (
    <div className="w-64 h-screen border-r flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b">
        <Link href="/admin/dashboard" className="font-bold text-lg text-gray-900 no-underline">
          Progress Admin
        </Link>
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium no-underline",
                isActive(item.href)
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleSidebar;