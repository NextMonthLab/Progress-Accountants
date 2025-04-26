import { useState, useEffect } from 'react';
import { AlertCircle, X, MessageSquare, CloudUpload } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'wouter';

/**
 * @module UpgradeAnnouncement
 * @description Main modal announcement for Blueprint v1.1.1 upgrade
 * @version 1.0.0
 * @since Blueprint v1.1.1
 * @module_type announcement
 * @context platform upgrade
 * @family Companion Console, Cloudinary Upload
 * @optional true
 * @enabled_by_default true
 */

export const UpgradeAnnouncement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  
  // Completely disabled for mobile compatibility
  useEffect(() => {
    // Force the announcement to be considered as seen
    localStorage.setItem('blueprint_v1.1.1_announcement_seen', 'true');
    setIsOpen(false);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('blueprint_v1.1.1_announcement_seen', 'true');
    setIsOpen(false);
  };

  const handleExploreBlueprint = () => {
    handleDismiss();
    navigate('/admin/blueprint');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <Card className="w-full max-w-2xl shadow-xl relative">
        {/* Mobile-friendly dismiss button - large, fixed to top-right corner */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDismiss} 
          className="absolute top-2 right-2 z-10 bg-primary/90 text-primary-foreground hover:bg-primary rounded-full shadow-md"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </Button>
        
        <CardHeader className="bg-primary text-primary-foreground pb-4 pr-12">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>Blueprint v1.1.1 Upgrade</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-3">
          <p className="mb-4">
            Hey there! We've just upgraded your NextMonth workspace to Blueprint v1.1.1.
          </p>
          <p className="mb-4">
            This update brings two exciting new features designed to make your experience smoother, smarter, and more supported:
          </p>
          
          <div className="bg-muted rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5" />
              Companion Console – Your On-Demand Support Buddy
            </h3>
            <p className="mb-2">
              You'll now see a floating chat button in the bottom-right corner of every screen.
              It's your always-on Companion:
            </p>
            <ul className="list-disc pl-6 text-sm space-y-1 text-muted-foreground">
              <li>Context-aware help based on where you are</li>
              <li>Quick answers, walkthroughs, and suggestions</li>
              <li>Human escalation if needed</li>
              <li>Everything is logged safely and securely for future improvements</li>
            </ul>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
              <CloudUpload className="h-5 w-5" />
              Smarter Media Uploads with Cloudinary
            </h3>
            <p className="mb-2">
              Upload unlimited images and media files—fast, organized, and credited:
            </p>
            <ul className="list-disc pl-6 text-sm space-y-1 text-muted-foreground">
              <li>Files are now linked to your business account</li>
              <li>Our system suggests where each image might fit best on your site</li>
              <li>You'll see how uploads affect your credit balance, ensuring transparency and control</li>
            </ul>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
          <p className="text-sm text-muted-foreground">
            No action required—you're already upgraded.
          </p>
          <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="px-6 py-2 text-base"
            >
              Got it
            </Button>
            <Button 
              onClick={handleExploreBlueprint}
              className="px-6 py-2 text-base"
            >
              Explore Blueprint
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpgradeAnnouncement;