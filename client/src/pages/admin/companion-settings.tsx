import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, Save, RefreshCw, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/layouts/AdminLayout";
import { Loader } from "@/components/ui/loader";

// Define the schema for the companion configuration form
const companionConfigSchema = z.object({
  tone: z.object({
    style: z.string(),
    examplePhrases: z.array(z.string())
  }),
  allowedTopics: z.array(z.string()),
  offlimitTopics: z.array(z.string()),
  regulatedIndustry: z.object({
    isRegulated: z.boolean(),
    guidelines: z.array(z.string()),
    termsToAvoid: z.array(z.string()),
    requiredDisclaimers: z.array(z.string())
  }),
  dataAccess: z.object({
    canAccessClientData: z.boolean(),
    customerDataRestrictions: z.array(z.string()),
    sensitiveFieldsRestricted: z.array(z.string())
  })
});

// Define the component for managing companion configuration
export default function CompanionSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tone");
  
  // Get the tenant ID for API requests
  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000000';
  
  // Fetch current companion configuration
  const { 
    data: config, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/companion-config", tenantId],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/companion-config?tenantId=${tenantId}`);
        if (!res.ok) {
          // Handle 404 specially to avoid double-reading the response
          if (res.status === 404) {
            throw new Error("Companion configuration not found");
          }
          
          // For other errors, try to read the JSON
          try {
            const error = await res.json();
            throw new Error(error.error || "Failed to fetch companion configuration");
          } catch (parseError) {
            // If we can't parse JSON (e.g., body stream already read)
            throw new Error("Companion configuration not found");
          }
        }
        return res.json();
      } catch (error) {
        // Ensure we always have a proper error object
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    },
    retry: 1,
    enabled: !!tenantId
  });
  
  // Setup form with react-hook-form
  const form = useForm({
    resolver: zodResolver(companionConfigSchema),
    defaultValues: {
      tone: {
        style: "professional",
        examplePhrases: ["How can I assist you today?", "I'd be happy to help with that.", "Let me look into that for you."]
      },
      allowedTopics: ["accounting", "tax preparation", "financial planning"],
      offlimitTopics: ["specific investment advice", "legal advice"],
      regulatedIndustry: {
        isRegulated: true,
        guidelines: ["All tax advice must be general in nature"],
        termsToAvoid: ["guarantee", "promise"],
        requiredDisclaimers: ["This information is general in nature and not a substitute for professional advice."]
      },
      dataAccess: {
        canAccessClientData: true,
        customerDataRestrictions: ["Cannot share specifics between clients"],
        sensitiveFieldsRestricted: ["tax identification numbers", "bank details"]
      }
    }
  });
  
  // Update form values when config is loaded
  React.useEffect(() => {
    if (config) {
      form.reset({
        tone: config.tone,
        allowedTopics: config.allowedTopics,
        offlimitTopics: config.offlimitTopics,
        regulatedIndustry: config.regulatedIndustry,
        dataAccess: config.dataAccess
      });
    }
  }, [config, form]);
  
  // Mutation for updating the configuration
  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof companionConfigSchema>) => {
      const res = await apiRequest("PUT", "/api/companion-config", { ...data, tenantId });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update companion configuration");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration updated",
        description: "Your companion settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/companion-config", tenantId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for creating the initial configuration
  const createConfigMutation = useMutation({
    mutationFn: async (data: z.infer<typeof companionConfigSchema>) => {
      const res = await apiRequest("POST", "/api/companion-config", { ...data, tenantId });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create companion configuration");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration created",
        description: "Your companion settings have been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/companion-config", tenantId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Add a new example phrase
  const addExamplePhrase = () => {
    const currentPhrases = form.getValues("tone.examplePhrases");
    form.setValue("tone.examplePhrases", [...currentPhrases, ""]);
  };
  
  // Remove an example phrase
  const removeExamplePhrase = (index: number) => {
    const currentPhrases = form.getValues("tone.examplePhrases");
    form.setValue(
      "tone.examplePhrases", 
      currentPhrases.filter((_, i) => i !== index)
    );
  };
  
  // Add a new allowed topic
  const addAllowedTopic = () => {
    const currentTopics = form.getValues("allowedTopics");
    form.setValue("allowedTopics", [...currentTopics, ""]);
  };
  
  // Remove an allowed topic
  const removeAllowedTopic = (index: number) => {
    const currentTopics = form.getValues("allowedTopics");
    form.setValue(
      "allowedTopics", 
      currentTopics.filter((_, i) => i !== index)
    );
  };
  
  // Add a new off-limit topic
  const addOfflimitTopic = () => {
    const currentTopics = form.getValues("offlimitTopics");
    form.setValue("offlimitTopics", [...currentTopics, ""]);
  };
  
  // Remove an off-limit topic
  const removeOfflimitTopic = (index: number) => {
    const currentTopics = form.getValues("offlimitTopics");
    form.setValue(
      "offlimitTopics", 
      currentTopics.filter((_, i) => i !== index)
    );
  };
  
  // Add a new guideline
  const addGuideline = () => {
    const currentGuidelines = form.getValues("regulatedIndustry.guidelines");
    form.setValue("regulatedIndustry.guidelines", [...currentGuidelines, ""]);
  };
  
  // Remove a guideline
  const removeGuideline = (index: number) => {
    const currentGuidelines = form.getValues("regulatedIndustry.guidelines");
    form.setValue(
      "regulatedIndustry.guidelines", 
      currentGuidelines.filter((_, i) => i !== index)
    );
  };
  
  // Add a new term to avoid
  const addTermToAvoid = () => {
    const currentTerms = form.getValues("regulatedIndustry.termsToAvoid");
    form.setValue("regulatedIndustry.termsToAvoid", [...currentTerms, ""]);
  };
  
  // Remove a term to avoid
  const removeTermToAvoid = (index: number) => {
    const currentTerms = form.getValues("regulatedIndustry.termsToAvoid");
    form.setValue(
      "regulatedIndustry.termsToAvoid", 
      currentTerms.filter((_, i) => i !== index)
    );
  };
  
  // Add a new disclaimer
  const addDisclaimer = () => {
    const currentDisclaimers = form.getValues("regulatedIndustry.requiredDisclaimers");
    form.setValue("regulatedIndustry.requiredDisclaimers", [...currentDisclaimers, ""]);
  };
  
  // Remove a disclaimer
  const removeDisclaimer = (index: number) => {
    const currentDisclaimers = form.getValues("regulatedIndustry.requiredDisclaimers");
    form.setValue(
      "regulatedIndustry.requiredDisclaimers", 
      currentDisclaimers.filter((_, i) => i !== index)
    );
  };
  
  // Add a new data restriction
  const addDataRestriction = () => {
    const currentRestrictions = form.getValues("dataAccess.customerDataRestrictions");
    form.setValue("dataAccess.customerDataRestrictions", [...currentRestrictions, ""]);
  };
  
  // Remove a data restriction
  const removeDataRestriction = (index: number) => {
    const currentRestrictions = form.getValues("dataAccess.customerDataRestrictions");
    form.setValue(
      "dataAccess.customerDataRestrictions", 
      currentRestrictions.filter((_, i) => i !== index)
    );
  };
  
  // Add a new sensitive field
  const addSensitiveField = () => {
    const currentFields = form.getValues("dataAccess.sensitiveFieldsRestricted");
    form.setValue("dataAccess.sensitiveFieldsRestricted", [...currentFields, ""]);
  };
  
  // Remove a sensitive field
  const removeSensitiveField = (index: number) => {
    const currentFields = form.getValues("dataAccess.sensitiveFieldsRestricted");
    form.setValue(
      "dataAccess.sensitiveFieldsRestricted", 
      currentFields.filter((_, i) => i !== index)
    );
  };
  
  // Form submission handler
  const onSubmit = (values: z.infer<typeof companionConfigSchema>) => {
    updateMutation.mutate(values);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (error) {
    // Check if this is likely a missing table error (companion_config doesn't exist)
    const errorMessage = (error as Error).message;
    const isMissingTableError = 
      errorMessage.includes("not found") || 
      errorMessage.includes("does not exist") ||
      errorMessage.includes("Companion configuration not found");
      
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Business Companion Persona Settings</h1>
              <p className="text-muted-foreground mt-2">
                Customize how your business companion interacts with users, what topics it discusses, and what data it can access.
              </p>
            </div>
          </div>
          
          <Card className="border-muted/20 dark:bg-slate-900/60 mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle className="text-xl">
                {isMissingTableError ? "Initialize Companion Settings" : "Error Loading Settings"}
              </CardTitle>
              <CardDescription>
                {isMissingTableError 
                  ? "It looks like this is your first time setting up the AI companion. Let's get started by creating your initial configuration."
                  : "There was a problem loading your companion settings."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMissingTableError ? (
                <div className="space-y-4">
                  <p>We'll set up your companion with recommended default settings that you can customize afterward:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Professional communication style</li>
                    <li>Accounting and financial topics enabled</li>
                    <li>Regulatory compliance settings configured</li>
                    <li>Data access permissions secured</li>
                  </ul>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-muted-foreground">{errorMessage}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              {isMissingTableError ? (
                <Button 
                  onClick={() => createConfigMutation.mutate(form.getValues())}
                  disabled={createConfigMutation.isPending}
                >
                  {createConfigMutation.isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4" /> Creating Configuration...
                    </>
                  ) : (
                    <>
                      Initialize Configuration
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/companion-config", tenantId] })}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Companion Persona Settings</h1>
            <p className="text-muted-foreground mt-2">
              Customize how your business companion interacts with users, what topics it discusses, and what data it can access.
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-2">
                  <TabsTrigger value="tone">Tone & Style</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
                  <TabsTrigger value="data">Data Access</TabsTrigger>
                </TabsList>
                
                <Card>
                  <TabsContent value="tone" className="space-y-4 p-1">
                    <CardHeader>
                      <CardTitle>Tone & Communication Style</CardTitle>
                      <CardDescription>
                        Set the tone and style for how your companion will communicate with users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="tone.style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Communication Style</FormLabel>
                            <div className="flex space-x-2">
                              <Button
                                type="button"
                                variant={field.value === "casual" ? "default" : "outline"}
                                onClick={() => field.onChange("casual")}
                                className="flex-1"
                              >
                                Casual
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === "professional" ? "default" : "outline"}
                                onClick={() => field.onChange("professional")}
                                className="flex-1"
                              >
                                Professional
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === "formal" ? "default" : "outline"}
                                onClick={() => field.onChange("formal")}
                                className="flex-1"
                              >
                                Formal
                              </Button>
                            </div>
                            <FormDescription>
                              This sets the overall communication style of your companion
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <FormLabel>Example Phrases</FormLabel>
                        <FormDescription>
                          Add example phrases that represent your desired tone and style
                        </FormDescription>
                        
                        {form.watch("tone.examplePhrases").map((phrase, index) => (
                          <div key={index} className="flex items-center space-x-2 mt-2">
                            <FormField
                              control={form.control}
                              name={`tone.examplePhrases.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} placeholder="Enter an example phrase" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExamplePhrase(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addExamplePhrase}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Example Phrase
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="topics" className="space-y-4 p-1">
                    <CardHeader>
                      <CardTitle>Topics Management</CardTitle>
                      <CardDescription>
                        Control what topics your companion can and cannot discuss
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <FormLabel>Allowed Topics</FormLabel>
                        <FormDescription>
                          Topics that your companion can discuss with users
                        </FormDescription>
                        
                        {form.watch("allowedTopics").map((topic, index) => (
                          <div key={index} className="flex items-center space-x-2 mt-2">
                            <FormField
                              control={form.control}
                              name={`allowedTopics.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} placeholder="Enter an allowed topic" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAllowedTopic(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addAllowedTopic}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Allowed Topic
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <FormLabel>Off-Limit Topics</FormLabel>
                        <FormDescription>
                          Topics that your companion should avoid discussing
                        </FormDescription>
                        
                        {form.watch("offlimitTopics").map((topic, index) => (
                          <div key={index} className="flex items-center space-x-2 mt-2">
                            <FormField
                              control={form.control}
                              name={`offlimitTopics.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input {...field} placeholder="Enter a restricted topic" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOfflimitTopic(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOfflimitTopic}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Off-Limit Topic
                        </Button>
                      </div>
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="regulatory" className="space-y-4 p-1">
                    <CardHeader>
                      <CardTitle>Regulatory & Compliance</CardTitle>
                      <CardDescription>
                        Set compliance guidelines and regulations for your industry
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="regulatedIndustry.isRegulated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Regulated Industry</FormLabel>
                              <FormDescription>
                                Enable if your business is subject to industry regulations
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("regulatedIndustry.isRegulated") && (
                        <>
                          <div className="space-y-2">
                            <FormLabel>Compliance Guidelines</FormLabel>
                            <FormDescription>
                              Guidelines the companion should follow to maintain compliance
                            </FormDescription>
                            
                            {form.watch("regulatedIndustry.guidelines").map((guideline, index) => (
                              <div key={index} className="flex items-center space-x-2 mt-2">
                                <FormField
                                  control={form.control}
                                  name={`regulatedIndustry.guidelines.${index}`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          placeholder="Enter a compliance guideline" 
                                          rows={2}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeGuideline(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addGuideline}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Guideline
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Terms to Avoid</FormLabel>
                            <FormDescription>
                              Terms that may have regulatory implications and should be avoided
                            </FormDescription>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {form.watch("regulatedIndustry.termsToAvoid").map((term, index) => (
                                <Badge key={index} variant="outline" className="px-3 py-1">
                                  <FormField
                                    control={form.control}
                                    name={`regulatedIndustry.termsToAvoid.${index}`}
                                    render={({ field }) => (
                                      <div className="flex items-center">
                                        <Input 
                                          {...field} 
                                          placeholder="Term" 
                                          className="border-0 p-0 h-auto w-auto bg-transparent" 
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4 ml-2"
                                          onClick={() => removeTermToAvoid(index)}
                                        >
                                          <Trash className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  />
                                </Badge>
                              ))}
                              
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addTermToAvoid}
                                className="px-2"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Required Disclaimers</FormLabel>
                            <FormDescription>
                              Disclaimers that should be included in relevant responses
                            </FormDescription>
                            
                            {form.watch("regulatedIndustry.requiredDisclaimers").map((disclaimer, index) => (
                              <div key={index} className="flex items-center space-x-2 mt-2">
                                <FormField
                                  control={form.control}
                                  name={`regulatedIndustry.requiredDisclaimers.${index}`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          placeholder="Enter a disclaimer" 
                                          rows={2}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeDisclaimer(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addDisclaimer}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Disclaimer
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-4 p-1">
                    <CardHeader>
                      <CardTitle>Data Access & Privacy</CardTitle>
                      <CardDescription>
                        Control what data your companion can access and reference
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="dataAccess.canAccessClientData"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Client Data Access</FormLabel>
                              <FormDescription>
                                Allow companion to access client data to provide personalized responses
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("dataAccess.canAccessClientData") && (
                        <>
                          <div className="space-y-2">
                            <FormLabel>Customer Data Restrictions</FormLabel>
                            <FormDescription>
                              Specify how client data can be used and referenced
                            </FormDescription>
                            
                            {form.watch("dataAccess.customerDataRestrictions").map((restriction, index) => (
                              <div key={index} className="flex items-center space-x-2 mt-2">
                                <FormField
                                  control={form.control}
                                  name={`dataAccess.customerDataRestrictions.${index}`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          placeholder="Enter a data restriction" 
                                          rows={2}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeDataRestriction(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addDataRestriction}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Restriction
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Sensitive Fields</FormLabel>
                            <FormDescription>
                              Specific data fields that should never be referenced
                            </FormDescription>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {form.watch("dataAccess.sensitiveFieldsRestricted").map((field, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                  <FormField
                                    control={form.control}
                                    name={`dataAccess.sensitiveFieldsRestricted.${index}`}
                                    render={({ field: formField }) => (
                                      <div className="flex items-center">
                                        <Input 
                                          {...formField} 
                                          placeholder="Field name" 
                                          className="border-0 p-0 h-auto w-auto bg-transparent" 
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4 ml-2"
                                          onClick={() => removeSensitiveField(index)}
                                        >
                                          <Trash className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  />
                                </Badge>
                              ))}
                              
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addSensitiveField}
                                className="px-2"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </TabsContent>
                  
                  <CardFooter className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset(config)}
                      disabled={updateMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader className="mr-2 h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </Tabs>
            </div>
          </form>
        </Form>
      </div>
  );
}