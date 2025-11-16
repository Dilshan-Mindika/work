import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/utils/logger";

const logger = createLogger({ component: "rate-limiter" });

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

// Default rate limit configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // Payment endpoints - Very strict limits
  PAYMENT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
    message: "Too many payment requests. Please try again later.",
  },
  
  // Webhook endpoints - Moderate limits (legitimate webhooks should be infrequent)
  WEBHOOK: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
    message: "Too many webhook requests. Please check your webhook configuration.",
  },
  
  // Public endpoints - Moderate limits
  PUBLIC: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20, // 20 requests per 15 minutes
    message: "Too many requests. Please try again later.",
  },
  
  // Feedback endpoints - Moderate limits
  FEEDBACK: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 feedback submissions per hour
    message: "Too many feedback submissions. Please try again later.",
  },
  
  // Lead generation - Moderate limits
  LEAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 lead submissions per hour
    message: "Too many lead submissions. Please try again later.",
  },
  
  // General API endpoints - Standard limits
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: "Too many API requests. Please try again later.",
  },
  
  // Domain checking - Moderate limits (can be expensive)
  DOMAIN_CHECK: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 domain checks per minute
    message: "Too many domain checks. Please try again later.",
  },
} as const;

// In-memory store for rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (data.resetTime < now) {
      requestCounts.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

/**
 * Generate a unique key for rate limiting based on IP and user ID
 */
function generateKey(req: NextRequest, customKeyGenerator?: (req: NextRequest) => string): string {
  if (customKeyGenerator) {
    return customKeyGenerator(req);
  }
  
  // Get client IP address
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  
  // Get user ID if available (for authenticated endpoints)
  const userId = req.headers.get("x-user-id") || "anonymous";
  
  return `${ip}:${userId}`;
}

/**
 * Check if request is within rate limit
 */
function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get or create entry for this key
  let entry = requestCounts.get(key);
  
  if (!entry || entry.resetTime < windowStart) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    requestCounts.set(key, entry);
  }
  
  // Check if limit exceeded
  const allowed = entry.count < config.maxRequests;
  
  if (allowed) {
    entry.count++;
  }
  
  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return function (req: NextRequest): NextResponse | null {
    try {
      const key = generateKey(req, config.keyGenerator);
      const result = checkRateLimit(key, config);
      
      if (!result.allowed) {
        logger.warn("Rate limit exceeded", {
          key: key.split(":")[0], // Log IP without user ID for privacy
          limit: config.maxRequests,
          window: config.windowMs,
          remaining: result.remaining,
        });
        
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: config.message || "Too many requests",
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
              "X-RateLimit-Limit": config.maxRequests.toString(),
              "X-RateLimit-Remaining": result.remaining.toString(),
              "X-RateLimit-Reset": result.resetTime.toString(),
            },
          }
        );
      }
      
      // Add rate limit headers to successful requests
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
      response.headers.set("X-RateLimit-Reset", result.resetTime.toString());
      
      return null; // Allow request to proceed
    } catch (error) {
      logger.error("Rate limiting error", error as Error);
      // Fail open - allow request if rate limiting fails
      return null;
    }
  };
}

/**
 * Rate limiting decorator for API routes
 */
export function withRateLimit(config: RateLimitConfig) {
  return function (handler: (req: NextRequest) => Promise<NextResponse>) {
    return async function (req: NextRequest): Promise<NextResponse> {
      const rateLimitResponse = rateLimit(config)(req);
      
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      
      return handler(req);
    };
  };
}

/**
 * Get rate limit status for a key (useful for monitoring)
 */
export function getRateLimitStatus(key: string, config: RateLimitConfig): {
  count: number;
  remaining: number;
  resetTime: number;
  isLimited: boolean;
} {
  const entry = requestCounts.get(key);
  const now = Date.now();
  
  if (!entry || entry.resetTime < now) {
    return {
      count: 0,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      isLimited: false,
    };
  }
  
  return {
    count: entry.count,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    isLimited: entry.count >= config.maxRequests,
  };
}

/**
 * Clear rate limit for a specific key (useful for testing or manual intervention)
 */
export function clearRateLimit(key: string): boolean {
  return requestCounts.delete(key);
}

/**
 * Get all current rate limit entries (useful for monitoring)
 */
export function getAllRateLimits(): Array<{ key: string; count: number; resetTime: number }> {
  return Array.from(requestCounts.entries()).map(([key, data]) => ({
    key,
    count: data.count,
    resetTime: data.resetTime,
  }));
}

/**
 * Custom rate limit configurations for specific use cases
 */
export const CUSTOM_RATE_LIMITS = {
  // Per-user rate limiting for authenticated endpoints
  perUser: (userId: string) => ({
    windowMs: 15 * 60 * 1000,
    maxRequests: 50,
    keyGenerator: (req: NextRequest) => `user:${userId}`,
  }),
  
  // Per-IP rate limiting for anonymous endpoints
  perIP: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 30,
    keyGenerator: (req: NextRequest) => {
      const forwarded = req.headers.get("x-forwarded-for");
      const realIp = req.headers.get("x-real-ip");
      return `ip:${forwarded?.split(",")[0] || realIp || "unknown"}`;
    },
  },
  
  // Strict rate limiting for sensitive operations
  strict: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: "Too many sensitive operations. Please try again later.",
  },
  
  // Lenient rate limiting for public endpoints
  lenient: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,
    message: "Too many requests. Please try again later.",
  },
} as const;
