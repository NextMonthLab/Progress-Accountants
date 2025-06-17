import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import teamPhotoImage from "../assets/images/team_photo.jpg";
import { HeroSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { withMemo } from "@/lib/withMemo";
import { ArrowRight, ChevronDown } from "lucide-react";
import { openCalendlyPopup } from "@/utils/calendly";

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

// Simplified Hero Section
const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    // Simulate content loading with real data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2000 : 1000);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

  if (isLoading || isLoadingIdentity) {
    return <HeroSkeleton />;
  }

  // Extract business information from business identity
  const typedIdentity = businessIdentity as BusinessIdentity || {};
  const businessName = typedIdentity.core?.businessName || "Progress Accountants";
  const tagline = "Forward-thinking Accountants for UK Businesses";
  const usps = [
    "Specialists in digital, construction, film & music industries",
    "Tech-driven accounting powered by Xero, QuickBooks & real-time dashboards", 
    "Friendly, expert team who truly understand your business"
  ];
  const geographicFocus = typedIdentity.market?.geographicFocus || "United Kingdom";

  const scrollToContent = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="bg-black text-white min-h-[90vh] relative flex items-center py-16 overflow-hidden"
    >
      {/* Enhanced sophisticated dark textured background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-zinc-900/70 to-gray-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.01)_50%,transparent_51%)] bg-[length:100px_100px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-slate-800/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-radial from-zinc-700/8 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 z-10 relative">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12">
          {/* Left content - Text content */}
          <div className="w-full md:w-2/5 md:pr-6 text-center md:text-left">
            <span className="text-purple-300 text-xs sm:text-sm font-medium tracking-wide inline-block mb-3 sm:mb-4">
              Premium Financial Advisory
            </span>
            
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 leading-tight">
              <span className="text-white">{businessName}</span>
              <span className="block mt-2 sm:mt-3 gradient-text text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                Forward-thinking Accountants for UK Businesses
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200 max-w-xl leading-relaxed px-2 sm:px-0">
              Empowering your business with strategic financial planning, expert tax optimisation, and tailored insights—delivered with tech-savvy clarity.
            </p>
            
            <div className="mb-6 sm:mb-8">
              {usps.length > 0 && (
                <ul className="list-none space-y-2 sm:space-y-3 max-w-lg">
                  {usps.slice(0, 3).map((usp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] w-5 h-5 sm:w-6 sm:h-6 rounded-full mr-2 sm:mr-3 shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </span> 
                      <span className="text-gray-200 text-sm sm:text-base leading-relaxed">{usp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="lg"
                className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-full gradient-bg hover:shadow-lg text-white progress-button text-sm sm:text-base relative z-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('BUTTON CLICKED - TESTING');
                  openCalendlyPopup();
                }}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                <span className="hidden sm:inline">Book Your Free Strategy Consultation</span>
                <span className="sm:hidden">Book Free Consultation</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-full text-white border border-purple-400/30 hover:bg-purple-500/20 text-sm sm:text-base"
                onClick={scrollToContent}
              >
                <span>Explore Our Services</span>
                <span className="ml-2 text-purple-300">→</span>
              </Button>
            </div>
          </div>
          
          {/* Right content - Prominent team image */}
          <div className="w-full md:w-3/5 mt-8 md:mt-0">
            <div className="relative">
              {/* Enlarged, simplified image frame */}
              <div className="relative rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500 bg-slate-800/50 p-2 sm:p-4">
                <OptimizedImage 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742806/P1023674_di2j3g.jpg" 
                  alt={`${businessName} Team`}
                  className="w-full h-auto rounded-lg brightness-105"
                  width={1000}
                  height={600}
                  priority={true}
                />
                
                {/* Simple badge - positioned more discreetly */}
                <div className="absolute top-4 right-4 gradient-bg px-3 py-1 rounded-full shadow-md">
                  <p className="text-xs font-semibold text-white">
                    UK Certified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <p className="text-sm text-white/70 mb-2">Scroll to explore</p>
          <ChevronDown className="w-6 h-6 text-white/70 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default withMemo(HeroSection);