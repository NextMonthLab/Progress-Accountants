import { JournalEntryType } from "@/pages/EntrepreneurSupportPage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Edit3, Lightbulb, ThumbsUp, Frown, Smile, Meh, PieChart } from "lucide-react";

interface JournalEntryProps {
  entry: JournalEntryType;
}

const JournalEntry = ({ entry }: JournalEntryProps) => {
  // Helper function to render the appropriate icon based on category
  const getCategoryIcon = () => {
    switch (entry.category) {
      case "thoughts":
        return <Edit3 className="h-4 w-4" />;
      case "feelings":
        return getMoodIcon();
      case "ideas":
        return <Lightbulb className="h-4 w-4" />;
      case "challenges":
        return <PieChart className="h-4 w-4" />;
      case "opportunities":
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return <Edit3 className="h-4 w-4" />;
    }
  };

  // Helper function to render the appropriate icon based on mood
  const getMoodIcon = () => {
    switch (entry.mood) {
      case "positive":
        return <Smile className="h-4 w-4" />;
      case "neutral":
        return <Meh className="h-4 w-4" />;
      case "negative":
        return <Frown className="h-4 w-4" />;
      default:
        return <Meh className="h-4 w-4" />;
    }
  };

  // Helper function to get badge color based on category
  const getCategoryColor = () => {
    switch (entry.category) {
      case "thoughts":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "feelings":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "ideas":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "challenges":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "opportunities":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Helper function to get badge color based on mood
  const getMoodColor = () => {
    switch (entry.mood) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex space-x-2 items-center">
          <Badge variant="outline" className={getCategoryColor()}>
            <span className="flex items-center">
              {getCategoryIcon()}
              <span className="ml-1 capitalize">{entry.category}</span>
            </span>
          </Badge>
          {entry.mood && (
            <Badge variant="outline" className={getMoodColor()}>
              <span className="flex items-center">
                {getMoodIcon()}
                <span className="ml-1 capitalize">{entry.mood}</span>
              </span>
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
      </CardContent>
    </Card>
  );
};

export default JournalEntry;