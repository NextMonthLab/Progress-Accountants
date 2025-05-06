import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
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
  Pin,
  PinOff,
  Globe,
  Circle,
  Brain,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getSiteBranding } from '@/lib/api';
import { defaultSiteBranding, SiteBranding } from '@shared/site_branding';
import { NavigationItem, NavigationLink, NavigationSubmenu, NavigationGroup } from '@/types/navigation';
import SmartActivityPanel from './SmartActivityPanel';
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
  
  if (collapsed) {
    return (
      <Link href="/admin/dashboard" className="no-underline">
        <span className="font-poppins uppercase font-bold text-xl" style={{ color: 'var(--navy)' }}>
          {siteBranding.logo.text.charAt(0)}
        </span>
      </Link>
    );
  }
  
  // Default text logo with "Admin" suffix
  const logoText = siteBranding.logo.text;
  const words = logoText.split(" ");
  
  return (
    <Link href="/admin/dashboard" className="font-poppins font-bold text-xl no-underline" style={{ color: 'var(--navy)' }}>
      {words.length > 1 ? (
        <>
          <span>{words.slice(0, -1).join(" ")} </span>
          <span style={{ color: 'var(--navy)' }}>{words[words.length - 1]} </span>
        </>
      ) : (
        <span>{logoText} </span>
      )}
      <span style={{ color: 'var(--orange)' }}>Admin</span>
    </Link>
  );
}

// Sidebar badge component
const SidebarItemBadge = ({ 
  badge 
}: { 
  badge: { text: string; variant?: string } 
}) => {
  const variant = badge.variant || "default";
  
  return (
    <Badge 
      variant={variant === "default" ? "outline" : "default"}
      className="ml-auto text-[9px] h-4 ml-1"
    >
      {badge.text}
    </Badge>
  );
};

const DynamicSidebar: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { 
    navigationGroups, 
    navigationState, 
    toggleGroup, 
    toggleSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    toggleFocusedMode,
    addPinnedItem,
    removePinnedItem,
    getGroupItems,
    isMobile
  } = useNavigation();
  
  const { sidebarCollapsed, mobileSidebarCollapsed, expandedGroups, expandedSubmenus, pinnedItems, focusedMode } = navigationState;
  
  // Check if user has staff privileges (admin, super_admin, or editor)
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;
  
  // Check if user is a super admin
  const isSuperAdmin = user?.isSuperAdmin || user?.userType === 'super_admin';
  
  // Check if the current route is active
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + '/');
  };

  // Helper to render a navigation link
  const renderNavLink = (item: NavigationLink, isNested = false) => {
    // Get the Lucide icon dynamically
    const IconComponent = (LucideIcons as any)[item.icon] || Circle;
    
    // Simple version for now
    return (
      <div className="group" key={item.id}>
        <a
          href={item.href}
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2 transition-all duration-200 no-underline",
            isActive(item.href) 
              ? "bg-gray-200 text-[var(--navy)] font-medium" 
              : "text-[var(--navy)] hover:bg-gray-100",
            isNested && "ml-6 text-sm"
          )}
        >
          <div className="flex items-center">
            <IconComponent className="h-5 w-5 mr-2" />
            <span>{item.title}</span>
          </div>
          
          {item.badge && <SidebarItemBadge badge={item.badge} />}
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
            "flex items-center justify-between w-full rounded-md px-3 py-2 transition-all duration-200 text-[var(--navy)] hover:bg-gray-100 text-left font-medium",
            isExpanded && "bg-gray-200"
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
      {/* Sidebar Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <SidebarLogo collapsed={sidebarCollapsed} />
        <button
          onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          {isMobile ? (
            <X className="h-5 w-5 text-[var(--navy)]" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-[var(--navy)]" />
          ) : (
            <MenuIcon className="h-5 w-5 text-[var(--navy)]" />
          )}
        </button>
      </div>
      
      {/* Sidebar Content */}
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
              className="flex items-center px-4 mb-2 cursor-pointer"
              onClick={() => toggleGroup(group.id)}
            >
              <span className="mr-2 text-[var(--navy)]">
                <GroupIconComponent className="h-5 w-5" />
              </span>
              <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                {group.title}
              </h3>
              <ChevronDown 
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200",
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