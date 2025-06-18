import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SEOPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    title: string;
    description: string;
    routePath: string;
    canonical: string | null;
    image: string | null;
    indexable: boolean;
  };
}

export function SEOPreview({ isOpen, onClose, config }: SEOPreviewProps) {
  const [activeTab, setActiveTab] = useState("google");
  
  // Format URLs properly
  const siteUrl = window.location.origin;
  const pageUrl = config.canonical || `${siteUrl}${config.routePath}`;
  
  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.hostname}${parsedUrl.pathname}`;
    } catch (error) {
      return url;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>SEO Preview</DialogTitle>
          <DialogDescription>
            See how this page will appear in search results and social media
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
          </TabsList>
          
          {/* Google Search Result Preview */}
          <TabsContent value="google" className="py-4">
            <div className="border rounded-md p-4 bg-white shadow-sm">
              <div className="text-xl text-blue-600 hover:underline cursor-pointer font-medium mb-1 line-clamp-1">
                {config.title}
              </div>
              <div className="text-green-700 text-sm mb-1">
                {formatUrl(pageUrl)}
                {!config.indexable && <span className="ml-2 text-red-500">(No-index)</span>}
              </div>
              <div className="text-gray-600 text-sm line-clamp-2">
                {config.description}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-3">
              <p><strong>Note:</strong> This is an approximation. Actual search results may vary based on device, search terms, and Google's display algorithms.</p>
            </div>
          </TabsContent>
          
          {/* Facebook Preview */}
          <TabsContent value="facebook" className="py-4">
            <div className="border rounded-md overflow-hidden bg-white shadow-sm max-w-md mx-auto">
              {config.image ? (
                <div className="h-52 bg-gray-200 relative">
                  <img 
                    src={config.image} 
                    alt={config.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x315/f3f4f6/a3a3a3?text=Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image provided
                </div>
              )}
              <div className="p-3">
                <div className="text-xs uppercase text-gray-500 mb-1">{formatUrl(siteUrl)}</div>
                <div className="font-bold line-clamp-1">{config.title}</div>
                <div className="text-gray-600 text-sm line-clamp-2 mt-1">{config.description}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-3">
              <p><strong>Note:</strong> Facebook may crop images and display different amounts of text based on where the post appears.</p>
            </div>
          </TabsContent>
          
          {/* Twitter Preview */}
          <TabsContent value="twitter" className="py-4">
            <div className="border rounded-md overflow-hidden bg-white shadow-sm max-w-md mx-auto">
              {config.image ? (
                <div className="h-60 bg-gray-200 relative">
                  <img 
                    src={config.image} 
                    alt={config.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x330/f3f4f6/a3a3a3?text=Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="h-60 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image provided
                </div>
              )}
              <div className="p-3">
                <div className="font-bold line-clamp-1">{config.title}</div>
                <div className="text-gray-600 text-sm line-clamp-2 mt-1">{config.description}</div>
                <div className="text-xs text-gray-500 mt-2">{formatUrl(pageUrl)}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-3">
              <p><strong>Note:</strong> Twitter's card display may vary depending on the Twitter client and device used.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button onClick={onClose}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}