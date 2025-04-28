import React, { ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
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
  
  const menuItems = [
    { label: 'Dashboard', icon: <Home className="h-4 w-4" />, href: '/admin' },
    { label: 'Users', icon: <Users className="h-4 w-4" />, href: '/admin/users' },
    { label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, href: '/admin/analytics' },
    { label: 'Business Network', icon: <Network className="h-4 w-4" />, href: '/admin/network' },
    { label: 'CRM', icon: <Users className="h-4 w-4" />, href: '/admin/crm' },
    { label: 'Website', icon: <Globe className="h-4 w-4" />, href: '/admin/website' },
    { label: 'Database', icon: <Database className="h-4 w-4" />, href: '/admin/database' },
    { label: 'Billing', icon: <CreditCard className="h-4 w-4" />, href: '/admin/billing' },
    { label: 'SOT Manager', icon: <RefreshCw className="h-4 w-4" />, href: '/admin/sot' },
    { label: 'Settings', icon: <Settings className="h-4 w-4" />, href: '/admin/settings' },
    { label: 'Support', icon: <MessageSquare className="h-4 w-4" />, href: '/admin/support' },
  ];
  
  // For super admins only
  const advancedItems = [
    { label: 'Blueprint Management', icon: <Shield className="h-4 w-4" />, href: '/admin/blueprint' },
  ];

  const isSuperAdmin = user?.role === 'superadmin';
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center">
            <div className="font-semibold text-lg">Progress Admin</div>
          </div>
          <Separator />
          
          <ScrollArea className="flex-1">
            <nav className="p-2">
              <div className="space-y-1">
                {menuItems.map(item => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={location === item.href ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
              
              {isSuperAdmin && (
                <>
                  <Separator className="my-2" />
                  <div className="pt-2">
                    <div className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                      Advanced
                    </div>
                    <div className="space-y-1">
                      {advancedItems.map(item => (
                        <Link key={item.href} href={item.href}>
                          <Button 
                            variant={location === item.href ? "secondary" : "ghost"} 
                            className="w-full justify-start"
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </nav>
          </ScrollArea>
          
          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                {user?.avatar && <AvatarImage src={user.avatar} alt={user?.username || 'User'} />}
              </Avatar>
              <div>
                <div className="font-medium">{user?.username || 'User'}</div>
                <div className="text-xs text-muted-foreground">{user?.email || 'No email'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <Button size="icon" variant="outline" className="rounded-full h-12 w-12 shadow-lg">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-background p-4 border-b">
          <div className="flex justify-between items-center">
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
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            
            {/* Mobile Only User Menu */}
            <div className="md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                {user?.avatar && <AvatarImage src={user.avatar} alt={user?.username || 'User'} />}
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}