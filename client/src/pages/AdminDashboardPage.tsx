import React, { useState, lazy, Suspense, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { GradientButton, ActionButton } from "@/components/admin-ui/AdminButtons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { useQuery } from '@tanstack/react-query';
import { ContentGenerationControls } from '@/components/admin-ui/ContentGenerationControls';

// Lazy load the newsfeed component for better performance
const LightweightNewsfeed = lazy(() => import('@/components/dashboard/LightweightNewsfeed').then(
  module => ({ default: module.LightweightNewsfeed })
));
import { 
  AlertTriangle,
  ArrowRight, 
  ArrowUpRight,
  BarChart3,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Database,
  FileText, 
  Globe, 
  HardDrive,
  Image as ImageIcon,
  Layers,
  LayoutDashboard, 
  LineChart,
  ListChecks, 
  Loader2,
  Newspaper,
  Palette, 
  PenTool,
  Plus, 
  Rocket, 
  Settings,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap
} from "lucide-react";

// Lazy load chart component for better performance
const AnalyticsChart = lazy(() => import('@/components/dashboard/AnalyticsChart'));

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
  color: 'navy' | 'orange' | 'emerald' | 'indigo';
  isGradient?: boolean;
  className?: string;
}

function StatCard({ 
  label, 
  value, 
  icon, 
  change, 
  isPositive = true, 
  color = 'navy', 
  isGradient = false,
  className = ''
}: StatCardProps) {
  // Define the color scheme with proper type - using NextMonth Gold colors
  const scheme = {
    navy: {
      bg: isGradient ? 'bg-[#008080]' : 'bg-white',
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-[#008080]/10 text-[#008080]',
      border: isGradient ? 'border-[#008080]/10' : 'border-[#008080]/10'
    },
    orange: {
      bg: isGradient ? 'bg-[#F4A261]' : 'bg-white', 
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-[#F4A261]/10 text-[#F4A261]',
      border: isGradient ? 'border-[#F4A261]/10' : 'border-[#F4A261]/10'
    },
    emerald: {
      bg: isGradient ? 'bg-[#10B981]' : 'bg-white',
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-[#10B981]/10 text-[#10B981]',
      border: isGradient ? 'border-[#10B981]/10' : 'border-[#10B981]/10'
    },
    indigo: {
      bg: isGradient ? 'bg-[#6366F1]' : 'bg-white',
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-[#6366F1]/10 text-[#6366F1]',
      border: isGradient ? 'border-[#6366F1]/10' : 'border-[#6366F1]/10'
    }
  };

  return (
    <Card className={`overflow-hidden border ${isGradient ? 'shadow-lg shadow-' + color + '/10 border-0' : 'shadow-sm border ' + scheme[color].border} ${className} hover:shadow-md transition-all`}>
      <div className={`${scheme[color].bg} p-4 sm:p-6`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`text-sm font-medium ${isGradient ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}>{label}</p>
            <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${isGradient ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{value}</h3>
            {change && (
              <p className={`text-xs font-medium mt-1 flex items-center ${isPositive ? (isGradient ? 'text-white' : 'text-emerald-600') : (isGradient ? 'text-white' : 'text-red-600')}`}>
                {isPositive ? '↑' : '↓'} {change}
              </p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${scheme[color].icon}`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Section Component for dashboard sections
interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, description, children, className = '' }: SectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
          {description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// Activity Item Component
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isLoading?: boolean;
}

function ActivityItem({ icon, title, description, time, isLoading = false }: ActivityItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {isLoading ? (
        <>
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse"></div>
          </div>
        </>
      ) : (
        <>
          <div className="h-10 w-10 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080]">
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 dark:text-white">{title}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{time}</div>
        </>
      )}
    </div>
  );
}

// Chart Placeholder Component
interface ChartPlaceholderProps {
  height?: number;
  isLoading?: boolean;
}

function ChartPlaceholder({ height = 240, isLoading = false }: ChartPlaceholderProps) {
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
      ) : (
        <div className="absolute inset-0">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
              <Loader2 className="h-8 w-8 animate-spin text-[#36d1dc]" />
            </div>
          }>
            <AnalyticsChart />
          </Suspense>
        </div>
      )}
    </div>
  );
}

// Quick Action Component
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

function QuickAction({ 
  title, 
  description, 
  icon, 
  link, 
  variant = 'primary',
  isLoading = false
}: QuickActionProps) {
  const variantStyles = {
    primary: 'bg-[#4F46E5] hover:bg-[#6366F1] shadow-sm hover:shadow-md text-white border-0',
    secondary: 'bg-[#E0F2FE] text-[#0284C7] hover:bg-[#BAE6FD] shadow-sm hover:shadow-md border-0',
    outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:shadow-sm',
    ghost: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200',
  };

  // Colors based on variant for better contrast - modernized
  const iconColor = {
    primary: 'text-white bg-indigo-600 p-1.5 rounded-md',
    secondary: 'text-blue-600 bg-blue-100 p-1.5 rounded-md',
    outline: 'text-indigo-600 bg-indigo-50 p-1.5 rounded-md',
    ghost: 'text-gray-600 bg-gray-200 p-1.5 rounded-md'
  };
  
  const titleColor = {
    primary: 'text-white font-medium',
    secondary: 'text-slate-800 font-medium',
    outline: 'text-slate-800 font-medium',
    ghost: 'text-slate-800 font-medium'
  };
  
  const descriptionColor = {
    primary: 'text-white/90',
    secondary: 'text-slate-500',
    outline: 'text-slate-500',
    ghost: 'text-slate-500'
  };

  const arrowColor = {
    primary: 'text-white/70',
    secondary: 'text-blue-600/70',
    outline: 'text-indigo-600/70',
    ghost: 'text-gray-600/70'
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={link}>
      <div className={`p-4 rounded-lg transition-all ${variantStyles[variant]} relative group`}>
        <div className="flex items-start gap-3">
          {icon && (
            <div className={iconColor[variant]}>
              {icon}
            </div>
          )}
          <div className="flex-1 pr-4">
            <h3 className={titleColor[variant]}>{title}</h3>
            <p className={`text-sm mt-1 ${descriptionColor[variant]}`}>{description}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className={`h-4 w-4 ${arrowColor[variant]}`} />
        </div>
      </div>
    </Link>
  );
}



// System Health Component
interface SystemComponentType {
  name: string;
  status: 'good' | 'warning' | 'error';
  details?: string;
  lastChecked: string;
}

interface SystemHealthProps {
  components?: SystemComponentType[];
  isLoading?: boolean;
}

function SystemHealth({ components = [], isLoading = false }: SystemHealthProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {components.map((component, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center gap-2">
            {component.status === 'good' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : component.status === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="font-medium text-slate-800 text-sm">{component.name}</p>
              {component.details && <p className="text-xs text-slate-500">{component.details}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={
              component.status === 'good' 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : component.status === 'warning'
                ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                : 'bg-red-50 text-red-600 border border-red-100'
            }>
              {component.status === 'good' ? 'Good' : 
                component.status === 'warning' ? 'Warning' : 'Error'}
            </Badge>
            <span className="text-xs text-slate-500">{component.lastChecked}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPending, startTransition] = useTransition();
  const [, navigate] = useLocation();
  
  // Content generation controls state
  const [lengthValue, setLengthValue] = useState<number[]>([50]); // Default to moderate
  const [toneValue, setToneValue] = useState<number[]>([25]); // Default to professional
  
  // Handle tab changes with startTransition to prevent UI suspension errors
  const handleTabChange = (value: string) => {
    startTransition(() => {
      setActiveTab(value);
    });
  };
  
  // Fetch dashboard metrics (mocked for now)
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    queryFn: async () => {
      // In production, this would fetch data from the backend
      return {
        totalPages: 8,
        totalToolsInstalled: 5,
        latestPage: { title: 'Contact Us', url: '/contact', createdAt: '2025-04-18T15:30:00' },
        lastUpdated: '2025-04-22T09:45:00',
        // Weekly growth metrics
        weeklyGrowth: {
          pageViews: '+12%',
          visitors: '+8%',
          conversions: '+5%'
        }
      };
    },
  });

  // Fetch recent activity (mocked for now)
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/dashboard/activities'],
    queryFn: async () => {
      // In production, this would fetch data from the backend
      return [
        { 
          id: 1, 
          type: 'page_published', 
          title: 'Page Published', 
          description: 'Services page was published', 
          timestamp: '2025-04-22T08:30:00' 
        },
        { 
          id: 2, 
          type: 'tool_installed', 
          title: 'Tool Installed', 
          description: 'Lead Tracker was installed', 
          timestamp: '2025-04-21T14:15:00' 
        },
        { 
          id: 3, 
          type: 'backup_completed', 
          title: 'Backup Completed', 
          description: 'Automatic daily backup', 
          timestamp: '2025-04-20T23:00:00' 
        },
        { 
          id: 4, 
          type: 'system_update', 
          title: 'System Update', 
          description: 'Blueprint updated to v1.1.1', 
          timestamp: '2025-04-20T10:45:00' 
        }
      ];
    },
  });

  // Fetch installed tools (mocked for now)
  const { data: tools, isLoading: isLoadingTools } = useQuery({
    queryKey: ['/api/dashboard/tools'],
    queryFn: async () => {
      // In production, this would fetch data from the backend
      return [
        {
          id: 1,
          name: 'Lead Tracker',
          description: 'Capture and manage leads from your website',
          status: 'active',
          icon: <Cpu />,
          lastUsed: '2025-04-22T09:30:00'
        },
        {
          id: 2,
          name: 'Social Media Generator',
          description: 'Create professional social media posts',
          status: 'active',
          icon: <PenTool />,
          lastUsed: '2025-04-21T16:45:00'
        },
        {
          id: 3,
          name: 'SEO Analyzer',
          description: 'Analyze and improve your SEO performance',
          status: 'active',
          icon: <BarChart3 />,
          lastUsed: '2025-04-20T11:15:00'
        }
      ];
    },
  });

  // We now use IndustryNewsfeed component for news, this legacy query can be removed

  // Fetch system health (mocked for now)
  const { data: systemHealth, isLoading: isLoadingSystemHealth } = useQuery({
    queryKey: ['/api/dashboard/system-health'],
    queryFn: async () => {
      // In production, this would fetch data from the backend
      return {
        components: [
          { name: 'Database', status: 'good' as const, lastChecked: '5m ago' },
          { name: 'API Services', status: 'good' as const, lastChecked: '5m ago' },
          { name: 'Storage', status: 'warning' as const, details: '78% used', lastChecked: '5m ago' },
          { name: 'Backup System', status: 'good' as const, lastChecked: '5m ago' },
          { name: 'Email Services', status: 'good' as const, lastChecked: '5m ago' }
        ],
        lastFullCheck: '2025-04-22T08:00:00'
      };
    },
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Time ago formatter
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  // Get status icon
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'page_published':
        return <Globe className="h-5 w-5" />;
      case 'tool_installed':
        return <Cpu className="h-5 w-5" />;
      case 'backup_completed':
        return <Database className="h-5 w-5" />;
      case 'system_update':
        return <Zap className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
      <div className="space-y-6 p-2 sm:p-4 md:p-6 bg-background">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-[#008080]">Admin Dashboard</h1>
            <p className="text-gray-700 dark:text-gray-300">Welcome back, {user?.username || 'User'}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <ActionButton variant="default" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </ActionButton>
            <GradientButton 
              gradient="pink-coral"
              className="gap-2"
              onClick={() => navigate("/page-builder/page/new")}
            >
              <Plus className="h-4 w-4" />
              Create New Page
            </GradientButton>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="overflow-x-auto pb-1 mb-1">
            <TabsList className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 mb-4 p-1 flex w-max min-w-full sm:w-auto">
              <TabsTrigger 
                value="overview" 
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-[#008080]/10 data-[state=active]:text-[#008080] data-[state=active]:border-b-2 data-[state=active]:border-[#008080] whitespace-nowrap text-sm"
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5 inline-block" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-[#008080]/10 data-[state=active]:text-[#008080] data-[state=active]:border-b-2 data-[state=active]:border-[#008080] whitespace-nowrap text-sm"
              >
                <FileText className="h-4 w-4 mr-1.5 inline-block" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-[#008080]/10 data-[state=active]:text-[#008080] data-[state=active]:border-b-2 data-[state=active]:border-[#008080] whitespace-nowrap text-sm"
              >
                <Cpu className="h-4 w-4 mr-1.5 inline-block" />
                <span>Tools</span>
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-[#008080]/10 data-[state=active]:text-[#008080] data-[state=active]:border-b-2 data-[state=active]:border-[#008080] whitespace-nowrap text-sm"
              >
                <Settings className="h-4 w-4 mr-1.5 inline-block" />
                <span>System</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-0">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Pages"
                value={metrics?.totalPages || 0}
                icon={<FileText className="h-5 w-5" />}
                color="navy"
                isGradient={false}
                className="shadow-lg"
              />
              <StatCard
                label="Tools Installed"
                value={metrics?.totalToolsInstalled || 0}
                icon={<Cpu className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Latest Update"
                value={metrics?.lastUpdated ? formatDate(metrics.lastUpdated) : 'N/A'}
                icon={<Clock className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Security Status"
                value="Protected"
                icon={<ShieldCheck className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
            </div>

            {/* Two-column layout for main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Website Performance</CardTitle>
                    <CardDescription className="text-gray-700">Traffic and engagement for the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartPlaceholder height={280} isLoading={isLoadingMetrics} />
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription className="text-gray-700">Latest actions and system updates</CardDescription>
                    </div>
                    <Link href="/activity-log">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View all
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {isLoadingActivities ? (
                      // Loading skeleton
                      <>
                        <ActivityItem
                          icon={<></>}
                          title=""
                          description=""
                          time=""
                          isLoading={true}
                        />
                        <ActivityItem
                          icon={<></>}
                          title=""
                          description=""
                          time=""
                          isLoading={true}
                        />
                        <ActivityItem
                          icon={<></>}
                          title=""
                          description=""
                          time=""
                          isLoading={true}
                        />
                      </>
                    ) : (
                      // Actual activity items
                      activities?.map(activity => (
                        <ActivityItem
                          key={activity.id}
                          icon={getActivityIcon(activity.type)}
                          title={activity.title}
                          description={activity.description}
                          time={timeAgo(activity.timestamp)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Actions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription className="text-gray-700">Common tasks and actions</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <QuickAction
                      title="Create New Page"
                      description="Design and publish a new page"
                      icon={<FileText className="h-5 w-5" />}
                      link="/page-builder/page/new"
                      variant="primary" 
                    />
                    <QuickAction
                      title="Install New Tool"
                      description="Browse the tool marketplace"
                      icon={<Layers className="h-5 w-5" />}
                      link="/tool-marketplace"
                      variant="secondary"
                    />
                    <QuickAction
                      title="Insights Dashboard"
                      description="Track and analyze user feedback"
                      icon={<BarChart3 className="h-5 w-5" />}
                      link="/admin/insights-dashboard"
                      variant="secondary"
                    />
                    <QuickAction
                      title="Manage Insight Users"
                      description="Add and edit insight users"
                      icon={<Users className="h-5 w-5" />}
                      link="/admin/insight-users"
                      variant="outline"
                    />
                    <QuickAction
                      title="View Website"
                      description="See your live website"
                      icon={<Globe className="h-5 w-5" />}
                      link="/"
                      variant="secondary"
                    />
                    <QuickAction
                      title="Media Library"
                      description="Manage your media files"
                      icon={<ImageIcon className="h-5 w-5" />}
                      link="/media"
                      variant="outline"
                    />
                    <QuickAction
                      title="Blueprint Management"
                      description="Extract and manage templates"
                      icon={<Copy className="h-5 w-5" />}
                      link="/admin/blueprint-management"
                      variant="outline"
                    />
                  </CardContent>
                </Card>

                {/* Industry News - Now using LightweightNewsfeed component */}
                <Suspense fallback={
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-600 animate-pulse rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-600 animate-pulse rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-600 animate-pulse rounded w-4/6"></div>
                  </div>
                }>
                  <LightweightNewsfeed />
                </Suspense>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      System Health
                      <Badge variant="teal-blue" className="ml-2">
                        Healthy
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-700">Current system status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SystemHealth 
                      components={systemHealth?.components} 
                      isLoading={isLoadingSystemHealth} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Published Pages"
                value="8"
                icon={<FileText className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Draft Pages"
                value="3"
                icon={<FileText className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Media Files"
                value="42"
                icon={<ImageIcon className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Pages Overview</CardTitle>
                    <CardDescription className="text-gray-700">Status of your website pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Page list would go here */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">Homepage</p>
                            <p className="text-xs text-gray-500">Last updated 2 days ago</p>
                          </div>
                        </div>
                        <Badge variant="teal-blue">Published</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">About Us</p>
                            <p className="text-xs text-gray-500">Last updated 3 days ago</p>
                          </div>
                        </div>
                        <Badge variant="teal-blue">Published</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">Services</p>
                            <p className="text-xs text-gray-500">Last updated 1 day ago</p>
                          </div>
                        </div>
                        <Badge variant="teal-blue">Published</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Resources</p>
                            <p className="text-xs text-gray-500">Created 5 hours ago</p>
                          </div>
                        </div>
                        <Badge variant="pink-coral">Draft</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Pages
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Stats</CardTitle>
                    <CardDescription className="text-gray-700">Content performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">SEO Score</span>
                        <span className="text-sm font-medium">84/100</span>
                      </div>
                      <Progress value={84} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Content Completeness</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Media Optimization</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Content Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/page-builder/page/new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Page
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Upload Media
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Palette className="mr-2 h-4 w-4" />
                      Edit Brand Guidelines
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Templates
                    </Button>
                  </CardContent>
                </Card>

                {/* Add the content generation controls below the templates */}
                <div className="mt-6">
                  <ContentGenerationControls
                    lengthValue={lengthValue}
                    setLengthValue={setLengthValue}
                    toneValue={toneValue}
                    setToneValue={setToneValue}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Installed Tools"
                value={tools?.length || 0}
                icon={<Cpu className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Available Updates"
                value="2"
                icon={<Sparkles className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Data Usage"
                value="28%"
                icon={<Database className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Installed Tools</CardTitle>
                      <CardDescription className="text-gray-700">Your active tools and applications</CardDescription>
                    </div>
                    <Link href="/tool-marketplace">
                      <Button variant="ghost" size="sm" className="gap-1">
                        Browse Marketplace
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingTools ? (
                        // Loading skeleton
                        <>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-100 rounded w-48"></div>
                              </div>
                            </div>
                            <div className="h-8 w-20 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-100 rounded w-48"></div>
                              </div>
                            </div>
                            <div className="h-8 w-20 bg-gray-200 rounded"></div>
                          </div>
                        </>
                      ) : (
                        // Actual tool items
                        tools?.map(tool => (
                          <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center text-navy">
                                {tool.icon}
                              </div>
                              <div>
                                <p className="font-medium">{tool.name}</p>
                                <p className="text-xs text-gray-500">{tool.description}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={tool.status === 'active' ? 'teal-blue' : 'outline'}
                              className={tool.status !== 'active' ? 'bg-gray-100 text-gray-700 border-0' : ''}
                            >
                              {tool.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Manage Tools
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="border-[#008080] border">
                  <CardHeader className="bg-[#008080]">
                    <CardTitle className="text-white">Tool Marketplace</CardTitle>
                    <CardDescription className="text-white/90">Discover new tools to enhance your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 dark:text-white mb-1">Featured Tool</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">Advanced Analytics Dashboard</p>
                      <Button className="w-full bg-[#008080] hover:bg-[#006666] text-white">
                        Learn More
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 dark:text-white mb-1">Popular Categories</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="teal-tag">Analytics</Badge>
                        <Badge variant="teal-tag">Marketing</Badge>
                        <Badge variant="teal-tag">Finance</Badge>
                        <Badge variant="teal-tag">Productivity</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-[#008080] hover:bg-[#008080]/5">
                      Explore Marketplace
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tool Updates</CardTitle>
                    <CardDescription className="text-gray-700">Available updates for your tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                          <PenTool className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">Social Media Generator</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">v2.1.0 available</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080]/5">Update</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">SEO Analyzer</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">v1.5.2 available</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080]/5">Update</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Insights Dashboard Card */}
                <Card className="mt-6 border-[#008080] border">
                  <CardHeader className="bg-[#008080]">
                    <CardTitle className="text-white">Insights Dashboard</CardTitle>
                    <CardDescription className="text-white/90">Track and analyze user feedback</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                          <BarChart3 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">Track User Insights</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">View leaderboard and track engagement</p>
                        </div>
                      </div>
                      <Link href="/admin/insights-dashboard">
                        <Button size="sm" className="bg-[#008080] hover:bg-[#006666]">Open</Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">Manage Users</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Add and edit insight contributors</p>
                        </div>
                      </div>
                      <Link href="/admin/insight-users">
                        <Button size="sm" variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080]/5">Manage</Button>
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/admin/insights-dashboard" className="w-full">
                      <Button variant="outline" className="w-full border-[#008080] text-[#008080] hover:bg-[#008080]/5">
                        View Insights Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="System Status"
                value="Healthy"
                icon={<CheckCircle2 className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Last Backup"
                value="Today, 2:45 AM"
                icon={<HardDrive className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
              <StatCard
                label="Storage Used"
                value="28%"
                icon={<Database className="h-5 w-5" />}
                color="navy"
                isGradient={false}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300">Status of system components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SystemHealth 
                      components={systemHealth?.components} 
                      isLoading={isLoadingSystemHealth} 
                    />
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Backups</CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300">Latest system backups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-[#008080]" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">Daily Backup</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Today, 2:45 AM • 840 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080]/5">Download</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-[#008080]" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">Daily Backup</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 2:45 AM • 825 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080]/5">Download</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-[#008080]" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">Weekly Backup</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Apr 21, 2:45 PM • 1.2 GB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080]/5">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-[#008080] text-[#008080] hover:bg-[#008080]/5">
                      View All Backups
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Actions</CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300">Maintenance and system operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-[#008080] text-[#008080] hover:bg-[#008080]/5">
                      <HardDrive className="mr-2 h-4 w-4" />
                      Create Backup Now
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-[#008080] text-[#008080] hover:bg-[#008080]/5">
                      <Rocket className="mr-2 h-4 w-4" />
                      Deploy Website
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-[#008080] text-[#008080] hover:bg-[#008080]/5">
                      <Settings className="mr-2 h-4 w-4" />
                      System Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                      <ListChecks className="mr-2 h-4 w-4" />
                      Run System Diagnostics
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Usage</CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300">Distribution of system storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">Media Files</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">45%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#008080] rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">Database</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">30%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#008080] rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">Backups</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">15%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#008080] rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">Other</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">10%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#008080] rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Storage: 800 MB used of 3 GB</p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}