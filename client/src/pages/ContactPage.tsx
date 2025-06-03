import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Contact Us | Progress Accountants</title>
        <meta name="description" content="Get in touch with our team to discuss how we can help your business grow. Contact Progress Accountants today." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Get in{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ready to take your business finances to the next level? Our team is here to help you succeed.
            </p>
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
                  Looking for a proactive accountant in United Kingdom?
                </h2>
                <div className="space-y-6 mb-10">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    We're based in Oxford, Banbury, and London, and proudly serve ambitious businesses across the United Kingdom and beyond. 
                    Whether you need bookkeeping, tax returns, or a finance director who understands your goals — 
                    Progress Accountants is here to help.
                  </p>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    We specialise in small business accounting, and we're certified Xero accountants too. But most of all, we help our
                    clients grow — with practical, forward-thinking support you won't find anywhere else.
                  </p>
                </div>
                
                <div className="mb-12">
                  <a 
                    href="#send-message" 
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium"
                  >
                    <span className="mr-2">🚀</span> Let's build your growth engine — book your free discovery call
                  </a>
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
                          <div className="text-slate-300">Oxford: 01865 921 150</div>
                          <div className="text-slate-300">Banbury: 01295 477 250</div>
                          <div className="text-slate-300">London: 020 3005 7870</div>
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
                          Monday - Friday: 9:00 AM - 5:30 PM<br />
                          Saturday - Sunday: Closed
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
                Need more information or have a specific question? Fill out the form below and one of our 
                accounting specialists will get back to you promptly.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-8 rounded-xl shadow-lg backdrop-blur-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}