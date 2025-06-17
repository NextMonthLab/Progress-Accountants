import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, BarChart3, Calculator, CheckCircle, 
  LucideIcon, PieChart, Users, Building, MapPin, PoundSterling, 
  CreditCard, Briefcase, TrendingUp, Download, Mail, X,
  Award, FileText, Sparkles, Shield, Clock, LifeBuoy, Zap
} from "lucide-react";
import { EMBED_FORMS, hasValidEmbedCode, FORM_CONFIG } from "@/utils/embedForms";
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

// Use a CSS-based pound symbol background instead of importing image

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
              className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
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
          <PoundSterling className="h-6 w-6 text-navy" />
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
              className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
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
              className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
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
        <h2 className="text-2xl font-bold text-navy">Contact Information</h2>
        <p className="text-gray-600 mt-2">Complete your details to finish the assessment</p>
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
              className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
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
const ResultsStep = ({ calculatorData, onShowLeadCaptureForm }: { calculatorData: any; onShowLeadCaptureForm: () => void }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to calculate results
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Real calculation logic based on user inputs
  const calculateResults = (data: any): CalculatorResults => {
    // Convert revenue range strings to numerical values
    const parseRevenueRange = (range: string): number => {
      switch (range) {
        case "under_50k": return 35000; // Average for range
        case "50k_100k": return 75000;
        case "100k_250k": return 175000;
        case "250k_500k": return 375000;
        case "500k_1m": return 750000;
        case "1m_5m": return 2500000;
        case "over_5m": return 7500000;
        default: return 0;
      }
    };

    // Convert expense range strings to numerical values
    const parseExpenseRange = (range: string): number => {
      switch (range) {
        case "under_5k": return 3500; // Average for range
        case "5k_10k": return 7500;
        case "10k_25k": return 17500;
        case "25k_50k": return 37500;
        case "50k_100k": return 75000;
        case "over_100k": return 150000;
        default: return 0;
      }
    };

    // Input validation and parsing with safety checks
    const annualRevenue = Math.max(0, parseRevenueRange(data.financials?.annualRevenue || ""));
    const monthlyExpenses = Math.max(0, parseExpenseRange(data.financials?.monthlyExpenses || ""));
    const profitMargin = Math.max(0, Math.min(100, data.financials?.profitMargin || 0));
    const taxRate = Math.max(0, Math.min(100, data.financials?.taxRate || 19));
    const plannedHires = Math.max(0, parseInt(data.growth?.plannedHires) || 0);
    
    // Convert investment range strings to numerical values
    const parseInvestmentRange = (range: string): number => {
      switch (range) {
        case "none": return 0;
        case "under_10k": return 5000; // Average for range
        case "10k_50k": return 30000;
        case "50k_100k": return 75000;
        case "100k_500k": return 300000;
        case "over_500k": return 750000;
        default: return 0;
      }
    };

    // Handle investment amount based on selection
    const plannedInvestment = parseInvestmentRange(data.growth?.plannedInvestment || "");
    
    // Core calculations with safety checks
    const monthlyRevenue = annualRevenue / 12;
    const grossProfit = annualRevenue * (profitMargin / 100);
    const netProfit = grossProfit - (monthlyExpenses * 12);
    const breakEvenMonthly = profitMargin > 0 
      ? monthlyExpenses / (profitMargin / 100)
      : monthlyExpenses; // If no profit margin, break-even equals expenses
    
    // Growth calculations
    const averageHireCost = 35000; // UK average including salary, NI, benefits
    const hiringCosts = plannedHires * averageHireCost;
    const totalInvestment = plannedInvestment + hiringCosts;
    
    // Cash flow forecast (simplified 12-month projection)
    const monthlyNetCashFlow = monthlyRevenue - monthlyExpenses;
    const annualCashFlow = monthlyNetCashFlow * 12 - totalInvestment;
    
    // Tax calculations
    const taxLiability = Math.max(0, netProfit * (taxRate / 100));
    const recommendedTaxReserve = Math.ceil(taxRate + 3); // Add 3% buffer
    
    // Dynamic recommendations based on business profile
    const recommendations: string[] = [];
    
    if (profitMargin < 15) {
      recommendations.push("Profit margin optimization");
      recommendations.push("Cost reduction analysis");
    }
    if (annualCashFlow < 0) {
      recommendations.push("Cash flow management");
      recommendations.push("Growth funding options");
    }
    if (taxLiability > 10000) {
      recommendations.push("Strategic tax planning");
    }
    if (plannedHires > 0) {
      recommendations.push("HR and payroll optimization");
    }
    if (data.businessType.businessType === "limited_company") {
      recommendations.push("Dividend vs salary optimization");
    }
    if (data.businessType.industry === "construction") {
      recommendations.push("CIS compliance management");
    }
    if (data.businessType.industry === "film" || data.businessType.industry === "creative") {
      recommendations.push("Film/Creative tax relief opportunities");
    }
    
    // Ensure we have at least 3 recommendations
    const defaultRecommendations = ["Business forecasting", "Financial planning", "Performance monitoring"];
    while (recommendations.length < 3) {
      const next = defaultRecommendations.find(rec => !recommendations.includes(rec));
      if (next) recommendations.push(next);
      else break;
    }
    
    // Generate dynamic insight
    const generateInsight = () => {
      let insight = `Based on your business profile with £${annualRevenue.toLocaleString()} annual revenue and ${profitMargin}% profit margin, `;
      
      if (profitMargin > 25) {
        insight += "your business shows strong profitability. ";
      } else if (profitMargin > 15) {
        insight += "your business maintains healthy margins. ";
      } else {
        insight += "there's opportunity to improve profitability. ";
      }
      
      if (plannedHires > 0) {
        const hiringImpact = ((hiringCosts / annualRevenue) * 100).toFixed(1);
        insight += `Your planned ${plannedHires} hire(s) will impact cash flow by approximately ${hiringImpact}% of annual revenue. `;
      }
      
      if (annualCashFlow < 0) {
        insight += "Your growth plans may require additional funding or cash flow management. ";
      } else {
        insight += "Your projected cash flow supports your growth plans. ";
      }
      
      // Industry-specific insights
      if (data.businessType.industry === "construction") {
        insight += "As a construction business, ensure CIS compliance and consider seasonal cash flow variations.";
      } else if (data.businessType.industry === "film") {
        insight += "Film industry businesses should explore Film Tax Relief opportunities which could provide significant cash benefits.";
      } else if (data.businessType.industry === "technology") {
        insight += "Tech businesses may benefit from R&D tax credits and should plan for scaling costs.";
      } else {
        insight += "Consider quarterly financial reviews to stay on track with your growth objectives.";
      }
      
      return insight;
    };
    
    return {
      breakEvenPoint: `£${breakEvenMonthly.toLocaleString('en-GB', { maximumFractionDigits: 0 })} per month`,
      cashFlowForecast: annualCashFlow >= 0 
        ? `£${annualCashFlow.toLocaleString('en-GB', { maximumFractionDigits: 0 })} positive over 12 months`
        : `£${Math.abs(annualCashFlow).toLocaleString('en-GB', { maximumFractionDigits: 0 })} shortfall over 12 months`,
      grossProfitMargin: `${profitMargin}%`,
      costToIncomeRatio: monthlyRevenue > 0 
        ? (monthlyExpenses / monthlyRevenue).toFixed(2)
        : "N/A",
      taxSetAside: `${recommendedTaxReserve}%`,
      hiringImpact: plannedHires > 0 
        ? `£${averageHireCost.toLocaleString()} average cost per hire (including NI, benefits, etc.)`
        : "No planned hires",
      recommendedAreas: recommendations,
      insight: generateInsight()
    };
  };

  const results = calculateResults(calculatorData);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-6"
      >
        <div className="w-16 h-16 border-4 border-[#7B3FE4] border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-xl font-medium text-white">Calculating your business forecast...</h3>
        <p className="text-slate-300">Analyzing your inputs and generating personalized insights</p>
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
        <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-[#7B3FE4]" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Business Forecast</h2>
        <p className="text-slate-300 mt-2">
          We've emailed a detailed PDF report to {calculatorData.contact.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Calculator className="h-5 w-5 mr-2 text-[#7B3FE4]" />
              Break-Even Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Current Break-Even Point</p>
                <p className="text-2xl font-semibold text-white">{results.breakEvenPoint}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Gross Profit Margin</p>
                <p className="text-2xl font-semibold text-white">{results.grossProfitMargin}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Cost-to-Income Ratio</p>
                <p className="text-2xl font-semibold text-white">{results.costToIncomeRatio}</p>
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
          className="w-full md:w-auto bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 text-white"
          onClick={() => onShowLeadCaptureForm()}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Full Report
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto border-purple-500 text-purple-400 hover:bg-purple-50/10"
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
        <div className="absolute top-4 left-0 h-1 bg-slate-600 w-full -z-10"></div>
        <div 
          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] transition-all duration-500 -z-10" 
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
                ? 'bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] border-purple-300 text-white' 
                : 'bg-slate-700 border-slate-600 text-slate-400'}`}
            >
              {index + 1 < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="font-medium">{index + 1}</span>
              )}
            </div>
            <div className={`text-xs mt-2 ${index + 1 <= currentStep ? 'text-[#7B3FE4] font-medium' : 'text-slate-500'}`}>
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
  const [showLeadCaptureForm, setShowLeadCaptureForm] = useState(false);
  const [leadFormCompleted, setLeadFormCompleted] = useState(false);
  const [leadCaptureEmbedCode, setLeadCaptureEmbedCode] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (hasValidEmbedCode(EMBED_FORMS.BUSINESS_CALCULATOR_LEAD_FORM)) {
      setLeadCaptureEmbedCode(EMBED_FORMS.BUSINESS_CALCULATOR_LEAD_FORM);
    }
  }, []);
  
  const totalSteps = 4;  // Including results step

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
        return <ResultsStep calculatorData={formData} onShowLeadCaptureForm={() => setShowLeadCaptureForm(true)} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 mb-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/drl0fxrkq/image/upload/v1749050581/Screenshot_2025-06-04_at_16.22.35_khjg5h.png)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-purple-900/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-12 md:px-16 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-4 rounded-full backdrop-blur-sm shadow-lg">
              <Calculator className="h-10 w-10 text-[#7B3FE4]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              📊 Business Finance{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Calculator</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Clarity in minutes. Growth in sight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl p-4 flex items-center shadow-lg backdrop-blur-sm">
                <Clock className="text-[#7B3FE4] h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Takes just 3 minutes</span>
              </div>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl p-4 flex items-center shadow-lg backdrop-blur-sm">
                <FileText className="text-[#7B3FE4] h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Detailed PDF report</span>
              </div>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl p-4 flex items-center shadow-lg backdrop-blur-sm">
                <Shield className="text-[#7B3FE4] h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Expert insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-12 md:px-16 py-8">
        {/* Calculator Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-sm relative"
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white p-3 rounded-full shadow-lg">
            <PoundSterling className="h-6 w-6" />
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
        
        {/* Intro Section - Show only on first step */}
        {currentStep === 1 && (
          <div className="mt-12 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Planning for growth? Feeling uncertain about cash flow?</h2>
            <div className="space-y-6 mb-10">
              <p className="text-slate-300 text-lg leading-relaxed">
                Use our free Business Finance Calculator to gain instant insight into your revenue, expenses, profit margins, and future projections. Ideal for small businesses across the UK who want to plan ahead with confidence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-[#7B3FE4] mr-3 flex-shrink-0" />
                  <span>Understand your monthly cash flow</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-[#7B3FE4] mr-3 flex-shrink-0" />
                  <span>Visualise your profit potential</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-[#7B3FE4] mr-3 flex-shrink-0" />
                  <span>Identify gaps before they become problems</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-[#7B3FE4] mr-3 flex-shrink-0" />
                  <span>Build a clear financial narrative for investors or lenders</span>
                </div>
              </div>
              <p className="text-slate-300 text-lg italic">
                No spreadsheet headaches. No downloads. Just answers.
              </p>
            </div>
          </div>
        )}

        {/* Tool Features Section - Show only on first step */}
        {currentStep === 1 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white text-center mb-6">Tool Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#7B3FE4] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Built for SMEs</h4>
                  <p className="text-slate-300">Designed around real-world business needs</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#7B3FE4] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Easy inputs</h4>
                  <p className="text-slate-300">Just enter revenue, costs, and growth expectations</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#7B3FE4] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Real-time results</h4>
                  <p className="text-slate-300">Instantly see forecasts, margins, and insights</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#7B3FE4] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Export options</h4>
                  <p className="text-slate-300">Save your results or share with your accountant</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Who It's For Section - Show only on first step */}
        {currentStep === 1 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white text-center mb-6">Who It's For</h3>
            <p className="text-slate-300 text-center mb-6">This calculator is perfect for:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-slate-300">
                <span className="mr-3">•</span>
                <span>Small business owners planning for growth</span>
              </div>
              <div className="flex items-center text-slate-300">
                <span className="mr-3">•</span>
                <span>Startups pitching to investors</span>
              </div>
              <div className="flex items-center text-slate-300">
                <span className="mr-3">•</span>
                <span>Creatives, contractors, and freelancers budgeting for the year ahead</span>
              </div>
              <div className="flex items-center text-slate-300">
                <span className="mr-3">•</span>
                <span>Anyone trying to make more confident financial decisions</span>
              </div>
            </div>
          </div>
        )}

        {/* Expert Support Section - Show only on first step */}
        {currentStep === 1 && (
          <div className="mt-12 max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-4">Expert Support Available</h3>
            <p className="text-slate-300 mb-6">
              Need help interpreting your results? Progress Accountants offers free discovery calls to walk you through your figures and build a custom growth strategy.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 font-medium"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight size={16} />
            </a>
          </div>
        )}

        {/* Benefits Section - Show only on first step */}
        {currentStep === 1 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Why Use Our Business Finance Calculator?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-white">
                    <Zap className="h-5 w-5 mr-2 text-[#7B3FE4]" />
                    Instant Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">Get immediate financial projections based on your specific business data</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-white">
                    <Shield className="h-5 w-5 mr-2 text-[#7B3FE4]" />
                    Expert Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">Powered by our accountants' expertise across multiple industries</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-white">
                    <FileText className="h-5 w-5 mr-2 text-[#7B3FE4]" />
                    Detailed Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">Receive a comprehensive PDF with actionable recommendations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Testimonials - Show only on first two steps */}
        {currentStep <= 2 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-6">What Our Clients Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 shadow-lg hover:shadow-purple-500/25 transition-all">
                <CardContent className="pt-6">
                  <p className="italic text-slate-300 mb-4">
                    "The calculator highlighted tax savings opportunities we'd never considered. We implemented the recommendations and saved over £15,000 in the first year alone."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mr-3">
                      <span className="font-semibold text-[#7B3FE4]">MB</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Michael Brown</p>
                      <p className="text-sm text-slate-400">Filmhouse Productions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 border border-slate-600/50 shadow-lg hover:shadow-purple-500/25 transition-all">
                <CardContent className="pt-6">
                  <p className="italic text-slate-300 mb-4">
                    "As a growing construction business, cash flow is everything. This calculator gave us the clarity we needed to plan our expansion with confidence."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mr-3">
                      <span className="font-semibold text-[#7B3FE4]">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Sarah Johnson</p>
                      <p className="text-sm text-slate-400">Cornerstone Building Ltd</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Disclaimer Section */}
        <div className="mt-16 max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Disclaimer</h3>
            <p className="text-slate-300 text-sm">
              This calculator is for informational use only and does not constitute financial advice. For tailored forecasting or tax planning, please speak to one of our advisors.
            </p>
          </div>
        </div>

        {/* SEO Footer */}
        <div className="mt-8 max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            Progress Accountants – Expert Business Forecasting Tools and Strategic Support for SMEs across Banbury, Oxford, London, and the UK.
          </p>
        </div>
      </div>

      {/* Lead Capture Form Modal */}
      {showLeadCaptureForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-600/30">
              <h3 className="text-2xl font-bold text-white">Complete to Download Your Report</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                onClick={() => setShowLeadCaptureForm(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-6">
              {leadCaptureEmbedCode ? (
                <div className="space-y-4">
                  <div 
                    className="w-full"
                    style={{ minHeight: FORM_CONFIG.defaultHeight }}
                    dangerouslySetInnerHTML={{ __html: leadCaptureEmbedCode }}
                  />
                  <div className="text-center pt-4 border-t border-slate-600/30">
                    <p className="text-slate-400 text-sm mb-3">
                      Having trouble with the form? You can still download your report:
                    </p>
                    <Button
                      onClick={() => {
                        setLeadFormCompleted(true);
                        setShowLeadCaptureForm(false);
                        toast({ title: "Download started", description: "Your business forecast report is being prepared." });
                      }}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-50/10"
                    >
                      Skip Form & Download Report
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h4 className="text-xl font-semibold text-white mb-4">Download Your Business Analysis</h4>
                  <p className="text-slate-300 mb-6">
                    Your personalized business analysis report is ready for download.
                  </p>
                  <Button
                    onClick={() => {
                      setLeadFormCompleted(true);
                      setShowLeadCaptureForm(false);
                      toast({ title: "Download started", description: "Your business forecast report is being prepared." });
                    }}
                    className="bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:shadow-lg hover:shadow-purple-500/25 text-white"
                    size="lg"
                  >
                    Download Business Analysis Report
                  </Button>
                  <p className="text-slate-400 text-sm mt-4">
                    PDF report includes your calculated metrics and business insights
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCalculatorPage;