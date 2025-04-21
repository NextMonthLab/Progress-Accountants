import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaSelector from "@/components/MediaSelector";

type Resource = {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  isPublished: boolean;
  type: 'guide' | 'template' | 'calculator' | 'article';
};

export default function ResourcesSetupPage() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<'guide' | 'template' | 'calculator' | 'article'>('guide');
  
  // Get existing resources
  const { isLoading } = useQuery({
    queryKey: ['/api/pages/resources'],
    onSuccess: (data) => {
      if (data && Array.isArray(data.resources)) {
        setResources(data.resources);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error loading resources",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Add new resource
  const addResourceMutation = useMutation({
    mutationFn: async (resource: Resource) => {
      const response = await apiRequest("POST", "/api/pages/resources", resource);
      return response.json();
    },
    onSuccess: (data) => {
      setResources((prev) => [...prev, data.resource]);
      toast({
        title: "Resource added",
        description: "The resource has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding resource",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update resource
  const updateResourceMutation = useMutation({
    mutationFn: async (resource: Resource) => {
      const response = await apiRequest("PATCH", `/api/pages/resources/${resource.id}`, resource);
      return response.json();
    },
    onSuccess: (data) => {
      setResources((prev) => 
        prev.map(r => r.id === data.resource.id ? data.resource : r)
      );
      toast({
        title: "Resource updated",
        description: "The resource has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating resource",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete resource
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/pages/resources/${id}`);
      return response.json();
    },
    onSuccess: (_, id) => {
      setResources((prev) => prev.filter(r => r.id !== id));
      setSelectedResourceId(null);
      toast({
        title: "Resource deleted",
        description: "The resource has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting resource",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update page status to complete
  const completePageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/pages/complete", { 
        path: "/resources",
        displayName: "Resources",
        order: 6 // After services, team, etc.
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Page completed",
        description: "The Resources page is now live on your site.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/pages/public'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error completing page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Find the currently selected resource
  const selectedResource = selectedResourceId ? 
    resources.find(r => r.id === selectedResourceId) : null;

  // Add a new resource to the form (without saving yet)
  const handleAddResource = () => {
    const newResource: Resource = {
      title: "",
      description: "",
      isPublished: false,
      type: currentTab,
    };
    setResources((prev) => [...prev, newResource]);
    setSelectedResourceId(null); // Select the new one we're creating
  };

  // Save a resource
  const handleSaveResource = (resource: Resource) => {
    if (resource.id) {
      updateResourceMutation.mutate(resource);
    } else {
      addResourceMutation.mutate(resource);
    }
  };

  // Update a field in the selected resource
  const handleUpdateField = (field: keyof Resource, value: any) => {
    if (!selectedResource) return;
    
    const updatedResources = resources.map(r => {
      if ((selectedResourceId && r.id === selectedResourceId) || 
          (!selectedResourceId && r === selectedResource)) {
        return { ...r, [field]: value };
      }
      return r;
    });
    
    setResources(updatedResources);
  };

  // Mark page as complete and make it live
  const handleCompletePage = () => {
    completePageMutation.mutate();
  };

  const filteredResources = resources.filter(r => r.type === currentTab);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Resources Setup</h1>
            <p className="text-gray-500">
              Manage resources that will appear on your Resources page
            </p>
          </div>
          <Button 
            onClick={handleCompletePage} 
            disabled={completePageMutation.isPending || resources.length === 0}
          >
            {completePageMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Page"
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Resource types and list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resource Categories</CardTitle>
                <CardDescription>
                  Select a resource type to manage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="guide" 
                  value={currentTab}
                  onValueChange={(value) => setCurrentTab(value as any)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="guide">Guides</TabsTrigger>
                    <TabsTrigger value="template">Templates</TabsTrigger>
                    <TabsTrigger value="calculator">Calculators</TabsTrigger>
                    <TabsTrigger value="article">Articles</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="guide" className="mt-4">
                    <ResourceList 
                      resources={filteredResources}
                      selectedId={selectedResourceId}
                      onSelect={setSelectedResourceId}
                      onAdd={handleAddResource}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="template" className="mt-4">
                    <ResourceList 
                      resources={filteredResources}
                      selectedId={selectedResourceId}
                      onSelect={setSelectedResourceId}
                      onAdd={handleAddResource}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="calculator" className="mt-4">
                    <ResourceList 
                      resources={filteredResources}
                      selectedId={selectedResourceId}
                      onSelect={setSelectedResourceId}
                      onAdd={handleAddResource}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="article" className="mt-4">
                    <ResourceList 
                      resources={filteredResources}
                      selectedId={selectedResourceId}
                      onSelect={setSelectedResourceId}
                      onAdd={handleAddResource}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main content - Resource editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedResource ? "Edit Resource" : "Resource Details"}
                </CardTitle>
                <CardDescription>
                  {selectedResource 
                    ? "Update resource information" 
                    : "Select a resource to edit or add a new one"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedResource ? (
                  <ResourceEditor 
                    resource={selectedResource}
                    onSave={handleSaveResource}
                    onUpdate={handleUpdateField}
                    onDelete={() => {
                      if (selectedResource.id) {
                        deleteResourceMutation.mutate(selectedResource.id);
                      } else {
                        setResources(prev => prev.filter(r => r !== selectedResource));
                        setSelectedResourceId(null);
                      }
                    }}
                    isPending={
                      updateResourceMutation.isPending || 
                      addResourceMutation.isPending || 
                      deleteResourceMutation.isPending
                    }
                  />
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>Select a resource from the list or add a new one</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Resource list component
function ResourceList({ 
  resources, 
  selectedId, 
  onSelect, 
  onAdd, 
  isLoading 
}: { 
  resources: Resource[], 
  selectedId: number | null, 
  onSelect: (id: number | null) => void, 
  onAdd: () => void,
  isLoading: boolean 
}) {
  if (isLoading) {
    return (
      <div className="py-6 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto" />
        <p className="mt-2 text-sm text-gray-500">Loading resources...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {resources.length === 0 ? (
          <p className="text-center py-4 text-sm text-gray-500">No resources added yet</p>
        ) : (
          resources.map((resource, index) => (
            <div 
              key={resource.id || `new-${index}`}
              className={`p-3 rounded-md cursor-pointer ${
                selectedId === resource.id ? "bg-accent" : "hover:bg-gray-100"
              }`}
              onClick={() => onSelect(resource.id || null)}
            >
              <p className="font-medium">{resource.title || "Untitled Resource"}</p>
              {!resource.isPublished && (
                <span className="text-sm text-orange-500">Draft</span>
              )}
            </div>
          ))
        )}
      </div>
      <Button onClick={onAdd} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add New Resource
      </Button>
    </div>
  );
}

// Resource editor component
function ResourceEditor({ 
  resource, 
  onSave, 
  onUpdate, 
  onDelete, 
  isPending 
}: { 
  resource: Resource, 
  onSave: (resource: Resource) => void, 
  onUpdate: (field: keyof Resource, value: any) => void,
  onDelete: () => void,
  isPending: boolean 
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          value={resource.title} 
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Resource title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={resource.description} 
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Describe this resource"
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="link">Link (Optional)</Label>
        <Input 
          id="link"
          value={resource.link || ""} 
          onChange={(e) => onUpdate("link", e.target.value)}
          placeholder="https://example.com/resource"
        />
      </div>
      
      <div>
        <Label>Image</Label>
        <MediaSelector
          currentImageUrl={resource.imageUrl}
          onImageSelected={(url) => onUpdate("imageUrl", url)}
          businessId="progress_main"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isPublished"
          checked={resource.isPublished} 
          onCheckedChange={(checked) => onUpdate("isPublished", checked)}
        />
        <Label htmlFor="isPublished">Publish this resource</Label>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onDelete} 
          variant="outline" 
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        
        <Button 
          onClick={() => onSave(resource)} 
          disabled={!resource.title || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Resource
            </>
          )}
        </Button>
      </div>
    </div>
  );
}