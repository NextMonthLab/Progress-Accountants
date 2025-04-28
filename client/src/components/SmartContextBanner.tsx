import React, { useState, useEffect } from 'react';
import { Brain, X, Clock, ChevronDown, ChevronUp, LightbulbIcon } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';

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
  if (!isOpen || !smartContext || navigationState.focusedMode) return null;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-gray-200 p-2 px-4 text-sm relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="h-4 w-4 text-[var(--navy)] mr-2" />
          <span className="font-medium text-[var(--navy)]">Smart Context</span>
          {loading ? (
            <div className="ml-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <span className="ml-3 text-gray-700">{smartContext.context}</span>
          )}
          
          <div className="flex items-center ml-6 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {loading ? (
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <span>Last activity: {smartContext.lastActivity}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs hover:bg-orange-100/50 transition-all"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>
      
      {/* Intelligent Suggestions */}
      {!loading && smartContext.suggestions.length > 0 && (
        <div className="mt-1 pl-6 flex items-center text-xs">
          <LightbulbIcon className="h-3 w-3 text-amber-500 mr-1" />
          <span className="text-gray-600 mr-2">Smart suggestions:</span>
          <ul className="flex space-x-4">
            {smartContext.suggestions.map((suggestion, index) => (
              <li key={index} className="text-[var(--navy)] hover:text-[var(--orange)] transition-colors">
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