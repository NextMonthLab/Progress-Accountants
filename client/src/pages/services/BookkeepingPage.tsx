import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { BookOpen, ArrowLeft, Phone, Mail, Calendar, CheckCircle, Clock, Shield, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openCalendlyPopup } from '@/utils/calendly';
import { FadeIn } from '@/components/ui/ScrollAnimation';

export default function BookkeepingPage() {
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
        <title>Bookkeeping | Progress Accountants</title>
        <meta name="description" content="Stay organised and up to date with clear, reliable bookkeeping that keeps your business running smoothly." />
      </Helmet>

      {/* Gold Standard Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Cinematic Full-Width Background with Smart Focal Points */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop/Tablet Background - Adjusted for Head Visibility */}
          <div 
            className="absolute inset-0 w-full h-full hidden sm:block"
            style={{
              backgroundImage: `url(https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050579/Screenshot_2025-06-04_at_16.22.23_sisfjv.png)`,
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
              backgroundImage: `url(https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050579/Screenshot_2025-06-04_at_16.22.23_sisfjv.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Dark Overlay for Text Legibility - Gold Standard: 20-50% Opacity */}
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
                <span className="block">Bookkeeping.</span>
                <span className="block">Business Ready.</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Clear, reliable bookkeeping that keeps your business running smoothly and organized.
              </p>
            </FadeIn>

            {/* Gold Standard CTA - Large, centered, outcome-driven */}
            <FadeIn delay={0.3}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                onClick={() => openCalendlyPopup()}
              >
                Book My Strategy Call
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Original content continues below */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-pink-400 transition-colors duration-300 mb-6 no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
            
            <div className="flex items-center mb-6">
              <BookOpen className="h-12 w-12 text-pink-400 mr-4" />
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-white">Professional Bookkeeping</span>
              </h2>
            </div>
            
            <p className="text-lg text-gray-200 mb-8">
              Stay organized and up to date with clear, reliable bookkeeping that keeps your business running smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">What's Included</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Monthly management accounts and reconciliations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Invoice processing and supplier payments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Cloud-based systems for real-time access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Expense tracking and categorization</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Timely</h4>
                    <p className="text-gray-400 text-xs">Regular updates</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Accurate</h4>
                    <p className="text-gray-400 text-xs">Error-free records</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Supportive</h4>
                    <p className="text-gray-400 text-xs">Always available</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Insightful</h4>
                    <p className="text-gray-400 text-xs">Clear reporting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Daily Operations</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Sales invoice creation and tracking</li>
                  <li>• Purchase invoice processing</li>
                  <li>• Bank reconciliations</li>
                  <li>• Expense categorization</li>
                  <li>• Cash flow monitoring</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Reporting</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Profit & loss statements</li>
                  <li>• Balance sheet preparation</li>
                  <li>• Management accounts</li>
                  <li>• VAT return preparation</li>
                  <li>• Budget vs actual analysis</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Technology & Access</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Cloud accounting setup (Xero/QuickBooks)</li>
                  <li>• Real-time financial dashboards</li>
                  <li>• Mobile app access</li>
                  <li>• Automated bank feeds</li>
                  <li>• Document storage system</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Support & Training</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Monthly review meetings</li>
                  <li>• Software training sessions</li>
                  <li>• Unlimited phone support</li>
                  <li>• Process documentation</li>
                  <li>• Best practice guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-pink-600 to-purple-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Organized?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let us handle your bookkeeping so you can focus on growing your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 01295 477 250
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