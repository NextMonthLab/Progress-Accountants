import { useEffect, useRef, useCallback, useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';

// Proper type definitions for requestIdleCallback and cancelIdleCallback
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface IdleRequestOptions {
  timeout?: number;
}

// Extend Window interface properly
declare global {
  interface Window {
    requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback: (handle: number) => number;
  }
}

/**
 * Metric batch collector for efficient health monitoring
 */
interface MetricBatch {
  metrics: {name: string, value: number}[];
  lastSentAt: number;
}

// Configuration for health monitoring
const HEALTH_CONFIG = {
  // Whether health monitoring is enabled at all
  isEnabled: true, 
  // Is detailed monitoring enabled (more metrics and higher frequency)
  isDetailedMonitoringEnabled: false,
  // How often to send batched metrics (ms)
  batchIntervalMs: 300000, // 5 minutes (increased from 1 minute)
  // Maximum batch size before forcing a send
  maxBatchSize: 20, // Increased to reduce frequency of sends
  // Sampling rate for API calls (1/N calls are tracked)
  apiSamplingRate: 50, // Track 1 in 50 API calls (reduced frequency)
  // Memory check interval
  memoryCheckIntervalMs: 300000, // 5 minutes (reduced frequency)
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
  // With reduced frequency and avoiding health endpoints monitoring
  const setupApiCallMonitoring = useCallback(() => {
    // Skip monitoring health endpoints to prevent recursive monitoring
    const shouldSkipUrl = (url: string) => {
      return url.includes('/api/health/') || url.includes('/api/metrics/') || url.includes('/api/health/metrics/track');
    };
    
    // Reduce reporting frequency - only report every 50 calls instead of every 5
    const reportingThreshold = 50;
    let lastReportTime = Date.now();
    
    // Intercept fetch calls
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.url;
      
      try {
        const response = await originalFetch.apply(this, [input, init]);
        const endTime = performance.now();
        
        // Only track API calls to our backend, skip health endpoints
        if (url.startsWith('/api/') && !shouldSkipUrl(url)) {
          const apiLatency = endTime - startTime;
          apiCallsRef.current.set(url, apiLatency);
          
          // Don't report too frequently and ensure we have enough data points
          const timeElapsed = Date.now() - lastReportTime;
          if (apiCallsRef.current.size >= reportingThreshold || timeElapsed > 60000) {
            const avgLatency = Array.from(apiCallsRef.current.values())
              .reduce((sum, val) => sum + val, 0) / apiCallsRef.current.size;
            
            // Only log once per minute max
            if (timeElapsed > 60000) {
              trackMetric('api_response_time', avgLatency);
              console.log(`[Health] Avg API latency: ${avgLatency.toFixed(2)}ms over ${apiCallsRef.current.size} calls`);
              lastReportTime = Date.now();
              apiCallsRef.current.clear();
            }
          }
          
          // Only track critical errors (500+)
          if (response.status >= 500) {
            errorCountRef.current++;
            // Only report after accumulating multiple errors
            if (errorCountRef.current % 5 === 0) {
              trackMetric('api_error_rate', errorCountRef.current);
            }
          }
        }
        
        return response;
      } catch (error) {
        // Only count network-level errors
        if (url.startsWith('/api/') && !shouldSkipUrl(url)) {
          errorCountRef.current++;
          if (errorCountRef.current % 5 === 0) {
            trackMetric('api_error_rate', errorCountRef.current);
          }
        }
        throw error;
      }
    };
    
    // Intercept XHR calls - with similar optimizations
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (typeof url === 'string' && url.startsWith('/api/') && !shouldSkipUrl(url)) {
        const startTime = performance.now();
        
        this.addEventListener('load', () => {
          // Only track non-health endpoints
          const endTime = performance.now();
          const apiLatency = endTime - startTime;
          
          apiCallsRef.current.set(url, apiLatency);
          
          // Use the same reporting threshold as fetch
          const timeElapsed = Date.now() - lastReportTime;
          if (apiCallsRef.current.size >= reportingThreshold || timeElapsed > 60000) {
            if (timeElapsed > 60000) {
              const avgLatency = Array.from(apiCallsRef.current.values())
                .reduce((sum, val) => sum + val, 0) / apiCallsRef.current.size;
              
              trackMetric('api_response_time', avgLatency);
              lastReportTime = Date.now();
              apiCallsRef.current.clear();
            }
          }
          
          // Only track critical errors
          if (this.status >= 500) {
            errorCountRef.current++;
            if (errorCountRef.current % 5 === 0) {
              trackMetric('api_error_rate', errorCountRef.current);
            }
          }
        });
        
        this.addEventListener('error', () => {
          errorCountRef.current++;
          if (errorCountRef.current % 5 === 0) {
            trackMetric('api_error_rate', errorCountRef.current);
          }
        });
      }
      
      // @ts-ignore
      return originalXhrOpen.apply(this, [method, url, ...args]);
    };
  }, [trackMetric]);
  
  // Run tracking on idle to avoid impacting user experience - with reduced frequency
  const runTrackingTasks = useCallback(() => {
    // Track navigation timing and initial load just once
    const runInitialTasks = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(
          (deadline) => {
            if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
              trackNavigationTiming();
              trackInitialLoad();
              // Run once after initial load
              trackMemoryUsage();
            }
          },
          { timeout: 3000 }
        );
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => {
          trackNavigationTiming();
          trackInitialLoad();
          trackMemoryUsage();
        }, 3000);
      }
    };
    
    // Run periodic memory checks at a much lower frequency (matching memoryCheckIntervalMs)
    const scheduleMemoryChecks = () => {
      setTimeout(() => {
        // Only check memory when the page is idle
        if (window.requestIdleCallback) {
          window.requestIdleCallback(
            () => {
              trackMemoryUsage();
              scheduleMemoryChecks(); // Schedule next check
            },
            { timeout: 2000 }
          );
        } else {
          trackMemoryUsage();
          scheduleMemoryChecks(); // Schedule next check
        }
      }, HEALTH_CONFIG.memoryCheckIntervalMs); // Use the config value
    };
    
    // Run the initial tracking once
    runInitialTasks();
    
    // Start the memory check schedule
    scheduleMemoryChecks();
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
  
  // Metric batching for efficient processing
  const [metricBatch, setMetricBatch] = useState<{name: string, value: number}[]>([]);
  const lastBatchSentRef = useRef<number>(Date.now());
  
  // Simplified API tracking that respects sampling rate
  const setupEfficientApiMonitoring = useCallback(() => {
    if (!HEALTH_CONFIG.isEnabled) return;
    
    // Skip monitoring health endpoints to prevent recursive monitoring
    const shouldSkipUrl = (url: string) => {
      return url.includes('/api/health/') || 
             url.includes('/api/metrics/') || 
             url.includes('/api/health/metrics/track');
    };
    
    let apiCallCount = 0;
    const samplingRate = HEALTH_CONFIG.apiSamplingRate;
    
    // Only intercept fetch for simplicity
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
      const url = typeof input === 'string' ? input : (input as Request).url;
      
      // Only track API calls to our backend, skip health endpoints
      const shouldTrack = url.startsWith('/api/') && 
                        !shouldSkipUrl(url) && 
                        ++apiCallCount % samplingRate === 0;
      
      const startTime = shouldTrack ? performance.now() : 0;
      
      try {
        const response = await originalFetch.apply(this, [input, init]);
        
        // Only track sampled requests
        if (shouldTrack) {
          const endTime = performance.now();
          const apiLatency = endTime - startTime;
          
          // Add to batch instead of sending immediately
          setMetricBatch(prev => [...prev, {name: 'api_latency', value: apiLatency}]);
          
          // Track errors
          if (response.status >= 500) {
            setMetricBatch(prev => [...prev, {name: 'api_error', value: response.status}]);
          }
        }
        
        return response;
      } catch (error) {
        if (shouldTrack) {
          setMetricBatch(prev => [...prev, {name: 'api_network_error', value: 1}]);
        }
        throw error;
      }
    };
    
    console.log('[Health] Efficient API monitoring initialized');
  }, []);
  
  // Track essential performance metrics at reasonable intervals
  const trackCorePerformance = useCallback(() => {
    if (!HEALTH_CONFIG.isEnabled) return;
    
    // One-time tracking of load performance
    const trackInitialPerformance = () => {
      // Use setTimeout to ensure this runs after page load
      setTimeout(() => {
        if (window.performance?.timing) {
          const timing = window.performance.timing;
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
          
          if (pageLoadTime > 0 && pageLoadTime < 60000) {
            setMetricBatch(prev => [...prev, {
              name: 'page_load_time', 
              value: pageLoadTime
            }]);
            console.log(`[Health] Initial page load: ${pageLoadTime}ms`);
          }
        }
        
        // Track memory usage if available
        trackMemoryUsage();
      }, 3000);
    };
    
    // Schedule periodic memory checks
    const scheduleMemoryChecks = () => {
      const memoryInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          trackMemoryUsage();
        }
      }, HEALTH_CONFIG.memoryCheckIntervalMs);
      
      // Clean up on component unmount
      return () => clearInterval(memoryInterval);
    };
    
    // Track memory usage
    const trackMemoryUsage = () => {
      // @ts-ignore - performance.memory is non-standard
      if (window.performance?.memory) {
        // @ts-ignore
        const memoryInfo = window.performance.memory;
        const usedJSHeapSize = Math.round(
          (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100
        );
        
        setMetricBatch(prev => [...prev, {
          name: 'memory_usage',
          value: usedJSHeapSize
        }]);
        
        console.log(`[Health] Memory usage: ${usedJSHeapSize}%`);
      }
    };
    
    // Initial performance tracking
    trackInitialPerformance();
    
    // Return the cleanup for memory interval
    return scheduleMemoryChecks();
  }, []);
  
  // Process metrics in batch mode
  useEffect(() => {
    if (!HEALTH_CONFIG.isEnabled || metricBatch.length === 0) return;
    
    const now = Date.now();
    const timeSinceLastBatch = now - lastBatchSentRef.current;
    const shouldSendBatch = 
      metricBatch.length >= HEALTH_CONFIG.maxBatchSize || 
      timeSinceLastBatch >= HEALTH_CONFIG.batchIntervalMs;
    
    if (shouldSendBatch) {
      console.log(`[Health] Sending batch of ${metricBatch.length} metrics`);
      
      // Process each metric in the batch
      metricBatch.forEach(metric => {
        trackMetric(metric.name, metric.value);
      });
      
      // Clear the batch
      setMetricBatch([]);
      lastBatchSentRef.current = now;
    }
  }, [metricBatch, trackMetric]);
  
  // Initialize monitoring when component mounts
  useEffect(() => {
    console.log('[Health] Health tracker initialized');
    
    if (HEALTH_CONFIG.isEnabled) {
      // Set up the essential monitoring
      setupEfficientApiMonitoring();
      const cleanup = trackCorePerformance();
      
      // Only set up error tracking if detailed monitoring is enabled
      if (HEALTH_CONFIG.isDetailedMonitoringEnabled) {
        setupErrorTracking();
      }
      
      return () => {
        if (cleanup) cleanup();
        console.log('[Health] Health tracker stopped');
      };
    } else {
      // Just track initial memory usage for diagnostic purposes
      if (window.performance && (window.performance as any).memory) {
        const memoryInfo = (window.performance as any).memory;
        const usedJSHeapSize = Math.round(
          (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100
        );
        console.log(`[Health] Memory usage: ${usedJSHeapSize}%`);
      }
    }
  }, [setupEfficientApiMonitoring, trackCorePerformance, setupErrorTracking]);
  
  // This component doesn't render anything
  return null;
}