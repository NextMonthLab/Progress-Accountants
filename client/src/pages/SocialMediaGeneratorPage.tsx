import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Copy, Download, Trash2, Send, Image, CheckCircle, AlertTriangle, Volume2, AlignLeft, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/layouts/AdminLayout";

// Types for social media posts
interface Post {
  id: string;
  platform: string;
  prompt: string;
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
  createdAt: string;
}

// Business identity interface
interface BusinessIdentity {
  core?: {
    businessName?: string;
  };
  market?: {
    primaryIndustry?: string;
    targetAudience?: string;
  };
  personality?: {
    toneOfVoice?: string[];
  };
}

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", description: "Professional network" },
  { id: "twitter", name: "Twitter/X", description: "Short, concise messages" },
  { id: "facebook", name: "Facebook", description: "General audience" },
  { id: "instagram", name: "Instagram", description: "Visual focus" }
];

export default function SocialMediaGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("create");
  const [platform, setPlatform] = useState("linkedin");
  const [prompt, setPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentLength, setContentLength] = useState([2]); // Default medium length (1=short, 2=medium, 3=long)
  const [toneOfVoice, setToneOfVoice] = useState([3]); // Default professional tone (1=casual, 3=professional, 5=formal)
  const [businessIdentity, setBusinessIdentity] = useState<BusinessIdentity | null>(null);

  // Fetch business identity when component mounts
  useEffect(() => {
    const fetchBusinessIdentity = async () => {
      try {
        const response = await fetch('/api/business-identity');
        if (response.ok) {
          const data = await response.json();
          setBusinessIdentity(data);
          
          // If business identity has tone of voice preferences, use them
          if (data?.personality?.toneOfVoice?.length > 0) {
            // Map tone of voice strings to slider values
            const toneMap: Record<string, number> = {
              'casual': 1,
              'conversational': 2,
              'professional': 3,
              'business': 4,
              'formal': 5
            };
            
            // Get the first tone from the business identity that matches our map
            const matchedTone = data.personality.toneOfVoice.find((tone: string) => toneMap[tone.toLowerCase()]);
            if (matchedTone) {
              setToneOfVoice([toneMap[matchedTone.toLowerCase()]]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching business identity:', error);
      }
    };

    fetchBusinessIdentity();
  }, []);

  // Fetch user's saved posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/social-media/posts");
        const data = await response.json();
        
        if (data.success) {
          setSavedPosts(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error fetching posts",
          description: "Could not load your saved posts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user, toast]);

  // Generate post text
  const generatePost = async () => {
    if (!prompt) {
      toast({
        title: "Input required",
        description: "Please enter a prompt describing the post content.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingText(true);
      
      // Track if we're using business identity data
      const isUsingBusinessIdentity = !!businessIdentity;
      
      // Create request payload with business identity if available
      const payload = {
        prompt,
        platform,
        contentLength: contentLength[0],
        toneOfVoice: toneOfVoice[0],
        businessIdentity
      };
      
      const response = await apiRequest("POST", "/api/social-media/generate-post", payload);
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedText(data.data.text);
        toast({
          title: "Post generated",
          description: `Your social media post has been generated successfully${isUsingBusinessIdentity ? ' using your business identity' : ''}.`,
          variant: "default"
        });
      } else {
        throw new Error(data.message || "Failed to generate post");
      }
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        title: "Generation failed",
        description: (error as Error).message || "An error occurred while generating your post.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Generate image
  const generateImage = async () => {
    const finalImagePrompt = imagePrompt || prompt;
    
    if (!finalImagePrompt) {
      toast({
        title: "Input required",
        description: "Please enter an image prompt or use the post prompt.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingImage(true);
      
      // Track if we're using business identity data
      const isUsingBusinessIdentity = !!businessIdentity;
      
      // Include business identity in the request if available
      const payload = {
        prompt: finalImagePrompt,
        businessIdentity, // Pass business identity to help with image generation context
        platform // Pass platform to help with image format/style customization
      };
      
      const response = await apiRequest("POST", "/api/social-media/generate-image", payload);
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedImage(data.data.url);
        toast({
          title: "Image generated",
          description: `Your image has been generated successfully${isUsingBusinessIdentity ? ' with business context' : ''}.`,
          variant: "default"
        });
      } else {
        throw new Error(data.message || "Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: (error as Error).message || "An error occurred while generating your image.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Save post
  const savePost = async () => {
    if (!generatedText) {
      toast({
        title: "Missing content",
        description: "Please generate post content before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      const post = {
        platform,
        prompt,
        text: generatedText,
        imageUrl: generatedImage || undefined,
        imagePrompt: imagePrompt || prompt
      };
      
      const response = await apiRequest("POST", "/api/social-media/save-post", { post });
      const data = await response.json();
      
      if (data.success) {
        setSavedPosts([data.data, ...savedPosts]);
        toast({
          title: "Post saved",
          description: "Your post has been saved to your session.",
          variant: "default"
        });
      } else {
        throw new Error(data.message || "Failed to save post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Save failed",
        description: (error as Error).message || "An error occurred while saving your post.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete post
  const deletePost = async (postId: string) => {
    try {
      const response = await apiRequest("DELETE", `/api/social-media/posts/${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setSavedPosts(savedPosts.filter(post => post.id !== postId));
        toast({
          title: "Post deleted",
          description: "Your post has been deleted successfully.",
          variant: "default"
        });
      } else {
        throw new Error(data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Delete failed",
        description: (error as Error).message || "An error occurred while deleting your post.",
        variant: "destructive"
      });
    }
  };

  // Convert social media post to blog post
  const convertToBlogPost = async (post: Post) => {
    try {
      // Create the post data object for conversion
      const postData = {
        platform: post.platform,
        prompt: post.prompt,
        text: post.text,
        imageUrl: post.imageUrl,
        imagePrompt: post.imagePrompt,
        timestamp: new Date().toISOString() // Add timestamp for tracking purposes
      };
      
      // Store post data in both localStorage and sessionStorage for redundancy
      const postDataString = JSON.stringify(postData);
      
      try {
        localStorage.setItem('convertedPost', postDataString);
      } catch (storageError) {
        console.warn('Could not save to localStorage, falling back to sessionStorage only');
      }
      
      // Always try sessionStorage as a backup
      try {
        sessionStorage.setItem('convertedPost', postDataString);
      } catch (sessionStorageError) {
        console.warn('Could not save to sessionStorage');
      }
      
      // Navigate to blog post generator with source parameter
      navigate('/tools/blog-post-generator?source=social');
      
      toast({
        title: "Converting to Blog Post",
        description: "Transforming your social media content into a blog post draft...",
        variant: "default",
        duration: 5000 // Show the toast for 5 seconds
      });
    } catch (error) {
      console.error("Error converting to blog post:", error);
      toast({
        title: "Conversion failed",
        description: "Could not convert social media post to blog",
        variant: "destructive"
      });
    }
  };

  // Copy post to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Post content copied to clipboard",
      variant: "default"
    });
  };

  // Download image
  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `social-media-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset form
  const resetForm = () => {
    setPrompt("");
    setImagePrompt("");
    setGeneratedText("");
    setGeneratedImage("");
    setContentLength([2]);  // Reset to default medium length
    setToneOfVoice([3]);    // Reset to default professional tone
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Universal Social Media Post Generator</h1>
              <p className="text-muted-foreground">Create professional social media content in seconds</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Badge className="bg-orange-600">AI-Powered</Badge>
              <Badge variant="outline">Session-Based</Badge>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Post</TabsTrigger>
              <TabsTrigger value="saved">Saved Posts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                  <CardDescription>
                    Select a platform and describe what you want to post about.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={platform} 
                      onValueChange={setPlatform}
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} - <span className="text-muted-foreground text-sm">{p.description}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Post Content Description</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe what you want to post about..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">
                        Example: "A post highlighting our new tax planning services for small businesses with a professional tone"
                      </p>
                      
                      {businessIdentity && (
                        <div className="flex flex-col gap-2 p-4 mt-3 border-2 border-amber-300 bg-amber-50 rounded-md shadow-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 flex items-center gap-1.5 px-2 py-1">
                              <CheckCircle className="h-4 w-4 text-amber-600" />
                              Business Identity Active
                            </Badge>
                          </div>
                          <div className="text-sm text-amber-800 space-y-2 mt-1">
                            {businessIdentity.core?.businessName && (
                              <div className="flex items-center gap-2">
                                <div className="font-medium min-w-24">Business Name:</div>
                                <div className="font-semibold">{businessIdentity.core.businessName}</div>
                              </div>
                            )}
                            {businessIdentity.market?.primaryIndustry && (
                              <div className="flex items-center gap-2">
                                <div className="font-medium min-w-24">Industry:</div>
                                <div className="font-semibold">{businessIdentity.market.primaryIndustry}</div>
                              </div>
                            )}
                            {businessIdentity.market?.targetAudience && (
                              <div className="flex items-center gap-2">
                                <div className="font-medium min-w-24">Target Audience:</div>
                                <div className="font-semibold">{businessIdentity.market.targetAudience}</div>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-amber-600 mt-1">
                            Content will be personalized based on this business identity
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="content-length" className="flex items-center">
                          <AlignLeft className="h-4 w-4 mr-2" />
                          Content Length
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {contentLength[0] === 1 ? "Short" : contentLength[0] === 2 ? "Medium" : "Long"}
                        </span>
                      </div>
                      <Slider
                        id="content-length"
                        min={1}
                        max={3}
                        step={1}
                        value={contentLength}
                        onValueChange={setContentLength}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Concise</span>
                        <span>Balanced</span>
                        <span>Detailed</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="tone-of-voice" className="flex items-center">
                            <Volume2 className="h-4 w-4 mr-2" />
                            Tone of Voice
                          </Label>
                          
                          {/* Show badge if tone was set from business identity */}
                          {businessIdentity?.personality?.toneOfVoice && businessIdentity.personality.toneOfVoice.length > 0 && (
                            <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 text-[10px]">
                              From Business Identity
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {toneOfVoice[0] === 1 ? "Casual" : 
                           toneOfVoice[0] === 2 ? "Conversational" : 
                           toneOfVoice[0] === 3 ? "Professional" : 
                           toneOfVoice[0] === 4 ? "Business" : "Formal"}
                        </span>
                      </div>
                      <Slider
                        id="tone-of-voice"
                        min={1}
                        max={5}
                        step={1}
                        value={toneOfVoice}
                        onValueChange={setToneOfVoice}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Casual</span>
                        <span>Conversational</span>
                        <span>Professional</span>
                        <span>Business</span>
                        <span>Formal</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={generatePost}
                    disabled={isGeneratingText || !prompt}
                    className="w-full"
                  >
                    {isGeneratingText ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate Post Content
                      </>
                    )}
                  </Button>

                  {generatedText && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Generated Post</Label>
                          {businessIdentity && (
                            <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 text-[10px]">
                              Business Optimized
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedText)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                      </div>
                      <div className={`border rounded-lg p-4 ${businessIdentity ? 'bg-green-50 border-green-200' : 'bg-muted/50'}`}>
                        {businessIdentity && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-xs text-green-700">
                              Personalized for <span className="font-semibold">{businessIdentity.core?.businessName || 'your business'}</span>
                            </p>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{generatedText}</p>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="imagePrompt">Image Description (Optional)</Label>
                    <Textarea
                      id="imagePrompt"
                      placeholder="Describe the image you want to generate..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave blank to use post content description, or enter specific image details.
                    </p>
                  </div>
                  
                  <Button
                    onClick={generateImage}
                    disabled={isGeneratingImage || (!prompt && !imagePrompt)}
                    className="w-full"
                    variant="outline"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Image className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  
                  {generatedImage && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Generated Image</Label>
                          {businessIdentity && (
                            <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 text-[10px]">
                              Brand Optimized
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadImage(generatedImage)}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                      <div className={`border rounded-lg overflow-hidden ${businessIdentity ? 'bg-green-50 border-green-200' : ''}`}>
                        {businessIdentity && (
                          <div className="w-full flex items-center gap-2 px-3 py-1.5 border-b border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-xs text-green-700">
                              Created with <span className="font-semibold">{businessIdentity.core?.businessName || 'business'}</span> branding context
                            </p>
                          </div>
                        )}
                        <img 
                          src={generatedImage} 
                          alt="Generated social media" 
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                  <Button variant="secondary" onClick={resetForm}>
                    Reset Form
                  </Button>
                  <Button 
                    onClick={savePost} 
                    disabled={isSaving || !generatedText}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Post
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Posts</CardTitle>
                  <CardDescription>
                    View, copy, and manage your session-saved posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : savedPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No saved posts yet. Create and save a post first.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab("create")}
                        className="mt-2"
                      >
                        Go to Create Post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {savedPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge className="mb-2">
                                {PLATFORMS.find(p => p.id === post.platform)?.name || post.platform}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Created: {new Date(post.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(post.text)}
                                title="Copy text"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => convertToBlogPost(post)}
                                title="Convert to blog post"
                              >
                                <FileText className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deletePost(post.id)}
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-l-4 border-primary pl-3 py-1">
                            <p className="text-sm whitespace-pre-wrap">{post.text}</p>
                          </div>
                          
                          {post.imageUrl && (
                            <div className="border rounded overflow-hidden mt-2">
                              <img
                                src={post.imageUrl}
                                alt="Social media"
                                className="w-full h-auto max-h-60 object-contain"
                              />
                            </div>
                          )}
                          
                          {/* Convert to Blog Button - More prominent placement */}
                          <div className="flex justify-end mt-3">
                            <Button
                              onClick={() => convertToBlogPost(post)}
                              variant="outline"
                              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            >
                              <FileText className="h-4 w-4" />
                              <span>Convert to Blog Post</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Note: Posts are stored in your session only and will be lost when you log out.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}