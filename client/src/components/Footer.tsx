import { Link } from "wouter";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import progressLogoPath from "@assets/Light Logo.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="mb-4">
              <Link href="/" className="no-underline flex items-center">
                <img 
                  src={progressLogoPath} 
                  alt="Progress Accountants | Advisors | Growth Partners" 
                  className="h-12 sm:h-16 w-auto" 
                />
              </Link>
            </div>
            <p className="mb-4 text-gray-300">
              We don't just talk about growth. We build the tools that drive it.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-white hover:text-purple-400 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-purple-400 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-purple-400 transition"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300 mb-4">
              Progress Accountants<br />
              Banbury, Oxfordshire<br />
              United Kingdom
            </address>
            <div className="space-y-2">
              <div>
                <a 
                  href="tel:01295477250" 
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  01295 477 250
                </a>
              </div>
              <div>
                <a 
                  href="mailto:info@progressaccountants.co.uk" 
                  className="text-gray-300 hover:text-purple-400 transition"
                >
                  info@progressaccountants.co.uk
                </a>
              </div>
            </div>
          </div>
        </div>
        
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
      </div>
    </footer>
  );
}
