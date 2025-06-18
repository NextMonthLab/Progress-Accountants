import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Input,
  Skeleton,
  Switch,
  Textarea
} from "@/components/ui";
import { 
  AlertCircle,
  ChevronRight,
  Globe2,
  Package,
  PlusCircle,
  RefreshCw,
  Send,
  Settings,
  FileCode,
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Tool types available
const toolTypes = [
  { value: "form", label: "Form" },
  { value: "calculator", label: "Calculator" },
  { value: "dashboard", label: "Dashboard" },
  { value: "embed", label: "Embed" },
  { value: "widget", label: "Widget" },
];

// Tool categories
const toolCategories = [
  { value: "CRM", label: "CRM" },
  { value: "Analytics", label: "Analytics" },
  { value: "SEO", label: "SEO" },
  { value: "Marketing", label: "Marketing" },
  { value: "Finance", label: "Finance" },
  { value: "Productivity", label: "Productivity" },
  { value: "Communication", label: "Communication" },
  { value: "Utility", label: "Utility" },
];

// Display styles
const displayStyles = [
  { value: "modal", label: "Modal" },
  { value: "card", label: "Card" },
  { value: "full-page", label: "Full Page" },
  { value: "sidebar", label: "Sidebar" },
  { value: "inline", label: "Inline" },
];

// Status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "published":
      return "bg-green-100 text-green-800";
    case "archived":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Publish status badge color
const getPublishStatusColor = (status: string) => {
  switch (status) {
    case "unpublished":
      return "bg-gray-100 text-gray-800";
    case "draft_for_marketplace":
      return "bg-yellow-100 text-yellow-800";
    case "published_in_marketplace":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Tool form validation schema
const toolSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  toolType: z.string().min(1, "Tool type is required"),
  displayStyle: z.string().optional(),
  isGlobal: z.boolean().default(false),
  mediaUrl: z.string().optional(),
  configuration: z.any().optional(),
});

// Tool submission validation schema
const toolSubmissionSchema = z.object({
  toolId: z.number(),
  toolVersion: z.string().regex(/^v\d+\.\d+\.\d+$/, "Version must follow semantic format (e.g., v1.0.0)"),
  toolCategory: z.string().min(1, "Category is required"),
});

// New tool form component
function NewToolForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<z.infer<typeof toolSchema>>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      description: "",
      toolType: "",
      displayStyle: "modal",
      isGlobal: false,
      mediaUrl: "",
      configuration: {},
    },
  });
  
  // Create tool mutation
  const createToolMutation = useMutation({
    mutationFn: async (data: z.infer<typeof toolSchema>) => {
      const response = await apiRequest("POST", "/api/tools", {
        ...data,
        tenantId: tenant?.id,
        createdBy: user?.id,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create tool");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh tool list
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      
      // Show success message
      toast({
        title: "Tool created",
        description: "Your tool has been created successfully",
        variant: "default",
      });
      
      // Close the dialog
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create tool",
        description: error.message || "An error occurred while creating the tool",
        variant: "destructive",
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof toolSchema>) => {
    createToolMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter a name for your tool" {...field} />
              </FormControl>
              <FormDescription>
                A clear, descriptive name for your tool
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
                  placeholder="Describe what your tool does and how it helps users" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                A detailed description of the tool's purpose and functionality
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="toolType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tool type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {toolTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of functionality this tool provides
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="displayStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a display style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {displayStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How the tool will be presented to users
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isGlobal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Global Availability</FormLabel>
                <FormDescription>
                  Make this tool available across all tenants
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
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={createToolMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createToolMutation.isPending}
          >
            {createToolMutation.isPending ? 
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Creating...
              </> : 
              "Create Tool"
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Tool submission form component
function SubmitToMarketplaceForm({ 
  tool, 
  onClose 
}: { 
  tool: any;
  onClose: () => void; 
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<z.infer<typeof toolSubmissionSchema>>({
    resolver: zodResolver(toolSubmissionSchema),
    defaultValues: {
      toolId: tool.id,
      toolVersion: tool.toolVersion || "v1.0.0",
      toolCategory: tool.toolCategory || "",
    },
  });
  
  // Submit to marketplace mutation
  const submitToolMutation = useMutation({
    mutationFn: async (data: z.infer<typeof toolSubmissionSchema>) => {
      const response = await apiRequest("POST", "/api/tools/marketplace/submit", data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit tool to marketplace");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh tool list
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      
      // Show success message
      toast({
        title: "Tool submitted",
        description: "Your tool has been submitted to the marketplace",
        variant: "default",
      });
      
      // Close the dialog
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.message || "An error occurred while submitting the tool",
        variant: "destructive",
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof toolSubmissionSchema>) => {
    submitToolMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Submitting to the marketplace will make this tool available for review by the NextMonth Dev team.
            Once published, all tenants will be able to install this tool.
          </AlertDescription>
        </Alert>
        
        <input type="hidden" {...form.register("toolId")} />
        
        <FormField
          control={form.control}
          name="toolVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Version</FormLabel>
              <FormControl>
                <Input placeholder="e.g., v1.0.0" {...field} />
              </FormControl>
              <FormDescription>
                Semantic version number (e.g., v1.0.0)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="toolCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {toolCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The category this tool belongs to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={submitToolMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitToolMutation.isPending}
          >
            {submitToolMutation.isPending ? 
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Submitting...
              </> : 
              <>
                <Send className="h-4 w-4 mr-2" /> Submit to Marketplace
              </>
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Tool publish action component (for Dev instance)
function PublishToolAction({ 
  tool,
  onRefresh 
}: { 
  tool: any;
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      const response = await apiRequest(
        "POST", 
        `/api/tools/marketplace/publish/${tool.id}`,
        {}
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish tool");
      }
      
      // Show success message
      toast({
        title: "Tool published",
        description: "Tool has been published to the marketplace",
        variant: "default",
      });
      
      // Refresh tool list
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Publication failed",
        description: error.message || "An error occurred while publishing the tool",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <Button 
      size="sm" 
      onClick={handlePublish}
      disabled={isPublishing || tool.publishStatus !== "draft_for_marketplace"}
    >
      {isPublishing ? 
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Publishing...
        </> : 
        <>
          <Globe2 className="h-4 w-4 mr-2" /> Publish
        </>
      }
    </Button>
  );
}

export default function ToolManagementPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [isNewToolDialogOpen, setIsNewToolDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  
  // Determine if this is Lab instance, Dev instance, or client instance
  // For this demo, we'll assume user with isSuperAdmin is on Dev instance
  // and other users are on their respective instances
  const instanceType = user?.isSuperAdmin ? "dev" : (tenant?.isTemplate ? "lab" : "client");
  
  // Fetch tools for current tenant
  const { 
    data: tools, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['/api/tools'],
    enabled: !!user,
  });
  
  // Handle submit to marketplace
  const handleSubmitToMarketplace = (tool: any) => {
    setSelectedTool(tool);
    setIsSubmitDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Tool Management | Progress</title>
      </Helmet>
      
      <div className="container px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-gray-700">Admin</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Tool Management</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tool Management</h1>
              <p className="text-muted-foreground mt-2">
                Create, manage, and publish tools for your business
              </p>
            </div>
            <Button onClick={() => setIsNewToolDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" /> New Tool
            </Button>
          </div>
        </div>
        
        {instanceType === "lab" && (
          <Alert className="mb-6">
            <Settings className="h-4 w-4" />
            <AlertTitle>Lab Instance</AlertTitle>
            <AlertDescription>
              You are on the Lab instance. You can create tools and submit them to the marketplace for review.
            </AlertDescription>
          </Alert>
        )}
        
        {instanceType === "dev" && (
          <Alert className="mb-6" variant="default">
            <FileCode className="h-4 w-4" />
            <AlertTitle>Dev Instance</AlertTitle>
            <AlertDescription>
              You are on the Dev instance. You can review and publish tools to the marketplace.
            </AlertDescription>
          </Alert>
        )}
        
        {instanceType === "client" && (
          <Alert className="mb-6">
            <Layers className="h-4 w-4" />
            <AlertTitle>Client Instance</AlertTitle>
            <AlertDescription>
              You are on a client instance. You can create local tools or install tools from the marketplace.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load tools. Please try again.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="rounded-md border">
                <div className="p-4">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ) : !tools?.length ? (
              <div className="rounded-md border p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No tools found</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any tools yet
                </p>
                <Button onClick={() => setIsNewToolDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Create Your First Tool
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marketplace Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools.map((tool: any) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">
                          <div>
                            {tool.name}
                            {tool.isGlobal && (
                              <Badge variant="outline" className="ml-2 bg-blue-50">Global</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {tool.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {tool.toolType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tool.status)}>
                            {tool.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPublishStatusColor(tool.publishStatus)}>
                            {tool.publishStatus}
                          </Badge>
                          {tool.toolVersion && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {tool.toolVersion}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {instanceType === "lab" && tool.status === "published" && 
                             tool.publishStatus === "unpublished" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleSubmitToMarketplace(tool)}
                              >
                                <Send className="h-4 w-4 mr-2" /> Submit
                              </Button>
                            )}
                            
                            {instanceType === "dev" && 
                             tool.publishStatus === "draft_for_marketplace" && (
                              <PublishToolAction tool={tool} onRefresh={refetch} />
                            )}
                            
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-2" /> Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="drafts">
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load tools. Please try again.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="rounded-md border">
                <div className="p-4">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-10 w-full mb-4" />
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools?.filter((t: any) => t.status === "draft").length ? (
                      tools
                        .filter((t: any) => t.status === "draft")
                        .map((tool: any) => (
                          <TableRow key={tool.id}>
                            <TableCell className="font-medium">
                              <div>{tool.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {tool.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {tool.toolType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4 mr-2" /> Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No draft tools found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="published">
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load tools. Please try again.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="rounded-md border">
                <div className="p-4">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-10 w-full mb-4" />
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Marketplace Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools?.filter((t: any) => t.status === "published").length ? (
                      tools
                        .filter((t: any) => t.status === "published")
                        .map((tool: any) => (
                          <TableRow key={tool.id}>
                            <TableCell className="font-medium">
                              <div>{tool.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {tool.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {tool.toolType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPublishStatusColor(tool.publishStatus)}>
                                {tool.publishStatus}
                              </Badge>
                              {tool.toolVersion && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {tool.toolVersion}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {instanceType === "lab" && 
                                tool.publishStatus === "unpublished" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleSubmitToMarketplace(tool)}
                                  >
                                    <Send className="h-4 w-4 mr-2" /> Submit
                                  </Button>
                                )}
                                
                                <Button size="sm" variant="outline">
                                  <Settings className="h-4 w-4 mr-2" /> Edit
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No published tools found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="marketplace">
            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load tools. Please try again.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="rounded-md border">
                <div className="p-4">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-10 w-full mb-4" />
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tools?.filter((t: any) => 
                      t.publishStatus === "draft_for_marketplace" || 
                      t.publishStatus === "published_in_marketplace"
                    ).length ? (
                      tools
                        .filter((t: any) => 
                          t.publishStatus === "draft_for_marketplace" || 
                          t.publishStatus === "published_in_marketplace"
                        )
                        .map((tool: any) => (
                          <TableRow key={tool.id}>
                            <TableCell className="font-medium">
                              <div>{tool.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {tool.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {tool.toolType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {tool.toolCategory ? (
                                <Badge variant="outline">
                                  {tool.toolCategory}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">None</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {tool.publishStatus === "draft_for_marketplace" ? (
                                  <>
                                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      Pending Review
                                    </Badge>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                    <Badge className="bg-green-100 text-green-800">
                                      Published
                                    </Badge>
                                  </>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {tool.toolVersion || "No version"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {instanceType === "dev" && 
                                 tool.publishStatus === "draft_for_marketplace" && (
                                  <PublishToolAction tool={tool} onRefresh={refetch} />
                                )}
                                
                                <Button size="sm" variant="outline">
                                  <Settings className="h-4 w-4 mr-2" /> View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No marketplace submissions found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Tool Dialog */}
      <Dialog open={isNewToolDialogOpen} onOpenChange={setIsNewToolDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Tool</DialogTitle>
            <DialogDescription>
              Enter the details for your new tool. You can configure and publish it after creation.
            </DialogDescription>
          </DialogHeader>
          <NewToolForm onClose={() => setIsNewToolDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Submit to Marketplace Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit to Marketplace</DialogTitle>
            <DialogDescription>
              Submit this tool to the marketplace for review and publication.
            </DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <SubmitToMarketplaceForm 
              tool={selectedTool} 
              onClose={() => setIsSubmitDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}