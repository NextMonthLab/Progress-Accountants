import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { DollarSign, ArrowLeft, Phone, Mail, Calendar, CheckCircle, TrendingUp, Target, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openCalendlyPopup } from '@/utils/calendly';

export default function VirtualFinanceDirectorPage() {
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
        <title>Virtual Finance Director (VFD) Services | Progress Accountants</title>
        <meta name="description" content="Virtual Finance Director (VFD) Services in Banbury & Oxford. On-demand access to senior financial leadership from Progress Accountants." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050579/Screenshot_2025-06-04_at_16.22.23_sisfjv.png"
            alt="Virtual Finance Director services background"
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
              <DollarSign className="h-12 w-12 text-pink-400 mr-4" />
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="text-white">📅 Virtual Finance </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">Director</span>
              </h1>
            </div>
            
            <h2 className="text-2xl text-gray-100 mb-4 font-semibold">
              Virtual Finance Director (VFD) Services — Banbury & Oxford
            </h2>
            
            <p className="text-lg text-gray-200 mb-6">
              Not every business can afford a full-time Finance Director—but every growing business needs one.
            </p>
            
            <p className="text-lg text-gray-200 mb-8">
              Our VFD services give Banbury & Oxford businesses on-demand access to senior financial leadership—helping you plan, grow, and stay accountable.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={openCalendlyPopup}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
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

      {/* Key Benefits */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">What We Provide</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Strategic financial planning & forecasting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Cash flow & working capital management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Board reporting & stakeholder communications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Funding support & investment readiness</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Strategic</h4>
                    <p className="text-gray-400 text-xs">Executive-level thinking</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Focused</h4>
                    <p className="text-gray-400 text-xs">Results-oriented</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Accessible</h4>
                    <p className="text-gray-400 text-xs">When you need us</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Expert</h4>
                    <p className="text-gray-400 text-xs">Senior experience</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-center">
              <p className="text-white text-xl font-semibold">
                👉 Get the expertise—without the overhead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-pink-600 to-purple-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Senior Financial Leadership?</h2>
            <p className="text-xl mb-8 opacity-90">
              Access executive-level financial expertise when you need it, without the full-time commitment.
              Contact us today to discuss your VFD needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 01295 205040
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-pink-600">
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