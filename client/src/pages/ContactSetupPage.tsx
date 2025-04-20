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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, MapPin, Phone, Mail, CalendarDays } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

// Define the data structure for the contact page setup
interface ContactPageData {
  intro: string;
  address: string;
  phone: string;
  email: string;
  business_hours: string;
  include_contact_form: boolean;
  include_map: boolean;
  include_call_booking: boolean;
  form_fields: {
    name: boolean;
    business_name: boolean;
    email: boolean;
    phone: boolean;
    message: boolean;
    preferred_contact_method: boolean;
    service_interest: boolean;
  };
}

export default function ContactSetupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default values or saved values from localStorage
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ContactPageData>({
    defaultValues: {
      intro: '',
      address: '',
      phone: '',
      email: '',
      business_hours: '',
      include_contact_form: true,
      include_map: true,
      include_call_booking: false,
      form_fields: {
        name: true,
        business_name: false,
        email: true,
        phone: true,
        message: true,
        preferred_contact_method: false,
        service_interest: false
      }
    }
  });
  
  // Watch for changes in the include_contact_form field
  const includeContactForm = watch('include_contact_form');
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.contact_page');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as ContactPageData;
        Object.entries(parsedData).forEach(([key, value]) => {
          setValue(key as keyof ContactPageData, value);
        });
        
        // Handle nested form_fields object explicitly
        if (parsedData.form_fields) {
          Object.entries(parsedData.form_fields).forEach(([key, value]) => {
            setValue(`form_fields.${key as keyof ContactPageData['form_fields']}`, value);
          });
        }
      } catch (error) {
        console.error('Error parsing saved contact page data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your contact page setup.",
          variant: "destructive",
        });
      }
    }
    
    // Update the status to in_progress in page_status
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedStatuses = JSON.parse(savedStatuses);
        parsedStatuses.contact = 'in_progress';
        localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
      } catch (error) {
        console.error('Error updating page status:', error);
      }
    }
  }, [setValue, toast]);
  
  // Save the contact page data
  const saveContactPage = (data: ContactPageData) => {
    setIsLoading(true);
    
    // Validate basic required fields
    if (!data.email || !data.phone) {
      toast({
        title: "Validation Error",
        description: "Email and phone are required for your contact page.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Save data to localStorage
        localStorage.setItem('project_context.contact_page', JSON.stringify(data));
        
        // Update page status to complete
        const savedStatuses = localStorage.getItem('project_context.page_status');
        if (savedStatuses) {
          const parsedStatuses = JSON.parse(savedStatuses);
          parsedStatuses.contact = 'complete';
          localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
        }
        
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
        
        toast({
          title: "Saved Successfully",
          description: "Your contact page setup has been saved.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your contact page setup.",
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
        <title>Contact Page Setup | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">Contact Page Setup</CardTitle>
            <CardDescription className="text-gray-100">
              Make it easy for clients to reach you with a professional contact page.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(saveContactPage)}>
            <CardContent className="p-6 space-y-8">
              {/* Contact Introduction */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Contact Introduction</h3>
                <p className="text-sm text-gray-500">
                  Briefly explain how potential clients can get in touch with you.
                </p>
                <Textarea 
                  className="min-h-24"
                  placeholder="We're here to help with your accounting needs. Reach out to our team..."
                  {...register("intro", { required: "Contact introduction is required" })}
                />
                {errors.intro && (
                  <p className="text-red-500 text-sm">{errors.intro.message}</p>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div className="space-y-1 flex-1">
                    <label className="block text-sm font-medium">
                      Business Address
                    </label>
                    <Textarea 
                      placeholder="123 Business Street, City, Postcode"
                      {...register("address", { required: "Business address is required" })}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-1" />
                  <div className="space-y-1 flex-1">
                    <label className="block text-sm font-medium">
                      Phone Number
                    </label>
                    <Input 
                      placeholder="+44 123 456 7890"
                      {...register("phone", { required: "Phone number is required" })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-1" />
                  <div className="space-y-1 flex-1">
                    <label className="block text-sm font-medium">
                      Email Address
                    </label>
                    <Input 
                      placeholder="contact@progressaccountants.com"
                      type="email"
                      {...register("email", { 
                        required: "Email address is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Business Hours */}
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-gray-500 mt-1" />
                  <div className="space-y-1 flex-1">
                    <label className="block text-sm font-medium">
                      Business Hours
                    </label>
                    <Textarea 
                      placeholder="Monday to Friday: 9:00 AM - 5:00 PM
Saturday: 10:00 AM - 2:00 PM
Sunday: Closed"
                      {...register("business_hours")}
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Page Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Page Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include_contact_form"
                      {...register("include_contact_form")}
                    />
                    <label
                      htmlFor="include_contact_form"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include contact form
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include_map"
                      {...register("include_map")}
                    />
                    <label
                      htmlFor="include_map"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include map with office location
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include_call_booking"
                      {...register("include_call_booking")}
                    />
                    <label
                      htmlFor="include_call_booking"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include call booking system
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Fields (Conditional) */}
              {includeContactForm && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium">Contact Form Fields</h3>
                  <p className="text-sm text-gray-500">
                    Select which fields to include in your contact form:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="form_fields.name"
                        defaultChecked
                        disabled
                      />
                      <label
                        htmlFor="form_fields.name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name (Required)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="form_fields.email"
                        defaultChecked
                        disabled
                      />
                      <label
                        htmlFor="form_fields.email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email (Required)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="form_fields.business_name"
                        {...register("form_fields.business_name")}
                      />
                      <label
                        htmlFor="form_fields.business_name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Business Name
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="form_fields.phone"
                        {...register("form_fields.phone")}
                      />
                      <label
                        htmlFor="form_fields.phone"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Phone Number
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="form_fields.preferred_contact_method"
                        {...register("form_fields.preferred_contact_method")}
                      />
                      <label
                        htmlFor="form_fields.preferred_contact_method"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Preferred Contact Method
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="form_fields.service_interest"
                        {...register("form_fields.service_interest")}
                      />
                      <label
                        htmlFor="form_fields.service_interest"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Service Interest
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <Checkbox 
                        id="form_fields.message"
                        {...register("form_fields.message")}
                      />
                      <label
                        htmlFor="form_fields.message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message
                      </label>
                    </div>
                  </div>
                </div>
              )}
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