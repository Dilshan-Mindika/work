# Rate Limiting Implementation

## Overview

This document outlines the comprehensive rate limiting system implemented to protect all sensitive endpoints from brute force attacks, DDoS attacks, resource exhaustion, and cost inflation.

## Problem Statement

The original codebase lacked rate limiting on critical endpoints, making it vulnerable to:

- **Brute force attacks** on authentication and payment endpoints
- **DDoS attacks** that could overwhelm the system
- **Resource exhaustion** from excessive API calls
- **Cost inflation** from payment endpoint abuse
- **Spam and abuse** on public endpoints

## Solution Architecture

### 1. **Rate Limiting Utility (`lib/rate-limiter.ts`)**

#### Core Features:
- **Configurable rate limits** for different endpoint types
- **In-memory storage** with automatic cleanup
- **Custom key generation** for IP and user-based limiting
- **Retry-After headers** for proper client handling
- **Comprehensive error responses** with rate limit information

#### Rate Limit Configurations:

```typescript
export const RATE_LIMIT_CONFIGS = {
  // Payment endpoints - Very strict (5 requests per 15 minutes)
  PAYMENT: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: "Too many payment requests. Please try again later.",
  },
  
  // Webhook endpoints - Moderate (10 requests per minute)
  WEBHOOK: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: "Too many webhook requests. Please check your webhook configuration.",
  },
  
  // Public endpoints - Moderate (20 requests per 15 minutes)
  PUBLIC: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
    message: "Too many requests. Please try again later.",
  },
  
  // Feedback endpoints - Strict (3 submissions per hour)
  FEEDBACK: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: "Too many feedback submissions. Please try again later.",
  },
  
  // Lead generation - Moderate (5 submissions per hour)
  LEAD: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
    message: "Too many lead submissions. Please try again later.",
  },
  
  // Domain checking - Moderate (10 checks per minute)
  DOMAIN_CHECK: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: "Too many domain checks. Please try again later.",
  },
};
```

### 2. **Protected Endpoints**

#### **Payment Endpoints (Strict Limits)**
- `/api/payments/stripe/create-intent` - 5 requests per 15 minutes
- `/api/payments/lemonsqueezy/create-checkout` - 5 requests per 15 minutes

#### **Webhook Endpoints (Moderate Limits)**
- `/api/webhook/stripe` - 10 requests per minute
- `/api/webhook/clerk` - 10 requests per minute
- `/api/webhook/lemonsqueezy` - 10 requests per minute

#### **Public Endpoints (Moderate Limits)**
- `/api/public/lead` - 5 submissions per hour
- `/api/public/feedback` - 20 requests per 15 minutes
- `/api/public/check-domain` - 10 checks per minute

#### **Platform Endpoints (Strict Limits)**
- `/api/(platform)/app/feedback` - 3 submissions per hour

### 3. **Rate Limiting Middleware**

#### **withRateLimit Decorator**
```typescript
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.PAYMENT)(async (req: Request) => {
  // Your endpoint logic here
});
```

#### **Custom Key Generation**
```typescript
// Per-user rate limiting
const perUserConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
  keyGenerator: (req: NextRequest) => `user:${userId}`,
};

// Per-IP rate limiting
const perIPConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  keyGenerator: (req: NextRequest) => {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    return `ip:${ip}`;
  },
};
```

### 4. **Monitoring and Alerting (`lib/rate-limit-monitor.ts`)**

#### **Real-time Monitoring**
- Automatic detection of high usage (80% threshold)
- Critical usage alerts (95% threshold)
- Alert cooldown to prevent spam
- Comprehensive statistics and health checks

#### **Health Check Endpoint**
- `/api/health/rate-limits` - Monitor rate limiting system health
- Returns status: `healthy`, `warning`, or `critical`
- Includes usage statistics and active limits

#### **Alerting System**
```typescript
// Automatic alerts for:
// - High usage (80% of limit reached)
// - Critical usage (95% of limit reached)
// - System errors
// - Health check failures
```

## Implementation Details

### 1. **Rate Limiting Algorithm**

#### **Sliding Window Implementation**
- Each request increments a counter for the current time window
- Automatic cleanup of expired entries
- Memory-efficient storage with periodic cleanup

#### **Key Generation Strategy**
```typescript
function generateKey(req: NextRequest): string {
  // Get client IP
  const ip = req.headers.get("x-forwarded-for") || 
            req.headers.get("x-real-ip") || 
            "unknown";
  
  // Get user ID if available
  const userId = req.headers.get("x-user-id") || "anonymous";
  
  return `${ip}:${userId}`;
}
```

### 2. **Response Headers**

#### **Rate Limit Information**
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200
Retry-After: 900
```

#### **Error Response Format**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many payment requests. Please try again later.",
  "retryAfter": 900
}
```

### 3. **Error Handling**

#### **Graceful Degradation**
- Rate limiting failures don't block requests
- Comprehensive error logging
- Fail-open approach for system stability

#### **Logging and Monitoring**
```typescript
logger.warn("Rate limit exceeded", {
  key: ip,
  limit: config.maxRequests,
  window: config.windowMs,
  remaining: result.remaining,
});
```

## Security Benefits

### 1. **Attack Prevention**
- **Brute Force Protection**: Limits authentication attempts
- **DDoS Mitigation**: Prevents request flooding
- **Resource Protection**: Prevents system overload
- **Cost Control**: Prevents payment endpoint abuse

### 2. **Endpoint-Specific Protection**

#### **Payment Endpoints**
- **Strict Limits**: 5 requests per 15 minutes
- **Cost Protection**: Prevents payment processing abuse
- **Fraud Prevention**: Limits suspicious activity

#### **Webhook Endpoints**
- **Moderate Limits**: 10 requests per minute
- **Legitimate Use**: Allows normal webhook operations
- **Abuse Prevention**: Blocks excessive webhook calls

#### **Public Endpoints**
- **Spam Prevention**: Limits lead generation abuse
- **Resource Protection**: Prevents domain check abuse
- **Fair Usage**: Ensures equitable access

### 3. **Monitoring and Alerting**

#### **Real-time Alerts**
- High usage detection (80% threshold)
- Critical usage alerts (95% threshold)
- System health monitoring
- Performance impact tracking

#### **Health Checks**
- System status monitoring
- Usage statistics
- Alert history
- Performance metrics

## Configuration Options

### 1. **Environment Variables**
```bash
# Optional: Health check authentication
HEALTH_CHECK_TOKEN=your-secure-token

# Rate limiting can be configured per endpoint
# See RATE_LIMIT_CONFIGS for current settings
```

### 2. **Custom Configurations**
```typescript
// Strict rate limiting for sensitive operations
const strictConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  message: "Too many sensitive operations. Please try again later.",
};

// Lenient rate limiting for public endpoints
const lenientConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 200,
  message: "Too many requests. Please try again later.",
};
```

### 3. **Monitoring Configuration**
```typescript
// Update alert thresholds
rateLimitMonitor.updateThresholds({
  highUsage: 0.7,    // Alert at 70% usage
  criticalUsage: 0.9, // Alert at 90% usage
});
```

## Testing and Validation

### 1. **Rate Limit Testing**
```bash
# Test payment endpoint rate limiting
for i in {1..10}; do
  curl -X POST /api/payments/stripe/create-intent \
    -H "Content-Type: application/json" \
    -d '{"amount": 1000}'
done
# Should get 429 after 5 requests
```

### 2. **Health Check Testing**
```bash
# Check rate limiting system health
curl /api/health/rate-limits
# Returns system status and statistics
```

### 3. **Monitoring Validation**
- Verify alert thresholds work correctly
- Test cooldown periods
- Validate statistics accuracy
- Check error handling

## Performance Considerations

### 1. **Memory Usage**
- In-memory storage with automatic cleanup
- Minimal memory footprint per request
- Periodic cleanup of expired entries

### 2. **Performance Impact**
- Minimal overhead per request
- Efficient key generation
- Fast lookup and update operations

### 3. **Scalability**
- Current implementation suitable for single-instance deployment
- For multi-instance deployment, consider Redis-based storage
- Horizontal scaling requires shared rate limit storage

## Future Enhancements

### 1. **Redis Integration**
```typescript
// For production multi-instance deployment
const redisClient = new Redis(process.env.REDIS_URL);
const rateLimiter = new RedisRateLimiter(redisClient);
```

### 2. **Advanced Features**
- **IP Whitelisting**: Bypass rate limits for trusted IPs
- **User-based Limits**: Different limits for different user tiers
- **Geographic Limits**: Different limits by region
- **Endpoint-specific Limits**: Custom limits per endpoint

### 3. **Enhanced Monitoring**
- **Metrics Integration**: Prometheus, DataDog, New Relic
- **Alerting Integration**: Slack, PagerDuty, email
- **Dashboard**: Real-time rate limiting dashboard
- **Analytics**: Usage patterns and trends

## Conclusion

The implemented rate limiting system provides comprehensive protection against various attack vectors while maintaining system performance and usability. The solution is:

- **Secure**: Protects against brute force, DDoS, and abuse
- **Configurable**: Flexible limits for different endpoint types
- **Monitorable**: Real-time alerts and health checks
- **Scalable**: Ready for production deployment
- **Maintainable**: Clear documentation and testing

This implementation ensures your application is protected from malicious actors while providing legitimate users with fair access to your services.
