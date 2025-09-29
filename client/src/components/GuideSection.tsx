import { useEffect, useRef } from "react";
import { CheckCircle2, MapPin, Users, Zap, TrendingUp } from "lucide-react";

export default function GuideSection() {
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

  const credentials = [
    {
      icon: Users,
      title: "Chartered accountants with decades of combined experience",
      description: "Proven expertise you can trust"
    },
    {
      icon: TrendingUp,
      title: "Specialists in film, music, construction, and professional services",
      description: "Deep industry knowledge that matters"
    },
    {
      icon: MapPin,
      title: "Based right here in Banbury, Oxfordshire",
      description: "Local expertise with personal service"
    },
    {
      icon: Zap,
      title: "Modern cloud-based approach with a personal touch",
      description: "Technology meets traditional values"
    },
    {
      icon: CheckCircle2,
      title: "Proactive advisors, not just year-end number crunchers",
      description: "Strategic partners in your success"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-purple-900/30 fade-in-section"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-5xl mb-6 text-white leading-tight">
              We Understand Because We've Been Guiding Banbury Businesses for Years
            </h2>
            
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm mb-12">
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-4">
                "We know what it's like to feel trapped by financial confusion. That's why we created a different kind of accounting firm—one that actually helps you grow."
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <h3 className="font-bold text-2xl md:text-3xl mb-8 text-white text-center">
              Why Choose Progress:
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((credential, index) => (
                <div key={index} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/20 to-purple-400/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <credential.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2 leading-tight text-sm">
                        {credential.title}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {credential.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}