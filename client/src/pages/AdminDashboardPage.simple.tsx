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
          <Card className="bg-slate-800 rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-gray-400 uppercase">ACTIVE CHATS TODAY</span>
            </div>
            <p className="text-sm text-gray-300 mb-6">Review live chats, score leads, take over the assistant</p>
            
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">ACTIVE CHATS TODAY</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-xs text-gray-400">LEADS THIS WEEK</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="bg-white text-black rounded-full px-4 py-2 text-xs hover:bg-gray-100">
                View Insights
              </Button>
              <Button size="sm" variant="outline" className="rounded-full px-4 py-2 text-xs border-gray-600 text-gray-300 hover:bg-slate-700">
                CRM
              </Button>
              <Button size="sm" variant="outline" className="rounded-full px-4 py-2 text-xs border-gray-600 text-gray-300 hover:bg-slate-700">
                Autopilot
              </Button>
            </div>
          </Card>

          {/* Content Creation Card */}
          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-6 shadow-lg border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-400/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-orange-200" />
              </div>
              <span className="text-xs font-medium text-orange-100 uppercase">DRAFTS PENDING</span>
            </div>
            <p className="text-sm text-orange-100 mb-6">See what's resonating. Create blog posts or social content</p>
            
            <div className="mb-6">
              <div className="text-2xl font-bold text-white mb-1">Page engagement</div>
              <div className="text-2xl font-bold text-white mb-1">up 15%</div>
              <div className="text-xs text-orange-200">TOP INSIGHT</div>
              <div className="text-3xl font-bold text-white mt-4">0</div>
              <div className="text-xs text-orange-200">DRAFTS PENDING</div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="bg-white text-orange-600 rounded-full px-4 py-2 text-xs hover:bg-orange-50">
                View Insights
              </Button>
              <Button size="sm" className="bg-white text-orange-600 rounded-full px-4 py-2 text-xs hover:bg-orange-50">
                Blog Posts
              </Button>
              <Button size="sm" className="bg-white text-orange-600 rounded-full px-4 py-2 text-xs hover:bg-orange-50">
                Social Posts
              </Button>
            </div>
          </Card>

          {/* Premium Upgrade Card */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg border-0 relative">
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">Premium</Badge>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-blue-200" />
              </div>
              <span className="text-xs font-medium text-blue-100 uppercase">STATUS</span>
            </div>
            <p className="text-sm text-blue-100 mb-6">Industry trends, competitor moves, smart suggestions</p>
            
            <div className="mb-6">
              <div className="text-2xl font-bold text-white mb-4">Upgrade Required</div>
              <div className="text-lg font-bold text-white">12+ premium tools</div>
              <div className="text-xs text-blue-200">FEATURES</div>
            </div>
            
            <Button size="sm" className="bg-white text-blue-600 rounded-full px-4 py-2 text-xs hover:bg-blue-50 w-full">
              Upgrade Now
            </Button>
          </Card>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-slate-800 rounded-3xl p-4 shadow-lg border-0 text-center">
              <BarChart4 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Active Chats</div>
            </Card>
            <Card className="bg-slate-800 rounded-3xl p-4 shadow-lg border-0 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">New Leads</div>
            </Card>
            <Card className="bg-slate-800 rounded-3xl p-4 shadow-lg border-0 text-center">
              <LineChart className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Drafts Pending</div>
            </Card>
            <Card className="bg-slate-800 rounded-3xl p-4 shadow-lg border-0 text-center">
              <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Market Insights</div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}