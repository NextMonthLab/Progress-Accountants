import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useHelp } from '@/contexts/HelpContext';

interface ContextMap {
  [key: string]: {
    title: string;
    suggestedHelp: string;
  };
}

// Map of routes to contextual help suggestions
const contextMap: ContextMap = {
  '/media': {
    title: 'Media Upload',
    suggestedHelp: 'Need help with media uploads?'
  },
  '/blueprint-builder': {
    title: 'Blueprint Builder',
    suggestedHelp: 'Need help publishing your first Blueprint?'
  },
  '/admin/marketplace': {
    title: 'Marketplace',
    suggestedHelp: 'Need help finding the right tools?'
  },
  '/admin/settings': {
    title: 'Settings',
    suggestedHelp: 'Need help configuring your account?'
  },
  '/admin/tools': {
    title: 'Tools',
    suggestedHelp: 'Need help setting up your tools?'
  },
  '/admin/seo': {
    title: 'SEO',
    suggestedHelp: 'Need help optimizing your SEO settings?'
  },
  '/admin/blueprint': {
    title: 'Blueprint Management',
    suggestedHelp: 'Need help managing your Blueprints?'
  }
};

export default function ContextSuggestion() {
  const [location] = useLocation();
  const { openHelp } = useHelp();
  const [suggestion, setSuggestion] = useState<{title: string; suggestedHelp: string} | null>(null);
  
  useEffect(() => {
    // Check if the current path matches any keys in our context map
    const contextKey = Object.keys(contextMap).find(key => location.startsWith(key));
    
    if (contextKey) {
      setSuggestion(contextMap[contextKey]);
    } else {
      // Reset suggestion when not on a known page
      setSuggestion(null);
    }
  }, [location]);
  
  // Don't render anything if we don't have a suggestion for this page
  if (!suggestion) return null;
  
  return (
    <div className="fixed right-12 top-20 z-40">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-primary/20 animate-fade-in transition-opacity">
        <Button 
          variant="link" 
          className="text-xs p-0 h-auto text-primary hover:text-primary/80"
          onClick={openHelp}
        >
          <HelpCircle className="h-3 w-3 mr-1" />
          {suggestion.suggestedHelp}
        </Button>
      </div>
    </div>
  );
}