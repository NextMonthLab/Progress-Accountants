import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import IndustriesSection from "@/components/IndustriesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { useEffect } from "react";

const HomePage = () => {
  const { businessIdentity, isLoading } = useBusinessIdentity();

  // Override global anchor handler to allow Calendly links
  useEffect(() => {
    const overrideAnchorHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      // Allow Calendly links to work normally
      if (href && href.includes('calendly.com')) {
        e.stopImmediatePropagation();
        return;
      }
    };

    // Add with capture=true to run before other handlers
    document.addEventListener('click', overrideAnchorHandler, true);
    
    return () => {
      document.removeEventListener('click', overrideAnchorHandler, true);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B3FE4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <ServicesSection />
      <IndustriesSection />
      <WhyUsSection />

      {/* Enhanced Contact Section with Dark Theme */}
      <section className="py-12 sm:py-16 bg-black" id="contact">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white px-4">
                Looking for a proactive accountant in United Kingdom?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed px-4">
                Start your conversation with us today. Let's discuss your business goals and see how we can support your growth.
              </p>
            </div>

            {/* Enhanced Contact Form Section */}
            <div className="mb-12 sm:mb-14">
              <div className="bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-slate-700/60 relative overflow-hidden">
                {/* Enhanced background with texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-zinc-900/50 to-gray-900/60 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-slate-700/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-600/50 pb-6">
                    <h3 className="text-xl font-semibold text-white">Get in Touch</h3>
                    
                    <div className="flex space-x-4">
                      <a href="mailto:info@progressaccountants.com" className="text-slate-400 hover:text-[#7B3FE4] transition-colors p-2 rounded-lg hover:bg-slate-800/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                      <a href="tel:01865921150" className="text-slate-400 hover:text-[#7B3FE4] transition-colors p-2 rounded-lg hover:bg-slate-800/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-1">
                      <div className="bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-slate-600/60 h-full">
                        <div className="flex items-start mb-6">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#7B3FE4]/20 to-[#3FA4E4]/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#7B3FE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white mb-3">Business Hours</h3>
                            <div className="space-y-2 text-slate-300">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-sm">Monday - Friday:</span>
                                <span className="font-medium text-sm">9:00 AM - 5:30 PM</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-sm">Saturday - Sunday:</span>
                                <span className="font-medium text-sm">Closed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#7B3FE4]/20 to-[#3FA4E4]/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#7B3FE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white mb-3">Contact Details</h3>
                            <div className="space-y-3 text-slate-300">
                              <div>
                                <span className="font-medium text-xs block mb-1">Email:</span>
                                <a href="mailto:info@progressaccountants.com" className="text-[#3FA4E4] hover:text-[#7B3FE4] transition-colors text-sm break-all">
                                  info@progressaccountants.com
                                </a>
                              </div>
                              <div>
                                <span className="font-medium text-xs block mb-1">General Enquiries:</span>
                                <a href="tel:01865921150" className="text-[#3FA4E4] hover:text-[#7B3FE4] transition-colors text-sm">
                                  01865 921 150
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <ContactForm compact={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Office Locations Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {/* Oxford Office */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Oxford Office</h3>
                  <div className="space-y-2 text-slate-300 mb-4">
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B3FE4] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>John Eccles House, Oxford Science Park, OX4 4GP</span>
                    </p>
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B3FE4] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>01865 921 150</span>
                    </p>
                  </div>
                
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200 aspect-video">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2470.4344456587906!2d-1.2230884233905215!3d51.71881997181775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876c6a3251dbacd%3A0xe44bbc8ac6c55c59!2sOxford%20Science%20Park!5e0!3m2!1sen!2suk!4v1651234567890!5m2!1sen!2suk" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Oxford Office Map"
                      ></iframe>
                    </div>
                    <div className="text-center">
                      <a href="https://goo.gl/maps/exampleOxford" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 font-medium hover:text-[#7B3FE4] transition-colors">
                        View larger map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Banbury Office */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Banbury Office</h3>
                  <div className="space-y-2 text-slate-300 mb-4">
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B3FE4] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>1st Floor Beaumont House, Beaumont Road, OX16 1RH</span>
                    </p>
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B3FE4] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>01295 477 250</span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-lg shadow-sm border border-slate-600 aspect-video">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.9512290731844!2d-1.3498106233780232!3d52.0620696712133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bbf9c1ec66d1%3A0x641f85d46eed55d!2sBeaumont%20Rd%2C%20Banbury!5e0!3m2!1sen!2suk!4v1651234567891!5m2!1sen!2suk" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Banbury Office Map"
                      ></iframe>
                    </div>
                    <div className="text-center">
                      <a href="https://goo.gl/maps/exampleBanbury" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 font-medium hover:text-[#7B3FE4] transition-colors">
                        View larger map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* London Office */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-xl border border-slate-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">London Office</h3>
                  <div className="space-y-2 text-slate-300 mb-4">
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B3FE4] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>160 London Wall, London EC2Y 5DT</span>
                    </p>
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#7B3FE4] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>020 7628 8777</span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-lg shadow-sm border border-slate-600 aspect-video">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.411344968584!2d-0.09726162339246936!3d51.51841831071536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cb3c48c5173%3A0x21b7b6cb6e3b5e!2s160%20London%20Wall%2C%20London%20EC2Y%205DT!5e0!3m2!1sen!2suk!4v1651234567892!5m2!1sen!2suk" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="London Office Map"
                      ></iframe>
                    </div>
                    <div className="text-center">
                      <a href="https://goo.gl/maps/exampleLondon" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 font-medium hover:text-[#7B3FE4] transition-colors">
                        View larger map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;