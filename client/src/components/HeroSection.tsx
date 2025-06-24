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
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Background with proper aspect ratio and no cropping */}
      <div className="absolute inset-0 bg-black/40 z-content"></div>
      <div 
        className="absolute inset-0 opacity-30 z-content"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1750109769/Untitled_design_3_lz4ihg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%'
        }}
      ></div>
      
      <div className="relative z-overlay max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight overflow-wrap-anywhere">
            {businessName}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Forward-thinking Accountants for UK Businesses
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Forward-thinking accountants delivering strategic financial solutions for UK businesses. From compliance to growth acceleration.
          </p>

          {/* USPs with proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 px-4">
            {usps.map((usp, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-custom">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0" />
                  <span className="font-semibold text-white text-sm md:text-base text-center">{usp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons with proper text containment */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold interactive z-cta"
              style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                paddingInline: 'clamp(1rem, 4vw, 2rem)',
                paddingBlock: 'clamp(0.75rem, 2vw, 1rem)',
                minWidth: '140px',
                maxWidth: '280px'
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
            >
              <span className="truncate">Book Free Consultation</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold interactive"
              style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                paddingInline: 'clamp(1rem, 4vw, 2rem)',
                paddingBlock: 'clamp(0.75rem, 2vw, 1rem)',
                minWidth: '120px',
                maxWidth: '220px'
              }}
              onClick={scrollToContent}
            >
              <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">View Services</span>
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator with proper positioning */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-badge">
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;