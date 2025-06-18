import React, { useState, useEffect } from 'react';
import { Brain, ArrowUpRight, Sparkles, BarChart3, UserCircle, Calendar, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Type for smart activity suggestions
interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  action: string;
  link: string;
}

const SmartActivityPanel: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(() => {
    // Try to get saved preference from localStorage
    const saved = localStorage.getItem('smartInsightsPanelCollapsed');
    return saved ? saved === 'true' : false;
  });

  // Simulated smart suggestions data
  useEffect(() => {
    // In a real implementation, this would be fetched from an API
    const mockSuggestions: SmartSuggestion[] = [
      {
        id: '1',
        title: 'Update SEO Keywords',
        description: 'Your homepage SEO could be improved with seasonal keywords',
        priority: 'high',
        icon: 'BarChart3',
        action: 'Optimize',
        link: '/admin/seo-manager'
      },
      {
        id: '2',
        title: 'Content Refresh',
        description: 'Services page hasn\'t been updated in 30 days',
        priority: 'medium',
        icon: 'FileText',
        action: 'Review',
        link: '/admin/pages/services'
      },
      {
        id: '3',
        title: 'Schedule Post',
        description: 'Optimal time to post on social media coming up',
        priority: 'medium',
        icon: 'Calendar',
        action: 'Schedule',
        link: '/admin/social-media-generator'
      }
    ];

    // Simulate API fetch delay
    setTimeout(() => {
      setSmartSuggestions(mockSuggestions);
      setLoading(false);
    }, 800);
  }, []);

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: {[key: string]: React.ReactNode} = {
      'BarChart3': <BarChart3 className="h-4 w-4" />,
      'FileText': <FileText className="h-4 w-4" />,
      'Calendar': <Calendar className="h-4 w-4" />,
      'UserCircle': <UserCircle className="h-4 w-4" />
    };
    
    return iconMap[iconName] || <Sparkles className="h-4 w-4" />;
  };

  // Get priority styling
  const getPriorityStyle = (priority: string) => {
    const styleMap: {[key: string]: string} = {
      'high': 'text-red-500',
      'medium': 'text-amber-500',
      'low': 'text-emerald-500'
    };
    
    return styleMap[priority] || '';
  };
  
  // Toggle panel collapsed state
  const togglePanel = () => {
    const newState = !isPanelCollapsed;
    setIsPanelCollapsed(newState);
    localStorage.setItem('smartInsightsPanelCollapsed', newState.toString());
  };

  if (collapsed) {
    return (
      <TooltipProvider>
        <div className="py-3 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
              >
                <Brain className="h-5 w-5 text-[var(--navy)] hover:text-[var(--orange)]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--orange)] rounded-full"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Smart Insights Available</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-white to-slate-50">
      <div className="flex items-center space-x-2 mb-2">
        <Brain className="h-4 w-4 text-[var(--navy)]" />
        <h4 className="text-xs font-medium text-[var(--navy)] uppercase tracking-wider">Smart Insights</h4>
        <Badge variant="outline" className="ml-auto text-[9px] py-0 h-4 border-[var(--orange)] text-[var(--orange)]">
          AI
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={togglePanel}
          className="h-5 w-5 p-0 ml-1 text-gray-500 hover:text-[var(--navy)]"
        >
          {isPanelCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isPanelCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
      )}>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-12 bg-gray-100 rounded-md"></div>
            <div className="h-12 bg-gray-100 rounded-md"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {smartSuggestions.slice(0, 2).map((suggestion) => (
              <div 
                key={suggestion.id}
                className="p-2 rounded-md bg-white/80 hover:bg-orange-50/50 border border-gray-100 transition-all duration-200"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-2 mt-0.5">
                    {getIconComponent(suggestion.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.description}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-6 px-1.5 py-0 flex items-center text-[var(--orange)] hover:text-[var(--navy)]"
                    asChild
                  >
                    <a href={suggestion.link}>
                      {suggestion.action}
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
            
            {smartSuggestions.length > 2 && (
              <a 
                href="/admin/smart-insights" 
                className="block text-center text-xs text-[var(--navy)] hover:text-[var(--orange)] mt-2 transition-colors"
              >
                View all {smartSuggestions.length} insights
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartActivityPanel;