import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Badge, 
  Button, 
  Skeleton, 
  Separator,
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui";
import { 
  Download, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Clock,
  BarChart,
  Settings,
  Layers,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Helmet } from "react-helmet";

// Tool category colors
const categoryColors: Record<string, string> = {
  "CRM": "bg-blue-100 text-blue-800",
  "Analytics": "bg-purple-100 text-purple-800",
  "SEO": "bg-green-100 text-green-800",
  "Marketing": "bg-orange-100 text-orange-800",
  "Finance": "bg-emerald-100 text-emerald-800",
  "Productivity": "bg-indigo-100 text-indigo-800",
  "Utility": "bg-gray-100 text-gray-800",
  "Communication": "bg-rose-100 text-rose-800"
};

// Get color for category or default
const getCategoryColor = (category: string) => {
  return categoryColors[category] || "bg-gray-100 text-gray-800";
};

// Tool version badge color
const getVersionColor = (version: string) => {
  if (version?.startsWith("v1.")) return "bg-green-100 text-green-800";
  if (version?.startsWith("v0.")) return "bg-yellow-100 text-yellow-800";
  return "bg-blue-100 text-blue-800";
};

// Tool card component
const ToolCard = ({ 
  tool, 
  isInstalled = false, 
  onInstall, 
  onUninstall, 
  installationId = null 
}: { 
  tool: any; 
  isInstalled?: boolean; 
  onInstall: (id: number) => void; 
  onUninstall: (installId: number) => void; 
  installationId?: number | null;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tool.name}</CardTitle>
          {tool.toolVersion && (
            <Badge variant="outline" className={getVersionColor(tool.toolVersion)}>
              {tool.toolVersion}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {tool.toolCategory && (
            <Badge className={getCategoryColor(tool.toolCategory)}>
              {tool.toolCategory}
            </Badge>
          )}
          <Badge variant="outline" className="bg-slate-50">
            {tool.toolType}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground mt-3 flex items-center">
          <Clock className="h-4 w-4 mr-1" /> Published: {new Date(tool.publishedAt).toLocaleDateString()}
        </div>
        
        {tool.installationCount > 0 && (
          <div className="text-sm text-muted-foreground mt-2 flex items-center">
            <BarChart className="h-4 w-4 mr-1" /> {tool.installationCount} installations
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 mt-auto">
        {isInstalled ? (
          <div className="w-full flex justify-between items-center">
            <span className="flex items-center text-sm text-green-600 font-medium">
              <CheckCircle className="h-4 w-4 mr-1" /> Installed
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUninstall(installationId || 0)}
            >
              Uninstall
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => onInstall(tool.id)}
          >
            <Download className="h-4 w-4 mr-2" /> Install Tool
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default function ToolMarketplacePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [installedMap, setInstalledMap] = useState<Record<number, number>>({});
  
  // Fetch marketplace tools
  const { 
    data: marketplaceTools, 
    isLoading: isLoadingMarketplace, 
    error: marketplaceError 
  } = useQuery({
    queryKey: ['/api/tools/marketplace'],
    enabled: !!user,
  });
  
  // Fetch installed tools
  const { 
    data: installedTools, 
    isLoading: isLoadingInstalled,
    error: installedError 
  } = useQuery({
    queryKey: ['/api/tools/installed'],
    enabled: !!user,
    onSuccess: (data) => {
      // Create a map of tool ID to installation ID for easy lookup
      const installedMap: Record<number, number> = {};
      data?.forEach((item: any) => {
        installedMap[item.tool.id] = item.installation.id;
      });
      setInstalledMap(installedMap);
    }
  });

  // Filter tools based on search and category
  const getFilteredTools = (tools: any[] = []) => {
    if (!tools?.length) return [];
    
    return tools.filter((tool) => {
      const matchesSearch = 
        searchTerm === "" || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = 
        categoryFilter === "all" || 
        tool.toolCategory === categoryFilter;
        
      return matchesSearch && matchesCategory;
    });
  };

  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    if (!marketplaceTools?.length) return [];
    
    const categories = marketplaceTools.map((tool: any) => tool.toolCategory);
    return [...new Set(categories)].filter(Boolean);
  };

  // Install a tool
  const handleInstallTool = async (toolId: number) => {
    try {
      const response = await apiRequest(
        "POST", 
        `/api/tools/marketplace/install/${toolId}`,
        {}
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to install tool");
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/tools/installed'] });
      
      toast({
        title: "Tool installed",
        description: "The tool has been installed successfully",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Installation failed",
        description: error.message || "An error occurred while installing the tool",
        variant: "destructive"
      });
    }
  };

  // Uninstall a tool
  const handleUninstallTool = async (installationId: number) => {
    try {
      const response = await apiRequest(
        "POST", 
        `/api/tools/uninstall/${installationId}`,
        {}
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to uninstall tool");
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/tools/installed'] });
      
      toast({
        title: "Tool uninstalled",
        description: "The tool has been uninstalled successfully",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Uninstallation failed",
        description: error.message || "An error occurred while uninstalling the tool",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Tool Marketplace | Progress</title>
      </Helmet>
      
      <div className="container px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-gray-700">Admin</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Tool Marketplace</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Tool Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover, install, and manage tools for your business
          </p>
        </div>
        
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="marketplace">
              <Package className="h-4 w-4 mr-2" /> Marketplace
            </TabsTrigger>
            <TabsTrigger value="installed">
              <CheckCircle className="h-4 w-4 mr-2" /> Installed Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="w-full sm:w-64">
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getUniqueCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {marketplaceError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load marketplace tools. Please try again later.
                </AlertDescription>
              </Alert>
            ) : isLoadingMarketplace ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {getFilteredTools(marketplaceTools).length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">No tools found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || categoryFilter !== "all" 
                        ? "Try adjusting your search or filters" 
                        : "No tools are available in the marketplace yet"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredTools(marketplaceTools).map((tool: any) => (
                      <ToolCard 
                        key={tool.id} 
                        tool={tool} 
                        isInstalled={!!installedMap[tool.id]}
                        installationId={installedMap[tool.id]}
                        onInstall={handleInstallTool}
                        onUninstall={handleUninstallTool}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="installed">
            {installedError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load installed tools. Please try again later.
                </AlertDescription>
              </Alert>
            ) : isLoadingInstalled ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/4 mb-3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {!installedTools?.length ? (
                  <div className="text-center py-12">
                    <Layers className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">No tools installed</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't installed any tools yet
                    </p>
                    <Button onClick={() => document.querySelector('[data-value="marketplace"]')?.click()}>
                      Browse Marketplace
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        You have {installedTools.length} tool{installedTools.length !== 1 ? 's' : ''} installed
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {installedTools.map((item: any) => (
                        <ToolCard 
                          key={item.installation.id} 
                          tool={item.tool} 
                          isInstalled={true}
                          installationId={item.installation.id}
                          onInstall={handleInstallTool}
                          onUninstall={handleUninstallTool}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}