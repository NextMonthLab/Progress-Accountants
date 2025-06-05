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
  Eye,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy
} from "lucide-react";

interface BlogPost {
  title: string;
  body: string;
  tone: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
}

interface StoredBlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  keywords?: string[];
  status: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  
  // Filter states for stored blog posts
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  // Fetch all stored blog posts for the list
  const { data: storedBlogPosts = [], isLoading: isLoadingPosts, refetch: refetchPosts } = useQuery({
    queryKey: ["/api/content/blog-posts", "all"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/content/blog-posts?all=true");
      return response.json();
    },
    enabled: !!user,
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
      refetchPosts(); // Refresh the posts list
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

  // Filter stored blog posts based on search, status, and sort criteria
  const filteredBlogPosts = storedBlogPosts
    .filter((post: StoredBlogPost) => {
      const matchesSearch = searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: StoredBlogPost, b: StoredBlogPost) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Delete blog post mutation
  const deleteBlogPost = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("DELETE", `/api/content/blog-posts/${postId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The blog post has been permanently removed.",
      });
      refetchPosts();
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
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

        {/* Stored Blog Posts List Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Stored Blog Posts</h2>
            <div className="text-sm text-gray-500">
              {filteredBlogPosts.length} of {storedBlogPosts.length} posts
            </div>
          </div>

          {/* Filter and Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts List */}
          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              <span className="ml-2 text-gray-600">Loading blog posts...</span>
            </div>
          ) : filteredBlogPosts.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {storedBlogPosts.length === 0 ? "No blog posts yet" : "No posts match your filters"}
                </h3>
                <p className="text-gray-500">
                  {storedBlogPosts.length === 0 
                    ? "Start by generating your first blog post using the tools above."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBlogPosts.map((post: StoredBlogPost) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {post.title}
                          </h3>
                          <Badge 
                            variant={post.status === "published" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {post.status}
                          </Badge>
                        </div>
                        
                        {post.excerpt && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        
                        {post.keywords && post.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.keywords.slice(0, 5).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{keyword}
                              </Badge>
                            ))}
                            {post.keywords.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.keywords.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Send className="h-3 w-3" />
                              Published: {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(post.content);
                            toast({
                              title: "Content copied",
                              description: "Blog post content copied to clipboard.",
                            });
                          }}
                          className="shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBlogPost({
                              title: post.title,
                              body: post.content,
                              tone: "professional",
                              tags: post.keywords || [],
                              status: "draft"
                            });
                            toast({
                              title: "Post loaded",
                              description: "Blog post loaded into the editor for modification.",
                            });
                          }}
                          className="shrink-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
                              deleteBlogPost.mutate(post.id);
                            }
                          }}
                          className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deleteBlogPost.isPending}
                        >
                          {deleteBlogPost.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}