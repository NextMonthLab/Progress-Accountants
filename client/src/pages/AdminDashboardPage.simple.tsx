import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  Building2, 
  ArrowUpRight,
  Sparkles,
  Zap,
  BarChart4
} from "lucide-react";
import { AdminLayout } from '@/components/layouts/AdminLayout';

export default function AdminDashboardPageSimple() {
  // Dummy data for lead tracker stats
  const stats = [
    { 
      title: "Total Leads", 
      value: "124", 
      change: "+8%", 
      icon: <Users className="h-5 w-5 text-primary" />,
      color: "bg-pink-50"
    },
    { 
      title: "Conversion Rate", 
      value: "3.2%", 
      change: "+0.8%", 
      icon: <Zap className="h-5 w-5 text-green-500" />,
      color: "bg-green-50"
    },
    { 
      title: "Companies", 
      value: "57", 
      change: "+12", 
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50"
    },
    { 
      title: "Avg. Session Duration", 
      value: "4:32", 
      change: "+0:46", 
      icon: <LineChart className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-50"
    }
  ];

  return (
    <AdminLayout title="Lead Intelligence">
      <div className="container p-0 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Lead Tracker</h1>
            <p className="text-gray-500 mt-1">Transform visitor data into actionable sales insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5">
              Documentation
            </Button>
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
              Generate Signal
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center border-b border-gray-100 pb-2">
            <TabsList className="bg-transparent h-9 p-0">
              <TabsTrigger 
                value="overview" 
                className="rounded-md data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="profiles" 
                className="rounded-md data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Lead Profiles
              </TabsTrigger>
              <TabsTrigger 
                value="signals" 
                className="rounded-md data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Signals
              </TabsTrigger>
              <TabsTrigger 
                value="matches" 
                className="rounded-md data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Matches
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="rounded-md data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Insights
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100">Today</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100">Yesterday</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/20">Last 7 days</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100">Last 30 days</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100">Custom</Badge>
          </div>
        
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        {stat.icon}
                      </div>
                      <Badge variant="outline" className="flex items-center bg-green-50 text-green-700 border-green-100">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h4 className="text-2xl font-bold mt-1">{stat.value}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <Card className="col-span-2 border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Lead Activity</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/5">
                      View All
                    </Button>
                  </div>
                  <CardDescription>Website visitor activity over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <BarChart4 className="h-16 w-16 text-gray-300" />
                    <p className="text-gray-500 ml-4">Chart visualization will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/5">
                      View All
                    </Button>
                  </div>
                  <CardDescription>Most visited content</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium text-sm">Homepage</p>
                        <p className="text-xs text-gray-500">/</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        36 visits
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium text-sm">Services</p>
                        <p className="text-xs text-gray-500">/services</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        24 visits
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">About Us</p>
                        <p className="text-xs text-gray-500">/about</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        18 visits
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profiles" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Lead Profiles</CardTitle>
                <CardDescription>View and manage your lead profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 flex items-center justify-center h-40">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Lead profiles will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signals" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Signals</CardTitle>
                <CardDescription>Track important lead signals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 flex items-center justify-center h-40">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Lead signals will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Matches</CardTitle>
                <CardDescription>Lead match intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 flex items-center justify-center h-40">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Lead matches will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Insights</CardTitle>
                <CardDescription>Advanced lead analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 flex items-center justify-center h-40">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Lead insights will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}