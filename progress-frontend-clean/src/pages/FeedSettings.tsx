import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Globe, 
  Rss, 
  Bot, 
  Palette, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  Share2
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { 
  getFeedSettings, 
  updateFeedSettings, 
  syncBrandingWithFeed, 
  generateSetupInstructions,
  getFeedUrl,
  testFeedDeployment,
  getAvailableTopics,
  FeedSetupInstructions
} from "@/lib/feedConfigApi";

export default function FeedSettings() {
  const { toast } = useToast();
  const [setupInstructions, setSetupInstructions] = useState<FeedSetupInstructions | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Fetch current feed settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/feed/settings"],
    queryFn: getFeedSettings,
  });

  // Fetch available topics for autopilot
  const { data: topics } = useQuery({
    queryKey: ["/api/feed/topics"],
    queryFn: getAvailableTopics,
  });

  // Fetch feed URL status
  const { data: feedUrl } = useQuery({
    queryKey: ["/api/feed/url"],
    queryFn: getFeedUrl,
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: updateFeedSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed/settings"] });
      toast({
        title: "Settings Updated",
        description: "Feed configuration has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sync branding mutation
  const syncBrandingMutation = useMutation({
    mutationFn: syncBrandingWithFeed,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed/settings"] });
      toast({
        title: "Branding Synced",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test deployment mutation
  const testDeploymentMutation = useMutation({
    mutationFn: testFeedDeployment,
    onSuccess: (data) => {
      toast({
        title: "Deployment Test",
        description: data.message,
        variant: data.status === "success" ? "default" : "destructive",
      });
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, [key]: value };
    updateMutation.mutate({ [key]: value });
  };

  const handleGenerateInstructions = async () => {
    if (!settings?.customSubdomain) {
      toast({
        title: "Subdomain Required",
        description: "Please enter a custom subdomain first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const instructions = await generateSetupInstructions(settings.customSubdomain);
      setSetupInstructions(instructions);
      setShowInstructions(true);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate setup instructions.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const downloadInstructions = () => {
    if (!setupInstructions) return;
    
    const content = `# SmartSite Feed Setup Instructions

## CNAME Record Setup
Add the following CNAME record to your DNS:
- Name: ${setupInstructions.cnameRecord.name}
- Value: ${setupInstructions.cnameRecord.value}
- Type: ${setupInstructions.cnameRecord.type}

## Iframe Embed Code
${setupInstructions.iframeEmbed}

## JavaScript Snippet
${setupInstructions.jsSnippet}

## Setup Steps
${setupInstructions.setupSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartsite-feed-setup.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Rss className="h-8 w-8 text-primary" />
            Feed Control Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage your SmartSite Feed deployment
          </p>
        </div>
        
        <div className="flex gap-3">
          {feedUrl?.isActive && (
            <Button variant="outline" asChild>
              <a href={feedUrl.url} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                View Live Feed
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => testDeploymentMutation.mutate()}
            disabled={testDeploymentMutation.isPending}
          >
            {testDeploymentMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            Test Deployment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Module Configuration
            </CardTitle>
            <CardDescription>
              Enable or disable feed modules and content types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="blog-posts" className="font-medium">Blog Posts</Label>
              <Switch
                id="blog-posts"
                checked={settings?.blogPostsEnabled ?? true}
                onCheckedChange={(checked) => handleSettingChange("blogPostsEnabled", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="insights" className="font-medium">Customer Insights & Testimonials</Label>
              <Switch
                id="insights"
                checked={settings?.insightsEnabled ?? true}
                onCheckedChange={(checked) => handleSettingChange("insightsEnabled", checked)}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="social-feed" className="font-medium">Social Media Feed</Label>
                <Switch
                  id="social-feed"
                  checked={settings?.socialFeedEnabled ?? false}
                  onCheckedChange={(checked) => handleSettingChange("socialFeedEnabled", checked)}
                />
              </div>
              
              {settings?.socialFeedEnabled && (
                <div className="ml-6 space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="youtube" className="text-sm">YouTube</Label>
                    <Switch
                      id="youtube"
                      checked={settings?.youtubeEnabled ?? false}
                      onCheckedChange={(checked) => handleSettingChange("youtubeEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                    <Switch
                      id="instagram"
                      checked={settings?.instagramEnabled ?? false}
                      onCheckedChange={(checked) => handleSettingChange("instagramEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tiktok" className="text-sm">TikTok</Label>
                    <Switch
                      id="tiktok"
                      checked={settings?.tiktokEnabled ?? false}
                      onCheckedChange={(checked) => handleSettingChange("tiktokEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twitter" className="text-sm">X (Twitter)</Label>
                    <Switch
                      id="twitter"
                      checked={settings?.twitterEnabled ?? false}
                      onCheckedChange={(checked) => handleSettingChange("twitterEnabled", checked)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="events" className="font-medium">Company Events</Label>
              <Switch
                id="events"
                checked={settings?.eventsEnabled ?? false}
                onCheckedChange={(checked) => handleSettingChange("eventsEnabled", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="feedback-form" className="font-medium">Public Feedback Forms</Label>
              <Switch
                id="feedback-form"
                checked={settings?.feedbackFormEnabled ?? true}
                onCheckedChange={(checked) => handleSettingChange("feedbackFormEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Autopilot Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              SmartSite Autopilot
            </CardTitle>
            <CardDescription>
              Automated content posting and management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="autopilot" className="font-medium">Enable Autopilot</Label>
              <Switch
                id="autopilot"
                checked={settings?.autopilotEnabled ?? false}
                onCheckedChange={(checked) => handleSettingChange("autopilotEnabled", checked)}
              />
            </div>
            
            {settings?.autopilotEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="interval">Posting Interval</Label>
                  <Select
                    value={settings?.autopilotInterval ?? "weekly"}
                    onValueChange={(value) => handleSettingChange("autopilotInterval", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Content Topics</Label>
                  <div className="flex flex-wrap gap-2">
                    {topics?.map((topic) => (
                      <Badge key={topic.id} variant="secondary" className="cursor-pointer">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="approval" className="font-medium">Require Approval</Label>
                  <Switch
                    id="approval"
                    checked={settings?.autopilotApprovalRequired ?? true}
                    onCheckedChange={(checked) => handleSettingChange("autopilotApprovalRequired", checked)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Branding Sync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding Sync
            </CardTitle>
            <CardDescription>
              Synchronize your brand identity with the feed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Branding Status</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.brandingSynced 
                    ? `Last synced: ${settings.brandingLastSync ? new Date(settings.brandingLastSync).toLocaleDateString() : 'Unknown'}`
                    : 'Not synchronized'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {settings?.brandingSynced ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
            
            <Button 
              onClick={() => syncBrandingMutation.mutate()}
              disabled={syncBrandingMutation.isPending}
              className="w-full"
            >
              {syncBrandingMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Branding to Feed
            </Button>
          </CardContent>
        </Card>

        {/* Subdomain Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Public Subdomain Setup
            </CardTitle>
            <CardDescription>
              Configure custom domain for your public feed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Custom Subdomain</Label>
              <div className="flex gap-2">
                <Input
                  id="subdomain"
                  placeholder="feed.yourdomain.com"
                  value={settings?.customSubdomain ?? ""}
                  onChange={(e) => handleSettingChange("customSubdomain", e.target.value)}
                />
                <Button onClick={handleGenerateInstructions} variant="outline">
                  Generate Setup
                </Button>
              </div>
            </div>
            
            {settings?.subdomainActive && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">Subdomain is active and verified</span>
              </div>
            )}
            
            {showInstructions && setupInstructions && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Setup Instructions</h4>
                  <Button size="sm" variant="outline" onClick={downloadInstructions}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">CNAME Record</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                        {setupInstructions.cnameRecord.name} → {setupInstructions.cnameRecord.value}
                      </code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(
                          `${setupInstructions.cnameRecord.name} → ${setupInstructions.cnameRecord.value}`,
                          "CNAME record"
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Iframe Embed</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                        {setupInstructions.iframeEmbed}
                      </code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(setupInstructions.iframeEmbed, "Iframe code")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feed Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Feed Configuration
          </CardTitle>
          <CardDescription>
            Customize the appearance and content of your public feed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed-title">Feed Title</Label>
              <Input
                id="feed-title"
                placeholder="Company News & Updates"
                value={settings?.feedTitle ?? ""}
                onChange={(e) => handleSettingChange("feedTitle", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feed-theme">Theme</Label>
              <Select
                value={settings?.feedTheme ?? "default"}
                onValueChange={(value) => handleSettingChange("feedTheme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feed-description">Feed Description</Label>
            <Textarea
              id="feed-description"
              placeholder="Stay up to date with our latest news, insights, and company updates..."
              value={settings?.feedDescription ?? ""}
              onChange={(e) => handleSettingChange("feedDescription", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}