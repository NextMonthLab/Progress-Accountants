import React, { useState, useEffect, startTransition, Suspense } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define the homepage context interface
interface HomepageContext {
  headline: string;
  subheading: string;
  offer: string;
  benefits: string[];
  cta_text: string;
  media_url: string;
  layout_style: string;
  services?: string[]; // Optional array of services
  testimonials?: string[]; // Optional array of testimonials
}

// Default homepage context values
const defaultHomepageContext: HomepageContext = {
  headline: "Modern accounting for growing businesses",
  subheading: "Expert support when you need it most",
  offer: "Tax support for UK-based businesses and entrepreneurs",
  benefits: ["Fast turnaround", "Expert advice", "Local support"],
  cta_text: "Book a Call",
  media_url: "",
  layout_style: "Modern",
  services: [], // Initialize with empty array
  testimonials: [] // Initialize with empty array
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
  
  // State for preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Check for Tools Only users and redirect if needed
  useEffect(() => {
    // Check if user is a "tools_only" user
    const homepagePreference = localStorage.getItem('project_context.homepage_preference');
    
    if (homepagePreference === 'tools_only') {
      toast({
        title: "Tools Only Mode Detected",
        description: "Looks like you chose to keep your own website. Redirecting to Tools Hub instead.",
        duration: 5000,
      });
      
      // Wait a moment to show the toast before redirecting
      setTimeout(() => {
        setLocation('/tools-hub');
      }, 1500);
      
      return;
    }
    
    // Load homepage context data from localStorage on component mount
    const savedData = localStorage.getItem('project_context.homepage');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        startTransition(() => {
          setHomepage(parsedData);
          if (parsedData.media_url) {
            setPreviewUrl(parsedData.media_url);
          }
        });
      } catch (error) {
        console.error('Error parsing stored homepage data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your saved homepage data.",
          variant: "destructive",
        });
      }
    }
  }, [toast, setLocation]);
  
  // Handle input changes
  const handleInputChange = (field: keyof HomepageContext, value: string) => {
    startTransition(() => {
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
    });
  };
  
  // Add benefit
  const addBenefit = () => {
    if (newBenefit.trim() && homepage.benefits.length < 3) {
      startTransition(() => {
        setHomepage(prev => ({
          ...prev,
          benefits: [...prev.benefits, newBenefit.trim()]
        }));
        setNewBenefit('');
      });
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
    startTransition(() => {
      setHomepage(prev => ({
        ...prev,
        benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
      }));
    });
  };
  
  // Handle media file selection
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      startTransition(() => {
        setMediaFile(file);
        
        // For demo purposes, create an object URL
        // In a real app, you'd upload this to a server and get a URL back
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        handleInputChange('media_url', objectUrl);
      });
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
    
    startTransition(() => {
      setErrors(newErrors);
    });
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
    
    startTransition(() => {
      setIsLoading(true);
    });
    
    try {
      // Save to localStorage
      localStorage.setItem('project_context.homepage', JSON.stringify(homepage));
      
      // Update the state to reflect the save
      startTransition(() => {
        setSavedSuccessfully(true);
      });
      
      // Show success toast
      toast({
        title: "Homepage Setup Saved",
        description: "Your homepage information has been successfully saved.",
        variant: "default",
      });
      
      // Reset saved message after a delay
      setTimeout(() => {
        startTransition(() => {
          setSavedSuccessfully(false);
        });
      }, 3000);
    } catch (error) {
      console.error('Error saving homepage data:', error);
      
      toast({
        title: "Save Failed",
        description: "There was an error saving your homepage information. Please try again.",
        variant: "destructive",
      });
    } finally {
      startTransition(() => {
        setIsLoading(false);
      });
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
    
    // Open the preview modal
    startTransition(() => {
      setIsPreviewOpen(true);
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>}>
      <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Homepage Setup | Onboarding</title>
      </Helmet>
      
      {/* Homepage Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Homepage Preview</DialogTitle>
            <DialogDescription>
              This is how your homepage will look with the current settings
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Heads up:</AlertTitle>
            <AlertDescription>
              This is a basic layout preview to give you a general sense of structure. Your final site will include real images, videos, and styling.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            {/* Preview of the homepage based on selected layout style */}
            <div className={`preview-container border rounded-lg overflow-hidden ${
              homepage.layout_style === 'Modern' ? 'preview-modern' :
              homepage.layout_style === 'Classic' ? 'preview-classic' :
              homepage.layout_style === 'Bold' ? 'preview-bold' :
              homepage.layout_style === 'Minimalist' ? 'preview-minimalist' :
              'preview-corporate'
            }`}>
              {/* Hero Section */}
              <div className="relative">
                {/* Hero Image */}
                {homepage.media_url ? (
                  <div className="w-full h-96 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={homepage.media_url} 
                      alt="Hero" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No hero image selected</span>
                  </div>
                )}
                
                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6">
                    <div className="max-w-xl text-white p-6 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg">
                      <h1 className="text-4xl font-bold mb-4">{homepage.headline}</h1>
                      <h2 className="text-xl mb-6">{homepage.subheading}</h2>
                      <p className="mb-6">{homepage.offer}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {homepage.benefits.map((benefit, index) => (
                          <Badge key={index} className="bg-white text-black">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        {homepage.cta_text}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Services Section Preview */}
              <div className="bg-white py-12">
                <div className="container mx-auto px-6">
                  <h2 className="text-2xl font-bold mb-8 text-center">Our Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(homepage.services?.length || 0) > 0 ? (
                      homepage.services?.map((service, index) => (
                        <div key={index} className="p-6 border rounded-lg text-center">
                          <h3 className="font-bold mb-3">{service}</h3>
                          <p className="text-gray-600">Service description will appear here.</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-6 border rounded-lg text-center">
                          <h3 className="font-bold mb-3">Tax Planning</h3>
                          <p className="text-gray-600">Example service description.</p>
                        </div>
                        <div className="p-6 border rounded-lg text-center">
                          <h3 className="font-bold mb-3">Business Consulting</h3>
                          <p className="text-gray-600">Example service description.</p>
                        </div>
                        <div className="p-6 border rounded-lg text-center">
                          <h3 className="font-bold mb-3">Financial Reporting</h3>
                          <p className="text-gray-600">Example service description.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Layout-specific styling */}
              {homepage.layout_style === 'Modern' && (
                <div className="bg-gray-50 py-12">
                  <div className="container mx-auto px-6">
                    <p className="text-center text-gray-500">Modern layout includes clean lines and minimalist design elements.</p>
                  </div>
                </div>
              )}
              
              {homepage.layout_style === 'Classic' && (
                <div className="bg-gray-100 py-12 border-t border-b border-gray-200">
                  <div className="container mx-auto px-6">
                    <p className="text-center text-gray-500">Classic layout includes traditional design elements with a timeless feel.</p>
                  </div>
                </div>
              )}
              
              {homepage.layout_style === 'Bold' && (
                <div className="bg-black text-white py-12">
                  <div className="container mx-auto px-6">
                    <p className="text-center">Bold layout includes high-contrast design elements for maximum impact.</p>
                  </div>
                </div>
              )}
              
              {homepage.layout_style === 'Minimalist' && (
                <div className="py-12">
                  <div className="container mx-auto px-6">
                    <p className="text-center text-gray-500">Minimalist layout focuses on typography and essential elements only.</p>
                  </div>
                </div>
              )}
              
              {homepage.layout_style === 'Corporate' && (
                <div className="bg-blue-900 text-white py-12">
                  <div className="container mx-auto px-6">
                    <p className="text-center">Corporate layout projects professionalism and reliability.</p>
                  </div>
                </div>
              )}
              
              {/* Footer Preview */}
              <div className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p>© 2025 Progress Accountants. All rights reserved.</p>
                    <div className="mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="text-white border-white">
                        Contact Us
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <p className="text-sm text-gray-500 mr-auto">
              This is a preview only. Actual appearance may vary slightly.
            </p>
            <Button onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
            
            {/* Complexity Scoring Demo */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium">Page Complexity Analysis</CardTitle>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    New Feature
                  </Badge>
                </div>
                <CardDescription>
                  Our intelligence layer analyzes your content and provides insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Content Complexity</span>
                    <div className="flex space-x-2 items-center">
                      <span className="text-sm text-muted-foreground">
                        {homepage.headline.length > 50 ? "Medium" : "Low"}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${Math.min(100, (homepage.headline.length / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SEO Readiness</span>
                    <div className="flex space-x-2 items-center">
                      <span className="text-sm text-muted-foreground">
                        {(homepage.services?.length || 0) > 2 ? "High" : "Medium"}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${Math.min(100, ((homepage.services?.length || 0) / 5) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Engagement Potential</span>
                    <div className="flex space-x-2 items-center">
                      <span className="text-sm text-muted-foreground">
                        {(homepage.testimonials?.length || 0) > 1 ? "High" : "Low"}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${Math.min(100, ((homepage.testimonials?.length || 0) / 3) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
    </Suspense>
  );
}