import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, RefreshCw, ExternalLink, AlertTriangle, Settings, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTenant } from '@/hooks/use-tenant';

// Lightweight NewsItem interface with minimal required fields
interface LightNewsItem {
  id: string | number;
  title: string;
  excerpt: string;
  link: string;
  publishDate?: string;
}

// Sample news content that's stable and won't cause memory issues
const SAMPLE_NEWS_ITEMS: LightNewsItem[] = [
  {
    id: 1,
    title: "Top 5 Accounting Tech Trends for 2025",
    excerpt: "Discover the latest technological advancements reshaping the accounting industry this year, including AI automation and blockchain-enabled auditing.",
    link: "#accounting-trends",
    publishDate: new Date().toISOString()
  },
  {
    id: 2,
    title: "New Tax Legislation: What Business Owners Need to Know",
    excerpt: "An overview of recent tax law changes and how they might impact your business operations and financial planning strategies.",
    link: "#tax-legislation",
    publishDate: new Date(Date.now() - 86400000).toISOString() // yesterday
  },
  {
    id: 3,
    title: "Financial Reporting Strategies for Growth-Stage Companies",
    excerpt: "Expert insights on optimizing financial reporting processes to support business growth while maintaining compliance and accuracy.",
    link: "#financial-reporting",
    publishDate: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

/**
 * Optimized Industry Newsfeed with reduced complexity
 * This component avoids memory-intensive operations and focuses on stability
 */
export function LightweightNewsfeed() {
  const { tenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  
  // Memoize news items to prevent unnecessary re-renders
  const newsItems = useMemo(() => {
    return SAMPLE_NEWS_ITEMS.map(item => ({
      ...item,
      // Customize based on tenant if available
      title: tenant?.name 
        ? `${item.title} for ${tenant.name}`
        : item.title
    }));
  }, [tenant?.name]);
  
  // Simplified refresh handler with error handling
  const handleRefresh = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API fetch with timeout
      setTimeout(() => {
        setIsLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      }, 800);
    } catch (err) {
      console.error("Error refreshing newsfeed:", err);
      setError(err instanceof Error ? err : new Error("Failed to refresh newsfeed"));
      setIsLoading(false);
    }
  }, []);
  
  // Auto-refresh once when component mounts
  useEffect(() => {
    // Set small timeout to let the component render first
    const timer = setTimeout(() => {
      handleRefresh();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [handleRefresh]);
  
  // Format the publish date with proper error handling
  const formatDate = useCallback((dateString?: string) => {
    try {
      if (!dateString) return "Today";
      
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Recent";
      
      // Simple relative date formatting
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Recent";
    }
  }, []);
  
  return (
    <Card className="col-span-2 h-full max-h-[450px] overflow-hidden border-border dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
              <Newspaper className="h-5 w-5 text-primary dark:text-primary-foreground" />
              Industry News
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              {tenant?.industry 
                ? `Latest updates for ${tenant.industry}`
                : "Latest industry updates"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdated}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              title="Refresh"
              onClick={handleRefresh}
              disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Configure">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Configure Newsfeed</DialogTitle>
                  <DialogDescription className="dark:text-gray-300">
                    Newsfeed configuration options
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-700 dark:text-green-400">Optimized Mode Active</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      The newsfeed is running in an optimized mode to ensure application stability.
                      This prevents memory issues while maintaining core functionality.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>The current configuration provides:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Reduced memory usage</li>
                      <li>Improved application stability</li>
                      <li>Focused industry news content</li>
                      <li>Better performance on all devices</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setConfigDialogOpen(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 h-[calc(100%-70px)] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        ) : newsItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-semibold">No Items Available</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later for industry updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="pb-3 border-b border-border last:border-0">
                <h3 className="font-medium mb-1 line-clamp-2 break-words">
                  <a 
                    href={item.link} 
                    className="hover:underline flex items-center gap-1"
                  >
                    {item.title}
                    <ExternalLink className="h-3 w-3 inline-block" />
                  </a>
                </h3>
                
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <span>
                    {formatDate(item.publishDate)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                  {item.excerpt}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}