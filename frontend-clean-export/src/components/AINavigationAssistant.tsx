import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bot,
  Search,
  ArrowRight,
  Sparkles,
  Lightbulb,
  MessageCircle,
  Zap
} from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface NavigationSuggestion {
  title: string;
  description: string;
  path: string;
  category: string;
  relevanceScore: number;
}

interface AIResponse {
  suggestions: NavigationSuggestion[];
  explanation: string;
  quickActions: string[];
}

const AINavigationAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  // Available admin features for the AI to reference
  const adminFeatures = [
    {
      title: 'SmartSite Control Room',
      description: 'Central dashboard with insights and system overview',
      path: '/admin/dashboard',
      category: 'Dashboard',
      keywords: ['dashboard', 'overview', 'insights', 'control', 'main']
    },
    {
      title: 'Content Intelligence',
      description: 'AI-powered content generation and optimization tools',
      path: '/admin/content',
      category: 'Content',
      keywords: ['content', 'blog', 'social', 'writing', 'generate', 'ai']
    },
    {
      title: 'Market Intelligence',
      description: 'Competitive analysis and market trend insights',
      path: '/admin/insights',
      category: 'Analytics',
      keywords: ['market', 'analytics', 'trends', 'competitors', 'insights']
    },
    {
      title: 'SmartSite Setup',
      description: 'Configure your SmartSite features and preferences',
      path: '/admin/setup',
      category: 'Setup',
      keywords: ['setup', 'configure', 'settings', 'preferences', 'install']
    },
    {
      title: 'Autopilot Control',
      description: 'Manage automated content and marketing features',
      path: '/admin/autopilot',
      category: 'Automation',
      keywords: ['autopilot', 'automation', 'scheduled', 'automatic']
    }
  ];

  // Simulate AI response based on query
  const generateAIResponse = (userQuery: string): AIResponse => {
    const lowerQuery = userQuery.toLowerCase();
    
    // Find matching features
    const matches = adminFeatures.filter(feature => 
      feature.keywords.some(keyword => lowerQuery.includes(keyword)) ||
      feature.title.toLowerCase().includes(lowerQuery) ||
      feature.description.toLowerCase().includes(lowerQuery)
    ).map(feature => ({
      ...feature,
      relevanceScore: Math.random() * 100 // In real implementation, this would be calculated
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Default suggestions if no matches
    const suggestions = matches.length > 0 ? matches.slice(0, 3) : [
      {
        title: 'SmartSite Control Room',
        description: 'Start with the main dashboard to get an overview',
        path: '/admin/dashboard',
        category: 'Dashboard',
        relevanceScore: 95
      },
      {
        title: 'Content Intelligence',
        description: 'Create and optimize content with AI assistance',
        path: '/admin/content',
        category: 'Content',
        relevanceScore: 90
      }
    ];

    // Generate contextual explanation
    let explanation = '';
    if (lowerQuery.includes('content') || lowerQuery.includes('blog') || lowerQuery.includes('writing')) {
      explanation = "Based on your interest in content, I recommend starting with Content Intelligence for AI-powered writing tools.";
    } else if (lowerQuery.includes('analytics') || lowerQuery.includes('data') || lowerQuery.includes('insights')) {
      explanation = "For data and analytics, Market Intelligence provides comprehensive insights and trend analysis.";
    } else if (lowerQuery.includes('setup') || lowerQuery.includes('configure') || lowerQuery.includes('getting started')) {
      explanation = "To get started, the SmartSite Setup panel will guide you through configuration.";
    } else {
      explanation = "Here are the most relevant sections based on your query. The Control Room is your central hub for all SmartSite features.";
    }

    const quickActions = [
      "View system status",
      "Check recent insights",
      "Generate new content"
    ];

    return { suggestions, explanation, quickActions };
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      setResponse(aiResponse);
      setLoading(false);
    }, 800);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
    setResponse(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 transition-all"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline-block">AI Assistant</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            SmartSite Navigation Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="What would you like to do? (e.g., 'create content', 'view analytics', 'setup features')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={!query.trim() || loading}>
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick Start Options */}
          {!response && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => setQuery('getting started with smartsite')}
              >
                <Zap className="h-4 w-4 mr-2 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Getting Started</div>
                  <div className="text-xs text-gray-500">Setup and basics</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => setQuery('create content with ai')}
              >
                <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Create Content</div>
                  <div className="text-xs text-gray-500">AI-powered writing</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => setQuery('view analytics and insights')}
              >
                <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                <div className="text-left">
                  <div className="font-medium">View Insights</div>
                  <div className="text-xs text-gray-500">Analytics & trends</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => setQuery('manage automation features')}
              >
                <Bot className="h-4 w-4 mr-2 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Automation</div>
                  <div className="text-xs text-gray-500">Autopilot features</div>
                </div>
              </Button>
            </div>
          )}

          {/* AI Response */}
          {response && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {response.explanation}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Recommended Sections:
                </h4>
                {response.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between h-auto p-3 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                    onClick={() => handleNavigate(suggestion.path)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.description}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AINavigationAssistant;