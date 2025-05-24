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
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

// Define the data structure for the about page setup
interface AboutPageData {
  company_history: string;
  mission_statement: string;
  vision: string;
  team_intro: string;
  values: string[];
}

export default function AboutSetupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default values or saved values from localStorage
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<AboutPageData>({
    defaultValues: {
      company_history: '',
      mission_statement: '',
      vision: '',
      team_intro: '',
      values: [],
    }
  });
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.about_page');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as AboutPageData;
        Object.entries(parsedData).forEach(([key, value]) => {
          setValue(key as keyof AboutPageData, value);
        });
      } catch (error) {
        console.error('Error parsing saved about page data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your about page setup.",
          variant: "destructive",
        });
      }
    }
    
    // Update the status to in_progress in page_status
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedStatuses = JSON.parse(savedStatuses);
        parsedStatuses.about = 'in_progress';
        localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
      } catch (error) {
        console.error('Error updating page status:', error);
      }
    }
  }, [setValue, toast]);
  
  // Save the about page data
  const saveAboutPage = (data: AboutPageData) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Save data to localStorage
        localStorage.setItem('project_context.about_page', JSON.stringify(data));
        
        // Update page status to complete
        const savedStatuses = localStorage.getItem('project_context.page_status');
        if (savedStatuses) {
          const parsedStatuses = JSON.parse(savedStatuses);
          parsedStatuses.about = 'complete';
          localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
        }
        
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
        
        toast({
          title: "Saved Successfully",
          description: "Your about page setup has been saved.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your about page setup.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };
  
  // Handle back button click
  const handleBackClick = () => {
    setLocation('/foundation-pages');
  };
  
  // Handle continue button click
  const handleContinueClick = () => {
    setLocation('/foundation-pages');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>About Page Setup | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">About Page Setup</CardTitle>
            <CardDescription className="text-gray-100">
              Tell your story. Who you are, what you stand for, and why clients trust you.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(saveAboutPage)}>
            <CardContent className="p-6 space-y-8">
              {/* Company History */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Company History</h3>
                <p className="text-sm text-gray-500">
                  Share the story of how your company began and evolved.
                </p>
                <Textarea 
                  className="min-h-32"
                  placeholder="Founded in [year], Progress Accountants was established to..."
                  {...register("company_history", { required: "Company history is required" })}
                />
                {errors.company_history && (
                  <p className="text-red-500 text-sm">{errors.company_history.message}</p>
                )}
              </div>
              
              {/* Mission Statement */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Mission Statement</h3>
                <p className="text-sm text-gray-500">
                  What is your company's purpose and goal?
                </p>
                <Textarea 
                  placeholder="Our mission is to..."
                  {...register("mission_statement", { required: "Mission statement is required" })}
                />
                {errors.mission_statement && (
                  <p className="text-red-500 text-sm">{errors.mission_statement.message}</p>
                )}
              </div>
              
              {/* Vision */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Vision</h3>
                <p className="text-sm text-gray-500">
                  What does your company aspire to achieve in the future?
                </p>
                <Textarea 
                  placeholder="We envision a future where..."
                  {...register("vision", { required: "Vision is required" })}
                />
                {errors.vision && (
                  <p className="text-red-500 text-sm">{errors.vision.message}</p>
                )}
              </div>
              
              {/* Team Introduction */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Team Introduction</h3>
                <p className="text-sm text-gray-500">
                  Introduce your team and their expertise.
                </p>
                <Textarea 
                  placeholder="Our team of experienced professionals..."
                  {...register("team_intro", { required: "Team introduction is required" })}
                />
                {errors.team_intro && (
                  <p className="text-red-500 text-sm">{errors.team_intro.message}</p>
                )}
              </div>
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
                  type="button"
                  variant="outline"
                  onClick={handleBackClick}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  type="submit"
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
                      Save Page
                    </span>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={handleContinueClick}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}