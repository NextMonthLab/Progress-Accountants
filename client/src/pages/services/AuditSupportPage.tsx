import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { ClipboardCheck, ArrowLeft, Phone, Mail, Calendar, CheckCircle, Shield, FileCheck, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuditSupportPage() {
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
        <title>Audit Support | Progress Accountants</title>
        <meta name="description" content="Audit Support for Businesses in Banbury & Oxford. Prepare for statutory & voluntary audits with clarity and confidence from Progress Accountants." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050579/Screenshot_2025-06-04_at_16.22.23_sisfjv.png"
            alt="Audit support services background"
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
              <ClipboardCheck className="h-12 w-12 text-blue-400 mr-4" />
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="text-white">🔍 Audit </span>
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Support</span>
              </h1>
            </div>
            
            <h2 className="text-2xl text-gray-100 mb-4 font-semibold">
              Audit Support for Businesses in Banbury & Oxford
            </h2>
            
            <p className="text-lg text-gray-200 mb-6">
              Whether you need to comply with audit requirements or simply want peace of mind, we'll help you prepare with clarity and confidence.
            </p>
            
            <p className="text-lg text-gray-200 mb-8">
              Progress Accountants supports businesses across Banbury, Oxford, and surrounding areas with full-service audit readiness.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
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
                <h3 className="text-2xl font-bold text-white mb-6">What We Provide</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Preparation for statutory & voluntary audits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Pre-audit health checks & risk reviews</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Liaison with external auditors</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Post-audit advice & process improvement</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Prepared</h4>
                    <p className="text-gray-400 text-xs">Ready for review</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Thorough</h4>
                    <p className="text-gray-400 text-xs">Complete coverage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Supportive</h4>
                    <p className="text-gray-400 text-xs">Guided process</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Proactive</h4>
                    <p className="text-gray-400 text-xs">Risk management</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
              <p className="text-white text-xl font-semibold">
                👉 We take the stress out of audits—so you stay focused on what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Audit Confidence?</h2>
            <p className="text-xl mb-8 opacity-90">
              Take the stress out of audits with comprehensive preparation and professional support.
              Contact us today for peace of mind.
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