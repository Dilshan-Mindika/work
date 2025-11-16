import { NextRequest, NextResponse } from "next/server";
import { checkDatabaseHealth, getConnectionState } from "@/lib/db";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "database-health" });

/**
 * GET endpoint to check database connection health
 * @param req NextRequest object
 * @returns Response with database health status
 */
export async function GET(req: NextRequest) {
  try {
    // Check if request is from authorized source (optional security)
    const authHeader = req.headers.get("authorization");
    const expectedToken = process.env.HEALTH_CHECK_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const health = await checkDatabaseHealth();
    
    // Log health check
    logger.info("Database health check", {
      status: health.status,
      message: health.message,
      host: health.details.host,
      readyState: health.details.readyState,
    });

    return NextResponse.json(health, {
      status: health.status === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    logger.error("Database health check failed", error as Error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Database health check failed",
        error: (error as Error).message,
        details: {
          readyState: 0,
          host: "unknown",
          port: 0,
          name: "unknown",
          connectionAttempts: 0,
          lastConnectionAttempt: 0,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to get detailed database connection information
 * @param req NextRequest object
 * @returns Response with detailed database connection state
 */
export async function POST(req: NextRequest) {
  try {
    // Check if request is from authorized source (optional security)
    const authHeader = req.headers.get("authorization");
    const expectedToken = process.env.HEALTH_CHECK_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const connectionState = getConnectionState();
    const health = await checkDatabaseHealth();
    
    // Log detailed health check
    logger.info("Detailed database health check", {
      status: health.status,
      connectionState,
    });

    return NextResponse.json({
      health,
      connectionState,
      timestamp: new Date().toISOString(),
    }, {
      status: health.status === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    logger.error("Detailed database health check failed", error as Error);
    
    return NextResponse.json(
      {
        health: {
          status: "unhealthy",
          message: "Database health check failed",
          details: {
            readyState: 0,
            host: "unknown",
            port: 0,
            name: "unknown",
            connectionAttempts: 0,
            lastConnectionAttempt: 0,
          },
        },
        connectionState: {
          readyState: 0,
          host: "unknown",
          port: 0,
          name: "unknown",
          isConnected: false,
          connectionAttempts: 0,
          lastConnectionAttempt: 0,
        },
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
