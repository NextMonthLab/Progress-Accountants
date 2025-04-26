import { AlertTriangle, CheckCircle2, LightbulbIcon } from "lucide-react";

interface EntrepreneurInsightProps {
  insights: string[];
}

export function EntrepreneurInsight({ insights }: EntrepreneurInsightProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">No insights available yet.</p>
        <p className="text-xs mt-1">Continue using your journal to receive personalized insights.</p>
      </div>
    );
  }

  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes('stress') || 
        insight.toLowerCase().includes('challenge') || 
        insight.toLowerCase().includes('concern')) {
      return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
    } else if (insight.toLowerCase().includes('excellent') || 
               insight.toLowerCase().includes('great') || 
               insight.toLowerCase().includes('positive')) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />;
    } else {
      return <LightbulbIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="mt-0.5">
            {getInsightIcon(insight)}
          </div>
          <p className="text-sm text-gray-700">{insight}</p>
        </div>
      ))}
    </div>
  );
}