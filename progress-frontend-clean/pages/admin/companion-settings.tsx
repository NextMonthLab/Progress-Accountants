import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/use-tenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Loader } from "@/components/ui/loader";

// Default companion configuration
const defaultCompanionConfig = {
  tone: {
    style: "Professional and friendly",
    examplePhrases: [
      "I'd be happy to help with that.",
      "Here's what I found for you.",
      "Is there anything else you need assistance with?",
    ],
  },
  allowedTopics: ["Business services", "Industry news", "General questions"],
  offlimitTopics: ["Politics", "Religion", "Controversial topics"],
  regulatedIndustry: {
    isRegulated: false,
    guidelines: [],
    termsToAvoid: [],
    requiredDisclaimers: [],
  },
  dataAccess: {
    canAccessCustomerData: false,
    canAccessFinancialData: false,
    canAccessMarketingData: true,
    canAccessAnalyticsData: true,
    customDataSources: [],
  },
};

export default function CompanionSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { tenant, isLoading: isTenantLoading } = useTenant();
  const tenantId = tenant?.id || "00000000-0000-0000-0000-000000000000";

  const {
    data: companionConfig,
    isLoading, 
    isError
  } = useQuery({
    queryKey: ["/api/companion-config", tenantId],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/companion-config?tenantId=${tenantId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch companion configuration");
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching companion config:", error);
        throw error;
      }
    },
    retry: 1,
    enabled: !!tenantId
  });

  const initializeCompanionConfigMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/companion-config?tenantId=${tenantId}`, defaultCompanionConfig);
      if (!res.ok) {
        try {
          const error = await res.json();
          throw new Error(error.error || "Failed to initialize companion configuration");
        } catch (parseError) {
          throw new Error("Failed to initialize companion configuration");
        }
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/companion-config", tenantId],
      });
      toast({
        title: "Configuration initialized",
        description: "Your companion configuration has been initialized successfully. Refresh to see settings.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to initialize configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading || isTenantLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  // If there's no config yet or an error occurred, show the initialization screen
  if (isError || !companionConfig) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader className="border-b dark:border-slate-800">
            <CardTitle className="text-2xl">Initialize Business Companion Settings</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Set up your business companion to interact with users based on your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              You haven't configured your business companion settings yet. Initialize with default settings to get started.
            </p>
            <div className="space-y-4">
              <div className="flex items-center p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900">
                <div className="mr-4 text-indigo-500 dark:text-indigo-400">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-indigo-700 dark:text-indigo-300">Professional Default Settings</h3>
                  <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
                    Start with a professional tone and standard configuration.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 pb-6 border-t dark:border-slate-800">
            <Button
              onClick={() => initializeCompanionConfigMutation.mutate()}
              disabled={initializeCompanionConfigMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-5 py-2 h-11"
              size="lg"
            >
              {initializeCompanionConfigMutation.isPending ? (
                <>
                  <Loader size="sm" className="mr-2 text-white" />
                  Initializing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Initialize Configuration
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If we have the config, show a temporary message that the full settings form is coming soon
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Companion Persona Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your business companion interacts with users, what topics it discusses, and what data it can access.
          </p>
        </div>
      </div>
      
      <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
        <CardHeader className="border-b dark:border-slate-800">
          <CardTitle className="text-2xl">Companion Configuration Detected</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Your business companion has been configured with the following settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Tone & Style</h3>
              <p className="text-muted-foreground">
                {companionConfig.toneStyle || 'Professional and friendly'}
              </p>
              
              <h4 className="mt-4 font-medium text-slate-700 dark:text-slate-300">Example Phrases</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                <li>How can I assist you with your accounting needs today?</li>
                <li>I'd be happy to explain our services in more detail.</li>
                <li>Let me know if you need any clarification.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Topics</h3>
              
              <h4 className="mt-4 font-medium text-slate-700 dark:text-slate-300">Allowed Topics</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                {companionConfig.allowedTopics && (
                  typeof companionConfig.allowedTopics === 'string' ? 
                    JSON.parse(companionConfig.allowedTopics).map((topic: string, index: number) => (
                      <li key={index}>{topic}</li>
                    ))
                  : Array.isArray(companionConfig.allowedTopics) ?
                    companionConfig.allowedTopics.map((topic: string, index: number) => (
                      <li key={index}>{topic}</li>
                    ))
                  : <li>Business services and general questions</li>
                )}
              </ul>
              
              <h4 className="mt-4 font-medium text-slate-700 dark:text-slate-300">Off-Limit Topics</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Politics</li>
                <li>Religion</li>
                <li>Controversial topics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Regulated Industry Settings</h3>
              <p className="text-muted-foreground">
                {companionConfig.isRegulated
                  ? "Your business is set as a regulated industry."
                  : "Your business is not set as a regulated industry."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Data Access Settings</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Customer Data: Restricted</li>
                <li>Financial Data: Restricted</li>
                <li>Marketing Data: Allowed</li>
                <li>Analytics Data: Allowed</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 pb-6 border-t dark:border-slate-800">
          <p className="text-sm text-muted-foreground italic">
            Full settings editor will be available in an upcoming release.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}