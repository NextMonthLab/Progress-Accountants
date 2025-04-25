import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Download, Upload, Copy } from 'lucide-react';

const BlueprintManagementPage = () => {
  const { toast } = useToast();
  const [instanceName, setInstanceName] = useState('');
  const [description, setDescription] = useState('');
  const [isCloneable, setIsCloneable] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  
  interface Template {
    id: number;
    instanceId: string;
    blueprintVersion: string;
    status: string;
    isCloneable: boolean;
    lastSyncAt: string;
  }
  
  // Get available templates
  const {
    data: templates = [],
    isLoading: isLoadingTemplates,
    isError: isTemplatesError,
    error: templatesError,
  } = useQuery<Template[]>({
    queryKey: ['/api/blueprint/templates'],
    enabled: activeTab === 'templates',
  });
  
  // Register as template mutation
  const registerTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/blueprint/template/register', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Template registered successfully',
        description: 'The instance has been registered as a template and can now be cloned.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/templates'] });
      setInstanceName('');
      setDescription('');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Failed to register as template',
        variant: 'destructive',
      });
    },
  });
  
  // Extract blueprint mutation
  const extractBlueprintMutation = useMutation({
    mutationFn: async (makeTenantAgnostic: boolean) => {
      const res = await apiRequest('POST', '/api/blueprint/extract', { makeTenantAgnostic });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Blueprint extracted',
        description: 'The blueprint has been extracted successfully.',
      });
      
      // Create and download a JSON file
      const blob = new Blob([JSON.stringify(data.blueprint, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blueprint-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      toast({
        title: 'Extraction failed',
        description: error.message || 'Failed to extract blueprint',
        variant: 'destructive',
      });
    },
  });
  
  // Toggle template status mutation
  const toggleTemplateMutation = useMutation({
    mutationFn: async ({ id, isCloneable }: { id: number; isCloneable: boolean }) => {
      const res = await apiRequest('PUT', `/api/blueprint/template/toggle/${id}`, { isCloneable });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Template updated',
        description: 'Template status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blueprint/templates'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update template status',
        variant: 'destructive',
      });
    },
  });
  
  const handleRegisterTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instanceName) {
      toast({
        title: 'Missing information',
        description: 'Instance name is required',
        variant: 'destructive',
      });
      return;
    }
    
    registerTemplateMutation.mutate({
      instanceName,
      description,
      isCloneable,
    });
  };
  
  const handleToggleTemplate = (id: number, currentStatus: boolean) => {
    toggleTemplateMutation.mutate({
      id,
      isCloneable: !currentStatus,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6 p-6 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Blueprint Management</h2>
          <p className="text-muted-foreground">
            Create and manage templates for cloning, and extract blueprint data for use in other instances.
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="templates" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="templates">Template Management</TabsTrigger>
            <TabsTrigger value="extract">Blueprint Extraction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register as Template</CardTitle>
                <CardDescription>
                  Register this instance as a template that can be cloned to create new instances.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterTemplate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instanceName">Template Name</Label>
                    <Input
                      id="instanceName"
                      placeholder="Progress Accountants Base Template"
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Base template for Progress Accountants clients"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCloneable"
                      checked={isCloneable}
                      onCheckedChange={(checked) => setIsCloneable(!!checked)}
                    />
                    <Label htmlFor="isCloneable">Available for cloning</Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleRegisterTemplate}
                  disabled={registerTemplateMutation.isPending}
                >
                  {registerTemplateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register as Template'
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Templates</CardTitle>
                <CardDescription>
                  Templates that can be used to create new instances.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTemplates ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : isTemplatesError ? (
                  <div className="text-center py-8 text-destructive">
                    Error loading templates: {templatesError instanceof Error ? templatesError.message : 'Unknown error'}
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No templates available. Register this instance as a template to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Instance ID</TableHead>
                        <TableHead>Blueprint Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cloneable</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>{template.id}</TableCell>
                          <TableCell className="font-mono text-xs">{template.instanceId.substring(0, 8)}...</TableCell>
                          <TableCell>{template.blueprintVersion}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={template.status === 'active' ? 'default' : 'secondary'}
                            >
                              {template.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {template.isCloneable ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>{formatDate(template.lastSyncAt)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleTemplate(template.id, template.isCloneable)}
                              disabled={toggleTemplateMutation.isPending}
                            >
                              {template.isCloneable ? 'Disable' : 'Enable'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="extract" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Extract Blueprint</CardTitle>
                <CardDescription>
                  Extract the current state of this instance as a blueprint that can be used for cloning or analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tenantAgnostic"
                      defaultChecked={true}
                      disabled={extractBlueprintMutation.isPending}
                    />
                    <Label htmlFor="tenantAgnostic">Make tenant-agnostic (sanitize tenant-specific data)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, tenant-specific information will be sanitized from the extracted blueprint.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => extractBlueprintMutation.mutate(false)}
                  disabled={extractBlueprintMutation.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {extractBlueprintMutation.isPending ? 'Extracting...' : 'Extract with Tenant Data'}
                </Button>
                
                <Button
                  onClick={() => extractBlueprintMutation.mutate(true)}
                  disabled={extractBlueprintMutation.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {extractBlueprintMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    'Extract Sanitized Blueprint'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BlueprintManagementPage;