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
} from "lucide-react";

// Interfaces
interface PageBuilderComponent {
  id: number;
  name: string;
  type: string;
  sectionId: number;
  order: number;
  content: any;
  createdAt: string;
  updatedAt: string;
  parentId?: number;
  children?: PageBuilderComponent[];
}

interface PageBuilderSection {
  id: number;
  name: string;
  type: string;
  pageId: number;
  order: number;
  layout: 'single' | 'two-column' | 'three-column' | 'sidebar-left' | 'sidebar-right' | 'custom';
  settings: any;
  components: PageBuilderComponent[];
  createdAt: string;
  updatedAt: string;
}

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

// Create a new blank page with default values
const createNewPage = (): Omit<PageBuilderPage, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'> => {
  return {
    title: "New Page",
    path: "/new-page",
    description: "",
    pageType: "custom",
    isPublished: false,
    seoSettings: {
      title: "",
      description: "",
      keywords: [],
      primaryKeyword: "",
      seoGoal: "conversion",
    },
    sections: []
  };
};

const PageBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewPage = !id || id === "new";
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // States
  const [page, setPage] = useState<PageBuilderPage | null>(null);
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<string>("content");
  const [selectedSectionId, setSelectedSectionId] = useState<number | undefined>(undefined);
  const [pageUnsaved, setPageUnsaved] = useState(false);
  
  // Fetch page data if editing an existing page
  const { isLoading, error } = useQuery({
    queryKey: ['/api/page-builder/pages', id],
    queryFn: async () => {
      if (isNewPage) {
        return null;
      }
      
      const res = await apiRequest("GET", `/api/page-builder/pages/${id}`);
      if (!res.ok) throw new Error('Failed to fetch page');
      const data = await res.json();
      return data.data as PageBuilderPage;
    },
    onSuccess: (data) => {
      if (data) {
        setPage(data);
      } else if (isNewPage) {
        // Create a new page with default values
        setPage(createNewPage() as PageBuilderPage);
      }
    }
  });
  
  // Create or update page mutation
  const saveMutation = useMutation({
    mutationFn: async (pageData: Partial<PageBuilderPage>) => {
      if (isNewPage) {
        const res = await apiRequest("POST", "/api/page-builder/pages", pageData);
        if (!res.ok) throw new Error('Failed to create page');
        return await res.json();
      } else {
        const res = await apiRequest("PUT", `/api/page-builder/pages/${id}`, pageData);
        if (!res.ok) throw new Error('Failed to update page');
        return await res.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      
      if (isNewPage) {
        // Redirect to the edit page
        navigate(`/admin/page-builder/${data.data.id}`);
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
      const res = await apiRequest("DELETE", `/api/page-builder/pages/${id}`);
      if (!res.ok) throw new Error('Failed to delete page');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      navigate("/admin/page-builder");
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
  
  // Handle page save
  const handleSavePage = () => {
    if (!page) return;
    
    saveMutation.mutate(page);
  };
  
  // Handle page delete
  const handleDeletePage = () => {
    if (window.confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };
  
  // Handle page publish toggle
  const handlePublishToggle = () => {
    if (!page) return;
    
    const updatedPage = {
      ...page,
      isPublished: !page.isPublished
    };
    
    setPage(updatedPage);
    saveMutation.mutate(updatedPage);
  };
  
  // Handle page title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) return;
    
    setPage({
      ...page,
      title: e.target.value
    });
    
    setPageUnsaved(true);
  };
  
  // Handle page path change
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!page) return;
    
    // Ensure path starts with a slash
    let path = e.target.value;
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    setPage({
      ...page,
      path
    });
    
    setPageUnsaved(true);
  };
  
  // Handle page description change
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
      pageType: value as 'core' | 'custom' | 'automation'
    });
    
    setPageUnsaved(true);
  };
  
  // Handle SEO settings change
  const handleSeoSettingsChange = (seoSettings: any) => {
    if (!page) return;
    
    setPage({
      ...page,
      seoSettings
    });
    
    setPageUnsaved(true);
  };
  
  // Handle add section
  const handleAddSection = (sectionType: string) => {
    if (!page) return;
    
    const newSection: PageBuilderSection = {
      id: Date.now(), // Temporary ID that will be replaced on the server
      name: getDefaultSectionName(sectionType),
      type: sectionType,
      pageId: page.id,
      order: page.sections.length,
      layout: 'single',
      settings: {
        backgroundColor: '#ffffff',
        padding: {
          top: 48,
          right: 24,
          bottom: 48,
          left: 24
        },
        fullWidth: false
      },
      components: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add default components based on section type
    if (sectionType === 'hero') {
      newSection.layout = 'single';
      newSection.components = [
        {
          id: Date.now(), // Temporary ID
          name: "Heading",
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
          name: "Subheading",
          type: "paragraph",
          sectionId: newSection.id,
          order: 1,
          content: {
            text: "We're excited to have you here. Learn more about our services and offerings."
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
    } else if (sectionType === 'feature-grid') {
      newSection.layout = 'three-column';
      newSection.components = [
        {
          id: Date.now(), // Temporary ID
          name: "Feature 1",
          type: "card",
          sectionId: newSection.id,
          order: 0,
          content: {
            title: "Feature One",
            content: "Description of the first feature and its benefits."
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 1, // Temporary ID
          name: "Feature 2",
          type: "card",
          sectionId: newSection.id,
          order: 1,
          content: {
            title: "Feature Two",
            content: "Description of the second feature and its benefits."
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now() + 2, // Temporary ID
          name: "Feature 3",
          type: "card",
          sectionId: newSection.id,
          order: 2,
          content: {
            title: "Feature Three",
            content: "Description of the third feature and its benefits."
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else if (sectionType === 'cta-section') {
      newSection.layout = 'single';
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
  const handleUpdateSection = (sectionId: number, updatedSection: Partial<PageBuilderSection>) => {
    if (!page) return;
    
    const updatedSections = page.sections.map(section => {
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
    
    const updatedSections = page.sections.filter(section => section.id !== sectionId);
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(undefined);
    }
    
    setPageUnsaved(true);
  };
  
  // Handle reorder sections
  const handleReorderSections = (newOrder: PageBuilderSection[]) => {
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
    
    const section = page.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newComponent: PageBuilderComponent = {
      id: Date.now(), // Temporary ID that will be replaced on the server
      name: getDefaultComponentName(componentType),
      type: componentType,
      sectionId,
      order: section.components.length,
      content: getDefaultComponentContent(componentType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedSections = page.sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          components: [...s.components, newComponent]
        };
      }
      return s;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    setPageUnsaved(true);
  };
  
  // Handle update component
  const handleUpdateComponent = (sectionId: number, componentId: number, updatedComponent: Partial<PageBuilderComponent>) => {
    if (!page) return;
    
    const updatedSections = page.sections.map(section => {
      if (section.id === sectionId) {
        const updatedComponents = section.components.map(component => {
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
    
    const updatedSections = page.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: section.components.filter(component => component.id !== componentId)
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
  const handleReorderComponents = (sectionId: number, newOrder: PageBuilderComponent[]) => {
    if (!page) return;
    
    const updatedSections = page.sections.map(section => {
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
  
  // Get default section name based on type
  const getDefaultSectionName = (type: string): string => {
    switch (type) {
      case 'hero': return 'Hero Section';
      case 'content': return 'Content Section';
      case 'feature-grid': return 'Features Grid';
      case 'two-column': return 'Two Column Section';
      case 'sidebar-left': return 'Section with Left Sidebar';
      case 'sidebar-right': return 'Section with Right Sidebar';
      case 'cta-section': return 'Call to Action Section';
      case 'nav-header': return 'Navigation Header';
      case 'simple-footer': return 'Simple Footer';
      case 'multi-column-footer': return 'Multi-Column Footer';
      case 'testimonials': return 'Testimonials Section';
      default: return `Section ${type}`;
    }
  };
  
  // Get default component name based on type
  const getDefaultComponentName = (type: string): string => {
    switch (type) {
      case 'heading': return 'Heading';
      case 'paragraph': return 'Paragraph';
      case 'image': return 'Image';
      case 'button': return 'Button';
      case 'list': return 'List';
      case 'divider': return 'Divider';
      case 'spacer': return 'Spacer';
      case 'card': return 'Card';
      case 'grid': return 'Grid';
      case 'container': return 'Container';
      case 'columns': return 'Columns';
      case 'rows': return 'Rows';
      case 'gallery': return 'Gallery';
      case 'video': return 'Video';
      case 'icon': return 'Icon';
      case 'form': return 'Form';
      case 'map': return 'Map';
      case 'accordion': return 'Accordion';
      case 'cta': return 'Call to Action';
      case 'testimonial': return 'Testimonial';
      default: return `Component ${type}`;
    }
  };
  
  // Get default component content based on type
  const getDefaultComponentContent = (type: string): any => {
    switch (type) {
      case 'heading':
        return {
          text: 'New Heading',
          level: 'h2'
        };
      case 'paragraph':
        return {
          text: 'This is a paragraph of text. You can edit this text to add your own content.'
        };
      case 'image':
        return {
          src: '',
          alt: 'Image description',
          width: 400,
          height: 300
        };
      case 'button':
        return {
          text: 'Button',
          url: '#',
          variant: 'default'
        };
      case 'list':
        return {
          listType: 'bullet',
          items: ['Item 1', 'Item 2', 'Item 3']
        };
      case 'divider':
        return {
          style: 'solid',
          color: '#e0e0e0'
        };
      case 'spacer':
        return {
          height: 40
        };
      case 'card':
        return {
          title: 'Card Title',
          content: 'Card content goes here.',
          image: ''
        };
      case 'cta':
        return {
          heading: 'Call to Action',
          text: 'Take action now with our amazing offer!',
          buttonText: 'Get Started',
          buttonUrl: '#'
        };
      default:
        return {};
    }
  };
  
  // Handle browser navigation attempt when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pageUnsaved) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pageUnsaved]);
  
  // UI helpers
  const getPageTypeLabel = (type: string) => {
    switch (type) {
      case 'core': return 'Core Page';
      case 'custom': return 'Custom Page';
      case 'automation': return 'Automation Page';
      default: return type;
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container px-8 py-6">
          <div className="flex items-center mb-8">
            <Skeleton className="h-4 w-6 mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Skeleton className="h-12 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="container px-8 py-6">
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
            <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/admin/page-builder")}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Pages
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!page) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="container px-8 py-6">
        {/* Back link */}
        <Button 
          variant="ghost" 
          className="p-0 mb-6 hover:bg-transparent"
          onClick={() => navigate("/admin/page-builder")}
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
              </div>
              <div>
                <PageBuilderComponentPanel 
                  onAddSection={handleAddSection}
                  onAddComponent={handleAddComponent}
                  currentSectionId={selectedSectionId}
                />
              </div>
            </div>
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
              onClick={() => navigate("/admin/page-builder")}
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
                  Save Page
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PageBuilderPage;