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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Initialize Business Companion Settings</CardTitle>
            <CardDescription>
              Set up your business companion to interact with users based on your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              You haven't configured your business companion settings yet. Initialize with default settings to get started.
            </p>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="mr-4 text-blue-500">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-medium">Professional Default Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Start with a professional tone and standard configuration.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => initializeCompanionConfigMutation.mutate()}
              disabled={initializeCompanionConfigMutation.isPending}
            >
              {initializeCompanionConfigMutation.isPending ? (
                <>
                  <Loader size="sm" className="mr-2" />
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
      
      <Card>
        <CardHeader>
          <CardTitle>Companion Configuration Detected</CardTitle>
          <CardDescription>
            Your business companion has been configured with the following settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Tone & Style</h3>
              <p className="text-muted-foreground">{companionConfig.tone.style}</p>
              
              <h4 className="mt-4 font-medium">Example Phrases</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {companionConfig.tone.examplePhrases.map((phrase: string, index: number) => (
                  <li key={index}>{phrase}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Topics</h3>
              
              <h4 className="mt-4 font-medium">Allowed Topics</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {companionConfig.allowedTopics.map((topic: string, index: number) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
              
              <h4 className="mt-4 font-medium">Off-Limit Topics</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {companionConfig.offlimitTopics.map((topic: string, index: number) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Regulated Industry Settings</h3>
              <p className="text-muted-foreground">
                {companionConfig.regulatedIndustry.isRegulated 
                  ? "Your business is set as a regulated industry."
                  : "Your business is not set as a regulated industry."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Data Access Settings</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Customer Data: {companionConfig.dataAccess.canAccessCustomerData ? "Allowed" : "Restricted"}</li>
                <li>Financial Data: {companionConfig.dataAccess.canAccessFinancialData ? "Allowed" : "Restricted"}</li>
                <li>Marketing Data: {companionConfig.dataAccess.canAccessMarketingData ? "Allowed" : "Restricted"}</li>
                <li>Analytics Data: {companionConfig.dataAccess.canAccessAnalyticsData ? "Allowed" : "Restricted"}</li>
              </ul>
              
              {companionConfig.dataAccess.customDataSources.length > 0 && (
                <>
                  <h4 className="mt-4 font-medium">Custom Data Sources</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {companionConfig.dataAccess.customDataSources.map((source: string, index: number) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground italic">
            Full settings editor will be available in an upcoming release.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}