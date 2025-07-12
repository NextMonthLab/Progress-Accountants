import React from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/ScrollAnimation';
import NativeContactForm from '@/components/forms/NativeContactForm';

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Contact Us | Progress Accountants</title>
        <meta name="description" content="Get in touch with our team to discuss how we can help your business grow. Contact Progress Accountants today." />
      </Helmet>

      {/* Gold Standard Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Cinematic Full-Width Background with Smart Focal Points */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop/Tablet Background - Adjusted for Head Visibility */}
          <div 
            className="absolute inset-0 w-full h-full hidden sm:block"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747743055/P1012439_zmqty8.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          />
          
          {/* Mobile Background - Optimal Head Framing */}
          <div 
            className="absolute inset-0 w-full h-full block sm:hidden"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/drl0fxrkq/image/upload/v1747743055/P1012439_zmqty8.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Dark Overlay for Text Legibility - Gold Standard: 20-50% Opacity */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
        </div>

        {/* Content Container - Centered Layout */}
        <div className="relative z-10 w-full px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            {/* Gold Standard Headline - 4-8 words per line, max 16 total */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.02em'
                  }}>
                <span className="block">Ready To Grow?</span>
                <span className="block">Let's Talk.</span>
              </h1>
            </FadeIn>

            {/* Gold Standard Subheadline - 18-24 words max, single sentence */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                 style={{
                   textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                   letterSpacing: '0.01em'
                 }}>
                Strategic accounting that drives real results for ambitious UK businesses.
              </p>
            </FadeIn>

            {/* Gold Standard CTA - Large, centered, outcome-driven */}
            <FadeIn delay={0.3}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                onClick={() => window.open('https://calendly.com/progressaccountants/discovery-call', '_blank')}
              >
                Book My Strategy Call
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="col-span-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                  Strategic Accountants That Deliver Results
                </h2>
                <div className="space-y-6 mb-10">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Advanced technology meets strategic insight. We turn financial data into competitive advantage for UK businesses.
                  </p>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Banbury, Oxford, London specialists. Real results, not just compliance.
                  </p>
                </div>
                
                <div className="mb-12">
                  <button 
                    onClick={() => {
                      window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'width=700,height=800,resizable=yes,scrollbars=yes');
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium border-none cursor-pointer"
                  >
                    <span className="mr-2">🚀</span> Book Discovery Call
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mr-4">
                        <MapPin className="h-5 w-5 text-[#7B3FE4]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Office Addresses</h3>
                        <div className="text-slate-300 space-y-2">
                          <div>
                            <strong className="text-white">Oxford:</strong> John Eccles House, Oxford Science Park, OX4 4GP
                          </div>
                          <div>
                            <strong className="text-white">Banbury:</strong> 1st Floor Beaumont House, Beaumont Road, OX16 1RH
                          </div>
                          <div>
                            <strong className="text-white">London:</strong> 107 Cheapside, London, EC2V 6DN
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mr-4">
                        <Phone className="h-5 w-5 text-[#7B3FE4]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Phone</h3>
                        <div className="space-y-1">
                          <div className="text-slate-300">01295 477 250</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mr-4">
                        <Mail className="h-5 w-5 text-[#7B3FE4]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Email</h3>
                        <p className="text-slate-300">info@progressaccountants.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mr-4">
                        <Clock className="h-5 w-5 text-[#7B3FE4]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Business Hours</h3>
                        <p className="text-slate-300">
                          Monday – Friday: 9:00am – 5:30pm<br />
                          Saturday – Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-6">
                  {/* Oxford Office Map */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg h-[180px] bg-slate-800 border border-slate-600/50">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2470.4344456587906!2d-1.2230884233905215!3d51.71881997181775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876c6a3251dbacd%3A0xe44bbc8ac6c55c59!2sOxford%20Science%20Park!5e0!3m2!1sen!2suk!4v1651234567890!5m2!1sen!2suk" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Oxford Office Map"
                    ></iframe>
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-slate-800/90 border border-purple-500/30 rounded-md text-xs font-medium text-white shadow-lg">Oxford Science Park</div>
                    </div>
                  </div>
                  
                  {/* Banbury Office Map */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg h-[180px] bg-slate-800 border border-slate-600/50">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2452.9512290731844!2d-1.3498106233780232!3d52.0620696712133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bbf9c1ec66d1%3A0x641f85d46eed55d!2sBeaumont%20Rd%2C%20Banbury!5e0!3m2!1sen!2suk!4v1651234567891!5m2!1sen!2suk" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Banbury Office Map"
                    ></iframe>
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-slate-800/90 border border-purple-500/30 rounded-md text-xs font-medium text-white shadow-lg">Banbury Town</div>
                    </div>
                  </div>
                  
                  {/* London Office Map */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg h-[180px] bg-slate-800 border border-slate-600/50">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.9107610266914!2d-0.0954606234056257!3d51.51473417181649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603548d6d9a3d%3A0x486b0b46b9d0b1e8!2s107%20Cheapside%2C%20London%20EC2V%206DN!5e0!3m2!1sen!2suk!4v1651234567892!5m2!1sen!2suk" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="London Office Map"
                    ></iframe>
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-slate-800/90 border border-purple-500/30 rounded-md text-xs font-medium text-white shadow-lg">London Office</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="send-message" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Send Us a Message</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Have a question or need more information? Fill out the form below and one of our accounting specialists will get back to you promptly.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-8 rounded-xl shadow-lg backdrop-blur-sm">
              <NativeContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}