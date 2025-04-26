import { useState, useEffect } from 'react';
import { Bell, ChevronRight, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

/**
 * @module UpgradeBanner
 * @description Persistent banner for admin pages announcing Blueprint v1.1.1 upgrade
 * @version 1.0.0
 * @since Blueprint v1.1.1
 * @module_type announcement
 * @context platform upgrade
 * @family Companion Console, Cloudinary Upload
 * @optional true
 * @enabled_by_default true
 * @persistence 14 days
 */

export const UpgradeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [, navigate] = useLocation();
  
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
  
  useEffect(() => {
    // Show the banner for 14 days after the upgrade
    const upgradeBannerDismissed = localStorage.getItem('blueprint_v1.1.1_banner_dismissed');
    const timestamp = parseInt(upgradeBannerDismissed || '0', 10);
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
    
    // Only show if not on mobile and not previously dismissed (or if within 14 days)
    if ((!upgradeBannerDismissed || (Date.now() - timestamp) < twoWeeksInMs) && !isMobile) {
      setIsVisible(true);
    }
  }, [isMobile]);

  const handleDismiss = () => {
    localStorage.setItem('blueprint_v1.1.1_banner_dismissed', Date.now().toString());
    setIsVisible(false);
  };

  const handleExploreUpgrade = () => {
    navigate('/admin/blueprint');
  };

  // Don't render on mobile or if already closed
  if (isMobile || !isVisible) return null;

  return (
    <Alert className="mb-4 border-primary/20 bg-primary/5">
      <div className="flex items-start justify-between">
        <div className="flex">
          <Bell className="h-4 w-4 mt-1 mr-2" />
          <div>
            <AlertTitle className="mb-1 flex items-center gap-2">
              Blueprint Upgraded
              <Badge className="ml-1 bg-primary/20 hover:bg-primary/30 text-primary">v1.1.1</Badge>
            </AlertTitle>
            <AlertDescription className="text-sm">
              Your workspace now includes the Companion Console 
              <MessageSquare className="inline-block h-3 w-3 mx-1" />
              and enhanced media management. Explore all new features.
            </AlertDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Dismiss
          </Button>
          <Button size="sm" className="flex items-center" onClick={handleExploreUpgrade}>
            Details
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default UpgradeBanner;