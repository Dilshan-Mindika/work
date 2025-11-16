/**
 * Application logger utility
 * Provides structured logging with different levels and context
 */

export type LogLevel = "info" | "error" | "debug" | "warn";


export interface LogContext {
  userId?: string;
  requestId?: string;
  component?: string;
  [key: string]: any;
}

/**
 * Creates a formatted log message with timestamp and context
 */
const formatLogMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext
): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

/**
 * Main logger class with different log levels
 */
export class Logger {
  private context?: LogContext;

  constructor(context?: LogContext) {
    this.context = context;
  }

  /**
   * Log an informational message
   */
  info(message: string, additionalContext?: LogContext) {
    const fullContext = { ...this.context, ...additionalContext };
    if (process.env.NODE_ENV === "development") {
      console.log(formatLogMessage("info", message, fullContext));
    }
    // In production, you would send to a logging service like Sentry, LogRocket, etc.
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, additionalContext?: LogContext) {
    const fullContext = { 
      ...this.context, 
      ...additionalContext,
      ...(error && { error: error.message, stack: error.stack })
    };
    
    console.error(formatLogMessage("error", message, fullContext));
    // In production, you would send to error tracking service
  }

  /**
   * Log a warning message
   */
  warn(message: string, additionalContext?: LogContext) {
    const fullContext = { ...this.context, ...additionalContext };
    if (process.env.NODE_ENV === "development") {
      console.warn(formatLogMessage("warn", message, fullContext));
    }
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, additionalContext?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      const fullContext = { ...this.context, ...additionalContext };
      console.debug(formatLogMessage("debug", message, fullContext));
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: LogContext): Logger {
    return new Logger({ ...this.context, ...additionalContext });
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a logger with specific context
 */
export const createLogger = (context: LogContext): Logger => {
  return new Logger(context);
};
