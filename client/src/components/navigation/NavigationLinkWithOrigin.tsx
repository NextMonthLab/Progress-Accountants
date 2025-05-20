import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Circle, AlertTriangle, Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NavigationLink } from '@/types/navigation';
import { checkPageOrigin, PageInfo } from '@/lib/page-origin-service';

interface NavigationLinkWithOriginProps {
  item: NavigationLink;
  isNested?: boolean;
  onMobileClick?: () => void;
  collapsed?: boolean;
}

/**
 * Enhanced NavigationLink component that checks page origin
 * and conditionally renders or disables links to protected pages
 */
const NavigationLinkWithOrigin: React.FC<NavigationLinkWithOriginProps> = ({
  item,
  isNested = false,
  onMobileClick,
  collapsed = false,
}) => {
  const [, navigate] = useLocation();
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the Lucide icon dynamically
  const IconComponent = (LucideIcons as any)[item.icon] || Circle;
  
  // Determine which pages need origin checking
  const isPageBuilderLink = item.href?.startsWith('/page-builder/') && 
                           !item.href.endsWith('/new') &&
                           !item.href.includes('/templates');
  
  // If this is a link to edit a specific page, check its origin
  useEffect(() => {
    if (isPageBuilderLink) {
      setIsLoading(true);
      
      // Extract page ID or path from href
      const pageIdOrPath = item.href.replace('/page-builder/', '');
      
      checkPageOrigin(pageIdOrPath)
        .then(info => {
          setPageInfo(info);
        })
        .catch(err => {
          console.error('Error checking page origin:', err);
          // Default to treating as protected if we can't verify
          setPageInfo({
            id: 0,
            path: pageIdOrPath,
            title: item.title,
            isProtected: true
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [item.href, isPageBuilderLink]);
  
  // Special handling for "View Website" link to open in a new tab
  const isViewWebsiteLink = item.id === 'view_website';
  const isProtected = pageInfo?.isProtected || false;
  
  // Function to handle click on the link
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // For protected pages, prevent navigation and show a tooltip
    if (isPageBuilderLink && isProtected) {
      e.preventDefault();
      
      // Don't navigate to protected pages
      return;
    }
    
    // If it's a normal navigation link and on mobile, close the sidebar
    if (onMobileClick) {
      onMobileClick();
    }
  };
  
  // Don't render anything while we're loading the page info
  if (isPageBuilderLink && isLoading) {
    return null;
  }
  
  // For collapsed view, show tooltip
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={isProtected ? '#' : item.href}
              className={cn(
                "relative flex items-center justify-center rounded-lg p-2 transition-all duration-150 no-underline",
                isProtected 
                  ? "opacity-60 cursor-not-allowed text-gray-400 dark:text-gray-500" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700",
                isNested && "ml-2",
                isViewWebsiteLink && "text-[var(--secondary-text)] dark:text-[#6fcfcf]"
              )}
              target={isViewWebsiteLink ? "_blank" : undefined}
              rel={isViewWebsiteLink ? "noopener noreferrer" : undefined}
              onClick={handleClick}
              aria-disabled={isProtected}
            >
              {isProtected ? (
                <div className="relative">
                  <Lock className="h-5 w-5" />
                </div>
              ) : (
                <IconComponent className="h-5 w-5" />
              )}
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1 max-w-xs">
            <p className="font-medium text-sm">{item.title}</p>
            {isProtected ? (
              <div className="flex items-start gap-1 mt-1 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs">
                  This page was professionally designed by NextMonth and cannot be edited directly.
                </span>
              </div>
            ) : (
              item.description && <p className="text-xs text-gray-500">{item.description}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Normal expanded view
  return (
    <div className="group" key={item.id}>
      <a
        href={isProtected ? '#' : item.href}
        className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 no-underline nav-item",
          isProtected
            ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            : "text-[var(--text-headline)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
          isNested && "ml-6 text-sm",
          isViewWebsiteLink && "text-[var(--secondary-text)] dark:text-[#6fcfcf] bg-[var(--secondary-bg)] dark:bg-[#1e3a3a] hover:bg-[var(--secondary-hover)] dark:hover:bg-[#23474a]"
        )}
        target={isViewWebsiteLink ? "_blank" : undefined}
        rel={isViewWebsiteLink ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        aria-disabled={isProtected}
      >
        <div className="flex items-center">
          <span className="mr-3">
            {isProtected ? <Lock className="h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
          </span>
          <span>{item.title}</span>
        </div>
        
        {isProtected && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs">
                  This page was professionally designed by NextMonth and cannot be edited directly. 
                  To request changes, please duplicate or contact support.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </a>
    </div>
  );
};

export default NavigationLinkWithOrigin;