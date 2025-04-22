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
} from "lucide-react";

// Internal component that does NOT include AdminLayout
// Fixed: Adding console logs to debug the component loading
const PageBuilderContent: React.FC = () => {
  console.log("PageBuilderContent is rendering");
  const { id } = useParams<{ id: string }>();
  const isNewPage = !id || id === "new";
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // States
  const [page, setPage] = useState<any | null>(null);
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<string>(isNewPage ? "templates" : "content");
  const [selectedSectionId, setSelectedSectionId] = useState<number | undefined>(undefined);
  const [pageUnsaved, setPageUnsaved] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(isNewPage);
  
  // Helper function for path navigation that uses window.location
  const navigate = (path: string) => {
    window.location.href = path;
  };
  
  // Create a new blank page with default values
  const createNewPage = () => {
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
      const res = await apiRequest("DELETE", `/api/page-builder/pages/${id}`);
      if (!res.ok) throw new Error('Failed to delete page');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
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
      pageType: value
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
  
  // Handle template selection
  const handleApplyTemplate = (template: any) => {
    if (!page) return;
    
    // Apply the template data to the current page
    setPage({
      ...page,
      title: template.title,
      path: template.path,
      description: template.description,
      pageType: template.pageType,
      seoSettings: template.seoSettings,
      sections: template.sections.map((section: any) => ({
        ...section,
        id: Date.now() + Math.floor(Math.random() * 1000) + section.order, // Generate unique IDs
        components: section.components.map((component: any) => ({
          ...component,
          id: Date.now() + Math.floor(Math.random() * 1000) + component.order // Generate unique IDs
        }))
      }))
    });
    
    // Switch to the content tab
    setActiveTab("content");
    setShowTemplateGallery(false);
    setPageUnsaved(true);
    
    toast({
      title: "Template applied",
      description: "The template has been applied to your page. You can now customize it.",
      variant: "default"
    });
  };
  
  // Get page type label
  const getPageTypeLabel = (type: string) => {
    switch (type) {
      case "core": return "Core Page";
      case "custom": return "Custom Page";
      case "automation": return "Automation Page";
      default: return type;
    }
  };
  
  // Get default section name
  const getDefaultSectionName = (type: string) => {
    switch (type) {
      case "hero": return "Hero Section";
      case "feature-grid": return "Features Grid";
      case "cta-section": return "Call to Action";
      case "content-section": return "Content Section";
      case "testimonials": return "Testimonials";
      case "team": return "Team Members";
      case "faq": return "FAQ Section";
      case "pricing": return "Pricing Section";
      case "contact": return "Contact Information";
      case "gallery": return "Image Gallery";
      default: return type;
    }
  };
  
  // Get default component name
  const getDefaultComponentName = (type: string) => {
    switch (type) {
      case "heading": return "Heading";
      case "paragraph": return "Paragraph";
      case "image": return "Image";
      case "button": return "Button";
      case "divider": return "Divider";
      case "spacer": return "Spacer";
      case "card": return "Card";
      case "cta": return "Call to Action";
      case "form": return "Form";
      case "video": return "Video";
      case "carousel": return "Carousel";
      case "icon": return "Icon";
      case "quote": return "Quote";
      default: return type;
    }
  };
  
  // Get default component content
  const getDefaultComponentContent = (type: string) => {
    switch (type) {
      case "heading":
        return {
          text: "Add a Heading",
          level: "h2"
        };
      case "paragraph":
        return {
          text: "Add your content here. This is a paragraph component that can be edited to add your custom text."
        };
      case "image":
        return {
          src: "",
          alt: "Image description",
          width: 800,
          height: 600
        };
      case "button":
        return {
          text: "Click Me",
          url: "#",
          variant: "default"
        };
      case "divider":
        return {
          style: "solid"
        };
      case "spacer":
        return {
          height: 40
        };
      case "card":
        return {
          title: "Card Title",
          content: "Card content goes here",
          image: ""
        };
      case "cta":
        return {
          heading: "Call to Action",
          text: "Description text",
          buttonText: "Learn More",
          buttonUrl: "#"
        };
      case "form":
        return {
          title: "Contact Form",
          description: "Fill out the form below and we'll get back to you.",
          fields: [
            { type: "text", label: "Name", required: true, placeholder: "Your name" },
            { type: "email", label: "Email", required: true, placeholder: "your.email@example.com" },
            { type: "tel", label: "Phone", required: false, placeholder: "(123) 456-7890" },
            { type: "select", label: "Subject", required: true, options: ["General Inquiry", "Support", "Feedback"] },
            { type: "textarea", label: "Message", required: true, placeholder: "How can we help you?" }
          ],
          submitText: "Send Message",
          successMessage: "Thank you! Your message has been sent successfully.",
          errorMessage: "Something went wrong. Please try again later.",
          emailTarget: "" // Will be set by admin during configuration
        };
      case "map":
        return {
          address: "123 Main Street, Anytown, CA 12345",
          title: "Our Location",
          description: "We're located in the heart of downtown.",
          height: 400,
          showControls: true,
          zoom: 14,
          markers: [
            {
              lat: 37.7749, 
              lng: -122.4194,
              title: "Our Office"
            }
          ]
        };
      case "accordion":
        return {
          title: "Frequently Asked Questions",
          items: [
            { 
              title: "How do I get started?", 
              content: "Getting started is easy! Simply register for an account and follow the onboarding process." 
            },
            { 
              title: "What payment methods do you accept?", 
              content: "We accept all major credit cards, PayPal, and bank transfers." 
            },
            { 
              title: "Do you offer refunds?", 
              content: "Yes, we offer a 30-day money-back guarantee on all our services." 
            }
          ],
          allowMultiple: false
        };
      case "video":
        return {
          url: "",
          poster: "",
          autoplay: false,
          controls: true
        };
      case "carousel":
        return {
          items: [
            { image: "", caption: "Slide 1" },
            { image: "", caption: "Slide 2" },
            { image: "", caption: "Slide 3" }
          ]
        };
      case "icon":
        return {
          name: "star",
          size: 24,
          color: "currentColor"
        };
      case "quote":
        return {
          text: "This is a sample quote.",
          author: "Author Name",
          position: "Position"
        };
      default:
        return {};
    }
  };
  
  // Handle add section
  const handleAddSection = (sectionType: string) => {
    if (!page) return;
    
    const newSection = {
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
    
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(undefined);
    }
    
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
    
    const section = page.sections.find((s: any) => s.id === sectionId);
    if (!section) return;
    
    const newComponent = {
      id: Date.now(), // Temporary ID that will be replaced on the server
      name: getDefaultComponentName(componentType),
      type: componentType,
      sectionId,
      order: section.components.length,
      content: getDefaultComponentContent(componentType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedSections = page.sections.map((s: any) => {
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
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container px-8 py-6">
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/page-builder")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Pages
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
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
    </div>
  );
};

// Wrapper component that includes AdminLayout
const PageBuilderPage: React.FC = () => {
  console.log("PageBuilderPage: Main wrapper component rendering");
  return (
    <AdminLayout>
      <PageBuilderContent />
    </AdminLayout>
  );
};

export default PageBuilderPage;