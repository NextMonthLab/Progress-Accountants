import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OnboardingProgressRingProps {
  size?: number;
  showTooltip?: boolean;
}

const OnboardingProgressRing: React.FC<OnboardingProgressRingProps> = ({ 
  size = 36,
  showTooltip = true
}) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/onboarding', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const response = await fetch(`/api/onboarding/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding status');
      }
      
      return response.json();
    },
    enabled: !!user?.id,
  });
  
  useEffect(() => {
    if (data?.data) {
      try {
        // Check if data.data is an array
        if (Array.isArray(data.data)) {
          // Calculate progress based on completed stages
          const completedStages = data.data.filter((stage: any) => stage.status === 'completed').length;
          const totalStages = data.data.length || 10; // Default to 10 total stages if none found
          
          // Calculate percentage and round to nearest 5%
          const calculatedProgress = Math.round((completedStages / totalStages) * 100 / 5) * 5;
          
          // Ensure there's always at least 5% progress to show the ring
          setProgress(Math.max(5, calculatedProgress));
        } else if (data.data.stages && Array.isArray(data.data.stages)) {
          // If data.data has a 'stages' property that is an array
          const completedStages = data.data.stages.filter((stage: any) => stage.status === 'completed').length;
          const totalStages = data.data.stages.length || 10;
          
          const calculatedProgress = Math.round((completedStages / totalStages) * 100 / 5) * 5;
          setProgress(Math.max(5, calculatedProgress));
        } else {
          // Fallback to default progress
          console.log("Onboarding data structure not as expected:", data.data);
          setProgress(10); // Default progress
        }
      } catch (error) {
        console.error("Error calculating onboarding progress:", error);
        setProgress(10); // Default progress on error
      }
    }
  }, [data]);
  
  const ringSize = `${size}px`;
  
  const progressRing = (
    <div 
      className="relative flex items-center justify-center bg-white rounded-full"
      style={{ width: ringSize, height: ringSize }}
    >
      <Progress 
        value={progress} 
        className="h-full w-full rounded-full absolute"
      />
      <div 
        className="absolute text-[10px] font-bold text-emerald-700 flex items-center justify-center"
        style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }}
      >
        {progress}%
      </div>
    </div>
  );
  
  if (!showTooltip) {
    return progressRing;
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {progressRing}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white p-3 max-w-xs">
          <div className="space-y-2">
            <h4 className="font-semibold">Onboarding Progress</h4>
            <p className="text-sm text-muted-foreground">
              {progress < 100 
                ? `You're ${progress}% through your onboarding journey!` 
                : "Congratulations! You have completed all onboarding stages."}
            </p>
            {progress < 100 && (
              <p className="text-xs text-emerald-600">
                Continue your onboarding to unlock more powerful platform features.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OnboardingProgressRing;