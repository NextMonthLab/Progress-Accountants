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
import NavigationLinkWithOrigin from './NavigationLinkWithOrigin';

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
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary">
          <span className="text-white font-semibold text-lg">
            {(siteBranding.name ?? defaultText)[0].toUpperCase()}
          </span>
        </div>
      </a>
    );
  }
  
  return (
    <a href="/admin/dashboard" className="flex items-center space-x-2 no-underline">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary">
        <span className="text-white font-semibold text-lg">
          {(siteBranding.name ?? defaultText)[0].toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {siteBranding.name ?? defaultText}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Admin Dashboard
        </span>
      </div>
    </a>
  );
}

// Main sidebar component
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
    // Check if this is a link to the page builder for a specific page
    const isPageBuilderLink = item.href?.startsWith('/page-builder/') && 
                            !item.href.endsWith('/new') &&
                            !item.href.includes('/templates');
                            
    // Use the enhanced component for page builder links to check origin
    if (isPageBuilderLink || item.id === 'edit_homepage') {
      return (
        <NavigationLinkWithOrigin
          key={item.id}
          item={item}
          isNested={isNested}
          onMobileClick={isMobile ? toggleMobileSidebar : undefined}
          collapsed={sidebarCollapsed}
        />
      );
    }
    
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
              ? "active font-medium dark:text-white" 
              : "text-[var(--text-headline)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
            isNested && "ml-6 text-sm",
            isViewWebsiteLink && "text-[var(--secondary-text)] dark:text-[#6fcfcf] bg-[var(--secondary-bg)] dark:bg-[#1e3a3a] hover:bg-[var(--secondary-hover)] dark:hover:bg-[#23474a]"
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
            <span className="mr-3">
              <IconComponent className="h-5 w-5" />
            </span>
            <span>{item.title}</span>
          </div>
        </a>
      </div>
    );
  };
  
  // Helper to render a submenu with toggle functionality
  const renderSubmenu = (item: NavigationSubmenu) => {
    const IconComponent = (LucideIcons as any)[item.icon] || Circle;
    const isExpanded = expandedSubmenus.includes(item.id);
    
    return (
      <div key={item.id} className="space-y-1">
        <button
          onClick={() => toggleSubmenu(item.id)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
            "text-[var(--text-headline)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <div className="flex items-center">
            <span className="mr-3">
              <IconComponent className="h-5 w-5" />
            </span>
            <span>{item.title}</span>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isExpanded ? "transform rotate-180" : ""
            )} 
          />
        </button>
        
        {/* Only render children if expanded */}
        {isExpanded && (
          <div className="pl-2 space-y-1">
            {item.items?.map((subItem) => (
              subItem.type === 'link' 
                ? renderNavLink(subItem as NavigationLink, true)
                : renderSubmenu(subItem as NavigationSubmenu)
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile, collapse by default
        setNavigationState(prev => ({ ...prev, sidebarCollapsed: true }));
      }
    };
    
    // Call once on mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setNavigationState]);
  
  // For mobile, return a different UI that overlays the screen
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-20 p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-[var(--secondary-bg)] transition-all duration-150 md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5 text-[var(--text-headline)]" />
        </button>
        
        {/* Mobile Sidebar (showing as overlay) */}
        <div 
          className={cn(
            "fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out",
            mobileSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
          )}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={toggleMobileSidebar}
          ></div>
          
          {/* Sidebar Content */}
          <div className="relative w-64 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-xl">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-[#008080]/10 transition-all duration-150"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4 text-[#1c3668]" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <SidebarLogo collapsed={false} />
            </div>
            
            <div className="p-4 space-y-4">
              {navigationGroups.map((group) => {
                const items = getGroupItems(group.id);
                if (!items.length) return null;
                
                return (
                  <div key={group.id} className="space-y-1">
                    <div className="mb-2 px-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-color)] dark:text-gray-400">
                        {group.title}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => (
                        item.type === 'link' 
                          ? renderNavLink(item as NavigationLink)
                          : renderSubmenu(item as NavigationSubmenu)
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <div 
      className={cn(
        "h-screen flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col",
        sidebarCollapsed ? "w-[72px] transition-all duration-300 ease-out" : "w-64 transition-all duration-300 ease-out"
      )}
    >
      {/* Sidebar Toggle Control */}
      {!isMobile && (
        <div className="absolute right-0 top-16 z-10 transform translate-x-1/2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm hover:bg-[var(--secondary-bg)] dark:hover:bg-gray-600 transition-all duration-150",
                  )}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <ChevronRight className={cn(
                    "h-3 w-3 text-[var(--text-body)] dark:text-gray-300 transition-transform duration-200",
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
            <ChevronLeft className="h-5 w-5 text-[var(--text-headline)] dark:text-gray-200" />
          )}
        </button>
      </div>
      
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
            className="text-xs w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {expandedGroups.length > 0 ? 'Collapse All Sections' : 'Expand All Sections'}
            </span>
            <ChevronDown 
              className={cn(
                "h-3 w-3 text-gray-500 dark:text-gray-400 transition-transform duration-200",
                expandedGroups.length > 0 ? "" : "transform rotate-180"
              )} 
            />
          </button>
        </div>
      )}
      
      {/* Sidebar Content - Dynamic Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
        {navigationGroups.map((group) => {
          const items = getGroupItems(group.id);
          if (!items.length) return null;
          
          const isGroupExpanded = expandedGroups.includes(group.id);
          const needsDivider = group.id !== navigationGroups[navigationGroups.length - 1]?.id;
          
          // Add color coding for different navigation groups
          const groupColors: {[key: string]: string} = {
            quick_actions: 'indigo',
            create_publish: 'emerald',
            manage_monitor: 'blue',
            settings_advanced: 'amber'
          };
          
          const groupColor = groupColors[group.id] || 'gray';
          
          // Create group header with color accents
          const groupHeader = !sidebarCollapsed ? (
            <div 
              className={cn(
                "flex items-center justify-between px-3 py-2 mb-1",
                `border-l-2 border-${groupColor}-500 pl-2`
              )}
              onClick={() => toggleGroup(group.id)}
            >
              <h3 
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider cursor-pointer",
                  `text-${groupColor}-700 dark:text-${groupColor}-400`
                )}
              >
                {group.title}
              </h3>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform duration-200",
                  isGroupExpanded ? "transform rotate-180" : ""
                )} 
              />
            </div>
          ) : null;
          
          return (
            <div key={group.id}>
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