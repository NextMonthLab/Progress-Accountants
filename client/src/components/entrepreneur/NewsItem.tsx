import { Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsItemType } from "@/pages/EntrepreneurSupportPage";

interface NewsItemProps {
  item: NewsItemType;
}

const NewsItem = ({ item }: NewsItemProps) => {
  const { toast } = useToast();

  const handleSaveForLater = () => {
    toast({
      title: "Article saved",
      description: "Article has been saved to your reading list.",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row p-4 gap-4">
          {item.imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full sm:w-[100px] h-auto sm:h-[60px] object-cover rounded-md"
              />
            </div>
          )}
          
          <div className="flex-grow space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <div className="flex space-x-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleSaveForLater}
                >
                  <Bookmark className="h-4 w-4" />
                  <span className="sr-only">Save for later</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  asChild
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Read article</span>
                  </a>
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{item.summary}</p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span>{item.source}</span>
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsItem;