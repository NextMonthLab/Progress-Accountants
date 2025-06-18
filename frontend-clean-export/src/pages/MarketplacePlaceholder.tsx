import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Store,
  Video,
  Calendar,
  Users,
  Brain,
  Sparkles,
  Loader2,
  CheckCircle,
  Mail,
  Plus,
  Zap,
  Rocket,
  Star,
  Clock,
  Shield
} from "lucide-react";

interface MarketplaceTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  comingSoon: boolean;
  featured?: boolean;
}

const marketplaceTools: MarketplaceTool[] = [
  {
    id: "video-snippet-generator",
    title: "Video Snippet Generator",
    description: "Auto-create engaging social media clips from your long-form video content using AI-powered editing and highlight detection.",
    icon: Video,
    category: "Content Creation",
    comingSoon: true,
    featured: true
  },
  {
    id: "ai-scheduler",
    title: "AI Scheduler",
    description: "Let visitors book services directly through your website assistant with intelligent calendar integration and automated confirmations.",
    icon: Calendar,
    category: "Client Management",
    comingSoon: true,
    featured: true
  },
  {
    id: "smartsite-crm-pro",
    title: "SmartSite CRM Pro",
    description: "Advanced lead handling with pipeline management, automated follow-ups, and detailed client interaction tracking.",
    icon: Users,
    category: "Business Intelligence",
    comingSoon: true
  },
  {
    id: "dev-council-addon",
    title: "Dev Council Add-on",
    description: "Embedded in-app feedback system with bug reporting, feature requests, and continuous improvement loops directly from your users.",
    icon: Brain,
    category: "Developer Tools",
    comingSoon: true
  }
];

export default function MarketplacePlaceholder() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Notify me mutation
  const notifyMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/marketplace/notify", { email });
      return response.json();
    },
    onSuccess: () => {
      setNotifySuccess(true);
      setEmail("");
      toast({
        title: "Success",
        description: "You'll be notified when new tools become available",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Notification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    notifyMutation.mutate(email);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Content Creation": return Video;
      case "Client Management": return Calendar;
      case "Business Intelligence": return Users;
      case "Developer Tools": return Brain;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Marketplace</h1>
            <Badge variant="outline" className="px-3 py-1 text-purple-600 border-purple-200">
              <Rocket className="h-3 w-3 mr-1" />
              NextMonth Lab
            </Badge>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enhance your SmartSite with advanced tools from NextMonth Lab
          </p>
          
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 max-w-4xl mx-auto">
            <p className="text-gray-800 text-lg leading-relaxed">
              From AI-powered schedulers to video transcription engines, the Marketplace will allow you to extend your site with cutting-edge tools — built by the NextMonth ecosystem.
            </p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Coming Soon</h2>
          </div>
          <p className="text-purple-100">
            These powerful tools are currently in development. Be the first to know when they're ready.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {marketplaceTools.map((tool) => {
            const IconComponent = tool.icon;
            const CategoryIcon = getCategoryIcon(tool.category);
            
            return (
              <Card key={tool.id} className={`relative overflow-hidden ${tool.featured ? 'ring-2 ring-purple-200 bg-gradient-to-br from-white to-purple-50' : 'bg-white'}`}>
                {tool.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <CategoryIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{tool.category}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <Button 
                      disabled 
                      className="w-full bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to SmartSite
                    </Button>
                    
                    {tool.comingSoon && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>In Development</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Notify Me Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Want Early Access to New Tools?
            </CardTitle>
            <CardDescription>
              Be the first to know when new marketplace tools become available
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {notifySuccess ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Success! You'll be notified when new tools are available.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="notify-email">Email Address</Label>
                  <Input
                    id="notify-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={notifyMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {notifyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Notify Me When Available
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure Integration</h3>
              <p className="text-sm text-gray-600">
                All marketplace tools are security-tested and integrate seamlessly with your existing SmartSite setup.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">One-Click Setup</h3>
              <p className="text-sm text-gray-600">
                Install and configure new tools instantly without technical knowledge or additional hosting.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Every tool leverages advanced AI to provide intelligent automation and insights for your business.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}