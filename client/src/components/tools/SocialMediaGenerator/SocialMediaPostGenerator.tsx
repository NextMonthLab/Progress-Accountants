import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Download, RefreshCw, Image } from "lucide-react";
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
import { usePermissions } from "@/hooks/use-permissions";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has appropriate permissions
  const canUseGenerator = user && can("use_tools");

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
      let prompt = `Generate a high-quality, engaging social media caption for ${data.platform} about "${data.subject}" for a professional accounting firm. 
      Follow these platform-specific guidelines: ${guide}.
      The caption should reflect the brand voice of a professional but approachable accounting firm.
      Include relevant industry terminology but avoid jargon that might confuse non-experts.`;

      if (data.additionalContext) {
        prompt += ` Additional context: ${data.additionalContext}.`;
      }

      // If we have an image, include vision analysis
      if (imageUrl) {
        prompt += " The caption should reference the accompanying image appropriately.";
        prompt += ` The image is related to ${data.subject} and should be integrated naturally into the caption.`;
      }

      // Call OpenAI API to generate the caption
      const response = await fetch("/api/openai/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 500,
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Universal Social Media Post Generator</CardTitle>
          <CardDescription>
            Create optimized posts for any social media platform
          </CardDescription>
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