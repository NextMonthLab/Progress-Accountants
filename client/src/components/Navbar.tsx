import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/ClientDataProvider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isStaff } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-poppins font-bold text-2xl no-underline" style={{ color: 'var(--navy)' }}>
              Progress <span style={{ color: 'var(--orange)' }}>Accountants</span>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/services" 
            className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
          >
            Services
          </Link>
          <Link 
            href="/studio-banbury" 
            className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
          >
            Studio
          </Link>
          <Link 
            href="/client-dashboard" 
            className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
          >
            Dashboard
          </Link>
          <a 
            href="#industries" 
            className="font-medium hover:text-[var(--orange)] transition duration-300"
          >
            Industries
          </a>
          <a 
            href="#why-us" 
            className="font-medium hover:text-[var(--orange)] transition duration-300"
          >
            Why Us
          </a>
          <Link 
            href="/about" 
            className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
          >
            About Us
          </Link>
          <Link 
            href="/team" 
            className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
          >
            Our Team
          </Link>
          <Link 
            href="/contact" 
            className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
          >
            Contact
          </Link>
          {isStaff && (
            <Link 
              href="/admin/settings" 
              className="font-medium hover:text-[var(--orange)] transition duration-300 no-underline flex items-center"
            >
              <Settings className="h-4 w-4 mr-1" />
              Admin
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
        className={`md:hidden bg-white w-full absolute z-20 shadow-md ${isMenuOpen ? '' : 'hidden'}`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
          <Link 
            href="/services" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
            onClick={closeMenu}
          >
            Services
          </Link>
          <Link 
            href="/studio-banbury" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
            onClick={closeMenu}
          >
            Studio
          </Link>
          <Link 
            href="/client-dashboard" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <a 
            href="#industries" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300"
            onClick={closeMenu}
          >
            Industries
          </a>
          <a 
            href="#why-us" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300"
            onClick={closeMenu}
          >
            Why Us
          </a>
          <Link 
            href="/about" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link 
            href="/team" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
            onClick={closeMenu}
          >
            Our Team
          </Link>
          <Link 
            href="/contact" 
            className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline"
            onClick={closeMenu}
          >
            Contact
          </Link>
          {isStaff && (
            <Link 
              href="/admin/settings" 
              className="py-2 font-medium hover:text-[var(--orange)] transition duration-300 no-underline flex items-center"
              onClick={closeMenu}
            >
              <Settings className="h-4 w-4 mr-1" />
              Admin Settings
            </Link>
          )}
          <a 
            href="#book-call"
            onClick={closeMenu}
            className="inline-block text-center"
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
    </header>
  );
}
