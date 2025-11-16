import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { createWebXPayPayment, isWebXPayConfigured } from "@/lib/webxpay";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";
import { SiteSettings } from "@/lib/config/settings";

/**
 * Creates a WebXPay payment request
 * POST /api/payments/webxpay/create-payment
 */
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.PAYMENT)(
  async (req: Request) => {
    try {
      await connectDB();

      // Check if WebXPay is configured
      if (!isWebXPayConfigured()) {
        return NextResponse.json(
          {
            error:
              "WebXPay is not configured. Please set WEBXPAY_MERCHANT_ID and WEBXPAY_SECRET_KEY environment variables.",
          },
          { status: 503 }
        );
      }

      const { amount, currency, description, customerName, customerEmail, customerPhone } =
        await req.json();

      // Validate required fields
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "Amount is required and must be greater than 0" },
          { status: 400 }
        );
      }

      if (!description) {
        return NextResponse.json(
          { error: "Description is required" },
          { status: 400 }
        );
      }

      // Try to get user authentication (optional)
      const { userId } = await auth();
      let userEmail = customerEmail;
      let userName = customerName;

      // If authenticated, get user details
      if (userId) {
        let user = await User.findOne({ id: userId });
        if (!user) {
          try {
            const clerkUser = await (await clerkClient()).users.getUser(userId);
            user = await User.create({
              id: userId,
              emailAddress: [clerkUser.emailAddresses[0]?.emailAddress || ""],
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
            });
          } catch (error) {
            // If user creation fails, continue without user
            console.warn("Failed to create user:", error);
          }
        }

        if (user) {
          userEmail = customerEmail || user.emailAddress?.[0] || userEmail;
          userName = customerName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || userName || userEmail;
        }
      }

      // Generate unique order ID (with or without userId)
      const orderId = userId 
        ? `WEBXPAY_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        : `WEBXPAY_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Create WebXPay payment
      const paymentResponse = await createWebXPayPayment(
        orderId,
        amount,
        currency || "LKR",
        description,
        userName,
        userEmail,
        customerPhone
      );

      if (!paymentResponse.payment_url) {
        return NextResponse.json(
          { error: "Failed to create payment. Payment URL not received." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        payment_url: paymentResponse.payment_url,
        transaction_id: paymentResponse.transaction_id || orderId,
        order_id: orderId,
        status: paymentResponse.status,
      });
    } catch (error: any) {
      console.error("WebXPay payment creation error:", error);

      return NextResponse.json(
        {
          error: error.message || "Failed to create payment",
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  }
);

