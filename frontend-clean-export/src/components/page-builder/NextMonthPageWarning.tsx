import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { AlertTriangle, Copy, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { duplicatePageForCustomization, PageInfo } from '@/lib/page-origin-service';

interface NextMonthPageWarningProps {
  pageInfo: PageInfo;
  onDuplicate?: () => void;
}

/**
 * Warning component displayed when users attempt to edit NextMonth foundation pages
 * Provides option to duplicate the page for customization
 */
const NextMonthPageWarning: React.FC<NextMonthPageWarningProps> = ({ 
  pageInfo,
  onDuplicate 
}) => {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle page duplication for customization
  const handleDuplicate = async () => {
    if (!pageInfo?.id) return;
    
    setIsLoading(true);
    try {
      const newPageId = await duplicatePageForCustomization(pageInfo.id);
      
      // Navigate to the new page
      navigate(`/page-builder/${newPageId}`);
      
      // Call additional callback if provided
      if (onDuplicate) {
        onDuplicate();
      }
    } catch (err) {
      console.error('Failed to duplicate page:', err);
      // Show error toast
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 w-full max-w-2xl mx-auto my-8">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <ShieldAlert className="h-6 w-6 text-amber-500" />
        <CardTitle className="text-amber-700 dark:text-amber-400">
          Protected Foundation Page
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-amber-800 dark:text-amber-300">
            <strong>{pageInfo.title || 'This page'}</strong> is a professionally designed NextMonth foundation page and cannot be edited directly.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-amber-200 dark:border-amber-800/50">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Why can't I edit this page?</span>
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Foundation pages are created by NextMonth's professional design team and are optimized for performance, SEO, and user experience. To maintain design integrity and ensure future updates work correctly, these pages are protected from direct editing.
            </p>
          </div>
        </div>
      </CardContent>
      
      <Separator className="bg-amber-200 dark:bg-amber-800/50" />
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          variant="default" 
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
          onClick={handleDuplicate}
          disabled={isLoading}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate & Customize
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-amber-500 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/20"
          onClick={() => navigate("/page-builder")}
        >
          Return to Pages
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NextMonthPageWarning;