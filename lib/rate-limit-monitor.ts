import { createLogger } from "@/lib/utils/logger";
import { getAllRateLimits, getRateLimitStatus } from "@/lib/rate-limiter";

const logger = createLogger({ component: "rate-limit-monitor" });

/**
 * Rate limiting monitoring and alerting system
 */
export class RateLimitMonitor {
  private static instance: RateLimitMonitor;
  private alertThresholds = {
    highUsage: 0.8, // Alert when 80% of limit is reached
    criticalUsage: 0.95, // Alert when 95% of limit is reached
  };
  
  private alertCooldowns = new Map<string, number>();
  private readonly ALERT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Start monitoring interval
    this.startMonitoring();
  }

  public static getInstance(): RateLimitMonitor {
    if (!RateLimitMonitor.instance) {
      RateLimitMonitor.instance = new RateLimitMonitor();
    }
    return RateLimitMonitor.instance;
  }

  /**
   * Start monitoring rate limits
   */
  private startMonitoring(): void {
    // Check rate limits every minute
    setInterval(() => {
      this.checkRateLimits();
    }, 60 * 1000);

    logger.info("Rate limit monitoring started");
  }

  /**
   * Check all current rate limits and send alerts if needed
   */
  private checkRateLimits(): void {
    try {
      const allLimits = getAllRateLimits();
      
      for (const limit of allLimits) {
        this.checkIndividualLimit(limit);
      }
    } catch (error) {
      logger.error("Error checking rate limits", error as Error);
    }
  }

  /**
   * Check individual rate limit and send alerts
   */
  private checkIndividualLimit(limit: { key: string; count: number; resetTime: number }): void {
    const now = Date.now();
    const timeRemaining = limit.resetTime - now;
    
    if (timeRemaining <= 0) {
      return; // Limit has expired
    }

    // Calculate usage percentage (approximate)
    const windowMs = timeRemaining;
    const maxRequests = this.estimateMaxRequests(limit.key);
    const usagePercentage = limit.count / maxRequests;

    // Check if we should send an alert
    if (usagePercentage >= this.alertThresholds.criticalUsage) {
      this.sendCriticalAlert(limit, usagePercentage);
    } else if (usagePercentage >= this.alertThresholds.highUsage) {
      this.sendHighUsageAlert(limit, usagePercentage);
    }
  }

  /**
   * Estimate max requests based on key pattern
   */
  private estimateMaxRequests(key: string): number {
    // This is a simplified estimation - in production, you'd want to store
    // the actual limits with each key or have a more sophisticated system
    
    if (key.includes("payment") || key.includes("stripe") || key.includes("lemonsqueezy")) {
      return 5; // Payment endpoints
    } else if (key.includes("webhook")) {
      return 10; // Webhook endpoints
    } else if (key.includes("feedback")) {
      return 3; // Feedback endpoints
    } else if (key.includes("lead")) {
      return 5; // Lead endpoints
    } else if (key.includes("domain")) {
      return 10; // Domain check endpoints
    } else {
      return 100; // General API endpoints
    }
  }

  /**
   * Send critical usage alert
   */
  private sendCriticalAlert(limit: { key: string; count: number; resetTime: number }, usagePercentage: number): void {
    const alertKey = `critical:${limit.key}`;
    
    if (this.isAlertInCooldown(alertKey)) {
      return;
    }

    logger.error("CRITICAL: Rate limit near exhaustion", new Error("Rate limit near exhaustion"), {
      key: limit.key,
      count: limit.count,
      usagePercentage: Math.round(usagePercentage * 100),
      resetTime: new Date(limit.resetTime).toISOString(),
    });

    // In production, you would send alerts to your monitoring system
    // Examples: Slack, PagerDuty, email, etc.
    this.sendAlert({
      level: "CRITICAL",
      message: `Rate limit critical usage: ${limit.key}`,
      details: {
        key: limit.key,
        count: limit.count,
        usagePercentage: Math.round(usagePercentage * 100),
        resetTime: new Date(limit.resetTime).toISOString(),
      },
    });

    this.setAlertCooldown(alertKey);
  }

  /**
   * Send high usage alert
   */
  private sendHighUsageAlert(limit: { key: string; count: number; resetTime: number }, usagePercentage: number): void {
    const alertKey = `high:${limit.key}`;
    
    if (this.isAlertInCooldown(alertKey)) {
      return;
    }

    logger.warn("High rate limit usage detected", {
      key: limit.key,
      count: limit.count,
      usagePercentage: Math.round(usagePercentage * 100),
      resetTime: new Date(limit.resetTime).toISOString(),
    });

    this.sendAlert({
      level: "WARNING",
      message: `High rate limit usage: ${limit.key}`,
      details: {
        key: limit.key,
        count: limit.count,
        usagePercentage: Math.round(usagePercentage * 100),
        resetTime: new Date(limit.resetTime).toISOString(),
      },
    });

    this.setAlertCooldown(alertKey);
  }

  /**
   * Send alert to monitoring system
   */
  private sendAlert(alert: {
    level: string;
    message: string;
    details: Record<string, any>;
  }): void {
    // In production, implement actual alerting
    // Examples:
    // - Send to Slack webhook
    // - Send to PagerDuty
    // - Send email notification
    // - Send to monitoring service (DataDog, New Relic, etc.)
    
    console.log(`[${alert.level}] ${alert.message}`, alert.details);
  }

  /**
   * Check if alert is in cooldown period
   */
  private isAlertInCooldown(alertKey: string): boolean {
    const lastAlert = this.alertCooldowns.get(alertKey);
    if (!lastAlert) {
      return false;
    }
    
    return Date.now() - lastAlert < this.ALERT_COOLDOWN_MS;
  }

  /**
   * Set alert cooldown
   */
  private setAlertCooldown(alertKey: string): void {
    this.alertCooldowns.set(alertKey, Date.now());
  }

  /**
   * Get rate limit statistics
   */
  public getStatistics(): {
    totalActiveLimits: number;
    limits: Array<{
      key: string;
      count: number;
      resetTime: string;
      usagePercentage: number;
    }>;
  } {
    const allLimits = getAllRateLimits();
    
    const limits = allLimits.map(limit => {
      const maxRequests = this.estimateMaxRequests(limit.key);
      const usagePercentage = limit.count / maxRequests;
      
      return {
        key: limit.key,
        count: limit.count,
        resetTime: new Date(limit.resetTime).toISOString(),
        usagePercentage: Math.round(usagePercentage * 100),
      };
    });

    return {
      totalActiveLimits: limits.length,
      limits,
    };
  }

  /**
   * Get rate limit status for a specific key
   */
  public getKeyStatus(key: string, config: any): {
    count: number;
    remaining: number;
    resetTime: number;
    isLimited: boolean;
    usagePercentage: number;
  } {
    const status = getRateLimitStatus(key, config);
    const usagePercentage = (status.count / config.maxRequests) * 100;
    
    return {
      ...status,
      usagePercentage: Math.round(usagePercentage),
    };
  }

  /**
   * Clear all rate limits (useful for testing or emergency situations)
   */
  public clearAllLimits(): void {
    // This would need to be implemented in the rate-limiter module
    logger.warn("All rate limits cleared - this should only be done in emergencies");
  }

  /**
   * Update alert thresholds
   */
  public updateThresholds(thresholds: {
    highUsage?: number;
    criticalUsage?: number;
  }): void {
    if (thresholds.highUsage !== undefined) {
      this.alertThresholds.highUsage = thresholds.highUsage;
    }
    if (thresholds.criticalUsage !== undefined) {
      this.alertThresholds.criticalUsage = thresholds.criticalUsage;
    }
    
    logger.info("Rate limit alert thresholds updated", this.alertThresholds);
  }
}

// Export singleton instance
export const rateLimitMonitor = RateLimitMonitor.getInstance();

/**
 * Health check for rate limiting system
 */
export function getRateLimitHealth(): {
  status: "healthy" | "warning" | "critical";
  message: string;
  statistics: any;
} {
  try {
    const stats = rateLimitMonitor.getStatistics();
    
    // Check for critical usage
    const criticalLimits = stats.limits.filter(limit => limit.usagePercentage >= 95);
    const highUsageLimits = stats.limits.filter(limit => 
      limit.usagePercentage >= 80 && limit.usagePercentage < 95
    );
    
    if (criticalLimits.length > 0) {
      return {
        status: "critical",
        message: `${criticalLimits.length} rate limit(s) at critical usage`,
        statistics: stats,
      };
    }
    
    if (highUsageLimits.length > 0) {
      return {
        status: "warning",
        message: `${highUsageLimits.length} rate limit(s) at high usage`,
        statistics: stats,
      };
    }
    
    return {
      status: "healthy",
      message: "All rate limits are within normal usage",
      statistics: stats,
    };
  } catch (error) {
    return {
      status: "critical",
      message: "Rate limiting system error",
      statistics: { error: (error as Error).message },
    };
  }
}
