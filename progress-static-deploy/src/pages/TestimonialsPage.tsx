import { Link } from "wouter";
import { Star, Quote, ArrowRight } from "lucide-react";

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "David Mitchell",
      company: "Mitchell Construction Ltd",
      role: "Managing Director",
      content: "Progress Accountants transformed our financial management. Their expertise in construction industry accounting has saved us thousands in tax through proper CIS handling and strategic planning.",
      rating: 5
    },
    {
      name: "Sarah Pemberton",
      company: "Pemberton Film Productions",
      role: "Producer",
      content: "The team's knowledge of film tax relief has been invaluable to our productions. They handle all our accounting needs professionally and efficiently, allowing us to focus on creating great content.",
      rating: 5
    },
    {
      name: "James Wilson",
      company: "Wilson & Associates",
      role: "Senior Partner",
      content: "Outstanding service from day one. Their proactive approach to tax planning and monthly management reports have given us complete confidence in our financial position.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      company: "Creative Sound Studios",
      role: "Studio Owner",
      content: "Progress Accountants understands the music industry like no other firm we've worked with. Their guidance on royalty accounting and business structure has been game-changing.",
      rating: 5
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
              Client <span className="text-primary-600">Testimonials</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Hear from our satisfied clients about how we've helped transform their business finances and drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg relative">
                <Quote className="h-8 w-8 text-primary-600 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-primary-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Growing Businesses
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "150+", label: "Active Clients" },
              { number: "7+", label: "Years Experience" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "24hr", label: "Average Response Time" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Satisfied Clients
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Experience the difference expert accounting services can make for your business.
          </p>
          <Link href="/contact" className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
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