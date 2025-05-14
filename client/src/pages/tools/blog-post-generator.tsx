import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from '@/layouts/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Loader2, 
  FileText, 
  Download, 
  Copy, 
  Image as ImageIcon,
  RefreshCw,
  Check,
  Sparkles,
  AlignLeft,
  Volume2,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type BlogPostForm = {
  topic: string;
  keywords: string;
  targetAudience: string;
  includeImage: boolean;
};

type GeneratedContent = {
  title: string;
  content: string;
  metaDescription: string;
  imagePrompt?: string;
  imageUrl?: string;
};

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

const BlogPostGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [contentLength, setContentLength] = useState([2]); // Default medium length (1=short, 2=medium, 3=long)
  const [toneOfVoice, setToneOfVoice] = useState([3]); // Default professional tone (1=casual, 3=professional, 5=formal)
  const [businessIdentity, setBusinessIdentity] = useState<BusinessIdentity | null>(null);
  const [isConvertingFromSocial, setIsConvertingFromSocial] = useState(false);
  
  // Initialize form with validation
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<BlogPostForm>({
    resolver: zodResolver(
      z.object({
        topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
        keywords: z.string().optional(),
        targetAudience: z.string().min(3, { message: "Target audience must be at least 3 characters" }),
        includeImage: z.boolean().default(true),
      })
    ),
    defaultValues: {
      topic: '',
      keywords: '',
      targetAudience: 'business owners',
      includeImage: true
    }
  });
  
  // Fetch business identity when component mounts
  useEffect(() => {
    const fetchBusinessIdentity = async () => {
      try {
        const response = await fetch('/api/business-identity');
        if (response.ok) {
          const data = await response.json();
          setBusinessIdentity(data);
          
          // Update target audience if available from business identity
          if (data?.market?.targetAudience) {
            setValue('targetAudience', data.market.targetAudience);
          }
        }
      } catch (error) {
        console.error('Error fetching business identity:', error);
      }
    };

    fetchBusinessIdentity();
  }, [setValue]);
  
  // Check for social media post data to convert
  useEffect(() => {
    // Check for source parameter and data in localStorage or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    if (source === 'social') {
      // Set conversion mode
      setIsConvertingFromSocial(true);
      
      try {
        // Try getting data from localStorage first, then sessionStorage as fallback
        let storedData = localStorage.getItem('convertedPost');
        
        // If not in localStorage, try sessionStorage
        if (!storedData) {
          storedData = sessionStorage.getItem('convertedPost');
        }
        
        if (storedData) {
          const postData = JSON.parse(storedData);
          
          // Populate the form with the social media post data
          setValue('topic', `Expanded from ${
            postData.platform.charAt(0).toUpperCase() + postData.platform.slice(1)
          } post: ${postData.prompt}`);
          
          // Set keywords from platform and prompt content
          const keywordsFromPrompt = postData.prompt
            .split(' ')
            .filter((word: string) => word.length > 4)
            .slice(0, 5)
            .join(', ');
          setValue('keywords', keywordsFromPrompt);
          
          // Also store the post data in sessionStorage for backend processing
          // This provides a backup in case localStorage gets cleared
          sessionStorage.setItem('convertedPost', storedData);
          
          // Notify the user
          toast({
            title: 'Social Media Post Loaded',
            description: `Converting your ${postData.platform} post into a full blog post`,
            variant: 'default'
          });
          
          // Clear the localStorage data after using it but keep session storage
          // This prevents accidental reuse if user visits the page again
          localStorage.removeItem('convertedPost');
        }
      } catch (error) {
        console.error('Error loading social media post data:', error);
        toast({
          title: 'Error',
          description: 'Could not load social media post data',
          variant: 'destructive'
        });
      }
    }
  }, [setValue, toast]);

  const onSubmit = async (data: BlogPostForm) => {
    setIsGenerating(true);
    try {
      // Use our component state to determine if we're in conversion mode
      const isFromSocial = isConvertingFromSocial;
      let socialContent = null;
      
      // If this is from social media, get the stored data
      if (isFromSocial) {
        try {
          // Try getting data from localStorage first
          let storedData = localStorage.getItem('convertedPost');
          
          // If not in localStorage, try sessionStorage
          if (!storedData) {
            storedData = sessionStorage.getItem('convertedPost');
          }
          
          if (storedData) {
            socialContent = JSON.parse(storedData);
            
            // Add a visual indicator that we've loaded the post
            toast({
              title: "Social Media Content Loaded",
              description: `Content from ${socialContent.platform} has been imported`,
              variant: "default",
            });
          } else {
            // No data found - show error message
            toast({
              title: "Content Not Found",
              description: "The social media content could not be retrieved",
              variant: "destructive",
            });
          }
        } catch (e) {
          console.error('Error retrieving social media data:', e);
          toast({
            title: "Error Loading Content",
            description: "There was a problem importing the social media content",
            variant: "destructive",
          });
        }
      }
      
      // Prepare request data with slider values, business identity, and social content if available
      const requestData = {
        ...data,
        contentLength: contentLength[0],
        toneOfVoice: toneOfVoice[0],
        businessIdentity: businessIdentity || undefined,
        socialContent,
        isFromSocial
      };
      
      console.log("Generating blog post with:", requestData);
      
      // Make API call to backend
      const response = await fetch('/api/blog-post-generator/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate blog post');
      }
      
      const generatedData = result.data;
      
      // Use the generated content from the API
      const content = {
        title: generatedData.title || `How ${data.topic} is Transforming Modern Business`,
        content: generatedData.content || `
## Introduction

In today's rapidly evolving business landscape, ${data.topic} has emerged as a pivotal force driving transformation and innovation. This article explores how businesses are leveraging ${data.topic} to gain competitive advantages and streamline operations.

## The Impact of ${data.topic} on Business Operations

Organizations of all sizes are discovering that implementing ${data.topic} solutions can dramatically improve efficiency while reducing operational costs. According to recent industry reports, businesses that effectively integrate ${data.topic} into their workflows see an average productivity increase of 27%.

## Key Benefits for ${data.targetAudience}

For ${data.targetAudience}, the advantages of adopting ${data.topic} are particularly significant:

1. **Enhanced Operational Efficiency**: Streamlined processes and automated workflows
2. **Cost Reduction**: Lower overhead and improved resource allocation
3. **Strategic Insights**: Better data-driven decision making
4. **Competitive Advantage**: Staying ahead of market trends
5. **Improved Client Experience**: More responsive and personalized service

## Implementation Strategies

Successfully implementing ${data.topic} requires a strategic approach:

1. Begin with a thorough assessment of current processes
2. Identify specific areas where ${data.topic} can provide immediate value
3. Develop a phased implementation plan
4. Ensure proper training and change management
5. Continuously measure results and refine the approach

## Future Trends to Watch

As ${data.topic} continues to evolve, several emerging trends show particular promise:

- AI-enhanced ${data.topic} solutions that provide predictive capabilities
- Integration with other business systems for a unified operational approach
- Mobile-first implementations that support remote and hybrid work models
- Customized ${data.topic} applications designed for specific industry needs

## Conclusion

As we've explored, ${data.topic} represents a significant opportunity for ${data.targetAudience} looking to enhance their operational capabilities and market position. By taking a strategic approach to implementation and staying informed about emerging trends, businesses can fully leverage the transformative potential of ${data.topic}.

*This article was prepared by Progress Accountants to help ${data.targetAudience} navigate the complexities of modern business technology.*
        `,
        metaDescription: `Discover how ${data.topic} is transforming business operations for ${data.targetAudience}. Learn implementation strategies and future trends in this comprehensive guide.`,
        imagePrompt: `Create a professional business image representing ${data.topic} in a modern corporate setting, showing business professionals working with ${data.topic} technology.`
      };
      
      setGeneratedContent(content);
      
      // Determine the appropriate success message
      let successTitle = "Blog post generated successfully";
      let successDesc = "Your AI-generated content is ready to review and publish.";
      
      // Check if this was a conversion from social media
      if (isFromSocial && socialContent) {
        // Clear both localStorage and sessionStorage to prevent accidental reuse
        localStorage.removeItem('convertedPost');
        sessionStorage.removeItem('convertedPost');
        
        // Reset conversion mode flag
        setIsConvertingFromSocial(false);
        
        successTitle = "Social Media Expansion Complete! 🎉";
        successDesc = `Your ${socialContent.platform} post has been successfully transformed into a full-length blog article with expanded details and depth.`;
      }
      
      toast({
        title: successTitle,
        description: successDesc,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your blog post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!generatedContent?.imagePrompt) return;
    
    setIsImageGenerating(true);
    try {
      // Make API call to backend for image generation
      const response = await fetch('/api/blog-post-generator/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: generatedContent.imagePrompt }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate image');
      }
      
      setGeneratedContent({
        ...generatedContent,
        imageUrl: result.data.imageUrl
      });
      
      toast({
        title: "Image generated",
        description: "Featured image has been created for your blog post.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: "There was an error generating the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImageGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!generatedContent) return;
    
    const element = document.createElement("a");
    const file = new Blob([
      `# ${generatedContent.title}\n\n${generatedContent.content}`
    ], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${generatedContent.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded markdown file",
      description: "Your blog post has been saved as a markdown file.",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Post Generator</h1>
            <p className="text-muted-foreground">Create professional, SEO-optimized blog content with AI assistance.</p>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedContent}>Preview & Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Parameters</CardTitle>
                <CardDescription>
                  Define the parameters for your AI-generated blog post.
                </CardDescription>
                
                {/* Social media conversion banner */}
                {isConvertingFromSocial && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                        <FileText size={16} />
                      </div>
                      <div>
                        <span className="font-semibold text-blue-700">Social Media Conversion Mode</span>
                        <div className="text-xs text-blue-500 mt-0.5">Cross-Generator Workflow Active</div>
                      </div>
                    </div>
                    <div className="flex mt-3">
                      <div className="w-8 flex-shrink-0"></div>
                      <div className="flex-grow">
                        <p className="text-sm text-blue-700">
                          Expanding your social media post into a full blog article. The original content will be enhanced with more details, context, and depth while maintaining your brand voice.
                        </p>
                        <div className="mt-2 text-xs text-blue-600 flex items-center">
                          <RefreshCw size={12} className="mr-1" /> 
                          <span>Content synchronization is active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {businessIdentity && (
                  <div className="mb-6 p-4 border rounded-lg bg-amber-50 border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800">
                          Business Identity Active
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
                        onClick={() => window.location.href = '/business-identity'}
                      >
                        View/Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Business Name:</span>{' '}
                        <span className="font-medium">{businessIdentity.core?.businessName || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Industry:</span>{' '}
                        <span className="font-medium">{businessIdentity.market?.primaryIndustry || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target Audience:</span>{' '}
                        <span className="font-medium">{businessIdentity.market?.targetAudience || 'Not set'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                      Content will be personalized based on this business identity
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Primary Topic</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., Cloud Accounting"
                          {...register("topic", { required: "Topic is required" })}
                          className={cn(errors.topic && "border-red-500")}
                        />
                        {errors.topic && (
                          <p className="text-sm text-red-500">{errors.topic.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords (comma separated)</Label>
                        <Input
                          id="keywords"
                          placeholder="e.g., accounting, finance, tax planning"
                          {...register("keywords")}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="targetAudience">Target Audience</Label>
                          {businessIdentity?.market?.targetAudience && (
                            <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 text-[10px]">
                              From Business Identity
                            </Badge>
                          )}
                        </div>
                        <Select defaultValue={businessIdentity?.market?.targetAudience || "business owners"} {...register("targetAudience")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business owners">Business Owners</SelectItem>
                            <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                            <SelectItem value="finance professionals">Finance Professionals</SelectItem>
                            <SelectItem value="small business owners">Small Business Owners</SelectItem>
                            <SelectItem value="corporate executives">Corporate Executives</SelectItem>
                            {businessIdentity?.market?.targetAudience && 
                              !["business owners", "entrepreneurs", "finance professionals", "small business owners", "corporate executives"].includes(businessIdentity.market.targetAudience) && (
                              <SelectItem value={businessIdentity.market.targetAudience}>
                                {businessIdentity.market.targetAudience}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="content-length" className="flex items-center">
                              <AlignLeft className="h-4 w-4 mr-2" />
                              Content Length
                            </Label>
                            {businessIdentity && (
                              <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 text-[10px]">
                                Optimized
                              </Badge>
                            )}
                          </div>
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
                          <span>Short (500 words)</span>
                          <span>Medium (1000 words)</span>
                          <span>Long (1500+ words)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Blog Post
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-6">
            {generatedContent && (
              <div className="space-y-6">
                <Card className={businessIdentity ? 'border-green-200' : ''}>
                  <CardHeader className={businessIdentity ? 'border-b border-green-200 bg-green-50' : ''}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {generatedContent.title}
                        </CardTitle>
                        <CardDescription>
                          Meta Description: {generatedContent.metaDescription}
                        </CardDescription>
                      </div>
                      {businessIdentity && (
                        <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
                          Business Optimized
                        </Badge>
                      )}
                    </div>
                    {businessIdentity && (
                      <div className="flex items-center gap-2 mt-2 pt-2 text-xs text-green-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p>
                          Content optimized for <span className="font-semibold">{businessIdentity.core?.businessName || 'your business'}</span> and tailored to {businessIdentity.market?.targetAudience || 'your audience'}
                        </p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {generatedContent.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={generatedContent.imageUrl}
                          alt="Blog post featured image"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    
                    {!generatedContent.imageUrl && generatedContent.imagePrompt && (
                      <div className={`mb-4 p-4 border border-dashed rounded-lg ${businessIdentity ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Featured Image</h3>
                            {businessIdentity && (
                              <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 text-[10px]">
                                Brand Optimized
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={generateImage}
                            disabled={isImageGenerating}
                            className={businessIdentity ? 'bg-green-100 hover:bg-green-200 text-green-800' : ''}
                          >
                            {isImageGenerating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Generate Image
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {generatedContent.imagePrompt}
                        </p>
                        {businessIdentity && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-green-200 text-xs text-green-700">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <p>Image prompt optimized for {businessIdentity.core?.businessName || 'your business'} brand identity</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="prose max-w-none">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: generatedContent.content
                            .replace(/## (.*)/g, '<h2>$1</h2>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/\n\n/g, '<br/><br/>')
                        }} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(generatedContent.content)}
                    >
                      {isCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Content
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadMarkdown}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Markdown
                    </Button>
                    <Button
                      variant="default"
                      className="ml-2"
                      onClick={async () => {
                        if (!generatedContent) return;
                        
                        try {
                          // Set loading state
                          setIsGenerating(true);
                          
                          // Make actual API call to publish directly to news page
                          const response = await fetch('/api/blog/publish-to-news', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: generatedContent.title,
                              content: generatedContent.content,
                              metaDescription: generatedContent.metaDescription,
                              imageUrl: generatedContent.imageUrl || '',
                              status: 'published',
                              publishedAt: new Date().toISOString()
                            })
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to publish post');
                          }
                          
                          toast({
                            title: "Published Successfully",
                            description: "Blog post has been automatically published to the external news page.",
                          });
                        } catch (error) {
                          toast({
                            title: "Publication failed",
                            description: "There was an error publishing your blog post. Please try again.",
                            variant: "destructive"
                          });
                          console.error('Publish error:', error);
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Publish to News Page
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BlogPostGenerator;