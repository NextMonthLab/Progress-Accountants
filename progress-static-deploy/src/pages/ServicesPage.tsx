import { Link } from "wouter";
import { Calculator, FileText, Users, BarChart3, Building2, Film, Music, HardHat, ArrowRight, CheckCircle } from "lucide-react";

export default function ServicesPage() {
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
              <Link href="/services" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
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
              Our <span className="text-primary-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive accounting and financial services designed to support your business growth at every stage.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Accounting Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Essential financial services that form the foundation of your business operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-12 w-12 text-primary-600" />,
                title: "Bookkeeping & Management Accounts",
                description: "Accurate financial record-keeping with monthly management reporting to keep you informed of your business performance.",
                features: ["Daily transaction recording", "Bank reconciliation", "Monthly management reports", "Cash flow forecasting"]
              },
              {
                icon: <Calculator className="h-12 w-12 text-primary-600" />,
                title: "VAT Returns & Tax Planning",
                description: "Compliant VAT submissions and strategic tax planning to optimize your tax position while ensuring full compliance.",
                features: ["VAT return preparation", "VAT registration advice", "Tax planning strategies", "HMRC liaison"]
              },
              {
                icon: <Users className="h-12 w-12 text-primary-600" />,
                title: "Payroll Services",
                description: "Complete payroll management including auto-enrollment pensions, ensuring your team is paid accurately and on time.",
                features: ["Monthly payroll processing", "PAYE submissions", "Pension auto-enrollment", "Payroll reporting"]
              },
              {
                icon: <Building2 className="h-12 w-12 text-primary-600" />,
                title: "Company Formation",
                description: "Expert guidance through company formation and setup, ensuring your business starts on solid foundations.",
                features: ["Company registration", "Legal structure advice", "Initial compliance setup", "Banking support"]
              },
              {
                icon: <FileText className="h-12 w-12 text-primary-600" />,
                title: "Self Assessment",
                description: "Personal tax return preparation and submission, maximizing allowances and ensuring timely compliance.",
                features: ["Tax return preparation", "Self-employment advice", "Capital gains planning", "Dividend optimization"]
              },
              {
                icon: <BarChart3 className="h-12 w-12 text-primary-600" />,
                title: "Corporation Tax Returns",
                description: "Comprehensive corporation tax services ensuring your company meets all obligations while minimizing tax liability.",
                features: ["Annual tax returns", "Tax computation", "Compliance monitoring", "Strategic tax advice"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-center">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Specializations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Specializations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized expertise across key industries with tailored solutions for unique sector challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Film className="h-12 w-12 text-primary-600" />,
                title: "Film Industry Tax Relief",
                description: "Expert guidance on film tax relief, production accounting, and creative industry financial management."
              },
              {
                icon: <Music className="h-12 w-12 text-primary-600" />,
                title: "Music Industry Accounting",
                description: "Specialized accounting for musicians, record labels, and music production companies."
              },
              {
                icon: <HardHat className="h-12 w-12 text-primary-600" />,
                title: "Construction Industry Schemes",
                description: "CIS compliance, subcontractor management, and construction-specific accounting solutions."
              },
              {
                icon: <Building2 className="h-12 w-12 text-primary-600" />,
                title: "Professional Services Support",
                description: "Tailored financial solutions for consultancies, agencies, and professional service providers."
              }
            ].map((specialization, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-4">
                  {specialization.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{specialization.title}</h3>
                <p className="text-gray-600">{specialization.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven process ensures you receive exceptional service from initial consultation to ongoing support
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Initial Consultation",
                description: "We discuss your business needs and objectives to understand how we can best support you."
              },
              {
                step: "02",
                title: "Tailored Proposal",
                description: "We create a customized service package that matches your specific requirements and budget."
              },
              {
                step: "03",
                title: "Implementation",
                description: "We seamlessly integrate our services into your business operations with minimal disruption."
              },
              {
                step: "04",
                title: "Ongoing Support",
                description: "Regular reviews and proactive advice to ensure your business continues to thrive."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let's discuss which services would be most beneficial for your business.
          </p>
          <Link href="/contact" className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
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