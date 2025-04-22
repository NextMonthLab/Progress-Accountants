import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Sparkles,
  Copy,
  MoreVertical,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageInfo {
  id: number;
  title: string;
  path: string;
  pageType: string;
  description: string;
  isPublished: boolean;
  seoScore: number | null;
  createdAt: string;
  updatedAt: string;
}

const PageBuilderListPage: React.FC = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageTypeFilter, setPageTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Fetch pages list
  const { isLoading, error, data } = useQuery({
    queryKey: ['/api/page-builder/pages'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/page-builder/pages");
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data = await res.json();
      return data.data as PageInfo[];
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
  
  // Toggle page publish status mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      const res = await apiRequest("PATCH", `/api/page-builder/pages/${id}`, {
        isPublished: !isPublished
      });
      if (!res.ok) throw new Error('Failed to update publish status');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update page status: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Duplicate page mutation
  const duplicateMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/duplicate`);
      if (!res.ok) throw new Error('Failed to duplicate page');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      toast({
        title: "Page duplicated",
        description: "The page has been duplicated successfully."
      });
      
      // Navigate to the new page
      navigate(`/admin/page-builder/${data.data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to duplicate page: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Handle page delete
  const handleDeletePage = (id: number) => {
    if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };
  
  // Handle page publish/unpublish
  const handleTogglePublish = (id: number, isPublished: boolean) => {
    togglePublishMutation.mutate({ id, isPublished });
  };
  
  // Handle page duplicate
  const handleDuplicatePage = (id: number) => {
    duplicateMutation.mutate(id);
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Filter and sort pages
  const filteredPages = React.useMemo(() => {
    if (!data) return [];
    
    return data
      .filter(page => {
        // Search filter
        const matchesSearch = 
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.path.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Page type filter
        const matchesType = 
          pageTypeFilter === "all" || 
          page.pageType === pageTypeFilter;
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let aValue = a[sortField as keyof PageInfo];
        let bValue = b[sortField as keyof PageInfo];
        
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          const result = aValue.localeCompare(bValue);
          return sortDirection === "asc" ? result : -result;
        } else {
          const result = (aValue as any) > (bValue as any) ? 1 : -1;
          return sortDirection === "asc" ? result : -result;
        }
      });
  }, [data, searchQuery, pageTypeFilter, sortField, sortDirection]);
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) return "just now";
    if (diffInMins < 60) return `${diffInMins} ${diffInMins === 1 ? "minute" : "minutes"} ago`;
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get page type badge
  const getPageTypeBadge = (type: string) => {
    switch (type) {
      case "core":
        return <Badge variant="secondary">Core</Badge>;
      case "custom":
        return <Badge variant="default">Custom</Badge>;
      case "automation":
        return <Badge variant="outline">Automation</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Get SEO score
  const getSeoScoreBadge = (score: number | null) => {
    if (score === null) return <Badge className="bg-slate-200 text-slate-700">Not analyzed</Badge>;
    
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-500">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">Needs Improvement</Badge>;
    return <Badge className="bg-red-500">Poor</Badge>;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
            <p className="text-muted-foreground mt-1">Create and manage your pages</p>
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container px-8 py-6">
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
          <p className="text-muted-foreground mt-1">Create and manage your pages with the Advanced Page Builder</p>
        </div>
        <Button 
          onClick={() => navigate("/admin/page-builder/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages by title, description or path..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <Label htmlFor="page-type-filter" className="mb-2 block">Page Type</Label>
                <Select
                  value={pageTypeFilter}
                  onValueChange={setPageTypeFilter}
                >
                  <SelectTrigger id="page-type-filter">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="core">Core Pages</SelectItem>
                    <SelectItem value="custom">Custom Pages</SelectItem>
                    <SelectItem value="automation">Automation Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="sort-by" className="mb-2 block">Sort By</Label>
                <Select
                  value={sortField}
                  onValueChange={setSortField}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="updatedAt">Last Updated</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="seoScore">SEO Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="sort-direction" className="mb-2 block">Direction</Label>
                <Select
                  value={sortDirection}
                  onValueChange={(value) => setSortDirection(value as "asc" | "desc")}
                >
                  <SelectTrigger id="sort-direction">
                    <SelectValue placeholder="Sort direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Pages</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("title")}
                        >
                          Title
                          {sortField === "title" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Path</TableHead>
                      <TableHead className="w-[120px]">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("seoScore")}
                        >
                          SEO Score
                          {sortField === "seoScore" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[150px]">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("updatedAt")}
                        >
                          Last Updated
                          {sortField === "updatedAt" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No pages found. Create your first page to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{page.title}</span>
                              {page.description && (
                                <span className="text-xs text-muted-foreground truncate max-w-[230px]">
                                  {page.description}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getPageTypeBadge(page.pageType)}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[150px]">
                            {page.path}
                          </TableCell>
                          <TableCell>{getSeoScoreBadge(page.seoScore)}</TableCell>
                          <TableCell>
                            {page.isPublished ? (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span>Published</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-amber-500 mr-1" />
                                <span>Draft</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {formatRelativeTime(page.updatedAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                                title="Edit Page"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePublish(page.id, page.isPublished)}
                                  >
                                    {page.isPublished ? (
                                      <>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        <span>Unpublish</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        <span>Publish</span>
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDuplicatePage(page.id)}
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    <span>Duplicate</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => window.open(page.path, "_blank")}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>Preview</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeletePage(page.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="published" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Title</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Path</TableHead>
                      <TableHead className="w-[120px]">SEO Score</TableHead>
                      <TableHead className="w-[150px]">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.filter(page => page.isPublished).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No published pages found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPages.filter(page => page.isPublished).map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{page.title}</span>
                              {page.description && (
                                <span className="text-xs text-muted-foreground truncate max-w-[230px]">
                                  {page.description}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getPageTypeBadge(page.pageType)}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[150px]">
                            {page.path}
                          </TableCell>
                          <TableCell>{getSeoScoreBadge(page.seoScore)}</TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {formatRelativeTime(page.updatedAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                                title="Edit Page"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(page.path, "_blank")}
                                title="View Page"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePublish(page.id, page.isPublished)}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    <span>Unpublish</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDuplicatePage(page.id)}
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    <span>Duplicate</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeletePage(page.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="draft" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Title</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Path</TableHead>
                      <TableHead className="w-[120px]">SEO Score</TableHead>
                      <TableHead className="w-[150px]">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.filter(page => !page.isPublished).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No draft pages found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPages.filter(page => !page.isPublished).map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{page.title}</span>
                              {page.description && (
                                <span className="text-xs text-muted-foreground truncate max-w-[230px]">
                                  {page.description}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getPageTypeBadge(page.pageType)}</TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[150px]">
                            {page.path}
                          </TableCell>
                          <TableCell>{getSeoScoreBadge(page.seoScore)}</TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {formatRelativeTime(page.updatedAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                                title="Edit Page"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePublish(page.id, page.isPublished)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    <span>Publish</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDuplicatePage(page.id)}
                                  >
                                    <Copy className="h-4 w-4 mr-2" />
                                    <span>Duplicate</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeletePage(page.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Make the most of the Advanced Page Builder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">AI-Powered Content</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use AI to generate content, headlines, and SEO recommendations based on your brand guidelines.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Reusable Sections</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create sections once and reuse them across multiple pages to maintain consistency.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Device Preview</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Preview how your pages look on desktop, tablet, and mobile devices before publishing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

// Create a wrapper component for AdminLayout
const PageBuilderListPageWithAdmin: React.FC = () => {
  return (
    <AdminLayout>
      <PageBuilderListPage />
    </AdminLayout>
  );
};

export default PageBuilderListPageWithAdmin;