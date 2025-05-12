import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Download, 
  FileText, 
  Headphones,
  Mic,
  Music,
  PlayCircle, 
  Radio,
  Star,
  User
} from 'lucide-react';
import podcastStudioImage from '@assets/Podcast Studio.jpg';

// Banbury Earth Theme colors
const colors = {
  background: '#FDF8F4',
  ctaButton: '#A85D3D',
  text: '#3E2F2F',
  accent: '#FFD8A9',
  sectionBg: '#F1E6DD'
};

export default function BanburyEarthMusicMockupPage() {
  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }}>
      <Helmet>
        <title>Music Industry Accounting - Banbury Earth Theme Mockup</title>
        <meta name="description" content="This is a non-production mockup for theme exploration" />
      </Helmet>

      {/* Demo Banner */}
      <div className="fixed top-0 left-0 w-full bg-black text-white text-center p-2 z-50">
        <p className="text-sm">
          <strong>NON-PRODUCTION MOCKUP:</strong> Banbury Earth Theme - For visualization purposes only
        </p>
      </div>

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

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="inline-block px-3 py-1 mb-6 rounded-full" style={{ backgroundColor: colors.accent }}>
                <span className="text-sm font-medium flex items-center" style={{ color: colors.ctaButton }}>
                  <Music className="w-4 h-4 mr-2" />
                  Industry Expertise
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: colors.text }}>
                Accounting Services for the 
                <span className="block mt-2" style={{ color: colors.ctaButton }}>
                  Music Industry
                </span>
              </h1>
              
              <p className="text-lg mb-8 max-w-xl" style={{ color: colors.text, opacity: 0.9 }}>
                Specialized financial expertise for artists, labels, producers, and music businesses. We understand the unique challenges of the music industry, from royalties and touring to digital revenue and international taxation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="px-6 py-3 rounded-full text-white"
                  style={{ backgroundColor: colors.ctaButton }}
                >
                  <span className="font-medium flex items-center">
                    Book a Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="px-6 py-3 rounded-full border"
                  style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
                >
                  Download Music Industry Guide
                  <Download className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div 
                className="rounded-lg overflow-hidden shadow-xl relative aspect-[4/3]"
              >
                <img 
                  src={podcastStudioImage} 
                  alt="Progress Podcast & Music Studio" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 rounded-lg p-4 shadow-lg z-10 max-w-[260px]" style={{ backgroundColor: 'white' }}>
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                      <CheckCircle2 className="w-6 h-6" style={{ color: colors.ctaButton }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                      We've helped over 200 music professionals optimize their finances
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
              Financial Services for Music Professionals
            </h2>
            <p className="max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.8 }}>
              Specialized accounting services designed for the unique needs and challenges of the music industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Headphones />,
                title: "Royalty Accounting",
                description: "Track and verify royalty payments across multiple platforms and revenue streams"
              },
              {
                icon: <Mic />,
                title: "Tour Finance Management",
                description: "Comprehensive financial management for tours, including international tax considerations"
              },
              {
                icon: <FileText />,
                title: "Music Tax Specialization",
                description: "Expert handling of tax issues specific to music professionals and businesses"
              },
              {
                icon: <Radio />,
                title: "Label & Studio Accounting",
                description: "Dedicated accounting services for record labels and recording studios"
              },
              {
                icon: <User />,
                title: "Artist Financial Planning",
                description: "Personal financial planning and wealth management for artists"
              },
              {
                icon: <Calendar />,
                title: "Grant & Funding Assistance",
                description: "Help securing and managing grants, loans, and alternative funding sources"
              },
            ].map((service, index) => (
              <Card 
                key={index} 
                className="border hover:shadow-lg transition-all"
                style={{ backgroundColor: 'white', borderColor: colors.accent }}
              >
                <CardContent className="p-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <div style={{ color: colors.ctaButton }}>{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>
                    {service.title}
                  </h3>
                  <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>
                    {service.description}
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center font-medium"
                    style={{ color: colors.ctaButton }}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Client Testimonials Section */}
      <section className="py-16" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
              Trusted by Music Industry Professionals
            </h2>
            <p className="max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.8 }}>
              Hear what our clients from across the music industry have to say about working with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Progress Accountants transformed how I manage my royalty income. Their expertise in the music industry is invaluable.",
                name: "Sarah Johnson",
                role: "Independent Artist"
              },
              {
                quote: "They understand the unique challenges of running a recording studio. Their financial guidance has been critical to our growth.",
                name: "Mike Thomson",
                role: "Studio Owner"
              },
              {
                quote: "The team's knowledge of international touring taxes saved us thousands. I wouldn't trust anyone else with our label's finances.",
                name: "Lisa Chen",
                role: "Record Label Director"
              }
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="border hover:shadow-lg transition-all"
                style={{ backgroundColor: 'white', borderColor: colors.accent }}
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={colors.accent} color={colors.accent} />
                    ))}
                  </div>
                  <p className="mb-6 italic" style={{ color: colors.text, opacity: 0.85 }}>
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full mr-4"
                      style={{ backgroundColor: colors.accent }}
                    ></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>{testimonial.name}</p>
                      <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Case Study Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div 
                className="rounded-lg overflow-hidden shadow-xl relative aspect-video"
              >
                <div className="relative w-full h-full">
                  <img 
                    src={podcastStudioImage} 
                    alt="Music Studio Case Study" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-6">
                    <PlayCircle className="w-16 h-16 mb-4 text-white" />
                    <p className="text-center italic text-white font-medium">
                      Video Case Study: How we helped Sunrise Records optimize their financial operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="inline-block px-3 py-1 mb-6 rounded-full" style={{ backgroundColor: colors.accent }}>
                <span className="text-sm font-medium" style={{ color: colors.ctaButton }}>Case Study</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                How We Helped an Independent Label Increase Profitability by 35%
              </h2>
              
              <p className="mb-6" style={{ color: colors.text, opacity: 0.9 }}>
                When Sunrise Records came to us, they were struggling with complex royalty tracking and inefficient financial systems. Our team implemented specialized accounting solutions that resulted in:
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "35% increase in overall profitability",
                  "Streamlined royalty distribution system",
                  "Recovered $45,000 in overlooked revenue",
                  "Reduced tax liability through strategic planning"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: colors.ctaButton }} />
                    <span style={{ color: colors.text }}>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="px-6 py-3 rounded-md text-white"
                style={{ backgroundColor: colors.ctaButton }}
              >
                Read Full Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section className="py-16" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
              Music Industry Resources
            </h2>
            <p className="max-w-3xl mx-auto" style={{ color: colors.text, opacity: 0.8 }}>
              Free guides and resources to help music professionals manage their finances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Royalty Management Guide",
                description: "Essential strategies for tracking and maximizing your royalty revenue"
              },
              {
                title: "Tax Guide for Musicians",
                description: "Navigate the complex tax landscape for music professionals"
              },
              {
                title: "International Touring Finance",
                description: "Financial planning and tax considerations for international tours"
              }
            ].map((resource, index) => (
              <Card 
                key={index} 
                className="border hover:shadow-lg transition-all"
                style={{ backgroundColor: 'white', borderColor: colors.accent }}
              >
                <CardContent className="p-6">
                  <div 
                    className="mb-4 h-40 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <FileText className="h-12 w-12" style={{ color: colors.ctaButton }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>
                    {resource.title}
                  </h3>
                  <p className="mb-4" style={{ color: colors.text, opacity: 0.7 }}>
                    {resource.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-2"
                    style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
                  >
                    <Download className="h-4 w-4" />
                    Download Free Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-10">
          <div 
            className="rounded-xl p-10 shadow-lg relative overflow-hidden"
            style={{ backgroundColor: colors.sectionBg }}
          >
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
                Ready to take your music business to the next level?
              </h2>
              <p className="mb-8" style={{ color: colors.text, opacity: 0.9 }}>
                Our team of music industry financial experts is ready to help you optimize your finances, maximize your revenue, and focus on what you do best—creating music.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="px-8 py-3 rounded-full text-white"
                  style={{ backgroundColor: colors.ctaButton }}
                >
                  Book Your Free Consultation
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-3 rounded-full border-2"
                  style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
                >
                  View All Music Services
                </Button>
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
                Specialized accounting services for the music industry and creative professionals.
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
                {['Royalty Accounting', 'Tour Finance', 'Artist Tax Planning', 'Label Accounting', 'Grant Assistance'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline" style={{ color: colors.text, opacity: 0.8 }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Resources</h3>
              <ul className="space-y-2">
                {['Music Industry Guides', 'Tax Calendars', 'Royalty Calculator', 'Financial Templates', 'Blog'].map((item) => (
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
    </div>
  );
}