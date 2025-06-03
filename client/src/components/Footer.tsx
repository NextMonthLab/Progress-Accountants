import { Link } from "wouter";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="/progress-logo-light.png" 
                alt="Progress Accountants | Advisors | Growth Partners" 
                className="h-16 w-auto"
              />
            </div>
            <p className="mb-4 text-gray-300">
              We don't just talk about growth. We build the tools that drive it.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-white hover:text-[var(--orange)] transition"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-[var(--orange)] transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-[var(--orange)] transition"
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
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Accounting & Bookkeeping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Tax Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Financial Dashboard
                </a>
              </li>
              <li>
                <Link href="/studio-banbury" className="text-[#7B3FE4] font-medium hover:underline transition">
                  🎙️ Podcast & Video Studio
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Virtual Finance Director
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Industries</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Film Industry
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Music Industry
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Construction
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Small Businesses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Startups
                </a>
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
                  href="tel:+441234567890" 
                  className="text-gray-300 hover:text-[var(--orange)] transition"
                >
                  01234 567 890
                </a>
              </div>
              <div>
                <a 
                  href="mailto:info@progressaccountants.co.uk" 
                  className="text-gray-300 hover:text-[var(--orange)] transition"
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
            <Link href="/privacy-policy" className="hover:text-[var(--orange)] transition">
              Privacy Policy
            </Link> | 
            <Link href="/terms-of-service" className="hover:text-[var(--orange)] transition ml-1">
              Terms of Service
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
