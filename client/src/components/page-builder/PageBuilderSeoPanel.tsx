import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, RefreshCw, AlertCircle, CheckCircle2, X, Plus, Link as LinkIcon, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { SeoIntelligenceDashboard } from "./SeoIntelligenceDashboard";

interface SeoSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  primaryKeyword?: string;
  seoGoal?: 'local' | 'industry' | 'conversion' | 'technical';
  ogImage?: string;
  canonical?: string;
}

interface SeoScore {
  overallScore: number;
  categoryScores: {
    title: number;
    description: number;
    keywords: number;
    content: number;
    structure: number;
    images: number;
    performance: number;
  };
  analysis: {
    title: string;
    description: string;
    keywords: string;
    content: string;
    structure: string;
    images: string;
    performance: string;
  };
}

interface SeoRecommendation {
  id: number;
  pageId: number;
  type: 'title' | 'description' | 'keywords' | 'content' | 'headings' | 'images' | 'structure' | 'error';
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  implementationHint: string;
  originalValue: string;
  suggestedValue: string;
  isDismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageBuilderSeoPanelProps {
  seoSettings: SeoSettings;
  onChange: (settings: SeoSettings) => void;
  pageType: 'core' | 'custom' | 'automation';
  pageId: number | null;
  title: string;
  description: string;
}

const PageBuilderSeoPanel: React.FC<PageBuilderSeoPanelProps> = ({
  seoSettings,
  onChange,
  pageType,
  pageId,
  title,
  description
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const queryClient = useQueryClient();

  // Update local SEO title and description when page title/description change
  useEffect(() => {
    const updatedSettings = { ...seoSettings };
    
    // Only update if not already set by the user
    if (!seoSettings.title) {
      updatedSettings.title = title;
    }
    
    if (!seoSettings.description) {
      updatedSettings.description = description;
    }
    
    onChange(updatedSettings);
  }, [title, description]);

  // Fetch SEO score
  const { 
    data: seoScore, 
    isLoading: isLoadingSeoScore 
  } = useQuery<{ 
    success: boolean; 
    data: SeoScore
  }>({
    queryKey: ['/api/page-builder/pages', pageId, 'seo-score'],
    queryFn: async () => {
      if (!pageId) throw new Error("Page ID is required");
      const res = await apiRequest("GET", `/api/page-builder/pages/${pageId}/seo-score`);
      if (!res.ok) throw new Error('Failed to fetch SEO score');
      return await res.json();
    },
    enabled: !!pageId, // Only run if pageId exists
  });

  // Fetch SEO recommendations
  const { 
    data: recommendations, 
    isLoading: isLoadingRecommendations 
  } = useQuery<{ 
    success: boolean; 
    data: SeoRecommendation[] 
  }>({
    queryKey: ['/api/page-builder/pages', pageId, 'recommendations'],
    queryFn: async () => {
      if (!pageId) throw new Error("Page ID is required");
      const res = await apiRequest("GET", `/api/page-builder/pages/${pageId}/recommendations`);
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return await res.json();
    },
    enabled: !!pageId, // Only run if pageId exists
  });

  // Mutation for dismissing a recommendation
  const dismissRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: number) => {
      if (!pageId) throw new Error("Page ID is required");
      const res = await apiRequest("POST", `/api/page-builder/recommendations/${recommendationId}/dismiss`);
      if (!res.ok) throw new Error('Failed to dismiss recommendation');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', pageId, 'recommendations'] });
      toast({
        title: "Recommendation dismissed",
        description: "The recommendation has been dismissed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to dismiss recommendation: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Generate recommendations mutation
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      if (!pageId) throw new Error("Page ID is required");
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/recommendations`);
      if (!res.ok) throw new Error('Failed to generate recommendations');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', pageId, 'recommendations'] });
      toast({
        title: "SEO Recommendations Generated",
        description: `${data.data.length} recommendations provided to improve your page.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate recommendations: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Calculate SEO score mutation
  const calculateSeoScoreMutation = useMutation({
    mutationFn: async () => {
      if (!pageId) throw new Error("Page ID is required");
      const res = await apiRequest("GET", `/api/page-builder/pages/${pageId}/seo-score`);
      if (!res.ok) throw new Error('Failed to calculate SEO score');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', pageId, 'seo-score'] });
      toast({
        title: "SEO Score Calculated",
        description: `Current SEO score: ${data.data.overallScore}/100`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to calculate SEO score: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Apply recommendation mutation
  const applyRecommendationMutation = useMutation({
    mutationFn: async (recommendation: SeoRecommendation) => {
      // Apply the recommendation to the SEO settings
      const updatedSettings = { ...seoSettings };
      
      switch (recommendation.type) {
        case 'title':
          updatedSettings.title = recommendation.suggestedValue;
          break;
        case 'description':
          updatedSettings.description = recommendation.suggestedValue;
          break;
        case 'keywords':
          try {
            updatedSettings.keywords = JSON.parse(recommendation.suggestedValue);
          } catch (e) {
            console.error("Error parsing keywords:", e);
          }
          break;
        case 'content':
          // Content changes would be applied to the page content, not SEO settings
          break;
      }
      
      return updatedSettings;
    },
    onSuccess: (updatedSettings) => {
      onChange(updatedSettings);
      toast({
        title: "Recommendation Applied",
        description: "The recommendation has been applied to your SEO settings.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to apply recommendation: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add a keyword to the list
  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const updatedKeywords = [...(seoSettings.keywords || []), newKeyword.trim()];
    onChange({ ...seoSettings, keywords: updatedKeywords });
    setNewKeyword('');
  };

  // Remove a keyword from the list
  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...(seoSettings.keywords || [])];
    updatedKeywords.splice(index, 1);
    onChange({ ...seoSettings, keywords: updatedKeywords });
  };

  // Update SEO settings
  const handleChange = (field: keyof SeoSettings, value: any) => {
    onChange({ ...seoSettings, [field]: value });
  };

  // Get SEO score color based on score value
  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Get recommendation badge color based on priority
  const getRecommendationBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-red-500 hover:bg-red-600";
      case 'medium': return "bg-amber-500 hover:bg-amber-600";
      case 'low': return "bg-green-500 hover:bg-green-600";
      default: return "bg-primary";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic SEO</TabsTrigger>
            <TabsTrigger value="intelligence">
              <Zap className="h-4 w-4 mr-1" />
              SEO Intelligence
            </TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Configure search engine optimization settings for this page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    value={seoSettings.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter SEO title (recommended 50-60 characters)"
                  />
                  {seoSettings.title && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{seoSettings.title.length} characters</span>
                      <span className={seoSettings.title.length > 60 ? "text-red-500" : (seoSettings.title.length < 30 ? "text-amber-500" : "text-green-500")}>
                        {seoSettings.title.length > 60 ? "Too long" : (seoSettings.title.length < 30 ? "Could be longer" : "Good length")}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={seoSettings.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter meta description (recommended 120-155 characters)"
                    rows={3}
                  />
                  {seoSettings.description && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{seoSettings.description.length} characters</span>
                      <span className={seoSettings.description.length > 160 ? "text-red-500" : (seoSettings.description.length < 70 ? "text-amber-500" : "text-green-500")}>
                        {seoSettings.description.length > 160 ? "Too long" : (seoSettings.description.length < 70 ? "Could be longer" : "Good length")}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-keyword">Primary Keyword</Label>
                  <Input
                    id="primary-keyword"
                    value={seoSettings.primaryKeyword || ''}
                    onChange={(e) => handleChange('primaryKeyword', e.target.value)}
                    placeholder="Enter primary keyword or phrase"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the main keyword you want to rank for. It should appear in the title, description, and content.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(seoSettings.keywords || []).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-2">
                        {keyword}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleRemoveKeyword(index)}
                        />
                      </Badge>
                    ))}
                    {(seoSettings.keywords || []).length === 0 && (
                      <span className="text-sm text-muted-foreground">No keywords added yet</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add a keyword"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add 3-5 related keywords that support your primary keyword
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo-goal">SEO Goal</Label>
                  <Select
                    value={seoSettings.seoGoal || 'conversion'}
                    onValueChange={(value) => handleChange('seoGoal', value)}
                  >
                    <SelectTrigger id="seo-goal">
                      <SelectValue placeholder="Select SEO goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local SEO (target local audience)</SelectItem>
                      <SelectItem value="industry">Industry Authority (establish expertise)</SelectItem>
                      <SelectItem value="conversion">Conversion (generate leads/sales)</SelectItem>
                      <SelectItem value="technical">Technical Resource (provide detailed information)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Your SEO goal helps determine the best optimization strategy
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="canonical-url"
                      value={seoSettings.canonical || ''}
                      onChange={(e) => handleChange('canonical', e.target.value)}
                      placeholder="Enter canonical URL (if different from page URL)"
                    />
                    <Button variant="ghost" size="icon">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use canonical URLs to avoid duplicate content issues
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="og-image">Social Media Image URL</Label>
                  <Input
                    id="og-image"
                    value={seoSettings.ogImage || ''}
                    onChange={(e) => handleChange('ogImage', e.target.value)}
                    placeholder="Enter URL for social media sharing image"
                  />
                  <p className="text-xs text-muted-foreground">
                    This image will be used when your page is shared on social media
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="intelligence">
            {pageId && <SeoIntelligenceDashboard pageId={pageId} />}
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>SEO Recommendations</CardTitle>
                <CardDescription>
                  AI-powered recommendations to improve your page's SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recommendations?.data && recommendations.data.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.data
                      .filter(rec => !rec.isDismissed)
                      .map(recommendation => (
                        <Card key={recommendation.id} className="border-l-4" style={{ borderLeftColor: recommendation.priority === 'high' ? 'var(--red-500)' : (recommendation.priority === 'medium' ? 'var(--amber-500)' : 'var(--green-500)') }}>
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Badge className={getRecommendationBadgeColor(recommendation.priority)}>
                                  {recommendation.priority} priority
                                </Badge>
                                <Badge variant="outline" className="ml-2">
                                  {recommendation.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                {recommendation.type !== 'error' && recommendation.type !== 'content' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => applyRecommendationMutation.mutate(recommendation)}
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => dismissRecommendationMutation.mutate(recommendation.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm mb-1">{recommendation.recommendation}</p>
                            <p className="text-xs text-muted-foreground">{recommendation.implementationHint}</p>
                            
                            {recommendation.originalValue && recommendation.suggestedValue && (
                              <div className="mt-3 border rounded-md p-3 bg-muted/20 text-xs">
                                <div className="mb-2">
                                  <span className="font-medium">Current:</span>
                                  <p className="mt-1">{recommendation.originalValue}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Suggested:</span>
                                  <p className="mt-1">{recommendation.suggestedValue}</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No recommendations available</p>
                    <Button 
                      variant="outline" 
                      onClick={() => generateRecommendationsMutation.mutate()}
                      disabled={generateRecommendationsMutation.isPending}
                    >
                      {generateRecommendationsMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Generate Recommendations
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => {}}>
                  Show Dismissed ({recommendations?.data?.filter(r => r.isDismissed).length || 0})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateRecommendationsMutation.mutate()}
                  disabled={generateRecommendationsMutation.isPending}
                >
                  {generateRecommendationsMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>SEO Score</CardTitle>
            <CardDescription>
              Overall score based on SEO best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pageId ? (
              isLoadingSeoScore ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : seoScore?.data ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <Progress 
                        value={seoScore.data.overallScore} 
                        max={100} 
                        className={`absolute h-full w-full ${getSeoScoreColor(seoScore.data.overallScore)}`}
                      />
                      <div className="z-10 text-center">
                        <span className="text-4xl font-bold">{seoScore.data.overallScore}</span>
                        <span className="text-lg">/100</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="font-medium">
                        {seoScore.data.overallScore >= 80 ? "Excellent" : 
                         seoScore.data.overallScore >= 60 ? "Good" : 
                         seoScore.data.overallScore >= 40 ? "Needs Improvement" : 
                         "Poor"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {seoScore.data.overallScore >= 80 ? "Your page is well optimized for search engines" : 
                         seoScore.data.overallScore >= 60 ? "Your page has good SEO, but could be improved" : 
                         seoScore.data.overallScore >= 40 ? "Your page needs SEO improvements" : 
                         "Your page has significant SEO issues"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Category Scores</h3>
                    {Object.entries(seoScore.data.categoryScores).map(([category, score]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <span>{score}/20</span>
                        </div>
                        <Progress 
                          value={score * 5} // Convert to percentage
                          max={100}
                          className={`h-2 ${getSeoScoreColor(score * 5)}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {seoScore.data.analysis[category as keyof typeof seoScore.data.analysis]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No SEO score available</p>
                  <Button 
                    variant="outline" 
                    onClick={() => calculateSeoScoreMutation.mutate()}
                    disabled={calculateSeoScoreMutation.isPending}
                  >
                    {calculateSeoScoreMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Calculate Score
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Save the page first to calculate SEO score</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SEO Preview</CardTitle>
            <CardDescription>
              How your page might appear in search results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 space-y-2">
              <div className="text-blue-600 text-xl font-medium">
                {seoSettings.title || title || "Page Title"}
              </div>
              <div className="text-green-700 text-sm">
                {`https://example.com/${seoSettings.canonical?.replace(/^\//, '') || ''}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {seoSettings.description || description || "A description of your page will appear here. Make sure to write a compelling meta description to improve click-through rates."}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SEO Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Title Tag</p>
                <p className="text-muted-foreground">Keep titles under 60 characters for optimal display in search results.</p>
              </div>
              <div>
                <p className="font-medium">Meta Description</p>
                <p className="text-muted-foreground">Write compelling descriptions under 155 characters that include your primary keyword.</p>
              </div>
              <div>
                <p className="font-medium">Keywords</p>
                <p className="text-muted-foreground">Include your primary keyword in the title, description, headings, and naturally throughout content.</p>
              </div>
              <div>
                <p className="font-medium">Content</p>
                <p className="text-muted-foreground">Create high-quality content that's at least 300 words and answers user questions.</p>
              </div>
              <div>
                <p className="font-medium">Images</p>
                <p className="text-muted-foreground">Use descriptive alt text for all images, including keywords where appropriate.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageBuilderSeoPanel;