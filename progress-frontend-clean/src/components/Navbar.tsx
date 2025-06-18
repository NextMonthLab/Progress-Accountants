import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Users, Briefcase, Phone, BookOpen, Film, Music, Building2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        { label: "All Services", href: "/services", icon: <Briefcase className="h-4 w-4" /> },
        { label: "Tax Planning & Preparation", href: "/services/tax-planning", icon: <BookOpen className="h-4 w-4" /> },
        { label: "Bookkeeping & Accounts", href: "/services/bookkeeping", icon: <BookOpen className="h-4 w-4" /> },
        { label: "Business Calculator", href: "/business-calculator", icon: <BookOpen className="h-4 w-4" /> },
      ]
    },
    {
      label: "Industries",
      items: [
        { label: "Film Industry", href: "/industries/film", icon: <Film className="h-4 w-4" /> },
        { label: "Music Industry", href: "/industries/music", icon: <Music className="h-4 w-4" /> },
        { label: "Construction", href: "/industries/construction", icon: <Building2 className="h-4 w-4" /> },
        { label: "Professional Services", href: "/industries/professional-services", icon: <Building className="h-4 w-4" /> },
      ]
    }
  ];

  // Desktop navigation component
  function DesktopNavigation() {
    return (
      <nav className="hidden lg:flex items-center space-x-1">
        <Link href="/about">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            About
          </Button>
        </Link>

        {publicMenuGroups.map((group) => (
          <DropdownMenu key={group.label}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                {group.label}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {group.items.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="w-full flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        <Link href="/team">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Users className="mr-1 h-4 w-4" />
            Team
          </Button>
        </Link>

        <Link href="/contact">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Phone className="mr-1 h-4 w-4" />
            Contact
          </Button>
        </Link>
      </nav>
    );
  }

  // Mobile navigation component
  function MobileNavigation() {
    return (
      <div className="lg:hidden">
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg z-50">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  About
                </Button>
              </Link>

              {publicMenuGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              ))}

              <Link href="/team" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Team
                </Button>
              </Link>

              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavbarLogo />
          
          <DesktopNavigation />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}