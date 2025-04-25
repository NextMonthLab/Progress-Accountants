import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Sample data for the charts
const websiteTrafficData = [
  { month: 'Jan', visitors: 1200, pageViews: 3100, sessions: 900 },
  { month: 'Feb', visitors: 1900, pageViews: 4300, sessions: 1300 },
  { month: 'Mar', visitors: 1400, pageViews: 3700, sessions: 1100 },
  { month: 'Apr', visitors: 2100, pageViews: 5100, sessions: 1700 },
  { month: 'May', visitors: 2300, pageViews: 5800, sessions: 1900 },
  { month: 'Jun', visitors: 2500, pageViews: 6100, sessions: 2100 },
  { month: 'Jul', visitors: 2200, pageViews: 5400, sessions: 1800 },
];

const deviceData = [
  { name: 'Desktop', value: 45, color: '#0088FE' },
  { name: 'Mobile', value: 40, color: '#00C49F' },
  { name: 'Tablet', value: 15, color: '#FFBB28' },
];

const pagePerformanceData = [
  { page: 'Home', visitors: 980, bounceRate: 32, avgTime: 120 },
  { page: 'About', visitors: 450, bounceRate: 41, avgTime: 98 },
  { page: 'Services', visitors: 640, bounceRate: 29, avgTime: 145 },
  { page: 'Contact', visitors: 280, bounceRate: 47, avgTime: 65 },
  { page: 'Blog', visitors: 390, bounceRate: 28, avgTime: 180 },
];

function OverviewTab() {
  const [period, setPeriod] = useState('7days');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Traffic Overview</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <CardDescription>Previous period: +18.2%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,400</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <CardDescription>Previous period: +12.3%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38,540</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
            <CardDescription>Previous period: -1.5%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 14s</div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Traffic Trends</CardTitle>
          <CardDescription>Website traffic over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={websiteTrafficData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
                <Area type="monotone" dataKey="pageViews" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
                <Area type="monotone" dataKey="sessions" stackId="3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Best performing pages by visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={pagePerformanceData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="page" type="category" />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#8884d8" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PagesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Page Performance</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Page Analytics</CardTitle>
          <CardDescription>Detailed metrics for individual pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Page</th>
                  <th className="text-left py-3 px-4">Visitors</th>
                  <th className="text-left py-3 px-4">Bounce Rate</th>
                  <th className="text-left py-3 px-4">Avg. Time on Page</th>
                </tr>
              </thead>
              <tbody>
                {pagePerformanceData.map((page, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{page.page}</td>
                    <td className="py-3 px-4">{page.visitors}</td>
                    <td className="py-3 px-4">{page.bounceRate}%</td>
                    <td className="py-3 px-4">{page.avgTime}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReferralsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Traffic Sources</h2>
      
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Referral and traffic source analytics will be available in the upcoming release.
        </p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track and analyze website performance, visitor behavior, and more.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pages">
            <LineChart className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <PieChart className="h-4 w-4 mr-2" />
            Referrals
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="pages">
          <PagesTab />
        </TabsContent>
        <TabsContent value="referrals">
          <ReferralsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}