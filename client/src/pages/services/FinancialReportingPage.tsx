import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { FileSpreadsheet, ArrowLeft, Phone, Mail, Calendar, CheckCircle, BarChart, Eye, Clock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/ScrollAnimation';

export default function FinancialReportingPage() {
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
        <title>Financial Reporting | Progress Accountants</title>
        <meta name="description" content="Clear Financial Reporting for Growing Businesses. Turn financial data into clarity with timely, plain-English reports that support better decision-making." />
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
                <span className="block">Financial Reporting.</span>
                <span className="block">Decision Ready.</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Turn financial data into clarity with timely reports that empower better business decisions.
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
              <FileSpreadsheet className="h-12 w-12 text-pink-400 mr-4" />
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-white">Clear Financial Reporting</span>
              </h2>
            </div>
            
            <p className="text-lg text-gray-200 mb-6">
              Understand your numbers. Empower your decisions.
            </p>
            
            <p className="text-lg text-gray-200 mb-8">
              Turn financial data into clarity—with timely, plain-English reports that support better decision-making.
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
                    <span className="text-gray-300">Monthly & quarterly management reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">KPI dashboards tailored to your sector</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">VAT, CIS & sector-specific reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Real-time financial insights with Xero & QuickBooks integrations</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Clear</h4>
                    <p className="text-gray-400 text-xs">Easy to understand</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Timely</h4>
                    <p className="text-gray-400 text-xs">When you need it</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Insightful</h4>
                    <p className="text-gray-400 text-xs">Actionable data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Accurate</h4>
                    <p className="text-gray-400 text-xs">Reliable numbers</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-center">
              <p className="text-white text-xl font-semibold">
                👉 Know where you stand. See where you're going.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-pink-600 to-purple-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Clear Insights?</h2>
            <p className="text-xl mb-8 opacity-90">
              Transform your financial data into actionable insights that drive better business decisions.
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