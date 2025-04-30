import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  History,
  ExternalLink,
  Filter,
  Lock,
  Copy,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { PageVersionHistory } from "@/components/page-builder/PageVersionHistory";
import { useTenant } from "@/hooks/use-tenant";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PageBuilderListPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [tenantStarterType, setTenantStarterType] = useState<'blank' | 'pro' | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check and initialize page builder tables if needed
  useEffect(() => {
    // Check if page builder is initialized
    const checkStatus = async () => {
      try {
        console.log("Checking page builder status");
        setIsInitializing(true);
        
        const res = await fetch('/api/page-builder/status');
        console.log("Status check response:", res.status);
        
        if (!res.ok) {
          throw new Error(`Status check failed with status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Page builder status data:", data);
        
        if (!data.initialized) {
          console.log("Page builder needs initialization");
          
          // Initialize the page builder tables
          const initRes = await fetch('/api/page-builder/initialize', {
            method: 'POST'
          });
          
          console.log("Initialization response:", initRes.status);
          
          if (!initRes.ok) {
            const errorText = await initRes.text();
            console.error("Initialize error response:", errorText);
            throw new Error(`Initialization failed with status: ${initRes.status}`);
          }
          
          const initData = await initRes.json();
          console.log("Initialization data:", initData);
          
          if (initData.success) {
            toast({
              title: "Page Builder Initialized",
              description: "The page builder system has been set up successfully.",
            });
          } else if (initData.alreadyInitialized) {
            // Tables already exist, that's fine
            console.log("Page builder tables already initialized");
          } else {
            throw new Error(initData.message || "Failed to initialize page builder");
          }
        } else {
          console.log("Page builder is already initialized");
        }
      } catch (error) {
        console.error("Error checking or initializing page builder:", error);
        toast({
          title: "Initialization Error",
          description: `There was a problem setting up the page builder: ${(error as Error).message}`,
          variant: "destructive"
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    checkStatus();
  }, [toast]);

  // Fetch tenant starter type
  useEffect(() => {
    if (tenant?.id) {
      fetch(`/api/page-builder/tenant-starter?tenantId=${tenant.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch tenant starter type");
          return res.json();
        })
        .then(data => {
          if (data.success && data.data) {
            setTenantStarterType(data.data.starterType || 'blank');
          } else {
            setTenantStarterType('blank'); // Default to blank if not set
          }
        })
        .catch(error => {
          console.error("Error fetching tenant starter type:", error);
          setTenantStarterType('blank'); // Default to blank on error
        });
    }
  }, [tenant]);

  // Fetch pages data
  const { data: pagesData, isLoading } = useQuery({
    queryKey: ["/api/page-builder/pages"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/page-builder/pages");
        if (!res.ok) {
          console.error("Failed to fetch pages, status:", res.status);
          throw new Error("Failed to fetch pages");
        }
        return res.json();
      } catch (err) {
        console.error("Error fetching pages:", err);
        throw new Error(`Failed to fetch pages: ${(err as Error).message}`);
      }
    },
  });

  // Filter pages based on search term and current filter
  const filteredPages = React.useMemo(() => {
    if (!pagesData?.data) return [];
    
    let filtered = pagesData.data;
    
    if (searchTerm) {
      filtered = filtered.filter((page: any) => 
        (page.title || page.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.path || page.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (currentFilter === "published") {
      filtered = filtered.filter((page: any) => page.isPublished || page.published);
    } else if (currentFilter === "draft") {
      filtered = filtered.filter((page: any) => !page.isPublished && !page.published);
    }
    
    return filtered;
  }, [pagesData, searchTerm, currentFilter]);

  // Handle navigation to edit page
  const handleEditPage = (id: number) => {
    navigate(`/page-builder/${id}`);
  };

  // Handle navigation to view page on frontend
  const handleViewPage = (path: string) => {
    window.open(path, "_blank");
  };

  // Handle opening version history
  const handleOpenVersionHistory = (id: number) => {
    setSelectedPageId(id);
    setVersionHistoryOpen(true);
  };

  // Render initializing state
  if (isInitializing) {
    return (
      <AdminLayout>
        <div className="container px-8 py-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Setting Up Page Builder</CardTitle>
              <CardDescription className="text-center">
                We're initializing the page builder for the first time. This should only take a moment...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4 pb-8">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
              <p className="text-muted-foreground text-center">
                We're setting up the necessary database tables for the page builder feature.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // Render loading skeleton
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-36 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your website pages
            </p>
          </div>
          <Button onClick={() => navigate("/page-builder/page/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Page
          </Button>
        </div>
        
        {/* Site tier banner */}
        {tenantStarterType === 'pro' && (
          <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 dark:text-blue-400">
              Professional Design Site
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              <p className="mb-2">
                This site includes professional pre-designed page templates. Some pages are locked to maintain design quality.
                When editing a locked page, you'll need to create an editable copy.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="all" onValueChange={setCurrentFilter}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList>
                  <TabsTrigger value="all">All Pages</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
                <div className="flex w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pages..."
                      className="pl-8 w-full sm:w-[280px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">No pages found</h3>
                {searchTerm ? (
                  <p className="text-muted-foreground mb-4">
                    No pages match your search criteria
                  </p>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    You haven't created any pages yet
                  </p>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/page-builder/page/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first page
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-32">Locked</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map((page: any) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title || page.name || 'Untitled Page'}</TableCell>
                        <TableCell className="text-muted-foreground">{page.path || `/${page.slug}` || '/'}</TableCell>
                        <TableCell>
                          {page.pageType === 'core' && 'Core Page'}
                          {page.pageType === 'custom' && 'Custom Page'}
                          {page.pageType === 'automation' && 'Automation Page'}
                          {!page.pageType && 'Standard Page'}
                        </TableCell>
                        <TableCell>
                          {(page.isPublished || page.published) ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {page.updatedAt ? format(new Date(page.updatedAt), "MMM d, yyyy") : 'Just now'}
                        </TableCell>
                        <TableCell>
                          {page.isLocked ? (
                            <div className="flex items-center gap-1.5">
                              <Lock className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium text-amber-600">
                                {page.origin === 'pro' ? 'Pro Design' : 'Template'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPage(page.id)}
                              title="Edit Page"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {(page.isPublished || page.published) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewPage(page.path || `/${page.slug}`)}
                                title="View Published Page"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenVersionHistory(page.id)}
                              title="Version History"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            {page.isLocked && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // Clone the locked page
                                  fetch(`/api/page-builder/pages/${page.id}/clone`, {
                                    method: 'POST'
                                  })
                                    .then(res => res.json())
                                    .then(data => {
                                      if (data.success) {
                                        toast({
                                          title: "Page cloned successfully",
                                          description: "You can now edit your copy of this page.",
                                          duration: 5000
                                        });
                                        // Navigate to the new page
                                        navigate(`/page-builder/${data.data.id}`);
                                      } else {
                                        throw new Error(data.message || "Failed to clone page");
                                      }
                                    })
                                    .catch(error => {
                                      toast({
                                        title: "Error",
                                        description: `Failed to clone page: ${error.message}`,
                                        variant: "destructive"
                                      });
                                    });
                                }}
                                title="Create Editable Copy"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Version History Dialog */}
        {selectedPageId && (
          <PageVersionHistory
            entityId={selectedPageId}
            entityType="page"
            isOpen={versionHistoryOpen}
            onClose={() => setVersionHistoryOpen(false)}
            onVersionRestore={() => {
              setVersionHistoryOpen(false);
              // Refresh the page list after restore
              // queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PageBuilderListPage;