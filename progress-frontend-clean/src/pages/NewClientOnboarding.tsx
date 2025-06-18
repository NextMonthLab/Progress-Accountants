import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, ArrowRight, Check, AlertCircle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/components/ClientDataProvider';
import { useQuery } from '@tanstack/react-query';

// Define the onboarding steps
const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Get started with Progress Accountants"
  },
  {
    id: "context",
    title: "System Setup",
    description: "Understand how the system works"
  },
  {
    id: "public_pages",
    title: "Public Pages",
    description: "Confirm existing pages"
  },
  {
    id: "admin_setup",
    title: "Admin Setup",
    description: "Configure your admin interface"
  },
  {
    id: "complete",
    title: "Complete",
    description: "You're all set!"
  }
];

export default function NewClientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  
  // Demo state - in a real implementation, this would be stored in the database
  const [preservePublicPages, setPreservePublicPages] = useState(true);
  const [businessName, setBusinessName] = useState("Progress Accountants");
  const [acknowledgedPages, setAcknowledgedPages] = useState<string[]>([]);
  
  // Mock data for existing public pages
  const publicPages = [
    { id: "homepage", name: "Homepage", path: "/" },
    { id: "about", name: "About Us", path: "/about" },
    { id: "services", name: "Services", path: "/services" },
    { id: "podcast", name: "Podcast Studio", path: "/podcast-studio" },
    { id: "contact", name: "Contact", path: "/contact" }
  ];
  
  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      // In a real implementation, we would save the current step's data to the server
      setIsLoading(true);
      
      try {
        // Simulate saving data to the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Move to the next step
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save your progress",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handlePageAcknowledgement = (pageId: string, checked: boolean) => {
    if (checked) {
      setAcknowledgedPages([...acknowledgedPages, pageId]);
    } else {
      setAcknowledgedPages(acknowledgedPages.filter(id => id !== pageId));
    }
  };
  
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate saving final data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Onboarding Complete",
        description: "Your account has been successfully set up",
        variant: "default",
      });
      
      // Navigate to the dashboard
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete the onboarding process",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome step
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Welcome to Progress Accountants</h2>
            <p className="text-muted-foreground">
              We're excited to help you set up your business operating system. 
              This wizard will guide you through the initial setup process.
            </p>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                This is a template system that will be configured for your business.
                All public-facing pages have already been professionally designed and will remain unchanged.
                This setup focuses on configuring your admin interface and backend tools.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="preserve-pages"
                checked={preservePublicPages}
                onCheckedChange={(checked) => setPreservePublicPages(checked as boolean)}
              />
              <Label htmlFor="preserve-pages" className="font-medium text-primary">
                I understand that existing public pages will be preserved
              </Label>
            </div>
          </div>
        );
        
      case 1: // System Context
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Understanding the System</h2>
            <p className="text-muted-foreground">
              The Progress Accountants platform consists of two main components:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Public-Facing Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>These are the pages your clients and prospects will see. They include:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Homepage</li>
                    <li>About Us</li>
                    <li>Services</li>
                    <li>Podcast Studio</li>
                    <li>Contact</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Admin Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is where you'll manage your business operations, including:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Client management</li>
                    <li>Financial dashboards</li>
                    <li>Document management</li>
                    <li>Team collaboration</li>
                    <li>Custom tools and forms</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-4">
              <Alert variant="default" className="bg-primary/10 border-primary/20">
                <Info className="h-4 w-4" />
                <AlertTitle>What's Being Set Up Today</AlertTitle>
                <AlertDescription>
                  Today's setup will focus exclusively on configuring your admin backend 
                  while preserving all the professionally designed public-facing pages.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );
        
      case 2: // Public Pages Confirmation
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Existing Public Pages</h2>
            <p className="text-muted-foreground">
              The following pages have already been professionally designed and will remain unchanged
              during this setup process. Please review and acknowledge each page.
            </p>
            
            <div className="space-y-4">
              {publicPages.map(page => (
                <div key={page.id} className="flex items-start space-x-3 border p-4 rounded-md">
                  <Checkbox 
                    id={`page-${page.id}`}
                    checked={acknowledgedPages.includes(page.id)}
                    onCheckedChange={(checked) => 
                      handlePageAcknowledgement(page.id, checked as boolean)
                    }
                  />
                  <div className="space-y-1">
                    <Label 
                      htmlFor={`page-${page.id}`} 
                      className="font-medium text-primary"
                    >
                      {page.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Path: {page.path}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Alert variant="destructive" className={acknowledgedPages.length < publicPages.length ? "" : "hidden"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Please acknowledge all pages</AlertTitle>
              <AlertDescription>
                You need to check all pages before proceeding to the next step.
              </AlertDescription>
            </Alert>
          </div>
        );
        
      case 3: // Admin Setup
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configure Your Admin System</h2>
            <p className="text-muted-foreground">
              Let's set up the baseline information for your admin interface.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input 
                  id="business-name" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Industry</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Accounting</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Template</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Progress Accountants</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Admin Portal</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">https://progress.admin.nextmonth.io</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Public Website</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">https://progressaccountants.com</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
        
      case 4: // Complete
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-center">Setup Complete!</h2>
              <p className="text-center text-muted-foreground mt-2 max-w-md">
                Your Progress Accountants system has been successfully configured.
                You're now ready to start using the admin dashboard.
              </p>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-4 mt-6">
              <h3 className="font-semibold mb-2">What's been configured:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Admin portal setup with your business details
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Existing public pages preserved and acknowledged
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Basic tool templates installed
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Account permissions set up
                </li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl font-bold">New Client Setup</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <CardDescription className="pt-2">
            {ONBOARDING_STEPS[currentStep].description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          {renderStepContent()}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
          >
            Back
          </Button>
          
          {currentStep < ONBOARDING_STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={
                isLoading || 
                (currentStep === 0 && !preservePublicPages) ||
                (currentStep === 2 && acknowledgedPages.length < publicPages.length)
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-[var(--navy)] hover:bg-[var(--navy)]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizing...
                </>
              ) : (
                <>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}