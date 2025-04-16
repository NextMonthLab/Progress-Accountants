import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Contact Us | Progress Accountants</title>
        <meta name="description" content="Get in touch with our team to discuss how we can help your business grow. Contact Progress Accountants today." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--navy)] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-200">
              Ready to take your business finances to the next level? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>Office Address</h3>
                    <p className="text-gray-700">
                      Progress Accountants<br />
                      123 Business Street<br />
                      Banbury, Oxfordshire<br />
                      OX16 1AA
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>Contact Details</h3>
                    <p className="text-gray-700">
                      Phone: 01295 123 456<br />
                      Email: info@progressaccountants.com
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>Business Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 9:00 AM - 5:30 PM<br />
                      Saturday - Sunday: Closed
                    </p>
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