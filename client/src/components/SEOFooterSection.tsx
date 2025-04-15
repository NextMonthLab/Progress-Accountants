import { Button } from "@/components/ui/button";
import { footerBanburyTown, footerOfficeFront } from "../assets/imagePlaceholders";
import { useEffect, useRef } from "react";

export default function SEOFooterSection() {
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

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 fade-in-section"
      style={{ backgroundColor: 'var(--light-grey)' }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 
              className="font-poppins font-bold text-2xl md:text-4xl mb-6"
              style={{ color: 'var(--navy)' }}
            >
              Looking for a proactive accountant in Banbury?
            </h2>
            <p 
              className="text-lg mb-6"
              style={{ color: 'var(--dark-grey)' }}
            >
              We're based in Banbury and proudly serve ambitious businesses across Oxfordshire and beyond. Whether you need bookkeeping, tax returns, or a finance director who understands your goals — Progress is here to help.
            </p>
            <p 
              className="text-lg mb-8"
              style={{ color: 'var(--dark-grey)' }}
            >
              We specialise in small business accounting, and we're certified Xero accountants too. But most of all, we help our clients grow — with practical, forward-thinking support you won't find anywhere else.
            </p>
            <div className="mb-10">
              <a href="#book-call" id="book-call">
                <Button 
                  size="lg" 
                  style={{ backgroundColor: 'var(--orange)' }}
                  className="px-8 py-6 text-lg glow-on-hover hover:-translate-y-[2px] transition duration-300"
                >
                  👉 Let's build your growth engine — book your free discovery call
                </Button>
              </a>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="rounded-lg overflow-hidden shadow-md hover-scale transition duration-300">
              {footerBanburyTown()}
              <div className="p-3 bg-white text-center text-sm font-medium" style={{ color: 'var(--navy)' }}>
                Banbury Town Centre
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md hover-scale transition duration-300">
              {footerOfficeFront()}
              <div className="p-3 bg-white text-center text-sm font-medium" style={{ color: 'var(--navy)' }}>
                Our Banbury Office
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
