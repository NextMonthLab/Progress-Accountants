import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, X, AlertTriangle, Lightbulb, Globe, PieChart, Tag } from 'lucide-react';

interface EnhancedSeoAnalysisProps {
  pageId: number;
}

export const EnhancedSeoAnalysis: React.FC<EnhancedSeoAnalysisProps> = ({ pageId }) => {
  const { toast } = useToast();
  const [seoData, setSeoData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [generatingRecommendations, setGeneratingRecommendations] = useState<boolean>(false);

  // Fetch SEO summary data
  const fetchSeoSummary = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        'GET',
        `/api/enhanced-seo/pages/${pageId}/summary`
      );

      const data = await response.json();
      if (data.success) {
        setSeoData(data.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error fetching SEO data',
          description: data.message || 'An unknown error occurred',
        });
      }
    } catch (error) {
      console.error('Failed to fetch SEO summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching SEO data',
        description: 'Could not connect to the server',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate new SEO recommendations
  const generateRecommendations = async () => {
    setGeneratingRecommendations(true);
    try {
      const response = await apiRequest(
        'POST',
        `/api/enhanced-seo/pages/${pageId}/recommendations/generate`
      );

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Recommendations Generated',
          description: `${data.data.count} new recommendations generated.`,
        });
        fetchSeoSummary(); // Refresh data
      } else {
        toast({
          variant: 'destructive',
          title: 'Error generating recommendations',
          description: data.message || 'An unknown error occurred',
        });
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not connect to the server',
      });
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  // Apply a recommendation
  const applyRecommendation = async (recommendationId: number) => {
    try {
      const response = await apiRequest(
        'POST',
        `/api/enhanced-seo/recommendations/${recommendationId}/apply`
      );

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Recommendation Applied',
          description: 'SEO changes have been applied to the page.',
        });
        fetchSeoSummary(); // Refresh data
      } else {
        toast({
          variant: 'destructive',
          title: 'Error applying recommendation',
          description: data.message || 'An unknown error occurred',
        });
      }
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not apply the recommendation',
      });
    }
  };

  // Dismiss a recommendation
  const dismissRecommendation = async (recommendationId: number) => {
    try {
      const response = await apiRequest(
        'POST',
        `/api/enhanced-seo/recommendations/${recommendationId}/dismiss`
      );

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Recommendation Dismissed',
          description: 'This recommendation will no longer appear.',
        });
        fetchSeoSummary(); // Refresh data
      } else {
        toast({
          variant: 'destructive',
          title: 'Error dismissing recommendation',
          description: data.message || 'An unknown error occurred',
        });
      }
    } catch (error) {
      console.error('Failed to dismiss recommendation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not dismiss the recommendation',
      });
    }
  };

  // Analyze competitors for keywords
  const analyzeCompetitors = async () => {
    if (!seoData?.pageInfo?.seo?.primaryKeyword) {
      toast({
        variant: 'destructive',
        title: 'Missing Primary Keyword',
        description: 'Set a primary keyword for this page first',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(
        'POST',
        `/api/enhanced-seo/competitor-analysis`,
        {
          keywords: [
            seoData.pageInfo.seo.primaryKeyword,
            ...(seoData.pageInfo.seo.keywords || []).slice(0, 2),
          ],
          industry: 'accounting',
          pageUrl: seoData.pageInfo.slug,
        }
      );

      const data = await response.json();
      if (data.success) {
        setSeoData({
          ...seoData,
          competitorAnalysis: data.data,
        });
        toast({
          title: 'Competitor Analysis Complete',
          description: 'Check the Competitors tab for results',
        });
        setActiveTab('competitors');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error analyzing competitors',
          description: data.message || 'An unknown error occurred',
        });
      }
    } catch (error) {
      console.error('Failed to analyze competitors:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not analyze competitors',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (pageId) {
      fetchSeoSummary();
    }
  }, [pageId]);

  // Helper function to render priority badge
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <Badge variant="destructive" className="ml-2">
            Critical
          </Badge>
        );
      case 'important':
        return (
          <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200">
            Important
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="ml-2">
            Minor
          </Badge>
        );
    }
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  if (loading && !seoData) {
    return (
      <div className="p-8 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading SEO analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Overall SEO Score Card */}
      {seoData && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>SEO Analysis</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={fetchSeoSummary}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Refresh
                </Button>
                <Button 
                  variant="default"
                  onClick={generateRecommendations}
                  disabled={generatingRecommendations}
                >
                  {generatingRecommendations ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                  Generate Recommendations
                </Button>
              </div>
            </div>
            <CardDescription>
              SEO score and detailed analysis for {seoData.pageInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 bg-muted rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1 tracking-tighter">
                    <span className={getScoreColor(seoData.seoScore.overallScore)}>
                      {seoData.seoScore.overallScore}/100
                    </span>
                  </div>
                  <div className="text-muted-foreground text-sm">Overall SEO Score</div>
                  <Progress 
                    className="mt-2" 
                    value={seoData.seoScore.overallScore} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Title</div>
                    <div className="text-sm font-medium">
                      {seoData.seoScore.categoryScores.titleScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Description</div>
                    <div className="text-sm font-medium">
                      {seoData.seoScore.categoryScores.descriptionScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Keywords</div>
                    <div className="text-sm font-medium">
                      {seoData.seoScore.categoryScores.keywordScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Content</div>
                    <div className="text-sm font-medium">
                      {seoData.seoScore.categoryScores.contentScore}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">
                  Quick Info
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-32">Primary Keyword:</span>
                    <span className="font-medium">
                      {seoData.pageInfo.seo?.primaryKeyword || 'Not set'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">SEO Title:</span>
                    <span className="font-medium truncate max-w-md">
                      {seoData.pageInfo.seo?.title || 'Not set'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">Meta Description:</span>
                    <span className="font-medium truncate max-w-md">
                      {seoData.pageInfo.seo?.description ? 
                        (seoData.pageInfo.seo.description.length > 60 ? 
                          seoData.pageInfo.seo.description.substring(0, 60) + '...' : 
                          seoData.pageInfo.seo.description) : 
                        'Not set'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">Secondary Keywords:</span>
                    <span className="font-medium truncate max-w-md">
                      {seoData.pageInfo.seo?.keywords && seoData.pageInfo.seo.keywords.length ? 
                        seoData.pageInfo.seo.keywords.join(', ') : 
                        'None set'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-32">Top Issues:</span>
                    <span className="font-medium">
                      {seoData.recommendations && seoData.recommendations.length ? 
                        `${seoData.recommendations.length} issues found` : 
                        'No critical issues'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Analysis Tabs */}
      {seoData && (
        <Tabs
          defaultValue="summary"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="summary">Recommendations</TabsTrigger>
            <TabsTrigger value="keywords">
              Keyword Analysis
            </TabsTrigger>
            <TabsTrigger value="mobile">
              Mobile-Friendliness
            </TabsTrigger>
            <TabsTrigger value="competitors">
              Competitors
            </TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="summary" className="space-y-4">
            {seoData.recommendations && seoData.recommendations.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {seoData.recommendations.map((rec: any, index: number) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center">
                        <span>{rec.title}</span>
                        {renderPriorityBadge(rec.priority)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 text-muted-foreground text-sm">
                        {rec.description}
                      </div>
                      <div className="flex space-x-2 mt-2">
                        {rec.implementationDetails && 
                         (rec.implementationDetails.title || 
                          rec.implementationDetails.description || 
                          rec.implementationDetails.keywords) ? (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => applyRecommendation(rec.id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Apply
                          </Button>
                        ) : null}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => dismissRecommendation(rec.id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Dismiss
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center p-8">
                <div className="bg-muted inline-flex rounded-full p-4 mb-4">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-medium text-lg">No Active Recommendations</h3>
                <p className="text-muted-foreground">
                  Your page doesn't have any active SEO recommendations at this time.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={generateRecommendations}
                  disabled={generatingRecommendations}
                >
                  {generatingRecommendations ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                  Generate New Recommendations
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Keyword Analysis Tab */}
          <TabsContent value="keywords" className="space-y-4">
            {seoData.keywordAnalysis ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Keyword Analysis</CardTitle>
                    <CardDescription>
                      Analysis of your primary keyword "{seoData.keywordAnalysis.primaryKeyword.keyword}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Occurrences</div>
                        <div className="text-2xl font-semibold">
                          {seoData.keywordAnalysis.primaryKeyword.count}
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Keyword Density</div>
                        <div className="text-2xl font-semibold">
                          {(seoData.keywordAnalysis.primaryKeyword.density * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Total Words</div>
                        <div className="text-2xl font-semibold">
                          {seoData.keywordAnalysis.totalWords}
                        </div>
                      </div>
                    </div>

                    {/* Warnings or issues */}
                    {seoData.keywordAnalysis.overuseWarnings.length > 0 && (
                      <Alert variant="warning" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Keyword Overuse Warning</AlertTitle>
                        <AlertDescription>
                          {seoData.keywordAnalysis.overuseWarnings[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Related keywords suggestions */}
                    {seoData.keywordAnalysis.relatedKeywords.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Related Keywords to Consider</h4>
                        <div className="flex flex-wrap gap-2">
                          {seoData.keywordAnalysis.relatedKeywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" /> {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Secondary Keywords */}
                {seoData.keywordAnalysis.secondaryKeywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Secondary Keywords</CardTitle>
                      <CardDescription>
                        Analysis of your secondary keywords and their usage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        {seoData.keywordAnalysis.secondaryKeywords.map((keyword: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className="flex items-center space-x-4">
                              <div className="text-sm text-muted-foreground">
                                <span className="font-semibold">{keyword.count}</span> occurrences
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span className="font-semibold">{(keyword.density * 100).toFixed(2)}%</span> density
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {seoData.keywordAnalysis.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Keyword Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {seoData.keywordAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading keyword analysis...</p>
              </div>
            )}
          </TabsContent>

          {/* Mobile-Friendliness Tab */}
          <TabsContent value="mobile" className="space-y-4">
            {seoData.mobileFriendliness ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Mobile-Friendliness Score</CardTitle>
                      <div className={`text-2xl font-bold ${getScoreColor(seoData.mobileFriendliness.overallScore)}`}>
                        {seoData.mobileFriendliness.overallScore}/100
                      </div>
                    </div>
                    <CardDescription>
                      Analysis of how well your page performs on mobile devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tap Targets</span>
                          <span className={`font-medium ${getScoreColor(seoData.mobileFriendliness.tapTargets.score)}`}>
                            {seoData.mobileFriendliness.tapTargets.score}/100
                          </span>
                        </div>
                        <Progress value={seoData.mobileFriendliness.tapTargets.score} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Content Sizing</span>
                          <span className={`font-medium ${getScoreColor(seoData.mobileFriendliness.contentSizing.score)}`}>
                            {seoData.mobileFriendliness.contentSizing.score}/100
                          </span>
                        </div>
                        <Progress value={seoData.mobileFriendliness.contentSizing.score} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Text Readability</span>
                          <span className={`font-medium ${getScoreColor(seoData.mobileFriendliness.textReadability.score)}`}>
                            {seoData.mobileFriendliness.textReadability.score}/100
                          </span>
                        </div>
                        <Progress value={seoData.mobileFriendliness.textReadability.score} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Viewport Configuration</span>
                          <span className={`font-medium ${seoData.mobileFriendliness.viewportConfiguration.hasViewport ? 'text-green-500' : 'text-red-500'}`}>
                            {seoData.mobileFriendliness.viewportConfiguration.hasViewport ? 'Properly Configured' : 'Missing Configuration'}
                          </span>
                        </div>
                        <Progress value={seoData.mobileFriendliness.viewportConfiguration.hasViewport ? 100 : 0} />
                      </div>
                    </div>

                    {/* Mobile issues */}
                    {seoData.mobileFriendliness.issues.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Detected Issues</h4>
                        <Accordion type="single" collapsible className="w-full">
                          {seoData.mobileFriendliness.issues.map((issue: any, index: number) => (
                            <AccordionItem value={`mobile-issue-${index}`} key={index}>
                              <AccordionTrigger className="text-left">
                                <div className="flex items-center">
                                  <span>{issue.description}</span>
                                  <Badge 
                                    variant={issue.type === 'critical' ? 'destructive' : 
                                             issue.type === 'major' ? 'warning' : 'secondary'} 
                                    className="ml-2"
                                  >
                                    {issue.type}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="p-2">
                                  <div className="mb-2">
                                    <span className="text-sm font-medium">Impact: </span>
                                    <span className="text-sm">{issue.impact}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Recommendation: </span>
                                    <span className="text-sm">{issue.recommendation}</span>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mobile Recommendations */}
                {seoData.mobileFriendliness.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations for Mobile Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {seoData.mobileFriendliness.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Globe className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading mobile-friendliness analysis...</p>
              </div>
            )}
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-4">
            {seoData.competitorAnalysis ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Competitor Analysis</CardTitle>
                    <CardDescription>
                      Analysis of your competitors for the keyword: "{seoData.pageInfo.seo?.primaryKeyword || 'None set'}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {seoData.competitorAnalysis.competitors && 
                     seoData.competitorAnalysis.competitors.length > 0 ? (
                      <div className="space-y-4">
                        {seoData.competitorAnalysis.competitors.map((competitor: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{competitor.name}</h4>
                                <a 
                                  href={competitor.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  {competitor.url}
                                </a>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div>
                                <h5 className="text-sm font-medium mb-1">Strengths</h5>
                                <ul className="text-sm space-y-1">
                                  {competitor.strengths?.map((strength: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                      <span className="mr-2 text-green-500">+</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium mb-1">Weaknesses</h5>
                                <ul className="text-sm space-y-1">
                                  {competitor.weaknesses?.map((weakness: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                      <span className="mr-2 text-red-500">-</span>
                                      <span>{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No competitor data available</p>
                        <Button 
                          onClick={analyzeCompetitors}
                          className="mt-4"
                          disabled={!seoData?.pageInfo?.seo?.primaryKeyword}
                        >
                          <PieChart className="h-4 w-4 mr-2" />
                          Analyze Competitors
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Competitor Content Recommendations */}
                {seoData.competitorAnalysis.recommendations && 
                seoData.competitorAnalysis.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content Strategy Recommendations</CardTitle>
                      <CardDescription>
                        Content ideas to help outrank your competitors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {seoData.competitorAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <p className="mb-4">No competitor analysis data available yet</p>
                <Button 
                  onClick={analyzeCompetitors}
                  disabled={!seoData?.pageInfo?.seo?.primaryKeyword}
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Analyze Competitors
                </Button>
                {!seoData?.pageInfo?.seo?.primaryKeyword && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You need to set a primary keyword first
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};