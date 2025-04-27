import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Rocket, Sparkles, Award } from 'lucide-react';
import { OnboardingLayout, CinematicHero, StageCard, OnboardingProgress } from '@/components/onboarding/CinematicOnboarding';
import EmblemGallery from '@/components/onboarding/EmblemGallery';

const BlueprintOnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // If not logged in, redirect to auth page
  if (!user) {
    setLocation('/auth');
    return null;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Your guided journey to mastering the Progress platform
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setLocation('/admin/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
      
      <Tabs defaultValue="journey" className="space-y-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-8">
          <TabsTrigger value="journey" className="px-8">
            <Rocket className="w-4 h-4 mr-2" />
            Guided Journey
          </TabsTrigger>
          <TabsTrigger value="emblems" className="px-8">
            <Award className="w-4 h-4 mr-2" />
            Emblems Gallery
          </TabsTrigger>
          <TabsTrigger value="achievements" className="px-8">
            <Star className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="journey" className="space-y-4">
          <OnboardingLayout backgroundStyle="gradient">
            <CinematicHero
              title="Welcome to Your Guided Journey"
              subtitle="Learn how to get the most out of the Progress platform"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="default">Start Now</Button>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20">View Guide</Button>
              </div>
            </CinematicHero>
            
            <div className="space-y-4 py-4">
              <OnboardingProgress 
                stages={['intro', 'basics', 'content', 'design', 'launch']}
                currentStage="content"
                completedStages={['intro', 'basics']}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StageCard
                  title="Platform Introduction"
                  description="Learn about the core concepts of Progress"
                  completed={true}
                />
                <StageCard
                  title="Getting Started"
                  description="Set up your account and workspace"
                  completed={true}
                />
                <StageCard
                  title="Content Creation"
                  description="Learn to build and manage your site content"
                  active={true}
                />
                <StageCard
                  title="Design & Branding"
                  description="Customize the look and feel of your site"
                  disabled={true}
                />
                <StageCard
                  title="Launch & Optimize"
                  description="Prepare your site for visitors"
                  disabled={true}
                />
              </div>
            </div>
          </OnboardingLayout>
        </TabsContent>
        
        <TabsContent value="emblems" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-orange-500" />
                Progress Platform Emblems
              </CardTitle>
              <CardDescription>
                Collect emblems as you explore and master different aspects of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <EmblemGallery layout="grid" showLocked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                Platform Achievements
              </CardTitle>
              <CardDescription>
                Track your progress and unlock special features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Platform Explorer',
                      description: 'Visit every main section of the platform',
                      icon: <Sparkles className="h-10 w-10 text-emerald-500" />,
                      progress: 60,
                    },
                    {
                      title: 'Content Creator',
                      description: 'Create your first 5 content pieces',
                      icon: <Rocket className="h-10 w-10 text-blue-500" />,
                      progress: 40,
                    },
                    {
                      title: 'Master Builder',
                      description: 'Build and publish a complete site',
                      icon: <Star className="h-10 w-10 text-amber-500" />,
                      progress: 20,
                    }
                  ].map((achievement, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            {achievement.icon}
                          </div>
                          <div className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                            {achievement.progress}%
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="h-2 bg-gray-100">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    More achievements will be unlocked as you progress through the platform. 
                    Complete the guided journey to unlock additional achievements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlueprintOnboardingPage;