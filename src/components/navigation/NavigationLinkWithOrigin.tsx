import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Circle, Lock, AlertTriangle } from 'lucide-react';
import { NavigationLink } from '@/types/navigation';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { checkPageOrigin, PageInfo } from '@/lib/page-origin-service';

interface NavigationLinkWithOriginProps {
  item: NavigationLink;
  isNested?: boolean;
  onMobileClick?: () => void;
  collapsed?: boolean;
}

/**
 * Enhanced navigation link component that checks page origin before allowing navigation
 * Prevents direct access to NextMonth foundation pages
 */
const NavigationLinkWithOrigin: React.FC<NavigationLinkWithOriginProps> = ({
  item,
  isNested = false,
  onMobileClick,
  collapsed = false
}) => {
  const [location] = useLocation();
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if the current route is active
  const isActive = location === item.href || location.startsWith(item.href + '/');
  
  // Extract page ID or path from href to check if it's a page builder link
  useEffect(() => {
    // Only check for page-builder links that aren't creating a new page
    if (item.href?.startsWith('/page-builder/') && 
        !item.href.endsWith('/new') && 
        !item.href.includes('/templates')) {
      
      const pageIdOrPath = item.href.replace('/page-builder/', '');
      setIsLoading(true);
      
      checkPageOrigin(pageIdOrPath)
        .then(info => {
          setPageInfo(info);
        })
        .catch(err => {
          console.error('Failed to check page origin:', err);
          // Mock protected page on error to prevent accidental navigation
          setPageInfo({
            id: parseInt(pageIdOrPath) || 0,
            path: pageIdOrPath,
            title: item.title,
            isProtected: true,
            origin: null,
            createdBy: null,
            pageType: null
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [item.href, item.title]);
  
  // Get the Lucide icon dynamically
  const IconComponent = (LucideIcons as any)[item.icon] || Circle;
  
  // If this is a protected NextMonth page, show warning
  if (pageInfo?.isProtected) {
    return (
      <div className="group" key={item.id}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 cursor-not-allowed",
                  "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700",
                  isNested && "ml-6 text-sm"
                )}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-amber-500">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <span>{item.title}</span>
                </div>
                <Lock className="h-3.5 w-3.5 text-amber-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="text-xs">
                <p className="font-medium">Protected NextMonth Page</p>
                <p>This foundation page cannot be edited directly. Use the Page Builder to create a custom version instead.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  
  // Regular navigation link for non-protected pages
  return (
    <div className="group" key={item.id}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 no-underline nav-item",
          isActive
            ? "active font-medium dark:text-white" 
            : "text-[var(--text-headline)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
          isNested && "ml-6 text-sm",
          isLoading && "opacity-50 cursor-wait"
        )}
        onClick={(e) => {
          // If on mobile, close the sidebar after clicking
          if (onMobileClick) {
            onMobileClick();
          }
        }}
      >
        <div className="flex items-center">
          <span className="mr-3">
            <IconComponent className="h-5 w-5" />
          </span>
          {!collapsed && <span>{item.title}</span>}
        </div>
      </Link>
    </div>
  );
};

export default NavigationLinkWithOrigin;