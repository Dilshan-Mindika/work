import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import User from "@/models/user";
import { Credits, PricingPlans } from "@/lib/config/pricing";
import {
  verifyWebXPayWebhook,
  isWebXPayConfigured,
} from "@/lib/webxpay";
import { createWebXPayPaymentHistory } from "@/lib/payment-utils";
import { withTransaction, withTransactionAndExternal } from "@/lib/transaction-utils";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limiter";

/**
 * Disable Next.js body parsing since we need the raw body for WebXPay webhook verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Handles incoming WebXPay webhook events
 * Processes payment success, failure, and cancellation events
 */
export const POST = withRateLimit(RATE_LIMIT_CONFIGS.WEBHOOK)(
  async (req: NextRequest) => {
    await connectDB();

    // Check if WebXPay is configured
    if (!isWebXPayConfigured()) {
      console.error("🚨 WebXPay is not configured");
      return NextResponse.json(
        { error: "WebXPay is not configured" },
        { status: 503 }
      );
    }

    try {
      // Get request body as form data or JSON
      const contentType = (await headers()).get("content-type");
      let webhookData: Record<string, string> = {};

      if (contentType?.includes("application/json")) {
        webhookData = await req.json();
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        formData.forEach((value, key) => {
          webhookData[key] = value.toString();
        });
      } else {
        // Try to parse as URL-encoded or JSON
        const text = await req.text();
        try {
          webhookData = JSON.parse(text);
        } catch {
          // Parse as URL-encoded
          const params = new URLSearchParams(text);
          params.forEach((value, key) => {
            webhookData[key] = value;
          });
        }
      }

      console.log("📋 WebXPay webhook received:", JSON.stringify(webhookData, null, 2));

      // Verify webhook signature
      const secretKey = process.env.WEBXPAY_SECRET_KEY!;
      if (!verifyWebXPayWebhook(webhookData, secretKey)) {
        console.error("🚨 WebXPay webhook verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }

      console.log("✅ WebXPay webhook signature verified successfully");

      // Extract webhook data
      const orderId = webhookData.order_id || webhookData.orderId;
      const transactionId = webhookData.transaction_id || webhookData.transactionId;
      const status = webhookData.status || webhookData.payment_status;
      const amount = parseFloat(webhookData.amount || webhookData.total_amount || "0");
      const currency = webhookData.currency || "LKR";
      const customerEmail = webhookData.customer_email || webhookData.email;
      const customerName = webhookData.customer_name || webhookData.name;

      // Extract user ID from order ID (format: WEBXPAY_userId_timestamp_random)
      const orderIdParts = orderId?.split("_");
      const userId = orderIdParts?.[1];

      if (!userId) {
        console.error("🚨 No user ID found in order ID:", orderId);
        return NextResponse.json(
          { error: "Invalid order ID format" },
          { status: 400 }
        );
      }

      // Find user
      let user = await User.findOne({ id: userId });
      if (!user) {
        console.error("🚨 User not found:", userId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Map WebXPay status to our payment status
      let paymentStatus:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "canceled"
        | "refunded" = "pending";

      if (status === "SUCCESS" || status === "success" || status === "PAID" || status === "paid") {
        paymentStatus = "succeeded";
      } else if (status === "FAILED" || status === "failed" || status === "ERROR" || status === "error") {
        paymentStatus = "failed";
      } else if (status === "CANCELLED" || status === "cancelled" || status === "CANCELED" || status === "canceled") {
        paymentStatus = "canceled";
      } else if (status === "PENDING" || status === "pending" || status === "PROCESSING" || status === "processing") {
        paymentStatus = status.toLowerCase() as "pending" | "processing";
      }

      // Check if payment already processed
      const PaymentHistory = (await import("@/models/payment-history")).default;
      const existingPayment = await PaymentHistory.findOne({
        userId: userId,
        "webhookData.order_id": orderId,
      });

      if (existingPayment && paymentStatus === "succeeded") {
        console.log("✅ Payment already processed:", orderId);
        return NextResponse.json({ received: true, message: "Payment already processed" });
      }

      // Determine if this is a credit purchase or plan purchase
      // This would depend on your business logic - you might need to store this in metadata
      const description = webhookData.description || webhookData.item_name || "";
      const isCreditPurchase = description.toLowerCase().includes("credit");

      if (paymentStatus === "succeeded") {
        if (isCreditPurchase) {
          // Handle credit purchase
          const creditAmount = parseInt(description.match(/\d+/)?.[0] || "0");
          const creditPlan = Credits.plans.find(
            (p) => p.credits === creditAmount
          );

          if (creditPlan) {
            await withTransaction(async (session) => {
              await User.updateOne(
                { id: userId },
                { $inc: { credits: creditPlan.credits } },
                { session }
              );

              await createWebXPayPaymentHistory(
                userId,
                {
                  transactionId: transactionId || orderId,
                  orderId: orderId,
                  amount: amount,
                  currency: currency,
                  planId: creditPlan.title,
                  planName: creditPlan.title,
                  planType: "credits",
                  planPrice: creditPlan.price,
                  isPremium: false,
                  creditsAllocated: creditPlan.credits,
                  billingEmail: customerEmail || user.emailAddress?.[0],
                  billingName: customerName,
                  webhookData: webhookData,
                },
                paymentStatus,
                session
              );
            });

            console.log(`✅ User credited ${creditPlan.credits} credits`);
          }
        } else {
          // Handle plan purchase
          // You might need to store plan information in the order metadata
          // For now, we'll create a generic payment history
          await withTransaction(async (session) => {
            await createWebXPayPaymentHistory(
              userId,
              {
                transactionId: transactionId || orderId,
                orderId: orderId,
                amount: amount,
                currency: currency,
                planId: description || "webxpay_payment",
                planName: description || "WebXPay Payment",
                planType: "payment",
                planPrice: amount.toString(),
                isPremium: false,
                creditsAllocated: 0,
                billingEmail: customerEmail || user.emailAddress?.[0],
                billingName: customerName,
                webhookData: webhookData,
              },
              paymentStatus,
              session
            );
          });

          console.log(`✅ Payment processed for user: ${userId}`);
        }
      } else {
        // Create payment history for failed/canceled payments
        await createWebXPayPaymentHistory(
          userId,
          {
            transactionId: transactionId || orderId,
            orderId: orderId,
            amount: amount,
            currency: currency,
            planId: description || "webxpay_payment",
            planName: description || "WebXPay Payment",
            planType: "payment",
            planPrice: amount.toString(),
            isPremium: false,
            creditsAllocated: 0,
            billingEmail: customerEmail || user.emailAddress?.[0],
            billingName: customerName,
            webhookData: webhookData,
          },
          paymentStatus
        );
      }

      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error(`🚨 Error processing WebXPay webhook: ${error.message}`);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
);

