import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Shield, 
  Users, 
  Award, 
  Sparkles, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BusinessIdentity {
  core?: {
    businessName?: string;
    tagline?: string;
    description?: string;
  };
}

const professionalServices = [
  {
    icon: Calculator,
    title: "Tax Planning & Compliance",
    description: "Strategic tax planning to minimize your liability while ensuring full compliance with current regulations.",
    features: [
      "Annual tax planning strategies",
      "Corporate tax compliance",
      "VAT and payroll tax management",
      "Tax efficient business structures"
    ],
    highlight: "Save up to 30% on tax liability"
  },
  {
    icon: FileText,
    title: "Management Accounts",
    description: "Real-time financial reporting and analysis to help you make informed business decisions.",
    features: [
      "Monthly management reports",
      "Cash flow forecasting",
      "Budget planning & variance analysis",
      "KPI dashboard creation"
    ],
    highlight: "Monthly insights delivered"
  },
  {
    icon: TrendingUp,
    title: "Business Advisory",
    description: "Strategic guidance to accelerate your business growth and improve operational efficiency.",
    features: [
      "Growth strategy development",
      "Financial modeling",
      "Investment planning",
      "Exit strategy planning"
    ],
    highlight: "Accelerate business growth"
  },
  {
    icon: Shield,
    title: "Audit & Assurance",
    description: "Independent verification of your financial statements to build stakeholder confidence.",
    features: [
      "Statutory audits",
      "Internal audit services",
      "Due diligence reviews",
      "Compliance audits"
    ],
    highlight: "Build stakeholder trust"
  },
  {
    icon: Users,
    title: "Payroll Services",
    description: "Complete payroll management ensuring accuracy and compliance with employment law.",
    features: [
      "Monthly payroll processing",
      "PAYE & NI calculations",
      "Auto-enrolment pension schemes",
      "Employee portal access"
    ],
    highlight: "100% accuracy guaranteed"
  },
  {
    icon: BarChart3,
    title: "Financial Planning",
    description: "Comprehensive financial planning to secure your business and personal financial future.",
    features: [
      "Cash flow management",
      "Investment portfolio review",
      "Retirement planning",
      "Risk assessment"
    ],
    highlight: "Secure your financial future"
  }
];

const industries = [
  "Construction & Engineering",
  "Film & Entertainment",
  "Music & Creative Arts",
  "Technology & Software",
  "Healthcare & Medical",
  "Retail & E-commerce",
  "Manufacturing",
  "Professional Services"
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    company: "Mitchell Construction Ltd",
    content: "Progress Accountants transformed our financial management. Their proactive approach saved us thousands in tax and improved our cash flow significantly.",
    rating: 5
  },
  {
    name: "David Chen",
    company: "Chen Digital Solutions",
    content: "The monthly management accounts and advisory services have been invaluable for scaling our tech startup. Highly recommended!",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    company: "Rodriguez Creative Agency",
    content: "Their understanding of the creative industry is exceptional. They've helped us navigate complex project financing and growth strategies.",
    rating: 5
  }
];

export default function ProfessionalServicesPage() {
  const { data: businessIdentity } = useQuery<BusinessIdentity>({
    queryKey: ["/api/business-identity"],
  });

  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";

  return (
    <>
      <Helmet>
        <title>Professional Services - {businessName}</title>
        <meta 
          name="description" 
          content="Comprehensive professional accounting and business advisory services designed to accelerate your business growth and ensure financial success."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/20 via-black to-[#E935C1]/10" />
          <div className="container mx-auto px-6 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 bg-gray-800 text-white border-gray-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Professional Services
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                Expert Financial Solutions for Modern Businesses
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Comprehensive accounting and advisory services designed to accelerate your growth, 
                minimize your tax burden, and secure your financial future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="progress-button-override px-8 py-6 text-lg font-semibold"
                  asChild
                >
                  <Link href="/contact">
                    Get Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-gray-600 text-white hover:bg-gray-800"
                  asChild
                >
                  <Link href="/services">
                    View All Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Services Grid */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Our Professional Services
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  From tax planning to business advisory, we provide the expertise you need to thrive in today's competitive landscape.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {professionalServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-300 group">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-6">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-[#4F46E5]/10 rounded-lg border border-[#4F46E5]/20">
                          <p className="text-sm font-medium text-[#4F46E5]">{service.highlight}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Industries We Serve */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Industries We Serve
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Our expertise spans across multiple industries, allowing us to provide specialized solutions tailored to your sector's unique challenges.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((industry, index) => (
                  <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-[#4F46E5]/50 transition-colors text-center">
                    <span className="text-gray-300 font-medium">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  What Our Clients Say
                </h2>
                <p className="text-xl text-gray-300">
                  Don't just take our word for it - hear from businesses we've helped succeed.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                      <div className="border-t border-gray-700 pt-4">
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-[#4F46E5]/10 to-[#E935C1]/10 rounded-2xl p-12 border border-gray-700">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Schedule a free consultation with our expert team and discover how we can help your business reach its full potential.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="progress-button-override px-8 py-6 text-lg font-semibold"
                    asChild
                  >
                    <Link href="/contact">
                      Book Free Consultation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-6 text-lg border-gray-600 text-white hover:bg-gray-800"
                    asChild
                  >
                    <Link href="/about">
                      Learn About Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}