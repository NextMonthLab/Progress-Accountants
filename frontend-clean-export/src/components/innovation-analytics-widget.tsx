import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Lightbulb, Users, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InnovationAnalytics {
  insightsSubmittedThisMonth: number;
  themesCreatedThisMonth: number;
  productIdeasGeneratedThisMonth: number;
  productIdeasActionedPercentage: number;
  topContributors: Array<{
    userId: string;
    userName: string;
    insightsSubmitted: number;
  }>;
}

interface InnovationAnalyticsWidgetProps {
  tenantId: string;
  userId?: number;
}

export function InnovationAnalyticsWidget({ tenantId, userId }: InnovationAnalyticsWidgetProps) {
  const { data: analytics, isLoading, error } = useQuery<InnovationAnalytics>({
    queryKey: ['/api/ai/innovation-analytics', tenantId, userId],
    queryFn: async () => {
      const params = new URLSearchParams({ tenantId });
      if (userId) params.append('userId', userId.toString());
      
      const response = await fetch(`/api/ai/innovation-analytics?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch innovation analytics');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Innovation Analytics Unavailable</CardTitle>
          <CardDescription>
            Unable to load innovation metrics. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasActivity = analytics && (
    analytics.insightsSubmittedThisMonth > 0 ||
    analytics.themesCreatedThisMonth > 0 ||
    analytics.productIdeasGeneratedThisMonth > 0
  );

  if (!hasActivity) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Innovation Activity This Month
          </CardTitle>
          <CardDescription>
            Track your innovation progress and idea implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-2xl font-semibold text-muted-foreground">
              Get started building your Innovation Feed!
            </div>
            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              Submit Insights → Create Themes → Generate Ideas → Track Actions → Watch your business evolve.
            </div>
            <Badge variant="outline" className="mt-4">
              No activity yet this month
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Innovation Activity This Month
        </CardTitle>
        <CardDescription>
          Your innovation pipeline progress and team contributions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              Insights Submitted
            </div>
            <div className="text-2xl font-bold">{analytics?.insightsSubmittedThisMonth || 0}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Themes Created
            </div>
            <div className="text-2xl font-bold">{analytics?.themesCreatedThisMonth || 0}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Product Ideas Generated
            </div>
            <div className="text-2xl font-bold">{analytics?.productIdeasGeneratedThisMonth || 0}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              % Ideas Actioned
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{analytics?.productIdeasActionedPercentage || 0}%</div>
              {(analytics?.productIdeasActionedPercentage || 0) >= 80 && (
                <Badge variant="default" className="text-xs">Excellent</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Rate Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Idea Implementation Rate</span>
            <span className="font-medium">{analytics?.productIdeasActionedPercentage || 0}%</span>
          </div>
          <Progress 
            value={analytics?.productIdeasActionedPercentage || 0} 
            className="h-2"
          />
        </div>

        {/* Top Contributors */}
        {analytics?.topContributors && analytics.topContributors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Top Contributors
            </div>
            <div className="space-y-2">
              {analytics.topContributors.slice(0, 5).map((contributor, index) => (
                <div key={contributor.userId} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{contributor.userName}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {contributor.insightsSubmitted} insight{contributor.insightsSubmitted !== 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Innovation Velocity Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Innovation Velocity</span>
            <div className="flex items-center gap-2">
              {(analytics?.insightsSubmittedThisMonth || 0) >= 5 ? (
                <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                  High Activity
                </Badge>
              ) : (analytics?.insightsSubmittedThisMonth || 0) >= 2 ? (
                <Badge variant="secondary" className="text-xs">
                  Moderate Activity
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Getting Started
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}