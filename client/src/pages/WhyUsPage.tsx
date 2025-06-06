import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Award, 
  Clock, 
  Shield, 
  Lightbulb, 
  Zap, 
  BarChart, 
  Users,
  Sparkles
} from 'lucide-react';
import { PageHeaderSkeleton, FeaturesSkeleton } from '@/components/ui/skeletons';
import { useBusinessIdentity } from '@/hooks/use-business-identity';

export default function WhyUsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { businessIdentity, isLoading: isLoadingIdentity } = useBusinessIdentity();

  useEffect(() => {
    // Combine real data loading with synthetic loading for a smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isLoadingIdentity ? 2000 : 1500);
    
    return () => clearTimeout(timer);
  }, [isLoadingIdentity]);

  const testimonials = [
    {
      quote: "Progress helped us make sense of our numbers and plan for the future. It's not just accounting—it's guidance.",
      name: "Consultancy Owner",
      position: "Midlands",
      rating: 5
    },
    {
      quote: "I finally feel like we have accountants who care. Fast replies, good advice, and no more chasing.",
      name: "Creative Director",
      position: "London",
      rating: 5
    }
  ];

  // Return skeleton during loading state
  if (isLoading || isLoadingIdentity) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Helmet>
          <title>Why Choose Us | Progress Accountants</title>
        </Helmet>

        {/* Skeleton Hero Section */}
        <section className="bg-gray-800 text-white py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <PageHeaderSkeleton />
          </div>
        </section>

        {/* Skeleton Features */}
        <section className="py-16 md:py-24 bg-gray-900">
          <div className="container mx-auto px-4">
            <FeaturesSkeleton count={6} />
          </div>
        </section>
      </div>
    );
  }

  // Extract business information
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const yearFounded = businessIdentity?.core?.yearFounded || "2018";
  const usps = businessIdentity?.personality?.usps || [];
  const missionStatement = businessIdentity?.personality?.missionStatement || "";
  const values = businessIdentity?.personality?.values || [];
  const certifications = businessIdentity?.personality?.certifications || [];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Helmet>
        <title>Why Choose Us | {businessName}</title>
        <meta name="description" content={`Discover what makes ${businessName} different and why businesses choose us for their accounting needs. Expertise, technology, and a client-first approach.`} />
      </Helmet>

      {/* Hero Section with Background Image */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050356/Contemporary_Business_Owner..._original_546357_k7pinx.jpg"
            alt="Contemporary business owner background"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-white">Why Choose </span>
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Progress?</span>
            </h1>
            <p className="text-xl text-gray-100">
              We're not just your accountants—we're your growth partners.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-900/10 pointer-events-none"></div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-300">
              We go beyond compliance to help you plan, forecast, and scale—whatever growth means to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-700">
              <div className="mb-6 p-4 rounded-full inline-flex bg-blue-500/20">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Growth-Focused
              </h3>
              <p className="text-gray-300">
                We go beyond compliance to help you plan, forecast, and scale—whatever growth means to you.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-700">
              <div className="mb-6 p-4 rounded-full inline-flex bg-pink-500/20">
                <span className="text-3xl">🧑‍💻</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Tech-Savvy
              </h3>
              <p className="text-gray-300">
                From cloud dashboards to automation, we bring the tools and know-how to make your finances run smoother.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-700">
              <div className="mb-6 p-4 rounded-full inline-flex bg-blue-500/20">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Always Human
              </h3>
              <p className="text-gray-300">
                Real people. Straight answers. You'll always have someone on your side who speaks your language.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-700">
              <div className="mb-6 p-4 rounded-full inline-flex bg-pink-500/20">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Clarity Over Complexity
              </h3>
              <p className="text-gray-300">
                No jargon. No surprises. Just clear, actionable insight into what's working, what's changing, and what to do next.
              </p>
            </div>
            
            {/* Card 5 */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-700">
              <div className="mb-6 p-4 rounded-full inline-flex bg-blue-500/20">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Sector-Specific Knowledge
              </h3>
              <p className="text-gray-300">
                We don't try to be everything to everyone—we specialise in Construction, Film, Music, Property, and Professional Services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-lg text-gray-300">
              These core principles guide every interaction and decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
              <div className="mr-4 text-blue-400">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-white">
                  Simplicity
                </h3>
                <p className="text-gray-300 text-sm">
                  We keep things clear, clean, and straightforward—because confidence starts with understanding.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
              <div className="mr-4 text-pink-400">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-white">
                  Partnership
                </h3>
                <p className="text-gray-300 text-sm">
                  We're in it with you. Whether you're launching, scaling, or stuck—we're right there alongside you.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
              <div className="mr-4 text-blue-400">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-white">
                  Curiosity
                </h3>
                <p className="text-gray-300 text-sm">
                  We don't just tick boxes. We ask questions, spot patterns, and look ahead.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
              <div className="mr-4 text-pink-400">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-white">
                  Proactivity
                </h3>
                <p className="text-gray-300 text-sm">
                  We don't wait for year-end—we flag opportunities and issues early, so you stay in control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USPs Section */}
      {usps.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-blue-300 text-sm font-medium mb-4">
                Our Unique Advantages
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                Why Clients Choose Us
              </h2>
              <p className="text-lg text-gray-300">
                Here's what makes our accounting services truly stand out from the competition.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {usps.map((usp, index) => (
                <div key={index} className="flex items-start bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="mr-4 text-pink-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{usp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications and Credentials */}
      {certifications.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                Our Certifications & Credentials
              </h2>
              <p className="text-lg text-gray-300">
                We maintain the highest standards of professional excellence.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {certifications.map((certification, index) => (
                <div key={index} className="flex items-center bg-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-700">
                  <div className="mr-3 text-blue-400">
                    <Award size={20} />
                  </div>
                  <span className="font-medium text-white">{certification}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Testimonials */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-300">
              Don't just take our word for it—here's what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:text-blue-400 hover:border-blue-400 flex items-center gap-2"
              >
                <span>Read More Testimonials</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 md:py-24 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
              Our Client Process
            </h2>
            <p className="text-lg text-gray-300">
              A transparent, effective approach designed to maximize your financial success.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Process Timeline */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 transform -translate-x-1/2"></div>
              
              {/* Step 1 */}
              <div className="relative md:flex items-center mb-16">
                <div className="hidden md:block w-1/2 pr-8 text-right">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Initial Consultation
                  </h3>
                  <p className="text-gray-300">
                    We start by understanding your business goals, challenges, and current financial situation.
                  </p>
                </div>
                
                <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 border-4 border-gray-800 shadow-lg mb-4 md:mb-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                
                <div className="md:w-1/2 md:pl-8 md:text-left">
                  <h3 className="md:hidden text-xl font-bold mb-2 text-white">
                    Initial Consultation
                  </h3>
                  <p className="md:hidden text-gray-300 mb-4">
                    We start by understanding your business goals, challenges, and current financial situation.
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center mb-2">
                      <Clock size={18} className="text-blue-400 mr-2" />
                      <span className="text-white font-medium">45-60 minutes</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      A no-obligation conversation to see if we're a good fit for your needs.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative md:flex items-center mb-16">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-gray-900 p-4 rounded-lg md:ml-auto md:mr-0 border border-gray-700">
                    <div className="flex items-center mb-2 md:justify-end">
                      <BarChart size={18} className="text-pink-400 mr-2" />
                      <span className="text-white font-medium">Tailored Strategy</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      We develop a customized financial strategy aligned with your specific business objectives.
                    </p>
                  </div>
                </div>
                
                <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-pink-500/20 border-4 border-gray-800 shadow-lg my-4 md:my-0">
                  <span className="text-pink-400 font-bold">2</span>
                </div>
                
                <div className="md:w-1/2 md:pl-8">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Strategic Planning
                  </h3>
                  <p className="text-gray-300">
                    Based on our discoveries, we create a comprehensive plan to optimize your financial operations.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative md:flex items-center mb-16">
                <div className="hidden md:block w-1/2 pr-8 text-right">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Implementation
                  </h3>
                  <p className="text-gray-300">
                    We set up systems, processes, and reporting structures to bring your financial strategy to life.
                  </p>
                </div>
                
                <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 border-4 border-gray-800 shadow-lg mb-4 md:mb-0">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                
                <div className="md:w-1/2 md:pl-8">
                  <h3 className="md:hidden text-xl font-bold mb-2 text-white">
                    Implementation
                  </h3>
                  <p className="md:hidden text-gray-300 mb-4">
                    We set up systems, processes, and reporting structures to bring your financial strategy to life.
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center mb-2">
                      <Zap size={18} className="text-blue-400 mr-2" />
                      <span className="text-white font-medium">Seamless Integration</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      We handle the heavy lifting to ensure minimal disruption to your business operations.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative md:flex items-center">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-gray-900 p-4 rounded-lg md:ml-auto md:mr-0 border border-gray-700">
                    <div className="flex items-center mb-2 md:justify-end">
                      <Shield size={18} className="text-pink-400 mr-2" />
                      <span className="text-white font-medium">Continuous Support</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Regular reviews, updates, and expert guidance to ensure your financial success.
                    </p>
                  </div>
                </div>
                
                <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-pink-500/20 border-4 border-gray-800 shadow-lg my-4 md:my-0">
                  <span className="text-pink-400 font-bold">4</span>
                </div>
                
                <div className="md:w-1/2 md:pl-8">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    Ongoing Partnership
                  </h3>
                  <p className="text-gray-300">
                    We provide proactive advice, regular reporting, and strategic adjustments as your business evolves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              See the difference for yourself
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Book a free consultation and discover how Progress can support your business—not just your bookkeeping.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-[2px] transition duration-300 flex items-center gap-2"
                >
                  <span>Book a Free Consultation</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/services">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 flex items-center gap-2"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}