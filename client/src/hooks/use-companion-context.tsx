import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

/**
 * Defines the structure of business identity data used by the companion
 */
export interface BusinessIdentity {
  core: {
    businessName: string;
    tagline: string;
    description: string;
    yearFounded: string;
    numberOfEmployees: string;
  };
  market: {
    primaryIndustry: string;
    targetAudience: string;
    geographicFocus: string;
  };
  personality: {
    toneOfVoice: string[];
    usps: string[];
    missionStatement: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  services: string[];
  lastUpdated: string;
}

/**
 * Structure of brand settings for companion
 */
export interface BrandSettings {
  color: {
    primary: string;
    secondary: string;
  };
  voice: {
    tone: string;
    formality: 'casual' | 'neutral' | 'formal';
    personality: 'friendly' | 'professional' | 'technical';
  };
}

/**
 * The companion mode determines its behavior
 */
export type CompanionMode = 'admin' | 'public' | 'debug';

/**
 * Context for the companion assistant
 */
export interface CompanionContext {
  mode: CompanionMode;
  businessIdentity: BusinessIdentity | null;
  brandSettings: BrandSettings | null;
  publicPages: string[];
  isLoading: boolean;
  error: Error | null;
  debugMode: boolean;
  toggleDebugMode: () => void;
  forceMode: (mode: CompanionMode) => void;
}

// Default context
const defaultContext: CompanionContext = {
  mode: 'public',
  businessIdentity: null,
  brandSettings: null,
  publicPages: [],
  isLoading: true,
  error: null,
  debugMode: false,
  toggleDebugMode: () => {},
  forceMode: () => {},
};

// Create context
const CompanionContextContext = createContext<CompanionContext>(defaultContext);

/**
 * Provider component for the companion context
 */
export function CompanionContextProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [businessIdentity, setBusinessIdentity] = useState<BusinessIdentity | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null);
  const [publicPages, setPublicPages] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [forcedMode, setForcedMode] = useState<CompanionMode | null>(null);

  // Determine if the current location is an admin page
  const isAdminPage = () => {
    return (
      location.startsWith('/admin') ||
      location.startsWith('/tools') ||
      location.startsWith('/onboarding') ||
      location.startsWith('/dashboard') ||
      location.startsWith('/settings') ||
      location.startsWith('/media') ||
      location.startsWith('/client-dashboard') ||
      location.startsWith('/marketplace') ||
      location.startsWith('/module-library') ||
      location.includes('setup')
    );
  };

  // Determine the current mode based on page and user
  const determineMode = (): CompanionMode => {
    // If mode is forced via debug controls, use that
    if (forcedMode) {
      return forcedMode;
    }
    
    // Check if it's an admin page and user has appropriate role
    if (isAdminPage() && user && ['admin', 'super_admin', 'editor'].includes(user.userType)) {
      return 'admin';
    }
    
    // Default to public mode
    return 'public';
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev);
  };

  // Force a specific mode (for debug purposes)
  const forceMode = (mode: CompanionMode) => {
    setForcedMode(mode);
  };

  // Load business identity data
  useEffect(() => {
    const loadBusinessIdentity = async () => {
      setIsLoading(true);
      try {
        // First try to load from API
        const response = await fetch('/api/business-identity');
        
        if (response.ok) {
          const data = await response.json();
          setBusinessIdentity(data);
        } else {
          // Fallback to localStorage if API fails
          const savedData = localStorage.getItem('system_context.business_identity');
          if (savedData) {
            setBusinessIdentity(JSON.parse(savedData));
          }
        }
      } catch (error) {
        console.error('Error loading business identity:', error);
        
        // Attempt to load from localStorage as final fallback
        try {
          const savedData = localStorage.getItem('system_context.business_identity');
          if (savedData) {
            setBusinessIdentity(JSON.parse(savedData));
          }
        } catch (e) {
          setError(new Error('Failed to load business identity data'));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load brand settings
    const loadBrandSettings = async () => {
      try {
        // Try to get brand version from API
        const response = await fetch('/api/brand/versions/latest');
        
        if (response.ok) {
          const data = await response.json();
          setBrandSettings({
            color: {
              primary: data.primaryColor || '#1e3a8a',
              secondary: data.secondaryColor || '#f97316',
            },
            voice: {
              tone: data.tonalStyle || 'professional',
              formality: data.formality || 'neutral',
              personality: data.personality || 'professional',
            }
          });
        } else {
          // Set defaults if API fails
          setBrandSettings({
            color: {
              primary: '#1e3a8a', // Navy blue
              secondary: '#f97316', // Burnt orange
            },
            voice: {
              tone: 'professional',
              formality: 'neutral',
              personality: 'professional',
            }
          });
        }
      } catch (error) {
        console.error('Error loading brand settings:', error);
        // Set defaults
        setBrandSettings({
          color: {
            primary: '#1e3a8a', // Navy blue
            secondary: '#f97316', // Burnt orange
          },
          voice: {
            tone: 'professional',
            formality: 'neutral',
            personality: 'professional',
          }
        });
      }
    };
    
    // Load list of public pages
    const loadPublicPages = async () => {
      try {
        const response = await fetch('/api/pages/public');
        
        if (response.ok) {
          const data = await response.json();
          setPublicPages(data.map((page: any) => page.slug));
        } else {
          // Default public pages
          setPublicPages([
            '/',
            '/about',
            '/services',
            '/contact',
            '/blog',
            '/faq',
            '/testimonials'
          ]);
        }
      } catch (error) {
        console.error('Error loading public pages:', error);
        // Default public pages
        setPublicPages([
          '/',
          '/about',
          '/services',
          '/contact',
          '/blog',
          '/faq',
          '/testimonials'
        ]);
      }
    };

    loadBusinessIdentity();
    loadBrandSettings();
    loadPublicPages();
  }, []);

  // Create the context value
  const contextValue: CompanionContext = {
    mode: determineMode(),
    businessIdentity,
    brandSettings,
    publicPages,
    isLoading,
    error,
    debugMode,
    toggleDebugMode,
    forceMode,
  };

  return (
    <CompanionContextContext.Provider value={contextValue}>
      {children}
    </CompanionContextContext.Provider>
  );
}

/**
 * Hook to access companion context
 */
export function useCompanionContext() {
  const context = useContext(CompanionContextContext);
  
  if (context === undefined) {
    throw new Error('useCompanionContext must be used within a CompanionContextProvider');
  }
  
  return context;
}