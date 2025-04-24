import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SotStatusIndicator } from '@/components/sot/SotStatusIndicator';
import { AlertCircle, CheckCircle, RefreshCw, Download, Upload, ArrowUpDown, FileCheck } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function SotManagementPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('declaration');
  const [syncLoading, setSyncLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);
  const [declarationName, setDeclarationName] = useState('');
  const [declarationDescription, setDeclarationDescription] = useState('');
  const [declarationVersion, setDeclarationVersion] = useState('1.0.0');
  
  // Blueprint extraction state
  const [extractionSettings, setExtractionSettings] = useState({
    includeBusinessIdentity: true,
    includeBrandGuidelines: true,
    includeModules: true,
    includeTools: true,
    tenantAgnostic: true,
    exportPages: true,
    exportLayouts: true,
  });

  const handleSyncWithSOT = async () => {
    setSyncLoading(true);
    try {
      const response = await fetch('/api/sot/sync', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      toast({
        title: 'Sync Successful',
        description: 'Successfully synchronized with SOT system',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync with SOT system',
        variant: 'destructive',
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const handleCreateDeclaration = async () => {
    try {
      if (!declarationName || !declarationDescription || !declarationVersion) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }
      
      const response = await fetch('/api/sot/declaration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: declarationName,
          description: declarationDescription,
          version: declarationVersion,
          primarySource: true,
          configuration: {
            syncFrequency: '24h',
            allowAutoUpdate: true,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create declaration');
      }
      
      toast({
        title: 'Declaration Created',
        description: 'SOT declaration created successfully',
        variant: 'default',
      });
      
      // Reset form
      setDeclarationName('');
      setDeclarationDescription('');
      setDeclarationVersion('1.0.0');
    } catch (error) {
      console.error('Error creating declaration:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create SOT declaration',
        variant: 'destructive',
      });
    }
  };

  const handleExtractBlueprint = async () => {
    setExtractLoading(true);
    try {
      // Call the SOT blueprint extraction API
      const response = await fetch('/api/sot/extract-blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: '00000000-0000-0000-0000-000000000000',
          version: '1.1.1',
          settings: extractionSettings,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Blueprint extraction failed');
      }
      
      const blueprint = await response.json();
      
      // Trigger download of the blueprint JSON
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `blueprint-v${blueprint.version || '1.1.1'}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      toast({
        title: 'Blueprint Extracted',
        description: 'Successfully extracted blueprint',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error extracting blueprint:', error);
      toast({
        title: 'Extraction Failed',
        description: error.message || 'Failed to extract blueprint',
        variant: 'destructive',
      });
    } finally {
      setExtractLoading(false);
    }
  };

  const toggleExtractionSetting = (key: keyof typeof extractionSettings) => {
    setExtractionSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const [validateLoading, setValidateLoading] = useState(false);
  
  const handleValidateBlueprint = async () => {
    setValidateLoading(true);
    try {
      // First, extract the blueprint
      const extractResponse = await fetch('/api/sot/extract-blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: '00000000-0000-0000-0000-000000000000',
          version: '1.1.1',
          settings: extractionSettings,
        }),
      });
      
      if (!extractResponse.ok) {
        const errorData = await extractResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Blueprint extraction failed');
      }
      
      const blueprint = await extractResponse.json();
      
      // Now validate the blueprint
      const validateResponse = await fetch('/api/sot/import-blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blueprint),
      });
      
      const validationResult = await validateResponse.json();
      
      if (validateResponse.ok) {
        toast({
          title: 'Blueprint Validation Successful',
          description: `Blueprint is valid with ${validationResult.modules_found?.length || 0} modules, ${validationResult.tools_count || 0} tools, and ${validationResult.pages_count || 0} pages.`,
          variant: 'default',
        });
      } else {
        throw new Error(validationResult.message || 'Blueprint validation failed');
      }
    } catch (error: any) {
      console.error('Error validating blueprint:', error);
      toast({
        title: 'Validation Failed',
        description: error.message || 'Failed to validate blueprint',
        variant: 'destructive',
      });
    } finally {
      setValidateLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Single Source of Truth Management</h1>
            <p className="text-muted-foreground">
              Manage your SOT declarations, synchronization, and blueprint extraction
            </p>
          </div>
          <SotStatusIndicator />
        </div>

        <Tabs defaultValue="declaration" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="declaration">SOT Declaration</TabsTrigger>
            <TabsTrigger value="sync">Synchronization</TabsTrigger>
            <TabsTrigger value="blueprint">Blueprint Extraction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="declaration">
            <Card>
              <CardHeader>
                <CardTitle>Create SOT Declaration</CardTitle>
                <CardDescription>
                  Define the primary source of truth for your client instance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="declaration-name">Declaration Name</Label>
                  <Input 
                    id="declaration-name"
                    placeholder="Enter a name for this SOT declaration"
                    value={declarationName}
                    onChange={(e) => setDeclarationName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declaration-description">Description</Label>
                  <Textarea 
                    id="declaration-description"
                    placeholder="Describe the purpose of this SOT declaration"
                    rows={3}
                    value={declarationDescription}
                    onChange={(e) => setDeclarationDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declaration-version">Version</Label>
                  <Input 
                    id="declaration-version"
                    placeholder="1.0.0"
                    value={declarationVersion}
                    onChange={(e) => setDeclarationVersion(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateDeclaration}>Create Declaration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>SOT Synchronization</CardTitle>
                <CardDescription>
                  Synchronize with the Single Source of Truth system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <ArrowUpDown className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Manual Synchronization</h3>
                      <p className="text-sm text-muted-foreground">
                        Trigger a manual sync with the SOT system to update metrics and check for updates
                      </p>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={handleSyncWithSOT} 
                      disabled={syncLoading}
                    >
                      {syncLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-500/10 p-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Automatic Synchronization</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatic synchronization is configured to run every 24 hours
                      </p>
                    </div>
                    <Button variant="outline" disabled>Configured</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-amber-500/10 p-3">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Sync Issues</h3>
                      <p className="text-sm text-muted-foreground">
                        View and resolve synchronization issues
                      </p>
                    </div>
                    <Button variant="outline">View Issues</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blueprint">
            <Card>
              <CardHeader>
                <CardTitle>Blueprint Extraction</CardTitle>
                <CardDescription>
                  Extract a transportable, tenant-agnostic blueprint from your client instance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Extraction Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="include-business-identity" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.includeBusinessIdentity}
                        onChange={() => toggleExtractionSetting('includeBusinessIdentity')}
                      />
                      <Label htmlFor="include-business-identity">Include Business Identity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="include-brand-guidelines" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.includeBrandGuidelines}
                        onChange={() => toggleExtractionSetting('includeBrandGuidelines')}
                      />
                      <Label htmlFor="include-brand-guidelines">Include Brand Guidelines</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="include-modules" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.includeModules}
                        onChange={() => toggleExtractionSetting('includeModules')}
                      />
                      <Label htmlFor="include-modules">Include Modules</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="include-tools" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.includeTools}
                        onChange={() => toggleExtractionSetting('includeTools')}
                      />
                      <Label htmlFor="include-tools">Include Tools</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="tenant-agnostic" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.tenantAgnostic}
                        onChange={() => toggleExtractionSetting('tenantAgnostic')}
                      />
                      <Label htmlFor="tenant-agnostic">Make Tenant-Agnostic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="export-pages" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.exportPages}
                        onChange={() => toggleExtractionSetting('exportPages')}
                      />
                      <Label htmlFor="export-pages">Export Pages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="export-layouts" 
                        className="h-4 w-4 rounded border-gray-300"
                        checked={extractionSettings.exportLayouts}
                        onChange={() => toggleExtractionSetting('exportLayouts')}
                      />
                      <Label htmlFor="export-layouts">Export Layouts</Label>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4 bg-secondary/20">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Blueprint Actions</h3>
                      <p className="text-sm text-muted-foreground">
                        Extract, validate, or import a blueprint based on the current settings
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleValidateBlueprint}
                        disabled={validateLoading || extractLoading}
                      >
                        {validateLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <FileCheck className="h-4 w-4 mr-2" />
                            Validate
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={handleExtractBlueprint}
                        disabled={extractLoading || validateLoading}
                      >
                        {extractLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Extract
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <Upload className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Upload to Vault</h3>
                      <p className="text-sm text-muted-foreground">
                        Send blueprint directly to the NextMonth Dev vault
                      </p>
                    </div>
                    <Button variant="outline">Upload</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}