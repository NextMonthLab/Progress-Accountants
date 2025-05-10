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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Download,
  Lock,
  Copy,
  Sparkles,
  Edit,
  AlertCircle, 
  Eye,
  Trash2
} from 'lucide-react';

type ToolCategory = 'page_templates' | 'tools' | 'calculators' | 'dashboards' | string;
type ToolDesignTier = 'blank' | 'pro';

interface Tool {
  id: number;
  name: string;
  description: string;
  toolType: string;
  toolCategory: string;
  mediaUrl?: string;
  toolVersion?: string;
  designTier: ToolDesignTier;
  isLocked: boolean;
}

interface ToolInstallation {
  id: number;
  toolId: number;
  tool?: Tool;
  installation?: {
    id: number;
  };
}

export default function EnhancedMarketplacePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  
  // Fetch marketplace tools
  const { 
    data: marketplaceTools = [], 
    isLoading: isLoadingMarketplace, 
    error: marketplaceError 
  } = useQuery({
    queryKey: ['/api/tools'],
    enabled: !!user,
  });
  
  // Fetch installed tools
  const { 
    data: installedTools = [], 
    isLoading: isLoadingInstalled,
  } = useQuery({
    queryKey: ['/api/tools/access'],
    enabled: !!user,
  });
  
  // Fetch tool categories
  const {
    data: toolCategories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['/api/tools/categories'],
    enabled: !!user,
  });
  
  // Install a tool mutation
  const installToolMutation = useMutation({
    mutationFn: async (toolId: number) => {
      const response = await apiRequest("POST", `/api/tools/access/${toolId}`, {
        configuration: { 
          business_name: "Progress Accountants",
          notification_email: user ? (user as any).email : null
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to install tool");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools/access'] });
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
    mutationFn: async (toolId: number) => {
      const response = await apiRequest("DELETE", `/api/tools/access/${toolId}`, {});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to uninstall tool");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tools/access'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
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
  
  // Filter marketplace tools based on category and tier
  const getFilteredMarketplaceTools = () => {
    if (!Array.isArray(marketplaceTools) || marketplaceTools.length === 0) return [];
    
    return marketplaceTools.filter((tool: any) => {
      // Category filter
      const matchesCategory = activeTab === 'all' || tool.toolCategory === activeTab;
      
      // Tier filter
      const matchesTier = 
        tierFilter === 'all' || 
        (tierFilter === 'blank' && (!tool.designTier || tool.designTier === 'blank')) || 
        (tierFilter === 'pro' && tool.designTier === 'pro');
      
      return matchesCategory && matchesTier;
    });
  };
  
  // Clone a tool (for pro tools)
  const cloneTool = async (toolId: number) => {
    try {
      const response = await apiRequest("POST", `/api/tools/${toolId}/clone`, {});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to clone tool");
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/tools/access'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      
      toast({
        title: "Tool cloned",
        description: "The pro tool has been cloned successfully. You can now customize it.",
        variant: "default"
      });
      
      return await response.json();
    } catch (error: any) {
      toast({
        title: "Clone failed",
        description: error.message || "An error occurred while cloning the tool",
        variant: "destructive"
      });
    }
  };
  
  // Preview a tool in a modal or new window
  const previewTool = (toolId: number) => {
    const url = `/api/tools/render/${toolId}`;
    window.open(url, '_blank', 'width=1024,height=768');
    
    // Log the preview interaction
    apiRequest("GET", `/api/tools/access/${toolId}?action=preview`, {})
      .catch(error => console.error("Failed to log preview interaction:", error));
  };
  
  // Check if a tool is installed
  const isToolInstalled = (toolId: number) => {
    if (!Array.isArray(installedTools) || installedTools.length === 0) return false;
    
    // New API returns a simple array of tool IDs that the user has access to
    return installedTools.includes(toolId);
  };
  
  // Handle tool installation
  const handleInstallTool = (toolId: number) => {
    installToolMutation.mutate(toolId);
  };
  
  // Handle tool uninstallation
  const handleUninstallTool = (toolId: number) => {
    uninstallToolMutation.mutate(toolId);
  };
  
  // Get categories from API or from tools as fallback
  const getCategories = (): ToolCategory[] => {
    // If we have categories from the dedicated endpoint, use those
    if (Array.isArray(toolCategories) && toolCategories.length > 0) {
      return toolCategories.map((category: any) => category.id);
    }
    
    // Otherwise extract unique categories from the tools themselves
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
        <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy)]/90 rounded-xl p-4 sm:p-6 mb-6 sm:mb-10 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Transform Your Accounting Practice</h2>
              <p className="text-white/90 text-sm sm:text-base">
                Browse our curated collection of tools designed for accounting firms. Find, install, and launch with just a few clicks.
              </p>
            </div>
            <Button 
              onClick={() => {}} 
              className="bg-white text-[var(--navy)] hover:bg-white/90 px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base w-full md:w-auto shrink-0 mt-2 md:mt-0"
            >
              Getting Started Guide
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 text-[var(--navy)]">Marketplace</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Add new tools and automations to enhance your accounting platform. No code. No friction.
          </p>
        </div>
        
        {/* Tool Tier Filter Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-xl font-semibold text-gray-800">Select Tool Type</div>
          <Tabs defaultValue="all" value={tierFilter} onValueChange={setTierFilter} className="flex-shrink-0">
            <TabsList className="p-1 bg-gray-50 border border-gray-100 rounded-lg">
              <TabsTrigger 
                value="all"
                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--teal)] data-[state=active]:to-[#5b86e5] data-[state=active]:text-white"
              >
                All Types
              </TabsTrigger>
              <TabsTrigger 
                value="blank" 
                className="flex items-center rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--teal)] data-[state=active]:to-[#5b86e5] data-[state=active]:text-white"
              >
                <Edit className="h-4 w-4 mr-1.5" /> Blank Canvas
              </TabsTrigger>
              <TabsTrigger 
                value="pro" 
                className="flex items-center rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f953c6] data-[state=active]:to-[#ff6b6b] data-[state=active]:text-white"
              >
                <Sparkles className="h-4 w-4 mr-1.5" /> Pro Templates
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Category Tabs */}
        <div className="mb-8 overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="relative">
              {/* Gradient indicators for horizontal scroll */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none hidden sm:block"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none hidden sm:block"></div>
              
              {/* Scrollable tabs container */}
              <div className="overflow-x-auto pb-3 px-1 -mx-1 hide-scrollbar">
                <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 max-w-none justify-start sm:justify-center space-x-2 p-1 bg-gray-50 border border-gray-100 rounded-lg">
                  <TabsTrigger 
                    value="all" 
                    className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2 data-[state=active]:bg-[var(--teal)] data-[state=active]:text-white"
                  >
                    All Tools
                  </TabsTrigger>
                  
                  {getCategories().map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category} 
                      className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2 data-[state=active]:bg-[var(--teal)] data-[state=active]:text-white"
                    >
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          </Tabs>
        </div>
        
        {/* Tier Information Alert */}
        {tierFilter === 'blank' && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Edit className="h-4 w-4 stroke-blue-500" />
            <AlertTitle className="text-blue-700">Blank Canvas Tools</AlertTitle>
            <AlertDescription className="text-blue-600">
              Start with a clean slate. Blank Canvas tools are fully customizable templates you can modify to match your exact requirements.
            </AlertDescription>
          </Alert>
        )}
        
        {tierFilter === 'pro' && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <Sparkles className="h-4 w-4 stroke-amber-500" />
            <AlertTitle className="text-amber-700">Pre-Built Professional Tools</AlertTitle>
            <AlertDescription className="text-amber-600">
              Premium tools with professional design and functionality. While core elements are locked to maintain quality, you can clone them to create customized versions.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Custom scrollbar styling is added to the global CSS */}
        
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
              <Card 
                key={tool.id} 
                className={`overflow-hidden transition-all hover:shadow-md ${
                  isToolInstalled(tool.id) ? 'border-green-300 bg-green-50/30' : 
                  tool.designTier === 'pro' ? 'border-amber-200 bg-amber-50/20' : 'border-gray-200'
                }`}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <CardTitle className="text-lg sm:text-xl group flex items-center gap-2">
                        {tool.name}
                        {tool.isLocked && tool.designTier === 'pro' && (
                          <div className="relative group">
                            <Lock className="h-4 w-4 text-amber-600" />
                            <div className="absolute left-0 top-full mt-2 w-48 p-2 bg-white shadow-lg rounded text-xs hidden group-hover:block z-10">
                              This is a Pro tool with locked functionality.
                            </div>
                          </div>
                        )}
                      </CardTitle>
                      
                      <div className="flex gap-2 mt-1">
                        {tool.designTier === 'pro' && (
                          <Badge className="bg-amber-100 border-amber-200 text-amber-800 flex items-center gap-1 text-xs">
                            <Sparkles className="h-3 w-3" /> Pre-Built Pro
                          </Badge>
                        )}
                        {(!tool.designTier || tool.designTier === 'blank') && (
                          <Badge className="bg-blue-100 border-blue-200 text-blue-800 flex items-center gap-1 text-xs">
                            <Edit className="h-3 w-3" /> Blank Canvas
                          </Badge>
                        )}
                        {tool.toolVersion && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs">
                            v{tool.toolVersion}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm sm:text-base mt-2">{tool.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 pb-0 sm:pb-0 flex-grow">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    {tool.toolCategory && (
                      <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">
                        {tool.toolCategory}
                      </Badge>
                    )}
                    {tool.toolType && (
                      <Badge variant="outline" className="bg-slate-50 text-xs sm:text-sm">
                        {tool.toolType}
                      </Badge>
                    )}
                  </div>
                  
                  {isToolInstalled(tool.id) && (
                    <div className="text-xs sm:text-sm text-green-600 font-medium mt-2 sm:mt-3 flex items-center">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Installed
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 sm:p-6 pt-3 sm:pt-4 flex flex-col gap-3">
                  {/* Preview button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                    onClick={() => previewTool(tool.id)}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Preview Tool
                  </Button>
                  
                  {/* If tool is installed, show Uninstall button */}
                  {isToolInstalled(tool.id) ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleUninstallTool(tool.id)}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Uninstall
                    </Button>
                  ) : (
                    // If tool is not installed, show appropriate action buttons based on tier
                    <>
                      {tool.designTier === 'pro' && tool.isLocked ? (
                        <div className="w-full flex gap-2">
                          <Button 
                            className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                            variant="default"
                            onClick={() => handleInstallTool(tool.id)}
                          >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Install
                          </Button>
                          <Button 
                            className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2 h-auto bg-amber-600 hover:bg-amber-700"
                            onClick={() => cloneTool(tool.id)}
                          >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Clone & Edit
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                          variant="default"
                          onClick={() => handleInstallTool(tool.id)}
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> Install Tool
                        </Button>
                      )}
                    </>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {/* Help Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 p-5 sm:p-8 bg-blue-50 rounded-xl border border-blue-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-2 sm:mb-4">Need a custom tool?</h2>
            <p className="text-sm sm:text-base text-blue-700 mb-4 sm:mb-6 px-2">
              Don't see what you need? Request a custom tool for your specific business requirements.
            </p>
            <Button 
              onClick={() => setLocation('/scope-request')}
              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-1.5 sm:py-2 h-auto px-3 sm:px-4"
            >
              Request Custom Tool
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}