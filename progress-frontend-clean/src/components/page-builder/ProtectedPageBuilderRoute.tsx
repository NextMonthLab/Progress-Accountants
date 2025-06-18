import React, { useState, useEffect } from 'react';
import { Redirect, useLocation, useParams } from 'wouter';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkPageOrigin, PageInfo, hasOverridePermission } from '@/lib/page-origin-service';

interface ProtectedPageBuilderRouteProps {
  children: React.ReactNode;
}

/**
 * Component to protect page builder routes based on page origin
 * Checks if pages are created by NextMonth and prevents direct editing
 */
const ProtectedPageBuilderRoute: React.FC<ProtectedPageBuilderRouteProps> = ({ children }) => {
  const [location, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [hasOverride, setHasOverride] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Special cases that should always be allowed
  const isNewPage = location.includes('/new') || params.id === 'new';
  const isTemplateGallery = location.includes('/templates');
  const isPageListView = location === '/page-builder';
  
  // If this is a special route or not a specific page, don't need to check
  const skipProtectionCheck = isNewPage || isTemplateGallery || isPageListView;
  
  useEffect(() => {
    const checkAccess = async () => {
      if (skipProtectionCheck) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get page ID from URL
        const pageIdOrPath = params.id || location.replace('/page-builder/', '');
        
        // Check if current user has override permissions
        const override = await hasOverridePermission();
        setHasOverride(override);
        
        // Check page origin
        const info = await checkPageOrigin(pageIdOrPath);
        setPageInfo(info);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking page access:', err);
        setError('Failed to verify page access. Please try again.');
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [location, params.id, skipProtectionCheck]);
  
  // Show loading indicator while checking access
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Verifying page access...</span>
      </div>
    );
  }
  
  // Show error if check failed
  if (error) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error Verifying Page Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/page-builder")}
              >
                Back to Pages
              </Button>
              <Button 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If special routes or user has override permission, allow access
  if (skipProtectionCheck || hasOverride) {
    return <>{children}</>;
  }
  
  // Check if page is protected (NextMonth created)
  if (pageInfo?.isProtected) {
    return (
      <div className="p-8">
        <Card className="border-amber-500">
          <CardHeader>
            <CardTitle className="text-amber-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Protected Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This page (<strong>{pageInfo.title || pageInfo.path}</strong>) was professionally designed by NextMonth and cannot be edited directly.
              To request changes, please contact support or create a custom page.
            </p>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/page-builder")}
              >
                Back to Pages
              </Button>
              <Button 
                variant="default"
                onClick={() => navigate("/page-builder/new")}
              >
                Create New Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Allow access to non-protected pages
  return <>{children}</>;
};

export default ProtectedPageBuilderRoute;