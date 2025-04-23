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
  Globe, 
  Rocket, 
  Plus, 
  ListChecks, 
  ArrowRight, 
  ArrowUpRight,
  Sparkles,
  PenTool,
  Layers,
  Cpu,
  ExternalLink,
  Settings,
  BarChart,
  BarChart3,
  Gift,
  Database,
  Clock,
  Calendar,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  Newspaper,
  Gauge,
  CheckCircle2,
  XCircle,
  Eye,
  Zap,
  LineChart,
  TrendingUp,
  Users,
  Bell,
  Activity
} from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

// Modern Stat Card Component with gradient background
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'default';
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  trendLabel,
  color = 'default',
  isLoading = false 
}) => {
  // Color schemes for different stat types
  const colorSchemes = {
    primary: {
      bg: "from-navy to-blue-900",
      iconBg: "bg-white/10",
      textColor: "text-white",
      subTextColor: "text-blue-100",
      trendUp: "text-emerald-300",
      trendDown: "text-red-300"
    },
    success: {
      bg: "from-emerald-600 to-emerald-700",
      iconBg: "bg-white/10",
      textColor: "text-white",
      subTextColor: "text-emerald-100",
      trendUp: "text-emerald-300",
      trendDown: "text-red-300"
    },
    warning: {
      bg: "from-amber-500 to-orange-600",
      iconBg: "bg-white/10",
      textColor: "text-white",
      subTextColor: "text-amber-100",
      trendUp: "text-white",
      trendDown: "text-red-300"
    },
    info: {
      bg: "from-blue-500 to-blue-600",
      iconBg: "bg-white/10",
      textColor: "text-white",
      subTextColor: "text-blue-100",
      trendUp: "text-emerald-300",
      trendDown: "text-red-300"
    },
    default: {
      bg: "bg-white",
      iconBg: "bg-navy/10",
      textColor: "text-navy",
      subTextColor: "text-gray-500",
      trendUp: "text-emerald-600",
      trendDown: "text-red-600"
    }
  };

  const scheme = colorSchemes[color];
  const isGradient = color !== 'default';

  return (
    <Card className={`overflow-hidden border-0 ${isGradient ? 'shadow-lg shadow-' + color + '/10' : 'shadow-sm border'}`}>
      <div className={`${isGradient ? 'bg-gradient-to-br ' + scheme.bg : scheme.bg} p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${isGradient ? 'text-white/70' : 'text-gray-500'}`}>{label}</p>
            {isLoading ? (
              <div className="h-7 w-28 bg-gray-200/30 animate-pulse rounded mt-1"></div>
            ) : (
              <h3 className={`text-2xl font-bold mt-1 ${scheme.textColor}`}>{value}</h3>
            )}
            
            {trend !== undefined && !isLoading && (
              <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? scheme.trendUp : scheme.trendDown}`}>
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                )}
                <span>{Math.abs(trend)}% {trendLabel || (trend >= 0 ? 'increase' : 'decrease')}</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={`${scheme.iconBg} p-3 rounded-lg`}>
              <div className={`${isGradient ? 'text-white' : 'text-navy'}`}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Modern Section Component with option for action button
interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  description?: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, action, description, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-navy">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && (
          <Link href={action.href}>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-navy hover:text-navy/80">
              {action.label}
              {action.icon || <ArrowUpRight className="h-4 w-4" />}
            </Button>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
  isLoading?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  title, 
  description, 
  timestamp, 
  icon,
  status = 'info',
  isLoading = false 
}) => {
  const statusColors = {
    success: "text-emerald-500 bg-emerald-50",
    warning: "text-amber-500 bg-amber-50",
    error: "text-red-500 bg-red-50",
    info: "text-blue-500 bg-blue-50"
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {isLoading ? (
        <>
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          </div>
        </>
      ) : (
        <>
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${statusColors[status]}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-navy">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
            <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
          </div>
        </>
      )}
    </div>
  );
};

// Analytics Chart Component (Simplified placeholder for actual chart)
interface AnalyticsChartProps {
  data?: any;
  isLoading?: boolean;
  height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ isLoading = false, height = 200 }) => {
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded"></div>
      ) : (
        <div className="absolute inset-0 flex items-end">
          {/* This is a simplified placeholder for the actual chart. You would use a proper chart library in production */}
          <div className="w-1/7 h-40% bg-blue-200 rounded-t"></div>
          <div className="w-1/7 h-75% bg-blue-400 rounded-t"></div>
          <div className="w-1/7 h-60% bg-blue-300 rounded-t"></div>
          <div className="w-1/7 h-80% bg-blue-500 rounded-t"></div>
          <div className="w-1/7 h-50% bg-blue-300 rounded-t"></div>
          <div className="w-1/7 h-90% bg-blue-600 rounded-t"></div>
          <div className="w-1/7 h-65% bg-blue-400 rounded-t"></div>
        </div>
      )}
    </div>
  );
};

// Tool Card Component
interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: 'active' | 'inactive' | 'pending';
  link: string;
  isLoading?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  title, 
  description, 
  icon, 
  status = 'active',
  link,
  isLoading = false 
}) => {
  const statusBadge = {
    active: <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>,
    inactive: <Badge variant="outline" className="text-gray-500 border-gray-300 hover:bg-transparent">Inactive</Badge>,
    pending: <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      {isLoading ? (
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-10 w-10 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-6 w-16 rounded bg-gray-200 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-lg bg-navy/5 flex items-center justify-center text-navy">
                {icon}
              </div>
              <div>{statusBadge[status]}</div>
            </div>
            <h3 className="font-semibold text-navy mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <Link href={link}>
              <Button variant="outline" size="sm" className="w-full">
                Configure
                <Settings className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </Card>
  );
};

// Quick Action Button (Enhanced)
interface ActionButtonProps {
  label: string;
  link: string;
  icon?: React.ReactNode;
  description?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isNew?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  link, 
  icon, 
  description,
  variant = 'primary',
  isNew = false
}) => {
  const variantStyles = {
    primary: "bg-gradient-to-br from-navy to-blue-900 text-white hover:from-navy hover:to-navy shadow-lg shadow-navy/20",
    secondary: "bg-gradient-to-br from-orange-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-600 shadow-lg shadow-amber-500/20",
    outline: "bg-white text-navy border border-navy/20 hover:bg-navy/5",
    ghost: "bg-transparent text-navy hover:bg-navy/5"
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
            <h3 className={`font-semibold ${variant === 'outline' || variant === 'ghost' ? 'text-navy' : 'text-white'}`}>
              {label}
            </h3>
            {description && (
              <p className={`text-xs mt-1 ${variant === 'outline' || variant === 'ghost' ? 'text-gray-600' : 'text-white/80'}`}>
                {description}
              </p>
            )}
          </div>
        </div>
        {isNew && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 px-1.5 py-0 text-[10px]">
              NEW
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
};

// News Card Component
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
    <div className="border-b border-gray-100 pb-4 mb-4 last:mb-0 last:pb-0 last:border-0">
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
          <h3 className="font-semibold text-navy">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">{excerpt}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">{date}</span>
            {category && (
              <Badge variant="outline" className="px-1.5 py-0 h-5 font-normal">
                {category}
              </Badge>
            )}
          </div>
          {link && (
            <div className="mt-3">
              <Link href={link}>
                <Button variant="ghost" size="sm" className="h-7 px-0 text-navy font-medium">
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

export default function ClientDashboardPage() {
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
  const { data: activityFeed, isLoading: isActivityLoading } = useQuery({
    queryKey: ['/api/activity/recent'],
    queryFn: async () => {
      return [
        { 
          id: 1, 
          type: 'page_published', 
          title: 'Page Published', 
          description: 'Services page was published', 
          timestamp: '2025-04-22T14:30:00',
          status: 'success' 
        },
        { 
          id: 2, 
          type: 'tool_installed', 
          title: 'Tool Installed', 
          description: 'Lead Tracker was installed', 
          timestamp: '2025-04-22T12:15:00',
          status: 'success'
        },
        { 
          id: 3, 
          type: 'backup_completed', 
          title: 'Backup Completed', 
          description: 'Automatic daily backup', 
          timestamp: '2025-04-22T02:00:00',
          status: 'info' 
        },
        { 
          id: 4, 
          type: 'system_update', 
          title: 'System Update', 
          description: 'Blueprint updated to v1.1.1', 
          timestamp: '2025-04-21T18:45:00',
          status: 'info' 
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
          icon: <Newspaper className="h-6 w-6" />,
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
          { name: 'Database', status: 'good', lastChecked: '5m ago' },
          { name: 'API Services', status: 'good', lastChecked: '5m ago' },
          { name: 'Storage', status: 'warning', details: '78% used', lastChecked: '5m ago' },
          { name: 'Backup System', status: 'good', lastChecked: '5m ago' },
          { name: 'Blueprint System', status: 'good', lastChecked: '5m ago' },
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
    <div className="px-1 py-6 md:px-4 lg:px-6">
      {/* Hero Section with Welcome and Overview Stats */}
      <div className="mb-8 bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="md:max-w-lg">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}</h1>
            <p className="text-blue-100 mb-6">
              Here's what's happening with {tenant?.name || 'your website'} today.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-100">Website Status</span>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Online</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <span className="font-medium">All systems operational</span>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-100 mb-2">Website Completeness</p>
                <div className="mb-2">
                  <Progress value={pageProgress} className="h-2 bg-white/20" indicatorClassName="bg-emerald-500" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{pageProgress}% complete</span>
                  <Link href="/admin/setup-checklist">
                    <span className="text-blue-200 hover:text-white flex items-center gap-1">
                      Setup checklist
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-1/2">
            <StatCard 
              label="Weekly Pageviews" 
              value={isOverviewLoading ? '--' : siteOverview?.weeklyPageViews}
              icon={<Eye className="h-5 w-5" />}
              trend={isOverviewLoading ? undefined : siteOverview?.pageViewsTrend}
              trendLabel="vs last week"
              color="primary"
              isLoading={isOverviewLoading}
            />
            
            <StatCard 
              label="Unique Visitors" 
              value={isOverviewLoading ? '--' : siteOverview?.uniqueVisitors}
              icon={<Users className="h-5 w-5" />}
              trend={isOverviewLoading ? undefined : siteOverview?.visitorsTrend}
              trendLabel="vs last week"
              color="primary"
              isLoading={isOverviewLoading}
            />
            
            <StatCard 
              label="Pages Created" 
              value={isOverviewLoading ? '--' : siteOverview?.totalPages}
              icon={<FileText className="h-5 w-5" />}
              color="primary"
              isLoading={isOverviewLoading}
            />
            
            <StatCard 
              label="Tools Installed" 
              value={isOverviewLoading ? '--' : siteOverview?.totalToolsInstalled}
              icon={<Cpu className="h-5 w-5" />}
              color="primary"
              isLoading={isOverviewLoading}
            />
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - left 2/3 */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Feed */}
              <Section 
                title="Recent Activity" 
                description="Latest actions and system updates"
                action={{ label: "View all activity", href: "/admin/activity" }}
              >
                <Card>
                  <CardContent className="p-6">
                    {isActivityLoading ? (
                      <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                          <ActivityItem 
                            key={i} 
                            title="" 
                            timestamp="" 
                            isLoading={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {activityFeed?.map(activity => (
                          <ActivityItem 
                            key={activity.id}
                            title={activity.title}
                            description={activity.description}
                            timestamp={formatTimeAgo(activity.timestamp)}
                            icon={getActivityIcon(activity.type)}
                            status={activity.status as any}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Section>

              {/* Analytics Overview */}
              <Section 
                title="Visitor Trends" 
                description="Last 7 days website traffic"
                action={{ label: "Full analytics", href: "/admin/analytics" }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <AnalyticsChart isLoading={isOverviewLoading} height={220} />
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Avg. Time on Site</p>
                        <p className="text-2xl font-bold text-navy mt-1">
                          {isOverviewLoading ? '--' : siteOverview?.avgTimeOnSite}
                        </p>
                        <p className="text-xs text-red-500 flex items-center justify-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                          {Math.abs(siteOverview?.timeOnSiteTrend || 0)}%
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Bounce Rate</p>
                        <p className="text-2xl font-bold text-navy mt-1">32%</p>
                        <p className="text-xs text-emerald-500 flex items-center justify-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          2.5%
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Pages Per Visit</p>
                        <p className="text-2xl font-bold text-navy mt-1">3.2</p>
                        <p className="text-xs text-emerald-500 flex items-center justify-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          0.8%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section>
            </div>

            {/* Sidebar - right 1/3 */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Section title="Quick Actions">
                <div className="grid grid-cols-1 gap-3">
                  <ActionButton 
                    label="Create New Page" 
                    link="/page-builder/new"
                    icon={<FileText className="h-5 w-5" />}
                    description="Build a new page for your website"
                    variant="primary"
                  />
                  
                  <ActionButton 
                    label="Install New Tool" 
                    link="/marketplace"
                    icon={<Cpu className="h-5 w-5" />}
                    description="Browse the tool marketplace"
                    variant="secondary"
                  />
                  
                  <ActionButton 
                    label="Manage Media" 
                    link="/media"
                    icon={<ImageIcon className="h-5 w-5" />}
                    description="Upload and organize your media files"
                    variant="outline"
                  />
                  
                  <ActionButton 
                    label="View Website" 
                    link="/"
                    icon={<Eye className="h-5 w-5" />}
                    description="See your live website"
                    variant="ghost"
                  />
                </div>
              </Section>

              {/* Industry News */}
              <Section 
                title="Industry News" 
                action={{ label: "All news", href: "/admin/news" }}
              >
                <Card>
                  <CardContent className="p-6">
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
                <Card>
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
                <Card>
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
              <Section title="Recently Updated">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">Services</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Page</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Updated 2 hours ago</p>
                      </div>
                      
                      <div className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ImageIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">Team Photo</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Media</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Updated 5 hours ago</p>
                      </div>
                      
                      <div className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ListChecks className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">FAQ Section</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Component</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Updated yesterday</p>
                      </div>
                      
                      <div className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">SEO Settings</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Settings</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Updated 2 days ago</p>
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
            {/* Main content - left 2/3 */}
            <div className="lg:col-span-2">
              <Section 
                title="Installed Tools" 
                description="Tools and applications powering your website"
                action={{ label: "Add new tool", href: "/marketplace" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isToolStatusLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <ToolCard 
                        key={i}
                        title=""
                        description=""
                        icon={<div />}
                        link=""
                        isLoading={true}
                      />
                    ))
                  ) : (
                    toolStatus?.map(tool => (
                      <ToolCard 
                        key={tool.id}
                        title={tool.name}
                        description={tool.description}
                        icon={tool.icon}
                        status={tool.status as any}
                        link={tool.link}
                      />
                    ))
                  )}
                </div>
              </Section>
              
              <div className="mt-8">
                <Section 
                  title="Marketplace Recommendations" 
                  description="Tools that might benefit your business"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 hover:border-navy/40 transition-colors">
                          <Badge className="bg-emerald-100 text-emerald-800 mb-2">New</Badge>
                          <h3 className="font-medium text-navy">Lead Capture Forms</h3>
                          <p className="text-xs text-gray-500 mt-1">Create custom lead capture forms with automatic CRM integration.</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 hover:border-navy/40 transition-colors">
                          <Badge className="bg-blue-100 text-blue-800 mb-2">Popular</Badge>
                          <h3 className="font-medium text-navy">Customer Portal</h3>
                          <p className="text-xs text-gray-500 mt-1">Client login area with document sharing and messaging capabilities.</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 hover:border-navy/40 transition-colors">
                          <Badge className="bg-amber-100 text-amber-800 mb-2">Recommended</Badge>
                          <h3 className="font-medium text-navy">Appointment Scheduler</h3>
                          <p className="text-xs text-gray-500 mt-1">Online booking system with calendar integration and reminders.</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Marketplace
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Section>
              </div>
            </div>

            {/* Sidebar - right 1/3 */}
            <div className="space-y-8">
              {/* Tool Stats */}
              <Section title="Tool Metrics">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Installed Tools</h3>
                        <Badge variant="outline">{isToolStatusLoading ? '--' : toolStatus?.length || 0}</Badge>
                      </div>
                      <Progress value={toolsProgress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {toolsProgress}% of recommended tools installed
                      </p>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Usage Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">Lead Tracker</span>
                          </div>
                          <span className="text-sm font-medium">42 leads</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">Analytics</span>
                          </div>
                          <span className="text-sm font-medium">3.5k events</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Layers className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">Content Builder</span>
                          </div>
                          <span className="text-sm font-medium">12 items</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Section>

              {/* Tool Actions */}
              <Section title="Tool Management">
                <div className="grid gap-3">
                  <ActionButton 
                    label="Install New Tool" 
                    link="/marketplace"
                    icon={<Plus className="h-5 w-5" />}
                    description="Browse available tools"
                    variant="primary"
                  />
                  
                  <ActionButton 
                    label="Manage Settings" 
                    link="/admin/tools/settings"
                    icon={<Settings className="h-5 w-5" />}
                    description="Configure tools and permissions"
                    variant="outline"
                  />
                  
                  <ActionButton 
                    label="Updates Available" 
                    link="/admin/tools/updates"
                    icon={<Zap className="h-5 w-5" />}
                    description="2 tools have updates ready"
                    variant="outline"
                    isNew={true}
                  />
                </div>
              </Section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - left 2/3 */}
            <div className="lg:col-span-2 space-y-8">
              <Section title="System Health Status">
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardDescription>Overall system status and performance metrics</CardDescription>
                      <Badge className="bg-emerald-100 text-emerald-800">All Systems Operational</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isHealthLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <HealthStatus 
                            key={i}
                            title=""
                            status="unknown"
                            isLoading={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div>
                        {systemHealth?.components.map((component, index) => (
                          <HealthStatus 
                            key={index}
                            title={component.name}
                            status={component.status as any}
                            details={component.details}
                            lastChecked={component.lastChecked}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Section>

              {/* System Metrics */}
              <Section title="System Metrics">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard 
                    label="System Uptime" 
                    value={isHealthLoading ? '--' : systemHealth?.uptime}
                    icon={<Activity className="h-5 w-5" />}
                    color="success"
                    isLoading={isHealthLoading}
                  />
                  
                  <StatCard 
                    label="Storage Usage" 
                    value={isHealthLoading ? '--' : systemHealth?.storageUsed}
                    icon={<HardDrive className="h-5 w-5" />}
                    color="warning"
                    isLoading={isHealthLoading}
                  />
                  
                  <StatCard 
                    label="Blueprint Version" 
                    value={isHealthLoading ? '--' : systemHealth?.blueprintVersion}
                    icon={<Database className="h-5 w-5" />}
                    color="info"
                    isLoading={isHealthLoading}
                  />
                  
                  <StatCard 
                    label="Last Backup" 
                    value={isHealthLoading ? '--' : formatTimeAgo(systemHealth?.lastBackup || '')}
                    icon={<ShieldCheck className="h-5 w-5" />}
                    color="info"
                    isLoading={isHealthLoading}
                  />
                </div>
              </Section>
            </div>

            {/* Sidebar - right 1/3 */}
            <div className="space-y-8">
              {/* System Actions */}
              <Section title="System Actions">
                <div className="grid gap-3">
                  <ActionButton 
                    label="Run System Backup" 
                    link="/admin/system/backup"
                    icon={<Database className="h-5 w-5" />}
                    description="Create a backup of all system data"
                    variant="primary"
                  />
                  
                  <ActionButton 
                    label="System Settings" 
                    link="/admin/settings"
                    icon={<Settings className="h-5 w-5" />}
                    description="Configure system parameters"
                    variant="outline"
                  />
                  
                  <ActionButton 
                    label="Error Logs" 
                    link="/admin/system/logs"
                    icon={<AlertTriangle className="h-5 w-5" />}
                    description="View system logs and errors"
                    variant="outline"
                  />
                  
                  <ActionButton 
                    label="Check for Updates" 
                    link="/admin/system/updates"
                    icon={<Zap className="h-5 w-5" />}
                    description="Check for system updates"
                    variant="outline"
                  />
                </div>
              </Section>

              {/* Recent Backups */}
              <Section title="Recent Backups">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">Auto Backup</span>
                          </div>
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">128 MB</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Today, 2:00 AM</p>
                      </div>
                      
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">Auto Backup</span>
                          </div>
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">128 MB</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Yesterday, 2:00 AM</p>
                      </div>
                      
                      <div className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-navy">Manual Backup</span>
                          </div>
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">130 MB</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Apr 21, 2:45 PM</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Backups
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Section>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}