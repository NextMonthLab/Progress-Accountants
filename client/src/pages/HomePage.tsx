import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import IndustriesSection from "@/components/IndustriesSection";
import WhyUsSection from "@/components/WhyUsSection";
import SEOFooterSection from "@/components/SEOFooterSection";
import ContactForm from "@/components/ContactForm";
import { useEffect } from "react";
import { Link } from "wouter";

export default function HomePage() {
  // Adding smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      
      const targetId = href === '#' ? null : href;
      if (!targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <IndustriesSection />
      
      {/* SME Support Hub Section */}
      <section className="py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "linear-gradient(rgba(3, 28, 64, 0.8), rgba(3, 28, 64, 0.8)), url('/images/sme-support-cta.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#031c40" // Navy fallback
          }} 
        />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-4">
                SME Support Hub
              </h2>
              <p className="text-xl mb-4">
                Everything UK small businesses need in one place—contacts, deadlines, and downloadable resources.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Essential HMRC & Companies House contact details
                </li>
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Key tax filing deadlines
                </li>
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Downloadable PDF resources
                </li>
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Regularly updated information
                </li>
              </ul>
              <Link href="/sme-support-hub" className="inline-block px-6 py-3 bg-[var(--orange)] text-white rounded-md hover:bg-[var(--orange)]/90 transition">
                Access SME Support Hub
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-[var(--navy)]">Available Resources</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--navy)]">SME Contacts Directory</h4>
                      <p className="text-gray-600 text-sm">All important UK business support contacts in one PDF.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--navy)]">Key Business Deadlines</h4>
                      <p className="text-gray-600 text-sm">All tax and reporting deadlines for 2025 in a printable format.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <WhyUsSection />
      
      {/* Studio Highlight Section */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: 'var(--navy)' }}>
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1744815129/P1012279-Enhanced-NR_dgdlta.jpg" 
                alt="Progress Podcast & Video Studio" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-4">
                🎙️ Podcast & Video Studio
              </h2>
              <p className="text-xl mb-4">
                Purpose-built for businesses that want to sound and look professional without metropolitan prices.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Professional DSLR cameras
                </li>
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Broadcast-quality microphones
                </li>
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> Acoustically treated space
                </li>
                <li className="flex items-center">
                  <span className="text-[var(--orange)] mr-2">✓</span> On-site technical support
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link href="/studio-banbury" className="inline-block px-6 py-3 bg-[var(--orange)] text-white rounded-md hover:bg-[var(--orange)]/90 transition">
                  View Studio Details
                </Link>
                <Link href="/studio-banbury#booking-form" className="inline-block px-6 py-3 bg-white text-[var(--navy)] rounded-md hover:bg-gray-100 transition">
                  Book Studio Time
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <SEOFooterSection />
      
      {/* Contact Section */}
      <section className="py-12 bg-gray-50" id="contact">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                Get in Touch
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ready to take your accounting to the next level? Let's talk about how we can help your business flourish.
              </p>
            </div>
            <ContactForm compact={true} className="max-w-3xl mx-auto" />
          </div>
        </div>
      </section>
    </>
  );
}
