import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Onboarding Progress Ring Component
 * 
 * This component shows a subtle progress ring around the user's profile 
 * or in any designated spot to indicate onboarding completion status.
 * 
 * @since v1.1.1
 */
export default function OnboardingProgressRing({ size = 36 }: { size?: number }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Circle properties
  const strokeWidth = size * 0.07; // Adjust stroke width based on size
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Load onboarding progress data
  useEffect(() => {
    const loadOnboardingProgress = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/onboarding/${user.id}`);
        const data = await response.json();
        
        // Example steps
        const steps = ['identity', 'foundation', 'media', 'tool', 'blueprint'];
        const completedSteps = data.data?.filter(
          (step: any) => steps.includes(step.stage) && step.status === 'completed'
        ).length || 0;
        
        const calculatedProgress = Math.round((completedSteps / steps.length) * 100);
        setProgress(calculatedProgress);
        setIsComplete(calculatedProgress === 100);
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOnboardingProgress();
  }, [user]);
  
  const handleNavigateToOnboarding = () => {
    navigate('/admin/onboarding');
  };
  
  if (loading) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full p-0" 
            onClick={handleNavigateToOnboarding}
          >
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={strokeWidth}
              />
              
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.8}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-500 ease-in-out"
              />
              
              {/* Center icon */}
              <foreignObject
                x={(size - (size * 0.6)) / 2}
                y={(size - (size * 0.6)) / 2}
                width={size * 0.6}
                height={size * 0.6}
              >
                <div className="h-full w-full flex items-center justify-center">
                  {isComplete ? (
                    <CheckCircle2 className="h-full w-full text-primary" />
                  ) : (
                    <ArrowRight className="h-full w-full text-primary" />
                  )}
                </div>
              </foreignObject>
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isComplete ? (
            <p>Blueprint Activation Complete!</p>
          ) : (
            <div>
              <p>Blueprint Activation: {progress}%</p>
              <p className="text-xs text-muted-foreground">Click to continue setup</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}