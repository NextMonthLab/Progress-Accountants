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
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, ChevronRight, Clock, FileText, MessageSquare, Star, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Define page types and status types
type PageType = 'about' | 'services' | 'contact' | 'testimonials' | 'faq';
type PageStatus = 'not_started' | 'in_progress' | 'complete' | 'skipped';

// Define page data structure
interface PageData {
  id: PageType;
  title: string;
  description: string;
  icon: React.ReactNode;
  setupPath: string;
}

// Define page status data structure
interface PageStatusData {
  [key: string]: PageStatus;
}

// Ensure type safety for our status updates
function ensurePageStatus(status: string): PageStatus {
  if (status === 'not_started' || status === 'in_progress' || 
      status === 'complete' || status === 'skipped') {
    return status as PageStatus;
  }
  return 'not_started'; // Default fallback
}

export default function FoundationPagesOverviewPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Define pages data
  const pages: PageData[] = [
    {
      id: 'about',
      title: 'About',
      description: 'Tell your story. Who you are, what you stand for, and why clients trust you.',
      icon: <Users className="h-10 w-10 text-blue-600" />,
      setupPath: '/about-setup'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Showcase what you offer—clear, benefit-led, and structured for growth.',
      icon: <FileText className="h-10 w-10 text-green-600" />,
      setupPath: '/services-setup'
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Make it easy to reach you. Include forms, links, or scheduling tools.',
      icon: <MessageSquare className="h-10 w-10 text-purple-600" />,
      setupPath: '/contact-setup'
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Build trust with real words from real clients.',
      icon: <Star className="h-10 w-10 text-yellow-600" />,
      setupPath: '/testimonials-setup'
    },
    {
      id: 'faq',
      title: 'Pricing or FAQ',
      description: 'Answer common questions or explain your packages.',
      icon: <AlertCircle className="h-10 w-10 text-orange-600" />,
      setupPath: '/faq-setup'
    }
  ];
  
  // State for page statuses
  const [pageStatuses, setPageStatuses] = useState<PageStatusData>({
    about: 'not_started',
    services: 'not_started',
    contact: 'not_started',
    testimonials: 'not_started',
    faq: 'not_started'
  });
  
  // State to track if all pages have been addressed (completed or skipped)
  const [allPagesAddressed, setAllPagesAddressed] = useState(false);
  
  // Load page statuses and check for Tools Only users
  useEffect(() => {
    // Check if user is a "tools_only" user
    const homepagePreference = localStorage.getItem('project_context.homepage_preference');
    
    if (homepagePreference === 'tools_only') {
      toast({
        title: "Tools Only Mode Detected",
        description: "Looks like you chose to keep your own website. Redirecting to Tools Hub instead.",
        duration: 5000,
      });
      
      // Wait a moment to show the toast before redirecting
      setTimeout(() => {
        setLocation('/tools-hub');
      }, 1500);
      
      return;
    }
    
    const savedStatuses = localStorage.getItem('project_context.page_status');
    if (savedStatuses) {
      try {
        const parsedData = JSON.parse(savedStatuses);
        
        // Ensure the parsed data has correct types
        const safeStatuses: PageStatusData = {};
        Object.keys(parsedData).forEach(key => {
          safeStatuses[key] = ensurePageStatus(parsedData[key]);
        });
        
        setPageStatuses(safeStatuses);
        
        // Check if all pages have been addressed
        checkAllPagesAddressed(safeStatuses);
      } catch (error) {
        console.error('Error parsing stored page statuses:', error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your page setup progress.",
          variant: "destructive",
        });
      }
    }
  }, [toast, setLocation]);
  
  // Check if all pages have been addressed (completed or skipped)
  const checkAllPagesAddressed = (statuses: PageStatusData) => {
    const allAddressed = Object.values(statuses).every(status => 
      status === 'complete' || status === 'skipped'
    );
    setAllPagesAddressed(allAddressed);
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalPages = Object.keys(pageStatuses).length;
    const completedPages = Object.values(pageStatuses).filter(
      status => status === 'complete' || status === 'skipped'
    ).length;
    
    return (completedPages / totalPages) * 100;
  };
  
  // Handle starting setup for a page
  const handleStartSetup = (page: PageData) => {
    // Update page status to in_progress
    const newStatus: PageStatusData = { ...pageStatuses };
    newStatus[page.id] = 'in_progress';
    
    // Save to localStorage
    localStorage.setItem('project_context.page_status', JSON.stringify(newStatus));
    setPageStatuses(newStatus);
    
    // Navigate to the setup page
    toast({
      title: `Starting ${page.title} Setup`,
      description: `Navigating to ${page.title} setup page...`,
      variant: "default",
    });
    
    // Navigate to the setup page
    setLocation(page.setupPath);
  };
  
  // Handle skipping a page
  const handleSkipPage = (pageId: PageType) => {
    // Update page status to skipped
    const newStatus: PageStatusData = { ...pageStatuses };
    newStatus[pageId] = 'skipped';
    
    // Save to localStorage
    localStorage.setItem('project_context.page_status', JSON.stringify(newStatus));
    setPageStatuses(newStatus);
    
    // Check if all pages have been addressed
    checkAllPagesAddressed(newStatus);
    
    toast({
      title: "Page Skipped",
      description: "You can always come back and set up this page later.",
      variant: "default",
    });
  };
  
  // Handle continuing to launch
  const handleContinueToLaunch = () => {
    // In a real implementation, navigate to the launch page
    toast({
      title: "All Set!",
      description: "Moving to Launch Mode...",
      variant: "default",
    });
    
    // Navigate to the launch page
    setLocation('/launch-ready');
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
  
  // Get status icon based on page status
  const getStatusIcon = (status: PageStatus) => {
    switch (status) {
      case 'not_started':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'skipped':
        return <ChevronRight className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Foundation Pages | Onboarding</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="bg-white shadow-sm">
          <CardHeader className="bg-[var(--navy)] text-white rounded-t-lg">
            <CardTitle className="text-3xl">Build the foundation of your business site</CardTitle>
            <CardDescription className="text-gray-100">
              These pages give your customers confidence—and give you a system to grow with.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Setup Progress
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
            
            {/* Page Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="bg-gray-50 p-4 flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        {page.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{page.title}</CardTitle>
                        {getStatusBadge(pageStatuses[page.id])}
                      </div>
                    </div>
                    <div className="mt-1">
                      {getStatusIcon(pageStatuses[page.id])}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <p className="text-gray-600 mb-4">
                      {page.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button 
                        onClick={() => handleStartSetup(page)}
                        className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                        disabled={pageStatuses[page.id] === 'complete'}
                      >
                        {pageStatuses[page.id] === 'complete' ? 'Completed' : 'Start Setup'}
                      </Button>
                      
                      {pageStatuses[page.id] !== 'complete' && pageStatuses[page.id] !== 'skipped' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="flex-none"
                                onClick={() => handleSkipPage(page.id)}
                              >
                                Skip for now
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>You can set this up later.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="p-6 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              {allPagesAddressed 
                ? "All set! You're ready to continue to Launch Mode." 
                : "Complete or skip all pages to continue to Launch Mode."}
            </p>
            
            <Button
              onClick={handleContinueToLaunch}
              className="bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white sm:min-w-[200px]"
              disabled={!allPagesAddressed}
            >
              Continue to Launch
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}