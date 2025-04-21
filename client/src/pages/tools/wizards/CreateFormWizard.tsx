import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/components/ClientDataProvider';
import { useQuery } from '@tanstack/react-query';

// Define interface for page selection
interface PageOption {
  id: string;
  name: string;
  path: string;
}

// Define step-specific schemas
const nameStepSchema = z.object({
  name: z.string().min(3, "Form name must be at least 3 characters"),
});

const descriptionStepSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description"),
});

const mediaStepSchema = z.object({
  mediaUrl: z.string().optional(),
  mediaId: z.string().optional(),
});

const displayStyleStepSchema = z.object({
  displayStyle: z.enum(['modal', 'card', 'full-page', 'sidebar']),
});

const integrationStepSchema = z.object({
  addToPage: z.boolean().default(false),
  pageId: z.string().optional(),
  position: z.enum(['top', 'middle', 'bottom']).optional(),
});

// Combined schema for the entire form
const formSchema = nameStepSchema
  .merge(descriptionStepSchema)
  .merge(mediaStepSchema)
  .merge(displayStyleStepSchema)
  .merge(integrationStepSchema);

type FormValues = z.infer<typeof formSchema>;

// Steps for the wizard
const STEPS = [
  { id: 1, name: 'Name', description: 'Give your form a name' },
  { id: 2, name: 'Description', description: 'Describe what this form does' },
  { id: 3, name: 'Media', description: 'Add images or other media' },
  { id: 4, name: 'Display Style', description: 'Choose how the form will appear' },
  { id: 5, name: 'Integration', description: 'Add to an existing page' },
  { id: 6, name: 'Confirm', description: 'Review and create' }
];

export default function CreateFormWizard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch available pages for integration
  const { data: availablePages = [] } = useQuery<PageOption[]>({
    queryKey: ['/api/pages'],
    enabled: currentStep === 5, // Only fetch when on integration step
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      mediaUrl: '',
      mediaId: '',
      displayStyle: 'modal',
      addToPage: false,
      position: 'bottom',
    },
    mode: 'onChange',
  });

  const watchAllFields = form.watch();
  const addToPage = form.watch('addToPage');

  // Determine if the current step is valid
  const isCurrentStepValid = () => {
    const { errors, dirtyFields } = form.formState;
    
    switch (currentStep) {
      case 1:
        return !errors.name && !!dirtyFields.name;
      case 2:
        return !errors.description && !!dirtyFields.description;
      case 3:
        return true; // Media is optional
      case 4:
        return !errors.displayStyle && !!dirtyFields.displayStyle;
      case 5:
        return !addToPage || (!!form.getValues('pageId') && !!form.getValues('position'));
      case 6:
        return true; // Confirmation step is always valid
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your work",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/tools", {
        name: form.getValues('name') || "Untitled Form",
        description: form.getValues('description') || "Draft form",
        toolType: "form",
        displayStyle: form.getValues('displayStyle'),
        mediaUrl: form.getValues('mediaUrl'),
        mediaId: form.getValues('mediaId'),
        createdBy: user.id,
        status: "draft",
      });

      if (response.ok) {
        toast({
          title: "Draft saved",
          description: "Your form has been saved as a draft",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      } else {
        toast({
          title: "Failed to save draft",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving your draft",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First save the tool
      const toolResponse = await apiRequest("POST", "/api/tools", {
        name: data.name,
        description: data.description,
        mediaUrl: data.mediaUrl || null,
        mediaId: data.mediaId || null,
        displayStyle: data.displayStyle,
        toolType: "form",
        createdBy: user.id,
        tenantId: user.tenantId || null, // Pass tenant ID for multi-tenant support
        status: "published",
        settings: {
          fields: [],  // Empty fields array for now - will be configured in a subsequent step
          submitLabel: "Submit",
          successMessage: "Thank you for your submission"
        }
      });

      if (!toolResponse.ok) {
        const errorData = await toolResponse.json();
        throw new Error(errorData.error || "Failed to create form");
      }

      const toolData = await toolResponse.json();
      const toolId = toolData.data?.id || toolData.id;
      
      if (!toolId) {
        throw new Error("No tool ID returned from server");
      }
      
      console.log("Created tool with ID:", toolId);
      
      // Then create a tool request for internal processing
      const requestResponse = await apiRequest("POST", "/api/tool-requests", {
        toolId: toolId,
        businessId: user.id.toString(),
        tenantId: user.tenantId || null, // Pass tenant ID for multi-tenant support
        requestData: {
          toolType: "form",
          name: data.name,
          description: data.description,
          requestedBy: user.name || user.username,
        },
        status: "pending"
      });
      
      if (!requestResponse.ok) {
        console.warn("Failed to create tool request, but tool was created successfully");
      }
      
      // If user opted to add to a page, create that integration
      if (data.addToPage && data.pageId && data.position) {
        try {
          const integrationResponse = await apiRequest("POST", "/api/page-tool-integrations", {
            pageId: data.pageId,
            toolId: toolId,
            position: data.position,
            enabled: true,
            createdBy: user.id,
            tenantId: user.tenantId || null, // Pass tenant ID for multi-tenant support
            settings: {
              displayMode: data.displayStyle
            }
          });
          
          if (integrationResponse.ok) {
            toast({
              title: "Tool integrated with page",
              description: `Form successfully added to the selected page at the ${data.position} position`,
              variant: "default",
            });
            
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
            queryClient.invalidateQueries({ queryKey: ['/api/page-integrations', data.pageId] });
          } else {
            console.warn("Failed to create page integration, but tool was created successfully");
          }
        } catch (integrationError) {
          console.error("Error creating page integration:", integrationError);
          toast({
            title: "Integration Warning",
            description: "Your form was created but couldn't be added to the page. You can add it later from the Tools Hub.",
            variant: "warning",
          });
        }
      }

      toast({
        title: "Form created",
        description: "Your form has been created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      navigate('/tools-hub');
    } catch (error) {
      console.error("Error creating form:", error);
      toast({
        title: "Error",
        description: "Something went wrong while creating your form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = () => {
    // This would typically open a file selector and upload to Cloudinary
    toast({
      title: "Media Upload",
      description: "Image upload functionality will be implemented soon",
      variant: "default",
    });
    
    form.setValue('mediaUrl', 'https://placehold.co/600x400/navy/white?text=Form+Image');
    form.setValue('mediaId', 'placeholder_' + Date.now());
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Form Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name for your form" {...field} />
                </FormControl>
                <FormDescription>
                  Choose a clear, descriptive name for your form
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 2:
        return (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this form will be used for..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain the purpose of this form and what information it will collect
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media (Optional)</FormLabel>
                  <FormControl>
                    <>
                      {field.value && (
                        <div className="my-4">
                          <img 
                            src={field.value} 
                            alt="Form Media" 
                            className="max-w-full h-auto rounded-md border border-border"
                          />
                        </div>
                      )}
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleMediaUpload}
                      >
                        Upload Image
                      </Button>
                    </>
                  </FormControl>
                  <FormDescription>
                    Add an image that represents this form (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 4:
        return (
          <FormField
            control={form.control}
            name="displayStyle"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel>Display Style</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="modal" id="modal" />
                          <Label htmlFor="modal" className="flex flex-col">
                            <div className="font-medium">Modal</div>
                            <div className="text-sm text-muted-foreground">
                              Opens in a popup overlay
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex flex-col">
                            <div className="font-medium">Card</div>
                            <div className="text-sm text-muted-foreground">
                              Displays as an embedded card
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-page" id="full-page" />
                          <Label htmlFor="full-page" className="flex flex-col">
                            <div className="font-medium">Full Page</div>
                            <div className="text-sm text-muted-foreground">
                              Takes up an entire page
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sidebar" id="sidebar" />
                          <Label htmlFor="sidebar" className="flex flex-col">
                            <div className="font-medium">Sidebar</div>
                            <div className="text-sm text-muted-foreground">
                              Slides in from the side
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="addToPage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Add this form to an existing page
                    </FormLabel>
                    <FormDescription>
                      Integrate this form directly into one of your existing pages
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {addToPage && (
              <>
                <FormField
                  control={form.control}
                  name="pageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Page</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a page" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availablePages.length > 0 ? (
                            availablePages.map(page => (
                              <SelectItem key={page.id} value={page.id}>
                                {page.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No pages available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the page where this form will appear
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position on Page</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose where on the page the form should appear
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-2">Form Summary</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Name:</span> {watchAllFields.name}
                </div>
                <div>
                  <span className="font-semibold">Description:</span> {watchAllFields.description}
                </div>
                <div>
                  <span className="font-semibold">Display Style:</span> {watchAllFields.displayStyle}
                </div>
                {watchAllFields.mediaUrl && (
                  <div>
                    <span className="font-semibold">Media:</span> Included
                  </div>
                )}
                {watchAllFields.addToPage && (
                  <div>
                    <span className="font-semibold">Page Integration:</span> 
                    {' '}
                    {availablePages.find(p => p.id === watchAllFields.pageId)?.name || 'Selected page'} 
                    ({watchAllFields.position} position)
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              By creating this form, you acknowledge that it will need to be reviewed 
              by an administrator before being published to your site.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Form</h1>
        <p className="text-muted-foreground">
          Build a custom form to collect information from your clients or visitors.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / STEPS.length) * 100)}% Complete
          </span>
        </div>
        <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={goToPreviousStep}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            {currentStep < STEPS.length && currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSaveAsDraft}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
            )}
            
            {currentStep < STEPS.length ? (
              <Button 
                type="button" 
                onClick={goToNextStep}
                disabled={!isCurrentStepValid() || isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-[var(--navy)] hover:bg-[var(--navy)]/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Form'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}