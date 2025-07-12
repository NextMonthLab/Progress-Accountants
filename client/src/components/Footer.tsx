import { Link } from "wouter";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import progressLogoPath from "@assets/Light Logo.png";
import ResponsiveContainer from "./ResponsiveContainer";
import ResponsiveGrid from "./ResponsiveGrid";
import NativeNewsletterForm from '@/components/forms/NativeNewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-12 lg:py-16 overflow-x-hidden">
      <ResponsiveContainer maxWidth="2xl" padding="lg">
        <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap="lg" className="w-full max-w-full">
          <div className="sm:col-span-2 lg:col-span-1 max-w-full">
            <div className="mb-4 sm:mb-6">
              <Link href="/" className="no-underline flex items-center">
                <img 
                  src={progressLogoPath} 
                  alt="Progress Accountants | Advisors | Growth Partners" 
                  className="h-10 sm:h-12 lg:h-16 w-auto max-w-full object-contain" 
                  style={{ maxHeight: '64px', maxWidth: '100%' }}
                />
              </Link>
            </div>
            <p className="mb-4 sm:mb-6 text-gray-300 text-sm sm:text-base leading-relaxed max-w-full overflow-wrap-anywhere">
              We don't just talk about growth. We build the tools that drive it.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="#" 
                className="text-white hover:text-purple-400 interactive z-badge flex-shrink-0"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-purple-400 interactive z-badge flex-shrink-0"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-purple-400 interactive z-badge flex-shrink-0"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-purple-400 transition">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/services/accounting" className="text-gray-300 hover:text-purple-400 transition">
                  Accounting & Bookkeeping
                </Link>
              </li>
              <li>
                <Link href="/services/tax" className="text-gray-300 hover:text-purple-400 transition">
                  Tax Returns
                </Link>
              </li>
              <li>
                <Link href="/studio-banbury" className="text-[#7B3FE4] font-medium hover:text-purple-300 transition">
                  🎙️ Podcast & Video Studio
                </Link>
              </li>
              <li>
                <Link href="/business-calculator" className="text-gray-300 hover:text-purple-400 transition">
                  Business Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Industries</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/industries/film" className="text-gray-300 hover:text-purple-400 transition">
                  Film Industry
                </Link>
              </li>
              <li>
                <Link href="/industries/music" className="text-gray-300 hover:text-purple-400 transition">
                  Music Industry
                </Link>
              </li>
              <li>
                <Link href="/industries/construction" className="text-gray-300 hover:text-purple-400 transition">
                  Construction
                </Link>
              </li>
              <li>
                <Link href="/industries/professional-services" className="text-gray-300 hover:text-purple-400 transition">
                  Professional Services
                </Link>
              </li>
              <li>
                <Link href="/sme-support-hub" className="text-gray-300 hover:text-purple-400 transition">
                  SME Support Hub
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest accounting insights and business growth tips delivered to your inbox.
            </p>
            <NativeNewsletterForm 
              placeholder="Your email address"
              buttonText="Subscribe"
              className="max-w-full"
            />
            <div className="mt-6 space-y-2 text-sm">
              <div>
                <a 
                  href="tel:+441295477250" 
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  01295 477 250
                </a>
              </div>
              <div>
                <a 
                  href="mailto:info@progressaccountants.co.uk" 
                  className="text-gray-300 hover:text-purple-400 transition break-all"
                >
                  info@progressaccountants.co.uk
                </a>
              </div>
            </div>
          </div>
        </ResponsiveGrid>
        
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Progress Accountants. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy-policy" className="hover:text-purple-400 transition">
              Privacy Policy
            </Link> • 
            <Link href="/terms-of-service" className="hover:text-purple-400 transition mx-2">
              Provision of Service
            </Link> • 
            <Link href="/cookie-policy" className="hover:text-purple-400 transition ml-2">
              Cookie Policy
            </Link>
          </p>
          <div className="mt-4 flex justify-center">
            <a 
              href="https://nextmonth.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="text-xs">Powered by</span>
              <img 
                src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1746537994/8A3D82EC-31EF-4209-85E2-D1D284F5E960_lnzuah.png" 
                alt="NextMonth Logo" 
                className="h-[6.5rem]"
              />
            </a>
          </div>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
