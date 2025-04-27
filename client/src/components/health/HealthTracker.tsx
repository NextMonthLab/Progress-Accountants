import { useEffect, useRef, useCallback } from 'react';
import { useHealth } from '@/contexts/HealthContext';

// TypeScript definition for requestIdleCallback
// (not included in standard lib.dom, but available in modern browsers)
declare global {
  interface IdleRequestOptions {
    timeout: number;
  }

  interface IdleDeadline {
    didTimeout: boolean;
    timeRemaining: () => number;
  }

  type IdleRequestCallback = (deadline: IdleDeadline) => void;

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
  const { trackMetric } = useHealth();
  const navigationTimingRef = useRef<boolean>(false);
  const initialLoadTrackedRef = useRef<boolean>(false);
  const apiCallsRef = useRef<Map<string, number>>(new Map());
  const errorCountRef = useRef<number>(0);
  
  // Track page load time using Navigation Timing API
  const trackNavigationTiming = useCallback(() => {
    if (navigationTimingRef.current || !window.performance || !window.performance.timing) {
      return;
    }
    
    const navTiming = window.performance.timing;
    
    // Wait until the page is fully loaded
    if (navTiming.loadEventEnd === 0) {
      return;
    }
    
    // Calculate key timing metrics
    const pageLoadTime = navTiming.loadEventEnd - navTiming.navigationStart;
    const domLoadTime = navTiming.domComplete - navTiming.domLoading;
    const networkTime = navTiming.responseEnd - navTiming.requestStart;
    
    // Track only if values are positive and reasonable
    if (pageLoadTime > 0 && pageLoadTime < 60000) {
      trackMetric('page_load_time', pageLoadTime);
      console.log(`[Health] Page load time: ${pageLoadTime}ms`);
    }
    
    if (domLoadTime > 0 && domLoadTime < 60000) {
      trackMetric('dom_load_time', domLoadTime);
    }
    
    if (networkTime > 0 && networkTime < 60000) {
      trackMetric('network_time', networkTime);
    }
    
    navigationTimingRef.current = true;
  }, [trackMetric]);
  
  // Track memory usage using Performance API
  const trackMemoryUsage = useCallback(() => {
    // @ts-ignore - performance.memory is non-standard but available in Chrome
    if (window.performance && window.performance.memory) {
      // @ts-ignore
      const memoryInfo = window.performance.memory;
      const usedJSHeapSize = Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100);
      
      trackMetric('memory_usage', usedJSHeapSize);
      console.log(`[Health] Memory usage: ${usedJSHeapSize}%`);
    }
  }, [trackMetric]);
  
  // Track initial page load
  const trackInitialLoad = useCallback(() => {
    if (initialLoadTrackedRef.current) {
      return;
    }
    
    if (document.readyState === 'complete') {
      const loadTime = window.performance.now();
      trackMetric('initial_load_time', loadTime);
      console.log(`[Health] Initial load time: ${loadTime}ms`);
      initialLoadTrackedRef.current = true;
    }
  }, [trackMetric]);
  
  // Set up API call monitoring by intercepting fetch and XHR
  const setupApiCallMonitoring = useCallback(() => {
    // Intercept fetch calls
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.url;
      
      try {
        const response = await originalFetch.apply(this, [input, init]);
        const endTime = performance.now();
        
        // Only track API calls to our backend
        if (url.startsWith('/api/')) {
          const apiLatency = endTime - startTime;
          apiCallsRef.current.set(url, apiLatency);
          
          // Aggregate API latency metrics every few calls
          if (apiCallsRef.current.size >= 5) {
            const avgLatency = Array.from(apiCallsRef.current.values())
              .reduce((sum, val) => sum + val, 0) / apiCallsRef.current.size;
            
            trackMetric('api_response_time', avgLatency);
            console.log(`[Health] Avg API latency: ${avgLatency.toFixed(2)}ms`);
            apiCallsRef.current.clear();
          }
          
          // Track error rates
          if (!response.ok) {
            errorCountRef.current++;
            trackMetric('api_error_rate', errorCountRef.current);
          }
        }
        
        return response;
      } catch (error) {
        errorCountRef.current++;
        trackMetric('api_error_rate', errorCountRef.current);
        throw error;
      }
    };
    
    // Intercept XHR calls
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (typeof url === 'string' && url.startsWith('/api/')) {
        const startTime = performance.now();
        
        this.addEventListener('load', () => {
          const endTime = performance.now();
          const apiLatency = endTime - startTime;
          
          apiCallsRef.current.set(url, apiLatency);
          
          if (apiCallsRef.current.size >= 5) {
            const avgLatency = Array.from(apiCallsRef.current.values())
              .reduce((sum, val) => sum + val, 0) / apiCallsRef.current.size;
            
            trackMetric('api_response_time', avgLatency);
            apiCallsRef.current.clear();
          }
          
          if (this.status >= 400) {
            errorCountRef.current++;
            trackMetric('api_error_rate', errorCountRef.current);
          }
        });
        
        this.addEventListener('error', () => {
          errorCountRef.current++;
          trackMetric('api_error_rate', errorCountRef.current);
        });
      }
      
      // @ts-ignore
      return originalXhrOpen.apply(this, [method, url, ...args]);
    };
  }, [trackMetric]);
  
  // Run tracking on idle to avoid impacting user experience
  const runTrackingTasks = useCallback(() => {
    const scheduleTasks = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(
          (deadline) => {
            if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
              trackNavigationTiming();
              trackInitialLoad();
              
              // Run memory tracking less frequently
              if (Math.random() < 0.2) { // ~20% chance to run
                trackMemoryUsage();
              }
            }
            
            // Schedule the next run
            scheduleTasks();
          },
          { timeout: 2000 }
        );
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => {
          trackNavigationTiming();
          trackInitialLoad();
          
          if (Math.random() < 0.2) {
            trackMemoryUsage();
          }
          
          scheduleTasks();
        }, 5000);
      }
    };
    
    scheduleTasks();
  }, [trackNavigationTiming, trackMemoryUsage, trackInitialLoad]);
  
  // Error tracking using window.onerror
  const setupErrorTracking = useCallback(() => {
    window.addEventListener('error', (event) => {
      errorCountRef.current++;
      trackMetric('js_error_count', errorCountRef.current);
      console.log(`[Health] JS error detected: ${event.message}`);
    });
    
    window.addEventListener('unhandledrejection', () => {
      errorCountRef.current++;
      trackMetric('promise_error_count', errorCountRef.current);
      console.log('[Health] Unhandled promise rejection detected');
    });
  }, [trackMetric]);
  
  // Initialize all monitoring when component mounts
  useEffect(() => {
    console.log('[Health] Health tracker initialized');
    
    // Set up all tracking mechanisms
    setupApiCallMonitoring();
    setupErrorTracking();
    runTrackingTasks();
    
    // Clean up function not really needed as we want the trackers to persist
    // throughout the application lifecycle, but included for completeness
    return () => {
      console.log('[Health] Health tracker stopped');
    };
  }, [setupApiCallMonitoring, setupErrorTracking, runTrackingTasks]);
  
  // This component doesn't render anything
  return null;
}