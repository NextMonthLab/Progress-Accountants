import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Star, Award, Medal, Trophy, Download, Share2 } from 'lucide-react';
import { useConciergeJourney } from '@/hooks/use-concierge-journey';
import {
  OnboardingLayout,
  CinematicHero
} from '@/components/onboarding/CinematicOnboarding';

export default function ConciergeCompletePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { getCurrentProgress } = useConciergeJourney();
  
  // Get current journey progress
  const progress = getCurrentProgress();
  
  // Define the earned rewards
  const achievements = [
    {
      title: "Onboarding Expert",
      description: "Completed the premium onboarding journey",
      icon: <Star className="h-6 w-6 text-amber-300" />,
      active: true
    },
    {
      title: "Blueprint Master",
      description: "Understanding advanced template configuration",
      icon: <Award className="h-6 w-6 text-blue-300" />,
      active: true
    },
    {
      title: "Site Specialist",
      description: "Mastered site variant knowledge",
      icon: <Medal className="h-6 w-6 text-emerald-300" />,
      active: progress?.answers?.siteVariants === "completed"
    },
    {
      title: "Advanced User",
      description: "Gained knowledge of premium features",
      icon: <Trophy className="h-6 w-6 text-purple-300" />,
      active: progress?.answers?.advanced === "completed"
    }
  ];
  
  // Count completed achievements
  const completedCount = achievements.filter(a => a.active).length;
  
  return (
    <OnboardingLayout backgroundStyle="gradient">
      <CinematicHero
        title="Congratulations on Completing Your Journey!"
        subtitle="You've mastered the premium onboarding experience and unlocked special features"
        backgroundClass="from-emerald-900 to-blue-900"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            onClick={() => navigate('/admin/dashboard')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Return to Dashboard <Check className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20 bg-white/10 hover:bg-white/20"
            onClick={() => navigate('/concierge/start')}
          >
            View Journey Options
          </Button>
        </div>
      </CinematicHero>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Achievements</h2>
            <p className="text-white/70 mt-1">
              You've earned {completedCount} out of {achievements.length} possible badges
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20">
              <Download className="mr-2 h-4 w-4" /> Download Certificate
            </Button>
            <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, idx) => (
            <Card 
              key={idx} 
              className={`border ${achievement.active 
                ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-white/20' 
                : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                    achievement.active 
                      ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20' 
                      : 'bg-gray-500/10'
                  }`}>
                    {achievement.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{achievement.title}</h3>
                  <p className="text-sm text-white/70">{achievement.description}</p>
                  {achievement.active && (
                    <div className="mt-4 bg-emerald-500/20 text-emerald-300 py-1 px-3 rounded-full text-xs font-medium">
                      UNLOCKED
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mt-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Premium Features Unlocked</h3>
            <ul className="space-y-2">
              {[
                "Full access to site variant cloning capabilities",
                "Increased limits on content creation",
                "Enhanced dashboard customization options",
                "Priority access to new feature releases",
                "Premium support access"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Recommended Next Steps</h3>
            <ul className="space-y-2">
              {[
                "Explore the Blueprint Manager to create your own template",
                "Try the Business Network features to connect with other users",
                "Set up your first site clone with one of the four variants",
                "Customize the dynamic navigation system",
                "Configure the onboarding journey for your own clients"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-white">Journey Complete!</h3>
          <p className="text-white/80 mt-1">
            Your premium features have been activated
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}