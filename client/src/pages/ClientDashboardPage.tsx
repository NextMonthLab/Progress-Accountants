import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  PenTool,
  Layers,
  Cpu,
  ExternalLink,
  Settings,
  BarChart,
  Gift,
  Database,
  Clock,
  Calendar,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  Newspaper,
  Gauge
} from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

// Stat Item Component
interface StatItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, isLoading = false }) => {
  return (
    <div className="flex items-center p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
      {icon && (
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-600 mr-3">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <div className="text-lg font-semibold text-navy mt-1">
          {isLoading ? (
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
};

// Section Component
interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl font-semibold text-navy mb-4">{title}</h2>
      {children}
    </div>
  );
};

// Quick Action Button
interface QuickActionButtonProps {
  label: string;
  link: string;
  icon?: React.ReactNode;
  target?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  label, 
  link, 
  icon, 
  target = "_self",
  variant = 'default'
}) => {
  const buttonClass = variant === 'outline' 
    ? "bg-white border-navy text-navy hover:bg-navy hover:text-white"
    : variant === 'ghost'
    ? "bg-white hover:bg-gray-100 text-gray-800"
    : "bg-navy text-white hover:bg-navy/90";

  if (target === "_blank") {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className={`w-full justify-start ${buttonClass}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {target === "_blank" && <ExternalLink className="ml-auto h-4 w-4" />}
        </Button>
      </a>
    );
  }

  return (
    <Link href={link}>
      <Button variant="outline" className={`w-full justify-start ${buttonClass}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Button>
    </Link>
  );
};

// News Item Component
interface NewsItemProps {
  title: string;
  date?: string;
  isLoading?: boolean;
}

const NewsItem: React.FC<NewsItemProps> = ({ title, date, isLoading = false }) => {
  return (
    <div className="p-3 border-b last:border-b-0">
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
        </div>
      ) : (
        <>
          <h3 className="font-medium text-navy">{title}</h3>
          {date && <p className="text-xs text-gray-500 mt-1">{date}</p>}
        </>
      )}
    </div>
  );
};

// Reusable component for user icon
const Users = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  
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
      };
    },
  });

  // Visitor Insights
  const { data: visitorInsights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['/api/analytics/today', '/api/analytics/top-page', '/api/analytics/bounce-rate'],
    queryFn: async () => {
      return {
        visitorsToday: 45,
        mostVisitedPage: { title: 'Services', url: '/services', visits: 128 },
        bounceRate: '32%',
      };
    },
  });

  // Tool Status
  const { data: toolStatus, isLoading: isToolStatusLoading } = useQuery({
    queryKey: ['/api/tools/lead-tracker/status', '/api/tools/plugin-generator/status', '/api/tools/active/count'],
    queryFn: async () => {
      return {
        leadTrackerInstalled: true,
        pluginGeneratorInstalled: false,
        otherToolsActive: 3,
      };
    },
  });

  // Industry News
  const { data: industryNews, isLoading: isNewsLoading } = useQuery({
    queryKey: ['/api/newsfeed/top'],
    queryFn: async () => {
      return [
        { id: 1, title: 'New Tax Legislation Affecting Small Businesses', date: '2025-04-22' },
        { id: 2, title: 'Financial Reporting Changes Coming Next Quarter', date: '2025-04-20' },
        { id: 3, title: 'How Digital Transformation is Changing Accounting', date: '2025-04-18' },
      ];
    },
  });

  // System Health
  const { data: systemHealth, isLoading: isHealthLoading } = useQuery({
    queryKey: ['/api/system/version', '/api/system/storage', '/api/system/last_backup'],
    queryFn: async () => {
      return {
        blueprintVersion: 'v1.1.1',
        storageUsed: '128MB / 1GB',
        lastBackup: '2025-04-22T02:00:00',
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

  // Format time helper
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Website Dashboard</h1>
        <p className="text-muted-foreground">
          A central admin dashboard to manage and monitor your website health, growth, and structure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          {/* Site Overview */}
          <Section title="Site Overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatItem 
                label="Total Pages" 
                value={isOverviewLoading ? '...' : siteOverview?.totalPages}
                icon={<FileText className="h-5 w-5" />}
                isLoading={isOverviewLoading}
              />
              <StatItem 
                label="Total Tools Installed" 
                value={isOverviewLoading ? '...' : siteOverview?.totalToolsInstalled}
                icon={<Cpu className="h-5 w-5" />}
                isLoading={isOverviewLoading}
              />
              <StatItem 
                label="Latest Page Created" 
                value={isOverviewLoading ? '...' : (
                  <div className="flex items-center">
                    <span>{siteOverview?.latestPage.title}</span>
                    <Link href={siteOverview?.latestPage.url || '#'}>
                      <Button variant="ghost" size="sm" className="ml-2 h-6 px-2">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
                icon={<Calendar className="h-5 w-5" />}
                isLoading={isOverviewLoading}
              />
              <StatItem 
                label="Last Updated" 
                value={isOverviewLoading ? '...' : formatDateTime(siteOverview?.lastUpdated || '')}
                icon={<Clock className="h-5 w-5" />}
                isLoading={isOverviewLoading}
              />
            </div>
          </Section>

          {/* Visitor Insights */}
          <Section title="Visitor Insights">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatItem 
                label="Visitors Today" 
                value={isInsightsLoading ? '...' : visitorInsights?.visitorsToday}
                icon={<Users className="h-5 w-5" />}
                isLoading={isInsightsLoading}
              />
              <StatItem 
                label="Most Visited Page" 
                value={isInsightsLoading ? '...' : (
                  <div className="flex items-center">
                    <span>{visitorInsights?.mostVisitedPage.title}</span>
                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                      {visitorInsights?.mostVisitedPage.visits} views
                    </Badge>
                  </div>
                )}
                icon={<BarChart className="h-5 w-5" />}
                isLoading={isInsightsLoading}
              />
              <StatItem 
                label="Bounce Rate" 
                value={isInsightsLoading ? '...' : visitorInsights?.bounceRate}
                icon={<Gauge className="h-5 w-5" />}
                isLoading={isInsightsLoading}
              />
            </div>
          </Section>

          {/* Tool Status */}
          <Section title="Tool Status">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isToolStatusLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                    <div className="rounded-full w-3 h-3 bg-gray-200 mr-3 animate-pulse"></div>
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                    <div className={`rounded-full w-3 h-3 ${toolStatus && toolStatus.leadTrackerInstalled ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Lead Tracker</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {toolStatus && toolStatus.leadTrackerInstalled ? 'Installed & Active' : 'Not Installed'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                    <div className={`rounded-full w-3 h-3 ${toolStatus && toolStatus.pluginGeneratorInstalled ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Plugin Generator</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {toolStatus && toolStatus.pluginGeneratorInstalled ? 'Installed & Active' : 'Not Installed'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                    <div className={`rounded-full w-3 h-3 ${toolStatus && toolStatus.otherToolsActive > 0 ? 'bg-green-500' : 'bg-gray-300'} mr-3`}></div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Other Tools Active</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {toolStatus ? toolStatus.otherToolsActive : 0} tools active
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* System Health */}
          <Section title="System Health">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatItem 
                label="Blueprint Version" 
                value={isHealthLoading ? '...' : systemHealth?.blueprintVersion}
                icon={<Database className="h-5 w-5" />}
                isLoading={isHealthLoading}
              />
              <StatItem 
                label="Storage Used" 
                value={isHealthLoading ? '...' : systemHealth?.storageUsed}
                icon={<HardDrive className="h-5 w-5" />}
                isLoading={isHealthLoading}
              />
              <StatItem 
                label="Last Backup" 
                value={isHealthLoading ? '...' : formatDateTime(systemHealth?.lastBackup || '')}
                icon={<ShieldCheck className="h-5 w-5" />}
                isLoading={isHealthLoading}
              />
            </div>
          </Section>
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Section title="Quick Actions">
            <Card>
              <CardContent className="p-4 grid gap-3">
                <QuickActionButton 
                  label="Create New Page" 
                  link="/admin/pages/create"
                  icon={<Plus className="h-4 w-4" />}
                />
                <QuickActionButton 
                  label="Install Tool from Marketplace" 
                  link="/admin/tools/marketplace"
                  icon={<Cpu className="h-4 w-4" />}
                />
                <QuickActionButton 
                  label="Connect Custom Domain" 
                  link="/admin/setup/domain-mapping"
                  icon={<Globe className="h-4 w-4" />}
                />
                <QuickActionButton 
                  label="View Site" 
                  link="/"
                  target="_blank"
                  icon={<ExternalLink className="h-4 w-4" />}
                  variant="outline"
                />
              </CardContent>
            </Card>
          </Section>

          {/* Industry News */}
          <Section title="Industry News">
            <Card>
              <CardHeader className="pb-0">
                <CardDescription className="text-xs">
                  Latest headlines from your industry
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                {isNewsLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map(i => (
                      <NewsItem key={i} title="" isLoading={true} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {industryNews?.map(news => (
                      <NewsItem 
                        key={news.id} 
                        title={news.title} 
                        date={formatDate(news.date)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Link href="/admin/news">
                  <Button variant="outline" size="sm" className="w-full">
                    View All News
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
}