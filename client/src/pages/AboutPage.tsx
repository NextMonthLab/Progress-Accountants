import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Zap, Clock, Users, FileText, BarChart, Shield, Sparkles, Award, LifeBuoy } from 'lucide-react';
import { 
  PageHeaderSkeleton, 
  FeaturesSkeleton, 
  CardSkeleton,
  TestimonialsSkeleton
} from '@/components/ui/skeletons';
import { useBusinessIdentity } from '@/hooks/use-business-identity';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();
  
  useEffect(() => {
    // Combine real data loading with synthetic loading for a smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2000 : 1500);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

  // Return skeleton during loading state
  if (isLoading || isLoadingIdentity) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Helmet>
          <title>About Us | Progress Accountants</title>
        </Helmet>

        {/* Skeleton Hero Section */}
        <section className="bg-[var(--navy)] text-white py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <PageHeaderSkeleton />
          </div>
        </section>

        {/* Skeleton Content Sections */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-3/4">
                  <FeaturesSkeleton count={1} />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="p-8 rounded-full">
                  <div className="h-40 w-40 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton Features */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <FeaturesSkeleton count={3} />
          </div>
        </section>

        {/* Skeleton Cards */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <CardSkeleton count={4} />
          </div>
        </section>
      </div>
    );
  }

  // Extract business identity information
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const tagline = businessIdentity?.core?.tagline || "Forward-thinking accounting for modern businesses";
  const description = businessIdentity?.core?.description || "We provide innovative accounting solutions tailored to your business needs.";
  const yearFounded = businessIdentity?.core?.yearFounded || "2018";
  const numberOfEmployees = businessIdentity?.core?.numberOfEmployees || "25-50";
  const usps = businessIdentity?.personality?.usps || [];
  const missionStatement = businessIdentity?.personality?.missionStatement || "";
  const toneOfVoice = businessIdentity?.personality?.toneOfVoice || [];
  const targetAudience = businessIdentity?.market?.targetAudience || "Small to medium-sized businesses";
  const geographicFocus = businessIdentity?.market?.geographicFocus || "United Kingdom";
  const services = businessIdentity?.services || [];

  // Return actual content once loaded
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>About Us | {businessName}</title>
        <meta name="description" content={`${tagline}. We're not just your accountants—we're your growth partners.`} />
      </Helmet>

      {/* 1. Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-orange-300 text-sm font-medium mb-4">
              Established {yearFounded} • {numberOfEmployees} Team Members
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{tagline}</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              We're not just your accountants—we're your growth partners.
            </p>
            <p className="text-lg text-gray-300">
              {businessName} helps ambitious businesses unlock their full financial potential through smart systems, strategic thinking, and a genuinely human approach.
            </p>
            
            {missionStatement && (
              <div className="mt-8 p-5 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="italic text-white/90">"{missionStatement}"</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. What Makes Progress Different */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
                  What Makes {businessName} Different
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Most accounting firms deliver the basics. We deliver insight.
                </p>
                <p className="text-gray-600 mb-6">
                  At {businessName}, we combine cutting-edge technology with a proactive mindset to help our clients stay ahead—whether that means making smarter decisions, saving time, or unlocking new opportunities.
                </p>
                <p className="text-gray-600 mb-8">
                  We believe that financial clarity should be effortless, and we've built systems that make it feel that way.
                </p>
                
                {/* USPs Section */}
                {usps.length > 0 && (
                  <div className="space-y-3 mt-8">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--navy)' }}>Our Unique Advantages:</h3>
                    <ul className="space-y-2">
                      {usps.map((usp, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2 mt-1">✓</span>
                          <span className="text-gray-700">{usp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <div className="p-8 rounded-full bg-gray-100 inline-flex items-center justify-center">
                  <Zap size={120} className="text-[var(--orange)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How We Work */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: 'var(--navy)' }}>
              How We Work
            </h2>
            
            {toneOfVoice.length > 0 && (
              <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
                Our approach is <span className="font-medium">{toneOfVoice.join(', ')}</span>, ensuring we deliver exceptional service that truly makes a difference for your business.
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg">
                <div className="mb-4 text-[var(--orange)]">
                  <FileText size={48} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                  Technology that works for you.
                </h3>
                <p className="text-gray-600">
                  Our client dashboards and automation tools are designed to give you real-time insight, eliminate bottlenecks, and keep everything flowing smoothly.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg">
                <div className="mb-4 text-[var(--orange)]">
                  <Clock size={48} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                  Proactive, not reactive.
                </h3>
                <p className="text-gray-600">
                  We don't wait for deadlines to chase you—we flag what's needed in advance, guide you through it, and get things done early.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg">
                <div className="mb-4 text-[var(--orange)]">
                  <Users size={48} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                  People-first mindset.
                </h3>
                <p className="text-gray-600">
                  We may be tech-led, but we're human at heart. You'll always have someone on your side, ready to explain, support, and go the extra mile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Who We Help */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: 'var(--navy)' }}>
              Who We Help
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 text-center">
              We specialize in serving <span className="font-medium">{targetAudience}</span> across <span className="font-medium">{geographicFocus}</span> that want to:
            </p>
            
            <div className="space-y-4 mb-12">
              <div className="flex items-start">
                <span className="text-green-500 mr-4 mt-1">
                  <Check size={20} />
                </span>
                <p className="text-gray-600">
                  Get control of their finances without drowning in spreadsheets
                </p>
              </div>
              
              <div className="flex items-start">
                <span className="text-green-500 mr-4 mt-1">
                  <Check size={20} />
                </span>
                <p className="text-gray-600">
                  Automate the boring stuff and focus on growth
                </p>
              </div>
              
              <div className="flex items-start">
                <span className="text-green-500 mr-4 mt-1">
                  <Check size={20} />
                </span>
                <p className="text-gray-600">
                  Understand their numbers—and use them to make confident decisions
                </p>
              </div>
              
              <div className="flex items-start">
                <span className="text-green-500 mr-4 mt-1">
                  <Check size={20} />
                </span>
                <p className="text-gray-600">
                  Feel like someone's actually <em>on their side</em>, not just ticking boxes
                </p>
              </div>
            </div>
            
            <p className="text-lg text-center font-medium" style={{ color: 'var(--navy)' }}>
              If that sounds like you, we'd love to talk.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Our Services */}
      {services.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: 'var(--navy)' }}>
                Our Core Services
              </h2>
              
              <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
                We offer a comprehensive range of accounting and financial services tailored to your specific business needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  // Choose an icon based on the service name
                  let ServiceIcon = BarChart;
                  if (service.includes("Tax")) ServiceIcon = Award;
                  else if (service.includes("Book")) ServiceIcon = FileText;
                  else if (service.includes("Advisory")) ServiceIcon = Sparkles;
                  else if (service.includes("Audit")) ServiceIcon = Shield;
                  else if (service.includes("Cloud")) ServiceIcon = Clock;
                  else if (service.includes("Report")) ServiceIcon = LifeBuoy;
                  
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
                      <div className="flex items-start">
                        <div className="mr-4 bg-orange-100 p-3 rounded-full">
                          <ServiceIcon className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>
                            {service}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Tailored solutions to support your business growth and financial success.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-12 text-center">
                <Link href="/services">
                  <Button 
                    variant="outline" 
                    className="hover:text-[var(--orange)] hover:border-[var(--orange)] flex items-center gap-2"
                  >
                    <span>View All Services</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Meet the Team */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
              Meet the Team
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {businessName} is powered by a team of {numberOfEmployees} experienced professionals who care deeply about your business journey.
            </p>
            <Link href="/team">
              <Button 
                className="hover:shadow-md hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--orange)',
                  color: 'white' 
                }}
                size="lg"
              >
                <span>View Our Team</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. The Tools We Use */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: 'var(--navy)' }}>
              The Tools We Use
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 text-center">
              We've built our own tech stack into your workflow:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="text-[var(--orange)] mr-4">
                  <BarChart size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{ color: 'var(--navy)' }}>
                    Real-time financial dashboards
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Always know where you stand with up-to-date financial data
                  </p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="text-[var(--orange)] mr-4">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{ color: 'var(--navy)' }}>
                    Secure document portals
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Safe, easy exchange of sensitive financial documents
                  </p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="text-[var(--orange)] mr-4">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{ color: 'var(--navy)' }}>
                    Automated reminders and status updates
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Never miss a deadline or important update
                  </p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="text-[var(--orange)] mr-4">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{ color: 'var(--navy)' }}>
                    AI-powered insights and reporting
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Intelligent analysis that helps identify opportunities
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-700">
              All of this is designed to save you time, reduce risk, and give you full visibility at a glance.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="py-16 md:py-24 bg-[var(--navy)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Ready to Make Progress?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              We're here to help you get clear, get confident, and get ahead.<br />
              Let's start with a simple conversation.
            </p>
            <a href="/contact">
              <Button 
                size="lg"
                className="hover:shadow-md hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--orange)',
                  color: 'white' 
                }}
              >
                <span>Contact Us</span>
                <ArrowRight size={16} />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}