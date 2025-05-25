import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Contact Us | Progress Accountants</title>
        <meta name="description" content="Get in touch with our team to discuss how we can help your business grow. Contact Progress Accountants today." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-200">
              Ready to take your business finances to the next level? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Alternative Contact Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2">
                <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
                  Looking for a proactive accountant in United Kingdom?
                </h2>
                <div className="space-y-6 mb-8">
                  <p className="text-gray-800">
                    We're based in Oxford, Banbury, and London, and proudly serve ambitious businesses across the United Kingdom and beyond. 
                    Whether you need bookkeeping, tax returns, or a finance director who understands your goals — 
                    Progress Accountants is here to help.
                  </p>
                  <p className="text-gray-800">
                    We specialise in small business accounting, and we're certified Xero accountants too. But most of all, we help our
                    clients grow — with practical, forward-thinking support you won't find anywhere else.
                  </p>
                </div>
                
                <div className="mb-10">
                  <a 
                    href="#send-message" 
                    className="inline-flex items-center px-6 py-3 rounded-md bg-[var(--orange)] hover:bg-orange-600 text-white font-medium transition-colors"
                  >
                    <span className="mr-2">🚀</span> Let's build your growth engine — book your free discovery call
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-[var(--orange)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Office Addresses</h3>
                        <div className="text-gray-800">
                          <div className="mb-2">
                            <strong>Oxford:</strong> John Eccles House, Oxford Science Park, OX4 4GP
                          </div>
                          <div className="mb-2">
                            <strong>Banbury:</strong> 1st Floor Beaumont House, Beaumont Road, OX16 1RH
                          </div>
                          <div>
                            <strong>London:</strong> 107 Cheapside, London, EC2V 6DN
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <Phone className="h-4 w-4 text-[var(--orange)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Phone</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="text-gray-800">Oxford: 01865 921 150</div>
                          <div className="text-gray-800">Banbury: 01295 477 250</div>
                          <div className="text-gray-800">London: 020 3005 7870</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <Mail className="h-4 w-4 text-[var(--orange)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Email</h3>
                        <p className="text-gray-800">info@progressaccountants.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--orange)]">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Website</h3>
                        <p className="text-gray-800">www.progressaccountants.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-[var(--orange)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Business Hours</h3>
                        <p className="text-gray-800">
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
                  <div className="relative overflow-hidden rounded-lg shadow-md h-[180px] bg-[var(--navy)]">
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
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-white rounded-md text-xs font-medium text-gray-800 shadow-md">Oxford Science Park</div>
                    </div>
                  </div>
                  
                  {/* Banbury Office Map */}
                  <div className="relative overflow-hidden rounded-lg shadow-md h-[180px] bg-[var(--navy)]">
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
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-white rounded-md text-xs font-medium text-gray-800 shadow-md">Banbury Town</div>
                    </div>
                  </div>
                  
                  {/* London Office Map */}
                  <div className="relative overflow-hidden rounded-lg shadow-md h-[180px] bg-[var(--navy)]">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.9107610266914!2d-0.0954606234056257!3d51.51473417181649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603548d6d9a3d%3A0x486b0b46b9d0b1e8!2s107%20Cheapside%2C%20London%20EC2V%206DN!5e0!3m2!1sen!2suk!4v1651234567892!5m2!1sen!2suk" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="London Office Map"
                    ></iframe>
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-white rounded-md text-xs font-medium text-gray-800 shadow-md">London Office</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="send-message" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>Send Us a Message</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Need more information or have a specific question? Fill out the form below and one of our 
                accounting specialists will get back to you promptly.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}