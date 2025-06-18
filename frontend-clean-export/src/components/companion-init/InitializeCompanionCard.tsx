import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Shield } from 'lucide-react';

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

interface InitializeCompanionCardProps {
  tenantId: string;
}

export function InitializeCompanionCard({ tenantId }: InitializeCompanionCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const initializeCompanionConfigMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/companion-config?tenantId=${tenantId}`, defaultCompanionConfig);
      if (!res.ok) {
        // Try to read the error message
        try {
          const error = await res.json();
          throw new Error(error.error || "Failed to initialize companion configuration");
        } catch (parseError) {
          // If we can't parse the JSON, throw a generic error
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
        description: "Your companion configuration has been initialized successfully.",
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

  return (
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
            "Initialize Configuration"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}