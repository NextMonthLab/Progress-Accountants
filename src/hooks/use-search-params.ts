import { useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook to handle URL search parameters
 * This allows for filters to be shared via URL and preserved during navigation
 */
export function useSearchParams() {
  const [location, setLocation] = useLocation();
  
  // Parse the current search parameters
  const searchParams = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams;
  }, [location]);
  
  // Update search parameters
  const setSearchParams = useCallback((params: Record<string, string>) => {
    const url = new URL(window.location.href);
    const newSearchParams = new URLSearchParams();
    
    // Clean up the URL by removing empty params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      }
    });
    
    // Get the base path without search params
    const path = url.pathname;
    
    // Create new URL with the search params
    const searchStr = newSearchParams.toString();
    const newUrl = searchStr ? `${path}?${searchStr}` : path;
    
    // Update the URL
    setLocation(newUrl);
  }, [setLocation]);
  
  return { searchParams, setSearchParams };
}