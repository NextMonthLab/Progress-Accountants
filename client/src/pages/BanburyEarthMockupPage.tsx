import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  BarChart3,
  Briefcase, 
  Calculator, 
  Calendar, 
  ChevronDown,
  Clock,
  Cloud,
  FileCheck, 
  FileText,
  Landmark,
  PhoneCall,
  Shield,
  Star
} from 'lucide-react';

// Banbury Earth Theme colors
const colors = {
  background: '#FDF8F4',
  ctaButton: '#A85D3D',
  text: '#3E2F2F',
  accent: '#FFD8A9',
  sectionBg: '#F1E6DD'
};

// This function mimics the animations used in the real homepage
const FadeIn: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => (
  <div className={`opacity-100 ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const SlideUp: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => (
  <div className={`opacity-100 ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const SlideInLeft: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => (
  <div className="opacity-100" style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const SlideInRight: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => (
  <div className="opacity-100" style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => (
  <div className="opacity-100" style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

export default function BanburyEarthMockupPage() {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <Helmet>
        <title>Progress Accountants - Banbury Earth Theme Mockup</title>
        <meta name="description" content="This is a non-production mockup for theme exploration" />
      </Helmet>

      {/* Navigation Placeholder - just for mockup */}
      <header className="py-4 px-6 md:px-12 shadow-sm" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold" style={{ color: colors.text }}>
              LOGO PLACEHOLDER
            </p>
            <p className="text-xs italic">
              (Progress Accountants - Banbury Earth Theme)
            </p>
          </div>
          <nav className="hidden md:flex space-x-8">
            {['Home', 'Services', 'About', 'Industries', 'Resources', 'Contact'].map((item) => (
              <button 
                key={item} 
                className="font-medium hover:underline transition-all" 
                style={{ color: colors.text }}
              >
                {item}
              </button>
            ))}
          </nav>
          <Button 
            className="hidden md:flex"
            style={{ backgroundColor: colors.ctaButton, color: 'white' }}
          >
            Client Portal
          </Button>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={colors.text} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section - Mirroring the real homepage but with Banbury Earth colors */}
      <section 
        className="text-white min-h-[90vh] relative flex items-center py-16 overflow-hidden"
        style={{ backgroundColor: colors.sectionBg }}
      >
        {/* Clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b z-0" style={{ 
          backgroundImage: `linear-gradient(to bottom, ${colors.sectionBg}, ${colors.background})` 
        }}></div>
        
        <div className="container mx-auto px-6 md:px-8 z-10 relative">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
            {/* Left content - Text content */}
            <div className="md:w-1/2 md:pr-8 text-center md:text-left">
              <span className="text-sm font-medium tracking-wide inline-block mb-4" style={{ color: colors.ctaButton }}>
                Premium Financial Advisory
              </span>
              
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                <span style={{ color: colors.text }}>Progress Accountants</span>
                <span className="block mt-3" style={{ color: colors.ctaButton }}>
                  Forward-thinking accounting for modern businesses
                </span>
              </h1>
              
              <p className="text-lg md:text-xl mb-8 max-w-xl leading-relaxed" style={{ color: colors.text, opacity: 0.9 }}>
                Unlock your business potential with tailored financial strategies that drive growth and optimize tax efficiency.
              </p>
              
              <div className="mb-8">
                <ul className="list-none space-y-3 max-w-lg">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: colors.ctaButton }}>
                      <span className="text-white text-xs">✓</span>
                    </span> 
                    <span style={{ color: colors.text }}>Trusted financial partner for growing businesses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: colors.ctaButton }}>
                      <span className="text-white text-xs">✓</span>
                    </span> 
                    <span style={{ color: colors.text }}>Personalized advice tailored to your goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full mr-3 shrink-0" style={{ backgroundColor: colors.ctaButton }}>
                      <span className="text-white text-xs">✓</span>
                    </span> 
                    <span style={{ color: colors.text }}>Comprehensive financial and tax solutions</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a href="#book-call">
                  <Button 
                    size="lg" 
                    className="px-6 py-3 rounded-full text-white"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    <span className="font-medium flex items-center">
                      Book Your Free Strategy Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </a>
                
                <Button 
                  variant="ghost" 
                  className="px-6 py-3 rounded-full border border-opacity-20 hover:bg-opacity-10"
                  style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
                >
                  <span>Explore Our Services</span>
                  <span className="ml-2" style={{ color: colors.ctaButton }}>→</span>
                </Button>
              </div>
            </div>
            
            {/* Right content - Team image */}
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500">
                  <div 
                    className="w-full h-[450px] bg-cover bg-center" 
                    style={{ 
                      backgroundImage: "url('https://placehold.co/800x450/F1E6DD/A85D3D?text=Team+Photo')",
                      backgroundColor: colors.accent
                    }}
                  ></div>
                  
                  {/* Simple badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full shadow-md" style={{ backgroundColor: colors.ctaButton }}>
                    <p className="text-xs font-semibold text-white">
                      UK Certified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <p className="text-sm mb-2" style={{ color: colors.text, opacity: 0.7 }}>Scroll to explore</p>
            <ChevronDown className="w-6 h-6 animate-bounce" style={{ color: colors.text, opacity: 0.7 }} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6" id="services">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              Our Services
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.8 }}>
              Professional accounting services designed to support your business at every stage of growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { 
                icon: <Calculator size={24} />, 
                title: 'Accounting & Bookkeeping',
                description: 'Accurate financial records and expert bookkeeping to keep your business compliant and informed.'
              },
              { 
                icon: <FileText size={24} />, 
                title: 'Tax Planning & Compliance',
                description: 'Strategic tax planning to minimize liabilities while ensuring full compliance with regulations.'
              },
              { 
                icon: <BarChart3 size={24} />, 
                title: 'Business Advisory',
                description: 'Strategic guidance to help you make informed decisions and achieve your business objectives.'
              },
              { 
                icon: <Landmark size={24} />, 
                title: 'Audit & Assurance',
                description: 'Comprehensive audit services delivering the assurance stakeholders need.'
              },
              { 
                icon: <Cloud size={24} />, 
                title: 'Cloud Accounting',
                description: 'Modern, accessible financial management with leading cloud accounting solutions.'
              },
              { 
                icon: <Clock size={24} />, 
                title: 'CFO Services',
                description: 'Expert financial leadership without the full-time executive cost.'
              }
            ].map((service, index) => (
              <Card 
                key={index} 
                className="p-6 flex flex-col h-full hover:shadow-md transition-all"
                style={{ backgroundColor: 'white', borderColor: colors.accent }}
              >
                <CardContent className="p-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <div style={{ color: colors.ctaButton }}>{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>
                    {service.title}
                  </h3>
                  <p className="mb-6" style={{ color: colors.text, opacity: 0.7 }}>
                    {service.description}
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center font-medium mt-auto"
                    style={{ color: colors.ctaButton }}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              className="px-6 py-3 rounded-md text-white"
              style={{ backgroundColor: colors.ctaButton }}
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Industries Section */}
      <section className="py-16 px-6" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              Industries We Serve
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.8 }}>
              Specialized expertise for the unique challenges of your industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Technology & SaaS', 
              'Healthcare & Medical Practices', 
              'Professional Services',
              'Real Estate & Construction', 
              'Manufacturing & Distribution', 
              'Creative & Digital Agencies'
            ].map((industry, index) => (
              <div 
                key={index} 
                className="p-8 rounded-lg text-center hover:shadow-lg transition-shadow"
                style={{ backgroundColor: colors.sectionBg }}
              >
                <h3 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
                  {industry}
                </h3>
                <a 
                  href="#" 
                  className="inline-flex items-center font-medium"
                  style={{ color: colors.ctaButton }}
                >
                  Industry Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* SME Support Hub Section */}
      <section className="py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundColor: colors.sectionBg,
            opacity: 0.9
          }} 
        />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2" style={{ color: colors.text }}>
              <SlideInLeft delay={0.2}>
                <h2 className="text-3xl font-bold mb-4">
                  SME Support Hub
                </h2>
                <p className="text-xl mb-4">
                  Everything UK small businesses need in one place—contacts, deadlines, and downloadable resources.
                </p>
              </SlideInLeft>
              
              <ul className="space-y-2 mb-6">
                {/* Animated list items with staggered delay */}
                <SlideUp className="flex items-center" delay={0.3}>
                  <span style={{ color: colors.ctaButton }} className="mr-2">✓</span> Essential HMRC & Companies House contact details
                </SlideUp>
                <SlideUp className="flex items-center" delay={0.4}>
                  <span style={{ color: colors.ctaButton }} className="mr-2">✓</span> Key tax filing deadlines
                </SlideUp>
                <SlideUp className="flex items-center" delay={0.5}>
                  <span style={{ color: colors.ctaButton }} className="mr-2">✓</span> Downloadable PDF resources
                </SlideUp>
                <SlideUp className="flex items-center" delay={0.6}>
                  <span style={{ color: colors.ctaButton }} className="mr-2">✓</span> Regularly updated information
                </SlideUp>
              </ul>
              
              <FadeIn>
                <Button className="px-6 py-3 text-white rounded-md hover:-translate-y-1 transition-all duration-300"
                  style={{ backgroundColor: colors.ctaButton }}>
                  Access SME Support Hub
                </Button>
              </FadeIn>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <SlideInRight delay={0.4}>
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full hover:shadow-xl transition-shadow duration-300">
                  <ScaleIn delay={0.6}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Available Resources</h3>
                  </ScaleIn>
                  
                  <ul className="space-y-4">
                    <SlideUp className="flex items-start" delay={0.7}>
                      <div className="p-2 rounded-full mr-4" style={{ backgroundColor: colors.accent }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={colors.ctaButton}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium" style={{ color: colors.text }}>SME Contacts Directory</h4>
                        <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>All important UK business support contacts in one PDF.</p>
                      </div>
                    </SlideUp>
                    
                    <SlideUp className="flex items-start" delay={0.8}>
                      <div className="p-2 rounded-full mr-4" style={{ backgroundColor: colors.accent }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={colors.ctaButton}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium" style={{ color: colors.text }}>Key Business Deadlines</h4>
                        <p className="text-sm" style={{ color: colors.text, opacity: 0.6 }}>All tax and reporting deadlines for 2025 in a printable format.</p>
                      </div>
                    </SlideUp>
                  </ul>
                </div>
              </SlideInRight>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Us Section */}
      <section className="py-16 px-6" id="why-us">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              Why Choose Us
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.8 }}>
              Our commitment to excellence is reflected in everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Expertise & Experience',
                description: 'Our team brings decades of specialized industry experience to every client relationship.'
              },
              {
                title: 'Personalized Service',
                description: 'We take the time to understand your business and provide tailored solutions.'
              },
              {
                title: 'Technology-Driven',
                description: 'Leveraging cutting-edge financial technology to enhance efficiency and insight.'
              },
              {
                title: 'Fixed Fee Pricing',
                description: 'Transparent pricing with no surprises, allowing you to budget with confidence.'
              }
            ].map((point, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-lg transition-all border"
                style={{ 
                  backgroundColor: index % 2 === 0 ? 'white' : colors.sectionBg,
                  borderColor: colors.accent 
                }}
              >
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <span className="text-xl font-bold" style={{ color: colors.ctaButton }}>{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>
                    {point.title}
                  </h3>
                  <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Studio Highlight Section */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <SlideInLeft delay={0.2}>
                <div className="relative overflow-hidden rounded-lg shadow-2xl">
                  <div 
                    className="w-full h-[350px] bg-cover bg-center" 
                    style={{ 
                      backgroundImage: "url('https://placehold.co/800x450/F1E6DD/A85D3D?text=Podcast+Studio')",
                      backgroundColor: colors.accent
                    }}
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t opacity-70"></div>
                </div>
              </SlideInLeft>
            </div>
            
            <div className="md:w-1/2" style={{ color: colors.text }}>
              <SlideInRight delay={0.3}>
                <ScaleIn delay={0.4}>
                  <h2 className="text-3xl font-bold mb-4">
                    🎙️ Podcast & Video Studio
                  </h2>
                </ScaleIn>
                
                <p className="text-xl mb-4">
                  Purpose-built for businesses that want to sound and look professional without metropolitan prices.
                </p>
                
                <ul className="space-y-2 mb-6">
                  <SlideUp className="flex items-center" delay={0.5}>
                    <span className="mr-2" style={{ color: colors.ctaButton }}>✓</span> Professional DSLR cameras
                  </SlideUp>
                  <SlideUp className="flex items-center" delay={0.6}>
                    <span className="mr-2" style={{ color: colors.ctaButton }}>✓</span> Broadcast-quality microphones
                  </SlideUp>
                  <SlideUp className="flex items-center" delay={0.7}>
                    <span className="mr-2" style={{ color: colors.ctaButton }}>✓</span> Acoustically treated space
                  </SlideUp>
                  <SlideUp className="flex items-center" delay={0.8}>
                    <span className="mr-2" style={{ color: colors.ctaButton }}>✓</span> On-site technical support
                  </SlideUp>
                </ul>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="px-6 py-3 text-white rounded-md hover:-translate-y-1 transition-all duration-300"
                    style={{ backgroundColor: colors.ctaButton }}
                  >
                    View Studio Details
                  </Button>
                  <Button 
                    className="px-6 py-3 rounded-md hover:shadow-md transition-all duration-300"
                    variant="outline"
                    style={{ color: colors.ctaButton, borderColor: colors.ctaButton }}
                  >
                    Book Studio Time
                  </Button>
                </div>
              </SlideInRight>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16" id="contact" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <ScaleIn delay={0.1}>
                <h2 className="text-3xl font-bold mb-3" style={{ color: colors.text }}>
                  Looking for a proactive accountant in United Kingdom?
                </h2>
              </ScaleIn>
              <SlideUp delay={0.3}>
                <p className="max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.7 }}>
                  We're based in Oxford, Banbury, and London, and proudly serve ambitious businesses across the United Kingdom and beyond.
                  Ready to take your accounting to the next level? Let's talk about how we can help your business flourish.
                </p>
              </SlideUp>
            </div>
            
            {/* Contact Form Section */}
            <div className="mb-14">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6 border-b pb-6" style={{ borderColor: colors.accent }}>
                  <h3 className="text-xl font-semibold" style={{ color: colors.text }}>Get in Touch</h3>
                  
                  <div className="flex space-x-4">
                    <a href="mailto:info@progressaccountants.com" style={{ color: colors.text, opacity: 0.5 }} className="hover:opacity-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                    <a href="tel:01865921150" style={{ color: colors.text, opacity: 0.5 }} className="hover:opacity-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="p-5 rounded-lg border h-full" style={{ backgroundColor: colors.background, borderColor: colors.accent }}>
                      <div className="flex items-start mb-6">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0" style={{ backgroundColor: colors.accent }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={colors.ctaButton}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2" style={{ color: colors.text }}>Business Hours</h3>
                          <div className="space-y-1.5" style={{ color: colors.text, opacity: 0.7 }}>
                            <p className="flex justify-between">
                              <span>Monday - Friday:</span>
                              <span className="font-medium">9:00 AM - 5:30 PM</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Saturday - Sunday:</span>
                              <span className="font-medium">Closed</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0" style={{ backgroundColor: colors.accent }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={colors.ctaButton}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2" style={{ color: colors.text }}>Contact Details</h3>
                          <div className="space-y-1.5" style={{ color: colors.text, opacity: 0.7 }}>
                            <p className="flex items-center">
                              <span className="font-medium mr-2">Email:</span>
                              <a href="mailto:info@progressaccountants.com" className="hover:underline transition-colors"
                                 style={{ color: colors.ctaButton }}>
                                info@progressaccountants.com
                              </a>
                            </p>
                            <p>
                              <span className="font-medium mr-2">General Enquiries:</span>
                              <a href="tel:01865921150" className="hover:underline transition-colors"
                                 style={{ color: colors.ctaButton }}>
                                01865 921 150
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    {/* Contact Form Placeholder */}
                    <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center" 
                         style={{ borderColor: colors.accent, minHeight: '300px' }}>
                      <p className="text-center mb-4" style={{ color: colors.text }}>
                        Contact form would be here in the actual implementation
                      </p>
                      <Button
                        className="px-6 py-3 text-white rounded-md"
                        style={{ backgroundColor: colors.ctaButton }}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Office Locations Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {/* Oxford Office */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Oxford Office</h3>
                  <address className="not-italic" style={{ color: colors.text, opacity: 0.7 }}>
                    Oxford Centre for Innovation<br />
                    New Road<br />
                    Oxford, OX1 1BY
                  </address>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm font-medium"
                  style={{ color: colors.ctaButton }}
                >
                  View on Map
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
              
              {/* London Office */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>London Office</h3>
                  <address className="not-italic" style={{ color: colors.text, opacity: 0.7 }}>
                    5 Chancery Lane<br />
                    London<br />
                    WC2A 1LG
                  </address>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm font-medium"
                  style={{ color: colors.ctaButton }}
                >
                  View on Map
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
              
              {/* Banbury Office */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Banbury Office</h3>
                  <address className="not-italic" style={{ color: colors.text, opacity: 0.7 }}>
                    Cherwell Innovation Centre<br />
                    77 Heyford Park<br />
                    Upper Heyford, OX25 5HD
                  </address>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm font-medium"
                  style={{ color: colors.ctaButton }}
                >
                  View on Map
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>Progress Accountants</h3>
              <p className="mb-4" style={{ color: colors.text, opacity: 0.8 }}>
                Expert accounting services that help your business thrive.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'linkedin', 'instagram'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent, color: colors.ctaButton }}
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Services</h3>
              <ul className="space-y-2">
                {['Tax Planning', 'Bookkeeping', 'Business Advisory', 'Audit & Assurance', 'Payroll'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline" style={{ color: colors.text, opacity: 0.8 }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Industries</h3>
              <ul className="space-y-2">
                {['Real Estate', 'Healthcare', 'Technology', 'Retail', 'Manufacturing'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline" style={{ color: colors.text, opacity: 0.8 }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Contact</h3>
              <ul className="space-y-2">
                <li style={{ color: colors.text, opacity: 0.8 }}>Oxford Centre for Innovation</li>
                <li style={{ color: colors.text, opacity: 0.8 }}>Oxford, UK</li>
                <li style={{ color: colors.text, opacity: 0.8 }}>info@progressaccountants.com</li>
                <li style={{ color: colors.text, opacity: 0.8 }}>01865 921 150</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t" style={{ borderColor: colors.accent }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p style={{ color: colors.text, opacity: 0.7 }}>
                © {new Date().getFullYear()} Progress Accountants. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['Privacy Policy', 'Terms of Service', 'Cookies Policy'].map((item) => (
                  <a key={item} href="#" className="text-sm hover:underline" style={{ color: colors.text, opacity: 0.7 }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 w-full bg-black text-white text-center p-2 z-50">
        <p className="text-sm">
          <strong>NON-PRODUCTION MOCKUP:</strong> Banbury Earth Theme - For visualization purposes only
        </p>
      </div>
    </div>
  );
}