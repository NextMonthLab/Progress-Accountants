import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
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
import { Badge } from "@/components/ui/badge";
import { Info, Plus, X, Save, Eye, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Define the homepage context interface
interface HomepageContext {
  headline: string;
  subheading: string;
  offer: string;
  benefits: string[];
  cta_text: string;
  media_url: string;
  layout_style: string;
}

// Default homepage context values
const defaultHomepageContext: HomepageContext = {
  headline: "Modern accounting for growing businesses",
  subheading: "Expert support when you need it most",
  offer: "Tax support for UK-based businesses and entrepreneurs",
  benefits: ["Fast turnaround", "Expert advice", "Local support"],
  cta_text: "Book a Call",
  media_url: "",
  layout_style: "Modern"
};

// Layout style options
const layoutStyles = [
  "Modern",
  "Classic",
  "Bold",
  "Minimalist",
  "Corporate"
];

export default function HomepageSetupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // State for homepage context
  const [homepage, setHomepage] = useState<HomepageContext>(defaultHomepageContext);
  
  // State for benefit input
  const [newBenefit, setNewBenefit] = useState('');
  
  // State for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State for save success and loading
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for media file
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Load homepage context data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.homepage');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setHomepage(parsedData);
        if (parsedData.media_url) {
          setPreviewUrl(parsedData.media_url);
        }
      } catch (error) {
        console.error('Error parsing stored homepage data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your saved homepage data.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);
  
  // Handle input changes
  const handleInputChange = (field: keyof HomepageContext, value: string) => {
    setHomepage(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Add benefit
  const addBenefit = () => {
    if (newBenefit.trim() && homepage.benefits.length < 3) {
      setHomepage(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    } else if (homepage.benefits.length >= 3) {
      toast({
        title: "Maximum Benefits Reached",
        description: "You can only add up to 3 business benefits.",
        variant: "default",
      });
    }
  };
  
  // Remove benefit
  const removeBenefit = (benefitToRemove: string) => {
    setHomepage(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };
  
  // Handle media file selection
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      // For demo purposes, create an object URL
      // In a real app, you'd upload this to a server and get a URL back
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      handleInputChange('media_url', objectUrl);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!homepage.headline.trim()) {
      newErrors.headline = "Headline is required";
    }
    
    if (!homepage.subheading.trim()) {
      newErrors.subheading = "Subheading is required";
    }
    
    if (!homepage.offer.trim()) {
      newErrors.offer = "Core offer is required";
    }
    
    if (homepage.benefits.length === 0) {
      newErrors.benefits = "At least one benefit is required";
    }
    
    if (!homepage.cta_text.trim()) {
      newErrors.cta_text = "Call to action text is required";
    }
    
    if (!homepage.layout_style) {
      newErrors.layout_style = "Layout style is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Save the homepage context
  const saveHomepage = () => {
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('project_context.homepage', JSON.stringify(homepage));
      
      // Update the state to reflect the save
      setSavedSuccessfully(true);
      
      // Show success toast
      toast({
        title: "Homepage Setup Saved",
        description: "Your homepage information has been successfully saved.",
        variant: "default",
      });
      
      // Reset saved message after a delay
      setTimeout(() => {
        setSavedSuccessfully(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving homepage data:', error);
      
      toast({
        title: "Save Failed",
        description: "There was an error saving your homepage information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Preview the homepage with current data
  const previewHomepage = () => {
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields to preview.",
        variant: "destructive",
      });
      return;
    }
    
    // For now, just display a toast message
    // In a real application, this would open a preview modal or navigate to a preview page
    toast({
      title: "Preview Ready",
      description: "Your homepage preview would appear here. This feature is coming soon!",
      variant: "default",
    });
  };
  
  // Continue to next step
  const continueToNext = () => {
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    // Save one more time before proceeding
    localStorage.setItem('project_context.homepage', JSON.stringify(homepage));
    
    // Navigate to the foundation pages overview
    // This would be replaced with the actual next page in the flow
    toast({
      title: "Setup Complete",
      description: "Homepage setup complete! Proceeding to Foundation Pages.",
      variant: "default",
    });
    
    // Navigate to the foundation pages overview
    setLocation('/foundation-pages');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Homepage Setup | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">Welcome to your Homepage Setup</CardTitle>
            <CardDescription className="text-gray-100">
              This is the first step in your Growth System. Let's define the key message your website will deliver.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Required Setup</AlertTitle>
              <AlertDescription>
                This step cannot be skipped. The information collected here will be used to create your homepage.
              </AlertDescription>
            </Alert>
            
            {/* Headline & Subheading */}
            <Card>
              <CardHeader>
                <CardTitle>Page Headline & Subheading</CardTitle>
                <CardDescription>
                  Define the main message visitors will see first on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">
                    Headline <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="headline" 
                    value={homepage.headline} 
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    placeholder="What's the bold first thing visitors should read?"
                    rows={2}
                    className={errors.headline ? 'border-red-500' : ''}
                  />
                  {errors.headline && (
                    <p className="text-red-500 text-sm">{errors.headline}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Keep it short, clear, and impactful. This is your first impression.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subheading">
                    Subheading <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="subheading" 
                    value={homepage.subheading} 
                    onChange={(e) => handleInputChange('subheading', e.target.value)}
                    placeholder="Additional supporting text that expands on your headline"
                    rows={2}
                    className={errors.subheading ? 'border-red-500' : ''}
                  />
                  {errors.subheading && (
                    <p className="text-red-500 text-sm">{errors.subheading}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Provide more context or detail about your value proposition
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Core Offer & Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Core Offer & Benefits</CardTitle>
                <CardDescription>
                  Define what you're offering and why it matters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="offer">
                    Core Offer or Promise <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="offer" 
                    value={homepage.offer} 
                    onChange={(e) => handleInputChange('offer', e.target.value)}
                    placeholder="e.g. Tax support for UK-based creatives"
                    rows={2}
                    className={errors.offer ? 'border-red-500' : ''}
                  />
                  {errors.offer && (
                    <p className="text-red-500 text-sm">{errors.offer}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    What specific service or value do you provide? Be clear and specific.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>
                    Business Benefits (up to 3) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {homepage.benefits.map(benefit => (
                      <Badge
                        key={benefit}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm py-1.5"
                      >
                        {benefit}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => removeBenefit(benefit)}
                        />
                      </Badge>
                    ))}
                  </div>
                  {errors.benefits && (
                    <p className="text-red-500 text-sm">{errors.benefits}</p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Add a benefit e.g. Fast turnaround" 
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                      disabled={homepage.benefits.length >= 3}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBenefit}
                      disabled={!newBenefit.trim() || homepage.benefits.length >= 3}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    What makes your service valuable? Add up to 3 key benefits.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Call to Action & Media */}
            <Card>
              <CardHeader>
                <CardTitle>Call to Action & Visual</CardTitle>
                <CardDescription>
                  Set your primary action button and optional hero image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_text">
                    Primary Call to Action (CTA) <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="cta_text" 
                    value={homepage.cta_text} 
                    onChange={(e) => handleInputChange('cta_text', e.target.value)}
                    placeholder="e.g. Book a Call, Get Started, Learn More"
                    className={errors.cta_text ? 'border-red-500' : ''}
                  />
                  {errors.cta_text && (
                    <p className="text-red-500 text-sm">{errors.cta_text}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    What action do you want visitors to take? Keep it action-oriented.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="media_upload">Hero Image or Video (optional)</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      id="media_upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="w-full"
                    />
                    
                    {previewUrl && (
                      <div className="mt-2 relative rounded-md overflow-hidden border border-gray-200">
                        {previewUrl.includes('video') ? (
                          <video 
                            src={previewUrl} 
                            controls 
                            className="max-h-64 mx-auto"
                          />
                        ) : (
                          <img 
                            src={previewUrl} 
                            alt="Hero preview" 
                            className="max-h-64 mx-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload a high-quality image or short video to feature on your homepage.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Layout Style */}
            <Card>
              <CardHeader>
                <CardTitle>Layout & Style</CardTitle>
                <CardDescription>
                  Choose how your homepage will look and feel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="layout_style">
                    Layout/Style Preset <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={homepage.layout_style}
                    onValueChange={(value) => handleInputChange('layout_style', value)}
                  >
                    <SelectTrigger 
                      id="layout_style"
                      className={errors.layout_style ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {layoutStyles.map(style => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.layout_style && (
                    <p className="text-red-500 text-sm">{errors.layout_style}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    This determines the overall look and feel of your homepage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 bg-gray-50 rounded-b-lg">
            <div className="w-full sm:w-auto flex justify-center sm:justify-start">
              {savedSuccessfully && (
                <span className="text-green-600 flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Saved successfully
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={saveHomepage}
                disabled={isLoading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Homepage
                  </span>
                )}
              </Button>
              
              <Button
                onClick={previewHomepage}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Draft
              </Button>
              
              <Button
                onClick={continueToNext}
                className="w-full sm:w-auto bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}