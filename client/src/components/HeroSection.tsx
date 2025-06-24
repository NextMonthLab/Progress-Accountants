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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Cinematic Full-Width Background with Smart Focal Points */}
      <div className="absolute inset-0 w-full h-full">
        {/* Desktop/Tablet Background - Center Focus */}
        <div 
          className="absolute inset-0 w-full h-full hidden sm:block"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742808/P1013138_cgw7dc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Mobile Background - Upper Center Focus for Faces */}
        <div 
          className="absolute inset-0 w-full h-full block sm:hidden"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742808/P1013138_cgw7dc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      {/* Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      
      {/* Content Container with Safe Margins */}
      <div className={`relative z-20 w-full h-full flex items-center justify-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
           style={{
             paddingInline: 'clamp(5%, 8vw, 10%)',
             paddingBlock: 'clamp(2rem, 8vh, 4rem)'
           }}>
        <div className="text-center text-white max-w-5xl mx-auto">
          {/* Main Headline with Enhanced Typography */}
          <h1 className={`font-bold text-white mb-6 transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                lineHeight: 'clamp(1.1, 1.15, 1.2)',
                textShadow: '0 6px 12px rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em'
              }}>
            {businessName}
          </h1>
          
          {/* Subheadline with Perfect Spacing */}
          <h2 className={`font-semibold text-slate-100 mb-12 transition-all duration-1000 ease-out delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
              style={{
                fontSize: 'clamp(1.125rem, 4vw, 2rem)',
                lineHeight: 'clamp(1.3, 1.4, 1.5)',
                textShadow: '0 4px 8px rgba(0,0,0,0.6)',
                letterSpacing: '0.01em',
                maxWidth: '42ch',
                margin: '0 auto clamp(3rem, 8vw, 4rem) auto'
              }}>
            Strategic Accounting for UK Businesses
          </h2>

          {/* Premium CTA Button with Perfect Touch Target */}
          <div className={`transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 transform active:scale-95"
              style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                paddingInline: 'clamp(2rem, 6vw, 3.5rem)',
                paddingBlock: 'clamp(1rem, 3vw, 1.375rem)',
                minHeight: '48px',
                minWidth: 'clamp(200px, 50vw, 320px)',
                borderRadius: '50px',
                marginBottom: 'clamp(1rem, 4vw, 2rem)',
                boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2)'
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
      </div>

      {/* Elegant Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center transition-all duration-1000 ease-out delay-900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        <button 
          onClick={scrollToContent}
          className="bg-white/15 backdrop-blur-md rounded-full p-4 hover:bg-white/25 transition-all duration-300 hover:scale-110 transform shadow-xl border border-white/20"
          aria-label="Scroll to explore our services"
          style={{
            minHeight: '44px',
            minWidth: '44px'
          }}
        >
          <ChevronDown className="h-6 w-6 text-white animate-bounce" />
        </button>
      </div>

      {/* Responsive CSS for Mobile Optimization */}
      <style>{`
        @media (max-width: 480px) {
          .hero-mobile-optimize {
            background-attachment: scroll !important;
          }
        }
        
        @media (max-width: 320px) {
          .hero-ultra-compact {
            padding-inline: 4% !important;
          }
        }
        
        @media (min-width: 1920px) {
          .hero-ultra-wide {
            background-position: center 25% !important;
          }
        }
        
        /* Prevent image clipping on ultra-wide screens */
        @media (min-width: 2560px) {
          .hero-mega-wide {
            background-size: contain !important;
            background-color: #1e293b;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;