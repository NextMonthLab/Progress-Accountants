import { useEffect } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { useLocation } from 'wouter';

// Define the requestIdleCallback and cancelIdleCallback globals if needed
declare global {
  interface Window {
    requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}

/**
 * HealthTracker component that silently monitors page load times
 * and other health metrics in the background.
 * 
 * This component should be placed high in the component tree
 * so that it's present across the entire application.
 */
export default function HealthTracker() {
  const [location] = useLocation();
  const { trackPageLoadTime } = useHealth();
  
  // Track page load time
  useEffect(() => {
    const startTime = performance.now();
    
    // Use window.requestIdleCallback if available, otherwise setTimeout
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 50));
    
    // Record the load time after the page has rendered
    const idleHandle = idleCallback(() => {
      const loadTime = performance.now() - startTime;
      trackPageLoadTime(location, loadTime);
    });
    
    return () => {
      // Clean up the idle callback if needed
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleHandle);
      } else {
        clearTimeout(idleHandle);
      }
    };
  }, [location, trackPageLoadTime]);
  
  // This component doesn't render anything
  return null;
}