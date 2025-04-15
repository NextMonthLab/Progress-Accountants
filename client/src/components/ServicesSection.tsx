import { Card, CardContent } from "@/components/ui/card";
import { toolsPodcastStudio, toolsDashboardMockup, toolsStrategySession } from "../assets/imagePlaceholders";
import { useEffect, useRef } from "react";

export default function ServicesSection() {
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

  const services = [
    {
      imageComponent: toolsPodcastStudio,
      title: "Podcast & Video Studio",
      description: "Record professional content in our in-house media suite — and grow your audience like never before."
    },
    {
      imageComponent: toolsDashboardMockup,
      title: "Custom Financial Dashboard",
      description: "We build you a live dashboard showing your business's financial health — key metrics, trends, cashflow, tax, and more."
    },
    {
      imageComponent: toolsStrategySession,
      title: "Virtual Finance Director",
      description: "Get expert strategy sessions, forecasting help, and actionable advice — whenever you need it."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-16 md:py-24 fade-in-section" 
      style={{ backgroundColor: 'var(--light-grey)' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="font-poppins font-bold text-2xl md:text-4xl mb-4"
            style={{ color: 'var(--navy)' }}
          >
            Real tools. Real support. Real progress.
          </h2>
          <p style={{ color: 'var(--dark-grey)' }} className="text-lg">
            Progress Accountants is different. We're not just your accountant — we're your growth partner. That's why we've built a system to help you scale your business from the inside out.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover-scale transition duration-300 bg-white shadow-md overflow-hidden"
            >
              <div className="h-52 overflow-hidden">
                {service.imageComponent()}
              </div>
              <CardContent className="p-8">
                <h3 
                  className="font-poppins font-semibold text-xl mb-3"
                  style={{ color: 'var(--navy)' }}
                >
                  {service.title}
                </h3>
                <p style={{ color: 'var(--dark-grey)' }}>
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
