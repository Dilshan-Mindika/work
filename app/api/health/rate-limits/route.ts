import { NextRequest, NextResponse } from "next/server";
import { getRateLimitHealth } from "@/lib/rate-limit-monitor";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "rate-limit-health" });

/**
 * GET endpoint to check rate limiting system health
 * @param req NextRequest object
 * @returns Response with rate limiting health status
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

    const health = getRateLimitHealth();
    
    // Log health check
    logger.info("Rate limit health check", {
      status: health.status,
      message: health.message,
      activeLimits: health.statistics.totalActiveLimits,
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
    logger.error("Rate limit health check failed", error as Error);
    
    return NextResponse.json(
      {
        status: "critical",
        message: "Rate limiting system error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
