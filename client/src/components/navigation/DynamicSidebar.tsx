import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import {
  Settings,
  Home,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ChevronDown,
  Circle,
  ExternalLink
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getSiteBranding } from '@/lib/api';
import { defaultSiteBranding, SiteBranding } from '@shared/site_branding';
import { NavigationLink, NavigationSubmenu } from '@/types/navigation';
import OnboardingProgressRing from '@/components/onboarding/OnboardingProgressRing';

// Admin sidebar logo component - similar to the current implementation
function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  const [siteBranding, setSiteBranding] = useState<SiteBranding>(defaultSiteBranding);
  
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const branding = await getSiteBranding();
        setSiteBranding(branding);
      } catch (e) {
        console.error("Failed to load branding:", e);
      }
    };
    
    fetchBranding();
  }, []);
  
  // Default text to use if branding is not available
  const defaultText = "Progress";
  
  if (collapsed) {
    return (
      <a href="/admin/dashboard" className="no-underline">
        <span className="font-poppins uppercase font-bold text-xl" style={{ color: 'var(--text-headline)' }}>
          {siteBranding?.logo?.text ? siteBranding.logo.text.charAt(0) : defaultText.charAt(0)}
        </span>
      </a>
    );
  }
  
  // Default text logo with "Admin" suffix
  const logoText = siteBranding?.logo?.text || defaultText;
  const words = logoText.split(" ");
  
  return (
    <a href="/admin/dashboard" className="font-poppins font-bold text-xl no-underline" style={{ color: '#1c3668' }}>
      {words.length > 1 ? (
        <>
          <span>{words.slice(0, -1).join(" ")} </span>
          <span style={{ color: '#1c3668' }}>{words[words.length - 1]} </span>
        </>
      ) : (
        <span>{logoText} </span>
      )}
      <span style={{ color: '#008080' }}>Admin</span>
    </a>
  );
}

// Sidebar badge component
const SidebarItemBadge = ({ 
  badge 
}: { 
  badge: { text: string; variant?: string } 
}) => {
  const variant = badge.variant || "default";
  
  // Handle different badge styles based on type
  const getBadgeClasses = () => {
    if (variant === "new") {
      return "badge-flat bg-blue-50 text-blue-600";
    } else if (variant === "updated") {
      return "badge-flat bg-indigo-50 text-indigo-600"; 
    } else if (variant === "pro") {
      return "badge-flat bg-purple-50 text-purple-600";
    } else if (variant === "ai-powered" || variant === "beta") {
      return "badge-ai";
    }
    return "badge-flat bg-gray-100 text-gray-600";
  };
  
  return (
    <Badge 
      variant="outline"
      className={cn("ml-auto text-[9px] py-0.5 px-2 font-normal lowercase ml-1", getBadgeClasses())}
    >
      {badge.text.toLowerCase()}
    </Badge>
  );
};

const DynamicSidebar: React.FC = () => {
  const { user } = useAuth();
  const { 
    navigationGroups, 
    navigationState, 
    toggleGroup, 
    toggleSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    getGroupItems,
    isMobile
  } = useNavigation();
  
  const { sidebarCollapsed, mobileSidebarCollapsed, expandedGroups, expandedSubmenus } = navigationState;
  
  // Check if user has staff privileges (admin, super_admin, or editor)
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;
  
  // Check if user is a super admin
  const isSuperAdmin = user?.isSuperAdmin || user?.userType === 'super_admin';
  
  // Check if the current route is active
  const isActive = (href: string) => {
    return window.location.pathname === href || window.location.pathname.startsWith(href + '/');
  };

  // Helper to render a navigation link
  const renderNavLink = (item: NavigationLink, isNested = false) => {
    // Get the Lucide icon dynamically
    const IconComponent = (LucideIcons as any)[item.icon] || Circle;
    
    // Special handling for "View Website" link to open in a new tab
    const isViewWebsiteLink = item.id === 'view_website';
    
    return (
      <div className="group" key={item.id}>
        <a
          href={item.href}
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 no-underline nav-item",
            isActive(item.href) && !isViewWebsiteLink
              ? "active font-medium" 
              : "text-[var(--text-headline)] hover:bg-gray-50",
            isNested && "ml-6 text-sm",
            isViewWebsiteLink && "text-[var(--secondary-text)] bg-[var(--secondary-bg)] hover:bg-[var(--secondary-hover)]"
          )}
          target={isViewWebsiteLink ? "_blank" : undefined}
          rel={isViewWebsiteLink ? "noopener noreferrer" : undefined}
          onClick={(e) => {
            // If on mobile, close the sidebar after clicking
            if (isMobile) {
              toggleMobileSidebar();
            }
          }}
        >
          <div className="flex items-center">
            <IconComponent className={cn("h-5 w-5 mr-2", isViewWebsiteLink && "text-[#008080]")} />
            <span>{item.title}</span>
          </div>
          
          {item.badge && <SidebarItemBadge badge={item.badge} />}
          
          {/* Add external link icon for view website */}
          {isViewWebsiteLink && (
            <ExternalLink className="h-3 w-3 ml-2 text-[#008080]" />
          )}
        </a>
      </div>
    );
  };

  // Render submenu
  const renderSubmenu = (submenu: NavigationSubmenu) => {
    const IconComponent = (LucideIcons as any)[submenu.icon] || Circle;
    const isExpanded = expandedSubmenus.includes(submenu.id);
    
    return (
      <div key={submenu.id} className="space-y-1">
        <button
          className={cn(
            "flex items-center justify-between w-full rounded-lg px-3 py-2 transition-all duration-200 text-[var(--text-headline)] hover:bg-gray-50 text-left font-medium nav-item",
            isExpanded && "active"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleSubmenu(submenu.id);
          }}
        >
          <div className="flex items-center">
            <IconComponent className="h-5 w-5 mr-3" />
            <span>{submenu.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded ? "transform rotate-180" : ""
            )}
          />
        </button>
        
        {isExpanded && (
          <div className="space-y-1 mt-1">
            {submenu.items.map((item) => renderNavLink(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-screen border-r border-gray-200 bg-gray-100 transition-all duration-300",
      !isMobile && (sidebarCollapsed ? "w-[70px]" : "w-64"),
      isMobile && (mobileSidebarCollapsed ? "w-0 border-r-0" : "fixed w-[90%] max-w-[280px] shadow-lg z-50")
    )}>
      {/* Desktop Smart Site Collapse Toggle */}
      {!isMobile && (
        <div className="absolute -right-3 top-24 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-[var(--secondary-bg)] transition-all duration-150",
                  )}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <ChevronRight className={cn(
                    "h-3 w-3 text-[var(--text-body)] transition-transform duration-200",
                    sidebarCollapsed ? "rotate-180" : ""
                  )} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {sidebarCollapsed ? "Expand Smart Navigation" : "Collapse Smart Navigation"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Mobile Menu Close Button */}
      {isMobile && !mobileSidebarCollapsed && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-[#008080]/10 transition-all duration-150"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-[#1c3668]" />
          </button>
        </div>
      )}
      
      {/* Sidebar Header - Updated with modern UI styling */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white">
        <SidebarLogo collapsed={sidebarCollapsed} />
        <button
          onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
          className="p-2 rounded-md hover:bg-[var(--secondary-bg)] transition-colors"
          aria-label={isMobile 
            ? mobileSidebarCollapsed ? "Open menu" : "Close menu" 
            : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isMobile ? (
            <X className="h-5 w-5 text-[var(--text-headline)]" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-[var(--text-headline)]" />
          ) : (
            <MenuIcon className="h-5 w-5 text-[var(--text-headline)]" />
          )}
        </button>
      </div>
      
      {/* User Profile & Onboarding Progress - Updated with modern UI styling */}
      {user && (user.userType === 'admin' || user.userType === 'super_admin') && (
        <div className="px-4 py-3 flex items-center space-x-3 border-b border-gray-100 bg-white">
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="absolute -bottom-1 -right-1">
                <OnboardingProgressRing size={20} />
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.isSuperAdmin || user.userType === 'super_admin' 
                  ? 'Super Admin' 
                  : user.userType === 'admin' ? 'Admin' : 'User'}
              </p>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="absolute right-0 top-20">
              <OnboardingProgressRing size={24} />
            </div>
          )}
        </div>
      )}

      {/* Sidebar Content - Dynamic Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {navigationGroups.map((group) => {
          // Get all items for this group
          const groupItems = getGroupItems(group.id);
          
          // Skip empty groups
          if (groupItems.length === 0) return null;
          
          // Filter items based on user permissions
          const filteredItems = groupItems.filter(item => {
            // Check staff permission
            if (item.requiresStaff && !isStaff) return false;
            
            // Check super admin permission
            if ((item as any).requiresSuperAdmin && !isSuperAdmin) return false;
            
            if (item.type === 'submenu') {
              // Filter submenu items based on permissions
              const accessibleItems = (item as NavigationSubmenu).items.filter(
                subItem => {
                  // Check staff permission for submenu items
                  if (subItem.requiresStaff && !isStaff) return false;
                  
                  // Check super admin permission for submenu items
                  if ((subItem as any).requiresSuperAdmin && !isSuperAdmin) return false;
                  
                  return true;
                }
              );
              return accessibleItems.length > 0;
            }
            
            return true;
          });
          
          // Skip groups with no accessible items
          if (filteredItems.length === 0) return null;
          
          // Get the group icon
          const GroupIconComponent = (LucideIcons as any)[group.icon] || Settings;
          
          // Special marketplace treatment - always visible and prominent
          const isMarketplaceGroup = group.id === 'marketplace';
          const isGroupExpanded = expandedGroups.includes(group.id) || isMarketplaceGroup;
          
          // Section header
          const groupHeader = !sidebarCollapsed ? (
            <div 
              className="flex items-center px-4 mb-2 cursor-pointer hover:bg-gray-50 rounded-md py-1.5 transition-colors"
              onClick={() => toggleGroup(group.id)}
            >
              <span className="mr-2 text-[var(--text-body)]">
                <GroupIconComponent className="h-5 w-5" />
              </span>
              <h3 className="text-xs font-semibold text-[var(--text-body)] uppercase tracking-wider">
                {group.title}
              </h3>
              <ChevronDown 
                className={cn(
                  "ml-auto h-4 w-4 text-[var(--text-body)] transition-transform duration-200",
                  isGroupExpanded ? "transform rotate-180" : ""
                )} 
              />
            </div>
          ) : (
            <div className="border-t border-gray-100 mx-2 my-3"></div>
          );
          
          return (
            <div key={group.id} className="px-2">
              {groupHeader}
              
              {(isGroupExpanded || sidebarCollapsed) && (
                <div className={cn("space-y-1", sidebarCollapsed ? "flex flex-col items-center" : "")}>
                  {filteredItems.map((item) => (
                    item.type === 'link' 
                      ? renderNavLink(item as NavigationLink)
                      : renderSubmenu(item as NavigationSubmenu)
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicSidebar;