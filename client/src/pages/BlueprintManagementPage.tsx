import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, FileUp, Copy, RefreshCw, CheckCircle, XCircle, AlertCircle, Info, Plus, Download, Upload, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface BlueprintTemplate {
  id: number;
  name: string;
  description: string | null;
  instanceId: string;
  blueprintVersion: string;
  isCloneable: boolean;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

interface CloneOperation {
  id: number;
  requestId: string;
  templateId: number;
  instanceName: string;
  adminEmail: string;
  status: string;
  newInstanceId: string | null;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  metadata: any;
}

interface BlueprintExport {
  id: number;
  instanceId: string;
  blueprintVersion: string;
  tenantId: string | null;
  exportedBy: string;
  exportedAt: string;
  isTenantAgnostic: boolean;
  blueprintData: any;
  validationStatus: string;
  validationDetails: string | null;
}

const createTemplateSchema = z.object({
  name: z.string().min(2, { message: "Template name must be at least 2 characters" }),
  description: z.string().optional(),
  isCloneable: z.boolean().default(true),
  blueprintVersion: z.string().default("1.0.0")
});

const cloneTemplateSchema = z.object({
  templateId: z.number(),
  instanceName: z.string().min(3, { message: "Instance name must be at least 3 characters" }),
  adminEmail: z.string().email({ message: "Please enter a valid email address" }),
  adminPassword: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export default function BlueprintManagementPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("templates");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BlueprintTemplate | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [extractionOptions, setExtractionOptions] = useState({
    makeTenantAgnostic: true
  });
  const [extractedData, setExtractedData] = useState<any>(null);
  
  // Query for templates
  const { 
    data: templates = [], 
    isLoading: templatesLoading, 
    error: templatesError 
  } = useQuery({
    queryKey: ['/api/blueprint/templates'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/blueprint/templates');
      return res.json();
    }
  });
  
  // Query for clone operations
  const { 
    data: cloneOperations = [],
    isLoading: cloneOperationsLoading 
  } = useQuery({
    queryKey: ['/api/blueprint/clone-operations'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/blueprint/clone-operations');
      return res.json();
    },
    enabled: activeTab === "operations"
  });

  // Create template form
  const createTemplateForm = useForm<z.infer<typeof createTemplateSchema>>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      isCloneable: true,
      blueprintVersion: "1.0.0"
    }
  });

  // Clone template form
  const cloneTemplateForm = useForm<z.infer<typeof cloneTemplateSchema>>({
    resolver: zodResolver(cloneTemplateSchema),
    defaultValues: {
      templateId: 0,
      instanceName: "",
      adminEmail: "",
      adminPassword: ""
    }
  });
  
  // Mutation for creating a new template
  const createTemplateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTemplateSchema>) => {
      const res = await apiRequest('POST', '/api/blueprint/templates', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/templates'] });
      setCreateDialogOpen(false);
      createTemplateForm.reset();
      toast({
        title: "Template Created",
        description: "The blueprint template was successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Template",
        description: error.message || "There was an error creating the template.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for cloning a template
  const cloneTemplateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof cloneTemplateSchema>) => {
      const res = await apiRequest('POST', '/api/blueprint/clone', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/clone-operations'] });
      setCloneDialogOpen(false);
      cloneTemplateForm.reset();
      toast({
        title: "Cloning Started",
        description: `Instance "${data.cloneOperation.instanceName}" is being created. Request ID: ${data.cloneOperation.requestId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Cloning Template",
        description: error.message || "There was an error cloning the template.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for extracting blueprint data
  const extractBlueprintMutation = useMutation({
    mutationFn: async ({ templateId, options }: { templateId: number, options: any }) => {
      const res = await apiRequest('POST', `/api/blueprint/extract/${templateId}`, options);
      return res.json();
    },
    onSuccess: (data) => {
      setExtractedData(data.blueprintData);
      toast({
        title: "Blueprint Extracted",
        description: "The blueprint data was successfully extracted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Extracting Blueprint",
        description: error.message || "There was an error extracting the blueprint data.",
        variant: "destructive"
      });
    }
  });
  
  // Handle template creation
  const onSubmitCreateTemplate = (data: z.infer<typeof createTemplateSchema>) => {
    createTemplateMutation.mutate(data);
  };
  
  // Handle template cloning
  const onSubmitCloneTemplate = (data: z.infer<typeof cloneTemplateSchema>) => {
    cloneTemplateMutation.mutate(data);
  };
  
  // Prepare for cloning a template
  const prepareCloneTemplate = (template: BlueprintTemplate) => {
    setSelectedTemplate(template);
    cloneTemplateForm.setValue("templateId", template.id);
    setCloneDialogOpen(true);
  };
  
  // Prepare for extracting blueprint data
  const prepareExtractBlueprint = (template: BlueprintTemplate) => {
    setSelectedTemplate(template);
    setExportDialogOpen(true);
  };
  
  // Handle extracting blueprint data
  const handleExtractBlueprint = () => {
    if (selectedTemplate) {
      extractBlueprintMutation.mutate({
        templateId: selectedTemplate.id,
        options: extractionOptions
      });
    }
  };
  
  // Download extracted data as JSON
  const downloadExtractedData = () => {
    if (extractedData) {
      const dataStr = JSON.stringify(extractedData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileName = `blueprint_${selectedTemplate?.name}_${new Date().toISOString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blueprint Management</h1>
          <p className="text-muted-foreground">Manage, extract, and clone templates for enterprise deployment</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Template
        </Button>
      </div>
      
      <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="operations">Clone Operations</TabsTrigger>
          <TabsTrigger value="exports">Blueprint Exports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          {templatesLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : templatesError ? (
            <div className="bg-destructive/10 p-4 rounded-md flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>Error loading templates. Please try again.</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Templates Available</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Create your first blueprint template to get started with the extraction and cloning process.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>Create Template</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template: BlueprintTemplate) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Version {template.blueprintVersion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description || "No description provided"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="mr-2">Instance ID:</span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{template.instanceId.slice(0, 8)}...</code>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span className="mr-2">Created:</span>
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span className="mr-2">Cloneable:</span>
                      <span>{template.isCloneable ? 'Yes' : 'No'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => prepareExtractBlueprint(template)}
                    >
                      <FileDown className="h-4 w-4" /> Extract
                    </Button>
                    {template.isCloneable && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => prepareCloneTemplate(template)}
                      >
                        <Copy className="h-4 w-4" /> Clone
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          {cloneOperationsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cloneOperations.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Clone Operations</h3>
              <p className="text-muted-foreground mt-2">
                When you clone a template, the operations will appear here for tracking.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Request ID</th>
                    <th className="p-3 text-left font-medium">Template</th>
                    <th className="p-3 text-left font-medium">New Instance</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Started</th>
                    <th className="p-3 text-left font-medium">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {cloneOperations.map((operation: CloneOperation) => (
                    <tr key={operation.id} className="border-t">
                      <td className="p-3 font-mono text-xs">
                        {operation.requestId.slice(0, 8)}...
                      </td>
                      <td className="p-3">
                        {operation.metadata?.originalTemplate || `Template #${operation.templateId}`}
                      </td>
                      <td className="p-3">{operation.instanceName}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            operation.status === 'completed' ? 'default' :
                            operation.status === 'in_progress' ? 'secondary' :
                            operation.status === 'failed' ? 'destructive' : 'outline'
                          }
                        >
                          {operation.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(operation.startedAt).toLocaleString()}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {operation.completedAt 
                          ? new Date(operation.completedAt).toLocaleString() 
                          : '—'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="exports" className="space-y-4">
          <div className="text-center p-8 border border-dashed rounded-lg">
            <FileDown className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Blueprint Exports</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Export records will be available here once you extract blueprint data from templates.
            </p>
            {templates.length > 0 && (
              <Button onClick={() => setActiveTab("templates")}>Go to Templates</Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Blueprint Template</DialogTitle>
            <DialogDescription>
              Create a new blueprint template that can be extracted or cloned.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createTemplateForm}>
            <form onSubmit={createTemplateForm.handleSubmit(onSubmitCreateTemplate)} className="space-y-4">
              <FormField
                control={createTemplateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createTemplateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of this template" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createTemplateForm.control}
                name="blueprintVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blueprint Version</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Semantic version (e.g., 1.0.0)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createTemplateForm.control}
                name="isCloneable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Available for Cloning</FormLabel>
                      <FormDescription>
                        Allow this template to be cloned to create new instances
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
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTemplateMutation.isPending}>
                  {createTemplateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Template
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Clone Template Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Clone Template</DialogTitle>
            <DialogDescription>
              Create a new instance from the template "{selectedTemplate?.name}".
            </DialogDescription>
          </DialogHeader>
          
          <Form {...cloneTemplateForm}>
            <form onSubmit={cloneTemplateForm.handleSubmit(onSubmitCloneTemplate)} className="space-y-4">
              <FormField
                control={cloneTemplateForm.control}
                name="instanceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Instance Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name for new instance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={cloneTemplateForm.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be the administrator account for the new instance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={cloneTemplateForm.control}
                name="adminPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Set a secure password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCloneDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={cloneTemplateMutation.isPending}>
                  {cloneTemplateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Start Cloning
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Extract Blueprint Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Extract Blueprint</DialogTitle>
            <DialogDescription>
              Extract blueprint data from the template "{selectedTemplate?.name}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tenant-agnostic"
                checked={extractionOptions.makeTenantAgnostic}
                onCheckedChange={(checked) => 
                  setExtractionOptions({...extractionOptions, makeTenantAgnostic: !!checked})
                }
              />
              <Label htmlFor="tenant-agnostic">Make tenant-agnostic</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, tenant-specific information will be sanitized from the extracted data.
            </p>
            
            {extractedData && (
              <div className="border rounded-md p-3 bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Extracted Data</h3>
                  <Button variant="ghost" size="sm" onClick={downloadExtractedData}>
                    <Download className="h-4 w-4 mr-1" /> Download JSON
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <pre className="text-xs">
                    {JSON.stringify(extractedData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExtractBlueprint}
              disabled={extractBlueprintMutation.isPending}
            >
              {extractBlueprintMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Extract Blueprint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}