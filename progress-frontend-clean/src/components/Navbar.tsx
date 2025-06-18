import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, ChevronDown, Users, Briefcase, 
  Phone, BookOpen, Film, Music, Building2, Building,
  Calculator, Calendar, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import logo - you'll need to place Light Logo.png in src/assets/
// import progressLogoPath from "@assets/Light Logo.png";

// NavbarLogo component for displaying site branding
function NavbarLogo() {
  return (
    <Link href="/" className="no-underline flex items-center">
      <div className="h-[50px] flex items-center">
        <span className="text-2xl font-bold text-primary">Progress Accountants</span>
      </div>
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

// This navbar is for public-facing pages only
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

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
        { label: "Client Dashboard", href: "/client-dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
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
      <nav className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center flex-shrink-0">
          <NavbarLogo />
        </div>

        {/* Desktop Menu - Public-facing menu only */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {publicMenuGroups.map(renderDesktopDropdown)}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {/* Show admin dashboard link with high visibility for staff */}
          {isStaff && (
            <Button 
              variant="default"
              className="shadow-sm hover:shadow-md transition-all font-medium"
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

          {/* Decoupled "Book a Call" button using Progress brand colors */}
          <button 
            onClick={() => {
              console.log('Button clicked - opening Calendly');
              window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'width=700,height=800,resizable=yes,scrollbars=yes');
            }}
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
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <PhoneCall className="h-4 w-4" />
            <span>Book a Call</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden flex items-center p-2" 
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
        className={`lg:hidden bg-zinc-900 w-full absolute z-20 shadow-md border-t border-zinc-700 overflow-y-auto max-h-[80vh] ${isMenuOpen ? '' : 'hidden'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col divide-y divide-zinc-700">
          {publicMenuGroups.map(renderMobileMenuGroup)}

          {/* Admin section for staff users */}
          {isStaff && (
            <div className="py-2">
              <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2 px-2">Admin</h4>
              <Button 
                variant="default"
                className="w-full shadow-sm hover:shadow-md transition-all font-medium"
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



          {/* Call to action */}
          <div className="py-4">
            <button 
              onClick={() => {
                console.log('Button clicked - opening Calendly');
                window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'width=700,height=800,resizable=yes,scrollbars=yes');
                closeMenu();
              }}
              className="book-call-btn-mobile w-full"
              style={{
                background: 'linear-gradient(135deg, #7B3FE4 0%, #3FA4E4 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}