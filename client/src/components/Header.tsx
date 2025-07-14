import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import progressLogoPath from '@assets/Light Logo.png';
import { openCalendlyPopup } from '@/utils/calendly';

interface NavigationItem {
  name: string;
  href: string;
  submenu?: { name: string; href: string; }[];
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Services', 
      href: '/services',
      submenu: [
        { name: 'All Services', href: '/services' },
        { name: 'Tax Planning', href: '/services/tax-planning' },
        { name: 'Bookkeeping', href: '/services/bookkeeping' },
        { name: 'Business Advisory', href: '/services/business-advisory' },
        { name: 'Financial Reporting', href: '/services/financial-reporting' },
        { name: 'Audit Support', href: '/services/audit-support' },
        { name: 'Cloud Accounting', href: '/services/cloud-accounting' },
        { name: 'Industry Specific', href: '/services/industry-specific' },
        { name: 'Virtual Finance Director', href: '/services/virtual-finance-director' }
      ]
    },
    { 
      name: 'Industries', 
      href: '/industries',
      submenu: [
        { name: 'Film Industry', href: '/film' },
        { name: 'Music Industry', href: '/music' },
        { name: 'Construction', href: '/construction' },
        { name: 'Professional Services', href: '/professional-services' }
      ]
    },
    { 
      name: 'Resources', 
      href: '/resources',
      submenu: [
        { name: 'Business Calculator', href: '/business-calculator' },
        { name: 'SME Support Hub', href: '/sme-support-hub' },
        { name: 'Studio Banbury', href: '/studio-banbury' },
        { name: 'Blog', href: '/blog' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'News', href: '/news' }
      ]
    },
    { name: 'Why Us', href: '/why-us' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-[9998] bg-black/95 backdrop-blur-sm border-b border-gray-800 shadow-custom interactive">
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
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={(e) => {
                  if (item.submenu) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDropdownPosition({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX
                    });
                    setDropdownOpen(item.name);
                  }
                }}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  href={item.href}
                  className="px-1.5 xl:px-2 py-2 text-xs xl:text-sm font-medium text-white hover:text-purple-400 rounded-md hover:bg-gray-800 interactive truncate flex items-center"
                >
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className="ml-0.5 h-3 w-3" />
                  )}
                </Link>
                

              </div>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <div className="hidden lg:flex items-center space-x-2 text-xs xl:text-sm text-gray-300">
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">01295 477 250</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[180px] xl:max-w-none">info@progressaccountants.co.uk</span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={openCalendlyPopup}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-103 transition-all duration-200 px-3 xl:px-4 h-10 xl:h-12 text-xs xl:text-sm font-semibold interactive z-cta"
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
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full px-4 py-2 text-base font-medium text-white hover:text-purple-400 hover:bg-gray-800 rounded-md interactive"
                      >
                        {item.name}
                        <ChevronRight className={`h-4 w-4 transition-transform ${mobileSubmenuOpen === item.name ? 'rotate-90' : ''}`} />
                      </button>
                      {mobileSubmenuOpen === item.name && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-purple-400 hover:bg-gray-800 rounded-md interactive"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-base font-medium text-white hover:text-purple-400 hover:bg-gray-800 rounded-md interactive"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
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
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openCalendlyPopup();
                    }}
                  >
                    Book a Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Global Dropdown Portal - Renders above everything */}
      {dropdownOpen && (
        <div 
          className="fixed w-64 bg-gray-900 border border-gray-700 rounded-md shadow-2xl"
          style={{ 
            position: 'fixed',
            top: dropdownPosition.top + 'px',
            left: dropdownPosition.left + 'px',
            zIndex: 999999,
            backgroundColor: 'rgb(17 24 39)',
            border: '1px solid rgb(55 65 81)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onMouseEnter={() => {/* Keep dropdown open when hovering over it */}}
          onMouseLeave={() => setDropdownOpen(null)}
        >
          <div className="py-2">
            {navigation.find(item => item.name === dropdownOpen)?.submenu?.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href}
                className="block px-4 py-2 text-sm text-white hover:text-purple-400 hover:bg-gray-800 transition-colors"
                onClick={() => setDropdownOpen(null)}
              >
                {subItem.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}