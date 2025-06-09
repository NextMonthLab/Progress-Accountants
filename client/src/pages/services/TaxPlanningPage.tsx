import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Calculator, ArrowLeft, Phone, Mail, Calendar, CheckCircle, Target, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaxPlanningPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
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
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 h-64 animate-pulse rounded-lg"></div>
            <div className="bg-gray-800 h-64 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Helmet>
        <title>Tax Planning & Preparation | Progress Accountants</title>
        <meta name="description" content="Tax Planning & Preparation for Businesses in Banbury & Oxford. Minimise tax liabilities and plan ahead with strategic tax support tailored to your business." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050579/Screenshot_2025-06-04_at_16.22.23_sisfjv.png"
            alt="Tax planning services background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-pink-400 transition-colors duration-300 mb-6 no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
            
            <div className="flex items-center mb-6">
              <Calculator className="h-12 w-12 text-blue-400 mr-4" />
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="text-white">📊 Tax Planning & </span>
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Preparation</span>
              </h1>
            </div>
            
            <h2 className="text-2xl text-gray-100 mb-4 font-semibold">
              Tax Planning & Preparation for Businesses in Banbury & Oxford
            </h2>
            
            <p className="text-lg text-gray-200 mb-6">
              Running a business is challenging enough—you shouldn't have to worry about surprise tax bills.
            </p>
            
            <p className="text-lg text-gray-200 mb-8">
              We help businesses in Banbury, Oxford, and beyond minimise tax liabilities and plan ahead with proactive, strategic advice. Whether you're a growing construction firm, a creative agency, a property investor or a local SME, we'll tailor your tax strategy to your unique income streams and future goals.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600">
                  <Phone className="h-4 w-4 mr-2" />
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">What We Cover</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Income tax, corporation tax & VAT planning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Capital gains & inheritance tax advice</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Tax relief & incentive optimisation (R&D, Film Tax Relief, CIS, and more)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Year-round planning—not just year-end fire-fighting</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Strategic</h4>
                    <p className="text-gray-400 text-xs">Long-term planning</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Proactive</h4>
                    <p className="text-gray-400 text-xs">Year-round support</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Personal</h4>
                    <p className="text-gray-400 text-xs">Tailored approach</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Compliant</h4>
                    <p className="text-gray-400 text-xs">Always up to date</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-pink-600 rounded-lg p-8 text-center">
              <p className="text-white text-xl font-semibold">
                👉 With Progress, tax isn't an afterthought—it's part of your growth strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-pink-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Optimize Your Tax Strategy?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let our experienced team help you minimize tax liabilities and plan for the future. 
              Contact us today for a consultation.
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