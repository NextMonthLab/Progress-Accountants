import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

// Create context with default values
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

const CompanionContextValue = createContext<CompanionContext>(defaultContext);

/**
 * Provider component for the companion context
 */
export function CompanionContextProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [debugMode, setDebugMode] = useState(false);
  const [forcedMode, setForcedMode] = useState<CompanionMode | null>(null);
  
  // Get public pages from API
  const { data: publicPages = [], isLoading: pagesLoading } = useQuery<string[]>({
    queryKey: ['/api/pages/public'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/pages/public');
      if (!response.ok) {
        throw new Error('Failed to fetch public pages');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch business identity from API
  const { 
    data: businessIdentity, 
    isLoading: identityLoading, 
    error: identityError 
  } = useQuery<BusinessIdentity>({
    queryKey: ['/api/business-identity'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/business-identity');
      if (!response.ok) {
        throw new Error('Failed to fetch business identity');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Determine whether we're on an admin page or public page
  const determineMode = (): CompanionMode => {
    // If we have a forced mode from debug, use it
    if (forcedMode) return forcedMode;
    
    // Check if the current path is in public pages list
    const isPublicPage = publicPages.some(page => location === page || location.startsWith(page + '/'));
    
    // Admin-specific pages
    const adminPaths = [
      '/admin',
      '/dashboard',
      '/tools-dashboard',
      '/tools-hub',
      '/tools',
      '/blueprint-manager',
      '/media',
      '/brand-manager',
      '/seo-manager',
      '/client-dashboard',
      '/module-gallery',
      '/module-library',
      '/marketplace',
      '/installed-tools',
      '/brand-guidelines',
      '/business-identity',
      '/homepage-setup',
      '/foundation-pages',
      '/about-setup',
      '/services-setup',
      '/contact-setup',
      '/testimonials-setup',
      '/faq-setup',
      '/launch-ready',
    ];
    
    const isAdminPage = adminPaths.some(path => location === path || location.startsWith(path + '/'));
    
    // Logic for determining mode:
    // 1. If it's clearly an admin page, use admin mode
    // 2. If user is logged in and has admin privileges, use admin mode on non-public pages
    // 3. Otherwise, use public mode
    if (isAdminPage) {
      return 'admin';
    } else if (user && ['admin', 'super_admin', 'editor'].includes(user.userType) && !isPublicPage) {
      return 'admin';
    } else {
      return 'public';
    }
  };
  
  // Function to force mode from debug panel
  const forceMode = (mode: CompanionMode) => {
    setForcedMode(mode);
  };
  
  // Generate brand settings from tenant data
  const brandSettings: BrandSettings | null = tenant ? {
    color: {
      primary: (tenant as any).primaryColor || '#1e3a8a', // Default: navy blue
      secondary: (tenant as any).secondaryColor || '#d97706', // Default: burnt orange
    },
    voice: {
      tone: 'professional',
      formality: 'formal',
      personality: 'professional',
    }
  } : null;
  
  // Create the context value
  const contextValue: CompanionContext = {
    mode: determineMode(),
    businessIdentity: businessIdentity || null,
    brandSettings,
    publicPages: publicPages || [],
    isLoading: identityLoading || pagesLoading,
    error: identityError || null,
    debugMode,
    toggleDebugMode: () => setDebugMode(prev => !prev),
    forceMode,
  };
  
  return (
    <CompanionContextValue.Provider value={contextValue}>
      {children}
    </CompanionContextValue.Provider>
  );
}

/**
 * Hook to access companion context
 */
export function useCompanionContext() {
  const context = useContext(CompanionContextValue);
  if (!context) {
    throw new Error('useCompanionContext must be used within a CompanionContextProvider');
  }
  return context;
}