import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { WebsiteUsageType, UserType, type SiteVariantConfig } from '@shared/site_variants';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteVariantSelectorProps {
  tenantId: string;
  onVariantSelected?: (variant: SiteVariantConfig) => void;
  onComplete?: () => void;
}

const SiteVariantSelector: React.FC<SiteVariantSelectorProps> = ({ 
  tenantId,
  onVariantSelected,
  onComplete
}) => {
  const [variants, setVariants] = useState<SiteVariantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<SiteVariantConfig | null>(null);
  const [websiteUsageType, setWebsiteUsageType] = useState<WebsiteUsageType>(WebsiteUsageType.FULL_BUILDER);
  const [userType, setUserType] = useState<UserType>(UserType.SOLO_ENTREPRENEUR);
  const [savingSelection, setSavingSelection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch available variants
    const fetchVariants = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/site-variants');
        const data = await response.json();
        setVariants(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching site variants:', error);
        toast({
          title: "Error",
          description: "Could not load site variants. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchVariants();
  }, [toast]);

  // Find the matching variant based on selected types
  useEffect(() => {
    const matchedVariant = variants.find(
      variant => variant.websiteUsageType === websiteUsageType && 
                variant.userType === userType
    );
    
    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      if (onVariantSelected) {
        onVariantSelected(matchedVariant);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [websiteUsageType, userType, variants, onVariantSelected]);

  const handleSaveSelection = async () => {
    if (!selectedVariant) return;
    
    try {
      setSavingSelection(true);
      
      const response = await apiRequest(
        'POST', 
        `/api/tenant/${tenantId}/site-variant`,
        { variantId: selectedVariant.id }
      );
      
      if (!response.ok) {
        throw new Error('Failed to save site variant selection');
      }
      
      toast({
        title: "Success",
        description: "Site variant configuration saved successfully.",
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving site variant:', error);
      toast({
        title: "Error",
        description: "Failed to save site variant selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSavingSelection(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading available configurations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Select Your Preferred Setup</h2>
        <p className="text-muted-foreground mt-1">
          Choose the configuration that best fits your business needs
        </p>
      </div>
      
      <Tabs defaultValue="websiteType" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="websiteType">Website Type</TabsTrigger>
          <TabsTrigger value="userType">User Type</TabsTrigger>
        </TabsList>
        
        <TabsContent value="websiteType" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:border-primary ${
                websiteUsageType === WebsiteUsageType.FULL_BUILDER 
                  ? 'border-2 border-primary' 
                  : ''
              }`}
              onClick={() => setWebsiteUsageType(WebsiteUsageType.FULL_BUILDER)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Full Website Builder
                  {websiteUsageType === WebsiteUsageType.FULL_BUILDER && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Complete website building capabilities with all features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Full page builder with drag-and-drop interface</li>
                  <li>Advanced website customization options</li>
                  <li>Access to all content creation tools</li>
                  <li>SEO optimization tools included</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all hover:border-primary ${
                websiteUsageType === WebsiteUsageType.TOOLS_ONLY 
                  ? 'border-2 border-primary' 
                  : ''
              }`}
              onClick={() => setWebsiteUsageType(WebsiteUsageType.TOOLS_ONLY)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Content Tools Only
                  {websiteUsageType === WebsiteUsageType.TOOLS_ONLY && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Focus on content creation without website building
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Advanced content generation tools</li>
                  <li>Blog post creation and management</li>
                  <li>Social media content generator</li>
                  <li>No website builder components</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="userType" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:border-primary ${
                userType === UserType.SOLO_ENTREPRENEUR 
                  ? 'border-2 border-primary' 
                  : ''
              }`}
              onClick={() => setUserType(UserType.SOLO_ENTREPRENEUR)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Solo Entrepreneur
                  {userType === UserType.SOLO_ENTREPRENEUR && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Optimized for individual business owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Streamlined interface for single-user efficiency</li>
                  <li>Business growth-focused tools and templates</li>
                  <li>Entrepreneur support resources</li>
                  <li>Simplified task management</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all hover:border-primary ${
                userType === UserType.TEAM 
                  ? 'border-2 border-primary' 
                  : ''
              }`}
              onClick={() => setUserType(UserType.TEAM)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Team
                  {userType === UserType.TEAM && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Enhanced with team collaboration features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Multi-user access and permission controls</li>
                  <li>Team collaboration tools and workflows</li>
                  <li>Task assignment and tracking</li>
                  <li>Team performance analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedVariant && (
        <div className="mt-8 border rounded-lg p-4 bg-muted/30">
          <div className="mb-4">
            <Label className="text-lg font-medium">Selected Configuration:</Label>
            <h3 className="text-xl font-bold mt-1">{selectedVariant.name}</h3>
            <p className="text-muted-foreground">{selectedVariant.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-medium mb-2">Enabled Features:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(selectedVariant.features)
                  .filter(([_, enabled]) => enabled)
                  .map(([feature]) => (
                    <li key={feature} className="text-green-600 dark:text-green-400">
                      {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Disabled Features:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(selectedVariant.features)
                  .filter(([_, enabled]) => !enabled)
                  .map(([feature]) => (
                    <li key={feature} className="text-muted-foreground">
                      {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSaveSelection} 
          disabled={!selectedVariant || savingSelection}
          className="min-w-[120px]"
        >
          {savingSelection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SiteVariantSelector;