import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Calculator, BarChart3, CreditCard, TrendingUp, Briefcase, Cloud, LineChart } from 'lucide-react';

// Service type definition
interface Service {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
}

export default function ServicesPage() {
  // Services data
  const services: Service[] = [
    {
      id: 1,
      name: "Accounting & Compliance",
      description: "Ensure your business stays compliant with accurate financial statements and timely filings, all handled with precision and care.",
      icon: <BookOpen className="w-10 h-10 text-[var(--orange)]" />,
      slug: "accounting-compliance"
    },
    {
      id: 2,
      name: "Bookkeeping",
      description: "Maintain clear and organized financial records with our efficient and reliable bookkeeping services.",
      icon: <Calculator className="w-10 h-10 text-[var(--orange)]" />,
      slug: "bookkeeping"
    },
    {
      id: 3,
      name: "Tax Planning & Preparation",
      description: "Optimize your tax position and ensure compliance with our proactive tax planning and preparation services.",
      icon: <BarChart3 className="w-10 h-10 text-[var(--orange)]" />,
      slug: "tax-services"
    },
    {
      id: 4,
      name: "Payroll Services",
      description: "Streamline your payroll process, ensuring your team is paid accurately and on time, every time.",
      icon: <CreditCard className="w-10 h-10 text-[var(--orange)]" />,
      slug: "payroll-services"
    },
    {
      id: 5,
      name: "Financial Forecasting & Budgeting",
      description: "Plan for the future with confidence using our detailed financial forecasting and budgeting services.",
      icon: <TrendingUp className="w-10 h-10 text-[var(--orange)]" />,
      slug: "financial-forecasting"
    },
    {
      id: 6,
      name: "Business Advisory",
      description: "Receive strategic advice tailored to your business goals, helping you make informed decisions and drive growth.",
      icon: <Briefcase className="w-10 h-10 text-[var(--orange)]" />,
      slug: "business-advisory"
    },
    {
      id: 7,
      name: "Cloud Accounting Solutions",
      description: "Leverage the power of cloud accounting to access your financial data anytime, anywhere, with real-time insights.",
      icon: <Cloud className="w-10 h-10 text-[var(--orange)]" />,
      slug: "cloud-accounting"
    },
    {
      id: 8,
      name: "Virtual CFO Services",
      description: "Gain executive-level financial expertise without the full-time commitment, guiding your business towards financial success.",
      icon: <LineChart className="w-10 h-10 text-[var(--orange)]" />,
      slug: "virtual-cfo"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Our Services | Progress Accountants</title>
        <meta 
          name="description" 
          content="Explore our range of accounting services designed to help your business grow. From bookkeeping to tax planning and virtual CFO services." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-blue-900 to-indigo-900">
          {/* This is where a background image would go, using a gradient as placeholder */}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Accounting Services Designed for Growth</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              At Progress Accountants, we combine cutting-edge technology with proactive expertise to help your business thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--navy)' }}>
                Our Services
              </h2>
              <p className="text-gray-600 mt-4">
                Discover how our comprehensive range of accounting services can support your business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg hover:translate-y-[-5px]"
                >
                  <div className="flex items-start mb-4">
                    <div className="mr-4">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {service.description}
                      </p>
                      <Link href={`/services/${service.slug}`}>
                        <Button 
                          variant="link" 
                          className="p-0 flex items-center text-[var(--orange)] hover:text-[var(--navy)] transition-colors"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[var(--navy)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Ready to Elevate Your Business Finances?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Contact us today to discover how our services can support your business growth.
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="hover:shadow-md hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--orange)',
                  color: 'white' 
                }}
              >
                <span>Get in Touch</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}