import { Link } from "wouter";

export default function TermsOfServicePage() {
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
              <Link href="/team" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Team</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Last updated: January 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Agreement</h2>
            <p className="text-gray-700 mb-4">
              By engaging Progress Accountants for accounting services, you agree to these terms and conditions. 
              Our services include but are not limited to bookkeeping, tax preparation, payroll management, 
              and financial advisory services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Client Responsibilities</h2>
            <p className="text-gray-700 mb-4">Clients are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Providing accurate and complete financial information</li>
              <li>Maintaining proper records and documentation</li>
              <li>Timely payment of fees as agreed</li>
              <li>Compliance with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Professional Standards</h2>
            <p className="text-gray-700 mb-4">
              Our services are provided in accordance with professional accounting standards and 
              regulations. We maintain professional indemnity insurance and adhere to the ethical 
              standards of relevant professional bodies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Confidentiality</h2>
            <p className="text-gray-700 mb-4">
              We maintain strict confidentiality regarding all client information and will not 
              disclose any confidential information without your consent, except where required 
              by law or professional obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Our liability is limited to the fees paid for the specific service in question. 
              We are not liable for any indirect, consequential, or special damages arising 
              from our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              Payment terms are as agreed in individual service agreements. Late payment may 
              result in suspension of services and interest charges as permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700 mb-4">
              Either party may terminate the service agreement with appropriate notice. 
              Upon termination, all outstanding fees become immediately due and payable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms are governed by English law and any disputes will be subject to 
              the jurisdiction of the English courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these terms, please contact us at:
            </p>
            <div className="mt-4 text-gray-700">
              <p>Progress Accountants</p>
              <p>Studio Banbury, Merton Street</p>
              <p>Banbury, OX16 4RN</p>
              <p>Email: hello@progressaccountants.co.uk</p>
              <p>Phone: 01295 250085</p>
            </div>
          </section>
        </div>
      </div>

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