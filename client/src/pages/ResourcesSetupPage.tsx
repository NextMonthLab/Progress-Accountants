import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '@/layouts/AdminLayout';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import MediaSelector from '@/components/MediaSelector';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { Plus, Save, FileText, Trash2, FileCheck, FileQuestion, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Resource schema
const resourceSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  fileUrl: z.string().url({ message: 'Please provide a valid file URL' }),
  imageUrl: z.string().url({ message: 'Please provide a valid image URL' }).optional(),
  isPublished: z.boolean().default(false),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

export default function ResourcesSetupPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  const [editingResource, setEditingResource] = useState<any>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Get project context
  const { data: projectContext } = useQuery({
    queryKey: ['/api/project-context'],
    onSuccess: (data: any) => {
      // Check if Resources page is completed
      const resourcesCompleted = data?.pageStatus?.resources === 'completed';
    }
  });

  // Get all resources
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['/api/resources'],
  });

  // Form setup
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      fileUrl: '',
      imageUrl: '',
      isPublished: false,
    },
  });

  // Mutations
  const createResource = useMutation({
    mutationFn: async (data: ResourceFormValues) => {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create resource');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Resource Created',
        description: 'Resource has been successfully created',
      });
      resetForm();
      setIsAddMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create resource: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const updateResource = useMutation({
    mutationFn: async (data: ResourceFormValues & { id: number }) => {
      const { id, ...resourceData } = data;
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update resource');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Resource Updated',
        description: 'Resource has been successfully updated',
      });
      resetForm();
      setEditingResource(null);
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update resource: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const deleteResource = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Resource Deleted',
        description: 'Resource has been successfully deleted',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete resource: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  const markPageComplete = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pages/resources/complete', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark page as complete');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Page Completed',
        description: 'Resources page has been marked as complete',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/project-context'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to mark page as complete: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Handle form submission
  const onSubmit = async (data: ResourceFormValues) => {
    if (editingResource) {
      updateResource.mutate({ ...data, id: editingResource.id });
    } else {
      createResource.mutate(data);
    }
  };

  // Load resource for editing
  useEffect(() => {
    if (editingResource) {
      form.reset({
        title: editingResource.title,
        description: editingResource.description,
        category: editingResource.category,
        fileUrl: editingResource.fileUrl,
        imageUrl: editingResource.imageUrl || '',
        isPublished: editingResource.isPublished,
      });
    }
  }, [editingResource, form]);

  // Reset form and editing state
  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      category: '',
      fileUrl: '',
      imageUrl: '',
      isPublished: false,
    });
    setEditingResource(null);
    setIsAddMode(false);
  };

  // Navigate to public page to view
  const viewPublicPage = () => {
    navigate('/resources');
  };

  // Handle edit resource
  const handleEditResource = (resource: any) => {
    setEditingResource(resource);
    setIsAddMode(true);
  };

  // Handle delete resource
  const handleDeleteResource = (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource.mutate(id);
    }
  };

  // Handle mark as complete
  const handleMarkAsComplete = () => {
    if (resources.length === 0) {
      toast({
        title: 'No Resources Added',
        description: 'Please add at least one resource before marking the page as complete.',
        variant: 'destructive',
      });
      return;
    }
    
    markPageComplete.mutate();
  };

  // Handle image selection
  const handleImageSelected = (url: string) => {
    form.setValue('imageUrl', url);
  };

  // Resource categories
  const resourceCategories = [
    { label: 'Tax Guide', value: 'tax-guide' },
    { label: 'Financial Template', value: 'financial-template' },
    { label: 'Accounting Tool', value: 'accounting-tool' },
    { label: 'Business Planning', value: 'business-planning' },
    { label: 'Reference', value: 'reference' },
  ];

  // Check if resources page is complete
  const isResourcesPageComplete = projectContext?.pageStatus?.resources === 'completed';

  return (
    <AdminLayout>
      <div className="container px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Resources Setup</h1>
            <p className="text-muted-foreground">
              Manage downloadable resources for your clients
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={viewPublicPage}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Button>
            <Button
              variant={isResourcesPageComplete ? "outline" : "default"}
              onClick={handleMarkAsComplete}
              disabled={resources.length === 0}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              {isResourcesPageComplete ? 'Page Completed' : 'Mark as Complete'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resource List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Manage your downloadable resources
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  setIsAddMode(true);
                  setEditingResource(null);
                  resetForm();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : resources.length > 0 ? (
                  <div className="space-y-4">
                    {resources.map((resource: any) => (
                      <Card key={resource.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          {resource.imageUrl && (
                            <div className="sm:w-48 h-32 overflow-hidden">
                              <img 
                                src={resource.imageUrl} 
                                alt={resource.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div>
                                <h3 className="font-medium text-lg">{resource.title}</h3>
                                <div className="flex items-center gap-2 my-1">
                                  <Badge variant="outline">{resource.category}</Badge>
                                  {resource.isPublished ? (
                                    <Badge variant="default" className="bg-green-600">Published</Badge>
                                  ) : (
                                    <Badge variant="secondary">Draft</Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                  {resource.description}
                                </p>
                              </div>
                              <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditResource(resource)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteResource(resource.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No resources yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first resource to get started
                    </p>
                    <Button onClick={() => setIsAddMode(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resource Form */}
          {isAddMode && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{editingResource ? 'Edit Resource' : 'Add Resource'}</CardTitle>
                  <CardDescription>
                    {editingResource 
                      ? 'Update resource details' 
                      : 'Create a new downloadable resource'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Tax Guide 2025" {...field} />
                            </FormControl>
                            <FormDescription>
                              Name of the resource
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {resourceCategories.map((category) => (
                                  <SelectItem 
                                    key={category.value} 
                                    value={category.value}
                                  >
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Type of resource
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="A comprehensive guide to tax planning for small businesses..." 
                                className="min-h-24" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description of the resource
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fileUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/file.pdf" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              URL to the downloadable file
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                              <MediaSelector
                                currentImageUrl={field.value}
                                onImageSelected={handleImageSelected}
                                businessId={tenant?.id || '0'}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional thumbnail image
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Published
                              </FormLabel>
                              <FormDescription>
                                Make this resource visible to clients
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          {editingResource ? 'Update' : 'Save'} Resource
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}