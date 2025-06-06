import { Link } from "wouter";
import { Award, Users, Calendar, MapPin, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">Progress Accountants</Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</Link>
              <Link href="/about" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">About</Link>
              <Link href="/services" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
              <Link href="/team" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Team</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-primary-600">Progress Accountants</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Established in 2018, we're a forward-thinking accounting firm dedicated to helping businesses thrive through expert financial guidance and innovative solutions.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Established 2018
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                25-50 Team Members
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                Banbury, Oxfordshire
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Progress Accountants was founded with a simple mission: to provide exceptional accounting services that drive real business growth. We believe that great accounting is more than just number-crunching—it's about understanding your business and helping you make informed decisions.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Since 2018, we've been serving businesses across Oxfordshire, Warwickshire, and Buckinghamshire, specializing in industries from creative services to construction, always with a focus on innovation and client success.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Work With Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  "Industry specialization across creative and professional services",
                  "Technology-driven solutions for efficient financial management",
                  "Proactive advisory services beyond basic compliance",
                  "Local presence with deep understanding of regional business needs"
                ].map((point, index) => (
                  <li key={index} className="flex items-start">
                    <Award className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Excellence",
                description: "We strive for the highest standards in everything we deliver"
              },
              {
                title: "Innovation",
                description: "We embrace new technologies and methods to serve you better"
              },
              {
                title: "Client Success",
                description: "Your success is our success - we're invested in your growth"
              },
              {
                title: "Transparency",
                description: "Clear communication and honest advice you can trust"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certifications & Partnerships
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Qualified professionals you can trust
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "ACCA Qualified",
                description: "Association of Chartered Certified Accountants"
              },
              {
                name: "QuickBooks ProAdvisor",
                description: "Certified QuickBooks specialist"
              },
              {
                name: "Xero Partner",
                description: "Authorized Xero accounting software partner"
              }
            ].map((cert, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200">
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let's discuss how we can help your business reach its full potential.
          </p>
          <Link href="/contact" className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Get In Touch <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 Progress Accountants. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}