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
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      
      {/* Centered Content Container */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 className="font-bold leading-tight mb-6 transition-all duration-1000 ease-out delay-200"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                lineHeight: 'clamp(1.1, 1.2, 1.3)'
              }}>
            <span className="block text-white drop-shadow-lg">{businessName}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 drop-shadow-sm"
                  style={{
                    fontSize: 'clamp(1.75rem, 5.5vw, 3.5rem)',
                    marginTop: 'clamp(0.5rem, 2vw, 1rem)'
                  }}>
              Forward-thinking Accountants for UK Businesses
            </span>
          </h1>
          
          {/* Subhead */}
          <p className={`mb-8 text-slate-200 max-w-4xl mx-auto leading-relaxed drop-shadow-md transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
             style={{
               fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
               lineHeight: 'clamp(1.6, 1.7, 1.8)'
             }}>
            Empowering your business with strategic financial planning, expert tax optimisation, and tailored insights—delivered with tech-savvy clarity and industry expertise.
          </p>

          {/* USP Bullet Points */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10 max-w-6xl mx-auto transition-all duration-1000 ease-out delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {usps.map((usp, index) => (
              <div key={index} 
                   className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 lg:p-5 shadow-2xl hover:bg-white/15 transition-all duration-300"
                   style={{
                     animationDelay: `${800 + index * 200}ms`
                   }}>
                <div className="flex items-start text-left">
                  <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="font-semibold text-white leading-relaxed"
                        style={{
                          fontSize: 'clamp(0.875rem, 2.2vw, 1rem)'
                        }}>
                    {usp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform"
              style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                paddingInline: 'clamp(1.5rem, 5vw, 2.5rem)',
                paddingBlock: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                minWidth: '200px',
                maxWidth: '320px',
                minHeight: '44px'
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
              aria-label="Book free consultation with Progress Accountants"
            >
              <span className="truncate">Book Free Consultation</span>
              <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 backdrop-blur-md font-bold shadow-2xl transition-all duration-300 hover:scale-105 transform"
              style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                paddingInline: 'clamp(1.25rem, 4vw, 2rem)',
                paddingBlock: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                minWidth: '160px',
                maxWidth: '260px',
                minHeight: '44px'
              }}
              onClick={scrollToContent}
              aria-label="Explore our accounting services"
            >
              <BarChart3 className="mr-2 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="truncate">Explore Services</span>
            </Button>
          </div>

          {/* UK Certified Badge - Floating */}
          <div className={`inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full font-bold shadow-2xl mb-8 transition-all duration-1000 ease-out delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
               style={{
                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
               }}>
            <span className="mr-2">🇬🇧</span>
            UK Certified Accountants
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center transition-all duration-1000 ease-out delay-1400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-white/80 text-sm mb-3 font-medium">Scroll to explore</p>
          <button 
            onClick={scrollToContent}
            className="bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 transform shadow-xl"
            aria-label="Scroll to explore our services"
          >
            <ChevronDown className="h-6 w-6 text-white animate-bounce" />
          </button>
        </div>
      </div>

      {/* Responsive Media Queries for Background Attachment */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-bg {
            background-attachment: scroll !important;
          }
        }
        
        @media (min-width: 1920px) {
          .hero-content {
            max-width: 1600px;
          }
        }
        
        /* Ensure smooth animations on all devices */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;