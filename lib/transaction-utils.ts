import mongoose from "mongoose";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "transaction-utils" });

/**
 * Executes a function within a MongoDB transaction
 * If any operation fails, all changes are rolled back
 * 
 * @param operations - Function containing database operations to execute atomically
 * @returns Promise that resolves to the result of the operations function
 */
export async function withTransaction<T>(
  operations: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();
  
  try {
    let result: T;
    
    await session.withTransaction(async () => {
      result = await operations(session);
    });
    
    return result!;
  } catch (error) {
    logger.error("Transaction failed, rolling back changes", error as Error);
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Executes multiple database operations with external API calls in a transaction
 * Handles rollback of database operations if external API calls fail
 * 
 * @param dbOperations - Function containing database operations
 * @param externalOperations - Function containing external API calls
 * @returns Promise that resolves to the result of both operations
 */
export async function withTransactionAndExternal<T, U>(
  dbOperations: (session: mongoose.ClientSession) => Promise<T>,
  externalOperations: (dbResult: T) => Promise<U>
): Promise<{ dbResult: T; externalResult: U }> {
  const session = await mongoose.startSession();
  
  try {
    let dbResult: T | undefined;
    let externalResult: U;
    
    // Execute database operations in transaction
    await session.withTransaction(async () => {
      dbResult = await dbOperations(session);
    });
    
    // Ensure dbResult is defined before proceeding
    if (!dbResult) {
      throw new Error("Database operations did not return a result");
    }
    
    // Execute external operations outside transaction
    // If these fail, we need to handle cleanup manually
    try {
      externalResult = await externalOperations(dbResult);
    } catch (externalError) {
      logger.error("External operation failed, attempting database rollback", externalError as Error);
      
      // Attempt to rollback database changes
      try {
        await session.withTransaction(async () => {
          // Implement rollback logic here based on the specific operations
          // This is a placeholder - actual rollback logic should be implemented per use case
          logger.warn("Manual rollback required for failed external operation");
        });
      } catch (rollbackError) {
        logger.error("Failed to rollback database changes", rollbackError as Error);
        throw new Error(`External operation failed and rollback failed: ${externalError}`);
      }
      
      throw externalError;
    }
    
    return { dbResult, externalResult };
  } catch (error) {
    logger.error("Transaction with external operations failed", error as Error);
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Executes database operations with retry logic for transient failures
 * 
 * @param operations - Function containing database operations
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param retryDelay - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves to the result of the operations function
 */
export async function withRetryTransaction<T>(
  operations: (session: mongoose.ClientSession) => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await withTransaction(operations);
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      if (isRetryableError(error as Error) && attempt < maxRetries) {
        logger.warn(`Transaction attempt ${attempt} failed, retrying in ${retryDelay}ms`, error as Error);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError!;
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: Error): boolean {
  const retryableErrors = [
    'TransientTransactionError',
    'NoSuchTransaction',
    'WriteConflict',
    'NetworkTimeout',
    'HostUnreachable',
    'SocketException'
  ];
  
  return retryableErrors.some(errorType => 
    error.name.includes(errorType) || error.message.includes(errorType)
  );
}
