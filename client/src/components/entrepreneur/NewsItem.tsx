import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewsItemType } from "@/pages/EntrepreneurSupportPage";

interface NewsItemProps {
  item: NewsItemType;
}

const NewsItem = ({ item }: NewsItemProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {item.imageUrl && (
            <div className="hidden sm:block flex-shrink-0">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-[100px] h-[60px] object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex-grow">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-base">{item.title}</h3>
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground mt-1">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
            <p className="text-sm mt-2">{item.summary}</p>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Read More
                  <ExternalLink className="h-3 w-3 ml-1" />
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