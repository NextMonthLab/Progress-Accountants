import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Rocket, CheckCircle2, ArrowRight, Star, BookOpen, Settings, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmblemGallery from './EmblemGallery';

interface OnboardingStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: OnboardingTask[];
  emblemId?: string;
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface CinematicOnboardingProps {
  autoAdvance?: boolean;
  showCompleted?: boolean;
}

const CinematicOnboarding: React.FC<CinematicOnboardingProps> = ({
  autoAdvance = true,
  showCompleted = true
}) => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeStage, setActiveStage] = useState<string>('welcome');
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Define onboarding stages with their respective tasks
  const stages: OnboardingStage[] = [
    {
      id: 'welcome',
      title: 'Welcome to Progress',
      description: 'Let\'s get you started with the platform',
      icon: <Rocket className="h-6 w-6 text-orange-500" />,
      emblemId: 'pioneer',
      tasks: [
        {
          id: 'welcome_task',
          title: 'Start your onboarding journey',
          description: 'Begin the guided tour of the platform',
          completed: false,
          action: () => setActiveStage('navigation'),
          actionLabel: 'Begin Tour'
        }
      ]
    },
    {
      id: 'navigation',
      title: 'Platform Navigation',
      description: 'Learn how to navigate the platform',
      icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
      emblemId: 'navigator',
      tasks: [
        {
          id: 'explore_sidebar',
          title: 'Explore the sidebar',
          description: 'The sidebar contains all the main sections of the platform',
          completed: false
        },
        {
          id: 'pin_favorites',
          title: 'Pin your favorite items',
          description: 'Click the pin icon to add items to your favorites',
          completed: false
        },
        {
          id: 'visit_dashboard',
          title: 'Visit your dashboard',
          description: 'Check out your personalized dashboard',
          completed: false,
          action: () => setLocation('/admin/dashboard'),
          actionLabel: 'Go to Dashboard'
        }
      ]
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Learn to create and manage content',
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      emblemId: 'content_creator',
      tasks: [
        {
          id: 'create_page',
          title: 'Create a new page',
          description: 'Try creating a new page for your website',
          completed: false,
          action: () => setLocation('/admin/page-builder'),
          actionLabel: 'Page Builder'
        },
        {
          id: 'manage_media',
          title: 'Manage your media',
          description: 'Upload and organize your media files',
          completed: false,
          action: () => setLocation('/admin/media-hub'),
          actionLabel: 'Media Hub'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Platform Settings',
      description: 'Configure your platform settings',
      icon: <Settings className="h-6 w-6 text-purple-500" />,
      tasks: [
        {
          id: 'profile_settings',
          title: 'Update your profile',
          description: 'Complete your profile information',
          completed: false,
          action: () => setLocation('/admin/profile'),
          actionLabel: 'Edit Profile'
        },
        {
          id: 'brand_settings',
          title: 'Configure brand settings',
          description: 'Set up your brand colors and logo',
          completed: false,
          action: () => setLocation('/admin/brand-settings'),
          actionLabel: 'Brand Settings'
        }
      ]
    },
    {
      id: 'completion',
      title: 'Onboarding Complete',
      description: 'You\'ve completed the basic onboarding',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      emblemId: 'mastery',
      tasks: [
        {
          id: 'completion_acknowledgement',
          title: 'Acknowledge completion',
          description: 'You\'ve completed the basic onboarding process',
          completed: false,
          action: () => {
            toast({
              title: "Onboarding Complete!",
              description: "You've successfully completed the onboarding. Congratulations!",
              variant: "default",
            });
            setLocation('/admin/dashboard');
          },
          actionLabel: 'Return to Dashboard'
        }
      ]
    }
  ];
  
  // Fetch user's onboarding status
  const { data: onboardingData, isLoading } = useQuery({
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
  
  // Mutation to update onboarding status
  const updateOnboardingMutation = useMutation({
    mutationFn: async ({ stage, status, data }: { stage: string, status: string, data: any }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const response = await fetch('/api/onboarding/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          stage,
          status,
          data
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update onboarding status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding', user?.id] });
    },
  });
  
  // Complete stage mutation
  const completeStagesMutation = useMutation({
    mutationFn: async ({ stage, data }: { stage: string, data: any }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const response = await fetch('/api/onboarding/complete', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          stage,
          data
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete stage');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding', user?.id] });
      
      // Show toast notification on stage completion
      toast({
        title: "Stage Completed!",
        description: "You've completed a stage in your onboarding journey.",
        variant: "default",
      });
      
      // Auto-advance to next stage if enabled
      if (autoAdvance) {
        const currentIndex = stages.findIndex(s => s.id === activeStage);
        if (currentIndex < stages.length - 1) {
          setActiveStage(stages[currentIndex + 1].id);
        }
      }
    },
  });
  
  // Reset onboarding mutation (admin only)
  const resetOnboardingMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch('/api/onboarding/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset onboarding');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding', user?.id] });
      toast({
        title: "Onboarding Reset",
        description: "Onboarding progress has been reset.",
        variant: "default",
      });
    },
  });
  
  // Mark task as completed
  const completeTask = (stageId: string, taskId: string) => {
    // Find the stage and task
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;
    
    const taskIndex = stage.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Update task status
    updateOnboardingMutation.mutate({
      stage: stageId,
      status: 'in_progress',
      data: {
        completedTasks: [taskId]
      }
    });
    
    // Check if all tasks in the stage are completed
    const allTasksCompleted = stage.tasks.every((t, idx) => 
      idx === taskIndex || t.completed
    );
    
    // If all tasks are completed, mark the stage as completed
    if (allTasksCompleted) {
      completeStagesMutation.mutate({
        stage: stageId,
        data: {
          completedAt: new Date().toISOString()
        }
      });
    }
  };
  
  // Process onboarding data to update task completion status
  useEffect(() => {
    if (onboardingData?.data && Array.isArray(onboardingData.data)) {
      // Create a map of completed stages
      const completedStagesMap = onboardingData.data.reduce((acc: any, stage: any) => {
        if (stage.status === 'completed') {
          acc[stage.stage] = true;
        } else if (stage.status === 'in_progress' && stage.data?.completedTasks) {
          acc[`${stage.stage}_tasks`] = stage.data.completedTasks;
        }
        return acc;
      }, {});
      
      // Find the first incomplete stage
      const firstIncompleteStage = stages.find(stage => 
        !completedStagesMap[stage.id]
      );
      
      // Set active stage to the first incomplete stage or keep current if none found
      if (firstIncompleteStage) {
        setActiveStage(firstIncompleteStage.id);
      }
      
      // Calculate overall progress
      const totalStages = stages.length;
      const completedStages = Object.keys(completedStagesMap).filter(key => !key.includes('_tasks')).length;
      const calculatedProgress = Math.round((completedStages / totalStages) * 100);
      setOverallProgress(calculatedProgress);
    }
  }, [onboardingData]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <Rocket className="mr-2 h-5 w-5 text-orange-500" />
            Platform Onboarding
          </CardTitle>
          <CardDescription>
            Complete these tasks to master the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      {/* Stages Tabs */}
      <Tabs defaultValue={activeStage} value={activeStage} onValueChange={setActiveStage} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          {stages.map((stage) => (
            <TabsTrigger 
              key={stage.id} 
              value={stage.id}
              className="relative"
            >
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  {stage.icon}
                  {onboardingData?.data?.some((s: any) => s.stage === stage.id && s.status === 'completed') && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <span className="text-xs">{stage.title.split(' ')[0]}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {stages.map((stage) => {
          // Get stage data from API response
          const stageData = onboardingData?.data?.find((s: any) => s.stage === stage.id);
          const isStageCompleted = stageData?.status === 'completed';
          const completedTasks = stageData?.data?.completedTasks || [];
          
          // Update task completion status
          const tasksWithStatus = stage.tasks.map(task => ({
            ...task,
            completed: isStageCompleted || completedTasks.includes(task.id)
          }));
          
          return (
            <TabsContent key={stage.id} value={stage.id} className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center">
                        {stage.icon}
                        <span className="ml-2">{stage.title}</span>
                      </CardTitle>
                      <CardDescription>{stage.description}</CardDescription>
                    </div>
                    {isStageCompleted && (
                      <div className="flex items-center text-emerald-600 text-sm font-medium">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Completed
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    {tasksWithStatus.map((task) => (
                      <div 
                        key={task.id} 
                        className={`p-4 rounded-lg border ${task.completed 
                          ? 'bg-emerald-50 border-emerald-100' 
                          : 'bg-white border-gray-100'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium flex items-center">
                              {task.completed && <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />}
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-500">{task.description}</p>
                          </div>
                          {!task.completed && task.action && (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                completeTask(stage.id, task.id);
                                if (task.action) task.action();
                              }}
                            >
                              {task.actionLabel || 'Complete'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  {/* Navigation between stages */}
                  <div className="flex space-x-2">
                    {stages.findIndex(s => s.id === stage.id) > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const currentIndex = stages.findIndex(s => s.id === stage.id);
                          if (currentIndex > 0) {
                            setActiveStage(stages[currentIndex - 1].id);
                          }
                        }}
                      >
                        Previous Stage
                      </Button>
                    )}
                    
                    {stages.findIndex(s => s.id === stage.id) < stages.length - 1 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const currentIndex = stages.findIndex(s => s.id === stage.id);
                          if (currentIndex < stages.length - 1) {
                            setActiveStage(stages[currentIndex + 1].id);
                          }
                        }}
                      >
                        Next Stage <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Stage completion button */}
                  {!isStageCompleted && tasksWithStatus.every(task => task.completed) && (
                    <Button
                      onClick={() => {
                        completeStagesMutation.mutate({
                          stage: stage.id,
                          data: {
                            completedAt: new Date().toISOString()
                          }
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Complete Stage <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Show emblems only for the completion stage */}
              {stage.id === 'completion' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Earned Emblems</CardTitle>
                    <CardDescription>
                      Emblems you've unlocked through your journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmblemGallery layout="carousel" showLocked={false} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
      
      {/* Admin controls for resetting onboarding */}
      {user && (user.userType === 'admin' || user.userType === 'super_admin') && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500">Admin Controls</h3>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset onboarding progress? This cannot be undone.')) {
                  resetOnboardingMutation.mutate(user.id);
                }
              }}
            >
              Reset Onboarding
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinematicOnboarding;