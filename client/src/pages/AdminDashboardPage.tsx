import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertTriangle,
  ArrowRight, 
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
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
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

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
  // Define the color scheme with proper type
  const scheme = {
    navy: {
      bg: isGradient ? 'from-navy via-blue-900 to-blue-950' : 'bg-white',
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-navy/10 text-navy',
    },
    orange: {
      bg: isGradient ? 'from-orange-500 via-orange-600 to-orange-800' : 'bg-white', 
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-orange-500/10 text-orange-500',
    },
    emerald: {
      bg: isGradient ? 'from-emerald-500 via-emerald-600 to-emerald-800' : 'bg-white',
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-emerald-500/10 text-emerald-500',
    },
    indigo: {
      bg: isGradient ? 'from-indigo-500 via-indigo-600 to-indigo-800' : 'bg-white',
      icon: isGradient ? 'bg-white/40 text-white' : 'bg-indigo-500/10 text-indigo-500',
    }
  };

  return (
    <Card className={`overflow-hidden border-0 ${isGradient ? 'shadow-lg shadow-' + color + '/10' : 'shadow-md border-2 border-gray-200'} ${className}`}>
      <div className={`${isGradient ? 'bg-gradient-to-br ' + scheme[color].bg : scheme[color].bg} p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${isGradient ? 'text-white/80' : 'text-gray-700'}`}>{label}</p>
            <h3 className={`text-2xl font-bold mt-1 ${isGradient ? 'text-white' : 'text-navy'}`}>{value}</h3>
            {change && (
              <p className={`text-xs font-medium mt-1 flex items-center ${isPositive ? (isGradient ? 'text-white/90' : 'text-emerald-500') : (isGradient ? 'text-white/90' : 'text-red-500')}`}>
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
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          {description && <p className="text-sm text-gray-700 mt-1">{description}</p>}
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
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {isLoading ? (
        <>
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
          </div>
        </>
      ) : (
        <>
          <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center text-navy">
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-navy">{title}</p>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
          <div className="text-xs text-gray-600">{time}</div>
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
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded"></div>
      ) : (
        <div className="absolute inset-0">
          <AnalyticsChart />
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
    primary: 'bg-gradient-to-br from-navy via-blue-900 to-blue-950 text-white hover:shadow-lg hover:shadow-navy/20',
    secondary: 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 text-white hover:shadow-lg hover:shadow-orange-500/20',
    outline: 'border-2 border-navy/40 hover:border-navy/60 bg-white text-navy',
    ghost: 'bg-gray-200 hover:bg-gray-300 text-navy',
  };

  return (
    <Link href={link}>
      <div className={`p-4 rounded-xl transition-all ${variantStyles[variant]} relative`}>
        <div className="flex items-start gap-3">
          {icon && (
            <div className={`${variant === 'outline' || variant === 'ghost' ? 'text-navy' : 'text-white'}`}>
              {icon}
            </div>
          )}
          <div>
            <h3 className={`font-medium ${variant === 'outline' || variant === 'ghost' ? 'text-navy' : 'text-white'}`}>{title}</h3>
            <p className={`text-sm mt-1 ${variant === 'outline' || variant === 'ghost' ? 'text-gray-700' : 'text-white/90'}`}>{description}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <ArrowUpRight className={`h-4 w-4 ${variant === 'outline' || variant === 'ghost' ? 'text-navy/60' : 'text-white/60'}`} />
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
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {components.map((component, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            {component.status === 'good' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : component.status === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="font-medium">{component.name}</p>
              {component.details && <p className="text-xs text-gray-700">{component.details}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={
              component.status === 'good' 
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0'
                : component.status === 'warning'
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-50 border-0'
                : 'bg-red-50 text-red-700 hover:bg-red-50 border-0'
            }>
              {component.status === 'good' ? 'Good' : 
                component.status === 'warning' ? 'Warning' : 'Error'}
            </Badge>
            <span className="text-xs text-gray-600">{component.lastChecked}</span>
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

  // Fetch industry news (mocked for now)
  const { data: news, isLoading: isLoadingNews } = useQuery({
    queryKey: ['/api/dashboard/news'],
    queryFn: async () => {
      // In production, this would fetch data from the backend
      return [
        { 
          id: 1, 
          title: 'New Tax Legislation Affecting Small Businesses', 
          excerpt: 'Recent changes to tax legislation will impact how small businesses handle quarterly filings starting next month.',
          category: 'Tax',
          link: '#'
        },
        { 
          id: 2, 
          title: 'Digital Marketing Trends for Accountants', 
          excerpt: 'Learn about emerging digital marketing strategies that are helping accounting firms connect with clients more effectively.',
          category: 'Marketing',
          link: '#'
        },
        { 
          id: 3, 
          title: 'Client Communication Best Practices', 
          excerpt: 'Streamline your client communications with these expert-recommended approaches and templates.',
          category: 'Client Relations',
          link: '#'
        }
      ];
    },
  });

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
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
            <p className="text-gray-700">Welcome back, {user?.username || 'User'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="gap-2 bg-navy hover:bg-navy/90">
              <Plus className="h-4 w-4" />
              Create New Page
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-50 border border-gray-200 mb-6 p-1">
            <TabsTrigger value="overview" className="text-gray-600 hover:text-gray-800 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="text-gray-600 hover:text-gray-800 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-gray-600 hover:text-gray-800 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
              <Cpu className="h-4 w-4 mr-2" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="system" className="text-gray-600 hover:text-gray-800 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-0">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Pages"
                value={metrics?.totalPages || 0}
                icon={<FileText className="h-5 w-5" />}
                color="navy"
                isGradient={true}
                className="shadow-lg"
              />
              <StatCard
                label="Tools Installed"
                value={metrics?.totalToolsInstalled || 0}
                icon={<Cpu className="h-5 w-5" />}
                color="orange"
                isGradient={true}
              />
              <StatCard
                label="Latest Update"
                value={metrics?.lastUpdated ? formatDate(metrics.lastUpdated) : 'N/A'}
                icon={<Clock className="h-5 w-5" />}
                color="emerald"
                isGradient={true}
              />
              <StatCard
                label="Security Status"
                value="Protected"
                icon={<ShieldCheck className="h-5 w-5" />}
                color="indigo"
                isGradient={true}
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
                      link="/page-builder/new"
                      variant="outline"
                    />
                    <QuickAction
                      title="Install New Tool"
                      description="Browse the tool marketplace"
                      icon={<Layers className="h-5 w-5" />}
                      link="/tool-marketplace"
                      variant="secondary"
                    />
                    <QuickAction
                      title="View Website"
                      description="See your live website"
                      icon={<Globe className="h-5 w-5" />}
                      link="/"
                      variant="outline"
                    />
                    <QuickAction
                      title="Media Library"
                      description="Manage your media files"
                      icon={<ImageIcon className="h-5 w-5" />}
                      link="/media"
                      variant="outline"
                    />
                  </CardContent>
                </Card>

                {/* Industry News */}
                <Card className="border-navy border-2">
                  <CardHeader className="bg-navy text-white pb-3">
                    <CardTitle className="text-white">Industry News</CardTitle>
                    <CardDescription className="text-white/80">Latest updates from your sector</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {isLoadingNews ? (
                      // Loading skeleton
                      <>
                        <div className="border-b border-gray-200 pb-3 mb-3 last:mb-0 last:pb-0 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                        </div>
                        <div className="border-b border-gray-200 pb-3 mb-3 last:mb-0 last:pb-0 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                        </div>
                      </>
                    ) : (
                      // Actual news items
                      news?.map(item => (
                        <div key={item.id} className="border-b border-gray-200 pb-3 mb-3 last:mb-0 last:pb-0 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
                              {item.category}
                            </Badge>
                          </div>
                          <Link href={item.link || '#'}>
                            <h3 className="font-medium text-navy hover:text-blue-600 transition-colors">{item.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.excerpt}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full text-navy hover:bg-navy/5">
                      Read more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      System Health
                      <Badge variant="outline" className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
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
              />
              <StatCard
                label="Draft Pages"
                value="3"
                icon={<FileText className="h-5 w-5" />}
                color="orange"
              />
              <StatCard
                label="Media Files"
                value="42"
                icon={<ImageIcon className="h-5 w-5" />}
                color="emerald"
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
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-0">Published</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">About Us</p>
                            <p className="text-xs text-gray-500">Last updated 3 days ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-0">Published</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">Services</p>
                            <p className="text-xs text-gray-500">Last updated 1 day ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-0">Published</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Resources</p>
                            <p className="text-xs text-gray-500">Created 5 hours ago</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-0">Draft</Badge>
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
                    <Button variant="outline" className="w-full justify-start">
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
              />
              <StatCard
                label="Available Updates"
                value="2"
                icon={<Sparkles className="h-5 w-5" />}
                color="orange"
              />
              <StatCard
                label="Data Usage"
                value="28%"
                icon={<Database className="h-5 w-5" />}
                color="emerald"
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
                              variant="outline" 
                              className={tool.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-700 border-0' 
                                : 'bg-gray-100 text-gray-700 border-0'
                              }
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
                <Card className="border-navy border-2">
                  <CardHeader className="bg-navy">
                    <CardTitle className="text-white">Tool Marketplace</CardTitle>
                    <CardDescription className="text-white/90">Discover new tools to enhance your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-navy mb-1">Featured Tool</h3>
                      <p className="text-gray-700 text-sm mb-3">Advanced Analytics Dashboard</p>
                      <Button className="w-full bg-navy text-white hover:bg-navy/90">
                        Learn More
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-navy mb-1">Popular Categories</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-navy/10 text-navy hover:bg-navy/20 border-0">Analytics</Badge>
                        <Badge variant="outline" className="bg-navy/10 text-navy hover:bg-navy/20 border-0">Marketing</Badge>
                        <Badge variant="outline" className="bg-navy/10 text-navy hover:bg-navy/20 border-0">Finance</Badge>
                        <Badge variant="outline" className="bg-navy/10 text-navy hover:bg-navy/20 border-0">Productivity</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-navy hover:bg-navy/5">
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
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <PenTool className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Social Media Generator</p>
                          <p className="text-xs text-gray-500">v2.1.0 available</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">SEO Analyzer</p>
                          <p className="text-xs text-gray-500">v1.5.2 available</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                  </CardContent>
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
                color="emerald"
              />
              <StatCard
                label="Last Backup"
                value="Today, 2:45 AM"
                icon={<HardDrive className="h-5 w-5" />}
                color="navy"
              />
              <StatCard
                label="Storage Used"
                value="28%"
                icon={<Database className="h-5 w-5" />}
                color="orange"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription className="text-gray-700">Status of system components</CardDescription>
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
                    <CardDescription className="text-gray-700">Latest system backups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">Daily Backup</p>
                            <p className="text-xs text-gray-500">Today, 2:45 AM • 840 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">Daily Backup</p>
                            <p className="text-xs text-gray-500">Yesterday, 2:45 AM • 825 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-navy" />
                          <div>
                            <p className="font-medium">Weekly Backup</p>
                            <p className="text-xs text-gray-500">Apr 21, 2:45 PM • 1.2 GB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
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
                    <CardDescription className="text-gray-700">Maintenance and system operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <HardDrive className="mr-2 h-4 w-4" />
                      Create Backup Now
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Rocket className="mr-2 h-4 w-4" />
                      Deploy Website
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
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
                    <CardDescription className="text-gray-700">Distribution of system storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Media Files</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Database</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Backups</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Other</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-gray-500">Total Storage: 800 MB used of 3 GB</p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}