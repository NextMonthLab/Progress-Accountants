import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { NavItem } from './AdminButtons';
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
  Briefcase
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
 * AdminLayout component following the Lead Radar design system
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
  
  // Site progress for the progress indicator
  const siteProgress = 40; // This would be calculated based on completed tasks

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="border-b z-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center h-16">
            {/* Left navigation */}
            <nav className="flex space-x-8">
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
                icon={<span className="text-[#5EB8B6]">⟳</span>}
                active={activePage === 'sot-integration'}
                onClick={() => navigate('/admin/sot')}
              />
            </nav>
            
            {/* Right navigation */}
            <div className="flex items-center ml-auto space-x-4">
              <Button 
                size="sm" 
                className="bg-[#5EB8B6] hover:bg-[#45a4a2] text-white font-medium rounded px-4 h-9"
                onClick={() => window.open('https://marketplace.nextmonth.ai', '_blank')}
              >
                MC Login
              </Button>
              
              <NavItem 
                label="Financial"
                icon={<span className="text-gray-500">$</span>}
                active={activePage === 'financial'}
                onClick={() => navigate('/admin/financial')}
              />
              
              <NavItem 
                label="Creative"
                icon={<span className="text-gray-500">✧</span>}
                active={activePage === 'creative'}
                onClick={() => navigate('/admin/creative')}
              />
              
              <NavItem 
                label="Sales"
                icon={<span className="text-gray-500">⚏</span>}
                active={activePage === 'sales'}
                onClick={() => navigate('/admin/sales')}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-100">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d65db1] to-[#5EB8B6]" style={{ width: `${siteProgress}%` }}></div>
        <div className="absolute inset-y-0 left-0 flex items-center justify-between w-full px-4">
          <div className="h-2 w-2 rounded-full bg-[#d65db1] -mt-0.5"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300 -mt-0.5"></div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <div className={cn(
          "mx-auto px-6 py-6",
          fullWidth ? "w-full" : "max-w-screen-xl"
        )}>
          {/* Page header */}
          {!hideHeader && (title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold mb-1">{title}</h1>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}
          
          {/* Page content */}
          {children}
        </div>
      </div>
    </div>
  );
}