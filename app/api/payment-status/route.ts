import { NextResponse } from "next/server";
import { isWebXPayConfigured } from "@/lib/webxpay";
import { stripe } from "@/lib/stripe";

/**
 * GET endpoint to check payment provider configuration status
 * Returns the configuration status for all payment providers
 */
export async function GET() {
  try {
    // Check Stripe configuration
    const stripeConfigured = !!(
      process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );

    // Check Lemon Squeezy configuration
    const lemonsqueezyConfigured = !!(
      process.env.LEMON_SQUEEZY_API_KEY &&
      process.env.LEMON_SQUEEZY_STORE_ID
    );

    // Check WebXPay configuration
    const webxpayConfigured = isWebXPayConfigured();

    return NextResponse.json({
      stripe: {
        configured: stripeConfigured,
        error: stripeConfigured
          ? undefined
          : "Missing STRIPE_SECRET_KEY or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      },
      lemonsqueezy: {
        configured: lemonsqueezyConfigured,
        error: lemonsqueezyConfigured
          ? undefined
          : "Missing LEMON_SQUEEZY_API_KEY or LEMON_SQUEEZY_STORE_ID",
      },
      webxpay: {
        configured: webxpayConfigured,
        error: webxpayConfigured
          ? undefined
          : "Missing WEBXPAY_MERCHANT_ID or WEBXPAY_SECRET_KEY",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        stripe: { configured: false, error: error.message },
        lemonsqueezy: { configured: false, error: error.message },
        webxpay: { configured: false, error: error.message },
      },
      { status: 500 }
    );
  }
}

