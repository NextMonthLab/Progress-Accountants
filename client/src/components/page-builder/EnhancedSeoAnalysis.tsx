import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  BarChart, 
  Smartphone, 
  GanttChart, 
  Search, 
  Globe, 
  RefreshCw,
  ExternalLink,
  ChevronsUpDown,
  Keyboard,
  Share2 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface EnhancedSeoAnalysisProps {
  pageId: number;
}

export const EnhancedSeoAnalysis: React.FC<EnhancedSeoAnalysisProps> = ({ pageId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [competitorAnalysisData, setCompetitorAnalysisData] = useState<{
    keywords: string[];
    industry: string;
    pageUrl: string;
  }>({
    keywords: [],
    industry: 'accounting',
    pageUrl: ''
  });

  // Get comprehensive SEO summary
  const {
    data: seoSummary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: [`/api/enhanced-seo/pages/${pageId}/summary`],
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string).then(res => res.json()),
    enabled: !!pageId,
  });

  // Keywords analysis query
  const {
    data: keywordAnalysis,
    isLoading: keywordLoading,
    refetch: refetchKeywords
  } = useQuery({
    queryKey: [`/api/enhanced-seo/pages/${pageId}/keyword-analysis`],
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string).then(res => res.json()),
    enabled: !!pageId && activeTab === 'keywords',
  });

  // Mobile-friendliness analysis query
  const {
    data: mobileFriendliness,
    isLoading: mobileLoading,
    refetch: refetchMobile
  } = useQuery({
    queryKey: [`/api/enhanced-seo/pages/${pageId}/mobile-friendliness`],
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string).then(res => res.json()),
    enabled: !!pageId && activeTab === 'mobile',
  });

  // Competitor analysis mutation
  const competitorAnalysisMutation = useMutation({
    mutationFn: async (data: { keywords: string[]; industry: string; pageUrl: string }) => {
      const res = await apiRequest(
        'POST',
        '/api/enhanced-seo/competitor-analysis',
        data
      );
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Competitor Analysis Complete',
        description: 'Analysis of competitive landscape has been completed.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  });

  // Generate recommendations
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        'POST',
        `/api/page-builder/pages/${pageId}/recommendations`
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'SEO Recommendations Generated',
        description: 'New SEO recommendations have been generated for your page.',
        variant: 'default',
      });
      refetchSummary();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Generate Recommendations',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  });

  // Apply recommendation
  const applyRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: number) => {
      const res = await apiRequest(
        'POST',
        `/api/page-builder/recommendations/${recommendationId}/apply`
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Recommendation Applied',
        description: 'The SEO recommendation has been applied to your page.',
        variant: 'default',
      });
      refetchSummary();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Apply Recommendation',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  });

  // Dismiss recommendation
  const dismissRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: number) => {
      const res = await apiRequest(
        'POST',
        `/api/page-builder/recommendations/${recommendationId}/dismiss`
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Recommendation Dismissed',
        description: 'The SEO recommendation has been dismissed.',
        variant: 'default',
      });
      refetchSummary();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Dismiss Recommendation',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  });

  // Update competitor analysis params when page data is available
  useEffect(() => {
    if (seoSummary?.data?.pageInfo?.seo) {
      const seo = seoSummary.data.pageInfo.seo;
      setCompetitorAnalysisData({
        keywords: seo.keywords || [],
        industry: 'accounting', // Default for Progress Accountants
        pageUrl: seoSummary.data.pageInfo.slug || `/pages/${pageId}`
      });
    }
  }, [seoSummary, pageId]);

  // Perform competitor analysis
  const handleAnalyzeCompetitors = () => {
    competitorAnalysisMutation.mutate(competitorAnalysisData);
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get badge variant for priority
  const getPriorityVariant = (priority: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-500';
      case 'medium':
      case 'major':
        return 'bg-yellow-500';
      case 'low':
      case 'minor':
        return 'bg-blue-500';
      default:
        return 'bg-slate-500';
    }
  };

  // Render loading state
  if (summaryLoading) {
    return (
      <div className="space-y-4 p-4 border-t">
        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // Render error state
  if (summaryError) {
    return (
      <div className="space-y-4 p-4 border-t">
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <p>Failed to load SEO analysis. Please try again later.</p>
        </div>
        <Button onClick={() => refetchSummary()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 border-t">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Keyboard className="h-4 w-4 mr-2" />
            Keywords
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="competitors">
            <GanttChart className="h-4 w-4 mr-2" />
            Competitors
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-4">
          {seoSummary?.data?.seoScore && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">SEO Score</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchSummary()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-full flex items-center justify-center border-4 border-slate-100">
                  <span className="text-2xl font-bold">{seoSummary.data.seoScore.overallScore}</span>
                </div>
                <div className="flex-1">
                  <Progress 
                    value={seoSummary.data.seoScore.overallScore} 
                    className={`h-2 ${getScoreColor(seoSummary.data.seoScore.overallScore)}`} 
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 my-4">
                {Object.entries(seoSummary.data.seoScore.categoryScores).map(([category, score]) => (
                  <div key={category} className="border rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm capitalize">{category}</span>
                      <span className="text-sm font-semibold">{score as number}/100</span>
                    </div>
                    <Progress 
                      value={score as number} 
                      className={`h-1 ${getScoreColor(score as number)}`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Page Info */}
          {seoSummary?.data?.pageInfo && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-base">Page Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Page Name</Label>
                    <p className="font-medium">{seoSummary.data.pageInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Slug</Label>
                    <p className="font-medium">{seoSummary.data.pageInfo.slug || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Title</Label>
                    <p className="font-medium">{seoSummary.data.pageInfo.seo?.title || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Primary Keyword</Label>
                    <p className="font-medium">{seoSummary.data.pageInfo.seo?.primaryKeyword || '-'}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm">{seoSummary.data.pageInfo.seo?.description || '-'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Insights */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Keyword Insights */}
                {seoSummary?.data?.keywordAnalysis && (
                  <div className="p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <Keyboard className="h-4 w-4 mr-2 text-blue-500" />
                      <h4 className="text-sm font-medium">Keyword Analysis</h4>
                    </div>
                    <div className="mt-1 text-sm">
                      {seoSummary.data.keywordAnalysis.primaryKeyword.keyword ? (
                        <p>
                          Primary keyword "{seoSummary.data.keywordAnalysis.primaryKeyword.keyword}" 
                          has a density of {(seoSummary.data.keywordAnalysis.primaryKeyword.density * 100).toFixed(1)}%
                        </p>
                      ) : (
                        <p className="text-amber-600">No primary keyword set.</p>
                      )}
                      {seoSummary.data.keywordAnalysis.recommendations[0] && (
                        <p className="text-slate-600 mt-1">{seoSummary.data.keywordAnalysis.recommendations[0]}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile Insights */}
                {seoSummary?.data?.mobileFriendliness && (
                  <div className="p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2 text-green-500" />
                      <h4 className="text-sm font-medium">Mobile Friendliness</h4>
                      <Badge className="ml-2" variant={seoSummary.data.mobileFriendliness.overallScore >= 70 ? 'default' : 'destructive'}>
                        {seoSummary.data.mobileFriendliness.overallScore}/100
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm">
                      {seoSummary.data.mobileFriendliness.issues.length > 0 ? (
                        <p className="text-amber-600">
                          {seoSummary.data.mobileFriendliness.issues[0].description}
                        </p>
                      ) : (
                        <p className="text-green-600">Your page appears to be mobile-friendly.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Competitor Insights */}
                {seoSummary?.data?.competitorAnalysis && (
                  <div className="p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <GanttChart className="h-4 w-4 mr-2 text-purple-500" />
                      <h4 className="text-sm font-medium">Competitor Insights</h4>
                    </div>
                    <div className="mt-1 text-sm">
                      {seoSummary.data.competitorAnalysis.competitors.length > 0 ? (
                        <>
                          <p>Top competitors: {seoSummary.data.competitorAnalysis.competitors.slice(0, 2).map(c => c.name).join(', ')}</p>
                          {seoSummary.data.competitorAnalysis.recommendations[0] && (
                            <p className="text-slate-600 mt-1">{seoSummary.data.competitorAnalysis.recommendations[0]}</p>
                          )}
                        </>
                      ) : (
                        <p>No competitor analysis available. Generate one in the Competitors tab.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">SEO Recommendations</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateRecommendationsMutation.mutate()}
                disabled={generateRecommendationsMutation.isPending}
              >
                {generateRecommendationsMutation.isPending ? 'Generating...' : 'Generate Recommendations'}
              </Button>
            </div>

            {seoSummary?.data?.recommendations?.length > 0 ? (
              <div className="space-y-4">
                {seoSummary.data.recommendations.map((rec: any) => (
                  <Card key={rec.id} className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {rec.type === 'title' ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : rec.type === 'description' ? (
                          <AlertCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Lightbulb className="h-4 w-4 mr-1" />
                        )}
                        <span className="font-medium capitalize">{rec.type}</span>
                        <Badge variant={getPriorityVariant(rec.severity)} className="ml-2">
                          {rec.severity}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => dismissRecommendationMutation.mutate(rec.id)}
                          disabled={dismissRecommendationMutation.isPending}
                        >
                          Dismiss
                        </Button>
                        {rec.autoFixAvailable && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => applyRecommendationMutation.mutate(rec.id)}
                            disabled={applyRecommendationMutation.isPending}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2">{rec.message}</p>
                    {rec.details && <p className="mt-2 text-sm text-muted-foreground">{rec.details}</p>}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded text-center">
                <p>No recommendations available. Generate recommendations to improve your SEO score.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6 pt-4">
          {keywordLoading ? (
            <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
          ) : keywordAnalysis?.data ? (
            <div className="space-y-6">
              {/* Primary Keyword Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Primary Keyword Analysis</CardTitle>
                  <CardDescription>
                    {keywordAnalysis.data.primaryKeyword.keyword 
                      ? `Analysis for "${keywordAnalysis.data.primaryKeyword.keyword}"`
                      : "No primary keyword set. Add one in your SEO settings."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {keywordAnalysis.data.primaryKeyword.keyword ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Keyword Density</p>
                          <p className="text-xl font-bold">{(keywordAnalysis.data.primaryKeyword.density * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Occurrences</p>
                          <p className="text-xl font-bold">{keywordAnalysis.data.primaryKeyword.count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Words</p>
                          <p className="text-xl font-bold">{keywordAnalysis.data.totalWords}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Keyword Positions</Label>
                        <div className="flex flex-wrap gap-1">
                          {keywordAnalysis.data.primaryKeyword.positions.slice(0, 10).map((pos: number, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              Word {pos}
                            </Badge>
                          ))}
                          {keywordAnalysis.data.primaryKeyword.positions.length > 10 && (
                            <Badge variant="outline" className="text-xs">
                              +{keywordAnalysis.data.primaryKeyword.positions.length - 10} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Keyword Variations */}
                      {keywordAnalysis.data.primaryKeyword.suggestions?.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Suggested Variations</Label>
                          <div className="flex flex-wrap gap-1">
                            {keywordAnalysis.data.primaryKeyword.suggestions.map((suggestion: string, idx: number) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p>No primary keyword data available.</p>
                      <p className="text-sm text-muted-foreground mt-1">Set a primary keyword in your SEO settings.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Secondary Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Secondary Keywords</CardTitle>
                  <CardDescription>
                    Analysis of secondary keywords on this page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {keywordAnalysis.data.secondaryKeywords?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead className="text-right">Count</TableHead>
                            <TableHead className="text-right">Density</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {keywordAnalysis.data.secondaryKeywords.map((keyword: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{keyword.keyword}</TableCell>
                              <TableCell className="text-right">{keyword.count}</TableCell>
                              <TableCell className="text-right">
                                {(keyword.density * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Keyboard className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p>No secondary keywords found.</p>
                      <p className="text-sm text-muted-foreground mt-1">Add keywords in your SEO settings.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Keywords</CardTitle>
                  <CardDescription>
                    Suggested related keywords based on your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {keywordAnalysis.data.relatedKeywords?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {keywordAnalysis.data.relatedKeywords.map((keyword: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-sm py-1 px-2">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p>No related keywords available.</p>
                      <p className="text-sm text-muted-foreground mt-1">Add more content to your page to generate related keyword suggestions.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations and Warnings */}
              <div className="space-y-4">
                {/* Recommendations */}
                {keywordAnalysis.data.recommendations?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                        Keyword Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {keywordAnalysis.data.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="flex">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-1" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Warnings */}
                {keywordAnalysis.data.overuseWarnings?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        Keyword Usage Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {keywordAnalysis.data.overuseWarnings.map((warning: string, idx: number) => (
                          <li key={idx} className="flex">
                            <AlertCircle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-1" />
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p>Failed to load keyword analysis.</p>
              <Button 
                variant="outline" 
                onClick={() => refetchKeywords()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Mobile Tab */}
        <TabsContent value="mobile" className="space-y-6 pt-4">
          {mobileLoading ? (
            <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
          ) : mobileFriendliness?.data ? (
            <div className="space-y-6">
              {/* Mobile Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mobile-Friendliness Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-full flex items-center justify-center border-4 border-slate-100">
                      <span className="text-2xl font-bold">{mobileFriendliness.data.overallScore}</span>
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={mobileFriendliness.data.overallScore} 
                        className={`h-2 ${getScoreColor(mobileFriendliness.data.overallScore)}`} 
                      />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="border rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Tap Targets</span>
                        <span className="text-sm font-semibold">{mobileFriendliness.data.tapTargets.score}/100</span>
                      </div>
                      <Progress 
                        value={mobileFriendliness.data.tapTargets.score} 
                        className={`h-1 ${getScoreColor(mobileFriendliness.data.tapTargets.score)}`} 
                      />
                    </div>
                    <div className="border rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Content Sizing</span>
                        <span className="text-sm font-semibold">{mobileFriendliness.data.contentSizing.score}/100</span>
                      </div>
                      <Progress 
                        value={mobileFriendliness.data.contentSizing.score} 
                        className={`h-1 ${getScoreColor(mobileFriendliness.data.contentSizing.score)}`} 
                      />
                    </div>
                    <div className="border rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Text Readability</span>
                        <span className="text-sm font-semibold">{mobileFriendliness.data.textReadability.score}/100</span>
                      </div>
                      <Progress 
                        value={mobileFriendliness.data.textReadability.score} 
                        className={`h-1 ${getScoreColor(mobileFriendliness.data.textReadability.score)}`} 
                      />
                    </div>
                    <div className="border rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Viewport</span>
                        <Badge variant={mobileFriendliness.data.viewportConfiguration.hasViewport ? "default" : "destructive"}>
                          {mobileFriendliness.data.viewportConfiguration.hasViewport ? "Configured" : "Missing"}
                        </Badge>
                      </div>
                      <Progress 
                        value={mobileFriendliness.data.viewportConfiguration.hasViewport ? 100 : 0} 
                        className={`h-1 ${mobileFriendliness.data.viewportConfiguration.hasViewport ? "bg-green-500" : "bg-red-500"}`} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Issues */}
              {mobileFriendliness.data.issues?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Mobile Friendliness Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mobileFriendliness.data.issues.map((issue: any, idx: number) => (
                        <div key={idx} className="p-3 border rounded-md">
                          <div className="flex items-center">
                            <Badge className={`mr-2 ${getSeverityColor(issue.type)}`}>
                              {issue.type}
                            </Badge>
                            <h4 className="text-sm font-medium">{issue.description}</h4>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{issue.impact}</p>
                          <div className="mt-2 p-2 bg-slate-50 rounded-md">
                            <p className="text-sm"><span className="font-medium">Recommendation:</span> {issue.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Details */}
              <Accordion type="single" collapsible className="w-full">
                {/* Viewport Configuration */}
                <AccordionItem value="viewport">
                  <AccordionTrigger className="text-base">
                    Viewport Configuration
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Badge variant={mobileFriendliness.data.viewportConfiguration.hasViewport ? "default" : "destructive"} className="mr-2">
                          {mobileFriendliness.data.viewportConfiguration.hasViewport ? "Present" : "Missing"}
                        </Badge>
                        <span>Viewport Meta Tag</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={mobileFriendliness.data.viewportConfiguration.isResponsive ? "default" : "destructive"} className="mr-2">
                          {mobileFriendliness.data.viewportConfiguration.isResponsive ? "Yes" : "No"}
                        </Badge>
                        <span>Responsive Design</span>
                      </div>
                      {mobileFriendliness.data.viewportConfiguration.issues?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Issues:</p>
                          <ul className="list-disc list-inside text-sm">
                            {mobileFriendliness.data.viewportConfiguration.issues.map((issue: string, idx: number) => (
                              <li key={idx} className="text-muted-foreground">{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Tap Targets */}
                <AccordionItem value="taptargets">
                  <AccordionTrigger className="text-base">
                    Tap Targets
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-2">
                      Tap targets are interactive elements like buttons, links, and form fields that users tap on mobile devices.
                    </p>
                    {mobileFriendliness.data.tapTargets.issues?.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium">Issues:</p>
                        <ul className="list-disc list-inside text-sm">
                          {mobileFriendliness.data.tapTargets.issues.map((issue: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600">No tap target issues detected.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Content Sizing */}
                <AccordionItem value="contentsizing">
                  <AccordionTrigger className="text-base">
                    Content Sizing
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-2">
                      Content sizing evaluates how well your page content fits within the mobile viewport.
                    </p>
                    {mobileFriendliness.data.contentSizing.issues?.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium">Issues:</p>
                        <ul className="list-disc list-inside text-sm">
                          {mobileFriendliness.data.contentSizing.issues.map((issue: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600">No content sizing issues detected.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Text Readability */}
                <AccordionItem value="textreadability">
                  <AccordionTrigger className="text-base">
                    Text Readability
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-2">
                      Text readability measures how easy it is to read text on mobile devices.
                    </p>
                    {mobileFriendliness.data.textReadability.issues?.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium">Issues:</p>
                        <ul className="list-disc list-inside text-sm">
                          {mobileFriendliness.data.textReadability.issues.map((issue: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-green-600">No text readability issues detected.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    Mobile Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mobileFriendliness.data.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-1" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p>Failed to load mobile-friendliness analysis.</p>
              <Button 
                variant="outline" 
                onClick={() => refetchMobile()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Competitor Analysis</CardTitle>
              <CardDescription>
                Compare your page with competitors for the same keywords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    value={competitorAnalysisData.industry}
                    onChange={(e) => setCompetitorAnalysisData({
                      ...competitorAnalysisData,
                      industry: e.target.value
                    })}
                    placeholder="e.g. accounting, finance, tax"
                  />
                </div>
                <div>
                  <Label htmlFor="pageUrl">Page URL</Label>
                  <Input 
                    id="pageUrl" 
                    value={competitorAnalysisData.pageUrl}
                    onChange={(e) => setCompetitorAnalysisData({
                      ...competitorAnalysisData,
                      pageUrl: e.target.value
                    })}
                    placeholder="e.g. /services/tax-planning"
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Textarea 
                    id="keywords" 
                    value={competitorAnalysisData.keywords.join(', ')}
                    onChange={(e) => setCompetitorAnalysisData({
                      ...competitorAnalysisData,
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    })}
                    placeholder="e.g. tax planning, accounting services, small business tax"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleAnalyzeCompetitors}
                  disabled={competitorAnalysisMutation.isPending || competitorAnalysisData.keywords.length === 0}
                  className="w-full"
                >
                  {competitorAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze Competitors'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {competitorAnalysisMutation.data?.data && (
            <div className="space-y-6">
              {/* Competitor List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Competitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitorAnalysisMutation.data.data.competitors.map((competitor: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-base">{competitor.name}</h4>
                          {competitor.url && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 gap-1">
                                  <Globe className="h-3.5 w-3.5" />
                                  <span className="text-xs">{competitor.url}</span>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    This is a competitor website identified through SEO analysis.
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Note: This is an analytical tool only. Visit at your own discretion.
                                  </p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1 flex items-center">
                              <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1" />
                              Strengths
                            </h5>
                            <ul className="text-sm list-disc list-inside">
                              {competitor.strengths.map((strength: string, i: number) => (
                                <li key={i} className="text-muted-foreground text-xs">{strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1 flex items-center">
                              <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                              Weaknesses
                            </h5>
                            <ul className="text-sm list-disc list-inside">
                              {competitor.weaknesses.map((weakness: string, i: number) => (
                                <li key={i} className="text-muted-foreground text-xs">{weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {(competitor.keywordOverlap?.length > 0 || competitor.uniqueFactors?.length > 0) && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="grid grid-cols-2 gap-4">
                              {competitor.keywordOverlap?.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium mb-1 flex items-center">
                                    <Keyboard className="h-3.5 w-3.5 text-blue-500 mr-1" />
                                    Keyword Overlap
                                  </h5>
                                  <div className="flex flex-wrap gap-1">
                                    {competitor.keywordOverlap.map((keyword: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs px-1.5 py-0">{keyword}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {competitor.uniqueFactors?.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium mb-1 flex items-center">
                                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 mr-1" />
                                    Unique Factors
                                  </h5>
                                  <div className="flex flex-wrap gap-1">
                                    {competitor.uniqueFactors.map((factor: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0">{factor}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SWOT Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Competitive Position (SWOT Analysis)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-md">
                      <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {competitorAnalysisMutation.data.data.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm flex">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-md">
                      <h4 className="font-medium text-red-800 mb-2">Weaknesses</h4>
                      <ul className="space-y-1">
                        {competitorAnalysisMutation.data.data.weaknesses.map((weakness: string, idx: number) => (
                          <li key={idx} className="text-sm flex">
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">Opportunities</h4>
                      <ul className="space-y-1">
                        {competitorAnalysisMutation.data.data.opportunities.map((opportunity: string, idx: number) => (
                          <li key={idx} className="text-sm flex">
                            <Lightbulb className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {competitorAnalysisMutation.data.data.recommendations.map((recommendation: string, idx: number) => (
                          <li key={idx} className="text-sm flex">
                            <Share2 className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {seoSummary?.data?.competitorAnalysis?.competitors?.length > 0 && !competitorAnalysisMutation.data?.data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Previous Competitor Analysis</CardTitle>
                <CardDescription>
                  From your last analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoSummary.data.competitorAnalysis.competitors.slice(0, 3).map((competitor: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-md">
                      <h4 className="font-medium text-base mb-2">{competitor.name}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Strengths</h5>
                          <ul className="text-sm list-disc list-inside">
                            {competitor.strengths.map((strength: string, i: number) => (
                              <li key={i} className="text-muted-foreground text-xs">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-1">Weaknesses</h5>
                          <ul className="text-sm list-disc list-inside">
                            {competitor.weaknesses.map((weakness: string, i: number) => (
                              <li key={i} className="text-muted-foreground text-xs">{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAnalyzeCompetitors}
                    disabled={competitorAnalysisMutation.isPending}
                    className="w-full"
                  >
                    Refresh Competitor Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Default Instructions */}
          {!competitorAnalysisMutation.data?.data && !seoSummary?.data?.competitorAnalysis?.competitors?.length && (
            <div className="p-6 border border-dashed rounded-md text-center">
              <GanttChart className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Run a competitor analysis to see how your page stacks up against the competition.</p>
              <p className="text-sm text-muted-foreground mt-1">Enter your target keywords and industry above to get started.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSeoAnalysis;