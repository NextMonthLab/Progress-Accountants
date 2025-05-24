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
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFieldArray, useForm } from "react-hook-form";

// Define the data structure for a service
interface Service {
  title: string;
  description: string;
  benefits: string;
  pricing_info: string;
}

// Define the data structure for the services page setup
interface ServicesPageData {
  intro: string;
  services: Service[];
}

export default function ServicesSetupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default values or saved values from localStorage
  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<ServicesPageData>({
    defaultValues: {
      intro: '',
      services: [{ title: '', description: '', benefits: '', pricing_info: '' }]
    }
  });
  
  // Setup field array for dynamic services
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services"
  });
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.services_page');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as ServicesPageData;
        setValue('intro', parsedData.intro);
        
        // Clear default service and add saved ones
        if (parsedData.services && parsedData.services.length > 0) {
          // Replace the services array with the saved one
          setValue('services', parsedData.services);
        }
      } catch (error) {
        console.error('Error parsing saved services page data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your services page setup.",
          variant: "destructive",
        });
      }
    }
    
    // Update the status to in_progress in page_status
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedStatuses = JSON.parse(savedStatuses);
        parsedStatuses.services = 'in_progress';
        localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
      } catch (error) {
        console.error('Error updating page status:', error);
      }
    }
  }, [setValue, toast]);
  
  // Save the services page data
  const saveServicesPage = (data: ServicesPageData) => {
    setIsLoading(true);
    
    // Validate that at least one service is defined
    if (data.services.length === 0 || !data.services[0].title) {
      toast({
        title: "Validation Error",
        description: "Please add at least one service with a title.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Save data to localStorage
        localStorage.setItem('project_context.services_page', JSON.stringify(data));
        
        // Update page status to complete
        const savedStatuses = localStorage.getItem('project_context.page_status');
        if (savedStatuses) {
          const parsedStatuses = JSON.parse(savedStatuses);
          parsedStatuses.services = 'complete';
          localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
        }
        
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
        
        toast({
          title: "Saved Successfully",
          description: "Your services page setup has been saved.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your services page setup.",
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
  
  // Add a new service form
  const addService = () => {
    append({ title: '', description: '', benefits: '', pricing_info: '' });
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Services Page Setup | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">Services Page Setup</CardTitle>
            <CardDescription className="text-gray-100">
              Showcase what you offer—clear, benefit-led, and structured for growth.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(saveServicesPage)}>
            <CardContent className="p-6 space-y-8">
              {/* Services Introduction */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Services Introduction</h3>
                <p className="text-sm text-gray-500">
                  Provide an overview of your services and what clients can expect.
                </p>
                <Textarea 
                  className="min-h-24"
                  placeholder="At Progress Accountants, we offer a range of services tailored to..."
                  {...register("intro", { required: "Services introduction is required" })}
                />
                {errors.intro && (
                  <p className="text-red-500 text-sm">{errors.intro.message}</p>
                )}
              </div>
              
              {/* Services List */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Services</h3>
                  <Button 
                    type="button" 
                    onClick={addService}
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <Card key={field.id} className="border">
                    <CardHeader className="bg-gray-50 py-3 px-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button 
                            type="button" 
                            onClick={() => remove(index)}
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 h-8 px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      {/* Service Title */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Service Title
                        </label>
                        <Input 
                          placeholder="e.g., Tax Planning, Business Consulting, etc."
                          {...register(`services.${index}.title`, { required: "Service title is required" })}
                        />
                        {errors.services?.[index]?.title && (
                          <p className="text-red-500 text-sm">{errors.services[index]?.title?.message}</p>
                        )}
                      </div>
                      
                      {/* Service Description */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Textarea 
                          placeholder="Describe what this service is and how it works..."
                          {...register(`services.${index}.description`, { required: "Service description is required" })}
                        />
                        {errors.services?.[index]?.description && (
                          <p className="text-red-500 text-sm">{errors.services[index]?.description?.message}</p>
                        )}
                      </div>
                      
                      {/* Service Benefits */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Benefits
                        </label>
                        <Textarea 
                          placeholder="List the key benefits clients will gain from this service..."
                          {...register(`services.${index}.benefits`)}
                        />
                      </div>
                      
                      {/* Pricing Information */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Pricing Information (Optional)
                        </label>
                        <Input 
                          placeholder="e.g., Starting at £X per month, Packages from £X, etc."
                          {...register(`services.${index}.pricing_info`)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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