import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Define the step interface
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  emblems: { id: string; name: string; description: string; }
}

// The steps from the cinematic onboarding document
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'identity',
    title: 'Define Your Identity',
    description: 'Confirm your brand, mission, and tone of voice.',
    emblems: {
      id: 'identity-emblem',
      name: 'Identity Activated',
      description: 'Your business identity has been established'
    }
  },
  {
    id: 'foundation',
    title: 'Launch Your Foundation Pages',
    description: 'Publish your first key screens.',
    emblems: {
      id: 'foundation-emblem',
      name: 'Beacon Deployed',
      description: 'Your core pages are now operational'
    }
  },
  {
    id: 'media',
    title: 'Upload Core Media',
    description: 'Add your first images, logos, or assets.',
    emblems: {
      id: 'media-emblem',
      name: 'Signal Online',
      description: 'Your visual identity is established'
    }
  },
  {
    id: 'tool',
    title: 'Connect Your First Tool',
    description: 'Integrate a marketplace tool into your system.',
    emblems: {
      id: 'tool-emblem',
      name: 'Systems Engaged',
      description: 'You\'ve connected your first extension'
    }
  },
  {
    id: 'blueprint',
    title: 'Complete Your Business Blueprint',
    description: 'Fill out critical business data for future scalability.',
    emblems: {
      id: 'blueprint-emblem',
      name: 'Blueprint Locked',
      description: 'Your business architecture is secured'
    }
  }
];

// Welcome dialog component
export function WelcomeDialog({ 
  open, 
  onOpenChange, 
  onBegin 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onBegin: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <DialogTitle className="text-3xl font-bold tracking-tight text-primary">
            Welcome to the NextMonth Control Deck.
          </DialogTitle>
          <DialogDescription className="mt-4 text-lg leading-relaxed">
            You're about to activate the living blueprint of your business.
            Every step you take strengthens your foundations, expands your reach, and future-proofs your success.
          </DialogDescription>
          <div className="my-6 space-y-2">
            <h4 className="text-xl font-semibold">Your mission:</h4>
            <p className="text-muted-foreground">
              Complete your first sequence. Unlock your system's true power. Build momentum that lasts decades.
            </p>
          </div>
          <DialogFooter>
            <Button 
              size="lg" 
              className="mt-2 space-x-2" 
              onClick={onBegin}
            >
              <span>Begin Setup</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Step Card Component
function StepCard({ 
  step, 
  status, 
  onComplete, 
  isSelected = false 
}: { 
  step: OnboardingStep; 
  status: 'not_started' | 'in_progress' | 'completed'; 
  onComplete: () => void;
  isSelected?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className={`mb-4 transition-all duration-300 ${isSelected ? 'border-primary shadow-lg' : 'border-muted shadow'}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{step.title}</CardTitle>
            <StatusBadge status={status} />
          </div>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'completed' && (
            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{step.emblems.name}</p>
                <p className="text-sm text-muted-foreground">{step.emblems.description}</p>
              </div>
            </div>
          )}
          {status === 'in_progress' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Currently working on this step. Complete the tasks to unlock the {step.emblems.name} emblem.
              </p>
              {isSelected && (
                <Button onClick={onComplete} className="mt-2">
                  Mark as Complete
                </Button>
              )}
            </div>
          )}
          {status === 'not_started' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Complete this step to unlock the {step.emblems.name} emblem.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: 'not_started' | 'in_progress' | 'completed' }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="default" className="bg-green-600">
          Completed
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="outline" className="border-primary text-primary">
          In Progress
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-muted text-muted-foreground">
          Not Started
        </Badge>
      );
  }
}

// Completion Dialog Component
export function CompletionDialog({ 
  open, 
  onOpenChange, 
  onEnterCommandCenter 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onEnterCommandCenter: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-bold tracking-tight text-primary">
            Congratulations, Architect.
          </DialogTitle>
          <DialogDescription className="mt-4 text-lg leading-relaxed">
            Your system core is now fully operational.
            Your foundations are secure. Your future is live.
            <div className="mt-2">From here, everything builds.</div>
          </DialogDescription>
          <DialogFooter className="mt-8 flex justify-center">
            <Button 
              size="lg" 
              className="space-x-2" 
              onClick={onEnterCommandCenter}
            >
              <span>Enter Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Main Onboarding Component
export default function CinematicOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{[key: string]: {status: 'not_started' | 'in_progress' | 'completed'}}>({});
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  
  // Calculated progress as percentage
  const completedSteps = Object.values(onboardingData).filter(step => step.status === 'completed').length;
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const allCompleted = completedSteps === totalSteps;
  
  // Show welcome dialog for new users
  useEffect(() => {
    if (user && !loading && Object.keys(onboardingData).length === 0) {
      setWelcomeOpen(true);
    }
  }, [user, loading, onboardingData]);
  
  // Show completion dialog when all steps are completed
  useEffect(() => {
    if (allCompleted && !loading) {
      setCompletionOpen(true);
    }
  }, [allCompleted, loading]);
  
  // Load onboarding data
  useEffect(() => {
    const loadOnboardingData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/onboarding/${user.id}`);
        const data = await response.json();
        
        // Initialize onboarding data
        const initialData: {[key: string]: {status: 'not_started' | 'in_progress' | 'completed'}} = {};
        ONBOARDING_STEPS.forEach(step => {
          const existingStep = data.data?.find((s: any) => s.stage === step.id);
          initialData[step.id] = { 
            status: existingStep ? existingStep.status : 'not_started' 
          };
        });
        
        setOnboardingData(initialData);
        
        // Find first incomplete step to select
        const firstIncompleteStep = ONBOARDING_STEPS.find(
          step => initialData[step.id].status !== 'completed'
        );
        
        if (firstIncompleteStep) {
          setSelectedStepId(firstIncompleteStep.id);
          // Mark it as in progress if it's not already
          if (initialData[firstIncompleteStep.id].status === 'not_started') {
            updateStepStatus(firstIncompleteStep.id, 'in_progress');
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load onboarding progress. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadOnboardingData();
  }, [user, toast]);
  
  // Update step status
  const updateStepStatus = async (stepId: string, status: 'not_started' | 'in_progress' | 'completed') => {
    if (!user) return;
    
    try {
      setOnboardingData(prev => ({
        ...prev,
        [stepId]: { status }
      }));
      
      // Update in the backend
      let endpoint;
      if (status === 'completed') {
        endpoint = '/api/onboarding/complete';
      } else {
        endpoint = '/api/onboarding/status';
      }
      
      await apiRequest('PATCH', endpoint, {
        userId: user.id,
        stage: stepId,
        status,
        data: {} // Any step-specific data
      });
      
      // If completing current step, select next incomplete step
      if (status === 'completed' && stepId === selectedStepId) {
        const nextIncompleteStep = ONBOARDING_STEPS.find(
          step => step.id !== stepId && onboardingData[step.id]?.status !== 'completed'
        );
        
        if (nextIncompleteStep) {
          setSelectedStepId(nextIncompleteStep.id);
          if (onboardingData[nextIncompleteStep.id]?.status === 'not_started') {
            updateStepStatus(nextIncompleteStep.id, 'in_progress');
          }
        }
      }
    } catch (error) {
      console.error('Error updating step status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update step status. Please try again.',
        variant: 'destructive',
      });
      
      // Revert the status change
      setOnboardingData(prev => ({
        ...prev,
        [stepId]: { status: prev[stepId]?.status || 'not_started' }
      }));
    }
  };
  
  // Start the onboarding process
  const handleBeginOnboarding = () => {
    setWelcomeOpen(false);
    
    // Initialize the first step
    if (selectedStepId) {
      updateStepStatus(selectedStepId, 'in_progress');
    }
  };
  
  // Complete the current step
  const handleCompleteStep = (stepId: string) => {
    updateStepStatus(stepId, 'completed');
  };
  
  // Enter command center (complete onboarding)
  const handleEnterCommandCenter = () => {
    setCompletionOpen(false);
    window.location.href = '/admin/dashboard';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading your command deck...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Welcome Modal */}
      <WelcomeDialog
        open={welcomeOpen}
        onOpenChange={setWelcomeOpen}
        onBegin={handleBeginOnboarding}
      />
      
      {/* Completion Modal */}
      <CompletionDialog
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        onEnterCommandCenter={handleEnterCommandCenter}
      />
      
      {/* Header with Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Control Deck Setup</h1>
        <p className="text-muted-foreground mb-4">
          Complete your activation sequence to unlock your system's full potential.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Initialization Progress</span>
            <span>{completedSteps}/{totalSteps} Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
      
      {/* Cinematic Vertical Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Steps List */}
        <div className="md:col-span-2">
          <AnimatePresence>
            {ONBOARDING_STEPS.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                status={onboardingData[step.id]?.status || 'not_started'}
                onComplete={() => handleCompleteStep(step.id)}
                isSelected={selectedStepId === step.id}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Emblems Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Emblems</CardTitle>
              <CardDescription>
                Track your progress through the system activation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ONBOARDING_STEPS.map((step) => (
                  <div 
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 ${
                      onboardingData[step.id]?.status === 'completed' 
                        ? 'bg-primary/10' 
                        : 'bg-muted/20 opacity-60'
                    }`}
                  >
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        onboardingData[step.id]?.status === 'completed'
                          ? 'bg-primary/20'
                          : 'bg-muted'
                      }`}
                    >
                      {onboardingData[step.id]?.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <span className="h-5 w-5 rounded-full bg-muted-foreground/20" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${onboardingData[step.id]?.status !== 'completed' && 'text-muted-foreground'}`}>
                        {step.emblems.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <div className="text-center text-sm text-muted-foreground">
                {completedSteps === 0 ? (
                  <span>Complete steps to unlock emblems</span>
                ) : completedSteps === totalSteps ? (
                  <span className="text-primary font-medium">All emblems unlocked!</span>
                ) : (
                  <span>{completedSteps} of {totalSteps} emblems unlocked</span>
                )}
              </div>
            </CardFooter>
          </Card>
          
          {/* Silent Mode Option */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Interface Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Silent Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Disable visual effects and animations
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}