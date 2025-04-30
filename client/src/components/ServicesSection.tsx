import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { FeaturesSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { Calendar, BarChart3, FileText, Landmark, Calculator, Cloud, ArrowRight, CheckCircle2 } from "lucide-react";
import { OptimizedPodcastStudio, OptimizedDashboardMockup, OptimizedStrategySession } from "@/components/ui/OptimizedImagePlaceholder";
import { DeferredRender } from "@/components/ui/DeferredRender";
import { withMemo } from "@/lib/withMemo";
import { motion } from "framer-motion";

// Define service icons and descriptions with TypeScript interface
interface ServiceInfo {
  icon?: React.ComponentType<any>;
  imageComponent?: React.ComponentType<any>;
  description: string;
  features?: string[];
}

interface BusinessIdentity {
  services?: string[];
  core?: {
    businessName?: string;
  };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Background pattern component
const ServicesBgPattern = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 opacity-[0.02]">
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id="circles" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circles)" />
      </svg>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent"></div>
  </div>
);

// Memoized ServiceCard component for better performance
const ServiceCard = withMemo(({ 
  title, 
  description, 
  ImageComponent,
  features = [],
  isPremium
}: { 
  title: string; 
  description: string; 
  ImageComponent?: React.ComponentType<any>;
  features?: string[];
  isPremium: boolean;
}) => {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full transition duration-500 bg-[#101218] border border-[#2E2F3B] rounded-xl shadow-lg overflow-hidden hover:shadow-xl">
        {ImageComponent && (
          <div className="h-52 overflow-hidden bg-gray-100 relative">
            <DeferredRender>
              <div className="absolute inset-0 bg-[#191C26]/80 backdrop-blur-[1px] z-10"></div>
              <ImageComponent />
            </DeferredRender>
          </div>
        )}
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-3 shadow-md">
              <span className="text-white text-sm">★</span>
            </div>
            <h3 
              className="font-poppins font-bold text-xl text-white"
            >
              {title}
            </h3>
          </div>
          <p className="mb-5 leading-relaxed text-gray-300">
            {description}
          </p>
          
          {features.length > 0 && (
            <ul className="mb-5 space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          
          {title === "Podcast & Video Studio" && (
            <Link href="/studio-banbury" className="inline-block mt-3">
              <Button 
                className="px-4 py-2 rounded-full bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-colors group"
              >
                <span>Find Out More</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Memoized StandardServiceCard for better performance
const StandardServiceCard = withMemo(({
  title,
  description,
  Icon
}: {
  title: string;
  description: string;
  Icon: React.ComponentType<any>;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
    >
      <Card className="h-full transition duration-300 bg-white rounded-xl border border-gray-100 shadow hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Icon className="h-5 w-5 text-blue-500" />
            </div>
            <h3 
              className="font-medium text-lg"
              style={{ color: 'var(--navy)' }}
            >
              {title}
            </h3>
          </div>
          <p style={{ color: 'var(--dark-grey)' }} className="text-sm leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Main component wrapped with memo for optimization
const ServicesSection = () => {
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

  // Map service names to icons, descriptions, and features with type safety
  const serviceIcons: Record<string, ServiceInfo> = {
    "Tax Planning & Preparation": { 
      icon: Calculator, 
      description: "Strategic tax planning and preparation services to optimise your tax position and ensure compliance.",
      features: ["Tax-saving strategies", "Personal & business tax returns", "VAT registration & returns"]
    },
    "Bookkeeping": { 
      icon: FileText, 
      description: "Comprehensive bookkeeping services to maintain accurate financial records and provide clear insights into your business finances.",
      features: ["Monthly reconciliations", "Payroll processing", "Bills & expense management"]
    },
    "Business Advisory": { 
      icon: BarChart3, 
      description: "Expert business advice to help you make informed decisions, improve profitability, and achieve sustainable growth.",
      features: ["Growth strategy planning", "Cash flow forecasting", "Performance reviews"]
    },
    "Financial Reporting": { 
      icon: FileText, 
      description: "Detailed financial reports that give you clear visibility into your business performance and financial health.",
      features: ["Custom KPI dashboards", "Management reports", "Statutory accounts"]
    },
    "Audit Services": { 
      icon: Landmark, 
      description: "Thorough audit services to ensure compliance, identify risks, and provide confidence in your financial statements.",
      features: ["Statutory audits", "Internal audits", "Due diligence reviews"]
    },
    "Cloud Accounting": { 
      icon: Cloud, 
      description: "Modern cloud-based accounting solutions for real-time financial insights and streamlined accounting processes.",
      features: ["Software setup & training", "System integrations", "Automated workflows"]
    },
    "Podcast & Video Studio": { 
      imageComponent: OptimizedPodcastStudio,
      description: "Record professional content in our in-house media suite — and grow your audience like never before.",
      features: ["Professional equipment", "Technical support", "Editing assistance available"]
    },
    "Custom Financial Dashboard": { 
      imageComponent: OptimizedDashboardMockup,
      description: "We build you a live dashboard showing your business's financial health — key metrics, trends, cash flow, tax, and more.",
      features: ["Real-time data", "Custom KPIs", "Visual performance tracking"]
    },
    "Virtual Finance Director": { 
      imageComponent: OptimizedStrategySession,
      description: "Get expert strategy sessions, forecasting help, and actionable advice — whenever you need it.",
      features: ["Quarterly strategy meetings", "On-demand expert advice", "Financial planning support"]
    }
  };

  // Add a fallback list of services if the business identity returns empty services
  const defaultServices = [
    "Tax Planning & Preparation",
    "Bookkeeping",
    "Business Advisory",
    "Financial Reporting",
    "Audit Services",
    "Cloud Accounting"
  ];

  // Show skeleton during loading
  if (isLoading || isLoadingIdentity) {
    return (
      <section
        id="services"
        className="py-16 md:py-24 relative"
        style={{ backgroundColor: 'var(--light-grey)' }}
      >
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <FeaturesSkeleton count={3} />
        </div>
      </section>
    );
  }

  // Get services from business identity or default ones
  const typedBusinessIdentity = businessIdentity as BusinessIdentity || {};
  const businessServices = typedBusinessIdentity.services || defaultServices;
  
  // Combine predefined premium services with business identity services
  const premiumServices = [
    "Podcast & Video Studio",
    "Custom Financial Dashboard",
    "Virtual Finance Director"
  ];
  
  const standardServices = businessServices.filter(service => !premiumServices.includes(service));

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-16 md:py-24 relative" 
      style={{ backgroundColor: 'var(--light-grey)' }}
    >
      {/* Background pattern */}
      <ServicesBgPattern />
      
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
              Designed for Modern Businesses
            </div>
            <h2 
              className="font-poppins font-bold text-3xl md:text-4xl mb-4"
              style={{ color: 'var(--navy)' }}
            >
              Our Premium Services
            </h2>
            <p style={{ color: 'var(--dark-grey)' }} className="text-lg leading-relaxed">
              {typedBusinessIdentity.core?.businessName || "Progress Accountants"} is different. We're not just your accountant — we're your growth partner. That's why we've built a system to help you scale your business from the inside out.
            </p>
          </motion.div>
          
          {/* Premium Services Section */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {premiumServices.map((serviceName, index) => {
              const service = serviceIcons[serviceName] || {
                description: "Innovative service tailored to your business needs.",
                features: []
              };
              
              return (
                <ServiceCard 
                  key={index}
                  title={serviceName}
                  description={service.description}
                  features={service.features}
                  ImageComponent={service.imageComponent}
                  isPremium={true}
                />
              );
            })}
          </div>

          {/* Standard Services Section */}
          {standardServices.length > 0 && (
            <>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center max-w-3xl mx-auto mb-10 mt-16"
              >
                <motion.h2 
                  variants={itemVariants}
                  className="font-poppins font-bold text-2xl md:text-3xl mb-4"
                  style={{ color: 'var(--navy)' }}
                >
                  Standard Services
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  style={{ color: 'var(--dark-grey)' }} 
                  className="text-md"
                >
                  Our comprehensive range of accounting and financial services to meet your business needs.
                </motion.p>
              </motion.div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-6"
              >
                {standardServices.map((serviceName, index) => {
                  const service = serviceIcons[serviceName] || {
                    description: "Professional service tailored to your business needs."
                  };
                  const Icon = service.icon || Calendar;
                  
                  return (
                    <StandardServiceCard
                      key={index}
                      title={serviceName}
                      description={service.description}
                      Icon={Icon}
                    />
                  );
                })}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default withMemo(ServicesSection);
