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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Plus, Trash2, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFieldArray, useForm } from "react-hook-form";

// Define the data structure for a testimonial
interface Testimonial {
  name: string;
  company: string;
  industry: string;
  quote: string;
  rating: number;
}

// Define the data structure for the testimonials page setup
interface TestimonialsPageData {
  intro: string;
  testimonials: Testimonial[];
  display_style: 'cards' | 'carousel' | 'list' | 'grid';
  show_ratings: boolean;
}

export default function TestimonialsSetupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default values or saved values from localStorage
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<TestimonialsPageData>({
    defaultValues: {
      intro: '',
      testimonials: [{ name: '', company: '', industry: '', quote: '', rating: 5 }],
      display_style: 'cards',
      show_ratings: true
    }
  });
  
  // Setup field array for dynamic testimonials
  const { fields, append, remove } = useFieldArray({
    control,
    name: "testimonials"
  });
  
  // Watch display style to show different previews
  const displayStyle = watch('display_style');
  const showRatings = watch('show_ratings');
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.testimonials_page');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as TestimonialsPageData;
        setValue('intro', parsedData.intro);
        setValue('display_style', parsedData.display_style);
        setValue('show_ratings', parsedData.show_ratings);
        
        // Clear default testimonial and add saved ones
        if (parsedData.testimonials && parsedData.testimonials.length > 0) {
          setValue('testimonials', parsedData.testimonials);
        }
      } catch (error) {
        console.error('Error parsing saved testimonials page data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your testimonials page setup.",
          variant: "destructive",
        });
      }
    }
    
    // Update the status to in_progress in page_status
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedStatuses = JSON.parse(savedStatuses);
        parsedStatuses.testimonials = 'in_progress';
        localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
      } catch (error) {
        console.error('Error updating page status:', error);
      }
    }
  }, [setValue, toast]);
  
  // Save the testimonials page data
  const saveTestimonialsPage = (data: TestimonialsPageData) => {
    setIsLoading(true);
    
    // Validate that at least one testimonial is defined with non-empty values
    if (data.testimonials.length === 0 || !data.testimonials[0].name || !data.testimonials[0].quote) {
      toast({
        title: "Validation Error",
        description: "Please add at least one testimonial with a name and quote.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Save data to localStorage
        localStorage.setItem('project_context.testimonials_page', JSON.stringify(data));
        
        // Update page status to complete
        const savedStatuses = localStorage.getItem('project_context.page_status');
        if (savedStatuses) {
          const parsedStatuses = JSON.parse(savedStatuses);
          parsedStatuses.testimonials = 'complete';
          localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
        }
        
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
        
        toast({
          title: "Saved Successfully",
          description: "Your testimonials page setup has been saved.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your testimonials page setup.",
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
  
  // Add a new testimonial form
  const addTestimonial = () => {
    append({ name: '', company: '', industry: '', quote: '', rating: 5 });
  };
  
  // Render star rating display
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Testimonials Page Setup | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">Testimonials Page Setup</CardTitle>
            <CardDescription className="text-gray-100">
              Build trust with real words from real clients.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(saveTestimonialsPage)}>
            <CardContent className="p-6 space-y-8">
              {/* Testimonials Introduction */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Testimonials Introduction</h3>
                <p className="text-sm text-gray-500">
                  Introduce your client testimonials with a brief statement.
                </p>
                <Textarea 
                  className="min-h-24"
                  placeholder="Here's what our clients say about working with Progress Accountants..."
                  {...register("intro", { required: "Testimonials introduction is required" })}
                />
                {errors.intro && (
                  <p className="text-red-500 text-sm">{errors.intro.message}</p>
                )}
              </div>
              
              {/* Display Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Style */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Testimonial Display Style
                    </label>
                    <Select
                      onValueChange={(value) => setValue('display_style', value as 'cards' | 'carousel' | 'list' | 'grid')}
                      defaultValue={displayStyle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select display style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cards">Cards</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      How testimonials will be displayed on your website.
                    </p>
                  </div>
                  
                  {/* Rating Visibility */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Show Star Ratings
                    </label>
                    <Select
                      onValueChange={(value) => setValue('show_ratings', value === 'true')}
                      defaultValue={showRatings ? 'true' : 'false'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Show ratings?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes, show star ratings</SelectItem>
                        <SelectItem value="false">No, hide star ratings</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Whether to display star ratings alongside testimonials.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Preview based on selection */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Preview: {displayStyle} Style</h3>
                
                <div className={`
                  ${displayStyle === 'cards' ? 'flex flex-col gap-4' : 
                    displayStyle === 'carousel' ? 'relative overflow-hidden bg-white p-6 rounded-lg border' : 
                    displayStyle === 'list' ? 'space-y-6' : 
                    'grid grid-cols-2 gap-4'}
                `}>
                  <div className={`
                    ${displayStyle === 'cards' ? 'bg-white p-4 rounded-lg border shadow-sm' : 
                      displayStyle === 'carousel' ? 'bg-white rounded-lg' : 
                      displayStyle === 'list' ? 'bg-white p-4 rounded-lg border-l-4 border-blue-500' : 
                      'bg-white p-4 rounded-lg border'}
                  `}>
                    <p className="text-gray-600 italic mb-3">
                      "Sample testimonial quote that shows how this display style will look on your site."
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">John Smith</h4>
                        <p className="text-sm text-gray-500">ACME Company, Finance</p>
                      </div>
                      
                      {showRatings && renderStarRating(5)}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  This is just a preview. The actual design will match your website's style and branding.
                </p>
              </div>
              
              {/* Testimonials List */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Testimonials</h3>
                  <Button 
                    type="button" 
                    onClick={addTestimonial}
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Testimonial
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <Card key={field.id} className="border">
                    <CardHeader className="bg-gray-50 py-3 px-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Testimonial {index + 1}</h4>
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
                      {/* Client Name */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Client Name
                        </label>
                        <Input 
                          placeholder="John Smith"
                          {...register(`testimonials.${index}.name`, { required: "Client name is required" })}
                        />
                        {errors.testimonials?.[index]?.name && (
                          <p className="text-red-500 text-sm">{errors.testimonials[index]?.name?.message}</p>
                        )}
                      </div>
                      
                      {/* Company & Industry */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Company
                          </label>
                          <Input 
                            placeholder="ACME Company"
                            {...register(`testimonials.${index}.company`)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Industry
                          </label>
                          <Input 
                            placeholder="Finance, Construction, etc."
                            {...register(`testimonials.${index}.industry`)}
                          />
                        </div>
                      </div>
                      
                      {/* Testimonial Quote */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Testimonial Quote
                        </label>
                        <Textarea 
                          placeholder="What the client said about your services..."
                          className="min-h-24"
                          {...register(`testimonials.${index}.quote`, { required: "Testimonial quote is required" })}
                        />
                        {errors.testimonials?.[index]?.quote && (
                          <p className="text-red-500 text-sm">{errors.testimonials[index]?.quote?.message}</p>
                        )}
                      </div>
                      
                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Star Rating (1-5)
                        </label>
                        <Select
                          onValueChange={(value) => setValue(`testimonials.${index}.rating`, parseInt(value))}
                          defaultValue={field.rating ? field.rating.toString() : "5"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Poor</SelectItem>
                            <SelectItem value="2">2 - Fair</SelectItem>
                            <SelectItem value="3">3 - Good</SelectItem>
                            <SelectItem value="4">4 - Very Good</SelectItem>
                            <SelectItem value="5">5 - Excellent</SelectItem>
                          </SelectContent>
                        </Select>
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