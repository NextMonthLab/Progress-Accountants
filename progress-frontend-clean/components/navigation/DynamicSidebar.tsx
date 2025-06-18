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
    <a href="/admin/dashboard" className="font-poppins font-bold text-xl no-underline" style={{ color: 'var(--text-headline)' }}>
      {words.length > 1 ? (
        <>
          <span>{words.slice(0, -1).join(" ")} </span>
          <span style={{ color: 'var(--text-headline)' }}>{words[words.length - 1]} </span>
        </>
      ) : (
        <span>{logoText} </span>
      )}
      <span style={{ color: 'var(--primary)' }}>Admin</span>
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
  
  // For Smart Site v1, we're using more subtle badge styles
  // Remove badges completely for certain types, make others more subtle
  if (["upgraded", "enhanced", "ai-powered", "real-time"].includes(badge.text.toLowerCase())) {
    return (
      <span className="ml-auto text-[9px] text-slate-500 font-normal">
        {/* Intentionally empty for cleaner sidebar */}
      </span>
    );
  }
  
  return (
    <span 
      className="ml-auto text-[9px] text-slate-500 font-normal"
    >
      {badge.text.toLowerCase()}
    </span>
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
    isMobile,
    setNavigationState
  } = useNavigation();
  
  const { sidebarCollapsed, mobileSidebarCollapsed, expandedGroups, expandedSubmenus } = navigationState;
  
  // Function to toggle all navigation groups
  const toggleAllGroups = (expand: boolean) => {
    if (expand) {
      setNavigationState(prev => ({ 
        ...prev, 
        expandedGroups: navigationGroups.map(g => g.id) 
      }));
    } else {
      setNavigationState(prev => ({ ...prev, expandedGroups: [] }));
    }
  };
  
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
    
    const linkContent = (
      <a
        href={item.href}
        className={cn(
          "flex items-center rounded-lg px-3 py-2 transition-all duration-200 no-underline nav-item",
          isActive(item.href) && !isViewWebsiteLink
            ? "active font-medium dark:text-white" 
            : "text-[var(--text-headline)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
          isNested && "ml-6 text-sm",
          isViewWebsiteLink && "text-[var(--secondary-text)] dark:text-[#6fcfcf] bg-[var(--secondary-bg)] dark:bg-[#1e3a3a] hover:bg-[var(--secondary-hover)] dark:hover:bg-[#23474a]",
          sidebarCollapsed && "justify-center px-2"
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
        <div className={cn("flex items-center", sidebarCollapsed && "justify-center")}>
          <IconComponent className={cn("h-5 w-5", !sidebarCollapsed && "mr-2", isViewWebsiteLink ? "text-[#008080] dark:text-[#6fcfcf]" : "dark:text-gray-300")} />
          {!sidebarCollapsed && <span>{item.title}</span>}
        </div>
        
        {!sidebarCollapsed && item.badge && <SidebarItemBadge badge={item.badge} />}
        
        {/* Add external link icon for view website */}
        {!sidebarCollapsed && isViewWebsiteLink && (
          <ExternalLink className="h-3 w-3 ml-2 text-[#008080] dark:text-[#6fcfcf]" />
        )}
      </a>
    );
    
    // Wrap with tooltip when collapsed
    if (sidebarCollapsed) {
      return (
        <div className="group" key={item.id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {linkContent}
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }
    
    return (
      <div className="group" key={item.id}>
        {linkContent}
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
            "flex items-center justify-between w-full rounded-lg px-3 py-2 transition-all duration-200 text-[var(--text-headline)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left font-medium nav-item",
            isExpanded && "active dark:text-white"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleSubmenu(submenu.id);
          }}
        >
          <div className="flex items-center">
            <IconComponent className="h-5 w-5 mr-3 dark:text-gray-300" />
            <span>{submenu.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 dark:text-gray-300",
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
      "flex flex-col h-screen border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-all duration-300",
      !isMobile && (sidebarCollapsed ? "w-16" : "w-64"),
      isMobile && (mobileSidebarCollapsed ? "w-0 border-r-0" : "fixed w-[90%] max-w-[280px] shadow-lg z-50")
    )}>

      
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
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <SidebarLogo collapsed={sidebarCollapsed} />
        <button
          onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
          className="p-2 rounded-md hover:bg-[var(--secondary-bg)] dark:hover:bg-gray-700 transition-colors"
          aria-label={isMobile 
            ? mobileSidebarCollapsed ? "Open menu" : "Close menu" 
            : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isMobile ? (
            <X className="h-5 w-5 text-[var(--text-headline)] dark:text-gray-200" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-[var(--text-headline)] dark:text-gray-200" />
          ) : (
            <MenuIcon className="h-5 w-5 text-[var(--text-headline)] dark:text-gray-200" />
          )}
        </button>
      </div>
      
      {/* User Profile & Onboarding Progress - Updated with modern UI styling */}
      {user && (user.userType === 'admin' || user.userType === 'super_admin') && (
        <div className="px-4 py-3 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-foreground font-semibold">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate dark:text-gray-200">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate dark:text-gray-400">
                {user.isSuperAdmin || user.userType === 'super_admin' 
                  ? 'Super Admin' 
                  : user.userType === 'admin' ? 'Admin' : 'User'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Collapse All Toggle */}
      {!sidebarCollapsed && (
        <div className="px-4 pt-2 pb-1">
          <button 
            onClick={() => {
              // If any group is expanded, collapse all; otherwise, expand all
              const anyExpanded = navigationGroups.some(group => expandedGroups.includes(group.id));
              if (anyExpanded) {
                setNavigationState(prev => ({ ...prev, expandedGroups: [] }));
              } else {
                setNavigationState(prev => ({ 
                  ...prev, 
                  expandedGroups: navigationGroups.map(g => g.id) 
                }));
              }
            }}
            className="text-xs w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors border border-transparent dark:border-gray-700"
          >
            <span className="font-medium text-gray-600 dark:text-gray-200">
              {expandedGroups.length > 0 ? 'Collapse All Sections' : 'Expand All Sections'}
            </span>
            <ChevronDown 
              className={cn(
                "h-3 w-3 text-gray-500 dark:text-gray-300 transition-transform duration-200",
                expandedGroups.length > 0 ? "" : "transform rotate-180"
              )} 
            />
          </button>
        </div>
      )}
      
      {/* Sidebar Content - Dynamic Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
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
          
          // Get accent color based on group id
          const getGroupAccentColor = (groupId: string) => {
            switch(groupId) {
              case 'quick_actions':
                return 'text-indigo-500 dark:text-indigo-400';
              case 'create_publish':
                return 'text-emerald-500 dark:text-emerald-400';
              case 'manage_monitor':
                return 'text-blue-500 dark:text-blue-400';
              case 'settings_advanced':
                return 'text-amber-500 dark:text-amber-400';
              case 'website_setup':
                return 'text-purple-500 dark:text-purple-400';
              case 'brand_center':
                return 'text-rose-500 dark:text-rose-400';
              case 'system':
                return 'text-orange-500 dark:text-orange-400';
              default:
                return 'text-sky-500 dark:text-sky-400'; // Default to sky color for other categories
            }
          };
          
          // Get background hover color based on group id
          const getGroupHoverBg = (groupId: string) => {
            switch(groupId) {
              case 'quick_actions':
                return 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
              case 'create_publish':
                return 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20';
              case 'manage_monitor':
                return 'hover:bg-blue-50 dark:hover:bg-blue-900/20';
              case 'settings_advanced':
                return 'hover:bg-amber-50 dark:hover:bg-amber-900/20';
              case 'website_setup':
                return 'hover:bg-purple-50 dark:hover:bg-purple-900/20';
              case 'brand_center':
                return 'hover:bg-rose-50 dark:hover:bg-rose-900/20';
              case 'system':
                return 'hover:bg-orange-50 dark:hover:bg-orange-900/20';
              default:
                return 'hover:bg-sky-50 dark:hover:bg-sky-900/20';
            }
          };
          
          // Get icon color based on group id
          const getGroupIconColor = (groupId: string) => {
            switch(groupId) {
              case 'quick_actions':
                return 'text-indigo-500 dark:text-indigo-400';
              case 'create_publish':
                return 'text-emerald-500 dark:text-emerald-400';
              case 'manage_monitor':
                return 'text-blue-500 dark:text-blue-400';
              case 'settings_advanced':
                return 'text-amber-500 dark:text-amber-400';
              case 'website_setup':
                return 'text-purple-500 dark:text-purple-400';
              case 'brand_center':
                return 'text-rose-500 dark:text-rose-400';
              case 'system':
                return 'text-orange-500 dark:text-orange-400';
              default:
                return 'text-sky-500 dark:text-sky-400';
            }
          };
          
          // Section header
          const groupHeader = !sidebarCollapsed ? (
            <div 
              className={cn(
                "flex items-center px-4 mb-2 cursor-pointer rounded-md py-1.5 transition-colors",
                getGroupHoverBg(group.id)
              )}
              onClick={() => toggleGroup(group.id)}
            >
              <span className={cn("mr-2", getGroupIconColor(group.id))}>
                <GroupIconComponent className="h-5 w-5" />
              </span>
              <h3 className={cn("text-xs font-semibold uppercase tracking-wider", getGroupAccentColor(group.id))}>
                {group.title}
              </h3>
              <ChevronDown 
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200",
                  getGroupAccentColor(group.id),
                  isGroupExpanded ? "transform rotate-180" : ""
                )} 
              />
            </div>
          ) : (
            <div className="border-t border-gray-100 dark:border-gray-700 mx-2 my-3"></div>
          );
          
          // Add divider after each major group
          const needsDivider = group.id !== 'settings_advanced'; // No divider after the last group
          
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
              
              {/* Divider between major groups */}
              {needsDivider && !sidebarCollapsed && (
                <div className="mt-4 mb-3 border-b border-gray-100 dark:border-gray-700"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicSidebar;