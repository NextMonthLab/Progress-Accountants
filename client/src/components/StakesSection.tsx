import { useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function StakesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const successOutcomes = [
    "Wake up knowing exactly where your business stands financially",
    "Make strategic decisions backed by real-time data, not guesswork",
    "Keep more of what you earn through smart tax planning",
    "Have a trusted advisor on speed dial for any financial question",
    "Focus on growing your business instead of fighting paperwork",
    "Sleep soundly knowing HMRC compliance is handled perfectly"
  ];

  const failureRisks = [
    "Missed tax savings that could fund your growth",
    "Strategic opportunities you can't see without clear data", 
    "Sleepless nights worrying about compliance",
    "Precious time wasted on tasks an expert could handle efficiently"
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-black to-green-900/20 fade-in-section"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Success Vision */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-bold text-2xl md:text-3xl text-white mb-4">
                  Imagine Having Complete Confidence in Your Financial Future
                </h3>
              </div>
              
              <ul className="space-y-4">
                {successOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-200 leading-relaxed">
                      {outcome}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure Warning */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="font-bold text-2xl md:text-3xl text-white mb-4">
                  Don't Let Another Year of Opportunities Slip Through Your Fingers
                </h3>
              </div>
              
              <p className="text-gray-200 mb-6 leading-relaxed">
                Every month without proper financial guidance costs you:
              </p>
              
              <ul className="space-y-4">
                {failureRisks.map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-200 leading-relaxed">
                      {risk}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Primary CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-sm">
            <h3 className="font-bold text-3xl md:text-4xl text-white mb-4">
              Start Your Journey to Financial Clarity Today
            </h3>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get your free Strategic Clarity Session and discover the opportunities hiding in your finances
            </p>
            
            <button
              className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 mb-4"
              style={{ 
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                padding: 'clamp(18px, 2.5vw, 24px) clamp(36px, 6vw, 52px)',
                minHeight: '64px',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                boxShadow: '0 6px 20px rgba(124, 58, 237, 0.5), 0 3px 12px rgba(236, 72, 153, 0.4)',
                color: '#FFFFFF',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(124, 58, 237, 0.7), 0 4px 16px rgba(236, 72, 153, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.5), 0 3px 12px rgba(236, 72, 153, 0.4)';
              }}
              onClick={() => {
                if (window.Calendly) {
                  window.Calendly.initPopupWidget({
                    url: 'https://calendly.com/progressaccountants'
                  });
                } else {
                  window.open('https://calendly.com/progressaccountants', '_blank');
                }
              }}
            >
              Book My Strategy Call
              <ArrowRight className="ml-3 h-6 w-6 flex-shrink-0" />
            </button>
            
            <p className="text-sm text-gray-400">
              No obligation. No hidden fees. Just honest advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}