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
    <AdminLayout title="SmartSite Control Room">
      <div className="min-h-screen bg-slate-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">SmartSite Control Room</h1>
          <p className="text-slate-400">Intelligent automation and insights for your website</p>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Live Chat Monitoring Card */}
          <Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase">ACTIVE CHATS TODAY</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">Review live chats, score leads, take over the assistant</p>
            
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">ACTIVE CHATS TODAY</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">LEADS THIS WEEK</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="bg-black text-white rounded-full px-4 py-2 text-xs hover:bg-gray-800">
                View Insights
              </Button>
              <Button size="sm" variant="outline" className="rounded-full px-4 py-2 text-xs border-gray-300">
                CRM
              </Button>
              <Button size="sm" variant="outline" className="rounded-full px-4 py-2 text-xs border-gray-300">
                Autopilot
              </Button>
            </div>
          </Card>

          {/* Content Creation Card */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase">DRAFTS PENDING</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">See what's resonating. Create blog posts or social content</p>
            
            <div className="mb-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">Page engagement</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">up 15%</div>
              <div className="text-xs text-gray-500">TOP INSIGHT</div>
              <div className="text-3xl font-bold text-gray-900 mt-4">0</div>
              <div className="text-xs text-gray-500">DRAFTS PENDING</div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="bg-black text-white rounded-full px-4 py-2 text-xs hover:bg-gray-800">
                View Insights
              </Button>
              <Button size="sm" className="bg-black text-white rounded-full px-4 py-2 text-xs hover:bg-gray-800">
                Blog Posts
              </Button>
              <Button size="sm" className="bg-black text-white rounded-full px-4 py-2 text-xs hover:bg-gray-800">
                Social Posts
              </Button>
            </div>
          </Card>

          {/* Premium Upgrade Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-lg border-0 relative">
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">Premium</Badge>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase">STATUS</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">Industry trends, competitor moves, smart suggestions</p>
            
            <div className="mb-6">
              <div className="text-2xl font-bold text-gray-900 mb-4">Upgrade Required</div>
              <div className="text-lg font-bold text-gray-900">12+ premium tools</div>
              <div className="text-xs text-gray-500">FEATURES</div>
            </div>
            
            <Button size="sm" className="bg-black text-white rounded-full px-4 py-2 text-xs hover:bg-gray-800 w-full">
              Upgrade Now
            </Button>
          </Card>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white rounded-3xl p-4 shadow-lg border-0 text-center">
              <BarChart4 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Active Chats</div>
            </Card>
            <Card className="bg-white rounded-3xl p-4 shadow-lg border-0 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">New Leads</div>
            </Card>
            <Card className="bg-white rounded-3xl p-4 shadow-lg border-0 text-center">
              <LineChart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Drafts Pending</div>
            </Card>
            <Card className="bg-white rounded-3xl p-4 shadow-lg border-0 text-center">
              <Sparkles className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Market Insights</div>
            </Card>
          </div>
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