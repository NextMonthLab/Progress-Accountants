import { Link } from "wouter";
import { Mail, Phone, Linkedin, ArrowRight } from "lucide-react";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Managing Director & Senior Accountant",
      qualifications: "ACCA, ACA",
      bio: "Sarah founded Progress Accountants with over 15 years of experience in corporate finance and tax planning. She specializes in helping creative industry businesses maximize their growth potential.",
      email: "sarah@progressaccountants.co.uk",
      phone: "01295 250085"
    },
    {
      name: "Michael Chen",
      role: "Senior Tax Advisor",
      qualifications: "CTA, ACCA",
      bio: "Michael leads our tax planning services with expertise in corporation tax, VAT, and specialist reliefs for the film and construction industries.",
      email: "michael@progressaccountants.co.uk",
      phone: "01295 250085"
    },
    {
      name: "Emma Williams",
      role: "Bookkeeping Manager",
      qualifications: "AAT, QBO ProAdvisor",
      bio: "Emma manages our bookkeeping services and specializes in cloud accounting solutions, helping businesses streamline their financial processes.",
      email: "emma@progressaccountants.co.uk",
      phone: "01295 250085"
    },
    {
      name: "James Thompson",
      role: "Payroll Specialist",
      qualifications: "CIPP",
      bio: "James handles all aspects of payroll management and ensures compliance with employment legislation and pension auto-enrollment requirements.",
      email: "james@progressaccountants.co.uk",
      phone: "01295 250085"
    }
  ];

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
              <Link href="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">About</Link>
              <Link href="/services" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
              <Link href="/team" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Team</Link>
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
              Meet Our <span className="text-primary-600">Expert Team</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our qualified professionals bring decades of combined experience and a passion for helping businesses succeed through expert financial guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-primary-600 font-semibold mb-2">{member.role}</p>
                    <p className="text-sm text-gray-600 mb-4">{member.qualifications}</p>
                    <p className="text-gray-700 mb-6">{member.bio}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {member.email}
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {member.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Sets Our Team Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence and client success drives everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Qualified Professionals",
                description: "Our team holds professional qualifications from leading accounting bodies including ACCA, ACA, and AAT."
              },
              {
                title: "Industry Expertise",
                description: "Specialized knowledge across creative industries, construction, and professional services."
              },
              {
                title: "Client-Focused Approach",
                description: "We build lasting relationships based on trust, transparency, and delivering exceptional service."
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

      {/* Join Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Growing Team
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented accounting professionals who share our passion for client success and innovation.
            </p>
            <Link href="/contact" className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              View Opportunities <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work with Our Team?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let our experienced professionals help your business reach its full potential.
          </p>
          <Link href="/contact" className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
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