import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiteBranding, defaultSiteBranding } from "@shared/site_branding";
import { getSiteBranding, saveSiteBranding } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Loader2, Globe, Type, Palette } from "lucide-react";
import { useNavigationLock } from "@/hooks/use-navigation-lock";

// Schema for the form validation
const siteBrandingSchema = z.object({
  logo: z.object({
    imageUrl: z.string().nullable(),
    altText: z.string().min(3, "Alt text must be at least 3 characters"),
    text: z.string().min(2, "Logo text must be at least 2 characters"),
  }),
  favicon: z.object({
    url: z.string().nullable(),
  }),
  meta: z.object({
    siteTitle: z.string().min(2, "Site title must be at least 2 characters"),
    titleSeparator: z.string(),
    defaultDescription: z.string().min(10, "Description should be at least 10 characters"),
    socialImage: z.string().nullable(),
  }),
  colors: z.object({
    primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
    secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  }),
});

export default function SiteBrandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("logo");
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<SiteBranding>({
    resolver: zodResolver(siteBrandingSchema),
    defaultValues: defaultSiteBranding,
  });
  
  // Check for unsaved changes
  const isDirty = form.formState.isDirty;
  useNavigationLock(isDirty);
  
  // Load existing branding settings
  useEffect(() => {
    const loadBranding = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteBranding();
        if (data) {
          // Reset form with loaded data
          form.reset(data);
        }
      } catch (error) {
        console.error('Error loading site branding:', error);
        toast({
          title: "Error",
          description: "Failed to load site branding settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBranding();
  }, [form, toast]);
  
  const onSubmit = async (data: SiteBranding) => {
    setIsSubmitting(true);
    try {
      await saveSiteBranding(data);
      
      toast({
        title: "Success",
        description: "Site branding settings have been updated",
        variant: "success",
      });
      
      // Mark form as no longer dirty after successful save
      form.reset(data);
    } catch (error) {
      console.error('Error saving site branding:', error);
      toast({
        title: "Error",
        description: "Failed to save site branding settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    form.reset();
    toast({
      title: "Reset",
      description: "Form has been reset to the previously saved values",
      variant: "default",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Site Branding</h1>
        <p className="text-muted-foreground mt-2">
          Customize your site's logo, favicon, and metadata to reinforce your brand identity.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="logo" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="logo" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Logo & Favicon
              </TabsTrigger>
              <TabsTrigger value="meta" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Metadata
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
            </TabsList>
            
            {/* Logo & Favicon Tab */}
            <TabsContent value="logo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo Settings</CardTitle>
                  <CardDescription>
                    Configure your site's primary logo that appears in the navigation and other key areas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="logo.imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/logo.png" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of your logo image. Leave empty to use text logo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="logo.altText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo Alt Text</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Company Name Logo" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Alternative text for accessibility and SEO.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="logo.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text Logo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Company Name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Used when no logo image is provided. For multi-word logos, the last word will be highlighted.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Favicon</CardTitle>
                  <CardDescription>
                    The small icon displayed in browser tabs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="favicon.url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/favicon.ico" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL for your favicon (ICO, PNG, or SVG formats recommended).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Metadata Tab */}
            <TabsContent value="meta" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Metadata</CardTitle>
                  <CardDescription>
                    Configure global metadata used across your site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta.siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Company Name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The default title used across your site.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="meta.titleSeparator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Separator</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder=" | " 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Character(s) used to separate page titles from site name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="meta.defaultDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Description</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="A brief description of your site" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Default meta description used when page-specific description is not available.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="meta.socialImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Social Image</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/social-image.jpg" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Default image used for social media sharing cards when no page-specific image is available.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>
                    Set your primary brand colors used throughout the site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="colors.primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: field.value }}
                          />
                          <FormControl>
                            <Input 
                              placeholder="#0e2d52" 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Main brand color (hex format). Used for navigation, buttons, and accents.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="colors.secondary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: field.value }}
                          />
                          <FormControl>
                            <Input 
                              placeholder="#f47e3e" 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Secondary brand color (hex format). Used for highlights, calls to action, and accents.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your brand colors will look in different UI elements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Text Colors</h4>
                    <div className="flex flex-col gap-2">
                      <div 
                        className="font-bold text-xl"
                        style={{ color: form.watch("colors.primary") }}
                      >
                        Primary Text Color
                      </div>
                      <div 
                        className="font-bold text-xl"
                        style={{ color: form.watch("colors.secondary") }}
                      >
                        Secondary Text Color
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Buttons</h4>
                    <div className="flex flex-wrap gap-4">
                      <button
                        className="px-4 py-2 rounded font-medium text-white"
                        style={{ backgroundColor: form.watch("colors.primary") }}
                      >
                        Primary Button
                      </button>
                      
                      <button
                        className="px-4 py-2 rounded font-medium text-white"
                        style={{ backgroundColor: form.watch("colors.secondary") }}
                      >
                        Secondary Button
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex items-center justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isSubmitting || !isDirty}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}