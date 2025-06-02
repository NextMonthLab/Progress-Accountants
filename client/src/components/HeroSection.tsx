import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import teamPhotoImage from "../assets/images/team_photo.jpg";
import { HeroSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { withMemo } from "@/lib/withMemo";
import { ArrowRight, ChevronDown } from "lucide-react";

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
    return (
      <section
        style={{ backgroundColor: 'var(--navy)' }}
        className="text-white py-16 min-h-[90vh] flex items-center"
      >
        <HeroSkeleton />
      </section>
    );
  }

  // Extract business information from business identity
  const typedIdentity = businessIdentity as BusinessIdentity || {};
  const businessName = typedIdentity.core?.businessName || "Progress Accountants";
  const tagline = typedIdentity.core?.tagline || "Forward-thinking accounting for modern businesses";
  const usps = typedIdentity.personality?.usps || [];
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
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 z-0"></div>
      
      <div className="container mx-auto px-12 md:px-16 z-10 relative">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          {/* Left content - Text content */}
          <div className="md:w-1/2 md:pr-8 text-center md:text-left">
            <span className="text-purple-300 text-sm font-medium tracking-wide inline-block mb-4">
              Premium Financial Advisory
            </span>
            
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              <span className="text-white">{businessName}</span>
              <span className="block mt-3 gradient-text">
                {tagline}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl leading-relaxed">
              Unlock your business potential with tailored financial strategies that drive growth and optimize tax efficiency.
            </p>
            
            <div className="mb-8">
              {usps.length > 0 && (
                <ul className="list-none space-y-3 max-w-lg">
                  {usps.slice(0, 3).map((usp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] w-6 h-6 rounded-full mr-3 shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </span> 
                      <span className="text-gray-200">{usp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href="#book-call">
                <Button 
                  size="lg" 
                  className="px-6 py-3 rounded-full gradient-bg hover:shadow-lg text-white progress-button"
                >
                  <span className="font-medium flex items-center">
                    Book Your Free Strategy Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </a>
              
              <Button 
                variant="ghost" 
                className="px-6 py-3 rounded-full text-white border border-purple-400/30 hover:bg-purple-500/20"
                onClick={scrollToContent}
              >
                <span>Explore Our Services</span>
                <span className="ml-2 text-purple-300">→</span>
              </Button>
            </div>
          </div>
          
          {/* Right content - Prominent team image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative">
              {/* Enlarged, simplified image frame */}
              <div className="relative overflow-hidden rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500">
                <OptimizedImage 
                  src={teamPhotoImage} 
                  alt={`${businessName} Team`}
                  className="w-full h-auto object-cover brightness-105"
                  width={800}
                  height={450}
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