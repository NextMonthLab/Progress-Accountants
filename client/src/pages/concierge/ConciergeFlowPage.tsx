import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Target, Code, PenTool, Users, Rocket, CloudCog } from 'lucide-react';
import { useConciergeJourney } from '@/hooks/use-concierge-journey';
import {
  OnboardingLayout,
  CinematicHero,
  StageCard
} from '@/components/onboarding/CinematicOnboarding';

// Define the journey stages
const JOURNEY_STAGES = [
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Welcome to the NextMonth platform',
    icon: <Target className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <p>
          The NextMonth platform is a comprehensive business operating system designed to help
          professionals manage their online presence, client relationships, and business operations.
        </p>
        <p>
          As you progress through this journey, you'll learn how to leverage the platform's features
          to create a powerful digital presence for your business.
        </p>
      </div>
    )
  },
  {
    id: 'blueprint',
    title: 'Blueprint System',
    description: 'Understanding templates and variants',
    icon: <Code className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <p>
          The Blueprint system is the foundation of the NextMonth platform. It allows administrators
          to create and manage template configurations that can be cloned for different clients.
        </p>
        <p>
          Each blueprint includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Core website structure and design</li>
          <li>Pre-configured tools and modules</li>
          <li>User role permissions and settings</li>
          <li>Feature flag configurations</li>
        </ul>
      </div>
    )
  },
  {
    id: 'branding',
    title: 'Branding Tools',
    description: 'Customizing the look and feel',
    icon: <PenTool className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <p>
          The Branding Tools section allows you to customize the visual identity of your site
          while maintaining the core functionality provided by the blueprint.
        </p>
        <p>
          Key branding elements include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Color schemes and typography</li>
          <li>Logo and favicon uploads</li>
          <li>Header and footer customization</li>
          <li>Custom CSS for advanced styling</li>
        </ul>
      </div>
    )
  },
  {
    id: 'networking',
    title: 'Business Networking',
    description: 'Connecting with other businesses',
    icon: <Users className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <p>
          The Business Networking feature enables professionals to connect, collaborate,
          and share resources with other businesses on the platform.
        </p>
        <p>
          Key networking features include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Business profile discovery</li>
          <li>Follow and connection management</li>
          <li>Content sharing and engagement</li>
          <li>Direct messaging between businesses</li>
          <li>Service and product promotion</li>
        </ul>
      </div>
    )
  },
  {
    id: 'advanced',
    title: 'Advanced Features',
    description: 'Exploring premium capabilities',
    icon: <Rocket className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <p>
          The platform includes several advanced features designed for power users and administrators.
        </p>
        <p>
          Advanced capabilities include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Content Studio with AI-powered generation</li>
          <li>Dynamic Navigation System with feature flags</li>
          <li>Comprehensive analytics and insights</li>
          <li>Multi-dashboard capabilities</li>
          <li>Enhanced SEO optimization tools</li>
        </ul>
      </div>
    )
  },
  {
    id: 'cloning',
    title: 'Site Variants',
    description: 'Creating specialized instances',
    icon: <CloudCog className="h-5 w-5" />,
    content: (
      <div className="space-y-6">
        <p>
          The Site Variants system enables the creation of specialized instances of the platform
          tailored to different user needs and business contexts.
        </p>
        <p>
          Available site variants include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Full Website Builder Version (comprehensive)</li>
          <li>Non-Website Builder Version (tools only)</li>
          <li>Solo Entrepreneur Mode (simplified)</li>
          <li>Team Version (collaboration-focused)</li>
        </ul>
      </div>
    )
  }
];

export default function ConciergeFlowPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { getCurrentProgress, goToNextStage, completeJourney } = useConciergeJourney();
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Initialize stage index based on saved progress
    const progress = getCurrentProgress();
    const stageId = progress.current_stage || 'introduction';
    return Math.max(0, JOURNEY_STAGES.findIndex(s => s.id === stageId));
  });
  
  const currentStage = JOURNEY_STAGES[currentIndex];
  const isFirstStage = currentIndex === 0;
  const isLastStage = currentIndex === JOURNEY_STAGES.length - 1;
  const progress = ((currentIndex + 1) / JOURNEY_STAGES.length) * 100;
  
  // Handle navigation between stages
  const handlePrevious = () => {
    if (!isFirstStage) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      goToNextStage(JOURNEY_STAGES[prevIndex].id);
    }
  };
  
  const handleNext = () => {
    if (!isLastStage) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      goToNextStage(JOURNEY_STAGES[nextIndex].id);
    } else {
      // Complete the journey if we're on the last stage
      completeJourney();
      navigate('/concierge/complete');
    }
  };
  
  return (
    <OnboardingLayout backgroundStyle="gradient">
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => navigate('/concierge/start')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Overview
        </Button>
        
        <div className="text-white/80 flex items-center">
          <span className="mr-2">Stage {currentIndex + 1}/{JOURNEY_STAGES.length}</span>
          <Progress value={progress} className="w-32 bg-white/20" />
        </div>
      </div>
      
      <CinematicHero
        title={currentStage.title}
        subtitle={currentStage.description}
        backgroundClass="from-indigo-900 to-blue-900"
      >
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          <Button 
            variant="default" 
            className={isLastStage ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            onClick={handleNext}
          >
            {isLastStage ? 'Complete Journey' : 'Continue'} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {!isFirstStage && (
            <Button 
              variant="outline" 
              className="border-white/20 bg-white/10 hover:bg-white/20"
              onClick={handlePrevious}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
        </div>
      </CinematicHero>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="md:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 sticky top-4">
            <h3 className="text-lg font-semibold text-white mb-4">Journey Map</h3>
            <div className="space-y-2">
              {JOURNEY_STAGES.map((stage, idx) => (
                <div 
                  key={stage.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    idx === currentIndex 
                      ? 'bg-blue-600/30 text-white' 
                      : idx < currentIndex 
                        ? 'bg-white/10 text-white/80' 
                        : 'text-white/40 hover:text-white/60'
                  }`}
                  onClick={() => {
                    // Allow jumping to completed stages or the current stage
                    if (idx <= currentIndex) {
                      setCurrentIndex(idx);
                      goToNextStage(JOURNEY_STAGES[idx].id);
                    }
                  }}
                >
                  <div className={`mr-3 p-1.5 rounded-md ${
                    idx === currentIndex 
                      ? 'bg-blue-500/30' 
                      : idx < currentIndex 
                        ? 'bg-white/10' 
                        : 'bg-white/5'
                  }`}>
                    {stage.icon}
                  </div>
                  <span className="text-sm font-medium">{stage.title}</span>
                  {idx < currentIndex && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="prose prose-lg prose-invert max-w-none">
              {currentStage.content}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center">
                <div className="text-white/60 text-sm">
                  {currentIndex + 1} of {JOURNEY_STAGES.length} - {Math.round(progress)}% complete
                </div>
                <div className="flex gap-4">
                  {!isFirstStage && (
                    <Button 
                      variant="outline" 
                      className="border-white/20 bg-white/10 hover:bg-white/20"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  <Button 
                    variant="default" 
                    className={isLastStage ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    onClick={handleNext}
                  >
                    {isLastStage ? 'Complete Journey' : 'Continue'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}