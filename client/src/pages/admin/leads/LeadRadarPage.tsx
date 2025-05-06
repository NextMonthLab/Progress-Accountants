import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Signal, 
  Building, 
  Mail,
  ArrowUpRight
} from "lucide-react";

export default function LeadRadarPage() {
  // Stats data similar to the reference image
  const stats = [
    { 
      title: "Total Lead Profiles", 
      value: "0", 
      suffix: "profiles",
      icon: <Users className="h-5 w-5 text-[#d65db1]" />,
      subtext: "Across all sources"
    },
    { 
      title: "Signals Generated", 
      value: "0", 
      suffix: "signals",
      icon: <Signal className="h-5 w-5 text-[#5EB8B6]" />,
      subtext: "Based on profile analysis"
    },
    { 
      title: "Business Matches", 
      value: "0", 
      suffix: "matches",
      icon: <Building className="h-5 w-5 text-[#4E94F8]" />,
      subtext: "Potential business matches"
    },
    { 
      title: "Emails Parsed", 
      value: "0", 
      suffix: "emails",
      icon: <Mail className="h-5 w-5 text-[#F8A84E]" />,
      subtext: "From all sources"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Lead Radar Card */}
      <Card className="bg-white shadow-sm rounded-lg overflow-hidden relative border-0">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] z-0">
          <div className="w-full h-full bg-[#ff6987] transform rotate-12 translate-x-10 -translate-y-10 rounded-full"></div>
        </div>
        
        <CardContent className="p-6 z-10 relative">
          <div className="flex items-start mb-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h1 className="text-2xl font-bold">
                  <span className="text-gray-800">Lead </span>
                  <span className="text-[#5EB8B6]">Radar</span>
                </h1>
                <div className="text-sm text-gray-600 bg-slate-50 px-3 py-1 rounded-full">
                  Credits <span className="font-medium">0/100</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Transform raw leads into intelligent signals with AI-powered business matching</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="bg-gradient-to-r from-[#5EB8B6] to-[#4ca3a1] text-white hover:from-[#45a4a2] hover:to-[#389997] rounded-md flex items-center gap-1 px-4 h-9">
              <Signal className="h-4 w-4 mr-1" /> Generate Signal
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50 rounded-md border-gray-200 flex items-center gap-1 px-4 h-9">
              <span className="text-[#d65db1]">⚘</span> Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tab Navigation */}
      <div className="flex">
        <div className="bg-white shadow-sm rounded-full p-1 flex space-x-1 border">
          <Button variant="ghost" className="bg-white shadow-sm rounded-full py-1 px-4 text-gray-700 flex items-center gap-2 h-auto">
            <span className="text-gray-600">⚘</span> Overview
          </Button>
          <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
            <span className="text-gray-600">⚪</span> Lead Profiles
          </Button>
          <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
            <span className="text-gray-600">⚡</span> Signals
          </Button>
          <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
            <span className="text-gray-600">⇆</span> Matches
          </Button>
          <Button variant="ghost" className="py-1 px-4 text-gray-700 flex items-center gap-2 rounded-full h-auto">
            <span className="text-gray-600">⊗</span> Insights
          </Button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className={`p-2 rounded-full ${
                    index === 0 ? "bg-[#fde2ed]" : 
                    index === 1 ? "bg-[#e3f7f7]" : 
                    index === 2 ? "bg-[#e1edff]" : "bg-[#fff5e5]"
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">{stat.suffix}</div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  {stat.subtext}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}