import { Button } from "@/components/ui/button";
import { heroTeamPhoto } from "../assets/imagePlaceholders";
import { useEffect, useRef, useState } from "react";
import teamPhotoImage from "../assets/images/team_photo.jpg";
import { HeroSkeleton } from "@/components/ui/skeletons";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading (remove in production or replace with actual data loading)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading) {
    return (
      <section
        style={{ backgroundColor: 'var(--navy)' }}
        className="text-white py-16 md:py-24"
      >
        <HeroSkeleton />
      </section>
    );
  }

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
              Accountants in Banbury who actually help you grow.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-200">
              Most firms just talk about growth. At Progress, we give you the tools to make it happen — from real-time financial dashboards to your own podcast and video studio.
            </p>
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
                alt="Progress Accountants Team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
