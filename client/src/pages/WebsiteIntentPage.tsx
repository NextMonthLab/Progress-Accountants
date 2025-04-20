import React, { useState } from 'react';
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
import { ArrowRight, Globe, Settings, HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Define website intent options
type WebsiteIntent = 'full_website' | 'tools_only' | 'undecided';

export default function WebsiteIntentPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedIntent, setSelectedIntent] = useState<WebsiteIntent | null>(null);
  
  // Handle intent selection
  const handleSelectIntent = (intent: WebsiteIntent) => {
    setSelectedIntent(intent);
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (!selectedIntent) {
      toast({
        title: "Please select an option",
        description: "Please select how you want to use NextMonth",
        variant: "destructive",
      });
      return;
    }
    
    // Save the selection to localStorage
    localStorage.setItem('project_context.website_intent', selectedIntent);
    
    // Route based on selection
    switch (selectedIntent) {
      case 'full_website':
        setLocation('/homepage-setup');
        break;
      case 'tools_only':
        // Skip homepage setup and route to dashboard or relevant tool section
        toast({
          title: "Tools Only Mode Selected",
          description: "Taking you directly to the Client Portal with all available tools and features",
        });
        
        // Mark website setup stages as completed in localStorage
        localStorage.setItem('project_context.homepage_setup_completed', 'true');
        localStorage.setItem('project_context.foundation_pages_completed', 'true');
        
        // Mark onboarding as complete for tools-only users
        localStorage.setItem('project_context.status', 'onboarded');
        
        // Route to the tools dashboard we just created
        setLocation('/tools-dashboard');
        break;
      case 'undecided':
        // Route to homepage setup but mark as optional
        localStorage.setItem('project_context.homepage_optional', 'true');
        setLocation('/homepage-setup');
        break;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Choose Your Path | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">How do you want to use NextMonth?</CardTitle>
            <CardDescription className="text-gray-100">
              We'll customize your experience based on your needs.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <p className="text-lg text-gray-700 font-medium">
              What best describes how you plan to use this platform?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Full Website */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedIntent === 'full_website' ? 'ring-2 ring-blue-500 bg-blue-50' : 'border'
                }`}
                onClick={() => handleSelectIntent('full_website')}
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mt-2">Full Website</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    I want to create a complete website using NextMonth's website builder
                  </p>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-gray-500">
                  Includes homepage setup, service pages, and more
                </CardFooter>
              </Card>
              
              {/* Option 2: Tools Only */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedIntent === 'tools_only' ? 'ring-2 ring-blue-500 bg-blue-50' : 'border'
                }`}
                onClick={() => handleSelectIntent('tools_only')}
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Settings className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl mt-2">Tools Only</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    I already have a website—I just want to use the smart tools and features
                  </p>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-gray-500">
                  Takes you directly to tools dashboard, skipping website setup
                </CardFooter>
              </Card>
              
              {/* Option 3: Undecided */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedIntent === 'undecided' ? 'ring-2 ring-blue-500 bg-blue-50' : 'border'
                }`}
                onClick={() => handleSelectIntent('undecided')}
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl mt-2">I'm Not Sure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Show me both options so I can decide later what works best for my business
                  </p>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-gray-500">
                  Shows all options, nothing is mandatory
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm order-2 sm:order-1">
              You can always change this preference later in your account settings.
            </p>
            
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-blue-700 hover:bg-blue-800 text-white order-1 sm:order-2 w-full sm:w-auto"
              disabled={!selectedIntent}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}