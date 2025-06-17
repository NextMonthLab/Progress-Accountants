import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Briefcase, ArrowLeft, Phone, Mail, Calendar, CheckCircle, Building2, Film, Music, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openCalendlyPopup } from '@/utils/calendly';

export default function IndustrySpecificPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-6 md:px-8 py-16">
          <div className="h-8 w-64 bg-gray-800 animate-pulse rounded-md mb-8"></div>
          <div className="h-12 w-full bg-gray-800 animate-pulse rounded-md mb-4"></div>
          <div className="h-4 w-full bg-gray-800 animate-pulse rounded-md mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-800 animate-pulse rounded-md mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Helmet>
        <title>Industry-Specific Accounting | Progress Accountants</title>
        <meta name="description" content="Specialist Accounting for Construction, Film, Music & Property in Banbury & Oxford. Tailored accounting and tax support from Progress Accountants." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050579/Screenshot_2025-06-04_at_16.22.23_sisfjv.png"
            alt="Industry-specific accounting services background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-pink-400 transition-colors duration-300 mb-6 no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
            
            <div className="flex items-center mb-6">
              <Briefcase className="h-12 w-12 text-blue-400 mr-4" />
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="text-white">🎬 Industry-Specific </span>
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Accounting</span>
              </h1>
            </div>
            
            <h2 className="text-2xl text-gray-100 mb-4 font-semibold">
              Specialist Accounting for Construction, Film, Music & Property — Banbury & Oxford
            </h2>
            
            <p className="text-lg text-gray-200 mb-6">
              Every industry has its own financial challenges. We get it—and we help you stay ahead.
            </p>
            
            <p className="text-lg text-gray-200 mb-8">
              Progress Accountants provides tailored accounting and tax support for construction firms, film & TV companies, musicians, and property professionals across Banbury, Oxford, and beyond.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={openCalendlyPopup}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Phone className="h-4 w-4 mr-2" />
                Get Started Today
              </Button>
              <Button 
                onClick={openCalendlyPopup}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Specializations */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Industry Specializations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Building2 className="h-8 w-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Construction</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                    <span>CIS compliance, project-based cash flow, VAT on builds</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Film className="h-8 w-8 text-pink-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Film & TV</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-pink-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Tax relief claims, freelancer payments, cash flow management</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Music className="h-8 w-8 text-purple-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Music</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Royalty accounting, international tax, tour finance</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Home className="h-8 w-8 text-green-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Property</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Investment structuring, CGT planning, VAT & stamp duty optimisation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center mt-12">
              <p className="text-white text-xl font-semibold">
                👉 Work with accountants who understand your world—not just your numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Industry-Specific Expertise?</h2>
            <p className="text-xl mb-8 opacity-90">
              Work with accountants who understand the unique challenges of your industry.
              Contact us today for specialized support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 01295 205040
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}