import { Button } from "@/components/ui/button";

export default function SEOFooterSection() {
  return (
    <section 
      className="py-16 md:py-24"
      style={{ backgroundColor: 'var(--light-grey)' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 
            className="font-poppins font-bold text-2xl md:text-4xl mb-6 text-center"
            style={{ color: 'var(--navy)' }}
          >
            Looking for a proactive accountant in Banbury?
          </h2>
          <p 
            className="text-lg mb-6"
            style={{ color: 'var(--dark-grey)' }}
          >
            We're based in Banbury and proudly serve ambitious businesses across Oxfordshire and beyond. Whether you need bookkeeping, tax returns, or a finance director who understands your goals — Progress is here to help.
          </p>
          <p 
            className="text-lg mb-8"
            style={{ color: 'var(--dark-grey)' }}
          >
            We specialise in small business accounting, and we're certified Xero accountants too. But most of all, we help our clients grow — with practical, forward-thinking support you won't find anywhere else.
          </p>
          <div className="text-center">
            <a href="#book-call" id="book-call">
              <Button 
                size="lg" 
                style={{ backgroundColor: 'var(--orange)' }}
                className="px-8 py-6 text-lg hover:shadow-md hover:-translate-y-[2px] transition duration-300"
              >
                👉 Let's build your growth engine — book your free discovery call
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
