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
      icon: <Users className="h-5 w-5 text-white" />,
      color: "bg-pink-500"
    },
    { 
      title: "Conversion Rate", 
      value: "3.2%", 
      change: "+0.8%",
      icon: <Zap className="h-5 w-5 text-white" />,
      color: "bg-teal-500"
    },
    { 
      title: "Companies", 
      value: "57", 
      change: "+12",
      icon: <Building2 className="h-5 w-5 text-white" />,
      color: "bg-blue-500"
    },
    { 
      title: "Avg. Session Duration", 
      value: "4:32", 
      change: "+0:46",
      icon: <LineChart className="h-5 w-5 text-white" />,
      color: "bg-amber-500"
    }
  ];

  return (
    <AdminLayout title="Lead Intelligence">
      <div className="admin-dashboard">
        <div className="admin-header p-6 mb-6">
        <div className="flex items-start mb-4">
          <img 
            src="/nextmonth-logo.png" 
            alt="NextMonth Logo" 
            className="h-8 mr-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h1 className="text-2xl font-bold admin-text-primary">
                <span className="admin-text-primary">Lead </span>
                <span className="text-[#6abbba]">Tracker</span>
              </h1>
              <div className="text-sm admin-text-secondary">
                Credits <span className="font-medium">35/100</span>
              </div>
            </div>
            <p className="admin-text-secondary text-sm">Transform visitor data into actionable sales insights</p>
          </div>
        </div>
        
          <div className="flex gap-3 mt-6">
            <Button size="sm" className="bg-teal-500 text-white hover:bg-teal-600 flex items-center gap-2 px-4 py-2">
              <Sparkles className="h-4 w-4" /> Generate Signal
            </Button>
            <Button variant="outline" size="sm" className="admin-text-secondary hover:bg-gray-50 border-gray-200 flex items-center gap-2 px-4 py-2">
              <BarChart4 className="h-4 w-4" /> Documentation
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="admin-tabs-list p-1 h-12">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-10 gap-2 px-4"
            >
              <span className="text-gray-500">􀋲</span> Overview
            </TabsTrigger>
            <TabsTrigger 
              value="profiles" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-10 gap-2 px-4"
            >
              <span className="text-gray-500">􀋮</span> Lead Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="signals" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-10 gap-2 px-4"
            >
              <span className="text-gray-500">􀋰</span> Signals
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-10 gap-2 px-4"
            >
              <span className="text-gray-500">􀋱</span> Matches
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-10 gap-2 px-4"
            >
              <span className="text-gray-500">􀋿</span> Insights
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex items-center space-x-2 mt-6">
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100 border-gray-200 text-gray-600">Today</Badge>
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100 border-gray-200 text-gray-600">Yesterday</Badge>
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 border-pink-200">Last 7 days</Badge>
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100 border-gray-200 text-gray-600">Last 30 days</Badge>
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-gray-100 border-gray-200 text-gray-600">Custom</Badge>
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