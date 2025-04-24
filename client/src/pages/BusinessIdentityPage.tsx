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
import { X, Plus, Save, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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

export default function BusinessIdentityPage() {
  const { toast } = useToast();
  
  // State for business identity
  const [businessIdentity, setBusinessIdentity] = useState<BusinessIdentity>(defaultBusinessIdentity);
  
  // State for new USP and tone inputs
  const [newUsp, setNewUsp] = useState('');
  const [newTone, setNewTone] = useState('');
  
  // State for save success
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load business identity data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('system_context.business_identity');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
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
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Business Identity | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-[var(--navy)] mb-3">Business Identity</h1>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Internal Use Only</AlertTitle>
            <AlertDescription>
              This page defines who you are as a business. NextMonth uses this to tailor your homepage, content, emails, and more.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-gray-500 mb-8">
            Last updated: {formatLastUpdated(businessIdentity.lastUpdated)}
          </div>
          
          <Accordion type="single" collapsible className="w-full" defaultValue="core">
            {/* Core Business Details Section */}
            <AccordionItem value="core">
              <AccordionTrigger className="text-lg font-medium">
                Core Business Details
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        value={businessIdentity.core.businessName} 
                        onChange={(e) => handleInputChange('core', 'businessName', e.target.value)}
                        placeholder="Your company name"
                      />
                      <p className="text-sm text-gray-500">The official name of your business.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Company Tagline</Label>
                      <Input 
                        id="tagline" 
                        value={businessIdentity.core.tagline} 
                        onChange={(e) => handleInputChange('core', 'tagline', e.target.value)}
                        placeholder="A short, memorable phrase that captures your essence"
                      />
                      <p className="text-sm text-gray-500">Keep this short and impactful, like you'd use on a business card.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description / Elevator Pitch</Label>
                      <Textarea 
                        id="description" 
                        value={businessIdentity.core.description} 
                        onChange={(e) => handleInputChange('core', 'description', e.target.value)}
                        placeholder="Brief description of what your business does and what makes it special"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500">Imagine explaining your business in 30 seconds to someone unfamiliar with it.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Website Language</Label>
                      <Select 
                        value={businessIdentity.core.language || "en-GB"}
                        onValueChange={(value) => handleInputChange('core', 'language', value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
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
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryIndustry">Primary Industry / Sector</Label>
                      <Select 
                        value={businessIdentity.market.primaryIndustry}
                        onValueChange={(value) => handleInputChange('market', 'primaryIndustry', value)}
                      >
                        <SelectTrigger id="primaryIndustry">
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">The main sector your business operates in.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Input 
                        id="targetAudience" 
                        value={businessIdentity.market.targetAudience} 
                        onChange={(e) => handleInputChange('market', 'targetAudience', e.target.value)}
                        placeholder="E.g. Small businesses, Startups, Contractors"
                      />
                      <p className="text-sm text-gray-500">Who are your ideal clients? Be as specific as possible.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="geographicFocus">Geographic Focus</Label>
                      <Input 
                        id="geographicFocus" 
                        value={businessIdentity.market.geographicFocus} 
                        onChange={(e) => handleInputChange('market', 'geographicFocus', e.target.value)}
                        placeholder="E.g. UK, Oxfordshire, National"
                      />
                      <p className="text-sm text-gray-500">Where are your clients primarily located?</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            {/* Personality & Positioning Section */}
            <AccordionItem value="personality">
              <AccordionTrigger className="text-lg font-medium">
                Personality & Positioning
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label>Tone of Voice</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {toneOptions.map(tone => (
                          <Badge
                            key={tone}
                            variant="outline"
                            className={`cursor-pointer ${
                              businessIdentity.personality.toneOfVoice.includes(tone) 
                                ? 'bg-[var(--orange)] text-white hover:bg-[var(--orange)]' 
                                : 'bg-transparent hover:bg-gray-100'
                            }`}
                            onClick={() => toggleTone(tone)}
                          >
                            {tone}
                            {businessIdentity.personality.toneOfVoice.includes(tone) && (
                              <X className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add custom tone..." 
                          value={newTone}
                          onChange={(e) => setNewTone(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomTone()}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomTone}
                          disabled={!newTone.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Select words that describe how your business communicates.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Unique Selling Points (USPs)</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {businessIdentity.personality.usps.map(usp => (
                          <Badge
                            key={usp}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            {usp}
                            <X 
                              className="ml-1 h-3 w-3 cursor-pointer" 
                              onClick={() => removeUsp(usp)}
                            />
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add unique selling point..." 
                          value={newUsp}
                          onChange={(e) => setNewUsp(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addUsp()}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addUsp}
                          disabled={!newUsp.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">What makes your business stand out from competitors?</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="competitors">Competitor Alternatives</Label>
                      <Input 
                        id="competitors" 
                        value={businessIdentity.personality.competitors} 
                        onChange={(e) => handleInputChange('personality', 'competitors', e.target.value)}
                        placeholder="Main competitors or alternative services"
                      />
                      <p className="text-sm text-gray-500">Optional - helps position your business against alternatives.</p>
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
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Input 
                        id="teamSize" 
                        value={businessIdentity.team.size} 
                        onChange={(e) => handleInputChange('team', 'size', e.target.value)}
                        placeholder="Approximate number of team members"
                      />
                      <p className="text-sm text-gray-500">Optional - helps establish scale.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workingStyle">Working Style</Label>
                      <Select 
                        value={businessIdentity.team.workingStyle}
                        onValueChange={(value) => handleInputChange('team', 'workingStyle', value)}
                      >
                        <SelectTrigger id="workingStyle">
                          <SelectValue placeholder="Select working style" />
                        </SelectTrigger>
                        <SelectContent>
                          {workingStyleOptions.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">How your team primarily works together.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="values">Values or Culture Notes</Label>
                      <Textarea 
                        id="values" 
                        value={businessIdentity.team.values} 
                        onChange={(e) => handleInputChange('team', 'values', e.target.value)}
                        placeholder="Key values and culture descriptions"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500">What principles guide your team? What's your work environment like?</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </Button>
            
            <div className="flex items-center gap-4">
              {savedSuccessfully && (
                <span className="text-green-600 flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Saved successfully
                </span>
              )}
              
              <Button
                onClick={saveBusinessIdentity}
                disabled={isLoading}
                className="bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white"
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