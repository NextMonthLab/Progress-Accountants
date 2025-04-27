import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Medal, Rocket } from 'lucide-react';
import { useConciergeJourney, ConciergeProgressManager } from '@/hooks/use-concierge-journey';
import {
  OnboardingLayout,
  CinematicHero
} from '@/components/onboarding/CinematicOnboarding';

/**
 * This is the starting page for the NextMonth Concierge Onboarding Journey
 * A premium, gamified onboarding experience for admin users
 */
export default function ConciergeStartPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { startNewJourney } = useConciergeJourney();
  const [isStarting, setIsStarting] = useState(false);

  // Check if the journey was already completed previously
  const isComplete = ConciergeProgressManager.isComplete();

  // Handle starting the journey
  const handleStart = () => {
    setIsStarting(true);
    startNewJourney();
    setTimeout(() => {
      navigate('/concierge/flow');
    }, 800);
  };

  // Handle resuming a journey in progress
  const handleResume = () => {
    navigate('/concierge/flow');
  };

  return (
    <OnboardingLayout backgroundStyle="gradient">
      <CinematicHero
        title="NextMonth Concierge Onboarding Journey"
        subtitle="Experience the premium onboarding path designed to make you a platform expert"
      >
        <div className="flex space-x-4">
          {isComplete ? (
            <Button 
              onClick={() => navigate('/concierge/complete')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              View Your Completion Status <Medal className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              disabled={isStarting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isStarting ? (
                <>Starting Your Journey...</>
              ) : (
                <>Start Premium Journey <Rocket className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-white/20 bg-white/10 hover:bg-white/20"
            onClick={() => navigate('/admin/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </CinematicHero>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="text-blue-300 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Personalized Path</h3>
            <p className="text-white/70">
              Get a customized learning experience based on your role and existing knowledge that 
              adapts to your needs.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Medal className="text-purple-300 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Unlock Achievements</h3>
            <p className="text-white/70">
              Earn special emblems and rewards as you progress through your journey and master 
              platform features.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Rocket className="text-amber-300 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Advanced Features</h3>
            <p className="text-white/70">
              Gain access to premium tools and capabilities that help you get the most out of
              the NextMonth platform.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 mb-8 flex justify-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 max-w-3xl w-full">
          <h2 className="text-xl font-semibold text-white mb-4">What You'll Learn</h2>
          <ul className="space-y-3">
            {[
              "Platform fundamentals and advanced concepts",
              "Customizing your experience with feature flags",
              "Using tenant-specific branding and design elements",
              "Blueprint extraction and template configuration",
              "Mastering the cloning process for site variants",
              "Business networking functionality",
              "Advanced content creation and SEO optimization"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="text-center text-white/60 text-sm mt-8">
        The NextMonth Concierge Onboarding Journey is available exclusively for admin users.
      </div>
    </OnboardingLayout>
  );
}