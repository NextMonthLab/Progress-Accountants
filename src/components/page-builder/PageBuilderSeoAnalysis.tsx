import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, ArrowUpCircle, XCircle, Lightbulb } from 'lucide-react';

interface PageBuilderSeoAnalysisProps {
  pageId: number;
}

export const PageBuilderSeoAnalysis: React.FC<PageBuilderSeoAnalysisProps> = ({ pageId }) => {
  const { toast } = useToast();
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Get SEO score
  const { 
    data: seoScore, 
    isLoading: scoreLoading,
    isError: scoreError,
    refetch: refetchScore
  } = useQuery({
    queryKey: [`/api/page-builder/pages/${pageId}/seo-score`],
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string).then(res => res.json()),
    enabled: !!pageId,
  });

  // Get SEO recommendations
  const {
    data: recommendations,
    isLoading: recommendationsLoading,
    isError: recommendationsError,
    refetch: refetchRecommendations
  } = useQuery({
    queryKey: [`/api/page-builder/pages/${pageId}/recommendations`],
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string).then(res => res.json()),
    enabled: !!pageId && showRecommendations,
  });

  // Generate recommendations
  const generateMutation = useMutation({
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
      refetchRecommendations();
      setShowRecommendations(true);
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
  const applyMutation = useMutation({
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
      refetchRecommendations();
      refetchScore();
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
  const dismissMutation = useMutation({
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
      refetchRecommendations();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Dismiss Recommendation',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  });

  // Get SEO score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get priority badge variant - valid variants: 'default' | 'destructive' | 'outline' | 'secondary'
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

  // Function to render type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'title':
        return <ArrowUpCircle className="h-4 w-4 mr-1" />;
      case 'description':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'keywords':
        return <Lightbulb className="h-4 w-4 mr-1" />;
      default:
        return <CheckCircle className="h-4 w-4 mr-1" />;
    }
  };

  const handleGenerateRecommendations = () => {
    generateMutation.mutate();
  };

  const handleApplyRecommendation = (id: number) => {
    applyMutation.mutate(id);
  };

  const handleDismissRecommendation = (id: number) => {
    dismissMutation.mutate(id);
  };

  // Render loading state
  if (scoreLoading) {
    return (
      <div className="space-y-4 p-4 border-t">
        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // Render error state
  if (scoreError) {
    return (
      <div className="space-y-4 p-4 border-t">
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <p>Failed to load SEO analysis. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 border-t">
      {/* SEO Score */}
      {seoScore?.data && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO Score</h3>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full flex items-center justify-center border-4 border-slate-100">
              <span className="text-xl font-bold">{seoScore.data.overallScore}</span>
            </div>
            <div className="flex-1">
              <Progress 
                value={seoScore.data.overallScore} 
                className={`h-2 ${getScoreColor(seoScore.data.overallScore)}`} 
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
            {Object.entries(seoScore.data.categoryScores).map(([category, score]) => (
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

      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">SEO Recommendations</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateRecommendations}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? 'Generating...' : 'Generate Recommendations'}
          </Button>
        </div>

        {showRecommendations && (
          <div className="space-y-4">
            {recommendationsLoading ? (
              <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
            ) : recommendations?.data?.length > 0 ? (
              recommendations.data.map((rec: any) => (
                <Card key={rec.id} className="p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {getTypeIcon(rec.type)}
                      <span className="font-medium capitalize">{rec.type}</span>
                      <Badge variant={getPriorityVariant(rec.severity)} className="ml-2">
                        {rec.severity}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDismissRecommendation(rec.id)}
                        disabled={dismissMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                      {rec.autoFixAvailable && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApplyRecommendation(rec.id)}
                          disabled={applyMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2">{rec.message}</p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {rec.details && <p>{rec.details}</p>}
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-4 border rounded text-center">
                <p>No recommendations available. Generate recommendations to improve your SEO score.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBuilderSeoAnalysis;