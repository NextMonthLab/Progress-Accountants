import { useEffect, useRef } from "react";
import { Search, MapPin, Users } from "lucide-react";

export default function PlanSection() {
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

  const steps = [
    {
      number: "1",
      icon: Search,
      title: "Strategic Clarity Session",
      description: "We'll analyse your current financial position and identify immediate opportunities for tax savings and growth—completely free."
    },
    {
      number: "2", 
      icon: MapPin,
      title: "Tailored Growth Roadmap",
      description: "Together, we'll create your personalised financial strategy that turns confusion into clarity and reveals hidden profit opportunities."
    },
    {
      number: "3",
      icon: Users,
      title: "Ongoing Partnership & Support", 
      description: "We'll walk alongside you with proactive advice, real-time insights, and strategic guidance—so you never feel alone in financial decisions again."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-purple-900/30 via-slate-800 to-slate-900 fade-in-section"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-bold text-3xl md:text-5xl mb-12 text-white leading-tight">
            Your Simple Path to Financial Control
          </h2>
          
          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                  <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center shadow-2xl">
                        <step.icon className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-purple-600 font-bold text-sm">{step.number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl md:text-3xl mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connecting line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-12 top-24 w-0.5 h-16 bg-gradient-to-b from-purple-400 to-purple-600 opacity-50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}