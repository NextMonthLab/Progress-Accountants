import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import { Loader2, BarChart3, Award, TrendingUp, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Types
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

// Loader component
function DashboardLoader() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading insights data...</p>
      </div>
    </div>
  );
}

// Summary card component
function AiSummaryCard({ summary }: { summary: InsightSummary }) {
  if (!summary) return null;
  
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
                  <div className="text-sm text-muted-foreground">{insight.reason}</div>
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

// Main dashboard component
export default function InsightsDashboardPage() {
  const [period, setPeriod] = useState('week');
  
  // Use separate queries with explicit loading states
  const { 
    data: leaderboard, 
    isLoading: loadingLeaderboard, 
    error: leaderboardError 
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/insights/leaderboard', period],
    queryFn: async () => {
      const res = await fetch(`/api/insights/leaderboard?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
  
  const { 
    data: weeklySummary, 
    isLoading: loadingWeeklySummary 
  } = useQuery<InsightSummary[]>({
    queryKey: ['/api/insights/summaries', 'weekly'],
    queryFn: async () => {
      const res = await fetch('/api/insights/summaries?type=weekly');
      if (!res.ok) throw new Error('Failed to fetch weekly summary');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
  
  const { 
    data: monthlySummary, 
    isLoading: loadingMonthlySummary 
  } = useQuery<InsightSummary[]>({
    queryKey: ['/api/insights/summaries', 'monthly'],
    queryFn: async () => {
      const res = await fetch('/api/insights/summaries?type=monthly');
      if (!res.ok) throw new Error('Failed to fetch monthly summary');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
  
  const { 
    data: activityData, 
    isLoading: loadingActivity 
  } = useQuery<ActivityData[]>({
    queryKey: ['/api/insights/activity'],
    queryFn: async () => {
      const res = await fetch('/api/insights/activity');
      if (!res.ok) throw new Error('Failed to fetch activity data');
      return await res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
  
  // Check if all data is loading
  const isInitialLoading = loadingLeaderboard && loadingWeeklySummary && loadingMonthlySummary && loadingActivity;
  if (isInitialLoading) {
    return (
      <AdminLayout>
        <DashboardLoader />
      </AdminLayout>
    );
  }
  
  // Process data 
  const formattedActivityData = activityData?.map(item => ({
    date: format(parseISO(item.date), 'MMM d'),
    count: item.count
  })) || [];
  
  const latestWeeklySummary = weeklySummary && weeklySummary.length > 0 ? weeklySummary[0] : null;
  const latestMonthlySummary = monthlySummary && monthlySummary.length > 0 ? monthlySummary[0] : null;
  
  // Render dashboard content
  return (
    <AdminLayout>
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
                onClick={() => setPeriod('day')}
                disabled={loadingLeaderboard}
              >
                {loadingLeaderboard && period === 'day' ? (
                  <span className="flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Daily
                  </span>
                ) : "Daily"}
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${period === 'week' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setPeriod('week')}
                disabled={loadingLeaderboard}
              >
                {loadingLeaderboard && period === 'week' ? (
                  <span className="flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Weekly
                  </span>
                ) : "Weekly"}
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setPeriod('month')}
                disabled={loadingLeaderboard}
              >
                {loadingLeaderboard && period === 'month' ? (
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
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
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
            ) : leaderboardError ? (
              <div className="col-span-full text-center py-6 text-destructive">
                Error loading leaderboard data. Please try again.
              </div>
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
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : formattedActivityData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip 
                        formatter={(value: any) => [`${value} insights`, 'Count']}
                        labelFormatter={(label: any) => `Date: ${label}`}
                      />
                      <Bar dataKey="count" fill="#3f83f8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No activity data available
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
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : latestWeeklySummary ? (
                <AiSummaryCard summary={latestWeeklySummary} />
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No weekly summaries available yet
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="monthly">
              {loadingMonthlySummary ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : latestMonthlySummary ? (
                <AiSummaryCard summary={latestMonthlySummary} />
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No monthly summaries available yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}