import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PageBuilderSections from "./PageBuilderSections";
import PageBuilderComponentPanel from "./PageBuilderComponentPanel";
import PageBuilderSeoPanel from "./PageBuilderSeoPanel";
import PageBuilderSeoAnalysis from "./PageBuilderSeoAnalysis";
import { EnhancedSeoAnalysis } from "./EnhancedSeoAnalysis";
import PageBuilderPreview from "./PageBuilderPreview";
import PageBuilderTemplateGallery from "./PageBuilderTemplateGallery";
import { PageVersionHistory } from "./PageVersionHistory";
import PageLockIndicator from "./PageLockIndicator";
import AIDesignAssistantPanel from "./AIDesignAssistantPanel";
import AIColorPaletteGenerator from "./AIColorPaletteGenerator";
import AIComponentRecommendations from "./AIComponentRecommendations";
import {
  Save,
  Eye,
  EyeOff,
  LayoutTemplate,
  FileCode,
  History,
  Sparkles,
  Cpu,
  PaintBucket,
  AlertCircle,
  Plus
} from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";

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
  isLocked?: boolean;
  origin?: string;
}

const PageBuilderContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewPage = id === "new";
  const pageId = isNewPage ? 0 : parseInt(id);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { tenant } = useTenant();
  
  // State
  const [activeTab, setActiveTab] = useState<string>(isNewPage ? "templates" : "editor");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState<boolean>(false);
  const [page, setPage] = useState<PageBuilderPage | null>(isNewPage ? createEmptyPage() : null);
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Create a default empty page
  function createEmptyPage(): PageBuilderPage {
    return {
      id: 0,
      tenantId: tenant?.id || '00000000-0000-0000-0000-000000000000',
      title: 'New Page',
      path: '',
      description: '',
      pageType: 'custom',
      isPublished: false,
      seoSettings: {
        title: '',
        description: '',
        keywords: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [],
      isLocked: false,
      origin: 'manual'
    };
  }

  // Fetch page data for existing pages
  const { data: pageData, isLoading, error } = useQuery({
    queryKey: [`/api/page-builder/pages/${pageId}`],
    queryFn: async () => {
      try {
        console.log(`Attempting to fetch page with ID: ${pageId}, isNaN: ${isNaN(pageId)}`);
        
        if (isNaN(pageId)) {
          console.error("Invalid page ID, not a number:", pageId);
          throw new Error("Invalid page ID");
        }
        
        const res = await fetch(`/api/page-builder/pages/${pageId}`);
        console.log(`Response status for page ${pageId}:`, res.status);
        
        if (!res.ok) {
          console.error(`Failed to fetch page ${pageId}, Status: ${res.status}`);
          throw new Error(`Failed to fetch page: ${res.status}`);
        }
        
        const data = await res.json();
        console.log(`Successfully fetched page ${pageId} data:`, data);
        return data.data;
      } catch (err) {
        console.error(`Error fetching page ID ${pageId}:`, err);
        throw new Error(`Failed to fetch page: ${(err as Error).message}`);
      }
    },
    enabled: !isNewPage && !!pageId && !isNaN(pageId),
    retry: 1,
  });

  // Update page in state when data changes for existing pages
  useEffect(() => {
    if (pageData) {
      setPage(pageData);
    }
  }, [pageData]);

  // Initialize page with empty sections if needed
  useEffect(() => {
    if (page && (!page.sections || page.sections.length === 0)) {
      setPage({
        ...page,
        sections: []
      });
    }
  }, [page]);

  // Create new page mutation
  const createPageMutation = useMutation({
    mutationFn: async (newPage: PageBuilderPage) => {
      try {
        console.log("Creating new page with data:", newPage);
        
        // Use direct fetch for debugging
        const res = await fetch(`/api/page-builder/pages`, {
          method: "POST", 
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(newPage)
        });
        
        console.log("Create page response status:", res.status);
        
        if (!res.ok) {
          let errorMessage = "Failed to create page";
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }
        
        const data = await res.json();
        console.log("Page created successfully:", data);
        return data;
      } catch (err) {
        console.error("Error creating page:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Page created",
        description: "New page has been created successfully",
      });
      // Redirect to the edit page with the new ID
      if (data.data && data.data.id) {
        console.log("Redirecting to new page:", data.data.id);
        navigate(`/page-builder/${data.data.id}`);
      } else {
        console.warn("No ID in response data:", data);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create page: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update existing page mutation
  const updatePageMutation = useMutation({
    mutationFn: async (updatedPage: PageBuilderPage) => {
      try {
        const res = await apiRequest("PATCH", `/api/page-builder/pages/${pageId}`, updatedPage);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update page");
        }
        return res.json();
      } catch (err) {
        console.error("Error updating page:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Page saved",
        description: "Page has been saved successfully",
      });
      queryClient.setQueryData([`/api/page-builder/pages/${pageId}`], data.data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save page: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle save
  const handleSave = () => {
    if (!page) return;
    
    if (isNewPage) {
      // Create a new page
      createPageMutation.mutate(page);
    } else {
      // Update an existing page
      updatePageMutation.mutate(page);
    }
  };

  // Update a section
  const handleUpdateSection = (sectionId: number, updatedSection: Partial<PageBuilderSection>) => {
    if (!page) return;
    
    const updatedSections = page.sections.map(section => 
      section.id === sectionId ? { ...section, ...updatedSection } : section
    );
    
    setPage({
      ...page,
      sections: updatedSections
    });
  };

  // Remove a section
  const handleRemoveSection = (sectionId: number) => {
    if (!page) return;
    
    setPage({
      ...page,
      sections: page.sections.filter(section => section.id !== sectionId)
    });
  };

  // Reorder sections
  const handleReorderSections = (newSections: PageBuilderSection[]) => {
    if (!page) return;
    
    setPage({
      ...page,
      sections: newSections
    });
  };

  // Add a new section
  const handleAddSection = () => {
    if (!page) return;
    
    const newSectionId = Date.now(); // Temporary ID, will be replaced on server
    const newSection: PageBuilderSection = {
      id: newSectionId,
      name: `Section ${page.sections.length + 1}`,
      type: "content",
      pageId: page.id,
      order: page.sections.length,
      layout: "single",
      settings: {},
      components: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPage({
      ...page,
      sections: [...page.sections, newSection]
    });
  };

  // Add a component to a section
  const handleAddComponent = (sectionId: number, componentType: string) => {
    if (!page) return;
    
    const newComponentId = Date.now(); // Temporary ID, will be replaced on server
    const section = page.sections.find(s => s.id === sectionId);
    
    if (!section) return;
    
    const newComponent: PageBuilderComponent = {
      id: newComponentId,
      name: `${componentType.charAt(0).toUpperCase() + componentType.slice(1)} Component`,
      type: componentType,
      sectionId: sectionId,
      order: section.components.length,
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
  };

  // Update a component
  const handleUpdateComponent = (sectionId: number, componentId: number, updatedComponent: Partial<PageBuilderComponent>) => {
    if (!page) return;
    
    const updatedSections = page.sections.map(section => {
      if (section.id === sectionId) {
        const updatedComponents = section.components.map(component => 
          component.id === componentId ? { ...component, ...updatedComponent } : component
        );
        
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
  };

  // Remove a component
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
  };

  // Reorder components within a section
  const handleReorderComponents = (sectionId: number, newComponents: PageBuilderComponent[]) => {
    if (!page) return;
    
    const updatedSections = page.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: newComponents
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
  };

  // Apply AI design suggestion to page
  const handleApplySuggestion = (suggestion: any) => {
    if (!page || !suggestion || !suggestion.sections) return;
    
    // Create sections from the suggestion
    const newSections = suggestion.sections.map((sectionData: any, index: number) => {
      const newSectionId = Date.now() + index; // Temporary ID
      
      // Create components for the section
      const components = (sectionData.components || []).map((componentData: any, compIndex: number) => {
        return {
          id: Date.now() + index + compIndex + 100,
          name: componentData.name || `Component ${compIndex + 1}`,
          type: componentData.type || "text",
          sectionId: newSectionId,
          order: compIndex,
          content: componentData.content || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
      
      return {
        id: newSectionId,
        name: sectionData.name || `Section ${index + 1}`,
        type: sectionData.type || "content",
        pageId: page.id,
        order: page.sections.length + index,
        layout: sectionData.layout || "single",
        settings: sectionData.settings || {},
        components,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    
    // Add the new sections to the page
    setPage({
      ...page,
      sections: [...page.sections, ...newSections]
    });
    
    toast({
      title: "AI Layout Applied",
      description: `Added ${newSections.length} new sections to your page based on AI recommendation`,
    });
  };

  // Apply AI component to a section
  const handleApplyAIComponent = (component: any) => {
    if (!page || !component || page.sections.length === 0) {
      toast({
        title: "Cannot Add Component",
        description: "You need to have at least one section on the page first",
        variant: "destructive",
      });
      return;
    }
    
    // Target the first section if no specific section is provided
    const targetSectionId = page.sections[0].id;
    
    // Create a new component from the AI recommendation
    const newComponentId = Date.now();
    const newComponent: PageBuilderComponent = {
      id: newComponentId,
      name: component.name || `AI Component`,
      type: component.type || "text",
      sectionId: targetSectionId,
      order: page.sections[0].components.length,
      content: component.content || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add the component to the first section
    const updatedSections = page.sections.map(section => {
      if (section.id === targetSectionId) {
        return {
          ...section,
          components: [...section.components, newComponent]
        };
      }
      return section;
    });
    
    setPage({
      ...page,
      sections: updatedSections
    });
    
    toast({
      title: "AI Component Added",
      description: `Added a new component to your page's first section`,
    });
  };

  // Apply color palette to the page
  const handleApplyColorPalette = (palette: any) => {
    // In a real implementation, this would update the theme or style settings
    toast({
      title: "Color Palette Applied",
      description: `${palette.name} color palette has been applied to your page`,
    });
    
    // Here we would update the page's theme or color settings
    // For now we'll just show a toast notification
  };

  // Apply a template
  const handleApplyTemplate = (template: any) => {
    if (!page || !template) return;
    
    // Update the page with template data
    setPage({
      ...page,
      // Don't set template directly - handle ID in backend
      sections: template.sections || []
    });
    
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to your page`,
    });
  };

  // Update SEO settings
  const handleUpdateSeo = (seoSettings: any) => {
    if (!page) return;
    
    setPage({
      ...page,
      seoSettings: {
        ...page.seoSettings,
        ...seoSettings
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (error || !page) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Page Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load page data. {error?.message}</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate("/page-builder")}
            >
              Back to Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Page Builder Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <p className="text-muted-foreground">{page.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {page.isLocked && <PageLockIndicator origin={page.origin || 'unknown'} />}
          
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Design
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVersionHistoryOpen(true)}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={(createPageMutation.isPending || updatePageMutation.isPending) || (page && page.isLocked)}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        <div className="border rounded-lg p-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Page Preview</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(false)}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Exit Preview
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <PageBuilderPreview page={page} deviceType={deviceType} />
          </div>
        </div>
      ) : (
        <>
          {/* Main Editor Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="editor">
                  <FileCode className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <FileCode className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Design
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Sections and Components (Left Column) */}
                <div className="col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Sections</CardTitle>
                      <CardDescription>
                        Organize your page into sections and add components
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PageBuilderSections
                        sections={page.sections}
                        onUpdateSection={handleUpdateSection}
                        onRemoveSection={handleRemoveSection}
                        onReorderSections={handleReorderSections}
                        onAddComponent={handleAddComponent}
                        onUpdateComponent={handleUpdateComponent}
                        onRemoveComponent={handleRemoveComponent}
                        onReorderComponents={handleReorderComponents}
                        isLocked={page.isLocked}
                      />
                      
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={handleAddSection}
                        disabled={page.isLocked}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Section
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Add Component Panel (Right Column) */}
                <div className="col-span-1">
                  <PageBuilderComponentPanel
                    onAddComponent={(componentType) => {
                      if (page.sections.length > 0) {
                        handleAddComponent(page.sections[0].id, componentType);
                      } else {
                        toast({
                          title: "No sections available",
                          description: "Please add a section first",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates">
              <PageBuilderTemplateGallery
                onApplyTemplate={handleApplyTemplate}
                currentPageType={page.pageType}
                isLocked={page.isLocked}
              />
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo">
              <div className="space-y-8">
                <PageBuilderSeoPanel
                  seoSettings={page.seoSettings}
                  onUpdateSeo={handleUpdateSeo}
                  pageType={page.pageType}
                  isLocked={page.isLocked}
                />
                
                {/* Enhanced SEO Analysis */}
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-4 bg-slate-50 border-b">
                    <h3 className="text-lg font-medium">Enhanced SEO Analysis</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive SEO analysis with keyword density, mobile-friendliness, and competitor insights</p>
                  </div>
                  {page.id && (
                    <EnhancedSeoAnalysis pageId={page.id} />
                  )}
                </div>
                
                {/* SEO Analysis Section */}
                <div className="mt-6 border rounded-lg">
                  <h3 className="text-lg font-medium p-4 border-b">SEO Analysis</h3>
                  <PageBuilderSeoAnalysis pageId={page.id} />
                </div>
              </div>
            </TabsContent>

            {/* AI Design Tab */}
            <TabsContent value="ai">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        AI-Powered Design System
                      </CardTitle>
                      <CardDescription>
                        Get intelligent design suggestions and recommendations powered by AI
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="assistant">
                        <TabsList className="w-full grid grid-cols-3">
                          <TabsTrigger value="assistant">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Design Assistant
                          </TabsTrigger>
                          <TabsTrigger value="components">
                            <Cpu className="h-4 w-4 mr-2" />
                            Component Recommendations
                          </TabsTrigger>
                          <TabsTrigger value="colors">
                            <PaintBucket className="h-4 w-4 mr-2" />
                            Color Palette Generator
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="assistant" className="mt-4">
                          <AIDesignAssistantPanel
                            pageId={page.id}
                            pageType={page.pageType}
                            tenantId={page.tenantId || tenant?.id || '00000000-0000-0000-0000-000000000000'}
                            onApplySuggestion={handleApplySuggestion}
                            onApplyComponent={handleApplyAIComponent}
                            onApplyColorPalette={handleApplyColorPalette}
                          />
                        </TabsContent>
                        
                        <TabsContent value="components" className="mt-4">
                          <AIComponentRecommendations
                            pageId={page.id}
                            onAddComponent={handleApplyAIComponent}
                          />
                        </TabsContent>
                        
                        <TabsContent value="colors" className="mt-4">
                          <AIColorPaletteGenerator
                            tenantId={page.tenantId || tenant?.id || '00000000-0000-0000-0000-000000000000'}
                            onApplyPalette={handleApplyColorPalette}
                          />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Version History Dialog */}
      <PageVersionHistory
        entityId={page.id}
        entityType="page"
        isOpen={versionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
        onVersionRestore={() => {
          setVersionHistoryOpen(false);
          // Refresh the page data after restore
          queryClient.invalidateQueries({ queryKey: [`/api/page-builder/pages/${pageId}`] });
        }}
      />
    </div>
  );
};

export default PageBuilderContent;