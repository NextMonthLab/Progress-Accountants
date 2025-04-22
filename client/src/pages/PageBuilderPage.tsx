import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/AdminLayout";
import { Loader2, Save, Eye, EyeOff, Plus, Trash2, Settings, PlusCircle, Code, Layout, Smartphone, Tablet, Monitor, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import PageBuilderSections from "@/components/page-builder/PageBuilderSections";
import PageBuilderComponentPanel from "@/components/page-builder/PageBuilderComponentPanel";
import PageBuilderSeoPanel from "@/components/page-builder/PageBuilderSeoPanel";
import PageBuilderPreview from "@/components/page-builder/PageBuilderPreview";
import { Progress } from "@/components/ui/progress";
import { useTenant } from "@/hooks/use-tenant";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Define the basic interface for all page builder elements
interface PageBuilderElement {
  id: number;
  name: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for a component within a section
interface PageBuilderComponent extends PageBuilderElement {
  sectionId: number;
  content: any;
  parentId?: number;
  children?: PageBuilderComponent[];
}

// Interface for a section within a page
interface PageBuilderSection extends PageBuilderElement {
  pageId: number;
  components: PageBuilderComponent[];
  layout: 'single' | 'two-column' | 'three-column' | 'sidebar-left' | 'sidebar-right' | 'custom';
  settings: any;
}

// Interface for a page
interface PageBuilderPage {
  id: number;
  tenantId: string;
  title: string;
  path: string;
  description: string;
  pageType: 'core' | 'custom' | 'automation';
  isPublished: boolean;
  publishedAt?: string;
  seoSettings: {
    title?: string;
    description?: string;
    keywords?: string[];
    primaryKeyword?: string;
    seoGoal?: 'local' | 'industry' | 'conversion' | 'technical';
    ogImage?: string;
    canonical?: string;
  };
  seoScore?: number;
  createdAt: string;
  updatedAt: string;
  sections: PageBuilderSection[];
}

const PageBuilderPage = () => {
  const { id } = useParams<{ id: string }>();
  const pageId = id ? parseInt(id) : null;
  const isNewPage = !pageId;
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<string>("builder");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Local state for temporarily storing edits to the page
  const [pageData, setPageData] = useState<Partial<PageBuilderPage>>({
    title: "",
    path: "",
    description: "",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "",
      description: "",
      keywords: [],
      primaryKeyword: "",
      seoGoal: "conversion"
    }
  });

  // Fetch page data
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['/api/page-builder/pages', pageId],
    queryFn: async () => {
      if (!pageId) return null;
      const res = await apiRequest("GET", `/api/page-builder/pages/${pageId}`);
      if (!res.ok) throw new Error('Failed to fetch page data');
      const data = await res.json();
      return data.data;
    },
    enabled: !!pageId // Only run if we have a pageId
  });

  // Load page data into local state when available
  useEffect(() => {
    if (page) {
      setPageData(page);
    }
  }, [page]);

  // Mutation for saving a page
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PageBuilderPage>) => {
      if (isNewPage) {
        const res = await apiRequest("POST", `/api/page-builder/pages`, data);
        if (!res.ok) throw new Error('Failed to create page');
        return await res.json();
      } else {
        const res = await apiRequest("PUT", `/api/page-builder/pages/${pageId}`, data);
        if (!res.ok) throw new Error('Failed to update page');
        return await res.json();
      }
    },
    onSuccess: (data) => {
      toast({
        title: isNewPage ? "Page created" : "Page updated",
        description: `${pageData.title} has been ${isNewPage ? "created" : "updated"} successfully.`,
      });
      setUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      
      // If it's a new page, navigate to the edit page
      if (isNewPage && data.data?.id) {
        navigate(`/admin/page-builder/${data.data.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isNewPage ? "create" : "update"} page: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for toggling publish status
  const togglePublishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/publish`);
      if (!res.ok) throw new Error('Failed to toggle publish status');
      return await res.json();
    },
    onSuccess: (data) => {
      const status = data.data.isPublished ? "published" : "unpublished";
      toast({
        title: `Page ${status}`,
        description: `${pageData.title} has been ${status} successfully.`,
      });
      setPageData(prev => ({
        ...prev,
        isPublished: data.data.isPublished,
        publishedAt: data.data.publishedAt
      }));
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update publish status: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for calculating SEO score
  const calculateSeoScoreMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", `/api/page-builder/pages/${pageId}/seo-score`);
      if (!res.ok) throw new Error('Failed to calculate SEO score');
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "SEO Score Calculated",
        description: `Current SEO score: ${data.data.overallScore}/100`,
      });
      setPageData(prev => ({
        ...prev,
        seoScore: data.data.overallScore
      }));
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', pageId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to calculate SEO score: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for generating SEO recommendations
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/recommendations`);
      if (!res.ok) throw new Error('Failed to generate recommendations');
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "SEO Recommendations Generated",
        description: `${data.data.length} recommendations provided to improve your page.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', pageId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate recommendations: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle saving the page
  const handleSave = () => {
    saveMutation.mutate(pageData);
  };

  // Handle toggling publish status
  const handleTogglePublish = () => {
    if (pageId) {
      togglePublishMutation.mutate();
    } else {
      toast({
        title: "Error",
        description: "You must save the page before publishing",
        variant: "destructive",
      });
    }
  };

  // Handle input changes for basic page data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({
      ...prev,
      [name]: value
    }));
    setUnsavedChanges(true);
  };

  // Handle changes to SEO settings
  const handleSeoSettingsChange = (settings: any) => {
    setPageData(prev => ({
      ...prev,
      seoSettings: {
        ...prev.seoSettings,
        ...settings
      }
    }));
    setUnsavedChanges(true);
  };

  // Handle adding a new section
  const handleAddSection = (sectionType: string) => {
    const newSection: Partial<PageBuilderSection> = {
      name: `New ${sectionType} Section`,
      type: sectionType,
      order: pageData.sections?.length || 0,
      layout: 'single',
      components: [],
      settings: {
        backgroundColor: "#ffffff",
        padding: { top: 48, right: 24, bottom: 48, left: 24 },
        fullWidth: false
      }
    };

    setPageData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection as PageBuilderSection]
    }));
    setUnsavedChanges(true);
  };

  // Handle updating a section
  const handleUpdateSection = (sectionId: number, updatedSection: Partial<PageBuilderSection>) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections?.map(section => 
        section.id === sectionId ? { ...section, ...updatedSection } : section
      )
    }));
    setUnsavedChanges(true);
  };

  // Handle removing a section
  const handleRemoveSection = (sectionId: number) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections?.filter(section => section.id !== sectionId)
    }));
    setUnsavedChanges(true);
  };

  // Handle reordering sections
  const handleReorderSections = (newOrder: PageBuilderSection[]) => {
    setPageData(prev => ({
      ...prev,
      sections: newOrder
    }));
    setUnsavedChanges(true);
  };

  // Handle adding a component to a section
  const handleAddComponent = (sectionId: number, componentType: string) => {
    const newComponent: Partial<PageBuilderComponent> = {
      name: `New ${componentType}`,
      type: componentType,
      order: pageData.sections?.find(s => s.id === sectionId)?.components?.length || 0,
      content: getDefaultContentForComponentType(componentType)
    };

    setPageData(prev => ({
      ...prev,
      sections: prev.sections?.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            components: [...(section.components || []), newComponent as PageBuilderComponent]
          };
        }
        return section;
      })
    }));
    setUnsavedChanges(true);
  };

  // Get default content based on component type
  const getDefaultContentForComponentType = (type: string): any => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', level: 'h2' };
      case 'paragraph':
        return { text: 'Enter your text here...' };
      case 'image':
        return { src: '', alt: '', width: 400, height: 300 };
      case 'button':
        return { text: 'Click Me', url: '#', variant: 'default' };
      case 'list':
        return { items: ['Item 1', 'Item 2', 'Item 3'], listType: 'bullet' };
      case 'divider':
        return { style: 'solid', color: '#e0e0e0' };
      case 'spacer':
        return { height: 40 };
      case 'card':
        return { title: 'Card Title', content: 'Card content goes here', image: '' };
      case 'cta':
        return { 
          heading: 'Call to Action', 
          text: 'Take action now!', 
          buttonText: 'Get Started', 
          buttonUrl: '#' 
        };
      default:
        return {};
    }
  };

  // Handle updating a component
  const handleUpdateComponent = (sectionId: number, componentId: number, updatedComponent: Partial<PageBuilderComponent>) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections?.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            components: section.components?.map(component => 
              component.id === componentId ? { ...component, ...updatedComponent } : component
            )
          };
        }
        return section;
      })
    }));
    setUnsavedChanges(true);
  };

  // Handle removing a component
  const handleRemoveComponent = (sectionId: number, componentId: number) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections?.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            components: section.components?.filter(component => component.id !== componentId)
          };
        }
        return section;
      })
    }));
    setUnsavedChanges(true);
  };

  // Handle reordering components within a section
  const handleReorderComponents = (sectionId: number, newOrder: PageBuilderComponent[]) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections?.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            components: newOrder
          };
        }
        return section;
      })
    }));
    setUnsavedChanges(true);
  };

  // Check if we're in the loading state
  if (isLoading && !isNewPage) {
    return (
      <AdminLayout>
        <div className="container px-8 py-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Check if there was an error
  if (error && !isNewPage) {
    return (
      <AdminLayout>
        <div className="container px-8 py-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load page data. Please try again later.</p>
              <p className="text-sm text-muted-foreground mt-2">{(error as Error).message}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate("/admin/page-builder")}>
                Back to Pages
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNewPage ? "Create New Page" : "Edit Page"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNewPage 
                ? "Create a new page with the advanced page builder" 
                : "Edit page content, layout, and SEO settings"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {pageData.seoScore !== undefined && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center mr-3">
                      <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <Progress 
                          value={pageData.seoScore} 
                          max={100} 
                          className="absolute h-full w-full" 
                          indicatorColor={
                            pageData.seoScore >= 80 ? "bg-green-500" : 
                            pageData.seoScore >= 60 ? "bg-amber-500" : 
                            "bg-red-500"
                          }
                        />
                        <span className="text-xs font-bold z-10">{pageData.seoScore}</span>
                      </div>
                      <span className="ml-2 text-sm font-medium">SEO</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>SEO Score: {pageData.seoScore}/100</p>
                    <p className="text-xs mt-1">
                      {pageData.seoScore >= 80 ? "Good" : 
                       pageData.seoScore >= 60 ? "Needs Improvement" : 
                       "Poor"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {!isNewPage && (
              <Button 
                variant={pageData.isPublished ? "outline" : "default"}
                onClick={handleTogglePublish}
                disabled={togglePublishMutation.isPending}
                className="mr-2"
              >
                {togglePublishMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : pageData.isPublished ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {pageData.isPublished ? "Unpublish" : "Publish"}
              </Button>
            )}
            
            <Button 
              onClick={handleSave}
              disabled={saveMutation.isPending || (!unsavedChanges && !isNewPage)}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Page Details</CardTitle>
              <CardDescription>
                Basic information about the page
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={pageData.title || ''} 
                  onChange={handleInputChange}
                  placeholder="Enter page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="path">URL Path</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">/</span>
                  <Input 
                    id="path" 
                    name="path" 
                    value={pageData.path ? pageData.path.replace(/^\//, '') : ''} 
                    onChange={(e) => {
                      // Remove leading slash if present and convert to lowercase
                      const cleanPath = e.target.value.replace(/^\//, '').toLowerCase();
                      // Replace spaces with hyphens and remove special characters
                      const formattedPath = cleanPath.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      
                      handleInputChange({
                        ...e,
                        target: {
                          name: 'path',
                          value: formattedPath
                        }
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    placeholder="page-url-path"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={pageData.description || ''} 
                  onChange={handleInputChange}
                  placeholder="Enter page description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageType">Page Type</Label>
                <select 
                  id="pageType" 
                  name="pageType" 
                  value={pageData.pageType || 'custom'} 
                  onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="core">Core Page</option>
                  <option value="custom">Custom Page</option>
                  <option value="automation">Automation Page</option>
                </select>
              </div>
              {pageData.isPublished && (
                <div className="space-y-2 flex items-center">
                  <Badge className="bg-green-600 hover:bg-green-700">Published</Badge>
                  {pageData.publishedAt && (
                    <span className="text-sm text-muted-foreground ml-3">
                      {new Date(pageData.publishedAt).toLocaleDateString()} at {new Date(pageData.publishedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between border-b">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="builder" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-4 py-2"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Builder
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-4 py-2"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger 
                  value="seo" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-4 py-2"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-4 py-2"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              {activeTab === "preview" && (
                <div className="border rounded-md overflow-hidden flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={previewDevice === "desktop" ? "default" : "ghost"} 
                          size="sm" 
                          className="rounded-none"
                          onClick={() => setPreviewDevice("desktop")}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Desktop</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={previewDevice === "tablet" ? "default" : "ghost"} 
                          size="sm" 
                          className="rounded-none"
                          onClick={() => setPreviewDevice("tablet")}
                        >
                          <Tablet className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Tablet</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={previewDevice === "mobile" ? "default" : "ghost"} 
                          size="sm" 
                          className="rounded-none"
                          onClick={() => setPreviewDevice("mobile")}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Mobile</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              {activeTab === "seo" && !isNewPage && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => calculateSeoScoreMutation.mutate()}
                    disabled={calculateSeoScoreMutation.isPending}
                  >
                    {calculateSeoScoreMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Calculate SEO Score
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => generateRecommendationsMutation.mutate()}
                    disabled={generateRecommendationsMutation.isPending}
                  >
                    {generateRecommendationsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Recommendations
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="builder" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Page Sections</CardTitle>
                        <CardDescription>
                          Organize your page into sections and add components
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleAddSection('content')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {pageData.sections && pageData.sections.length > 0 ? (
                        <PageBuilderSections 
                          sections={pageData.sections} 
                          onUpdateSection={handleUpdateSection}
                          onRemoveSection={handleRemoveSection}
                          onReorderSections={handleReorderSections}
                          onAddComponent={handleAddComponent}
                          onUpdateComponent={handleUpdateComponent}
                          onRemoveComponent={handleRemoveComponent}
                          onReorderComponents={handleReorderComponents}
                        />
                      ) : (
                        <div className="text-center p-12 border border-dashed rounded-lg">
                          <h3 className="font-medium mb-2">No sections yet</h3>
                          <p className="text-muted-foreground mb-4">Add a section to start building your page</p>
                          <Button onClick={() => handleAddSection('hero')}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Hero Section
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <PageBuilderComponentPanel 
                    onAddSection={handleAddSection} 
                    onAddComponent={handleAddComponent}
                    currentSectionId={pageData.sections?.[0]?.id}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-6">
              <PageBuilderPreview 
                page={pageData as PageBuilderPage} 
                deviceType={previewDevice}
                tenant={tenant}
              />
            </TabsContent>
            
            <TabsContent value="seo" className="mt-6">
              <PageBuilderSeoPanel 
                seoSettings={pageData.seoSettings || {}} 
                onChange={handleSeoSettingsChange} 
                pageType={pageData.pageType as any}
                pageId={pageId}
                title={pageData.title || ''}
                description={pageData.description || ''}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced settings for your page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageRole">Page Role</Label>
                      <select 
                        id="pageRole" 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="standard">Standard Page</option>
                        <option value="landing">Landing Page</option>
                        <option value="form">Form Page</option>
                        <option value="blog">Blog Page</option>
                        <option value="product">Product Page</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="caching">Caching Strategy</Label>
                      <select 
                        id="caching" 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="default">Default (24 hours)</option>
                        <option value="no-cache">No Caching</option>
                        <option value="short">Short (1 hour)</option>
                        <option value="long">Long (1 week)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customCode">Custom Code (Head)</Label>
                    <Textarea 
                      id="customCode" 
                      placeholder="Enter custom HTML, CSS, or JavaScript to be inserted in the head tag"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Custom code will be inserted in the &lt;head&gt; section of the page. Use this for analytics, tracking, or custom styling.
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Advanced Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Required Authentication</h4>
                          <p className="text-sm text-muted-foreground">Require users to be logged in to view this page</p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Show in Navigation</h4>
                          <p className="text-sm text-muted-foreground">Include this page in site navigation menus</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Enable Comments</h4>
                          <p className="text-sm text-muted-foreground">Allow users to comment on this page</p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset Settings</Button>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PageBuilderPage;