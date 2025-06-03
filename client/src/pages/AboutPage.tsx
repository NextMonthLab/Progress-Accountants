
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
import { FadeIn, SlideUp, SlideInLeft } from '@/components/ui/ScrollAnimation';

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
      <div className="min-h-screen bg-black text-white">
        <Helmet>
          <title>About Us | Progress Accountants</title>
        </Helmet>

        {/* Skeleton Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800" />
          <div className="container relative z-10 mx-auto px-6 md:px-8">
            <PageHeaderSkeleton />
          </div>
        </section>

        {/* Skeleton Content Sections */}
        <section className="py-16 md:py-24 bg-slate-900/50">
          <div className="container mx-auto px-6 md:px-8">
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
        <section className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6 md:px-8">
            <FeaturesSkeleton count={3} />
          </div>
        </section>

        {/* Skeleton Cards */}
        <section className="py-16 md:py-24 bg-slate-900/30">
          <div className="container mx-auto px-6 md:px-8">
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
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>About Us | {businessName}</title>
        <meta name="description" content={`${tagline}. We're not just your accountants—we're your growth partners.`} />
      </Helmet>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800" />
        <div className="container relative z-10 mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-200 text-sm font-medium mb-6">
                Established {yearFounded} • {numberOfEmployees} Team Members
              </span>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                {tagline}
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                We're not just your accountants—we're your growth partners.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                {businessName} helps ambitious businesses unlock their full financial potential through smart systems, strategic thinking, and a genuinely human approach.
              </p>
            </FadeIn>
            
            {missionStatement && (
              <FadeIn delay={0.5}>
                <div className="mt-10 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl">
                  <p className="italic text-gray-300">"{missionStatement}"</p>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* 2. What Makes Progress Different */}
      <section className="py-16 md:py-24 bg-slate-900/50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <SlideInLeft delay={0.1}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    What Makes {businessName} Different
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    Most accounting firms deliver the basics. We deliver insight.
                  </p>
                  <p className="text-gray-400 mb-6">
                    At {businessName}, we combine cutting-edge technology with a proactive mindset to help our clients stay ahead—whether that means making smarter decisions, saving time, or unlocking new opportunities.
                  </p>
                  <p className="text-gray-400 mb-8">
                    We believe that financial clarity should be effortless, and we've built systems that make it feel that way.
                  </p>
                  
                  {/* USPs Section */}
                  {usps.length > 0 && (
                    <div className="space-y-3 mt-8">
                      <h3 className="text-lg font-semibold text-purple-300">Our Unique Advantages:</h3>
                      <ul className="space-y-3">
                        {usps.map((usp, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-3 mt-1">✓</span>
                            <span className="text-gray-300">{usp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </SlideInLeft>
              <FadeIn delay={0.2}>
                <div className="flex justify-center">
                  <div className="p-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 inline-flex items-center justify-center">
                    <Zap size={120} className="text-purple-400" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How We Work */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                How We Work
              </h2>
            </FadeIn>
            
            {toneOfVoice.length > 0 && (
              <FadeIn delay={0.2}>
                <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
                  Our approach is <span className="font-medium text-purple-300">{toneOfVoice.join(', ')}</span>, ensuring we deliver exceptional service that truly makes a difference for your business.
                </p>
              </FadeIn>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <SlideUp delay={0.1}>
                <div className="dark-theme-card p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-purple-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                  <div className="mb-6 text-purple-400">
                    <FileText size={48} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300">
                    Technology that works for you.
                  </h3>
                  <p className="text-gray-400">
                    Our client dashboards and automation tools are designed to give you real-time insight, eliminate bottlenecks, and keep everything flowing smoothly.
                  </p>
                </div>
              </SlideUp>
              
              {/* Card 2 */}
              <SlideUp delay={0.2}>
                <div className="dark-theme-card p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-purple-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                  <div className="mb-6 text-purple-400">
                    <Clock size={48} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300">
                    Proactive, not reactive.
                  </h3>
                  <p className="text-gray-400">
                    We don't wait for deadlines to chase you—we flag what's needed in advance, guide you through it, and get things done early.
                  </p>
                </div>
              </SlideUp>
              
              {/* Card 3 */}
              <SlideUp delay={0.3}>
                <div className="dark-theme-card p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-purple-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                  <div className="mb-6 text-purple-400">
                    <Users size={48} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300">
                    People-first mindset.
                  </h3>
                  <p className="text-gray-400">
                    We may be tech-led, but we're human at heart. You'll always have someone on your side, ready to explain, support, and go the extra mile.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Who We Help */}
      <section className="py-16 md:py-24 bg-slate-900/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Who We Help
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-8 text-center">
                We specialize in serving <span className="font-medium text-purple-300">{targetAudience}</span> across <span className="font-medium text-purple-300">{geographicFocus}</span> that want to:
              </p>
            </FadeIn>
            
            <div className="space-y-4 mb-12">
              <SlideUp delay={0.1}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">
                    <Check size={20} />
                  </span>
                  <p className="text-gray-300">
                    Get control of their finances without drowning in spreadsheets
                  </p>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.2}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">
                    <Check size={20} />
                  </span>
                  <p className="text-gray-300">
                    Automate the boring stuff and focus on growth
                  </p>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.3}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">
                    <Check size={20} />
                  </span>
                  <p className="text-gray-300">
                    Understand their numbers—and use them to make confident decisions
                  </p>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.4}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">
                    <Check size={20} />
                  </span>
                  <p className="text-gray-300">
                    Feel like someone's actually <em>on their side</em>, not just ticking boxes
                  </p>
                </div>
              </SlideUp>
            </div>
            
            <FadeIn delay={0.5}>
              <p className="text-xl text-center font-medium text-purple-300">
                If that sounds like you, we'd love to talk.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. Our Services */}
      {services.length > 0 && (
        <section className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Our Core Services
                </h2>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
                  We offer a comprehensive range of accounting and financial services tailored to your specific business needs.
                </p>
              </FadeIn>
              
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
                    <SlideUp key={index} delay={0.1 + (index * 0.1)}>
                      <div className="dark-theme-card p-6 hover:shadow-lg transition-all border border-purple-500/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
                        <div className="flex items-start">
                          <div className="mr-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 rounded-full border border-purple-500/30">
                            <ServiceIcon className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-purple-300">
                              {service}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Tailored solutions to support your business growth and financial success.
                            </p>
                          </div>
                        </div>
                      </div>
                    </SlideUp>
                  );
                })}
              </div>
              
              <FadeIn delay={0.4}>
                <div className="mt-12 text-center">
                  <Link href="/services">
                    <Button 
                      variant="outline" 
                      className="progress-button border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 flex items-center gap-2"
                    >
                      <span>View All Services</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* 6. Meet the Team */}
      <section className="py-16 md:py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Meet the Team
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-8">
                {businessName} is powered by a team of {numberOfEmployees} experienced professionals who care deeply about your business journey.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Link href="/team">
                <Button 
                  className="progress-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                  size="lg"
                >
                  <span>View Our Team</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. The Tools We Use */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                The Tools We Use
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-8 text-center">
                We've built our own tech stack into your workflow:
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <SlideUp delay={0.1}>
                <div className="flex items-start dark-theme-card p-6 border border-purple-500/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:shadow-lg transition-all">
                  <div className="text-purple-400 mr-4">
                    <BarChart size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-purple-300">
                      Real-time financial dashboards
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Always know where you stand with up-to-date financial data
                    </p>
                  </div>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.2}>
                <div className="flex items-start dark-theme-card p-6 border border-purple-500/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:shadow-lg transition-all">
                  <div className="text-purple-400 mr-4">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-purple-300">
                      Secure document portals
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Safe, easy exchange of sensitive financial documents
                    </p>
                  </div>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.3}>
                <div className="flex items-start dark-theme-card p-6 border border-purple-500/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:shadow-lg transition-all">
                  <div className="text-purple-400 mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-purple-300">
                      Automated reminders and status updates
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Never miss a deadline or important update
                    </p>
                  </div>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.4}>
                <div className="flex items-start dark-theme-card p-6 border border-purple-500/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:shadow-lg transition-all">
                  <div className="text-purple-400 mr-4">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-purple-300">
                      AI-powered insights and reporting
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Intelligent analysis that helps identify opportunities
                    </p>
                  </div>
                </div>
              </SlideUp>
            </div>
            
            <FadeIn delay={0.5}>
              <p className="text-center text-gray-300">
                All of this is designed to save you time, reduce risk, and give you full visibility at a glance.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                Ready to Make Progress?
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-8">
                We're here to help you get clear, get confident, and get ahead.<br />
                Let's start with a simple conversation.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="progress-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 px-8 py-4"
                >
                  <span className="text-lg">Contact Us</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
