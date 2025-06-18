import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface HelpContextType {
  sessionId: string | null;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  currentPageContext: string;
  redirectToTicketSystem: () => void;
  isInitialized: boolean;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Current page context - used for contextual help
  const currentPageContext = '/' + location.split('/')[1];
  
  // Initialize a support session when the provider mounts
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await apiRequest('POST', '/api/support/session');
        if (!response.ok) {
          throw new Error('Failed to create support session');
        }
        
        const data = await response.json();
        setSessionId(data.session.sessionId);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating support session:', error);
        toast({
          variant: 'destructive',
          title: 'Help System Initialization Failed',
          description: 'There was a problem setting up the help system. Some features may be limited.',
        });
      }
    };

    createSession();
  }, [toast]);
  
  // Helper functions for controlling the help panel
  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);
  const toggleHelp = () => setIsHelpOpen(prev => !prev);
  
  // Redirect to the ticket system with the current session ID
  const redirectToTicketSystem = () => {
    if (sessionId) {
      closeHelp();
      setLocation(`/support/ticket?sessionId=${sessionId}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Cannot Open Ticket System',
        description: 'The support session is not initialized yet. Please try again in a moment.',
      });
    }
  };
  
  // Handle keyboard shortcuts for help system
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+H to toggle help panel
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        toggleHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const value = {
    sessionId,
    isHelpOpen,
    openHelp,
    closeHelp,
    toggleHelp,
    currentPageContext,
    redirectToTicketSystem,
    isInitialized
  };
  
  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
}

export function useHelp() {
  const context = useContext(HelpContext);
  
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  
  return context;
}