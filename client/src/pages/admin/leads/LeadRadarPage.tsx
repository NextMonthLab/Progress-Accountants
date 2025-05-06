import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Signal, 
  Building, 
  Mail,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";

export default function LeadRadarPage() {
  // Stats data similar to the reference image
  const stats = [
    { 
      title: "Tools Installed",
      value: "5",
      icon: <Signal className="h-5 w-5 text-white" />,
      color: "bg-[#FF8A65]",
      textColor: "text-[#FF8A65]"
    },
    { 
      title: "Latest Update",
      value: "Apr 22, 2025",
      icon: <Signal className="h-5 w-5 text-white" />,
      color: "bg-[#26A69A]",
      textColor: "text-[#26A69A]"
    },
    { 
      title: "Security Status",
      value: "Protected",
      icon: <Signal className="h-5 w-5 text-white" />,
      color: "bg-[#42A5F5]",
      textColor: "text-[#42A5F5]"
    }
  ];

  const quickActions = [
    {
      title: "Create New Page",
      description: "Design and publish a new page",
      icon: <FileIcon className="h-5 w-5 text-[#d65db1]" />
    },
    {
      title: "Install New Tool",
      description: "Browse the tool marketplace",
      icon: <DownloadIcon className="h-5 w-5 text-[#d65db1]" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6 flex justify-between items-center">
              <div className="flex flex-col">
                <div className="text-sm text-gray-500">{stat.title}</div>
                <div className={`text-xl font-semibold mt-1 ${stat.textColor}`}>{stat.value}</div>
              </div>
              <div className={`rounded-full p-3 h-12 w-12 flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Website Performance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm rounded-xl col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Website Performance</CardTitle>
            <div className="text-sm text-gray-500">Traffic and engagement for the past 30 days</div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">Chart placeholder</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions Card */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <div className="text-sm text-gray-500">Common tasks and actions</div>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div key={index} className="group border rounded-lg p-4 hover:border-[#d65db1]/30 cursor-pointer transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {action.icon}
                    <div>
                      <div className="font-medium text-gray-800 group-hover:text-[#d65db1]">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#d65db1] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Icons
function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function DownloadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}