import mongoose, { Schema } from "mongoose";

// Define the Payment History schema
const PaymentHistorySchema = new Schema(
  {
    // User reference
    userId: { type: String, required: true, index: true },

    // Payment provider information
    provider: {
      type: String,
      required: true,
      enum: ["stripe", "lemonsqueezy", "webxpay"],
      index: true,
    },

    // Payment status
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "canceled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    // Payment amount and currency
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },

    // Plan/Product information
    planId: { type: String },
    planName: { type: String },
    planType: { type: String },
    planPrice: { type: String },
    isPremium: { type: Boolean, default: false },

    // Provider-specific IDs
    stripePaymentIntentId: { type: String, sparse: true },
    stripeSubscriptionId: { type: String, sparse: true },
    stripeInvoiceId: { type: String, sparse: true },
    stripeCustomerId: { type: String, sparse: true },

    lemonsqueezyOrderId: { type: String, sparse: true },
    lemonsqueezySubscriptionId: { type: String, sparse: true },
    lemonsqueezyCustomerId: { type: String, sparse: true },
    lemonsqueezyVariantId: { type: String, sparse: true },

    webxpayTransactionId: { type: String, sparse: true },
    webxpayOrderId: { type: String, sparse: true },
    webxpayCustomerId: { type: String, sparse: true },

    // Payment metadata
    paymentMethod: { type: String },
    paymentMethodType: { type: String },

    // Billing information
    billingEmail: { type: String },
    billingName: { type: String },
    billingAddress: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    // Subscription details
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    subscriptionInterval: { type: String }, // monthly, yearly, etc.
    subscriptionStatus: { type: String },

    // Credits allocation
    creditsAllocated: { type: Number, default: 0 },
    creditsBefore: { type: Number },
    creditsAfter: { type: Number },

    // Error information
    errorMessage: { type: String },
    errorCode: { type: String },

    // Provider webhook data (for debugging)
    webhookData: { type: Schema.Types.Mixed },

    // Additional metadata
    metadata: { type: Schema.Types.Mixed },

    // Timestamps
    paidAt: { type: Date },
    refundedAt: { type: Date },
    canceledAt: { type: Date },
  },
  {
    timestamps: true,
    // Create compound indexes for common queries
    indexes: [
      { userId: 1, provider: 1 },
      { userId: 1, status: 1 },
      { provider: 1, status: 1 },
      { stripePaymentIntentId: 1 },
      { lemonsqueezyOrderId: 1 },
      { webxpayTransactionId: 1 },
      { webxpayOrderId: 1 },
    ],
  }
);

// Create a compound index for efficient queries
PaymentHistorySchema.index({ userId: 1, createdAt: -1 });

const PaymentHistory =
  mongoose.models.PaymentHistory ||
  mongoose.model("PaymentHistory", PaymentHistorySchema);

export default PaymentHistory;
