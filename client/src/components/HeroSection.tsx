import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, CheckCircle2, BarChart3 } from "lucide-react";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { HeroSkeleton } from "@/components/ui/skeletons";

// Business Identity type
interface BusinessIdentity {
  core?: {
    businessName?: string;
    tagline?: string;
    description?: string;
  };
  personality?: {
    usps?: string[];
    missionStatement?: string;
  };
  market?: {
    targetAudience?: string;
    geographicFocus?: string;
  };
}

// Full-Screen Hero Section with Team Photo Background
const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger animation after content loads
      setTimeout(() => setIsVisible(true), 100);
    }, isLoadingIdentity ? 2000 : 1000);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

  if (isLoading || isLoadingIdentity) {
    return <HeroSkeleton />;
  }

  // Extract business information from business identity
  const typedIdentity = businessIdentity as BusinessIdentity || {};
  const businessName = typedIdentity.core?.businessName || "Progress Accountants";
  const usps = [
    "Specialists in digital, construction, film & music industries",
    "Tech-driven accounting powered by Xero, QuickBooks & real-time dashboards", 
    "Friendly, expert team who truly understand your business"
  ];

  const scrollToContent = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-Viewport Team Photo Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742806/P1023674_di2j3g.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Semi-transparent Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Centered Content Container */}
      <div className={`relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white transition-all duration-800 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        {/* Main Headline */}
        <h1 className={`font-bold text-white mb-4 transition-all duration-800 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1.1',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
          {businessName}
        </h1>
        
        {/* Subheadline */}
        <h2 className={`font-semibold text-slate-200 mb-8 transition-all duration-800 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
            style={{
              fontSize: 'clamp(1.25rem, 4vw, 2.25rem)',
              lineHeight: '1.3',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
          Strategic Accounting for UK Businesses
        </h2>

        {/* Single CTA Button */}
        <div className={`transition-all duration-800 ease-out delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform"
            style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              paddingInline: 'clamp(2rem, 6vw, 3rem)',
              paddingBlock: 'clamp(1rem, 3vw, 1.25rem)',
              minHeight: '44px',
              borderRadius: '50px'
            }}
            onClick={() => {
              if (window.Calendly) {
                window.Calendly.initPopupWidget({
                  url: 'https://calendly.com/progressaccountants'
                });
              } else {
                window.open('https://calendly.com/progressaccountants', '_blank');
              }
            }}
            aria-label="Book a free consultation with Progress Accountants"
          >
            Book a Free Consultation
            <ArrowRight className="ml-3 h-5 w-5 flex-shrink-0" />
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center transition-all duration-800 ease-out delay-800 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <button 
          onClick={scrollToContent}
          className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 transform"
          aria-label="Scroll to explore our services"
        >
          <ChevronDown className="h-6 w-6 text-white animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;