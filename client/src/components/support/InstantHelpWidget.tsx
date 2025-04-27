import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Search, AlertTriangle, Info, ArrowRight, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useHelp } from '@/contexts/HelpContext';

interface PageContextTip {
  title: string;
  description: string;
  link?: string;
}

interface ContextualHelp {
  pageTitle: string;
  quickTips: PageContextTip[];
}

// This would be expanded to include all pages in a real implementation
const contextualHelpMap: Record<string, ContextualHelp> = {
  '/media': {
    pageTitle: 'Media Upload',
    quickTips: [
      { 
        title: 'Upload Your First Video', 
        description: 'Learn how to upload, optimize, and manage video content in the media library.'
      },
      { 
        title: 'File Size Requirements', 
        description: 'Understand the supported file formats and maximum file sizes for different media types.'
      },
      { 
        title: 'Image Optimization', 
        description: 'Best practices for optimizing images for web performance and SEO.'
      }
    ]
  },
  '/blueprint-builder': {
    pageTitle: 'Blueprint Builder',
    quickTips: [
      { 
        title: 'Publishing Your Blueprint', 
        description: 'Step-by-step guide to finalizing and publishing your blueprint to the marketplace.'
      },
      { 
        title: 'Saving as Draft', 
        description: 'How to save your work in progress and return to it later.'
      },
      { 
        title: 'Blueprint Components', 
        description: 'Understanding the different components available in the blueprint builder.'
      }
    ]
  },
  '/admin/settings': {
    pageTitle: 'Account Settings',
    quickTips: [
      { 
        title: 'Resetting Your Password', 
        description: 'How to securely reset your password and manage account security.'
      },
      { 
        title: 'Setting Up SSO', 
        description: 'Instructions for configuring Single Sign-On for your organization.'
      },
      { 
        title: 'User Permissions', 
        description: 'Managing role-based access control for team members.'
      }
    ]
  },
  '/admin/marketplace': {
    pageTitle: 'Marketplace',
    quickTips: [
      { 
        title: 'Installing Tools', 
        description: 'How to browse, install and configure marketplace tools.'
      },
      { 
        title: 'Tool Compatibility', 
        description: 'Understanding which tools work together and potential conflicts.'
      },
      { 
        title: 'Updating Installed Tools', 
        description: 'Best practices for keeping your tools up to date and secure.'
      }
    ]
  }
};

// Default tips for pages without specific context
const defaultContextualHelp: ContextualHelp = {
  pageTitle: 'Current Page',
  quickTips: [
    { 
      title: 'Navigation Tips', 
      description: 'Learn how to quickly navigate between sections using keyboard shortcuts.'
    },
    { 
      title: 'Getting Started', 
      description: 'Overview of key features and recommended first steps.'
    },
    { 
      title: 'Common Questions', 
      description: 'Answers to frequently asked questions about using this platform.'
    }
  ]
};

export default function InstantHelpWidget() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { sessionId, isHelpOpen, openHelp, closeHelp, toggleHelp, isInitialized } = useHelp();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PageContextTip[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'report'>('home');
  const [contextualHelp, setContextualHelp] = useState<ContextualHelp>(defaultContextualHelp);
  const [reportIssue, setReportIssue] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync our local isOpen state with the HelpContext state
  useEffect(() => {
    setIsOpen(isHelpOpen);
  }, [isHelpOpen]);

  // When local state changes, update the context state
  useEffect(() => {
    if (isOpen) {
      openHelp();
    } else {
      closeHelp();
    }
  }, [isOpen, openHelp, closeHelp]);

  // Determine context-based help based on current URL
  useEffect(() => {
    // Extract the base path from the current location
    const basePath = '/' + location.split('/')[1];
    
    // Look for exact matches first
    if (contextualHelpMap[location]) {
      setContextualHelp(contextualHelpMap[location]);
    } 
    // Then try base path matches
    else if (contextualHelpMap[basePath]) {
      setContextualHelp(contextualHelpMap[basePath]);
    } 
    // Default to general help
    else {
      setContextualHelp({
        ...defaultContextualHelp,
        pageTitle: getCurrentPageName()
      });
    }
  }, [location]);

  // Get a human-readable name for the current page
  const getCurrentPageName = () => {
    const path = location.split('/');
    
    // Remove empty segments and get the last segment
    const lastSegment = path.filter(segment => segment).pop() || 'Home';
    
    // Convert to title case and replace hyphens with spaces
    return lastSegment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !sessionId) return;
    
    setIsSearching(true);
    
    try {
      // In a real implementation, this would call an AI-powered search endpoint
      // For now, we'll simulate some results based on the query
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // Simple mock search implementation
      const mockResults: PageContextTip[] = [
        { 
          title: `How to ${searchQuery}`, 
          description: `Learn the best practices for ${searchQuery} in the platform.`,
          link: '#'
        },
        { 
          title: `Troubleshooting ${searchQuery} issues`, 
          description: `Common problems and solutions related to ${searchQuery}.`,
          link: '#'
        },
        { 
          title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} FAQ`, 
          description: `Frequently asked questions about ${searchQuery}.`,
          link: '#'
        }
      ];
      
      setSearchResults(mockResults);
      setCurrentView('search');
    } catch (error) {
      console.error('Error searching help:', error);
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'There was a problem searching for help content.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle reporting an issue
  const handleReportIssue = async () => {
    if (!reportIssue.trim() || !sessionId) return;
    
    setIsReporting(true);
    
    try {
      const response = await apiRequest('POST', `/api/support/session/${sessionId}/issue`, {
        issue: reportIssue
      });
      
      if (!response.ok) {
        throw new Error('Failed to report issue');
      }
      
      // Redirect to the ticket page for more detailed information
      setIsOpen(false);
      setLocation(`/support/ticket?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Report Issue',
        description: 'There was a problem submitting your issue. Please try again.',
      });
    } finally {
      setIsReporting(false);
    }
  };

  // Focus the search input when the view changes to search
  useEffect(() => {
    if (currentView === 'search' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [currentView]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+H to toggle help panel
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Render a passive suggestion based on current context
  const renderPassiveSuggestion = () => {
    // Only show for users on specific pages where we know they might need help
    const shouldShowSuggestion = Object.keys(contextualHelpMap).some(path => 
      location.includes(path) && contextualHelpMap[path]?.quickTips?.length > 0
    );
    
    if (!shouldShowSuggestion) return null;
    
    return (
      <div className="fixed right-12 top-20 z-40">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-primary/20 animate-fade-in">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="link" className="text-xs p-0 h-auto text-primary hover:text-primary/80">
                <HelpCircle className="h-3 w-3 mr-1" />
                Need help with {contextualHelp.pageTitle}?
              </Button>
            </SheetTrigger>
            
            {/* Sheet content is handled by the main component */}
          </Sheet>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Passive suggestion that appears on certain pages */}
      {renderPassiveSuggestion()}
      
      {/* Main help button - always visible */}
      <div className="fixed right-6 bottom-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0 shadow-md">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-[350px] sm:w-[450px] p-0 overflow-y-auto">
            <div className="h-full flex flex-col">
              <SheetHeader className="p-6 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <SheetTitle>Instant Help Center</SheetTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <SheetDescription>
                  Find quick tips, tutorials, or get guided help — instantly.
                </SheetDescription>
              </SheetHeader>
              
              {/* Home View - Quick Tips */}
              {currentView === 'home' && (
                <div className="flex-1 p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Quick Tips for {contextualHelp.pageTitle}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {contextualHelp.quickTips.map((tip, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <Info className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium">{tip.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Need more help?
                    </h3>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setCurrentView('search')}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Help Articles
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setCurrentView('report')}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report an Issue
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Search View */}
              {currentView === 'search' && (
                <div className="flex-1 p-6">
                  <div className="flex items-center mb-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 h-8 w-8 p-0"
                      onClick={() => setCurrentView('home')}
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <h3 className="text-sm font-medium">Search Help Articles</h3>
                  </div>
                  
                  <div className="flex mb-6">
                    <Input
                      ref={searchInputRef}
                      placeholder="How can we help you?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="mr-2"
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Results for "{searchQuery}"</h4>
                      
                      <div className="space-y-3">
                        {searchResults.map((result, index) => (
                          <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div>
                                  <h4 className="text-sm font-medium">{result.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          Didn't find what you're looking for?
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setCurrentView('report')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Report an Issue
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {searchQuery && searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">
                        No results found for "{searchQuery}"
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentView('report')}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report an Issue
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Report Issue View */}
              {currentView === 'report' && (
                <div className="flex-1 p-6">
                  <div className="flex items-center mb-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 h-8 w-8 p-0"
                      onClick={() => setCurrentView('home')}
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <h3 className="text-sm font-medium">Report an Issue</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Describe the issue you're experiencing, and we'll help you get it resolved.
                    </p>
                    
                    <Input
                      placeholder="Briefly describe your issue..."
                      value={reportIssue}
                      onChange={(e) => setReportIssue(e.target.value)}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleReportIssue}
                        disabled={isReporting || !reportIssue.trim()}
                      >
                        {isReporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>Submit and Get Help</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t p-4 mt-auto">
                <p className="text-xs text-muted-foreground">
                  Session ID: {sessionId || 'Initializing...'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="opacity-70">Tip: Press</span>{' '}
                  <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px]">Alt</kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px]">H</kbd>
                  {' '}
                  <span className="opacity-70">to open help anytime</span>
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}