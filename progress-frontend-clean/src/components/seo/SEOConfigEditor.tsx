import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { saveSeoConfig } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const seoConfigSchema = z.object({
  id: z.number().optional(),
  routePath: z.string().min(1, "Route path is required").startsWith('/', "Route path must start with /"),
  title: z.string().min(1, "Title is required").max(70, "Title should be 70 characters or less"),
  description: z.string().min(1, "Description is required").max(160, "Description should be 160 characters or less"),
  canonical: z.string().url("Must be a valid URL").nullable().optional(),
  image: z.string().url("Must be a valid URL").nullable().optional(),
  indexable: z.boolean().default(true),
  // Priority is now handled by the SEOPriorityManager component
  priority: z.number().nullable().optional(),
  changeFrequency: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).nullable().optional(),
});

type SEOConfigFormValues = z.infer<typeof seoConfigSchema>;

type SEOConfigEditorProps = {
  isOpen: boolean;
  onClose: () => void;
  config?: {
    id: number;
    title: string;
    description: string;
    routePath: string;
    canonical: string | null;
    image: string | null;
    indexable: boolean;
    priority: number | null;
    changeFrequency: string | null;
  } | null;
  onSaved: () => void;
};

export function SEOConfigEditor({ isOpen, onClose, config, onSaved }: SEOConfigEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const { toast } = useToast();
  
  // Fetch available pages for dropdown
  const { data: publicPages = [] } = useQuery({
    queryKey: ['/api/pages/public'],
    enabled: isOpen,
  });

  // Initialize form with default values or existing config
  const form = useForm<SEOConfigFormValues>({
    resolver: zodResolver(seoConfigSchema),
    defaultValues: {
      id: config?.id || undefined,
      routePath: config?.routePath || '',
      title: config?.title || '',
      description: config?.description || '',
      canonical: config?.canonical || null,
      image: config?.image || null,
      indexable: config?.indexable ?? true,
      priority: config?.priority || null,
      changeFrequency: config?.changeFrequency as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | null | undefined,
    },
  });

  // Update form values when config changes
  useEffect(() => {
    if (config) {
      form.reset({
        id: config.id,
        routePath: config.routePath,
        title: config.title,
        description: config.description,
        canonical: config.canonical,
        image: config.image,
        indexable: config.indexable,
        priority: config.priority || null,
        changeFrequency: config.changeFrequency as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | null | undefined,
      });
    } else {
      form.reset({
        id: undefined,
        routePath: '',
        title: '',
        description: '',
        canonical: null,
        image: null,
        indexable: true,
        priority: null,
        changeFrequency: null,
      });
    }
  }, [config, form]);

  // Update preview URL when form values change
  useEffect(() => {
    const previewUrl = form.watch('canonical') || 
      `${window.location.origin}${form.watch('routePath')}`;
    setPreviewUrl(previewUrl);
  }, [form.watch]);

  const onSubmit = async (values: SEOConfigFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure priority is explicitly set to 0.5 if not provided
      const configToSave = {
        ...values,
        priority: 0.5 // Always set a default priority value
      };
      
      await saveSeoConfig(configToSave);
      toast({
        title: "SEO Configuration Saved",
        description: "Your SEO configuration has been successfully saved.",
      });
      onSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save SEO config:', error);
      toast({
        title: "Error Saving SEO Configuration",
        description: "There was a problem saving the SEO configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config ? 'Edit SEO Configuration' : 'Add New SEO Configuration'}</DialogTitle>
          <DialogDescription>
            Configure SEO settings for a specific route on your website
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Form fields */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="routePath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Page*</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            
                            // Auto-populate title based on page selection
                            // Extract page name from path for a default title
                            const pathSegments = value.split('/').filter(Boolean);
                            const pageName = pathSegments.length > 0 
                              ? pathSegments[pathSegments.length - 1] 
                              : 'Home';
                              
                            // Only set title if it's empty or matches a previous path-derived title
                            const currentTitle = form.getValues('title');
                            if (!currentTitle || /^[A-Z][a-z]+ Page$/.test(currentTitle)) {
                              const formattedName = pageName.charAt(0).toUpperCase() + 
                                pageName.slice(1).replace(/-/g, ' ');
                              form.setValue('title', `${formattedName} Page`);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a page" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(publicPages) && publicPages.map((path: string) => (
                              <SelectItem key={path} value={path}>
                                {path === '/' ? 'Home (/)' : path}
                              </SelectItem>
                            ))}
                            <SelectItem value="/custom">Custom Path...</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {field.value === '/custom' && (
                        <div className="mt-2">
                          <Input 
                            placeholder="/custom-page" 
                            value={field.value === '/custom' ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
                      )}
                      <FormDescription>
                        Select an existing page or enter a custom path
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Page Title" {...field} />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/70 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Page description" {...field} rows={3} />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonical"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://progressaccountants.com/about" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormDescription>
                        The canonical URL if different from this page's URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormDescription>
                        Open Graph image URL to display when shared on social media
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column - Advanced settings and preview */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="indexable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Indexable</FormLabel>
                          <FormDescription>
                            Allow search engines to index this page
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Priority field removed - now managed through drag-and-drop interface */}

                  <FormField
                    control={form.control}
                    name="changeFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Change Frequency</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || 'null'}
                            onValueChange={(value) => field.onChange(value === 'null' ? null : value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="null">Not specified</SelectItem>
                              <SelectItem value="always">Always</SelectItem>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          How frequently the page is likely to change
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Search Engine Preview */}
                <div className="mt-6 border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Search Engine Preview</h3>
                  <div className="space-y-2">
                    <div className="text-blue-600 text-base font-medium truncate">
                      {form.watch('title') || 'Page Title'}
                    </div>
                    <div className="text-green-700 text-xs truncate">
                      {previewUrl}
                    </div>
                    <div className="text-gray-600 text-sm line-clamp-2">
                      {form.watch('description') || 'Page description will appear here. Make sure to write a compelling description that entices users to click.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {config ? 'Update' : 'Create'} Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}