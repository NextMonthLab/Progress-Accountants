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

// Admin sidebar logo component - similar to the current implementation
function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  const [siteBranding, setSiteBranding] = useState<SiteBranding>(defaultSiteBranding);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      setIsLoading(true);
      try {
        const brandingData = await getSiteBranding();
        if (brandingData) {
          setSiteBranding(brandingData);
        }
      } catch (error) {
        console.error("Error loading site branding for admin sidebar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();
  }, []);

  if (collapsed) {
    return null;
  }

  // Display image logo if available, otherwise use text logo
  if (siteBranding.logo.imageUrl) {
    return (
      <Link href="/admin/dashboard" className="no-underline flex items-center">
        <img 
          src={siteBranding.logo.imageUrl} 
          alt={siteBranding.logo.altText} 
          className="max-h-8 object-contain"
        />
        <span className="ml-2 font-bold text-[var(--orange)]">Admin</span>
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
  const variantClassMap = {
    new: "bg-emerald-500 text-white",
    updated: "bg-blue-500 text-white",
    beta: "bg-purple-500 text-white",
    pro: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
    default: "bg-gray-200 text-gray-800"
  };
  
  return (
    <Badge 
      className={cn(
        "ml-auto text-[9px] py-0 h-4",
        variantClassMap[badge.variant as keyof typeof variantClassMap || "default"]
      )}
    >
      {badge.text}
    </Badge>
  );
};

// Dynamic Sidebar component to replace the current AdminSidebar
const DynamicSidebar: React.FC = () => {
  const { user } = useAuth();
  const [location] = useLocation();
  const { 
    navigationGroups, 
    navigationState, 
    toggleGroup, 
    toggleSubmenu,
    toggleSidebar,
    addPinnedItem,
    removePinnedItem,
    getGroupItems
  } = useNavigation();
  
  const { sidebarCollapsed, expandedGroups, expandedSubmenus, pinnedItems } = navigationState;
  
  // Check if user has staff privileges (admin, super_admin, or editor)
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;
  
  // Check if the current route is active
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + '/');
  };

  // Helper to render a navigation link
  const renderNavLink = (item: NavigationLink, isNested = false) => {
    // Get the Lucide icon dynamically
    const IconComponent = (LucideIcons as any)[item.icon] || Circle;
    const isPinned = pinnedItems.includes(item.id);
    
    // For collapsed sidebar, show tooltips
    if (sidebarCollapsed) {
      return (
        <TooltipProvider key={item.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center rounded-md p-2 transition-all duration-200",
                  isActive(item.href) 
                    ? "bg-gradient-to-r from-orange-100 to-orange-50 text-[var(--orange)]" 
                    : "text-gray-700 hover:bg-orange-50/50 hover:text-[var(--orange)]",
                  "no-underline relative",
                  isNested && "ml-2"
                )}
              >
                <div className="relative">
                  <IconComponent className="h-5 w-5" />
                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                  )}
                </div>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1 p-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{item.title}</p>
                {isPinned ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removePinnedItem(item.id);
                    }}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <PinOff className="h-3 w-3" />
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addPinnedItem(item.id);
                    }}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-gray-500">{item.description}</p>
              )}
              {item.badge && (
                <Badge 
                  className={cn(
                    "text-[9px] py-0 h-4 w-fit mt-1",
                    item.badge.variant === "new" ? "bg-emerald-500" :
                    item.badge.variant === "updated" ? "bg-blue-500" :
                    item.badge.variant === "beta" ? "bg-purple-500" :
                    item.badge.variant === "pro" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                    "bg-gray-200 text-gray-800"
                  )}
                >
                  {item.badge.text}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Normal expanded view
    return (
      <div className="relative group" key={item.id}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2 transition-all duration-200",
            isActive(item.href) 
              ? "bg-gradient-to-r from-orange-100 to-orange-50 text-[var(--orange)]" 
              : "text-gray-700 hover:bg-orange-50/50 hover:text-[var(--orange)]",
            "no-underline group",
            isNested && "ml-6 text-sm"
          )}
        >
          <div className="flex items-center">
            <span className="mr-3 relative">
              <IconComponent className="h-5 w-5" />
              {item.isNew && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              )}
            </span>
            <span>{item.title}</span>
          </div>
          
          <div className="flex items-center">
            {item.badge && <SidebarItemBadge badge={item.badge} />}
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                isPinned ? removePinnedItem(item.id) : addPinnedItem(item.id);
              }}
              className={cn(
                "ml-2 opacity-0 group-hover:opacity-100 transition-opacity",
                isPinned ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </button>
          </div>
        </Link>
        
        {/* Marketplace item special handling - show upgrade CTAs */}
        {item.id === 'marketplace' && (
          <div className="ml-10 mt-1 text-xs text-muted-foreground">
            <Link href="/marketplace/discover" className="block py-1 hover:text-primary transition-colors">
              Discover new tools →
            </Link>
          </div>
        )}
        
        {/* Add CTAs for tools that can be upgraded via marketplace */}
        {item.id === 'blog' && (
          <div className="ml-10 mt-1 text-xs text-emerald-600 bg-emerald-50 p-1 px-2 rounded-sm">
            <Link href="/marketplace/category/blog" className="block py-1 hover:underline">
              Advanced Blog Tools available →
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Render submenu
  const renderSubmenu = (submenu: NavigationSubmenu) => {
    const IconComponent = (LucideIcons as any)[submenu.icon] || Circle;
    const isExpanded = expandedSubmenus.includes(submenu.id);
    
    if (sidebarCollapsed) {
      return (
        <TooltipProvider key={submenu.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex items-center justify-center rounded-md p-2 transition-all duration-200 text-gray-700 hover:bg-orange-50/50 hover:text-[var(--orange)]"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu(submenu.id);
                }}
              >
                <IconComponent className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1 p-1" sideOffset={5}>
              <p className="font-medium text-sm mb-1">{submenu.title}</p>
              <div className="flex flex-col gap-1 mt-1">
                {submenu.items.map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-2 py-1 rounded-sm text-xs",
                      isActive(item.href) 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge 
                        className={cn(
                          "text-[8px] py-0 h-3 ml-1",
                          item.badge.variant === "new" ? "bg-emerald-500" :
                          item.badge.variant === "updated" ? "bg-blue-500" :
                          "bg-gray-200 text-gray-800"
                        )}
                      >
                        {item.badge.text}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <div key={submenu.id} className="space-y-1">
        <button
          className={cn(
            "flex items-center justify-between w-full rounded-md px-3 py-2 transition-all duration-200 text-gray-700 hover:bg-orange-50/50 hover:text-[var(--orange)] text-left",
            isExpanded && "bg-orange-50/30"
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleSubmenu(submenu.id);
          }}
        >
          <div className="flex items-center">
            <span className="mr-3">
              <IconComponent className="h-5 w-5" />
            </span>
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
    <TooltipProvider>
      <div className={cn(
        "flex flex-col h-screen border-r border-gray-200 bg-white transition-all duration-300",
        sidebarCollapsed ? "w-[70px]" : "w-64"
      )}>
        {/* Smart Site Collapse Toggle */}
        <div className="absolute -right-3 top-24 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-orange-50 transition-all duration-150",
                )}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronRight className={cn(
                  "h-3 w-3 text-gray-500 transition-transform duration-200",
                  sidebarCollapsed ? "rotate-180" : ""
                )} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {sidebarCollapsed ? "Expand Smart Navigation" : "Collapse Smart Navigation"}
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Sidebar Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-white to-orange-50/30">
          <SidebarLogo collapsed={sidebarCollapsed} />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-orange-100 transition-colors"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <MenuIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Sidebar Content - Dynamic Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {navigationGroups.map((group) => {
            // Get all items for this group
            const groupItems = getGroupItems(group.id);
            
            // Skip empty groups
            if (groupItems.length === 0) return null;
            
            // Filter items based on user permissions
            const filteredItems = groupItems.filter(item => {
              if (item.requiresStaff && !isStaff) return false;
              
              if (item.type === 'submenu') {
                // Filter submenu items based on permissions
                const accessibleItems = (item as NavigationSubmenu).items.filter(
                  subItem => !subItem.requiresStaff || (subItem.requiresStaff && isStaff)
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
            
            // Section header for expanded sidebar
            const groupHeader = !sidebarCollapsed ? (
              <div 
                className={cn(
                  "flex items-center px-4 mb-2",
                  "cursor-pointer"
                )}
                onClick={() => toggleGroup(group.id)}
              >
                <span className="mr-2 text-gray-400">
                  <GroupIconComponent className="h-5 w-5" />
                </span>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {group.title}
                </h3>
                <ChevronDown 
                  className={cn(
                    "ml-auto h-4 w-4 text-gray-400 transition-transform duration-200",
                    isGroupExpanded ? "transform rotate-180" : ""
                  )} 
                />
              </div>
            ) : (
              // For collapsed view, just a divider
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

        {/* Smart Activity Panel - Shows AI Insights */}
        <SmartActivityPanel collapsed={sidebarCollapsed} />
        
        {/* Sidebar Footer */}
        <div className="p-3 space-y-2 border-t border-gray-200 bg-gradient-to-r from-white to-orange-50/30">
          <Link href="/">
            <Button 
              variant="outline"
              className={cn(
                "w-full flex items-center justify-center transition-all duration-200",
                sidebarCollapsed ? "p-2" : "",
                "border-[var(--navy)] bg-white text-[var(--navy)] hover:text-[var(--orange)] hover:border-[var(--orange)]"
              )}
            >
              <Globe className={cn("h-5 w-5", sidebarCollapsed ? "" : "mr-2")} />
              {!sidebarCollapsed && "View Website"}
            </Button>
          </Link>
          
          <Button 
            variant="outline"
            className={cn(
              "w-full flex items-center justify-center transition-all duration-200",
              sidebarCollapsed ? "p-2" : "",
              "border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300"
            )}
            onClick={() => logoutMutation.mutate()}
          >
            <X className={cn("h-5 w-5", sidebarCollapsed ? "" : "mr-2")} />
            {!sidebarCollapsed && "Logout"}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DynamicSidebar;