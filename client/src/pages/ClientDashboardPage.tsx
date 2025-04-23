import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
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
  PanelRight,
  ExternalLink,
  Settings,
  BarChart,
  Gift
} from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import AdminLayout from '@/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Quick Action Card component
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isNew?: boolean;
  isPro?: boolean;
  isDisabled?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  isNew = false,
  isPro = false,
  isDisabled = false
}) => {
  return (
    <Link href={isDisabled ? "#" : href}>
      <Card className={`h-full transition-all duration-200 cursor-pointer overflow-hidden group border ${isDisabled ? 'opacity-60' : 'hover:border-orange-300 hover:shadow-md'}`}>
        <div className="absolute top-0 right-0">
          {isNew && <Badge className="m-2 bg-emerald-500">New</Badge>}
          {isPro && <Badge className="m-2 bg-gradient-to-r from-amber-500 to-orange-500">Pro</Badge>}
        </div>
        <CardHeader className="pb-2">
          <div className="rounded-full w-12 h-12 flex items-center justify-center bg-orange-100 mb-2 text-orange-600 group-hover:bg-orange-200 transition-colors duration-200">
            {icon}
          </div>
          <CardTitle className="text-lg text-navy">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm pb-2">
          {description}
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-orange-600 text-sm font-medium flex items-center group-hover:gap-1.5 transition-all">
            {isDisabled ? 'Coming Soon' : <>Get Started <ArrowRight className="w-4 h-4 ml-1" /></>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

// Toolkit Card component
interface ToolkitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: { label: string; href: string }[];
  className?: string;
}

const ToolkitCard: React.FC<ToolkitCardProps> = ({ title, description, icon, actions, className = '' }) => {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="rounded-full w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600">
              {icon}
            </div>
            <CardTitle className="text-base text-navy">{title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button variant="outline" size="sm" className="border-slate-200 hover:border-orange-300 hover:text-orange-600">
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Dashboard Statistics Card
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: { value: number; isPositive: boolean };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  change,
  className = ''
}) => {
  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-r from-transparent to-blue-50/50 flex items-center justify-center rounded-r-lg">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-white text-navy opacity-70">
          {icon}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-2xl font-bold text-navy">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
        {change && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${change.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  
  // Fetch site statistics
  const { data: siteStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/site-stats'],
    queryFn: async () => {
      // This would normally fetch from the API
      // For now return mock data
      return {
        totalPages: 8,
        publishedPages: 5,
        totalMediaItems: 24,
        monthlyVisitors: 1250,
        pageViews: 3800,
        conversionRate: 3.2,
      };
    },
  });

  // Fetch recent activities
  const { data: recentActivities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['/api/recent-activities'],
    queryFn: async () => {
      // This would normally fetch from the API
      // For now return mock data
      return [
        { id: 1, action: 'Updated Services page', user: 'Admin', timestamp: '2025-04-22T14:30:00' },
        { id: 2, action: 'Added new media item', user: 'Admin', timestamp: '2025-04-21T11:15:00' },
        { id: 3, action: 'Published About Us page', user: 'Admin', timestamp: '2025-04-20T09:45:00' },
      ];
    },
  });

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Website Builder Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your website builder dashboard. Here you can manage all aspects of your website.
          </p>
        </div>

        <Tabs defaultValue="builder" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="builder">Builder Tools</TabsTrigger>
            <TabsTrigger value="analytics">Site Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder">
            {/* Quick Actions Grid */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-navy">Quick Actions</h2>
                <Link href="/page-builder">
                  <Button variant="outline" className="gap-1.5 border-navy hover:bg-navy hover:text-white">
                    <Plus className="h-4 w-4" /> New Page
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <QuickActionCard
                  title="Page Builder"
                  description="Create and edit website pages with our drag-and-drop page builder"
                  icon={<Layers className="h-6 w-6" />}
                  href="/page-builder"
                />
                <QuickActionCard
                  title="Templates"
                  description="Choose from pre-built page templates to get started quickly"
                  icon={<PanelRight className="h-6 w-6" />}
                  href="/page-builder/templates"
                />
                <QuickActionCard
                  title="Media Hub"
                  description="Upload and manage your images, videos, and documents"
                  icon={<ImageIcon className="h-6 w-6" />}
                  href="/media"
                />
                <QuickActionCard
                  title="Navigation Menu"
                  description="Configure website navigation and structure"
                  icon={<ListChecks className="h-6 w-6" />}
                  href="/admin/menu-management"
                />
                <QuickActionCard
                  title="SEO Tools"
                  description="Optimize your site for search engines"
                  icon={<Globe className="h-6 w-6" />}
                  href="/admin/seo"
                />
                <QuickActionCard
                  title="Content Studio"
                  description="Generate AI-powered content for your website"
                  icon={<Sparkles className="h-6 w-6" />}
                  href="/content-studio"
                  isNew={true}
                />
                <QuickActionCard
                  title="Brand Settings"
                  description="Update your site's branding and design"
                  icon={<Palette className="h-6 w-6" />}
                  href="/admin/site-branding"
                />
                <QuickActionCard
                  title="App Store"
                  description="Extend your website with specialized tools and apps"
                  icon={<Gift className="h-6 w-6" />}
                  href="/marketplace"
                  isNew={true}
                />
              </div>
            </div>
            
            {/* Tools & Resources Toolkit */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-navy mb-6">Tools & Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToolkitCard
                  title="Content Management"
                  description="Tools for creating and organizing your website content"
                  icon={<FileText className="h-5 w-5" />}
                  actions={[
                    { label: "Blog Posts", href: "/admin/blog" },
                    { label: "Services", href: "/admin/services" },
                    { label: "Resources", href: "/admin/resources" },
                  ]}
                />
                
                <ToolkitCard
                  title="Design Tools"
                  description="Customize the look and feel of your website"
                  icon={<PencilRuler className="h-5 w-5" />}
                  actions={[
                    { label: "Brand Guidelines", href: "/brand-guidelines" },
                    { label: "Theme Editor", href: "/admin/theme" },
                    { label: "Color Palette", href: "/admin/theme/colors" },
                  ]}
                />
                
                <ToolkitCard
                  title="Development Resources"
                  description="Advanced tools for custom website development"
                  icon={<SquareCode className="h-5 w-5" />}
                  actions={[
                    { label: "Custom CSS", href: "/admin/custom-css" },
                    { label: "Analytics Setup", href: "/admin/analytics/setup" },
                    { label: "API Access", href: "/admin/api-keys" },
                  ]}
                />
                
                <ToolkitCard
                  title="Launch & Promotion"
                  description="Tools to publish and promote your website"
                  icon={<Rocket className="h-5 w-5" />}
                  actions={[
                    { label: "Domain Settings", href: "/admin/domain-mapping" },
                    { label: "Social Media", href: "/tools/social-media-generator" },
                    { label: "Launch Checklist", href: "/launch-ready" },
                  ]}
                />
              </div>
            </div>
            
            {/* Recent Activity Feed */}
            <div>
              <h2 className="text-xl font-semibold text-navy mb-6">Recent Activity</h2>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Site Updates</CardTitle>
                  <CardDescription>Recent changes to your website</CardDescription>
                </CardHeader>
                <CardContent>
                  {isActivitiesLoading ? (
                    <div className="text-center py-4">Loading activities...</div>
                  ) : recentActivities?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No recent activities</div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities?.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                          <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                            <PenTool className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-navy">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              By {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            {/* Analytics Overview */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-navy">Site Analytics</h2>
                <Button variant="outline" className="gap-1.5 text-sm">
                  <ExternalLink className="h-4 w-4" /> Full Analytics
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Total Pages"
                  value={isStatsLoading ? "..." : siteStats?.totalPages || 0}
                  description={`${isStatsLoading ? "..." : siteStats?.publishedPages || 0} published pages`}
                  icon={<FileText className="h-5 w-5" />}
                />
                <StatCard
                  title="Media Items"
                  value={isStatsLoading ? "..." : siteStats?.totalMediaItems || 0}
                  description="Images, videos & files"
                  icon={<ImageIcon className="h-5 w-5" />}
                />
                <StatCard
                  title="Monthly Visitors"
                  value={isStatsLoading ? "..." : siteStats?.monthlyVisitors?.toLocaleString() || 0}
                  description="Unique website visitors"
                  icon={<Users className="h-5 w-5" />}
                  change={{ value: 12.5, isPositive: true }}
                />
                <StatCard
                  title="Page Views"
                  value={isStatsLoading ? "..." : siteStats?.pageViews?.toLocaleString() || 0}
                  description="Total page views this month"
                  icon={<BarChart className="h-5 w-5" />}
                  change={{ value: 8.3, isPositive: true }}
                />
              </div>
              
              {/* Chart placeholder */}
              <Card className="mb-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>Website visitors over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="h-[300px] bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                      <p className="text-slate-400">Detailed analytics charts will appear here</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Connect Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* SEO Performance */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>SEO Performance</CardTitle>
                    <Badge variant="outline" className="text-orange-600 bg-orange-50">12 Issues Found</Badge>
                  </div>
                  <CardDescription>Improve your search engine rankings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-navy">Missing meta descriptions</p>
                        <p className="text-sm text-muted-foreground">3 pages need meta descriptions</p>
                      </div>
                      <Button variant="outline" size="sm">Fix Issues</Button>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-navy">Missing alt text</p>
                        <p className="text-sm text-muted-foreground">8 images missing alt text</p>
                      </div>
                      <Button variant="outline" size="sm">Fix Issues</Button>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-navy">Slow page load speed</p>
                        <p className="text-sm text-muted-foreground">1 page needs optimization</p>
                      </div>
                      <Button variant="outline" size="sm">Fix Issues</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full SEO Report
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Performance Tips */}
              <div>
                <h2 className="text-xl font-semibold text-navy mb-4">Tips & Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Improve Your Website</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex gap-2 items-start">
                          <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                            <Check className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Add testimonials to increase credibility</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                            <Check className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Optimize images to improve load times</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                            <Check className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Add a clear call to action on your homepage</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                        View All Tips
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                    <CardHeader>
                      <CardTitle className="text-lg text-emerald-800">Content Ideas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex gap-2 items-start">
                          <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                            <LightbulbIcon className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-sm">Create a blog post about industry trends</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                            <LightbulbIcon className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-sm">Add a FAQ section to answer common questions</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <div className="rounded-full bg-emerald-100 p-1 mt-0.5">
                            <LightbulbIcon className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-sm">Create a case study to showcase your success</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                        Get More Ideas
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Additional components needed for the Analytics tab
const AlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15 18a6 6 0 1 0-6 0"></path>
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);