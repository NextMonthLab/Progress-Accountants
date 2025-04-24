import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen,
  FileText, 
  LayoutDashboard, 
  Image as ImageIcon, 
  PencilRuler, 
  Palette, 
  SquareCode,
  MessageCircle, 
  Globe, 
  Rocket, 
  Plus, 
  ListChecks, 
  ArrowRight, 
  ArrowUpRight,
  Settings,
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Layers,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  Activity,
  Database,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { Link } from "wouter";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

// Section component
interface SectionProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, description, action, children }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && (
          <Link href={action.href}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-navy hover:text-orange-500"
            >
              {action.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

// Action Button component
interface ActionButtonProps {
  label: string;
  description?: string;
  link: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'outline';
  isNew?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  description, 
  link, 
  icon, 
  variant = 'outline',
  isNew = false
}) => {
  return (
    <Link href={link}>
      <Button 
        variant={variant === 'primary' ? 'default' : 'outline'} 
        className={`w-full justify-start relative group ${variant === 'primary' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'}`}
      >
        <div className="flex items-center space-x-3">
          <div className={`${variant === 'primary' ? 'text-white' : 'text-orange-500'}`}>
            {icon}
          </div>
          <div className="text-left">
            <span className="font-medium block">{label}</span>
            {description && <span className="text-xs opacity-80">{description}</span>}
          </div>
        </div>
        <ArrowUpRight className={`h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${variant === 'primary' ? 'text-white' : 'text-orange-500'}`} />
        {isNew && (
          <Badge className="absolute -top-2 -right-2 bg-emerald-500">New</Badge>
        )}
      </Button>
    </Link>
  );
};

// Types
interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  imageUrl?: string;
  link?: string;
  isLoading?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  title, 
  excerpt, 
  date, 
  category, 
  imageUrl,
  link,
  isLoading = false 
}) => {
  return (
    <div className="border-b border-white/10 pb-4 mb-4 last:mb-0 last:pb-0 last:border-0">
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/80 mt-1 mb-2 line-clamp-2">{excerpt}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/70">{date}</span>
            {category && (
              <Badge variant="outline" className="px-1.5 py-0 h-5 font-normal text-white border-white/20 bg-white/10">
                {category}
              </Badge>
            )}
          </div>
          {link && (
            <div className="mt-3">
              <Link href={link}>
                <Button variant="ghost" size="sm" className="h-7 px-0 text-orange-300 hover:text-orange-200 font-medium">
                  Read more
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Health Status Component
interface HealthStatusProps {
  title: string;
  status: 'good' | 'warning' | 'critical' | 'unknown';
  details?: string;
  lastChecked?: string;
  isLoading?: boolean;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ 
  title, 
  status, 
  details,
  lastChecked,
  isLoading = false 
}) => {
  const statusConfig = {
    good: {
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      icon: <CheckCircle2 className="h-5 w-5" />,
      label: "Good"
    },
    warning: {
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Warning"
    },
    critical: {
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: <XCircle className="h-5 w-5" />,
      label: "Critical"
    },
    unknown: {
      color: "text-gray-400",
      bgColor: "bg-gray-50",
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Unknown"
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-0">
      {isLoading ? (
        <div className="w-full flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="font-medium text-navy">{title}</span>
            {details && <span className="text-xs text-gray-500">{details}</span>}
          </div>
          <div className="flex items-center gap-2">
            {lastChecked && <span className="text-xs text-gray-400">{lastChecked}</span>}
            <div className={`flex items-center gap-1 ${config.color} ${config.bgColor} px-2 py-1 rounded text-xs`}>
              {config.icon}
              <span>{config.label}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function RedesignedDashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for progress animation
  const [pageProgress, setPageProgress] = useState(0);
  const [toolsProgress, setToolsProgress] = useState(0);
  
  // Animate progress bars on load
  useEffect(() => {
    const timer = setTimeout(() => setPageProgress(80), 500);
    const timer2 = setTimeout(() => setToolsProgress(65), 700);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);
  
  // Site Overview
  const { data: siteOverview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['/api/pages/count', '/api/tools/installed/count', '/api/pages/latest', '/api/site/last_updated'],
    queryFn: async () => {
      // This would normally fetch from the actual endpoints
      return {
        totalPages: 8,
        totalToolsInstalled: 5,
        latestPage: { title: 'Contact Us', url: '/contact', createdAt: '2025-04-18T15:30:00' },
        lastUpdated: '2025-04-22T09:45:00',
        // Weekly growth metrics
        weeklyPageViews: 425,
        pageViewsTrend: 12.5,
        uniqueVisitors: 128,
        visitorsTrend: 8.3,
        avgTimeOnSite: '2m 45s',
        timeOnSiteTrend: -4.2,
      };
    },
  });

  // Activity Feed
  const { data: activityFeed, isLoading: isActivityLoading } = useQuery<ActivityItem[]>({
    queryKey: ['/api/activity/recent'],
    queryFn: async () => {
      return [
        { 
          id: 1, 
          type: 'page_published', 
          title: 'Page Published', 
          description: 'Services page was published', 
          timestamp: '2025-04-22T14:30:00',
          status: 'success' as const
        },
        { 
          id: 2, 
          type: 'tool_installed', 
          title: 'Tool Installed', 
          description: 'Lead Tracker was installed', 
          timestamp: '2025-04-22T12:15:00',
          status: 'success' as const
        },
        { 
          id: 3, 
          type: 'backup_completed', 
          title: 'Backup Completed', 
          description: 'Automatic daily backup', 
          timestamp: '2025-04-22T02:00:00',
          status: 'info' as const
        },
        { 
          id: 4, 
          type: 'system_update', 
          title: 'System Update', 
          description: 'Blueprint updated to v1.1.1', 
          timestamp: '2025-04-21T18:45:00',
          status: 'info' as const
        },
      ];
    },
  });

  // Tools Status
  const { data: toolStatus, isLoading: isToolStatusLoading } = useQuery({
    queryKey: ['/api/tools/status'],
    queryFn: async () => {
      return [
        {
          id: 1,
          name: 'Lead Tracker',
          description: 'Capture and manage leads from your website',
          status: 'active',
          icon: <Users className="h-6 w-6" />,
          link: '/admin/tools/lead-tracker'
        },
        {
          id: 2,
          name: 'Content Builder',
          description: 'Create dynamic content with AI assistance',
          status: 'active',
          icon: <Layers className="h-6 w-6" />,
          link: '/admin/tools/content-builder'
        },
        {
          id: 3,
          name: 'Analytics Dashboard',
          description: 'Track website performance and visitor insights',
          status: 'active',
          icon: <BarChart3 className="h-6 w-6" />,
          link: '/admin/tools/analytics'
        },
        {
          id: 4,
          name: 'Social Media Generator',
          description: 'Create and schedule posts across platforms',
          status: 'pending',
          icon: <BookOpen className="h-6 w-6" />,
          link: '/admin/tools/social-media'
        },
      ];
    },
  });

  // Industry News
  const { data: industryNews, isLoading: isNewsLoading } = useQuery({
    queryKey: ['/api/newsfeed/featured'],
    queryFn: async () => {
      return [
        { 
          id: 1, 
          title: 'New Tax Legislation Affecting Small Businesses', 
          excerpt: 'Recent changes to tax legislation will impact how small businesses handle quarterly filings starting next month.',
          category: 'Tax',
          date: '2025-04-22',
          link: '/news/tax-legislation-updates'
        },
        { 
          id: 2, 
          title: 'Financial Reporting Changes Coming Next Quarter', 
          excerpt: 'The IFRS has announced new guidelines for financial reporting that will be mandatory for all businesses starting next quarter.',
          category: 'Finance',
          date: '2025-04-20',
          link: '/news/financial-reporting-changes'
        },
        { 
          id: 3, 
          title: 'How Digital Transformation is Changing Accounting', 
          excerpt: 'A look at how AI and automation are revolutionizing traditional accounting practices and what it means for the industry.',
          category: 'Technology',
          date: '2025-04-18',
          link: '/news/digital-transformation-accounting'
        },
      ];
    },
  });

  // System Health
  const { data: systemHealth, isLoading: isHealthLoading } = useQuery({
    queryKey: ['/api/system/health'],
    queryFn: async () => {
      return {
        components: [
          { name: 'Database', status: 'good' as const, lastChecked: '5m ago' },
          { name: 'API Services', status: 'good' as const, lastChecked: '5m ago' },
          { name: 'Storage', status: 'warning' as const, details: '78% used', lastChecked: '5m ago' },
          { name: 'Backup System', status: 'good' as const, lastChecked: '5m ago' },
          { name: 'Blueprint System', status: 'good' as const, lastChecked: '5m ago' },
        ],
        blueprintVersion: 'v1.1.1',
        storageUsed: '128MB / 1GB',
        lastBackup: '2025-04-22T02:00:00',
        uptime: '99.8%',
      };
    },
  });

  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time ago helper
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
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
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <AdminLayout>
      <div className="px-1 py-6 md:px-4 lg:px-6">
        {/* Hero Section with Welcome and Overview Stats */}
        <div className="mb-8 bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="md:max-w-lg">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}</h1>
              <p className="text-white mb-6">
                Here's what's happening with {tenant?.name || 'your website'} today.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-white">Website Status</span>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">Online</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-white" />
                    <span className="font-medium">All systems operational</span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm font-medium text-white mb-2">Website Completeness</p>
                  <div className="mb-2">
                    <Progress value={pageProgress} className="h-2 bg-white/20" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{pageProgress}% complete</span>
                    <Link href="/admin/setup-checklist">
                      <span className="text-white hover:text-white/90 flex items-center gap-1">
                        Setup checklist
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:max-w-md">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">Page Views</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{siteOverview?.weeklyPageViews || '--'}</span>
                  <Badge 
                    className={`flex items-center ${siteOverview?.pageViewsTrend && siteOverview.pageViewsTrend > 0 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                  >
                    {siteOverview?.pageViewsTrend && siteOverview.pageViewsTrend > 0 ? '+' : ''}{siteOverview?.pageViewsTrend || 0}%
                  </Badge>
                </div>
                <p className="text-xs text-white/70 mt-1">Weekly total</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">Unique Visitors</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{siteOverview?.uniqueVisitors || '--'}</span>
                  <Badge 
                    className={`flex items-center ${siteOverview?.visitorsTrend && siteOverview.visitorsTrend > 0 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                  >
                    {siteOverview?.visitorsTrend && siteOverview.visitorsTrend > 0 ? '+' : ''}{siteOverview?.visitorsTrend || 0}%
                  </Badge>
                </div>
                <p className="text-xs text-white/70 mt-1">Weekly total</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">Total Pages</span>
                </div>
                <span className="text-2xl font-bold">{siteOverview?.totalPages || '--'}</span>
                <p className="text-xs text-white/70 mt-1">Published pages</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">Avg. Session</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{siteOverview?.avgTimeOnSite || '--'}</span>
                  <Badge 
                    className={`flex items-center ${siteOverview?.timeOnSiteTrend && siteOverview.timeOnSiteTrend > 0 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                  >
                    {siteOverview?.timeOnSiteTrend && siteOverview.timeOnSiteTrend > 0 ? '+' : ''}{siteOverview?.timeOnSiteTrend || 0}%
                  </Badge>
                </div>
                <p className="text-xs text-white/70 mt-1">Time on site</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-white">
              Content
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-white">
              Tools
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white">
              System
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content - left 2/3 */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Activity */}
                <Section 
                  title="Recent Activity" 
                  description="Latest actions and system updates"
                  action={{ label: "View all activity", href: "/admin/activity" }}
                >
                  <Card className="border-2 border-gray-200 shadow-md bg-gray-50">
                    <CardContent className="p-0">
                      {isActivityLoading ? (
                        <div className="p-6 space-y-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                              <div className="rounded-full h-10 w-10 bg-gray-200"></div>
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {activityFeed?.map((activity: ActivityItem) => (
                            <div key={activity.id} className="flex items-start p-4 border-b last:border-0">
                              <div className={`rounded-full h-10 w-10 flex items-center justify-center mr-3
                                ${activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                                  activity.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                                  activity.status === 'error' ? 'bg-red-100 text-red-600' : 
                                  'bg-blue-100 text-blue-600'}`}
                              >
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                  <time className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</time>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Section>
                
                {/* Tools Status */}
                <Section 
                  title="Installed Tools" 
                  action={{ label: "Manage tools", href: "/tools-hub" }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {isToolStatusLoading ? (
                      <>
                        {[1, 2, 3, 4].map(i => (
                          <Card key={i} className="border border-gray-200 shadow-sm bg-gray-50">
                            <CardContent className="p-4">
                              <div className="animate-pulse space-y-3">
                                <div className="flex gap-3">
                                  <div className="bg-gray-200 rounded h-12 w-12"></div>
                                  <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                                  </div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    ) : (
                      <>
                        {toolStatus?.map(tool => (
                          <Card key={tool.id} className="border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex gap-3 mb-3">
                                <div className="rounded-md h-12 w-12 bg-orange-100 text-orange-600 flex items-center justify-center">
                                  {tool.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium text-navy">{tool.name}</h3>
                                  <p className="text-xs text-gray-500">{tool.description}</p>
                                </div>
                              </div>
                              <Link href={tool.link}>
                                <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                                  Open Tool
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                </Section>
              </div>
              
              {/* Sidebar - right 1/3 */}
              <div className="space-y-8">
                {/* Quick Actions */}
                <Section title="Quick Actions">
                  <div className="space-y-3">
                    <ActionButton 
                      label="Create New Page" 
                      link="/page-builder/new"
                      icon={<Plus className="h-5 w-5" />}
                      variant="primary"
                      description="Start with a blank canvas or template"
                    />
                    
                    <ActionButton 
                      label="Install New Tool" 
                      link="/marketplace"
                      icon={<SquareCode className="h-5 w-5" />}
                      variant="outline"
                      description="Browse the tool marketplace"
                    />
                    
                    <ActionButton 
                      label="View Website" 
                      link="/"
                      icon={<Globe className="h-5 w-5" />}
                      variant="outline"
                      description="See your live website"
                    />
                  </div>
                </Section>
                
                {/* Industry News */}
                <Section 
                  title="Industry News" 
                  action={{ label: "All news", href: "/admin/news" }}
                >
                  <Card className="border-0 shadow-lg bg-navy-900 dark:bg-navy-900">
                    <CardContent className="p-6 text-white">
                      {isNewsLoading ? (
                        <div className="space-y-6">
                          {[1, 2].map(i => (
                            <NewsCard 
                              key={i}
                              title=""
                              excerpt=""
                              date=""
                              isLoading={true}
                            />
                          ))}
                        </div>
                      ) : (
                        <div>
                          {industryNews?.map(news => (
                            <NewsCard 
                              key={news.id}
                              title={news.title}
                              excerpt={news.excerpt}
                              date={formatDate(news.date)}
                              category={news.category}
                              link={news.link}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content - left 2/3 */}
              <div className="lg:col-span-2 space-y-8">
                {/* Page Performance */}
                <Section 
                  title="Top Performing Pages" 
                  description="Most visited pages in the last 30 days"
                  action={{ label: "View all pages", href: "/admin/content/pages" }}
                >
                  <Card className="border-2 border-gray-200 shadow-md bg-gray-50">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Time</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bounce</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="font-medium text-navy">Home</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">1,245</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">1m 32s</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">28%</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <PencilRuler className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="font-medium text-navy">Services</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">876</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">2m 15s</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">34%</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <PencilRuler className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="font-medium text-navy">About</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">542</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">1m 45s</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">41%</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <PencilRuler className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="font-medium text-navy">Contact</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">328</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">0m 58s</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-700">25%</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <PencilRuler className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </Section>

                {/* Page Creation Trends */}
                <Section 
                  title="Content Creation Activity" 
                  description="Page creation and updates over time"
                >
                  <Card className="border-2 border-gray-200 shadow-md bg-gray-50">
                    <CardContent className="p-6">
                      <AnalyticsChart height={200} />
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Most Active Editor</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-navy">Admin User</p>
                              <p className="text-xs text-gray-500">15 edits this week</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Content Completion</h3>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Pages</span>
                                <span className="font-medium">80%</span>
                              </div>
                              <Progress value={80} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Media</span>
                                <span className="font-medium">65%</span>
                              </div>
                              <Progress value={65} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Section>
              </div>

              {/* Sidebar - right 1/3 */}
              <div className="space-y-8">
                {/* Content Actions */}
                <Section title="Content Actions">
                  <div className="space-y-3">
                    <ActionButton 
                      label="Create New Page" 
                      link="/page-builder/new"
                      icon={<Plus className="h-5 w-5" />}
                      variant="primary"
                      description="Start with a blank canvas or template"
                    />
                    
                    <ActionButton 
                      label="Media Manager" 
                      link="/media"
                      icon={<ImageIcon className="h-5 w-5" />}
                      variant="outline"
                      description="Manage your images and files"
                    />
                    
                    <ActionButton 
                      label="Content Calendar" 
                      link="/admin/content/calendar"
                      icon={<Calendar className="h-5 w-5" />}
                      variant="outline"
                      description="Schedule and organize content"
                      isNew={true}
                    />
                  </div>
                </Section>

                {/* Recents */}
                <Section 
                  title="Recently Updated" 
                  action={{ label: "View all", href: "/admin/content/recent" }}
                >
                  <Card className="border-2 border-gray-200 shadow-md bg-gray-50">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        <div className="flex items-center gap-2 p-3 hover:bg-gray-100">
                          <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center text-orange-600">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-navy truncate">Services Page</h3>
                            <p className="text-xs text-gray-500">Updated 3 hours ago</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 p-3 hover:bg-gray-100">
                          <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-navy truncate">Team Photo</h3>
                            <p className="text-xs text-gray-500">Added 5 hours ago</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 p-3 hover:bg-gray-100">
                          <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-navy truncate">Home Hero Section</h3>
                            <p className="text-xs text-gray-500">Updated 1 day ago</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Section>

                {/* Content Checklist */}
                <Section 
                  title="Content Checklist" 
                  description="Recommended actions for your site"
                >
                  <Card className="border-2 border-gray-200 shadow-md bg-gray-50">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        <div className="p-3 flex items-center gap-2">
                          <div className="rounded-full p-1 bg-emerald-100 text-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-gray-700">Homepage hero section updated</span>
                        </div>
                        <div className="p-3 flex items-center gap-2">
                          <div className="rounded-full p-1 bg-emerald-100 text-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-gray-700">About page content complete</span>
                        </div>
                        <div className="p-3 flex items-center gap-2">
                          <div className="rounded-full p-1 bg-orange-100 text-orange-500">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-gray-700">Add team member photos</span>
                        </div>
                        <div className="p-3 flex items-center gap-2">
                          <div className="rounded-full p-1 bg-orange-100 text-orange-500">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-gray-700">Complete SEO metadata for Services</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                <Section 
                  title="Installed Tools" 
                  description="Tools currently active on your website"
                  action={{ label: "Browse marketplace", href: "/marketplace" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {toolStatus?.map(tool => (
                      <Card key={tool.id} className="border hover:border-orange-200 transition-all">
                        <CardContent className="p-4">
                          <div className="flex gap-3 mb-3">
                            <div className="rounded-md h-12 w-12 bg-orange-100 text-orange-600 flex items-center justify-center">
                              {tool.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-navy">{tool.name}</h3>
                              <p className="text-xs text-gray-500">{tool.description}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className={`${tool.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                              {tool.status === 'active' ? 'Active' : 'Pending'}
                            </Badge>
                            <Link href={tool.link}>
                              <Button size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                                Open Tool
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </Section>

                <Section 
                  title="Tool Integration Status" 
                  description="Connection status for your tools"
                >
                  <Card className="border">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        <HealthStatus 
                          title="Lead Tracker API" 
                          status="good" 
                          lastChecked="5m ago"
                        />
                        <HealthStatus 
                          title="Social Media Integration" 
                          status="warning" 
                          details="Auth token expiring" 
                          lastChecked="10m ago"
                        />
                        <HealthStatus 
                          title="Payment Gateway" 
                          status="good" 
                          lastChecked="5m ago"
                        />
                        <HealthStatus 
                          title="Email Marketing" 
                          status="good" 
                          lastChecked="5m ago"
                        />
                        <HealthStatus 
                          title="Calendar Bookings" 
                          status="good" 
                          lastChecked="5m ago"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <Section title="Tool Actions">
                  <div className="space-y-3">
                    <ActionButton 
                      label="Install New Tool" 
                      link="/marketplace"
                      icon={<Plus className="h-5 w-5" />}
                      variant="primary"
                      description="Browse the tools marketplace"
                    />
                    
                    <ActionButton 
                      label="Tool Settings" 
                      link="/admin/tool-settings"
                      icon={<Settings className="h-5 w-5" />}
                      variant="outline"
                      description="Configure installed tools"
                    />
                    
                    <ActionButton 
                      label="Integration Hub" 
                      link="/admin/integrations"
                      icon={<SquareCode className="h-5 w-5" />}
                      variant="outline"
                      description="Manage external connections"
                      isNew={true}
                    />
                  </div>
                </Section>

                <Section 
                  title="Recommended Tools" 
                  description="Based on your website"
                >
                  <Card className="border">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-500">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Appointment Scheduler</h3>
                          <p className="text-xs text-gray-500">Let visitors book appointments</p>
                        </div>
                        <Link href="/marketplace/appointment-scheduler">
                          <Button size="sm" variant="outline" className="h-8">
                            View
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-500">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Live Chat</h3>
                          <p className="text-xs text-gray-500">Chat with website visitors</p>
                        </div>
                        <Link href="/marketplace/live-chat">
                          <Button size="sm" variant="outline" className="h-8">
                            View
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-500">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">Advanced Analytics</h3>
                          <p className="text-xs text-gray-500">Deeper insights into visitors</p>
                        </div>
                        <Link href="/marketplace/advanced-analytics">
                          <Button size="sm" variant="outline" className="h-8">
                            View
                          </Button>
                        </Link>
                      </div>
                      
                    </CardContent>
                  </Card>
                </Section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                <Section 
                  title="System Status" 
                  description="Current status of your website systems"
                >
                  <Card className="border">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {systemHealth?.components.map((component, index) => (
                          <HealthStatus 
                            key={index}
                            title={component.name} 
                            status={component.status} 
                            details={component.details}
                            lastChecked={component.lastChecked}
                          />
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between py-3 px-6 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Blueprint Version:</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {systemHealth?.blueprintVersion || 'v1.0.0'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Uptime:</span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200">
                          {systemHealth?.uptime || '99.9%'}
                        </Badge>
                      </div>
                    </CardFooter>
                  </Card>
                </Section>

                <Section 
                  title="System Resources" 
                  description="Storage and resource usage"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Storage Usage</CardTitle>
                        <CardDescription>
                          {systemHealth?.storageUsed || '0MB / 0MB'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Media Files</span>
                              <span>85 MB</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Database</span>
                              <span>32 MB</span>
                            </div>
                            <Progress value={32} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>System Files</span>
                              <span>11 MB</span>
                            </div>
                            <Progress value={11} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Backup Status</CardTitle>
                        <CardDescription>
                          Last backup: {systemHealth?.lastBackup ? formatDate(systemHealth.lastBackup) : 'Never'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Automatic daily backups are enabled</span>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          Create Manual Backup
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </Section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <Section title="System Actions">
                  <div className="space-y-3">
                    <ActionButton 
                      label="Blueprint Manager" 
                      link="/admin/blueprint"
                      icon={<Database className="h-5 w-5" />}
                      variant="outline"
                      description="Manage system blueprint"
                    />
                    
                    <ActionButton 
                      label="System Settings" 
                      link="/admin/settings"
                      icon={<Settings className="h-5 w-5" />}
                      variant="outline"
                      description="Configure system preferences"
                    />
                    
                    <ActionButton 
                      label="View Logs" 
                      link="/admin/logs"
                      icon={<ListChecks className="h-5 w-5" />}
                      variant="outline"
                      description="Review system activity logs"
                    />
                  </div>
                </Section>

                <Section 
                  title="System Updates" 
                  description="Latest system improvements"
                >
                  <Card className="border">
                    <CardContent className="p-4 space-y-4">
                      <div className="border-b pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-navy">Blueprint v1.1.1</h3>
                          <Badge>Latest</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Released on Apr 21, 2025</p>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Improved page builder performance</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Added new social media tools</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Fixed dashboard layout issues</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-800">Blueprint v1.1.0</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Released on Apr 10, 2025</p>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Added tool marketplace integration</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>Improved SEO configuration tools</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Section>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}