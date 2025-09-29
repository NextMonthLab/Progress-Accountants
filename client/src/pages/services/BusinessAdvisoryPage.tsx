import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { BarChart4, ArrowLeft, Phone, Mail, Calendar, CheckCircle, TrendingUp, Target, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/ScrollAnimation';

export default function BusinessAdvisoryPage() {
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
        <title>Business Advisory | Progress Accountants</title>
        <meta name="description" content="Strategic Business Advisory for Growing Companies. Real insight, actionable advice, and strategic leadership." />
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
                <span className="block">Get Strategic Guidance</span>
                <span className="block">Without the Corporate Price Tag</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Access Virtual Finance Director expertise that guides your growth decisions—without the £150k+ salary.
              </p>
            </FadeIn>

            {/* Gold Standard Universal Button - Rob Hutt Design System */}
            <FadeIn delay={0.3}>
              <button
                className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
                style={{ 
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                  minHeight: '56px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
                }}
                onClick={() => window.open('https://calendly.com/progressaccountants/discovery-call', '_blank')}
                aria-label="Book a strategy consultation for business advisory services"
              >
                Book My Strategy Call
              </button>
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
              <BarChart4 className="h-12 w-12 text-blue-400 mr-4" />
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="text-white">The Growth Problem Every Ambitious Business Faces</span>
              </h2>
            </div>
            
            <p className="text-lg text-gray-200 mb-6">
              You know your business inside out, but when it comes to strategic financial decisions—expansion, investment, pricing strategy—you're making crucial choices without the strategic insight that larger companies take for granted.
            </p>
            
            <p className="text-lg text-gray-200 mb-8">
              The result? Missed opportunities, cash flow surprises, and the nagging feeling that you could be growing faster if you just knew what the numbers were really telling you.
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
                <h3 className="text-2xl font-bold text-white mb-6">How We Give You Strategic Confidence</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300"><strong>See opportunities clearly:</strong> Strategic planning sessions that reveal growth potential</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300"><strong>Make confident decisions:</strong> On-demand financial leadership when you need it</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300"><strong>Avoid costly mistakes:</strong> Expert guidance that prevents expensive missteps</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300"><strong>Access senior expertise:</strong> Board-level insight without the executive salary</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Why Choose Progress for Advisory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Strategic</h4>
                    <p className="text-gray-400 text-xs">Long-term focus</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Targeted</h4>
                    <p className="text-gray-400 text-xs">Results-driven</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Collaborative</h4>
                    <p className="text-gray-400 text-xs">Partnership approach</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Innovative</h4>
                    <p className="text-gray-400 text-xs">Forward-thinking</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
              <p className="text-white text-xl font-semibold">
                🏆 Finally—strategic financial leadership that doesn't require hiring a £150k+ Finance Director.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-500">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop Making Critical Decisions in the Dark</h2>
            <p className="text-xl mb-8 opacity-90">
              Get our free Growth Strategy Session and discover the opportunities hiding in your business. 
              Strategic insight that drives results—without the corporate overheads.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/contact" className="inline-block">
                <button
                  className="relative inline-flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-white/20 border-0"
                  style={{ 
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                    minHeight: '56px',
                    borderRadius: '9999px',
                    background: '#FFFFFF',
                    color: '#1E40AF',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                  aria-label="Call Progress Accountants"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 01295 477 250
                </button>
              </Link>
              <Link href="/contact" className="inline-block">
                <button
                  className="relative inline-flex items-center justify-center font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-white/20"
                  style={{ 
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                    minHeight: '56px',
                    borderRadius: '9999px',
                    background: 'transparent',
                    border: '2px solid #FFFFFF',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#1E40AF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  aria-label="Email Progress Accountants"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}