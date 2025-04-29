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
  <div className="absolute inset-0 overflow-hidden z-0">
    {/* Grid pattern overlay */}
    <div className="absolute top-0 left-0 w-full h-full opacity-5">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="3" height="3" patternUnits="userSpaceOnUse">
            <path d="M 3 0 L 0 0 0 3" fill="none" stroke="white" strokeWidth="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    {/* Dynamic gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 via-navy-800/70 to-navy-950/90 mix-blend-multiply opacity-80"></div>
    
    {/* Animated color blobs */}
    <div className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-r from-orange-500/30 to-orange-400/20 blur-3xl -top-1/4 -right-1/4 animate-blob" />
    <div className="absolute w-1/2 h-1/2 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-400/10 blur-3xl bottom-0 left-0 animate-blob animation-delay-2000" />
    <div className="absolute w-1/3 h-1/3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-400/5 blur-3xl top-1/2 left-1/4 animate-blob animation-delay-4000" />
    
    {/* Light streaks */}
    <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent top-[30%] left-0 animate-glow"></div>
    <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent top-[60%] left-0 animate-glow animation-delay-2000"></div>
    <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent left-[25%] top-0 animate-glow animation-delay-1000"></div>
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
      
      <div className="container mx-auto px-6 md:px-8 z-10 relative">
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
              className="inline-block mb-4"
              variants={itemVariants}
            >
              <span className="text-orange-200 text-sm font-medium tracking-wide flex items-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
                Premium Financial Advisory
              </span>
            </motion.div>
            
            <motion.h1 
              className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="text-white">{businessName}</span>
              <span className="relative block mt-3">
                {/* Premium metallic gradient effect with text-shadow for enhanced visibility */}
                <span className="relative inline-block bg-gradient-to-r from-[#f7b733] via-[#ffda79] to-[#f59b42] bg-clip-text text-transparent" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2), 0 1px 10px rgba(255,153,0,0.3)" }}>
                  {tagline}
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 text-gray-200 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Unlock your business potential with tailored financial strategies that drive growth and optimize tax efficiency. We blend traditional accounting expertise with innovative digital solutions.
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
              <a href="#book-call" className="relative">
                {/* Pulsing background effect */}
                <div className="absolute inset-0 rounded-full bg-orange-500/40 animate-ping opacity-30"></div>
                
                <Button 
                  size="lg" 
                  className="relative px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-800/30 hover:-translate-y-[3px] transition-all duration-300 group overflow-hidden"
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="font-medium relative z-10">Book Your Free Strategy Consultation</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2 duration-300 relative z-10" />
                </Button>
              </a>
              
              <Button 
                variant="ghost" 
                className="px-6 py-3 rounded-full text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
                onClick={scrollToContent}
              >
                <span>Explore Our Services</span>
                <span className="ml-2 text-orange-300">→</span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right content - Image with advanced effects */}
          <motion.div 
            className="md:w-1/2 mt-10 md:mt-0"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Enhanced decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-500/30 to-amber-400/20 rounded-full blur-2xl z-0 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-blue-600/30 to-cyan-400/15 rounded-full blur-2xl z-0 animate-blob"></div>
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-orange-300/30 -translate-x-2 -translate-y-2 z-20"></div>
              <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-orange-300/30 translate-x-2 translate-y-2 z-20"></div>
              
              {/* Main image with premium styling - lighter frame */}
              <div className="relative z-10 bg-gradient-to-br from-gray-700/40 to-gray-800/50 backdrop-blur-sm p-2 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.4)]">
                <div className="overflow-hidden rounded-xl relative group">
                  {/* Much lighter gradient overlay - just at the bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent z-10"></div>
                  
                  <OptimizedImage 
                    src={teamPhotoImage} 
                    alt={`${businessName} Team`}
                    className="w-full h-auto object-cover transform scale-[1.01] group-hover:scale-[1.05] transition-transform duration-1000 brightness-105"
                    width={800}
                    height={450}
                    priority={true} // This is above-the-fold content so load with priority
                  />
                  
                  {/* No additional overlay pattern - removed for clarity */}
                  
                  {/* Floating badges - solid dark background */}
                  <div className="absolute top-4 right-4 z-20 bg-black/70 px-3 py-1.5 rounded-full border border-orange-500/30 shadow-xl">
                    <p className="text-sm font-medium text-white flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      UK Certified Accountants
                    </p>
                  </div>
                  
                  {/* Main glassmorphism info panel - darker for readability */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg border border-orange-500/20 shadow-xl z-20 transform transition-transform duration-500 group-hover:translate-y-[-5px] bg-black/60 backdrop-blur-sm">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="bg-orange-500/80 p-1.5 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-base md:text-lg font-medium">
                          <span className="block text-sm text-orange-300 mb-1 font-semibold">Industry Specialists</span>
                          Focused expertise for {targetAudience} across {geographicFocus}
                        </p>
                      </div>
                    </div>
                  </div>
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
