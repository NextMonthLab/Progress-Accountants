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
              className="w-full justify-between group"
              onClick={() => toggleSubmenu(item.label)}
            >
              <div className="flex items-center">
                <span className="mr-2 text-primary">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-2 px-1 py-0 h-4 bg-primary/10 hover:bg-primary/20 text-primary border-none text-[10px]">
                    {item.badge.text}
                  </Badge>
                )}
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </Button>
            {isExpanded && item.submenu && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-muted pl-2">
                {item.submenu.map(subItem => (
                  <Link key={subItem.href} href={subItem.href}>
                    <Button 
                      variant={location === subItem.href ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      size="sm"
                    >
                      <span className="mr-2 text-primary">{subItem.icon}</span>
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
              variant={location === item.href ? "secondary" : "ghost"} 
              className="w-full justify-between group"
            >
              <div className="flex items-center">
                <span className="mr-2 text-primary">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge className="px-1 py-0 h-4 bg-primary/10 hover:bg-primary/20 text-primary border-none text-[10px]">
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r hidden md:block bg-white">
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center">
            {NextMonthLogo ? (
              <img src={NextMonthLogo} alt="NextMonth" className="h-8" />
            ) : (
              <div className="font-bold text-xl text-primary">
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
              <Avatar className="border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
        <Button size="icon" variant="outline" className="rounded-full h-12 w-12 shadow-lg bg-primary text-white hover:bg-primary/90">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#fafafa]">
        <header className="sticky top-0 z-30 bg-white p-3 border-b shadow-sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
              )}
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200">
                MC Login
              </Button>
              
              {/* Mobile Only User Menu */}
              <div className="md:hidden">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}