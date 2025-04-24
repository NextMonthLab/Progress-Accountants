import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

// Form validation schema
const seoConfigSchema = z.object({
  id: z.number().optional(),
  routePath: z.string().min(1, "Route path is required").startsWith('/', "Route path must start with /"),
  title: z.string().min(1, "Title is required").max(70, "Title should be 70 characters or less"),
  description: z.string().min(1, "Description is required").max(160, "Description should be 160 characters or less"),
  canonical: z.string().url("Must be a valid URL").nullable().optional(),
  image: z.string().url("Must be a valid URL").nullable().optional(),
  indexable: z.boolean().default(true),
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
      changeFrequency: config?.changeFrequency || null,
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
        changeFrequency: config.changeFrequency,
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
      await saveSeoConfig(values);
      onSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save SEO config:', error);
      // Show error
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
                      <FormLabel>Route Path*</FormLabel>
                      <FormControl>
                        <Input placeholder="/about" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL path for this page (e.g., /about, /services/accounting)
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

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString() || 'null'}
                            onValueChange={(value) => {
                              if (value === 'null') {
                                field.onChange(null);
                              } else {
                                field.onChange(parseFloat(value));
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="null">Not specified</SelectItem>
                              <SelectItem value="1.0">1.0 - Highest</SelectItem>
                              <SelectItem value="0.8">0.8 - High</SelectItem>
                              <SelectItem value="0.5">0.5 - Medium</SelectItem>
                              <SelectItem value="0.3">0.3 - Low</SelectItem>
                              <SelectItem value="0.1">0.1 - Lowest</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          The priority of this URL relative to other URLs on your site
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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