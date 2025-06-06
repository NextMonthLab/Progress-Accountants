import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Info, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from 'react-error-boundary';

// Define the business identity interface
interface BusinessIdentity {
  core: {
    businessName: string;
    tagline: string;
    description: string;
    language: string; // Website language setting
  };
  market: {
    primaryIndustry: string;
    targetAudience: string;
    geographicFocus: string;
  };
  products: {
    services: string[]; // List of services offered
    priceRange: string; // General price range indicator
    deliveryMethod: string; // How services are delivered
  };
  personality: {
    toneOfVoice: string[];
    usps: string[];
    competitors: string;
  };
  team: {
    size: string;
    workingStyle: string;
    values: string;
  };
  lastUpdated: string;
}

// Default business identity values
const defaultBusinessIdentity: BusinessIdentity = {
  core: {
    businessName: "Progress Accountants",
    tagline: "Modern accounting. Real results.",
    description: "We're accountants who understand modern business needs. We combine traditional expertise with innovative technology to help businesses grow.",
    language: "en-GB", // Default language is British English
  },
  market: {
    primaryIndustry: "Accounting & Tax Planning",
    targetAudience: "Small businesses, Startups, Contractors",
    geographicFocus: "UK, Oxfordshire",
  },
  products: {
    services: ["Tax Planning & Preparation", "Bookkeeping", "Business Advisory", "Financial Reporting", "Cloud Accounting"],
    priceRange: "Mid-range to Premium",
    deliveryMethod: "Online and In-person",
  },
  personality: {
    toneOfVoice: ["Professional", "Approachable", "Clear", "Helpful"],
    usps: ["Tech-driven solutions", "Personal advisory approach", "Fixed-fee transparency", "Industry specialization"],
    competitors: "Traditional accountancy firms, Big 4 accounting services",
  },
  team: {
    size: "15-20",
    workingStyle: "Hybrid",
    values: "Client-focused, innovative, collaborative, integrity-driven, continuously learning",
  },
  lastUpdated: new Date().toISOString(),
};

// Industry options for dropdown
const industryOptions = [
  "Accounting & Tax Planning",
  "Financial Advisory",
  "Business Consulting",
  "SME Advisory",
  "Tax Compliance",
  "Bookkeeping Services",
  "Audit Services",
  "Other"
];

// Working style options for dropdown
const workingStyleOptions = [
  "In-person",
  "Hybrid",
  "Remote",
  "Flexible"
];

// Language options for the website
const languageOptions = [
  { value: "en-GB", label: "English (UK)" },
  { value: "en-US", label: "English (US)" },
  { value: "fr-FR", label: "French" },
  { value: "es-ES", label: "Spanish" },
  { value: "de-DE", label: "German" },
  { value: "it-IT", label: "Italian" },
  { value: "nl-NL", label: "Dutch" },
  { value: "pt-PT", label: "Portuguese" },
  { value: "sv-SE", label: "Swedish" },
  { value: "da-DK", label: "Danish" },
  { value: "fi-FI", label: "Finnish" },
  { value: "no-NO", label: "Norwegian" },
];

// Tone of voice options
const toneOptions = [
  "Professional",
  "Approachable",
  "Clear",
  "Helpful",
  "Friendly",
  "Direct",
  "Reassuring",
  "Authoritative",
  "Conversational",
  "Technical",
  "Simple",
  "Enthusiastic"
];

// Delivery method options for dropdown
const deliveryMethodOptions = [
  "In-person only",
  "Online only",
  "Online and In-person",
  "On-site at client location",
  "Hybrid approach"
];

// Price range options for dropdown
const priceRangeOptions = [
  "Budget",
  "Mid-range",
  "Mid-range to Premium",
  "Premium",
  "Custom / Quote-based"
];

// Error fallback component
function BusinessIdentityError() {
  return (
    <Card className="my-8 border-red-200">
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-700 dark:text-red-400">Business Profile Error</CardTitle>
        </div>
        <CardDescription className="text-red-600/80 dark:text-red-300/80">
          There was a problem loading your business profile
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-slate-700 dark:text-slate-300">
          We encountered an error while loading your business profile data. This could be due to a temporary issue.
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Retry Loading Profile
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main wrapper component with proper error handling
export default function BusinessIdentityPage() {
  // Flag for client-side rendering to prevent suspense errors
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  
  // Set client-side rendering flag when component mounts
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  // Show loading state until client-side rendering is ready
  if (!isClientLoaded) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading business profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Once client is loaded, render the full component with error boundary
  return (
    <ErrorBoundary FallbackComponent={BusinessIdentityError}>
      <BusinessIdentityContent />
    </ErrorBoundary>
  );
}

// The actual content component
function BusinessIdentityContent() {
  const { toast } = useToast();
  
  // State for business identity
  const [businessIdentity, setBusinessIdentity] = useState<BusinessIdentity>(defaultBusinessIdentity);
  
  // State for new USP, tone and service inputs
  const [newUsp, setNewUsp] = useState('');
  const [newTone, setNewTone] = useState('');
  const [newService, setNewService] = useState('');
  
  // State for save success
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load business identity data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('system_context.business_identity');
    if (savedData) {
      try {
        let parsedData = JSON.parse(savedData);
        
        // Handle case where saved data might not have the products field
        // This ensures backward compatibility with older saved data
        if (!parsedData.products) {
          parsedData = {
            ...parsedData,
            products: {
              services: ["Tax Planning & Preparation", "Bookkeeping", "Business Advisory", "Financial Reporting", "Cloud Accounting"],
              priceRange: "Mid-range to Premium",
              deliveryMethod: "Online and In-person",
            }
          };
        }
        
        setBusinessIdentity(parsedData);
      } catch (error) {
        console.error('Error parsing stored business identity data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your saved business identity data.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);
  
  // Handle input changes for nested properties
  const handleInputChange = (
    section: keyof BusinessIdentity,
    field: string,
    value: string | string[]
  ) => {
    setBusinessIdentity(prev => {
      const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
      newBusinessIdentity[section][field] = value;
      return newBusinessIdentity;
    });
  };
  
  // Handle tone of voice selection
  const toggleTone = (tone: string) => {
    setBusinessIdentity(prev => {
      const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
      
      if (newBusinessIdentity.personality.toneOfVoice.includes(tone)) {
        newBusinessIdentity.personality.toneOfVoice = newBusinessIdentity.personality.toneOfVoice.filter(
          (t: string) => t !== tone
        );
      } else {
        newBusinessIdentity.personality.toneOfVoice.push(tone);
      }
      
      return newBusinessIdentity;
    });
  };
  
  // Add custom tone
  const addCustomTone = () => {
    if (newTone.trim() && !businessIdentity.personality.toneOfVoice.includes(newTone.trim())) {
      setBusinessIdentity(prev => {
        const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
        newBusinessIdentity.personality.toneOfVoice.push(newTone.trim());
        return newBusinessIdentity;
      });
      
      setNewTone('');
    }
  };
  
  // Add USP
  const addUsp = () => {
    if (newUsp.trim() && !businessIdentity.personality.usps.includes(newUsp.trim())) {
      setBusinessIdentity(prev => {
        const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
        newBusinessIdentity.personality.usps.push(newUsp.trim());
        return newBusinessIdentity;
      });
      
      setNewUsp('');
    }
  };
  
  // Remove USP
  const removeUsp = (uspToRemove: string) => {
    setBusinessIdentity(prev => {
      const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
      newBusinessIdentity.personality.usps = newBusinessIdentity.personality.usps.filter(
        (usp: string) => usp !== uspToRemove
      );
      return newBusinessIdentity;
    });
  };
  
  // Add service
  const addService = () => {
    if (newService.trim() && !businessIdentity.products.services.includes(newService.trim())) {
      setBusinessIdentity(prev => {
        const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
        newBusinessIdentity.products.services.push(newService.trim());
        return newBusinessIdentity;
      });
      
      setNewService('');
    }
  };
  
  // Remove service
  const removeService = (serviceToRemove: string) => {
    setBusinessIdentity(prev => {
      const newBusinessIdentity = JSON.parse(JSON.stringify(prev));
      newBusinessIdentity.products.services = newBusinessIdentity.products.services.filter(
        (service: string) => service !== serviceToRemove
      );
      return newBusinessIdentity;
    });
  };
  
  // Save the business identity
  const saveBusinessIdentity = () => {
    setIsLoading(true);
    
    // Format the data with the latest timestamp
    const updatedBusinessIdentity = JSON.parse(JSON.stringify(businessIdentity));
    updatedBusinessIdentity.lastUpdated = new Date().toISOString();
    
    try {
      // Save to localStorage
      localStorage.setItem('system_context.business_identity', JSON.stringify(updatedBusinessIdentity));
      
      // Update the state to reflect the save
      setBusinessIdentity(updatedBusinessIdentity);
      setSavedSuccessfully(true);
      
      // Show success toast
      toast({
        title: "Business Identity Saved",
        description: "Your business identity information has been successfully updated.",
        variant: "default",
      });
      
      // Reset saved message after a delay
      setTimeout(() => {
        setSavedSuccessfully(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving business identity:', error);
      
      toast({
        title: "Save Failed",
        description: "There was an error saving your business identity information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all business identity information to the default values? This cannot be undone.')) {
      setBusinessIdentity(defaultBusinessIdentity);
      
      toast({
        title: "Reset Complete",
        description: "Business identity information has been reset to default values. Save to apply these changes.",
        variant: "default",
      });
    }
  };
  
  // Format the last updated date
  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Never';
    }
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <Helmet>
        <title>Business Identity | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-[var(--navy)] dark:text-gray-100 mb-3">Business Identity</h1>
          
          <Alert className="mb-6 dark:bg-blue-900/20 dark:border-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle>Internal Use Only</AlertTitle>
            <AlertDescription>
              This page defines who you are as a business. NextMonth uses this to tailor your homepage, content, emails, and more.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {formatLastUpdated(businessIdentity.lastUpdated)}
          </div>
          
          <Accordion type="single" collapsible className="w-full" defaultValue="core">
            {/* Core Business Details Section */}
            <AccordionItem value="core">
              <AccordionTrigger className="text-lg font-medium">
                Core Business Details
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        value={businessIdentity.core.businessName} 
                        onChange={(e) => handleInputChange('core', 'businessName', e.target.value)}
                        placeholder="Your company name"
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">The official name of your business.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Company Tagline</Label>
                      <Input 
                        id="tagline" 
                        value={businessIdentity.core.tagline} 
                        onChange={(e) => handleInputChange('core', 'tagline', e.target.value)}
                        placeholder="A short, memorable phrase that captures your essence"
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Keep this short and impactful, like you'd use on a business card.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description / Elevator Pitch</Label>
                      <Textarea 
                        id="description" 
                        value={businessIdentity.core.description} 
                        onChange={(e) => handleInputChange('core', 'description', e.target.value)}
                        placeholder="Brief description of what your business does and what makes it special"
                        rows={3}
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Imagine explaining your business in 30 seconds to someone unfamiliar with it.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Website Language</Label>
                      <Select 
                        value={businessIdentity.core.language || "en-GB"}
                        onValueChange={(value) => handleInputChange('core', 'language', value)}
                      >
                        <SelectTrigger id="language" className="dark:bg-gray-900 dark:border-gray-700">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          {languageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This sets the language for the website's spell checking and localization. Helps avoid false spelling errors for non-English content.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Market & Audience Section */}
            <AccordionItem value="market">
              <AccordionTrigger className="text-lg font-medium">
                Market & Audience
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryIndustry">Primary Industry</Label>
                      <Select 
                        value={businessIdentity.market.primaryIndustry}
                        onValueChange={(value) => handleInputChange('market', 'primaryIndustry', value)}
                      >
                        <SelectTrigger id="primaryIndustry" className="dark:bg-gray-900 dark:border-gray-700">
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          {industryOptions.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 dark:text-gray-400">The main industry your business operates in.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Target Audience / Client Types</Label>
                      <Input 
                        id="targetAudience" 
                        value={businessIdentity.market.targetAudience} 
                        onChange={(e) => handleInputChange('market', 'targetAudience', e.target.value)}
                        placeholder="e.g., Small businesses, Startups, Contractors, etc."
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Who are your ideal clients? List multiple client types if applicable.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="geographicFocus">Geographic Focus</Label>
                      <Input 
                        id="geographicFocus" 
                        value={businessIdentity.market.geographicFocus} 
                        onChange={(e) => handleInputChange('market', 'geographicFocus', e.target.value)}
                        placeholder="e.g., UK, London, National, International, etc."
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Where do you primarily operate or serve clients?</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Products & Services Section */}
            <AccordionItem value="products">
              <AccordionTrigger className="text-lg font-medium">
                Products & Services
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label>Services Offered</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {businessIdentity.products.services.map((service, index) => (
                          <Badge 
                            key={index} 
                            className="px-3 py-1 flex items-center gap-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            {service}
                            <button 
                              onClick={() => removeService(service)}
                              className="ml-1 rounded-full p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input 
                          value={newService} 
                          onChange={(e) => setNewService(e.target.value)}
                          placeholder="Add a service"
                          className="dark:bg-gray-900 dark:border-gray-700"
                        />
                        <Button 
                          onClick={addService}
                          size="sm" 
                          className="flex-shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add all the services your business offers.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priceRange">General Price Range</Label>
                      <Select 
                        value={businessIdentity.products.priceRange}
                        onValueChange={(value) => handleInputChange('products', 'priceRange', value)}
                      >
                        <SelectTrigger id="priceRange" className="dark:bg-gray-900 dark:border-gray-700">
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          {priceRangeOptions.map(range => (
                            <SelectItem key={range} value={range}>{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 dark:text-gray-400">This helps with market positioning and targeting appropriate clients.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryMethod">Delivery Method</Label>
                      <Select 
                        value={businessIdentity.products.deliveryMethod}
                        onValueChange={(value) => handleInputChange('products', 'deliveryMethod', value)}
                      >
                        <SelectTrigger id="deliveryMethod" className="dark:bg-gray-900 dark:border-gray-700">
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          {deliveryMethodOptions.map(method => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 dark:text-gray-400">How do you typically provide your services to clients?</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Brand Personality Section */}
            <AccordionItem value="personality">
              <AccordionTrigger className="text-lg font-medium">
                Brand Personality
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label>Tone of Voice</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {toneOptions.map((tone) => (
                          <Badge 
                            key={tone} 
                            variant={businessIdentity.personality.toneOfVoice.includes(tone) ? "default" : "outline"}
                            className={`px-3 py-1 cursor-pointer ${
                              businessIdentity.personality.toneOfVoice.includes(tone) 
                                ? "bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white dark:bg-teal-700 dark:text-white" 
                                : "hover:bg-slate-100 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => toggleTone(tone)}
                          >
                            {tone}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Input 
                          value={newTone} 
                          onChange={(e) => setNewTone(e.target.value)}
                          placeholder="Add custom tone"
                          className="dark:bg-gray-900 dark:border-gray-700"
                        />
                        <Button 
                          onClick={addCustomTone}
                          size="sm" 
                          className="flex-shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Select the tones that best represent how your brand communicates.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Unique Selling Points (USPs)</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {businessIdentity.personality.usps.map((usp, index) => (
                          <Badge 
                            key={index} 
                            className="px-3 py-1 flex items-center gap-1.5 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                          >
                            {usp}
                            <button 
                              onClick={() => removeUsp(usp)}
                              className="ml-1 rounded-full p-0.5 hover:bg-amber-100 dark:hover:bg-amber-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input 
                          value={newUsp} 
                          onChange={(e) => setNewUsp(e.target.value)}
                          placeholder="Add a USP"
                          className="dark:bg-gray-900 dark:border-gray-700"
                        />
                        <Button 
                          onClick={addUsp}
                          size="sm" 
                          className="flex-shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">What makes your business different from competitors?</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="competitors">Main Competitors</Label>
                      <Textarea 
                        id="competitors" 
                        value={businessIdentity.personality.competitors} 
                        onChange={(e) => handleInputChange('personality', 'competitors', e.target.value)}
                        placeholder="List your main competitors or types of competitors"
                        rows={2}
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This helps understand your market position. List specific businesses or types of competitors.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Team & Culture Section */}
            <AccordionItem value="team">
              <AccordionTrigger className="text-lg font-medium">
                Team & Culture
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="size">Team Size</Label>
                      <Input 
                        id="size" 
                        value={businessIdentity.team.size} 
                        onChange={(e) => handleInputChange('team', 'size', e.target.value)}
                        placeholder="e.g., 1-5, 5-10, 10-20, etc."
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Approximate size of your team.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workingStyle">Working Style</Label>
                      <Select 
                        value={businessIdentity.team.workingStyle}
                        onValueChange={(value) => handleInputChange('team', 'workingStyle', value)}
                      >
                        <SelectTrigger id="workingStyle" className="dark:bg-gray-900 dark:border-gray-700">
                          <SelectValue placeholder="Select working style" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800">
                          {workingStyleOptions.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 dark:text-gray-400">How your team typically works (in-office, remote, etc.).</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="values">Company Values</Label>
                      <Textarea 
                        id="values" 
                        value={businessIdentity.team.values} 
                        onChange={(e) => handleInputChange('team', 'values', e.target.value)}
                        placeholder="List your core company values (e.g., innovation, integrity, customer-focus, etc.)"
                        rows={3}
                        className="dark:bg-gray-900 dark:border-gray-700"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">The principles that guide your business decisions and culture.</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 border-t pt-6 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              Reset to Defaults
            </Button>
            
            <div className="flex items-center gap-4">
              {savedSuccessfully && (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saved successfully
                </div>
              )}
              
              <Button 
                onClick={saveBusinessIdentity}
                disabled={isLoading}
                className="bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Business Identity
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}