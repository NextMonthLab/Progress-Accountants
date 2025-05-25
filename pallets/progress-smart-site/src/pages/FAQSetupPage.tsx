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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Plus, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFieldArray, useForm } from "react-hook-form";

// Define the data structure for an FAQ
interface FAQ {
  question: string;
  answer: string;
  category: string;
}

// Define the data structure for a pricing option
interface PricingOption {
  name: string;
  price: string;
  period: 'one-time' | 'monthly' | 'quarterly' | 'annually' | 'custom';
  features: string[];
  is_popular: boolean;
}

// Define the data structure for the FAQ/Pricing page setup
interface FAQPageData {
  include_faq: boolean;
  include_pricing: boolean;
  faq_intro: string;
  pricing_intro: string;
  faqs: FAQ[];
  pricing_options: PricingOption[];
  faq_categories: string[];
  faq_style: 'accordion' | 'cards' | 'sections';
  pricing_style: 'cards' | 'table' | 'list';
}

export default function FAQSetupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("faq_pricing");
  
  // Initialize form with default values or saved values from localStorage
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FAQPageData>({
    defaultValues: {
      include_faq: true,
      include_pricing: true,
      faq_intro: '',
      pricing_intro: '',
      faqs: [{ question: '', answer: '', category: 'General' }],
      pricing_options: [{ 
        name: 'Basic', 
        price: '£299', 
        period: 'monthly', 
        features: ['Feature 1', 'Feature 2'],
        is_popular: false
      }],
      faq_categories: ['General', 'Services', 'Billing'],
      faq_style: 'accordion',
      pricing_style: 'cards'
    }
  });
  
  // Setup field arrays for dynamic FAQs and pricing options
  const { 
    fields: faqFields, 
    append: appendFaq, 
    remove: removeFaq 
  } = useFieldArray({
    control,
    name: "faqs"
  });
  
  const { 
    fields: pricingFields, 
    append: appendPricing, 
    remove: removePricing 
  } = useFieldArray({
    control,
    name: "pricing_options"
  });
  
  // We need a separate state for categories since it's not a normal field array in our schema
  const [categories, setCategories] = useState<string[]>(['General', 'Services', 'Billing']);
  
  // Initialize categoryFields with current categories for rendering
  const categoryFields = categories.map((category, index) => ({ id: index.toString(), value: category }));
  
  // Watch for changes in the include checkboxes
  const includeFAQ = watch('include_faq');
  const includePricing = watch('include_pricing');
  const faqStyle = watch('faq_style');
  const pricingStyle = watch('pricing_style');
  
  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.faq_page');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as FAQPageData;
        
        // Set basic fields
        setValue('include_faq', parsedData.include_faq);
        setValue('include_pricing', parsedData.include_pricing);
        setValue('faq_intro', parsedData.faq_intro);
        setValue('pricing_intro', parsedData.pricing_intro);
        setValue('faq_style', parsedData.faq_style);
        setValue('pricing_style', parsedData.pricing_style);
        
        // Set arrays
        if (parsedData.faqs && parsedData.faqs.length > 0) {
          setValue('faqs', parsedData.faqs);
        }
        
        if (parsedData.pricing_options && parsedData.pricing_options.length > 0) {
          setValue('pricing_options', parsedData.pricing_options);
        }
        
        if (parsedData.faq_categories && parsedData.faq_categories.length > 0) {
          setValue('faq_categories', parsedData.faq_categories);
        }
      } catch (error) {
        console.error('Error parsing saved FAQ page data:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your FAQ/Pricing page setup.",
          variant: "destructive",
        });
      }
    }
    
    // Update the status to in_progress in page_status
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedStatuses = JSON.parse(savedStatuses);
        parsedStatuses.faq = 'in_progress';
        localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
      } catch (error) {
        console.error('Error updating page status:', error);
      }
    }
  }, [setValue, toast]);
  
  // Save the FAQ/Pricing page data
  const saveFAQPage = (data: FAQPageData) => {
    setIsLoading(true);
    
    // Basic validation
    if (data.include_faq && (data.faqs.length === 0 || !data.faqs[0].question || !data.faqs[0].answer)) {
      toast({
        title: "Validation Error",
        description: "Please add at least one FAQ with a question and answer.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (data.include_pricing && (data.pricing_options.length === 0 || !data.pricing_options[0].name || !data.pricing_options[0].price)) {
      toast({
        title: "Validation Error",
        description: "Please add at least one pricing option with a name and price.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Save data to localStorage
        localStorage.setItem('project_context.faq_page', JSON.stringify(data));
        
        // Update page status to complete
        const savedStatuses = localStorage.getItem('project_context.page_status');
        if (savedStatuses) {
          const parsedStatuses = JSON.parse(savedStatuses);
          parsedStatuses.faq = 'complete';
          localStorage.setItem('project_context.page_status', JSON.stringify(parsedStatuses));
        }
        
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
        
        toast({
          title: "Saved Successfully",
          description: "Your FAQ/Pricing page setup has been saved.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your FAQ/Pricing page setup.",
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
  
  // Add a new FAQ
  const addFaq = () => {
    appendFaq({ 
      question: '', 
      answer: '', 
      category: watch('faq_categories')[0] || 'General' 
    });
  };
  
  // Add a new pricing option
  const addPricingOption = () => {
    appendPricing({ 
      name: '', 
      price: '', 
      period: 'monthly', 
      features: [''],
      is_popular: false
    });
  };
  
  // Add a new category
  const addCategory = () => {
    const newCategories = [...categories, 'New Category'];
    setCategories(newCategories);
    setValue('faq_categories', newCategories);
  };
  
  // Remove a category
  const removeCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
    setValue('faq_categories', newCategories);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>FAQ & Pricing Setup | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">FAQ & Pricing Setup</CardTitle>
            <CardDescription className="text-gray-100">
              Answer common questions and explain your service packages.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(saveFAQPage)}>
            <CardContent className="p-6 space-y-8">
              {/* Page Sections Toggle */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Page Sections</h3>
                <p className="text-sm text-gray-500">
                  Choose which sections to include on your page:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={`border cursor-pointer ${includeFAQ ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => setValue('include_faq', !includeFAQ)}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${includeFAQ ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                        {includeFAQ && <div className="w-3 h-3 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <h4 className="font-medium">Frequently Asked Questions</h4>
                        <p className="text-sm text-gray-500">Address common client questions</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={`border cursor-pointer ${includePricing ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => setValue('include_pricing', !includePricing)}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${includePricing ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                        {includePricing && <div className="w-3 h-3 bg-white rounded-full"></div>}
                      </div>
                      <div>
                        <h4 className="font-medium">Pricing Information</h4>
                        <p className="text-sm text-gray-500">Display your service packages and fees</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Page Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="faq_pricing" className="text-sm">
                    Page Setup
                  </TabsTrigger>
                  <TabsTrigger value="faqs" disabled={!includeFAQ} className="text-sm">
                    FAQs
                  </TabsTrigger>
                  <TabsTrigger value="pricing" disabled={!includePricing} className="text-sm">
                    Pricing Options
                  </TabsTrigger>
                </TabsList>
                
                {/* Page Setup Tab */}
                <TabsContent value="faq_pricing" className="border rounded-lg p-4 mt-4 space-y-6">
                  {/* FAQ Setup */}
                  {includeFAQ && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">FAQ Section Setup</h3>
                      
                      {/* FAQ Introduction */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          FAQ Introduction
                        </label>
                        <Textarea 
                          placeholder="Here are answers to some common questions about our services..."
                          {...register("faq_intro", { 
                            required: includeFAQ ? "FAQ introduction is required" : false 
                          })}
                        />
                        {errors.faq_intro && (
                          <p className="text-red-500 text-sm">{errors.faq_intro.message}</p>
                        )}
                      </div>
                      
                      {/* FAQ Categories */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium">
                            FAQ Categories
                          </label>
                          <Button 
                            type="button" 
                            onClick={addCategory}
                            variant="outline" 
                            size="sm"
                            className="flex items-center h-7 px-2 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Category
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {categoryFields.map((field, index) => (
                            <div 
                              key={index} 
                              className="flex items-center bg-gray-100 rounded-lg px-3 py-1"
                            >
                              <Input 
                                className="h-7 w-32 bg-transparent border-0 p-0 focus-visible:ring-0"
                                {...register(`faq_categories.${index}` as const)}
                              />
                              {categoryFields.length > 1 && (
                                <Button 
                                  type="button"
                                  onClick={() => removeCategory(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 text-gray-500 hover:text-red-500"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          These categories will help organize your FAQs.
                        </p>
                      </div>
                      
                      {/* FAQ Display Style */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          FAQ Display Style
                        </label>
                        <Select
                          onValueChange={(value) => setValue('faq_style', value as 'accordion' | 'cards' | 'sections')}
                          defaultValue={faqStyle}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select display style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accordion">Accordion (Expandable)</SelectItem>
                            <SelectItem value="cards">Cards</SelectItem>
                            <SelectItem value="sections">Categorized Sections</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          How FAQs will be displayed on your page.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing Setup */}
                  {includePricing && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Pricing Section Setup</h3>
                      
                      {/* Pricing Introduction */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Pricing Introduction
                        </label>
                        <Textarea 
                          placeholder="We offer flexible pricing options to suit businesses of all sizes..."
                          {...register("pricing_intro", { 
                            required: includePricing ? "Pricing introduction is required" : false 
                          })}
                        />
                        {errors.pricing_intro && (
                          <p className="text-red-500 text-sm">{errors.pricing_intro.message}</p>
                        )}
                      </div>
                      
                      {/* Pricing Display Style */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Pricing Display Style
                        </label>
                        <Select
                          onValueChange={(value) => setValue('pricing_style', value as 'cards' | 'table' | 'list')}
                          defaultValue={pricingStyle}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select display style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cards">Pricing Cards</SelectItem>
                            <SelectItem value="table">Comparison Table</SelectItem>
                            <SelectItem value="list">Feature List</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          How pricing options will be displayed on your page.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* FAQs Tab */}
                <TabsContent value="faqs" className="border rounded-lg p-4 mt-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Your FAQs</h3>
                    <Button 
                      type="button" 
                      onClick={addFaq}
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add FAQ
                    </Button>
                  </div>
                  
                  {/* FAQ Preview based on style */}
                  <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                    <h4 className="text-sm font-medium mb-2">Preview: {faqStyle} Style</h4>
                    
                    <div className={`
                      ${faqStyle === 'accordion' ? 'border rounded-lg overflow-hidden divide-y' : 
                        faqStyle === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 
                        'space-y-4'}
                    `}>
                      {faqStyle === 'accordion' && (
                        <div className="bg-white">
                          <button className="flex justify-between w-full text-left py-3 px-4 font-medium">
                            Sample Question?
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="px-4 pb-3 text-gray-600">
                            Sample answer that demonstrates how the accordion style will appear.
                          </div>
                        </div>
                      )}
                      
                      {faqStyle === 'cards' && (
                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                          <h5 className="font-medium mb-2 flex items-center">
                            <HelpCircle className="h-4 w-4 text-blue-500 mr-2" />
                            Sample Question?
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Sample answer that demonstrates how the card style will appear.
                          </p>
                        </div>
                      )}
                      
                      {faqStyle === 'sections' && (
                        <div>
                          <h5 className="font-medium text-blue-600 mb-2">General</h5>
                          <div className="border-l-2 border-blue-200 pl-3">
                            <h6 className="font-medium">Sample Question?</h6>
                            <p className="text-gray-600 text-sm">
                              Sample answer that demonstrates how the section style will appear.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-3">
                      This is just a preview. The actual design will match your website's style.
                    </p>
                  </div>
                  
                  {/* FAQ List */}
                  {faqFields.map((field, index) => (
                    <Card key={field.id} className="border">
                      <CardHeader className="bg-gray-50 py-3 px-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">FAQ {index + 1}</h4>
                          {faqFields.length > 1 && (
                            <Button 
                              type="button" 
                              onClick={() => removeFaq(index)}
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
                        {/* Question */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Question
                          </label>
                          <Input 
                            placeholder="What services do you offer?"
                            {...register(`faqs.${index}.question`, { 
                              required: "Question is required" 
                            })}
                          />
                          {errors.faqs?.[index]?.question && (
                            <p className="text-red-500 text-sm">{errors.faqs[index]?.question?.message}</p>
                          )}
                        </div>
                        
                        {/* Answer */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Answer
                          </label>
                          <Textarea 
                            placeholder="We offer a comprehensive range of accounting services including..."
                            {...register(`faqs.${index}.answer`, { 
                              required: "Answer is required" 
                            })}
                          />
                          {errors.faqs?.[index]?.answer && (
                            <p className="text-red-500 text-sm">{errors.faqs[index]?.answer?.message}</p>
                          )}
                        </div>
                        
                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <Select
                            onValueChange={(value) => setValue(`faqs.${index}.category`, value)}
                            defaultValue={field.category}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {watch('faq_categories').map((category, i) => (
                                <SelectItem key={i} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                {/* Pricing Tab */}
                <TabsContent value="pricing" className="border rounded-lg p-4 mt-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Your Pricing Options</h3>
                    <Button 
                      type="button" 
                      onClick={addPricingOption}
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Package
                    </Button>
                  </div>
                  
                  {/* Pricing Preview based on style */}
                  <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                    <h4 className="text-sm font-medium mb-2">Preview: {pricingStyle} Style</h4>
                    
                    <div className={`
                      ${pricingStyle === 'cards' ? 'grid grid-cols-1 md:grid-cols-3 gap-3' : 
                        pricingStyle === 'table' ? 'overflow-x-auto' : 
                        'space-y-4'}
                    `}>
                      {pricingStyle === 'cards' && (
                        <div className="bg-white p-4 rounded-lg border shadow-sm relative">
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                            Popular
                          </div>
                          <h5 className="font-medium text-lg mb-1">Basic Package</h5>
                          <div className="flex items-end mb-4">
                            <span className="text-3xl font-bold">£299</span>
                            <span className="text-gray-500 ml-1 mb-1">/month</span>
                          </div>
                          <ul className="space-y-2 mb-4">
                            <li className="flex items-center text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Sample feature 1
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Sample feature 2
                            </li>
                          </ul>
                          <Button className="w-full">Select Plan</Button>
                        </div>
                      )}
                      
                      {pricingStyle === 'table' && (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Package</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Features</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3">Basic Package</td>
                                <td className="px-4 py-3">£299/month</td>
                                <td className="px-4 py-3">
                                  <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>Sample feature 1</li>
                                    <li>Sample feature 2</li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {pricingStyle === 'list' && (
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">Basic Package</h5>
                            <span className="text-lg font-bold">£299/month</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            Perfect for small businesses just getting started.
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-center text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Sample feature 1
                            </li>
                            <li className="flex items-center text-sm">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Sample feature 2
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-3">
                      This is just a preview. The actual design will match your website's style.
                    </p>
                  </div>
                  
                  {/* Pricing Options List */}
                  {pricingFields.map((field, index) => (
                    <Card key={field.id} className="border">
                      <CardHeader className="bg-gray-50 py-3 px-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Package {index + 1}</h4>
                          {pricingFields.length > 1 && (
                            <Button 
                              type="button" 
                              onClick={() => removePricing(index)}
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
                        {/* Package Name */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Package Name
                          </label>
                          <Input 
                            placeholder="Basic, Standard, Premium, etc."
                            {...register(`pricing_options.${index}.name`, { 
                              required: "Package name is required" 
                            })}
                          />
                          {errors.pricing_options?.[index]?.name && (
                            <p className="text-red-500 text-sm">{errors.pricing_options[index]?.name?.message}</p>
                          )}
                        </div>
                        
                        {/* Price & Billing Period */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Price
                            </label>
                            <div>
                              <Input 
                                placeholder="£299"
                                {...register(`pricing_options.${index}.price`, { 
                                  required: "Price is required" 
                                })}
                              />
                            </div>
                            {errors.pricing_options?.[index]?.price && (
                              <p className="text-red-500 text-sm">{errors.pricing_options[index]?.price?.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Billing Period
                            </label>
                            <Select
                              onValueChange={(value) => setValue(`pricing_options.${index}.period`, value as any)}
                              defaultValue={field.period}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="one-time">One-time payment</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Popular Package Flag */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`pricing_options.${index}.is_popular`}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            {...register(`pricing_options.${index}.is_popular`)}
                          />
                          <label
                            htmlFor={`pricing_options.${index}.is_popular`}
                            className="text-sm font-medium text-gray-700"
                          >
                            Mark as popular package
                          </label>
                        </div>
                        
                        {/* Package Features */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Package Features
                          </label>
                          <div className="space-y-2">
                            {field.features && field.features.map((_, featureIndex) => (
                              <div key={featureIndex} className="flex gap-2">
                                <Input 
                                  placeholder={`Feature ${featureIndex + 1}`}
                                  {...register(`pricing_options.${index}.features.${featureIndex}` as const)}
                                />
                                {field.features && field.features.length > 1 && (
                                  <Button 
                                    type="button"
                                    onClick={() => {
                                      const features = [...field.features];
                                      features.splice(featureIndex, 1);
                                      setValue(`pricing_options.${index}.features`, features);
                                    }}
                                    variant="ghost" 
                                    size="sm"
                                    className="p-0 h-10 w-10 text-gray-500 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <Button 
                              type="button"
                              onClick={() => {
                                const features = [...field.features, ''];
                                setValue(`pricing_options.${index}.features`, features);
                              }}
                              variant="outline" 
                              size="sm"
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Feature
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
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