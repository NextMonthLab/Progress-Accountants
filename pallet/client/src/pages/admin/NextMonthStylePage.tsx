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
  Database,
  ChevronDown
} from "lucide-react";

export default function NextMonthStylePage() {
  // Card stats data
  const stats = [
    { 
      title: "Total Leads", 
      value: "124", 
      change: "+8%",
      icon: <Users className="h-5 w-5 text-white" />,
      color: "bg-gradient-to-r from-[#f953c6] to-[#ff6b6b]" // Pink-Coral gradient
    },
    { 
      title: "Conversion Rate", 
      value: "3.2%", 
      change: "+0.8%",
      icon: <Zap className="h-5 w-5 text-white" />,
      color: "bg-gradient-to-r from-[#36d1dc] to-[#5b86e5]" // Teal-Blue gradient
    },
    { 
      title: "Companies", 
      value: "57", 
      change: "+12",
      icon: <Database className="h-5 w-5 text-white" />,
      color: "bg-gradient-to-r from-[#36d1dc] to-[#5b86e5]" // Teal-Blue gradient
    },
    { 
      title: "Avg. Session Duration", 
      value: "4:32", 
      change: "+0:46",
      icon: <LineChart className="h-5 w-5 text-white" />,
      color: "bg-gradient-to-r from-[#f953c6] to-[#ff6b6b]" // Pink-Coral gradient
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <img 
                  src="/nextmonth-logo.png" 
                  alt="NextMonth" 
                  className="h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const sibling = e.currentTarget.nextElementSibling;
                    if (sibling && sibling instanceof HTMLElement) {
                      sibling.style.display = 'block';
                    }
                  }}
                />
                <div className="hidden font-bold text-lg text-[#d65db1]">NextMonth</div>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] px-2 py-1 h-auto font-medium">
                    Lead Intelligence <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                  </Button>
                </div>
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] px-2 py-1 h-auto font-medium">
                    Developer Tools <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                  </Button>
                </div>
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] px-2 py-1 h-auto font-medium">
                    Marketplace <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                  </Button>
                </div>
                <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] flex items-center gap-1 px-2 py-1 h-auto font-medium">
                  <span className="text-gray-400">⟳</span> SOT Integration
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button size="sm" className="bg-[#5EB8B6] hover:bg-[#45a4a2] text-white text-xs font-medium rounded-md px-3 h-8">
                MC Login
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] flex items-center gap-1 px-2 py-1 h-auto font-medium">
                <span className="text-gray-400">$</span> Financial <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-[#d65db1] flex items-center gap-1 px-2 py-1 h-auto font-medium">
                <span className="text-gray-400">✧</span> Creative
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page Divider */}
      <div className="w-full bg-gray-100 h-0.5 relative">
        <div className="max-w-7xl mx-auto px-4 flex">
          <div className="bg-gradient-to-r from-[#d65db1] to-[#ff6987] w-1/6 h-0.5 relative">
            <div className="absolute left-0 -top-1 h-2 w-2 rounded-full bg-[#d65db1]"></div>
          </div>
          <div className="absolute right-4 -top-1 h-2 w-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Lead Tracker Card */}
        <Card className="bg-white shadow-sm rounded-lg mb-8 overflow-hidden relative border-0">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] z-0">
            <div className="w-full h-full bg-[#ff6987] transform rotate-12 translate-x-10 -translate-y-10 rounded-full"></div>
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
                    <span className="text-[#5EB8B6]">Tracker</span>
                  </h1>
                  <div className="text-sm text-gray-600 bg-slate-50 px-3 py-1 rounded-full">
                    Credits <span className="font-medium">35/100</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Transform visitor data into actionable sales insights</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="bg-[#5EB8B6] text-white hover:bg-[#45a4a2] rounded-md flex items-center gap-1 px-4 h-9">
                <span className="text-white">+</span> Generate Signal
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50 rounded-md border-gray-200 flex items-center gap-1 px-4 h-9">
                <span className="text-[#d65db1]">⚘</span> Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tab Navigation */}
        <div className="mb-6 flex">
          <div className="bg-white shadow-sm rounded-full p-1 flex space-x-1 border">
            <Button variant="ghost" className="bg-white shadow-sm rounded-full py-1 px-4 text-gray-700 flex items-center gap-2 h-auto">
              <span className="text-gray-600">◷</span> Overview
            </Button>
            <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
              <span className="text-gray-600">◯</span> Lead Profiles
            </Button>
            <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
              <span className="text-gray-600">⊕</span> Signals
            </Button>
            <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
              <span className="text-gray-600">⮆</span> Matches
            </Button>
            <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
              <span className="text-gray-600">◐</span> Insights
            </Button>
          </div>
        </div>
        
        {/* Time Filters */}
        <div className="flex space-x-2 mb-8">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-50 border-gray-200 text-gray-600">Today</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-50 border-gray-200 text-gray-600">Yesterday</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-[#fde2ed] text-[#d65db1] border-[#ffbed9]">Last 7 days</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-50 border-gray-200 text-gray-600">Last 30 days</Badge>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-gray-50 border-gray-200 text-gray-600">Custom</Badge>
        </div>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className={`${
                    index === 0 ? "bg-[#d65db1]" : 
                    index === 1 ? "bg-[#5EB8B6]" : 
                    index === 2 ? "bg-[#4E94F8]" : "bg-[#F8A84E]"
                  } p-3 rounded-full`}>
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className="flex items-center bg-green-50 text-green-700 border-green-100 rounded-full">
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
        <Card className="border-0 shadow-sm mb-8 rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Lead Activity</h3>
                <p className="text-sm text-gray-500">Website visitor activity over time</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[#d65db1] hover:text-[#d65db1]/90 hover:bg-[#d65db1]/5 rounded-full">
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