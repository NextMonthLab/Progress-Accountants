import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Progress Accountants</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Established in 2018, Progress Accountants has been providing expert accounting services 
              to businesses and individuals in Banbury, Oxford, and surrounding areas.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="mb-6">
              We are committed to helping our clients achieve financial success through comprehensive 
              accounting services, strategic tax planning, and personalized business advisory support.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Our Services</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Tax Planning & Preparation</li>
              <li>Bookkeeping & Accounts</li>
              <li>Business Advisory Services</li>
              <li>Payroll Management</li>
              <li>VAT Returns</li>
              <li>Company Formation</li>
            </ul>
            
            <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
            <p className="mb-6">
              Our team of qualified professionals brings years of experience and a commitment to 
              excellence. We understand that every business is unique, which is why we provide 
              tailored solutions to meet your specific needs.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}