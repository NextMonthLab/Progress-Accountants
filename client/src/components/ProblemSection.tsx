import { useEffect, useRef } from "react";

export default function ProblemSection() {
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

  const problems = [
    "Overwhelmed by tax deadlines and compliance requirements that never seem to end",
    "Uncertain whether you're truly profitable or just staying afloat",
    "Worried you're missing opportunities to save significant money in tax",
    "Frustrated that your accountant only appears once a year with a bill",
    "Anxious about HMRC penalties because you don't know what you don't know"
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900/20 fade-in-section"
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-bold text-3xl md:text-5xl mb-8 text-white leading-tight">
            Running a Business Shouldn't Feel Like Navigating in the Dark
          </h2>
          
          <div className="text-left max-w-3xl mx-auto mb-8">
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              You started your business to make a difference, not to wrestle with spreadsheets until midnight. Yet here you are:
            </p>
            
            <ul className="space-y-4 mb-8">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start">
                  <div className="text-red-400 mr-4 text-xl font-bold mt-1">×</div>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    <strong className="text-white">{problem.split(' ')[0]}</strong> {problem.split(' ').slice(1).join(' ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
            <p className="text-xl md:text-2xl text-white font-semibold leading-relaxed">
              <span className="text-red-400">The real problem?</span> You're so busy fighting financial fires that you can't see the growth opportunities right in front of you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}