import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandVersionList, BrandVersion } from "@/components/brand/BrandVersionList";
import { BrandEditorForm } from "@/components/brand/BrandEditorForm";
import { BrandPreviewPane } from "@/components/brand/BrandPreviewPane";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminLayout from "@/layouts/AdminLayout";

export default function BrandManagerPage() {
  const [activeTab, setActiveTab] = useState("versions");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<BrandVersion | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  const handleAddNew = () => {
    setSelectedVersion(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (version: BrandVersion) => {
    setSelectedVersion(version);
    setIsEditorOpen(true);
  };

  const handlePreview = (version: BrandVersion) => {
    setSelectedVersion(version);
    setIsPreviewOpen(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSaved = () => {
    toast({
      title: "Brand Version Saved",
      description: "Your brand version has been successfully saved",
    });
    handleRefresh();
  };

  return (
    <AdminLayout title="Brand Design Manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage your brand's visual identity with version control
          </p>
          <Button onClick={handleAddNew}>Create New Version</Button>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Version-Controlled Brand Management</AlertTitle>
          <AlertDescription>
            Each version you create is stored in the database and can be activated, previewed, or rolled back. 
            Changes can be synchronized with the Guardian system and NextMonth Vault for backup and deployment.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <CardTitle>Brand Versions</CardTitle>
                <CardDescription>
                  All versions of your brand design are listed here. The active version is applied site-wide.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BrandVersionList 
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onAddNew={handleAddNew}
                  onRefresh={handleRefresh}
                  key={refreshTrigger} // Force re-render on refresh
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>Brand Guidelines Documentation</CardTitle>
                <CardDescription>
                  Learn about version control for your brand identity and how to maintain consistent design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is Version Control?</h3>
                  <p className="text-muted-foreground">
                    Version control for your brand allows you to track changes to your visual identity over time. 
                    Each version represents a specific state of your brand's design elements, including colors, 
                    typography, and logo treatments.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Managing Brand Versions</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Create new versions</strong> when making significant changes to your brand identity
                    </li>
                    <li>
                      <strong>Preview versions</strong> to see how changes will appear across the site
                    </li>
                    <li>
                      <strong>Activate a version</strong> to apply those brand settings across the entire site
                    </li>
                    <li>
                      <strong>Sync with Vault</strong> to store your brand versions securely in the NextMonth Vault
                    </li>
                    <li>
                      <strong>Sync with Guardian</strong> to notify the Guardian system of your brand changes
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Use semantic versioning (e.g., v1.0.0, v1.1.0) to track major and minor changes
                    </li>
                    <li>
                      Include descriptive version names that identify the purpose of each version
                    </li>
                    <li>
                      Always preview changes before activating a new version
                    </li>
                    <li>
                      Regularly sync important versions with the Vault for safekeeping
                    </li>
                    <li>
                      Document the reasoning behind significant brand changes
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rebuild Design Tokens
                  </Button>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Export Current Version
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isEditorOpen && (
          <BrandEditorForm 
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            version={selectedVersion}
            onSaved={handleSaved}
          />
        )}

        {isPreviewOpen && selectedVersion && (
          <BrandPreviewPane
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            version={selectedVersion}
          />
        )}
      </div>
    </AdminLayout>
  );
}