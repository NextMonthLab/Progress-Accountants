import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileEdit, ExternalLink, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Confetti } from '../components/Confetti';

// Define page types and status types
type PageType = 'homepage' | 'about' | 'services' | 'contact' | 'testimonials' | 'faq';
type PageStatus = 'not_started' | 'in_progress' | 'complete' | 'skipped';

// Define page data structure
interface PageSummary {
  id: PageType;
  title: string;
  setupPath: string;
  displayName: string;
}

// Define page status data structure
interface PageStatusData {
  [key: string]: PageStatus;
}

export default function LaunchReadyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // State for page statuses
  const [pageStatuses, setPageStatuses] = useState<PageStatusData>({
    homepage: 'complete', // Homepage is always complete at this point
    about: 'not_started',
    services: 'not_started',
    contact: 'not_started',
    testimonials: 'not_started',
    faq: 'not_started'
  });
  
  // State for animation
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Define pages data
  const pages: PageSummary[] = [
    {
      id: 'homepage',
      title: 'Homepage',
      setupPath: '/homepage-setup',
      displayName: 'Homepage'
    },
    {
      id: 'about',
      title: 'About',
      setupPath: '/about-setup',
      displayName: 'About Us'
    },
    {
      id: 'services',
      title: 'Services',
      setupPath: '/services-setup',
      displayName: 'Services'
    },
    {
      id: 'contact',
      title: 'Contact',
      setupPath: '/contact-setup',
      displayName: 'Contact'
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      setupPath: '/testimonials-setup',
      displayName: 'Testimonials'
    },
    {
      id: 'faq',
      title: 'FAQ',
      setupPath: '/faq-setup',
      displayName: 'FAQ/Pricing'
    }
  ];
  
  // Ensure type safety for our status updates
  function ensurePageStatus(status: string): PageStatus {
    if (status === 'not_started' || status === 'in_progress' || 
        status === 'complete' || status === 'skipped') {
      return status as PageStatus;
    }
    return 'not_started'; // Default fallback
  }
  
  // Load saved homepage status and page statuses
  useEffect(() => {
    // First check if homepage setup exists
    const savedHomepage = localStorage.getItem('project_context.homepage');
    if (savedHomepage) {
      // If homepage exists, update its status in our state
      setPageStatuses(prev => ({...prev, homepage: 'complete'}));
    }
    
    // Then load foundation pages statuses
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedData = JSON.parse(savedStatuses);
        
        // Ensure the parsed data has correct types
        const safeStatuses: PageStatusData = { homepage: 'complete' }; // Always keep homepage complete
        Object.keys(parsedData).forEach(key => {
          safeStatuses[key] = ensurePageStatus(parsedData[key]);
        });
        
        setPageStatuses(prev => ({...prev, ...safeStatuses}));
      } catch (error) {
        console.error('Error parsing stored page statuses:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your page setup progress.",
          variant: "destructive",
        });
      }
    }
    
    // Set onboarded status in localStorage
    localStorage.setItem('project_context.status', 'onboarded');
    
    // Start confetti after a short delay
    setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    
    // Clear confetti after a few seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3500);
  }, [toast]);
  
  // Handler for "Explore Marketplace" button
  const handleExploreMarketplace = () => {
    toast({
      title: "Marketplace Access Unlocked",
      description: "You can now access all marketplace tools and templates!",
      variant: "default",
    });
    
    setLocation('/module-gallery');
  };
  
  // Handler for "Start a New Project" button
  const handleStartNewProject = () => {
    toast({
      title: "New Project Mode",
      description: "Let's create something amazing together!",
      variant: "default",
    });
    
    // In a real implementation, navigate to the new project page
    // For now, just show a toast
  };
  
  // Handler for "Revisit Brand Guidelines" button
  const handleRevisitBrandGuidelines = () => {
    setLocation('/brand-guidelines');
  };
  
  // Get badge component based on page status
  const getStatusBadge = (status: PageStatus) => {
    switch (status) {
      case 'not_started':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Not Started</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">In Progress</Badge>;
      case 'complete':
        return <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">Complete</Badge>;
      case 'skipped':
        return <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">Skipped</Badge>;
      default:
        return null;
    }
  };
  
  const getCompletedPagesCount = (): number => {
    return Object.values(pageStatuses).filter(status => status === 'complete').length;
  };
  
  const getSkippedPagesCount = (): number => {
    return Object.values(pageStatuses).filter(status => status === 'skipped').length;
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Launch Ready | Onboarding Complete</title>
      </Helmet>
      
      {showConfetti && <Confetti />}
      
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg text-center py-12 relative">
            <div className="absolute top-4 right-4">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <CardTitle className="text-4xl font-bold mb-4">You're all set up. Welcome to your Business OS.</CardTitle>
            <CardDescription className="text-gray-100 text-xl">
              Your homepage is live. Your foundation is in place. Now let's build your future.
            </CardDescription>
            
            <div className="mt-8 flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-green-400 animate-bounce" />
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6 text-green-600" />
                Setup Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <Card key={page.id} className={`overflow-hidden relative ${
                    pageStatuses[page.id] === 'complete' 
                      ? 'border-green-300 bg-green-50' 
                      : pageStatuses[page.id] === 'skipped'
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200'
                  }`}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{page.displayName}</CardTitle>
                        {getStatusBadge(pageStatuses[page.id])}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      {(pageStatuses[page.id] === 'skipped' || pageStatuses[page.id] === 'complete') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => setLocation(page.setupPath)}
                        >
                          <FileEdit className="mr-2 h-4 w-4" />
                          {pageStatuses[page.id] === 'complete' ? 'Edit' : 'Setup Now'}
                        </Button>
                      )}
                    </CardContent>
                    
                    {pageStatuses[page.id] === 'complete' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    
                    {pageStatuses[page.id] === 'skipped' && (
                      <div className="absolute top-2 right-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700">
                  <span className="font-medium">Progress Summary:</span> You've completed {getCompletedPagesCount()} pages 
                  and skipped {getSkippedPagesCount()} pages. 
                  {getSkippedPagesCount() > 0 ? 
                    " You can set up the skipped pages later at any time." : 
                    " Great job completing everything!"}
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-yellow-500" />
                What's Next?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Explore Marketplace</CardTitle>
                    <CardDescription>
                      Discover ready-to-use templates, tools, and modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-gray-500 text-sm mb-4">
                      Browse a collection of pre-built screens and features designed to enhance your business system.
                    </p>
                    <Button 
                      onClick={handleExploreMarketplace}
                      className="w-full bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Explore Marketplace
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Start a New Project</CardTitle>
                    <CardDescription>
                      Begin building a custom page, content, or campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-gray-500 text-sm mb-4">
                      Create something new from scratch or use one of our guided templates and wizards.
                    </p>
                    <Button 
                      onClick={handleStartNewProject}
                      className="w-full bg-[var(--orange)] hover:bg-[var(--orange)]/90"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start New Project
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Revisit Brand Guidelines</CardTitle>
                    <CardDescription>
                      Review or update your brand identity settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-gray-500 text-sm mb-4">
                      Make changes to your color scheme, typography, tone of voice, or other brand elements.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={handleRevisitBrandGuidelines}
                      className="w-full"
                    >
                      <FileEdit className="mr-2 h-4 w-4" />
                      Brand Guidelines
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 bg-gray-50 border-t text-center">
            <p className="text-gray-600 text-sm mx-auto max-w-3xl">
              Your setup can evolve at any time. Revisit any page or update your identity—we'll adapt everything from there.
              The content and structure of your site will grow with your business.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}