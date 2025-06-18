import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, PaintBucket, Layout, Cpu, FileCode, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Types for design suggestions
interface DesignSuggestion {
  id: number;
  tenantId: string;
  pageType: string;
  businessType: string;
  components: any[];
  layouts: any[];
  colorPalettes: any[];
  seoRecommendations: any;
  createdAt: string;
  updatedAt: string;
}

interface AIDesignAssistantPanelProps {
  pageId?: number;
  pageType: string;
  tenantId: string;
  onApplySuggestion: (suggestion: any) => void;
  onApplyComponent: (component: any) => void;
  onApplyColorPalette: (palette: any) => void;
}

const AIDesignAssistantPanel: React.FC<AIDesignAssistantPanelProps> = ({
  pageId,
  pageType,
  tenantId,
  onApplySuggestion,
  onApplyComponent,
  onApplyColorPalette
}) => {
  const [activeTab, setActiveTab] = useState('layouts');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<DesignSuggestion | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<number>(0);
  const [selectedColorPalette, setSelectedColorPalette] = useState<number>(0);
  const [businessType, setBusinessType] = useState('accounting');
  
  const { toast } = useToast();

  // Fetch design suggestions based on page type and business type
  const fetchDesignSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `/api/ai-design/suggestions?pageType=${pageType}&businessType=${businessType}&tenantId=${tenantId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSuggestions(data.data);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch design suggestions',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching design suggestions:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while fetching design suggestions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize by fetching suggestions
  useEffect(() => {
    fetchDesignSuggestions();
  }, [pageType, businessType, tenantId]);

  // Handle applying a layout suggestion
  const handleApplyLayout = () => {
    if (!suggestions || !suggestions.layouts || suggestions.layouts.length === 0) {
      toast({
        title: 'No layouts available',
        description: 'There are no layout suggestions available to apply',
        variant: 'destructive',
      });
      return;
    }

    const layout = suggestions.layouts[selectedLayout];
    onApplySuggestion(layout);
    
    toast({
      title: 'Layout applied',
      description: 'The selected layout has been applied to your page',
      variant: 'default',
    });
  };

  // Handle applying a component suggestion
  const handleApplyComponent = () => {
    if (!suggestions || !suggestions.components || suggestions.components.length === 0) {
      toast({
        title: 'No components available',
        description: 'There are no component suggestions available to apply',
        variant: 'destructive',
      });
      return;
    }

    const component = suggestions.components[selectedComponent];
    onApplyComponent(component);
    
    toast({
      title: 'Component added',
      description: 'The selected component has been added to your page',
      variant: 'default',
    });
  };

  // Handle applying a color palette
  const handleApplyColorPalette = () => {
    if (!suggestions || !suggestions.colorPalettes || suggestions.colorPalettes.length === 0) {
      toast({
        title: 'No color palettes available',
        description: 'There are no color palette suggestions available to apply',
        variant: 'destructive',
      });
      return;
    }

    const palette = suggestions.colorPalettes[selectedColorPalette];
    onApplyColorPalette(palette);
    
    toast({
      title: 'Color palette applied',
      description: 'The selected color palette has been applied to your page',
      variant: 'default',
    });
  };

  // Regenerate suggestions
  const handleRegenerateSuggestions = () => {
    fetchDesignSuggestions();
    
    toast({
      title: 'Regenerating suggestions',
      description: 'Generating new AI-powered design suggestions...',
      variant: 'default',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Design Assistant
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            Powered by AI
          </Badge>
        </div>
        <CardDescription>
          Get AI-powered design suggestions for your page based on industry best practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageType">Page Type</Label>
              <Input id="pageType" value={pageType} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={businessType} onValueChange={(value) => setBusinessType(value)}>
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Generating AI design suggestions...</span>
            </div>
          ) : (
            <Tabs defaultValue="layouts" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="layouts" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Layouts
                </TabsTrigger>
                <TabsTrigger value="components" className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Components
                </TabsTrigger>
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <PaintBucket className="h-4 w-4" />
                  Colors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="layouts" className="py-4">
                {suggestions && suggestions.layouts && suggestions.layouts.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="layoutSelect">Select Layout Style</Label>
                      <Select 
                        value={selectedLayout.toString()} 
                        onValueChange={(value) => setSelectedLayout(parseInt(value))}
                      >
                        <SelectTrigger id="layoutSelect">
                          <SelectValue placeholder="Select layout style" />
                        </SelectTrigger>
                        <SelectContent>
                          {suggestions.layouts.map((layout, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {layout.name || `Layout Option ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedLayout !== null && suggestions.layouts[selectedLayout] && (
                      <div className="border rounded-md p-4 space-y-2">
                        <h4 className="font-medium">{suggestions.layouts[selectedLayout].name || `Layout Option ${selectedLayout + 1}`}</h4>
                        <p className="text-sm text-muted-foreground">
                          {suggestions.layouts[selectedLayout].description || 'No description available'}
                        </p>
                        {suggestions.layouts[selectedLayout].sections && (
                          <div className="pt-2">
                            <Label className="text-xs text-muted-foreground">Sections</Label>
                            <div className="grid grid-cols-1 gap-2 mt-1">
                              {suggestions.layouts[selectedLayout].sections.map((section: any, idx: number) => (
                                <div key={idx} className="text-xs bg-muted p-2 rounded">
                                  {section.name || `Section ${idx + 1}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button onClick={handleApplyLayout} className="w-full mt-2">
                          Apply Layout
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileCode className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No layout suggestions available</p>
                    <Button 
                      variant="outline" 
                      onClick={handleRegenerateSuggestions} 
                      className="mt-4"
                    >
                      Generate Suggestions
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="components" className="py-4">
                {suggestions && suggestions.components && suggestions.components.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="componentSelect">Select Component</Label>
                      <Select 
                        value={selectedComponent.toString()} 
                        onValueChange={(value) => setSelectedComponent(parseInt(value))}
                      >
                        <SelectTrigger id="componentSelect">
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                        <SelectContent>
                          {suggestions.components.map((component, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {component.name || `Component ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedComponent !== null && suggestions.components[selectedComponent] && (
                      <div className="border rounded-md p-4 space-y-2">
                        <h4 className="font-medium">{suggestions.components[selectedComponent].name || `Component ${selectedComponent + 1}`}</h4>
                        <p className="text-sm text-muted-foreground">
                          {suggestions.components[selectedComponent].description || 'No description available'}
                        </p>
                        {suggestions.components[selectedComponent].seoImpact && (
                          <div className="flex items-center gap-1 mt-1">
                            <Label className="text-xs text-muted-foreground">SEO Impact:</Label>
                            <Badge variant={
                              suggestions.components[selectedComponent].seoImpact === 'high' ? 'default' : 
                              suggestions.components[selectedComponent].seoImpact === 'medium' ? 'secondary' : 
                              'outline'
                            }>
                              {suggestions.components[selectedComponent].seoImpact}
                            </Badge>
                          </div>
                        )}
                        <Button onClick={handleApplyComponent} className="w-full mt-2">
                          Add Component
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Cpu className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No component suggestions available</p>
                    <Button 
                      variant="outline" 
                      onClick={handleRegenerateSuggestions} 
                      className="mt-4"
                    >
                      Generate Suggestions
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="colors" className="py-4">
                {suggestions && suggestions.colorPalettes && suggestions.colorPalettes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="colorPaletteSelect">Select Color Palette</Label>
                      <Select 
                        value={selectedColorPalette.toString()} 
                        onValueChange={(value) => setSelectedColorPalette(parseInt(value))}
                      >
                        <SelectTrigger id="colorPaletteSelect">
                          <SelectValue placeholder="Select color palette" />
                        </SelectTrigger>
                        <SelectContent>
                          {suggestions.colorPalettes.map((palette, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {palette.name || `Color Palette ${index + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedColorPalette !== null && suggestions.colorPalettes[selectedColorPalette] && (
                      <div className="border rounded-md p-4 space-y-4">
                        <h4 className="font-medium">{suggestions.colorPalettes[selectedColorPalette].name || `Color Palette ${selectedColorPalette + 1}`}</h4>
                        
                        <div className="grid grid-cols-5 gap-2">
                          {['primary', 'secondary', 'accent', 'text', 'background'].map((colorType, idx) => {
                            const colorValue = suggestions.colorPalettes[selectedColorPalette][`${colorType}Color`] || '#CCCCCC';
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div 
                                  className="w-10 h-10 rounded-full border mb-1" 
                                  style={{ backgroundColor: colorValue }}
                                  title={colorValue}
                                />
                                <span className="text-xs text-muted-foreground capitalize">{colorType}</span>
                              </div>
                            );
                          })}
                        </div>

                        <Button onClick={handleApplyColorPalette} className="w-full mt-2">
                          Apply Color Palette
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <PaintBucket className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No color palette suggestions available</p>
                    <Button 
                      variant="outline" 
                      onClick={handleRegenerateSuggestions} 
                      className="mt-4"
                    >
                      Generate Suggestions
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => setActiveTab('layouts')}>
          <Layout className="h-4 w-4 mr-2" />
          Layouts
        </Button>
        <Button variant="ghost" onClick={() => setActiveTab('components')}>
          <Cpu className="h-4 w-4 mr-2" />
          Components
        </Button>
        <Button variant="ghost" onClick={() => setActiveTab('colors')}>
          <PaintBucket className="h-4 w-4 mr-2" />
          Colors
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIDesignAssistantPanel;