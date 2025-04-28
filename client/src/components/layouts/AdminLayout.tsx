import React, { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Settings, 
  Home, 
  Users, 
  FileText, 
  Layers, 
  Database, 
  CloudUpload,
  BarChart3,
  MessageSquare,
  PieChart,
  Wrench as Tool,
  Layout,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AdminLayoutProps = {
  children: ReactNode;
};

/**
 * Admin Layout Component
 * Provides consistent layout for admin pages with navigation sidebar
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/admin/brand', label: 'Brand', icon: <Layers className="h-5 w-5" /> },
    { path: '/admin/pages', label: 'Pages', icon: <FileText className="h-5 w-5" /> },
    { path: '/admin/tools', label: 'Tools', icon: <Tool className="h-5 w-5" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
    { path: '/admin/reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/admin/chat', label: 'Support', icon: <MessageSquare className="h-5 w-5" /> },
    { path: '/admin/sot', label: 'SOT', icon: <CloudUpload className="h-5 w-5" /> },
    { path: '/admin/insights', label: 'Insights', icon: <PieChart className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-border bg-card">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/admin">
              <span className="flex items-center">
                <Layout className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold">Progress Admin</span>
              </span>
            </Link>
          </div>
          
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <span
                      className={`flex items-center px-4 py-3 text-sm rounded-md cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 p-4 border-t border-border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user?.username || 'User'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{user?.username || 'User'}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}