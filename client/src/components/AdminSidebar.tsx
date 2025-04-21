import { Link, useLocation } from "wouter";
import { 
  Settings, 
  FileImage, 
  LayoutDashboard, 
  Box, 
  Home, 
  Users, 
  Store, 
  PaintBucket, 
  Layout, 
  FastForward, 
  Globe,
  Menu,
  X,
  ChevronRight,
  MessageCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  requiresStaff?: boolean;
}

type SidebarSection = {
  title: string;
  items: SidebarItem[];
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Check if user has staff privileges (admin, super_admin, or editor)
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;

  // Define all admin menu sections
  const sidebarSections: SidebarSection[] = [
    {
      title: "Dashboard",
      items: [
        { 
          title: "Overview", 
          href: "/client-dashboard", 
          icon: <LayoutDashboard className="h-5 w-5" /> 
        },
        { 
          title: "CRM", 
          href: "/admin/crm", 
          icon: <Users className="h-5 w-5" />,
          requiresStaff: true
        },
      ]
    },
    {
      title: "Tools",
      items: [
        { 
          title: "Tools Hub", 
          href: "/tools-hub", 
          icon: <Box className="h-5 w-5" /> 
        },
        { 
          title: "Marketplace", 
          href: "/marketplace", 
          icon: <Store className="h-5 w-5" /> 
        },
        { 
          title: "Installed Tools", 
          href: "/installed-tools", 
          icon: <Box className="h-5 w-5" /> 
        },
      ]
    },
    {
      title: "Website Management",
      items: [
        { 
          title: "Brand Guidelines", 
          href: "/brand-guidelines", 
          icon: <PaintBucket className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Business Identity", 
          href: "/business-identity", 
          icon: <Home className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Homepage Setup", 
          href: "/homepage-setup", 
          icon: <Layout className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Foundation Pages", 
          href: "/foundation-pages", 
          icon: <Layout className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Create New Page", 
          href: "/create-new-page", 
          icon: <PlusCircle className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Launch Ready", 
          href: "/launch-ready", 
          icon: <FastForward className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Media Manager", 
          href: "/media", 
          icon: <FileImage className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Resources Setup", 
          href: "/admin/resources-setup", 
          icon: <FileText className="h-5 w-5" />,
          requiresStaff: true 
        },
      ]
    },
    {
      title: "Settings",
      items: [
        { 
          title: "Admin Settings", 
          href: "/admin/settings", 
          icon: <Settings className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "SEO Manager", 
          href: "/admin/seo", 
          icon: <Globe className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Brand Manager", 
          href: "/admin/brand", 
          icon: <PaintBucket className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Tenant Customization", 
          href: "/admin/tenant", 
          icon: <Settings className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Theme Management", 
          href: "/admin/theme", 
          icon: <PaintBucket className="h-5 w-5" />,
          requiresStaff: true 
        },
        { 
          title: "Companion Settings", 
          href: "/admin/companion-settings", 
          icon: <MessageCircle className="h-5 w-5" />,
          requiresStaff: true 
        },
      ]
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if the current route is active
  const isActive = (href: string) => {
    return location === href;
  };

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!collapsed && (
          <Link href="/client-dashboard" className="font-poppins font-bold text-xl no-underline" style={{ color: 'var(--navy)' }}>
            Progress <span style={{ color: 'var(--orange)' }}>Admin</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {sidebarSections.map((section) => {
          // Filter out items based on permissions
          const filteredItems = section.items.filter(item => 
            !item.requiresStaff || (item.requiresStaff && isStaff)
          );
          
          // Skip entire section if empty
          if (filteredItems.length === 0) return null;
          
          return (
            <div key={section.title} className="px-3">
              {!collapsed && (
                <h3 className="mb-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 transition-colors",
                      isActive(item.href) 
                        ? "bg-gray-100 text-[var(--orange)]" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-[var(--orange)]",
                      "no-underline"
                    )}
                  >
                    <span className={cn("", collapsed ? "mx-auto" : "mr-3")}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/">
          <Button 
            variant="outline"
            className={cn(
              "w-full flex items-center justify-center",
              collapsed ? "px-2" : "",
              "border-[var(--navy)] text-[var(--navy)] hover:text-[var(--orange)] hover:border-[var(--orange)]"
            )}
          >
            <Globe className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
            {!collapsed && "View Website"}
          </Button>
        </Link>
      </div>
    </div>
  );
}