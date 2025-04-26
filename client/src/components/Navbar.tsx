import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, LayoutDashboard, ChevronDown, Users, Briefcase, 
  Phone, Layout, BookOpen, FastForward, Sparkles, UserPlus,
  ArrowLeftCircle, Newspaper, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { getSiteBranding } from "@/lib/api";
import { defaultSiteBranding, SiteBranding } from "@shared/site_branding";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// NavbarLogo component for displaying site branding
function NavbarLogo() {
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
        console.error("Error loading site branding for logo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBranding();
  }, []);

  // Display image logo if available, otherwise use text logo
  if (siteBranding.logo.imageUrl) {
    return (
      <Link href="/" className="no-underline flex items-center">
        <img 
          src={siteBranding.logo.imageUrl} 
          alt={siteBranding.logo.altText} 
          className="max-h-10 object-contain"
        />
      </Link>
    );
  }

  // Default text logo
  return (
    <Link href="/" className="font-poppins font-bold text-2xl no-underline" style={{ color: 'var(--navy)' }}>
      {siteBranding.logo.text.includes(" ") 
        ? siteBranding.logo.text.split(" ").map((word, index, arr) => (
            <span key={index} style={{ color: index === arr.length - 1 ? 'var(--orange)' : 'var(--navy)' }}>
              {word}{index < arr.length - 1 ? " " : ""}
            </span>
          ))
        : siteBranding.logo.text
      }
    </Link>
  );
}

// Define menu item groups
type MenuItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

// This navbar is ONLY for public-facing pages
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { tenant } = useTenant();
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;
  const [location] = useLocation();
  
  // Check if client registration is enabled
  const clientRegistrationEnabled = tenant?.customization?.featureFlags?.enableClientLogin;

  // Define public-facing menu items
  const publicMenuGroups: MenuGroup[] = [
    {
      label: "Business",
      items: [
        { label: "Services", href: "/services", icon: <Briefcase className="h-4 w-4 mr-2" /> },
        { label: "Industries", href: "/industries", icon: <FastForward className="h-4 w-4 mr-2" /> },
        { label: "Why Us", href: "/why-us", icon: <Sparkles className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "Company",
      items: [
        { label: "About Us", href: "/about", icon: <BookOpen className="h-4 w-4 mr-2" /> },
        { label: "Our Team", href: "/team", icon: <Users className="h-4 w-4 mr-2" /> },
        { label: "Contact", href: "/contact", icon: <Phone className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "Podcast Studio",
      items: [
        { label: "Studio Facilities", href: "/studio-banbury", icon: <Layout className="h-4 w-4 mr-2" /> },
        { label: "Book Studio Time", href: "/studio-banbury#booking-form", icon: <Layout className="h-4 w-4 mr-2" /> },
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

  // Function to render nav links with dropdown
  const renderDesktopDropdown = (group: MenuGroup) => {
    return (
      <DropdownMenu key={group.label}>
        <DropdownMenuTrigger className="font-medium hover:text-[var(--orange)] transition duration-300 outline-none flex items-center">
          {group.label} <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px]">
          <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {group.items.map((item) => (
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
    return (
      <div key={group.label} className="py-2">
        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">{group.label}</h4>
        {group.items.map((item) => (
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
          <NavbarLogo />
        </div>
        
        {/* Desktop Menu - Public-facing menu only */}
        <div className="hidden md:flex items-center space-x-6">
          {publicMenuGroups.map(renderDesktopDropdown)}
          
          {/* News link */}
          <Link 
            href="/news" 
            className={`font-medium ${isActive('/news') ? 'text-[var(--orange)]' : 'hover:text-[var(--orange)]'} transition duration-300 no-underline flex items-center`}
          >
            <Newspaper className="h-4 w-4 mr-2" />
            News
          </Link>
          
          {/* Always show the Client Portal link */}
          <Link 
            href="/client-portal" 
            className={`font-medium ${isActive('/client-portal') ? 'text-[var(--orange)]' : 'hover:text-[var(--orange)]'} transition duration-300 no-underline`}
          >
            Client Portal
          </Link>
          
          {/* Show login button and potentially client registration for non-authenticated users */}
          {!user && (
            <>
              {clientRegistrationEnabled && tenant?.id && (
                <Button 
                  variant="outline"
                  className="border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--orange)] hover:text-white hover:border-[var(--orange)]"
                  asChild
                >
                  <Link 
                    href={`/client-register/${tenant.id}`} 
                    className="no-underline flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline"
                className="border-[var(--orange)] text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white"
                asChild
              >
                <Link 
                  href="/auth" 
                  className="no-underline flex items-center"
                >
                  Login / Register
                </Link>
              </Button>
            </>
          )}
          
          {/* Show admin dashboard link with high visibility for staff */}
          {isStaff && (
            <Button 
              variant="outline"
              className="border-[var(--navy)] text-[var(--navy)] hover:text-[var(--orange)] hover:border-[var(--orange)]"
              asChild
            >
              <Link 
                href="/admin/dashboard" 
                className="no-underline flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
          )}
          
          {/* Logout button for any authenticated user */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.username}'s profile`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 cursor-pointer"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      
      {/* Mobile Menu - Public-facing only */}
      <div 
        className={`md:hidden bg-white w-full absolute z-20 shadow-md overflow-y-auto max-h-[80vh] ${isMenuOpen ? '' : 'hidden'}`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col divide-y">
          {publicMenuGroups.map(renderMobileMenuGroup)}
          
          {/* News section */}
          <div className="py-2">
            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">News</h4>
            <Link 
              href="/news" 
              className="flex items-center py-2 px-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
              onClick={closeMenu}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Latest News
            </Link>
          </div>
          
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
          
          {/* Login section for non-authenticated users */}
          {!user && (
            <div className="py-2">
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">Access</h4>
              
              {clientRegistrationEnabled && tenant?.id && (
                <Button 
                  variant="outline"
                  className="w-full mb-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--orange)] hover:text-white hover:border-[var(--orange)]"
                  onClick={closeMenu}
                  asChild
                >
                  <Link 
                    href={`/client-register/${tenant.id}`} 
                    className="flex items-center justify-center py-2 no-underline"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Link>
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="w-full border-[var(--orange)] text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white"
                onClick={closeMenu}
                asChild
              >
                <Link 
                  href="/auth" 
                  className="flex items-center justify-center py-2 no-underline"
                >
                  Login / Register
                </Link>
              </Button>
            </div>
          )}
          
          {/* Admin link if staff */}
          {isStaff && (
            <div className="py-2">
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">Admin</h4>
              <Button 
                variant="outline"
                className="w-full border-[var(--navy)] text-[var(--navy)] hover:text-[var(--orange)] hover:border-[var(--orange)]"
                onClick={closeMenu}
                asChild
              >
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center justify-center py-2 no-underline"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          )}
          
          {/* User Profile & Logout section */}
          {user && (
            <div className="py-2">
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 px-2">My Account</h4>
              
              <div className="flex items-center mb-3 px-2">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={`${user.username}'s profile`}
                    className="h-10 w-10 rounded-full mr-3 object-cover" 
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mr-3">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{user.name || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <Link 
                href="/profile" 
                className="flex items-center py-2 px-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
                onClick={closeMenu}
              >
                Profile Settings
              </Link>
              
              <button
                className="flex items-center py-2 px-2 w-full text-left font-medium text-red-500 hover:text-red-600 transition duration-300"
                onClick={() => {
                  closeMenu();
                  logoutMutation.mutate();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
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
        </div>
      </div>
    </header>
  );
}
