/**
 * Rate Limiter Service
 * 
 * This service provides rate limiting for API requests to prevent abuse
 * and ensure system stability, particularly for health monitoring.
 */

interface RateLimiterOptions {
  maxRequestsPerInterval: number;
  intervalMs: number;
  // If true, return true when rate limit hit; if false, reject excess requests
  allowAllRequests?: boolean;
  // Sample only 1 in N requests (for further reduction in processing)
  samplingRate?: number;
}

interface RequestLog {
  timestamps: number[];
  requestCount: number; // Total counter for sampling
}

/**
 * Simple in-memory rate limiter for API requests
 */
export class RateLimiter {
  private requestLogs: Map<string, RequestLog> = new Map();
  private options: RateLimiterOptions;
  
  // Cleanup interval for memory management
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(options: RateLimiterOptions) {
    this.options = {
      allowAllRequests: false,
      samplingRate: 1, // Default to processing all requests (no sampling)
      ...options
    };
    
    // Set up periodic cleanup to prevent memory leaks
    this.cleanupInterval = setInterval(() => this.cleanupExpiredEntries(), 300000); // 5 minutes
  }
  
  /**
   * Check if a request should be rate limited and apply sampling
   * @param key The identifier for the rate limit bucket (e.g., IP address, endpoint)
   * @returns true if request should be allowed and processed, false if it should be limited or skipped
   */
  public shouldAllowRequest(key: string): boolean {
    const now = Date.now();
    const log = this.requestLogs.get(key) || { timestamps: [], requestCount: 0 };
    
    // Increment request counter (used for sampling)
    log.requestCount = log.requestCount + 1;
    
    // Apply sampling - only process 1 in N requests as determined by samplingRate
    const samplingRate = this.options.samplingRate || 1;
    const shouldProcess = log.requestCount % samplingRate === 0;
    
    // If we're sampling out this request, don't process it
    if (!shouldProcess) {
      this.requestLogs.set(key, log); // Save updated counter
      return false;
    }
    
    // Remove timestamps outside the current window
    log.timestamps = log.timestamps.filter(
      timestamp => timestamp > now - this.options.intervalMs
    );
    
    // If we're under the limit, allow the request
    if (log.timestamps.length < this.options.maxRequestsPerInterval) {
      log.timestamps.push(now);
      this.requestLogs.set(key, log);
      return true;
    }
    
    // If allowAllRequests is true, we'll allow but not record the timestamp
    // This essentially skips processing for excess requests
    return !!this.options.allowAllRequests;
  }
  
  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    // Remove entries that are outside twice the interval time
    for (const [key, log] of this.requestLogs.entries()) {
      const hasRecentActivity = log.timestamps.some(
        timestamp => now - timestamp < this.options.intervalMs * 2
      );
      
      if (!hasRecentActivity) {
        this.requestLogs.delete(key);
      }
    }
  }
  
  /**
   * Get the number of remaining requests allowed in the current interval
   * @param key The identifier for the rate limit bucket
   * @returns The number of remaining requests allowed
   */
  public getRemainingRequests(key: string): number {
    const now = Date.now();
    const log = this.requestLogs.get(key);
    
    if (!log) {
      return this.options.maxRequestsPerInterval;
    }
    
    // Count only requests within the current window
    const requestsInCurrentWindow = log.timestamps.filter(
      timestamp => timestamp > now - this.options.intervalMs
    ).length;
    
    return Math.max(0, this.options.maxRequestsPerInterval - requestsInCurrentWindow);
  }
  
  /**
   * Reset rate limit for a specific key
   * @param key The identifier to reset
   */
  public reset(key: string): void {
    this.requestLogs.delete(key);
  }
  
  /**
   * Reset all rate limits
   */
  public resetAll(): void {
    this.requestLogs.clear();
  }
}

// Create a shared instance for health monitoring endpoints
export const healthMetricsRateLimiter = new RateLimiter({
  maxRequestsPerInterval: 1, // Allow just 1 request per interval
  intervalMs: 10000, // 10 second interval
  allowAllRequests: true // Let all requests through but only process ones within limits
});

// Create a more lenient rate limiter for page performance metrics
export const pageMetricsRateLimiter = new RateLimiter({
  maxRequestsPerInterval: 5, // Allow 5 requests per interval
  intervalMs: 60000, // 1 minute interval
  allowAllRequests: true
});

// Create a rate limiter for system status checks
export const healthStatusRateLimiter = new RateLimiter({
  maxRequestsPerInterval: 3, // Allow 3 requests per interval
  intervalMs: 30000, // 30 second interval
  allowAllRequests: true
});