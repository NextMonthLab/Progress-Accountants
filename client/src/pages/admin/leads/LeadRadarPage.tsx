import React, { useState } from 'react';
import { AdminCard, StatCard, TextGradient, CreditsDisplay } from "@/components/admin-ui/AdminCard";
import { GradientButton, ActionButton, TabsNav } from "@/components/admin-ui/AdminButtons";
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
  BookOpen
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
    { id: 'insights', label: 'Insights', icon: <BarChart className="h-4 w-4" /> }
  ];

  // If using the new AdminLayoutV2, return just the content
  // Otherwise, wrap in the old AdminLayout
  return (
    <div className="space-y-6">
      {/* Lead Radar Header */}
      <AdminCard className="relative border">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full bg-pink-500 rounded-full"></div>
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                <span>Lead </span>
                <TextGradient text="Radar" gradient="pink-teal" />
              </h1>
              <p className="text-gray-600 text-sm">
                Transform raw leads into intelligent signals with AI-powered business matching
              </p>
            </div>
            <CreditsDisplay current={0} total={100} />
          </div>
          
          <div className="flex gap-3 mt-6">
            <GradientButton size="sm" gradient="pink-teal">
              <Signal className="mr-2 h-4 w-4" />
              Generate Signal
            </GradientButton>
            <ActionButton size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </ActionButton>
          </div>
        </div>
      </AdminCard>
      
      {/* Tab Navigation */}
      <TabsNav 
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="overflow-x-auto"
      />
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}