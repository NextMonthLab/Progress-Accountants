import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Settings, FileImage, ChevronDown, Users, HomeIcon, Briefcase, Phone, Layout, LayoutDashboard, Store, Box, PaintBucket, BookOpen, FastForward, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/ClientDataProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define menu item groups
type MenuItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  requiresStaff?: boolean;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isStaff } = useAuth();
  const [location] = useLocation();

  // Define public-facing menu items
  const publicMenuGroups: MenuGroup[] = [
    {
      label: "Business",
      items: [
        { label: "Services", href: "/services", icon: <Briefcase className="h-4 w-4 mr-2" /> },
        { label: "Industries", href: "#industries", icon: <FastForward className="h-4 w-4 mr-2" /> },
        { label: "Why Us", href: "#why-us", icon: <Sparkles className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "Company",
      items: [
        { label: "About Us", href: "/about", icon: <BookOpen className="h-4 w-4 mr-2" /> },
        { label: "Our Team", href: "/team", icon: <Users className="h-4 w-4 mr-2" /> },
        { label: "Studio", href: "/studio-banbury", icon: <Layout className="h-4 w-4 mr-2" /> },
        { label: "Contact", href: "/contact", icon: <Phone className="h-4 w-4 mr-2" /> },
      ]
    }
  ];

  // Define admin menu items (only visible to staff)
  const adminMenuGroups: MenuGroup[] = [
    {
      label: "Client Tools",
      items: [
        { label: "Dashboard", href: "/client-dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
        { label: "Tools Hub", href: "/tools-hub", icon: <Box className="h-4 w-4 mr-2" /> },
        { label: "Marketplace", href: "/marketplace", icon: <Store className="h-4 w-4 mr-2" /> },
        { label: "Installed Tools", href: "/installed-tools", icon: <Box className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "Admin",
      items: [
        { label: "Brand Guidelines", href: "/brand-guidelines", icon: <PaintBucket className="h-4 w-4 mr-2" />, requiresStaff: true },
        { label: "Business Identity", href: "/business-identity", icon: <HomeIcon className="h-4 w-4 mr-2" />, requiresStaff: true },
        { label: "Homepage Setup", href: "/homepage-setup", icon: <Layout className="h-4 w-4 mr-2" />, requiresStaff: true },
        { label: "Foundation Pages", href: "/foundation-pages", icon: <Layout className="h-4 w-4 mr-2" />, requiresStaff: true },
        { label: "Launch Ready", href: "/launch-ready", icon: <FastForward className="h-4 w-4 mr-2" />, requiresStaff: true },
        { label: "Media Manager", href: "/media", icon: <FileImage className="h-4 w-4 mr-2" />, requiresStaff: true },
        { label: "Admin Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4 mr-2" />, requiresStaff: true },
      ]
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Helper to determine if a link is active
  const isActive = (href: string) => {
    return location === href;
  };

  // Determine if we should show the Public or Admin menu based on the current path
  const isAdminView = location.startsWith('/admin') || 
                     location.includes('-setup') || 
                     location === '/brand-guidelines' || 
                     location === '/business-identity' || 
                     location === '/foundation-pages' || 
                     location === '/marketplace' || 
                     location === '/installed-tools' || 
                     location === '/media';

  // Function to render nav links with dropdown
  const renderDesktopDropdown = (group: MenuGroup) => {
    const filteredItems = group.items.filter(item => !item.requiresStaff || (item.requiresStaff && isStaff));
    
    if (filteredItems.length === 0) return null;
    
    return (
      <DropdownMenu key={group.label}>
        <DropdownMenuTrigger className="font-medium hover:text-[var(--orange)] transition duration-300 outline-none flex items-center">
          {group.label} <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px]">
          <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filteredItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                href={item.href}
                className={`flex items-center py-2 px-2 ${isActive(item.href) ? 'text-[var(--orange)]' : 'hover:text-[var(--orange)]'} transition duration-300 no-underline w-full`}
              >
                {item.icon}
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Function to render mobile menu items with headings
  const renderMobileMenuGroup = (group: MenuGroup) => {
    const filteredItems = group.items.filter(item => !item.requiresStaff || (item.requiresStaff && isStaff));
    
    if (filteredItems.length === 0) return null;
    
    return (
      <div key={group.label} className="py-2">
        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">{group.label}</h4>
        {filteredItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center py-2 px-2 font-medium ${isActive(item.href) ? 'text-[var(--orange)]' : 'hover:text-[var(--orange)]'} transition duration-300 no-underline`}
            onClick={closeMenu}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-poppins font-bold text-2xl no-underline" style={{ color: 'var(--navy)' }}>
            Progress <span style={{ color: 'var(--orange)' }}>Accountants</span>
          </Link>
        </div>
        
        {/* Desktop Menu - Show public-facing menu by default, or admin menu if in admin section */}
        <div className="hidden md:flex items-center space-x-6">
          {!isAdminView ? (
            // Public-facing menu
            <>
              {publicMenuGroups.map(renderDesktopDropdown)}
              
              {/* Always show the Client Portal link if the user is authenticated */}
              <Link 
                href="/client-portal" 
                className={`font-medium ${isActive('/client-portal') ? 'text-[var(--orange)]' : 'hover:text-[var(--orange)]'} transition duration-300 no-underline`}
              >
                Client Portal
              </Link>
              
              {/* Show a link to Admin area if user is staff */}
              {isStaff && (
                <Link 
                  href="/client-dashboard" 
                  className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              )}
              
              <a href="#book-call">
                <Button 
                  style={{ 
                    backgroundColor: 'var(--orange)',
                    color: 'white' 
                  }}
                  className="hover:shadow-md hover:-translate-y-[2px] transition duration-300"
                >
                  Book a Call
                </Button>
              </a>
            </>
          ) : (
            // Admin menu - only shown when in admin area or to staff
            <>
              {adminMenuGroups.map(renderDesktopDropdown)}
              
              {/* Always show a way to go back to the public site */}
              <Link 
                href="/" 
                className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline flex items-center"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                View Website
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? (
            <X style={{ color: 'var(--navy)' }} className="h-6 w-6" />
          ) : (
            <Menu style={{ color: 'var(--navy)' }} className="h-6 w-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white w-full absolute z-20 shadow-md overflow-y-auto max-h-[80vh] ${isMenuOpen ? '' : 'hidden'}`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col divide-y">
          {!isAdminView ? (
            // Public-facing mobile menu
            <>
              {/* Public menu groups */}
              {publicMenuGroups.map(renderMobileMenuGroup)}
              
              {/* Client Portal section */}
              <div className="py-2">
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">Portal</h4>
                <Link 
                  href="/client-portal" 
                  className="flex items-center py-2 px-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
                  onClick={closeMenu}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Client Portal
                </Link>
              </div>
              
              {/* Admin link if staff */}
              {isStaff && (
                <div className="py-2">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">Admin</h4>
                  <Link 
                    href="/client-dashboard" 
                    className="flex items-center py-2 px-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </div>
              )}
              
              {/* Call to action */}
              <div className="py-4">
                <a 
                  href="#book-call"
                  onClick={closeMenu}
                  className="inline-block text-center w-full"
                >
                  <Button 
                    className="w-full hover:shadow-md hover:-translate-y-[2px] transition duration-300"
                    style={{ 
                      backgroundColor: 'var(--orange)',
                      color: 'white' 
                    }}
                  >
                    Book a Call
                  </Button>
                </a>
              </div>
            </>
          ) : (
            // Admin mobile menu
            <>
              {/* Admin menu groups */}
              {adminMenuGroups.map(renderMobileMenuGroup)}
              
              {/* Link back to public site */}
              <div className="py-4">
                <Link 
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center py-2 px-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  View Website
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
