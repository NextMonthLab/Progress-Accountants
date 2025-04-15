import { industryFilm, industryMusic, industryConstruction } from "../assets/imagePlaceholders";
import { useEffect, useRef } from "react";

export default function IndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const industries = [
    {
      imageComponent: industryFilm,
      title: "Film Industry",
      description: "From freelance tax setups to R&D tax credits — we've worked with independent producers, directors, and studios."
    },
    {
      imageComponent: industryMusic,
      title: "Music Industry",
      description: "Touring, royalties, self-employment, label accounting — we handle the numbers so you can stay creative."
    },
    {
      imageComponent: industryConstruction,
      title: "Construction",
      description: "We understand CIS, contractor management, and project-based finance. We've got the site and the spreadsheet covered."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="industries" 
      className="py-16 md:py-24 bg-white fade-in-section"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="font-poppins font-bold text-2xl md:text-4xl mb-4"
            style={{ color: 'var(--navy)' }}
          >
            Specialists in complex industries
          </h2>
          <p style={{ color: 'var(--dark-grey)' }} className="text-lg">
            We serve a wide range of small businesses, but we have deep experience in sectors that demand more than basic bookkeeping.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="rounded-xl overflow-hidden shadow-md hover-scale transition duration-300"
            >
              <div className="h-40 overflow-hidden">
                {industry.imageComponent()}
              </div>
              <div className="p-6" style={{ backgroundColor: 'var(--light-grey)' }}>
                <h3 
                  className="font-poppins font-semibold text-xl mb-3"
                  style={{ color: 'var(--navy)' }}
                >
                  {industry.title}
                </h3>
                <p style={{ color: 'var(--dark-grey)' }}>
                  {industry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
