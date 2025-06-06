import { useState, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Medal, TrendingUp, BarChart3, Award, Loader2, Edit3, Share2, Brain, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';
import { aiGateway } from '@/services/ai-gateway';
import { useToast } from '@/hooks/use-toast';

// Define the types we're using in this component
type LeaderboardEntry = {
  userId: number;
  displayName: string;
  role?: string;
  count: number;
};

type InsightSummary = {
  id: number;
  tenantId: string;
  summaryType: string;
  startDate: string;
  endDate: string;
  themes: string[];
  topInsights: { id: number; reason: string }[];
  aiSummary: string;
  createdAt: string;
};

type ActivityData = {
  date: string;
  count: number;
};

// Loader component to ensure consistent loading state
function LoadingSpinner() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function InsightsDashboardContent() {
  const [period, setPeriod] = useState('week');
  const [isPending, startTransition] = useTransition();
  const [, setLocation] = useLocation();

  // Function to navigate to content generators with preloaded insight
  const generateBlogPost = (insight: string, title?: string) => {
    const params = new URLSearchParams();
    params.set('prompt', insight);
    if (title) params.set('title', title);
    setLocation(`/admin/content/blog-posts?${params.toString()}`);
  };

  const generateSocialPost = (insight: string) => {
    const params = new URLSearchParams();
    params.set('prompt', insight);
    setLocation(`/admin/content/social-posts?${params.toString()}`);
  };
  
  // Use React Query without suspense option to avoid React 18 suspension issues
  const { data: leaderboard, isLoading: loadingLeaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/insights/leaderboard', period],
    queryFn: async () => {
      const res = await fetch(`/api/insights/leaderboard?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
  
  const { data: weeklySummary, isLoading: loadingWeeklySummary } = useQuery<InsightSummary[]>({
    queryKey: ['/api/insights/summaries', 'weekly'],
    queryFn: async () => {
      const res = await fetch('/api/insights/summaries?type=weekly');
      if (!res.ok) throw new Error('Failed to fetch weekly summary');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
  
  const { data: monthlySummary, isLoading: loadingMonthlySummary } = useQuery<InsightSummary[]>({
    queryKey: ['/api/insights/summaries', 'monthly'],
    queryFn: async () => {
      const res = await fetch('/api/insights/summaries?type=monthly');
      if (!res.ok) throw new Error('Failed to fetch monthly summary');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
  
  const { data: activityData, isLoading: loadingActivity } = useQuery<ActivityData[]>({
    queryKey: ['/api/insights/activity'],
    queryFn: async () => {
      const res = await fetch('/api/insights/activity');
      if (!res.ok) throw new Error('Failed to fetch activity data');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
  
  // Safely process the activity data with null checks
  const formattedActivityData = activityData?.map(item => ({
    date: format(parseISO(item.date), 'MMM d'),
    count: item.count
  })) || [];
  
  const latestWeeklySummary = weeklySummary && weeklySummary.length > 0 ? weeklySummary[0] : null;
  const latestMonthlySummary = monthlySummary && monthlySummary.length > 0 ? monthlySummary[0] : null;
  
  // Check if we have any data at all
  const hasAnyData = (leaderboard && leaderboard.length > 0) || 
                     (activityData && activityData.length > 0) || 
                     latestWeeklySummary || 
                     latestMonthlySummary;

  // If no data exists and we're not loading, show empty state
  if (!hasAnyData && !loadingLeaderboard && !loadingActivity && !loadingWeeklySummary && !loadingMonthlySummary) {
    return (
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Insights Dashboard</h1>
        </div>
        
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Welcome to Insights Dashboard</CardTitle>
            <CardDescription>
              Start collecting visitor insights to see analytics, leaderboards, and AI-generated summaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Set up insight collection</h4>
                  <p className="text-sm text-muted-foreground">Configure your website to start collecting visitor insights and feedback</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Add insight users</h4>
                  <p className="text-sm text-muted-foreground">Invite team members to contribute insights and participate in the leaderboard</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Generate AI summaries</h4>
                  <p className="text-sm text-muted-foreground">Once data is collected, AI will generate weekly and monthly insight summaries</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={() => setLocation('/admin/setup')} className="bg-blue-600 hover:bg-blue-700">
                Get Started with Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Insights Dashboard</h1>
      </div>
      
      {/* Leaderboard Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Contributor Leaderboard
          </h2>
          
          <div className="flex bg-muted rounded-md p-1">
            <button
              className={`px-3 py-1 text-sm rounded-md ${period === 'day' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => startTransition(() => setPeriod('day'))}
              disabled={isPending && period !== 'day'}
            >
              {isPending && period === 'day' ? (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Daily
                </span>
              ) : "Daily"}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${period === 'week' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => startTransition(() => setPeriod('week'))}
              disabled={isPending && period !== 'week'}
            >
              {isPending && period === 'week' ? (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Weekly
                </span>
              ) : "Weekly"}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => startTransition(() => setPeriod('month'))}
              disabled={isPending && period !== 'month'}
            >
              {isPending && period === 'month' ? (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Monthly
                </span>
              ) : "Monthly"}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingLeaderboard ? (
            <div className="col-span-full">
              <LoadingSpinner />
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((item, index) => (
              <Card key={item.userId} className={index === 0 ? 'border-amber-500 border-2' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span className="truncate">{item.displayName}</span>
                    {index === 0 && <Medal className="h-5 w-5 text-amber-500" />}
                  </CardTitle>
                  {item.role && (
                    <CardDescription>{item.role}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">{item.count}</span>
                    <span className="text-sm text-muted-foreground">
                      insights {period === 'day' ? 'today' : period === 'week' ? 'this week' : 'this month'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-muted-foreground">
              No insights have been submitted in this period
            </div>
          )}
        </div>
      </div>
      
      {/* Activity Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Insight Activity (Last 30 Days)
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            {loadingActivity ? (
              <LoadingSpinner />
            ) : formattedActivityData && formattedActivityData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip 
                      formatter={(value: any) => [`${value} insights`, 'Count']}
                      labelFormatter={(label: any) => `Date: ${label}`}
                    />
                    <Bar dataKey="count" fill="#3f83f8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No Activity Data Yet</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Activity data will appear here once your team starts submitting insights and visitor interactions begin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* AI Summaries */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
          AI-Generated Summaries
        </h2>
        
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly Insights</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly">
            {loadingWeeklySummary ? (
              <LoadingSpinner />
            ) : latestWeeklySummary ? (
              <AiSummaryCard 
                summary={latestWeeklySummary} 
                onGenerateBlogPost={generateBlogPost}
                onGenerateSocialPost={generateSocialPost}
              />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No weekly summaries available yet
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monthly">
            {loadingMonthlySummary ? (
              <LoadingSpinner />
            ) : latestMonthlySummary ? (
              <AiSummaryCard 
                summary={latestMonthlySummary} 
                onGenerateBlogPost={generateBlogPost}
                onGenerateSocialPost={generateSocialPost}
              />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No monthly summaries available yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AiSummaryCard({ 
  summary, 
  onGenerateBlogPost, 
  onGenerateSocialPost 
}: { 
  summary: InsightSummary;
  onGenerateBlogPost: (insight: string, title?: string) => void;
  onGenerateSocialPost: (insight: string) => void;
}) {
  const formattedStartDate = format(parseISO(summary.startDate), 'MMM d, yyyy');
  const formattedEndDate = format(parseISO(summary.endDate), 'MMM d, yyyy');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{summary.summaryType === 'weekly' ? 'Weekly' : 'Monthly'} Summary</span>
          <span className="text-sm font-normal text-muted-foreground">
            {formattedStartDate} - {formattedEndDate}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Key Themes</h3>
            <div className="flex flex-wrap gap-2">
              {summary.themes.map((theme, i) => (
                <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {theme}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Top Insights</h3>
            <div className="space-y-2">
              {summary.topInsights.map((insight, i) => (
                <div key={i} className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground mb-2">{insight.reason}</div>
                  <TooltipProvider>
                    <div className="flex gap-2">
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50"
                            onClick={() => onGenerateBlogPost(insight.reason, `Insight: ${insight.reason.substring(0, 50)}...`)}
                          >
                            <Edit3 className="h-3 w-3 mr-1 text-cyan-600" />
                            Write a Post
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Turn this insight into a new blog post</p>
                        </TooltipContent>
                      </UITooltip>
                      
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50"
                            onClick={() => onGenerateSocialPost(insight.reason)}
                          >
                            <Share2 className="h-3 w-3 mr-1 text-cyan-600" />
                            Create Social Snippet
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Convert to social post</p>
                        </TooltipContent>
                      </UITooltip>
                    </div>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-muted-foreground">{summary.aiSummary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}