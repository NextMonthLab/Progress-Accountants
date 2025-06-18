import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfessionalServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Professional Services</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Comprehensive accounting and advisory services tailored for professional service firms 
              including legal practices, consultancies, and other service-based businesses.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Our Services Include</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Partnership and LLP accounting</li>
              <li>Professional indemnity insurance advice</li>
              <li>Client account regulations compliance</li>
              <li>Fee billing and time recording systems</li>
              <li>Cash flow management</li>
              <li>Tax planning for professionals</li>
            </ul>
            
            <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
            <p className="mb-6">
              We understand the unique challenges facing professional service firms. Our tailored 
              approach ensures compliance with industry regulations while maximizing profitability 
              and efficiency.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}