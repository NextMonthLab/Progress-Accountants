import { useState } from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntrepreneurInsightProps {
  insights: string[];
}

export function EntrepreneurInsight({ insights }: EntrepreneurInsightProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const nextInsight = () => {
    setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
  };

  if (insights.length === 0) {
    return (
      <div className="text-center p-4">
        <Lightbulb className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Start journaling to receive personalized business insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-4 min-h-[100px] flex items-center border">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm">{insights[currentInsightIndex]}</p>
        </div>
      </div>
      
      {insights.length > 1 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={nextInsight} className="text-xs">
            Next Insight
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}