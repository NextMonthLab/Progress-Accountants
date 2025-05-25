/**
 * Simple logging utility for server-side operations
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// Set the minimum log level (can be made configurable via environment variable)
const MIN_LOG_LEVEL = process.env.LOG_LEVEL ? 
  LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] : 
  LogLevel.INFO;

/**
 * Logger class with methods for different log levels
 */
class Logger {
  private source: string;
  
  constructor(source: string = 'server') {
    this.source = source;
  }
  
  /**
   * Format a log message with timestamp and source
   */
  private formatLogMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.source}] ${message}`;
  }
  
  /**
   * Log debug messages (lowest priority)
   */
  public debug(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LogLevel.DEBUG) {
      console.debug(this.formatLogMessage('DEBUG', message), ...args);
    }
  }
  
  /**
   * Log informational messages
   */
  public info(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LogLevel.INFO) {
      console.info(this.formatLogMessage('INFO', message), ...args);
    }
  }
  
  /**
   * Log warning messages
   */
  public warn(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LogLevel.WARN) {
      console.warn(this.formatLogMessage('WARN', message), ...args);
    }
  }
  
  /**
   * Log error messages (highest priority)
   */
  public error(message: string, ...args: any[]): void {
    if (MIN_LOG_LEVEL <= LogLevel.ERROR) {
      console.error(this.formatLogMessage('ERROR', message), ...args);
    }
  }
  
  /**
   * Create a child logger with a different source
   */
  public child(source: string): Logger {
    return new Logger(`${this.source}:${source}`);
  }
}

// Create default logger instance
export const logger = new Logger();

// Export SOT specific logger
export const sotLogger = logger.child('sot');