import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "./use-toast";

export interface OnboardingJourneyData {
  current_stage: string;
  completed?: boolean;
  answers: Record<string, any>;
}

/**
 * Manages the concierge journey progress in local storage and on the server
 */
export class ConciergeProgressManager {
  private static readonly STORAGE_KEY = 'concierge_journey_progress';

  /**
   * Save progress to localStorage
   */
  static saveProgress(data: OnboardingJourneyData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Get progress from localStorage
   */
  static getProgress(): OnboardingJourneyData | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as OnboardingJourneyData;
    } catch (e) {
      console.error('Failed to parse concierge journey progress', e);
      return null;
    }
  }

  /**
   * Clear progress from localStorage
   */
  static clearProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Mark the journey as complete
   */
  static markComplete(): void {
    const progress = this.getProgress();
    if (progress) {
      progress.completed = true;
      this.saveProgress(progress);
    }
  }

  /**
   * Check if the journey is complete
   */
  static isComplete(): boolean {
    const progress = this.getProgress();
    return Boolean(progress?.completed);
  }
}

/**
 * Hook for managing the concierge journey progress
 */
export function useConciergeJourney() {
  const { toast } = useToast();

  // Query to get onboarding progress from the server
  const { 
    data: serverProgress,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/onboarding/progress'],
    // Set enabled to false to prevent auto-fetch; we'll manually refetch when needed
    enabled: false,
  });

  // Mutation to save progress to the server
  const { mutate: saveToServer } = useMutation({
    mutationFn: async (data: OnboardingJourneyData) => {
      const response = await apiRequest('POST', '/api/onboarding/progress', {
        stage: data.current_stage,
        status: data.completed ? 'completed' : 'in_progress',
        data: data.answers
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the progress query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding/progress'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save progress",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  /**
   * Save progress both locally and to the server
   */
  const saveProgress = (data: OnboardingJourneyData) => {
    ConciergeProgressManager.saveProgress(data);
    saveToServer(data);
  };

  /**
   * Transition to the next stage in the journey
   */
  const goToNextStage = (nextStage: string, currentAnswers?: Record<string, any>) => {
    const currentProgress = ConciergeProgressManager.getProgress() || {
      current_stage: '',
      answers: {}
    };
    
    const updatedProgress: OnboardingJourneyData = {
      current_stage: nextStage,
      answers: {
        ...currentProgress.answers,
        ...currentAnswers
      }
    };
    
    saveProgress(updatedProgress);
    return updatedProgress;
  };

  /**
   * Mark the journey as complete
   */
  const completeJourney = (finalAnswers?: Record<string, any>) => {
    const currentProgress = ConciergeProgressManager.getProgress() || {
      current_stage: 'completed',
      answers: {}
    };
    
    const completedProgress: OnboardingJourneyData = {
      current_stage: 'completed',
      completed: true,
      answers: {
        ...currentProgress.answers,
        ...finalAnswers
      }
    };
    
    saveProgress(completedProgress);
    return completedProgress;
  };

  /**
   * Get current progress, preferring localStorage first then server data
   */
  const getCurrentProgress = (): OnboardingJourneyData => {
    // Try local storage first
    const localProgress = ConciergeProgressManager.getProgress();
    if (localProgress) return localProgress;
    
    // Fall back to server data if available
    if (serverProgress) {
      const serverData: OnboardingJourneyData = {
        current_stage: serverProgress.stage || '',
        completed: serverProgress.status === 'completed',
        answers: serverProgress.data || {}
      };
      // Save to local storage for future use
      ConciergeProgressManager.saveProgress(serverData);
      return serverData;
    }
    
    // Default empty state
    return {
      current_stage: '',
      answers: {}
    };
  };

  /**
   * Start a new journey, clearing any existing progress
   */
  const startNewJourney = () => {
    ConciergeProgressManager.clearProgress();
    const newProgress: OnboardingJourneyData = {
      current_stage: 'introduction',
      answers: {}
    };
    saveProgress(newProgress);
    return newProgress;
  };

  return {
    getCurrentProgress,
    saveProgress,
    goToNextStage,
    completeJourney,
    startNewJourney,
    isLoading,
    error,
    fetchFromServer: refetch
  };
}