import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FeaturesSkeleton } from "@/components/ui/skeletons";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { Calendar, BarChart3, FileText, Landmark, Calculator, Cloud, ArrowRight, CheckCircle2 } from "lucide-react";
import { OptimizedPodcastStudio, OptimizedDashboardMockup, OptimizedStrategySession } from "@/components/ui/OptimizedImagePlaceholder";
import { withMemo } from "@/lib/withMemo";

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
    <Card className="h-full bg-[#101218] border border-[#2E2F3B] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {ImageComponent && (
        <div className="h-60 overflow-hidden relative">
          <ImageComponent />
        </div>
      )}
      <CardContent className="px-4 pt-3 pb-4 md:px-6 md:pt-4 md:pb-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mr-3">
            <span className="text-white text-sm">★</span>
          </div>
          <h3 className="font-bold text-xl text-white">
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
                <CheckCircle2 className="h-5 w-5 text-[#7B3FE4] mr-2 shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        {title === "Podcast & Video Studio" && (
          <Link href="/studio-banbury" className="inline-block mt-3">
            <Button 
              className="px-4 py-2 rounded-full bg-transparent border border-[#7B3FE4] text-[#7B3FE4] hover:bg-[#7B3FE4]/10 transition-colors"
            >
              <span>Find Out More</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
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
    <Card className="h-full dark-theme-card rounded-xl border border-zinc-700 shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7B3FE4]/20 to-[#3FA4E4]/20 flex items-center justify-center mr-3">
            <Icon className="h-5 w-5 text-[#7B3FE4]" />
          </div>
          <h3 className="font-medium text-lg text-white">
            {title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
});

// Main component wrapped with memo for optimization
const ServicesSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2200 : 1800);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

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
      description: "Record professional-grade content in our Banbury studio—perfect for business podcasts, YouTube series, or social media clips.",
      features: ["DSLR cameras & broadcast mics", "Acoustically treated space", "On-site tech support & editing"]
    },
    "Custom Financial Dashboard": { 
      imageComponent: OptimizedDashboardMockup,
      description: "Access a live dashboard with your revenue, tax, cash flow, and growth metrics—so you're never guessing.",
      features: ["Real-time updates", "Bespoke KPIs", "Strategic decision-making made simple"]
    },
    "Virtual Finance Director": { 
      imageComponent: OptimizedStrategySession,
      description: "On-demand expertise to guide your business growth—from forecasting and cash flow to expansion and tax relief.",
      features: ["Quarterly planning sessions", "Expert insight on demand", "Built-in accountability"]
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
      id="services" 
      className="py-16 md:py-24 relative bg-black"
    >
      <div className="container mx-auto px-12 md:px-16 relative z-10">
        <div className="mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#7B3FE4]/20 to-[#3FA4E4]/20 text-purple-300 text-sm font-medium border border-purple-400/30">
              <span className="mr-1">✦</span> Designed for Modern Businesses <span className="ml-1">✦</span>
            </div>
            <h2 className="font-bold text-3xl md:text-4xl mb-4 text-white"
            >
              Our Premium Services
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              At Progress Accountants, we're more than just number-crunchers—we're strategic partners helping SMEs grow, adapt, and thrive.
            </p>
          </div>
          
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
              <div className="text-center max-w-3xl mx-auto mb-10 mt-16">
                <h2 className="font-bold text-2xl md:text-3xl mb-4 gradient-text">
                  Standard Services
                </h2>
                <p className="text-md max-w-xl mx-auto text-gray-300">
                  All your accounting needs in one place—delivered with clarity, reliability, and results.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
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
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default withMemo(ServicesSection);