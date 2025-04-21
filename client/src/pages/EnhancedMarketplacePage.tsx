import { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Download
} from 'lucide-react';

type ToolCategory = 'page_templates' | 'tools' | 'calculators' | 'dashboards' | string;

export default function EnhancedMarketplacePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Fetch marketplace tools
  const { 
    data: marketplaceTools = [], 
    isLoading: isLoadingMarketplace, 
    error: marketplaceError 
  } = useQuery({
    queryKey: ['/api/tools/marketplace'],
    enabled: !!user,
  });
  
  // Fetch installed tools
  const { 
    data: installedTools = [], 
    isLoading: isLoadingInstalled,
  } = useQuery({
    queryKey: ['/api/tools/installed'],
    enabled: !!user,
  });
  
  // Install a tool mutation
  const installToolMutation = useMutation({
    mutationFn: async (toolId: number) => {
      const response = await apiRequest("POST", `/api/tools/marketplace/install/${toolId}`, {});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to install tool");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools/installed'] });
      toast({
        title: "Tool installed",
        description: "The tool has been installed successfully",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Installation failed",
        description: error.message || "An error occurred while installing the tool",
        variant: "destructive"
      });
    }
  });

  // Uninstall a tool mutation
  const uninstallToolMutation = useMutation({
    mutationFn: async (installationId: number) => {
      const response = await apiRequest("POST", `/api/tools/uninstall/${installationId}`, {});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to uninstall tool");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools/installed'] });
      toast({
        title: "Tool uninstalled",
        description: "The tool has been uninstalled successfully",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Uninstallation failed",
        description: error.message || "An error occurred while uninstalling the tool",
        variant: "destructive"
      });
    }
  });
  
  // Filter marketplace tools based on category
  const getFilteredMarketplaceTools = () => {
    if (!Array.isArray(marketplaceTools) || marketplaceTools.length === 0) return [];
    
    return marketplaceTools.filter((tool: any) => {
      if (activeTab === 'all') return true;
      return tool.toolCategory === activeTab;
    });
  };
  
  // Check if a tool is installed
  const isToolInstalled = (toolId: number) => {
    if (!Array.isArray(installedTools) || installedTools.length === 0) return false;
    return installedTools.some((item: any) => item.tool.id === toolId);
  };
  
  // Get installation ID for a tool
  const getInstallationId = (toolId: number) => {
    if (!Array.isArray(installedTools) || installedTools.length === 0) return null;
    const installation = installedTools.find((item: any) => item.tool.id === toolId);
    return installation ? installation.installation.id : null;
  };
  
  // Handle tool installation
  const handleInstallTool = (toolId: number) => {
    installToolMutation.mutate(toolId);
  };
  
  // Handle tool uninstallation
  const handleUninstallTool = (installationId: number) => {
    uninstallToolMutation.mutate(installationId);
  };
  
  // Get unique categories from tools
  const getUniqueCategories = (): ToolCategory[] => {
    if (!Array.isArray(marketplaceTools) || marketplaceTools.length === 0) return [];
    
    const categories = new Set<ToolCategory>();
    marketplaceTools.forEach((tool: any) => {
      if (tool.toolCategory) {
        categories.add(tool.toolCategory);
      }
    });
    
    return Array.from(categories);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Marketplace | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy)]/90 rounded-xl p-6 mb-10 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Transform Your Accounting Practice</h2>
              <p className="text-white/90">
                Browse our curated collection of pages and tools designed for accounting firms. Find, install, and launch with just a few clicks.
              </p>
            </div>
            <Button 
              onClick={() => {}} 
              className="bg-white text-[var(--navy)] hover:bg-white/90 px-6 shrink-0"
            >
              View Getting Started Guide
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-[var(--navy)]">Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add new pages, tools, and automations to enhance your Progress Accountants platform. No code. No friction.
          </p>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {getUniqueCategories().map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* API-based Marketplace Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoadingMarketplace ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <Card key={`skeleton-${i}`} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : marketplaceError ? (
            // Error message
            <div className="col-span-3">
              <Alert variant="destructive">
                <AlertTitle>Error loading marketplace tools</AlertTitle>
                <AlertDescription>
                  There was a problem loading tools from the marketplace. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          ) : getFilteredMarketplaceTools().length === 0 ? (
            // No tools found
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">No tools found in this category.</p>
            </div>
          ) : (
            // Display tools from API
            getFilteredMarketplaceTools().map((tool: any) => (
              <Card key={tool.id} className={`overflow-hidden transition-all hover:shadow-md ${
                isToolInstalled(tool.id) ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    {tool.toolVersion && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        {tool.toolVersion}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-0 flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tool.toolCategory && (
                      <Badge className="bg-green-100 text-green-700">
                        {tool.toolCategory}
                      </Badge>
                    )}
                    {tool.toolType && (
                      <Badge variant="outline" className="bg-slate-50">
                        {tool.toolType}
                      </Badge>
                    )}
                  </div>
                  
                  {isToolInstalled(tool.id) && (
                    <div className="text-sm text-green-600 font-medium mt-3 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Installed
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-4">
                  {isToolInstalled(tool.id) ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => handleUninstallTool(getInstallationId(tool.id) || 0)}
                    >
                      Uninstall
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => handleInstallTool(tool.id)}
                    >
                      <Download className="h-4 w-4 mr-2" /> Install Tool
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {/* Help Section */}
        <div className="mt-20 p-8 bg-blue-50 rounded-xl border border-blue-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Need a custom tool?</h2>
            <p className="text-blue-700 mb-6">
              Don't see what you need? Request a custom tool for your specific business requirements.
            </p>
            <Button 
              onClick={() => setLocation('/scope-request')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Request Custom Tool
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}