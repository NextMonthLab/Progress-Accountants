import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JournalEntryType } from "@/pages/EntrepreneurSupportPage";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface JournalEntryProps {
  entry: JournalEntryType;
}

const JournalEntry = ({ entry }: JournalEntryProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    toast({
      title: "Journal entry deleted",
      description: "Your journal entry has been permanently deleted.",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit mode",
      description: "Journal editing will be available in the next update.",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "thoughts":
        return "bg-blue-100 text-blue-600";
      case "feelings":
        return "bg-purple-100 text-purple-600";
      case "ideas":
        return "bg-emerald-100 text-emerald-600";
      case "challenges":
        return "bg-amber-100 text-amber-600";
      case "opportunities":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getMoodIcon = (mood: string | null | undefined) => {
    switch (mood) {
      case "positive":
        return "😊";
      case "negative":
        return "😔";
      case "neutral":
        return "😐";
      default:
        return "";
    }
  };

  const formattedDate = formatDistanceToNow(new Date(entry.date), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 items-center">
              <Badge 
                variant="outline" 
                className={cn("capitalize", getCategoryColor(entry.category))}
              >
                {entry.category}
              </Badge>
              {entry.mood && (
                <span className="text-lg" title={entry.mood}>
                  {getMoodIcon(entry.mood)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          
          <div 
            className={cn(
              "text-sm text-gray-700",
              !isExpanded && entry.content.length > 150 && "line-clamp-3"
            )}
          >
            {entry.content}
          </div>
          
          {entry.content.length > 150 && (
            <button 
              className="text-xs text-primary font-medium hover:underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50 border-t flex justify-end space-x-2">
        <Button variant="ghost" size="sm" onClick={handleEdit}>
          <Edit3 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEntry;