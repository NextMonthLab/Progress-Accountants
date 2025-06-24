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
    <Card className="h-full bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden hover:shadow-2xl hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-1 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-zinc-900/50 to-gray-900/60 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:30px_30px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-slate-700/10 to-transparent rounded-full blur-2xl group-hover:from-slate-600/15 transition-all duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        {ImageComponent && (
          <div className="h-60 overflow-hidden relative">
            <ImageComponent />
          </div>
        )}
        <CardContent className="px-4 pt-1 pb-4 md:px-6 md:pt-2 md:pb-6">
          <div className="flex items-center mb-2">
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
      </div>
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
      description: "Keep more profit. Legal tax strategies that reduce what you owe.",
      features: ["Aggressive tax planning", "Zero-stress filing", "VAT optimization"]
    },
    "Bookkeeping": { 
      icon: FileText, 
      description: "Books that tell you what matters. Real-time insights, not just compliance.",
      features: ["Instant profit visibility", "Flawless payroll", "Expense tracking simplified"]
    },
    "Business Advisory": { 
      icon: BarChart3, 
      description: "Strategic guidance that drives growth. Turn data into competitive advantage.",
      features: ["Growth roadmaps", "Cash flow mastery", "Performance optimization"]
    },
    "Financial Reporting": { 
      icon: FileText, 
      description: "Reports you'll actually read. Clear insights that drive decisions.",
      features: ["Industry-specific KPIs", "Plain English reports", "Growth-focused accounts"]
    },
    "Audit Services": { 
      icon: Landmark, 
      description: "Audits without anxiety. Professional compliance that strengthens your business.",
      features: ["Stress-free compliance", "Value-adding reviews", "Deal protection"]
    },
    "Cloud Accounting": { 
      icon: Cloud, 
      description: "Technology that works. Modern systems that give you control.",
      features: ["Smart setup", "Time-saving integrations", "Automated workflows"]
    },
    "Podcast & Video Studio": { 
      imageComponent: OptimizedPodcastStudio,
      description: "Professional content creation without the headaches. Focus on your message.",
      features: ["Broadcast-quality setup", "Perfect acoustics", "Full tech support"]
    },
    "Custom Financial Dashboard": { 
      imageComponent: OptimizedDashboardMockup,
      description: "Know where you stand instantly. Live insights that drive smart decisions.",
      features: ["Real-time updates", "Custom metrics", "Decision confidence"]
    },
    "Virtual Finance Director": { 
      imageComponent: OptimizedStrategySession,
      description: "FD expertise without the FD salary. Strategic guidance when you need it.",
      features: ["Quarterly strategy sessions", "On-demand expertise", "Growth accountability"]
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
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        <div className="mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-3 sm:px-4 py-1 rounded-full bg-gradient-to-r from-[#7B3FE4]/20 to-[#3FA4E4]/20 text-purple-300 text-xs sm:text-sm font-medium border border-purple-400/30">
              <span className="mr-1">✦</span> Designed for Modern Businesses <span className="ml-1">✦</span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4 text-white"
            >
Built for Business Growth
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 px-4 sm:px-0">
Most accountants report numbers. We deliver strategy.
            </p>
          </div>
          
          {/* Premium Services Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 sm:mb-16">
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
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 mt-12 sm:mt-16">
                <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 gradient-text">
Foundation Services
                </h2>
                <p className="text-sm sm:text-base max-w-xl mx-auto text-gray-300 px-4 sm:px-0">
Essential accounting done properly. Fixed pricing, clear communication, results you can trust.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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