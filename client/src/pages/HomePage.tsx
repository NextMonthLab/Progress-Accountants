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
      
      {/* Temporary test link to WebsiteIntentPage - for development only */}
      <div className="container mx-auto py-4 text-center">
        <a href="/website-intent" className="inline-block px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800">
          Test Website Intent Page
        </a>
      </div>
      
      <ServicesSection />
      <IndustriesSection />
      <WhyUsSection />
      <SEOFooterSection />
      <ContactForm />
    </>
  );
}
