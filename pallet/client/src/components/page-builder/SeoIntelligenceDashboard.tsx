import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ChevronRight,
  TrendingUp,
  BarChart,
  LineChart,
  Search,
  Target,
  BarChart2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  BookOpen,
  Award,
  ListChecks,
  Copy,
  CheckCheck
} from 'lucide-react';

interface SeoIntelligenceDashboardProps {
  pageId: number;
}

export const SeoIntelligenceDashboard: React.FC<SeoIntelligenceDashboardProps> = ({ pageId }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('industry');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [optimizationContent, setOptimizationContent] = useState<any>(null);
  const [optimizationRequestOpen, setOptimizationRequestOpen] = useState<boolean>(false);

  // Fetch industry-specific data for this page
  const industryQuery = useQuery({
    queryKey: ['/api/advanced-seo/pages', pageId, 'industry'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/advanced-seo/pages/${pageId}/industry`);
      const data = await res.json();
      if (data.success && data.data.industry) {
        setSelectedIndustry(data.data.industry);
      }
      return data.data;
    },
    enabled: !!pageId,
  });

  // Fetch industry keywords
  const keywordsQuery = useQuery({
    queryKey: ['/api/advanced-seo/pages', pageId, 'industry-keywords'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/advanced-seo/pages/${pageId}/industry-keywords`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!pageId && !!selectedIndustry,
  });

  // Fetch the benchmark comparison
  const benchmarkQuery = useQuery({
    queryKey: ['/api/advanced-seo/pages', pageId, 'benchmark-comparison'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/advanced-seo/pages/${pageId}/benchmark-comparison`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!pageId && !!selectedIndustry,
  });

  // Fetch competitor recommendations
  const competitorQuery = useQuery({
    queryKey: ['/api/advanced-seo/pages', pageId, 'competitor-recommendations'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/advanced-seo/pages/${pageId}/competitor-recommendations`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!pageId && !!selectedIndustry,
  });

  // Fetch trending topics
  const trendingQuery = useQuery({
    queryKey: ['/api/advanced-seo/industry', selectedIndustry, 'trending-topics'],
    queryFn: async () => {
      if (!selectedIndustry) return null;
      const res = await apiRequest('GET', `/api/advanced-seo/industry/${selectedIndustry}/trending-topics`);
      const data = await res.json();
      return data.data;
    },
    enabled: !!selectedIndustry,
  });

  // Content optimization mutation
  const optimizeContentMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const res = await apiRequest('POST', `/api/advanced-seo/pages/${pageId}/optimize`, requestData);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Content optimization complete',
          description: `Optimization generated with potential SEO score improvement of ${data.data.projectedScore - data.data.originalScore} points.`,
        });
        setOptimizationContent(data.data);
      } else {
        toast({
          title: 'Optimization failed',
          description: data.message || 'An unknown error occurred',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: 'Optimization failed',
        description: (error as Error).message || 'An unknown error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  });

  // Apply optimizations mutation
  const applyOptimizationsMutation = useMutation({
    mutationFn: async (optimizations: any) => {
      const res = await apiRequest('POST', `/api/advanced-seo/pages/${pageId}/apply-optimizations`, optimizations);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Optimizations applied',
          description: `Applied ${data.data.appliedChanges.length} optimizations with an estimated SEO impact of ${data.data.seoImpact} points.`,
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages', pageId] });
        queryClient.invalidateQueries({ queryKey: ['/api/advanced-seo/pages', pageId] });
        
        setOptimizationRequestOpen(false);
        setOptimizationContent(null);
      } else {
        toast({
          title: 'Failed to apply optimizations',
          description: data.message || 'An unknown error occurred',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to apply optimizations',
        description: (error as Error).message || 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });

  // Generate additional content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (requestData: { contentType: string, targetKeywords?: string[] }) => {
      const res = await apiRequest('POST', `/api/advanced-seo/pages/${pageId}/generate-content`, requestData);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Content generated',
          description: `${data.data.contentType} content has been generated successfully.`,
        });
        // Set the generated content in state
        setOptimizationContent({
          ...optimizationContent,
          generatedContent: data.data.generatedContent
        });
      } else {
        toast({
          title: 'Content generation failed',
          description: data.message || 'An unknown error occurred',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Content generation failed',
        description: (error as Error).message || 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  });

  // Handle optimize content request
  const handleOptimizeContent = (goal: 'conversion' | 'engagement' | 'traffic' | 'authority') => {
    setIsLoading(true);
    optimizeContentMutation.mutate({
      optimizationGoal: goal,
      includeIndustryBenchmarks: true,
      includeCompetitorAnalysis: true,
      contentReadabilityLevel: 'intermediate',
      targetKeywords: keywordsQuery.data?.primaryKeywords || []
    });
    setOptimizationRequestOpen(true);
  };

  // Handle apply optimizations
  const handleApplyOptimizations = (selectedOptimizations: any) => {
    applyOptimizationsMutation.mutate(selectedOptimizations);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The text has been copied to your clipboard.',
      duration: 2000,
    });
  };

  if (industryQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const industry = selectedIndustry || industryQuery.data?.industry || 'accounting';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered SEO Intelligence</h2>
          <p className="text-muted-foreground">Industry-specific SEO analysis and optimization</p>
        </div>
        <Badge variant="outline" className="font-semibold">
          <TrendingUp className="h-4 w-4 mr-1" />
          {industry.charAt(0).toUpperCase() + industry.slice(1)} Industry
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="industry">
            <BarChart className="h-4 w-4 mr-1" />
            Industry Benchmarks
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Target className="h-4 w-4 mr-1" />
            Keyword Intelligence
          </TabsTrigger>
          <TabsTrigger value="competitors">
            <BarChart2 className="h-4 w-4 mr-1" />
            Competitor Analysis
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-1" />
            Trending Topics
          </TabsTrigger>
          <TabsTrigger value="optimize">
            <Sparkles className="h-4 w-4 mr-1" />
            Content Optimization
          </TabsTrigger>
        </TabsList>

        {/* Industry Benchmarks Tab */}
        <TabsContent value="industry" className="space-y-4">
          {benchmarkQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Industry Benchmark Comparison</CardTitle>
                  <CardDescription>
                    How your page compares to industry standards in the {industry} sector
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {benchmarkQuery.data ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Word Count Comparison</h3>
                          <div className="flex justify-between text-sm">
                            <span>Your Content</span>
                            <span className="font-semibold">
                              {benchmarkQuery.data.comparisonResults?.wordCountComparison?.pageWordCount || 0} words
                            </span>
                          </div>
                          <Progress 
                            value={
                              benchmarkQuery.data.comparisonResults?.wordCountComparison?.pageWordCount /
                              (benchmarkQuery.data.comparisonResults?.wordCountComparison?.industryAverage || 1) * 100
                            } 
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm">
                            <span>Industry Average</span>
                            <span className="font-semibold">
                              {benchmarkQuery.data.comparisonResults?.wordCountComparison?.industryAverage || 0} words
                            </span>
                          </div>
                          <Badge variant={
                            (benchmarkQuery.data.comparisonResults?.wordCountComparison?.percentageDifference || 0) >= -10
                            ? "default"
                            : "destructive"
                          } className="mt-1">
                            {(benchmarkQuery.data.comparisonResults?.wordCountComparison?.percentageDifference || 0) > 0 ? (
                              <>
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                {Math.abs(benchmarkQuery.data.comparisonResults?.wordCountComparison?.percentageDifference || 0)}% above average
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                {Math.abs(benchmarkQuery.data.comparisonResults?.wordCountComparison?.percentageDifference || 0)}% below average
                              </>
                            )}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Content Structure Assessment</h3>
                          <p className="text-sm">
                            {benchmarkQuery.data.comparisonResults?.contentStructureComparison?.assessment || 
                              "No structure assessment available"}
                          </p>
                          <div className="mt-2 space-y-2">
                            {benchmarkQuery.data.comparisonResults?.contentStructureComparison?.recommendations?.slice(0, 2).map((rec: string, i: number) => (
                              <div key={i} className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0" />
                                <p className="text-xs">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Prioritized Actions</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {benchmarkQuery.data.prioritizedActions?.map((action: string, i: number) => (
                            <div key={i} className="flex items-start">
                              <Badge variant="outline" className="mr-2 shrink-0">{i + 1}</Badge>
                              <p className="text-sm">{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No benchmark data available</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => benchmarkQuery.refetch()}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Analyze against benchmarks
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Keyword Intelligence Tab */}
        <TabsContent value="keywords" className="space-y-4">
          {keywordsQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Industry-Specific Keywords</CardTitle>
                <CardDescription>
                  Optimized keywords for the {industry} industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keywordsQuery.data ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <Badge variant="default" className="mr-2">Primary</Badge>
                        Core Industry Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywordsQuery.data.primaryKeywords?.map((keyword: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center">
                        <Badge variant="outline" className="mr-2">Secondary</Badge>
                        Supporting Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywordsQuery.data.secondaryKeywords?.map((keyword: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-sm px-3 py-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <Badge variant="outline" className="mr-2">Local</Badge>
                          Location-Specific Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {keywordsQuery.data.localKeywords?.map((keyword: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-sm px-3 py-1 bg-blue-50">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <Badge variant="outline" className="mr-2">Trending</Badge>
                          Currently Trending Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {keywordsQuery.data.trendingKeywords?.map((keyword: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-sm px-3 py-1 bg-amber-50">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No keyword data available</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => keywordsQuery.refetch()}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Analyze industry keywords
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => {
                    const keywordText = 
                      `PRIMARY KEYWORDS:\n${keywordsQuery.data?.primaryKeywords?.join(', ')}\n\n` +
                      `SECONDARY KEYWORDS:\n${keywordsQuery.data?.secondaryKeywords?.join(', ')}\n\n` +
                      `LOCAL KEYWORDS:\n${keywordsQuery.data?.localKeywords?.join(', ')}\n\n` +
                      `TRENDING KEYWORDS:\n${keywordsQuery.data?.trendingKeywords?.join(', ')}`;
                    
                    handleCopyToClipboard(keywordText);
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" /> 
                  Copy all keywords
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-4">
          {competitorQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  Insights from top competitors in the {industry} industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                {competitorQuery.data ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Content Opportunities</h3>
                      <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-3">
                          {competitorQuery.data.contentOptimizations?.contentGapAnalysis?.missingTopics?.map((topic: string, i: number) => (
                            <div key={i} className="flex items-start">
                              <Badge variant="outline" className="mr-2 shrink-0">{i + 1}</Badge>
                              <p className="text-sm">{topic}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <Separator />

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Recommended Content Improvements</h3>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="structure">
                          <AccordionTrigger>Structure Recommendations</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {competitorQuery.data.contentOptimizations?.contentOptimizations?.structureRecommendations?.headings?.map((rec: string, i: number) => (
                                <div key={i} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0" />
                                  <p className="text-sm">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="keywords">
                          <AccordionTrigger>Keyword Optimizations</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {competitorQuery.data.contentOptimizations?.contentOptimizations?.keywordOptimizations?.secondaryKeywordsToAdd?.map((keyword: string, i: number) => (
                                <Badge key={i} variant="outline" className="mr-2 mb-2">
                                  {keyword}
                                </Badge>
                              ))}
                              <p className="text-sm mt-2">
                                <span className="font-semibold">Primary Keyword: </span>
                                {competitorQuery.data.contentOptimizations?.contentOptimizations?.keywordOptimizations?.primaryKeywordRecommendation}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="media">
                          <AccordionTrigger>Media Recommendations</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {competitorQuery.data.contentOptimizations?.contentOptimizations?.mediaRecommendations?.imageRecommendations?.map((rec: string, i: number) => (
                                <div key={i} className="flex items-start">
                                  <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0" />
                                  <p className="text-sm">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Prioritized Actions</h3>
                      <div className="space-y-2">
                        {competitorQuery.data.contentOptimizations?.prioritizedActions?.map((action: string, i: number) => (
                          <div key={i} className="flex items-start">
                            <Badge className="mr-2 shrink-0">{i + 1}</Badge>
                            <p className="text-sm">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No competitor analysis available</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => competitorQuery.refetch()}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Analyze competitors
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={() => handleOptimizeContent('traffic')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1" />
                      Optimize Content
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Trending Topics Tab */}
        <TabsContent value="trends" className="space-y-4">
          {trendingQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>
                  Current trending topics in the {industry} industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trendingQuery.data ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Top Trending Topics</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {trendingQuery.data.trendingTopics?.map((topic: any, i: number) => (
                          <Card key={i} className="overflow-hidden">
                            <CardHeader className="p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Badge variant={
                                    topic.popularityScore >= 8 ? "default" : 
                                    topic.popularityScore >= 6 ? "secondary" : "outline"
                                  } className="mr-2">
                                    {topic.popularityScore}/10
                                  </Badge>
                                  <CardTitle className="text-base">{topic.topic}</CardTitle>
                                </div>
                                <Badge variant={
                                  topic.searchVolumeTrend === "increasing" ? "default" :
                                  topic.searchVolumeTrend === "stable" ? "secondary" : "outline"
                                }>
                                  {topic.searchVolumeTrend === "increasing" ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                  ) : topic.searchVolumeTrend === "decreasing" ? (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                  ) : null}
                                  {topic.searchVolumeTrend}
                                </Badge>
                              </div>
                              <CardDescription className="mt-2">
                                {topic.recommendedApproach}
                              </CardDescription>
                            </CardHeader>
                            <div className="px-4 pb-4">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {topic.keySubtopics?.slice(0, 5).map((subtopic: string, j: number) => (
                                  <Badge key={j} variant="outline" className="text-xs">
                                    {subtopic}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                                <span>
                                  <span className="font-medium">Target audience:</span>{" "}
                                  {topic.targetAudience?.join(", ")}
                                </span>
                                <span>
                                  <span className="font-medium">Coverage:</span>{" "}
                                  {topic.competitorCoverage}%
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Emerging Trends</h3>
                        <div className="space-y-2">
                          {trendingQuery.data.emergingTrends?.slice(0, 5).map((trend: string, i: number) => (
                            <div key={i} className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-amber-50">NEW</Badge>
                              <span className="text-sm">{trend}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Seasonal Topics</h3>
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-muted-foreground">CURRENT</h4>
                          {trendingQuery.data.seasonalTopics?.current?.slice(0, 3).map((topic: string, i: number) => (
                            <div key={i} className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-blue-50">NOW</Badge>
                              <span className="text-sm">{topic}</span>
                            </div>
                          ))}
                          
                          <h4 className="text-xs font-semibold text-muted-foreground mt-3">UPCOMING</h4>
                          {trendingQuery.data.seasonalTopics?.upcoming?.slice(0, 3).map((topic: string, i: number) => (
                            <div key={i} className="flex items-center">
                              <Badge variant="outline" className="mr-2">SOON</Badge>
                              <span className="text-sm">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No trending topics available</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => trendingQuery.refetch()}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Analyze trending topics
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  View all trends
                </Button>
                <Button variant="default" size="sm" onClick={() => handleOptimizeContent('engagement')}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Create trending content
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Content Optimization Tab */}
        <TabsContent value="optimize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Content Optimization</CardTitle>
              <CardDescription>
                Optimize your content for different goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => handleOptimizeContent('traffic')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Traffic Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Optimize content to attract more organic search traffic through improved keyword usage, content structure, and meta data.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => handleOptimizeContent('conversion')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Conversion Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Optimize content to improve conversion rates with better calls-to-action, persuasive language, and trust indicators.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => handleOptimizeContent('engagement')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Engagement Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Optimize content to increase user engagement with more compelling stories, better visuals, and interactive elements.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => handleOptimizeContent('authority')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Authority Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Optimize content to establish expertise and authority in your industry with credible sources, data, and industry best practices.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Generate Additional Content</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => generateContentMutation.mutate({ contentType: 'section' })}>
                    <ListChecks className="h-4 w-4 mr-1" />
                    New Section
                  </Button>
                  <Button variant="outline" onClick={() => generateContentMutation.mutate({ contentType: 'callToAction' })}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Call-to-Action
                  </Button>
                  <Button variant="outline" onClick={() => generateContentMutation.mutate({ contentType: 'faq' })}>
                    <BookOpen className="h-4 w-4 mr-1" />
                    FAQ Section
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Optimization Dialog */}
      <Dialog open={optimizationRequestOpen} onOpenChange={setOptimizationRequestOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Optimization Results</DialogTitle>
            <DialogDescription>
              {optimizationContent ? (
                <div className="flex items-center mt-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">Original Score:</span>
                    <Badge variant="outline" className="ml-1">
                      {optimizationContent.originalScore}/100
                    </Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">Projected Score:</span>
                    <Badge variant="default" className="ml-1">
                      {optimizationContent.projectedScore}/100
                    </Badge>
                  </div>
                  <Badge variant="outline" className="ml-4 text-green-600 bg-green-50">
                    +{optimizationContent.projectedScore - optimizationContent.originalScore} points
                  </Badge>
                </div>
              ) : (
                <span>Generating optimization suggestions...</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {optimizationContent ? (
            <div className="space-y-6 py-4">
              {optimizationContent.titleSuggestions?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium">Title Suggestions</h3>
                    <Badge variant="secondary" className="ml-2">{optimizationContent.titleSuggestions.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {optimizationContent.titleSuggestions.map((title: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md border">
                        <span className="text-sm">{title}</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(title)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {optimizationContent.contentImprovements?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium">Content Improvements</h3>
                    <Badge variant="secondary" className="ml-2">{optimizationContent.contentImprovements.length}</Badge>
                  </div>
                  <div className="space-y-4">
                    {optimizationContent.contentImprovements.map((improvement: any, i: number) => (
                      <Card key={i}>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm">
                              Section {improvement.sectionId} Improvement
                            </CardTitle>
                            <Badge variant="outline">Impact: {improvement.seoImpact}/10</Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {improvement.improvementReason}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">CURRENT CONTENT:</div>
                            <div className="text-sm p-2 rounded-md bg-muted">
                              {improvement.originalContent || "No original content available"}
                            </div>
                            
                            <div className="text-xs font-medium text-muted-foreground mt-3">SUGGESTED IMPROVEMENT:</div>
                            <div className="text-sm p-2 rounded-md bg-primary/10 border border-primary/20">
                              {improvement.optimizedContent}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end p-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(improvement.optimizedContent)}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {optimizationContent.keywordOptimizations?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Keyword Optimizations</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {optimizationContent.keywordOptimizations.map((optimization: any, i: number) => (
                      <div key={i} className="p-3 rounded-md border">
                        <div className="flex items-center justify-between">
                          <Badge className="mb-2">
                            {optimization.keyword}
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-muted-foreground">Current: {optimization.currentDensity.toFixed(2)}%</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-medium">Target: {optimization.recommendedDensity.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Placement Suggestions: </span>
                          {optimization.placementSuggestions.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Analyzing content and generating optimizations...</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOptimizationRequestOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Here we would prepare the selected optimization changes
                const selectedOptimizations = {
                  selectedTitle: optimizationContent?.titleSuggestions[0],
                  selectedDescription: optimizationContent?.metaDescriptionSuggestions?.[0],
                  selectedContentImprovements: optimizationContent?.contentImprovements
                };
                
                handleApplyOptimizations(selectedOptimizations);
              }}
              disabled={!optimizationContent}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Apply All Optimizations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};