import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Signal, 
  Building, 
  Mail,
  BarChart
} from "lucide-react";

// Define icons as React components with proper TypeScript typing
function OverviewIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function ProfileIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}

function SignalsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  );
}

function MatchesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function InsightsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function DocumentationIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export default function LeadRadarPage() {
  // Stats for the cards
  const stats = [
    { 
      title: "Total Lead Profiles", 
      value: "0", 
      suffix: "profiles",
      icon: <Users className="h-4 w-4 text-gray-500" />,
      description: "Across all sources"
    },
    { 
      title: "Signals Generated", 
      value: "0", 
      suffix: "signals",
      icon: <BarChart className="h-4 w-4 text-gray-500" />,
      description: "Based on profile analysis"
    },
    { 
      title: "Business Matches", 
      value: "0", 
      suffix: "matches",
      icon: <Building className="h-4 w-4 text-gray-500" />,
      description: "Potential business matches"
    },
    { 
      title: "Emails Parsed", 
      value: "0", 
      suffix: "emails",
      icon: <Mail className="h-4 w-4 text-gray-500" />,
      description: "From all sources"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Lead Radar Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border relative">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full bg-pink-500 rounded-full"></div>
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                <span>Lead </span>
                <span className="text-[#5EB8B6]">Radar</span>
              </h1>
              <p className="text-gray-600 text-sm">
                Transform raw leads into intelligent signals with AI-powered business matching
              </p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-full px-3 py-1">
              Credits <span className="font-medium">0/100</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button size="sm" className="bg-[#5EB8B6] hover:bg-[#45a4a2] text-white">
              <Signal className="mr-2 h-4 w-4" />
              Generate Signal
            </Button>
            <Button variant="outline" size="sm" className="text-gray-700">
              <DocumentationIcon className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto">
        <div className="flex bg-white rounded-full p-1 border shadow-sm">
          <Button variant="ghost" className="bg-white shadow-sm rounded-full text-gray-700 flex items-center px-4">
            <OverviewIcon className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button variant="ghost" className="rounded-full text-gray-700 flex items-center px-4">
            <ProfileIcon className="mr-2 h-4 w-4" />
            Lead Profiles
          </Button>
          <Button variant="ghost" className="rounded-full text-gray-700 flex items-center px-4">
            <SignalsIcon className="mr-2 h-4 w-4" />
            Signals
          </Button>
          <Button variant="ghost" className="rounded-full text-gray-700 flex items-center px-4">
            <MatchesIcon className="mr-2 h-4 w-4" />
            Matches
          </Button>
          <Button variant="ghost" className="rounded-full text-gray-700 flex items-center px-4">
            <InsightsIcon className="mr-2 h-4 w-4" />
            Insights
          </Button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border shadow-sm rounded-lg overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col">
                <div className="font-medium text-gray-700 mb-4">{stat.title}</div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 mb-5">{stat.suffix}</div>
                <div className="flex items-center text-xs text-gray-500">
                  {stat.icon}
                  <span className="ml-1">{stat.description}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}