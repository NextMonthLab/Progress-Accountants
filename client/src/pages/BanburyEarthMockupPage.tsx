import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Briefcase, 
  Calculator, 
  Calendar, 
  FileCheck, 
  Shield,
  Clock,
  PhoneCall,
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

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-6 flex items-center justify-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: colors.text }}>
              Accounting that moves your business forward
            </h1>
            <p className="text-lg mb-8 max-w-lg" style={{ color: colors.text, opacity: 0.9 }}>
              We provide expert accounting services tailored to your business needs, 
              allowing you to focus on growth while we handle the numbers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="text-white px-8 py-6 font-medium text-base"
                style={{ backgroundColor: colors.ctaButton }}
              >
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-6 font-medium text-base border-2"
                style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
              >
                Our Services
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div 
                className="w-80 h-80 md:w-96 md:h-96 rounded-full" 
                style={{ backgroundColor: colors.accent }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-72 h-72 md:w-80 md:h-80 rounded-2xl bg-gray-300 shadow-lg"
                  style={{ backgroundColor: colors.sectionBg }}
                >
                  <div className="h-full w-full flex items-center justify-center text-center p-6">
                    <p className="text-lg font-medium italic">Image Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 px-6" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto">
          <h2 className="text-center text-xl font-medium mb-10" style={{ color: colors.text }}>
            Trusted by businesses across industries
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="w-24 h-10 bg-white/30 rounded flex items-center justify-center"
                style={{ color: colors.text }}
              >
                <p className="text-sm font-medium">LOGO {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              Our Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text, opacity: 0.9 }}>
              Comprehensive accounting services tailored to meet your specific business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FileCheck size={24} />, title: 'Tax Planning' },
              { icon: <Calculator size={24} />, title: 'Bookkeeping' },
              { icon: <Briefcase size={24} />, title: 'Business Advisory' },
              { icon: <Shield size={24} />, title: 'Audit & Assurance' },
              { icon: <Calendar size={24} />, title: 'Payroll Services' },
              { icon: <Clock size={24} />, title: 'CFO Services' }
            ].map((service, index) => (
              <Card 
                key={index} 
                className="p-6 flex flex-col h-full hover:shadow-md transition-all border-0"
                style={{ backgroundColor: 'white' }}
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
                  <p className="mb-4" style={{ color: colors.text, opacity: 0.9 }}>
                    Our expert team provides tailored {service.title.toLowerCase()} solutions 
                    to help your business thrive and meet compliance requirements.
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.sectionBg }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              What Our Clients Say
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text, opacity: 0.9 }}>
              We've helped hundreds of businesses achieve their financial goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={colors.accent} color={colors.accent} />
                    ))}
                  </div>
                  <p className="mb-6 italic" style={{ color: colors.text, opacity: 0.9 }}>
                    "Progress Accountants has transformed our financial operations. Their expertise and
                    personalized approach have been invaluable to our business growth."
                  </p>
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full mr-4"
                      style={{ backgroundColor: colors.accent }}
                    ></div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.text }}>Client Name</p>
                      <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>Company Position</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div 
          className="container mx-auto rounded-2xl p-12"
          style={{ backgroundColor: colors.sectionBg }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.text }}>
              Ready to transform your business finances?
            </h2>
            <p className="text-lg mb-8" style={{ color: colors.text, opacity: 0.9 }}>
              Book a consultation with our experts and discover how we can help
              your business achieve its financial goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="text-white px-8 py-6 font-medium text-base"
                style={{ backgroundColor: colors.ctaButton }}
              >
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-6 font-medium text-base border-2"
                style={{ borderColor: colors.ctaButton, color: colors.ctaButton }}
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                Call Us Now
              </Button>
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
                <li style={{ color: colors.text, opacity: 0.8 }}>123 Business Avenue</li>
                <li style={{ color: colors.text, opacity: 0.8 }}>London, UK</li>
                <li style={{ color: colors.text, opacity: 0.8 }}>contact@progressaccountants.com</li>
                <li style={{ color: colors.text, opacity: 0.8 }}>+44 123 456 7890</li>
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