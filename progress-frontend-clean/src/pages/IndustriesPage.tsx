import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Briefcase, Stethoscope, ShoppingCart, GraduationCap, Scale, Home, PiggyBank, Factory, Truck, HeartHandshake } from 'lucide-react';
import { PageHeaderSkeleton, CardSkeleton } from '@/components/ui/skeletons';
import { useBusinessIdentity } from '@/hooks/use-business-identity';

type Industry = {
  name: string;
  description: string;
  challenges: string[];
  icon: React.ReactNode;
};

export default function IndustriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    // Combine real data loading with synthetic loading for a smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2000 : 1500);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

  const industries: Industry[] = [
    {
      name: "Professional Services",
      description: "Accounting solutions for law firms, consulting firms, and other professional service providers.",
      challenges: [
        "Complex billing structures",
        "Time tracking and project profitability",
        "Partner distributions"
      ],
      icon: <Briefcase size={40} />
    },
    {
      name: "Healthcare",
      description: "Financial management for medical practices, clinics, and healthcare providers.",
      challenges: [
        "Insurance reimbursements",
        "Regulatory compliance",
        "Cash flow management"
      ],
      icon: <Stethoscope size={40} />
    },
    {
      name: "Retail & E-commerce",
      description: "Accounting solutions for brick-and-mortar and online retail businesses.",
      challenges: [
        "Inventory management",
        "Multiple sales channels",
        "Seasonal cash flow"
      ],
      icon: <ShoppingCart size={40} />
    },
    {
      name: "Education",
      description: "Financial strategies for educational institutions and training organizations.",
      challenges: [
        "Enrollment fluctuations",
        "Grant management",
        "Multiple funding sources"
      ],
      icon: <GraduationCap size={40} />
    },
    {
      name: "Legal",
      description: "Specialized accounting for law firms and legal services.",
      challenges: [
        "Trust accounting",
        "Partner compensation",
        "Case cost tracking"
      ],
      icon: <Scale size={40} />
    },
    {
      name: "Real Estate",
      description: "Financial solutions for property management, development, and real estate investment.",
      challenges: [
        "Property portfolio management",
        "Rental income tracking",
        "Development project costing"
      ],
      icon: <Home size={40} />
    },
    {
      name: "Financial Services",
      description: "Accounting and financial management for advisory firms and financial institutions.",
      challenges: [
        "Regulatory compliance",
        "Client fund management",
        "Fee structures"
      ],
      icon: <PiggyBank size={40} />
    },
    {
      name: "Manufacturing",
      description: "Accounting solutions for production businesses and manufacturers.",
      challenges: [
        "Cost of goods sold",
        "Inventory valuation",
        "Supply chain management"
      ],
      icon: <Factory size={40} />
    },
    {
      name: "Logistics & Transportation",
      description: "Financial management for logistics companies and transportation providers.",
      challenges: [
        "Fleet management costs",
        "Fuel cost fluctuations",
        "Route profitability"
      ],
      icon: <Truck size={40} />
    },
    {
      name: "Non-Profit",
      description: "Specialized accounting for charities, foundations, and non-profit organizations.",
      challenges: [
        "Grant compliance",
        "Donor management",
        "Program-based accounting"
      ],
      icon: <HeartHandshake size={40} />
    }
  ];

  // Return skeleton during loading state
  if (isLoading || isLoadingIdentity) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Helmet>
          <title>Industries We Serve | Progress Accountants</title>
        </Helmet>

        {/* Skeleton Hero Section */}
        <section className="bg-[var(--navy)] text-white py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <PageHeaderSkeleton />
          </div>
        </section>

        {/* Skeleton Industry Cards */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <CardSkeleton count={6} />
          </div>
        </section>
      </div>
    );
  }

  // Extract business information
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const targetAudience = businessIdentity?.market?.targetAudience || "Small to medium-sized businesses";
  const primaryIndustry = businessIdentity?.market?.primaryIndustry || "Accounting";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Industries We Serve | {businessName}</title>
        <meta name="description" content={`Specialized accounting and financial solutions for various industries. Find industry-specific expertise for your business needs.`} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Industry-Specific Financial Expertise</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-6">
              We understand that every industry has unique financial challenges.
            </p>
            <p className="text-lg text-gray-300">
              {businessName} provides specialized accounting solutions tailored to the specific needs of various industries,
              with particular expertise in serving {targetAudience}.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-900/10 pointer-events-none"></div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-700">
              Our experience spans across multiple sectors, enabling us to provide knowledgeable and effective financial solutions
              no matter what industry you operate in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="mb-6 p-4 rounded-full inline-flex bg-blue-50" style={{ color: 'var(--orange)' }}>
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                    {industry.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {industry.description}
                  </p>
                  
                  {/* Common Challenges */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-gray-500">
                      Common Challenges
                    </h4>
                    <ul className="space-y-1">
                      {industry.challenges.map((challenge, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
              Don't See Your Industry?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We work with businesses across many sectors. Contact us to discuss your specific industry needs
              and how we can tailor our services to your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/services">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto hover:text-[var(--orange)] hover:border-[var(--orange)] flex items-center gap-2"
                >
                  <span>Our Services</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  className="w-full sm:w-auto hover:shadow-md hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                  style={{ 
                    backgroundColor: 'var(--orange)',
                    color: 'white' 
                  }}
                >
                  <span>Contact Us</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-16 md:py-24 bg-[var(--navy)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Industry Knowledge Matters</h2>
                <p className="text-lg text-gray-200 mb-6">
                  Generic accounting services can miss the nuances and specific challenges of your industry.
                </p>
                <p className="text-gray-300 mb-6">
                  At {businessName}, we invest in understanding the specific financial concerns, regulations, and trends that affect your industry.
                  This deeper knowledge allows us to provide more relevant advice and more effective financial strategies.
                </p>
                <p className="text-gray-300">
                  Our team has specialized experience in these sectors, ensuring you get accounting services that truly understand your business context.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-900 p-6 rounded-lg">
                  <Building2 size={40} className="text-orange-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Industry-Specific Compliance</h3>
                  <p className="text-gray-300 text-sm">We stay current with regulations that affect your specific industry</p>
                </div>
                <div className="bg-blue-900 p-6 rounded-lg">
                  <PiggyBank size={40} className="text-orange-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Tailored Financial Planning</h3>
                  <p className="text-gray-300 text-sm">Financial strategies designed for your industry's unique cash flow patterns</p>
                </div>
                <div className="bg-blue-900 p-6 rounded-lg">
                  <Briefcase size={40} className="text-orange-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Sector Benchmarking</h3>
                  <p className="text-gray-300 text-sm">Compare your performance against industry-specific benchmarks</p>
                </div>
                <div className="bg-blue-900 p-6 rounded-lg">
                  <HeartHandshake size={40} className="text-orange-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Specialized Advisory</h3>
                  <p className="text-gray-300 text-sm">Guidance from professionals with experience in your industry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}