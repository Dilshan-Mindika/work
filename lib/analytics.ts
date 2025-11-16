"use client";

import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      debug: process.env.NODE_ENV === "development",
    });
  }
};

// Analytics tracking functions
export const analytics = {
  // User events
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      posthog.identify(userId, properties);
    }
  },

  // Page views
  page: (pageName?: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        page_name: pageName,
        ...properties,
      });
    }
  },

  // Custom events
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      posthog.capture(eventName, properties);
    }
  },

  // Authentication events
  signUp: (properties?: Record<string, any>) => {
    analytics.track("user_signed_up", properties);
  },

  signIn: (properties?: Record<string, any>) => {
    analytics.track("user_signed_in", properties);
  },

  signOut: () => {
    analytics.track("user_signed_out");
    if (typeof window !== "undefined") {
      posthog.reset();
    }
  },

  // Payment events
  purchaseStarted: (planId: string, price: string, properties?: Record<string, any>) => {
    analytics.track("purchase_started", {
      plan_id: planId,
      price,
      ...properties,
    });
  },

  purchaseCompleted: (planId: string, price: string, properties?: Record<string, any>) => {
    analytics.track("purchase_completed", {
      plan_id: planId,
      price,
      ...properties,
    });
  },

  purchaseFailed: (planId: string, error: string, properties?: Record<string, any>) => {
    analytics.track("purchase_failed", {
      plan_id: planId,
      error,
      ...properties,
    });
  },

  // Feature usage
  featureUsed: (featureName: string, properties?: Record<string, any>) => {
    analytics.track("feature_used", {
      feature_name: featureName,
      ...properties,
    });
  },

  // Marketing events
  newsletterSubscribed: (email: string) => {
    analytics.track("newsletter_subscribed", { email });
  },

  leadGenerated: (source: string, properties?: Record<string, any>) => {
    analytics.track("lead_generated", {
      source,
      ...properties,
    });
  },
};

export default posthog;