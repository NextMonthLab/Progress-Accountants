import { Button } from "@/components/ui/button";
import { footerBanburyTown, footerOfficeFront } from "../assets/imagePlaceholders";
import { useEffect, useRef } from "react";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function SEOFooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { businessIdentity, isLoading } = useBusinessIdentity();

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

  // Extract business contact information
  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";
  const address = businessIdentity?.contact?.address || "10 Accounting Avenue, London, UK";
  const phone = businessIdentity?.contact?.phone || "+44 20 1234 5678";
  const email = businessIdentity?.contact?.email || "info@progressaccountants.com";
  const website = businessIdentity?.contact?.website || "www.progressaccountants.com";
  const geographicFocus = businessIdentity?.market?.geographicFocus || "United Kingdom";

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 fade-in-section"
      style={{ backgroundColor: 'var(--light-grey)' }}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 
              className="font-poppins font-bold text-2xl md:text-4xl mb-6"
              style={{ color: 'var(--navy)' }}
            >
              Looking for a proactive accountant in {geographicFocus}?
            </h2>
            <p 
              className="text-lg mb-6"
              style={{ color: 'var(--dark-grey)' }}
            >
              We're based in {address.split(",")[0]} and proudly serve ambitious businesses across {geographicFocus} and beyond. Whether you need bookkeeping, tax returns, or a finance director who understands your goals — {businessName} is here to help.
            </p>
            <p 
              className="text-lg mb-8"
              style={{ color: 'var(--dark-grey)' }}
            >
              We specialise in small business accounting, and we're certified Xero accountants too. But most of all, we help our clients grow — with practical, forward-thinking support you won't find anywhere else.
            </p>
            <div className="mb-10">
              <a 
                href="data:text/html,<script>window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank'); window.close();</script>"
                style={{ 
                  backgroundColor: '#f15a29',
                  cursor: 'pointer',
                  padding: '1.5rem 2rem',
                  fontSize: '1.125rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  color: 'white',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 99999,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  outline: 'none',
                  display: 'inline-block',
                  textAlign: 'center',
                  userSelect: 'none',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = '#e54e26';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#f15a29';
                }}
              >
                👉 Let's build your growth engine — book your free discovery call
              </a>
            </div>

            {/* Contact Information */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-orange-100 p-2 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>Office Address</h4>
                  <p className="text-gray-700">{address}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-orange-100 p-2 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>Phone</h4>
                  <p className="text-gray-700">{phone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-orange-100 p-2 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>Email</h4>
                  <a href={`mailto:${email}`} className="text-gray-700 hover:text-orange-500">{email}</a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-orange-100 p-2 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>Website</h4>
                  <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-orange-500">{website}</a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <div className="rounded-lg overflow-hidden shadow-md hover-scale transition duration-300">
              {footerBanburyTown()}
              <div className="p-3 bg-white text-center text-sm font-medium" style={{ color: 'var(--navy)' }}>
                {address.split(",")[0]} Town Centre
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md hover-scale transition duration-300">
              {footerOfficeFront()}
              <div className="p-3 bg-white text-center text-sm font-medium" style={{ color: 'var(--navy)' }}>
                Our {address.split(",")[0]} Office
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
