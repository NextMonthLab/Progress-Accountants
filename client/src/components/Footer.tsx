import { Link } from "wouter";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--navy)' }} className="text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-poppins font-bold text-xl mb-4">
              Progress <span style={{ color: 'var(--orange)' }}>Accountants</span>
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
                <a href="#" className="text-gray-300 hover:text-[var(--orange)] transition">
                  Podcast Studio
                </a>
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
            <Link href="/privacy-policy">
              <a className="hover:text-[var(--orange)] transition">Privacy Policy</a>
            </Link> | 
            <Link href="/terms-of-service">
              <a className="hover:text-[var(--orange)] transition"> Terms of Service</a>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
