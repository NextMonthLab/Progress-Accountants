import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { NavItem, GradientButton } from './AdminButtons';
import { ThemeToggle } from './AdminCard';
import { SmartContextBanner } from './SmartContextBanner';
import { 
  Settings, 
  LayoutDashboard,
  FileText,
  Users,
  BarChart,
  ShoppingBag,
  RefreshCcw,
  Bell,
  LogOut,
  ChevronDown,
  Wallet,
  PaintBucket,
  LineChart,
  Database,
  Briefcase,
  Sun,
  Moon
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  hideHeader?: boolean;
  fullWidth?: boolean;
}

/**
 * AdminLayout component following the NextMonth Gold UI design system
 */
export function AdminLayoutV2({ 
  children, 
  title,
  description,
  showBackButton = false,
  hideHeader = false,
  fullWidth = false
}: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [activePage, setActivePage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Set active page based on location
  useEffect(() => {
    if (location.includes('leads')) {
      setActivePage('lead-intelligence');
    } else if (location.includes('developer')) {
      setActivePage('developer-tools');
    } else if (location.includes('marketplace')) {
      setActivePage('marketplace');
    } else if (location.includes('sot')) {
      setActivePage('sot-integration');
    } else if (location.includes('financial')) {
      setActivePage('financial');
    } else if (location.includes('creative')) {
      setActivePage('creative');
    } else if (location.includes('sales')) {
      setActivePage('sales');
    }
  }, [location]);
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate('/auth')
    });
  };
  
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // This would typically toggle a class on the document or use a context
  };
  
  // Site progress for the progress indicator
  const siteProgress = 40; // This would be calculated based on completed tasks

  return (
    <div className={`flex flex-col min-h-screen admin-layout ${isDarkTheme ? 'dark bg-black' : 'bg-gray-50'}`} data-admin="true">
      {/* Top Navigation */}
      <header className="dark:border-[#1D1D1D] border-gray-200 z-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center h-16">
            {/* Logo or brand */}
            <div className="mr-8">
              <span className="font-bold text-lg dark:text-white text-gray-900">
                SmartSite <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Admin</span>
              </span>
            </div>
            
            {/* Left navigation */}
            <nav className="flex space-x-2">
              <NavItem 
                label="Lead Intelligence"
                active={activePage === 'lead-intelligence'}
                onClick={() => navigate('/admin/leads/radar')}
              >
                <div className="space-y-1 py-1">
                  <NavItem 
                    label="Lead Radar" 
                    icon={<LineChart className="h-4 w-4" />} 
                    onClick={() => navigate('/admin/leads/radar')}
                  />
                  <NavItem 
                    label="Campaign Analytics" 
                    icon={<BarChart className="h-4 w-4" />}
                    onClick={() => navigate('/admin/leads/campaigns')}
                  />
                  <NavItem 
                    label="Insights" 
                    icon={<LineChart className="h-4 w-4" />}
                    onClick={() => navigate('/admin/leads/insights')}
                  />
                </div>
              </NavItem>
              
              <NavItem 
                label="Developer Tools"
                active={activePage === 'developer-tools'}
                onClick={() => navigate('/admin/developer')}
              >
                <div className="space-y-1 py-1">
                  <NavItem 
                    label="API Manager" 
                    icon={<Database className="h-4 w-4" />}
                    onClick={() => navigate('/admin/developer/api')}
                  />
                  <NavItem 
                    label="Schema Builder" 
                    icon={<FileText className="h-4 w-4" />}
                    onClick={() => navigate('/admin/developer/schema')}
                  />
                </div>
              </NavItem>
              
              <NavItem 
                label="Marketplace"
                active={activePage === 'marketplace'}
                onClick={() => navigate('/admin/marketplace')}
              />
              
              <NavItem 
                label="SOT Integration"
                icon={<RefreshCcw className="h-4 w-4 text-[#3CBFAE]" />}
                active={activePage === 'sot-integration'}
                onClick={() => navigate('/admin/sot')}
              />
            </nav>
            
            {/* Right navigation */}
            <div className="flex items-center ml-auto space-x-4">
              <GradientButton 
                size="sm" 
                className="text-white font-medium rounded-md px-4 h-9"
                onClick={() => window.open('https://marketplace.nextmonth.ai', '_blank')}
              >
                MC Login
              </GradientButton>
              
              <NavItem 
                label="Financial"
                icon={<Wallet className="h-4 w-4" />}
                active={activePage === 'financial'}
                onClick={() => navigate('/admin/financial')}
              />
              
              <NavItem 
                label="Creative"
                icon={<PaintBucket className="h-4 w-4" />}
                active={activePage === 'creative'}
                onClick={() => navigate('/admin/creative')}
              />
              
              <NavItem 
                label="Sales"
                icon={<ShoppingBag className="h-4 w-4" />}
                active={activePage === 'sales'}
                onClick={() => navigate('/admin/sales')}
              />
              
              {/* Theme toggle */}
              <div className="ml-2">
                <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="relative h-1 dark:bg-[#1D1D1D] bg-gray-200">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A]" style={{ width: `${siteProgress}%` }}></div>
      </div>
      
      {/* Smart Context Banner */}
      <SmartContextBanner />
      
      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className={cn(
          "mx-auto px-6",
          fullWidth ? "w-full" : "max-w-screen-xl"
        )}>
          {/* Page header - only show if not hidden */}
          {!hideHeader && (title || description) && (
            <div className="mb-8 relative overflow-hidden rounded-xl dark:bg-[#0A0A0A] bg-white p-8 shadow-md dark:border-[#1D1D1D] border-gray-200">
              {/* Grid pattern */}
              <div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              
              <div className="relative">
                {title && (
                  <h1 className="text-3xl font-bold tracking-tight dark:text-white text-gray-900">
                    {title.split(' ').map((word, i) => 
                      <span key={i}>{word} </span>
                    )}
                  </h1>
                )}
                {description && <p className="dark:text-[#E0E0E0] text-gray-700 mt-2">{description}</p>}
              </div>
            </div>
          )}
          
          {/* Page content */}
          {children}
        </div>
      </div>
    </div>
  );
}