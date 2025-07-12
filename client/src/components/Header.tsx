import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';
import progressLogoPath from '@assets/Light Logo.png';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Industries', href: '/industries' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-header bg-black/95 backdrop-blur-sm border-b border-gray-800 shadow-custom interactive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src={progressLogoPath}
                alt="Progress Accountants"
                className="h-6 sm:h-8 md:h-10 w-auto max-w-full object-contain"
                style={{ maxHeight: '40px' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 xl:px-4 py-2 text-sm xl:text-base font-medium text-white hover:text-purple-400 rounded-md hover:bg-gray-800 interactive truncate"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="hidden lg:flex items-center space-x-3 text-sm text-gray-300">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">01295 477 250</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">info@progressaccountants.co.uk</span>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-103 transition-all duration-200 px-6 h-12 text-base font-semibold interactive z-cta"
            >
              <span className="truncate">Book a Call</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-gray-800 interactive"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800 bg-black/95 backdrop-blur-sm z-overlay">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-base font-medium text-white hover:text-purple-400 hover:bg-gray-800 rounded-md interactive"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-800 mt-4">
                <div className="px-4 space-y-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>01295 477 250</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">info@progressaccountants.co.uk</span>
                  </div>
                </div>
                <div className="px-4 mt-4">
                  <Button
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-103 transition-all duration-200 h-12 text-base font-semibold interactive"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book a Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}