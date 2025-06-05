import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Share2, 
  Sparkles, 
  Copy, 
  Calendar, 
  Loader2,
  FileText,
  MessageSquare,
  Image,
  Hash,
  Eye,
  Clock
} from "lucide-react";

interface SocialPost {
  platform: string;
  content: string;
  mediaUrl?: string;
  scheduledDate?: string;
  hashtags: string[];
  status: "draft" | "scheduled" | "posted";
}

interface ContentSource {
  blogPosts: Array<{
    id: string;
    title: string;
    excerpt: string;
    publishedAt: string;
  }>;
  recentQuestions: Array<{
    question: string;
    category: string;
    frequency: number;
  }>;
}

const platformSettings = {
  linkedin: {
    name: "LinkedIn",
    icon: "💼",
    charLimit: 3000,
    style: "Professional networking tone",
    color: "bg-blue-600"
  },
  instagram: {
    name: "Instagram",
    icon: "📸",
    charLimit: 2200,
    style: "Visual storytelling with hashtags",
    color: "bg-pink-600"
  },
  x: {
    name: "X (Twitter)",
    icon: "🐦",
    charLimit: 280,
    style: "Concise and engaging",
    color: "bg-black"
  },
  facebook: {
    name: "Facebook",
    icon: "👥",
    charLimit: 63206,
    style: "Community focused discussion",
    color: "bg-blue-700"
  }
};

export default function SocialPostGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socialPost, setSocialPost] = useState<SocialPost>({
    platform: "linkedin",
    content: "",
    hashtags: [],
    status: "draft"
  });
  const [newHashtag, setNewHashtag] = useState("");
  const [manualPrompt, setManualPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Check for preloaded insight from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const preloadedPrompt = urlParams.get('prompt');
    
    if (preloadedPrompt) {
      setSocialPost(prev => ({
        ...prev,
        content: preloadedPrompt
      }));
      setManualPrompt(preloadedPrompt);
      
      toast({
        title: "Insight Loaded",
        description: "Content has been preloaded from your insight selection.",
      });
    }
  }, [toast]);

  // Fetch content sources
  const { data: contentSources, isLoading: loadingSources } = useQuery<ContentSource>({
    queryKey: ["/api/content/sources"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/content/sources");
      return response.json();
    }
  });

  // Fetch recent social posts
  const { data: recentPosts } = useQuery({
    queryKey: ["/api/content/social-posts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/content/social-posts");
      return response.json();
    }
  });

  const generateContent = useMutation({
    mutationFn: async (data: { sourceType: string; sourceId?: string; prompt?: string }) => {
      const response = await apiRequest("POST", "/api/content/generate-social", {
        ...data,
        platform: socialPost.platform
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSocialPost(prev => ({
        ...prev,
        content: data.content,
        hashtags: data.hashtags || []
      }));
      toast({
        title: "Content generated",
        description: "AI has created a social media post for your selected platform.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveSocialPost = useMutation({
    mutationFn: async (data: SocialPost) => {
      const response = await apiRequest("POST", "/api/content/social-posts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Social post saved",
        description: socialPost.status === "scheduled" ? "Your post has been scheduled." : "Your draft has been saved.",
      });
      if (socialPost.status === "posted") {
        setSocialPost({
          platform: "linkedin",
          content: "",
          hashtags: [],
          status: "draft"
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof SocialPost, value: any) => {
    setSocialPost(prev => ({ ...prev, [field]: value }));
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !socialPost.hashtags.includes(newHashtag.trim().replace('#', ''))) {
      setSocialPost(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag.trim().replace('#', '')]
      }));
      setNewHashtag("");
    }
  };

  const removeHashtag = (hashtagToRemove: string) => {
    setSocialPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== hashtagToRemove)
    }));
  };

  const generateFromSource = (sourceType: string, sourceId?: string) => {
    setIsGenerating(true);
    const data = sourceId 
      ? { sourceType, sourceId }
      : { sourceType, prompt: manualPrompt };
    
    generateContent.mutate(data);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const copyToClipboard = () => {
    const fullContent = socialPost.content + 
      (socialPost.hashtags.length > 0 ? '\n\n' + socialPost.hashtags.map(tag => `#${tag}`).join(' ') : '');
    navigator.clipboard.writeText(fullContent);
    toast({
      title: "Copied to clipboard",
      description: "Your social media post has been copied and is ready to paste.",
    });
  };

  const handleSchedule = (status: "draft" | "scheduled" | "posted") => {
    const postToSave = { ...socialPost, status };
    if (status === "scheduled" && !socialPost.scheduledDate) {
      toast({
        title: "Schedule required",
        description: "Please select a date and time to schedule your post.",
        variant: "destructive",
      });
      return;
    }
    setSocialPost(postToSave);
    saveSocialPost.mutate(postToSave);
  };

  const currentPlatform = platformSettings[socialPost.platform as keyof typeof platformSettings];
  const characterCount = socialPost.content.length;
  const isOverLimit = characterCount > currentPlatform.charLimit;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Share2 className="h-8 w-8 text-cyan-600" />
                  Social Post Generator
                </h1>
                <p className="text-gray-600 mt-2">
                  Create engaging social media content from your insights and blog posts
                </p>
              </div>
            </div>

            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Selection</CardTitle>
                <CardDescription>
                  Choose your target social media platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(platformSettings).map(([key, platform]) => (
                    <Button
                      key={key}
                      onClick={() => handleInputChange("platform", key)}
                      variant={socialPost.platform === key ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center gap-2 ${
                        socialPost.platform === key ? platform.color + " text-white" : ""
                      }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-sm">{platform.name}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{currentPlatform.name} Guidelines:</p>
                  <p className="text-sm text-gray-600">{currentPlatform.style}</p>
                  <p className="text-sm text-gray-600">Character limit: {currentPlatform.charLimit.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Content Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-600" />
                  Generate Content From
                </CardTitle>
                <CardDescription>
                  Choose a source to automatically generate social content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Blog Posts */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Latest Blog Posts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contentSources?.blogPosts?.slice(0, 4).map((post) => (
                      <Button
                        key={post.id}
                        onClick={() => generateFromSource("blog", post.id)}
                        disabled={isGenerating || loadingSources}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start text-left"
                      >
                        <span className="font-medium text-sm">{post.title}</span>
                        <span className="text-xs text-gray-500 mt-1">{post.excerpt}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recent Questions */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Popular Customer Questions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contentSources?.recentQuestions?.slice(0, 4).map((question, index) => (
                      <Button
                        key={index}
                        onClick={() => generateFromSource("question", question.question)}
                        disabled={isGenerating || loadingSources}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start text-left"
                      >
                        <span className="font-medium text-sm">{question.question}</span>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {question.category} • Asked {question.frequency} times
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Manual Prompt */}
                <div>
                  <h4 className="font-medium mb-2">Custom Prompt</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., 'Promote our new video package'"
                      value={manualPrompt}
                      onChange={(e) => setManualPrompt(e.target.value)}
                    />
                    <Button
                      onClick={() => generateFromSource("manual")}
                      disabled={!manualPrompt.trim() || isGenerating}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                {isGenerating && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      AI is creating {currentPlatform.name}-optimized content...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Post Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Post Editor</CardTitle>
                <CardDescription>
                  Edit your AI-generated content or write from scratch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content">Post Content</Label>
                    <span className={`text-sm ${isOverLimit ? "text-red-600" : "text-gray-500"}`}>
                      {characterCount.toLocaleString()} / {currentPlatform.charLimit.toLocaleString()}
                    </span>
                  </div>
                  <Textarea
                    id="content"
                    placeholder={`Write your ${currentPlatform.name} post here...`}
                    value={socialPost.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={8}
                    className={`resize-none ${isOverLimit ? "border-red-500" : ""}`}
                  />
                  {isOverLimit && (
                    <p className="text-sm text-red-600">
                      Content exceeds {currentPlatform.name} character limit
                    </p>
                  )}
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add hashtag (without #)"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addHashtag()}
                    />
                    <Button onClick={addHashtag} variant="outline" size="sm">
                      <Hash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {socialPost.hashtags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeHashtag(tag)}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label htmlFor="media">Media (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Upload image or video</p>
                    <p className="text-sm text-gray-400">Coming soon</p>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule Post (Optional)</Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={socialPost.scheduledDate || ""}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={copyToClipboard}
                    disabled={!socialPost.content}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Post
                  </Button>
                  <Button
                    onClick={() => handleSchedule("draft")}
                    disabled={!socialPost.content || saveSocialPost.isPending}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {saveSocialPost.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Save as Draft
                  </Button>
                  {socialPost.scheduledDate && (
                    <Button
                      onClick={() => handleSchedule("scheduled")}
                      disabled={!socialPost.content || saveSocialPost.isPending}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
                    >
                      {saveSocialPost.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      Schedule Post
                    </Button>
                  )}
                  <Button
                    onClick={() => window.open(`https://${socialPost.platform}.com`, '_blank')}
                    disabled={!socialPost.content}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Post Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {socialPost.content && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-600" />
                    {currentPlatform.name} Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg">{currentPlatform.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium">Your Business</p>
                        <p className="text-sm text-gray-500">Now</p>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-800 mb-3">
                      {socialPost.content}
                    </div>
                    {socialPost.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {socialPost.hashtags.map((tag, index) => (
                          <span key={index} className="text-cyan-600 text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {recentPosts && recentPosts.length > 0 ? (
                  <div className="space-y-3">
                    {recentPosts.slice(0, 5).map((post: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{platformSettings[post.platform as keyof typeof platformSettings]?.icon}</span>
                          <span className="text-sm font-medium">{platformSettings[post.platform as keyof typeof platformSettings]?.name}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.status} • {post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString() : "No date"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent posts found</p>
                )}
              </CardContent>
            </Card>

            {/* Social Media Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use emojis to increase engagement</p>
                <p>• Ask questions to encourage comments</p>
                <p>• Include relevant hashtags</p>
                <p>• Post consistently for best results</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}