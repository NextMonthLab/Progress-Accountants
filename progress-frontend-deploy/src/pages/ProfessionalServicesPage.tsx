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
    title: "🧾 Tax Planning for Service Models",
    description: "We help service businesses stay efficient—whether you're a sole trader, LLP, or limited company with staff and contractors.",
    features: [
      "Business structure optimisation",
      "Contractor vs employee guidance",
      "Tax-efficient payment strategies",
      "Annual planning reviews"
    ],
    highlight: "Tailored to your business model"
  },
  {
    icon: Shield,
    title: "🔐 Secure Client Data Handling",
    description: "We set up smart systems for managing sensitive documents and payments—especially if you deal with confidential client data.",
    features: [
      "Secure document management",
      "Payment processing setup",
      "Data protection compliance",
      "Client confidentiality protocols"
    ],
    highlight: "GDPR compliant systems"
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
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050351/Business_Owner_Presenting_Annual_Sales_Accounting_Reports_With_Investors_original_2609109_zt1n1z.jpg"
            alt="Business presentation background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "Progress helped us finally understand where our profit really comes from. Their insight helped us shift focus and grow."
                </p>
                <p className="text-purple-400 font-medium">— Marketing Consultant, Oxfordshire</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "Hands down the most proactive accountants we've worked with. Clear advice, no jargon, and always one step ahead."
                </p>
                <p className="text-purple-400 font-medium">— Business Coach, Warwickshire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Types Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Agencies, Advisors, and Consultants</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                We work with a wide range of professional service businesses, including:
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">Business consultants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">Marketing & PR agencies</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">Legal professionals</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">Coaches and educators</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">Training providers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">HR and recruitment firms</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#E935C1] flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300">Architects and creative professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Support Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-6xl mx-auto bg-gray-900 rounded-xl shadow-md border border-gray-800 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content side */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Tech-Forward Support</h2>
                <p className="text-gray-300 mb-6">
                  We use cloud platforms like Xero to automate your invoicing, payments, and reporting—freeing you up to focus on client work.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <BarChart3 className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Live income dashboards</p>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Time/project-based expense tracking</p>
                  </div>
                  <div className="flex items-start">
                    <Calculator className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Real-time tax estimates</p>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-purple-400 mr-3 shrink-0 mt-1" />
                    <p className="text-gray-300">Automation for invoicing and payment reminders</p>
                  </div>
                </div>
              </div>
              
              {/* Image side */}
              <div className="relative lg:min-h-[400px] flex items-center justify-center bg-gray-800">
                <div className="p-6 w-full h-full flex items-center justify-center">
                  <img 
                    src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050354/image_sigbl2.png"
                    alt="Professional services management dashboard and analytics"
                    className="w-full h-auto max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-[#4F46E5]/10 to-[#E935C1]/10 rounded-2xl p-12 border border-gray-700">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                📞 Book a Free Finance Strategy Call
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Let's explore how Progress can help you run a more profitable, less stressful service business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="progress-button-override px-8 py-6 text-lg font-semibold"
                  asChild
                >
                  <Link href="/contact">
                    Book a Consultation
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
                    View Our Services
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