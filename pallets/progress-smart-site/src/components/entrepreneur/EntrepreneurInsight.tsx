import React from 'react';
import { LightbulbIcon, TrendingUp } from 'lucide-react';

interface EntrepreneurInsightProps {
  insights: string[];
}

export const EntrepreneurInsight: React.FC<EntrepreneurInsightProps> = ({ insights }) => {
  return (
    <div className="space-y-4">
      {insights.length > 0 ? (
        insights.map((insight, index) => (
          <div key={index} className="flex gap-3">
            {index % 2 === 0 ? (
              <LightbulbIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            ) : (
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{insight}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            Add more journal entries to receive personalized business insights!
          </p>
        </div>
      )}
    </div>
  );
};