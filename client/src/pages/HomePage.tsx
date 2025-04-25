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
      <WhyUsSection />
      
      {/* Studio Highlight Section */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: 'var(--navy)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1682499876/podcast-studio/interview-setup-dual_wbtcgu.jpg" 
                alt="Progress Podcast & Video Studio" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-4">
                🎙️ Podcast & Video Studio
              </h2>
              <p className="text-xl mb-4">
                Purpose-built for businesses that want to sound and look professional without London prices.
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
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                Get in Touch
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ready to take your accounting to the next level? Let's talk about how we can help your business thrive.
              </p>
            </div>
            <ContactForm compact={true} className="max-w-3xl mx-auto" />
          </div>
        </div>
      </section>
    </>
  );
}
