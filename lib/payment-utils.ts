import PaymentHistory from "@/models/payment-history";
import User from "@/models/user";
import { ClientSession } from "mongoose";

// Types for payment data
export interface StripePaymentData {
  paymentIntentId: string;
  subscriptionId?: string;
  invoiceId?: string;
  customerId: string;
  amount: number;
  currency: string;
  planId: string;
  planName: string;
  planType: string;
  planPrice: string;
  isPremium: boolean;
  billingEmail?: string;
  billingName?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionInterval?: string;
  subscriptionStatus?: string;
  creditsAllocated: number;
  webhookData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface LemonSqueezyPaymentData {
  orderId: string;
  subscriptionId?: string;
  customerId: string;
  variantId?: string;
  amount: number;
  currency: string;
  planId: string;
  planName: string;
  planType: string;
  planPrice: string;
  isPremium: boolean;
  billingEmail?: string;
  billingName?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionInterval?: string;
  subscriptionStatus?: string;
  creditsAllocated: number;
  webhookData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface WebXPayPaymentData {
  transactionId: string;
  orderId: string;
  customerId?: string;
  amount: number;
  currency: string;
  planId: string;
  planName: string;
  planType: string;
  planPrice: string;
  isPremium: boolean;
  billingEmail?: string;
  billingName?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionInterval?: string;
  subscriptionStatus?: string;
  creditsAllocated: number;
  webhookData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Create a payment history record for Stripe payments
 */
export async function createStripePaymentHistory(
  userId: string,
  data: StripePaymentData,
  status:
    | "pending"
    | "processing"
    | "succeeded"
    | "failed"
    | "canceled"
    | "refunded" = "pending",
  session?: ClientSession
) {
  try {
    // Get user's current credits
    const user = await User.findOne({ id: userId });
    const creditsBefore = user?.credits || 0;
    const creditsAfter = creditsBefore + data.creditsAllocated;

    const paymentHistory = new PaymentHistory({
      userId,
      provider: "stripe",
      status,
      amount: data.amount,
      currency: data.currency,
      planId: data.planId,
      planName: data.planName,
      planType: data.planType,
      planPrice: data.planPrice,
      isPremium: data.isPremium,
      stripePaymentIntentId: data.paymentIntentId,
      stripeSubscriptionId: data.subscriptionId,
      stripeInvoiceId: data.invoiceId,
      stripeCustomerId: data.customerId,
      billingEmail: data.billingEmail,
      billingName: data.billingName,
      billingAddress: data.billingAddress,
      subscriptionStartDate: data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate,
      subscriptionInterval: data.subscriptionInterval,
      subscriptionStatus: data.subscriptionStatus,
      creditsAllocated: data.creditsAllocated,
      creditsBefore,
      creditsAfter,
      webhookData: data.webhookData,
      metadata: data.metadata,
      paidAt: status === "succeeded" ? new Date() : undefined,
    });

    await paymentHistory.save({ session });
    return paymentHistory;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating Stripe payment history:", error);
    }
    throw error;
  }
}

/**
 * Create a payment history record for Lemon Squeezy payments
 */
export async function createLemonSqueezyPaymentHistory(
  userId: string,
  data: LemonSqueezyPaymentData,
  status:
    | "pending"
    | "processing"
    | "succeeded"
    | "failed"
    | "canceled"
    | "refunded" = "pending",
  session?: ClientSession
) {
  try {
    // Get user's current credits
    const user = await User.findOne({ id: userId });
    const creditsBefore = user?.credits || 0;
    const creditsAfter = creditsBefore + data.creditsAllocated;

    const paymentHistory = new PaymentHistory({
      userId,
      provider: "lemonsqueezy",
      status,
      amount: data.amount,
      currency: data.currency,
      planId: data.planId,
      planName: data.planName,
      planType: data.planType,
      planPrice: data.planPrice,
      isPremium: data.isPremium,
      lemonsqueezyOrderId: data.orderId,
      lemonsqueezySubscriptionId: data.subscriptionId,
      lemonsqueezyCustomerId: data.customerId,
      lemonsqueezyVariantId: data.variantId,
      billingEmail: data.billingEmail,
      billingName: data.billingName,
      billingAddress: data.billingAddress,
      subscriptionStartDate: data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate,
      subscriptionInterval: data.subscriptionInterval,
      subscriptionStatus: data.subscriptionStatus,
      creditsAllocated: data.creditsAllocated,
      creditsBefore,
      creditsAfter,
      webhookData: data.webhookData,
      metadata: data.metadata,
      paidAt: status === "succeeded" ? new Date() : undefined,
    });

    await paymentHistory.save({ session });
    return paymentHistory;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating Lemon Squeezy payment history:", error);
    }
    throw error;
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status:
    | "pending"
    | "processing"
    | "succeeded"
    | "failed"
    | "canceled"
    | "refunded",
  additionalData?: {
    errorMessage?: string;
    errorCode?: string;
    refundedAt?: Date;
    canceledAt?: Date;
  }
) {
  try {
    const updateData: { status: string; [key: string]: unknown } = { status };

    if (status === "succeeded") {
      updateData.paidAt = new Date();
    } else if (status === "refunded" && additionalData?.refundedAt) {
      updateData.refundedAt = additionalData.refundedAt;
    } else if (status === "canceled" && additionalData?.canceledAt) {
      updateData.canceledAt = additionalData.canceledAt;
    }

    if (additionalData?.errorMessage) {
      updateData.errorMessage = additionalData.errorMessage;
    }

    if (additionalData?.errorCode) {
      updateData.errorCode = additionalData.errorCode;
    }

    const paymentHistory = await PaymentHistory.findByIdAndUpdate(
      paymentId,
      updateData,
      { new: true }
    );

    return paymentHistory;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating payment status:", error);
    }
    throw error;
  }
}

/**
 * Get payment history for a user
 */
export async function getUserPaymentHistory(
  userId: string,
  options?: {
    limit?: number;
    skip?: number;
    provider?: "stripe" | "lemonsqueezy" | "webxpay";
    status?: string;
  }
) {
  try {
    const query: { userId: string; provider?: string; status?: string } = {
      userId,
    };

    if (options?.provider) {
      query.provider = options.provider;
    }

    if (options?.status) {
      query.status = options.status;
    }

    const payments = await PaymentHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(options?.limit || 50)
      .skip(options?.skip || 0);

    return payments;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting user payment history:", error);
    }
    throw error;
  }
}

/**
 * Create a payment history record for WebXPay payments
 */
export async function createWebXPayPaymentHistory(
  userId: string,
  data: WebXPayPaymentData,
  status:
    | "pending"
    | "processing"
    | "succeeded"
    | "failed"
    | "canceled"
    | "refunded" = "pending",
  session?: ClientSession
) {
  try {
    // Get user's current credits
    const user = await User.findOne({ id: userId });
    const creditsBefore = user?.credits || 0;
    const creditsAfter = creditsBefore + data.creditsAllocated;

    const paymentHistory = new PaymentHistory({
      userId,
      provider: "webxpay",
      status,
      amount: data.amount,
      currency: data.currency,
      planId: data.planId,
      planName: data.planName,
      planType: data.planType,
      planPrice: data.planPrice,
      isPremium: data.isPremium,
      webxpayTransactionId: data.transactionId,
      webxpayOrderId: data.orderId,
      webxpayCustomerId: data.customerId,
      billingEmail: data.billingEmail,
      billingName: data.billingName,
      billingAddress: data.billingAddress,
      subscriptionStartDate: data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate,
      subscriptionInterval: data.subscriptionInterval,
      subscriptionStatus: data.subscriptionStatus,
      creditsAllocated: data.creditsAllocated,
      creditsBefore,
      creditsAfter,
      webhookData: data.webhookData,
      metadata: data.metadata,
      paidAt: status === "succeeded" ? new Date() : undefined,
    });

    await paymentHistory.save({ session });
    return paymentHistory;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating WebXPay payment history:", error);
    }
    throw error;
  }
}

/**
 * Get payment by provider-specific ID
 */
export async function getPaymentByProviderId(
  provider: "stripe" | "lemonsqueezy" | "webxpay",
  providerId: string
) {
  try {
    const query: { provider: string; $or?: Array<Record<string, string>> } = {
      provider,
    };

    if (provider === "stripe") {
      query.$or = [
        { stripePaymentIntentId: providerId },
        { stripeSubscriptionId: providerId },
        { stripeInvoiceId: providerId },
      ];
    } else if (provider === "lemonsqueezy") {
      query.$or = [
        { lemonsqueezyOrderId: providerId },
        { lemonsqueezySubscriptionId: providerId },
      ];
    } else if (provider === "webxpay") {
      query.$or = [
        { webxpayTransactionId: providerId },
        { webxpayOrderId: providerId },
      ];
    }

    const payment = await PaymentHistory.findOne(query);
    return payment;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting payment by provider ID:", error);
    }
    throw error;
  }
}
