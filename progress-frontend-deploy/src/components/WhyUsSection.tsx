import { Card, CardContent } from "@/components/ui/card";
import { testimonialClient } from "../assets/imagePlaceholders";
import { useEffect, useRef } from "react";

export default function WhyUsSection() {
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

  const benefits = [
    "Fixed pricing, no surprises",
    "Seamless onboarding",
    "Straight-talking advice",
    "Fast replies from real people",
    "Real-time insight into your financial performance"
  ];

  return (
    <section 
      ref={sectionRef}
      id="why-us" 
      className="py-16 md:py-24 text-white fade-in-section bg-gradient-to-br from-zinc-900 via-black to-purple-900/20" 
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-poppins font-bold text-2xl md:text-4xl mb-4 gradient-text">
            Clarity. Confidence. Control.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column: bullet points */}
          <div>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="text-xl mr-3 text-purple-400">✓</div>
                  <p className="text-lg text-gray-200">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right column: dashboard mockup and testimonial */}
          <Card className="bg-zinc-800 text-white overflow-hidden shadow-xl border-zinc-700 hover-scale transition duration-500">
            <CardContent className="p-8">
              <div 
                className="rounded-lg p-6 mb-6 shadow-md bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20"
              >
                {/* Dashboard mockup */}
                <div className="h-48 flex flex-col">
                  <div 
                    className="font-semibold mb-2 text-purple-300"
                  >
                    FINANCIAL DASHBOARD
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-zinc-700/50 p-3 rounded shadow-sm border border-purple-500/10">
                      <div className="text-sm text-gray-400">Revenue</div>
                      <div 
                        className="text-lg font-semibold pulse-animation gradient-text"
                      >
                        £85,240
                      </div>
                    </div>
                    <div className="bg-zinc-700/50 p-3 rounded shadow-sm border border-purple-500/10">
                      <div className="text-sm text-gray-400">Expenses</div>
                      <div 
                        className="text-lg font-semibold pulse-animation gradient-text"
                      >
                        £42,350
                      </div>
                    </div>
                  </div>
                  <div className="h-16 bg-zinc-700/30 rounded shadow-sm mb-2 border border-purple-500/10"></div>
                  <div className="text-xs text-gray-400 italic flex items-center">
                    <span className="mr-2">Your custom financial dashboard</span>
                    <span className="inline-flex items-center text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full border border-purple-500/20">
                      <span className="pulse-animation mr-1">•</span> 
                      Updated in real-time
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Testimonial */}
              <div className="flex items-center">
                <div className="mr-4 rounded-full overflow-hidden w-16 h-16 border-2 border-purple-500/30">
                  {testimonialClient()}
                </div>
                <div>
                  <div 
                    className="italic text-lg text-gray-300"
                  >
                    "Since joining Progress, I understand my numbers, I've built a podcast audience, and I've made smarter decisions every month."
                  </div>
                  <div className="mt-1 font-semibold text-purple-300">
                    — Sarah Thompson, Innovate Studios
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
