import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { 
  Calculator, 
  BookOpen, 
  BarChart4, 
  ClipboardCheck, 
  DollarSign, 
  Cloud, 
  FileSpreadsheet,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  PageHeaderSkeleton,
  ServicesSkeleton,
  CardSkeleton,
  CtaSkeleton
} from '@/components/ui/skeletons';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
}

const services: Service[] = [
  {
    id: 1,
    name: "Accounting & Compliance",
    description: "Ensure your business stays compliant with accurate financial statements and timely filings, all handled with precision and care.",
    icon: <Calculator className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "accounting-compliance"
  },
  {
    id: 2,
    name: "Bookkeeping",
    description: "Maintain clear and organized financial records with our efficient and reliable bookkeeping services.",
    icon: <BookOpen className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "bookkeeping"
  },
  {
    id: 3,
    name: "Tax Planning & Preparation",
    description: "Optimize your tax position and ensure compliance with our proactive tax planning and preparation services.",
    icon: <ClipboardCheck className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "tax-services"
  },
  {
    id: 4,
    name: "Payroll Services",
    description: "Streamline your payroll process, ensuring your team is paid accurately and on time, every time.",
    icon: <DollarSign className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "payroll-services"
  },
  {
    id: 5,
    name: "Financial Forecasting & Budgeting",
    description: "Plan for the future with confidence using our detailed financial forecasting and budgeting services.",
    icon: <BarChart4 className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "financial-forecasting"
  },
  {
    id: 6,
    name: "Business Advisory",
    description: "Receive strategic advice tailored to your business goals, helping you make informed decisions and drive growth.",
    icon: <Briefcase className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "business-advisory"
  },
  {
    id: 7,
    name: "Cloud Accounting Solutions",
    description: "Leverage the power of cloud accounting to access your financial data anytime, anywhere, with real-time insights.",
    icon: <Cloud className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "cloud-accounting"
  },
  {
    id: 8,
    name: "Virtual CFO Services",
    description: "Gain executive-level financial expertise without the full-time commitment, guiding your business towards financial success.",
    icon: <FileSpreadsheet className="h-10 w-10 mb-4" style={{ color: 'var(--orange)' }} />,
    slug: "virtual-cfo"
  }
];

export default function ServicesPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Return skeleton during loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Helmet>
          <title>Our Services | Progress Accountants</title>
        </Helmet>
        
        {/* Skeleton Hero Section */}
        <section className="bg-[var(--navy)] text-white py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8">
            <PageHeaderSkeleton />
          </div>
        </section>
        
        {/* Skeleton Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="space-y-4 mb-16 max-w-3xl mx-auto">
              <div className="h-8 w-64 mx-auto bg-muted animate-pulse rounded-md"></div>
              <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
              <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
              <div className="h-4 w-3/4 mx-auto bg-muted animate-pulse rounded-md"></div>
            </div>
            
            <ServicesSkeleton count={8} />
          </div>
        </section>
        
        {/* Skeleton Feature Sections */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 md:px-8">
            <CardSkeleton count={1} />
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <CardSkeleton count={1} />
          </div>
        </section>
        
        {/* Skeleton CTA */}
        <section className="py-16 bg-[var(--navy)]">
          <div className="container mx-auto px-6 md:px-8">
            <CtaSkeleton />
          </div>
        </section>
      </div>
    );
  }
  
  // Return actual content once loaded
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Our Services | Progress Accountants</title>
        <meta name="description" content="Explore the comprehensive accounting and financial services offered by Progress Accountants to help your business thrive." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-200">
              Comprehensive financial solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>How We Support Your Business</h2>
            <p className="text-gray-700 mb-4">
              At Progress Accountants, we offer a full spectrum of financial services designed to support businesses at every stage of growth. Our tailored approaches ensure you get exactly what you need to thrive in today's competitive environment.
            </p>
            <p className="text-gray-700">
              Whether you're looking for day-to-day accounting support or strategic financial guidance, our team of experts is here to help you succeed.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full transform transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex-grow">
                  {service.icon}
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                </div>
                <Link href={`/services/${service.slug}`} className="text-[var(--orange)] font-medium inline-flex items-center hover:text-[var(--navy)] transition-colors duration-300 no-underline">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Studio Feature */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 md:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="h-64 md:h-auto bg-[var(--navy)] flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Podcast & Video Studio</h3>
                  <p className="text-gray-200 mb-6">A cutting-edge facility for content creators</p>
                  <Link href="/studio-banbury">
                    <Button 
                      style={{ backgroundColor: 'var(--orange)', color: 'white' }}
                      className="hover:shadow-md hover:-translate-y-[2px] transition duration-300"
                    >
                      Explore the Studio
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right: Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy)' }}>More Than Just Accounting</h3>
                <p className="text-gray-700 mb-4">
                  Progress Accountants offers more than just financial services. Our state-of-the-art podcast and video studio in Banbury provides a professional environment for content creation.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Professional recording equipment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Acoustically treated space</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Lighting and camera setup</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Available for hourly and daily rental</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Dashboard Feature */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy)' }}>Client Financial Dashboard</h3>
                <p className="text-gray-700 mb-4">
                  Our digital client portal provides you with 24/7 access to your financial information, documents, and communication with our team.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Real-time financial reporting</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Secure document storage and sharing</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Direct messaging with your accountant</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Task management and deadline tracking</span>
                  </li>
                </ul>
                
                <Link href="/client-dashboard">
                  <Button 
                    style={{ backgroundColor: 'var(--orange)', color: 'white' }}
                    className="hover:shadow-md hover:-translate-y-[2px] transition duration-300"
                  >
                    View Demo Dashboard
                  </Button>
                </Link>
              </div>
              
              {/* Right: Image/Placeholder */}
              <div className="h-64 md:h-auto bg-[var(--navy)] flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Client Portal</h3>
                  <p className="text-gray-200 mb-6">Your finances at your fingertips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--navy)] text-white">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Your Business Further?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Schedule a consultation with our team to discuss how our services can be tailored to meet your specific needs.
          </p>
          <Link href="/contact">
            <Button 
              size="lg"
              className="hover:shadow-md hover:-translate-y-[2px] transition duration-300"
              style={{ 
                backgroundColor: 'var(--orange)',
                color: 'white' 
              }}
            >
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}