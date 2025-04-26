import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { JournalEntryType } from "@/pages/EntrepreneurSupportPage";
import { useToast } from "@/hooks/use-toast";

interface JournalEntryProps {
  entry: JournalEntryType;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ entry }) => {
  const { toast } = useToast();

  const handleDelete = () => {
    toast({
      title: "Feature in development",
      description: "Entry deletion will be available in the next update",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Feature in development",
      description: "Entry editing will be available in the next update",
    });
  };
  
  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'thoughts':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 'feelings':
        return 'bg-purple-100 hover:bg-purple-200 text-purple-800';
      case 'ideas':
        return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'challenges':
        return 'bg-red-100 hover:bg-red-200 text-red-800';
      case 'opportunities':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-800';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };
  
  // Get emoji based on mood
  const getMoodEmoji = (mood: string | null | undefined) => {
    switch (mood) {
      case 'positive':
        return '😊';
      case 'neutral':
        return '😐';
      case 'negative':
        return '😔';
      default:
        return '';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Badge className={getCategoryColor(entry.category)}>
              {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
            </Badge>
            {entry.mood && (
              <span className="ml-2 text-lg" aria-label={`Mood: ${entry.mood}`}>
                {getMoodEmoji(entry.mood)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(entry.date), 'PPP')}
          </span>
        </div>
        
        <div className="whitespace-pre-wrap text-sm">
          {entry.content}
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex justify-end w-full gap-2">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalEntry;