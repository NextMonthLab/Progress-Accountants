import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Shield, 
  Users, 
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
    title: "📊 Cash Flow You Can Count On",
    description: "We help you forecast confidently, set aside for tax, and get paid on time—without chasing your tail.",
    features: [
      "Reliable cash flow forecasting",
      "Tax reserve planning",
      "Payment tracking systems",
      "Invoice management automation"
    ],
    highlight: "Predictable financial planning"
  },
  {
    icon: FileText,
    title: "💼 Project Profitability Tracking",
    description: "Whether you charge hourly or by project, we'll help you break down earnings, expenses, and margins so you know what's working.",
    features: [
      "Time-based billing analysis",
      "Project cost breakdown",
      "Margin tracking by client",
      "Profitability reporting"
    ],
    highlight: "Know your real margins"
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
  }
];

export default function ProfessionalServicesPage() {
  const { data: businessIdentity } = useQuery<BusinessIdentity>({
    queryKey: ["/api/business-identity"],
  });

  const businessName = businessIdentity?.core?.businessName || "Progress Accountants";

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/20 via-black to-[#E935C1]/10" />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-gray-800 text-white border-gray-700">
              <Sparkles className="w-4 h-4 mr-2" />
              💼 Industry Specialists
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Specialist Accounting for Professional Services
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Helping you plan, price, and grow—without losing track of your finances.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="progress-button-override px-8 py-6 text-lg font-semibold"
                asChild
              >
                <Link href="/contact">
                  Book a Free Consultation
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
                  Explore Our Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              From consultants and coaches to creative agencies and legal professionals—Progress supports service-led businesses with the clarity, confidence, and financial tools they need to thrive.
            </p>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              We understand the realities of time-based billing, project fees, fluctuating cash flow, and scaling service teams. Our accounting is designed to help you stay focused on clients—while we handle the numbers.
            </p>
            <p className="text-sm text-purple-400 font-medium">
              📍 Based in Banbury. Serving professional service businesses across the UK.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Professional Service Firms Choose Progress
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From cash flow management to project profitability tracking, we provide the clarity you need to grow confidently.
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
  );
}