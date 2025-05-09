import { Link, useLocation } from "wouter";
import { 
  Settings, 
  FileImage, 
  LayoutDashboard, 
  Home, 
  Users, 
  PaintBucket, 
  Layout, 
  FastForward, 
  Globe,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  FileText,
  PlusCircle,
  Layers,
  Image,
  ListOrdered,
  Link as LinkIcon,
  Palette,
  Sparkles,
  Gauge,
  BarChart,
  CircleUser,
  BrainCircuit,
  SquarePen,
  Lightbulb,
  Database,
  Cpu,
  Newspaper,
  User,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getSiteBranding } from "@/lib/api";
import { defaultSiteBranding, SiteBranding } from "@shared/site_branding";

// Admin sidebar logo component
function AdminSidebarLogo({ collapsed }: { collapsed: boolean }) {
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
        <span className="ml-2 font-bold text-[var(--nextmonth-teal)]">Admin</span>
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
      <span style={{ color: 'var(--nextmonth-teal)' }}>Admin</span>
    </Link>
  );
}

type SidebarItemBadge = {
  text: string;
  variant?: "default" | "new" | "updated" | "beta" | "pro" | "teal-blue" | "pink-coral";
}

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  requiresStaff?: boolean;
  badge?: SidebarItemBadge;
  isNew?: boolean;
  description?: string;
}

type SidebarSubMenu = {
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
  requiresStaff?: boolean;
  isNew?: boolean;
}

type SidebarSection = {
  title: string;
  icon: React.ReactNode;
  items: (SidebarItem | SidebarSubMenu)[];
  isExpandable?: boolean;
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubMenus, setExpandedSubMenus] = useState<Record<string, boolean>>({});
  
  // Check if user has staff privileges (admin, super_admin, or editor)
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;

  // Toggle section expansion
  const toggleSection = (title: string) => {
    if (collapsed) return; // Don't toggle if sidebar is collapsed
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Toggle submenu expansion
  const toggleSubMenu = (title: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (collapsed) return; // Don't toggle if sidebar is collapsed
    setExpandedSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Define all admin menu sections
  const sidebarSections: SidebarSection[] = [
    {
      title: "Command Center",
      icon: <Gauge className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Dashboard", 
          href: "/admin/dashboard", 
          icon: <LayoutDashboard className="h-5 w-5" />,
          description: "Modern dashboard with enhanced UI and improved contrast",
          badge: { text: "Upgraded", variant: "updated" }
        },
        { 
          title: "Client CRM", 
          href: "/admin/crm", 
          icon: <Users className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "Pro", variant: "pro" }
        },
        { 
          title: "Analytics", 
          href: "/admin/analytics", 
          icon: <BarChart className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
        { 
          title: "Insights Dashboard", 
          href: "/admin/insights-dashboard", 
          icon: <TrendingUp className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
      ]
    },
    {
      title: "Content Studio",
      icon: <Sparkles className="h-5 w-5" />,
      isExpandable: true,
      items: [
        {
          title: "Page Builder",
          icon: <Layers className="h-5 w-5" />,
          items: [
            { 
              title: "All Pages", 
              href: "/page-builder", 
              icon: <FileText className="h-5 w-5" />,
              requiresStaff: true 
            },
            { 
              title: "Create New Page", 
              href: "/page-builder/new", 
              icon: <PlusCircle className="h-5 w-5" />,
              requiresStaff: true,
              badge: { text: "Updated", variant: "updated" } 
            },
            { 
              title: "Page Templates", 
              href: "/page-builder/templates", 
              icon: <Layout className="h-5 w-5" />,
              requiresStaff: true 
            },
          ],
          requiresStaff: true,
          isNew: true
        },
        { 
          title: "Media Hub", 
          href: "/media", 
          icon: <FileImage className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "Enhanced", variant: "updated" } 
        },
        { 
          title: "Social Media Generator", 
          href: "/tools/social-media-generator", 
          icon: <Newspaper className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" }
        },
        { 
          title: "Blog Post Generator", 
          href: "/tools/blog-post-generator", 
          icon: <FileText className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
        { 
          title: "Business Network", 
          href: "/business-network", 
          icon: <Users className="h-5 w-5" />,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
        { 
          title: "Business Discover", 
          href: "/business-discover", 
          icon: <Globe className="h-5 w-5" />,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
        { 
          title: "Entrepreneur Support", 
          href: "/entrepreneur-support", 
          icon: <Lightbulb className="h-5 w-5" />,
          badge: { text: "New", variant: "new" },
          isNew: true
        }
      ]
    },
    // Content Studio now contains all content-related items directly
    {
      title: "Brand Center",
      icon: <Palette className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Brand Guidelines", 
          href: "/brand-guidelines", 
          icon: <PaintBucket className="h-5 w-5" />,
          requiresStaff: true,
          description: "Define your brand's visual identity"
        },
        { 
          title: "Business Identity", 
          href: "/business-identity", 
          icon: <CircleUser className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Site Branding", 
          href: "/admin/site-branding", 
          icon: <Image className="h-5 w-5" />,
          requiresStaff: true 
        },

      ]
    },
    {
      title: "Website Setup",
      icon: <SquarePen className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Homepage Setup", 
          href: "/homepage-setup", 
          icon: <Home className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Foundation Pages", 
          href: "/foundation-pages", 
          icon: <Layout className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Navigation Menus", 
          href: "/admin/menu-management", 
          icon: <ListOrdered className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "SEO Manager", 
          href: "/admin/seo", 
          icon: <Globe className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Domain Settings", 
          href: "/admin/domain-mapping", 
          icon: <LinkIcon className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" }
        },
        { 
          title: "Launch Ready", 
          href: "/launch-ready", 
          icon: <FastForward className="h-5 w-5" />,
          requiresStaff: true 
        },
      ]
    },
    {
      title: "System",
      icon: <Settings className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Account", 
          href: "/account", 
          icon: <User className="h-5 w-5" />
        },
        { 
          title: "Admin Settings", 
          href: "/admin/settings", 
          icon: <Settings className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "AI Companion", 
          href: "/admin/companion-settings", 
          icon: <MessageCircle className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Conversation Insights", 
          href: "/admin/conversation-insights", 
          icon: <Sparkles className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" },
          isNew: true
        },

        { 
          title: "Blueprint Management", 
          href: "/admin/blueprint-management", 
          icon: <Cpu className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
        { 
          title: "Clone Template", 
          href: "/admin/clone-template", 
          icon: <Lightbulb className="h-5 w-5" />,
          requiresStaff: true,
          badge: { text: "New", variant: "new" },
          isNew: true
        },
      ]
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if the current route is active (also checks sub-routes)
  const isActive = (href: string) => {
    return location === href || location.startsWith(href + '/');
  };

  // Type guard for SidebarItem
  const isSidebarItem = (item: SidebarItem | SidebarSubMenu): item is SidebarItem => {
    return 'href' in item;
  };

  // Render badge component for menu items
  const SidebarItemBadgeComponent = ({ badge }: { badge: SidebarItemBadge }) => {
    return (
      <Badge 
        variant={badge.variant}
        className="ml-auto text-[9px] py-0 h-4"
      >
        {badge.text}
      </Badge>
    );
  };

  // Helper for rendering a menu item
  const renderMenuItem = (item: SidebarItem, isNested = false) => {
    // If collapsed, show tooltip
    if (collapsed) {
      return (
        <TooltipProvider key={item.title} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center rounded-md p-2 transition-all duration-200",
                  isActive(item.href) 
                    ? "bg-[#008080]/10 text-[#008080]" 
                    : "text-[var(--navy)] hover:bg-[#008080]/10 hover:text-[#008080]",
                  "no-underline relative",
                  isNested && "ml-2"
                )}
              >
                <div className="relative">
                  {item.icon}
                  {item.isNew && !collapsed && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                  )}
                </div>
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              <p className="font-medium text-sm">{item.title}</p>
              {item.description && (
                <p className="text-xs text-gray-500">{item.description}</p>
              )}
              {item.badge && (
                <SidebarItemBadgeComponent badge={item.badge} />
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Normal expanded view
    return (
      <Link
        key={item.title}
        href={item.href}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 transition-all duration-200",
          isActive(item.href) 
            ? "bg-[#008080]/10 text-[#008080]" 
            : "text-[var(--navy)] hover:bg-[#008080]/10 hover:text-[#008080]",
          "no-underline group",
          isNested && "ml-6 text-sm"
        )}
      >
        <div className="flex items-center">
          <span className="mr-3 relative">
            {item.icon}
            {item.isNew && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
            )}
          </span>
          <span>{item.title}</span>
        </div>
        
        {item.badge && <SidebarItemBadgeComponent badge={item.badge} />}
      </Link>
    );
  };

  // Helper for rendering submenu items
  const renderSubMenu = (submenu: SidebarSubMenu) => {
    const isExpanded = expandedSubMenus[submenu.title] || false;
    
    // If collapsed mode is active, handle submenu differently
    if (collapsed) {
      return (
        <TooltipProvider key={submenu.title} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center justify-center rounded-md p-2 text-[var(--navy)] hover:bg-[#008080]/10 hover:text-[#008080] relative cursor-pointer"
              >
                <div className="relative">
                  {submenu.icon}
                  {submenu.isNew && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1 p-1" sideOffset={5}>
              <p className="font-medium text-sm px-2 py-1">{submenu.title}</p>
              <div className="flex flex-col gap-1 mt-1">
                {submenu.items.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-[#008080]/10 hover:text-[#008080] no-underline text-[var(--navy)]"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    {item.badge && <SidebarItemBadgeComponent badge={item.badge} />}
                  </Link>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Expanded submenu view
    return (
      <div key={submenu.title} className="space-y-1">
        <button
          onClick={(e) => toggleSubMenu(submenu.title, e)}
          className={cn(
            "w-full flex items-center justify-between rounded-md px-3 py-2",
            "text-[var(--navy)] hover:bg-[#008080]/10 hover:text-[#008080]",
            "transition-all duration-200 focus:outline-none"
          )}
        >
          <div className="flex items-center">
            <span className="mr-3 relative">
              {submenu.icon}
              {submenu.isNew && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              )}
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
          <div className="mt-1 space-y-1 px-1">
            {submenu.items.map(item => renderMenuItem(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className={cn(
          "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm",
          collapsed ? "w-[70px]" : "w-[280px]"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "h-16 border-b border-gray-200 flex items-center justify-between px-4",
          "bg-gradient-to-r from-white to-[#008080]/5"
        )}>
          <AdminSidebarLogo collapsed={collapsed} />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-[#008080]/10 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <MenuIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {sidebarSections.map((section) => {
            // Filter out items based on permissions
            const filteredItems = section.items.filter(item => {
              if ('items' in item) { // It's a submenu
                // Include submenu if at least one of its items is accessible
                const accessibleSubItems = item.items.filter(subItem => 
                  !subItem.requiresStaff || (subItem.requiresStaff && isStaff)
                );
                return accessibleSubItems.length > 0 && (!item.requiresStaff || (item.requiresStaff && isStaff));
              } else { // It's a regular item
                return !item.requiresStaff || (item.requiresStaff && isStaff);
              }
            });
            
            // Skip entire section if empty
            if (filteredItems.length === 0) return null;
            
            // For expanded view, we show a section header with icon
            const sectionHeader = !collapsed ? (
              <div 
                className={cn(
                  "flex items-center px-4 mb-2",
                  section.isExpandable ? "cursor-pointer" : ""
                )}
                onClick={section.isExpandable ? () => toggleSection(section.title) : undefined}
              >
                <span className="mr-2 text-[var(--navy)]">{section.icon}</span>
                <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                  {section.title}
                </h3>
                {section.isExpandable && (
                  <ChevronDown 
                    className={cn(
                      "ml-auto h-4 w-4 text-gray-400 transition-transform duration-200",
                      expandedSections[section.title] ? "transform rotate-180" : ""
                    )} 
                  />
                )}
              </div>
            ) : (
              // For collapsed view, we show a subtle divider
              <div className="border-t border-gray-100 mx-2 my-3"></div>
            );
            
            return (
              <div key={section.title} className="px-2">
                {sectionHeader}
                
                {(!section.isExpandable || expandedSections[section.title] || collapsed) && (
                  <div className={cn("space-y-1", collapsed ? "flex flex-col items-center" : "")}>
                    {filteredItems.map((item) => (
                      isSidebarItem(item)
                        ? renderMenuItem(item)
                        : renderSubMenu(item)
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-white to-[#008080]/5">
          <Link href="/">
            <Button 
              variant="outline"
              className={cn(
                "w-full flex items-center justify-center transition-all duration-200",
                collapsed ? "p-2" : "",
                "border-[var(--navy)] bg-white text-[var(--navy)] hover:text-[#008080] hover:border-[#008080]"
              )}
            >
              <Globe className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
              {!collapsed && "View Website"}
            </Button>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}