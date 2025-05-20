import React, { useState, useEffect } from 'react';
import { Brain, X, Clock, ChevronDown, ChevronUp, LightbulbIcon, Globe, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';
import QuickActions from '@/components/QuickActions';
import NotificationsPanel from '@/components/NotificationsPanel';
import KeyboardShortcutsButton from '@/components/KeyboardShortcutsButton';
import { ThemeToggle } from '@/components/ThemeToggle';

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
          context: "Dashboard Overview",
          lastActivity: "2 minutes ago",
          suggestions: [
            "Review visitor patterns in the analytics section",
            "Update your business hours for the holiday season"
          ]
        };
      } else if (location.startsWith('/admin/pages')) {
        return {
          context: "Page Editor",
          lastActivity: "Yesterday at 3:42 PM",
          suggestions: [
            "Optimize your About page by adding team information",
            "Add seasonal content to increase engagement"
          ]
        };
      } else if (location.startsWith('/admin/social-media')) {
        return {
          context: "Social Media Generator",
          lastActivity: "4 days ago",
          suggestions: [
            "Schedule posts for the upcoming business event",
            "Create a carousel post about your new service offerings"
          ]
        };
      } else {
        return {
          context: "Admin Tools",
          lastActivity: "30 minutes ago",
          suggestions: [
            "Complete your site configuration setup",
            "Add more team members to collaborate on content"
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
    <div className="bg-white shadow-sm border-b border-gray-200 p-2 px-3 sm:px-4 text-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <div className="bg-blue-50 p-1.5 rounded-md">
            <Brain className="h-4 w-4 text-navy" />
          </div>
          <span className="font-medium text-navy ml-2">Smart Context</span>
          {loading ? (
            <div className="ml-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <span className="ml-3 text-gray-700 font-medium">{smartContext.context}</span>
          )}
          
          <div className="hidden sm:flex items-center ml-6 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {loading ? (
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <span>Last activity: {smartContext.lastActivity}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-1 sm:mt-0">
          <div className="flex sm:hidden items-center text-xs text-gray-500 mr-2">
            <Clock className="h-3 w-3 mr-1" />
            {loading ? (
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <span>Last activity: {smartContext.lastActivity}</span>
            )}
          </div>
          
          {/* Quick Actions Dropdown */}
          <div className="mr-2">
            <QuickActions />
          </div>
          
          {/* Notifications Panel */}
          <div className="mr-2">
            <NotificationsPanel />
          </div>
          
          {/* Keyboard Shortcuts Button */}
          <div className="mr-2">
            <KeyboardShortcutsButton />
          </div>
          
          {/* View Website Button */}
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="h-7 px-3 mr-2 inline-flex items-center justify-center rounded-md text-xs font-medium text-white bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] hover:opacity-90 transition-opacity"
          >
            <Globe className="h-3 w-3 mr-1" />
            View Website
          </a>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-gray-600 hover:bg-[#F65C9A]/10 hover:text-[#F65C9A] transition-all"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>
      
      {/* Intelligent Suggestions */}
      {!loading && smartContext.suggestions.length > 0 && (
        <div className="mt-2 pl-2 sm:pl-6 flex flex-col sm:flex-row sm:items-center text-xs">
          <div className="flex items-center">
            <div className="bg-amber-50 p-1 rounded-md">
              <LightbulbIcon className="h-3 w-3 text-amber-500" />
            </div>
            <span className="text-gray-700 font-medium ml-2 mr-2">Smart suggestions:</span>
          </div>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0 ml-6 sm:ml-0">
            {smartContext.suggestions.map((suggestion, index) => (
              <li key={index} className="text-navy hover:text-[#F65C9A] transition-colors bg-gray-50 py-1 px-2 sm:py-0.5 sm:px-2 rounded-md">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartContextBanner;