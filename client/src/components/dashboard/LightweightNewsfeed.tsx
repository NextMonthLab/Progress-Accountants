import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, RefreshCw, ExternalLink, AlertTriangle, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Lightweight NewsItem interface
interface LightNewsItem {
  id: string | number;
  title: string;
  excerpt: string;
  link: string;
  publishDate?: string;
}

/**
 * Optimized Industry Newsfeed with reduced complexity
 * This component avoids complex forms and renders a simple list
 */
export function LightweightNewsfeed() {
  // Simulate loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  
  // Mocked news items for testing
  const newsItems: LightNewsItem[] = [
    {
      id: 1,
      title: "Sample News Item 1",
      excerpt: "This is a placeholder for news content. In production, this would be fetched from an RSS feed.",
      link: "https://example.com/news/1",
      publishDate: new Date().toISOString()
    },
    {
      id: 2,
      title: "Sample News Item 2",
      excerpt: "Second placeholder item with different content to demonstrate the list rendering.",
      link: "https://example.com/news/2",
      publishDate: new Date().toISOString()
    }
  ];
  
  // Simplified refresh handler
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API fetch with timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  return (
    <Card className="col-span-2 h-[450px] overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Industry News (Diagnostic Mode)
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
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configure Newsfeed</DialogTitle>
                  <DialogDescription>
                    Newsfeed configuration has been temporarily disabled for diagnostic purposes.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Diagnostic Mode</AlertTitle>
                    <AlertDescription>
                      The newsfeed is running in lightweight diagnostic mode to troubleshoot memory issues.
                      Full functionality will be restored once the issues are resolved.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setConfigDialogOpen(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 h-[390px] overflow-y-auto">
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
              Newsfeed is in diagnostic mode with simulated content.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div key={item.id} className="pb-3 border-b border-border last:border-0">
                <h3 className="font-medium mb-1 line-clamp-2 break-words">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    {item.title}
                    <ExternalLink className="h-3 w-3 inline-block" />
                  </a>
                </h3>
                
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <span>
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                  {item.excerpt}
                </p>
              </div>
            ))}
            
            <div className="pt-2 text-center text-sm text-muted-foreground">
              <p>Showing diagnostic data only</p>
              <p>Full newsfeed functionality is temporarily disabled</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}