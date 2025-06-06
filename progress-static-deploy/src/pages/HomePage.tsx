import { Link } from "wouter";
import { ArrowRight, Calculator, Users, FileText, BarChart3, Phone, Mail, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Progress Accountants</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">About</Link>
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
              Driving Growth Through{" "}
              <span className="text-primary-600">Smart Financial Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Expert accounting services for forward-thinking businesses. We provide comprehensive financial solutions tailored to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/services" className="btn btn-outline">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Accounting Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From bookkeeping to strategic financial planning, we provide complete accounting solutions for businesses of all sizes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FileText className="h-8 w-8 text-primary-600" />,
                title: "Bookkeeping & Management Accounts",
                description: "Accurate financial records and monthly management reporting"
              },
              {
                icon: <Calculator className="h-8 w-8 text-primary-600" />,
                title: "VAT Returns & Tax Planning",
                description: "Compliant VAT submissions and strategic tax optimization"
              },
              {
                icon: <Users className="h-8 w-8 text-primary-600" />,
                title: "Payroll Services",
                description: "Complete payroll management and pension auto-enrollment"
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
                title: "Financial Advisory",
                description: "Strategic guidance to drive business growth and profitability"
              }
            ].map((service, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized knowledge across key industries, delivering tailored solutions that understand your unique challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Film & Entertainment",
              "Music Industry",
              "Construction",
              "Professional Services"
            ].map((industry, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-lg font-semibold text-gray-900">{industry}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business Finances?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let's discuss how our expert accounting services can drive your business growth.
          </p>
          <Link href="/contact" className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">Progress Accountants</h3>
              <p className="text-gray-400 mb-4">
                Expert accounting services for forward-thinking businesses. Established 2018.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  01295 250085
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  hello@progressaccountants.co.uk
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Bookkeeping</li>
                <li>VAT Returns</li>
                <li>Payroll</li>
                <li>Tax Planning</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/team">Our Team</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 Progress Accountants. All rights reserved.
            </p>
            <div className="flex items-center text-gray-400 mt-4 md:mt-0">
              <MapPin className="h-4 w-4 mr-2" />
              Studio Banbury, Merton Street, Banbury, OX16 4RN
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}