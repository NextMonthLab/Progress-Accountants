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
          backgroundImage: `url('/images/calculator-pound-bg.png')`,
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
          <h2 className="text-2xl font-bold text-navy mb-6">
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-4">
            Our interactive business forecast calculator is currently being updated with new features. Please check back soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCalculatorPage;