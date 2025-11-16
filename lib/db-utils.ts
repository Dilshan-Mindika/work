import { connectDB, disconnectDB, isConnected, getConnectionState, checkDatabaseHealth } from "@/lib/db";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "db-utils" });

/**
 * Database connection utilities for testing and development
 */
export class DatabaseUtils {
  /**
   * Ensure database connection with retry logic
   */
  static async ensureConnection(maxRetries: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (isConnected()) {
          logger.debug("Database already connected");
          return true;
        }

        await connectDB();
        
        if (isConnected()) {
          logger.info("Database connection established", { attempt });
          return true;
        }
      } catch (error) {
        logger.warn(`Database connection attempt ${attempt} failed`, {
          error: (error as Error).message,
          attempt,
          maxRetries,
        });

        if (attempt === maxRetries) {
          logger.error("All database connection attempts failed", error as Error);
          return false;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return false;
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<{
    success: boolean;
    message: string;
    details: any;
  }> {
    try {
      const health = await checkDatabaseHealth();
      const state = getConnectionState();

      return {
        success: health.status === "healthy",
        message: health.message,
        details: {
          health,
          state,
        },
      };
    } catch (error) {
      logger.error("Database connection test failed", error as Error);
      return {
        success: false,
        message: `Database connection test failed: ${(error as Error).message}`,
        details: { error: (error as Error).message },
      };
    }
  }

  /**
   * Gracefully close database connection
   */
  static async closeConnection(): Promise<boolean> {
    try {
      if (isConnected()) {
        await disconnectDB();
        logger.info("Database connection closed gracefully");
        return true;
      }
      return true;
    } catch (error) {
      logger.error("Error closing database connection", error as Error);
      return false;
    }
  }

  /**
   * Get database connection statistics
   */
  static getConnectionStats(): {
    isConnected: boolean;
    readyState: number;
    host: string;
    port: number;
    name: string;
    connectionAttempts: number;
    lastConnectionAttempt: number;
    uptime: number;
  } {
    const state = getConnectionState();
    const startTime = process.uptime();

    return {
      ...state,
      uptime: Math.round(startTime),
    };
  }

  /**
   * Wait for database to be ready
   */
  static async waitForDatabase(timeoutMs: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (isConnected()) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return false;
  }

  /**
   * Perform database health check with detailed information
   */
  static async performHealthCheck(): Promise<{
    status: "healthy" | "unhealthy" | "connecting";
    message: string;
    recommendations: string[];
    details: any;
  }> {
    try {
      const health = await checkDatabaseHealth();
      const state = getConnectionState();
      const recommendations: string[] = [];

      // Analyze health and provide recommendations
      if (health.status === "unhealthy") {
        if (state.connectionAttempts > 3) {
          recommendations.push("Multiple connection attempts detected. Check network connectivity and MongoDB server status.");
        }
        
        if (state.lastConnectionAttempt > 0) {
          const timeSinceLastAttempt = Date.now() - state.lastConnectionAttempt;
          if (timeSinceLastAttempt > 300000) { // 5 minutes
            recommendations.push("Last connection attempt was over 5 minutes ago. Consider restarting the application.");
          }
        }
        
        recommendations.push("Verify MONGO_URI environment variable is correctly set.");
        recommendations.push("Check if MongoDB server is running and accessible.");
      }

      if (health.status === "connecting") {
        recommendations.push("Database connection is in progress. Wait for completion before making requests.");
      }

      if (health.status === "healthy") {
        recommendations.push("Database connection is healthy. No action required.");
      }

      return {
        status: health.status,
        message: health.message,
        recommendations,
        details: {
          health,
          state,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      logger.error("Health check failed", error as Error);
      return {
        status: "unhealthy",
        message: `Health check failed: ${(error as Error).message}`,
        recommendations: [
          "Check application logs for detailed error information.",
          "Verify database configuration and connectivity.",
          "Consider restarting the application.",
        ],
        details: {
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}

/**
 * Database connection middleware for API routes
 */
export function withDatabaseConnection(handler: (req: any) => Promise<any>) {
  return async function (req: any) {
    try {
      // Ensure database connection before handling request
      const connected = await DatabaseUtils.ensureConnection();
      
      if (!connected) {
        logger.error("Database connection failed for API request");
        return new Response(
          JSON.stringify({
            error: "Database connection failed",
            message: "Unable to connect to database. Please try again later.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return handler(req);
    } catch (error) {
      logger.error("Database connection middleware error", error as Error);
      return new Response(
        JSON.stringify({
          error: "Database connection error",
          message: "Internal server error. Please try again later.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}

/**
 * Database connection status checker
 */
export async function checkDatabaseStatus(): Promise<{
  isHealthy: boolean;
  isConnected: boolean;
  status: string;
  message: string;
  details: any;
}> {
  try {
    const health = await checkDatabaseHealth();
    const isConnected = health.status === "healthy";
    
    return {
      isHealthy: health.status === "healthy",
      isConnected,
      status: health.status,
      message: health.message,
      details: health.details,
    };
  } catch (error) {
    logger.error("Database status check failed", error as Error);
    return {
      isHealthy: false,
      isConnected: false,
      status: "error",
      message: `Database status check failed: ${(error as Error).message}`,
      details: { error: (error as Error).message },
    };
  }
}
