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
  MessageSquare,
  FileText,
  PlusCircle,
  Layers,
  Image,
  Target,
  Share2,
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
  Brain,
  Bot,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Progress Accountants logo is in public directory

// Admin sidebar logo component
function AdminSidebarLogo({ collapsed }: { collapsed: boolean }) {
  const [logoError, setLogoError] = useState(false);

  if (collapsed) {
    return null;
  }

  // Use the provided logo with fallback
  return (
    <Link href="/admin/dashboard" className="no-underline flex flex-col items-center py-4">
      <div className="text-xs text-gray-400 mb-2">Powered by</div>
      {!logoError ? (
        <img 
          src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1746537994/8A3D82EC-31EF-4209-85E2-D1D284F5E960_lnzuah.png" 
          alt="SmartSite Logo" 
          className="max-h-8 object-contain"
          onError={() => setLogoError(true)}
          onLoad={() => setLogoError(false)}
        />
      ) : (
        <div className="text-white font-bold text-lg">
          SmartSite
        </div>
      )}
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
      title: "Quick Actions",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isExpandable: false,
      items: [
        { 
          title: "Dashboard", 
          href: "/admin/dashboard", 
          icon: <LayoutDashboard className="h-5 w-5" />,
          description: "Main admin dashboard"
        }
      ]
    },
    {
      title: "🗨️ Conversations & Customers",
      icon: <MessageSquare className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Conversation Insights", 
          href: "/admin/conversation-insights", 
          icon: <MessageSquare className="h-5 w-5" />,
          description: "Chat transcripts, filters, and tagging"
        },
        { 
          title: "CRM", 
          href: "/admin/crm", 
          icon: <Users className="h-5 w-5" />,
          description: "Lead tracking and contact history"
        },
        { 
          title: "Lead Radar", 
          href: "/admin/leads/lead-radar", 
          icon: <Target className="h-5 w-5" />,
          description: "Lead scoring and visit-based triggers"
        },
        { 
          title: "SmartSite Autopilot", 
          href: "/admin/autopilot", 
          icon: <Bot className="h-5 w-5" />,
          description: "Assistant override, blog automation, notifications",
          badge: { text: "New", variant: "new" }
        }
      ]
    },
    {
      title: "✍️ Insights & Content",
      icon: <TrendingUp className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Insights Dashboard", 
          href: "/admin/insights-dashboard", 
          icon: <TrendingUp className="h-5 w-5" />,
          description: "User behavior, page engagement"
        },
        { 
          title: "User Insights", 
          href: "/admin/insight-users", 
          icon: <Users className="h-5 w-5" />,
          description: "Who's interacting and how"
        },
        { 
          title: "Blog Posts", 
          href: "/admin/content/blog-posts", 
          icon: <FileText className="h-5 w-5" />,
          description: "AI-powered blog content generation",
          requiresStaff: true
        },
        { 
          title: "Social Posts", 
          href: "/admin/content/social-posts", 
          icon: <Share2 className="h-5 w-5" />,
          description: "Social media content creation",
          requiresStaff: true
        },
        { 
          title: "Feature Requests", 
          href: "/admin/scope-request", 
          icon: <MessageSquare className="h-5 w-5" />,
          description: "Optional feature request capture"
        }
      ]
    },
    {
      title: "🌐 Market View (Upgrade Required)",
      icon: <Globe className="h-5 w-5" />,
      isExpandable: true,
      items: [
        { 
          title: "Market Trends", 
          href: "/admin/market-trends", 
          icon: <TrendingUp className="h-5 w-5" />,
          description: "Pulls live industry data, keyword shifts",
          badge: { text: "Pro", variant: "pro" }
        },
        { 
          title: "Competitor Watch", 
          href: "/admin/competitor-watch", 
          icon: <Target className="h-5 w-5" />,
          description: "AI-inferred competitor moves",
          badge: { text: "Pro", variant: "pro" }
        },
        { 
          title: "Trend Prompts", 
          href: "/admin/trend-prompts", 
          icon: <Lightbulb className="h-5 w-5" />,
          description: "Suggested post/campaign ideas",
          badge: { text: "Pro", variant: "pro" }
        }
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
                "w-full flex items-center justify-center transition-all duration-200 mb-3",
                collapsed ? "p-2" : "",
                "border-[var(--navy)] bg-white text-[var(--navy)] hover:text-[#008080] hover:border-[#008080]"
              )}
            >
              <Globe className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
              {!collapsed && "View Website"}
            </Button>
          </Link>
          
          {/* Powered by NextMonth */}
          {!collapsed && (
            <div className="flex flex-col items-center justify-center mt-2 space-y-1">
              <span className="text-xs text-gray-500">Powered by</span>
              <img 
                src="/assets/New Logo (white).png"
                alt="NextMonth"
                className="w-20 h-auto opacity-80"
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}