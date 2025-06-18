import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/components/ClientDataProvider';
import { ArrowRight, CheckCircle2, BellRing, MessageSquare, CloudUpload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const OnboardingWelcomePage: React.FC = () => {
  const [, navigate] = useLocation();
  const { userId, userName } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard MD breakpoint
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Listen for window resize events
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Determine whether to show the upgrade alert
  useEffect(() => {
    const alertDismissed = localStorage.getItem('blueprint_v1.1.1_onboarding_alert_dismissed');
    setShowUpgradeAlert(!isMobile && !alertDismissed);
  }, [isMobile]);
  
  const dismissUpgradeAlert = () => {
    localStorage.setItem('blueprint_v1.1.1_onboarding_alert_dismissed', 'true');
    setShowUpgradeAlert(false);
  };

  // Check onboarding status
  const { data: onboardingState, isLoading } = useQuery({
    queryKey: [`/api/onboarding/${userId}/homepage_setup`],
    queryFn: async () => {
      const response = await fetch(`/api/onboarding/${userId}/homepage_setup`);
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding state');
      }
      return response.json();
    },
  });

  const beginOnboarding = () => {
    // Navigate to the new website intent page first, before homepage setup
    console.log('Begin Setup button clicked, navigating to /website-intent');
    // Use direct window.location for debugging purposes
    window.location.href = '/website-intent';
  };

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <Card className="w-full shadow-lg border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Progress Accountants!</CardTitle>
          <CardDescription className="text-lg">
            Let's set up your business website together
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4 px-6">
          <div className="space-y-6">
            {/* 
              @component OnboardingUpgradeAlert
              @description Upgrade alert shown during onboarding for Blueprint v1.1.1
              @version 1.0.0
              @since Blueprint v1.1.1
              @module_type announcement
              @context platform upgrade
              @family Companion Console, Cloudinary Upload
              @optional true
              @enabled_by_default true
             */}
            {showUpgradeAlert && (
              <Alert className="border-primary/20 bg-primary/5 mb-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5" />
                    <AlertTitle className="font-semibold flex items-center">
                      Blueprint Upgraded
                      <Badge className="ml-2 bg-primary/20 hover:bg-primary/30 text-primary">v1.1.1</Badge>
                    </AlertTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={dismissUpgradeAlert}
                    className="h-7 w-7 p-0"
                  >
                    ✕
                  </Button>
                </div>
                <AlertDescription className="mt-2">
                  <p className="mb-2">We've just upgraded your Progress Accountants workspace with two exciting new features:</p>
                  <div className="pl-2 border-l-2 border-primary/20 mt-2 space-y-3">
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Companion Console</span> – Your on-demand support buddy with context-aware help. Look for the chat button in the bottom-right corner.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CloudUpload className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Smarter Media Uploads</span> – Upload unlimited images with AI-suggested placement and business attribution.
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-muted/40 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Hello {userName},</h3>
              <p className="text-muted-foreground">
                We're excited to help you set up your customized website that will showcase your 
                services and attract new clients.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Your Onboarding Journey:</h3>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Homepage Setup</h4>
                  <p className="text-muted-foreground">Configure your homepage with your own headline, services, and testimonials.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Foundation Pages</h4>
                  <p className="text-muted-foreground">Set up your About, Services, Team, Contact, and Pricing pages.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Launch Ready</h4>
                  <p className="text-muted-foreground">Review your site and prepare it for launch.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Marketplace</h4>
                  <p className="text-muted-foreground">Discover additional features and modules to enhance your site.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 px-6 py-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            The setup process takes approximately 20-30 minutes.
          </p>
          <Button 
            className="space-x-2" 
            size="lg" 
            onClick={beginOnboarding}
          >
            <span>Begin Setup</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWelcomePage;