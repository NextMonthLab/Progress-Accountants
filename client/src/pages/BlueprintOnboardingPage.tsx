import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import CinematicOnboarding from '@/components/onboarding/CinematicOnboarding';
import { useAuth } from '@/hooks/use-auth';

/**
 * Blueprint Onboarding Page
 * 
 * This page implements the cinematic, gamified onboarding flow for admin users.
 * It's designed to create a premium, strategic experience that feels like a
 * command center activation rather than a simple setup wizard.
 * 
 * @since v1.1.1
 */
export default function BlueprintOnboardingPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  // Handle loading state
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto bg-primary/20 rounded-full"></div>
          <p className="mt-4 text-muted-foreground">Initializing Control Deck...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background h-64 w-full absolute top-0 left-0 z-0"></div>
      
      <div className="relative z-10 pt-12">
        <CinematicOnboarding />
      </div>
    </div>
  );
}