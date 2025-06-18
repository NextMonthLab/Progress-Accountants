import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InnovationAnalyticsWidget } from "@/components/innovation-analytics-widget";
import { TrendingUp, Brain, Rocket, Users, ArrowRight, Lightbulb, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function AdminInnovationDashboard() {
  // Get tenant ID for the current context
  const tenantId = "00000000-0000-0000-0000-000000000000";

  const { data: insightCapacity } = useQuery({
    queryKey: ['/api/insight-app/capacity'],
    queryFn: async () => {
      const response = await fetch('/api/insight-app/capacity');
      if (!response.ok) return null;
      return response.json();
    },
  });

  const { data: recentFeedItems } = useQuery({
    queryKey: ['/api/ai/innovation-feed', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/ai/innovation-feed?tenantId=${tenantId}&limit=5`);
      if (!response.ok) return [];
      return response.json();
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Innovation Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your innovation pipeline and track business intelligence metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/smartsite/innovation-feed">
            <Button variant="outline" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Innovation Feed
            </Button>
          </Link>
          <Link href="/admin/smartsite">
            <Button className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              SmartSite Control Room
            </Button>
          </Link>
        </div>
      </div>

      {/* Innovation Analytics Widget - Primary Display */}
      <div className="grid gap-6">
        <InnovationAnalyticsWidget tenantId={tenantId} />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Insight App Capacity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              User Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {insightCapacity?.currentUsers || 0}
                </span>
                <Badge variant="secondary">
                  of {insightCapacity?.maxUsers || 'unlimited'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Active Insight App users
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Innovation Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {recentFeedItems?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Recent innovation feed items
              </div>
              {recentFeedItems && recentFeedItems.length > 0 && (
                <Link href="/admin/smartsite/innovation-feed">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Feed <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Innovation Pipeline Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              Pipeline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">System Status</span>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  Active
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Innovation pipeline operational
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Innovation Feed Preview */}
      {recentFeedItems && recentFeedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Recent Innovation Feed
            </CardTitle>
            <CardDescription>
              Latest insights and ideas from your innovation pipeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedItems.slice(0, 3).map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.type === 'insight' && <Lightbulb className="h-4 w-4 text-primary" />}
                  {item.type === 'theme' && <Target className="h-4 w-4 text-primary" />}
                  {item.type === 'product_idea' && <Rocket className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {item.type?.replace('_', ' ') || 'Innovation'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt || item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">
                    {item.title || item.content || 'Innovation item'}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link href="/admin/smartsite/innovation-feed">
                <Button variant="outline" className="w-full">
                  View All Innovation Feed Items <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Getting Started Guide (shown when no activity) */}
      {(!recentFeedItems || recentFeedItems.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Get Started with Innovation Pipeline
            </CardTitle>
            <CardDescription>
              Launch your innovation journey with these simple steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">1. Submit Your First Insight</h4>
                <p className="text-sm text-muted-foreground">
                  Start by submitting business insights from customer feedback, internal observations, or market research.
                </p>
                <Link href="/admin/smartsite/innovation-feed">
                  <Button size="sm" variant="outline">
                    Submit Insight <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">2. Generate Product Ideas</h4>
                <p className="text-sm text-muted-foreground">
                  Use AI to analyze insights and create actionable product ideas that drive business growth.
                </p>
                <Link href="/admin/smartsite/innovation-feed">
                  <Button size="sm" variant="outline">
                    Explore AI Tools <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}