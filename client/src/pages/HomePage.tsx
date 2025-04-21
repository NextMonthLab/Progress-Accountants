import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import IndustriesSection from "@/components/IndustriesSection";
import WhyUsSection from "@/components/WhyUsSection";
import SEOFooterSection from "@/components/SEOFooterSection";
import ContactForm from "@/components/ContactForm";
import { useEffect } from "react";

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
