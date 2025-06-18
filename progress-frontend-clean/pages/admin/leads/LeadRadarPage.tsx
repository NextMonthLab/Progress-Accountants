import React, { useState } from 'react';
import { AdminCard, StatCard, TextGradient, CreditsDisplay } from "@/components/admin-ui/AdminCard";
import { GradientButton, ActionButton, TabsNav, Badge } from "@/components/admin-ui/AdminButtons";
import { AdminLayoutV2 } from "@/components/admin-ui/AdminLayout";
import { 
  Users, 
  Signal, 
  Building, 
  Mail,
  BarChart,
  LayoutDashboard,
  Activity,
  Briefcase,
  BookOpen,
  LineChart
} from "lucide-react";

export default function LeadRadarPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Stats for the cards
  const stats = [
    { 
      title: "Total Lead Profiles", 
      value: "0", 
      suffix: "profiles",
      icon: <Users className="h-4 w-4" />,
      description: "Across all sources"
    },
    { 
      title: "Signals Generated", 
      value: "0", 
      suffix: "signals",
      icon: <Activity className="h-4 w-4" />,
      description: "Based on profile analysis"
    },
    { 
      title: "Business Matches", 
      value: "0", 
      suffix: "matches",
      icon: <Briefcase className="h-4 w-4" />,
      description: "Potential business matches"
    },
    { 
      title: "Emails Parsed", 
      value: "0", 
      suffix: "emails",
      icon: <Mail className="h-4 w-4" />,
      description: "From all sources"
    }
  ];

  // Tabs for the tab navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'profiles', label: 'Lead Profiles', icon: <Users className="h-4 w-4" /> },
    { id: 'signals', label: 'Signals', icon: <Activity className="h-4 w-4" /> },
    { id: 'matches', label: 'Matches', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'insights', label: 'Insights', icon: <LineChart className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Lead Radar Header */}
      <div className="relative overflow-hidden rounded-xl dark:bg-[#0A0A0A] bg-white p-8 shadow-md dark:border-[#1D1D1D] border-gray-200">
        {/* Grid pattern */}
        <div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        <div className="relative flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight dark:text-white text-gray-900">
              Lead <span className="bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] bg-clip-text text-transparent">Radar</span>
            </h1>
            <p className="dark:text-[#E0E0E0] text-gray-700 mt-2 text-lg max-w-xl">
              Transform raw leads into intelligent signals with AI-powered business matching
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <GradientButton size="sm">
                <Signal className="mr-2 h-4 w-4" />
                Generate Signal
              </GradientButton>
              
              <ActionButton size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                Documentation
              </ActionButton>
            </div>
          </div>
          
          <div className="flex items-center gap-4 dark:bg-[#121212] bg-gray-100 backdrop-blur-sm p-5 rounded-lg shadow-inner dark:border-[#3A3A3A] border-gray-300">
            <div className="text-sm font-medium dark:text-[#E0E0E0] text-gray-700">Credits</div>
            <div className="text-sm font-semibold tabular-nums dark:text-white text-gray-900">0/100</div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <Activity className="h-60 w-60 text-[#F65C9A]" />
        </div>
      </div>
      
      {/* Tab Navigation */}
      <TabsNav 
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="overflow-x-auto"
      />
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            suffix={stat.suffix}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>
      
      {/* Content area (for demonstration) */}
      <div className="dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 rounded-xl shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-white text-gray-900">Recent Activity</h2>
          <div className="flex space-x-2">
            <Badge text="New" variant="primary" />
            <Badge text="Active" variant="success" />
          </div>
        </div>
        <p className="dark:text-[#E0E0E0] text-gray-700">
          Get started by generating your first signal. Lead Radar will analyze your data sources and create intelligent business matching profiles.
        </p>
      </div>
    </div>
  );
}