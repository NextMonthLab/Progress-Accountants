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
      <div className="admin-dashboard min-h-screen bg-gray-900 text-white">
        <div className="admin-header p-8 mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-xl">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                <span>Lead </span>
                <span className="text-emerald-400">Tracker</span>
              </h1>
              <div className="text-sm text-gray-300 bg-gray-800 px-4 py-2 rounded-full border border-purple-500/20">
                Credits <span className="font-semibold text-purple-400">35/100</span>
              </div>
            </div>
            <p className="text-gray-300 text-base">Transform visitor data into actionable sales insights</p>
          </div>
        </div>
        
          <div className="flex gap-4 mt-8">
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4" /> Generate Signal
            </Button>
            <Button variant="outline" size="sm" className="text-gray-300 hover:bg-gray-800 border-gray-600 hover:border-purple-500/50 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300">
              <BarChart4 className="h-4 w-4" /> Documentation
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-gray-800 border border-gray-700 rounded-2xl p-2 h-14 backdrop-blur-xl shadow-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl h-10 gap-2 px-6 font-medium transition-all duration-300 text-gray-300"
            >
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger 
              value="profiles" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl h-10 gap-2 px-6 font-medium transition-all duration-300 text-gray-300"
            >
              <Users className="h-4 w-4" /> Lead Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="signals" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl h-10 gap-2 px-6 font-medium transition-all duration-300 text-gray-300"
            >
              <Zap className="h-4 w-4" /> Signals
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl h-10 gap-2 px-6 font-medium transition-all duration-300 text-gray-300"
            >
              <Building2 className="h-4 w-4" /> Matches
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl h-10 gap-2 px-6 font-medium transition-all duration-300 text-gray-300"
            >
              <Sparkles className="h-4 w-4" /> Insights
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex items-center space-x-3 mt-8">
          <Badge variant="outline" className="px-4 py-2 rounded-xl bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300">Today</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-xl bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300">Yesterday</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/50 shadow-lg">Last 7 days</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-xl bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300">Last 30 days</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-xl bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300">Custom</Badge>
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`${stat.color} p-4 rounded-2xl shadow-lg`}>
                      {stat.icon}
                    </div>
                    <Badge variant="outline" className="flex items-center bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 rounded-full">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <h4 className="text-3xl font-bold text-white">{stat.value}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <Card className="col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl backdrop-blur-xl">
              <CardHeader className="pb-6 p-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">Lead Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl">
                    View All
                  </Button>
                </div>
                <CardDescription className="text-gray-400">Website visitor activity over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-8">
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700">
                  <BarChart4 className="h-16 w-16 text-purple-400" />
                  <p className="text-gray-400 ml-4 text-lg">Chart visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl backdrop-blur-xl">
              <CardHeader className="pb-6 p-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white">Top Pages</CardTitle>
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl">
                    View All
                  </Button>
                </div>
                <CardDescription className="text-gray-400">Most visited content</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                    <div>
                      <p className="font-semibold text-white">Homepage</p>
                      <p className="text-sm text-gray-400">/</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 rounded-full">
                      36 visits
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                    <div>
                      <p className="font-semibold text-white">Services</p>
                      <p className="text-sm text-gray-400">/services</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 rounded-full">
                      24 visits
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">About Us</p>
                      <p className="text-sm text-gray-400">/about</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 rounded-full">
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