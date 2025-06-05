import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  Users, 
  FileText, 
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  Bot
} from "lucide-react";

interface DashboardStats {
  activeChatsToday: number;
  leadsThisWeek: number;
  topInsight: string;
  draftsAwaitingApproval: number;
  marketViewUnlocked: boolean;
  topTrendingKeyword?: string;
}

export default function SmartSiteDashboard() {
  const { user } = useAuth();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const dashboardCards = [
    {
      id: "conversations",
      title: "🗨️ Conversations & Customers",
      subtitle: "Review live chats, score leads, take over the assistant",
      href: "/admin/conversation-insights",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-gray-800 border-gray-600 hover:bg-gray-700",
      stats: [
        { label: "Active chats today", value: stats?.activeChatsToday || 0 },
        { label: "Leads this week", value: stats?.leadsThisWeek || 0 }
      ],
      actions: [
        { label: "View Insights", href: "/admin/conversation-insights" },
        { label: "CRM", href: "/admin/crm" },
        { label: "Autopilot", href: "/admin/autopilot" }
      ]
    },
    {
      id: "insights",
      title: "✍️ Insights & Content",
      subtitle: "See what's resonating. Create blog posts or social content",
      href: "/admin/insights-dashboard",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-gray-800 border-gray-600 hover:bg-gray-700",
      stats: [
        { label: "Top insight", value: stats?.topInsight || "Page engagement up 15%" },
        { label: "Drafts pending", value: stats?.draftsAwaitingApproval || 0 }
      ],
      actions: [
        { label: "View Insights", href: "/admin/insights-dashboard" },
        { label: "Blog Posts", href: "/admin/content/blog-posts" },
        { label: "Social Posts", href: "/admin/content/social-posts" }
      ]
    },
    {
      id: "market",
      title: "🌐 Market View",
      subtitle: "Industry trends, competitor moves, smart suggestions",
      href: stats?.marketViewUnlocked ? "/admin/market-trends" : "/admin/upgrade",
      icon: <Globe className="h-6 w-6" />,
      color: stats?.marketViewUnlocked 
        ? "bg-gray-800 border-gray-600 hover:bg-gray-700"
        : "bg-gray-800 border-gray-600 hover:bg-gray-700",
      stats: stats?.marketViewUnlocked 
        ? [
            { label: "Trending keyword", value: stats.topTrendingKeyword || "accounting software" },
            { label: "Competitor alerts", value: 3 }
          ]
        : [
            { label: "Status", value: "Upgrade Required" },
            { label: "Features", value: "12+ premium tools" }
          ],
      actions: stats?.marketViewUnlocked 
        ? [
            { label: "Market Trends", href: "/admin/market-trends" },
            { label: "Competitor Watch", href: "/admin/competitor-watch" },
            { label: "Trend Prompts", href: "/admin/trend-prompts" }
          ]
        : [
            { label: "Upgrade Now", href: "/admin/upgrade" }
          ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username || 'Admin'}
              </h1>
              <p className="text-cyan-100 text-lg">
                Here's what your website has learned this week.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Bot className="h-12 w-12 text-cyan-200" />
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          
          {/* Setup CTA */}
          <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Haven't embedded SmartSite into your website yet?</p>
                <p className="text-cyan-100 text-sm">Get the intelligence layer running in under 5 minutes</p>
              </div>
              <Button 
                asChild 
                variant="secondary" 
                className="bg-white text-cyan-600 hover:bg-gray-100"
              >
                <Link href="/admin/setup">
                  Setup Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Intelligence Zones */}
        <div className="grid md:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Card 
              key={card.id} 
              className={`${card.color} transition-all duration-200 hover:shadow-lg cursor-pointer`}
            >
              <Link href={card.href} className="block h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {card.icon}
                      <div>
                        <CardTitle className="text-lg font-semibold text-white">
                          {card.title}
                        </CardTitle>
                      </div>
                    </div>
                    {card.id === "market" && !stats?.marketViewUnlocked && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-300">
                    {card.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {card.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {typeof stat.value === 'number' && stat.value > 1000 
                            ? `${(stat.value / 1000).toFixed(1)}k`
                            : stat.value
                          }
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex flex-wrap gap-2">
                      {card.actions.map((action, index) => (
                        <Button
                          key={index}
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-white border-gray-500 hover:bg-gray-600 hover:text-white"
                        >
                          <Link href={action.href}>
                            {action.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.activeChatsToday || 0}</div>
              <div className="text-sm text-gray-400">Active Chats</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.leadsThisWeek || 0}</div>
              <div className="text-sm text-gray-400">New Leads</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.draftsAwaitingApproval || 0}</div>
              <div className="text-sm text-gray-400">Drafts Pending</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {stats?.marketViewUnlocked ? "12" : "0"}
              </div>
              <div className="text-sm text-gray-400">Market Insights</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}