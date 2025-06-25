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
        {/* Desktop/Tablet Background - Adjusted for Head Visibility */}
        <div 
          className="absolute inset-0 w-full h-full hidden sm:block"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742808/P1013138_cgw7dc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 15%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Mobile Background - Optimal Head Framing */}
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
          {/* Main Headline with Refined Typography */}
          <h1 className={`font-bold text-white mb-8 transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
              style={{
                fontSize: 'clamp(2rem, 6.5vw, 4.8rem)',
                lineHeight: 'clamp(1.2, 1.25, 1.3)',
                textShadow: '0 6px 12px rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em',
                maxWidth: '52rem',
                margin: '0 auto'
              }}>
Strategic Accounting That Drives Growth
          </h1>
          
          {/* Subheadline with Enhanced Spacing */}
          <h2 className={`font-semibold text-slate-100 transition-all duration-1000 ease-out delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
              style={{
                fontSize: 'clamp(1.125rem, 3.5vw, 1.875rem)',
                lineHeight: 'clamp(1.4, 1.5, 1.6)',
                textShadow: '0 4px 8px rgba(0,0,0,0.6)',
                letterSpacing: '0.01em',
                maxWidth: '48ch',
                margin: '0 auto clamp(3.5rem, 10vw, 5rem) auto'
              }}>
We turn financial data into competitive advantage for ambitious UK businesses.
          </h2>

          {/* Gold Standard Universal Button - Rob Hutt Design System */}
          <div className={`transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <button
              className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
              style={{ 
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                padding: 'clamp(14px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                minHeight: '56px',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                color: '#FFFFFF',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
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
              Book My Strategy Call
              <ArrowRight className="ml-3 h-5 w-5 flex-shrink-0" />
            </button>
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