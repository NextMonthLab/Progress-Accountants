
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

  // Extract business identity information with proper type safety
  const businessName = (businessIdentity as any)?.core?.businessName || "Progress Accountants";
  const tagline = (businessIdentity as any)?.core?.tagline || "Forward-thinking accounting for modern businesses";
  const description = (businessIdentity as any)?.core?.description || "We provide innovative accounting solutions tailored to your business needs.";
  const yearFounded = (businessIdentity as any)?.core?.yearFounded || "2018";
  const numberOfEmployees = (businessIdentity as any)?.core?.numberOfEmployees || "25-50";
  const usps = (businessIdentity as any)?.personality?.usps || [];
  const missionStatement = (businessIdentity as any)?.personality?.missionStatement || "";
  const toneOfVoice = (businessIdentity as any)?.personality?.toneOfVoice || [];
  const targetAudience = (businessIdentity as any)?.market?.targetAudience || "Small to medium-sized businesses";
  const geographicFocus = (businessIdentity as any)?.market?.geographicFocus || "United Kingdom";
  const services = (businessIdentity as any)?.services || [];

  // Return actual content once loaded
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>About Us | {businessName}</title>
        <meta name="description" content={`${tagline}. We're not just your accountants—we're your growth partners.`} />
      </Helmet>

      {/* Gold Standard Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Cinematic Full-Width Background with Smart Focal Points */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop/Tablet Background - Adjusted for Head Visibility */}
          <div 
            className="absolute inset-0 w-full h-full hidden sm:block"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742829/P1012439_ixwou6.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          />
          
          {/* Mobile Background - Optimal Head Framing */}
          <div 
            className="absolute inset-0 w-full h-full block sm:hidden"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742829/P1012439_ixwou6.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Dark Overlay for Text Legibility - Gold Standard: 15% Opacity */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
        </div>

        {/* Content Container - Centered Layout */}
        <div className="relative z-10 w-full px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            {/* Gold Standard Headline - 4-8 words per line, max 16 total */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em'
                  }}>
                <span className="block">The Story Behind</span>
                <span className="block">Progress Accountants</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                From a simple observation: business owners deserve an accountant who actually helps them grow.
              </p>
            </FadeIn>

            {/* Gold Standard CTA - Large, centered, outcome-driven */}
            <FadeIn delay={0.3}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                onClick={() => window.open('https://calendly.com/progressaccountants/discovery-call', '_blank')}
              >
                Book My Strategy Call
              </Button>
            </FadeIn>
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
                    We Started Because We Saw Business Owners Struggling
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    In 2018, we noticed a pattern. Talented entrepreneurs were trapped by their finances—not because they lacked business acumen, but because traditional accounting firms treated them like ticket numbers instead of growth partners.
                  </p>
                  <p className="text-gray-400 mb-6">
                    We knew there had to be a better way. That's why we built Progress: an accounting firm that actually helps businesses progress.
                  </p>
                  <p className="text-gray-400 mb-8">
                    Today, we're proud to serve ambitious UK businesses who refuse to accept "financial confusion" as the price of entrepreneurship.
                  </p>
                  
                  {/* Key Advantages */}
                  <div className="space-y-3 mt-8">
                    <h3 className="text-lg font-semibold text-purple-300">What Makes Us Your Ideal Guide:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3 mt-1">✓</span>
                        <span className="text-gray-300">We understand business growth because we've achieved it ourselves</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3 mt-1">✓</span>
                        <span className="text-gray-300">Chartered status with decades of combined expertise</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3 mt-1">✓</span>
                        <span className="text-gray-300">Deep industry knowledge in film, music, construction, and professional services</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-3 mt-1">✓</span>
                        <span className="text-gray-300">Based in Banbury with a heart for local business success</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </SlideInLeft>
              <FadeIn delay={0.2}>
                <div className="flex justify-center">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 p-4">
                    <img 
                      src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747743049/P1013280_sqftkw.jpg"
                      alt="Progress Accountants office environment"
                      className="w-full max-w-md h-auto rounded-xl shadow-lg"
                    />
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
                Our Promise: No More Financial Confusion
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
                We've built our entire practice around one simple promise: you'll never feel lost in your finances again.
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <SlideUp delay={0.1}>
                <div className="dark-theme-card p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-purple-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                  <div className="mb-6 text-purple-400">
                    <Zap size={48} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300">
                    Clarity Over Complexity
                  </h3>
                  <p className="text-gray-400">
                    We translate financial jargon into plain English insights you can actually use to make confident business decisions.
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
                    Strategic Guidance, Not Just Compliance
                  </h3>
                  <p className="text-gray-400">
                    While others focus on historical reporting, we help you see opportunities and make strategic moves that drive growth.
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
                    Partnership, Not Just Service
                  </h3>
                  <p className="text-gray-400">
                    You'll work with real people who care about your success—not automated systems or offshore call centres.
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
                The Entrepreneurs We Love Working With
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-8 text-center">
                You know who you are. You're the business owner who:
              </p>
            </FadeIn>
            
            <div className="space-y-4 mb-12">
              <SlideUp delay={0.1}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">-</span>
                  <p className="text-gray-300">
                    Dreams big but feels trapped by financial confusion
                  </p>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.2}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">-</span>
                  <p className="text-gray-300">
                    Wants to focus on your strengths, not struggle with spreadsheets
                  </p>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.3}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">-</span>
                  <p className="text-gray-300">
                    Knows there must be opportunities you're missing but can't see them clearly
                  </p>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.4}>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-4 mt-1">-</span>
                  <p className="text-gray-300">
                    Values relationships over transactions and wants a trusted advisor, not just a service provider
                  </p>
                </div>
              </SlideUp>
            </div>
            
            <FadeIn delay={0.5}>
              <p className="text-xl text-center font-medium text-purple-300">
                If this resonates, you're exactly who we built Progress for.
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
                  What We Do
                </h2>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
                  All tailored to your business. All delivered with clarity, speed, and expertise.
                </p>
              </FadeIn>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Tax Planning & Preparation", icon: Award },
                  { name: "Bookkeeping", icon: FileText },
                  { name: "Business Advisory", icon: Sparkles },
                  { name: "Financial Reporting", icon: BarChart },
                  { name: "Audit Support", icon: Shield },
                  { name: "Cloud Accounting", icon: Clock },
                  { name: "Construction, Film & Music Accounting", icon: Users },
                  { name: "Business Forecasting & Strategy", icon: Zap },
                  { name: "SME Resources & Support Hub", icon: LifeBuoy }
                ].map((service, index) => (
                  <SlideUp key={index} delay={0.1 + (index * 0.1)}>
                    <div className="dark-theme-card p-6 hover:shadow-lg transition-all border border-purple-500/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
                      <div className="flex items-start">
                        <div className="mr-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 rounded-full border border-purple-500/30">
                          <service.icon className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <span className="text-purple-400 mr-2">✓</span>
                          <h3 className="font-semibold mb-2 text-purple-300 inline">
                            {service.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </SlideUp>
                ))}
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    The People Behind Your Success
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-xl text-gray-300 mb-6">
                    We're not just accountants—we're entrepreneurs who understand the journey because we've walked it ourselves.
                  </p>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <p className="text-gray-400 mb-8">
                    Every member of our team shares the same mission: to be the financial guide you wish you'd had when you started your business. We combine professional expertise with genuine care for your success.
                  </p>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <Link href="/team">
                    <Button 
                      className="progress-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                      size="lg"
                    >
                      <span>Meet Your Guides</span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </FadeIn>
              </div>

              {/* Team Image */}
              <FadeIn delay={0.2}>
                <div className="relative">
                  <img 
                    src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1747742829/P1013106-Enhanced-NR_adzlje.jpg"
                    alt="Progress Accountants team members"
                    className="w-full h-[500px] object-cover rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 7. The Tools We Use */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                How We Ensure Your Success
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-300 mb-8 text-center">
                Behind every confident business decision you make, there's a system designed to support your growth:
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
                      Clarity Tools That Actually Work
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Modern cloud technology that gives you real-time insights without the complexity
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
                      Automated reminders & deadline tracking
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
                      AI-driven reporting & insight tools
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
                Designed to save you time, reduce risk, and give you instant clarity—wherever you are.
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
                Let's help you get clear, get confident, and get ahead.
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
