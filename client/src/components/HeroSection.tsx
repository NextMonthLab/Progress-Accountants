import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section style={{ backgroundColor: 'var(--navy)' }} className="text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-6">
            Accountants in Banbury who actually help you grow.
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200">
            Most firms just talk about growth. At Progress, we give you the tools to make it happen — from real-time financial dashboards to your own podcast and video studio.
          </p>
          <a href="#book-call">
            <Button 
              size="lg" 
              style={{ backgroundColor: 'var(--orange)' }}
              className="px-8 py-6 text-lg hover:shadow-md hover:-translate-y-[2px] transition duration-300"
            >
              👉 Book Your Free Strategy Call
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
