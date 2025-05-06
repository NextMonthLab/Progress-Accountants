import React, { ReactNode, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
  LineChart
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
      label: 'Developer Tools', 
      icon: <Settings className="h-4 w-4" />, 
      href: '/admin/developer',
      submenu: [
        { label: 'API Manager', icon: <Database className="h-4 w-4" />, href: '/admin/developer/api' },
        { label: 'Schema Builder', icon: <Database className="h-4 w-4" />, href: '/admin/developer/schema' }
      ]
    },
    { 
      label: 'Marketplace', 
      icon: <Globe className="h-4 w-4" />, 
      href: '/admin/marketplace',
      badge: { text: 'New', variant: 'new' }
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
      label: 'Business Network', 
      icon: <Network className="h-4 w-4" />, 
      href: '/admin/network' 
    },
    { 
      label: 'Financial', 
      icon: <CreditCard className="h-4 w-4" />, 
      href: '/admin/financial' 
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
              className={`w-full justify-between group ${isActive ? 'bg-[#fde2ed] text-[#d65db1] hover:bg-[#fbd8e8] hover:text-[#d65db1]' : ''}`}
              onClick={() => toggleSubmenu(item.label)}
            >
              <div className="flex items-center">
                <span className="mr-2 text-[#d65db1]">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-2 px-1 py-0 h-4 bg-[#fde2ed] hover:bg-[#fbd8e8] text-[#d65db1] border-none text-[10px] rounded-full">
                    {item.badge.text}
                  </Badge>
                )}
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </Button>
            {isExpanded && item.submenu && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-[#fde2ed] pl-2">
                {item.submenu.map(subItem => (
                  <Link key={subItem.href} href={subItem.href}>
                    <Button 
                      variant={location === subItem.href ? "secondary" : "ghost"} 
                      className={`w-full justify-start ${location === subItem.href ? 'bg-[#fde2ed] text-[#d65db1] hover:bg-[#fbd8e8] hover:text-[#d65db1]' : ''}`}
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
              className={`w-full justify-between group ${isActive ? 'bg-[#fde2ed] text-[#d65db1] hover:bg-[#fbd8e8] hover:text-[#d65db1]' : ''}`}
            >
              <div className="flex items-center">
                <span className="mr-2 text-[#d65db1]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="px-1 py-0 h-4 bg-[#fde2ed] hover:bg-[#fbd8e8] text-[#d65db1] border-none text-[10px] rounded-full">
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
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r hidden md:block bg-white">
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center">
            {NextMonthLogo ? (
              <img src={NextMonthLogo} alt="NextMonth" className="h-6" />
            ) : (
              <div className="font-bold text-xl text-[#d65db1]">
                NextMonth
              </div>
            )}
          </div>
          <Separator />
          
          <ScrollArea className="flex-1">
            <nav className="p-2">
              <div className="space-y-1">
                {menuItems.map(renderMenuItem)}
              </div>
              
              {isSuperAdmin && (
                <>
                  <Separator className="my-2" />
                  <div className="pt-2">
                    <div className="px-3 text-xs font-semibold text-muted-foreground mb-2">
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
          
          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="border-2 border-[#d65db1]/20">
                <AvatarFallback className="bg-[#d65db1]/10 text-[#d65db1]">{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{user?.username || 'User'}</div>
                <div className="text-xs text-muted-foreground">{user?.email || 'No email'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-full justify-start text-xs" asChild>
                <Link href="/admin/help">
                  <CircleHelp className="h-3 w-3 mr-1" />
                  Help
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={handleLogout}>
                <LogOut className="h-3 w-3 mr-1" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button size="icon" variant="outline" className="rounded-full h-12 w-12 shadow-lg bg-[#d65db1] text-white hover:bg-[#d65db1]/90">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        {/* NextMonth Style Top Navigation */}
        <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  {NextMonthLogo ? (
                    <img src={NextMonthLogo} alt="NextMonth" className="h-6" />
                  ) : (
                    <div className="font-bold text-lg text-[#d65db1]">NextMonth</div>
                  )}
                </div>
                
                <nav className="hidden md:flex space-x-8">
                  <div className="relative group">
                    <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] px-2 py-1 h-auto font-medium">
                      Lead Intelligence <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                    </Button>
                  </div>
                  <div className="relative group">
                    <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] px-2 py-1 h-auto font-medium">
                      Developer Tools <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                    </Button>
                  </div>
                  <div className="relative group">
                    <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] px-2 py-1 h-auto font-medium">
                      Marketplace <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                    </Button>
                  </div>
                  <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] flex items-center gap-1 px-2 py-1 h-auto font-medium">
                    <span className="text-gray-400">⟳</span> SOT Integration
                  </Button>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button size="sm" className="bg-[#5EB8B6] hover:bg-[#45a4a2] text-white text-xs font-medium rounded-md px-3 h-8">
                  MC Login
                </Button>
                <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] flex items-center gap-1 px-2 py-1 h-auto font-medium">
                  <span className="text-gray-400">$</span> Financial <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                </Button>
                <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] flex items-center gap-1 px-2 py-1 h-auto font-medium">
                  <span className="text-gray-400">✧</span> Creative
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Progress Indicator */}
        <div className="w-full bg-gray-100 h-0.5 relative">
          <div className="max-w-7xl mx-auto px-4 flex">
            <div className="bg-gradient-to-r from-[#d65db1] to-[#ff6987] w-1/6 h-0.5 relative">
              <div className="absolute left-0 -top-1 h-2 w-2 rounded-full bg-[#d65db1]"></div>
            </div>
            <div className="absolute right-4 -top-1 h-2 w-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
        
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}