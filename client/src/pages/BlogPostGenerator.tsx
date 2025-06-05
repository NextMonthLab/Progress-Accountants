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
  FileText, 
  Sparkles, 
  Save, 
  Send, 
  Loader2,
  MessageSquare,
  TrendingUp,
  Calendar,
  Tag,
  Eye
} from "lucide-react";

interface BlogPost {
  title: string;
  body: string;
  tone: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
}

interface InsightData {
  conversations: Array<{
    id: string;
    summary: string;
    topics: string[];
    timestamp: string;
  }>;
  topInsights: Array<{
    insight: string;
    score: number;
    category: string;
  }>;
  marketTrends: Array<{
    keyword: string;
    trend: string;
    volume: number;
  }>;
}

export default function BlogPostGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: "",
    body: "",
    tone: "professional",
    tags: [],
    status: "draft"
  });
  const [newTag, setNewTag] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Check for preloaded insight from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const preloadedPrompt = urlParams.get('prompt');
    const preloadedTitle = urlParams.get('title');
    
    if (preloadedPrompt) {
      setBlogPost(prev => ({
        ...prev,
        body: preloadedPrompt,
        title: preloadedTitle || `Blog Post from Insight: ${preloadedPrompt.substring(0, 50)}...`
      }));
      
      toast({
        title: "Insight Loaded",
        description: "Content has been preloaded from your insight selection.",
      });
    }
  }, [toast]);

  // Fetch insight data for content generation
  const { data: insightData, isLoading: loadingInsights } = useQuery<InsightData>({
    queryKey: ["/api/insights/content-data"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/insights/content-data");
      return response.json();
    }
  });

  // Fetch recent blog posts for sidebar
  const { data: recentPosts } = useQuery({
    queryKey: ["/api/content/blog-posts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/content/blog-posts");
      return response.json();
    }
  });

  const generateContent = useMutation({
    mutationFn: async (sourceType: "conversations" | "insights" | "trends") => {
      const response = await apiRequest("POST", "/api/content/generate-blog", {
        sourceType,
        tone: blogPost.tone,
        data: insightData
      });
      return response.json();
    },
    onSuccess: (data) => {
      setBlogPost(prev => ({
        ...prev,
        title: data.title,
        body: data.body,
        tags: data.suggestedTags || []
      }));
      toast({
        title: "Content generated",
        description: "AI has created a blog post draft based on your insights.",
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

  const saveBlogPost = useMutation({
    mutationFn: async (data: BlogPost) => {
      const response = await apiRequest("POST", "/api/content/blog-posts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post saved",
        description: blogPost.status === "published" ? "Your post has been published to the SmartSite feed." : "Your draft has been saved.",
      });
      if (blogPost.status === "published") {
        setBlogPost({
          title: "",
          body: "",
          tone: "professional",
          tags: [],
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

  const handleInputChange = (field: keyof BlogPost, value: string | string[]) => {
    setBlogPost(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !blogPost.tags.includes(newTag.trim())) {
      setBlogPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBlogPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateFromSource = (sourceType: "conversations" | "insights" | "trends") => {
    setIsGenerating(true);
    generateContent.mutate(sourceType);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const handleSave = (status: "draft" | "published") => {
    const postToSave = { ...blogPost, status };
    if (status === "published") {
      postToSave.publishedAt = new Date().toISOString();
    }
    setBlogPost(postToSave);
    saveBlogPost.mutate(postToSave);
  };

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
                  <FileText className="h-8 w-8 text-cyan-600" />
                  Blog Post Generator
                </h1>
                <p className="text-gray-600 mt-2">
                  Create engaging content from your customer insights and conversations
                </p>
              </div>
            </div>

            {/* Content Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-600" />
                  Generate Content From
                </CardTitle>
                <CardDescription>
                  Choose a source to automatically generate blog content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => generateFromSource("conversations")}
                    disabled={isGenerating || loadingInsights}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-cyan-200 hover:border-cyan-400"
                  >
                    <MessageSquare className="h-6 w-6 text-cyan-600" />
                    <span className="text-sm">Recent Conversations</span>
                    {insightData?.conversations && (
                      <Badge variant="secondary" className="text-xs">
                        {insightData.conversations.length} available
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => generateFromSource("insights")}
                    disabled={isGenerating || loadingInsights}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-cyan-200 hover:border-cyan-400"
                  >
                    <TrendingUp className="h-6 w-6 text-cyan-600" />
                    <span className="text-sm">Top Insights</span>
                    {insightData?.topInsights && (
                      <Badge variant="secondary" className="text-xs">
                        {insightData.topInsights.length} insights
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => generateFromSource("trends")}
                    disabled={isGenerating || loadingInsights}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-cyan-200 hover:border-cyan-400"
                  >
                    <Calendar className="h-6 w-6 text-cyan-600" />
                    <span className="text-sm">Market Trends</span>
                    <Badge variant="outline" className="text-xs">
                      Premium
                    </Badge>
                  </Button>
                </div>
                
                {isGenerating && (
                  <Alert className="mt-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      AI is analyzing your data and generating content...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Blog Post Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Post Editor</CardTitle>
                <CardDescription>
                  Edit your AI-generated content or write from scratch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title and Tone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your blog post title"
                      value={blogPost.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone of Voice</Label>
                    <Select value={blogPost.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">Post Content</Label>
                  <Textarea
                    id="body"
                    placeholder="Write your blog post content here..."
                    value={blogPost.body}
                    onChange={(e) => handleInputChange("body", e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleSave("draft")}
                    disabled={!blogPost.title || !blogPost.body || saveBlogPost.isPending}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {saveBlogPost.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSave("published")}
                    disabled={!blogPost.title || !blogPost.body || saveBlogPost.isPending}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
                  >
                    {saveBlogPost.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Publish Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {(blogPost.title || blogPost.body) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-600" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <h1 className="text-2xl font-bold mb-4">{blogPost.title || "Untitled Post"}</h1>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {blogPost.body || "No content yet..."}
                    </div>
                    {blogPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {blogPost.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            #{tag}
                          </Badge>
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
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.status === "published" ? "Published" : "Draft"} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Unsaved"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent posts found</p>
                )}
              </CardContent>
            </Card>

            {/* Content Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Use customer questions as blog topics</p>
                <p>• Include relevant service links</p>
                <p>• Keep paragraphs short for readability</p>
                <p>• Add tags for better categorization</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}