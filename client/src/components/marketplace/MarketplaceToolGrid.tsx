import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Check, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ExternalTool, ToolInstallation } from '@shared/marketplace';

const MarketplaceToolGrid = () => {
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all available tools
  const { data: availableTools, isLoading: toolsLoading, error: toolsError } = useQuery({
    queryKey: ['/api/marketplace/tools', visibility],
    queryFn: async () => {
      const response = await fetch(`/api/marketplace/tools?visibility=${visibility}`);
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace tools');
      }
      return response.json() as Promise<ExternalTool[]>;
    }
  });

  // Get installed tools
  const { data: installedTools, isLoading: installationsLoading } = useQuery({
    queryKey: ['/api/marketplace/tools/installed'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/tools/installed');
      if (!response.ok) {
        throw new Error('Failed to fetch installed tools');
      }
      return response.json() as Promise<ToolInstallation[]>;
    }
  });

  // Install tool mutation
  const installMutation = useMutation({
    mutationFn: async ({ toolId, userId }: { toolId: string, userId: number }) => {
      const response = await apiRequest('POST', '/api/marketplace/tools/install', { toolId, userId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tool installed",
        description: "The tool has been installed successfully.",
      });
      // Invalidate installed tools query
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/tools/installed'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Installation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Uninstall tool mutation
  const uninstallMutation = useMutation({
    mutationFn: async (installationId: number) => {
      const response = await apiRequest('POST', '/api/marketplace/tools/uninstall', { installationId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tool uninstalled",
        description: "The tool has been uninstalled successfully.",
      });
      // Invalidate installed tools query
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/tools/installed'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Uninstallation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Check if a tool is installed
  const isToolInstalled = (toolId: string) => {
    if (!installedTools) return false;
    return installedTools.some(installation => installation.toolId.toString() === toolId);
  };

  // Get the installation ID for a tool
  const getInstallationId = (toolId: string): number | undefined => {
    if (!installedTools) return undefined;
    const installation = installedTools.find(
      installation => installation.toolId.toString() === toolId
    );
    return installation?.id;
  };

  // Handle tool installation
  const handleInstall = (tool: ExternalTool) => {
    // Use a dummy userId of 1 for now, in a real app this would come from the auth context
    installMutation.mutate({ toolId: tool.id.toString(), userId: 1 });
  };

  // Handle tool uninstallation
  const handleUninstall = (toolId: string) => {
    const installationId = getInstallationId(toolId);
    if (installationId) {
      uninstallMutation.mutate(installationId);
    }
  };

  // Loading states
  if (toolsLoading || installationsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-28 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (toolsError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load marketplace tools</h3>
        <p className="text-gray-600">{(toolsError as Error).message}</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/marketplace/tools'] })} 
          variant="outline" 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">NextMonth Marketplace</h2>
        <div className="flex gap-2">
          <Button 
            variant={visibility === 'public' ? "default" : "outline"} 
            onClick={() => setVisibility('public')}
          >
            Public Tools
          </Button>
          <Button 
            variant={visibility === 'private' ? "default" : "outline"} 
            onClick={() => setVisibility('private')}
          >
            Private Tools
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTools?.map((tool) => {
          const installed = isToolInstalled(tool.id.toString());
          return (
            <Card key={tool.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <Badge variant={tool.isFree ? "outline" : "default"}>
                    {tool.isFree ? 'Free' : `${tool.credits} Credits`}
                  </Badge>
                </div>
                <CardDescription>
                  {tool.publisher || "NextMonth Dev"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-4 text-muted-foreground">{tool.description}</p>
                {tool.tags && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tool.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  v{tool.version || '1.0.0'}
                </div>
                {installed ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUninstall(tool.id.toString())}
                    disabled={uninstallMutation.isPending}
                  >
                    {uninstallMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Installed
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleInstall(tool)}
                    disabled={installMutation.isPending}
                  >
                    {installMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    Install
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MarketplaceToolGrid;