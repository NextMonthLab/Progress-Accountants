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

      {/* Office Locations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--navy)' }}>Our Office Locations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Oxford Office */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy)' }}>OXFORD OFFICE</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                  <p>01865 921 150</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                  <p>
                    John Eccles House<br />
                    Robert Robinson Avenue<br />
                    Oxford Science Park<br />
                    Oxford<br />
                    OX4 4GP
                  </p>
                </div>
              </div>
              <div className="mt-4 h-64 rounded overflow-hidden">
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
            </div>

            {/* Banbury Office */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy)' }}>BANBURY OFFICE</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                  <p>01295 477 250</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                  <p>
                    1st Floor Beaumont House<br />
                    Beaumont Road<br />
                    Banbury<br />
                    OX16 1RH
                  </p>
                </div>
              </div>
              <div className="mt-4 h-64 rounded overflow-hidden">
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
            </div>

            {/* London Office */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy)' }}>LONDON OFFICE</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                  <p>020 3005 7870</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                  <p>
                    107 Cheapside<br />
                    London<br />
                    EC2V 6DN
                  </p>
                </div>
              </div>
              <div className="mt-4 h-64 rounded overflow-hidden">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours & Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Business Hours & Additional Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>Business Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>Business Hours</h3>
                      <p className="text-gray-700">
                        Monday - Friday: 9:00 AM - 5:30 PM<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-1 text-[var(--orange)]" />
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>Email Us</h3>
                      <p className="text-gray-700">
                        General Inquiries: info@progressaccountants.com<br />
                        Support: support@progressaccountants.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}