import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bookmark } from "lucide-react";
import { NewsItemType } from "@/pages/EntrepreneurSupportPage";
import { useToast } from "@/hooks/use-toast";

interface NewsItemProps {
  item: NewsItemType;
}

const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
  const { toast } = useToast();

  const handleBookmark = () => {
    toast({
      title: "Article bookmarked",
      description: "This article has been saved to your bookmarks",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row p-4">
          {item.imageUrl && (
            <div className="w-full md:w-24 h-24 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.source} • {item.date}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="h-8 w-8"
                title="Bookmark this article"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {item.summary}
            </p>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Read More <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsItem;