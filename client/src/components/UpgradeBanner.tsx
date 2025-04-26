import { useState, useEffect } from 'react';
import { Bell, ChevronRight, MessageSquare, X } from 'lucide-react';
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
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Show the banner for 14 days after the upgrade
    const upgradeBannerDismissed = localStorage.getItem('blueprint_v1.1.1_banner_dismissed');
    const timestamp = parseInt(upgradeBannerDismissed || '0', 10);
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
    
    if (!upgradeBannerDismissed || (Date.now() - timestamp) < twoWeeksInMs) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('blueprint_v1.1.1_banner_dismissed', Date.now().toString());
    setIsVisible(false);
  };

  const handleExploreUpgrade = () => {
    navigate('/admin/blueprint');
  };

  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-primary/20 bg-primary/5 relative">
      {/* Mobile-friendly dismiss button for small screens */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDismiss}
        className="absolute top-2 right-2 md:hidden bg-primary/10 hover:bg-primary/20 rounded-full p-1 h-8 w-8"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between">
        <div className="flex pr-8 md:pr-0">
          <Bell className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
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
        <div className="flex items-center gap-2 mt-3 md:mt-0 md:ml-4 justify-end">
          <Button variant="outline" size="sm" onClick={handleDismiss} className="hidden md:inline-flex">
            Dismiss
          </Button>
          <Button size="sm" className="flex items-center py-2 px-4" onClick={handleExploreUpgrade}>
            Details
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default UpgradeBanner;