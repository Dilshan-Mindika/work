import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

export const POST = withRateLimit(RATE_LIMIT_CONFIGS.PAYMENT)(async (req: Request) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        {
          message:
            "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { message: "Amount is required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating payment intent:", error);
    }
    return NextResponse.json(
      { message: "Error creating payment intent" },
      { status: 500 }
    );
  }
});
