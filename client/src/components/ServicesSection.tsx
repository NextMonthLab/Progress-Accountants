import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toolsPodcastStudio, toolsDashboardMockup, toolsStrategySession } from "../assets/imagePlaceholders";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { FeaturesSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { Calendar, BarChart3, FileText, Landmark, Calculator, Cloud } from "lucide-react";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2200 : 1800); // Slightly longer than hero to create a cascading effect
    
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

  // Map service names to icons and descriptions
  const serviceIcons = {
    "Tax Planning & Preparation": { 
      icon: Calculator, 
      description: "Strategic tax planning and preparation services to optimise your tax position and ensure compliance."
    },
    "Bookkeeping": { 
      icon: FileText, 
      description: "Comprehensive bookkeeping services to maintain accurate financial records and provide clear insights into your business finances."
    },
    "Business Advisory": { 
      icon: BarChart3, 
      description: "Expert business advice to help you make informed decisions, improve profitability, and achieve sustainable growth."
    },
    "Financial Reporting": { 
      icon: FileText, 
      description: "Detailed financial reports that give you clear visibility into your business performance and financial health."
    },
    "Audit Services": { 
      icon: Landmark, 
      description: "Thorough audit services to ensure compliance, identify risks, and provide confidence in your financial statements."
    },
    "Cloud Accounting": { 
      icon: Cloud, 
      description: "Modern cloud-based accounting solutions for real-time financial insights and streamlined accounting processes."
    },
    "Podcast & Video Studio": { 
      imageComponent: toolsPodcastStudio,
      description: "Record professional content in our in-house media suite — and grow your audience like never before."
    },
    "Custom Financial Dashboard": { 
      imageComponent: toolsDashboardMockup,
      description: "We build you a live dashboard showing your business's financial health — key metrics, trends, cash flow, tax, and more."
    },
    "Virtual Finance Director": { 
      imageComponent: toolsStrategySession,
      description: "Get expert strategy sessions, forecasting help, and actionable advice — whenever you need it."
    }
  };

  // Show skeleton during loading
  if (isLoading || isLoadingIdentity) {
    return (
      <section
        id="services"
        className="py-16 md:py-24"
        style={{ backgroundColor: 'var(--light-grey)' }}
      >
        <div className="container mx-auto px-4">
          <FeaturesSkeleton count={3} />
        </div>
      </section>
    );
  }

  // Get services from business identity or default ones
  const businessServices = businessIdentity?.services || [];
  
  // Combine predefined premium services with business identity services
  const premiumServices = [
    "Podcast & Video Studio",
    "Custom Financial Dashboard",
    "Virtual Finance Director"
  ];
  
  const standardServices = businessServices.filter(service => !premiumServices.includes(service));

  // Create service cards for display
  const serviceCards = premiumServices.map(service => ({
    title: service,
    description: serviceIcons[service]?.description || "Innovative service tailored to your business needs.",
    imageComponent: serviceIcons[service]?.imageComponent,
    icon: serviceIcons[service]?.icon,
    isPremium: true
  }));

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
            Our Premium Services
          </h2>
          <p style={{ color: 'var(--dark-grey)' }} className="text-lg">
            {businessIdentity?.core?.businessName || "Progress Accountants"} is different. We're not just your accountant — we're your growth partner. That's why we've built a system to help you scale your business from the inside out.
          </p>
        </div>
        
        {/* Premium Services Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {serviceCards.map((service, index) => (
            <Card 
              key={index} 
              className="hover-scale transition duration-300 bg-white shadow-md overflow-hidden"
            >
              <div className="h-52 overflow-hidden bg-gray-100">
                {service.imageComponent && service.imageComponent()}
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <span className="text-orange-500 text-sm">★</span>
                  </div>
                  <h3 
                    className="font-poppins font-semibold text-xl"
                    style={{ color: 'var(--navy)' }}
                  >
                    {service.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--dark-grey)' }} className="mb-4">
                  {service.description}
                </p>
                {index === 0 && (
                  <Link href="/studio-banbury" className="inline-block mt-2">
                    <Button 
                      variant="outline" 
                      className="hover:text-[var(--orange)] hover:border-[var(--orange)]"
                    >
                      Find Out More →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Standard Services Section */}
        {standardServices.length > 0 && (
          <>
            <div className="text-center max-w-3xl mx-auto mb-10 mt-16">
              <h2 
                className="font-poppins font-bold text-2xl md:text-3xl mb-4"
                style={{ color: 'var(--navy)' }}
              >
                Standard Services
              </h2>
              <p style={{ color: 'var(--dark-grey)' }} className="text-md">
                Our comprehensive range of accounting and financial services to meet your business needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {standardServices.map((service, index) => {
                const ServiceIcon = serviceIcons[service]?.icon || Calendar;
                return (
                  <Card 
                    key={index} 
                    className="transition duration-300 bg-white shadow-sm hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                          <ServiceIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 
                          className="font-medium text-lg"
                          style={{ color: 'var(--navy)' }}
                        >
                          {service}
                        </h3>
                      </div>
                      <p style={{ color: 'var(--dark-grey)' }} className="text-sm">
                        {serviceIcons[service]?.description || "Professional service tailored to your business needs."}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
