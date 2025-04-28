import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import teamPhotoImage from "../assets/images/team_photo.jpg";
import { HeroSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { DeferredRender } from "@/components/ui/DeferredRender";
import { withMemo } from "@/lib/withMemo";
import { motion } from "framer-motion";
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

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Animated background pattern component
const AnimatedPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
    <div className="absolute top-0 left-0 w-full h-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    <div className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-400/10 blur-3xl -top-1/4 -right-1/4 animate-blob" />
    <div className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-400/5 blur-3xl bottom-0 left-0 animate-blob animation-delay-2000" />
  </div>
);

// Memo-optimized Hero Section
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    // Simulate content loading with real data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2000 : 1000);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current && !isLoading) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isLoading]);

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
  const description = typedIdentity.core?.description || "We provide innovative accounting solutions tailored to your business needs.";
  const usps = typedIdentity.personality?.usps || [];
  const missionStatement = typedIdentity.personality?.missionStatement || "";
  const targetAudience = typedIdentity.market?.targetAudience || "Small to medium-sized businesses";
  const geographicFocus = typedIdentity.market?.geographicFocus || "United Kingdom";

  const scrollToContent = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      style={{ backgroundColor: 'var(--navy)' }} 
      className="text-white min-h-[90vh] relative flex items-center py-16 overflow-hidden"
    >
      {/* Animated background pattern */}
      <AnimatedPattern />
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-8 lg:gap-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left content - Text content */}
          <motion.div 
            className="md:w-1/2 md:pr-8 text-center md:text-left"
            variants={containerVariants}
          >
            <motion.div
              className="inline-block mb-4 bg-orange-500/20 backdrop-blur-sm px-3 py-1 rounded-full"
              variants={itemVariants}
            >
              <span className="text-orange-300 text-sm font-medium">Innovative Accounting Solutions</span>
            </motion.div>
            
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl mb-6"
              variants={itemVariants}
            >
              <span className="text-white">{businessName}</span>
              <span className="block mt-2 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                {tagline}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-6 text-gray-200 max-w-xl"
              variants={itemVariants}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="mb-8" 
              variants={itemVariants}
            >
              {missionStatement && (
                <p className="text-md md:text-lg text-white/90 italic mb-4 border-l-4 border-orange-500/50 pl-4">
                  {missionStatement}
                </p>
              )}
              
              <DeferredRender priority={true}>
                {usps.length > 0 && (
                  <ul className="list-none space-y-3 mt-4 max-w-lg">
                    {usps.map((usp, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start p-2 bg-white/5 backdrop-blur-sm rounded-md transition-all hover:bg-white/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="flex items-center justify-center bg-orange-500 w-6 h-6 rounded-full mr-3 shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </span> 
                        <span className="text-gray-200">{usp}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </DeferredRender>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <a href="#book-call">
                <Button 
                  size="lg" 
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-800/20 hover:-translate-y-[2px] transition duration-300 group"
                >
                  <span>Book Your Free Strategy Consultation</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <Button 
                variant="ghost" 
                className="px-6 py-3 rounded-full text-white border border-white/20 hover:bg-white/10 transition duration-300"
                onClick={scrollToContent}
              >
                Explore Our Services
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right content - Image with effects */}
          <motion.div 
            className="md:w-1/2 mt-10 md:mt-0"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl z-0"></div>
              
              {/* Main image with card-like styling */}
              <div className="relative z-10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-1 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)]">
                <div className="overflow-hidden rounded-xl">
                  <OptimizedImage 
                    src={teamPhotoImage} 
                    alt={`${businessName} Team`}
                    className="w-full h-auto object-cover transform scale-[1.01] hover:scale-[1.03] transition-transform duration-700"
                    width={800}
                    height={450}
                    priority={true} // This is above-the-fold content so load with priority
                  />
                </div>
                
                {/* Glass-morphism info panel */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-xl">
                  <p className="text-base md:text-lg font-medium">
                    <span className="block text-sm text-orange-300 mb-1">Our Focus</span>
                    Specialized in serving {targetAudience} across {geographicFocus}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm text-white/70 mb-2">Scroll to explore</p>
          <ChevronDown className="w-6 h-6 text-white/70 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

export default withMemo(HeroSection);
