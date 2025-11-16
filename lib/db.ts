import mongoose from "mongoose";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "database" });

// Database connection configuration
const DB_CONFIG = {
  // Connection timeout in milliseconds
  connectTimeoutMS: 30000, // 30 seconds
  // Socket timeout in milliseconds
  socketTimeoutMS: 45000, // 45 seconds
  // Server selection timeout in milliseconds
  serverSelectionTimeoutMS: 30000, // 30 seconds
};

// Retry configuration (handled at application level)
const RETRY_CONFIG = {
  // Maximum number of retries
  maxRetries: 3,
  // Retry delay in milliseconds
  retryDelay: 1000,
} as const;

// Connection state tracking
let connectionAttempts = 0;
let lastConnectionAttempt = 0;
let isConnecting = false;

/**
 * Validate MongoDB URI and environment variables
 */
function validateEnvironment(): { isValid: boolean; error?: string } {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    return {
      isValid: false,
      error: "MONGO_URI environment variable is not set",
    };
  }
  
  if (mongoUri === "your_mongodb_connection_string_here") {
    return {
      isValid: false,
      error: "MONGO_URI is set to placeholder value. Please set a valid MongoDB connection string.",
    };
  }
  
  // Basic URI format validation
  try {
    new URL(mongoUri);
  } catch (error) {
    return {
      isValid: false,
      error: "MONGO_URI is not a valid URL format",
    };
  }
  
  return { isValid: true };
}

/**
 * Get connection state information
 */
export function getConnectionState(): {
  readyState: number;
  host: string;
  port: number;
  name: string;
  isConnected: boolean;
  connectionAttempts: number;
  lastConnectionAttempt: number;
} {
  const connection = mongoose.connection;
  
  return {
    readyState: connection.readyState,
    host: connection.host || "unknown",
    port: connection.port || 0,
    name: connection.name || "unknown",
    isConnected: connection.readyState === 1,
    connectionAttempts,
    lastConnectionAttempt,
  };
}

/**
 * Check if database is connected
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Wait for database connection with timeout
 */
export async function waitForConnection(timeoutMs: number = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkConnection = () => {
      if (mongoose.connection.readyState === 1) {
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime > timeoutMs) {
        resolve(false);
        return;
      }
      
      setTimeout(checkConnection, 100);
    };
    
    checkConnection();
  });
}

/**
 * Disconnect from database
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info("Database disconnected successfully");
    }
  } catch (error) {
    logger.error("Error disconnecting from database", error as Error);
    throw error;
  }
}

/**
 * Connect to MongoDB with comprehensive error handling and retry logic
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Validate environment variables
    const validation = validateEnvironment();
    if (!validation.isValid) {
      const error = new Error(`Database configuration error: ${validation.error}`);
      logger.error("Database configuration validation failed", error);
      throw error;
    }
    
    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
      logger.debug("Database already connected", {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      });
      return;
    }
    
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
      logger.warn("Database connection already in progress, waiting...");
      const connected = await waitForConnection(30000); // Wait up to 30 seconds
      if (!connected) {
        throw new Error("Database connection timeout - another connection attempt is in progress");
      }
      return;
    }
    
    isConnecting = true;
    connectionAttempts++;
    lastConnectionAttempt = Date.now();
    
    const mongoUri = process.env.MONGO_URI!;
    
    logger.info("Attempting to connect to database", {
      attempt: connectionAttempts,
      host: new URL(mongoUri).hostname,
    });
    
    // Set up connection event listeners
    setupConnectionListeners();
    
    // Attempt connection with retry logic
    await connectWithRetry(mongoUri);
    
    logger.info("Database connected successfully", {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
    });
    
  } catch (error) {
    const err = error as Error;
    logger.error("Database connection failed", err, {
      attempt: connectionAttempts,
      readyState: mongoose.connection.readyState,
    });
    
    // Reset connection state on failure
    isConnecting = false;
    
    throw new Error(`Database connection failed: ${err.message}`);
  } finally {
    isConnecting = false;
  }
};

/**
 * Connect to MongoDB with retry logic
 */
async function connectWithRetry(uri: string): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      await mongoose.connect(uri, DB_CONFIG);
      return; // Success
    } catch (error) {
      lastError = error as Error;

      logger.warn(`Database connection attempt ${attempt} failed`, {
        error: lastError.message,
        attempt,
        maxRetries: RETRY_CONFIG.maxRetries,
      });

      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = RETRY_CONFIG.retryDelay * attempt; // Exponential backoff
        logger.info(`Retrying database connection in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Database connection failed after all retry attempts");
}

/**
 * Set up MongoDB connection event listeners
 */
function setupConnectionListeners(): void {
  const connection = mongoose.connection;
  
  connection.on("connected", () => {
    logger.info("MongoDB connected", {
      host: connection.host,
      port: connection.port,
      name: connection.name,
    });
  });
  
  connection.on("error", (error) => {
    logger.error("MongoDB connection error", error, {
      readyState: connection.readyState,
      host: connection.host,
    });
  });
  
  connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected", {
      readyState: connection.readyState,
      host: connection.host,
    });
  });
  
  connection.on("reconnected", () => {
    logger.info("MongoDB reconnected", {
      host: connection.host,
      port: connection.port,
      name: connection.name,
    });
  });
  
  connection.on("close", () => {
    logger.info("MongoDB connection closed");
  });
  
  // Handle process termination
  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, closing database connection...");
    try {
      await disconnectDB();
      process.exit(0);
    } catch (error) {
      logger.error("Error closing database connection", error as Error);
      process.exit(1);
    }
  });
  
  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, closing database connection...");
    try {
      await disconnectDB();
      process.exit(0);
    } catch (error) {
      logger.error("Error closing database connection", error as Error);
      process.exit(1);
    }
  });
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<{
  status: "healthy" | "unhealthy" | "connecting";
  message: string;
  details: {
    readyState: number;
    host: string;
    port: number;
    name: string;
    connectionAttempts: number;
    lastConnectionAttempt: number;
  };
}> {
  try {
    const state = getConnectionState();
    
    if (state.isConnected) {
      return {
        status: "healthy",
        message: "Database connection is healthy",
        details: state,
      };
    }
    
    if (isConnecting) {
      return {
        status: "connecting",
        message: "Database connection is in progress",
        details: state,
      };
    }
    
    return {
      status: "unhealthy",
      message: "Database is not connected",
      details: state,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: `Database health check failed: ${(error as Error).message}`,
      details: {
        readyState: 0,
        host: "unknown",
        port: 0,
        name: "unknown",
        connectionAttempts,
        lastConnectionAttempt,
      },
    };
  }
}
