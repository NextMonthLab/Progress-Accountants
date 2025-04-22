import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/AdminLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileEdit,
  Eye,
  Trash2,
  Copy,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface PageBuilderPage {
  id: number;
  tenantId: string;
  title: string;
  path: string;
  description: string;
  pageType: 'core' | 'custom' | 'automation';
  isPublished: boolean;
  publishedAt?: string;
  seoScore?: number;
  createdAt: string;
  updatedAt: string;
}

const PageBuilderListPage = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageTypeFilter, setPageTypeFilter] = useState<string | null>(null);
  const [publishStatusFilter, setPublishStatusFilter] = useState<string | null>(null);
  
  // Fetch all pages
  const { data: pages, isLoading, error } = useQuery({
    queryKey: ['/api/page-builder/pages'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/page-builder/pages");
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data = await res.json();
      return data.data as PageBuilderPage[];
    }
  });
  
  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const res = await apiRequest("DELETE", `/api/page-builder/pages/${pageId}`);
      if (!res.ok) throw new Error('Failed to delete page');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      toast({
        title: "Page deleted",
        description: "The page has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete page: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Duplicate page mutation (logic would need to be implemented on the server)
  const duplicateMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/duplicate`);
      if (!res.ok) throw new Error('Failed to duplicate page');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      toast({
        title: "Page duplicated",
        description: "The page has been duplicated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to duplicate page: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Toggle publish status mutation
  const togglePublishMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/publish`);
      if (!res.ok) throw new Error('Failed to toggle publish status');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      toast({
        title: data.data.isPublished ? "Page published" : "Page unpublished",
        description: `The page has been ${data.data.isPublished ? "published" : "unpublished"} successfully.`
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update publish status: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Filter pages based on search query and filters
  const filteredPages = pages?.filter(page => {
    // Apply search filter
    const matchesSearch = searchQuery === "" || 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Apply page type filter
    const matchesPageType = pageTypeFilter === null || page.pageType === pageTypeFilter;
    
    // Apply publish status filter
    const matchesPublishStatus = publishStatusFilter === null || 
      (publishStatusFilter === "published" && page.isPublished) ||
      (publishStatusFilter === "draft" && !page.isPublished);
    
    return matchesSearch && matchesPageType && matchesPublishStatus;
  });
  
  // Get page type display name
  const getPageTypeDisplay = (type: string) => {
    switch (type) {
      case 'core': return 'Core Page';
      case 'custom': return 'Custom Page';
      case 'automation': return 'Automation Page';
      default: return type;
    }
  };
  
  // Get SEO score badge color
  const getSeoScoreBadgeColor = (score?: number) => {
    if (score === undefined) return "bg-muted";
    if (score >= 80) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-amber-500 hover:bg-amber-600";
    return "bg-red-500 hover:bg-red-600";
  };
  
  // Render pages in grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPages?.map(page => (
        <Card key={page.id} className="overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {page.description || "No description provided"}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/admin/page-builder/${page.id}`)}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => togglePublishMutation.mutate(page.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {page.isPublished ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateMutation.mutate(page.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
                        deleteMutation.mutate(page.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-mono">{page.path}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{getPageTypeDisplay(page.pageType)}</Badge>
              <Badge variant={page.isPublished ? "default" : "secondary"}>
                {page.isPublished ? "Published" : "Draft"}
              </Badge>
              {page.seoScore !== undefined && (
                <Badge className={getSeoScoreBadgeColor(page.seoScore)}>
                  SEO: {page.seoScore}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => navigate(`/admin/page-builder/${page.id}`)}
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Edit Page
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  
  // Render pages in list view
  const renderListView = () => (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium">Page Title</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Path</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium">SEO</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Updated</th>
            <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredPages?.map(page => (
            <tr key={page.id} className="hover:bg-muted/30">
              <td className="py-3 px-4">
                <div className="font-medium">{page.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {page.description || "No description"}
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-xs">{page.path}</td>
              <td className="py-3 px-4">
                <Badge variant="outline">{getPageTypeDisplay(page.pageType)}</Badge>
              </td>
              <td className="py-3 px-4">
                <Badge variant={page.isPublished ? "default" : "secondary"}>
                  {page.isPublished ? "Published" : "Draft"}
                </Badge>
              </td>
              <td className="py-3 px-4">
                {page.seoScore !== undefined ? (
                  <Badge className={getSeoScoreBadgeColor(page.seoScore)}>
                    {page.seoScore}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {new Date(page.updatedAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(`/admin/page-builder/${page.id}`)}>
                      <FileEdit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublishMutation.mutate(page.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {page.isPublished ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateMutation.mutate(page.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate SEO
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
                          deleteMutation.mutate(page.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  // Render loading skeleton for grid view
  const renderGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-4 w-1/3 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  
  // Render loading skeleton for list view
  const renderListSkeleton = () => (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium">Page Title</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Path</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium">SEO</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Updated</th>
            <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {[1, 2, 3, 4, 5].map(i => (
            <tr key={i}>
              <td className="py-3 px-4">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-60" />
              </td>
              <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
              <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
              <td className="py-3 px-4"><Skeleton className="h-5 w-16" /></td>
              <td className="py-3 px-4"><Skeleton className="h-5 w-8" /></td>
              <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
              <td className="py-3 px-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  // Check if filtering results in no pages
  const hasNoResults = filteredPages && filteredPages.length === 0;
  
  return (
    <AdminLayout>
      <div className="container px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage pages with the Advanced Page Builder
            </p>
          </div>
          <Button onClick={() => navigate("/admin/page-builder/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Page
          </Button>
        </div>
        
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Pages</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Page Type</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setPageTypeFilter(null)} className={pageTypeFilter === null ? "bg-muted" : ""}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageTypeFilter('core')} className={pageTypeFilter === 'core' ? "bg-muted" : ""}>
                    Core Pages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageTypeFilter('custom')} className={pageTypeFilter === 'custom' ? "bg-muted" : ""}>
                    Custom Pages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageTypeFilter('automation')} className={pageTypeFilter === 'automation' ? "bg-muted" : ""}>
                    Automation Pages
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setPublishStatusFilter(null)} className={publishStatusFilter === null ? "bg-muted" : ""}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPublishStatusFilter('published')} className={publishStatusFilter === 'published' ? "bg-muted" : ""}>
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPublishStatusFilter('draft')} className={publishStatusFilter === 'draft' ? "bg-muted" : ""}>
                    Draft
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <TabsContent value="all">
              {isLoading ? (
                viewMode === "grid" ? renderGridSkeleton() : renderListSkeleton()
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-destructive font-medium mb-2">Failed to load pages</p>
                    <p className="text-muted-foreground mb-4">{(error as Error).message}</p>
                    <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] })}>
                      Retry
                    </Button>
                  </div>
                </div>
              ) : hasNoResults ? (
                <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No pages match your search criteria</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setPageTypeFilter(null);
                      setPublishStatusFilter(null);
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              ) : (
                viewMode === "grid" ? renderGridView() : renderListView()
              )}
            </TabsContent>
            
            <TabsContent value="published">
              {isLoading ? (
                viewMode === "grid" ? renderGridSkeleton() : renderListSkeleton()
              ) : (
                <>
                  {pages?.filter(page => page.isPublished).length === 0 ? (
                    <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">No published pages found</p>
                        <Button onClick={() => navigate("/admin/page-builder/new")}>
                          Create New Page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    viewMode === "grid" ? 
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pages?.filter(page => page.isPublished && (searchQuery === "" || 
                          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.path.toLowerCase().includes(searchQuery.toLowerCase()))).map(page => (
                          <Card key={page.id} className="overflow-hidden flex flex-col">
                            {/* Same card content as in renderGridView but filtered for published pages */}
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">{page.title}</CardTitle>
                                  <CardDescription className="line-clamp-2">
                                    {page.description || "No description provided"}
                                  </CardDescription>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(`/admin/page-builder/${page.id}`)}>
                                      <FileEdit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => togglePublishMutation.mutate(page.id)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Unpublish
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => duplicateMutation.mutate(page.id)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
                                          deleteMutation.mutate(page.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                              <div className="text-sm text-muted-foreground mb-2">
                                <span className="font-mono">{page.path}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">{getPageTypeDisplay(page.pageType)}</Badge>
                                <Badge>Published</Badge>
                                {page.seoScore !== undefined && (
                                  <Badge className={getSeoScoreBadgeColor(page.seoScore)}>
                                    SEO: {page.seoScore}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button 
                                variant="default" 
                                className="w-full" 
                                onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                              >
                                <FileEdit className="h-4 w-4 mr-2" />
                                Edit Page
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    : renderListView()
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="drafts">
              {isLoading ? (
                viewMode === "grid" ? renderGridSkeleton() : renderListSkeleton()
              ) : (
                <>
                  {pages?.filter(page => !page.isPublished).length === 0 ? (
                    <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">No draft pages found</p>
                        <Button onClick={() => navigate("/admin/page-builder/new")}>
                          Create New Page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    viewMode === "grid" ? 
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pages?.filter(page => !page.isPublished && (searchQuery === "" || 
                          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          page.path.toLowerCase().includes(searchQuery.toLowerCase()))).map(page => (
                          <Card key={page.id} className="overflow-hidden flex flex-col">
                            {/* Same card content as in renderGridView but filtered for draft pages */}
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">{page.title}</CardTitle>
                                  <CardDescription className="line-clamp-2">
                                    {page.description || "No description provided"}
                                  </CardDescription>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(`/admin/page-builder/${page.id}`)}>
                                      <FileEdit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => togglePublishMutation.mutate(page.id)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Publish
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => duplicateMutation.mutate(page.id)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
                                          deleteMutation.mutate(page.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                              <div className="text-sm text-muted-foreground mb-2">
                                <span className="font-mono">{page.path}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">{getPageTypeDisplay(page.pageType)}</Badge>
                                <Badge variant="secondary">Draft</Badge>
                                {page.seoScore !== undefined && (
                                  <Badge className={getSeoScoreBadgeColor(page.seoScore)}>
                                    SEO: {page.seoScore}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                              <Button 
                                variant="default" 
                                className="w-full" 
                                onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                              >
                                <FileEdit className="h-4 w-4 mr-2" />
                                Edit Page
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    : renderListView()
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Page templates feature coming soon</p>
                  <p className="text-xs text-muted-foreground">
                    Save your pages as templates to quickly create new pages with the same structure
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PageBuilderListPage;