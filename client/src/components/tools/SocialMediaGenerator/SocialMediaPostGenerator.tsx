import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import { Loader2, Copy, Download, RefreshCw, Image, Share2, ExternalLink, AlertCircle, InfoIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Form validation schema
const formSchema = z.object({
  platform: z.string({
    required_error: "Please select a social media platform",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters",
  }),
  additionalContext: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const platforms = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
  { id: "twitter", name: "X (Twitter)" },
  { id: "tiktok", name: "TikTok" },
  { id: "youtube", name: "YouTube" },
  { id: "threads", name: "Threads" },
  { id: "other", name: "Other" },
];

const SocialMediaPostGenerator: React.FC = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  const { toast } = useToast();
  const { businessIdentity, isLoading: isLoadingBusinessIdentity } = useBusinessIdentity();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("upload");
  const [showIdentityNotice, setShowIdentityNotice] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has appropriate permissions
  const canUseGenerator = user && can("use_tools");
  
  // Session timeout warning effect
  useEffect(() => {
    // Show a warning when the component mounts
    toast({
      title: "Session-Based Tool",
      description: "Posts are stored in your current session only. They will be lost if you log out or refresh.",
      duration: 6000,
    });
  }, []);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "",
      subject: "",
      additionalContext: "",
    },
  });

  // Handle file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate AI image based on subject
  const generateAIImage = async (subject: string, platform: string) => {
    try {
      setIsGenerating(true);
      
      // Enhanced prompt for better image generation
      const enhancedPrompt = `A professional, visually appealing image for ${platform} about "${subject}". 
      The image should be clean, modern, and appropriate for a professional accounting firm's social media post.
      Include visual elements that represent "${subject}" in a thoughtful way.`;
      
      // OpenAI image generation
      const response = await fetch("/api/openai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.details || "Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImageUrl(data.url);
      return data.url;
    } catch (error: any) {
      console.error("Error generating image:", error);
      
      // Check for specific API errors
      let errorMessage = "Failed to generate an image. Please try again.";
      
      if (error.message.includes("API key")) {
        errorMessage = "API Key missing or invalid. Please contact an administrator.";
      } else if (error.message.includes("content policy")) {
        errorMessage = "Content policy violation. Please adjust your subject matter.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
      }
      
      toast({
        title: "Image Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate caption based on platform, subject, and image
  const generateCaption = async (data: FormValues, imageUrl: string | null) => {
    try {
      setIsGenerating(true);

      // Platform-specific instructions for the AI
      const platformGuides: Record<string, string> = {
        linkedin: "professional tone, 1-3 paragraphs, 1-3 relevant hashtags, call-to-action, suited for B2B audience",
        instagram: "engaging tone, emojis, 5-10 hashtags, question for engagement, visually descriptive",
        facebook: "conversational tone, 1-2 paragraphs, 1-2 hashtags, question for engagement, community-focused",
        twitter: "concise text under 280 characters, 1-2 hashtags, punchy opening, direct message",
        tiktok: "very casual, trendy language, 3-5 hashtags, call to action, hook in first sentence",
        youtube: "descriptive, keyword-rich, calls to subscribe, timestamps if relevant, SEO-optimized",
        threads: "casual, brief, conversation starter, minimal hashtags, thought-provoking",
        other: "balanced professional tone, 1-2 paragraphs, 2-3 hashtags, clear message",
      };

      // Get the appropriate guide
      const platformKey = data.platform as keyof typeof platformGuides;
      const guide = platformGuides[platformKey] || platformGuides.other;

      // Create enhanced prompt for generating the caption
      let prompt = data.subject;

      if (data.additionalContext) {
        prompt += ` ${data.additionalContext}`;
      }

      // Call our backend API which will use OpenAI and integrate business identity
      const response = await fetch("/api/social-media/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          platform: data.platform
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.details || "Failed to generate caption");
      }

      const result = await response.json();
      setGeneratedCaption(result.text);
      return result.text;
    } catch (error: any) {
      console.error("Error generating caption:", error);
      
      // More helpful error messages based on the specific error
      let errorMessage = "Failed to generate a caption. Please try again.";
      
      if (error.message.includes("API key")) {
        errorMessage = "API key issue. Please contact an administrator.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Try with a simpler subject.";
      }
      
      toast({
        title: "Caption Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Determine which image to use
    let imageToUse: string | null = null;
    
    if (selectedTab === "upload" && uploadedImage) {
      imageToUse = uploadedImage;
    } else if (selectedTab === "generate") {
      // Generate AI image
      imageToUse = await generateAIImage(data.subject, data.platform);
    }

    // Generate caption based on the form data and image
    await generateCaption(data, imageToUse);
  };

  // Handle copy caption to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCaption);
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard",
    });
  };

  // Handle image download
  const downloadImage = () => {
    const imageUrl = generatedImageUrl || uploadedImage;
    if (!imageUrl) return;

    // Create an anchor element and set properties for download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "social-media-image.png"; // Set the download file name
    document.body.appendChild(link); // Append to body
    link.click(); // Programmatically click the link to trigger download
    document.body.removeChild(link); // Clean up

    toast({
      title: "Download Started",
      description: "Your image is being downloaded",
    });
  };

  // Reset the generator
  const resetGenerator = () => {
    form.reset();
    setGeneratedCaption("");
    setGeneratedImageUrl("");
    setUploadedImage(null);
    setSelectedTab("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Share to social media
  const getPlatformShareUrl = (platform: string, caption: string, imageUrl: string | null | undefined) => {
    const encodedText = encodeURIComponent(caption);
    switch (platform) {
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}`;
      default:
        return "";
    }
  };

  // If user doesn't have permission, show message
  if (!canUseGenerator) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Social Media Post Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to use this tool. Please contact an administrator.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Session warning notice */}
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Session-based Tool</AlertTitle>
        <AlertDescription className="text-amber-700">
          This tool is for quick content creation only. All generated posts are stored in your browser session and will be lost when you log out or refresh the page.
        </AlertDescription>
      </Alert>
      
      {/* Marketplace redirect for long-term planning */}
      <Alert variant="default" className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Need content calendar planning?</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>Looking for long-term storage and scheduling? Check out our full Social Media Marketing Suite.</span>
          <Button variant="outline" size="sm" asChild>
            <Link to="/marketplace/social-media-suite" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Marketplace</span>
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
      
      {/* Business Identity connection notice */}
      {showIdentityNotice && (
        <Alert variant="default" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Using Business Identity Settings</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>This tool is connected to your Business Identity settings to maintain consistent brand voice across generated content.</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowIdentityNotice(false)}
              className="text-blue-700 hover:text-blue-900"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Universal Social Media Post Generator</CardTitle>
          <CardDescription>
            Create optimized posts for any social media platform with AI-powered captions and images
          </CardDescription>
          {/* Add a helpful explanation about how the tool works */}
          <div className="mt-2 text-sm text-muted-foreground">
            <p className="mb-1">This tool helps you create professional social media content in three simple steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select a platform and enter your post subject</li>
              <li>Choose to upload your own image or generate one with AI</li>
              <li>Click "Generate Post" to create platform-optimized content</li>
            </ol>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Media Platform</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        
                        // Update subject/context suggestions based on platform
                        const platformSuggestions: Record<string, { subject: string, context: string }> = {
                          linkedin: {
                            subject: "Tax planning strategies for small businesses",
                            context: "Focus on professional networking and thought leadership"
                          },
                          instagram: {
                            subject: "Behind the scenes at our accounting firm",
                            context: "Use vibrant, visual storytelling with a personal touch"
                          },
                          facebook: {
                            subject: "How we helped a local business save on taxes",
                            context: "Share as a client success story with community emphasis"
                          },
                          twitter: {
                            subject: "Quick tip: End of quarter tax reminder",
                            context: "Keep it brief and actionable with 1-2 hashtags"
                          },
                          tiktok: {
                            subject: "Accounting hack that saves businesses time",
                            context: "Explain a complex concept in a simple, engaging way"
                          },
                          youtube: {
                            subject: "5-minute guide to understanding business expenses",
                            context: "Structure as a tutorial with clear sections"
                          },
                          threads: {
                            subject: "Common accounting misconception debunked",
                            context: "Frame as a conversation starter with a surprising fact"
                          }
                        };
                        
                        // Set placeholder text based on selection
                        const suggestion = platformSuggestions[value];
                        if (suggestion) {
                          // Only set placeholders if fields are empty
                          const subjectField = form.getValues("subject");
                          const contextField = form.getValues("additionalContext");
                          
                          // Update form with platform-specific suggestions
                          if (!subjectField) {
                            form.setValue("subject", suggestion.subject);
                          }
                          
                          if (!contextField) {
                            form.setValue("additionalContext", suggestion.context);
                          }
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem
                            key={platform.id}
                            value={platform.id}
                          >
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This determines the optimal format, length, and style for your post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Subject or Theme</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Client success story' or 'Tax preparation tips'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The main topic or theme of your social media post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional details or context you'd like to include..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any specific details or context you want to include in the post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Media</h3>
                <Tabs
                  defaultValue="upload"
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="generate">Generate AI Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="pt-4">
                    <FormItem>
                      <FormLabel>Upload an Image</FormLabel>
                      <FormControl>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an image to include with your post.
                      </FormDescription>
                      {uploadedImage && (
                        <div className="mt-4">
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="max-h-60 rounded-md object-contain"
                          />
                        </div>
                      )}
                    </FormItem>
                  </TabsContent>
                  <TabsContent value="generate" className="pt-4">
                    <FormItem>
                      <FormLabel>AI Image Generation</FormLabel>
                      <FormDescription>
                        An AI image will be generated based on your post subject.
                      </FormDescription>
                      {generatedImageUrl && (
                        <div className="mt-4">
                          <img
                            src={generatedImageUrl}
                            alt="AI Generated"
                            className="max-h-60 rounded-md object-contain"
                          />
                        </div>
                      )}
                    </FormItem>
                  </TabsContent>
                </Tabs>
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  "Generate Post"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedCaption && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
            <CardDescription>
              Your social media post has been generated and is ready to use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Caption</h3>
              <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                {generatedCaption}
              </div>
            </div>

            {(uploadedImage || generatedImageUrl) && (
              <div>
                <h3 className="text-lg font-medium mb-2">Image</h3>
                <div className="bg-muted rounded-md p-4 flex justify-center">
                  <img
                    src={generatedImageUrl || uploadedImage}
                    alt="Post"
                    className="max-h-80 object-contain rounded"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" /> Copy Caption
            </Button>
            {(uploadedImage || generatedImageUrl) && (
              <Button onClick={downloadImage}>
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            )}
            
            {/* Share Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share to Social Media</DialogTitle>
                  <DialogDescription>
                    Choose a platform to share your generated content
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={getPlatformShareUrl("linkedin", generatedCaption, generatedImageUrl || uploadedImage || null)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-md border border-input p-2 hover:bg-accent"
                    >
                      <Button variant="ghost" className="w-full">
                        LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    <a 
                      href={getPlatformShareUrl("facebook", generatedCaption, generatedImageUrl || uploadedImage || null)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-md border border-input p-2 hover:bg-accent"
                    >
                      <Button variant="ghost" className="w-full">
                        Facebook <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    <a 
                      href={getPlatformShareUrl("twitter", generatedCaption, generatedImageUrl || uploadedImage || null)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-md border border-input p-2 hover:bg-accent"
                    >
                      <Button variant="ghost" className="w-full">
                        X (Twitter) <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: Image sharing capabilities may vary by platform. Some platforms may only allow text or URL sharing.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={resetGenerator}>
              <RefreshCw className="mr-2 h-4 w-4" /> Start Over
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaPostGenerator;