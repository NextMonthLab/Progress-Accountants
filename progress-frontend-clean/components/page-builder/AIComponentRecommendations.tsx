import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Cpu, FileCode, Lightbulb, PlusCircle, Code, ScanLine, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ComponentRecommendation {
  id: number;
  pageId: number;
  sectionId: number | null;
  context: string;
  recommendations: any[];
  reasoning: string | null;
  used: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AIComponentRecommendationsProps {
  pageId: number;
  onAddComponent: (component: any) => void;
}

const AIComponentRecommendations: React.FC<AIComponentRecommendationsProps> = ({
  pageId,
  onAddComponent
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<ComponentRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [context, setContext] = useState('hero');
  
  const { toast } = useToast();

  // Fetch component recommendations for the page
  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `/api/ai-design/components/page/${pageId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setRecommendations(data.data);
        if (data.data.length > 0) {
          setSelectedRecommendation(0);
          if (data.data[0].recommendations && data.data[0].recommendations.length > 0) {
            setSelectedComponent(0);
          }
        }
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch component recommendations',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching component recommendations:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while fetching recommendations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new component recommendations
  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/ai-design/components/recommend', {
        pageId,
        context
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setRecommendations(prev => [data.data, ...prev]);
        setSelectedRecommendation(0);
        if (data.data.recommendations && data.data.recommendations.length > 0) {
          setSelectedComponent(0);
        }
        toast({
          title: 'Recommendations generated',
          description: 'New component recommendations have been generated',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to generate recommendations',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while generating recommendations',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize by fetching recommendations
  useEffect(() => {
    fetchRecommendations();
  }, [pageId]);

  // Add the selected component
  const handleAddComponent = () => {
    if (
      selectedRecommendation === null || 
      !recommendations[selectedRecommendation] ||
      selectedComponent === null ||
      !recommendations[selectedRecommendation].recommendations ||
      !recommendations[selectedRecommendation].recommendations[selectedComponent]
    ) {
      toast({
        title: 'No component selected',
        description: 'Please select a component to add',
        variant: 'destructive',
      });
      return;
    }

    const component = recommendations[selectedRecommendation].recommendations[selectedComponent];
    onAddComponent(component);
    
    // Mark recommendation as used
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[selectedRecommendation].used = true;
    setRecommendations(updatedRecommendations);
    
    toast({
      title: 'Component added',
      description: 'The selected component has been added to your page',
      variant: 'default',
    });
  };

  // Get SEO impact color
  const getSeoImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          AI Component Recommendations
        </CardTitle>
        <CardDescription>
          Get intelligent component recommendations for your page sections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="context">Section Context</Label>
              <Select value={context} onValueChange={setContext}>
                <SelectTrigger id="context">
                  <SelectValue placeholder="Select section context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="about">About Section</SelectItem>
                  <SelectItem value="services">Services Section</SelectItem>
                  <SelectItem value="features">Features Section</SelectItem>
                  <SelectItem value="testimonials">Testimonials</SelectItem>
                  <SelectItem value="team">Team Section</SelectItem>
                  <SelectItem value="pricing">Pricing Section</SelectItem>
                  <SelectItem value="contact">Contact Section</SelectItem>
                  <SelectItem value="portfolio">Portfolio Section</SelectItem>
                  <SelectItem value="faq">FAQ Section</SelectItem>
                  <SelectItem value="blog">Blog Section</SelectItem>
                  <SelectItem value="cta">Call to Action</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-8">
              <Button 
                onClick={generateRecommendations} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading component recommendations...</span>
            </div>
          ) : (
            <>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recommendationSelect">Recommendation Context</Label>
                    <Select 
                      value={selectedRecommendation !== null ? selectedRecommendation.toString() : ''} 
                      onValueChange={(value) => {
                        const index = parseInt(value);
                        setSelectedRecommendation(index);
                        if (recommendations[index].recommendations && recommendations[index].recommendations.length > 0) {
                          setSelectedComponent(0);
                        } else {
                          setSelectedComponent(null);
                        }
                      }}
                    >
                      <SelectTrigger id="recommendationSelect">
                        <SelectValue placeholder="Select recommendation set" />
                      </SelectTrigger>
                      <SelectContent>
                        {recommendations.map((rec, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {rec.context} - {new Date(rec.createdAt).toLocaleString()}
                            {rec.used && ' (Used)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedRecommendation !== null && recommendations[selectedRecommendation] && (
                    <div className="space-y-4">
                      {/* Reasoning section */}
                      {recommendations[selectedRecommendation].reasoning && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="reasoning">
                            <AccordionTrigger className="text-sm">
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                AI Reasoning
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                                {recommendations[selectedRecommendation].reasoning}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {/* Component selection */}
                      {recommendations[selectedRecommendation].recommendations && 
                       recommendations[selectedRecommendation].recommendations.length > 0 ? (
                        <div className="space-y-2">
                          <Label htmlFor="componentSelect">Select Component</Label>
                          <Select 
                            value={selectedComponent !== null ? selectedComponent.toString() : ''} 
                            onValueChange={(value) => setSelectedComponent(parseInt(value))}
                          >
                            <SelectTrigger id="componentSelect">
                              <SelectValue placeholder="Select component" />
                            </SelectTrigger>
                            <SelectContent>
                              {recommendations[selectedRecommendation].recommendations.map((component, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                  {component.name || component.type || `Component ${index + 1}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <FileCode className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No components available in this recommendation set</p>
                        </div>
                      )}

                      {/* Component preview */}
                      {selectedComponent !== null && 
                       recommendations[selectedRecommendation].recommendations && 
                       recommendations[selectedRecommendation].recommendations[selectedComponent] && (
                        <div className="border rounded-md p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {recommendations[selectedRecommendation].recommendations[selectedComponent].name || 
                               recommendations[selectedRecommendation].recommendations[selectedComponent].type || 
                               `Component ${selectedComponent + 1}`}
                            </h4>
                            
                            {recommendations[selectedRecommendation].recommendations[selectedComponent].seoImpact && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center">
                                      <Badge variant={
                                        recommendations[selectedRecommendation].recommendations[selectedComponent].seoImpact.toLowerCase() === 'high' ? 'default' : 
                                        recommendations[selectedRecommendation].recommendations[selectedComponent].seoImpact.toLowerCase() === 'medium' ? 'secondary' : 
                                        'outline'
                                      }>
                                        <ScanLine className="h-3 w-3 mr-1" />
                                        SEO Impact: {recommendations[selectedRecommendation].recommendations[selectedComponent].seoImpact}
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This component's impact on SEO performance</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {recommendations[selectedRecommendation].recommendations[selectedComponent].description || 
                             recommendations[selectedRecommendation].recommendations[selectedComponent].reasoning || 
                             'No description available'}
                          </div>

                          {/* Component details in tabs */}
                          <Tabs defaultValue="preview" className="mt-4">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="preview">Preview</TabsTrigger>
                              <TabsTrigger value="content">Content</TabsTrigger>
                              <TabsTrigger value="code">Structure</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="preview" className="p-2 min-h-[100px] bg-muted/30 rounded-md">
                              <div className="p-2 text-sm">
                                {recommendations[selectedRecommendation].recommendations[selectedComponent].preview || 
                                 "A preview of how this component might look on your website."}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="content" className="p-2 min-h-[100px] bg-muted/30 rounded-md">
                              <div className="p-2 text-sm">
                                {recommendations[selectedRecommendation].recommendations[selectedComponent].content && (
                                  <div className="space-y-2">
                                    {Object.entries(recommendations[selectedRecommendation].recommendations[selectedComponent].content).map(([key, value]) => (
                                      <div key={key}>
                                        <div className="font-medium text-xs uppercase text-muted-foreground">{key}:</div>
                                        <div className="text-sm">{String(value)}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) || "No content details available"}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="code" className="p-2 min-h-[100px] bg-muted/30 rounded-md">
                              <div className="flex items-center gap-2 mb-2">
                                <Code className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Component Structure</span>
                              </div>
                              <div className="text-xs font-mono bg-muted p-2 rounded-md">
                                {recommendations[selectedRecommendation].recommendations[selectedComponent].type && (
                                  <div>Type: {recommendations[selectedRecommendation].recommendations[selectedComponent].type}</div>
                                )}
                                {recommendations[selectedRecommendation].recommendations[selectedComponent].structure && (
                                  <pre>{JSON.stringify(recommendations[selectedRecommendation].recommendations[selectedComponent].structure, null, 2)}</pre>
                                ) || "Component structure details not available"}
                              </div>
                            </TabsContent>
                          </Tabs>

                          <Button onClick={handleAddComponent} className="w-full mt-2">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add This Component
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Cpu className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-4">No component recommendations available yet</p>
                  <Button onClick={generateRecommendations} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Generate Recommendations
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {recommendations.length} recommendation sets available
        </div>
        <Button variant="ghost" size="sm" onClick={fetchRecommendations} disabled={isLoading}>
          <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIComponentRecommendations;