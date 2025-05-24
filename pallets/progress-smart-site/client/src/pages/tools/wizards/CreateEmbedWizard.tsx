import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/components/ClientDataProvider';

// Define step-specific schemas
const nameStepSchema = z.object({
  name: z.string().min(3, "Embed name must be at least 3 characters"),
});

const descriptionStepSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description"),
});

const mediaStepSchema = z.object({
  mediaUrl: z.string().optional(),
  mediaId: z.string().optional(),
});

const displayStyleStepSchema = z.object({
  displayStyle: z.enum(['iframe', 'responsive', 'modal', 'inline']),
});

// Combined schema for the entire embed
const embedSchema = nameStepSchema
  .merge(descriptionStepSchema)
  .merge(mediaStepSchema)
  .merge(displayStyleStepSchema);

type EmbedValues = z.infer<typeof embedSchema>;

// Steps for the wizard
const STEPS = [
  { id: 1, name: 'Name', description: 'Give your embed a name' },
  { id: 2, name: 'Description', description: 'Describe what this embed contains' },
  { id: 3, name: 'Media', description: 'Add images or other media' },
  { id: 4, name: 'Display Style', description: 'Choose how the embed will appear' },
  { id: 5, name: 'Confirm', description: 'Review and create' }
];

export default function CreateEmbedWizard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<EmbedValues>({
    resolver: zodResolver(embedSchema),
    defaultValues: {
      name: '',
      description: '',
      mediaUrl: '',
      mediaId: '',
      displayStyle: 'responsive',
    },
    mode: 'onChange',
  });

  const watchAllFields = form.watch();

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
        name: form.getValues('name') || "Untitled Embed",
        description: form.getValues('description') || "Draft embed",
        toolType: "embed",
        displayStyle: form.getValues('displayStyle'),
        mediaUrl: form.getValues('mediaUrl'),
        mediaId: form.getValues('mediaId'),
        createdBy: user.id,
        status: "draft",
      });

      if (response.ok) {
        toast({
          title: "Draft saved",
          description: "Your embed has been saved as a draft",
          variant: "default",
        });
        queryClient.invalidateQueries(['/api/tools']);
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

  const onSubmit = async (data: EmbedValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an embed",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First save the tool
      const toolResponse = await apiRequest("POST", "/api/tools", {
        ...data,
        toolType: "embed",
        createdBy: user.id,
        status: "published",
      });

      if (!toolResponse.ok) {
        throw new Error("Failed to create embed");
      }

      const toolData = await toolResponse.json();
      
      // Then create a tool request for internal processing
      await apiRequest("POST", "/api/tool-requests", {
        toolId: toolData.id,
        businessId: user.id.toString(),
        requestData: {
          toolType: "embed",
          name: data.name,
          description: data.description,
          requestedBy: user.name || user.username,
        },
        status: "pending"
      });

      toast({
        title: "Embed created",
        description: "Your embed has been created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries(['/api/tools']);
      navigate('/tools-hub');
    } catch (error) {
      console.error("Error creating embed:", error);
      toast({
        title: "Error",
        description: "Something went wrong while creating your embed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = () => {
    // This would typically open a file selector and upload to Cloudinary
    // For now, we'll just add a placeholder URL
    toast({
      title: "Media Upload",
      description: "Image upload functionality will be implemented soon",
      variant: "default",
    });
    
    form.setValue('mediaUrl', 'https://placehold.co/600x400/navy/white?text=Embed+Preview');
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
                <FormLabel>Embed Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name for your embed" {...field} />
                </FormControl>
                <FormDescription>
                  Choose a descriptive name that indicates what this embed will display
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
                    placeholder="Describe what content this embed will display..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain what external content this embed will bring into your site
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
                  <FormLabel>Embed Preview Image (Optional)</FormLabel>
                  <FormControl>
                    <>
                      {field.value && (
                        <div className="my-4">
                          <img 
                            src={field.value} 
                            alt="Embed Preview" 
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
                        Upload Preview Image
                      </Button>
                    </>
                  </FormControl>
                  <FormDescription>
                    Add a preview image showing what your embed will look like (optional)
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
                          <RadioGroupItem value="iframe" id="iframe" />
                          <Label htmlFor="iframe" className="flex flex-col">
                            <div className="font-medium">Standard iframe</div>
                            <div className="text-sm text-muted-foreground">
                              Fixed dimensions iframe
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="responsive" id="responsive" />
                          <Label htmlFor="responsive" className="flex flex-col">
                            <div className="font-medium">Responsive</div>
                            <div className="text-sm text-muted-foreground">
                              Adjusts to fit container width
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="modal" id="modal" />
                          <Label htmlFor="modal" className="flex flex-col">
                            <div className="font-medium">Modal</div>
                            <div className="text-sm text-muted-foreground">
                              Opens in popup overlay when clicked
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inline" id="inline" />
                          <Label htmlFor="inline" className="flex flex-col">
                            <div className="font-medium">Inline</div>
                            <div className="text-sm text-muted-foreground">
                              Seamless integration with your content
                            </div>
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Select how you want your embedded content to be displayed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="rounded-md border border-border p-4">
              <h3 className="font-medium mb-2">Embed Summary</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Name:</div>
                  <div className="col-span-2">{watchAllFields.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Display Style:</div>
                  <div className="col-span-2 capitalize">{watchAllFields.displayStyle}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Description:</div>
                  <div className="col-span-2">{watchAllFields.description}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Has Preview:</div>
                  <div className="col-span-2">{watchAllFields.mediaUrl ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Please review the details above. When you're ready, click 'Create Embed' to finalize your embed.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Create Embed Tool</CardTitle>
          <CardDescription>
            Create a custom embed to integrate external content into your site
          </CardDescription>
          <Progress value={(currentStep / STEPS.length) * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
            <TabsList className="grid grid-cols-5 mb-8">
              {STEPS.map((step) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id.toString()}
                  disabled={step.id > currentStep}
                  className="text-xs sm:text-sm"
                >
                  {step.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}
              </form>
            </Form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tools-hub')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
          </div>
          <div className="flex gap-2">
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
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Embed'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Label component for RadioGroup items
const Label = ({
  htmlFor,
  className,
  children,
}: {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);