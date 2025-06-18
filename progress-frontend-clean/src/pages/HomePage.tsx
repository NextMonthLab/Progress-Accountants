import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmbeddedChatbot from "@/components/EmbeddedChatbot";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <EmbeddedChatbot />
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Progress Accountants
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Expert accounting services for businesses and individuals in Banbury, Oxford and surrounding areas.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/contact" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90">
                Get Started
              </a>
              <a href="/services" className="border border-border px-6 py-3 rounded-lg hover:bg-muted">
                Our Services
              </a>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-4">Tax Planning</h3>
                <p className="text-muted-foreground">Strategic tax planning and preparation services.</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-4">Bookkeeping</h3>
                <p className="text-muted-foreground">Professional bookkeeping and accounts management.</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-4">Business Advisory</h3>
                <p className="text-muted-foreground">Expert guidance for business growth and success.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}