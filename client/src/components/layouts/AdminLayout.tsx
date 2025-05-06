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
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="font-semibold flex items-center">
            <span className="text-[#d65db1] mr-2">Progress</span>
            <span className="text-gray-500">Admin</span>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>🔍 Smart Context</span>
            <span className="text-gray-400">|</span>
            <span>Dashboard Overview</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Last activity: 2 minutes ago</div>
          <Button size="sm" variant="secondary" className="h-8 gap-1 bg-[#f0d9fb] text-[#d65db1] hover:bg-[#e5cdf0] border-none">
            <span>Quick Actions</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1 text-gray-700">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1 text-gray-700 group">
            <ExternalLink className="h-3.5 w-3.5 group-hover:text-[#d65db1]" />
            <span className="group-hover:text-[#d65db1]">View Website</span>
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full text-gray-500 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-[180px] fixed top-14 bottom-0 left-0 border-r bg-white hidden md:block">
        <div className="h-full flex flex-col">
          <div className="mt-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-12 w-12 bg-[#d65db1] text-white">
                <AvatarFallback className="font-semibold text-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'M'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center mb-2">
              <div className="text-sm font-medium">{user?.username || 'manager'}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
          
          <div className="mt-4 px-3">
            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              FREQUENTLY USED
            </div>
            <div className="mb-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="w-full justify-start text-sm h-9 mb-1">
                  <BarChart3 className="mr-2 h-4 w-4" /> 
                  Dashboard
                </Button>
              </Link>
              <Link href="/page-builder">
                <Button variant="ghost" className="w-full justify-start text-sm h-9 mb-1">
                  <FileText className="mr-2 h-4 w-4" /> 
                  Page Builder
                </Button>
              </Link>
              <Link href="/media">
                <Button variant="ghost" className="w-full justify-start text-sm h-9">
                  <Database className="mr-2 h-4 w-4" /> 
                  Media Library
                </Button>
              </Link>
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-3">
            <nav className="py-2">
              <div className="space-y-1">
                {menuItems.map(renderMenuItem)}
              </div>
              
              {isSuperAdmin && (
                <>
                  <Separator className="my-2" />
                  <div className="pt-2">
                    <div className="px-3 text-xs font-semibold text-gray-500 mb-2">
                      Advanced
                    </div>
                    <div className="space-y-1">
                      {advancedItems.map(renderMenuItem)}
                    </div>
                  </div>
                </>
              )}
            </nav>
          </ScrollArea>
          
          <div className="p-3 mt-auto">
            <Button variant="outline" size="sm" className="w-full justify-start text-sm mb-2" asChild>
              <Link href="/admin/help">
                <CircleHelp className="h-4 w-4 mr-2" />
                Help
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button size="icon" variant="outline" className="rounded-full h-12 w-12 shadow-lg bg-[#d65db1] text-white hover:bg-[#d65db1]/90">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full h-14 w-14 shadow-lg bg-[#d65db1] text-white hover:bg-[#c452a5] flex items-center justify-center">
          <span className="text-2xl font-light">+</span>
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="ml-0 md:ml-[180px] mt-14 w-full md:w-[calc(100%-180px)] bg-[#f5f5f7]">
        <main className="p-5 md:p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{title}</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.username || 'manager'}</p>
              </div>
              
              <Button size="sm" variant="outline" className="h-9 bg-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            
            <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
              <TabsList className="bg-white border shadow-sm p-1 h-auto w-full justify-start">
                <TabsTrigger 
                  value="overview" 
                  className={`py-1.5 px-6 h-auto text-sm data-[state=active]:bg-white data-[state=active]:text-[#d65db1] data-[state=active]:shadow rounded-md`}
                >
                  <span className="inline-flex items-center">
                    Overview
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className={`py-1.5 px-6 h-auto text-sm data-[state=active]:bg-white data-[state=active]:text-[#d65db1] data-[state=active]:shadow rounded-md`}
                >
                  <span className="inline-flex items-center">
                    Content
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tools" 
                  className={`py-1.5 px-6 h-auto text-sm data-[state=active]:bg-white data-[state=active]:text-[#d65db1] data-[state=active]:shadow rounded-md`}
                >
                  <span className="inline-flex items-center">
                    Tools
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="system" 
                  className={`py-1.5 px-6 h-auto text-sm data-[state=active]:bg-white data-[state=active]:text-[#d65db1] data-[state=active]:shadow rounded-md`}
                >
                  <span className="inline-flex items-center">
                    System
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}