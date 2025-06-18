import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  TrendingUp, 
  TrendingDown,
  Lock, 
  FileText, 
  Users, 
  Download,
  Mail,
  ExternalLink,
  Loader2,
  Eye,
  CreditCard,
  ArrowRight,
  Calendar,
  BarChart3
} from "lucide-react";

interface MarketTrend {
  topic: string;
  description: string;
  trend: "up" | "down" | "stable";
  volume: number;
  source: string;
}

interface PostIdea {
  title: string;
  platform: string;
  snippet: string;
  category: string;
}

interface Competitor {
  name: string;
  url: string;
  lastUpdate: string;
  changes: string[];
  newContent: string[];
}

interface MarketData {
  trends: MarketTrend[];
  postIdeas: PostIdea[];
  competitors: Competitor[];
  isUpgraded: boolean;
}

export default function MarketIntelligencePanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newCompetitor, setNewCompetitor] = useState("");
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  // Check if user has premium access
  const { data: marketData, isLoading } = useQuery<MarketData>({
    queryKey: ["/api/market-intelligence/data"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/market-intelligence/data");
      return response.json();
    }
  });

  const addCompetitor = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/market-intelligence/competitors", { url });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Competitor added",
        description: "We'll start monitoring this competitor for updates.",
      });
      setNewCompetitor("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add competitor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateReport = useMutation({
    mutationFn: async (format: "pdf" | "email") => {
      const response = await apiRequest("POST", "/api/market-intelligence/report", { format });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.format === "pdf") {
        // Create a download link for the PDF
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `market-intelligence-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
      }
      toast({
        title: "Report generated",
        description: data.format === "pdf" ? "Download started" : "Report sent to your email",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Report generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendToBlogGenerator = (idea: PostIdea) => {
    // Store the idea in localStorage to prefill the blog generator
    localStorage.setItem('prefillBlogPost', JSON.stringify({
      title: idea.title,
      category: idea.category,
      snippet: idea.snippet
    }));
    
    // Navigate to blog generator
    window.location.href = '/admin/content/blog-posts';
  };

  const handleUpgrade = () => {
    setIsProcessingUpgrade(true);
    // Simulate upgrade process
    setTimeout(() => {
      toast({
        title: "Upgrade processing",
        description: "Redirecting to secure payment gateway...",
      });
      // In real implementation, this would redirect to payment processor
      setIsProcessingUpgrade(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  // Show upgrade prompt for non-premium users
  if (!marketData?.isUpgraded) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <BarChart3 className="h-8 w-8 text-cyan-600" />
              Market Intelligence
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay ahead of industry trends and monitor your competition with real-time market insights
            </p>
          </div>

          {/* Upgrade Card */}
          <Card className="max-w-2xl mx-auto border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-cyan-600" />
              </div>
              <CardTitle className="text-2xl">Unlock Market Intelligence</CardTitle>
              <CardDescription className="text-lg">
                Want to see what's trending in your industry and what your competitors are launching?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feature Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium mb-1">Industry Trends</h3>
                  <p className="text-sm text-gray-600">Top 5 trending topics and keywords in your industry</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium mb-1">Content Ideas</h3>
                  <p className="text-sm text-gray-600">AI-generated blog and social post suggestions</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <Users className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium mb-1">Competitor Watch</h3>
                  <p className="text-sm text-gray-600">Monitor up to 5 competitors for changes and updates</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <Download className="h-6 w-6 text-orange-600 mb-2" />
                  <h3 className="font-medium mb-1">Monthly Reports</h3>
                  <p className="text-sm text-gray-600">Comprehensive market analysis and recommendations</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-gray-900">
                  £9.99
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <Button
                  onClick={handleUpgrade}
                  disabled={isProcessingUpgrade}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-8 py-3 h-auto"
                >
                  {isProcessingUpgrade ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  Unlock Market Intelligence
                </Button>
                <p className="text-sm text-gray-500">
                  Cancel anytime • 7-day free trial
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-cyan-600" />
              Market Intelligence
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time industry insights and competitor monitoring
            </p>
          </div>
          <Badge variant="outline" className="bg-cyan-100 text-cyan-800 border-cyan-300">
            Pro Plan Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Trending in Your Industry */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Trending in Your Industry
                </CardTitle>
                <CardDescription>
                  Top topics and keywords in accounting and professional services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData?.trends?.map((trend, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{trend.topic}</h4>
                          {trend.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : trend.trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {trend.volume.toLocaleString()} mentions
                          </Badge>
                          <span className="text-xs text-gray-500">{trend.source}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6 text-gray-500">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No trending topics found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Post Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Suggested Post Ideas
                </CardTitle>
                <CardDescription>
                  AI-generated content ideas based on current trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData?.postIdeas?.map((idea, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium flex-1">{idea.title}</h4>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {idea.platform}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{idea.snippet}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {idea.category}
                        </Badge>
                        <Button
                          onClick={() => sendToBlogGenerator(idea)}
                          size="sm"
                          variant="outline"
                          className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                        >
                          Send to Blog Generator
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No content ideas available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Competitor Watch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Competitor Watch
                </CardTitle>
                <CardDescription>
                  Monitor competitors for changes and new content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Competitor */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter competitor website URL"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                  />
                  <Button
                    onClick={() => addCompetitor.mutate(newCompetitor)}
                    disabled={!newCompetitor.trim() || addCompetitor.isPending}
                    size="sm"
                  >
                    {addCompetitor.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>

                {/* Competitor List */}
                <div className="space-y-3">
                  {marketData?.competitors?.map((competitor, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{competitor.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(competitor.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        Last updated: {new Date(competitor.lastUpdate).toLocaleDateString()}
                      </p>
                      {competitor.changes.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-red-600 mb-1">Recent Changes:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {competitor.changes.map((change, idx) => (
                              <li key={idx}>• {change}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {competitor.newContent.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-1">New Content:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {competitor.newContent.map((content, idx) => (
                              <li key={idx}>• {content}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No competitors being monitored</p>
                      <p className="text-xs mt-1">Add up to 5 competitor websites to track</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Monthly Summary Report
                </CardTitle>
                <CardDescription>
                  Comprehensive market analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">This Month's Report Includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Industry trend analysis and insights</li>
                    <li>• Competitor activity summary</li>
                    <li>• Content gap analysis</li>
                    <li>• Recommended actions for next month</li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => generateReport.mutate("pdf")}
                    disabled={generateReport.isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    {generateReport.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => generateReport.mutate("email")}
                    disabled={generateReport.isPending}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {generateReport.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Email Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}