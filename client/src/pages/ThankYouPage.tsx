import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { CheckCircle, Home, Calendar, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/ScrollAnimation';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Thank You | Progress Accountants</title>
        <meta name="description" content="Thank you for contacting Progress Accountants. We'll be in touch within 24 hours." />
      </Helmet>

      {/* Thank You Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-full px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            
            <FadeIn delay={0.1}>
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full mb-6">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                <span className="block">Thank You!</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Message Received.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                We've received your message and will get back to you within 24 hours.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl p-6 md:p-8 mb-8 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-white mb-4">What Happens Next?</h2>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-medium">1</span>
                    </div>
                    <p className="text-gray-300">Our team will review your message and requirements</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-medium">2</span>
                    </div>
                    <p className="text-gray-300">A specialist will contact you within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-medium">3</span>
                    </div>
                    <p className="text-gray-300">We'll schedule a free consultation to discuss your needs</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </button>
                </Link>
                
                <span className="text-gray-500 hidden sm:block">or</span>
                
                <button 
                  onClick={() => {
                    window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'width=700,height=800,resizable=yes,scrollbars=yes');
                  }}
                  className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
                  style={{ 
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    padding: 'clamp(12px, 2vw, 16px) clamp(24px, 5vw, 32px)',
                    minHeight: '48px',
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
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Call Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="mt-12 pt-8 border-t border-slate-700">
                <p className="text-gray-400 text-sm">
                  Need immediate assistance? Call us at{' '}
                  <a href="tel:01295477250" className="text-purple-400 hover:text-purple-300 transition-colors">
                    01295 477 250
                  </a>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}