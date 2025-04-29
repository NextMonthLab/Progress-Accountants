import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, BarChart3, Calculator, CheckCircle, 
  LucideIcon, PieChart, Users, Building, MapPin, DollarSign, 
  CreditCard, Briefcase, TrendingUp, Download, Mail,
  Award, FileText, Sparkles, Shield, Clock, LifeBuoy, Zap
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import calculatorBgImage from "@assets/calculator-pound-bg.png";

// Define the form schema for each step
const businessTypeSchema = z.object({
  businessType: z.enum(["limited", "sole-trader", "partnership"], {
    required_error: "Please select a business type",
  }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  turnover: z.string().min(1, { message: "Please select an annual turnover range" }),
  staffCount: z.string().min(1, { message: "Please enter the number of staff" }),
  region: z.string().min(1, { message: "Please select your region" }),
});

// Continue copying the rest of the file here...
const financialsSchema = z.object({
  monthlyIncome: z.string().min(1, { message: "Please enter your monthly income" }),
  fixedCosts: z.string().min(1, { message: "Please enter your fixed costs" }),
  variableCosts: z.string().min(1, { message: "Please enter your variable costs" }),
  paymentIssues: z.boolean().default(false),
  vatRegistered: z.boolean().default(false),
});

const growthSchema = z.object({
  growthTarget: z.string().min(1, { message: "Please select a growth target" }),
  plannedHires: z.string().default("0"),
  averageSalary: z.string().default("0"),
  plannedInvestment: z.boolean().default(false),
  investmentType: z.string().optional(),
  investmentAmount: z.string().optional(),
  riskTolerance: z.number().min(0).max(100).default(50),
});

const contactSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to receive your calculator results",
  }),
});

// Combined schema types
type BusinessTypeFormValues = z.infer<typeof businessTypeSchema>;
type FinancialsFormValues = z.infer<typeof financialsSchema>;
type GrowthFormValues = z.infer<typeof growthSchema>;
type ContactFormValues = z.infer<typeof contactSchema>;

// Result calculation types
type CalculatorResults = {
  breakEvenPoint: string;
  cashFlowForecast: string;
  grossProfitMargin: string;
  costToIncomeRatio: string;
  taxSetAside: string;
  hiringImpact: string;
  recommendedAreas: string[];
  insight: string;
};

// Define the step interface
interface StepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  defaultValues?: any;
}

// Step 1: Business Type
const BusinessTypeStep = ({ onNext, defaultValues }: StepProps) => {
  const form = useForm<BusinessTypeFormValues>({
    resolver: zodResolver(businessTypeSchema),
    defaultValues: defaultValues || {
      businessType: undefined,
      industry: "",
      turnover: "",
      staffCount: "",
      region: "",
    },
  });

  const industries = [
    "Technology", "Retail", "Manufacturing", "Construction", 
    "Healthcare", "Hospitality", "Professional Services", 
    "Media & Entertainment", "Education", "Financial Services",
    "Real Estate", "Transportation", "Agriculture", "Other"
  ];

  const turnoverRanges = [
    "Under £50,000", 
    "£50,000 - £100,000", 
    "£100,000 - £250,000", 
    "£250,000 - £500,000", 
    "£500,000 - £1 million",
    "£1 million - £5 million",
    "Over £5 million"
  ];

  const regions = [
    "London", "South East", "South West", "East of England", 
    "West Midlands", "East Midlands", "Yorkshire and the Humber", 
    "North West", "North East", "Scotland", "Wales", "Northern Ireland"
  ];
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

// Step 4: Contact Information
const ContactStep = ({ onNext, onBack, defaultValues }: StepProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      agreeTerms: false,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="bg-navy/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-navy" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Get Your Full Report</h2>
        <p className="text-gray-600 mt-2">We'll email you a detailed PDF with your business forecast and recommendations</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll send your results to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    For a follow-up call if you'd like to discuss your results
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to receive my business forecast calculator results and occasional helpful resources from Progress Accountants
                  </FormLabel>
                  <FormDescription>
                    You can unsubscribe at any time
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Get My Results
              <BarChart3 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

// Results Component
const ResultsStep = ({ calculatorData }: { calculatorData: any }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to calculate results
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock calculation results
  const results: CalculatorResults = {
    breakEvenPoint: "£8,750 per month",
    cashFlowForecast: "£23,400 positive over 12 months",
    grossProfitMargin: "32%",
    costToIncomeRatio: "0.68",
    taxSetAside: "22%",
    hiringImpact: "£37,500 cost per hire (including NI, benefits, etc.)",
    recommendedAreas: [
      "Cash flow management",
      "Tax planning",
      "Pricing strategy review",
      "Growth funding options"
    ],
    insight: `Based on your inputs, your business is running lean with good profit margins, but your growth plans will require careful cash flow management. With planned hires and investment, your break-even point will shift by approximately 18%. We recommend reviewing your pricing strategy within the next quarter and exploring R&D tax credits which could provide additional funding for your growth plans.`
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-6"
      >
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-xl font-medium text-navy">Calculating your business forecast...</h3>
        <p className="text-gray-600">Analyzing your inputs and generating personalized insights</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Your Business Forecast</h2>
        <p className="text-gray-600 mt-2">
          We've emailed a detailed PDF report to {calculatorData.contact.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-orange-500" />
              Break-Even Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Break-Even Point</p>
                <p className="text-2xl font-semibold text-navy">{results.breakEvenPoint}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gross Profit Margin</p>
                <p className="text-2xl font-semibold text-navy">{results.grossProfitMargin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost-to-Income Ratio</p>
                <p className="text-2xl font-semibold text-navy">{results.costToIncomeRatio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Growth Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Cash Flow Forecast (12 months)</p>
                <p className="text-2xl font-semibold text-navy">{results.cashFlowForecast}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Recommended Tax Set-Aside</p>
                <p className="text-2xl font-semibold text-navy">{results.taxSetAside}</p>
              </div>
              {calculatorData.growth.plannedHires !== "0" && (
                <div>
                  <p className="text-sm text-gray-500">Hiring Impact</p>
                  <p className="text-2xl font-semibold text-navy">{results.hiringImpact}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-orange-500" />
            Business Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-navy">{results.insight}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Focus Areas</CardTitle>
          <CardDescription>Based on your business profile and growth plans</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.recommendedAreas.map((area, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
        <Button 
          className="w-full md:w-auto bg-navy hover:bg-navy/90 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Full Report
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          Schedule a Free 15-Min Call
        </Button>
      </div>
    </motion.div>
  );
};

// Progressive Stepper
const ProgressStepper = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className={`w-8 h-8 rounded-full flex items-center justify-center ${index + 1 <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {index + 1}
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
        <div 
          className="absolute top-0 h-1 bg-orange-500 transition-all duration-300" 
          style={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
        ></div>
      </div>
    </div>
  );
};

// Main Calculator Page Component
const BusinessCalculatorPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: {},
    financials: {},
    growth: {},
    contact: {},
  });
  const { toast } = useToast();
  
  const totalSteps = 5;  // Including results step

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Set page metadata
    document.title = "Smart Business Forecast Calculator | Progress Accountants";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Get a real-time financial pulse check tailored to your business—plus actionable insights in under 3 minutes.");
    }
  }, []);

  const handleNextStep = (data: any) => {
    const updatedFormData = { ...formData };
    
    // Update specific section of form data
    if (currentStep === 1) {
      updatedFormData.businessType = data;
    } else if (currentStep === 2) {
      updatedFormData.financials = data;
    } else if (currentStep === 3) {
      updatedFormData.growth = data;
    } else if (currentStep === 4) {
      updatedFormData.contact = data;
      
      // Here we would normally submit the data to the server
      toast({
        title: "Form submitted successfully",
        description: "Your business forecast is being calculated",
      });
    }
    
    setFormData(updatedFormData);
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section with Pound Sterling Background */}
      <div 
        className="relative py-16 md:py-24 mb-8" 
        style={{ 
          backgroundImage: `url(${calculatorBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-[var(--navy)] opacity-80"></div>
        
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Smart Business Forecast Calculator
            </h1>
            <p className="text-xl text-gray-200">
              Think beyond spreadsheets. Get a real-time financial pulse check tailored to your business—plus actionable insights in under 3 minutes.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-8 py-8">

        {/* Calculator Container */}
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
          {currentStep < totalSteps && (
            <ProgressStepper currentStep={currentStep} totalSteps={totalSteps - 1} />
          )}

          {currentStep === 1 && (
            <BusinessTypeStep 
              onNext={handleNextStep} 
              defaultValues={formData.businessType} 
            />
          )}
          
          {currentStep === 2 && (
            <FinancialsStep 
              onNext={handleNextStep} 
              onBack={handleBackStep} 
              defaultValues={formData.financials} 
            />
          )}
          
          {currentStep === 3 && (
            <GrowthStep 
              onNext={handleNextStep} 
              onBack={handleBackStep} 
              defaultValues={formData.growth} 
            />
          )}
          
          {currentStep === 4 && (
            <ContactStep 
              onNext={handleNextStep} 
              onBack={handleBackStep} 
              defaultValues={formData.contact} 
            />
          )}
          
          {currentStep === 5 && (
            <ResultsStep calculatorData={formData} />
          )}
        </div>
        
        {/* Social Proof */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Trusted by UK Business Owners</h2>
            <p className="text-gray-600 mt-2">Join hundreds of businesses who use our calculators and insights</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"The calculator gave me clarity on my break-even point and cash flow needs. It helped me plan my growth strategy with confidence."</p>
                <div className="mt-4">
                  <p className="font-medium text-navy">Sarah Thompson</p>
                  <p className="text-sm text-gray-500">Retail Business Owner, London</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Not just numbers, but actual insights about how my hiring plans would impact the business. Incredibly useful for planning my next moves."</p>
                <div className="mt-4">
                  <p className="font-medium text-navy">Mark Davies</p>
                  <p className="text-sm text-gray-500">Technology Startup, Manchester</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"I've been using spreadsheets for years, but this calculator gave me insights I hadn't considered. The tax planning recommendations alone were worth it."</p>
                <div className="mt-4">
                  <p className="font-medium text-navy">James Wilson</p>
                  <p className="text-sm text-gray-500">Construction Company, Birmingham</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-navy text-lg mb-2">How accurate is this calculator?</h3>
                <p className="text-gray-700">
                  The calculator provides a strategic overview based on the information you provide. While it uses industry-standard formulas and projections, it's meant as a planning tool rather than a replacement for full financial analysis. For detailed financial modeling, we recommend speaking with one of our accountants.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-navy text-lg mb-2">Is my data secure?</h3>
                <p className="text-gray-700">
                  Yes, all data is transmitted securely and we don't store your financial details on our servers beyond what's needed to generate your report. Your privacy is important to us.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-navy text-lg mb-2">Can I use this calculator if I'm just starting a business?</h3>
                <p className="text-gray-700">
                  Absolutely! The calculator can help you understand startup costs, break-even points, and funding requirements. If you don't have historical data, use your best estimates based on research and industry standards.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-navy text-lg mb-2">What happens after I submit my information?</h3>
                <p className="text-gray-700">
                  You'll immediately see summary results on screen, and we'll email you a detailed PDF report with in-depth analysis. There's no obligation, but our team is available if you'd like to discuss your results or explore how we can help implement the recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCalculatorPage;
