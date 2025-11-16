"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { paymentProvider } from "@/lib/config/pricing";
import { analytics } from "@/lib/analytics";
import { createLogger } from "@/lib/utils/logger";

// Create logger for this component
const logger = createLogger({ component: "checkout-button" });

/**
 * Props for the CheckoutButton component
 */
export interface CheckoutButtonProps {
  /** The checkout mode - determines the type of payment flow */
  mode: "payment" | "subscription" | "top-up";
  /** The content to display inside the button */
  children: React.ReactNode;
  /** Optional CSS classes to apply to the button */
  className?: string;
  /** Stripe price ID for the product/plan */
  priceId: string;
  /** Lemon Squeezy variant ID (required when using Lemon Squeezy) */
  variantId?: string;
  /** Optional trial period in days (for subscriptions) */
  trial?: number;
  /** Whether the button should be disabled */
  disabled?: boolean;
  /** Button visual variant */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

/**
 * CheckoutButton Component
 * 
 * A reusable button component that handles payment checkout flows for both
 * Stripe and Lemon Squeezy payment providers. Supports one-time payments,
 * subscriptions, and credit top-ups.
 * 
 * @param props - The component props
 * @returns A button component that initiates checkout when clicked
 */
export default function CheckoutButton({
  mode,
  children,
  className,
  priceId,
  variantId,
  trial,
  disabled,
  variant,
}: CheckoutButtonProps) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the checkout process when button is clicked
   * Supports both Stripe and Lemon Squeezy payment providers
   */
  const handleCheckout = async () => {
    // Redirect to sign-in if user is not authenticated
    if (!isSignedIn) {
      redirect("/app/billing/upgrade-plan");
      return;
    }

    // Track purchase started
    analytics.purchaseStarted(priceId, "unknown", {
      mode,
      payment_provider: paymentProvider,
      variant_id: variantId,
      trial: trial,
    });

    setIsLoading(true);
    const isSubscription = mode === "subscription";

    try {
      let checkoutUrl: string;

      if (paymentProvider === "lemonsqueezy") {
        // Handle Lemon Squeezy checkout
        if (!variantId) {
          throw new Error("Lemon Squeezy variant ID is required");
        }

        const res = await fetch("/api/payments/lemonsqueezy/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variantId,
            isSubscription,
            trial,
          }),
        });

        const data = await res.json();
        if (data.url) {
          checkoutUrl = data.url;
        } else {
          throw new Error(
            data.error || "Failed to create Lemon Squeezy checkout"
          );
        }
      } else if (paymentProvider === "webxpay") {
        // Handle WebXPay checkout
        const amount = parseFloat(priceId) || 0; // For WebXPay, priceId might be the amount
        const description = `Payment for ${mode === "subscription" ? "subscription" : "credits"}`;

        const res = await fetch("/api/payments/webxpay/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: "LKR",
            description,
          }),
        });

        const data = await res.json();
        if (data.payment_url) {
          checkoutUrl = data.payment_url;
        } else {
          throw new Error(data.error || "Failed to create WebXPay payment");
        }
      } else {
        // Handle Stripe checkout (existing logic)
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, isSubscription, trial }),
        });

        const data = await res.json();
        if (data.url) {
          checkoutUrl = data.url;
        } else {
          throw new Error(data.error || "Failed to create Stripe checkout");
        }
      }

      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to initiate checkout", error instanceof Error ? error : undefined, {
        mode,
        priceId,
        variantId,
        paymentProvider
      });
      
      // Track purchase failed for analytics
      analytics.purchaseFailed(priceId, errorMessage, {
        mode,
        payment_provider: paymentProvider,
        variant_id: variantId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={cn("disabled:cursor-not-allowed", className)}
      onClick={handleCheckout}
      disabled={isLoading || disabled}
      variant={variant}
    >
      {isLoading && <Loader2 className="animate-spin mr-2" />}
      {children}
    </Button>
  );
}
