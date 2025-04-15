import { Card, CardContent } from "@/components/ui/card";

export default function WhyUsSection() {
  const benefits = [
    "Fixed pricing, no surprises",
    "Seamless onboarding",
    "Straight-talking advice",
    "Fast replies from real people",
    "Real-time insight into your financial performance"
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 text-white" style={{ backgroundColor: 'var(--navy)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-poppins font-bold text-2xl md:text-4xl mb-4">
            Clarity. Confidence. Control.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column: bullet points */}
          <div>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div style={{ color: 'var(--orange)' }} className="text-xl mr-3">✓</div>
                  <p className="text-lg">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right column: dashboard mockup and testimonial */}
          <Card className="bg-white text-black">
            <CardContent className="p-8">
              <div 
                className="rounded-lg p-6 mb-6"
                style={{ backgroundColor: 'var(--light-grey)' }}
              >
                {/* Dashboard mockup */}
                <div className="h-48 flex flex-col">
                  <div 
                    className="font-semibold mb-2"
                    style={{ color: 'var(--navy)' }}
                  >
                    FINANCIAL DASHBOARD
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Revenue</div>
                      <div 
                        className="text-lg font-semibold"
                        style={{ color: 'var(--navy)' }}
                      >
                        £85,240
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-sm text-gray-500">Expenses</div>
                      <div 
                        className="text-lg font-semibold"
                        style={{ color: 'var(--navy)' }}
                      >
                        £42,350
                      </div>
                    </div>
                  </div>
                  <div className="h-16 bg-white rounded shadow-sm mb-2"></div>
                  <div className="text-xs text-gray-500 italic">
                    Your custom financial dashboard - updated in real-time
                  </div>
                </div>
              </div>
              
              {/* Testimonial */}
              <div 
                className="italic text-lg"
                style={{ color: 'var(--dark-grey)' }}
              >
                "Since joining Progress, I understand my numbers, I've built a podcast audience, and I've made smarter decisions every month."
              </div>
              <div className="mt-3 font-semibold">
                — Sarah Thompson, Innovate Studios
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
