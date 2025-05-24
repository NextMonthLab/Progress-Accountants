import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Import the pound symbol background image
import poundSymbolBg from "../assets/pound-symbol-bg.png";

// Type definitions
type BusinessFormValues = {
  businessType: string;
  industry: string;
  employeeCount: string;
  businessStage: string;
};

type FinancialsFormValues = {
  annualRevenue: string;
  monthlyExpenses: string;
  profitMargin: number;
  taxRate: number;
};

type GrowthFormValues = {
  growthTarget: string;
  plannedInvestment: string;
  plannedHires: string;
  fundsNeeded: string;
};

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  agreeTerms: boolean;
};

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

type StepProps = {
  onNext: (data: any) => void;
  onBack?: () => void;
  defaultValues?: any;
};

// Zod schemas for validation
const businessSchema = z.object({
  businessType: z.string().min(1, { message: "Please select a business type" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  employeeCount: z.string().min(1, { message: "Please select employee count" }),
  businessStage: z.string().min(1, { message: "Please select business stage" }),
});

const financialsSchema = z.object({
  annualRevenue: z.string().min(1, { message: "Please enter your annual revenue" }),
  monthlyExpenses: z.string().min(1, { message: "Please enter your monthly expenses" }),
  profitMargin: z.number().min(0).max(100),
  taxRate: z.number().min(0).max(100),
});

const growthSchema = z.object({
  growthTarget: z.string().min(1, { message: "Please select a growth target" }),
  plannedInvestment: z.string().min(1, { message: "Please select planned investment" }),
  plannedHires: z.string().min(1, { message: "Please select planned hires" }),
  fundsNeeded: z.string().min(1, { message: "Please select funding needs" }),
});

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to receive your results",
  }),
});

// Step 1: Business Type and Information
const BusinessTypeStep = ({ onNext, defaultValues }: StepProps) => {
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: defaultValues || {
      businessType: "",
      industry: "",
      employeeCount: "",
      businessStage: "",
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
          <Building className="h-6 w-6 text-navy" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Tell us about your business</h2>
        <p className="text-gray-600 mt-2">This helps us tailor the calculator to your specific needs</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="limited_company">Limited Company</SelectItem>
                    <SelectItem value="sole_trader">Sole Trader</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                    <SelectItem value="self_employed">Self-Employed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="film_tv">Film & TV</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="construction">Construction & Building</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="financial_services">Financial Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="employeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee count" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="just_me">Just Me</SelectItem>
                      <SelectItem value="2_5">2-5</SelectItem>
                      <SelectItem value="6_10">6-10</SelectItem>
                      <SelectItem value="11_20">11-20</SelectItem>
                      <SelectItem value="21_50">21-50</SelectItem>
                      <SelectItem value="50_plus">50+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="startup">Startup (0-2 years)</SelectItem>
                      <SelectItem value="growing">Growing (2-5 years)</SelectItem>
                      <SelectItem value="established">Established (5+ years)</SelectItem>
                      <SelectItem value="expanding">Expanding to new markets</SelectItem>
                      <SelectItem value="mature">Mature business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

// Step 2: Financial Information
const FinancialsStep = ({ onNext, onBack, defaultValues }: StepProps) => {
  const form = useForm<FinancialsFormValues>({
    resolver: zodResolver(financialsSchema),
    defaultValues: defaultValues || {
      annualRevenue: "",
      monthlyExpenses: "",
      profitMargin: 15,
      taxRate: 19,
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
          <DollarSign className="h-6 w-6 text-navy" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Financial Information</h2>
        <p className="text-gray-600 mt-2">Share your current financial picture to receive accurate forecasts</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="annualRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Revenue</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select annual revenue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="under_50k">Under £50,000</SelectItem>
                      <SelectItem value="50k_100k">£50,000 - £100,000</SelectItem>
                      <SelectItem value="100k_250k">£100,000 - £250,000</SelectItem>
                      <SelectItem value="250k_500k">£250,000 - £500,000</SelectItem>
                      <SelectItem value="500k_1m">£500,000 - £1 million</SelectItem>
                      <SelectItem value="1m_5m">£1 million - £5 million</SelectItem>
                      <SelectItem value="over_5m">Over £5 million</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Expenses</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select monthly expenses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="under_5k">Under £5,000</SelectItem>
                      <SelectItem value="5k_10k">£5,000 - £10,000</SelectItem>
                      <SelectItem value="10k_25k">£10,000 - £25,000</SelectItem>
                      <SelectItem value="25k_50k">£25,000 - £50,000</SelectItem>
                      <SelectItem value="50k_100k">£50,000 - £100,000</SelectItem>
                      <SelectItem value="over_100k">Over £100,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="profitMargin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Profit Margin (%): {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription>
                  Your current profit margin percentage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Corporation Tax Rate (%): {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={0}
                    max={40}
                    step={1}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription>
                  UK standard rate is 19% for small profits and 25% for profits over £250,000
                </FormDescription>
                <FormMessage />
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
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

// Step 3: Growth Plans
const GrowthStep = ({ onNext, onBack, defaultValues }: StepProps) => {
  const form = useForm<GrowthFormValues>({
    resolver: zodResolver(growthSchema),
    defaultValues: defaultValues || {
      growthTarget: "",
      plannedInvestment: "",
      plannedHires: "",
      fundsNeeded: "",
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
          <TrendingUp className="h-6 w-6 text-navy" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Growth Plans</h2>
        <p className="text-gray-600 mt-2">Tell us about your future business plans</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <FormField
            control={form.control}
            name="growthTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revenue Growth Target (Next 12 Months)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select growth target" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maintain">Maintain current revenue</SelectItem>
                    <SelectItem value="up_10">Up to 10% growth</SelectItem>
                    <SelectItem value="10_25">10-25% growth</SelectItem>
                    <SelectItem value="25_50">25-50% growth</SelectItem>
                    <SelectItem value="50_100">50-100% growth</SelectItem>
                    <SelectItem value="double">Double revenue or more</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="plannedInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Investment (Next 12 Months)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select planned investment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No major investments planned</SelectItem>
                      <SelectItem value="under_10k">Under £10,000</SelectItem>
                      <SelectItem value="10k_50k">£10,000 - £50,000</SelectItem>
                      <SelectItem value="50k_100k">£50,000 - £100,000</SelectItem>
                      <SelectItem value="100k_500k">£100,000 - £500,000</SelectItem>
                      <SelectItem value="over_500k">Over £500,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plannedHires"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned New Hires (Next 12 Months)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select planned hires" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">No new hires planned</SelectItem>
                      <SelectItem value="1_2">1-2 new employees</SelectItem>
                      <SelectItem value="3_5">3-5 new employees</SelectItem>
                      <SelectItem value="6_10">6-10 new employees</SelectItem>
                      <SelectItem value="11_20">11-20 new employees</SelectItem>
                      <SelectItem value="over_20">Over 20 new employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fundsNeeded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Funding Consideration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding needs" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not_needed">Not considering external funding</SelectItem>
                    <SelectItem value="considering">Considering options</SelectItem>
                    <SelectItem value="actively_seeking">Actively seeking funding</SelectItem>
                    <SelectItem value="secured">Already secured funding</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
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
    <div className="w-full mb-10 mt-4">
      <div className="flex justify-between mb-3 relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 h-1 bg-gray-200 w-full -z-10"></div>
        <div 
          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 -z-10" 
          style={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
        ></div>
        
        {/* Step indicators */}
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="text-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md border-2 
              ${index + 1 <= currentStep 
                ? 'bg-orange-500 border-orange-300 text-white' 
                : 'bg-white border-gray-200 text-gray-400'}`}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="font-medium">{index + 1}</span>
              )}
            </div>
            <div className={`text-xs mt-2 ${index + 1 <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
              {index === 0 ? 'Business' : 
               index === 1 ? 'Financial' : 
               index === 2 ? 'Growth' : 'Contact'}
            </div>
          </div>
        ))}
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

  // Render the current step based on currentStep value
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessTypeStep onNext={handleNextStep} defaultValues={formData.businessType} />;
      case 2:
        return <FinancialsStep onNext={handleNextStep} onBack={handleBackStep} defaultValues={formData.financials} />;
      case 3:
        return <GrowthStep onNext={handleNextStep} onBack={handleBackStep} defaultValues={formData.growth} />;
      case 4:
        return <ContactStep onNext={handleNextStep} onBack={handleBackStep} defaultValues={formData.contact} />;
      case 5:
        return <ResultsStep calculatorData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Hero Section with Pound Symbol Background */}
      <div 
        className="relative py-20 md:py-28 mb-12" 
        style={{ 
          backgroundImage: `url(${poundSymbolBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/85 to-[var(--navy)]/60"></div>
        
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 bg-orange-500/20 p-3 rounded-full backdrop-blur-sm">
              <Calculator className="h-10 w-10 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl" style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}>
              Smart Business Forecast Calculator
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}>
              Think beyond spreadsheets. Get a real-time financial pulse check tailored to your business—plus actionable insights in under 3 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center border border-white/10 shadow-lg">
                <Clock className="text-orange-400 h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-white text-sm" style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}>Takes just 3 minutes</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center border border-white/10 shadow-lg">
                <FileText className="text-orange-400 h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-white text-sm" style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}>Detailed PDF report</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center border border-white/10 shadow-lg">
                <Shield className="text-orange-400 h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-white text-sm" style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}>Expert insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-8 py-8">
        {/* Calculator Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl border-t-4 border-orange-500 shadow-xl relative"
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white p-3 rounded-full shadow-lg">
            <DollarSign className="h-6 w-6" />
          </div>
          
          {/* Progress Stepper */}
          {currentStep <= totalSteps - 1 && (
            <ProgressStepper currentStep={currentStep} totalSteps={totalSteps - 1} />
          )}
          
          {/* Step Content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </motion.div>
        
        {/* Benefits Section - Show only on first step */}
        {currentStep === 1 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy text-center mb-6">Why Use Our Business Forecast Calculator?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-50 border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-orange-500" />
                    Instant Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Get immediate financial projections based on your specific business data</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-orange-500" />
                    Expert Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Powered by our accountants' expertise across multiple industries</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-500" />
                    Detailed Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Receive a comprehensive PDF with actionable recommendations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Testimonials - Show only on first two steps */}
        {currentStep <= 2 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy text-center mb-6">What Our Clients Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <p className="italic text-gray-600 mb-4">
                    "The calculator highlighted tax savings opportunities we'd never considered. We implemented the recommendations and saved over £15,000 in the first year alone."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <span className="font-semibold text-orange-600">MB</span>
                    </div>
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-sm text-gray-500">Filmhouse Productions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <p className="italic text-gray-600 mb-4">
                    "As a growing construction business, cash flow is everything. This calculator gave us the clarity we needed to plan our expansion with confidence."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mr-3">
                      <span className="font-semibold text-navy">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Cornerstone Building Ltd</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCalculatorPage;