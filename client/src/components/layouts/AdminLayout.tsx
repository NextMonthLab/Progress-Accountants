import React, { ReactNode, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Settings, 
  Users, 
  BarChart3, 
  Network, 
  Database, 
  CreditCard, 
  PanelLeft, 
  Globe, 
  Shield, 
  MessageSquare,
  LogOut,
  User,
  RefreshCw,
  ChevronDown,
  CircleHelp,
  LineChart,
  FileText,
  ExternalLink,
  Bell,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import NextMonth logo
import NextMonthLogo from '../../assets/logos/nextmonth-logo.png';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

interface MenuItemType {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: {
    text: string;
    variant: 'new' | 'pro' | 'updated';
  };
  submenu?: MenuItemType[];
}

/**
 * AdminLayout Component
 * Provides a consistent layout for admin pages with navigation
 */
export function AdminLayout({ 
  children, 
  title = 'Admin Dashboard', 
  showBackButton = false 
}: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/auth');
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out',
        });
      }
    });
  };
  
  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };
  
  const menuItems: MenuItemType[] = [
    {
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      href: '/admin/dashboard',
    },
    { 
      label: 'Page Builder', 
      icon: <FileText className="h-4 w-4" />, 
      href: '/page-builder'
    },
    { 
      label: 'Lead Intelligence', 
      icon: <LineChart className="h-4 w-4" />, 
      href: '/admin/leads',
      submenu: [
        { label: 'Lead Radar', icon: <BarChart3 className="h-4 w-4" />, href: '/admin/leads/radar' },
        { label: 'Lead Tracker', icon: <BarChart3 className="h-4 w-4" />, href: '/admin/leads/tracker' },
        { label: 'Campaign Analytics', icon: <BarChart3 className="h-4 w-4" />, href: '/admin/leads/campaigns' },
        { label: 'Conversion Insights', icon: <BarChart3 className="h-4 w-4" />, href: '/admin/leads/insights' }
      ]
    },
    { 
      label: 'Marketplace', 
      icon: <Globe className="h-4 w-4" />, 
      href: '/admin/marketplace',
      badge: { text: 'New', variant: 'new' }
    },
    { 
      label: 'Media Library', 
      icon: <Globe className="h-4 w-4" />, 
      href: '/media'
    },
    { 
      label: 'SOT Integration', 
      icon: <RefreshCw className="h-4 w-4" />, 
      href: '/admin/sot' 
    },
    { 
      label: 'Analytics', 
      icon: <BarChart3 className="h-4 w-4" />, 
      href: '/admin/analytics' 
    },
    { 
      label: 'Settings', 
      icon: <Settings className="h-4 w-4" />, 
      href: '/admin/settings' 
    },
  ];
  
  // For super admins only
  const advancedItems: MenuItemType[] = [
    { label: 'Blueprint Management', icon: <Shield className="h-4 w-4" />, href: '/admin/blueprint' },
  ];

  const isSuperAdmin = user?.isSuperAdmin || user?.userType === 'super_admin';
  
  const renderMenuItem = (item: MenuItemType) => {
    const isActive = location === item.href || (item.submenu && item.submenu.some(sub => location === sub.href));
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.label];
    
    return (
      <div key={item.href} className="mb-1">
        {hasSubmenu ? (
          <>
            <Button 
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full justify-between group ${isActive ? 'bg-[#d65db1]/10 text-[#d65db1] hover:bg-[#d65db1]/10 hover:text-[#d65db1]' : ''}`}
              onClick={() => toggleSubmenu(item.label)}
            >
              <div className="flex items-center">
                <span className="mr-2 text-[#d65db1]">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-2 px-1 py-0 h-4 bg-[#d65db1]/10 hover:bg-[#d65db1]/20 text-[#d65db1] border-none text-[10px] rounded-full">
                    {item.badge.text}
                  </Badge>
                )}
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </Button>
            {isExpanded && item.submenu && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-[#d65db1]/10 pl-2">
                {item.submenu.map(subItem => (
                  <Link key={subItem.href} href={subItem.href}>
                    <Button 
                      variant={location === subItem.href ? "secondary" : "ghost"} 
                      className={`w-full justify-start ${location === subItem.href ? 'bg-[#d65db1]/10 text-[#d65db1] hover:bg-[#d65db1]/10 hover:text-[#d65db1]' : ''}`}
                      size="sm"
                    >
                      <span className="mr-2 text-[#d65db1]">{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Link href={item.href}>
            <Button 
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full justify-between group ${isActive ? 'bg-[#d65db1]/10 text-[#d65db1] hover:bg-[#d65db1]/10 hover:text-[#d65db1]' : ''}`}
            >
              <div className="flex items-center">
                <span className="mr-2 text-[#d65db1]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="px-1 py-0 h-4 bg-[#d65db1]/10 hover:bg-[#d65db1]/20 text-[#d65db1] border-none text-[10px] rounded-full">
                  {item.badge.text}
                </Badge>
              )}
            </Button>
          </Link>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation */}
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center h-16">
            <nav className="flex space-x-8">
              <div className="relative group">
                <Button variant="ghost" className="text-gray-700 font-medium px-2 py-1 h-auto flex items-center">
                  Lead Intelligence <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                </Button>
              </div>
              <div className="relative group">
                <Button variant="ghost" className="text-gray-700 font-medium px-2 py-1 h-auto flex items-center">
                  Developer Tools <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                </Button>
              </div>
              <div className="relative group">
                <Button variant="ghost" className="text-gray-700 font-medium px-2 py-1 h-auto flex items-center">
                  Marketplace <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                </Button>
              </div>
              <Button variant="ghost" className="text-gray-700 font-medium flex items-center gap-1 px-2 py-1 h-auto">
                <span className="text-[#5EB8B6]">⟳</span> SOT Integration
              </Button>
            </nav>

            <div className="flex items-center ml-auto space-x-4">
              <Button size="sm" className="bg-[#5EB8B6] hover:bg-[#45a4a2] text-white font-medium rounded px-4 h-9">
                <span>MC Login</span>
              </Button>
              <Button variant="ghost" className="text-gray-700 font-medium flex items-center gap-1 px-2 py-1 h-auto">
                <span className="text-gray-500">$</span> Financial <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
              </Button>
              <Button variant="ghost" className="text-gray-700 font-medium flex items-center gap-1 px-2 py-1 h-auto">
                <span className="text-gray-500">✧</span> Creative <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
              </Button>
              <Button variant="ghost" className="text-gray-700 font-medium flex items-center gap-1 px-2 py-1 h-auto">
                <span className="text-gray-500">⚏</span> Sales <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-200">
        <div className="absolute flex items-center justify-between w-full px-4">
          <div className="h-1 w-1/4 bg-gray-400"></div>
          <div className="absolute right-4 flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {children}
        </div>
      </div>
      
      {/* Mobile Navigation Toggle */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button size="icon" variant="outline" className="rounded-full h-12 w-12 shadow-lg bg-[#d65db1] text-white hover:bg-[#d65db1]/90">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}