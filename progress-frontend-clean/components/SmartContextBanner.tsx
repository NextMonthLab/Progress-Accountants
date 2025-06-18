import React, { useState, useEffect } from 'react';
import { Brain, X, Clock, ChevronDown, ChevronUp, LightbulbIcon, Globe, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';
import AINavigationAssistant from '@/components/AINavigationAssistant';
import NotificationsPanel from '@/components/NotificationsPanel';
// ThemeToggle removed - system uses permanent dark mode

interface SmartContext {
  context: string;
  lastActivity: string;
  suggestions: string[];
}

// This component displays contextual information and suggestions based on the current page
const SmartContextBanner: React.FC = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [smartContext, setSmartContext] = useState<SmartContext | null>(null);
  const [loading, setLoading] = useState(true);
  const { navigationState } = useNavigation();

  // Load contextual information based on current page
  useEffect(() => {
    setLoading(true);

    // In a real implementation, this would call an API endpoint
    // This simulates different contexts based on the current route
    const getContextForRoute = () => {
      if (location.startsWith('/admin/dashboard')) {
        return {
          context: "SmartSite Control Room",
          lastActivity: "2 minutes ago",
          suggestions: [
            "3 new insights ready for review",
            "Content autopilot suggestions available"
          ]
        };
      } else if (location.startsWith('/admin/setup')) {
        return {
          context: "SmartSite Setup Panel",
          lastActivity: "10 minutes ago",
          suggestions: [
            "Complete site configuration",
            "Enable autopilot features"
          ]
        };
      } else if (location.startsWith('/admin/content')) {
        return {
          context: "Content Intelligence",
          lastActivity: "1 hour ago",
          suggestions: [
            "5 content ideas generated",
            "SEO optimization ready"
          ]
        };
      } else if (location.startsWith('/admin/insights')) {
        return {
          context: "Market Intelligence",
          lastActivity: "15 minutes ago",
          suggestions: [
            "New trend analysis available",
            "Competitor insights updated"
          ]
        };
      } else {
        return {
          context: "SmartSite Admin",
          lastActivity: "5 minutes ago",
          suggestions: [
            "System optimization suggestions",
            "Performance insights ready"
          ]
        };
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      setSmartContext(getContextForRoute());
      setLoading(false);
    }, 600);
  }, [location]);

  // Don't show the banner if it's been dismissed, there's no context, or focused mode is enabled
  // Added debug log to verify the focused mode state is working
  console.log("SmartContextBanner: focusedMode =", navigationState.focusedMode);
  if (!isOpen || !smartContext || navigationState.focusedMode) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-100 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Main Context Information */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
            <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex flex-col">
            {loading ? (
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {smartContext.context}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Last activity: {smartContext.lastActivity}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <NotificationsPanel />
          <AINavigationAssistant />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Smart Suggestions - Single Row */}
      {!loading && smartContext.suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <LightbulbIcon className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Suggestions
              </span>
            </div>
            
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {smartContext.suggestions.slice(0, 2).map((suggestion, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartContextBanner;