import { useState, useEffect } from "react";
import { useTenant } from "@/hooks/use-tenant";
import { useAuth } from "@/components/ClientDataProvider";
import { TenantCustomization } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function TenantCustomizationPage() {
  const { customization, isLoading, updateCustomizationMutation } = useTenant();
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  
  const [localCustomization, setLocalCustomization] = useState<TenantCustomization | null>(null);
  const [activeTab, setActiveTab] = useState("ui-labels");
  
  // Initialize local state with the fetched customization when it arrives
  useEffect(() => {
    if (customization && !localCustomization) {
      setLocalCustomization(customization);
    }
  }, [customization, localCustomization]);
  
  // Handle input changes for UI labels
  const handleLabelChange = (fieldName: string, value: string) => {
    if (!localCustomization) return;
    
    setLocalCustomization({
      ...localCustomization,
      uiLabels: {
        ...localCustomization.uiLabels,
        [fieldName]: value
      }
    });
  };
  
  // Handle changes to tone settings
  const handleToneChange = (fieldName: 'formality' | 'personality', value: string) => {
    if (!localCustomization) return;
    
    setLocalCustomization({
      ...localCustomization,
      tone: {
        ...localCustomization.tone,
        [fieldName]: value as any
      }
    });
  };
  
  // Handle toggle for feature flags
  const handleFeatureFlagToggle = (fieldName: string, checked: boolean) => {
    if (!localCustomization) return;
    
    setLocalCustomization({
      ...localCustomization,
      featureFlags: {
        ...localCustomization.featureFlags,
        [fieldName]: checked
      }
    });
  };
  
  // Handle toggle for section visibility
  const handleSectionToggle = (fieldName: string, checked: boolean) => {
    if (!localCustomization) return;
    
    setLocalCustomization({
      ...localCustomization,
      sectionsEnabled: {
        ...localCustomization.sectionsEnabled,
        [fieldName]: checked
      }
    });
  };
  
  // Save all customization changes
  const handleSaveChanges = () => {
    if (!tenantId || !localCustomization) return;
    
    updateCustomizationMutation.mutate({
      tenantId,
      customization: localCustomization
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!localCustomization) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Tenant Customization</CardTitle>
          <CardDescription>
            No customization settings found for this tenant. Click below to initialize default settings.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={() => {
              const defaultCustomization: TenantCustomization = {
                uiLabels: {
                  siteName: "Business Manager",
                  dashboardTitle: "Dashboard",
                  toolsLabel: "Tools",
                  pagesLabel: "Pages",
                  marketplaceLabel: "Marketplace",
                  accountLabel: "Account",
                  settingsLabel: "Settings"
                },
                tone: {
                  formality: "neutral",
                  personality: "professional"
                },
                featureFlags: {
                  enablePodcastTools: false,
                  enableFinancialReporting: true,
                  enableClientPortal: true,
                  enableMarketplaceAccess: true,
                  enableCustomPages: true
                },
                sectionsEnabled: {
                  servicesShowcase: true,
                  teamMembers: true,
                  testimonialsSlider: true,
                  blogPosts: true,
                  eventCalendar: false,
                  resourceCenter: false
                }
              };
              
              setLocalCustomization(defaultCustomization);
            }}
          >
            Initialize Settings
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tenant Customization</h1>
      <p className="text-gray-500 mb-8">
        Customize the appearance, features, and behavior for this tenant.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="ui-labels">UI Labels</TabsTrigger>
          <TabsTrigger value="tone">Communication Tone</TabsTrigger>
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>
        
        {/* UI Labels Tab */}
        <TabsContent value="ui-labels">
          <Card>
            <CardHeader>
              <CardTitle>User Interface Labels</CardTitle>
              <CardDescription>
                Customize the labels and titles displayed throughout the application.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={localCustomization.uiLabels?.siteName || ""}
                    onChange={(e) => handleLabelChange("siteName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dashboardTitle">Dashboard Title</Label>
                  <Input
                    id="dashboardTitle"
                    value={localCustomization.uiLabels?.dashboardTitle || ""}
                    onChange={(e) => handleLabelChange("dashboardTitle", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="toolsLabel">Tools Label</Label>
                  <Input
                    id="toolsLabel"
                    value={localCustomization.uiLabels?.toolsLabel || ""}
                    onChange={(e) => handleLabelChange("toolsLabel", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pagesLabel">Pages Label</Label>
                  <Input
                    id="pagesLabel"
                    value={localCustomization.uiLabels?.pagesLabel || ""}
                    onChange={(e) => handleLabelChange("pagesLabel", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marketplaceLabel">Marketplace Label</Label>
                  <Input
                    id="marketplaceLabel"
                    value={localCustomization.uiLabels?.marketplaceLabel || ""}
                    onChange={(e) => handleLabelChange("marketplaceLabel", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountLabel">Account Label</Label>
                  <Input
                    id="accountLabel"
                    value={localCustomization.uiLabels?.accountLabel || ""}
                    onChange={(e) => handleLabelChange("accountLabel", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settingsLabel">Settings Label</Label>
                  <Input
                    id="settingsLabel"
                    value={localCustomization.uiLabels?.settingsLabel || ""}
                    onChange={(e) => handleLabelChange("settingsLabel", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Communication Tone Tab */}
        <TabsContent value="tone">
          <Card>
            <CardHeader>
              <CardTitle>Communication Tone</CardTitle>
              <CardDescription>
                Define the tone and personality of communications with users.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="formality">Formality Level</Label>
                  <Select 
                    value={localCustomization.tone?.formality || "neutral"}
                    onValueChange={(value) => handleToneChange("formality", value)}
                  >
                    <SelectTrigger id="formality">
                      <SelectValue placeholder="Select formality level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Defines how formal or casual the system language should be.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personality">Personality Type</Label>
                  <Select 
                    value={localCustomization.tone?.personality || "professional"}
                    onValueChange={(value) => handleToneChange("personality", value)}
                  >
                    <SelectTrigger id="personality">
                      <SelectValue placeholder="Select personality type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Defines the overall personality of system communications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feature Flags Tab */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable specific features for this tenant.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Podcast Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable podcast recording, editing, and publishing tools
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.featureFlags?.enablePodcastTools || false}
                    onCheckedChange={(checked) => handleFeatureFlagToggle("enablePodcastTools", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Financial Reporting</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable financial dashboards and reporting features
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.featureFlags?.enableFinancialReporting || false}
                    onCheckedChange={(checked) => handleFeatureFlagToggle("enableFinancialReporting", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Client Portal</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable client portal access for document sharing and collaboration
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.featureFlags?.enableClientPortal || false}
                    onCheckedChange={(checked) => handleFeatureFlagToggle("enableClientPortal", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketplace Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow access to the tools and modules marketplace
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.featureFlags?.enableMarketplaceAccess || false}
                    onCheckedChange={(checked) => handleFeatureFlagToggle("enableMarketplaceAccess", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Custom Pages</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow creation of custom pages beyond pre-built templates
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.featureFlags?.enableCustomPages || false}
                    onCheckedChange={(checked) => handleFeatureFlagToggle("enableCustomPages", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sections Tab */}
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Page Sections</CardTitle>
              <CardDescription>
                Configure which sections are enabled for this tenant's public pages.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Services Showcase</h3>
                    <p className="text-sm text-muted-foreground">
                      Section highlighting services offered
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.sectionsEnabled?.servicesShowcase || false}
                    onCheckedChange={(checked) => handleSectionToggle("servicesShowcase", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Team Members</h3>
                    <p className="text-sm text-muted-foreground">
                      Section showcasing team members and their expertise
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.sectionsEnabled?.teamMembers || false}
                    onCheckedChange={(checked) => handleSectionToggle("teamMembers", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Testimonials Slider</h3>
                    <p className="text-sm text-muted-foreground">
                      Customer testimonials carousel section
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.sectionsEnabled?.testimonialsSlider || false}
                    onCheckedChange={(checked) => handleSectionToggle("testimonialsSlider", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Blog Posts</h3>
                    <p className="text-sm text-muted-foreground">
                      Recent blog posts and articles section
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.sectionsEnabled?.blogPosts || false}
                    onCheckedChange={(checked) => handleSectionToggle("blogPosts", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Event Calendar</h3>
                    <p className="text-sm text-muted-foreground">
                      Upcoming events and webinars section
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.sectionsEnabled?.eventCalendar || false}
                    onCheckedChange={(checked) => handleSectionToggle("eventCalendar", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Resource Center</h3>
                    <p className="text-sm text-muted-foreground">
                      Downloadable resources and guides section
                    </p>
                  </div>
                  <Switch
                    checked={localCustomization.sectionsEnabled?.resourceCenter || false}
                    onCheckedChange={(checked) => handleSectionToggle("resourceCenter", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-8">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => setLocalCustomization(customization)}
        >
          Reset Changes
        </Button>
        
        <Button 
          onClick={handleSaveChanges}
          disabled={updateCustomizationMutation.isPending}
        >
          {updateCustomizationMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}