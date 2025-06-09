import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, LayoutDashboard, ChevronDown, Users, Briefcase, 
  Phone, Layout, BookOpen, FastForward, Sparkles, UserPlus,
  ArrowLeftCircle, Newspaper, Film, Music, Building2, Building,
  Calculator, Calendar, PhoneCall
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
import progressLogoPath from "@assets/Light Logo.png";

// NavbarLogo component for displaying site branding
function NavbarLogo() {
  return (
    <Link href="/" className="no-underline flex items-center">
      <img 
        src={progressLogoPath} 
        alt="Progress Accountants | Advisors | Growth Partners" 
        className="h-[50px] object-contain"
      />
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
  const { user } = useAuth();
  const { tenant } = useTenant();
  const isStaff = user?.userType === 'admin' || user?.userType === 'super_admin' || user?.userType === 'editor' || user?.isSuperAdmin;
  const [location] = useLocation();

  // Check if client registration is enabled
  const clientRegistrationEnabled = tenant?.customization?.featureFlags?.enableClientLogin;

  // Define public-facing menu items
  const publicMenuGroups: MenuGroup[] = [
    {
      label: "Services",
      items: [
        { label: "All Services", href: "/services", icon: <Briefcase className="h-4 w-4 mr-2" /> },
        { label: "Tax Planning & Preparation", href: "/services/tax-planning", icon: <Calculator className="h-4 w-4 mr-2" /> },
        { label: "Bookkeeping", href: "/services/bookkeeping", icon: <BookOpen className="h-4 w-4 mr-2" /> },
        { label: "Business Advisory", href: "/services/business-advisory", icon: <Briefcase className="h-4 w-4 mr-2" /> },
        { label: "Financial Reporting", href: "/services/financial-reporting", icon: <Layout className="h-4 w-4 mr-2" /> },
        { label: "Audit Support", href: "/services/audit-support", icon: <Building className="h-4 w-4 mr-2" /> },
        { label: "Cloud Accounting", href: "/services/cloud-accounting", icon: <Building2 className="h-4 w-4 mr-2" /> },
        { label: "Industry-Specific Accounting", href: "/services/industry-specific", icon: <Building className="h-4 w-4 mr-2" /> },
        { label: "Virtual Finance Director", href: "/services/virtual-finance-director", icon: <Users className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "Industries",
      items: [
        { label: "Film & TV", href: "/industries/film", icon: <Film className="h-4 w-4 mr-2" /> },
        { label: "Music", href: "/industries/music", icon: <Music className="h-4 w-4 mr-2" /> },
        { label: "Construction", href: "/industries/construction", icon: <Building2 className="h-4 w-4 mr-2" /> },
        { label: "Professional Services", href: "/industries/professional-services", icon: <Briefcase className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "Resources",
      items: [
        { label: "Business Calculator", href: "/business-calculator", icon: <Calculator className="h-4 w-4 mr-2" /> },
        { label: "SME Support Hub", href: "/sme-support-hub", icon: <Building2 className="h-4 w-4 mr-2" /> },
        { label: "Podcast Studio", href: "/studio-banbury", icon: <Layout className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: "About",
      items: [
        { label: "About Us", href: "/about", icon: <BookOpen className="h-4 w-4 mr-2" /> },
        { label: "Why Us", href: "/why-us", icon: <Award className="h-4 w-4 mr-2" /> },
        { label: "Our Team", href: "/team", icon: <Users className="h-4 w-4 mr-2" /> },
        { label: "Contact Us", href: "/contact", icon: <Phone className="h-4 w-4 mr-2" /> },
        { label: "Podcast Studio", href: "/studio-banbury", icon: <Layout className="h-4 w-4 mr-2" /> },
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
        <DropdownMenuTrigger className="font-medium text-white hover:text-[#7B3FE4] transition duration-300 outline-none flex items-center">
          {group.label} <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px] bg-zinc-900 border-zinc-700">
          <DropdownMenuLabel className="text-white">{group.label}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-700" />
          {group.items.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                href={item.href}
                className={`flex items-center py-2 px-2 ${isActive(item.href) ? 'text-[#7B3FE4]' : 'text-gray-300 hover:text-[#7B3FE4]'} transition duration-300 no-underline w-full`}
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
        <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2 px-2">{group.label}</h4>
        {group.items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center py-2 px-2 font-medium ${isActive(item.href) ? 'text-[#7B3FE4]' : 'text-gray-300 hover:text-[#7B3FE4]'} transition duration-300 no-underline`}
            onClick={closeMenu}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    );
  };

  // Define local colors for the public site that don't depend on global theme
  const publicColors = {
    navy: "#1c3668",
    navyDark: "#132549",
    orange: "#f15a29",
    white: "#ffffff",
    gray: "#f0f0f0"
  };

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <nav className="container mx-auto px-12 md:px-16 py-4 flex items-center">
        <div className="flex items-center flex-shrink-0">
          <NavbarLogo />
        </div>

        {/* Desktop Menu - Public-facing menu only */}
        <div className="hidden md:flex items-center space-x-8 ml-16">
          {publicMenuGroups.map(renderDesktopDropdown)}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          {/* Show login button and potentially client registration for non-authenticated users */}
          {!user && (
            <>
              {clientRegistrationEnabled && tenant?.id && (
                <Button 
                  variant="outline"
                  className="border-purple-400/30 text-purple-300 hover:bg-[#7B3FE4] hover:text-white hover:border-[#7B3FE4]"
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
                variant="default"
                className="gradient-bg text-white hover:shadow-md transition-all progress-button h-10 px-4"
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



          {/* Decoupled "Book a Call" button using Progress brand colors */}
          <a 
            href="#book-call" 
            className="progress-button-override"
            style={{
              background: 'linear-gradient(135deg, #7B3FE4 0%, #3FA4E4 100%)',
              backgroundColor: '#7B3FE4',
              color: 'white',
              padding: '0 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              height: '40px',
              lineHeight: '1',
              whiteSpace: 'nowrap',
              border: 'none'
            }}
          >
            <PhoneCall className="h-4 w-4" />
            <span>Book a Call</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu - Public-facing only */}
      <div 
        className={`md:hidden bg-zinc-900 w-full absolute z-20 shadow-md border-t border-zinc-700 overflow-y-auto max-h-[80vh] ${isMenuOpen ? '' : 'hidden'}`}
      >
        <div className="container mx-auto px-12 md:px-16 py-3 flex flex-col divide-y">
          {publicMenuGroups.map(renderMobileMenuGroup)}

          {/* Login section for non-authenticated users */}
          {!user && (
            <div className="py-2">
              <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2 px-2">Access</h4>

              {clientRegistrationEnabled && tenant?.id && (
                <Button 
                  variant="outline"
                  className="w-full mb-2 border-purple-400/30 text-purple-300 hover:bg-[#7B3FE4] hover:text-white hover:border-[#7B3FE4]"
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
                variant="default"
                className="w-full gradient-bg text-white hover:shadow-md progress-button"
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



          {/* Call to action */}
          <div className="py-4">
            <a 
              href="#book-call"
              onClick={closeMenu}
              className="inline-block text-center w-full"
            >
              {/* Decoupled mobile "Book a Call" button using public-specific CSS classes */}
              <button className="book-call-btn-mobile">
                <PhoneCall className="h-4 w-4 mr-2" />
                Book a Call
              </button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}