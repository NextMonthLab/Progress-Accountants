import { Button } from "@/components/ui/button";
import { heroTeamPhoto } from "../assets/imagePlaceholders";
import { useEffect, useRef, useState } from "react";
import teamPhotoImage from "../assets/images/team_photo.jpg";
import { HeroSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";

export default function HeroSection() {
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
        className="text-white py-16 md:py-24"
      >
        <HeroSkeleton />
      </section>
    );
  }

  // Extract business information from business identity
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const tagline = businessIdentity?.core?.tagline || "Forward-thinking accounting for modern businesses";
  const description = businessIdentity?.core?.description || "We provide innovative accounting solutions tailored to your business needs.";
  const usps = businessIdentity?.personality?.usps || [];
  const missionStatement = businessIdentity?.personality?.missionStatement || "";
  const targetAudience = businessIdentity?.market?.targetAudience || "Small to medium-sized businesses";
  const geographicFocus = businessIdentity?.market?.geographicFocus || "United Kingdom";

  return (
    <section 
      ref={sectionRef}
      style={{ backgroundColor: 'var(--navy)' }} 
      className="text-white py-16 md:py-24 fade-in-section"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 text-center md:text-left">
            <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-6">
              {businessName} - {tagline}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200">
              {description}
            </p>
            <div className="mb-8">
              <p className="text-md md:text-lg text-white/90 italic mb-2">
                {missionStatement}
              </p>
              {usps.length > 0 && (
                <ul className="list-none space-y-2 mt-4">
                  {usps.map((usp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">✓</span> 
                      <span>{usp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <a href="#book-call">
              <Button 
                size="lg" 
                style={{ backgroundColor: 'var(--orange)' }}
                className="px-8 py-6 text-lg glow-on-hover hover:-translate-y-[2px] transition duration-300"
              >
                👉 Book Your Free Strategy Call
              </Button>
            </a>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 image-container">
            <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-700">
              <img 
                src={teamPhotoImage} 
                alt={`${businessName} Team`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm md:text-base font-medium">
                Specialized in serving {targetAudience} across {geographicFocus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
