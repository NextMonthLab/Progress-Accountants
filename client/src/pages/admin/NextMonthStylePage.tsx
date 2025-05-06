import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Users, 
  FileText,
  Zap,
  ArrowUpRight,
  BarChart4,
  Database
} from "lucide-react";

export default function NextMonthStylePage() {
  // Card stats data
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
      icon: <Database className="h-5 w-5 text-white" />,
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
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img 
                src="/nextmonth-logo.png" 
                alt="NextMonth" 
                className="h-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling;
                  if (sibling && sibling instanceof HTMLElement) {
                    sibling.style.display = 'block';
                  }
                }}
              />
              <div className="hidden font-bold text-xl text-primary">NextMonth</div>
              
              <nav className="hidden md:flex space-x-6">
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary">
                    Lead Intelligence <span className="ml-1 opacity-60">▾</span>
                  </Button>
                </div>
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary">
                    Developer Tools <span className="ml-1 opacity-60">▾</span>
                  </Button>
                </div>
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary">
                    Marketplace <span className="ml-1 opacity-60">▾</span>
                  </Button>
                </div>
                <Button variant="ghost" className="text-gray-700 hover:text-primary flex items-center gap-1">
                  <span className="text-gray-400">􀋫</span> SOT Integration
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-md px-3">
                MC Login
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-primary flex items-center gap-1">
                <span className="text-gray-400">􀝒</span> Financial <span className="ml-1 opacity-60">▾</span>
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-primary flex items-center gap-1">
                <span className="text-gray-400">􀉁</span> Creative
              </Button>
              <Button variant="ghost" className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                <span className="text-xl">􀆊</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page Divider */}
      <div className="w-full bg-gray-100 h-0.5 relative">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <div className="bg-primary w-1/4 h-0.5 relative">
            <div className="absolute left-0 -top-1 h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <div className="absolute right-4 -top-1 h-2 w-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Lead Tracker Card */}
        <Card className="bg-white shadow-sm rounded-xl mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 opacity-5 z-0">
            <div className="w-full h-full bg-primary transform rotate-12 translate-x-10 -translate-y-10"></div>
          </div>
          
          <CardContent className="p-6 z-10 relative">
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
                  <h1 className="text-2xl font-bold">
                    <span className="text-gray-800">Lead </span>
                    <span className="text-[#6abbba]">Tracker</span>
                  </h1>
                  <div className="text-sm text-gray-600 bg-slate-50 px-3 py-1 rounded-md">
                    Credits <span className="font-medium">35/100</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Transform visitor data into actionable sales insights</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="bg-teal-500 text-white hover:bg-teal-600 rounded-md flex items-center gap-1 px-4">
                <span className="text-white">􀋲</span> Generate Signal
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50 rounded-md border-gray-200 flex items-center gap-1 px-4">
                <span className="text-pink-500">􀋮</span> Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tab Navigation */}
        <div className="mb-6 flex">
          <div className="bg-white shadow-sm rounded-lg p-1 flex space-x-1">
            <Button variant="ghost" className="bg-white shadow-sm rounded-md py-2 px-4 text-gray-700 flex items-center gap-2">
              <span className="text-gray-400">􀏅</span> Overview
            </Button>
            <Button variant="ghost" className="py-2 px-4 text-gray-700 flex items-center gap-2">
              <span className="text-gray-400">􀉭</span> Lead Profiles
            </Button>
            <Button variant="ghost" className="py-2 px-4 text-gray-700 flex items-center gap-2">
              <span className="text-gray-400">􀍠</span> Signals
            </Button>
            <Button variant="ghost" className="py-2 px-4 text-gray-700 flex items-center gap-2">
              <span className="text-gray-400">􀍪</span> Matches
            </Button>
            <Button variant="ghost" className="py-2 px-4 text-gray-700 flex items-center gap-2">
              <span className="text-gray-400">􀌤</span> Insights
            </Button>
          </div>
        </div>
        
        {/* Time Filters */}
        <div className="flex space-x-2 mb-8">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-100 border-gray-200 text-gray-600">Today</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-100 border-gray-200 text-gray-600">Yesterday</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 border-pink-200">Last 7 days</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-100 border-gray-200 text-gray-600">Last 30 days</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-100 border-gray-200 text-gray-600">Custom</Badge>
        </div>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        
        {/* Chart Placeholder */}
        <Card className="border shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Lead Activity</h3>
                <p className="text-sm text-gray-500">Website visitor activity over time</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/5">
                View All
              </Button>
            </div>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
              <BarChart4 className="h-16 w-16 text-gray-300" />
              <p className="text-gray-500 ml-4">Chart visualization will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}