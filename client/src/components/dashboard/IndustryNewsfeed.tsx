import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useIndustryNewsfeed } from '@/hooks/use-industry-newsfeed';
import { NewsfeedSource, IndustryCategory, PREDEFINED_FEEDS } from '@shared/newsfeed_types';
import { Newspaper, Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Schema for newsfeed configuration form
const configFormSchema = z.object({
  source: z.enum([NewsfeedSource.RSS, NewsfeedSource.API, NewsfeedSource.CUSTOM]),
  url: z.string().url({ message: "Please enter a valid URL" }),
  customName: z.string().optional(),
  displaySettings: z.object({
    showImages: z.boolean(),
    itemCount: z.number().min(1).max(20),
    refreshInterval: z.number().min(15).max(1440),
    showCategories: z.boolean(),
    showPublishDate: z.boolean()
  })
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

export function IndustryNewsfeed() {
  const { 
    newsItems, 
    newsConfig,
    isLoading, 
    error, 
    refetch,
    updateConfig,
    isUpdating,
    industry
  } = useIndustryNewsfeed();
  
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      source: newsConfig?.source || NewsfeedSource.RSS,
      url: newsConfig?.url || "",
      customName: newsConfig?.customName || "",
      displaySettings: {
        showImages: newsConfig?.displaySettings?.showImages ?? true,
        itemCount: newsConfig?.displaySettings?.itemCount ?? 5,
        refreshInterval: newsConfig?.displaySettings?.refreshInterval ?? 60,
        showCategories: newsConfig?.displaySettings?.showCategories ?? true,
        showPublishDate: newsConfig?.displaySettings?.showPublishDate ?? true
      }
    }
  });
  
  // Update form when config loads
  if (newsConfig && !form.formState.isDirty) {
    form.reset({
      source: newsConfig.source,
      url: newsConfig.url,
      customName: newsConfig.customName || "",
      displaySettings: {
        showImages: newsConfig.displaySettings.showImages,
        itemCount: newsConfig.displaySettings.itemCount,
        refreshInterval: newsConfig.displaySettings.refreshInterval,
        showCategories: newsConfig.displaySettings.showCategories,
        showPublishDate: newsConfig.displaySettings.showPublishDate
      }
    });
  }
  
  // Submit handler for config form
  function onSubmit(values: ConfigFormValues) {
    updateConfig({
      ...values,
      industry: industry
    });
    setConfigDialogOpen(false);
  }
  
  // Reset to predefined feed for current industry
  function resetToPredefined() {
    if (!industry) return;
    
    const predefinedFeed = PREDEFINED_FEEDS[industry];
    if (predefinedFeed) {
      updateConfig(predefinedFeed);
      setConfigDialogOpen(false);
    }
  }
  
  // Handle refresh click
  function handleRefresh() {
    refetch();
  }
  
  return (
    <Card className="col-span-2 h-[450px] overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              {newsConfig?.customName ? 
                newsConfig.customName : 
                `${industry ? industry.charAt(0).toUpperCase() + industry.slice(1) : 'Industry'} News`}
            </CardTitle>
            <CardDescription>
              Latest updates from your industry
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              title="Refresh"
              onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Configure">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configure Newsfeed</DialogTitle>
                  <DialogDescription>
                    Customize your industry newsfeed settings
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={NewsfeedSource.RSS}>RSS Feed</SelectItem>
                              <SelectItem value={NewsfeedSource.API}>API</SelectItem>
                              <SelectItem value={NewsfeedSource.CUSTOM}>Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the type of news source
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feed URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/feed" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the URL for your newsfeed source
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Title (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="My Industry News" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide a custom title for the newsfeed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="displaySettings.itemCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Items: {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={20}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of news items to display
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="displaySettings.refreshInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refresh Interval: {field.value} minutes</FormLabel>
                          <FormControl>
                            <Slider
                              min={15}
                              max={1440}
                              step={15}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription>
                            How often to refresh the feed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Display Options</h3>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="displaySettings.showImages"
                          render={({ field }) => (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="show-images">Show Images</Label>
                              <FormControl>
                                <Switch
                                  id="show-images"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="displaySettings.showCategories"
                          render={({ field }) => (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="show-categories">Show Categories</Label>
                              <FormControl>
                                <Switch
                                  id="show-categories"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="displaySettings.showPublishDate"
                          render={({ field }) => (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="show-date">Show Publish Date</Label>
                              <FormControl>
                                <Switch
                                  id="show-date"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetToPredefined}
                      >
                        Reset to Default
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 h-[390px] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-14 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-destructive">Failed to load news</p>
            <Button variant="outline" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No news items found</p>
            <Button variant="outline" onClick={handleRefresh} className="mt-2">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium hover:text-primary">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    {item.title}
                    <ExternalLink className="h-3 w-3 inline" />
                  </a>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {newsConfig?.displaySettings.showCategories && item.category && (
                    <span>{item.category}</span>
                  )}
                  {newsConfig?.displaySettings.showPublishDate && item.publishDate && (
                    <span>{formatDate(item.publishDate)}</span>
                  )}
                </div>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to format dates
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
}

export default IndustryNewsfeed;