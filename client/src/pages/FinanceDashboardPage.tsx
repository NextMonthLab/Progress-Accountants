import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { NativeFinanceDashboardForm } from '@/components/forms/NativeFinanceDashboardForm';

export default function FinanceDashboardPage() {
  const { businessIdentity, isLoading } = useBusinessIdentity();
  const [showForm, setShowForm] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B3FE4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Finance Dashboard - {(businessIdentity as any)?.core?.businessName || 'Progress Accountants'}</title>
        <meta name="description" content="Access your personalized financial dashboard with real-time insights, reports, and analytics." />
      </Helmet>
      
      {/* Hero section with cinematic background */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-purple-900/20" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {showForm ? (
            <NativeFinanceDashboardForm 
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Dashboard Access Requested
                </h1>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Your request has been submitted successfully. Our team will contact you shortly to set up your personalized finance dashboard.
                </p>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-left mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    What happens next:
                  </h3>
                  <ul className="text-slate-300 space-y-3">
                    <li className="flex items-start">
                      <span className="text-[#7C3AED] font-bold mr-3">1.</span>
                      <span>Our team will review your requirements and contact you within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#7C3AED] font-bold mr-3">2.</span>
                      <span>We'll set up your personalized dashboard with your specific metrics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#7C3AED] font-bold mr-3">3.</span>
                      <span>You'll receive secure login credentials and a guided walkthrough</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#7C3AED] font-bold mr-3">4.</span>
                      <span>Start accessing real-time financial insights and reports</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
                  style={{ 
                    fontSize: 'clamp(16px, 2.5vw, 18px)',
                    padding: 'clamp(14px, 2.5vw, 16px) clamp(28px, 5vw, 40px)',
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
                  Submit Another Request
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}