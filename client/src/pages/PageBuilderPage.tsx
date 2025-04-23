import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PageBuilderSections from "@/components/page-builder/PageBuilderSections";
import PageBuilderComponentPanel from "@/components/page-builder/PageBuilderComponentPanel";
import PageBuilderSeoPanel from "@/components/page-builder/PageBuilderSeoPanel";
import PageBuilderPreview from "@/components/page-builder/PageBuilderPreview";
import PageBuilderTemplateGallery from "@/components/page-builder/PageBuilderTemplateGallery";
import { PageVersionHistory } from "@/components/page-builder/PageVersionHistory";
import {
  Save,
  Eye,
  ChevronLeft,
  Copy,
  Trash2,
  PlusCircle,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Undo2,
  CornerUpLeft,
  LayoutTemplate,
  History
} from "lucide-react";

// Internal component that does NOT include AdminLayout
const PageBuilderContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewPage = !id || id === "new";
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // States
  const [page, setPage] = useState<any | null>(null);
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<string>(isNewPage ? "templates" : "content");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [pageUnsaved, setPageUnsaved] = useState<boolean>(false);
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  
  // Helper for getting page type label
  const getPageTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'core': 'Core Page',
      'custom': 'Custom Page',
      'automation': 'Automation Page'
    };
    return types[type] || type;
  };
  
  // Create a new blank page with default values
  const createNewPage = () => {
    // Use the default tenant ID for Progress Accountants
    // This is a fixed UUID for simplicity and consistency
    const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';
    
    return {
      tenantId: DEFAULT_TENANT_ID,
      name: "New Page",
      slug: "new-page",
      description: "",
      pageType: "standard", // Matching the schema values: standard, landing, specialized
      status: "draft",
      version: 1,
      published: false,
      // Map UI fields to match the database schema
      title: "New Page", // UI field, maps to name
      path: "/new-page", // UI field, maps to slug
      isPublished: false, // UI field, maps to published
      seo: {
        title: "",
        description: "",
        keywords: [],
        primaryKeyword: "",
        goal: "conversion",
      },
      metadata: {},
      businessContext: {},
      sections: []
    };
  };
  
  // Fetch page data if editing an existing page
  const { isLoading, error } = useQuery({
    queryKey: ['/api/page-builder/pages', id],
    queryFn: async () => {
      if (isNewPage) {
        // Create a new page with default values
        return null;
      }
      
      const res = await apiRequest("GET", `/api/page-builder/pages/${id}`);
      if (!res.ok) throw new Error('Failed to fetch page');
      const data = await res.json();
      return data.data;
    }
  });
  
  // Fix: Use useEffect instead of onSuccess for setting page data
  useEffect(() => {
    if (isLoading) return;
    
    if (error) {
      console.error("Error loading page data:", error);
      return;
    }
    
    // If we have data from the query
    if (isNewPage) {
      // Create a new page with default values
      setPage(createNewPage());
    } else if (queryClient.getQueryData(['/api/page-builder/pages', id])) {
      const data = queryClient.getQueryData(['/api/page-builder/pages', id]);
      setPage(data);
    }
  }, [isLoading, error, id, isNewPage, queryClient]);
  
  // Create or update page mutation
  const saveMutation = useMutation({
    mutationFn: async (pageData: any) => {
      try {
        if (isNewPage) {
          const res = await apiRequest("POST", "/api/page-builder/pages", pageData);
          return await res.json();
        } else {
          const res = await apiRequest("PUT", `/api/page-builder/pages/${id}`, pageData);
          return await res.json();
        }
      } catch (error) {
        // The error is already handled by apiRequest
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      
      if (isNewPage) {
        // Redirect to the edit page
        navigate(`/page-builder/${data.data.id}`);
        toast({
          title: "Page created",
          description: "The page has been created successfully."
        });
      } else {
        toast({
          title: "Page updated",
          description: "The page has been updated successfully."
        });
      }
      
      setPageUnsaved(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save page: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });
  
  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiRequest("DELETE", `/api/page-builder/pages/${id}`);
        return await res.json();
      } catch (error) {
        // The error is already handled by apiRequest
        throw error;
      }
    },
    onSuccess: () => {
      navigate("/page-builder");
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
  
  // Handle save page
  const handleSavePage = () => {
    if (!page) return;
    
    // Prepare the data to match the expected schema on the server
    const pageData = {
      // Required fields for server validation
      tenantId: page.tenantId,
      name: page.title || page.name, // Use title if available, fallback to name
      slug: page.path?.replace(/^\//, '') || page.slug, // Remove leading slash from path
      description: page.description,
      pageType: page.pageType || 'standard',
      status: page.status || 'draft',
      version: page.version || 1,
      published: page.isPublished || page.published || false,
      
      // Additional fields
      template: page.template,
      seo: page.seo || page.seoSettings,
      metadata: page.metadata || {},
      businessContext: page.businessContext || {},
      analytics: page.analytics || {},
      
      // If editing, include these fields
      ...(page.id && {
        lastEditedBy: page.lastEditedBy || 1, // Default to admin user if not set
      }),
      
      // UI specific data that might be useful when edited later
      title: page.title,
      path: page.path,
      isPublished: page.isPublished,
      seoSettings: page.seoSettings,
      
      // Sections data (will be saved separately in a transaction on the server)
      sections: page.sections
    };
    
    console.log("Saving page data:", pageData);
    
    saveMutation.mutate(pageData);
  };
  
  // Handle delete page
  const handleDeletePage = () => {
    if (isNewPage) return;
    
    if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };
  
  // Handle publish/unpublish toggle
  const handlePublishToggle = () => {
    if (!page) return;
    
    setPage({
      ...page,
      isPublished: !page.isPublished
    });
    
    setPageUnsaved(true);
  };
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) return;
    
    setPage({
      ...page,
      title: e.target.value
    });
    
    setPageUnsaved(true);
  };
  
  // Handle path change
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) return;
    
    let path = e.target.value;
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    setPage({
      ...page,
      path: path
    });
    
    setPageUnsaved(true);
  };
  
  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!page) return;
    
    setPage({
      ...page,
      description: e.target.value
    });
    
    setPageUnsaved(true);
  };
  
  // Handle page type change
  const handlePageTypeChange = (value: string) => {
    if (!page) return;
    
    setPage({
      ...page,
      pageType: value
    });
    
    setPageUnsaved(true);
  };
  
  // Handle SEO settings change
  const handleSeoSettingsChange = (seoSettings: any) => {
    if (!page) return;
    
    setPage({
      ...page,
      seoSettings: {
        ...page.seoSettings,
        ...seoSettings
      }
    });
    
    setPageUnsaved(true);
  };
  
  // Handle apply template
  const handleApplyTemplate = (template: any) => {
    setPage({
      ...page,
      sections: template.sections || []
    });
    
    setActiveTab("content");
    setPageUnsaved(true);
  };
  
  // Handle add section
  const handleAddSection = (sectionType: string) => {
    if (!page) return;
    
    const newSection = {
      id: Date.now(), // Temporary ID
      name: sectionType === 'hero' ? 'Hero Section' : 'New Section',
      type: sectionType,
      order: page.sections.length,
      components: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add some default components for specific section types
    if (sectionType === 'hero') {
      newSection.components = [
        {
          id: Date.now(), // Temporary ID
          name: "Hero Heading",
          type: "heading",
          sectionId: newSection.id,
          order: 0,
          content: {
            text: "Welcome to Our Website",
            level: "h1"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 1, // Temporary ID
          name: "Hero Paragraph",
          type: "paragraph",
          sectionId: newSection.id,
          order: 1,
          content: {
            text: "This is a hero section with a strong headline and supporting text to grab your visitors' attention."
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 2, // Temporary ID
          name: "Call to Action",
          type: "button",
          sectionId: newSection.id,
          order: 2,
          content: {
            text: "Get Started",
            url: "/contact",
            variant: "default"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else if (sectionType === 'features') {
      newSection.components = [
        {
          id: Date.now(), // Temporary ID
          name: "Feature 1",
          type: "feature",
          sectionId: newSection.id,
          order: 0,
          content: {
            title: "Feature 1",
            content: "Description of feature 1"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 1, // Temporary ID
          name: "Feature 2",
          type: "feature",
          sectionId: newSection.id,
          order: 1,
          content: {
            title: "Feature 2",
            content: "Description of feature 2"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 2, // Temporary ID
          name: "Feature 3",
          type: "feature",
          sectionId: newSection.id,
          order: 2,
          content: {
            title: "Feature 3",
            content: "Description of feature 3"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else if (sectionType === 'cta') {
      newSection.components = [
        {
          id: Date.now(), // Temporary ID
          name: "Call to Action",
          type: "cta",
          sectionId: newSection.id,
          order: 0,
          content: {
            heading: "Ready to Get Started?",
            text: "Join thousands of satisfied customers who have already made the smart choice.",
            buttonText: "Contact Us",
            buttonUrl: "/contact"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    
    setPage({
      ...page,
      sections: [...page.sections, newSection]
    });
    
    setSelectedSectionId(newSection.id);
    setPageUnsaved(true);
  };
  
  // Handle update section
  const handleUpdateSection = (sectionId: number, updatedSection: any) => {
    if (!page) return;
    
    const updatedSections = page.sections.map((section: any) => {
      if (section.id === sectionId) {
        return {
          ...section,
          ...updatedSection
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Handle remove section
  const handleRemoveSection = (sectionId: number) => {
    if (!page) return;
    
    const updatedSections = page.sections.filter((section: any) => section.id !== sectionId);
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Handle reorder sections
  const handleReorderSections = (newOrder: any[]) => {
    if (!page) return;
    
    setPage({
      ...page,
      sections: newOrder
    });
    
    setPageUnsaved(true);
  };
  
  // Handle add component
  const handleAddComponent = (sectionId: number, componentType: string) => {
    if (!page) return;
    
    const newComponent = {
      id: Date.now(), // Temporary ID
      name: `New ${componentType.charAt(0).toUpperCase() + componentType.slice(1)}`,
      type: componentType,
      sectionId: sectionId,
      order: 0, // Will be updated when inserted
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Set default content based on component type
    switch (componentType) {
      case 'heading':
        newComponent.content = { text: 'New Heading', level: 'h2' };
        break;
      case 'paragraph':
        newComponent.content = { text: 'New paragraph text goes here.' };
        break;
      case 'image':
        newComponent.content = { src: '', alt: 'Image description', width: 800, height: 600 };
        break;
      case 'button':
        newComponent.content = { text: 'Click Me', url: '#', variant: 'default' };
        break;
      case 'form':
        newComponent.content = { formId: 'contact', submitText: 'Submit' };
        break;
      case 'video':
        newComponent.content = { videoUrl: '', posterUrl: '', autoplay: false };
        break;
      default:
        break;
    }
    
    const updatedSections = page.sections.map((section: any) => {
      if (section.id === sectionId) {
        const existingComponents = section.components || [];
        
        // Update the order of the new component to be at the end
        newComponent.order = existingComponents.length;
        
        return {
          ...section,
          components: [...existingComponents, newComponent]
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Handle update component
  const handleUpdateComponent = (sectionId: number, componentId: number, updatedComponent: any) => {
    if (!page) return;
    
    const updatedSections = page.sections.map((section: any) => {
      if (section.id === sectionId) {
        const updatedComponents = section.components.map((component: any) => {
          if (component.id === componentId) {
            return {
              ...component,
              ...updatedComponent
            };
          }
          return component;
        });
        
        return {
          ...section,
          components: updatedComponents
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Handle remove component
  const handleRemoveComponent = (sectionId: number, componentId: number) => {
    if (!page) return;
    
    const updatedSections = page.sections.map((section: any) => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: section.components.filter((component: any) => component.id !== componentId)
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Handle reorder components
  const handleReorderComponents = (sectionId: number, newOrder: any[]) => {
    if (!page) return;
    
    const updatedSections = page.sections.map((section: any) => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: newOrder
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container px-8 py-6">
        <div className="flex items-center mb-8">
          <Skeleton className="h-4 w-6 mr-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }
  
  if (!page) {
    return null;
  }
  
  return (
    <div className="container px-8 py-6">
      {/* Back link */}
      <Button 
        variant="ghost" 
        className="p-0 mb-6 hover:bg-transparent"
        onClick={() => navigate("/page-builder")}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back to Pages</span>
      </Button>
      
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNewPage ? "Create New Page" : "Edit Page"}</h1>
          <p className="text-muted-foreground mt-1">
            {isNewPage ? "Create a new page with the Advanced Page Builder" : `Editing ${getPageTypeLabel(page.pageType)} - ${page.title}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNewPage && (
            <Button 
              variant="outline" 
              onClick={() => setShowVersionHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handlePublishToggle}
            disabled={isNewPage || saveMutation.isPending}
          >
            <Eye className="h-4 w-4 mr-2" />
            {page.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button 
            onClick={handleSavePage}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Page settings card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
          <CardDescription>Configure basic page settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={page.title}
                onChange={handleTitleChange}
                placeholder="Enter page title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-path">Page Path</Label>
              <Input
                id="page-path"
                value={page.path}
                onChange={handlePathChange}
                placeholder="Enter page path, e.g. /about"
              />
              <p className="text-xs text-muted-foreground">This will be the URL path for the page</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-description">Page Description</Label>
              <Textarea
                id="page-description"
                value={page.description}
                onChange={handleDescriptionChange}
                placeholder="Enter page description"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">A brief description of the page content</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-type">Page Type</Label>
              <Select
                value={page.pageType}
                onValueChange={handlePageTypeChange}
              >
                <SelectTrigger id="page-type">
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core Page</SelectItem>
                  <SelectItem value="custom">Custom Page</SelectItem>
                  <SelectItem value="automation">Automation Page</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Core: Essential website pages. Custom: Unique pages. Automation: Generated pages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Page builder interface - Tabs and content panel */}
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            {isNewPage && <TabsTrigger value="templates" className="flex items-center gap-1"><LayoutTemplate className="h-4 w-4" /> Templates</TabsTrigger>}
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {activeTab === "preview" && (
              <div className="flex items-center mr-2">
                <Button
                  variant={deviceType === "desktop" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setDeviceType("desktop")}
                  title="Desktop Preview"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceType === "tablet" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setDeviceType("tablet")}
                  title="Tablet Preview"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceType === "mobile" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setDeviceType("mobile")}
                  title="Mobile Preview"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm" disabled={isNewPage} title="Duplicate Page">
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={handleDeletePage}
              disabled={isNewPage}
              title="Delete Page"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isNewPage}
              title="Generate Content with AI"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="content">
          {page.sections.length === 0 && isNewPage ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center">
                <LayoutTemplate className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Start with a template</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose from our collection of professionally designed templates to get started quickly.
              </p>
              <Button
                onClick={() => setActiveTab("templates")}
                variant="outline"
                className="gap-2"
              >
                <LayoutTemplate className="h-4 w-4" />
                Browse Templates
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <PageBuilderSections 
                  sections={page.sections}
                  onUpdateSection={handleUpdateSection}
                  onRemoveSection={handleRemoveSection}
                  onReorderSections={handleReorderSections}
                  onAddComponent={handleAddComponent}
                  onUpdateComponent={handleUpdateComponent}
                  onRemoveComponent={handleRemoveComponent}
                  onReorderComponents={handleReorderComponents}
                />
                
                {isNewPage && page.sections.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={() => setActiveTab("templates")}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <LayoutTemplate className="h-4 w-4" />
                      Browse More Templates
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <PageBuilderComponentPanel 
                  onAddSection={handleAddSection}
                  onAddComponent={handleAddComponent}
                  currentSectionId={selectedSectionId}
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="seo">
          <PageBuilderSeoPanel 
            seoSettings={page.seoSettings}
            onChange={handleSeoSettingsChange}
            pageType={page.pageType}
            pageId={isNewPage ? null : page.id}
            title={page.title}
            description={page.description}
          />
        </TabsContent>
        
        {isNewPage && (
          <TabsContent value="templates">
            <div className="mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                Start with a professional template
              </h2>
              <p className="text-muted-foreground mb-6">
                Choose from our collection of professionally designed templates to get started quickly. All templates are fully customizable.
              </p>
              <PageBuilderTemplateGallery onSelectTemplate={handleApplyTemplate} />
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="preview">
          <div className="flex justify-center py-6 overflow-x-auto">
            <PageBuilderPreview 
              page={page}
              deviceType={deviceType}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Action button row */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="mr-2"
            disabled={!pageUnsaved}
            onClick={() => {
              // Reload the page to discard changes
              if (window.confirm("Are you sure you want to discard all changes?")) {
                window.location.reload();
              }
            }}
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Discard Changes
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/page-builder")}
          >
            <CornerUpLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSavePage}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Version History Dialog */}
      {!isNewPage && (
        <PageVersionHistory
          entityId={parseInt(id)}
          entityType="page"
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onVersionRestore={(versionId) => {
            // Refresh the page after version restore
            queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', id] });
            toast({
              title: "Version restored",
              description: "The page has been restored to a previous version."
            });
            setShowVersionHistory(false);
          }}
        />
      )}
    </div>
  );
};

// Wrapper component that includes AdminLayout
const PageBuilderPage: React.FC = () => {
  return (
    <AdminLayout>
      <PageBuilderContent />
    </AdminLayout>
  );
};

export default PageBuilderPage;