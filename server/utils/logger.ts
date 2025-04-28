/**
 * Simple logger utility for server-side logging
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[SOT] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[SOT-ERROR] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[SOT-WARNING] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[SOT-DEBUG] ${message}`, ...args);
    }
  }
};